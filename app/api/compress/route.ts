import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const quality = parseFloat(formData.get("quality") as string) || 0.8;
        const maxWidth = parseInt(formData.get("maxWidth") as string) || 1920;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const qualityInt = Math.round(quality * 100);

        const format = formData.get("format") as string || "jpeg";

        let pipeline = sharp(buffer);
        const metadata = await pipeline.metadata();

        // Resize if needed
        if (metadata.width && metadata.width > maxWidth) {
            pipeline = pipeline.resize({ width: maxWidth });
        }

        let compressedBuffer: Buffer;
        let contentType: string;

        switch (format) {
            case "png":
                compressedBuffer = await pipeline.png({ quality: qualityInt }).toBuffer();
                contentType = "image/png";
                break;
            case "webp":
                compressedBuffer = await pipeline.webp({ quality: qualityInt }).toBuffer();
                contentType = "image/webp";
                break;
            case "jpeg":
            default:
                compressedBuffer = await pipeline.jpeg({ quality: qualityInt }).toBuffer();
                contentType = "image/jpeg";
                break;
        }

        return new NextResponse(new Blob([new Uint8Array(compressedBuffer)]), {
            headers: {
                "Content-Type": contentType,
                "Content-Length": compressedBuffer.length.toString(),
            },
        });

    } catch (error) {
        console.error("Compression API Error:", error);
        return NextResponse.json({ error: "Compression failed" }, { status: 500 });
    }
}

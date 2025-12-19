import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const image = sharp(buffer);
        const metadata = await image.metadata();

        if (!metadata.width || !metadata.height) {
            return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
        }

        // upscale x2
        const targetWidth = metadata.width * 2;
        // Limit max width to prevent server overload (e.g., 4000px -> 8000px is huge)
        const MAX_WIDTH = 4096;

        if (targetWidth > MAX_WIDTH) {
            return NextResponse.json({ error: "Image too large to upscale further." }, { status: 400 });
        }

        const upscaledBuffer = await image
            .resize({
                width: targetWidth,
                kernel: sharp.kernel.lanczos3 // High quality resampling
            })
            .png() // precise output
            .toBuffer();

        // Convert to Blob for NextResponse compatibility using Uint8Array
        return new NextResponse(new Blob([new Uint8Array(upscaledBuffer)]), {
            headers: {
                "Content-Type": "image/png",
                "Content-Length": upscaledBuffer.length.toString(),
            },
        });

    } catch (error) {
        console.error("Upscale API Error:", error);
        return NextResponse.json({ error: "Upscaling failed" }, { status: 500 });
    }
}

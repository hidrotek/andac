
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';
import { randomBytes } from 'crypto';
import { format } from 'date-fns';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const subfolder = data.get('subfolder') as string || 'general';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize and create a unique filename
    const originalName = file.name;
    const fileExtension = extname(originalName);
    const baseName = basename(originalName, fileExtension).toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    const timestamp = format(new Date(), 'yyyyMMddHHmmss');
    const randomString = randomBytes(4).toString('hex');
    const uniqueFilename = `${timestamp}-${randomString}-${baseName.substring(0, 50)}${fileExtension}`;

    // Define the upload path
    const uploadDir = join(process.cwd(), 'public', 'uploads', subfolder);
    const path = join(uploadDir, uniqueFilename);
    // Create a relative path for the URL, ensuring forward slashes
    const relativePath = join('/uploads', subfolder, uniqueFilename).replace(/\\/g, '/');

    // Ensure the upload directory exists
    await mkdir(uploadDir, { recursive: true });

    // Write the file to the server's filesystem
    await writeFile(path, buffer);

    return NextResponse.json({ success: true, path: relativePath });
  } catch (error) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred on the server.';
    return NextResponse.json({ success: false, error: `Upload failed: ${message}` }, { status: 500 });
  }
}

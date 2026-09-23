import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');
  const folder = formData.get('folder') || 'uploads';

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());

  // Build a unique key, preserving the original extension if there is one
  const ext = file.name?.includes('.') ? file.name.split('.').pop() : '';
  const key = `${folder}/${randomUUID()}${ext ? `.${ext}` : ''}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type || 'application/octet-stream',
    })
  );

  // R2_PUBLIC_URL is your public bucket domain (custom domain or the
  // r2.dev dev subdomain), with no trailing slash, e.g.
  // https://assets.example.com  or  https://pub-xxxx.r2.dev
  const url = `${process.env.R2_PUBLIC_URL}/${key}`;

  return NextResponse.json({
    url,
    publicId: key,
  });
}
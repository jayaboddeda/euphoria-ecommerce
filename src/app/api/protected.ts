import { NextResponse } from 'next/server';
import { authorize } from '../../utils/auth';
import dbConnect from '../../utils/dbConnect';

export async function GET(req: Request) {
  const authResult = authorize(req);
  if (!authResult.success) {
    return authResult.response!;
  }

  await dbConnect();
  return NextResponse.json({ success: true, message: 'This is a protected route!' });
}

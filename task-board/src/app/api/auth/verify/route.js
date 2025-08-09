import { verifyToken } from '@/utils/jwt';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const token = req.cookies.get('token')?.value;
  const user = token && verifyToken(token);

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return NextResponse.json({ message: 'Authorized', user });
}

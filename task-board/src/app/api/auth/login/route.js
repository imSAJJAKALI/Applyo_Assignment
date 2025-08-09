import { db } from '@/lib/db';
import { signToken } from '@/utils/jwt';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email, password } = await req.json();

  const user = db.users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = signToken({ id: user.id, email });
  const res = NextResponse.json({ token });
  res.cookies.set('token', token, { httpOnly: true });

  return res;
}

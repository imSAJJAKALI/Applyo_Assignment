import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { email, password } = await req.json();

  const userExists = db.users.find(u => u.email === email);
  if (userExists) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now().toString(), email, password: hashed };
  db.users.push(newUser);

  return NextResponse.json({ message: 'User created successfully' });
}

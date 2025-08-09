import { db } from '@/lib/db';
import { verifyToken } from '@/utils/jwt';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const token = req.cookies.get('token')?.value;
  const user = verifyToken(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userBoards = db.boards.filter(b => b.userId === user.id);
  return NextResponse.json(userBoards);
}
 
export async function POST(req) {
  const token = req.cookies.get('token')?.value;
 
  const user = verifyToken(token);

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name } = await req.json();
  const newBoard = { id: Date.now().toString(), userId: user.id, name };
  db.boards.push(newBoard);
  return NextResponse.json(newBoard);
}
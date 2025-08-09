import { db } from '@/lib/db';
import { verifyToken } from '@/utils/jwt';
import { NextResponse } from 'next/server';

export async function PATCH(req, { params }) {
  const token = req.cookies.get('token')?.value;
  const user = verifyToken(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const boardId = params.boardId;
  const { name } = await req.json();

  const boardIndex = db.boards.findIndex(b => b.id === boardId && b.userId === user.id);
  if (boardIndex === -1) {
    return NextResponse.json({ error: 'Board not found' }, { status: 404 });
  }

  db.boards[boardIndex].name = name || db.boards[boardIndex].name;

  return NextResponse.json(db.boards[boardIndex]);
}

export async function DELETE(req, { params }) {
  const token = req.cookies.get('token')?.value;
  const user = verifyToken(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const boardId = params.boardId;
  const boardIndex = db.boards.findIndex(b => b.id === boardId && b.userId === user.id);
  if (boardIndex === -1) {
    return NextResponse.json({ error: 'Board not found' }, { status: 404 });
  }

  db.boards.splice(boardIndex, 1);

  return NextResponse.json({ message: 'Board deleted successfully' });
}

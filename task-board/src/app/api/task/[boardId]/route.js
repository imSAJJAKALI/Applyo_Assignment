import { db } from '@/lib/db';
import { verifyToken } from '@/utils/jwt';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const token = req.cookies.get('token')?.value;
  const user = verifyToken(token);
  console.log(params)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const tasks = db.tasks.filter(t => t.boardId === params.boardId && t.userId === user.id);
  return NextResponse.json(tasks);
}

export async function POST(req, { params }) {
  const token = req.cookies.get('token')?.value;
  const user = verifyToken(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, description, dueDate } = await req.json();
  const newTask = {
    id: Date.now().toString(),
    boardId: params.boardId,
    userId: user.id,
    title,
    description,
    dueDate,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  db.tasks.push(newTask);
  return NextResponse.json(newTask);
}
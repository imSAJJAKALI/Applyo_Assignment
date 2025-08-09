import { db } from "@/lib/db";
import { verifyToken } from "@/utils/jwt";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const token = req.cookies.get('token')?.value;
  const user = verifyToken(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

 const {boardId,taskId} = await params;
 
  const taskIndex = db.tasks.findIndex(
    (t) => t.id === taskId && t.boardId === boardId && t.userId === user.id
  );
  if (taskIndex === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  db.tasks.splice(taskIndex, 1);
  return NextResponse.json({ message: 'Task deleted' });
}

export async function PUT(req, { params }) {
  const token = req.cookies.get('token')?.value;
  const user = verifyToken(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { boardId, taskId } = params;
  const { title, description, dueDate, status } = await req.json();

  const taskIndex = db.tasks.findIndex(
    (t) => t.id === taskId && t.boardId === boardId && t.userId === user.id
  );

  if (taskIndex === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  const updatedTask = {
    ...db.tasks[taskIndex],
    title: title ?? db.tasks[taskIndex].title,
    description: description ?? db.tasks[taskIndex].description,
    dueDate: dueDate ?? db.tasks[taskIndex].dueDate,
    status: status ?? db.tasks[taskIndex].status,
  };

  db.tasks[taskIndex] = updatedTask;

  return NextResponse.json(updatedTask);
}
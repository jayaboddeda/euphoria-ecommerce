import { NextResponse } from 'next/server';
import dbConnect from '../../../../utils/dbConnect';
import User from '../../../../models/User';

export async function POST(req: Request) {
  await dbConnect();
  const { name, email, password } = await req.json();
console.log(name, email, password);
  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
  }

  // Create a new user
  const user = await User.create({ name, email, password });
  return NextResponse.json({ success: true, data: user });
}

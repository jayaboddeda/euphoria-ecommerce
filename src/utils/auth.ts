import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

type AuthResult = {
  success: boolean;
  decoded?: string | JwtPayload;
  response?: NextResponse;
};

export const authorize = (req: Request, requiredRole?: string): AuthResult => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      success: false,
      response: NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 }),
    };
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    if (requiredRole && decoded.role !== requiredRole) {
      return {
        success: false,
        response: NextResponse.json({ success: false, message: 'Insufficient permissions' }, { status: 403 }),
      };
    }

    return { success: true, decoded };
  } catch (err) {
    return {
      success: false,
      response: NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 }),
    };
  }
};
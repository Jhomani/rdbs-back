import { Response, Request, NextFunction } from 'express';
import { session, } from "@src/storage";
import { UserService } from '@src/services';

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = <string>req.headers.authorization?.split(" ")[1];
  const us = new UserService();

  try {
    const userId = us.verifyToken(token);
    session.setUserId(userId)

    next();
  } catch { }
}

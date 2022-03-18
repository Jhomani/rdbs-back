import { Request, Response, NextFunction } from "express";

interface HttpHandler {
  request: Request;
  response: Response;
  setSession: Function;
}

export const http: HttpHandler = {
  request: <Request>{},
  response: <Response>{},

  setSession: function (req: Request, res: Response, next: NextFunction) {
    http.request = req;
    http.response = res;

    next();
  }
};


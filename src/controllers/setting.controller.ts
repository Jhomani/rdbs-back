import GlobalQuerys from '../queries/global.query';
import { Request, Response } from "express";
import { RegionPrice } from '@src/models';
import { http } from '@src/storage';

const settings = new GlobalQuerys(RegionPrice);

export const singleGet = async (req: Request, res: Response) => {
  try {
    return http.response.json({ message: "Out of service" });
  } catch { }
}

export const countMethod = async (req: Request, res: Response) => {
  try {
    return http.response.json({ message: "Out of service" });
  } catch { }
}

export const getMethod = async (req: Request, res: Response) => {
  try {
    return http.response.json({ message: "Out of service" });
  } catch { }
}

export const postMethod = async (req: Request, res: Response) => {
  try {
    return http.response.json({ message: "Out of service" });
  } catch { }
}

export const patchMethod = async (req: Request, res: Response) => {
  try {
    return http.response.json({ message: "Out of service" });
  } catch { }
}

export const deleteMethod = async (req: Request, res: Response) => {
  try {
    return http.response.json({ message: "Out of service" });
  } catch { }
}
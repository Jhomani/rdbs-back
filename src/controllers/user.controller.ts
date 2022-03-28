import bcrypt from 'bcryptjs';

import GlobalQuerys from '../queries/global.query';
import {validateBody} from '@src/utils';
import {http, session} from '@src/storage';
import {User} from '@src/models';
import {UserService} from '@src/services';

const users = new GlobalQuerys(User);

export const getMeUser = async () => {
  try {
    const currentId = session.getUserId();

    const {password, ...others} = await users.findById(currentId);

    return http.response.json(others);
  } catch {}
};

export const loginMethod = async () => {
  const us = new UserService();

  try {
    const {password, email} = await validateBody(User, {
      exclude: ['avatar', 'name'],
    });

    const found = await users.findOne({email});

    if (!found)
      throw http.response.status(401).json({
        message: 'Incorret credentials',
      });

    const match = bcrypt.compareSync(password, found.password);

    if (match) {
      const claim = us.getSessionClaim(found);
      const token = us.generateToken(claim);

      return http.response.json({token});
    } else
      throw http.response.status(401).json({
        message: 'Incorret credentials',
      });
  } catch (err) {}
};

export const registerMethod = async () => {
  try {
    const {password, email, ...others} = await validateBody(User);

    const found = await users.findOne({email});

    if (found)
      throw http.response.status(403).json({
        message: 'The use already exist!',
      });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const datas = await users.createItem({
      ...others,
      email,
      password: hash,
    });

    return http.response.json(datas);
  } catch {}
};

export const patchMethod = async () => {
  try {
    return http.response.json({message: 'Out of service'});
  } catch {}
};

export const resetPassowrd = async () => {
  try {
    return http.response.json({message: 'Out of service'});
  } catch {}
};

export const verifyResetCode = async () => {
  try {
    return http.response.json({message: 'Out of service'});
  } catch {}
};

export const newPassowrd = async () => {
  try {
    return http.response.json({message: 'Out of service'});
  } catch {}
};

export const changePassowrd = async () => {
  try {
    return http.response.json({message: 'Out of service'});
  } catch {}
};

export const deleteMethod = async () => {
  try {
    return http.response.json({message: 'Out of service'});
  } catch {}
};

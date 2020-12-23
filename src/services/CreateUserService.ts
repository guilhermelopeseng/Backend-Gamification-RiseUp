import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/Users';
import AppError from '../errors/AppError';

interface Request {
  name: string;
  email: string;
  password: string;
  adm: boolean;
  directorship: string;
}

class CreateUserService {
  public async execute({
    name,
    email,
    password,
    adm,
    directorship,
  }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExist = await usersRepository.findOne({ where: { email } });

    if (checkUserExist) {
      throw new AppError('Email adress already userd');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
      directorship,
      adm,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;

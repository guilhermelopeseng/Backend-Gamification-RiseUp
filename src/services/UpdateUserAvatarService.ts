import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../models/Users';
import uploadConfig from '../config/upload';

import AppError from '../errors/AppError';

interface Request {
  id: string;
  imageFilename: string;
}
class UpdateUserAvatarService {
  public async execute({ id, imageFilename }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new AppError('This user does not exist');
    }

    if (user.image) {
      const userImageFilePath = path.join(uploadConfig.directory, user.image);

      const userImageFileExists = await fs.promises.stat(userImageFilePath);

      if (userImageFileExists) {
        await fs.promises.unlink(userImageFilePath);
      }
    }
    user.image = imageFilename;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;

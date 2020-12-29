import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';
import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

interface Request {
  name: string;
  email: string;
  password?: string;
  adm: boolean;
  directorship: string;
}

usersRouter.post('/', async (request, response) => {
  const { name, email, password, directorship, adm } = request.body;

  const createUser = new CreateUserService();

  const userPass = await createUser.execute({
    name,
    email,
    password,
    adm,
    directorship,
  });

  const user: Request = userPass;

  delete user.password;

  response.json(user);
});

usersRouter.patch(
  '/avatar/:id',
  upload.single('avatar'),
  ensureAuthenticated,
  async (request, response) => {
    const { id } = request.params;
    const updateUserAvatar = new UpdateUserAvatarService();

    const user = await updateUserAvatar.execute({
      id,
      imageFilename: request.file.filename,
    });

    return response.json(user);
  }
);

export default usersRouter;

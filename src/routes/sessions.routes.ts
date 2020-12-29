import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';

interface Request {
  email: string;
  password?: string;
}

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authenticateUser = new AuthenticateUserService();

  const { user, token } = await authenticateUser.execute({ email, password });

  const userNotPassword: Request = user;

  delete userNotPassword.password;

  return response.json({ user: userNotPassword, token });
});

export default sessionsRouter;

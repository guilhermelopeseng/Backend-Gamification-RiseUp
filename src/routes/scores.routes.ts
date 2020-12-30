import { Router } from 'express';
import { getRepository } from 'typeorm';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import Scores from '../models/Scores';
import CreateScoreService from '../services/CreateScoreService';

const scoresRouter = Router();

scoresRouter.use(ensureAuthenticated);

scoresRouter.get('/', async (request, response) => {
  const { id } = request.user;
  const scoresRepository = getRepository(Scores);

  const scores = await scoresRepository.find({ where: { user_id: id } });

  return response.json(scores);
});

scoresRouter.post('/', async (request, response) => {
  const { id } = request.user;
  const { points, score_date, title } = request.body;

  const scoreCreate = new CreateScoreService();

  const score = await scoreCreate.execute({
    id,
    points,
    score_date,
    title,
  });

  return response.json(score);
});

export default scoresRouter;

import { getRepository } from 'typeorm';
import { uuid } from 'uuidv4';

import User from '../models/Users';
import Scores from '../models/Scores';
import AppError from '../errors/AppError';

interface Request {
  id: string;
  points: number;
  score_date: string;
  title: string;
}

class CreateScoreService {
  public async execute({
    id,
    points,
    score_date,
    title,
  }: Request): Promise<Scores> {
    const usersRepository = getRepository(User);
    const scoresRepository = getRepository(Scores);

    const user = await usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new AppError('This user does not exist');
    }

    const score = scoresRepository.create({
      id: uuid(),
      user_id: id,
      points,
      score_date,
      title,
    });

    await scoresRepository.save(score);

    return score;
  }
}

export default CreateScoreService;

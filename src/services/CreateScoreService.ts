import { getRepository } from 'typeorm';
import { uuid } from 'uuidv4';

import User from '../models/Users';
import Scores from '../models/Scores';
import AppError from '../errors/AppError';

interface Request {
  id: string;
  points: number;
  score_date: Date;
}
class CreateScoreService {
  public async execute({ id, points, score_date }: Request): Promise<Scores> {
    const usersRepository = getRepository(User);
    const scoresRepository = getRepository(Scores);

    const user = usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new AppError('This user does not exist');
    }

    const checkScoreUser = await scoresRepository.findOne({
      where: { user_id: id },
    });

    if (checkScoreUser) {
      await scoresRepository.update(
        { user_id: id },
        { points: checkScoreUser.points + points }
      );

      const score = await scoresRepository.findOne({ where: { user_id: id } });

      if (!score) {
        throw new AppError('This updated does not sucess');
      }
      return score;
    }

    const score = scoresRepository.create({
      user_id: id,
      points,
      score_date,
      id: uuid(),
    });

    await scoresRepository.save(score);

    return score;
  }
}

export default CreateScoreService;

import { getRepository } from 'typeorm';
import { uuid } from 'uuidv4';

import User from '../models/Users';
import Scores from '../models/Scores';
import AppError from '../errors/AppError';

interface Request {
  id: string;
  points: number;
  score_date: string;
}
class CreateScoreService {
  public async execute({ id, points, score_date }: Request): Promise<Scores> {
    const usersRepository = getRepository(User);
    const scoresRepository = getRepository(Scores);

    const user = await usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new AppError('This user does not exist');
    }

    const checkScoreUser = await scoresRepository.find({
      where: { user_id: id },
    });

    if (checkScoreUser[0]) {
      const scoreMap = checkScoreUser.map<Promise<Scores | undefined>>(
        async data => {
          const yearOfScore = data.score_date.getFullYear();
          const mouthOfScore = data.score_date.getMonth();

          const yearResponse = new Date(Date.parse(score_date)).getFullYear();
          const mouthResponse = new Date(Date.parse(score_date)).getMonth();

          const scorePoints = data.points;

          if (yearOfScore === yearResponse && mouthOfScore === mouthResponse) {
            await scoresRepository.update(
              { user_id: id, score_date: data.score_date },
              { points: scorePoints + points, score_date }
            );
            const score = await scoresRepository.findOne({
              where: { user_id: id, score_date: data.score_date },
            });
            return score;
          }
          return undefined;
        }
      );

      const checkScoreMap = await Promise.all(scoreMap);

      const check = checkScoreMap.find(data => {
        return data !== undefined;
      });

      if (!check) {
        const score = scoresRepository.create({
          user_id: id,
          points,
          score_date,
          id: uuid(),
        });

        await scoresRepository.save(score);
        return score;
      }
      return check;
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

import { Request, Response } from 'express';
import { AwardRepository } from '../../infra/database/repositories/AwardRepository';
import { GetAwardIntervalsUseCase } from '../../domain/usecases/GetAwardIntervalsUseCase';
import { GetAllAwardsUseCase } from '../../domain/usecases/GetAllAwardsUseCase';
import { GetAwardByIdUseCase } from '../../domain/usecases/GetAwardByIdUseCase';
import { InsertAwardUseCase } from '../../domain/usecases/InsertAwardUseCase';
import { UpdateAwardUseCase } from '../../domain/usecases/UpdateAwardUseCase';
import { DeleteAwardUseCase } from '../../domain/usecases/DeleteAwardUseCase';

export class AwardController {
  static async getIntervals(req: Request, res: Response) {
    const repository = new AwardRepository();
    const usecase = new GetAwardIntervalsUseCase(repository);
    const result = await usecase.execute();
    res.json(result);
  }
  static async getAll(req: Request, res: Response) {
    const repository = new AwardRepository();
    const year = req.query.year ? Number(req.query.year) : undefined;
    const winner = req.query.winner !== undefined ? req.query.winner === 'true' : undefined;
    const studio = req.query.studio?.toString();
  
    const usecase = new GetAllAwardsUseCase(repository);
    const result = await usecase.execute({ year, winner, studio });
    res.json(result);
  }

  static async getAwardById(req: Request, res: Response) {
    const repository = new AwardRepository();
    const id = Number(req.params.id);
    const usecase = new GetAwardByIdUseCase(repository);
    const award = await usecase.execute(id);
    if (!award) {
      return res.status(404).json({ error: 'Award not found' });
    }
    res.json(award);
  }

  static async insertAward(req: Request, res: Response) {
    const repository = new AwardRepository();
    const award = req.body;
    if (!award || !award.year || !award.title || !award.studios || !award.producers) {
      return res.status(400).json({ error: 'Invalid award data' });
    }
    const usecase = new InsertAwardUseCase(repository);
    const result = await usecase.execute(award);
    res.status(201).json(result);
  }

  static async updateAward(req: Request, res: Response) {
    const repository = new AwardRepository();
    const id = Number(req.params.id);
    const awardData = req.body;
    if (!awardData ) {
      return res.status(400).json({ error: 'Invalid award data' });
    }
    const usecase = new UpdateAwardUseCase(repository);
    try {
      const result = await usecase.execute(id, awardData);
      res.status(200).json(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(404).json({ error: errorMessage });
    }
  }

  static async deleteAward(req: Request, res: Response) {
    const repository = new AwardRepository();
    const id = Number(req.params.id);
    const usecase = new DeleteAwardUseCase(repository);
    try {
      await usecase.execute(id);
      res.status(204).send();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(404).json({ error: errorMessage });
    }
  }
}

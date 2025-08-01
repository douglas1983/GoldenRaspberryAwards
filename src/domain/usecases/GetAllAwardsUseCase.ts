import { AwardRepository } from '../../infra/database/repositories/AwardRepository';
import { Award } from '../entities/Award';

interface params {
  year?: number;
  winner?: boolean;
  studio?: string;
}

export class GetAllAwardsUseCase {
  constructor(private repository: AwardRepository) {}

  async execute(params: params): Promise<Award[]>{
    const { year, winner, studio } = params;
    return await this.repository.findAllFiltered({ year, winner, studio });

  }
}

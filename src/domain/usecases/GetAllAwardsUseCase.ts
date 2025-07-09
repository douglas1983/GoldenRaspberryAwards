import { AwardRepository } from '../../infra/database/repositories/AwardRepository';
import { Award } from '../entities/Award';

interface params {
  year?: number;
  winner?: boolean;
  studio?: string;
}

export class GetAllAwardsUseCase {
  constructor(private repository: AwardRepository) {}

  execute(params: params): Award[]{
    const { year, winner, studio } = params;
    return this.repository.findAllFiltered({ year, winner, studio });

  }
}

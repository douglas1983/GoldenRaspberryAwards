import { AwardRepository } from '../../infra/database/repositories/AwardRepository';
import { Award } from '../entities/Award';

interface params {
  year?: number;
  winner?: boolean;
  studio?: string;
}

export class GetAwardByIdUseCase {
  constructor(private repository: AwardRepository) {}

  execute(id: number): Award | undefined {
    return this.repository.findById(id);
  }
}

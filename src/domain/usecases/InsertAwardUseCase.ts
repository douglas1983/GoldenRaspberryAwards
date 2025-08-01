import { AwardRepository } from '../../infra/database/repositories/AwardRepository';
import { Award } from '../entities/Award';


export class InsertAwardUseCase {
  constructor(private repository: AwardRepository) {}

  async execute(award: Award): Promise<Award> {
    return await this.repository.insert(award);
  }
}

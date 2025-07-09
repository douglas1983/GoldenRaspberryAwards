import { AwardRepository } from '../../infra/database/repositories/AwardRepository';
import { Award } from '../entities/Award';


export class InsertAwardUseCase {
  constructor(private repository: AwardRepository) {}

  execute(award: Award): Award {
    return this.repository.insert(award);
  }
}

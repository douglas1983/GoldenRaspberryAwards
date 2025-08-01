import { AwardRepository } from '../../infra/database/repositories/AwardRepository';
import { Award } from '../entities/Award';


export class UpdateAwardUseCase {
  constructor(private repository: AwardRepository) {}

  async execute(id: number, award: Partial<Award>): Promise<Award> {
    if (!id || !award) {
      throw new Error('Invalid parameters: id and award are required');
    }
    const existingAward = await this.repository.findById(id);
    if (!existingAward) {
      throw new Error(`Award with id ${id} not found`);
    }
    const updatedAward: Award = { ...existingAward, ...award };
    return this.repository.update(id, updatedAward);
  }
}

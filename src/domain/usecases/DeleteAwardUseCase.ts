import { AwardRepository } from '../../infra/database/repositories/AwardRepository';
import { Award } from '../entities/Award';


export class DeleteAwardUseCase {
  constructor(private repository: AwardRepository) {}

  execute(id: number): void {
    if (!id) {
      throw new Error('Invalid parameters: id is required');
    }
    const existingAward = this.repository.findById(id);
    if (!existingAward) {
      throw new Error(`Award with id ${id} not found`);
    }
   try {
     this.repository.delete(id);
   } catch (error) {
     const errorMessage = error instanceof Error ? error.message : String(error);
     throw new Error(`Failed to delete award: ${errorMessage}`);
   }
 }
}

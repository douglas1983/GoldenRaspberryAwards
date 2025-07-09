import { getDb } from '../sqliteConnection';
import { Award } from '../../../domain/entities/Award';

export class AwardRepository {
  findWinners(): Award[] {
    const db = getDb();
    return db.prepare('SELECT * FROM awards WHERE winner = 1').all() as Award[];
  }
  findAllFiltered(params: { year?: number; winner?: boolean; studio?: string }): Award[] {
    const db = getDb();
    let query = 'SELECT * FROM awards WHERE 1=1';
    const values: any[] = [];
  
    if (params.year) {
      query += ' AND year = ?';
      values.push(params.year);
    }
  
    if (params.winner !== undefined) {
      query += ' AND winner = ?';
      values.push(params.winner ? 1 : 0);
    }
  
    if (params.studio) {
      query += ' AND studios LIKE ?';
      values.push(`%${params.studio}%`);
    }
  
    const results = db.prepare(query).all(...values) as Award[];
    return results
      .map((result) => this.convertWinnerToBool(result))

  }
  findById(id: number): Award | undefined {
    const db = getDb();
    const result = db.prepare('SELECT * FROM awards WHERE id = ?').get(id) as Award | undefined;
    if (result) {
      return this.convertWinnerToBool(result);
    }
    return result;
  }

  insert(award: Award): Award {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO awards (year, title, studios, producers, winner)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      award.year,
      award.title,
      award.studios,
      award.producers,
      award.winner ? 1 : 0
    );
    
    // Recupera o ID inserido
    const id = Number(result.lastInsertRowid);
    
    // Agora busca o Award completo
    const insertedAward = this.findById(id);
    if (!insertedAward) {
      throw new Error('Failed to insert award');
    }
    return insertedAward;
  }

  update(id: number, award: Award): Award  {
    const db = getDb();
    db.prepare(
      'UPDATE awards SET year = ?, title = ?, studios = ?, producers = ?, winner = ? WHERE id = ?'
    ).run(award.year, award.title, award.studios, award.producers, award.winner ? 1 : 0, id);
            
    const updatedAward = this.findById(id);
    if (!updatedAward) {
      throw new Error('Failed to update award');
    }
    return updatedAward;
    
  } 

  delete(id: number): void {
    const db = getDb();
    db.prepare('DELETE FROM awards WHERE id = ?').run(id);
  } 

  private convertWinnerToBool(result: Award): Award {
    return {
      id: result.id,
      year: result.year,
      title: result.title,
      studios: result.studios,
      producers: result.producers,
      winner: typeof result.winner === 'number' ? result.winner === 1 : !!result.winner,
    };
  }
}
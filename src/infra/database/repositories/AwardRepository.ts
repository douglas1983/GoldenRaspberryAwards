
import { setupDatabase, getDb } from '../sqliteConnection';
import { Award } from '../../../domain/entities/Award';


export class AwardRepository {
  constructor() {
    setupDatabase().catch((error) => {
      console.error('Error setting up database:', error);
    });
  }
  async findWinners(): Promise<Award[]> {
    
    const db = getDb();
    const winners = await db.all('SELECT * FROM awards WHERE winner = 1');

    return winners;
  }
  async findAllFiltered(params: { year?: number; winner?: boolean; studio?: string }): Promise<Award[]> {
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

    const results = await db.all(query, values) as unknown as Award[];
    const convertWinnerToBool= results
      .map((result) => this.convertWinnerToBool(result))

    return convertWinnerToBool;

  }
  async findById(id: number): Promise<Award | undefined> {
    const db = getDb();
    const result = await db.get('SELECT * FROM awards WHERE id = ?', id) as unknown as Award | undefined;
    if (result) {
      return this.convertWinnerToBool(result);
    }
    return result;
  }
  async insert(award: Award): Promise<Award> {
    const db = getDb();

    const result = await db.run(
      `INSERT INTO awards (year, title, studios, producers, winner)
      VALUES (?, ?, ?, ?, ?)`,
      [
        award.year,
        award.title,
        award.studios,
        award.producers,
        award.winner ? 1 : 0
      ]
    );

    if (!result.lastID) {
      throw new Error('Failed to insert award');
    }

    const id =  result.lastID;
    
    // Agora busca o Award completo
    const insertedAward = await this.findById(id);
    if (!insertedAward) {
      throw new Error('Failed to insert award');
    }
    return insertedAward;
  }

  async update(id: number, award: Award): Promise<Award>  {
    const db = getDb();
    db.run(
      'UPDATE awards SET year = ?, title = ?, studios = ?, producers = ?, winner = ? WHERE id = ?',
      [award.year, award.title, award.studios, award.producers, award.winner ? 1 : 0, id]
    );

    const updatedAward = await this.findById(id);
    if (!updatedAward) {
      throw new Error('Failed to update award');
    }
    return updatedAward;
    
  } 

  delete(id: number): void {
    const db = getDb();
    db.run('DELETE FROM awards WHERE id = ?', id);
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
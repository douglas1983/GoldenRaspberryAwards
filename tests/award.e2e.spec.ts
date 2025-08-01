import request from 'supertest';
import app from '../src/app';

let createdAwardId: number;

describe('GET /awards/intervals', () => {
  it('should return min and max award intervals', async () => {
    const res = await request(app).get('/awards/intervals');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('min');
    expect(res.body).toHaveProperty('max');
    expect(Array.isArray(res.body.min)).toBe(true);
    expect(Array.isArray(res.body.max)).toBe(true);
  });
});

describe('GET /awards', () => {
  it('should return filtered awards by year, winner and studio', async () => {
    const year = 1985;
    const winner = true;
    const studio = 'Columbia';

    const res = await request(app)
      .get('/awards')
      .query({ year, winner, studio });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    expect(res.body.every((award: any) => award.year === year)).toBe(true);
    expect(res.body.every((award: any) => Boolean(award.winner) === winner)).toBe(true);
    expect(
      res.body.every((award: any) =>
        award.studios.toLowerCase().includes(studio.toLowerCase())
      )
    ).toBe(true);
  });

  it('should return all awards if no filter is passed', async () => {
    const res = await request(app).get('/awards');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('POST /awards', () => {
  it('should create a new award', async () => {
    const newAward = {
      year: 2024,
      title: 'Worst Film Ever',
      studios: 'Test Studios',
      producers: 'John Doe',
      winner: true,
    };

    const res = await request(app).post('/awards').send(newAward);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(newAward.title);
    createdAwardId = res.body.id;
  });
});

describe('GET /awards/:id', () => {
  it('should return a single award by ID', async () => {
    const res = await request(app).get(`/awards/${createdAwardId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', createdAwardId);
  });
});

describe('PUT /awards/:id', () => {
  it('should update an existing award', async () => {
    const updatedData = {
      year: 2024,
      title: 'Updated Title',
      studios: 'Updated Studio',
      producers: 'Jane Doe',
      winner: false,
    };

    const res = await request(app)
      .put(`/awards/${createdAwardId}`)
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(updatedData.title);
    expect(res.body.winner).toBe(false); 
  });
});

describe('DELETE /awards/:id', () => {
  it('should delete an award by ID', async () => {
    const res = await request(app).delete(`/awards/${createdAwardId}`);
    expect(res.status).toBe(204); 
  });

  it('should return 404 when trying to fetch deleted award', async () => {
    const res = await request(app).get(`/awards/${createdAwardId}`);
    expect(res.status).toBe(404);
  });
});

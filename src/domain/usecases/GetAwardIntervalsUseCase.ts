import { AwardRepository } from '../../infra/database/repositories/AwardRepository';

interface Interval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export class GetAwardIntervalsUseCase {
  constructor(private repository: AwardRepository) {}

  execute(): { min: Interval[]; max: Interval[] } {
    const winners = this.repository.findWinners();
    const producerWins: Record<string, number[]> = {};

    winners.forEach((award) => {
      const producers = award.producers
      .split(/\s*(?:,|and)\s*/i)
      .map((p) => p.trim())
      .filter(Boolean);

      producers.forEach((producer) => {
        if (!producerWins[producer]) producerWins[producer] = [];
        producerWins[producer].push(award.year);
      });
    });


    const intervals: Interval[] = [];

    Object.entries(producerWins).forEach(([producer, years]) => {
      years.sort((a, b) => a - b);
      for (let i = 1; i < years.length; i++) {
        intervals.push({
          producer,
          interval: years[i] - years[i - 1],
          previousWin: years[i - 1],
          followingWin: years[i]
        });
      }
    });

    const sorted = [...intervals].sort((a, b) => a.interval - b.interval);
    const minInterval = sorted[0]?.interval;
    const maxInterval = sorted.at(-1)?.interval;

    return {
      min: intervals.filter(i => i.interval === minInterval),
      max: intervals.filter(i => i.interval === maxInterval),
    };
  }
}

import TennisPlayer from '../../../domain/TennisPlayer.ts';
import { CsvReadTennisPlayer } from './types.ts';
import Gender from '../../../domain/Gender.enum.ts';

export const restoreTennisPlayer = (d: CsvReadTennisPlayer): TennisPlayer =>
  new TennisPlayer({
    name: d.name,
    rank: parseInt(d.rank),
    gender: d.gender === 'men' ? Gender.MALE : Gender.FEMALE,
    country: d.country,
    earningsUsd2019: parseInt(d.earnings_USD_2019),
  });

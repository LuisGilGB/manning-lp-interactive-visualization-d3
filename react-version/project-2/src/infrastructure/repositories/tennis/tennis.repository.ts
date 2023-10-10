import * as d3 from 'd3';
import { restoreTennisPlayer } from './models.ts';
import TennisPlayer from '../../../domain/TennisPlayer.ts';
import { CsvReadTennisPlayer } from './types.ts';

const tennisRepository = {
  getTennisPlayers: async (): Promise<TennisPlayer[]> => {
    const data: CsvReadTennisPlayer[] = await d3.csv(
      'data/tennis-players-2019.csv',
    );
    return data.map(restoreTennisPlayer);
  },
};

export default tennisRepository;

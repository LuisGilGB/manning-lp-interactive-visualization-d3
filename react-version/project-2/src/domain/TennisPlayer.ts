import Gender from './Gender.enum.ts';

interface TennisPlayerParams {
  name: string;
  rank: number;
  gender: Gender;
  country: string;
  earningsUsd2019: number;
}

class TennisPlayer {
  name: string;
  rank: number;
  gender: Gender;
  country: string;
  earningsUsd2019: number;

  constructor(params: TennisPlayerParams) {
    this.name = params.name;
    this.rank = params.rank;
    this.gender = params.gender;
    this.country = params.country;
    this.earningsUsd2019 = params.earningsUsd2019;
  }
}

export default TennisPlayer;

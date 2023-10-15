interface PropType {
  playerName: string;
  playerId: number;
  teamId: number;
  teamNickname: string;
  teamAbbr: string;
  statType: string;
  statTypeId: number;
  position: string;
  marketSuspended: number;
  line: number;
}

interface MarketType extends PropType {
  suspended: boolean;
  low: number;
  high: number;
  uniqueKey: string;
}

interface AltType {
  playerName: string;
  playerId: number;
  statType: string;
  statTypeId: number;
  line: number;
  underOdds: number;
  overOdds: number;
  pushOdds: number;
}

interface FilterType {
  label: string;
  options: string[];
}

interface CachedFilterType {
  [key: string]: string[];
}

export type { PropType, MarketType, AltType, FilterType, CachedFilterType };

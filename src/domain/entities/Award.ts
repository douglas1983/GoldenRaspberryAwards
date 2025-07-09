export interface Award {
  id?: number;
  year: number;
  title: string;
  studios: string;
  producers: string;
  winner: boolean | number;
}

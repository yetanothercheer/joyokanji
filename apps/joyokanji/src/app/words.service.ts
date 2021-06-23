import { Injectable } from '@angular/core';
import { nanoid } from 'nanoid';

const DATA = Array(1000)
  .fill(0)
  .map((_, index) => ({
    index,
    id: nanoid(),
  }));

export type WordState = {
  ef: number;
  repetition: number;
  interval: number;
};

@Injectable({
  providedIn: 'root',
})
export class WordsService {
  constructor() {}

  getDataSlice(start: number, length: number) {
    return DATA.slice(start, start + length);
  }

  initialWordState(): WordState {
    return {
      ef: 2.5,
      repetition: 0,
      interval: 0,
    };
  }

  updateWordState(quality: number, state: WordState): WordState {
    let { ef, repetition, interval } = state;
    if (quality < 3) {
      repetition = 0;
      interval = 1;
    } else {
      ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      ef = Math.max(ef, 1.3);
      if (repetition == 0) {
        interval = 1;
      } else if (repetition == 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * ef);
      }
      repetition++;
    }
    return { ef, repetition, interval };
  }
}

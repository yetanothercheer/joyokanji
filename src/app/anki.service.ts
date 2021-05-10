import { Injectable } from '@angular/core';
import { readAnkiFile } from 'src/anki/anki';

@Injectable({
  providedIn: 'root'
})
export class AnkiService {
  constructor() { }

  data: any

  async readFile(file: ArrayBuffer) {
    this.data = await readAnkiFile(file)
  }

  hasData() {
    return this.data != null
  }

  learning = []

  add(count: number) {
    this.learning = this.data.splice(0, count)
    this.learning.forEach((e: any) => {
      e.interval = 0
      e.ef = 2.5
      e.repetitions = 0
    })
  }

  selected: any
  round: any = []

  select() {
    if (this.round.length == 0) {
      this.round = this.learning.filter((e: any) => e.repetitions == 0 || e.interval == 0)
    }
    this.selected = this.round.shift()
    return this.selected
  }

  response(quality: number) {
    if (quality < 3) {
      this.selected.repetitions = 0
      this.selected.interval = 1
    } else {
      if (this.selected.repetitions == 0) {
        this.selected.interval = 1
      } else if (this.selected.repetitions == 1) {
        this.selected.interval = 6
      } else {
        this.selected.interval = this.selected.interval * this.selected.ef
      }
      this.selected.ef = this.selected.ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
      if (this.selected.ef < 1.3) {
        this.selected.ef = 1.3
      }
      this.selected.repetitions++
    }
  }

}

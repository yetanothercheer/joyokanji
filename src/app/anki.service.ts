import { Injectable } from '@angular/core';
import { readAnkiFile } from 'src/anki/anki';

@Injectable({
  providedIn: 'root'
})
export class AnkiService {

  days: string[] = []

  constructor() {
    this.load()
  }

  initialzedBefore() {
    return this.days.find(d => d == new Date().toDateString()) != null
  }


  init() {
    if (!this.initialzedBefore()) {
      this.days.push(new Date().toDateString())
      if (this.data) {
        this.add(20)
      }
    }
    this.save()
  }

  data: any

  async readFile(file: ArrayBuffer) {
    this.data = await readAnkiFile(file)
  }

  save() {
    localStorage.setItem("DATA", JSON.stringify(this.data))
    localStorage.setItem("LEARNING", JSON.stringify(this.learning))
    localStorage.setItem("DAYS", JSON.stringify(this.days))
  }

  load() {
    let data = localStorage.getItem("DATA")
    let learning = localStorage.getItem("LEARNING")
    let days = localStorage.getItem("DAYS")
    if (data) {
      this.data = JSON.parse(data)
    }
    if (learning) {
      this.learning = JSON.parse(learning)
    }
    if (days) {
      this.days = JSON.parse(days)
    }
  }

  hasData() {
    return this.data != null
  }

  learning: any[] = []

  hasMore() {
    return this.data.length > 0
  }

  add(count: number) {
    let newLearning = this.data.splice(0, count)
    newLearning.forEach((e: any) => {
      e.interval = 0
      e.ef = 2.5
      e.repetitions = 0

      let imi = e.imi as string;
      let i = 0;
      while (i < imi.length) {
        let char = imi.charCodeAt(i)
        if (char >= 0x2460 && char <= 0x2469 && i != 0) {
          imi = imi.slice(0, i) + "<br/>" + imi.slice(i, imi.length)
          i += "<br/>".length
        }
        i++
      }
      e.imi = imi
    })
    this.learning = [...newLearning, ...this.learning]
    this.save()
  }

  selected: any
  round: any = []

  getRemainsCount() {
    let newcomers = this.learning.filter((e: any) => e.repetitions == 0)

    // Review time comes
    let current = (new Date()).getTime()
    let reviews = this.learning.filter((e: any) => {
      if (e.lastTime) {
        let diff = current - e.lastTime
        let daysPast = diff / (1000 * 60 * 60 * 24)
        return daysPast >= e.interval
      }
      return false
    })

    return newcomers.length + reviews.length
  }

  getPassedCount(): number {
    let todayPassed = localStorage.getItem(new Date().toDateString())
    return todayPassed ? parseInt(todayPassed) : 0
  }

  setPassedCount(count: number) {
    localStorage.setItem(new Date().toDateString(), count.toString())
  }

  incrementPassedCount() {
    let count = this.getPassedCount();
    this.setPassedCount(count + 1)
  }

  select() {
    if (this.round.length == 0) {
      let newcomers = this.learning.filter((e: any) => e.repetitions == 0)
      if (newcomers.length != 0) {
        // First time cards
        this.round = newcomers;
      } else {
        // Review time comes
        let current = (new Date(new Date().toDateString())).getTime()
        let reviews = this.learning.filter((e: any) => {
          if (e.lastTime) {
            let diff = current - e.lastTime
            let daysPast = diff / (1000 * 60 * 60 * 24)
            return daysPast >= e.interval
          }
          return false
        })
        this.round = reviews
      }
    }
    this.selected = this.round.shift()
    return this.selected
  }

  response(quality: number) {
    this.incrementPassedCount()
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
    this.selected.lastTime = (new Date(new Date().toDateString())).getTime()
    this.save()
  }

}

import { Component, OnInit } from '@angular/core';
import { AnkiService } from '../anki.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(private anki: AnkiService) {
    // only show today's words at first
    this.update({
      a: false,
      b: true,
      c: false,
      order: 0
    })
  }

  options = {
    a: true,
    b: true,
    c: true,
    order: 0
  }

  data: any = []

  async update(options = {}) {
    this.options = { ...this.options, ...options }
    this.data = []
    if (this.options.b) {
      this.data = [...this.data, ...this.anki.learning.filter(i => i.ef > 1.3)]
      let current = (new Date(new Date().toDateString())).getTime()
      this.data.forEach((e: any) => {
        if (e.lastTime && e.repetitions > 0) {
          let diff = current - e.lastTime
          let daysPast = diff / (1000 * 60 * 60 * 24)
          let afterDays = e.interval - daysPast
          if (afterDays > 0) {
            e.real_interval = Math.ceil(afterDays)
          } else {
            e.real_interval = 0
          }
        } else {
          e.real_interval = 0
        }
      })
      this.data = this.data.sort((a: any, b: any) => a.real_interval - b.real_interval)
    }
    if (this.options.a) {
      this.data = [...this.data, ...this.anki.learning.filter(i => i.ef == 1.3)]
    }
    if (this.options.c) {
      this.data = [...this.data, ...this.anki.data]
    }
  }

  ngOnInit(): void {
  }

}

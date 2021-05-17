import { Component, OnInit } from '@angular/core';
import { AnkiService } from '../anki.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(private anki: AnkiService) {
    this.update({
      a: true,
      b: true,
      c: true,
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
    if (this.options.a) {
      this.data = [...this.data, ...this.anki.learning.filter(i => i.ef == 1.3)]
    }
    if (this.options.b) {
      this.data = [...this.data, ...this.anki.learning.filter(i => i.ef > 1.3)]
    }
    if (this.options.c) {
      this.data = [...this.data, ...this.anki.data]
    }
    console.log(this.data)
  }

  ngOnInit(): void {
  }

}

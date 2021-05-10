import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { readAnkiFile } from 'src/anki/anki';
import { AnkiService } from '../anki.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  constructor(private http: HttpClient, private anki: AnkiService) {
  }

  ngOnInit(): void {
    this.onLoad()
  }

  current: any = null

  loaded = false

  async onLoad() {
    if (!this.anki.hasData()) {
      let data = await this.http.get('/assets/joyokanji.apkg', { responseType: 'arraybuffer' }).toPromise()
      await this.anki.readFile(data)
    }
    this.loaded = true
    this.hasMore = this.anki.hasMore()
    if (this.anki.initialzedBefore()) {
      this.start()
    }
  }

  started = false

  start() {
    this.started = true
    this.anki.init()
    this.current = this.anki.select()
  }

  hasMore = false

  next() {
    this.current = this.anki.select()
    this.hasMore = this.anki.hasMore()
  }

  front = true

  reveal() {
    this.front = false
  }

  response(level: number) {
    this.anki.response(level)
    this.next()
    this.front = true
  }


  more() {
    this.anki.add(20)
    this.next()
  }

}

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

  onLoad() {
    if (!this.anki.hasData()) {
      this.http.get('/assets/joyokanji.apkg', { responseType: 'arraybuffer' }).subscribe(async d => {
        await this.anki.readFile(d)
        this.current = this.anki.select()
        if (this.current == null) {
          this.anki.add(20)
        }
        this.current = this.anki.select()
        if (this.current == null) {
          // run out
        }
        this.loaded = true
      })
    }
  }

  next() {
    this.current = this.anki.select()
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

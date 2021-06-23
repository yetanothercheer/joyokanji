import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { IdService } from './id.service';
import { WordsService, WordState } from './words.service';

type RemoteWord = {
  content: any;
  state: WordState;
  timestamp: number;
};

function currentTimestamp() {
  return new Date(new Date().toDateString()).getTime();
}

function wordIsComing(timestamp: number, interval: number) {
  const MillisecondsOfTheDay = 24 * 60 * 60 * 1000;
  let diff = (currentTimestamp() - timestamp) / MillisecondsOfTheDay;
  return diff >= interval;
}

@Component({
  selector: 'joyokanji-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'joyokanji';

  remote_words = this.firestore.collection<RemoteWord>(this.id.my_id);

  data = this.remote_words.valueChanges({ idField: 'id' });

  offset = 0;

  current$ = this.data.pipe(
    map((words) => {
      this.offset = words.length;
      for (let word of words) {
        if (wordIsComing(word.timestamp, word.state.interval)) {
          return word;
        }
      }
      return null;
    })
  );

  constructor(
    private firestore: AngularFirestore,
    private id: IdService,
    private words: WordsService
  ) {}

  action(word: RemoteWord & { id: string }, quality: number) {
    this.remote_words.doc(word.id).update({
      state: this.words.updateWordState(quality, word.state),
    });
  }

  addWords(count = 10) {
    let words = this.words.getDataSlice(this.offset, count);
    words.forEach((word) => {
      this.remote_words.add({
        content: word,
        state: this.words.initialWordState(),
        timestamp: currentTimestamp(),
      });
    });
  }
}

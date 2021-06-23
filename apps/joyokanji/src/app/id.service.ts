import { Injectable } from '@angular/core';
import { nanoid } from 'nanoid';

@Injectable({
  providedIn: 'root',
})
export class IdService {
  private LOCAL_STROAGE_KEY = '__my_id';

  my_id: string;

  constructor() {
    let stored = localStorage.getItem(this.LOCAL_STROAGE_KEY);
    if (typeof stored == 'string') {
      this.my_id = stored;
    } else {
      this.my_id = nanoid();
      localStorage.setItem(this.LOCAL_STROAGE_KEY, this.my_id);
    }
  }
}

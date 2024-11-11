import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Count, Counts } from '../interfaces/count';

@Injectable({
  providedIn: 'root'
})
export class CountsService {

  constructor(private readonly afs: AngularFirestore) { }

  addCounts(count: Count) {
    const collCount: AngularFirestoreCollection<Count> = this.afs.collection('counts');
    return collCount.add(count);
  }

  getCounts(): AngularFirestoreCollection<Count> {
    const collCount: AngularFirestoreCollection<Count> = this.afs.collection<Count>('counts');
    return collCount;
  }

  saveCount(count: Counts) {
    const collBunCount = this.afs.collection('counts');
    return collBunCount.add(count);
  }
}

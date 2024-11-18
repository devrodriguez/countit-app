import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Count, Counts } from '../interfaces/count';

import { firstValueFrom } from 'rxjs';

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

  async getCountByIndex(productID: string, workerID: string, workpointID: string) {
    const dateFrom = new Date()
    const dateTo = new Date()

    dateFrom.setHours(0, 0, 0, 0)
    dateTo.setHours(23, 59, 59, 999)

    const countSnap = this.afs.collection('counts', q => {
      return q
      .where('product_id', '==', productID)
      .where('worker_id', '==', workerID)
      .where('workpoint_id', '==', workpointID)
      .where('created_at', '>=', dateFrom.getTime())
      .where('created_at', '<=', dateTo.getTime())
    }).snapshotChanges()

    const counts = await firstValueFrom(countSnap)

    if (counts.length === 0) {
      return null
    }

    const [count] = counts
    const data = count.payload.doc.data() as Counts
    const id = count.payload.doc.id

    return {
      ...data,
      id,
    }
    
  }

  async saveCount(count: Counts) {
    const collBunCount = this.afs.collection('counts')

    count.created_at = new Date().getTime()

    const resCount = await this.getCountByIndex(count.product_id, count.worker_id, count.workpoint_id)
    if (resCount === null) {
      return collBunCount.add(count);
    } 
    
    return collBunCount.doc(resCount.id).update(count);
  }
}

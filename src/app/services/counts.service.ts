import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Count } from '../interfaces/count';

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

  async findCount(count: Count) {
    const dateFrom = new Date()
    const dateTo = new Date()
    const { workpoint: { block, product, stand } } = count

    dateFrom.setHours(0, 0, 0, 0)
    dateTo.setHours(23, 59, 59, 999)

    const countSnap = this.afs.collection('counts', q => {
      return q
      .where('workpoint.block.id', '==', block.id)
      .where('workpoint.product.id', '==', product.id)
      .where('workpoint.stand.id', '==', stand.id)
      .where('createdAt', '>=', dateFrom.getTime())
      .where('createdAt', '<=', dateTo.getTime())
    }).snapshotChanges()

    const counts = await firstValueFrom(countSnap)
    if (counts.length === 0) {
      return null
    }

    const [fcount] = counts
    const data = fcount.payload.doc.data() as Count
    const id = fcount.payload.doc.id

    return {
      ...data,
      id,
    }
    
  }

  async saveCount(count: Count) {
    const collBunCount = this.afs.collection('counts')

    count.createdAt = new Date().getTime()

    const resCount = await this.findCount(count)
    if (resCount === null) {
      return collBunCount.add(count);
    } 
    
    return collBunCount.doc(resCount.id).update(count);
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { firstValueFrom } from 'rxjs';

import { Worker } from '../interfaces/worker'

@Injectable({
  providedIn: 'root'
})
export class WorkersService {

  constructor(private readonly afs: AngularFirestore) { }

  async getWorker(id: string) {
    const workerRef = this.afs.collection('workers').doc(id)
    const workerSnap = await workerRef.get().toPromise()

    return workerSnap
  }

  async getWorkerByCode(code: string): Promise<Worker | null> {
    const snapshot = this.afs.collection('workers', q => q.where('code', '==', code)).snapshotChanges()
    const workers = await firstValueFrom(snapshot)

    if (workers.length === 0) {
      return null
    }

    const [worker] = workers
    let data = worker.payload.doc.data() as Worker
    data.id = worker.payload.doc.id

    return data
  }
}

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
    const workerRef = this.afs.collection('employees').doc(id)
    const workerSnap = await firstValueFrom(workerRef.get())
    const workerData = workerSnap.data() as Worker
    const workerID = workerData.id

    return {
      ...workerData,
      id: workerID
    }
  }

  async getWorkerByCode(code: string): Promise<Worker | null> {
    const snapshot = this.afs.collection('employees', q => q.where('code', '==', code)).snapshotChanges()
    const workers = await firstValueFrom(snapshot)

    if (workers.length === 0) {
      return null
    }

    const [worker] = workers
    const workerData = worker.payload.doc.data() as Worker
    const workerID = worker.payload.doc.id

    return {
      ...workerData,
      id: workerID
    }
  }
}

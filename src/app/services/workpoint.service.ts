import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom } from 'rxjs';
import { Workpoint } from '../interfaces/workpoint';

@Injectable({
  providedIn: 'root'
})
export class WorkpointService {

  constructor(private readonly afs: AngularFirestore) { }

  async getWorkpointByCode(code: string): Promise<Workpoint | null> {
    const snapshot = this.afs.collection('workpoint', q => q.where('code', '==', code)).snapshotChanges()
    const workpoints = await firstValueFrom(snapshot)

    if (workpoints.length === 0) {
      return null
    }

    const [workpoint] = workpoints
    let data = workpoint.payload.doc.data() as Workpoint
    data.id = workpoint.payload.doc.id

    return data
  }
}


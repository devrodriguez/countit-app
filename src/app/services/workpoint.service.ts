import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Workpoint } from '../interfaces/workpoint';
import { collection, CollectionReference, doc, DocumentData, Firestore, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class WorkpointService {

  private workpointRef: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.workpointRef = collection(this.firestore, 'workpoint')
  }

  async getWorkpointByID(workpointID: string): Promise<Workpoint | null> {
    const docRef = doc(this.workpointRef, workpointID)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data() as Workpoint;
    const id = docSnap.id;
    return { ...data, id };
  }
}


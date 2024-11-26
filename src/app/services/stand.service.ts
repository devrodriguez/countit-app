import { Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, DocumentData, Firestore, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Stand } from '../interfaces/stand';

@Injectable({
  providedIn: 'root'
})
export class StandService {
  private collRef: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.collRef = collection(this.firestore, 'stands')
  }

  getStands() {
    const docQuery = query(this.collRef, where('status', '==', 'enabled'))
    
    return collectionData(docQuery, {
      idField: 'id'
    }) as Observable<Stand[]>
  }
}

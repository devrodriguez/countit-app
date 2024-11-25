import { Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, DocumentData, Firestore, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Block } from '../interfaces/block';

@Injectable({
  providedIn: 'root'
})
export class BlocksService {
  private collRef: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.collRef = collection(this.firestore, 'blocks')
  }

  getBlocks() {
    const docQuery = query(this.collRef, where('status', '==', 'enabled'))
    
    return collectionData(docQuery, {
      idField: 'id'
    }) as Observable<Block[]>
  }
}

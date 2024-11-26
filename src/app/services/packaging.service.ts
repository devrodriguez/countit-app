import { Injectable, OnInit } from '@angular/core';
import { collection, collectionData, CollectionReference, DocumentData, Firestore, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Packaging } from '../interfaces/packaging';

@Injectable({
  providedIn: 'root'
})
export class PackagingService {
  private collRef: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.collRef = collection(this.firestore, 'packaging')
  }

  getPackagings() {
    const docQuery = query(this.collRef, where('status', '==', 'enabled'))
    
    return collectionData(docQuery, {
      idField: 'id'
    }) as Observable<Packaging[]>
  }
}

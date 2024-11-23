import { Injectable, OnInit } from '@angular/core';
import { collection, collectionData, CollectionReference, doc, DocumentData, Firestore, getDoc, getDocs, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Packaging } from '../interfaces/packaging';

@Injectable({
  providedIn: 'root'
})
export class PackagingService {
  private packagingRef: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.packagingRef = collection(this.firestore, 'packaging')
  }

  getPackanings() {
    const docQuery = query(this.packagingRef, where('status', '==', 'enabled'))
    
    return collectionData(docQuery, {
      idField: 'id'
    }) as Observable<Packaging[]>
  }
}

import { Injectable } from '@angular/core';
import { 
  collection, 
  collectionData, 
  CollectionReference, 
  DocumentData, 
  Firestore, 
  getDocs, 
  query, 
  where 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private collRef: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.collRef = collection(this.firestore, 'products')
  }

  getProducts() {
    const docQuery = query(this.collRef, where('status', '==', 'enabled'))
    
    return collectionData(docQuery, {
      idField: 'id'
    }) as Observable<Product[]>
  }

  async getProductByCode(code: string): Promise<Product | null> {
    const collQuery = query(this.collRef, where('code', '==', code))
    const docRef = await getDocs(collQuery)

    if (docRef.docs.length === 0) {
      return null;
    }

    const [product] = docRef.docs
    const data = product.data() as Product
    const docID = product.id

    return {
      ...data,
      id: docID
    }
  }
}

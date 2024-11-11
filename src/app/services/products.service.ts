import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { firstValueFrom } from 'rxjs';

import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private readonly afs: AngularFirestore) { }

  getProducts(): AngularFirestoreCollection<Product> {
    const collProducts: AngularFirestoreCollection<Product> = this.afs.collection('products');
    return collProducts;
  }

  async getProductByCode(code: string): Promise<Product | null> {
    const snapshot = this.afs.collection('products', q => q.where('code', '==', code)).snapshotChanges()
    const products = await firstValueFrom(snapshot)

    if (products.length === 0) {
      return null;
    }

    const [product] = products
    let data = product.payload.doc.data() as Product
    data.id = product.payload.doc.id

    return data
  }
}

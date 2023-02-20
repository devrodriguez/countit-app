import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
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
}

import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Block } from '../interfaces/block';

@Injectable({
  providedIn: 'root'
})
export class BlocksService {

  constructor(
    private readonly afs: AngularFirestore
  ) { }

  getBlocks(): AngularFirestoreCollection<Block> {
    const collBlocks = this.afs.collection<Block>('blocks');
    return collBlocks;
  }
}

import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Block } from 'src/app/interfaces/block';
import { Count } from 'src/app/interfaces/count';
import { Employee } from 'src/app/interfaces/employee';
import { Product } from 'src/app/interfaces/product';
import { CountsService } from 'src/app/services/counts.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-counts',
  templateUrl: './counts.page.html',
  styleUrls: ['./counts.page.scss'],
})
export class CountsPage implements OnInit {

  block: Block = {} as Block;
  blocks: Block[] = [{name:"ER012"}, {name:"ER013"},{name:"ER014"}];
  count: Count = {} as Count;
  employee: Employee = {name: "Default"};
  product: Product = {} as Product;
  products: Product[] = [];

  constructor(
    private readonly toastCtr: ToastController,
    private readonly countsSrv: CountsService,
    private readonly productsSrv: ProductsService) { }

  ngOnInit() {
    this.count.employee = this.employee;
    this.loadProducts();
  }

  loadProducts() {
    this.productsSrv.getProducts().snapshotChanges().subscribe(res => {
      if(res) {
        this.products = res.map(e => {
          return {
            id: e.payload.doc.id,
            name: e.payload.doc.data().name
          } as Product
        });
      }
    });
  }

  saveCount() {
    console.log(this.count);
    this.countsSrv.addCounts(this.count)
    .then(res => {
      this.presentToast('Guardado correctamente');
      this.count = {} as Count;
    })
    .catch(err => {
      console.error(err);
    })
  }

  changeBlock() {
    this.count.block = this.block;
  }

  changeProduct() {
    this.count.product = this.product;
  }

  async presentToast(message: string) {
    let toast = await this.toastCtr.create({
      message: message,
      duration: 4000
    });

    toast.present();
  }
}

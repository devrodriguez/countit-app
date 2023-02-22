import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Block } from 'src/app/interfaces/block';
import { Count } from 'src/app/interfaces/count';
import { Employee } from 'src/app/interfaces/employee';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { BlocksService } from 'src/app/services/blocks.service';
import { CountsService } from 'src/app/services/counts.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-counts',
  templateUrl: './counts.page.html',
  styleUrls: ['./counts.page.scss'],
})
export class CountsPage implements OnInit {

  user: User = {} as User;
  productURL: string = '';
  block: Block = {} as Block;
  blocks: Block[] = []
  count: Count = {} as Count;
  employee: Employee = {} as Employee;
  product: Product = {} as Product;
  products: Product[] = [];

  constructor(
    private readonly toastCtr: ToastController,
    private readonly alertCtr: AlertController,
    private readonly countsSrv: CountsService,
    private readonly productsSrv: ProductsService,
    private readonly blocksSrv: BlocksService,
    private readonly authSrv: AuthService) {}

  ngOnInit() {
    this.loadProducts();
    this.loadBlocks();
    this.user = this.authSrv.user;
    this.employee.nick_name = this.user.name;
    this.count.employee = this.employee;
  }

  loadProducts() {
    this.productsSrv
    .getProducts()
    .snapshotChanges()
    .subscribe(res => {
      if(res) {
        this.products = res.map(e => {
          let data = e.payload.doc.data() as Product;
          return {
            id: e.payload.doc.id,
            name: data.name,
            url_image: data.url_image
          } as Product
        });
      }
    }, err => {
      console.error(err);
    });
  }

  loadBlocks() {
    this.blocksSrv.getBlocks().snapshotChanges().subscribe(res => {
      if(res) {
        this.blocks = res.map(e => {
          return {
            id: e.payload.doc.id,
            name: e.payload.doc.data().name
          } as Block
        });
      }
    }, err => {
      console.error(err);
    })
  }

  saveCount() {
    if(!this.block.id) {
      this.presentAlert('Debes seleccionar un bloque');
      return;
    }

    if(!this.product.id) {
      this.presentAlert('Debes seleccionar un producto');
      return;
    }

    if(!this.count.amount || this.count.amount <= 0) {
      this.presentAlert('Debes ingresar la cantidad contada');
      return;
    }

    this.countsSrv.addCounts(this.count)
    .then(res => {
      this.presentToast('Conteo guardado correctamente');
      this.count = {} as Count;
      this.productURL = '';
    })
    .catch(err => {
      console.error(err);
    })
  }

  changeBlock() {
    this.count.block = this.block;
  }

  changeProduct() {
    this.productURL = this.product.url_image;
    this.count.product = this.product;
  }

  async presentToast(message: string) {
    let toast = await this.toastCtr.create({
      message: message,
      duration: 4000
    });

    toast.present();
  }

  async presentAlert(message: string) {
    let alert = await this.alertCtr.create({
      buttons: ['Ok'],
      message: message
    });

    alert.present();
  }
}

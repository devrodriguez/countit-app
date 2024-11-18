import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Html5Qrcode } from "html5-qrcode";

import { CountsService } from 'src/app/services/counts.service';
import { WORKPOINT_TYPE, WORKER_TYPE, PRODUCT_TYPE } from '../../helper/consts';
import { Counts } from 'src/app/interfaces/count';
import { WorkersService } from 'src/app/services/workers.service';
import { Worker } from 'src/app/interfaces/worker';
import { Product } from 'src/app/interfaces/product';
import { ProductsService } from 'src/app/services/products.service';
import { Workpoint } from 'src/app/interfaces/workpoint';
import { WorkpointService } from 'src/app/services/workpoint.service';

@Component({
  selector: 'app-count-workpoint',
  templateUrl: './count-workpoint.page.html',
  styleUrls: ['./count-workpoint.page.scss'],
})
export class CountWorkpointPage implements OnInit {
  private beepAudio: HTMLAudioElement | undefined;
  private loading: HTMLIonLoadingElement | null = null;

  worker: Worker | null = null
  product: Product | null = null
  workpoint: Workpoint | null = null;
  workpointType = WORKPOINT_TYPE
  workerType = WORKER_TYPE
  productType = PRODUCT_TYPE

  isScanning = false;
  itsScanning = '';
  collector: any;
  amount: any;
  html5QrCode: any;

  constructor(
    private toastCtrl: ToastController, 
    private loadingCtrl: LoadingController, 
    private countsSrv: CountsService,
    private workpointSrv: WorkpointService,
    private workerSrv: WorkersService,
    private productSrv: ProductsService) {
    this.beepAudio = new Audio('../../../assets/sounds/beep.mp3');
  }

  ngOnInit() {
    this.html5QrCode = new Html5Qrcode("qr-reader");
  }

  async scan(elementScanned: string) {
    this.itsScanning = elementScanned;

    const qrConfig = {
      fps: 20,
      qrbox: {
        width: 200,
        height: 200
      }
    };

    await this.html5QrCode.start(
      {
        facingMode: "environment",
      },
      qrConfig,
      async (decodedText: any, decodedResult: any) => {
        if (this.isScanning) return

        await this.html5QrCode.stop()
        await this.beepAudio?.play()
        await this.setScannedData(decodedText)
      })
  }

  async setScannedData(data: string) {
    this.isScanning = true;

    try {
      await this.showLoading()
      switch (this.itsScanning) {
        case WORKPOINT_TYPE:
          this.workpoint = await this.workpointSrv.getWorkpointByCode(data)
          if (this.workpoint === null) {
            this.showToast('Workpoint does not exist')
            return
          }
          break;
        case WORKER_TYPE:
          this.worker = await this.workerSrv.getWorkerByCode(data)
          if (this.worker === null) {
            this.showToast('Worker does not exist')
            return
          }
          break;
        case PRODUCT_TYPE:
          this.product = await this.productSrv.getProductByCode(data)
          if (this.product === null) {
            this.showToast('Product does not exist')
            return
          }
          break;
        default:
          this.worker = null;
          this.product = null;
      } 
    } catch (error) {
      this.showToast('Something went wrong')
      throw Error("some error scanning")
    } finally {
      await this.dismissLoading()
      this.isScanning = false
    }
  }

  async reset() {
    this.isScanning = false
    this.amount = null
    this.itsScanning = ''
    this.workpoint = null
    this.worker = null
    this.product = null
    await this.html5QrCode.stop()
  }

  async save() {
    let count = {
      worker_id: this.worker?.id,
      worker_code: this.worker?.code,
      worker_name: this.worker?.name,
      workpoint_id: this.workpoint?.id,
      workpoint_code: this.workpoint?.code,
      workpoint_name: this.workpoint?.name,
      product_id: this.product?.id,
      product_code: this.product?.code,
      product_name: this.product?.name,
      amount: this.amount
    } as Counts

    try {
      await this.showLoading()
      await this.countsSrv.saveCount(count);
    } catch (error) {
      console.error(error);
      this.showToast("Some error saving bunche count");
      throw Error("some error saving bunche count")
    } finally {
      this.dismissLoading()
    }

    this.reset();
    this.showToast('Count saved successfully');
  }

  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message: message,
      position: 'bottom',
      duration: 2000,
      color,
    });

    await toast.present();
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 3000,
      spinner: 'crescent'
    })

    this.loading.present()
  }

  async dismissLoading() {
    if (this.loading) {
      this.loading.dismiss()
      this.loading = null
    }
  }
}

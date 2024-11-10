import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Html5Qrcode } from "html5-qrcode";
import { CountsService } from 'src/app/services/counts.service';

@Component({
  selector: 'app-count-bunches',
  templateUrl: './count-bunches.page.html',
  styleUrls: ['./count-bunches.page.scss'],
})
export class CountBunchesPage implements OnInit {
  private beepAudio: HTMLAudioElement | undefined;

  isScanActive = false;
  itsScanning = '';
  collector: any;
  product: any;
  amount: any;
  html5QrCode: any;

  constructor(private toastCtrl: ToastController, private loadingCtrl: LoadingController, private countsSrv: CountsService) {
    this.beepAudio = new Audio('../../../assets/sounds/beep.mp3');
  }

  ngOnInit() {
    this.html5QrCode = new Html5Qrcode("qr-reader");
  }

  async scanQR(elementScanned: string) {
    this.itsScanning = elementScanned;
    this.isScanActive = true;

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
        this.setScannedData(decodedText);
        this.beepAudio?.play();
        await this.html5QrCode.stop();
        this.isScanActive = false;
      })
  }

  setScannedData(data: string) {
    switch (this.itsScanning) {
      case 'collector':
        this.collector = data;
        break;
      case 'product':
        this.product = data;
        break;
      default:
        this.collector = data;
        this.product = data;
    }
  }

  async reset() {
    this.isScanActive = false;
    this.amount = null;
    this.itsScanning = '';
    this.setScannedData('');
    await this.html5QrCode.stop();
  }

  async save() {
    try {
      await this.countsSrv.saveCount(this.collector, this.product, this.amount);
    } catch (error) {
      console.log(error);
      this.showToast("Some error saving bunche count");
      throw Error("some error saving bunche count")
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
}

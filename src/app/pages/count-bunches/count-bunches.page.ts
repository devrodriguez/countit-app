import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import jsQR from 'jsqr';
import { CountsService } from 'src/app/services/counts.service';

@Component({
  selector: 'app-count-bunches',
  templateUrl: './count-bunches.page.html',
  styleUrls: ['./count-bunches.page.scss'],
})
export class CountBunchesPage implements OnInit {
  @ViewChild('video', { static: false }) video: ElementRef | undefined;
  @ViewChild('canvas', { static: false }) canvas: ElementRef | undefined;


  loadingElement: HTMLIonLoadingElement | undefined;
  private beepAudio: HTMLAudioElement | undefined;

  isScanActive = false;
  itsScanning = '';
  scanResult = '';
  videoElement: any;
  canvasElement: any;
  canvasContext: any;
  collector: any;
  product: any;
  amount: any;

  constructor(private toastCtrl: ToastController, private loadingCtrl: LoadingController, private countsSrv: CountsService) {
    this.beepAudio = new Audio('../../../assets/sounds/beep.mp3');
  }

  ngAfterViewInit() {
    this.videoElement = this.video?.nativeElement;
    this.canvasElement = this.canvas?.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
  }

  ngOnInit() {
  }

  async prepareScanner() {
    const isCameraAvailable = await this.checkCamera();
  }

  async checkCamera() {
    const cameraPermission = await navigator.permissions.query({ name: 'camera' } as any);

    const isCameraOk = cameraPermission.state !== 'denied';
    const hasMediaDevice = 'mediaDevices' in navigator;
    const hasUserMedia = 'getUserMedia' in navigator.mediaDevices;

    if (!hasMediaDevice) {
      this.showToast('El dispositivo no puede leer codigos');
      return;
    }

    if (!hasUserMedia) {
      this.showToast('El dispositivo no esta listo');
      return;
    }

    return isCameraOk;
  }

  async scan(elementScanned: string) {
    this.itsScanning = elementScanned;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', 
        width: 320,
        height: 240
      },
    });

    this.videoElement.srcObject = stream;
    this.videoElement.play();
    this.isScanActive = true;

    this.loadingElement = await this.loadingCtrl.create({});
    await this.loadingElement.present()

    requestAnimationFrame(this.scanHandler.bind(this));
  }

  async scanHandler() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      if (this.loadingElement) {
        await this.loadingElement.dismiss();
        this.loadingElement = undefined;
        this.isScanActive = true;
      }

      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.width;

      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );

      // Get image data
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      console.log(code);

      if (code) {
        this.isScanActive = false;
        this.scanResult = code.data;
        //this.showToast(`Read ${this.scanResult}`);
        this.setScannedData(code.data);

        //this.beepAudio.currentTime = 0;
        this.beepAudio?.play();

      } else {
        if (this.isScanActive) {
          requestAnimationFrame(this.scanHandler.bind(this));
        }
      }

    } else {
      requestAnimationFrame(this.scanHandler.bind(this));
    }
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

  reset() {
    this.isScanActive = false;
    this.amount = null;
    this.itsScanning = '';
    this.setScannedData('');
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

import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Html5Qrcode } from "html5-qrcode";

import { CountsService } from 'src/app/services/counts.service';
import { Count } from 'src/app/interfaces/count';
import { Product } from 'src/app/interfaces/product';
import { Workpoint } from 'src/app/interfaces/workpoint';
import { WorkpointService } from 'src/app/services/workpoint.service';
import { Employee } from 'src/app/interfaces/employee';
import { EmployeesService } from 'src/app/services/employees.service';
import { PackagingService } from 'src/app/services/packaging.service';
import { Packaging } from 'src/app/interfaces/packaging';
import { Block } from 'src/app/interfaces/block';
import { Stand } from 'src/app/interfaces/stand';
import { AuthService } from 'src/app/services/auth.service';
import { WORKPOINT_TYPE, EMPLOYEE_TYPE, PRODUCT_TYPE } from '../../helper/consts';

@Component({
  selector: 'app-count-workpoint',
  templateUrl: './count-workpoint.page.html',
  styleUrls: ['./count-workpoint.page.scss'],
})
export class CountWorkpointPage implements OnInit {
  private beepAudio: HTMLAudioElement | undefined;
  private loading: HTMLIonLoadingElement | null = null;

  employee: Employee | null = null
  workpoint: Workpoint | null = null;
  selectedPackaging: Packaging | null = null
  packagings: Packaging[] = [] as Packaging[]

  workpointType = WORKPOINT_TYPE
  employeeType = EMPLOYEE_TYPE
  productType = PRODUCT_TYPE

  codeEmployeeSelected: string = ''
  isScanning = false;
  isScannerOpened: Boolean = false
  isOnEditWorkpoint = false
  itsScanning = '';
  collector: any;
  amount: any;
  html5QrCode: any;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private countsSrv: CountsService,
    private workpointSrv: WorkpointService,
    private employeeSrv: EmployeesService,
    private packagingSrv: PackagingService,
    private alertCtrl: AlertController,
    public authSrv: AuthService,
  ) {
    this.beepAudio = new Audio('../../../assets/sounds/beep.mp3');
  }

  public alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {

      }
    },
    {
      text: 'Aceptar',
      role: 'acept',
      handler: () => {
        
      }
    }
  ]

  ngOnInit() {
    this.loadPackagings()
    this.html5QrCode = new Html5Qrcode("qr-reader");
  }

  loadPackagings() {
    this.packagingSrv.getPackagings()
      .subscribe({
        next: pkgs => {
          this.packagings = pkgs
        },
        error: err => {
          console.error(err)
        }
      })
  }

  async scan(elementScanned: string) {
    this.itsScanning = elementScanned;
    this.isScannerOpened = true;

    const qrConfig = {
      fps: 20,
      qrbox: {
        width: 250,
        height: 250
      }
    };

    await this.html5QrCode.start(
      {
        facingMode: "environment",
      },
      qrConfig,
      async (decodedText: any, decodedResult: any) => {
        if (this.isScanning) return

        try {
          await this.html5QrCode.stop()
          await this.beepAudio?.play()
          await this.setScannedData(decodedText)
          await this.resetScan()
        } catch (err) {
          console.log('[function: scanHandler]', err)
        }
      })
  }

  async setScannedData(entityID: string): Promise<Boolean> {
    this.isScanning = true;

    try {
      await this.showLoading()

      switch (this.itsScanning) {
        case WORKPOINT_TYPE:
          this.workpoint = await this.workpointSrv.getWorkpointByID(entityID)
          if (this.workpoint === null) {
            this.showToast('Workpoint does not exist')

            return false
          }

          return true
        case EMPLOYEE_TYPE:
          this.employee = await this.employeeSrv.getEmployeeByID(entityID)
          if (this.employee === null) {
            this.showToast('El empleado no existe')

            return false
          }

          return true
        default:
          this.employee = null
          this.workpoint = null

          return false
      }
    } catch (error) {
      this.showToast('Error en lectura de codigo')
      throw Error("some error scanning")
    } finally {
      await this.dismissLoading()
      this.isScanning = false
    }
  }

  reset() {
    this.isOnEditWorkpoint = false
    this.amount = null
    this.itsScanning = ''
    this.workpoint = null
    this.employee = null
    this.selectedPackaging = null
  }

  resetAfterCount() {
    this.selectedPackaging = null
    this.amount = null
  }

  async save() {
    const createdBy = this.authSrv.userData?.displayName

    let count = {
      employee: this.workpoint.employee,
      workpoint: this.workpoint,
      packaging: this.selectedPackaging,
      amount: this.amount,
      createdBy,
    } as Count

    try {
      await this.showLoading()
      await this.countsSrv.saveCount(count);
    } catch (error) {
      console.error(error);
      this.showToast("Error guardando conteo");
      throw Error("some error saving bunche count")
    } finally {
      this.dismissLoading()
    }

    this.resetAfterCount();
    this.showToast('Conteo guardado correctamente');
  }

  async finalizeScan() {
    await this.html5QrCode.stop()
    this.resetScan()
  }

  async resetScan() {
    this.isScanning = false
    this.itsScanning = ''
    this.isScannerOpened = false
  }

  showWorkpointContent() {
    this.isOnEditWorkpoint = true
  }

  handleBlockChange(block: Block) {
    this.workpoint = { ...this.workpoint, block } as Workpoint
  }

  handleProductChange(product: Product) {
    this.workpoint = { ...this.workpoint, product } as Workpoint
  }

  handleStandChange(stand: Stand) {
    this.workpoint = { ...this.workpoint, stand } as Workpoint
  }

  checkCountReady() {
    return this.workpoint &&
      this.workpoint.block &&
      this.workpoint.product &&
      this.workpoint.stand &&
      this.workpoint.employee &&
      this.selectedPackaging &&
      this.amount > 0
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

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmación de conteo',
      message: '¿Deseas guardar este conteo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          role: 'confirm',
          handler: () => {
            this.save()
          }
        },
      ]
    })
    await alert.present();
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Guardando...',
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

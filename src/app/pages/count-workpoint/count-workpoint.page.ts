import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Html5Qrcode } from "html5-qrcode";

import { CountsService } from 'src/app/services/counts.service';
import { WORKPOINT_TYPE, EMPLOYEE_TYPE, PRODUCT_TYPE } from '../../helper/consts';
import { Count } from 'src/app/interfaces/count';
import { Product } from 'src/app/interfaces/product';
import { ProductsService } from 'src/app/services/products.service';
import { Workpoint } from 'src/app/interfaces/workpoint';
import { WorkpointService } from 'src/app/services/workpoint.service';
import { Employee } from 'src/app/interfaces/employee';
import { EmployeesService } from 'src/app/services/employees.service';
import { PackagingService } from 'src/app/services/packaging.service';
import { Packaging } from 'src/app/interfaces/packaging';

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
    private employeeSrv: EmployeesService,
    private packagingSrv: PackagingService) {
    this.beepAudio = new Audio('../../../assets/sounds/beep.mp3');
  }

  ngOnInit() {
    this.loadPackagings()
    this.html5QrCode = new Html5Qrcode("qr-reader");
  }

  loadPackagings() {
    this.packagingSrv.getPackanings()
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

  async setScannedData(entityID: string) {
    this.isScanning = true;

    try {
      await this.showLoading()
      switch (this.itsScanning) {
        case WORKPOINT_TYPE:
          this.workpoint = await this.workpointSrv.getWorkpointByID(entityID)
          if (this.workpoint === null) {
            this.showToast('Workpoint does not exist')
            return
          }
          break;
        case EMPLOYEE_TYPE:
          this.employee = await this.employeeSrv.getEmployeeByID(entityID)
          if (!this.employee.id) {
            this.showToast('Employee does not exist')
            return
          }
          break;
        default:
          this.employee = null
          this.workpoint = null
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
    this.employee = null
    this.selectedPackaging = null
    await this.html5QrCode.stop()
  }

  async save() {
    let count = {
      blockID: this.workpoint?.block.id,
      blockName: this.workpoint?.block.name,
      productID: this.workpoint?.product.id,
      productName: this.workpoint?.product.name,
      employeeID: this.employee?.id,
      employeeName: `${this.employee?.firstName} ${this.employee?.lastName}`,
      standID: this.workpoint?.stand.id,
      standName: this.workpoint?.stand.name,
  
      amount: this.amount
    } as Count

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

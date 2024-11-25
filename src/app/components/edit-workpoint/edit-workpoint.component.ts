import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Block } from 'src/app/interfaces/block';
import { Product } from 'src/app/interfaces/product';
import { Stand } from 'src/app/interfaces/stand';
import { BlocksService } from 'src/app/services/blocks.service';
import { ProductsService } from 'src/app/services/products.service';
import { StandService } from 'src/app/services/stand.service';

@Component({
  selector: 'app-edit-workpoint',
  templateUrl: './edit-workpoint.component.html',
  styleUrls: ['./edit-workpoint.component.scss'],
})
export class EditWorkpointComponent implements OnInit {
  @Input('block') block: Block = {} as Block
  @Input('product') product: Product = {} as Product
  @Input('stand') stand: Stand = {} as Stand

  @Output() onBlockChange = new EventEmitter<Block>()
  @Output() onProductChange = new EventEmitter<Product>()
  @Output() onStandChange = new EventEmitter<Stand>()

  selectedBlock!: Block
  blocks: Block[] = [] as Block[]
  selectedProduct!: Product
  products: Product[] = [] as Product[]
  selectedStand!: Stand
  stands: Stand[] = [] as Stand[]

  constructor(
    private blockSrv: BlocksService,
    private productSrv: ProductsService,
    private standSrv: StandService
  ) { 
    this.loadBlocks()
    this.loadProducts()
    this.loadStands()
  }

  ngOnInit() {

  }

  loadBlocks() {
    this.blockSrv.getBlocks()
    .subscribe({
      next: res => {
        this.blocks = res
      },
      error: err => {
        console.error(err)
      }
    })
  }

  loadProducts() {
    this.productSrv.getProducts()
    .subscribe({
      next: res => {
        this.products = res
      },
      error: err => {
        console.error(err)
      }
    })
  }

  loadStands() {
    this.standSrv.getStands()
    .subscribe({
      next: res => {
        this.stands = res
      },
      error: err => {
        console.error(err)
      }
    })
  }

  handleBlockChange() {
    this.onBlockChange.emit(this.selectedBlock)
  }

  handleProductChange() {
    this.onProductChange.emit(this.selectedProduct)
  }

  handleStandChange() {
    this.onStandChange.emit(this.selectedStand)
  }
}

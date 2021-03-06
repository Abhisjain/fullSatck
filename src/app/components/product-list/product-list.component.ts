import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number=1;
  previousCategoryId : number = 1;
  currentCategoryName: string;
  previouskeyword: string;
  searchMode: boolean = false;

  thePageNumber : number = 1;
  thePageSize: number =5;
  theTotalElements : number = 0;
  
  
  constructor(private productService: ProductService,private cartService: CartService,private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() =>{
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');
     if(this.searchMode){
       this.handleSearchProducts();

     }else{
       this.handleListProducts();

     }
  
  }
  handleSearchProducts(){
    const theKeyWord: string  = this.route.snapshot.paramMap.get('keyword')

    if(this.previouskeyword  != theKeyWord){
      this.thePageNumber = 1;
    }
    this.previouskeyword = theKeyWord;
    this.productService.searchProductsPaginate(this.thePageNumber -1, this.thePageSize,theKeyWord).subscribe(this.processResult());
  

  }
  handleListProducts(){

    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if(hasCategoryId){
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');

      this.currentCategoryName = this.route.snapshot.paramMap.get('name');
    }else{
      this.currentCategoryId = 1;
      this.currentCategoryName = 'books';
    }
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategory=${this.currentCategoryId} , thePageNumber=${this.thePageNumber}`);
    this.productService.getProductListPaginate(this.thePageNumber -1, this.thePageSize,this.currentCategoryId)
    .subscribe(this.processResult());

  }


  processResult(){
    return data =>{
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number +1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;


    }
  }

  updatePageSize(pageSize:number){
    this.thePageSize= pageSize;
    this.thePageNumber= 1;
    this.listProducts();
    console.log(this.thePageSize);
  }

  addToCart(tempProduct: Product){

    const cartItem = new CartItem(tempProduct);

    this.cartService.addToCart(cartItem);
  }



}

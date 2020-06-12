import { Component } from '@angular/core';
import { Stockexchange } from '../stockexchange';
import { ExchangeDetailService } from '../exchangedetail.service';
import { Observable } from 'rxjs';
import { NgbModalConfig, NgbModal,NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-managestockexchanges',
  templateUrl: './managestockexchanges.component.html',
  styleUrls: ['./managestockexchanges.component.css']
})
export class ManagestockexchangesComponent {
  contentTitle:string = '';
  exchanges$: Observable<Stockexchange[]>;
  total$: Observable<number>;
  model: NgbDateStruct;
  selectedSE:any;
  selectedExchange:Stockexchange;
  exchange=<Stockexchange>{
    id:0,
    stockexchange:'',
    brief:'',
    address:'',
    remarks:'',
  };

  constructor(
    public service:ExchangeDetailService,
    config: NgbModalConfig, 
    private modalService: NgbModal
    ) {
      this.exchanges$ = service.exchanges$;
      this.total$ = service.total$;
     }

  ngOnInit(): void {
  }
  open(content){
    this.contentTitle="Add Exchange";
    this.reset();
    this.modalService.open(content,{ size: 'lg',scrollable:true });
  }
  edit(content,id) {
    this.contentTitle="Update Exchange";
    this.getStockExchange(id);
    this.modalService.open(content,{ size: 'lg',scrollable:true });
  }

  confirm(contentdel,id) {
    this.contentTitle="Update Exchange";
    this.selectedSE = id;
    this.modalService.open(contentdel,{ size: 'lg',scrollable:true });
  }

  getStockExchange(id:any){
    this.service.getStockExchange(id).subscribe(result => this.setExchange(result.data));
    //this.setCompany(this.selectedCompany);
  }

  setExchange(stockexchange:Stockexchange){
    this.exchange.id = stockexchange.id;
    this.exchange.stockexchange = stockexchange.stockexchange;
    this.exchange.brief = stockexchange.brief;
    this.exchange.address= stockexchange.address;
    this.exchange.remarks = stockexchange.remarks;
  }

  onSubmit(exchangeForm){
    if(this.contentTitle==="Add Exchange"){
      console.log(exchangeForm.value)
      this.service.addStockExchange(exchangeForm.value)
    }else{
      console.log(exchangeForm.value)
      this.service.updateStockExchange(exchangeForm.value)
    }
    this.modalService.dismissAll();
  }

  reset(){
    this.exchange.id = 0
    this.exchange.stockexchange='';
    this.exchange.brief='';
    this.exchange.address='';
    this.exchange.remarks='';
  }
}
// import {DecimalPipe} from '@angular/common';
import {Component, QueryList, ViewChildren} from '@angular/core';
import {Observable} from 'rxjs';

import {Company} from '../company';
import {CompanyService} from '../company.service';

// import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-managecompanies',
  templateUrl: './managecompanies.component.html',
  styleUrls: ['./managecompanies.component.css'],
  providers: [CompanyService]
})

export class ManagecompaniesComponent {
  contentTitle:string = '';
  companies$: Observable<Company[]>;
  total$: Observable<number>;
  selectedCompany:Company;

  _company:Company = {
    id:0,
    companyname:'',
    turnover:null,
    ceo:'',
    boarddirector:'',
    stockexchanges:'',
    listedinse:'',
    brief:'',
    stockcode:'',
    companystatus:'1',
  };

   closeResult = '';

  constructor(
    private modalService: NgbModal,
    config: NgbModalConfig,
    public service: CompanyService
    ) {
    this.companies$ = service.companies$;
    this.total$ = service.total$;
    config.backdrop = 'static';
    config.keyboard = false;
  }

  open(content) {
    this.reset();
    this.contentTitle = "Add a new company";
    this.modalService.open(content,{ size: 'lg',scrollable:true });
  }

  edit(id,content){
    this.getCompany(id);
    this.contentTitle = "Update Company";
    this.modalService.open(content,{ size: 'lg',scrollable:true });
  }

  onSubmit(companyForm){
    if(this.contentTitle==="Add a new company"){
      this.service.addCompany(companyForm.value)
    }else{
      this.service.updateCompany(companyForm.value)
    }
    
    this.modalService.dismissAll();
  }

  reset(){
    this._company.id = 0
    this._company.companyname='';
    this._company.turnover = null;
    this._company.ceo ='';
    this._company.boarddirector ='';
    this._company.stockexchanges ='Y';
    this._company.listedinse ='';
    this._company.brief ='';
    this._company.stockcode ='';
    this._company.companystatus ='1';
  }

  getCompany(id:any){
    this.service.getCompany(id).subscribe(result => this.setCompany(result.data));
  }

  setCompany(company:Company){
    this._company.id = company.id;
    this._company.companyname=company.companyname;
    this._company.turnover = company.turnover;
    this._company.ceo = company.ceo;
    this._company.boarddirector = company.boarddirector;
    this._company.stockexchanges = company.stockexchanges;
    this._company.listedinse = company.listedinse;
    this._company.brief = company.brief;
    this._company.stockcode = company.stockcode;
    this._company.companystatus = company.companystatus;
  }

  
}


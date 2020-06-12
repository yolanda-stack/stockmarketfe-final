import { Component, OnInit, ViewChild, ElementRef, TemplateRef, Input } from '@angular/core';
import { ImportExcelService } from "./importexcel.service";
import * as $ from "jquery"
import { NgbModalConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Summary } from "./summary";

@Component({
  selector: 'app-importexcel',
  templateUrl: './importexcel.component.html',
  styleUrls: ['./importexcel.component.css']
})
export class ImportexcelComponent implements OnInit {

  _summary:Summary = {
    companyname: '',
    stockexchange: '',
    numofimport: 0,
    fromdate: '',
    todate: ''
  }
  filename = '';
  @ViewChild('fileinput') private fileinput: ElementRef;
  @ViewChild('content') content: string;
  constructor(public service: ImportExcelService,config: NgbModalConfig, private modalService: NgbModal) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    
  }
  open(content) {
    this.modalService.open(this.content,{ size: 'lg',scrollable:true });
  }

  downloadExcel(){
    this.service.downloadExcel();
  }

  fileChange(){
    const _file = this.fileinput.nativeElement.files;
    // this.filename = '';
    let filename = _file[0].name
    // this.filename = filename
    $("#filename_label").html(filename);
  }

  fileUpload(fileinput){
    const _file = this.fileinput.nativeElement.files;
    const formData = new FormData();
    let file = _file[0];
    let filename = file.name;
    console.log(file)
    formData.append('file',file,filename)
    console.log(formData)
    this.service.uploadExcel(formData).subscribe(result => {
      this.setSummary(result.data);
      this.open(this.content);
      $("#filename_label").html('');
    });
    
  }

  setSummary(summary){
    this._summary.companyname = summary.companyname;
    this._summary.stockexchange = summary.stockexchange;
    this._summary.numofimport = summary.numofimport;
    this._summary.fromdate = summary.fromdate;
    this._summary.todate = summary.todate;
  }

}

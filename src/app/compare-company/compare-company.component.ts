import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal,NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { EChartOption } from 'echarts';
import { CompareCompanyService } from "./compare-company.service";
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-compare-company',
  templateUrl: './compare-company.component.html',
  styleUrls: ['./compare-company.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: CompareCompanyComponent}
  ]
})
export class CompareCompanyComponent extends NgbDateParserFormatter implements OnInit {
    readonly DELIMITER = '-';
    parse(value: string): NgbDateStruct|null {
      if (value) {
        let date = value.split(this.DELIMITER);
        return {
          day : parseInt(date[0], 10),
          month : parseInt(date[1], 10),
          year : parseInt(date[2], 10)
        };
      }
      return null;
    }
    format(date: NgbDateStruct|null): string {
      return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
    }
    compareForm: FormGroup;
    
    
    companyname = '';
    modelfrom: NgbDateStruct;
    modelto: NgbDateStruct;
    items = [1];
    periodicity:string = "0";
    showChart = false;
    echartsIntance:any;
    xAxis_data =[];
    //xAxis_data = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    company_data = [[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]]
    series_data=[];
    options = {
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'cross',
              crossStyle: {
                  color: '#999'
              }
          }
      },
      toolbox: {
          feature: {
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
          }
      },
      legend: {
          data: []
      },
      xAxis: [
         
      ],
      yAxis: [
          {
              type: 'value',
              name: 'Price Per Share(in Rs)',
              min: 0,
              max: 500,
              interval: 50,
              axisLabel: {
                  formatter: '{value}'
              }
          },
          {
              type: 'value',
              name: 'Price',
              min: 0,
              max: 500,
              interval: 50,
              axisLabel: {
                  formatter: '{value}'
              }
          }
      ],
      series:[]
   
  }
    
    constructor(private fb: FormBuilder,public service:CompareCompanyService,private modalService: NgbModal) {
      super();
      this.compareForm= this.fb.group({
          periodicity: [''],
          fromdate: [''],
          todate: [''],
          companys: this.fb.array([
            this.fb.group({
              type:[''],
              stockexchange:[''],
              companyname:['']
            })
          ])
      });
     }
  
    get companys() {
      return this.compareForm.get('companys') as FormArray;
    }
    ngOnInit() {
      this.options.legend.data=['company1', 'company2', 'company1-Price','company2-Price'];
    }
  
    //add a company to compare
    addCompany(){
      this.companys.push(
        this.fb.group({
          type:[''],
          stockexchange:[''],
          companyname:['']
        })
      );
    }
  
    //remove a company to compare
    delCompany(){
      console.log(this.companys.length)
      this.companys.removeAt(this.companys.length-1);
    }
  
    /**
     * init chart
     * @param ec 
     */
    onChartInit(ec:any) {
      this.echartsIntance = ec; 
    } 
  
    /**
     * generate chart
     * @param compareForm 
     */
    generateChart(){
      this.service.generateChart(this.compareForm.value).subscribe(
        result =>{
          console.log(result.data)
          let chartData = result.data;
          this.company_data = [];
          for(var i in chartData){
              this.xAxis_data = [];
              let company_item = [];
              for(var j in chartData[i]){
                console.log(chartData[i][j])
                this.xAxis_data.push(chartData[i][j][0])
                company_item.push(chartData[i][j][1])
              }
              this.company_data.push(company_item)
          }
        console.log(this.xAxis_data) 
        console.log(this.company_data)
         this.series_data = [];
        this.company_data.forEach((element,index) => {
          let bar = {
            name: 'company'+(index+1),
            type: 'bar',
            data: element
          }
          let line = {
            name: 'company'+(index+1)+'-Price',
            type: 'line',
            yAxisIndex: 1,
            data: element ,
            markPoint: {
              data: [
                  {type: 'max', name: '最大值'},
                  {type: 'min', name: '最小值'}
              ]
            },
            markLine: {
                data: [
                    {type: 'average', name: '平均值'}
                ]
            }
          }
          this.series_data.push(bar);
          this.series_data.push(line);
        });
        this.options.xAxis.push({
          type: 'category',
          data: this.xAxis_data,
          axisPointer: {
              type: 'shadow'
          }
      })
        this.options.series = this.series_data;
        //this.echartsIntance.setOption(this.options);  
        if (this.echartsIntance) {
          this.echartsIntance.clear();
          this.echartsIntance.setOption(this.options, true);
        }
        this.showChart = true;
  
        }
      )
    }
  
  }
  
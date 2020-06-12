import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';

import {Company} from './company';
import {COMPANIES} from './companies';
// import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import { environment } from "../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface SearchResult {
  companies: Company[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
}

const compare = (v1: string, v2: string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function matches(company: Company, term: string) {
  return company.companyname.toLowerCase().includes(term.toLowerCase());
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _companies$ = new BehaviorSubject<Company[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  companylist:Company[];
  httpOptions = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json;charset=utf-8' },
      )
  };

  constructor(private http: HttpClient) {
    this.init();
  }

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
  };

  private _company :Company;

  init():any{
    this.getCompanies().subscribe(result =>
      //companies = sort(data, sortColumn, sortDirection)
      {
        this.companylist = result.data
        this._search$.pipe(
          tap(() => this._loading$.next(true)),
          debounceTime(200),
          switchMap(() => this._search()),
          //delay(200),
          tap(() => this._loading$.next(false))
        ).subscribe(result => {
          console.log('result'+JSON.stringify(result))
          this._companies$.next(result.companies);
          this._total$.next(result.total);
        });
    
        this._search$.next();
      }
    )
  }

  get companies$() { return this._companies$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { pageSize, page, searchTerm} = this._state;

    let companies = this.companylist;

    // 1. filter
    companies = companies.filter(company => matches(company, searchTerm));
    const total = companies.length;

    // 2. paginate
    companies = companies.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({companies, total});
  }


  getCompanies():any{
    const url = `${environment.getBaseUrl('company')}/admin/company/list`;
    return this.http.get<any>(url);
  }

  getCompany(id:number):Observable<any>{
    const url = `${environment.getBaseUrl('company')}/admin/company/list/${id}`;
    return this.http.get<any>(url);
  }
  
  addCompany(company:Company):any{
    console.log(company)
    const url = `${environment.getBaseUrl('company')}/admin/company`;
    return this.http.post<Company>(url,company,this.httpOptions).subscribe(()=>this.init());
  }

  updateCompany(company:Company):any{
    const url = `${environment.getBaseUrl('company')}/admin/company`;
    return this.http.put<Company>(url,company,this.httpOptions).subscribe(()=>this.init());
  }
}

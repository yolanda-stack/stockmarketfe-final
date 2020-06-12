import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import { Ipo } from './IPO'
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { environment } from "../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface SearchResult {
  ipodetails: Ipo[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class IpoDetailService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _ipodetail$ = new BehaviorSubject<Ipo[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private _state: State = {
    page: 1,
    pageSize: 4
  };
  ipodetaillist:Ipo[];
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {
    this.init();
   }

  get ipodetails$(){return this._ipodetail$.asObservable();  }
  get total$() { return this._total$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  init():any{
    this.getIpodetails().subscribe(result =>
      //companies = sort(data, sortColumn, sortDirection)
      {
        this.ipodetaillist = result.data
        this._search$.pipe(
          tap(() => this._loading$.next(true)),
          debounceTime(200),
          switchMap(() => this._search()),
          //delay(200),
          tap(() => this._loading$.next(false))
        ).subscribe(result => {
          console.log('result'+JSON.stringify(result))
          this._ipodetail$.next(result.ipodetails);
          this._total$.next(result.total);
        });
    
        this._search$.next();
      }
    )
  }

  private _search(): Observable<SearchResult> {
    const { pageSize, page } = this._state;
    let ipodetails = this.ipodetaillist;
    const total = ipodetails.length;

    ipodetails = ipodetails.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ipodetails, total});
  }

  getIpodetails():any{
    const url = `${environment.getBaseUrl('company')}/IpoDetail/list`;
    return this.http.get<any>(url);
  }

  getIpodetail(id:number):Observable<any>{
    const url = `${environment.getBaseUrl('company')}/IpoDetail/list/${id}`;
    return this.http.get<any>(url);
  }

  updateIpodetail(ipo:Ipo):any{
    const url = `${environment.getBaseUrl('company')}/IpoDetail`;
    alert(url)
    console.log(ipo)
    return this.http.post<Ipo>(url,ipo,this.httpOptions).subscribe(()=>this.init());
  }

}

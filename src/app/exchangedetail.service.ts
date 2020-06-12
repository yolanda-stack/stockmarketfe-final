import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import { Stockexchange } from './stockexchange';
import { STOCKEXCHANGE } from './mock-StockExhange';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { environment } from "../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface SearchResult {
  exchanges: Stockexchange[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExchangeDetailService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _exchange$ = new BehaviorSubject<Stockexchange[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private _state: State = {
    page: 1,
    pageSize: 4
  };
  stockexchangelist:Stockexchange[];
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {
    this.init();
   }

  get exchanges$(){return this._exchange$.asObservable();  }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
  }

  init():any{
    this.getStockExchanges().subscribe(result =>
      {
        this.stockexchangelist = result.data
        this._search$.pipe(
          tap(() => this._loading$.next(true)),
          debounceTime(200),
          switchMap(() => this._search()),
          //delay(200),
          tap(() => this._loading$.next(false))
        ).subscribe(result => {
          console.log('result'+JSON.stringify(result))
          this._exchange$.next(result.exchanges);
          this._total$.next(result.total);
        });
    
        this._search$.next();
      }
    )
  }

  private _search(): Observable<SearchResult> {
    const { pageSize, page } = this._state;
    let exchanges = STOCKEXCHANGE;
    const total = exchanges.length;

    exchanges = exchanges.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({exchanges, total});
  }

  getStockExchanges():any{
    const url = `${environment.getBaseUrl('exchanges')}/Exchanges/list`;
    return this.http.get<any>(url);
  }

  getStockExchange(id:number):Observable<any>{
    const url = `${environment.getBaseUrl('exchanges')}/Exchanges/list/${id}`;
    return this.http.get<any>(url);
  }

  updateStockExchange(se:Stockexchange):any{
    const url = `${environment.getBaseUrl('exchanges')}/Exchanges`;
    return this.http.put<Stockexchange>(url,se,this.httpOptions).subscribe(()=>this.init());
  }

  addStockExchange(se:Stockexchange):any{
    console.log(se)
    const url = `${environment.getBaseUrl('exchanges')}/Exchanges`;
    return this.http.post<Stockexchange>(url,se,this.httpOptions).subscribe(()=>this.init());
  }

}

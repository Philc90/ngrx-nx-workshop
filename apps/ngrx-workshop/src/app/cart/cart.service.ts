import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { CartItem } from '@ngrx-nx-workshop/api-interfaces';

@Injectable({ providedIn: 'root' })
export class CartService {
  // simple state management
  // cannot change state outside of class except with method
  private cartItemsSubject$ = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject$.asObservable();

  constructor(private readonly http: HttpClient) {}

  // methods below: like mergeMap. No control over what http request resolves first

  // multiple ways to refresh cart; you could also make sure to show latest data by making another call
  addProduct(id: string): void {
    this.http
      .post<CartItem[]>(`/api/cart/add/${id}`, {})
      .subscribe((arr) => this.cartItemsSubject$.next(arr));
  }

  removeProduct(id: string): void {
    this.http
      .post<CartItem[]>(`/api/cart/remove/${id}`, {})
      .subscribe((arr) => this.cartItemsSubject$.next(arr));
  }

  removeAll(): void {
    this.http
      .post<CartItem[]>(`/api/cart/clear`, {})
      .subscribe((arr) => this.cartItemsSubject$.next(arr));
  }

  getCartProducts(): void {
    this.http
      .get<CartItem[]>(`/api/cart/cart-content`)
      .subscribe((arr) => this.cartItemsSubject$.next(arr));
  }

  purchase(purchaseItems: CartItem[]): Observable<boolean> {
    return this.http.post<boolean>(`/api/cart/purchase`, purchaseItems);
  }
}

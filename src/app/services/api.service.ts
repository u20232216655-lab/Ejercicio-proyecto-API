import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface Producto {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  thumbnail: string;
}

interface RespuestaProductos {
  products: Producto[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
private http = inject(HttpClient);
private apiUrl = 'https://dummyjson.com/products';
 getItems(): Observable<Producto[]> {
    return this.http.get<RespuestaProductos>(this.apiUrl).pipe(
      map(respuesta => respuesta.products)
    );
  }

  createItem(data: Partial<Producto>): Observable<Producto> {
    return this.http.post<Producto>(
      'https://dummyjson.com/products/add',
      data
    );
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProducts } from '../../models/products';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    pageNo: number = 1;
    pageSize: number = 10;
    constructor(private http: HttpClient) { }

    getAllProducts(): Observable<{ products: IProducts[], totalCount: number }> {
        const uniqueParam = `cahceBuster=${new Date().getTime()}`;
		const cacheBusterUrl = `http://localhost:5237/api/Product/GetAll?pageNo=${this.pageNo}&pageSize=${this.pageSize}&${uniqueParam}`
        return this.http.get<{ products: IProducts[], totalCount: number }>(`${cacheBusterUrl}`);
    }

    getFilteredAdvertisements(data: { BrandId?: number, CatId?: number, Discount?: number, Tag?: string }): Observable<IProducts[]> {
        const uniqueParam = `cahceBuster=${new Date().getTime()}`;
		const cacheBusterUrl = `http://localhost:5237/api/Advertisement/GetFilteredAdvertisements?pageNo=${this.pageNo}&pageSize=${this.pageSize}${data.CatId ? '&CatId=' + data.CatId : ''}${data.BrandId ? '&BrandId=' + data.BrandId : ''}${data.Discount ? '&Discount=' + data.Discount : ''}${data.Tag ? '&Tag=' + data.Tag : ''}&${uniqueParam}`
        return this.http.get<IProducts[]>(`${cacheBusterUrl}`);
    }

    filterProducts(data: any): Observable<{ products: IProducts[], totalCount: number }> {
        return this.http.post<{ products: IProducts[], totalCount: number }>(`http://localhost:5237/api/Product/FilterProducts?pageNo=${this.pageNo}&pageSize=${this.pageSize}`, data);
    }

    getProductsByCategoryId(id: string): Observable<{ products: IProducts[], totalCount: number }> {
        const uniqueParam = `cahceBuster=${new Date().getTime()}`;
		const cacheBusterUrl = `http://localhost:5237/api/Product/GetProductsByCategoryId?pageNo=${this.pageNo}&pageSize=${this.pageSize}&catId=${+id}&${uniqueParam}`

        return this.http.get<{ products: IProducts[], totalCount: number }>(`${cacheBusterUrl}`);
    }

    getProductsByBrandId(id: string): Observable<{ products: IProducts[], totalCount: number }> {
        const uniqueParam = `cahceBuster=${new Date().getTime()}`;
		const cacheBusterUrl = `http://localhost:5237/api/Product/GetProductsByBrandId?pageNo=${this.pageNo}&pageSize=${this.pageSize}&brandId=${id}&${uniqueParam}`

        return this.http.get<{ products: IProducts[], totalCount: number }>(`${cacheBusterUrl}`);
    }

    getProductById(id: string): Observable<IProducts> {
        const uniqueParam = `cahceBuster=${new Date().getTime()}`;
		const cacheBusterUrl = `http://localhost:5237/api/Product/GetProductDetails?id=${id}&${uniqueParam}`

        return this.http.get<IProducts>(`${cacheBusterUrl}`);
    }

    getRecentProducts(): Observable<{ products: IProducts[], totalCount: number }> {
        const uniqueParam = `cahceBuster=${new Date().getTime()}`;
		const cacheBusterUrl = `http://localhost:5237/api/Product/GetRecentProducts?pageNo=${this.pageNo}&pageSize=${this.pageSize}&${uniqueParam}`

        return this.http.get<{ products: IProducts[], totalCount: number }>(`${cacheBusterUrl}`);
    }

    getProductByCategryName(name: string) {
        const uniqueParam = `cahceBuster=${new Date().getTime()}`;
		const cacheBusterUrl = `http://localhost:5237/api/Product/GetProdcutDetails?id=${name}&${uniqueParam}`
        return this.http.get<IProducts[]>(`${cacheBusterUrl}`);
    }

    getBestProducts(): Observable<{ products: IProducts[], totalCount: number }> {
        const uniqueParam = `cahceBuster=${new Date().getTime()}`;
		const cacheBusterUrl = `http://localhost:5237/api/Product/GetBestProducts?pageNo=${this.pageNo}&pageSize=${this.pageSize}&${uniqueParam}`
        return this.http.get<{ products: IProducts[], totalCount: number }>(`${cacheBusterUrl}`);
    }

    filterSpecificProducts(filter: any): Observable<{ products: IProducts[], totalCount: number }> {
        console.log(filter);
        
        return this.http.post<{ products: IProducts[], totalCount: number }>(`http://localhost:5237/api/Product/FilterProducts?pageNo=${this.pageNo}&pageSize=${this.pageSize}`, filter);
    }

    searchGolbal(text: string) {
        return this.http.get(`http://localhost:5237/api/Product/Search/${text}`);
    }

}

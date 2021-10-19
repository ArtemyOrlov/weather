import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ICity } from '../models/city.model';
import { IDataWeather } from '../models/hourly.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private BASE_API_KEY = environment ? environment.apiKey : null;

  constructor(private http: HttpClient) {
  }

  getCity(city: string): Observable<ICity[]> {
    const queryParams = {
      params: {
        q: city,
        limit: '1',
        appid: this.BASE_API_KEY
      }
    };

    return this.http.get<ICity[]>(`http://api.openweathermap.org/geo/1.0/direct`, queryParams).pipe(
      catchError(err => {
        return this.errorHandler(err);
      })
    );
  }

  getCityWeather(filter: string, lat: string, lon: string): Observable<IDataWeather> {
    const queryParams = {
      params: {
        lat,
        lon,
        exclude: `current,minutely,${filter === 'hourly' ? 'daily' : 'hourly'},alerts`,
        appid: this.BASE_API_KEY
      }
    };

    return this.http.get<IDataWeather>(`https://api.openweathermap.org/data/2.5/onecall`, queryParams).pipe(
      catchError(err => {
        return this.errorHandler(err);
      })
    );
  }

  errorHandler(err): Observable<any> {
    console.log('Error data: ', err);
    return throwError(err);
  }

}

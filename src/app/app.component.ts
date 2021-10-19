import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ICity } from './models/city.model';
import { IDataWeather } from './models/hourly.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  selectedFilter = 'hourly';
  filterOptions: string[] = ['hourly', 'daily'];

  currentCity: string;
  currentCityData: ICity;
  cityWeatherData: IDataWeather;

  private unsubscribe$ = new Subject();

  constructor(private dataService: DataService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
  }

  searchCity(): void {
    if (this.currentCity && this.currentCity.length >= 3) {
      this.dataService.getCity(this.currentCity)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (cities: ICity[]) => {
            if (cities.length && cities[0].name) {
              this.currentCityData = cities[0];
              this.getCityWeather(cities[0]);
            } else {
              this.snackBar.open('Sorry, city is not found', 'Ok', {duration: 2000});
            }
          }
        );
    }
  }

  getCityWeather(city: ICity): void {
    this.dataService.getCityWeather(this.selectedFilter, city.lat.toString(), city.lon.toString())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (dataWeather: IDataWeather) => {
          this.cityWeatherData = dataWeather;
          console.log(`Weather ${this.selectedFilter}: `, dataWeather);
        }
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

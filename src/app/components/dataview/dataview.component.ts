//dataview.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import  {VisData} from './src/app/VisData';

@Component({
  selector: 'app-dataview',
  templateUrl: './dataview.component.html',
  styleUrls: ['./dataview.component.css']
})
export class DataviewComponent implements OnInit {
  sensorData$!: Observable<any[]>; // Sử dụng Observable
   
  

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:3000/api/allData';

  ngOnInit(): void {
    this.sensorData$ = this.getAllDataFromApi(); // Gán Observable vào biến sensorData$
    this.sensorData$.subscribe({
      next: (data) => {
        console.log('Data from API:', data); // Log dữ liệu lấy được từ API
      },
      error: (err) => {
        console.error('Error fetching data:', err); // Log lỗi nếu có
      }
    });
  }

  getAllDataFromApi(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}

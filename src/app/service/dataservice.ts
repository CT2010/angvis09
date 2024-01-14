import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000/api/allData'; // Thay đổi URL tương ứng với địa chỉ của server Node.js

  constructor(private http: HttpClient) { }

  getAllSensorData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}

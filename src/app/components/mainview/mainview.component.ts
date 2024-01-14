//mainview.component.ts

import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import axios from 'axios';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ElementRef } from '@angular/core';
// import Chart from 'chart.js';

// import Chart
declare var Chart: any;

interface MarkerData {
  name: string;
  lat: number;
  lng: number;
};
interface Sensor {
  map(arg0: (item: { temperature: any; }) => any): unknown;
  timestamp: Date;
  temperature: number;
  humidity: number;
  uvIndex: number;
}


@Component({
  selector: 'app-mainview',
  templateUrl: './mainview.component.html',
  styleUrls: ['./mainview.component.css']
})



export class MainviewComponent implements OnInit, AfterViewInit {

  dataVis: any; // lưu giá trị data lấy về khi marker được click
  dataSensor!: Sensor; // lưu giá trị sensor khi marker được click, chỉ lưu data of sensor
  sensorData$!: Observable<any[]>; // Sử dụng Observable
  displayedResponse!: string;
  showMarkerData = false; // kiểm soát giá trị khi marker được click
  @ViewChild('temperatureChart', { static: false })
  temperatureChart!: ElementRef;

  constructor(
    private http: HttpClient,
  ) { }
  private map: any
  private xcor = 10.778628519207865; ycor = 106.6668498158686
  private xyname = "HUFLIT"



  private apiUrl = 'http://localhost:3000/api/allData';
  private apiUrl1 = 'http://localhost:3000/api/getSensorData';

  ngOnInit() {


  }
  getAllDataFromApi(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getMarker(): Observable<MarkerData[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((data: any[]) => {
        const markers: MarkerData[] = [];
        data.forEach(item => {
          if (item) {
            markers.push({
              name: item.name,
              lat: item.latitude,
              lng: item.longitude
            });
          }
        });
        return markers;
      })
    );
  }




  ngAfterViewInit() {
    this.map = L.map('map').setView([this.xcor, this.ycor], 15); //10.778628519207865, 106.6668498158686

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.sensorData$ = this.getMarker();

    this.sensorData$.subscribe((data: MarkerData[]) => {
      data.forEach((marker: MarkerData) => {
        const newMarker = L.marker([marker.lat, marker.lng])
          .addTo(this.map)
          // .bindPopup(marker.name)
          .bindTooltip(marker.name, { className: 'leaflet-tooltip', permanent: true })
          .openPopup();

        //Adding click event to the marker
        newMarker.on('click', () => {

          this.showDetailView(marker.lat, marker.lng);
          if (this.temperatureChart && this.showMarkerData) {
            const temperatureCtx = this.temperatureChart.nativeElement;
            // Tiếp tục xử lý vẽ biểu đồ ở đây
            new Chart(temperatureCtx, {
              type: 'line',
              data: {
                labels: ['1', '2', '3', '4', '5'], // Labels cho dữ liệu
                datasets: [{
                  label: 'Temperature',
                  data: this.dataSensor.temperature,
                  borderColor: 'blue',
                  borderWidth: 1,
                  fill: false
                }]
              },
              options: {
                // Các tùy chọn biểu đồ (nếu cần)
              }
            });
          } else {
            console.error('Canvas context is not available.');
          }


          L.popup({ className: 'leaflet-popup-content-wrapper' })
            .setLatLng([marker.lat, marker.lng])
            .setContent(`
            <div class="leaflet-popup-content">
              <b>Name:</b> ${marker.name}<br>
              <b>Latitude:</b> ${marker.lat}<br>
              <b>Longitude:</b> ${marker.lng}
            </div>
            `)
            .openOn(this.map);
        });
      });
    });


  };


  async showDetailView(lat: number, lon: number) {
    try {
      this.sensorData$ = this.getSensorData(lat, lon);
      this.sensorData$.subscribe({
        next: (data) => {
          // const processedData = this.convertToVisDataFormat(data);
          // const processedData = this.sensorData$.data;
          this.dataVis = data;
          this.showMarkerData = true;
          this.dataSensor = this.dataVis.data;
          console.log('Data from API:dataVis:', this.dataVis); // Log dữ liệu lấy được từ API
          console.log('Data from API:dataSensor:', this.dataSensor); // Log dữ liệu lấy được từ API
          this.renderTemperatureChart(this.dataSensor);
        },
        error: (err) => {
          console.error('Error fetching data:', err); // Log lỗi nếu có
        }
      });

      // Further processing of the sensor data

    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  }

  // Function to call the API
  getSensorData(latitude: number, longitude: number): Observable<any> {
    const params = { lat: latitude, lon: longitude };
    return this.http.get<any>(this.apiUrl1, { params });
  }
  // Function to process received data
  processData(data: any): any[] {
    // Perform any necessary data processing here
    // For example, if the received data is an array, you might manipulate or filter it
    return data; // Return the processed data
  }

  // renderTemperatureChart(dataVis: any) {
  //   const temperatureData = dataVis.data.map((sensor: any) => sensor.sensors.temperature);
  //   const timestamps = dataVis.data.map((sensor: any) => sensor.timestamp);
  //   console.log("temperatureData: ", temperatureData);
  //   console.log("timestamps:", timestamps);

  //   const temperatureCanvas: any = document.getElementById('temperatureChart');
  //   const temperatureCtx = temperatureCanvas.getContext('2d');

  //   new Chart(temperatureCtx, {
  //     type: 'bar',
  //     data: {
  //       labels: timestamps,
  //       datasets: [{
  //         label: 'Temperature',
  //         data: temperatureData,
  //         backgroundColor: 'rgba(255, 99, 132, 0.2)',
  //         borderColor: 'rgba(255, 99, 132, 1)',
  //         borderWidth: 1
  //       }]
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true
  //         }
  //       }
  //     }
  //   });
  //   console.log("biểu đồ đã chạy");
  // }
  renderTemperatureChart(dataVis: any) {
    if (this.temperatureChart) {
      // Sử dụng this.temperatureChart.nativeElement ở đây
      const nativeElement = this.temperatureChart.nativeElement;
      // ...
    }


    const temperatureCanvas: HTMLCanvasElement = this.temperatureChart.nativeElement;
    if (dataVis) {
      const temperatureData = dataVis.data.map((sensor: any) => sensor.sensors.temperature);
      const timestamps = dataVis.data.map((sensor: any) => sensor.timestamp);
      console.log("temperatureData: ", temperatureData);
      console.log("timestamps:", timestamps);

      // const temperatureCanvas: any = document.getElementById('temperatureChart');
      if (temperatureCanvas) {
        const temperatureCtx = temperatureCanvas.getContext('2d');


        new Chart(temperatureCtx, {
          type: 'bar',
          data: {
            labels: timestamps,
            datasets: [{
              label: 'Temperature',
              data: temperatureData,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
        console.log("biểu đồ đã chạy");
      } else {
        console.error('DataVis is undefined or has no data.');
      }
    }

  }


  // Chuyển đổi data nhận về sang đúng định dạng Visdata
  private convertToVisDataFormat(apiData: any): any {
    const { name, latitude, longitude, data: sensorData } = apiData;

    interface Sensor {
      timestamp: Date;
      temperature: number;
      humidity: number;
      uvIndex: number;
    }
    const formattedData = {
      name,
      latitude,
      longitude,
      data: sensorData.map((sensor: Sensor) => ({
        timestamp: sensor.timestamp,
        sensors: {
          temperature: sensor.temperature,
          humidity: sensor.humidity,
          uvIndex: sensor.uvIndex,
        },
      })),
    };

    return formattedData;
  }
}
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timestamp } from 'rxjs';
// import Chart from 'chart.js';
// import * as Chart from 'chart.js/auto';
import { Chart, registerables } from 'chart.js';
import { formatDate } from '@angular/common';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';

// Trong phương thức renderChart


Chart.register(...registerables);

const datalabels = ChartDataLabels; // bổ sung label trên mỗi điểm của bản đồ

@Component({
  selector: 'app-viewchart',
  templateUrl: './viewchart.component.html',
  styleUrls: ['./viewchart.component.css']
})
export class ViewchartComponent {
  sensorData$!: Observable<any[]>; // Sử dụng Observable



  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:3000/api/allData';
  private apiUrl1 = 'http://localhost:3000/api/getSensorData';
  lat = 10.778628519207865;
  lon = 106.66684981586859;
  dataVis: any;
  dataSen: any;
  @ViewChild('chart') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chartContext!: CanvasRenderingContext2D;



  ngOnInit(): void {
    this.sensorData$ = this.getSensorData(this.lat, this.lon); // Gán Observable vào biến sensorData$
    this.sensorData$.subscribe({
      next: (data) => {
        this.dataVis = data;
        this.dataSen = this.dataVis.data;
        console.log('Data from API - this.dataVis:', this.dataVis); // Log dữ liệu lấy được từ API
        this.renderChart();
      },
      error: (err) => {
        console.error('Error fetching data:', err); // Log lỗi nếu có
      }
    });
  }


  getSensorData(latitude: number, longitude: number): Observable<any> {
    const params = { lat: latitude, lon: longitude };
    return this.http.get<any>(this.apiUrl1, { params });
  }
  renderChart() {
    if (this.chartCanvas && this.chartCanvas.nativeElement && this.dataSen) {
      const canvas = this.chartCanvas.nativeElement;
      const context = canvas.getContext('2d');

      if (context) {
        this.chartContext = context;
        // Vẽ biểu đồ với this.chartContext ở đây
        console.log("giá trị this.dataSen: ", this.dataSen);
        try {
          new Chart(this.chartContext, {
            type: 'line',
            data: {
              labels: this.dataSen.map((data: any) => {
                const timestamp = new Date(data.timestamp);
                return formatDate(timestamp, 'dd/MM/yyyy', 'en-US'); // Định dạng ngày tháng năm
              }),
              //labels: this.dataSen.map((data: any, index: number) => data.timestamp.toString()), //["đ","đ","dd","đ"],
              datasets: [{
                label: 'Temperature',
                data: this.dataSen.map((data: any) => {
                  const temp = data.sensors.temperature;
                  // console.log("data.temperature: ",data.sensor.temperature);
                  return temp;
                }),
                borderColor: 'blue',
                borderWidth: 1,
                fill: false
              }
                ,
              {
                label: 'Humidity',
                data: this.dataSen.map((data1: any) => data1.sensors.humidity),
                borderColor: 'green',
                borderWidth: 1,
                fill: false
              }
              ],



              // You can add more datasets for other data points like humidity, timestamp, etc.
            },
            options: {
              // Add any specific options for the chart
              plugins: {

                tooltip: {
                  mode: 'index',
                  intersect: false
                },

              }

            },
          });

        } catch (error) {
          console.error('Error rendering chart:', error);
        }
      }
    }
  }
}

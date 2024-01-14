import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-adminview',
  templateUrl: './adminview.component.html',
  styleUrls: ['./adminview.component.css']
})
export class AdminviewComponent {
  locationName: string = '';
  latitude: any | 10.7786;
  longitude: any | 106.6668;
  data = {
    timestamp: new Date('2023-12-29T12:00:00Z'),
    sensors: {
      temperature: 25.5,
      humidity: 60,
      uvIndex: 7,
    },
  };
  message: string = ''; // Biến để lưu thông báo
  success: boolean = true; // Biến để kiểm soát màu sắc của thông báo

  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:3000/api/addLocation';

  addLocation(): Observable<any> {
    const newLocation = {
      name: this.locationName,
      latitude: this.latitude,
      longitude: this.longitude,
      data: [this.data] // Khởi tạo mảng dữ liệu cảm biến trống
    };
    return this.http.post<any>(this.apiUrl, newLocation);
  }

  onSubmit(): void {
    this.addLocation().subscribe({
      next:(response) => {
        console.log('Location added successfully', response);
        this.message = response.message; // Gán thông báo từ server vào biến message
        this.success = true; // Đặt màu sắc cho thông báo thành công
      },
      error: (error) => {
        if (error.status === 400) {
          this.message = error.error.error; // Gán thông báo lỗi từ server vào biến message
          this.success = false; // Đặt màu sắc cho thông báo lỗi
        } else {
          this.message = 'Có lỗi xảy ra. Vui lòng thử lại sau.'; // Thông báo lỗi mặc định
        }
        console.error('Error adding location', error);
      }}
    );
  }
  
  // gọi phương thức xóa
  // onDelete(): void {
  //   // Call your delete function here or handle the logic to delete the location
  //   // For example, you can call a deleteLocation() method from your service
  //   // and pass the necessary parameters (locationName, id, latitude, longitude)
  //   this.http.delete(this.locationName, this.id, this.latitude, this.longitude).subscribe(
  //     response => {
  //       // Handle success response
  //       this.message = 'Đã xóa địa điểm thành công!';
  //       this.success = true;
  //       // You might want to reset the form fields after deletion
  //       this.resetFormFields();
  //     },
  //     error => {
  //       // Handle error response
  //       this.message = 'Lỗi khi xóa địa điểm.';
  //       this.success = false;
  //     }
  //   );
  // }
  onDelete(): void {
    const deleteUrl = `http://localhost:3000/api/deleteData/${this.locationName}/${this.latitude}/${this.longitude}`;
  
    this.http.delete(deleteUrl).subscribe({
      next: () => {
        this.message = 'Đã xóa địa điểm thành công!';
        this.success = true;
        this.resetFormFields();
      },
      error: (error) => {
        this.message = 'Lỗi khi xóa địa điểm.';
        this.success = false;
      }}
    );
  }

  resetFormFields(): void {
    // Reset form fields after successful deletion
    this.locationName = "";
    this.latitude ;
    this.longitude;
  }
   
  }



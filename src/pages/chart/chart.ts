import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html',
})
export class ChartPage {

  barChart: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

 // Doughnut
 public doughnutChartLabels: string[] = ['0 - 25', '26-45', '45+'];
 public doughnutChartDataGeneral: number[] = [200, 300, 550];
 public doughnutChartType: string = 'doughnut';

 public doughnutChartData1: number[] = [120, 100, 50];
 public doughnutChartData2: number[] = [50, 100, 250];
 public doughnutChartData3: number[] = [30, 100, 250];

  // Line chart
  public lineChartData: Array<any> = [
    { data: [10, 35, 45, 55], label: 'Architectomies' },
    { data: [0, 35, 60, 35], label: 'Fuyuki Yamakawa' },
    { data: [20, 40, 45, 50], label: 'Kazuyo Sejima & Yuko Hasegawa' }
  ];
  public lineChartLabels: Array<any> = ['23 Oct', '30 Oct', '6 Nov', '13 Nov'];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(66, 134, 244,0.2)',
      borderColor: 'rgba(66, 134, 244,1)',
      pointBackgroundColor: 'rgba(66, 134, 244,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(66, 134, 244,0.8)'
    },
    {
      backgroundColor: 'rgba(34, 112, 16,0.2)',
      borderColor: 'rgba(34, 112, 16,1)',
      pointBackgroundColor: 'rgba(34, 112, 16,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(34, 112, 16,1)'
    },
    {
      backgroundColor: 'rgba(244, 175, 65,0.2)',
      borderColor: 'rgba(244, 175, 65,1)',
      pointBackgroundColor: 'rgba(244, 175, 65,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(244, 175, 65,0.8)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

}

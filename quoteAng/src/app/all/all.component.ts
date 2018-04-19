import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.css']
})
export class AllComponent implements OnInit {
  authors = [];
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _httpService: HttpService
  ) { }

  ngOnInit() {
    this.getAuthors();
  }

  getAuthors(){
    let observable = this._httpService.getAllAuthors();
    observable.subscribe(data => {
      console.log('Got our authors!', data);
      this.authors = data['data'];
    });
  }

}

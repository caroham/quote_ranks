import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  message = "";
  author= {};
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _httpService: HttpService
  ) { }

  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
      console.log(params['id']);
      let observable = this._httpService.getSingleAuthor(params['id']);
      observable.subscribe(data => {
        if(data['message'] == "Success") {
          console.log('got the author', data);
          this.author = data['data'];
        } else {
          this.message = data['error']['message']
        }
      });
    });
  }

  editAuthor(id, name) {
    console.log("In edit author, author: ", name);
    let author = {'name': name};
    let observable = this._httpService.editAuthor(id, author);
    observable.subscribe(data => {
      console.log('new author data: ', data);
      if(data['message'] == "Success"){
        this.goHome();
      } else {
        this.message = data['error']['message'];
      }
    });
  }

  goHome() {
    this._router.navigate(['/']);
  }
}

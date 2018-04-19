import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router} from '@angular/router';


@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {
  message = "";
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _httpService: HttpService
  ) { }

  ngOnInit() {
  }

  newAuthor(name){
    console.log("In new author, author: ", name);
    let author = {name: name};
    let observable = this._httpService.addAuthor(author);
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

import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {
  author = {_id: ""};
  message = "";
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _httpService: HttpService
  ) { }

  ngOnInit() {
    this.getAuthor();
  }

  getAuthor(){
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

  voteUp(quoteId){
    let vote = 1;
    let observable = this._httpService.updateVote(this.author._id, quoteId, vote);
    observable.subscribe(data => {
      if(data['message'] == "Success") {
        console.log("success");
        this.getAuthor();
      } else {
        this.message = data['error']['message']
      }
    });
  }

  voteDown(quoteId, idx){
    let vote = -1;
    let observable = this._httpService.updateVote(this.author._id, quoteId, vote);
    observable.subscribe(data => {
      if(data['message'] == "Success") {
        console.log("success");
        this.getAuthor();
      } else {
        this.message = data['error']['message']
      }
    });
  }

  delete(quoteId){
    let authorId = this.author._id;
    console.log('in delete: author id: ', authorId, " quote id: ", quoteId);
    let observable = this._httpService.deleteQuote(authorId, quoteId);
    observable.subscribe(data => {
      if(data['message'] == "Success") {
        console.log('delete successful');
        this.getAuthor();
      } else {
        console.log('in error');
        this.message = data['error']['message']
      }
    })
  }


}

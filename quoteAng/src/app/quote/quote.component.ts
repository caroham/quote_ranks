import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements OnInit {
  author = {_id: ""};
  message = "";
  quote = "";
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

  newQuote(quote){
    let quoteObj = {quote: quote};
    let observable = this._httpService.addQuote(this.author._id, quoteObj);
    observable.subscribe(data => {
      if(data['message'] == "Success") {
        console.log('saved the quote!');
        this.backtoAuthor(this.author._id);
      } else {
        this.message = data['error']['message']
      }
    });
  }

  backtoAuthor(id) {
    this._router.navigate(['quotes/' + id]);
  }

}

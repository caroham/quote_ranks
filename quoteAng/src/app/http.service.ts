import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpService {

  constructor(private _http: HttpClient) { }

  getAllAuthors(){
    return this._http.get('/authors');
  }

  addAuthor(name) {
    return this._http.post('/authors', name);
  }

  editAuthor(id, name) {
    return this._http.put('/authors/' + id, name);
  }

  getSingleAuthor(id) {
    return this._http.get('/authors/' + id);
  }

  deleteQuote(authorId, quoteId){
    
    return this._http.delete('/authors/'+ authorId + "/delete/"+quoteId);
  }

  addQuote(authorId, quote){
    return this._http.put('/authors/'+authorId+'/new', quote);
  }

  updateVote(authorId, quoteId, vote){
    let body = {vote: vote};
    return this._http.put('/authors/'+ authorId + "/update/"+quoteId, body)
  }
}

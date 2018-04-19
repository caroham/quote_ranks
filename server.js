const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + '/quoteAng/dist')));

mongoose.connect('mongodb://localhost/quotes_db');

let AuthorSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Name is required"], minlength: [3, "Name must be at least 3 characters"], unique: true},
    quotes: [{
                quote: {
                         type: String, 
                         required: [true, "Quote is required"], 
                         minlength: [3, "Quote must be at least 3 characters"]}, 
                 vote: {
                         type: Number, 
                         default: 0
                       }
            }]
}, {timestamps: true});

AuthorSchema.plugin(uniqueValidator);
mongoose.model('Author', AuthorSchema);

let Author = mongoose.model('Author');

app.get('/authors', function(req, res){
    Author.find({}, function(err, authors){
        if(err){
            console.log("returned error", err);
            res.json({message: "Error", error: err});
        } else {
            res.json({message: "Success", data: authors});
        }
    });
});

app.post('/authors', function(req, res){
    var newAuthor = new Author({name: req.body.name});
    newAuthor.save(function(err){
        if(err){
            console.log("returned error", err);
            res.json({message: "Error", error: err});
        } else {
            res.json({message: "Success"});
        }
    });
});

// getting author
app.get('/authors/:id', function(req, res){
    Author.findOne({_id: req.params.id}, function(err, author){
        if(err){
            console.log("returned error", err);
            res.json({message: "Error", error: err});
        } else {
            console.log("sucessfully retrieved author: ", author);
            author.quotes.sort(function(a,b) {return (a.vote < b.vote) ? 1 : ((b.vote < a.vote) ? -1 : 0);} );
            console.log("after sorted: ", author);
            res.json({message: "Success", data: author});
        }
    });
});

// edit author's name
app.put('/authors/:id', function(req, res){
    Author.findOne({_id: req.params.id}, function(err, author){
        if(err){
            console.log("returned error", err);
            res.json({message: "Error", error: err});
        } else {
            author.name = req.body.name;
            author.save(function(err){
                if(err){
                    console.log("returned error", err);
                    res.json({message: "Error", error: err});
                } else {
                    res.json({message: "Success"});
                }
            });
        }
    });
});


// add quote
app.put('/authors/:authorid/new', function(req, res){
    Author.findOne({_id: req.params.authorid}, function(err, author){
        if(err){
            console.log("returned error", err);
            res.json({message: "Error", error: err});
        } else {
            author.quotes.push({quote: req.body.quote});
            author.save(function(err){
                if(err){
                    console.log("returned error", err);
                    res.json({message: "Error", error: err});
                } else {
                    res.json({message: "Success"});
                }
            });
        }
    });
});

// update vote
app.put('/authors/:authorid/update/:quoteid', function(req, res){
    console.log('in update vote: ', req.body);
    Author.findOne({_id: req.params.authorid}, function(err, author){
        if(err){
            console.log("returned error", err);
            res.json({message: "Error", error: err});
        } else {
            console.log("in else, author quotes of 0: ", author.quotes[0])
            for (let i=0; i<author.quotes.length; i++){
                if (author.quotes[i]._id == req.params.quoteid){
                    author.quotes[i].vote += req.body.vote;
                }
            }
            author.markModified('quotes');
            author.save(function(err){
                if(err){
                    console.log("returned error", err);
                    res.json({message: "Error", error: err});
                } else {
                    res.json({message: "Success"});
                }
            });
        }
    });
});

// delete quote
app.delete('/authors/:authorid/delete/:quoteid', function(req, res){
    console.log("in put, here are the params: ", req.params);
    Author.findOne({_id: req.params.authorid}, function(err, author){
        if(err){
            console.log("returned error", err);
            res.json({message: "Error", error: err});
        } else {
            console.log('got author: ', author);
            author.quotes.pull({_id: req.params.quoteid});
            author.save(function(err){
                if(err){
                    console.log("returned error", err);
                    res.json({message: "Error", error: err});
                } else {
                    res.json({message: "Success"});
                }
            });
        }
    });
});


app.all('*', (req, res, next) => {
    res.sendFile(path.resolve('./quoteAng/dist/index.html'));
});

app.listen(8000, function(){
    console.log("listening on port 8000");
});
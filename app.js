const http = require('http'),
path = require('path'),
express = require('express'),
bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const db = new sqlite3.Database(':memory:');
db.serialize(function () {
 db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
 db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
 db.run("INSERT INTO user VALUES ('adelgado', 'test1', 'Administrator')");
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });

app.post('/login', function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let query = "SELECT title FROM user WHERE username = '" + username + "' AND password = '" + password + "'";
    // res.send(`Username: ${username} Password: ${password}`);

    // console.log(`Username: ${username} Password: ${password} Query: ${query}`)
    console.log('Username: ' + username);
    console.log('Password: ' + password);
    console.log('Query: ' + query);

    db.get(query, function (err, row) {

		if (err) {
			console.log('ERROR', err);
			res.redirect("/index.html#error");
		} else if (!row) {
			res.redirect("/index.html#unauthorized");
		} else {
			res.send('Hello <b>' + row.title + '!</b><br /> This file contains all your secret data: <br /><br /> SECRETS <br /><br /> MORE SECRETS <br /><br /> <a href="/index.html">Go back to login</a>');
		}
	});

});

app.listen(3001);
console.log('Server started at http://localhost:3001');



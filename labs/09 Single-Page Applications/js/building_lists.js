
var request = new XMLHttpRequest();
request.open('GET', 'data/books.json', false);
request.send(null);
var data = JSON.parse(request.responseText);
console.log(data);

var books = data.books;

var list = document.createElement('table');
for (var i=0; i < books.length; i++) {
	console.log(books[i].title);
	var item = document.createElement('tr');
	var year = document.createElement('td');
	var isbn = document.createElement('td');
	var author = document.createElement('td');

	item.innerHTML = books[i].title;
	isbn.innerHTML = books[i].isbn;
	year.innerHTML = books[i].year;
	author.innerHTML = books[i].authors;
	list.appendChild(item);
	list.appendChild(year);
	list.appendChild(isbn);
	list.appendChild(author);
}
document.body.appendChild(list);

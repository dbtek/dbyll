(function () {
/*
## Display the results
*/

  function displaySearchResults (results, store) {
    var searchResults = document.getElementById ('search-results');

    if (results.length) {
      var appendString = '<h2>Here what you get. Tada</h2>';

      for (var i = 0; i < results.length && i < 15; i++) {
        var item = store[results[i].ref];
        appendString += '<li><h3><a href="' + item.url + '">' + item.title + '</a></h3>';
        appendString += '<p>' + item.description.substring(0, 150) + ' ...</p></li>';
      }

      searchResults.innerHTML = appendString;
    }
    else {
      searchResults.innerHTML = '<h2>Not found. There must be an issue with your keyboard. Please fix it first.</h2>';
    }
  }
/*
## Get the search term from submit named 'search'.
*/
  function getQueryVariable (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

  var searchTerm = getQueryVariable ('query');

/*
## Peform the search
*/

  if (searchTerm) {
    document.getElementById('search-box').setAttribute("value", searchTerm);

    // Initalize lunr with the fields it will be searching on. I've given title
    // a bost of 10 to indeicate matches on this field are more important.

    var idex_item = lunr(function () {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('author');
      this.field('categories');
      this.field('description');
      this.field('content');
    });

    for (var key in window.store) {
      idex_item.add({
        'id': key,
        'title': window.store[key].title,
        'author': window.store[key].author,
        'categories': window.store[key].categories,
        'description': window.store[key].description,
        'content': window.store[key].content
      });

    var results = idex_item.search (searchTerm);
    displaySearchResults (results, window.store);
    }
  }
})();


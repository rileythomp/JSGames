// Builds URL to make request with
let urlBuilder = function (amount, category, difficulty, type) {
    var url = 'https://opentdb.com/api.php?'
    url += 'amount='+amount+''
    if (category != 'any') {
        url += '&category='+category+''
    }
    if (difficulty != 'any') {
        url += '&difficulty='+difficulty+''
    }
    if (type != 'any') {
        url += '&type='+type+''
    }
    return url
}

// Modified from https://gist.github.com/andrei-m/982927
/*
Copyright (c) 2011 Andrei Mackenzie
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
// Compute the edit distance between the two given strings
let levenshtein = function(a, b){
    if(a.length == 0) return b.length; 
    if(b.length == 0) return a.length; 
    var matrix = [];
    // increment along the first column of each row
    var i;
    for(i = 0; i <= b.length; i++){
      matrix[i] = [i];
    }
    // increment each column in the first row
    var j;
    for(j = 0; j <= a.length; j++){
      matrix[0][j] = j;
    }
    // Fill in the rest of the matrix
    for(i = 1; i <= b.length; i++){
      for(j = 1; j <= a.length; j++){
        if(b.charAt(i-1) == a.charAt(j-1)){
          matrix[i][j] = matrix[i-1][j-1];
        } else {
          matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                  Math.min(matrix[i][j-1] + 1, // insertion
                                           matrix[i-1][j] + 1)); // deletion
        }
      }
    }
    return a.slice(0, -2) == b.slice(0, -1) ? 2 : matrix[b.length][a.length];
  };

  // Gives cateogory name based on category Id
  let getCategory = function(categoryId) {
    switch(categoryId) {
      case "any":
        return "All categories"
      case "9":
        return "General Knowledge"
      case "9":
        return "General Knowledge"
      case "10":
        return "Entertainment: Books"
      case "11":
        return "Entertainment: Films"
      case "12":
        return "Entertainment: Music"
      case "13":
      return "Entertainment: Musicals & Theatres"
      case "14":
        return "Entertainment: Television"
      case "15":
        return "Entertainment: Video Games"
      case "16":
        return "Entertainment: Board Games"
      case "17":
        return "Science & Nature"
      case "18":
        return "Science: Computers"
      case "19":
        return "Science: Mathematics"
      case "20":
        return "Mythology"
      case "21":
        return "Sports"
      case "22":
        return "Geography"
      case "23":
        return "History"
      case "24":
        return "Politics"
      case "25":
        return "Art"
      case "26":
        return "Celebrities"
      case "27":
        return "Animals"
      case "28":
        return "Vehicles"
      case "29":
        return "Entertainment: Comics"
      case "30":
        return "Science: Gadgets"
      case "31":
        return "Entertainment: Japanese Anime & Manga"
      case "32":
       return "Entertainment: Cartoon & Animations"
    }
  }
console.log("this is the starting");

//constructor
function Book(name, author,type)
{
this.name = name;
this.author = author;
this.type = type;
}

//Display constructor
function Display()
{


}

//Add methods to display prototype
Display.prototype.add = function(book){
   console.log("adding to ui");
   tablebody = document.getElementById('tablebody');
   let uistring = `<tr>
                       <td>${book.name}</td>
                      <td>${book.author}</td>
                      <td>${book.type}</td>
                  </tr>`;
                  tablebody.innerHTML += uistring;
}


Display.prototype.clear = function(){
   let libraryform = document.getElementById('libraryform');
   libraryform.reset();
}


//Add book using event listener
let libraryform = document.getElementById('libraryform');
libraryform.addEventListener('submit', libraryformsubmit);

function libraryformsubmit(e)
{
   // e.preventDefault();
console.log('you have submitted the library form');
let name = document.getElementById('bookname').value;
let author = document.getElementById('author').value;
let friction = document.getElementById('friction');
let programming = document.getElementById('programming');
let science = document.getElementById('science');
let type;
if(friction.checked)
{
type =friction.value;
}
else if(programming.checked)
{
type = programming.value;
}
else if(science.checked)
{
type = science.value;
}
let book = new Book(name, author,type);
console.log(book);

let display = new Display();
display.add(book);
display.clear();


e.preventDefault();
}


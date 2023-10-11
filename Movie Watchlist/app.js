//Api http://www.omdbapi.com/

const movieContainer = document.getElementById('movieContainer')
const movieSearch = document.getElementById('movieSearch')
const btnSearch = document.getElementById('btnSearch')
const searchPage = document.getElementById('searchPage')
const watchListPage = document.getElementById('watchListPage')

let myWatchList = JSON.parse(localStorage.getItem('My movies')) || [];

document.querySelector('body').addEventListener('click',function(e){
    if(e.target.classList.value === "btnAdd"){
        addMovieToWatchList(e)
    }
    else if(e.target.classList.value === "btnRemove"){
        removeMovieToWatchList(e) 
    }
})

watchListPage.addEventListener('click', function(){
    movieContainer.innerHTML = ""
    btnSearch.style.display="none"
    movieSearch.style.display="none"
    displayWatchList()
    
})

searchPage.addEventListener('click', function(){
    movieContainer.innerHTML = ""
    movieSearch.value = ""
    btnSearch.style.display="block"
    movieSearch.style.display="block"
})


btnSearch.addEventListener('click', function(){
    movies()
    movieDescription()
    displayMovies()
})

function movies(){
    fetch(`https://www.omdbapi.com/?apikey=8181bdd&s=${movieSearch.value}}`)
    .then(response => response.json())
    .then(data => {
        try{
            data.Search.map(function(data){
                movieDescription(data)  
                movieContainer.innerText = ""
            })
        }
        catch(error){
            movieContainer.innerHTML = `
            <div class="errorMessage">
                <p>Please enter in the correct movie name!</p> <br>
                <img class="gif" src="Images/Gif.gif"/>
            </div>
            `
        }
       
      
    }) 
}

function movieDescription(data){
    fetch(`https://www.omdbapi.com/?apikey=8181bdd&t=${data.Title}&plot=short}`)
    .then(response => response.json())
    .then(data => {
            const  poster = data.Poster
            const title = data.Title
            const rating = data.imdbRating
            const rated = data.Rated
            const time = data.Runtime
            const genre = data.Genre
            const plot = data.Plot
            const movieId = data.imdbID
            displayMovies(poster, title, rating, time, genre, plot, rated, movieId)
            button(movieId)
    }) 
}

function button(movieId){
    myWatchList.map((data) =>{
        if(data === movieId){
            return document.getElementById(`${movieId}`).disabled = true
        }
    })

}

function displayMovies(poster, title, rating, time, genre, plot, rated, movieId){
    movieContainer.innerHTML += `
        <div class="individualMovieContainer">
            <img class="posters" src=${poster} />
            <div>
                <div class="title">
                    <h2>${title}</h2>
                    <h2>⭐${rating}</h2>
                </div>
                <div class="ratingAndTimeContainer">
                    <h3>${rated}</h3>|
                    <h3>${time}</h3>|
                    <h3 class="genre">${genre}</h3>
                </div>
                <button class="btnAdd" id="${movieId}">+ WatchList</button>
                <p class="plot">${plot}</p>
            </div>
        </div>
    `
}

function displayWatchList(){
    myWatchList.map((data) => {
        fetch(`https://www.omdbapi.com/?apikey=8181bdd&i=${data}&plot=short}`)
        .then(response => response.json())
        .then(data => {
            movieContainer.innerHTML += `
            <div class="individualMovieContainer">
                <img class="posters" src=${data.Poster} />
                <div>
                    <div class="title">
                        <h2>${data.Title}</h2>
                        <h2>⭐${data.imdbRating}</h2>
                    </div>
                    <div class="ratingAndTimeContainer">
                        <h3>${data.Rated}</h3>|
                        <h3>${data.Runtime}</h3>|
                        <h3 class="genre">${data.Genre}</h3>
                    </div>
                    <button class="btnRemove" id="${data.imdbID}">- Remove</button>
                    <p class="plot">${data.Plot}</p>
                </div>
        </div>
        `   
        }) 
    })
}


function addMovieToWatchList(e){
    myWatchList.push(e.target.id)
    e.target.disabled = true
    localStorage.setItem('My movies', JSON.stringify(myWatchList))
}

function removeMovieToWatchList(e){
    myWatchList = myWatchList.filter(item => item !== e.target.id);
    localStorage.setItem('My movies', JSON.stringify(myWatchList)) 
    e.target.disabled = false
    movieContainer.innerHTML = ""
    displayWatchList()
}


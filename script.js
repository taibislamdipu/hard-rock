

const form = document.getElementById('form');
const search = document.getElementById('search-box');
const result = document.getElementById('result');
const displayLyrics = document.getElementById('song-lyrics');

const api = 'https://api.lyrics.ovh';

form.addEventListener('submit', event => {
    event.preventDefault();

    const searchValue = search.value;

    if (searchValue == '') {
        alert('Please type a song name first.\nExample: Right Here Waiting')
    }
    else {
        result.innerHTML = '';
        searchSong(searchValue);

    }

})

// searching song based on user input
function searchSong(searchValue) {
    fetch(`${api}/suggest/${searchValue}`)
        .then(res => res.json())
        .then(data => {

            console.log(data);

            for (let i = 0; i < 10; i++) {
                result.innerHTML +=
                    `<div class="single-result row align-items-center my-3 p-3">
                     <div class="col-md-9 col-7">
                         <h3 id="song-title">${data.data[i].title}</h3>
                         <b>Duration: <span>${"0" + Math.floor(data.data[i].duration / 60) + ' Minutes'}</span></b>
                         <p>Album by <span>${data.data[i].artist.name}</span></p>
                         <img src="${data.data[i].album.cover_small}" />
                         <a href="${data.data[i].preview}"><img src="images/download.jpg" title="Download MP3" alt="Download MP3" style="width: 35px;"> </a>
                     </div>
                     <div class="col-md-3 col-5">
                         <button class="btn btn-success lyric-btn font-weight-bold" artist-name="${data.data[i].artist.name}" song-name="${data.data[i].title}">Get Lyrics</button>
                     </div>
                       </div>`
                    ;
            }
        })

}

// get song lyrics
async function getLyrics(artist, songTitle) {
    const res = await fetch(`https://api.lyrics.ovh/v1/${artist}/${songTitle}`);
    const data = await res.json();
    const lyrics = data.lyrics;

    if (lyrics == undefined) {
        displayLyrics.innerHTML =
            `<div class="single-lyrics text-center">
                 <h2 class="text-success mb-4">${songTitle} by ${artist}</h2>
                 <pre class="lyric" style="color:red; font-size: 20px;"> Currently this lyrics is not available in our library!
                 </pre>
                 </div>`
            ;
    } else {
        document.getElementById('song-lyrics').innerHTML =
            `<div class="single-lyrics text-center">
                 <h2 class="text-success mb-4">${artist} - ${songTitle}</h2>
                 <pre style="color:white; font-size: 20px; text-align:center;">${lyrics}</pre>
                 </div>`
            ;
    }

}

// set song lyrics
result.addEventListener('click', event => {
    const clickedItem = event.target;
    if (clickedItem.tagName === 'BUTTON') {
        const artist = clickedItem.getAttribute('artist-name');
        const songTitle = clickedItem.getAttribute('song-name');
        console.log(artist, songTitle);

        getLyrics(artist, songTitle);
    }
})
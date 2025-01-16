

const apiKey = '27bb7331';
const searchForm = document.getElementById('searchForm');
const resultsDiv = document.getElementById('results');
const paginationDiv = document.getElementById('pagination');
const detailsDiv = document.getElementById('details');

let currentPage = 1;
let currentSearch = '';
let currentType = '';
let isFetching = false; // Yükleme durumu kontrolü

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    currentPage = 1;
    currentSearch = document.getElementById('title').value;
    currentType = document.getElementById('type').value;
    await fetchMovies(currentSearch, currentType, currentPage);
});

function showLoader() {
    resultsDiv.innerHTML = '<div class="loader"><img src= "simge.png" style="width: 40px;height: 40px;"></div>';
   
}


function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) loader.remove();
}



async function fetchMovies(title, type, page) {
    if (isFetching) return; // Zaten yükleniyorsa yeni istek yapılmasın
    isFetching = true; // Yükleme durumunu başlat
    showLoader(); // Yükleme simgesini göster

    try {
        const url = `https://www.omdbapi.com/?s=${title}&type=${type}&page=${page}&apikey=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        hideLoader(); // Yükleme simgesini kaldır
        isFetching = false; // Yükleme durumu bitti

        if (data.Response === 'True') {
            resultsDiv.innerHTML = ''; // Önceki filmleri temizle
            displayMovies(data.Search); // Yeni filmleri göster
            currentPage++; // Sayfayı artır
            setupPagination(); // Pagination'ı yeniden kur
        } else {
            paginationDiv.innerHTML = '<p>Tüm filmler yüklendi.</p>'; // Daha fazla film yok
        }
    } catch (error) {
        console.error('Hata:', error);
        hideLoader(); // Yükleme simgesini kaldır
        isFetching = false; // Yükleme durumu sıfırla
    }
}

function setupPagination() {
    // Pagination alanını temizle
    paginationDiv.innerHTML = '';

    // "More" butonunu ekle
    const loadMoreButton = document.createElement('button');
    loadMoreButton.id = 'loadMore';
    loadMoreButton.textContent = 'More'; // Buton metni
    paginationDiv.appendChild(loadMoreButton); // Butonu ekle

    // Butona tıklama işlevi ekle
    loadMoreButton.addEventListener('click', () => {
        fetchMovies(currentSearch, currentType, currentPage);
    });
}


function displayMovies(movies) {
    resultsDiv.innerHTML += movies.map(movie => `
        <div class="movie">
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            <button onclick="fetchDetails('${movie.imdbID}')">Details</button>
        </div>
    `).join('');
}



async function fetchDetails(imdbID) {
    const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    const detailsContent = `
                <h2>${data.Title} (${data.Year})</h2>
                <p><strong>Genre:</strong> ${data.Genre}</p>
                <p><strong>Director:</strong> ${data.Director}</p>
                <p><strong>Actors:</strong> ${data.Actors}</p>
                <p><strong>Plot:</strong> ${data.Plot}</p>
                <img src="${data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/150'}" alt="${data.Title}">
            `;

    // Yeni pencere aç
    const newWindow = window.open("", "_blank", "width=400,height=600");
newWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>${data.Title} - Details</title>
    </head>
    <body>
        ${detailsContent}
    </body>
    </html>
`);

function moveWindow(newWindow) { 
    if (newWindow) { 
        newWindow.moveTo(700, 400);  // Moves the window to the coordinates (200, 200) on the screen
    } 
}

    function resizeWindow() { 
        if (newWindow) { 
            newWindow.resizeTo(600, 800);  // Pencereyi yeniden boyutlandır 
        } 
    } 
    // Call the moveWindow function to actually move the window

    newWindow.document.close();
    moveWindow(newWindow);
    resizeWindow(newWindow);

}
function showLoader() {
   
    paginationDiv.innerHTML = '<div class="loader"><img src= "simge.png" style="width: 40px;height: 40px;"></div>';
}


function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) loader.remove();
}   



       

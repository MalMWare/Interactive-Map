let coords = []
let map = null
let resultMarkers = []

//coords of the user 
async function getCoords(){
    let position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })   
    return [position.coords.latitude, position.coords.longitude]
}

function currentPos() {
    let latitude =coords[0];
    let longitude = coords[1];

    //conversion of latitude and longitude for Leaflet 
    const latLong = L.latLng(latitude, longitude)
    map = L.map('map').setView(latLong, 12);

    // add openstreetmap tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 10,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })
    .addTo(map);
    
    //add current location marker 
    const marker = L.marker(latLong)
    marker
        .addTo(map)
        .bindPopup('<p><b>You are here.</b></p>')
        .openPopup()
}

//adding foursquare api
async function foursquare(place) {
    const options = {
        method: 'GET',
        headers: {
        accept: 'application/json',
        Authorization: 'fsq3794rFM5BBOqvWpNzOkSwmJHDWMKtlIwO1qsNNBQjSl4='
        }
    };
    
    let e = await fetch(`https://api.foursquare.com/v3/places/search?query=${place}&ll=${coords[0]}%2C${coords[1]}&radius=20000&sort=DISTANCE&limit=5`, options)
        .then(response => response.json())
        .catch(err => console.error(err));
    // this is to help me find out why e is an object -- console.log(e)

    // adding markers and reading data to add to markers
    e.results.forEach(element => {
        let latLong = L.latLng(element.geocodes.main.latitude, element.geocodes.main.longitude)
        let marker = L.marker(latLong).addTo(map)
        marker.bindPopup(`<p><b>${element.name}</b></p>`)
        resultMarkers.push(marker)
    })

    console.log(resultMarkers)
}

function removeMarkers(){
    resultMarkers.forEach(marker => {
        marker.remove()
    })
    resultMarkers = []
}

//place's submit button
document.getElementById('btn').addEventListener('click', async (event) => {
	event.preventDefault()
    removeMarkers()
	let place = document.getElementById('places').value
	foursquare(place)
})

window.onload = async () => {
    coords = await getCoords()
    currentPos()
}
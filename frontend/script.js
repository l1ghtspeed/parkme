var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.421686, lng: -75.683907},
    zoom: 15
  });

  loadMapVals(map);
}


async function loadMapVals(map){
    let mapData;
    await $.ajax({
        url: 'http://localhost:3000',
        cache: false,
        success: (data) => mapData = data,
        error: ()=> console.log('Could Not Get Map Data')
    });
    addMarkers( map, mapData.ottawa );
}

var infoWindowArray = [];

async function addMarkers(map, markers){
    var markerArray = []; 
    let i = 0;
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    var contentString;
    for (var street in markers){
    	
        markerArray[i] = new google.maps.Marker({
            map: map,
            position: {lat: markers[street].longitude, lng: markers[street].latitude},
            icon: './src/parkingicon.png',
            title: `Parking at ${street}`
        });
        var x = String(street);       
        x = x.charAt(0).toUpperCase() + x.slice(1);
        contentString = `

        	<h2>${x} Street</h2>
            <h3><b>Free Parking Time</b></h3>
            <p>${markers[street].start}:00 to ${markers[street].end}:00</p>
            <h3><b>Max Parking Duration<b></h3>
            <p>${markers[street].duration} minutes<p>
        `;

        infoWindowArray[i] = new google.maps.InfoWindow({
            content: contentString
        });

        //infoWindowArray[i].open(map, markerArray[i]);
        i++;
    }

    for (let k = 0; k < markerArray.length; k++){
        markerArray[k].addListener('click', function() {
            infoWindowArray[k].open(map, markerArray[k]);
        });
    }
}
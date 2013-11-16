////////// If the browser doesn't support Geolocation, it renders the San Francisco Map
function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(37.7749300, -122.4194200),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

///////// Displays the markers on the map
function loadMarkers() {

  //Erase markers from the map to display new ones
  for(var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers=[];

  //Get map bounds to define which markers get displayed
  var bounds = map.getBounds();
  for(var i=0;i<locations.length;i++){
    var Marker;
    if(locations[i]["lat"]>=0){
      var latTopBound = bounds["fa"]["b"];
      var latBotBound = bounds["fa"]["d"];
    } else {
      var latTopBound = bounds["fa"]["d"];
      var latBotBound = bounds["fa"]["b"];
    }

    if(locations[i]["lng"]>=0){
      var lngLeftBound = bounds["ga"]["b"];
      var lngRightBound = bounds["ga"]["d"];
    } else {
      var lngLeftBound = bounds["ga"]["d"];
      var lngRightBound = bounds["ga"]["b"];
    }

    //Check if markers fall inside the bounds
    if((locations[i]["lat"]<latTopBound && locations[i]["lat"]>latBotBound) && (locations[i]["lng"]<lngLeftBound && locations[i]["lng"]>lngRightBound)){
      if(locations[i]["type"] == "lost"){
        var image = "/assets/MarkerPurple.png";
      } else{
        var image = "/assets/MarkerWhite.png";
      }
      var Latlng = new google.maps.LatLng(locations[i]["lat"],locations[i]["lng"]);
      // If map just loaded, markers will be animated
      if(markerflag){
        Marker = new google.maps.Marker({
          position: Latlng,
          animation: google.maps.Animation.DROP,
          icon: image
        });
      } else{
        Marker = new google.maps.Marker({
          position: Latlng,
          icon: image
        });
      }
      //////////////////////////  placeholder contentString
      var contentString = '<div id="itemInfo">' + '<p>Item name</p>' + '<br>' +
          '<p>Category</p>' + '<br>' + '<p>Item Description</p>' + '</div>';

      var infowindow = new google.maps.InfoWindow({
          content: contentString
      });
      google.maps.event.addListener(Marker, 'click', function() {
        if (infowindow.getMap() == null)
          infowindow.open(map,this);
        else
          infowindow.close();
      });
      markers.push(Marker);
    }
  }
  markerflag=false;

  //Set style for the marker clusters
  var clusterStyles = [
    {
      opt_textColor: 'white',
      url: '/assets/MarkerPurple.png',
      height: 43,
      width: 27,
      textSize: 0
    },
   {
      opt_textColor: 'white',
      url: '/assets/MarkerWhite.png',
      height: 43,
      width: 27,
      textSize: 0
    },
   {
      opt_textColor: 'white',
      url: '/assets/MarkerPurple.png',
      height: 43,
      width: 27,
      textSize: 0
    }
  ];
  var mcOptions = {gridSize: 100, styles: clusterStyles, maxZoom: 16};
  var markerCluster = new MarkerClusterer(map, markers, mcOptions);
}

///////// Add a new lost or found item
function addNewItem(event){
  if(generalMarker!="")
    generalMarker.setMap(null);
  var image = "/assets/MarkerGrey.png";
  generalMarker = new google.maps.Marker({
    position: event.latLng,
    map: map,
    draggable: true,
    icon: image
  });


  var lat = event.latLng.lat();
  var lng = event.latLng.lng();

  var contentString = '<div id="lostForm"><h3>I lost...</h3><br><p>' + lat + lng + '</p> <form>' +
    '<input type="text" name="title" placeholder="Item name"><br><br>' +
    '<textarea rows="5" cols="19" name="details" placeholder="Item description"></textarea><br><br>' +
    '<select name="categories">' +
      '<option value="1">Electronics</option>' +
      '<option value="2">Clothing</option>' +
      '<option value="3">Sporting Goods</option>' +
      '<option value="4">Miscellaneous</option>' +
    '</select><br><br>' +
    '<input type="date" name="date" placeholder="Date lost"><br><br>' +
    '<input type="time" name="time" placeholder="Time lost"><br><br>' +
    '<input type="submit" value="Mark item as lost.">' +
    '</form>' +
    '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 500
    });

    google.maps.event.addListener(generalMarker, 'click', function() {
      if (infowindow.getMap() == null)
        infowindow.open(map,this);
      else
        infowindow.close();
    });

}

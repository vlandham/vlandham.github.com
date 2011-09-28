$ ->
  cloudmade_key = 'a901e8e6d6c04353895e2fede2d4a7c6' #from http://developers.cloudmade.com/projects
  cloudmade_url = "http://{s}.tile.cloudmade.com/#{cloudmade_key}/997/256/{z}/{x}/{y}.png"
  cloudemade_attr = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade'

  map = new L.Map('map', {
    maxZoom:13
  })
  cloudemade_layer = new L.TileLayer(cloudmade_url, {maxZoom: 18, attribution: cloudemade_attr})

  kc_location = new L.LatLng(39.115, -94.617)
  map.setView(kc_location, 11).addLayer(cloudemade_layer)

  #marker_location = new L.LatLng(51.5, -0.09)
  #marker = new L.Marker(marker_location)
  #map.addLayer(marker)

  census_layer = new L.GeoJSON()
  map.addLayer(census_layer)

  census_layer.on 'featureparse', (e) ->
    e.layer.setStyle {fillColor: "#ddd", color: "#000", weight:2, opacity:0.5, fillOpacity:0.2, fill:true, stroke:true}

    # save these for later
    e.layer.json_properties = e.properties

    e.layer.on 'click', (event) ->
      console.log(e.layer.json_properties)

    text = "#{e.layer.json_properties.GEOID10}"
    e.layer.bindPopup(text)

  d3.json "data/kc-tracts.json", (json) ->
    census_layer.addGeoJSON(json)


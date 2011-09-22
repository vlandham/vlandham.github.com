$ ->
  w = 900
  h = 800

  map_scale = 0.5

  path = d3.geo.path()

  vis = d3.select("#vis")
    .append("svg:svg")
    .attr("class", "chart")
    .attr("width", w )
    .attr("height", h)

  states = vis.append("svg:g")
    .attr("id", "states")
    .attr("transform", "scale(#{map_scale},#{map_scale})")

  d3.json "data/us-states-1900.json", (json) ->

    states.selectAll("path")
      .data(json.features)
    .enter().append("svg:path")
      .attr("d", path)



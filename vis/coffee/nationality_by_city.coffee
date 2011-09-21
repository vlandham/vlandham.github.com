$ ->
  w = 900
  h = 900

  key_w = 300
  key_h = 25
  key_rect_w = 20
  key_rect_h = 15

  arc = d3.svg.arc().outerRadius(r)
  pie = d3.layout.pie().value((d) -> d.percent)

# Where would be a better place to store
# color information? in another json file?
# In the css somehow?
  colors = {
    "Germany":"#B1C6A9"
    "Ireland":"#EF9E7A"
    "Canada And Newfoundland":"#BAB254"
    "England, Scotland, and Wales":"#ECCA53"
    "Norway, Sweden, And Denmark":"#664B45"
    "Italy":"#D35530"
    "Russia":"#6E874D"
    "Poland":"#D84C4F"
    "Austria":"#B58644"
    "Bohemia":"#7CA49E"
    "Hungary":"#32302B"
    "France":"#AF866D"
    "Mexico":"#807E4A"
    "China":"#B28B3D"
    "Japan":"#E49C52"
    "All Others":"#9D7D50"
  }

  # Convert colors to an array, because I don't know
  # how to attach a hash to a d3 selection...
  colors_data = for name, value of colors
    [name, value]

  keys = d3.select("#keys").selectAll('.key')
    .data(colors_data)
  .enter().append('div')
    .attr('class', 'key')

  keys_vis = keys.append("svg:svg")
    .attr("width", key_w)
    .attr("height", key_h)
  .append("svg:g")
    .attr("transform", "translate(#{(key_rect_w)},#{(key_rect_h)})")

    # key rectangles
  keys_vis.append("svg:rect")
    .attr("width", key_rect_w)
    .attr("height", key_rect_h)
    .attr("fill", (d) -> d[1])

    # key text
  keys_vis.append("svg:text")
    .attr("class", "title")
    .text((d) -> d[0])
    .attr("dy", (key_rect_h / 2))
    .attr("dx", (key_rect_w * 1.5))

  d3.json "data/nationality_by_city.json", (json) ->
    data = json

    vis = d3.select("#vis")
      .append("svg:svg")
      .attr("class", "chart")
      .attr("width", w)
      .attr("height", h)



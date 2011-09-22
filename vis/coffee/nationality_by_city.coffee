# Thanks to http://mbostock.github.com/d3/tutorial/bar-1.html for
# most of the design to follow. Also http://mbostock.github.com/d3/ex/population.html
# and of course http://jashkenas.github.com/coffee-script/
$ ->
  # the width and the left padding are linked.
  # should one be derived from the other?
  w = 780
  [pt, pr, pb, pl] = [30, 15, 0, 120]
  bar_h = 20
  bar_space = 10

  x = d3.scale.linear()
    .domain([0, 100])
    .range([0, w])

  key_w = 300
  key_h = 25
  key_rect_w = 20
  key_rect_h = 15

# Where would be a better place to store
# color information? in another json file?
# In the css somehow?
# For this vis, the names here are only used
# in the creation of the key section. The
# color matching is now done using the 'index'
# parameter of the data.
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

  # KEYS
  keys = d3.select("#keys").selectAll('.key')
    .data(colors_data)
  .enter().append('div')
    .attr('class', 'key')

  keys_vis = keys.append("svg:svg")
    .attr("width", key_w)
    .attr("height", key_h)
  .append("svg:g")
    .attr("transform", "translate(#{(key_rect_w)},#{(5)})")

  # key rectangles
  keys_vis.append("svg:rect")
    .attr("width", key_rect_w)
    .attr("height", key_rect_h)
    .attr("fill", (d) -> d[1])
    .attr("stroke", "#333")
    .attr("dy", 10)

  # key text
  keys_vis.append("svg:text")
    .attr("class", "title")
    .text((d) -> d[0])
    .attr("dy", (key_rect_h / 2 + 5))
    .attr("dx", (key_rect_w * 1.5))

  #Load JSON
  d3.json "data/nationality_by_city.json", (json) ->
    data = json

    # ordinal scale wasn't working with the raw data
    # variable. I assume this is because data couldn't
    # be converted to a string?
    # City names is used here in place of raw data.
    city_names = for city in data
      city.city

    bars_h = (bar_h + bar_space) * city_names.length

    h = bars_h + pt + pb

    # Scale should be outside callback and updated?
    y = d3.scale.ordinal()
      .domain(city_names)
      .rangeBands([0, bars_h])

    vis = d3.select("#vis")
      .append("svg:svg")
      .attr("class", "chart")
      .attr("width", w + (pl + pr))
      .attr("height", h)

    bars = vis.append("svg:g")
      .attr("transform", "translate(0, #{pt})")

    # Groups for bars for each city
    cities = bars.selectAll("city")
      .data(data)
    .enter().append("svg:g")
      .attr("class", "city")
      .attr("transform", (d, i) -> "translate(#{pl}, #{( i * (bar_h + bar_space))})")


    # add the total percent that has been used up
    # before a nationality to know where to shift
    # the box to
    for state in data
      state_sum = 0
      for nationality in state.nationalities
        nationality.begin = state_sum
        state_sum += nationality.percent

    # Nationality Bars
    cities.selectAll("nationality")
      .data((d) -> d.nationalities)
    .enter().append("svg:rect")
      .attr("width", (d) -> x(d.percent))
      .attr("x", (d) -> x(d.begin))
      .attr("height", bar_h)
      .attr("fill", (d) -> colors_data[d.index][1])
      .attr("stroke", "#333")

    # City Titles
    bars.selectAll("title")
      .data(data)
    .enter().append("svg:text")
      .attr("class", "title")
      .text((d) -> d.city)
      .attr("x", 0)
      .attr("y", (d) -> y(d.city) + y.rangeBand() / 2)
      .attr("dy", ".25em")

    # Rules and other text

    # I don't think I'm using svg groups like I should be.
    # I've got an aweful lot of groups to translate different
    # portions of the graph - but then i still need to know
    # that I'm translating a section, so I can subtract the amount
    # i translated from the height. There has to be a better,
    # more consistent way to do this.
    vis.append("svg:g")
      .attr("transform", "translate(#{pl}, #{pt})")
    .selectAll("line")
      .data(x.ticks(20))
    .enter().append("svg:line")
      .attr("x1", x)
      .attr("x2", x)
      .attr("y1", 0)
      .attr("y2", h - (bar_space + pt))
      .attr("stroke", (d) -> if d == 50 then "#111" else "#333")
      .attr("stroke-width", (d) -> if d == 50 then "2" else "1")

    # How does this 'String' function work? From barcode example:
    # The text operator sets the text content of the bars. 
    # The identity function, function(d) { return d; }, causes each data value (number) 
    # to be formatted using JavaScript’s default string conversion, 
    # equivalent to the built-in String function. 
    # This may be ugly for some numbers (e.g., 0.12000000000000001). 
    # The d3.format class, modeled after Python’s string formatting, 
    # is available for more control over how the number is formatted, 
    # supporting comma-grouping of thousands and fixed precision.
    vis.append("svg:g")
       .attr("transform", "translate(#{pl}, 0)")
    .selectAll("text.rule")
      .data(x.ticks(10))
    .enter().append("svg:text")
      .attr("class", "rule")
      .attr("class", "title")
      .attr("x", x)
      .attr("y", pt / 2)
      .attr("text-anchor", "middle")
      .text(String)


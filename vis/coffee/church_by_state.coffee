# Thanks to http://dealloc.me/demos/crime/2011.html for
# inspiration and a basic template to follow.
# Also http://projects.flowingdata.com/timeuse/
# and https://gist.github.com/1203641
# and https://gist.github.com/1091420
# For more inspiration and answered questions

# TODO: Sorting, Interaction, Different Representations
# Also, some styling is in css, some in svg. Not sure
# if this is a good way to do things.

$ ->
  [pt,pl,pb,pr] = [35, 20, 20, 20]
  w = (400 - (pl + pr)) / 2
  h = w
  r = (w - (pl + pr )) / 2

  key_w = 230
  key_h = 30
  key_r = 10

  arc = d3.svg.arc().outerRadius(r)
  pie = d3.layout.pie().value((d) -> d.percent)

# I don't like this combining the pie
# angle data with the raw json data.
# However, I need access to the names of the 
# sects along with the angle data - so I couldnt
# think of a better way to do this.
#
# A potential bug in this process: 
# This only works if the pie pieces are NOT sorted
# when returned back from pie.
  combine_pie_data = (data) ->
    pies = pie(data.sects)
    return_data = for a_pie, i in pies
      {pie:a_pie, data:data.sects[i]}
    return_data

# Where would be a better place to store
# color information? in another json file?
# In the css somehow?
  colors = {
    "Catholic": "#F3CAA2",
    "Methodist": "#BBD5BE",
    "Baptist": "#C3AE89",
    "Presbyterian": "#F2D96D",
    "Mormon":"#789F9B",
    "Congregationalist":"#ECC426",
    "Episcopalian":"#BFC469",
    "Disciples Of Christ":"#EF9584",
    "Lutheran":"#ACA98E",
    "United Brethren": "#EABB59",
    "Friends":"#C39822",
    "German Evangelical":"#C0A74A",
    "Unitarian":"#509CA9",
    "Reformed":"#C28B5D",
    "All Other": "#C08F81"
  }

# Convert colors to an array, because I don't know
# how to attach a hash to a d3 selection...
  colors_data = for name, value of colors
    [name, value]

  d3.json "data/church_by_state.json", (json) ->

    # Keys

    # Is there a way to get the keys construction
    # separated from the pie charts construction?
    # putting it outside this function made it so
    # the code wasn't executed. Or perhaps I was 
    # doing something wrong at the time
    keys = d3.select("#keys").selectAll('.key')
      .data(colors_data)
    .enter().append('div')
      .attr('class', 'key')

    keys_vis = keys.append("svg:svg")
      .attr("width", key_w)
      .attr("height", key_h)
    .append("svg:g")
      .attr("transform", "translate(#{(key_r)},#{(key_r)})")

    # key circles
    keys_vis.append("svg:circle")
      .attr("r", key_r)
      .attr("fill", (d) -> d[1])

    # key text
    keys_vis.append("svg:text")
      .attr("class", "title")
      .text((d) -> d[0])
      .attr("dy", (key_r / 2))
      .attr("dx", (key_r * 2))

    # Pie Charts

    data = json
    containers = d3.select("#vis").selectAll('.state')
      .data(data)
    .enter().append('div')
      .attr('class', 'state')

    vis = containers.append("svg:svg")
      .attr("width", w)
      .attr("height", h)
    .append("svg:g")
      .attr("transform", "translate(#{(pr)},#{(pt)})")

    # state name
    vis.append("svg:text")
      .attr("class", "title")
      .text((d) -> d.state)
      .attr("dy", "-10px")
      .attr("transform", "translate(#{(w - (pl + pr)) / 2})")
      .attr("text-anchor", "middle")

    # arc groups - pie pieces
    sects = vis.selectAll('.sect')
      .data((d) -> combine_pie_data(d))
    .enter().append("svg:g")
      .attr("class", "sect")
      .attr("transform", "translate(#{r},#{r})")

    # draw pie pieces
    sects.append("svg:path")
      .attr("d", (d, i) -> arc(d.pie))
      .style("fill", (d, i) -> colors[d.data.name])
      .style("stroke", "#333")
   
# arc.centroid returning NaN
    #sects.append("svg:text")
    #  .attr("transform", (d) -> "translate(#{arc.centroid(d.pie)})")
    #  .attr("text-anchor", "middle")
    #  .attr("fill", "#333")


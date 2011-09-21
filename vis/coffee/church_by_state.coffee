$ ->
  [pt,pl,pb,pr] = [35, 20, 20, 20]
  w = (400 - (pl + pr)) / 2
  h = w
  r = (w - (pl + pr )) / 2
  arc = d3.svg.arc().outerRadius(r)
  pie = d3.layout.pie().value((d) -> d.percent)

  combine_pie_data = (data) ->
    pies = pie(data.sects)
    return_data = for a_pie, i in pies
      {pie:a_pie, data:data.sects[i]}
    return_data

  key_w = 300
  key_h = 30
  key_r = 10


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

  colors_array = for name, value of colors
    [name, value]


  d3.json "data/church_by_state.json", (json) ->
    keys = d3.select("#keys").selectAll('.key')
      .data(colors_array)
    .enter().append('div')
      .attr('class', 'key')

    keys_vis = keys.append("svg:svg")
      .attr("width", key_w)
      .attr("height", key_h)
    .append("svg:g")
      .attr("transform", "translate(#{(key_r)},#{(key_r)})")

    keys_vis.append("svg:circle")
      .attr("r", key_r)
      .attr("fill", (d) -> d[1])

    keys_vis.append("svg:text")
      .attr("class", "title")
      .text((d) -> d[0])
      .attr("dy", (key_r / 2))
      .attr("dx", (key_r * 2))

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

    vis.append("svg:text")
      .attr("class", "title")
      .text((d) -> d.state)
      .attr("dy", "-10px")
      .attr("transform", "translate(#{(w - (pl + pr)) / 2})")
      .attr("text-anchor", "middle")

    # arc groups
    sects = vis.selectAll('.sect')
      .data((d) -> combine_pie_data(d))
    .enter().append("svg:g")
      .attr("class", "sect")
      .attr("transform", "translate(#{r},#{r})")

    sects.append("svg:path")
      .attr("d", (d, i) -> arc(d.pie))
      .style("fill", (d, i) -> colors[d.data.name])
      .style("stroke", "#333")
    
    sects.append("svg:text")
      .attr("transform", (d) -> "translate(#{arc.centroid(d.pie)})")
      .attr("text-anchor", "middle")
      .attr("fill", "#333")


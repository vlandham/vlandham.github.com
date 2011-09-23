$ ->
  data = {}
  panel_w = 750
  panel_h = 600
  panel_vert_space = 120
  panel_horiz_space = 150
  side_space = 10
  title_space = 50
  keys_height = 100
  map_scale = 0.5
  path = d3.geo.path()

  attrs = [
    {
      key:"agr"
      offsets:[panel_horiz_space / 2,0]
      title:"1. Agriculture"
      keys:[["agr-0","Less than", "20 per cent"], ["agr-20", "20 to 35", "per cent"], ["agr-35", "35 to 60", "per cent"], ["agr-60", "60 per cent", "and over"]]
    }
    {
      key:"man"
      offsets:[(panel_w + panel_horiz_space),0]
      title:"2. Manufacturing and Mechanical Pursuits"
      keys:[["man-0","Less than", "10 per cent"], ["man-10", "10 to 20", "per cent"], ["man-20", "20 to 40", "per cent"], ["man-40", "40 per cent", "and over"]]
    }
    {
      key:"min"
      offsets:[panel_horiz_space / 2,(panel_h + panel_vert_space)]
      title:"3. Mining and Quarrying"
      keys:[["min-0","Less than", "2 per cent"], ["min-2", "2 to 5", "per cent"], ["min-5", "5 to 10", "per cent"], ["min-10", "10 per cent", "and over"]]
    }
    {
      key:"tra"
      offsets:[(panel_w + panel_horiz_space),(panel_h + panel_vert_space)]
      title:"4. Trade And Transportation"
      keys:[["tra-0","Less than", "10 per cent"], ["tra-10", "10 to 16", "per cent"], ["tra-16", "16 per cent", "and over"]]
    }
    {
      key:"dom"
      offsets:[(panel_horiz_space / 2),(panel_h + panel_vert_space) * 2]
      title:"5. Domestic and Personal Service"
      keys:[["dom-0","Less than", "15 per cent"], ["dom-15", "15 to 20", "per cent"], ["dom-20", "20 per cent", "and over"]]
    }
    {
      key:"pro"
      offsets:[(panel_w + panel_horiz_space),(panel_h + panel_vert_space) * 2]
      title:"6. Professional Service"
      keys:[["pro-0","Less than", "3 per cent"], ["pro-3", "3 to 5", "per cent"], ["pro-5", "5 per cent", "and over"]]
    }
  ]

  class_for = (name, attr) ->
    state = data[name]
    value = state[attr]
    "#{attr}-#{value}"

  vis = d3.select("#vis")
    .append("svg:svg")
    .attr("class", "chart")
    .attr("height", 1050)


  d3.json "data/jobs_by_state.json", (json) ->
    for state in json
      data[state.name] = state

    d3.json "data/us-states-1900.json", (json) ->
      for attr in attrs
        states = vis.append("svg:g")
          .attr("class", "panel")
          .attr("transform", "scale(#{map_scale},#{map_scale}) translate(#{attr.offsets})")

        states.append("svg:rect")
          .attr("width", panel_w - (side_space * 2))
          .attr("height", panel_h - (title_space + keys_height))
          .attr("y", title_space)
          .attr("x", side_space)
          .attr("stroke", "rgb(0,0,0)")
          .attr("stroke-width", 2)
          .attr("fill-opacity", 0)

        states.append("svg:text")
          .attr("y", title_space / 2)
          .attr("x", panel_w / 2)
          .attr("dy", ".40em")
          .attr("text-anchor", "middle")
          .text(attr.title)
          .attr("class", "title")

        states.append("svg:g")
          .attr("class", "states")
          .attr("transform", "translate(-120, 33)")
        .selectAll("path")
          .data(json.features)
        .enter().append("svg:path")
          .attr("d", path)
          .attr("class", (d) -> class_for(d.name, attr.key))


        total_keys = attr.keys.length
        key_space = 50
        key_width = 60
        key_area = states.append("svg:g")
          .attr("class", "keys")
          .attr("transform", "translate(#{((panel_w / 2) - (key_space + key_width) * (total_keys / 2))},#{panel_h - keys_height})")


        key_area.selectAll("key")
          .data(attr.keys)
        .enter().append("svg:rect")
          .attr("width", key_width)
          .attr("height", 30)
          .attr("y", 20)
          .attr("x", (d, i) -> (key_width + key_space) * i)
          .attr("class", (d) -> "key-rect #{d[0]}")

        key_area.selectAll("key-text")
          .data(attr.keys)
        .enter().append("svg:text")
          .attr("class", "key-text")
          .attr("y", 20 + 30 + 20)
          .attr("x", (d, i) -> (key_width + key_space) * i + (key_width / 2))
          .attr("text-anchor", "middle")
          .text((d) -> d[1])

        key_area.selectAll("key-text2")
          .data(attr.keys)
        .enter().append("svg:text")
          .attr("class", "key-text")
          .attr("y", 20 + 30 + 20 + 15)
          .attr("x", (d, i) -> (key_width + key_space) * i + (key_width / 2))
          .attr("text-anchor", "middle")
          .text((d) -> d[2])

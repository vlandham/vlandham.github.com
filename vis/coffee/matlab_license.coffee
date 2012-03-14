
root = exports ? this

$ ->
  w = 900
  h = 400
  r = 4
  [pt, pr, pb, pl] = [20, 10, 30, 40]

  data = null
  vis = null

  format = d3.time.format("%Y-%m-%d %H:%M:%S -0600")

  color = d3.scale.category10()
  x_scale = d3.time.scale()
    .range([0, w])
  # currently we have 6 network licenses
  y_scale = d3.scale.linear()
    .domain([0, 6])
    .range([h, 0])

  y_axis = d3.svg.axis().scale(y_scale).ticks(5).orient("left")

  line_path = d3.svg.line()
    .x((d) -> x_scale(format.parse(d.time)))
    .y((d) -> y_scale(d.used))
    .interpolate("step-before")

  vis = d3.select("#vis")
    .append("svg")
    .attr("id", "vis-svg")
    .attr("width", w + (pl + pr))
    .attr("height", h + (pt + pb))

  render_stats = () ->
    license_stats = {}
    data.forEach (d) ->
      d.status.forEach (s) ->
        license_stats[s.id] = {used_count:0,used_total:0, count:0,license_max:s.total, maxed_out:0} unless license_stats[s.id]
        license_stats[s.id].used_count += s.used
        license_stats[s.id].used_total += s.total
        license_stats[s.id].maxed_out += 1 if s.used == s.total
        license_stats[s.id].count += 1

    d3.entries(license_stats).forEach (d) ->
      d.value.used_ratio = (d.value.used_count / d.value.used_total)
      d.value.used_average = (d.value.used_count / d.value.count)
      d.value.maxed_percent = (d.value.maxed_out / d.value.count) * 100


    sort_stats = d3.entries(license_stats).sort( (a,b) -> b.value.used_average - a.value.used_average)


    d3.select("#stats").append("h4")
      .text("Matlab Average:   #{sort_stats[0].value.used_average.toFixed(2)} / #{sort_stats[0].value.license_max} licenses used")

    stats_vis = d3.select("#stats")
      .append("table")

    stats_header = stats_vis.append("tr")

    stats_header.append("th")
      .text("Name")
    stats_header.append("th")
      .text("Avg Usage")
    stats_header.append("th")
      .text("Total Licenses")
    stats_header.append("th")
      .text("% Time Maxed")

    stats_row = stats_vis.selectAll("tr")
      .data(sort_stats).enter().append("tr")

    stats_row.append("td")
      .text((d) -> d.key)
    stats_row.append("td")
      .text((d) -> d.value.used_average.toFixed(2))
    stats_row.append("td")
      .text((d) -> d.value.license_max)
    stats_row.append("td")
      .text((d) -> d.value.maxed_percent.toFixed(2))

  render_users = () ->
    user_counts = {}
    total = 0
    data.forEach (d) ->
      d.status.forEach (s) ->
        s.users.forEach (u) ->
          user_counts[u.id] = 0 unless user_counts[u.id]
          user_counts[u.id] += 1
          total += 1
    
    user_scale = d3.scale.linear()
      .domain([0, total])
      .range([0, 300])

    sort_user_counts = d3.entries(user_counts).sort( (a,b) -> b.value - a.value)

    user_vis = d3.select("#users")
      .append("svg")
      .attr("id", "user-svg")
      .attr("width", 430 + (pl + pr))
      .attr("height", (25 * sort_user_counts.length) + pt + pb)
      .append("g")
      .attr("transform", "translate(#{pl},#{pt})")

    users = user_vis.selectAll(".user")
      .data(sort_user_counts)
      .enter().append("g")
      .attr("transform", (d,i) -> "translate(#{0},#{25 * i})")
      .attr("class", "user")

    users.append("text")
      .text((d) -> d.key)
      .attr("dy", 15)
      .attr("id", (d) -> d.key)
      .attr("class", "user_name")
      .on("mouseover", show_user)
      .on("mouseout", hide_user)

    users.append("rect")
      .attr("class", "user-count")
      .attr("width", (d) -> user_scale(d.value))
      .attr("height", 20)
      .attr("fill", "#ddd")
      .attr("x", 40)
      .attr("y", 0)

  render_vis = (json) ->
    data = json

    # line_data = {}
    # data.forEach (d) ->
    #   d.status.forEach (s) ->
    #     s.time = d.time
    #     line_data[s.id] = [] unless line_data[s.id]
    #     line_data[s.id].push(s)

    # line_data = d3.values(line_data)

    date_extent = d3.extent(data, (d) -> format.parse(d.time))
    diff_date = date_extent[1] - date_extent[0]
    max_date = date_extent[1].setTime(date_extent[1].getTime() + diff_date / 4)
    min_date = date_extent[0].setTime(date_extent[0].getTime() - diff_date / 4)

    x_scale.domain([min_date, max_date])
    time_tick_format = x_scale.tickFormat(10)

    vis.append("rect")
      .attr("width", w + (pl + pr))
      .attr("height", h + (pt + pb))
      .attr("fill", "#f2f2f2")
      .attr("pointer-events","all")

    vis_g = vis.append("g")
      .attr("width", w)
      .attr("height", h)
      .attr("transform", "translate(#{pl},#{pt})")

    time_ticks_g = vis_g.append("g")

    time_ticks = time_ticks_g.selectAll(".time_rule")
      .data(x_scale.ticks(10))
      .enter().append("g")
        .attr("class", "time_rule")
        .attr("transform", (d) -> "translate(" + x_scale(d) + ", " + 0 + ")")

    time_ticks.append("line")
      .attr("y1", 0)
      .attr("y2", h )
      .attr("x1", 0)
      .attr("stroke", "#ddd")

    time_ticks.append("text")
      .attr("y", h + pb / 2)
      .attr("text-anchor", "middle")
      .text((d) -> time_tick_format(d))

    time_ticks_g.append("line")
      .attr("y1", h )
      .attr("y2", h )
      .attr("x1", 0)
      .attr("x2", w)
      .attr("stroke", "#4e4e4e")

    y_axis_g = vis.append("g")
      .attr("class", "y_axis")
      .attr("transform", "translate(#{pl - pr},#{pt})")
      .call(y_axis)

    records_g = vis_g.append("g")


    record_group = records_g.selectAll(".record")
        .data(data)
      .enter().append("g")
        .attr("class", "record")
        .attr("transform", (d) -> "translate(#{x_scale(format.parse(d.time))},0)")
        .on("mouseover",  show_details)
        .on("mouseout", hide_details)

    record_group.selectAll(".license-box")
      .data((d) -> d.status)
    .enter().append("rect")
      .attr("fill", (d) -> color(d.id))
      .attr("class", "license-box")
      .attr("y", 0)
      .attr("width", 6)
      .attr("height", (d) ->  (h - y_scale(d.used)))
      .attr("opacity", 0.5)
      .attr("transform", (d) -> "translate(#{-3},#{(h)})scale(1,-1)")

    license = record_group.selectAll(".license")
        .data( (d) -> d.status)
      .enter().append("circle")
        .attr("class", "license")
        .attr("cy", (d) -> y_scale(d.used))
        .attr("r", (d) -> if d.used == 0 then 0 else r)
        .attr("opacity", (d) -> if d.used == d.total then 1.0 else 0.0)
        .attr("fill", (d) -> if d.used == d.total then "#840522" else "#4e4e4e")

    render_users()
    render_stats()

  show_details = (data, index) ->
    detail_w = 250
    detail_h = 100
    usage = data.status.filter((d) -> d.used > 0).sort((a,b) -> b.used - a.used)
    detail_g = vis.append("g")
      .attr("id", "detail-panel")
      .attr("transform", "translate(#{(w + pl) - detail_w},#{pt * 2})")

    detail_g.append("rect")
      .attr("class", "detail-background")
      .attr("width", detail_w)
      .attr("height", 100)
      .attr("fill", "#fff")
      .attr("opacity", 0.8)

    detail_g.selectAll(".detail")
      .data(usage)
    .enter().append("text")
      .attr("class", "detail")
      .text((d) -> "#{d.id}: #{d.used} / #{d.total}: #{d.users.map((d) -> d.id).join(", ")}")
      .attr("x", 10)
      .attr("y", (d,i) -> (i + 1) * 20)

  hide_details = (data, index) ->
    vis.select("#detail-panel").remove()

  show_user = (data, index) ->
    record_group = vis.selectAll(".license-box").filter (d) ->
      is_usr = d.users.reduce (prev, us) ->
        (us.id == data.key) or prev
      , false
      is_usr
    record_group.classed("highlight", true)


  hide_user = (data, index) ->
    record_group = vis.selectAll(".license-box").filter (d) ->
      is_usr = d.users.reduce (prev, us) ->
        (us.id == data.key) or prev
      , false
      is_usr

    record_group.classed("highlight", false)

  d3.json "data/matlab.json", render_vis


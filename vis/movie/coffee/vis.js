(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  $(function() {
    var all_data, base_vis, body, color, data, data_key, draw_details, draw_movie_details, draw_movies, filter_genres, filter_number, filter_stories, filter_year, h, hide_details, key_h, key_pb, key_pl, key_pr, key_pt, key_w, middle_line, movie_body, pb, pl, pr, pre_filter, pt, r_scale, render_key, render_vis, show_details, sort_data, update, update_data, update_scales, vis, w, xAxis, x_scale, yAxis, y_scale, y_scale_reverse, zero_line, _ref, _ref2,
      _this = this;
    data_key = {
      budget: "Budget",
      gross: "Worldwide Gross",
      rating: "Rotten Tomatoes"
    };
    w = 860;
    h = 450;
    key_h = 150;
    key_w = 400;
    _ref = [10, 10, 10, 15], key_pt = _ref[0], key_pr = _ref[1], key_pb = _ref[2], key_pl = _ref[3];
    _ref2 = [20, 20, 50, 60], pt = _ref2[0], pr = _ref2[1], pb = _ref2[2], pl = _ref2[3];
    root.options = {
      top: 50,
      bottom: 0,
      genres: null,
      year: "all",
      stories: null,
      sort: "rating"
    };
    data = null;
    all_data = null;
    base_vis = null;
    vis = null;
    body = null;
    movie_body = null;
    zero_line = null;
    middle_line = null;
    x_scale = d3.scale.linear().range([0, w]);
    y_scale = d3.scale.linear().range([0, h]);
    y_scale_reverse = d3.scale.linear().range([0, h]);
    r_scale = d3.scale.sqrt().range([0, 29]).domain([0, 310]);
    xAxis = d3.svg.axis().scale(x_scale).tickSize(5).tickSubdivide(true);
    yAxis = d3.svg.axis().scale(y_scale_reverse).ticks(5).orient("left");
    color = d3.scale.category10();
    color = d3.scale.ordinal().range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf", "#078B78", "#5C1509", "#CECECE", "#FFEA0A"]);
    pre_filter = function(data) {
      return data;
    };
    sort_data = function(sort_type) {
      return data = data.sort(function(a, b) {
        var b1, b2, _ref3, _ref4;
        b1 = (_ref3 = parseFloat(a[data_key[sort_type]])) != null ? _ref3 : 0;
        b2 = (_ref4 = parseFloat(b[data_key[sort_type]])) != null ? _ref4 : 0;
        return b2 - b1;
      });
    };
    filter_year = function(year) {
      return data = data.filter(function(d) {
        if (year === "all") {
          return true;
        } else {
          return d.year === year;
        }
      });
    };
    filter_genres = function(genres) {
      if (genres) {
        return data = data.filter(function(d) {
          return $.inArray(d["Genre"], genres) !== -1;
        });
      }
    };
    filter_stories = function(stories) {
      if (stories) {
        return data = data.filter(function(d) {
          return $.inArray(d["Story"], stories) !== -1;
        });
      }
    };
    filter_number = function(top, bottom) {
      var bottom_data, bottom_start_index, top_data;
      bottom_start_index = data.length - bottom;
      if (bottom_start_index < 0) bottom_start_index = 0;
      if (top >= bottom_start_index) {
        return data = data;
      } else {
        top_data = data.slice(0, top);
        bottom_data = data.slice(bottom_start_index);
        return data = d3.merge([top_data, bottom_data]);
      }
    };
    update_scales = function() {
      var max_x, max_y, min_x, min_x_padding, min_y, min_y_padding, x_padding, y_padding, _ref3, _ref4;
      min_y_padding = 3;
      min_x_padding = 5;
      _ref3 = d3.extent(data, function(d) {
        return parseFloat(d["Profit"]);
      }), min_x = _ref3[0], max_x = _ref3[1];
      min_x = min_x > 0 ? 0 : min_x;
      _ref4 = d3.extent(data, function(d) {
        return parseFloat(d[data_key["rating"]]);
      }), min_y = _ref4[0], max_y = _ref4[1];
      y_padding = parseInt(Math.abs(max_y - min_y) / 5);
      y_padding = y_padding > min_y_padding ? y_padding : min_y_padding;
      min_y = min_y - y_padding;
      min_y = min_y < 0 ? 0 : min_y;
      max_y = max_y + y_padding;
      max_y = max_y > 100 ? 100 : max_y;
      x_padding = parseInt(Math.abs(max_x - min_x) / 12);
      x_padding = x_padding > min_x_padding ? x_padding : min_x_padding;
      min_x = min_x - x_padding;
      max_x = max_x + x_padding;
      x_scale.domain([min_x, max_x]);
      y_scale.domain([min_y, max_y]);
      return y_scale_reverse.domain([max_y, min_y]);
    };
    update_data = function() {
      data = all_data;
      filter_year(root.options.year);
      filter_genres(root.options.genres);
      filter_stories(root.options.stories);
      sort_data(root.options.sort);
      filter_number(root.options.top, root.options.bottom);
      return update_scales();
    };
    draw_movies = function() {
      var movies;
      movies = movie_body.selectAll(".movie").data(data, function(d) {
        return d.id;
      });
      movies.enter().append("g").attr("class", "movie").on("mouseover", function(d, i) {
        return show_details(d, i, this);
      }).on("mouseout", hide_details).append("circle").attr("opacity", 0.85).attr("fill", function(d) {
        return color(d["Genre"]);
      }).attr("stroke", function(d) {
        return d3.hsl(color(d["Genre"])).darker();
      }).attr("stroke-width", 2).attr("r", function(d) {
        return r_scale(parseFloat(d["Budget"]));
      });
      movies.transition().duration(1000).attr("transform", function(d) {
        return "translate(" + (x_scale(d["Profit"])) + "," + (y_scale(d["Rotten Tomatoes"])) + ")";
      });
      base_vis.transition().duration(1000).select(".x_axis").call(xAxis);
      zero_line.transition().duration(1000).attr("x1", x_scale(0)).attr("x2", x_scale(0));
      middle_line.transition().duration(1000).attr("y1", y_scale(50.0)).attr("y2", y_scale(50.0));
      base_vis.transition().duration(1000).select(".y_axis").call(yAxis);
      movies.exit().transition().duration(1000).attr("transform", function(d) {
        return "translate(" + 0 + "," + 0 + ")";
      }).remove();
      return movies.exit().selectAll("circle").transition().duration(1000).attr("r", 0);
    };
    draw_movie_details = function(detail_div) {
      detail_div.enter().append("div").attr("class", "movie-detail").attr("id", function(d) {
        return "movie-detail-" + d.id;
      }).append("h3").text(function(d) {
        return d["Film"];
      }).append("span").attr("class", "detail-rating").text(function(d) {
        return " " + d["Rotten Tomatoes"] + "%";
      });
      return detail_div.exit().remove();
    };
    draw_details = function() {
      var bottom_data, detail_bottom, detail_top, top_data;
      if (root.options.top === 0) {
        $("#detail-love").hide();
      } else {
        $("#detail-love").show();
      }
      if (root.options.bottom === 0) {
        $("#detail-hate").hide();
      } else {
        $("#detail-hate").show();
      }
      top_data = data.slice(0, root.options.top);
      detail_top = d3.select("#detail-love").selectAll(".movie-detail").data(top_data, function(d) {
        return d.id;
      });
      draw_movie_details(detail_top);
      bottom_data = data.slice(root.options.top).reverse();
      detail_bottom = d3.select("#detail-hate").selectAll(".movie-detail").data(bottom_data, function(d) {
        return d.id;
      });
      return draw_movie_details(detail_bottom);
    };
    render_key = function() {
      var example_r, example_x, example_y, genres, key, key_demo_group, key_group, key_r;
      genres = {};
      all_data.forEach(function(d) {
        return genres[d["Genre"]] = 1;
      });
      key_r = 10;
      key = d3.select("#key").append("svg").attr("id", "key-svg").attr("width", key_w).attr("height", key_h + key_pb + key_pt);
      key.append("rect").attr("width", key_w).attr("height", key_h + key_pb + key_pt).attr("fill", "#ffffff").attr("opacity", 0.0);
      key = key.append("g").attr("transform", "translate(" + key_pl + "," + key_pt + ")");
      key_group = key.selectAll(".key-group").data(d3.keys(genres)).enter().append("g").attr("class", "key-group").attr("transform", function(d, i) {
        return "translate(" + (i * 25 >= key_h ? 140 : 0) + "," + (i * 25 % key_h) + ")";
      });
      key_group.append("circle").attr("r", key_r).attr("fill", function(d) {
        return color(d);
      }).attr("transform", function(d) {
        return "translate(" + key_r + ", " + key_r + ")";
      });
      key_group.append("text").attr("class", "key-text").attr("dy", 15).attr("dx", key_r * 2 + 6).text(function(d) {
        return d;
      });
      key_demo_group = key.append("g").attr("transform", "translate(" + 0 + ",0)");
      example_x = 280;
      example_r = 20;
      example_y = key_h / 2 - example_r;
      key_demo_group.append("circle").attr("r", example_r).attr("fill", color("Comedy")).attr("transform", function(d) {
        return "translate(" + example_r + ", " + example_r + ")";
      }).attr("cx", example_x).attr("cy", example_y);
      key_demo_group.append("line").attr("x1", example_x).attr("x2", example_x + example_r * 2).attr("y1", example_y + example_r).attr("y2", example_y + example_r).attr("stroke", "#333").attr("stroke-dasharray", "3").attr("stroke-width", 2);
      key_demo_group.append("text").attr("dx", example_x + (example_r * 2) + 4).attr("dy", example_y + example_r - 8).text("Film's");
      return key_demo_group.append("text").attr("dx", example_x + (example_r * 2) + 4).attr("dy", example_y + example_r + 6).text("Budget");
    };
    render_vis = function(csv) {
      all_data = pre_filter(csv);
      update_data();
      base_vis = d3.select("#vis").append("svg").attr("width", w + (pl + pr)).attr("height", h + (pt + pb)).attr("id", "vis-svg");
      base_vis.append("g").attr("class", "x_axis").attr("transform", "translate(" + pl + "," + (h + pt) + ")").call(xAxis);
      base_vis.append("text").attr("x", w / 2).attr("y", h + (pt + pb) - 10).attr("text-anchor", "middle").attr("class", "axisTitle").attr("transform", "translate(" + pl + ",0)").text("Profit ($ mil)");
      base_vis.append("g").attr("class", "y_axis").attr("transform", "translate(" + pl + "," + pt + ")").call(yAxis);
      vis = base_vis.append("g").attr("transform", "translate(" + 0 + "," + (h + (pt + pb)) + ")scale(1,-1)");
      vis.append("text").attr("x", h / 2).attr("y", 20).attr("text-anchor", "middle").attr("class", "axisTitle").attr("transform", "rotate(270)scale(-1,1)translate(" + pb + "," + 0 + ")").text("Rating (Rotten Tomatoes %)");
      body = vis.append("g").attr("transform", "translate(" + pl + "," + pb + ")").attr("id", "vis-body");
      zero_line = body.append("line").attr("x1", x_scale(0)).attr("x2", x_scale(0)).attr("y1", 0 + 5).attr("y2", h - 5).attr("stroke", "#aaa").attr("stroke-width", 1).attr("stroke-dasharray", "2");
      middle_line = body.append("line").attr("x1", 0 + 5).attr("x2", w + 5).attr("y1", y_scale(50.0)).attr("y2", y_scale(50.0)).attr("stroke", "#aaa").attr("stroke-width", 1).attr("stroke-dasharray", "2");
      movie_body = body.append("g").attr("id", "movies");
      draw_movies();
      draw_details();
      return render_key();
    };
    show_details = function(movie_data, index, element) {
      var bBox, box, crosshairs_g, movies, msg, selected_movie, tooltipWidth, unselected_movies;
      movies = body.selectAll(".movie");
      bBox = element.getBBox();
      box = {
        "height": Math.round(bBox.height),
        "width": Math.round(bBox.width),
        "x": w + bBox.x,
        "y": h + bBox.y
      };
      box.x = Math.round(x_scale(movie_data["Profit"])) - (pr + 109) + r_scale(movie_data["Budget"]);
      box.y = Math.round(y_scale_reverse(movie_data["Rotten Tomatoes"])) - (r_scale(movie_data["Budget"]) + pt + -55);
      tooltipWidth = parseInt(d3.select('#tooltip').style('width').split('px').join(''));
      msg = '<p class="title">' + movie_data["Film"] + '</p>';
      msg += '<table>';
      msg += '<tr><td>Rating:</td><td>' + movie_data["Rotten Tomatoes"] + '%</td></tr>';
      msg += '<tr><td>Budget:</td><td>' + movie_data["Budget"] + ' mil</td></tr>';
      msg += '<tr><td>Worldwide Gross:</td><td>' + movie_data["Worldwide Gross"] + ' mil</td></tr>';
      msg += '<tr><td>Profit:</td><td>' + movie_data["Profit"] + ' mil' + '</td></tr>';
      msg += '<tr><td>Story:</td><td>' + movie_data["Story"] + '</td></tr>';
      msg += '</table>';
      d3.select('#tooltip').classed('hidden', false);
      d3.select('#tooltip .content').html(msg);
      d3.select('#tooltip').style('left', "" + ((box.x + (tooltipWidth / 2)) - box.width / 2) + "px").style('top', "" + box.y + "px");
      selected_movie = d3.select(element);
      selected_movie.attr("opacity", 1.0);
      unselected_movies = movies.filter(function(d) {
        return d.id !== movie_data.id;
      }).selectAll("circle").attr("opacity", 0.3);
      crosshairs_g = body.insert("g", "#movies").attr("id", "crosshairs");
      crosshairs_g.append("line").attr("class", "crosshair").attr("x1", 0 + 3).attr("x2", x_scale(movie_data["Profit"]) - r_scale(movie_data["Budget"])).attr("y1", y_scale(movie_data["Rotten Tomatoes"])).attr("y2", y_scale(movie_data["Rotten Tomatoes"])).attr("stroke-width", 1);
      return crosshairs_g.append("line").attr("class", "crosshair").attr("x1", x_scale(movie_data["Profit"])).attr("x2", x_scale(movie_data["Profit"])).attr("y1", 0 + 3).attr("y2", y_scale(movie_data["Rotten Tomatoes"]) - r_scale(movie_data["Budget"])).attr("stroke-width", 1);
    };
    hide_details = function(movie_data) {
      var movies;
      d3.select('#tooltip').classed('hidden', true);
      movies = body.selectAll(".movie").selectAll("circle").attr("opacity", 0.85);
      return body.select("#crosshairs").remove();
    };
    d3.csv("data/movies_all_final_filter.csv", render_vis);
    update = function() {
      update_data();
      draw_movies();
      return draw_details();
    };
    return root.update_options = function(new_options) {
      root.options = $.extend({}, root.options, new_options);
      return update();
    };
  });

}).call(this);

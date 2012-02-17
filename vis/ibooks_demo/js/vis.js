$(document).ready(function() {
  var w = 600,
      h = 600;

  var radius = d3.scale.linear().range([14, 30]);
  var y = d3.scale.linear().range([40, 560]);
  var x = d3.scale.linear().range([40, 560]);

  var vis = d3.select("#vis").append("svg")
    .attr("id", "svg-vis")
    .attr("width", w)
    .attr("height", h);

  function render_vis(csv) {
    radius.domain([0, d3.max(csv, function(d) { return d.r; })]);
    y.domain([0, d3.max(csv, function(d) { return d.y; })]);
    x.domain([0, csv.length]);


    vis.selectAll("circle")
    .data(csv).enter()
    .append("circle")
    .attr("r", function(d) { return radius(d.r);})
    .attr("cy", function(d) { return y(d.y); })
    .attr("cx", function(d,i) { return x(i); })
    .attr("fill", "steelblue")
    .call(d3.behavior.drag().on("drag", move)
        .on("dragstart", dragstart)
        .on("dragend", dragend));
  };

  function dragstart() {
    d3.select(this).attr("fill", "red");
  };

  function dragend() {
    d3.select(this).attr("fill", "steelblue");
  };

  function move() {
    var dragTarget = d3.select(this);
    dragTarget
      .attr("cx", function(){return d3.event.dx + parseInt(dragTarget.attr("cx"))})
      .attr("cy", function(){return d3.event.dy + parseInt(dragTarget.attr("cy"))});
  };

  d3.csv("data/test.csv", render_vis);
});




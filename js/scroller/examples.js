var circleTimeouts = [];
function example(id,timeout,index) {
// return function circle(id,timeout, index) {
return function circle() {
  var width = 790,
    height = 200;

  // width = window.innerWidth;
  // height = window.innerHeight;

  var r = 40;
  var toggle = false;

  var vis = d3.select(id);
  // var vis = d3.select(id)
  // .style("position", "absolute")
  // .style("top", 0)
  // .style("left", 0)
  // .style("width", "100%")
  // .style("height", "100%");

  vis.attr("width", width)
  .attr("height", height);

  var data = [1];

  vis.selectAll(".circle").data(data)
  .enter().append("circle")
  .attr("fill", "#008080")
  .attr("class", "circle")
  .attr("r", r);

  var tris = [1,2];

  vis.selectAll(".triangle").data(tris)
  .enter().append("path")
  .attr("fill", "#000")
  .attr("class", "triangle")
  .attr("d", function(d,i) {
    var path;
    if(i === 0) {
      path = "M " + (r + 20 ) + " " + ((height / 2) - (r - 15) );
      path += "l 15 -15";
      path += "l -15 -15";
      path += "l -15 15Z";
    } else {
      path = "M " + (width - (r + 20)) + " " + ((height / 2) - (r - 15));
      path += "l -15 -15";
      path += "l 15 -15";
      path += "l 15 15Z";
    }
    return path;
  });



  vis.selectAll(".circle")
  .attr("cx", r + 20)
  .attr("cy", (height / 2) - (r));

  function animate(timeout) {
    var x = toggle ? (r + 20) : (width - (r + 20));
    var color = toggle ? "#008080" : "#DE0016";

    vis.selectAll(".triangle")
    .attr('opacity', function(d,i) {
      var on = toggle ? 0 : 1;
      return (i == on) ? 1 : 0;
    });

    var duration = 1800;
    if(index > 1) {
      if(toggle) {
        duration = 4000;
      }
    }

    if(index < 3 || toggle) {
      vis.selectAll(".circle")
      .transition("move")
      .duration(duration)
      .attr("cx", x);
    } else {
      vis.selectAll(".circle")
      .attr("cx", x);
    }
    if(index === 0) {
      vis.selectAll(".circle")
      .transition("color")
      .duration(duration)
      .attr("fill", color);
    }

    toggle = toggle ? false : true;
    circleTimeouts[index]= setTimeout(animate, timeout, timeout);
  }
  animate(timeout);
};
}

example("#namedSVG", 2000, 0)();
example("#circleSVG", 2000, 1)();
example("#circle2SVG", 2000, 2)();
example("#circle3SVG", 2000, 3)();




var colors = d3.scale.category10();
SimpleBubble = function(d, id, c) {
  this.data = d;
  this.id = id;
  this.canvas = c;
  this.el = null;
  this.x = 0;
  this.y = 0;
  this.radius = 0;
  this.boxSize = 0;
  this.isDragging = false;
  this.isSelected = false;
  this.tooltip = null;

  this.init();
};

SimpleBubble.prototype.init = function() {
  /* Elements that make up the bubbles display*/
  this.el = $("<div class='bubble' id='bubble-" + this.id + "'></div>");
  this.elFill = $("<div class='bubbleFill'></div>");
  this.el.append(this.elFill);

  /* Attach mouse interaction to root element */
  /* Note use of $.proxy to maintain context */
  this.el.on('mouseover', $.proxy(this.showToolTip, this));
  this.el.on('mouseout', $.proxy(this.hideToolTip, this));

  /* Set CSS of Elements  */
  this.radius = this.data;
  this.boxSize = this.data * 2;

  this.elFill.css({
    width: this.boxSize,
    height: this.boxSize,
    left: -this.boxSize / 2,
    top: -this.boxSize / 2,
    "background-color": colors(this.data)});
};

SimpleBubble.prototype.showToolTip = function() {
  var toolWidth = 40;
  var toolHeight = 25;
  this.tooltip =  $("<div class='tooltip'></div>");
  this.tooltip.html("<div class='tooltipFill'><p>" + this.data + "</p></div>");
  this.tooltip.css({
    left: this.x + this.radius /2,
    top: this.y + this.radius / 2
    });
  this.canvas.append(this.tooltip);
};

SimpleBubble.prototype.hideToolTip = function() {
  $(".tooltip").remove();
};

SimpleBubble.prototype.move = function() {
  this.el.css({top: this.y, left:this.x});
};

SimpleVis = function(container,d) {
  this.width = 800;
  this.height = 400;
  this.canvas = $(container);
  this.data = d;
  this.force = null;
  this.bubbles = [];
  this.centers = [
  {x: 200, y:200},
  {x: 400, y:200},
  {x: 600, y:200}
  ];

  this.bin = d3.scale.ordinal().range([0,1,2]);

  this.bubbleCharge = function(d) {
    return -Math.pow(d.radius,1) * 8;
  };

  this.init();
};

SimpleVis.prototype.init = function() {
  /* Store reference to original this */
  var me = this;

  /* Initialize root visualization element */
  this.canvas.css({
    width: this.width,
    height: this.height,
    "background-color": "#eee",
    position: "relative"});

  /* Create Bubbles */
  for(var i=0; i< this.data.length; i++) {
    var b = new SimpleBubble(this.data[i], i, this.canvas);
    /* Define Starting locations */
    b.x = b.boxSize + (20 * (i+1));
    b.y = b.boxSize + (10 * (i+1));
    this.bubbles.push(b);
    /* Add root bubble element to visualization */
    this.canvas.append(b.el);
  };

  /* Setup force layout */
  this.force = d3.layout.force()
    .nodes(this.bubbles)
    .gravity(0)
    .charge(this.bubbleCharge)
    .friction(0.87)
    .size([this.width, this.height])
    .on("tick", function(e) {
      me.bubbles.forEach( function(b) {
        me.setBubbleLocation(b, e.alpha, me.centers);
        b.move();
      });
    });

  this.force.start();
};

SimpleVis.prototype.setBubbleLocation = function(bubble, alpha, centers) {
  var center = centers[this.bin(bubble.id)];
  bubble.y = bubble.y + (center.y - bubble.y) * (0.115) * alpha;
  bubble.x = bubble.x + (center.x - bubble.x) * (0.115) * alpha;
};

$(document).ready(function() {
  var vis = new SimpleVis("#canvas", [12,33,20,40,60,10,25,44,13,23,14,25,8]);

  $("#move").on("click", function(e) {
    vis.bin.range(vis.bin.range().reverse());
    vis.force.resume();
    return false;
  });
});


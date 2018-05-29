
// ************************************
// HOP PLOTS
// ************************************

function gaussian(mean, stdev) {
  var y2;
  var use_last = false;
  return function() {
    var y1;
    if(use_last) {
      y1 = y2;
      use_last = false;
    }
    else {
      var x1, x2, w;
      do {
        x1 = 2.0 * Math.random() - 1.0;
        x2 = 2.0 * Math.random() - 1.0;
        w  = x1 * x1 + x2 * x2;
      } while( w >= 1.0);
      w = Math.sqrt((-2.0 * Math.log(w))/w);
      y1 = x1 * w;
      y2 = x2 * w;
      use_last = true;
    }

    var retval = mean + stdev * y1;
    if(retval > 0)
    return retval;
    return -retval;
  }
}

function randomIntFromInterval(min,max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


function createHopPlot() {
  const width = 200;
  const height = 200;
  let ctx = null;
  let data = [];
  let t = null;
  let dataN = 200;
  let spaceR = 100;
  let running = true;
  let color = [0,0,0,0.8]
  let barWidth = 8;
  let trails = false;

  let interval = 140;
  var params = [100, 15]

  const tau = 2 * Math.PI;

  function setupParticles() {
    data = new Array(dataN);

    const standard = gaussian(params[0], params[1]);

    for (let i = 0; i < dataN; ++i) {
      data[i] = {
        y: standard()
      };
    }
  }

  const chart = function wrapper(selection) {
    setupParticles();

    const div = d3.select(selection).append('div')
      .attr('class', 'vis')
      .style('width', width + 'px');

    const canvas = div.append('canvas')
      .attr('width', width)
      .attr('height', height);

    div.append('button')
      .attr('class', 'toggle-btn')
      .on('click', toggle)
      .text('start/stop');

    const scale = window.devicePixelRatio;
    ctx = canvas.node().getContext('2d');
    if (scale > 1) {
      canvas.style('width', width + 'px');
      canvas.style('height', height + 'px');
      canvas.attr('width', width * scale);
      canvas.attr('height', height * scale);
      ctx.scale(scale, scale);
    }


    t = d3.interval(updateHOP, interval);

    // update();
    // d3.timer();
  };

  function updateHOP(elapsed) {
    ctx.save();
    // ctx.globalAlpha = 0.2;
    if (trails) {

      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillRect(0, 0, width, height);
    } else {

      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillRect(0, 0, width, height);
    }
    ctx.fillStyle = "black";
    // ctx.globalAlpha = 1.0;
    // ctx.clearRect();


    const point = data[randomIntFromInterval(0, dataN - 1)];
    point.x = width / 2;

    ctx.fillRect(50, point.y, width - 100, barWidth);
    ctx.restore();
  }

  function toggle() {
    if (running) {
      running = false;
      t.stop();
    } else {
      running = true;
      t = d3.interval(updateHOP, interval);
    }
  }

  chart.radius = function radius(_) {
    if (!arguments.length) {
      return spaceR;
    }

    spaceR = _;
    return this;
  };

  chart.params = function setParams(_) {
    if (!arguments.length) {
      return params;
    }

    params = _;
    return this;
  };

  chart.interval = function setinterval(_) {
    if (!arguments.length) {
      return interval;
    }

    interval = _;
    return this;
  };

  chart.trails = function settrails(_) {
    if (!arguments.length) {
      return trails;
    }

    trails = _;
    return this;
  };

  chart.count = function count(_) {
    if (!arguments.length) {
      return dataN;
    }

    dataN = _;
    return this;
  };

  return chart;
}

const hplot1 = createHopPlot();
const hplot2 = createHopPlot().interval(1000);
const hplot3 = createHopPlot().trails(true);
const hplot4 = createHopPlot().interval(1000).trails(true);

hplot1('#hop1');
hplot2('#hop2');
hplot3('#hop3');
hplot4('#hop4');

// const hplot5 = createHopPlot().interval(500).trails(true).params([100, 15]);
// const hplot6 = createHopPlot().interval(500).trails(true).params([50, 15]);
// const hplot7 = createHopPlot().interval(500).trails(true).params([50, 50]);

// hplot5('#hop5');
// hplot6('#hop6');
// hplot7('#hop7');

// ************************************
// MORPH ICONS
// ************************************

var basedir = '../../../data/uncertainty/icons';

function createMorphIcon() {

  var values = [{ id: 'A', time: 0.5}, {id: 'C', time: 0.5 }];

  var timeScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, 5 * 1000])

  var curIndex = 0;

  var rootDiv = null;
  var allIcons = null;

  function addIcon(selection, icons, iconId) {
    selection.selectAll('svg')
      // .transition()
      // .duration(50)
      // .attr('opacity',0)
      .remove();


    selection.node().appendChild(icons[iconId].cloneNode(true));

    selection.select('svg')
      .attr('width', 30)
      .attr('height', 30)
      .attr('opacity', 0)
      .transition()
        .duration(50)
        .attr('opacity', 1.0);
    // selection.each(function(d) {
    //   d3.select(this).selectAll('svg')
    //     // .transition(20)
    //     // .opacity(0)
    //     .remove();
    //
    //
    //
    // });
  }

  const chart = function wrapper(selection, icons) {
    allIcons = icons;
    rootDiv = d3.select(selection).append('div')
      .attr('class', 'micon');
    addIcon(rootDiv, allIcons, values[curIndex].id);
    repeat();
  }

  function repeat() {
    rootDiv.select('svg')
      .transition()
      .duration(timeScale(values[curIndex].time))
      .ease(d3.easeExpOut)
      .attr('opacity', 1)
      .on('end', function() {
        curIndex = (curIndex + 1) % values.length
        addIcon(rootDiv, allIcons, values[curIndex].id);
        repeat();
      })
  }

  chart.values = function setValues(_) {
    if (!arguments.length) {
      return values;
    }

    values = _;
    return this;
  };


  return chart;
}

var icon1 = createMorphIcon();
var icon2 = createMorphIcon().values([
  { id: 'A', time: 0.7 },
  { id: 'D', time: 0.2 },
  { id: 'E', time: 0.1 }]);

var icon3 = createMorphIcon().values([
  { id: 'B', time: 0.4 },
  { id: 'D', time: 0.3 },
  { id: 'E', time: 0.3 }]);

var icon4 = createMorphIcon().values([
  { id: 'A', time: 0.6 },
  { id: 'E', time: 0.4 }
  ]);

var icon5 = createMorphIcon().values([
  { id: 'C', time: 0.5 },
  { id: 'A', time: 0.3 },
  { id: 'E', time: 0.2 }]);

function showIcons(selection, icons) {
  var iconE = d3.select(selection).selectAll('.icon')
    .data(Object.keys(icons))
    .enter()
    .append('div')
    .classed('micon', true);
  iconE.each(function(d) {
    d3.select(this).node().appendChild(icons[d].cloneNode(true));
    d3.select(this).select('svg')
      .attr('width', 30)
      .attr('height',30);
  });
  iconE.append('p')
    .classed('icon-label', 'true')
    .text(function(d) { return d; });
}

function loadVis(error, battle, remote, riot, strategic, civilians) {
  // console.log(civilians)
  var icons = {
    A: battle.getElementsByTagName('svg')[0],
    B: remote.getElementsByTagName('svg')[0],
    C: riot.getElementsByTagName('svg')[0],
    D: strategic.getElementsByTagName('svg')[0],
    E: civilians.getElementsByTagName('svg')[0],
  };

  showIcons('#iconsall', icons);

  icon1('#icon1', icons);
  icon2('#icon2', icons);

  icon3('#icon3', icons);
  icon4('#icon4', icons);
  icon5('#icon5', icons);

}

d3.queue()
  .defer(d3.xml, basedir + '/battle.svg')
  .defer(d3.xml, basedir + '/remote.svg')
  .defer(d3.xml, basedir + '/riot.svg')
  .defer(d3.xml, basedir + '/strategic.svg')
  .defer(d3.xml, basedir + '/civilians.svg')
  .await(loadVis);


// ************************************
// Wandering Dots
// ************************************

function createWanderingDots() {
  const width = 300;
  const height = 300;
  let ctx = null;
  let particles = [];
  let t = null;
  let numParticles = 200;
  const particleR = 2.5;
  let spaceR = 100;
  let running = true;
  let color = [0,0,0,0.8]

  const tau = 2 * Math.PI;

  function setupParticles() {
    particles = new Array(numParticles);

    for (let i = 0; i < numParticles; ++i) {
      particles[i] = {
        x: width / 2,
        y: height / 2,
        vx: 0,
        vy: 0,
      };
    }
  }

  const chart = function wrapper(selection) {
    setupParticles();

    const div = d3.select(selection).append('div')
      .attr('class', 'vis')
      .style('width', width + 'px');

    const canvas = div.append('canvas')
      .attr('width', width)
      .attr('height', height);

    div.append('button')
      .attr('class', 'toggle-btn')
      .on('click', toggle)
      .text('start/stop');

    const scale = window.devicePixelRatio;
    ctx = canvas.node().getContext('2d');
    if (scale > 1) {
      canvas.style('width', width + 'px');
      canvas.style('height', height + 'px');
      canvas.attr('width', width * scale);
      canvas.attr('height', height * scale);
      ctx.scale(scale, scale);
    }

    t = d3.timer(updateDots);

    // update();
    // d3.timer();
  };

  function updateDots(elapsed) {
    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // ctx.arc(width / 2, height / 2, width / 4, 0, tau);
    // ctx.clip();

    const spaceX = width / 2;
    const spaceY = height / 2;

    for (let i = 0; i < numParticles; ++i) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (Math.pow(p.x - spaceX, 2) + Math.pow(p.y - spaceY, 2) > Math.pow(spaceR, 2)) {
        p.x = width / 2;
        p.y = height / 2;
      }
      // if (p.x < -width) {
      //   p.x = width / 2;
      // } else if (p.x > width) {
      //   p.x = width / 2;
      // }
      // if (p.y < -height) {
      //   p.y = height / 2;
      // } else if (p.y > height) {
      //   p.y -= height / 2;
      // }

      p.vx += 0.2 * (Math.random() - 0.5) - 0.01 * p.vx;
      p.vy += 0.2 * (Math.random() - 0.5) - 0.01 * p.vy;

      ctx.beginPath();
      ctx.arc(p.x, p.y, particleR, 0, tau);
      ctx.fill();
    }
    ctx.restore();
  }

  function toggle() {
    if (running) {
      running = false;
      t.stop();
    } else {
      running = true;
      t.restart(updateDots);
    }
  }

  chart.radius = function radius(_) {
    if (!arguments.length) {
      return spaceR;
    }

    spaceR = _;
    return this;
  };

  chart.count = function count(_) {
    if (!arguments.length) {
      return numParticles;
    }

    numParticles = _;
    return this;
  };

  return chart;
}


const plot = createWanderingDots();
const plot2 = createWanderingDots().radius(50);
// const plot3 = createWanderingDots().radius(10);

plot('#dot1');
plot2('#dot2');
// plot3('#dot3');


const plotc = createWanderingDots().count(200);
// const plotc2 = createWanderingDots().count(100);
const plotc3 = createWanderingDots().count(10);

plotc('#dotc1');
// plotc2('#dotc2');
plotc3('#dotc3');


// ************************************
// WANDERING DOTS - BOUNDED
// ************************************

function createWanderingDotsBounded() {
  const width = 300;
  const height = 300;
  let ctx = null;
  let particles = [];
  let t = null;
  let numParticles = 200;
  const particleR = 2.5;
  let running = true;
  let color = [0,0,0,0.8]

  let boundaryPolygon = [[0, 0], [width, 0], [width, height], [0, height], [0, 0]];
  let hull = d3.polygonHull(boundaryPolygon);
  let centroid = d3.polygonCentroid(boundaryPolygon);

  // a value between 0 and 1 which determines how close to the centroid
  // new points spawn. 1 = at centroid, 0 = at boundary.
  let centroidPull = 0.1;

  const tau = 2 * Math.PI;

  // helper to find a point within a convex hull by selecting three
  // points on the hull edge and interpolating between them.
  function pointWithinHull() {
    let hullPointA = hull[Math.floor(Math.random() * hull.length)];
    let hullPointB;
    do {
      hullPointB = hull[Math.floor(Math.random() * hull.length)];
    } while (hullPointA === hullPointB);

    let hullPointC;
    do {
      hullPointC = hull[Math.floor(Math.random() * hull.length)];
    } while (hullPointA === hullPointC && hullPointB === hullPointC);

    let point = d3.interpolateArray(hullPointA, hullPointB)(Math.random());
    point = d3.interpolateArray(point, hullPointC)(Math.random());

    // pull it slightly towards the middle so that points do not end up on
    // a border and get rejected
    point = d3.interpolateArray(point, centroid)(centroidPull);

    return point;
  }

  // helper to find a point within a polygon by selecting a point
  // within its hull until one is within the polygon
  function pointWithinPolygon() {
    let point;

    let attempts = 0;
    do {
      point = pointWithinHull();
      attempts += 1;
    } while (attempts < 10 && !d3.polygonContains(boundaryPolygon, point));

    if (attempts >= 10) {
      point = centroid;
    }

    return point;
  }

  function setupParticles() {
    particles = new Array(numParticles);

    for (let i = 0; i < numParticles; ++i) {
      const point = pointWithinPolygon();
      particles[i] = {
        x: point[0],
        y: point[1],
        vx: 0,
        vy: 0,
      };
    }
  }

  const chart = function wrapper(selection) {
    setupParticles();

    const div = d3.select(selection).append('div')
      .attr('class', 'vis')
      .style('width', width + 'px');

    const canvas = div.append('canvas')
      .attr('width', width)
      .attr('height', height);

    div.append('button')
      .attr('class', 'toggle-btn')
      .on('click', toggle)
      .text('start/stop');

    const scale = window.devicePixelRatio;
    ctx = canvas.node().getContext('2d');
    if (scale > 1) {
      canvas.style('width', width + 'px');
      canvas.style('height', height + 'px');
      canvas.attr('width', width * scale);
      canvas.attr('height', height * scale);
      ctx.scale(scale, scale);
    }

    t = d3.timer(updateParts);
  };

  function updateParts(elapsed) {
    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // draw the boundaryPolygon
    ctx.strokeStyle = 'tomato';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(boundaryPolygon[0], boundaryPolygon[1]);
    boundaryPolygon.slice(1).forEach((point, i) => {
      ctx.lineTo(point[0], point[1]);
    });
    ctx.closePath();
    ctx.stroke();

    const spaceX = width / 2;
    const spaceY = height / 2;

    for (let i = 0; i < numParticles; ++i) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      // generate a new point if it goes out of bounds
      if (!d3.polygonContains(boundaryPolygon, [p.x, p.y])) {
        const point = pointWithinPolygon();
        p.x = point[0];
        p.y = point[1];
      }

      p.vx += 0.2 * (Math.random() - 0.5) - 0.01 * p.vx;
      p.vy += 0.2 * (Math.random() - 0.5) - 0.01 * p.vy;

      ctx.beginPath();
      ctx.arc(p.x, p.y, particleR, 0, tau);
      ctx.fill();
    }
    ctx.restore();
  }

  function toggle() {
    if (running) {
      running = false;
      t.stop();
    } else {
      running = true;
      t.restart(updateParts);
    }
  }

  chart.count = function count(_) {
    if (!arguments.length) {
      return numParticles;
    }

    numParticles = _;
    return this;
  };

  chart.boundary = function boundary(_) {
    if (!arguments.length) {
      return boundaryPolygon;
    }

    boundaryPolygon = _;
    hull = d3.polygonHull(boundaryPolygon);
    centroid = d3.polygonCentroid(boundaryPolygon);

    return this;
  };

  chart.centroidPull = function centroidPullGetterSetter(_) {
    if (!arguments.length) {
      return centroidPull;
    }

    centroidPull = _;
    return this;
  };

  return chart;
}

// draw with no specified boundary
const wplot = createWanderingDotsBounded();
wplot('#wdot1');

// draw based on manual polygon pixels
const polygon = [
  [20, 20],
  [40, 10],
  [70, 25],
  [200, 5],
  [280, 50],
  [260, 100],
  [270, 200],
  [150, 240],
  [100, 100],
  [0, 30],
]
// const plot2 = createWanderingDots().boundary(polygon);
// plot2('#wdot2');

// draw based on admin shape
const adminFile = '../../../data/uncertainty/map.json'
d3.json(adminFile, (err, admin) => {
  // just use the first admin area as an example
  const polygonGeoJson = admin.features[0].geometry;
  const coordinates = polygonGeoJson.coordinates[0];

  // project to the 300x300 box
  const projection = d3.geoMercator()
    .scale(1)
    .translate([0, 0])
    .fitSize([300, 300], polygonGeoJson);

  // convert lat long to pixel based on projection
  const pixelCoords = coordinates.map(projection);

  // draw the plots
  const wplot3 = createWanderingDotsBounded().boundary(pixelCoords);
  wplot3('#wdot3');

  // const plotc1 = createWanderingDots().boundary(pixelCoords).centroidPull(0.1);
  // plotc1('#dotc1');

  // const plotc2 = createWanderingDots().boundary(pixelCoords).centroidPull(0.5);
  // plotc2('#dotc2');

  // const plotc3 = createWanderingDots().boundary(pixelCoords).centroidPull(1.0);
  // plotc3('#dotc3');
})


//*****************
// WANDERING HULLS
//*****************



function createWanderingHull() {
  const width = 300;
  const height = 300;
  let ctx = null;
  let particles = [];
  let t = null;
  let numParticles = 10;
  let spaceR = 100;
  let running = true;
  let color = "rgba(0,0,0,1.0)"
  var showPath = true;

  const tau = 2 * Math.PI;

  function setupParticles() {
    particles = new Array(numParticles);

    for (let i = 0; i < numParticles; ++i) {
      particles[i] = {
        x: width / 2,
        y: height / 2,
        vx: 0,
        vy: 0,
      };
    }
  }

  const chart = function wrapper(selection) {
    setupParticles();

    const div = d3.select(selection).append('div')
      .attr('class', 'vis')
      .style('width', width + 'px');

    const canvas = div.append('canvas')
      .attr('width', width)
      .attr('height', height);

    div.append('button')
      .attr('class', 'toggle-btn')
      .on('click', toggle)
      .text('start/stop');

    const scale = window.devicePixelRatio;
    ctx = canvas.node().getContext('2d');
    if (scale > 1) {
      canvas.style('width', width + 'px');
      canvas.style('height', height + 'px');
      canvas.attr('width', width * scale);
      canvas.attr('height', height * scale);
      ctx.scale(scale, scale);
    }

    t = d3.timer(updateHull);

    // updateHull();
    // d3.timer();
  };

  function updateHull(elapsed) {
    const points = particles.map(function (p) { return [p.x, p.y]; });
    const hull = d3.polygonHull(points);
    ctx.save();
    ctx.clearRect(0, 0, width, height);

    ctx.moveTo(hull[0][0], hull[0][1]);
    for (var i = 1, n = hull.length; i < n; ++i) {
      ctx.lineTo(hull[i][0], hull[i][1]);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    if (showPath) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 15;
      ctx.lineJoin = "round";
      ctx.stroke();
    }

    // ctx.arc(width / 2, height / 2, width / 4, 0, tau);
    // ctx.clip();

    const spaceX = width / 2;
    const spaceY = height / 2;

    for (let i = 0; i < numParticles; ++i) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (Math.pow(p.x - spaceX, 2) + Math.pow(p.y - spaceY, 2) > Math.pow(spaceR, 2)) {
        p.vx = -1 * p.vx;
        p.vy = -1 * p.vy;
        // p.vy = -1 * p.vy;
        // p.x = width / 2;
        // p.y = height / 2;
      }
      // if (p.x < -width) {
      //   p.x = width / 2;
      // } else if (p.x > width) {
      //   p.x = width / 2;
      // }
      // if (p.y < -height) {
      //   p.y = height / 2;
      // } else if (p.y > height) {
      //   p.y -= height / 2;
      // }

      p.vx += 0.2 * (Math.random() - 0.5) - 0.01 * p.vx;
      p.vy += 0.2 * (Math.random() - 0.5) - 0.01 * p.vy;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 0, 0, tau);
      ctx.fill();
    }
    ctx.fill();
    ctx.restore();
  }

  function toggle() {
    if (running) {
      running = false;
      t.stop();
    } else {
      running = true;
      t.restart(updateHull);
    }
  }

  chart.radius = function radius(_) {
    if (!arguments.length) {
      return spaceR;
    }

    spaceR = _;
    return this;
  };

  chart.color = function setColor(_) {
    if (!arguments.length) {
      return color;
    }

    color = _;
    return this;
  };

  chart.count = function count(_) {
    if (!arguments.length) {
      return numParticles;
    }

    numParticles = _;
    return this;
  };

  chart.showPath = function setShowPath(_) {
    if (!arguments.length) {
      return showPath;
    }

    showPath = _;
    return this;
  };

  return chart;
}

const hulPlot = createWanderingHull();
const hulPlot2 = createWanderingHull().radius(50);
const hulPlot3 = createWanderingHull().radius(10);

hulPlot('#hull1');
// hulPlot2('#hull2');
hulPlot3('#hull3');

// const hulPlot4 = createWanderingHull().color("rgba(0,0,0,0.4)").showPath(false);
// const hulPlot5 = createWanderingHull().radius(10).color('rgba(0,0,0,0.4)').showPath(false);
// hulPlot4('#hull4');
// hulPlot5('#hull5');


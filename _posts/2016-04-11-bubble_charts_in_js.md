---
layout: post
title: Creating Bubble Charts in JavaScript
twitter: true
twitter_type: summary_large_image
description: The classic Bubble Chart tutorial, now with 100% more JavaScript!
img: http://vallandingham.me/images/vis/bubble_chart/bubble_chart_twitter.jpg
demo: http://vallandingham.me/bubble_chart/
source: https://github.com/vlandham/bubble_chart
categories:
- tutorial
---

<div class="left">
<img style="width:200px;" src="http://vallandingham.me/images/vis/bubble_chart/thumb.png" alt="nyt bubble chart">
</div>

**Update:** If you would like to use D3v4 to create a bubble chart, [check out my new updated tutorial](http://vallandingham.me//bubble_charts_with_d3v4.html).

This tutorial is a **remake** of my [original Gates bubble chart](http://vallandingham.me/bubble_charts_in_d3.html) tutorial. The content, data, and visualization are all the same. The difference is this one is remade **with absolutely no CoffeeScript**. JavaScript has moved on. I've moved on. I hope this tutorial continues to be useful for folks who don't want to learn or deal with CoffeeScript. I've also stripped out jQuery, Bootstrap, and other cruft - allowing us to focus just on the bubbles.

You can find the [wonderfully annotated sourcecode on GitHub](https://github.com/vlandham/bubble_chart/blob/gh-pages/src/bubble_chart.js) and see it does indeed work as expected on the [live demo](http://vallandingham.me/bubble_chart/).

There are JS bubble chart implementations from other folks too! If you are interested, check out [ducky's gist translation](https://gist.github.com/ducky427/5583054) and the great [Gravity Bubbles](https://github.com/lflores/gravity-bubbles) from Leonardo Flores.

Below, I've updated the original tutorial to match the content of the new implementation. It is a light touch, so if you've read it before, you probably won't miss anything by skipping it now.

## Bubbles!

A now classic New York Times piece featured a [bubble chart of the proposed budget for 2013](http://www.nytimes.com/interactive/2012/02/13/us/politics/2013-budget-proposal-graphic.html) by [Shan Carter](https://twitter.com/#!/shancarter). It features some nice organic animations, and smooth transitions that add a lot of visual appeal to the graphic. This was all done using [D3.js](d3js.org).

As [FlowingData commenters point out](http://flowingdata.com/2012/02/15/slicing-obamas-2013-budget-proposal-four-ways/) , the use of bubbles may or may not be the best way to display this dataset. Still, the way this visualization draws you in and gets you to interact makes it a nice piece and one that makes you wonder how they did it.

In this post, we attempt to tease out some of the details of how this graphic works.

## An Animated Bubble Chart

In order to better understand the budget visualization, I’ve created a similar bubble chart that displays information about what education-based donations the Gates Foundation has made.

<a href="http://vallandingham.me/bubble_chart/"><img class="center" src="http://vallandingham.me/images/vis/bubble_chart/bubbles.jpg" style="width:700px"/></a>

[You can see the full visualization here](http://vallandingham.me/bubble_chart/)

And the [visualization code is on github](https://github.com/vlandham/bubble_chart)

The bubbles are color coded based on grant amount (I know the double encoding using size and color isn’t very helpful - but this data set didn’t have any quick and easy categorical fields besides year).

The data for this visualization comes from the Washington Post's DataPost. I’ve added a categorization to the amount for each grant (low, medium, high) and pulled out the start year, but otherwise have left the data alone.

The rest of this tutorial will walk through the functionality behind this Gates Foundation visualization. This visualization is just a sketch of the functionality in the New York Times graphic - so we can see the relevant parts clearly.

## D3 Force Layout Quick Reference

The [Force Layout](https://github.com/mbostock/d3/wiki/Force-Layout) component of D3.js is used to great effect to provide most of the functionality behind the transitions, animations, and collisions in the visualization.

This layout essentially starts up a little physics simulation in your visualization. Components push and pull at one another, eventually settling into their final positions. Typically, this layout is used for [graph visualization](http://mbostock.github.com/d3/ex/force.html) . Here, however, we forgo the use of edges and instead use it just to move around the nodes of a graph.

This means we don’t really need to know much about graph theory to understand how this graphic works. However, we do need to know the components that make up a force layout, and how to use them.

### nodes

`nodes` is an array of objects that will be used as the nodes (i.e. bubbles in this graph) in the layout. Each node in the array needs a few attributes like `x` and `y`.

In this visualization, we set some of the required attributes manually - so we are in full control of them. The rest we let D3 set and handle internally.

### gravity

In D3’s force layout, `gravity` isn’t really a force pushing downwards. Rather, it is a force that can push nodes towards the center of the layout.

The closer to the center a node is, the less of an impact the `gravity` parameter has on it.

Setting `gravity` to 0 disables it. `gravity` can also be negative. This gives the nodes a push away from the center.

### friction

As [the documentation states](https://github.com/mbostock/d3/wiki/Force-Layout#wiki-friction), perhaps a more accurate term for this force attribute would be **velocity decay**.

At each step of the physics simulation (or **tick** as it is called in D3), node movement is scaled by this `friction`. The recommended range of `friction` is 0 to 1, with 0 being no movement and 1 being no friction.

### charge

The `charge` in a force layout refers to how nodes in the environment push away from one another or attract one another. Kind of like magnets, nodes have a charge that can be positive (attraction force) or negative (repelling force).

### alpha

The `alpha` is the layout is described as the simulation’s *cooling factor* . I don’t know if that makes sense to me or not.

What I do know is that `alpha` starts at `0.1`. After a few hundred ticks, `alpha` is decreased some amount. This continues until `alpha` is really small (for example `0.005`), and then the simulation ends.

What this means is that `alpha` can be used to scale the movement of nodes in the simulation. So at the start, nodes will move relatively quickly. When the simulation is almost over, the nodes will just barely be tweaking their positions.

This allows you to damper the effects of the forces in your visualization over time. Without taking `alpha` into account, things like `gravity` would exert a consistent force on your nodes and pull them all into a clump.

## How This Bubble Chart Works

Ok, we didn’t cover everything in the force layout, but we got through all the relevant bits for this visualization. Let me know if I messed anything up.

Now on to the interesting part!

There are two features of this bubble chart I want to talk about in more detail: collision detection and transitions.

### Bubble Collision Detection

When I first saw the NYT chart, I was intrigued by how they could use different sized bubbles but not have them overlap or sit on top of one another.

The `charge` of a force layout specifies node-node repulsions, so it could be used to push nodes away from one another, creating this effect. But how can this work with different sizes if `charge` is just a single parameter?

The trick is that along with a static value, `charge` can also take a **function**, which is evaluated for each node in the layout, passing in that node’s data. Here is the charge function for this visualization:

```javascript
// Charge Function
function charge(d) {
  return -Math.pow(d.radius, 2.0) / 8;
}

// Creation of d3 force layout
var force = d3.layout.force()
  .size([width, height])
  .charge(charge) // <- Using the charge function in the force layout
  .gravity(-0.01)
  .friction(0.9);
```

Pretty simple right? The [charge documentation](https://github.com/mbostock/d3/wiki/Force-Layout#wiki-charge) provides us with the understanding that this parameter can be a constant, but can also be a function. Sweet!

The charge function takes in an input parameter, `d`, which is the data associated with a node. The method returns the negative of the radius squared of the node, divided by 8.

The negative is for pushing away nodes. Dividing by 8 scales the repulsion to an appropriate scale for the size of the visualization.

A couple of other factors are at work that also contribute to the nice looking placement of these nodes.

We set its gravity to `-0.01` and its friction value to `0.9` (which is the default). This says that nodes should be ever so slightly pushed away from the center of the layout, but there should be just enough friction to prevent them from scattering away.

So, nodes push away from one another based on their diameter - providing nice looking collision detection. The gravity and friction settings work along with this pushing to ensure nodes are sucked together or pushed away too far. It is a nice combo.


Here is the code that is used to configure and startup the force directed simulation:


### Animation and Transitions

The capstone of the original graphic is the nice transitions between views of the data, where bubbles are pulled apart into separate groups. I’ve replicated this somewhat by having a view that divides up Gate’s grants by year.

How is this done? Well, let's start with the "single group" view first. The position of each node is determined by the function called for each [tick](https://github.com/mbostock/d3/wiki/Force-Layout#tick) of the simulation. This function gets passed in the `alpha` for this iteration of the simulation.

```javascript
// Group circles into a single blob.
function groupBubbles() {
  force.on('tick', function (e) {
    bubbles.each(moveToCenter(e.alpha))
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
  });

  force.start();
}

function moveToCenter(alpha) {
  return function (d) {
    d.x = d.x + (center.x - d.x) * damper * alpha;
    d.y = d.y + (center.y - d.y) * damper * alpha;
  };
}
```

The `bubbles` variable holds the svg circles that represent each node. So for every tick event, for each circle in `bubbles`, the `moveToCenter` function is called, with the current `alpha` value passed in. Then, The `cx` and `cy` of each circle is set based on it’s data’s `x` and `y` values.

`moveToCenter` is charged with modifying the circle's `x` and `y` values based on the current alpha and the circle's position in the previous iteration of `tick`.

To reiterate, `moveToCenter` returns a function that is called for each circle, passing in its data. Inside this function, the `x` and `y` values of the data are pushed towards the `center` point (which is set to the center of the visualization). This push towards the center is dampened by a constant, `damper` and `alpha`.

The `alpha` dampening allows the push towards the center to be reduced over the course of the simulation, giving other forces like `gravity` and `charge` the opportunity to push back.

The variable `damper` is set to `0.102`. This probably took some time to find a good value for, and I just copied that from the original. Thanks NYT!

Ok, we’ve now seen how the nodes in the simulation move towards one point, what about multiple locations? The code is just about the same:

```javascript
// Split circles based on year.
function splitBubbles() {
  force.on('tick', function (e) {
    bubbles.each(moveToYears(e.alpha))
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
  });

  force.start();
}

function moveToYears(alpha) {
  return function (d) {
    var target = yearCenters[d.year];
    d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
    d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
  };
}
```

The switch to displaying by year is done by restarting the force simulation using `force.start()`. This time the *tick* function calls `moveToYears`.

`moveToYears` is almost the same as `moveToCenter`. The difference being that first the correct year point is extracted from `yearCenters`. Here’s what that object looks like:

```javascript
var yearCenters = {
  2008: { x: width / 3, y: height / 2 },
  2009: { x: width / 2, y: height / 2 },
  2010: { x: 2 * width / 3, y: height / 2 }
};
```

You can see each year has its own centroid position mapped to it.

`moveToYears` also multiplied by `1.1` to speed up the transition a bit. Again, these numbers take some tweaking and experimentation to find. The code could be simplified a bit if you wanted to pass in the unique multipliers for each transition.

So we’ve seen a general pattern for both of these views: setup the *tick* method to iterate over all the nodes to change their locations. This was done using the `each` method.

In fact you can chain multiple `each` methods that call different move functions. This would allow you to push and pull your nodes in various ways depending on their features. The NYT graphic uses at least two move functions for these transitions. One to move nodes towards a group point (like above), and one to move nodes towards their respective color band.

Hope this tutorial shows you some interesting ways to use D3’s force layout. I thought the original NYT visualization was interesting enough to find out more about it. Again, the full visualization code [can be found on github](https://github.com/vlandham/bubble_chart/blob/gh-pages/src/bubble_chart.js). It is about 400 lines long, but includes copious comments for your perusing pleasure.

Force layouts: they are not just for force-directed graphs anymore!

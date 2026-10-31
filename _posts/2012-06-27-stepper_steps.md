---
layout: post
title: Steps for Building a Stepper Visualization
categories:
  - tutorial
---

As the NYT’s Amanda Cox has said [in some of her talks](http://blog.visual.ly/10-things-you-can-learn-from-the-new-york-times-data-visualizations/) , annotating a visualization is one of the most important, but also one of the hardest things to do. In this post, we won’t tackle the ‘what’ to annotate, but an example of the ‘how’ to implement an annotation layer that needs to change as a user progresses through a visualization. [Here’s what we will be building](http://vallandingham.me/stepper_example/final/)

<div class="center">
<a href="http://vallandingham.me/stepper_example/final/"><img class="center" src="http://vallandingham.me/images/vis/stepper.png" alt="stepper image" style="border:1px dotted #cccccc;"/></a>

</div>
The [code for this example is on github](https://github.com/vlandham/stepper_example) . Each build of this process is broken up into its own folder.

We will look at implementing this using jQuery, and then as a bonus, a [D3.js](http://d3js.org/) only implementation.

According to Amanda’s [Eyeo 2012 talk](http://eyeofestival.com/) (which I saw streaming, but don’t know if it’ll be up anywhere), the New York Times graphics department calls this type of interactive element a **Stepper**. A great example of a stepper can be found in the [previously discussed](http://vallandingham.me/bubble_charts_in_d3.html) [Obama 2013 Budget Proposal](http://www.nytimes.com/interactive/2012/02/13/us/politics/2013-budget-proposal-graphic.html) visualization.

<div class="center">
<img class="center" src="http://vallandingham.me/images/vis/obama_stepper.png" alt="obama stepper image" style="border:1px dotted #cccccc;"/>

</div>
As the user clicks on each step of the stepper, the visualization changes - along with its annotations. This allows the visualization to focus on different points of the data presented at each step, and bring the viewer through the entire “story” of the data.

Before we get started, let me say that everything presented in this demo is pretty basic html and javascript. I just wanted to have a concise example of one way to implement a stepper for web-based. That being said, if you aren’t too bored already, then let’s get started!

## Overview

The method I will present here is largely based on the implementation shown in the Obama Budget visualization. There are dozens of ways this kind of stepper could be implemented. Here are some pros to this process:

**Keeps the annotations as html**

This allows for easier editing and styling via css.

**Uses jQuery to switch between annotation steps**

Odds are you have some familiarity with this framework.

**Pretty simple implementation**

Nothing too crazy going on, just a few commonly used html/javascript features.

So the basic steps we will follow will be to:

1.  Create the step annotations in html
2.  Style them using css
3.  Transition between them using jQuery

## The Annotation Html

Each step will have its own `div`, with a unique `id`, and a `class` identifying it as a step `div`. Inside this `div`, each chunk of annotation text can be separated in its own `div` for positioning.

Importantly, all the step divs should be wrapped in a container `div`. The reason we will see in a minute.

The stepper nav links can be built out of an unsorted list, like any other navigation control.

A simple example would look something like this:

[`build1/stepper.html`](https://github.com/vlandham/stepper_example/blob/gh-pages/build1/stepper.html):

```html
<!--Step navigation UI-->
<div id="vis-nav">
  <a href="#" id="step1" class="step-link active">Step1</a>
  <a href="#" id="step2" class="step-link">Step2</a>
  <a href="#" id="step3" class="step-link">Step3</a>
</div>

<!--Container for visualization-->
<div id="vis-container">
  <div id="annotation-steps">

    <!--Each steps annotation contained in a div-->
    <div class="annotation-step" id="step1-annotation">

      <!--Each annotation in a separate div for positioning-->
      <div class="annotation" id="step1-left-annotation" >
        <h4>Left Annotation Title</h4>
        <p>Here is the annotation text for the <strong>left</strong> annotation of step 1</p>
      </div>
      <div class="annotation" id="step1-right-annotation" >
        <h4>Right Annotation Title</h4>
        <p>Here is the annotation text for the <strong>right</strong> annotation of step 1</p>
      </div>
    </div>
    <div class="annotation-step" id="step2-annotation">
      <div class="annotation" id="step2-center-annotation" >
        <h4>Center Annotation Title</h4>
        <p>Here is the annotation text for the center annotation of step 2.<br/>
          We are using absolute positioning of these divs</p>
      </div>
    </div>
    <div class="annotation-step" id="step3-annotation">
      <div class="annotation" id="step3-high-annotation" >
        <h4>High Annotation Title</h4>
        <p>This is text up high.</p>
      </div>
      <div class="annotation" id="step3-low-annotation" >
        <h4>Low Annotation Title</h4>
        <p>This is text down low.</p>
      </div>
    </div>
  </div>
  <div id="vis-canvas">
    <!--Draw visualization here-->
  </div>
</div>
```

Our `vis-container` div wraps the entire visualization. The annotation sets for each step are contained in their own div with an `.annotation-step` class, and all annotation steps are children of `#annotation-steps`.

The `#vis-canvas` div would be where the actual visualization would be created.

If we were to stop now, [here is what it would look like](http://vallandingham.me/stepper_example/build1/)

## The CSS

So far our annotation layer isn’t very impressive. The text for all the steps are visible at the same time, and they go down the page instead of being stacked on top of one another. Let’s look at the minium amount of css that is required to get our annotation layer looking right.

The main trick used to get positioning how we want it is [absolute positioning inside a relative div](http://css-tricks.com/absolute-positioning-inside-relative-positioning/) . Like the link states, when absolute-positioned `divs` are inside a relative-positioned `div`, we can specify the exact location of these absolute `divs` within their parent `div`. Meaning, we don’t have to worry about positioning our annotations relative to the entire body of the page (which would get pretty annoying every time a little change was made).

For our `.annotation-step` divs, we want them all to stack on top of one another. Thus, using just `position: absolute;` should do the trick. It will absolutely position the `div` at the top of its relative parent.

For our specific blocks of text within the annotation, we can use absolute positioning, along with the `left`/@top@ styles to define exactly where each should go inside its `annotation-step`. You wouldn’t want to write an entire site using absolute positioning, but this method provides the kind of precision you want for where your annotation goes. Also, if you have better ways to position elements like this, let me know!

We finish off with some `z-index` to ensure the annotation layer and stepper controls are on top of the visualization.

Our basic stylings now look like this:

[`build2/stepper.css`](https://github.com/vlandham/stepper_example/blob/gh-pages/build2/stepper.css):

```css

/* Here is our relatively positioned
 * container div to hold the rest of the
 * visualization */

#vis-container {
  position: relative;
  width: 980px;
  height: 700px;
  margin-top: 10px;
}

/* All the .annotation-step divs are inside
 * #annotation-steps. z-index ensures annotations
 * stay on top of visualization. */

#annotation-steps {
  position: absolute;
  z-index: 40;
}

#vis-nav {
  z-index: 20;
}

/* This is where you would create the actual visualization.
 * Right now, lets just change the background color. */

#vis-canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  overflow: hidden;
  background-color: #eee;
}

/* By default, all annotation-steps are hidden. */

.annotation-step {
  position: absolute;
  display: none;
}

/* Finally we can position each annotation exactly how
 * we want. */

.annotation {
  position: absolute;
}

#step1-left-annotation {
  left: 30px;
  top: 120px;
  width: 200px;
}

/* The rest of the annotation positions are in the final
 * demo. */
```

The comments in the code should let you follow what is going on.

Note that we have hidden all the `.annotation-step` divs, but we would like to start by showing the annotations for the first step. This can be done by adding `style="display:block;"` to the html of the first step’s div. This overrides the `display:none;` in our css file.

```html
<div class="annotation-step" id="step1-annotation" style="display:block;">
```

While we are at it, lets make the stepper look half-way decent. The Obama Budget visualization uses a nice looking multipart button, complete with fancy rounded corners and shadows. You can find a close approximation to this style from [Twitter Bootstrap’s Button Group](http://twitter.github.com/bootstrap/components.html#buttonGroups) . Twitter Bootstrap makes it easy to make your UI elements look good. For this demo, however, I didn’t want to pull in their css and add any complexity. So instead, we will just style them as simple boxes:

[`build2/nav.css`](https://github.com/vlandham/stepper_example/blob/gh-pages/build2/nav.css):

```css

/* Basic styling for the step links */
a.step-link {
  padding: 5px;
  background-color: #444;
  color: #666;
  text-decoration: none;
}

a.step-link:hover, a.active {
  color: #ddd;
}
```

As an aside, I <strong>am</strong> using a [reset css file](https://github.com/vlandham/stepper_example/blob/gh-pages/final/css/reset.css) in addition to the css above. This is from the [HTML5 Boilerplate template](http://html5boilerplate.com/) .

## The Javascript

Our javascript needs to switch the annotations to a new step when a step link is pressed, and look classy doing it. To do this, we will rely on the consistent naming of the id’s of the `.step-link` anchors and the id’s of the `annotation-step` divs. First, lets hook up a click callback function for the step links:

[`build3/stepper.js`](https://github.com/vlandham/stepper_example/blob/gh-pages/build3/stepper.js):

```javascript
$(document).ready(function() {
  $("a.step-link").click(function(e) {
    var clickedStep = $(this).attr('id');
    switchStep(clickedStep);
    switchAnnotation(clickedStep);
    return false;
  });
});
```

This code is using [jQuery 1.7.2](http://jquery.com/) , but shouldn’t really be too version specific.

Basically, we just need to get the new step’s id somehow (this uses jQuery’s `attr` method), and use it to switch to the next step.

I’ve broken up the switching of the step into two functions: `switchStep` changes which step is active in the stepper links. `switchAnnotations` will change which `.step-annotation` is being displayed.

Here is the entire js for this demo:

[`final/js/stepper.js`](https://github.com/vlandham/stepper_example/blob/gh-pages/final/js/stepper.js):

```javascript

function switchStep(newStep)
{
  $(".step-link").toggleClass("active", false);
  $("#" + newStep).toggleClass("active", true);
}

function switchAnnotation(newStep)
{
  $(".annotation-step").hide();
  $("#" + newStep + "-annotation").delay(300).fadeIn(500);
}

$(document).ready(function() {
  $("a.step-link").click(function(e) {
    var clickedStep = $(this).attr('id');
    switchStep(clickedStep);
    switchAnnotation(clickedStep);
    return false;
  });
});
```

So in `switchStep`, we use jQuery’s `.toggleClass` method to de-activate all steps and then activate the new step.

In `switchAnnotation`, we do much the same thing with the annotation step divs. First we hide all the annotation steps, then use the `newStep` to find the step that should be turned on. To make things a little special, we use the `fadeIn` method to have the annotation appear after a bit of a delay. Fancy!

## Bonus: D3 Only Version

Since as of late, I’ve been excited to use [D3.js](http://d3js.org/) , I was interested in how difficult it would be do implement this functionality just D3 instead of jQuery. It turns out, its not too hard at all.

Here’s the [example just using D3](http://vallandingham.me/stepper_example/final_d3/) .

The javascript code is below:

[`final_d3/js/stepper.js`](https://github.com/vlandham/stepper_example/blob/gh-pages/final_d3/js/stepper.js):

```javascript

function switchStep(newStep)
{
  d3.selectAll(".step-link").classed("active", false);
  d3.select("#" + newStep).classed("active", true);
}

function switchAnnotation(newStep)
{
  d3.selectAll(".annotation-step")
    .style("display", "none")
    .style("opacity", 0.0);

  d3.select("#" + newStep + "-annotation")
    .style("display", "block")
    .transition().delay(300).duration(500)
      .style("opacity", 1);
}

d3.selectAll("a.step-link").on("click", function(d) {
  var clickedStep = d3.select(this).attr("id");
  switchStep(clickedStep);
  switchAnnotation(clickedStep);
  return false;
});
```

You can see it might be a bit more verbose, but it gets the job done. A few things to point out with this D3 example:

##### Be mindful of when to use `.select` or `.selectAll`

With D3, you need to use the `.select` method when accessing a single element on the page (like when we activate one of the stepper nav links), and `.selectAll` when you are going to be modifying the attributes of multiple elements (like hiding all the stepper annotations).

##### Difference between `.attr` and `.style`

I always start using `.attr` to attempt to change CSS styles of an element when I need to use `.style`. Don’t be like me.

Also, its important to remember that `.attr` (and `.style`) are accessors as well as setters. This feature of `.attr` is used to get the `id` of the stepper nav link clicked.

##### Implementing your own fade in

D3 doesn’t have short-cuts for fancy transitions. Instead, you implement your own using the `d3.transition()` selection.

This usually isn’t too hard - and means you can make very complicated transitions very quickly. In this example, I set all the `.annotation-step` div’s opacities to 0, then transition to an opacity of 1. `.delay` and `.duration` ensure that it looks the same as our jQuery example.

##### Move js code inclusion to end of html file.

To simulate the functionality of `$(document).ready()`, I’ve found [recommendations](http://stackoverflow.com/questions/7169370/d3-js-and-document-onready) that say putting the javascript code at the end of your html file simulates the desired behavior of waiting for the document to load.

This is what I did for the [index.html of this D3 example](https://github.com/vlandham/stepper_example/blob/gh-pages/final_d3/index.html) .

Again, all this [code is on github](https://github.com/vlandham/stepper_example) as a separate project, so have fun building some steppers!

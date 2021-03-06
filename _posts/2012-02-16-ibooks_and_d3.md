---
layout: post
title: iBook Widgets with D3.js
categories:
  - tutorial
---

### Create a HTML Widget for iBooks using d3.js without Dashcode

<div class="left">
<img src="http://vallandingham.me/images/ibooks/ibooks_author_icon.png" alt="ibooks author icon">

</div>
With the release of [iBooks Author](http://www.apple.com/ibooks-author/) , the idea of using powerful javascript libraries inside using their [HTML Module](http://www.apple.com/ibooks-author/gallery.html) functionality probably came to a lot of people. I have certainly been thinking about the potential power of something like [d3.js](http://mbostock.github.com/d3/) or [leaflet.js](https://leafletjs.com/) embedded in an interactive text-book.

When iBooks Author was announced, I spent 5 minutes entertaining this idea, but soon was frustrated with having to come up to speed with Dashcode and other Apple developer tools - when all I really wanted to do was make a fun, interactive visualization.

Recently, I stumbled upon [ibooksauthor.es](http://ibooksauthor.es/) a blog by Miguel Sanchez Molina that [describes how to create an interactive visualization using Raphael](http://ibooksauthor.es/widgets-interactivos-html/) **without** the need for Dashcode.

Consider this write-up a slight spin on the same idea, but using d3.js, with a hint of automation.

## Anatomy of a Dashcode Widget

<div class="left">
<img src="http://vallandingham.me/images/ibooks/widgt_icon.png" alt="dashcode widget icon">
</div>

It turns out, a widget is really just a specially named folder with the `.wdgt` extension.

You can right-click on a widget, select ‘Show Package Contents’ and see the HTML and javascript files that go into it.

If I look at the default ‘Countdown’ widget from Dashcode, without any modifications, here are the files and directories it uses:

    * attributes.js
    * Default.png
    * en.lproj
    * iCal.js
    * Icon.png
    * Images/
    * Info.plist
    * main.css
    * main.html
    * main.js
    * Parts/

Where the `Parts/` directory stores Dashcode javascript libraries. The required components to a widget are just a subset of these files:

- Info.plist - the plist file that tells a user of the widget how to run it.
- Default.png - a preview image of the widget when it is not running.
- main.html - or some html file to give it some functionality.

And most likely you’ll want one or more javascript files - as we are trying to make an interactive visualization.

## Creating An Interactive Dashcode Widget

So again, our goal is to create an interactive widget using d3.js, without the need for using Dashcode directly.

To this end, I’ve created a [vis widget starting point](https://github.com/vlandham/vis_widget) that includes the necessary files to kick start just such a project.

Here’s what it’ll look like. Click for the actual interactive visualization. You can click and drag the circles around:

You can see, its not much to look at - but its something to start with.

### Vis Widget Template

This [vis_widget repo](https://github.com/vlandham/vis_widget) includes d3.js as well as [Twitter bootstrap](http://twitter.github.com/bootstrap/) css, jQuery, and some other handy files. The html and file structure is based on [HTML5 Boilerplate](http://html5boilerplate.com/)

If you are familiar at all with Ruby and [Bundler](http://gembundler.com/) , you should be able to run:

<pre>
bundle install
thin start
</pre>

And then open up `http://0.0.0.0:3000` in your web browser to view the visualization. This lets you develop your interactive graphic in the comforts of your [favorite web-browser](https://www.google.com/chrome) and only move it to iBook Author once you are ready to publish.

Looking at the `js/vis.js` code, you can see this is a pretty basic (i.e. useless) visualization. However it does prove out some important functionality:

- Loading of a bundled data file using `d3.csv` works without any issues.
- D3's [drag behavior](https://github.com/mbostock/d3/wiki/Drag-Behavior) works well in this environment.
- Custom css and javascript libraries are possible inside an iBook Widget.

### Creating Your Own Vis Widget

To create your own vis widget, simply fork or clone this repository, then modify `index.html` and `js/vis.js` to visualize what you want.

When you have a visualization you like ready, follow these steps:

- Create your own Default.png by taking a screen-shot, or otherwise exporting a preview image of your visualization.
  \*\* Make sure to get the dimensions right (see below).
- Tweak your Info.plist as needed (see below).
- Run `make` in your vis_widget directory
- Drag your newly created `.wdgt` file to iBooks Author

The `Makefile` provided is super simple. It just copies the `vis_widget` directory and moves it the `vis.wdgt` without modifying it. It should create a `.wdgt` package suitable for transferring to iBooks Author.

Once in iBooks Author, you can tweak the positioning and styling of the initial display of the widget - removing its title or description as necessary.

### Info.plist

The provided Info.plist will get you pretty far into developing a widget for iBooks, but there might be a few things you want to tweak:

The [CFBundleIdentifier](https://github.com/vlandham/vis_widget/blob/master/Info.plist#L10) you might want to modify to use your own name.

The [Height](https://github.com/vlandham/vis_widget/blob/master/Info.plist#L24) and [Width](https://github.com/vlandham/vis_widget/blob/master/Info.plist#L26) integers might need to be modified if you don't want use the same size visualization as me.

### Size Issues

When rendering the widget in an iBook, the sizing appears to be dependent on many factors. Not only does the `width` and `height` entries in Info.plist need to be correct, but the dimensions of your Default.png must match up with these dimensions.

When determining what size to display your widget in, it appears the system uses the smallest dimensions of either the Info.plist or the Default.png. That's why its important that these both match - and they really are the total size of the visualization you want to use.

### Interactive Textbooks with D3

Hopefully this is enough to at least get you interested in the potential behind interactive visualizations in iBooks.

You can [download a copy of my iBook file](http://vallandingham.me/documents/d3_ibook_example.iba) that includes this D3 visualization.

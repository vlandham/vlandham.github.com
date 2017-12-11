---
layout: post
title: Multivariate Map Collection
twitter: true
twitter_type: summary_large_image
description: A collection of attempts to encode multiple variables on a map.
img: http://vallandingham.me/images/multivar_map/multivar_twitter.jpg
zoom: true
categories:
- tutorial
---

There are many types of maps that are used to display data. [Choropleths](http://axismaps.github.io/thematic-cartography/articles/choropleth.html) and [Cartograms](https://en.wikipedia.org/wiki/Cartogram) provide two great examples. I gave a talk, long long ago, about some of [these map varieties](http://vallandingham.me/city_camp_abstract_maps_notes.html).

Most of these more common map types focus on a particular variable that is displayed. But what if you have multiple variables that you would like to present on a map at the same time?

Here is my attempt to collect examples of multivariate maps I've found and organize them into a loose categorization. Follow along, or dive into the references, to spur on your own investigations and inspirations!

Before we begin, certainly you've heard by now that, even for geo-related data, a map is _not_ always the right answer. With this collection, I am just trying to enumerate the various methods that have been attempted, without too much judgement as to whether it is a 'good' or 'bad' encoding. Ok? Ok!


## 3D

With the interactivity available to the modern map maker, it is not surprising that extending into the third dimension is a popular way to encode data.

**Chicago Energy Map**

<img class="zoom center" src="{{ "images/multivar_map/chicago_energy_2.png" | absolute_url }}" alt="" style=""/>

Source: [Datascope Analysis Chicago Energy Data Map](http://chicagoenergy.datascopeanalytics.com/)

The above uses color and 3D height to encode natural gas and electric efficiencies of various neighborhoods in Chicago. It doesn't provide freeform rotation, but does allow you to rotate to different cardinal directions, which helps with the occlusion. This tool also provides a detailed census block view of the data after clicking a neighborhood.

**Median Household Income**

<img class="zoom center" src="{{ "images/multivar_map/incomes2_small.jpg" | absolute_url }}" alt="" style="" data-zoom-target="{{ "images/multivar_map/incomes2.png" | absolute_url }}"/>

Source: [Visualizing America's Middle Class Squeeze](http://metrocosm.com/income-us-cities-1970-2015/)

Created by [Max Galka](https://twitter.com/galka_max), this map duel encodes median household income for various cities using both color and tract height. This makes it not strictly multivariate, but it uses the same ideas.

**Choropleth Hillshade**

<img class="zoom center" src="{{ "images/multivar_map/hillshades.png" | absolute_url }}" alt="" style=""/>

Source: [Choropleth Hillshade](https://github.com/jwasilgeo/choropleth-hillshade)

This tool is provided as an ArcGIS add-on for creating hillshaded versions of choropleth maps. I don't use ArcGIS, but its interesting to see a generic tool to create these kinds of maps.

**Topographical Crime Maps**

<img class="zoom center" src="{{ "images/multivar_map/3d_crime.jpg" | absolute_url }}" alt="" style=""/>

Source: [Topographical Crime Maps](http://www.neatorama.com/2010/06/08/topographical-crime-maps/#!nT1i3)

This was created by [Doug McCune](http://dougmccune.com/blog/). It is not really multivariate, but I always really loved the style where he retains the basemap visual but uses hillshading to show geo-data in a very organic way. It seems like a technique that should have caught on more.  

**Data Mountains**

<img class="zoom center" src="{{ "images/multivar_map/datamountains_small.jpg" | absolute_url }}" alt="" style=""/>

Source: [CartoDB](https://carto.com/blog/data-mountains/)

Taking the idea from exact shapes toward less precise icons are CartoDB's Data Mountains. These maps use color and "mountain" size to encode multiple variables. The idea reminds me very much of [geo-based Joyplots](http://spatial.ly/2014/08/population-lines/0/), like this great "[Joymap](https://bl.ocks.org/armollica/d19483f314189df73fe0235bc633ae59)" from [Andrew Mollica](https://twitter.com/armollica) showing the population density of Wisconsin:

<img class="zoom center" src="{{ "images/multivar_map/joymap.png" | absolute_url }}" alt="" style=""/>

## Color

The idea of using color alone to represent _multiple_ pieces of data may seem strange, but it can happen! Let's take a look at a few examples

**Bivariate Choropleth Maps**

<img class="zoom center" src="{{ "images/multivar_map/health_bivariate_small.jpg" | absolute_url }}" alt="" style=""/>

Source: [Quartz: Where Medicaid Cuts Hit Hardest](https://qz.com/1008167/map-donald-trumps-mean-mean-mean-health-care-bill-is-meanest-to-his-most-crucial-voters/)

This map of Trump voters vs Medicaid coverage is just one example of a somewhat popular technique. [Joshua Stevens](https://twitter.com/jscarto) has a great article with [everything you ever wanted to know about bivariate choropleths](http://www.joshuastevens.net/cartography/make-a-bivariate-choropleth-map/), so make sure you check that out.

**Trivariate Choropleth Map**

<img class="zoom center" src="{{ "images/multivar_map/earnings_small.jpg" | absolute_url }}" alt="" style=""/>

Source: [Good: Reading, Writing, and Earning Money](https://www.good.is/infographics/america-s-richest-counties-and-best-educated-counties#open)

If you thought two colors were hard, wait till you see three! This map generated a [lot](http://flowingdata.com/2011/01/18/open-thread-is-this-map-too-confusing/) of [musings](https://thesocietypages.org/graphicsociology/2011/04/05/reading-writing-earning-bad-good-graphic/) back in 2011, so be sure to check out all the heat it garnered before trying to emulate it.

**Trivariate Dot Map**

<img class="zoom center" src="{{ "images/multivar_map/trees.jpg" | absolute_url }}" alt="" style=""/>

Source: [Stamen: Trees, Cabs & Crime](https://hi.stamen.com/trees-cabs-crime-in-the-venice-biennale-968ea4983177)

Originally created in 2009 by Shawn Allen while he was at Stamen, this artistic piece no doubt influenced the trivariate choropleth we just looked at. With the city-level data in the dot map, you can see more interesting patterns (if you are familiar with San Francisco).

## Small Multiples

If one of the variables you are visualizing is categorical in nature, it is possible to show a multitude of maps, one for each category. That is what we find in the map below.

<img class="zoom center" src="{{ "images/multivar_map/small_mult1.png" | absolute_url }}" alt="" style=""/>

Source: [Andrew Gelman: Estimates of support for School Vouchers](http://andrewgelman.com/2009/07/15/hard_sell_for_b/)

They also have a modified version with a different color scheme:

<img class="zoom center" src="{{ "images/multivar_map/small_mult2.jpg" | absolute_url }}" alt="" style=""/>

Source: [Andrew Gelman](http://andrewgelman.com/2011/04/04/irritating_pseu/)

## Embedded Charts and Symbols

Now we get to the interesting stuff! When you have multiple values to display specific locations on your map, why not layer in other chart types to display these values?

It seems in some ways obvious, but as we will see below, this just doesn't always work out.

**Circles**

<img class="zoom center" src="{{ "images/multivar_map/circles1.jpg" | absolute_url }}" alt="" style=""/>

Source [Carto: Madrid subway complaints by station](https://congosto.carto.com/viz/e5da12e2-9fe7-11e4-bc43-0e853d047bba/public_map)

<img class="zoom center" src="{{ "images/multivar_map/circles2.jpg" | absolute_url }}" alt="" style=""/>

Source: [Bill Scherkenbach](https://scherkwa.wordpress.com/2012/12/12/bivariate-map/)

**Pies**

<img class="zoom center" src="{{ "images/multivar_map/pies1.png" | absolute_url }}" alt="" style=""/>

Source: [A Map Analysis of US Airline Competition](https://twitter.com/wallacetim/status/440326909767852032) (found in a tweet from Tim Wallace)

<img class="zoom center" src="{{ "images/multivar_map/pies2.jpg" | absolute_url }}" alt="" style=""/>

Source: [The Eddington Transport Study](http://webarchive.nationalarchives.gov.uk/20090115123440/http://www.dft.gov.uk/162259/187604/206711/volume2.pdf) (pdf)

**Radars**

<img class="zoom center" src="{{ "images/multivar_map/radars1.jpg" | absolute_url }}" alt="" style=""/>

<img class="zoom center" src="{{ "images/multivar_map/radars2.jpg" | absolute_url }}" alt="" style=""/>

Source: [Moral Statistics of France](https://projecteuclid.org/download/pdfview_1/euclid.ss/1199285037) (pdf)

**Lines**

<img class="zoom center" src="{{ "images/multivar_map/lines.jpg" | absolute_url }}" alt="" style=""/>

Source: [Atlas of American Agriculture](https://archive.org/stream/AtlasOfAmericanAgriculture/5797#page/n33/mode/2up)

Probably my favorite of the bunch, but that's just cause [I like old maps](http://vallandingham.me/seattle_maps/).


## See Also

Hopefully this was a fun romp through the fun and strange possibilities of multivariate map displays. Come back to this page for potential inspiration or jumping off points the next time someone demands a map for your complex data.

Of course I'm not the only one who likes collecting, nor the first to ponder multivariate map encodings. For more, check out the great [Axis Maps Thematic Cartography Guide](http://axismaps.github.io/thematic-cartography/) which includes a multivariate section.

Have a technique I missed? Let me know!

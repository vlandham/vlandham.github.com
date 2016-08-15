---
layout: post
title: Mapping Seattle - Streets
categories:
- vis
---

Recently, I’ve up-rooted my family and transplanted from Kansas City, MO to Seattle, WA. This represents the first major venture out of the Midwest for my wife, dauther, and myself. Its exciting and scary and fun and difficult.

To begin to learn the city, I’ve started making basic maps - with the attempt to highlight different aspects or views of how things are arranged and where things are.

My first set attempts to take a very zoomed-out look at the streets.

Here are the streets of Seattle.

<div class="center">
<img class="center" src="http://vallandingham.me/images/seattle/small/seattle_roads_small.png" alt="Seattle Streets" style="border:1px dotted #cccccc;"/>

</div>
Not too exciting, but this provides a base line for those unacquainted with the lands up here.

Now on to my actual maps!

First, we have all the bus routes and other public transportation.

Click on the image to get to a super-big *png* version. I’ll try to work on vector-based versions as well, but my machine was having problems with that.

<div class="center">
<a href="http://vallandingham.me/images/seattle/seattle_public_transportation_big.png"><img class="center" src="http://vallandingham.me/images/seattle/small/seattle_public_transport_small.png" alt="Seattle Public Transportation" style="border:1px dotted #cccccc;"/></a>

</div>
From this, we can guess at where the downtown is located - the dense ball of paths there near the sound. We can also see that the routes tend to emanate from this downtown hub and move North and South from the city. The little loops at the ends of the routes indicate where the bus turns around - the edges of the transportation network.

As a bonus, we get to see some of the ferry routes that arc away from the city’s center over to the islands of the Olympic Peninsula.

The rest of these maps focus on interesting features of how streets are named here. First, as you drive around, you notice almost all the streets have a direction as part of their name. The direction is in front of the name for streets that run East / West ( *West Thurman Street* ) and at the end of the name for Streets that run North / South ( *13th Avenue West* ).

I wanted to find out where the boundaries of these directions were. Are all the West streets in one location, or scattered around? What section(s) of Seattle are ‘North’ or ‘Northwest’? These are some of the questions I had. So, (instead of researching this question) I decided to make a map! Here, the color of the streets based on their direction.

<div class="center">
<a href="http://vallandingham.me/images/seattle/seattle_directional_big.png"><img class="center" src="http://vallandingham.me/images/seattle/small/seattle_directional_small.png" alt="Seattle Public Transportation" style="border:1px dotted #cccccc;"/></a>

</div>
I am still pondering the color choices, but right now I am trying to use the color wheel to mirror the compass. Red for North, blue for south, and so on.

In any case, you can see that the directional streets of Seattle are highly compartmentalized. There are hard cut-offs that look to be fairly well maintained. Also, all of downtown is exempt from this directional practice (gray means no direction on the name).

The other odd thing about Seattle streets (at least odd for me - in my limited exposure to the world) is that there are numbered streets that run both North / South as well as East / West. This is one reason why that front / back direction is important.

What wasn’t clear to me was where the numbered streets start and in what direction they increase. So, here are some maps that try to answer these questions.

First, East/West streets. The gray streets are numbered streets with a direction in their name. Lower numbered streets are less dark. Higher numbered streets are more dark. Orange streets are those East/West streets that have a direction, but are not number streets.

<div class="center">
<a href="http://vallandingham.me/images/seattle/seattle_east_west_big.png"><img class="center" src="http://vallandingham.me/images/seattle/small/seattle_east_west_small.png" alt="Seattle East West" style="border:1px dotted #cccccc;"/></a>

</div>
The image itself needs a legend, but hopefully the pattern is clear from the explanation above. First, the numbers don’t start till you are fairly far away from the city center (only orange in the middle). And, the first numbers up North start at 50 or so - and not 1.

Secondly, numbers increment in both directions. Strange indeed!

Here is the same for North/South streets.

<div class="center">
<a href="http://vallandingham.me/images/seattle/seattle_north_south_big.png"><img class="center" src="http://vallandingham.me/images/seattle/small/seattle_north_south_small.png" alt="Seattle North South" style="border:1px dotted #cccccc;"/></a>

</div>
Same pattern. They increase in both directions.

With these maps, I’m at least getting an overall picture of how streets are arranged in my new town. Hopefully they might be interesting to you too!

Bonus: parks and greenspaces of Seattle

<div class="center">
<a href="http://vallandingham.me/images/seattle/seattle_parks_big.png"><img class="center" src="http://vallandingham.me/images/seattle/small/seattle_parks_small.png" alt="Seattle Parks" style="border:1px dotted #cccccc;"/></a>

</div>
Apparently, all those boxes on the upper Western coast are Discovery Park [tidelands](http://en.wikipedia.org/wiki/Tidelands) .

Maps were created using the ever wonderful [TileMill](https://www.mapbox.com/tilemill/) . I was exporting super large png files, so the street widths were jacked way up, which makes some areas look a little messy. Data comes from the infinitely useful [Metro Extracts](http://metro.teczno.com/) . Park data comes from the city of Seattle.

Some [very basic processing](https://gist.github.com/vlandham/7051466) of the road shapefiles was done using python with [Fiona](https://pypi.python.org/pypi/Fiona) to help with the parsing. I definitely want to take advantage of [shapely](http://macwright.org/2012/10/31/gis-with-python-shapely-fiona.html) in the near future.

I also want to start layering data from other sources onto these base road maps. Foursquare and Yelp data are on my radar - as well as [Google Places](http://flowingdata.com/2013/09/12/working-with-line-maps-the-google-places-api-and-r/) .

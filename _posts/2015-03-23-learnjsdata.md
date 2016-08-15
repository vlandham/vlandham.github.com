---
layout: post
title: Making Learn JS Data
description: LearnJSData.com is a new guide to data processing in JavaScript. This post describes the process of its creation and the specialness of the people involved.
img: http://vallandingham.me/images/learnjsdata/learnjsdata_logo.png
twitter: true
twitter_type: summary
categories:
- tutorial
---

Recently Bocoup released a new guide: [LearnJSData.com](http://learnjsdata.com/).

<div class="center">
<a href="http://learnjsdata.com/"><img class="center" src="http://vallandingham.me/images/learnjsdata/learnjsdata.png" alt="learn js data" style=""/></a>
</div>

LearnJSData.com attempts to be a starting point for data processing and analysis using JavaScript. In it, [Irene Ros](https://twitter.com/iros) and I, and a number of other collaborators, try to provide examples of common processing techniques using native JavasScript and a minimal set of libraries, namely [D3.js](http://d3js.org/) and [lodash](https://lodash.com/).

The idea behind this project is to help those who may have some JavaScript experience, but have not really dealt much with data. Also, the guide can help those who have done data processing in other scripting languages, like python or R, and now have a need for similar data manipulation tools in JavaScript.

The guide serves as a starting point, and it is by no means comprehensive, but it suggests a way to get started and contains some handy tips that I, Irene, and others have learned along the way.

For a while, I have been wanting to create a tutorial around all the uses of [d3.nest](https://github.com/mbostock/d3/wiki/Arrays#d3_nest) in terms of restructuring and summarizing data. Its a powerful tool, but one that isn't often considered when processing data. It took a small tweet from [Lynn Cherney](https://twitter.com/arnicas) regarding the lack of comprehensive data munging guides for JavaScript to suggest that there might be a need for this kind of introductory material.

Recently, the Bocoup family participated in their extra-special week-long Bocoupfest extravaganza. This is a special time for Bocoupers where we are encouraged to connect with others on collaborative projects. As a new member of the Bocoup Data Visualization team, my teammates, Irene Ros and [Yannick Assogba](https://twitter.com/tafsiri) suggested that this would be a good time to focus on this fledgling guide idea, and turn it into something real.

The process was incredible. During the week, Irene productionized the build system, wrote the difficult tasks of string manipulation and regular expressions, provided expert guidance, and even made an awesome logo for the project! Yannick and other Bocoupers, [Earle Castledine](https://twitter.com/mrspeaker), and [Mike Pennisi](https://twitter.com/JugglinMike) helped with content suggestions and ways to make the guide more interactive in the future. Even [Adam Sontag](https://twitter.com/ajpiano) got involved by giving it a name and a place to live. It was a real team effort! Given their previous work with [Learn CSS Layout](http://learnlayout.com/), I guess that should come as no surprise.

At the end of the week, this scrap of an idea had been transformed into a real live thing!

It's only been up for a few days, but so far the response from the community has really been fun to watch and be a part of. Even as we released it to the public via Twitter at the end of Bocoupfest, I was dubious of how others would perceive an introduction to a topic in a language not really known for its data processing functionality. I expected a few tweets and then perhaps some snarky comments of this being a bad idea, and that would be that.

But in just 7 days, Learn JS Data has had nearly 4,000 visitors. And people seem to be actually reading some of it! With an average of 2.5 pageviews per session. According to Twitter analytics, [my tweet about the project](https://twitter.com/vlandham/status/576457270625701888) was retweeted 95 times and has been seen by nearly 20,000 pairs of eyeballs (if you believe the measure of _impressions_ is legitimate which I have my doubts about).

<div class="center">
<img class="center" src="http://vallandingham.me/images/learnjsdata/visitors.png" alt="learn js data" style=""/>
</div>


And the community isn't just consuming. Folks are actively improving and adding content!

Already, we have a completely new task around [combining data](http://learnjsdata.com/combine_data.html) contributed completely by [Timo Grossenbacher](https://twitter.com/grssnbchr). And [Davo Galavotti](https://gyrosco.pe/davo/) and friends are already working on a Spanish translation of the entire guide!

The experience has really driven home the power of collaboration for me. This project wouldn't have been nearly as successful without the selfless contributions of those mentioned above.

This process also allowed me to get a bit more insight into the _specialness_ of Bocoup. Because of the responsibility, dedication, and care Bocoup has shown in the Open Source and Open Web worlds, people seem to feel comfortable with contributing to Bocoup projects. They know that the same care and responsibility will be taken with their contributions. Its an interesting facet of these communities that I hadn't experienced, or even considered before.

So, go checkout [LearnJSData.com](http://learnjsdata.com/), and give us some [feedback](https://github.com/vlandham/js_data/issues) on how to improve it. And who knows, you just might find it useful yourself!


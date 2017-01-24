---
layout: post
title: A Data Driven Exploration of Kung Fu Films
twitter: true
twitter_type: summary_large_image
description: Using R & D3 to explore the Shaw Brothers Kung Fu film collection
ogtype: article
img: http://vallandingham.me/images/shaw_bros/shaw_twitter4.png
demo: http://vallandingham.me/shaw_bros/
source: http://vallandingham.me/shaw_bros/analyze/analyze_shaw.nb.html
categories:
- tutorial
---

Recently, I've been a bit caught up in old Kung Fu movies. Shorting any technical explorations, I have instead been diving head-first into any and all Netflix accessible martial arts masterpieces from the 70's and 80's.

While I've definitely been enjoying the films, I realized recently that I had little context for the movies I was watching. I wondered if some films, like our latest favorite, [Executioners from Shaolin](http://www.imdb.com/title/tt0076168/), could be enjoyed even more, with better understanding of the context in which these films exist in the Kung Fu universe.

So, I began a data driven quest for truth and understanding (or at least a semi-interesting dataset to explore) of all Shaw Brothers Kung Fu movies ever made!

For those not dedicating some portion of their finite lives to these retro wonders, the [Shaw Brothers Studio](https://en.wikipedia.org/wiki/Shaw_Brothers_Studio) is the most famous (to me) Kung Fu film producer of all time. Their memorable title screen is almost always a part of my Kung Fu watching experience.

<img class="center" src="{{ "images/shaw_bros/shaw_scope.jpg" | absolute_url }}" alt="Shaw Bros Title Screen" style=""/>

I figured this company's entire martial arts collection would provide for a consistent and thorough look at the genre. Fortunately, after a [bit](http://shawbrothersuniverse.com/shaw-brothers-classic-film-collection/) [of](http://www.silveremulsion.com/review-series/ongoing-review-series/shaw-brothers-martial-arts-films/) [searching](https://en.wikipedia.org/wiki/List_of_Shaw_Brothers_films), I stumbled on what appears to be a [comprehensive list of Shaw Brothers Films](https://letterboxd.com/jewbo23/list/shaw-brothers-martial-arts-films/). I decided to [pull down details](https://github.com/vlandham/scrape_shaw_bros) for each of these movies from the amazingly useful [Letterboxd](https://letterboxd.com/) movie-list-creation site to explore them in a data driven way to see what patterns could be discovered and what context I could learn from those patterns.

So here is a bit of data exploration fun. The analysis is in R, using tips and tricks from Hadley Wickham's wonderful new [Data Science in R](http://r4ds.had.co.nz/) book.

The full analysis code can be found in this [R Notebook](http://vallandingham.me/shaw_bros/analyze/analyze_shaw.nb.html), which includes the code and graphs in an integrated format. And (spoilers!), the end [Actor Collaboration Network](http://vallandingham.me/shaw_bros/) and the rest of the  code can be [found on github](https://github.com/vlandham/shaw_bros).

Come for the Kung Fu, stay for the [word embedding](http://vallandingham.me/shaw_bros_analysis.html#silly-kung-fu-titles-with-word2vec) and [interactive networks](http://vallandingham.me/shaw_bros_analysis.html#finding-a-mob-of-venoms)!

### Shaw Brothers, Through The Ages

To get started, here is a look at the count of Shaw Brothers films by year.

<img class="center" src="{{ "images/shaw_bros/films_by_year.png" | absolute_url }}" alt="Shaw Bros Films by Year" style=""/>
_I'm using the wonderful [theme_fivethirtyeight](https://github.com/jrnold/ggthemes) for these charts. Someday, I'll make my own._

That's **260** films over 22 years.

The first Kung Fu Shaw Brothers film in this data set is [Temple of the Red Lotus](https://letterboxd.com/film/temple-of-the-red-lotus/) from 1965. From the reviews, it sounds like it was a bit rough around the edges - but that's about what you would expect from this burgeoning genre.

<img class="center" src="{{ "images/shaw_bros/temple_of_the_red_lotus.png" | absolute_url }}" alt="Temple of the Red Lotus" style=""/>
_Looks pretty sweet to me, I'll have to check it out_

The studio hits its stride in the early 70’s, with a lull in the mid 70’s and another spike in the late 70’s / early 80’s. Keep in mind that even during the lull, most years the studio is still putting out 10 or more Kung Fu movies.

To create this graph, I first loaded my raw JSON file into R using the [tidyjson](https://cran.r-project.org/web/packages/tidyjson/vignettes/introduction-to-tidyjson.html) package like this:

```R
# load the library
library(tidyjson)

# read the raw json as text
filename = '../out/shaw.json'
shaw_json <- paste(readLines(filename), collapse="")

# parse the json into a table, pulling out
# the variables we want to explore.
films <- shaw_json %>% as.tbl_json %>% gather_array %>%
  spread_values(
    title = jstring("title"),
    director = jstring('director'),
    year = jstring('year'),
    watches = jnumber("watches"),
    likes = jnumber("likes"),
    time = jnumber("time")
  )

```
I then graphed count by year using [ggplot]():

```R
films %>% ggplot(aes(x = year)) +
  geom_bar() +
  labs(title = 'Shaw Bros Films by Year')
```

Not too shabby.

### Which Shaw Brothers Film should I watch?

If you are just getting started with the Kung Fu classics, 260 movies can be difficult to wade through. How do you get to the best of the best to make your initial experience in this genre a pleasant one?

Well, we can use the Letterboxd "watches" and "likes" metrics to help winnow down to the films that are the best bang-for-your-buck.

As you might expect, these two metrics are highly correlated:

<img class="center" src="{{ "images/shaw_bros/watches_vs_likes.png" | absolute_url }}" alt="Watches vs Likes" style=""/>

Basically, anything with more than 400 watches or 100 likes seems like a good place to start. The standout, with over 800 watches is 1984's [Eight Diagram Pole Fighter](https://letterboxd.com/film/eight-diagram-pole-fighter/). Not the catchiest title, but as one reviewer puts it:

> Some of the raddest fights from any Shaw Bros films I've seen (specially that last one).  

I haven't seen this one yet, so I can't comment - but it's definitely on my list!

### Prolific Directors

We have the director for each movie in our dataset, let's look to see if there are any popular standouts.

<img class="center" src="{{ "images/shaw_bros/director_count.png" | absolute_url }}" alt="Top Directors" style=""/>

I'd say! [Chang Cheh](https://en.wikipedia.org/wiki/Chang_Cheh) directed 67 or roughly 26% of all Shaw Brothers Kung Fu!

According to his Wikipedia page, he was known as the "The Godfather of Hong Kong cinema", and rightly so - at least in terms of quantity.

Let's pull out the top 5 directors, in terms of movie count, and see when they were most active.

Here's the R code:

```R
# pull out just the top 5 directors
top_directors <- by_director %>% head(n = 5)
# filter films to those directed by these titans of Kung Fu
films_top_director <- films %>% filter(director %in% top_directors$director)

# add a label to distinguish top directors from everyone else
films_top_director_all <- films %>% mutate(director_label = ifelse(director %in% top_directors$director, director, 'Other'))

# graph
films_top_director_all %>%
  ggplot(aes(x = year)) +
  geom_bar(aes(fill = director_label)) +
  labs(title = 'Shaw Bros Director Count by Year', fill = '') +
  theme_fivethirtyeight()
```

and plot:

<img class="center" src="{{ "images/shaw_bros/top_directors_by_year.png" | absolute_url }}" alt="Top Directors by Year" style=""/>

We can kind of see that Chang Cheh's reign is towards the beginning of the Shaw Brothers timeline and tapers towards the end. Let's view the same data as a percentage of the total movies made each year:

<img class="center" src="{{ "images/shaw_bros/top_directors_by_year_fill.png" | absolute_url }}" alt="Top Directors by Year" style=""/>

This shows how dominate Chang Cheh was in directing nearly half of Shaw Brothers films in some years. In the mid and later years, Chor Yuen came in to direct many films as well.

## Title Showdown: Shaolin vs Swordsman

We will get to the actors in these films in a second, but first I wanted to explore the words used in the titles of these movies.

These classic Kung Fu films typically have thrilling and mysterious names, like [The Thundering Sword](https://letterboxd.com/film/the-thundering-sword/) and [The Invincible Fist](https://letterboxd.com/film/the-invincible-fist/). I wondered if there were any terms used frequently in titles, common threads or themes that became popular in the genre.

As I really wanted a chance to play a bit with the exciting new [tidytext](https://github.com/juliasilge/tidytext) package, I decided to use it for this very simple text analysis.

This package works well to extract text-based data into a format ready to be analyzed and parsed with dplyr, ggplot, and other packages from the [tidyverse](https://blog.rstudio.org/2016/09/15/tidyverse-1-0-0/).

Here is how to split the titles column of our dataset so that each word is a separate row in a new data frame.

```R
# load the library
library(tidytext)

# saves entire title in `title_all` column,
# then splits up title column creating the `word` column -
# with a row for every token (word).
titles <- films %>% mutate(title_all = title) %>% unnest_tokens(word, title)
```

Not too difficult right?

I also wanted to remove [stop words](https://en.wikipedia.org/wiki/Stop_words), and that can be easily done with the included `stop_words` data:

```R
# load stop_words into R environment
data("stop_words")

# filter stopwords
titles_filter <- titles %>% anti_join(stop_words, by = "word")
```

`anti_join` is part of the dplyr package.

Let's take a look at the most frequently used words in these Shaw Brothers films.

<img class="center" src="{{ "images/shaw_bros/top_words_in_titles.png" | absolute_url }}" alt="Top Words in Titles" style=""/>

Interesting! Our latest two films from my Netflix history were the afore mentioned [Executioners of Shaolin](https://letterboxd.com/film/executioners-from-shaolin/) and [Shaolin Martial Arts](https://letterboxd.com/film/shaolin-martial-arts/), but I hadn't realized "Shaolin" movies were so prevalent in the Shaw Brothers cannon.

Also interesting is the number of "Swordsman" movies - a term I don't remember seeing yet.

Were these terms associated with different eras? Let's graph their usage over time:

<img class="center" src="{{ "images/shaw_bros/top_words_by_time.png" | absolute_url }}" alt="Top Words in Titles over time" style=""/>

It would appear as if "Swordsman" movies were the hot stuff during early Shaw Brothers years, but they switched to mostly Shaolin's in the mid-seventies. Here are the two terms overlaid:

<img class="center" src="{{ "images/shaw_bros/shaolin_swordsman.png" | absolute_url }}" alt="Top Words in Titles over time" style=""/>

Now the count-per-year isn't mind-blowing or anything, but it does seem interesting that there was at least one movie with "Swordsman" in the title for six straight years, before an explosion of "Shaolin".

I wanted to investigate a bit further. One of the first Swordsman movies they created was [The One Armed Swordsman](https://letterboxd.com/film/the-one-armed-swordsman/), and [according to Wikipedia](https://en.wikipedia.org/wiki/One-Armed_Swordsman) it was a big hit.

> It was the first of the new style of wuxia films emphasizing male anti-heroes, violent swordplay and heavy bloodletting. It was the first Hong Kong film to make HK$1 million at the local box office, propelling its star Jimmy Wang to super stardom.


I must confess, being a casual enjoyer of Kung Fu, I was not familiar with the term "Wuxia", so this needed a bit more investigation.

Almost immediately, I found a useful description from [This essential guide to Wuxia](https://theendofcinema.net/2016/02/11/30-essential-wuxia-films/):

> The Chinese martial arts movie is generally split into two primary subgeneres: the kung fu film and the wuxia film. The kung fu film is newer and focuses primarily on hand-to-hand combat, it’s steeped in traditional fighting forms and there’s a general emphasis on the physical skill of the performer: special effects are generally disdained.

> Wuxia is a much older form, based ultimately in the long tradition of Chinese adventure literature ... Its heroes follow a very specific code of honor as they navigate the jianghu, an underworld of outlaws and bandits outside the normal streams of civilization.

Ah Ha! So the Swordsman / Shaolin dichotomy could be representative of the switch from this older style wuxia, to the new hip pure Kung Fu. The reappearance of both terms in the eighties could indicate a new found enjoyment for both styles. Apparently more famous modern films like [Crouching Tiger, Hidden Dragon](http://www.imdb.com/title/tt0190332/?ref_=nv_sr_1) fall into the wuxia category.

<img class="center" src="{{ "images/shaw_bros/crouching_tiger.jpg" | absolute_url }}" alt="Crouching Tiger" style=""/>
_I say "modern" here, but can you believe this movie is 17 years old? Time flies!_

Or, it could be that the creators of these movies were lazy and just wanted to rely on the success of _The One Armed Swordsman_ to make some money. Either way, its an interesting split.

Not knowing much about Chinese culture from that time period, I was also interested in learning more as to why "Shaolin" in particular was such a buzzword for Kung Fu movies. I'm still learning, but I found a great essay on [history in the Shaw Brothers](http://thevulgarcinema.com/2015/12/history-in-the-shaw-brothers/) that points to an answer:

> These films, focused on the Shaolin Temple as a center for anti-Qing resistance, provide a dizzying metaphorical potential, with the Qing variously standing in for Western imperialists, the Japanese, the Nationalist Kuomingtang, the Communists, or even simply the Manchurians themselves, while the Buddhism of the monks allows for examining of the contradictions at the heart of traditional Chinese belief systems, between the imperatives of social justice and withdrawal from worldly concerns.

## Silly Kung Fu Titles with word2vec

Inspired by the ever wonderful [Lynn Cherny's](https://twitter.com/arnicas) [word2vec experimentation](http://blogger.ghostweather.com/2014/11/visualizing-word-embeddings-in-pride.html), I wanted to use this opportunity to experiment just a bit with word embeddings and ["word arithmetic"](http://p.migdal.pl/2017/01/06/king-man-woman-queen-why.html).

So I came up with an idea too silly to be useful, but fun for me to play with. For each noun detected in a title, I used [Gensim's word2vec](https://radimrehurek.com/gensim/models/word2vec.html) implementation to find the nearest word to that noun, after subtracting "Chinese", and adding another country.

Again, don't take this seriously, I was just wanting to see what would happen.

So, cherry-picking a comical example:

```
buddha - Chinese + American = God Fearin'
```

See? kind of funny at least in theory. I did this for every title, for a number of different countries. In practice, the results aren't as hilarious as I had hopped for, probably because country vectors don't impact the trajectory of most of these words much. Also, I used a [pre-trained model](https://code.google.com/archive/p/word2vec/) which obviously impacts the embeddings.

But, I made a little toy for exploring these new titles anyways, check it out!

<iframe frameborder="0" height="300px" src="http://vallandingham.me/shaw_bros/titles.html" width="100%" id="titlesIframe" scrolling="no" style="overflow: hidden;"></iframe>

The [raw results](https://github.com/vlandham/shaw_bros/tree/master/data/titles) and the [code I used](https://github.com/vlandham/shaw_bros/blob/master/tools/title_fun.ipynb) to generate these are also available.

## Actor Troupes, Groups, and Clusters

Let's end this exploration with a few insights into the actors in these films.

Even with my novice-level consumption of Shaw Brothers films, one thing you notice early on is a lot of familiar faces show up over and over in many of the movies.

We can see the extent of actor-over-use with another simple chart counting the number of movies frequently seen actors are found in.

<img class="center" src="{{ "images/shaw_bros/actor_counts.png" | absolute_url }}" alt="Actors in Movies" style=""/>

Wow! [Ku Feng](https://en.wikipedia.org/wiki/Ku_Feng) apparently appeared in 82 Kung Fu movies. That's a lot of Kung Fu!

His Wikipedia page isn't as impressed with this feat as I am, providing little information on this Martial Arts Maniac. Apparently his real name is Chan Sze-man, and his first film was in 1959, and he is still acting today! The [HKMDB](http://hkmdb.com/db/people/view.mhtml?id=3579&display_set=eng), or Hong Kong Movie Database, provides just a bit more info:

> In 1965, Ku formally signed an acting contract with Shaw Brothers where he made around 100 films for them and became most notably known as one of their top character actors. He has worked with just about every top Hong Kong director in a variety of films.

Ok then, well props to you Ku.

Did most of the top actors' careers span multiple decades, or did actors come and go quickly?

We can graph the number of years an actor was featured in a movie over the total number of years in our dataset:

<img class="center" src="{{ "images/shaw_bros/actor_percent_active.png" | absolute_url }}" alt="Percent Actors in Movies" style=""/>

For the top actors, we see most were active more than half of the entire time Shaw Brothers Studios was making Kung Fu movies.

Here's another quick graph showing the beginning and ending of these actors' tenures:

<img class="center" src="{{ "images/shaw_bros/actor_career_span.png" | absolute_url }}" alt="Actors start and end" style=""/>

### Finding a Mob of Venoms

One phrase that came up when researching these Shaw Brothers films, related to actor-reuse, is [the Venom Mob](https://en.wikipedia.org/wiki/Venom_Mob), a group of actors that did indeed appear in a lot of Shaw Brothers films together. They became well known after the success of [The Five Venoms](https://letterboxd.com/film/the-five-venoms/), hence the catchy name.

So, can we find a _Mob of Venoms_ in our data?

Inspired by David Robinson's [network analysis of Love Actually](http://varianceexplained.org/r/love-actually-network/), I decided to try out the [igraph](http://igraph.org/r/) package for a bit of network exploration.

After a lot of filtering and frustration, I ended up with a basic, but still fairly hairball-y network:

<img class="center" src="{{ "images/shaw_bros/actor_network.png" | absolute_url }}" alt="Actor Network" style=""/>

In this network, the nodes are actors who have appeared in many films. The edges are co-occurrences of actors in the same movies, with the width of the edges proportional to the number of movies they were found together in.

You can see that there are a lot of actors appear together.

The Venom Mob includes [Chiang Sheng](https://en.wikipedia.org/wiki/Chiang_Sheng), so here, I've highlighted in red everyone he is connected with. In this sub-cluster, you can see [Philip Kwok](https://en.wikipedia.org/wiki/Philip_Kwok), Lu Feng, and many of the other Venoms.

igraph is great for digging into properties of nodes, edges, and networks - and there is plenty more that could be done in this tool just for this simple dataset. I however, was wanting a bit more of an interactive exploratory tool that I could use to browse Kung Fu actor connections.

You were too? Great! That's why I created the amazing [Shaw Brothers Actors Network Visualization](http://vallandingham.me/shaw_bros/).

<a href="http://vallandingham.me/shaw_bros/"><img class="center" src="{{ "images/shaw_bros/shaw_networktool2.png" | absolute_url }}" alt="Actor Network" style=""/></a>

With it, you can clearly pick out the Venom Mob on the right, in the screenshot. But that's not all, you can also browse all the movies actors appeared together in, and modify the network in lots of fun ways.

The code is based on my [interactive network Flowing Data tutorial](http://flowingdata.com/2012/08/02/how-to-make-an-interactive-network-visualization/), which recently has been updated to use [plain old Javascript and D3v4](https://github.com/vlandham/interactive-network-v4).

That wraps up my little data-driven exploration of Shaw Brothers films. As with any analysis, there's plenty more to explore - but hopefully this was fun for you too, and inspires some data-driven exploration of your own.  

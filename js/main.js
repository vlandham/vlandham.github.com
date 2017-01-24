d3.select('.post').selectAll('h1, h2, h3, h4, h5, h6')
  .each(function () {
    var heading = d3.select(this);
    var headingId = heading.attr('id');
    if (headingId) {
      heading
        .classed('heading-anchor-container', true)
        .html('<a class="heading-anchor" href="#' + headingId + '">#</a>' +
          heading.html());
    }
  });

var state_id =  {
    '01': 'AL',
    '02': 'AK',
    '04': 'AZ',
    '05': 'AR',
    '06': 'CA',
    '08': 'CO',
    '09': 'CT',
    '10': 'DE',
    '11': 'DC',
    '12': 'FL',
    '13': 'GA',
    '15': 'HI',
    '16': 'ID',
    '17': 'IL',
    '18': 'IN',
    '19': 'IA',
    '20': 'KS',
    '21': 'KY',
    '22': 'LA',
    '23': 'ME',
    '24': 'MD',
    '25': 'MA',
    '26': 'MI',
    '27': 'MN',
    '28': 'MS',
    '29': 'MO',
    '30': 'MT',
    '31': 'NE',
    '32': 'NV',
    '33': 'NH',
    '34': 'NJ',
    '35': 'NM',
    '36': 'NY',
    '37': 'NC',
    '38': 'ND',
    '39': 'OH',
    '40': 'OK',
    '41': 'OR',
    '42': 'PA',
    '44': 'RI',
    '45': 'SC',
    '46': 'SD',
    '47': 'TN',
    '48': 'TX',
    '49': 'UT',
    '50': 'VT',
    '51': 'VA',
    '53': 'WA',
    '54': 'WV',
    '55': 'WI',
    '56': 'WY'
};

/*
var articlesList = [
  {
    "nid": "3428",
    "title": "How Super-Fast Internet Revitalized Small Businesses in a Small Town",
    "location": "St. Francis, Kansas",
    "coordinates": [
      "-101.799897",
		   "39.772215"
		],
  },
  {
    "nid": "3994",
    "title": "How Cable ISPs Are Expanding Broadband Access in Rural Virginia, Part 1",
    "location": "Charles City, Virginia",
    "coordinates": [
      "-77.073333",
		  "37.343333"
		],
  },
  {
    "nid": "3099",
    "title": "Smart Gigabit Communities: How Cox is Setting Cities up for Success",
    "location": "Phoenix, Arizona",
    "coordinates": [
      "-112.074037",
		  "33.448377"
		],
  }
];
*/


jQuery(function($){

  var ajaxCount = 0;
  var w = window.innerWidth;

  //Width and height of map
  var width = 770;
  var height = 503;
  var currentArticleId = $('.infra-map__card-col').data('init-article-id');
  viewBox = "0 0 " + width + " " + height;

  // D3 Projection
  var projection = d3.geo.albersUsa()
  				   .translate([width/2, height/2.1])    // translate to center of screen
             .scale([1050]);          // scale things down so see entire US

  // Define path generator
  var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
  		  	 .projection(projection);  // tell path generator to use albersUsa projection

  var zoom = d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

  //Create SVG element and append map to the SVG
  var svg = d3.select(".infra-map")
  			.append("svg")
  			.attr("width", width)
  			.attr("height", height)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", viewBox)
        .append("g")
          .call(zoom)
          .on("wheel.zoom", null)
          .on("mousewheel.zoom", null)
        .append("g");


  // Load GeoJSON for US States
  //d3.json("/wp-content/themes/particle/assets/maps/us-states.json", function(json) {
  d3.json("../maps/us-states.json", function(json) {

    // Bind the data to the SVG and create one path per GeoJSON feature
    // This builds the map
    svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("id", function(d) { return state_id[d.id]; })
      .attr("class", 'infra-map__state')
      .style("cursor", "pointer")
      .style("stroke", "#343F49")
      .style("stroke-width", "1.5");

      // add infra story pins to the svg
      updateStoryCard(currentArticleId);
      getInfraStories();

      // update modal when the card is clicked
      $('.infra-map__card-col').on('click', '.article-featured-card__inner-wrap', function() {
        updateStoryModal(currentArticleId);
      });

      // article card close functionality
      $('.infra-map__card-col').on('click', '.close-icon',function() {
        $('.infra-map__content').addClass('hide-card');
      });

      $('.modal-wrap').on('click', '.close-icon',function() {
        $('.modal-wrap').toggleClass('closed');
        $('.modal-overlay').toggleClass('closed');
      });

      $('body').click(function (event) {
        if (!$('.modal-wrap').hasClass('closed')) {
          if(!$(event.target).closest('.modal-wrap').length && !$(event.target).is('.modal-wrap')) {
            $('.modal-wrap').addClass('closed');
            $('.modal-overlay').addClass('closed');
          }
        }
      });

  });


  function addInfraStoryPin(dataPoint) {
    var coordinates = [
      dataPoint.long,
		  dataPoint.lat
		];

    var svgPoint = projection(coordinates);

    if (svgPoint !==  null) {
      var x = svgPoint[0];
      var y = svgPoint[1];
      var xOffset = 17;
      var yOffset = 39;

      var markerSVG = '<svg enable-background="new 0 0 34 39" viewBox="0 0 34 39" width="34" height="39" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path id="a" d="m16.6 2.3c7 0 12.7 5.7 12.7 12.7s-12.7 21.6-12.7 21.6-12.7-14.6-12.7-21.6 5.7-12.7 12.7-12.7m0-2c-8.1 0-14.7 6.6-14.7 14.7 0 7.6 11.9 21.4 13.2 22.9.4.4.9.7 1.5.7s1.1-.2 1.5-.7c1.4-1.5 13.2-15.3 13.2-22.9.1-8.1-6.5-14.7-14.7-14.7z"/><clipPath id="b"><use xlink:href="#a"/></clipPath></defs><use fill="#fff" xlink:href="#a"/><path clip-path="url(#b)" d="m29.4 15c0 7-12.7 21.6-12.7 21.6s-12.8-14.6-12.8-21.6 5.7-12.7 12.7-12.7 12.8 5.7 12.8 12.7z" fill="#fff"/><path d="m29.4 15c0 7-12.7 21.6-12.7 21.6s-12.8-14.6-12.8-21.6 5.7-12.7 12.7-12.7 12.8 5.7 12.8 12.7z" fill="#006ba6" class="main-pin-path"/></svg>';

      var marker = svg.append("g")
        .html(markerSVG)
        .classed("marker", true)
        .classed("active", (dataPoint.id == currentArticleId) ? true : false)
        .attr("id", dataPoint.id)
        .attr("transform", "translate(" + (x - xOffset) + "," + (y - yOffset) + ") scale(0)")
        .transition()
        .delay(400)
        .duration(800)
        .ease("elastic")
        .attr("transform", "translate(" + (x - xOffset) + "," + (y - yOffset) + ") scale(1)");

    }

  }

  // get all stories and add pins to map
  function getInfraStories(svg) {
    var urlEndpoint = "https://www.ncta.com/rest/infra/stories";

    $.ajax({
      method: "GET",
      url: urlEndpoint,
      global: false,
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
      },
      success: function(data) {

       console.log(data);
       // Markers
       for (var j = 0; j < data.length; j++) {
         addInfraStoryPin(data[j]);
       }

       // update story card on click
       $('.infra-map').on('click', '.marker', function() {
         var thisMarker = $(this);

        // change active marker
         $('.marker').removeClass('active');
         thisMarker.addClass('active');

         // update article
         var markerId = thisMarker.attr('id');
         updateStoryCard(markerId);
         currentArticleId = markerId;
       });

     },
     error: function(jqXHR, textStatus, errorThrown) {
       console.log(jqXHR);
     }
    });

  }
  // end getInfraStories

  // elements to reuse, and don't rely on data
  var closeIcon = '<div class="close-icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect y="-0.00012207" width="20" height="20" rx="10" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M9.99999 9.24989L4.75 3.99988L4 4.74988L9.24999 9.99989L4 15.2499L4.74999 15.9999L9.99999 10.7499L15.2499 15.9998L15.9999 15.2499L10.75 9.99989L15.9999 4.74993L15.2499 3.99993L9.99999 9.24989Z" fill="#343F49"/></svg></div>';
  var articleLinkText = '<div class="article-featured-card__link-text-wrap"><div class="article-featured-card__link-text-inner-wrap"><div class="article-featured-card__link-text">Read More</div></div></div>';

  // append stories from the backend
  function appendStoryCard(item, index) {
    if (item.id == "4042") {
      console.log(item.image_url);
    }
    // build story data
    var itemHtml = '<article class="article-featured-card">';
    itemHtml += closeIcon;
    itemHtml += '<div class="article-featured-card__inner-wrap"><div class="article-featured-card__image-wrap"><img alt="' + item.image_alt + '" src="' + item.image_url + '" /></div>';
    itemHtml += '<div class="article-featured-card__content-wrap">';
    itemHtml += '<h3 class="article-featured-card__title">' + item.title +  '</h3>';
    itemHtml += '<div class="article-featured-card__text">' + item.teaser +  '</div>';
    itemHtml += articleLinkText;
    itemHtml += '</div></div>';
    itemHtml += '</article>';

    // append story data
    $('.infra-map__card-col').append(itemHtml);

    // update social share links
    var fullUrl = 'https://www.ncta.com' + item.url;
    var addthis = $('.addthis_toolbox');
    addthis.attr('addthis:url', fullUrl);
    addthis.attr('addthis:title', item.title);
  }

  // update information in sidebar card
  // runs when dot is clicked or option in dropdown is selected
  function updateStoryCard(article_id) {
    var loading_icon = $('.loader');

    var urlEndpoint = "https://www.ncta.com/rest/featured/article/" + article_id;
    if (ajaxCount > 0) {
      loading_icon.show();
    }

    $.ajax({
      method: "GET",
      url: urlEndpoint,
      global: false,
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
      },
      success: function(data) {

       // fill in article card
       var articleCard = $('.infra-map__card-col');
       var articleModal = $('.modal-content');
       articleCard.empty();
       articleModal.empty();

       data.forEach(appendStoryCard);
       $('.infra-map__content').removeClass('hide-card');


       if (ajaxCount > 0) {
         loading_icon.hide();
       }

       ajaxCount += 1;
     },
     error: function(jqXHR, textStatus, errorThrown) {
       console.log(jqXHR);
     }
    });

  }
  // end updateStoryCard function

  // append article to modal
  function appendStoryModal(item, index) {

    // build story data
    var itemHtml = '<article class="article-modal">';
    itemHtml += closeIcon;
    itemHtml += '<h2 class="article-modal__title">' + item.title +  '</h2>';

    if (item.image_url.length > 0) {
      itemHtml += '<div class="article-modal__image-wrap"><img alt="' + item.image_alt + '" src="' + item.image_url + '" /></div>';
    }

    itemHtml += '<div class="article-modal__date-share-wrap"><div class="article-modal__date">' + item.date +  '</div><div class="article-modal__share"></div></div>';
    itemHtml += '<div class="article-modal__body">' + item.body_text +  '</div>';
    itemHtml += '</article>';

    // append story data
    $('.modal-content').append(itemHtml);

    // append social links
    var shareLinks = $( ".section-intro__social-wrap" ).clone(true);
    var modalShare = $('.article-modal__share');
    modalShare.html(shareLinks);

    $('.modal-wrap').toggleClass('closed');
    $('.modal-overlay').toggleClass('closed');
  }

  // update information in modal
  // runs when sidebar card is clicked
  function updateStoryModal(article_id) {
    var loading_icon = $('.loader');

    var urlEndpoint = "https://www.ncta.com/rest/article/modal/" + article_id;
    if (ajaxCount > 0) {
      loading_icon.show();
    }

    $.ajax({
      method: "GET",
      url: urlEndpoint,
      global: false,
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
      },
      success: function(data) {

       // fill in article card
       var articleModal = $('.modal-content');
       articleModal.empty();
       data.forEach(appendStoryModal);

       if (ajaxCount > 0) {
         loading_icon.hide();
       }

       ajaxCount += 1;
     },
     error: function(jqXHR, textStatus, errorThrown) {
       console.log(jqXHR);
     }
    });

  }
  // end updateStoryModal function

  function zoomed() {
    var scale = zoom.scale();
    var translate = zoom.translate();

    // don't allow translations on initial scale
    if (scale == 1) {
      translate = [0, 0];
      zoom.translate(translate);
    }
    svg.attr("transform",
        "translate(" + translate + ")" +
        "scale(" + scale + ")"
    );
  }

  function interpolateZoom (translate, scale) {
      var self = this;
      return d3.transition().duration(350).tween("zoom", function () {
          var iTranslate = d3.interpolate(zoom.translate(), translate),
              iScale = d3.interpolate(zoom.scale(), scale);
          return function (t) {
              zoom
                  .scale(iScale(t))
                  .translate(iTranslate(t));
              zoomed();
          };
      });
  }

  function zoomClick() {
      var clicked = d3.event.target,
          direction = 1,
          factor = 0.4,
          target_zoom = 1,
          center = [width / 2, height / 2],
          extent = zoom.scaleExtent(),
          translate = zoom.translate(),
          translate0 = [],
          l = [],
          view = {x: translate[0], y: translate[1], k: zoom.scale()};


      d3.event.preventDefault();
      direction = (this.id === 'zoom-in') ? 1 : -1;
      target_zoom = zoom.scale() * (1 + factor * direction);

      if (target_zoom < extent[0]) {
        target_zoom = extent[0];
      }
      else if (target_zoom > extent[1]) {
        target_zoom = extent[1];
      }

      //if (target_zoom < extent[0] || target_zoom > extent[1]) { return false; }

      translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
      view.k = target_zoom;
      l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

      view.x += center[0] - l[0];
      view.y += center[1] - l[1];

      interpolateZoom([view.x, view.y], view.k);
  }

  d3.selectAll('.zoom-button').on('click', zoomClick);

  $('.section-intro__social-open-mobile').on('click', function() {
    $('.section-intro__social-wrap').toggleClass('open');
  });

});

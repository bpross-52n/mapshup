mapshup
=======

Project info
------------

* Source - https://github.com/jjrom/mapshup
* Demo - http://engine.mapshup.info
* Keynote - https://speakerdeck.com/jjrom/mapshup
* Video - http://vimeo.com/45164288
* Twitter - https://twitter.com/mapshup

What is mapshup ?
-----------------
Mapshup provides an innovative and efficient access to Geospatial web services.
It brings on an unique map a mashup of different services - Earth Observation data catalogs,
OpenStreetMap/Bing/Google maps services, news feed, wikipedia articles, photos and videos from social networks,
etc. - to easily build a comprehensive "information context" and help decision making for end users.

![mapshup](https://raw.github.com/jjrom/mapshup/master/utils/stuff/2012.11.23%20-%20mapshup.004.jpg)

Mapshup is based on standard web technologies  (i.e. javascript/css/HTML5). The user interface is designed to
work both on desktop and on touch devices through a web browser.

It is able to connect to a large range of services including : OpenStreetMap/Bing/Google maps, OGC services
(WMS, WFS, CSW and WPS), Earth Observation catalogs (ESA G-Pod catalog, ESA HMA catalogs, OpenSearch catalogs),
Google Earth plugin, Google Streetview, Google Elevation, Flickr API, Youtube API, Wikipedia API, Geonames,
RSS and Atom feeds, MapBox mbtiles, Pléiades metadata, Sentinel 2 metadata.

Out of the box functionalities include : auto-detection of data layers through drag&drop of files and/or urls to the
map, 2D and 3D support, content creation, context saving and sharing through email/facebook/twitter.

The user interface is "map centric". All information is displayed within the map wich represents 100% of the view
excepted for the top header bar wich contains generic actions (a free text search input form, the map backgrounds
switcher, the share button, the help button, the login information).

The user interface is designed to be easy to use on touch devices. As a consequence every functionality is
accessible through one single touch and "hidden" menu are avoided as possible, making the user experience very
intuitive

Architecture
------------
![mapshup architecture](https://raw.github.com/jjrom/mapshup/master/utils/stuff/2012.11.23%20-%20mapshup.008.jpg)

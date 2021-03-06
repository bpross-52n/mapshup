/*
 * mapshup - Webmapping made easy
 * http://mapshup.info
 *
 * Copyright Jérôme Gasperi, 2011.12.08
 *
 * jerome[dot]gasperi[at]gmail[dot]com
 *
 * This software is a computer program whose purpose is a webmapping application
 * to display and manipulate geographical data.
 *
 * This software is governed by the CeCILL-B license under French law and
 * abiding by the rules of distribution of free software.  You can  use,
 * modify and/ or redistribute the software under the terms of the CeCILL-B
 * license as circulated by CEA, CNRS and INRIA at the following URL
 * "http://www.cecill.info".
 *
 * As a counterpart to the access to the source code and  rights to copy,
 * modify and redistribute granted by the license, users are provided only
 * with a limited warranty  and the software's author,  the holder of the
 * economic rights,  and the successive licensors  have only  limited
 * liability.
 *
 * In this respect, the user's attention is drawn to the risks associated
 * with loading,  using,  modifying and/or developing or reproducing the
 * software by the user in light of its specific status of free software,
 * that may mean  that it is complicated to manipulate,  and  that  also
 * therefore means  that it is reserved for developers  and  experienced
 * professionals having in-depth computer knowledge. Users are therefore
 * encouraged to load and test the software's suitability as regards their
 * requirements in conditions enabling the security of their systems and/or
 * data to be ensured and,  more generally, to use and operate it in the
 * same conditions as regards security.
 *
 * The fact that you are presently reading this means that you have had
 * knowledge of the CeCILL-B license and that you accept its terms.
 */

/**
 * Define M.Map events
 */
(function (M) {
    
    /*
     * LayerDescription
     * 
     * @param obj : layer description object
     * @param jmap : reference to M.Map object
     */
    M.Map.LayerDescription = function(obj, map) {
        
        /**
         * Layer description
         */
        this.obj = obj;
        
        /**
         * M.Map reference
         */
        this.map = map;
        
        /**
         * Check if a layerDescription is valid,
         * i.e. if mandatory properties based on type
         * are present
         */
        this.isValid = function() {
            
            var layerType,i,l,m;
            
            /*
             * Paranoid mode
             */
            if (!this.obj || typeof this.obj !== "object") {
                return false;
            }
        
            /*
             * Check layerType - not valid then return false
             */
            layerType = this.getLayerType();
            if (!layerType) {
                return false;
            }
        
            /*
             * Mandatory properties array
             */
            m = layerType.mandatories || [];
        
            /*
             * Roll over properties
             */
            for (i=0, l = m.length; i < l; i++) {
                if (!this.obj.hasOwnProperty([m[i]])) {
                    return false;
                }
            }

            return true;
    
        };
        
        /*
         * Return the layerType for this layer description
         */
        this.getLayerType = function() {
            if (!this.map || !this.obj) {
                return null;
            }
            return this.map.layerTypes[this.obj.type]
        };
        
        /*
         * Return the layer description object
         */
        this.get = function() {
            return this.obj;
        }
        
        /**
         * Compute a MID from its type
         */
        this.getMID = function() {

            var o = this.obj, layerType = this.map.layerTypes[o.type];

            /*
             * Layerdescrition.MID has preseance over everything else
             * This is used to force MID on specific layers (drawing for example)
             */
            if (o.MID) {
                return o.MID;
            }
            
            /*
             * Layer type does not exists => return null
             */
            if (!layerType) {
                return null;
            }

            /*
             * Default MID is M.crc32(layerDescription.type + (layerDescription.url || layerDescription.title || ""))
             * unless specified in the layerType object
             */
            if ($.isFunction(layerType.getMID)) {
                return layerType.getMID(o);
            }
            else {
                
                /*
                 * 
                 * Special case of "replace" property - use "url" instead of "title" for unique identifier
                 */
                if (o.replace && o.hasOwnProperty("url")) {
                    
                    /*
                     * Important : split url to remove additionnal parameters (i.e. after "?" char)
                     */
                    return M.Util.crc32(o.type + o.url.split('?')[0]);
                    
                }
            }
            
            return M.Util.crc32(o.type + (o.title || ""));
        };
        
        /**
         * Return a human readable array of layer properties
         * 
         * @return Array of Key/Value arrays
         */
        this.getInfo = function() {
        
            var arr = [];

            if (this.obj) {

                var layerType = this.map.layerTypes[this.obj["type"]];

                /*
                 * Only valid layerType are processed
                 */
                if (layerType) {

                    /*
                     * Common description
                     */
                    arr = [
                    ["Title", M.Util._(this.obj["title"])],
                    ["Description", M.Util._(this.obj["description"] || "No description available")],
                    ["Type", M.Util._(this.obj["type"])]
                    ];

                    /*
                     * Check for an eventual preview url
                     */
                    if (this.obj["preview"]) {
                        arr.push(["Preview", this.obj["preview"]]);
                    }

                    if ($.isFunction(layerType.getInfo)) {
                        arr = arr.concat(layerType.getInfo(this.obj));
                    }
                }
            }
        
            return arr;
        
        };
        
        /**
         * Return a default StyleMap from layerDescription
         */
        this.getStyleMap =  function() {

            var icon = null, // Determines if point must be represented by an icon
                obj = this.obj, // Object reference
                opacity = obj.hasOwnProperty("opacity") ? obj.opacity : 0.2; // Set opacity

            /*
             * Features got a 'icon' attribute => use it as symbol
             * for point representation
             */
            if (obj.hasIconAttribute) {
                icon = "${icon}";
            }
            
            /*
             * Set the default style
             */
            var styleDefault = new OpenLayers.Style(OpenLayers.Util.applyDefaults({
                pointRadius: icon ? 10 : "${scaledSize}",
                externalGraphic:icon,
                fillOpacity: opacity,
                graphicOpacity: 1,
                strokeColor:"#000",
                strokeWidth:1,
                label:"${label}",
                fontSize:"${fontSize}",
                fontColor:"${fontColor}",
                fontStrokeColor:"${fontColor}",
                fontStrokeWidth:0,
                fillColor:"${color}"
            }, OpenLayers.Feature.Vector.style["default"]), {

                /*
                 * Context depends on filterOn attribute
                 */
                context: {

                    /*
                     * If icon is specified
                     */
                    icon: function(feature) {
                        if(feature.cluster) {
                            return M.Util.getImgUrl('imgcluster.png');
                        }
                        else {
                            return feature["attributes"].icon;
                        }
                    },
                    
                    /*
                     * Label for clusters
                     */
                    label: function(feature) {
                        var fi = feature.layer["_M"].layerDescription.featureInfo;
                        if(feature.cluster) {
                            return feature.cluster.length;
                        }
                        else if (fi && fi.label && fi.label["value"]) {
                            return fi.label["value"].replace(/\$+([^\$])+\$/g, function(m, key, value) {
                                var k = m.replace(/[\$\$]/g, '');
                                return M.Map.Util.Feature.getValue(feature, k, feature.attributes[k]);
                            });
                        }
                        else {
                            return '';
                        }
                    },
                    
                    /*
                     * Fontsize for labels
                     */
                    fontSize: function(feature) {
                        var fi = feature.layer["_M"].layerDescription.featureInfo;
                        if (fi && fi.label) {
                            return fi.label["size"] || 10;
                        }
                        else {
                            return 20;
                        }
                    },
                    
                    /*
                     * Font color for labels
                     */
                    fontColor: function(feature) {
                        var fi = feature.layer["_M"].layerDescription.featureInfo;
                        if (fi && fi.label) {
                            return fi.label["color"] || "#000";
                        }
                        else {
                            return "#fff";
                        }
                    },
                        
                    /*
                     * Clusters have a different color than normal objects
                     */
                    color: function(feature) {

                        /*
                         * Cluster case
                         */
                        if(feature.cluster) {
                            return "#666";
                        }
                        else {
                            return feature["attributes"].color || feature.layer["_M"].layerDescription.color || "darkgray";
                        }
                    
                    },
                    scaledSize: function(feature) {

                        /*
                         * Cluster case
                         */
                        if(feature.cluster) {

                            /*
                             * filterOn is defined => return the size element with the larger filterOn value
                             * within the cluster
                             */
                            if (feature.attributes[obj.filterOn]) {
                                var i,max,main;
                                for(var c = 0, l = feature.cluster.length; c < l; c++) {
                                    i = feature.cluster[c].attributes[obj.filterOn];
                                    if(i > max) {
                                        max = i;
                                        main = c;
                                    }
                                }
                                return feature.cluster[main].attributes[obj.filterOn] * 5;
                            }
                            /*
                             * filterOn is not defined => return proportional to cluster size
                             */
                            else {
                                return 15 + Math.min(feature.cluster.length * 2, 40);
                            }
                        }
                        /*
                         * Normal case => no cluster
                         */
                        else {

                            /*
                             * filterOn is defined => return a size proportional to the filterOn value
                             */
                            if (feature.attributes[obj.filterOn]) {
                                return feature.attributes[obj.filterOn] * 5;
                            }
                            /*
                             * filterOn is not defined => return a normal scale
                             */
                            else {
                                return 15;
                            }
                        }
                    }
                }
            });

            /*
             * Return styleMap
             */
            return new OpenLayers.StyleMap({
                "default": styleDefault,
                "select": {
                    strokeColor:"#ffff00",
                    fillOpacity:opacity <= 0.9 ? opacity + 0.1 : opacity - 0.1
                }
            });
        };
       
    };
    
})(window.M);
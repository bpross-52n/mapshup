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
/*********************************************
 * PLUGIN: GetFeatureInfo
 *********************************************/
M.plugins["GetFeatureInfo"] = {

    layer:null,
    
    /**
     * Launch a WMS getFeatureInfo request
     * This function only works if queryables WMS layers
     * are present
     */
    getMenuItems: function() {
        return {
            id:"getFeatureInfo",
            icon:M.Util.getImgUrl("info.png"),
            title:"Info",
            tt:"Get feature info",
            javascript:function() {
                M.menu.hide();
                M.plugins["GetFeatureInfo"].getFeatureInfo(M.menu.lonLat);
                return false;
            }
        }
    },

    /**
     * Initialize plugin
     *
     * This is MANDATORY
     */
    init: function(options) {

        /*
         * Best practice : init options
         */
        this.options = options || {};

        /*
         * This plugin only work if WMS layerType is defined
         */
        if (!M.Map.layerTypes["WMS"]) {
            return false;
        }

        /**
         * Create generic getFeatureInfoLayer
         */
        var getFeatureInfoLayer = new OpenLayers.Layer.Vector("GetFeatureInfo", {
            displayInLayerSwitcher:false,
            styleMap:new OpenLayers.StyleMap({
                'default':{
                    externalGraphic:M.Util.getImgUrl("plus.png"),
                    graphicXOffset:-11,
                    graphicYOffset:-11,
                    graphicWidth:19,
                    graphicHeight:19
                }
            })
        });

        this.layer = M.Map.addLayer({
            type:"Generic",
            title:getFeatureInfoLayer.name,
            layer:getFeatureInfoLayer,
            unremovable:true,
            MLayer:true,
            selectable:true,
            /** By default, getFeatureInfoLayer is hidden */
            hidden:true
        });

        return true;
    },

    /*
     * Send a getFeatureInfo request
     */
    getFeatureInfo: function(lonLat) {

        /**
         * Set clicked point as the new feature within getFeatureInfoLayer
         */
        var newFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lonLat.lon, lonLat.lat));
        this.layer.destroyFeatures();
        this.layer.addFeatures(newFeature);

        /*
         * Select feature
         */
        M.Map.getControlById("__CONTROL_SELECT__").select(newFeature);
       
        /*
         * Call jFeatureInfo
         */
        if (!M.Map.layerTypes["WMS"].getFeatureInfo(lonLat,$('.description', '#jFeatureInfo').empty())) {
            M.Map.featureInfo.clear();
            M.Util.message(M.Util._("No information available here"));
        }
        

    }

};

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
 *
 * Connector for CSW EO catalogs 06-131r5 ebRR
 * 
 *********************************************/
(function (M){
    
    M.Plugins.Catalog = M.Plugins.Catalog || {};
    
    /**
     * Connector object
     * One connector should be initialized for each catalog layer within the _M.searchContext property
     * (i.e. layer["_M"].searchContext.connector = new Connector(layer, options)
     *
     * @param catalog : catalog layer
     * @param options : options object
     * @param registerCallback : callback function called after connector is successfully registered
     * @param filterCallback : callback function called after filter is successfully updated
     */
    M.Plugins.Catalog.CSWEOr5ebRR = function(catalog, options, registerCallback, filterCallback) {
        
        $.extend(options, {
        
            /*
             * Mandatory description
             * Description can be updated in config file (see "options")
             */
            description: "CSW EO OGC 06-131r5 (ebRR)",

            /*
             * Mandatory connector url
             * Url can be updated in config file (see "options")
             */
            url: "/plugins/catalog/CSWEOCatalogProxy.php?version=06-131r5ebRR&"
        });
        
        return new M.Plugins.Catalog.CSWEO(catalog, options, registerCallback, filterCallback);
        
    };

})(window.M);
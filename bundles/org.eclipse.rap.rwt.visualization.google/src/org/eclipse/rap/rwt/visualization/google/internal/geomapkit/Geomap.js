/*******************************************************************************
 * Copyright (c) 2009-2010 David Donahue and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 * 
 * Contributors:
 *     David Donahue - initial API, implementation and documentation
 *     Austin Riddle - improvements to widget hierarchy and data flow for 
 *                     consistency with SWT behavior.
 ******************************************************************************/
try {
	google.load('visualization', '1', {'packages':['geomap']});
}
catch (e) {
	var mesg = "Error loading Google Geomap API: "+e;
	if (console) {
		console.log(mesg);
	}
	else {
		alert(mesg);
	}
}

qx.Class.define( "org.eclipse.rap.rwt.visualization.google.Geomap", {
    extend: rwt.widgets.base.Parent,
    
    construct: function() {
        this.base( arguments );
        this._chart = null;
        this._dataTable = null;
        this._options = {};
    },
    
    destruct : function() {
    },
    
    properties : {
        widgetData : {
            init : "",
            apply : "refreshWidgetData"
        },
        widgetOptions : {
            init : "",
            apply : "refreshWidgetOptions"
        },
        selectedRow : {
        	init : "",
            apply : ""
        },
        selectedColumn : {
        	init : "",
            apply : ""
        },
        selectedValue : {
        	init : "",
            apply : ""
        }
    },
    
    members : {
        _doActivate : function() {
            var shell = null;
            var parent = this.getParent();
            while( shell == null && parent != null ) {
                if( parent.classname == "org.eclipse.swt.widgets.Shell" ) {
                    shell = parent;
                }
                parent = parent.getParent();
            }
            if( shell != null ) {
                shell.setActiveChild( this );
            }
        },
        
        initialize : function() {
        	var chart = this._chart; 
        	if (chart == null) {
	    		this.info("Creating new geomap instance.");
	    		this._chart = new google.visualization.GeoMap(this._getTargetNode());
	    		chart = this._chart;
	            var qParent = this;
	            google.visualization.events.addListener(chart, 'ready', function() {
	            	qParent.inited = true;
	            });
	            var dataTable = qParent._dataTable;
	            google.visualization.events.addListener(chart, 'regionClick', function(clickedObj) {
  	                var wm = org.eclipse.swt.WidgetManager.getInstance();
	                var widgetId = wm.findIdByWidget(qParent);
	            	var selObj = chart.getSelection();
//	            	var selection = selObj.region;
	            	var selection = clickedObj.region;
	            	this.selectedItem = selection;

	            	//fire selection event
	            	var req = rwt.remote.Server.getInstance();
	            	req.addParameter(widgetId + ".selectedItem", this.selectedItem);
	            	req.addEvent( "org.eclipse.swt.events.widgetSelected", widgetId );
	            	req.send();
		        });
	            
	            this.info("Created new geomap instance.");
        	}
        },
        
        refreshWidgetData : function() {
        	try {
	        	var data = eval('(' + this.getWidgetData() + ')');
	            this._dataTable = new google.visualization.DataTable(data);
	            this.info("Setting data set to : "+this._dataTable);
        	}
        	catch (err) {
        		this.info("Attempted to set data but failed.");
        		this.info(err);
        	}
        },
        
        refreshWidgetOptions : function() {
        	try {
        		rwt.widgets.base.Widget.flushGlobalQueues();
	        	var opString = this.getWidgetOptions();
	        	opString = opString.replace(new RegExp("~","g"), "\"");
	        	var evalStr = "({" + opString;
	        	evalStr = evalStr + "})";
	        	this._options = eval(evalStr);
        	}
        	catch (err) {
        		this.info(err);
        	}
        },
        
        redraw : function () {
        	try {
        		this.initialize();
	        	this.info("Attempting to redraw: "+this._dataTable+", "+this._options);
	        	if (this._chart && this._dataTable && this._options) {
	        		this.info("Drawing: "+this._options);
	        		this._chart.draw(this._dataTable, this._options);
	        	}
        	}
        	catch (err) {
        		this.info(err);
        	}
        },

        _sendResponse : function(widget, field, value) {
			//if (!org.eclipse.swt.EventUtil.getSuspended()) {
				var wm = org.eclipse.swt.WidgetManager.getInstance();
				var canvasId = wm.findIdByWidget(widget);
				var req = rwt.remote.Server.getInstance();
				req.addParameter(canvasId + "." + field, value);
				req.send();
			//}
		}
    }
    
} );

org.eclipse.rap.rwt.visualization.google.BaseChart.registerAdapter(
		"org.eclipse.rap.rwt.visualization.google.Geomap",
		org.eclipse.rap.rwt.visualization.google.Geomap);

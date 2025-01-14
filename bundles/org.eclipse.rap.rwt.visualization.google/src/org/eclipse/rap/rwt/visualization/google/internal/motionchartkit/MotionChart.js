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
	google.load('visualization', '1', {'packages':['motionchart']});
}
catch (e) {
	var mesg = "Error loading Google Motion Chart API: "+e;
	if (console) {
		console.log(mesg);
	}
	else {
		alert(mesg);
	}
}

qx.Class.define( "org.eclipse.rap.rwt.visualization.google.MotionChart", {
    extend: rwt.widgets.base.Parent,
    
    construct: function( ) {
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
	    		this.info("Creating new chart instance.");
	    		this._chart = new google.visualization.MotionChart(this._getTargetNode());                    
	            var qParent = this;
	            google.visualization.events.addListener(this._chart, 'ready', function() {
	            	qParent.inited = true;
	            });
	            google.visualization.events.addListener(this._chart, 'statechange', function() {
	            	var currentState = qParent._chart.getState();
	            	qParent._sendResponse(qParent,"state",currentState.replace(new RegExp("\"","g"), "~"));
	            });
	            this.info("Created new chart instance.");
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
		"org.eclipse.rap.rwt.visualization.google.MotionChart",
		org.eclipse.rap.rwt.visualization.google.MotionChart);

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
qx.Class.define( "org.eclipse.rap.rwt.visualization.google.BaseChart", {
    type: "abstract",
    extend: qx.ui.layout.CanvasLayout,
    
    construct: function( id ) {
        this.base( arguments );
        this.setHtmlAttribute( "id", id );
        this._id = id;
        this._chart = null;
        this._dataTable = null;
        this._options = {};
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
        selectedItem : {
        	init : "",
            apply : ""
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
        
        _createChart : function(domElement) {
          
        },
        
        _initChart : function() {
        	var chart = this._chart; 
        	if (chart == null) {
	    		this.info("Creating new chart instance.");
	    		this._chart = this._createChart(document.getElementById(this._id));
	    		chart = this._chart;
	            var qParent = this;
	            google.visualization.events.addListener(chart, 'ready', function() {
	            	qParent.inited = true;
	            });
	            var widgetId = this._id;
	            var dataTable = qParent._dataTable;
	            google.visualization.events.addListener(chart, 'select', function() {
	            	qParent.info(widgetId+" - Sending selection event");
	            	var selArray = chart.getSelection();
	            	var selObj = selArray[0];
	            	var selection = dataTable.getValue(selObj.row, 0) + "," + dataTable.getColumnId(selObj.column) + "," + dataTable.getValue(selObj.row, selObj.column);
	            	this.selectedItem = selection;
	            	this.selectedRow = dataTable.getValue(selObj.row, 0);
	            	this.selectedColumn = dataTable.getColumnId(selObj.column);
	            	this.selectedValue = dataTable.getValue(selObj.row, selObj.column);
                    
	            	//fire selection event
	            	var req = org.eclipse.swt.Request.getInstance();
	            	req.addParameter(widgetId + ".selectedItem", this.selectedItem);
	            	req.addParameter(widgetId + ".selectedRow", this.selectedRow);
	            	req.addParameter(widgetId + ".selectedColumn", this.selectedColumn);
	            	req.addParameter(widgetId + ".selectedValue", this.selectedValue);
	            	req.addEvent( "org.eclipse.swt.events.widgetSelected", widgetId );
	            	req.send();
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
	        	qx.ui.core.Widget.flushGlobalQueues();
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
	        	this._initChart();
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
				var req = org.eclipse.swt.Request.getInstance();
				req.addParameter(canvasId + "." + field, value);
				req.send();
			//}
		}
    }
    
} );
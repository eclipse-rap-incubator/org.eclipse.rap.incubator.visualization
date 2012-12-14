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
//The reason this is still a qooxdoo widget is because google embeds the chart in an iframe. 
qx.Class.define( "org.eclipse.rap.rwt.visualization.jit.BaseVisualization", {
    type: "abstract",
    extend: rwt.widgets.base.Parent,
    
    statics : 
    { 
      registerAdapter : function(className, constructor) {
    	  rwt.protocol.AdapterRegistry.add( className, {

    		  factory : function( properties ) {
    		    var result = new constructor();
    		    rwt.protocol.AdapterUtil.addStatesForStyles( result, properties.style );
    		    result.setUserData( "isControl", true );
    		    rwt.protocol.AdapterUtil.setParent( result, properties.parent );
    		    return result;
    		  },
    		  
    		  destructor : rwt.protocol.AdapterUtil.getControlDestructor(),

    		  properties : rwt.protocol.AdapterUtil.extendControlProperties( [
    		    "visible",
    		    "widgetData"
    		  ] ),

    		  propertyHandler : rwt.protocol.AdapterUtil.extendControlPropertyHandler( {} ),   

    		  listeners : rwt.protocol.AdapterUtil.extendControlListeners( [] ),

    		  listenerHandler : rwt.protocol.AdapterUtil.extendControlListenerHandler( {} ),

    		  methods : [
    		    "setEdgeProperty",
    		    "setNodeProperty",
    		    "setProperty",
    		    "selectNode",
    		    "setZoom"
    		  ],
    		  
    		  methodHandler : {
    		    "setEdgeProperty" : function( widget, args ) {
    		      widget.setEdgeProperty(args["propName"],args["propValue"]);
    		    },
    		    "setNodeProperty" : function( widget, args ) {
      		      widget.setEdgeProperty(args["propName"],args["propValue"]);
      		    },
      		    "setProperty" : function( widget, args ) {
    		      widget.setEdgeProperty(args["propName"],args["propValue"]);
    		    },
    		    "selectNode" : function( widget, args ) {
      		      widget.setEdgeProperty(args["id"]);
      		    },
      		    "setZoom" : function( widget, args ) {
    		      widget.setEdgeProperty(args["percent"]);
    		    }
    		  }
          } );
      }
    },
    
    construct: function() {
        this.base( arguments );
        this._viz = null;
    },
    
    destruct : function() {
    },
    
    properties : {
	  visible : {
		init :"",
		apply :"initialize"
	  },
	  widgetData : {
	   	init :"",
		apply :"refreshData"
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
        
        _createViz : function(domElement) {
          
        },
        
        initialize : function() {
        	try {
        		var viz = this._viz;
        		if (this.getVisible() == "false") {
        			// make invisible
        			return;
        		}
        		rwt.widgets.base.Widget.flushGlobalQueues();
        		if (viz == null) {
        			this.info("Creating new visualization instance.");
        			var wm = org.eclipse.swt.WidgetManager.getInstance();
        			var widgetId = wm.findIdByWidget(this);
        			this._getTargetNode().setAttribute("id",widgetId+"_targetNode");
        			this._viz = this._createViz(this._getTargetNode());
        			viz = this._viz;
        		}
        	}
        	catch (e) {
        		this.info(e);
        	}
        },
        
        refreshData : function () {
  		  try {
  		    var rg = this._viz;
  		    if (rg != null) {
  		      var data = this.getWidgetData();
  		      if (data != null) {
  		        this.info("Loading visualization data.");
  		        rg.loadJSON(eval("("+data+")"));
  		        this.info("Refreshing visualization.");
  		        rg.refresh();
  		        rg.controller.onAfterCompute();
  		      }
  		    }
  		  }
  		  catch (e) {
  		    this.info(e);
  		  }
  		},
  		
  		addTreeEvent : function (obj, type, fn) {
		    if (obj.addEventListener) obj.addEventListener(type, fn, false);
		    else obj.attachEvent('on' + type, fn);
		},
  		
  		setProperty : function (propName, propValue) {
  			try {
  				var st = this._viz;
  				if (st != null) {
  					st.controller[propName] = propValue;
  					st.refresh();
  				}
  			}
  			catch (e) {
  				this.info(e);
  			}
  		},
  		
  		setNodeProperty : function (propName, propValue) {
  			try {
  				var st = this._viz;
  				if (st != null) {
  					st.controller.Node[propName] = propValue;
  					st.refresh();
  				}
  			}
  			catch (e) {
  				this.info(e);
  			}
  		},
  		
  		setEdgeProperty : function (propName, propValue) {
  			try {
  				var st = this._viz;
  				if (st != null) {
  					st.controller.Edge[propName] = propValue;
  					st.refresh();
  				}
  			}
  			catch (e) {
  				this.info(e);
  			}
  		},
  		
  		setZoom : function (percent) {
  			try {
  				var st = this._viz;
  				if (st != null) {
  					st.canvas.scale(percent,percent);
  					st.refresh();
  				}
  			}
  			catch (e) {
  				this.info(e);
  			}
  		},
  		
  		selectNode : function (id) {
  			try {
  				this.info("Forcing selection to : "+id);
  				var ht = this._viz;
  				if (ht != null) {
  					ht.onClick(id);
  				}
  			}
  			catch (e) {
  				this.info(e);
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
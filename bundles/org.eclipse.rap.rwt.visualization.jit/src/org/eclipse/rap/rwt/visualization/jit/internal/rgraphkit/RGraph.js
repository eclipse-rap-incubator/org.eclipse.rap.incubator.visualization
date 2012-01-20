/******************************************************************************
 * Copyright � 2010-2011 Texas Center for Applied Technology
 * Texas Engineering Experiment Station
 * The Texas A&M University System
 * All Rights Reserved.
 * 
 * This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     Austin Riddle (Texas Center for Applied Technology) -
 *       initial API and implementation
 * 
 *****************************************************************************/
qx.Class.define("org.eclipse.rap.rwt.visualization.jit.RGraph",
{ extend :qx.ui.layout.CanvasLayout,
	
	construct : function(id) {
		this.base(arguments);
		this.setHtmlProperty("id", id);
		this._id = id;
		this._viz = null;
	},

	properties : {
		visible : {
			init :"",
			apply :"load"
	  },
	  widgetData : {
	   	init :"",
			apply :"refreshData"
	  }
	},

	destruct : function() {

	},

	members : {

		_doActivate : function() {
			var shell = null;
			var parent = this.getParent();
			while (shell == null && parent != null) {
				if (parent.classname == "org.eclipse.swt.widgets.Shell") {
					shell = parent;
				}
				parent = parent.getParent();
			}
			if (shell != null) {
				shell.setActiveChild(this);
			}
		},
		
		load : function() {
		  var parent = this;
		  try {
		    var vis = this.getVisible();
		    if (vis == "false") {
		      // make invisible
		      return;
		    }
		    qx.ui.core.Widget.flushGlobalQueues();
		    if (this._viz == null) {
		      this.info("Creating rgraph.");
		      var qParent = document.getElementById(this._id);
		      var vizParent = document.createElement("div");
		      var vizId = "vizParent"+this._id;
		      vizParent.setAttribute("id", vizId);
		      qParent.appendChild(vizParent);
		      var widgetId = this._id;
		      vizParent.width = this.getWidth();
		      vizParent.height = this.getHeight();
		      var rg = new $jit.RGraph({
		        injectInto: vizId,
		        //Optional: create a background canvas that plots  
		        //concentric circles.  
		        background: {  
		          CanvasStyles: {  
		            strokeStyle: '#555'  
		          }  
		        }, 
		        //interpolation type, can be linear or polar  
		        //interpolation: 'linear',  
		        //parent-children distance  
		        //levelDistance: 100,  
		        //withLabels: true,
		        duration: 1000,  
		        fps: 25,
		        Navigation: {  
              enable:true,  
              panning:true,
              zooming: 20
            },
		        Node: {  
//			            overridable: false,  
//			            type: 'circle',
		          color: '#ccddee'
//			            lineWidth: 1,  
//			            height: 5,  
//			            width: 5,  
//			            dim: 3  
		        },  
		        Edge: {  
//			            overridable: false,  
//			            type: 'line',  
		          color: '#772277' 
//			            lineWidth: 1  
		        },  
		        onBeforeCompute: function(node) {  
		          //do something onBeforeCompute  
		        },  
		        onAfterCompute: function(){
		          var node = $jit.Graph.Util.getClosestNodeToOrigin(rg.graph, "current");
		          qParent.selection = node;
		          //fire selection event
		          parent.info("Sending selected node: "+node.id);
		          var req = org.eclipse.swt.Request.getInstance();
		          req.addParameter(widgetId + ".selectedNode", node.id);
		          req.addEvent( "org.eclipse.swt.events.widgetSelected", widgetId );
		          req.send();
		        },  
		        //Change some label dom properties.
		        //This method is called each time a label is plotted.
		        onPlaceLabel: function(domElement, node){
		          var style = domElement.style;
		          style.display = '';
		          style.cursor = 'pointer';
		          var font = parent.getFont();
		          style.fontFamily = font.getFamily();
		          try {
		            style.fontStyle = font.generateStyle();
		          }
		          catch (e) {
		            //ignore..some items are not cross - browser compatible
		          }
		          var color = parent.getTextColor();
		          if (node._depth <= 1) {
		            style.fontSize = font.getSize();
		            style.color = color;
		            
		          } else if(node._depth == 2){
		            style.fontSize = font.getSize()-2;
		            style.color = "#555";
		            
		          } else {
		            style.display = 'none';
		          }
		          var left = parseInt(style.left);
		          var w = domElement.offsetWidth;
		          style.left = (left - w / 2) + 'px';
		        }, 
		        
		        //Add a controller to make the tree move on click.  
		        onCreateLabel: function(domElement, node) {  
		          domElement.innerHTML = node.name;
		          domElement.onclick = function() {
		            rg.onClick(node.id);  
		          };  
		        },   
		        onBeforePlotNode:function(node) {  
		          //do something onBeforePlotNode  
		        },  
		        onAfterPlotNode: function(node) {  
		          //do something onAfterPlotNode  
		        },  
		        onBeforePlotLine:function(adj) {  
		          //do something onBeforePlotLine  
		        },  
		        onAfterPlotLine: function(adj) {  
		          //do something onAfterPlotLine  
		        }  
		      });
		      
		      this.addEventListener("changeWidth", function(e) {
		        if (vizParent != null) {
		          vizParent.width = e.getValue();
		          if (vizParent.height != null && vizParent.width != null) {
		            rg.canvas.resize(vizParent.width, vizParent.height);
		            rg.refresh();
		          }
		        }
		      });
		      this.addEventListener("changeHeight", function(e) {
		        if (vizParent != null) {
		          vizParent.height = e.getValue();
		          if (vizParent.height != null && vizParent.width != null) {
		            rg.canvas.resize(vizParent.width, vizParent.height);
		            rg.refresh();
		          }
		        }
		      });
		      
		      this._viz = rg;
		      this._vizParent = vizParent;
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
		
		refreshData : function () {
		  try {
		    var rg = this._viz;
		    if (rg != null) {
		      var data = this.getWidgetData();
		      if (data != null) {
		        this.info("Loading rgraph data.");
		        rg.loadJSON(data);
		        this.info("Refreshing rgraph.");
		        rg.refresh();
		        rg.controller.onAfterCompute();
		      }
		    }
		  }
		  catch (e) {
		    this.info(e);
		  }
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
				var rg = this._viz;
				if (rg != null) {
					rg.onClick(id);
				}
			}
			catch (e) {
				this.info(e);
			}
		},
		
		_doResize : function() {
			qx.ui.core.Widget.flushGlobalQueues();
			
		}
	}
});
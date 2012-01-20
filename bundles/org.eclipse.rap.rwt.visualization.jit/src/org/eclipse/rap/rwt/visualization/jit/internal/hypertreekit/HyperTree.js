/******************************************************************************
 * Copyright � 2010-2011 Austin Riddle.
 * All Rights Reserved.
 * 
 * This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     Austin Riddle - initial API and implementation
 * 
 *****************************************************************************/
qx.Class.define("org.eclipse.rap.rwt.visualization.jit.HyperTree",
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
		      this.info("Creating hypertree.");
		      
		      var qParent = document.getElementById(this._id);
		      var vizParent = document.createElement("div");
		      var vizId = "vizParent"+this._id;
		      vizParent.setAttribute("id", vizId);
		      qParent.appendChild(vizParent);
		      vizParent.width = this.getWidth();
		      vizParent.height = this.getHeight();
		      var widgetId = this._id;
		      var config = {
		          injectInto: vizId,
		          Navigation: {  
	              enable:true,  
	              panning:true,
	              zooming: 20
	            },
		          //Change node and edge styles such as
		          //color, width and dimensions.
		          Node: {
		            dim: 9,
		            overridable: true,
		            color: "#f00"
		          },
		          
		          Edge: {
		            overridable: true,
		            lineWidth: 2,
		            color: "#088"
		          },
		          
		          onBeforeCompute: function(node){
		            //Log.write("centering");
		          },
		          //Attach event handlers and add text to the
		          //labels. This method is only triggered on label
		          //creation
		          onCreateLabel: function(domElement, node){
		            domElement.innerHTML = node.name;
		            domElement.style.cursor = "pointer";
		            parent.addTreeEvent(domElement, 'click', function () {
		              ht.onClick(node.id);
		            });
		          },
		          
		          //This method is called right before plotting an
		          //edge. This method is useful for adding individual
		          //styles to edges.
		          onBeforePlotLine: function(adj){
		            //Set lineWidth for edges.
//				            if (!adj.data.$lineWidth) 
//				                adj.data.$lineWidth = Math.random() * 5 + 1;
		          },
		          //Change node styles when labels are placed
		          //or moved.
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
		          
		          onAfterCompute: function(){
		            var node = $jit.Graph.Util.getClosestNodeToOrigin(ht.graph, "current");
		            qParent.selection = node;
		            //fire selection event
		            parent.info("Sending selected node: "+node.id);
		            var req = org.eclipse.swt.Request.getInstance();
		            req.addParameter(widgetId + ".selectedNode", node.id);
		            req.addEvent( "org.eclipse.swt.events.widgetSelected", widgetId );
		            req.send();
		          }
		      };
		      var ht = new $jit.Hypertree(config);
		      
		      this.addEventListener("changeWidth", function(e) {
            if (vizParent != null) {
              vizParent.width = e.getValue();
              if (vizParent.height != null && vizParent.width != null) {
                ht.canvas.resize(vizParent.width, vizParent.height);
                ht.refresh();
              }
            }
          });
          this.addEventListener("changeHeight", function(e) {
            if (vizParent != null) {
              vizParent.height = e.getValue();
              if (vizParent.height != null && vizParent.width != null) {
                ht.canvas.resize(vizParent.width, vizParent.height);
                ht.refresh();
              }
            }
          });
		      
		      this._viz = ht;
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
		
		refreshData : function (data) {
			try {
				var ht = this._viz;
				if (ht != null) {
					if (data != null) {
						this.info("Loading hypertree data.");
						ht.loadJSON(data);
					    this.info("Refreshing hypertree.");
					    ht.refresh();
					    ht.controller.onAfterCompute();
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
		
		_doResize : function() {
			qx.ui.core.Widget.flushGlobalQueues();
			
		}
	}
});
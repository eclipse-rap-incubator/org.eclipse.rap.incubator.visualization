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
qx.Class.define("org.eclipse.rap.rwt.visualization.jit.SpaceTree",
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
		      this.info("Creating spacetree.");
		      var qParent = document.getElementById(this._id);
		      var vizParent = document.createElement("div");
		      var vizId = "vizParent"+this._id;
		      vizParent.setAttribute("id", vizId);
		      qParent.appendChild(vizParent);
		      vizParent.width = this.getWidth();
		      vizParent.height = this.getHeight();
		      var widgetId = this._id;
		      
		      //Create a node rendering function that plots a fill 
		      //rectangle and a stroke rectangle for borders 
		      $jit.ST.Plot.NodeTypes.implement({ 
		        'stroke-rect': {
		          'render': function(node, canvas) { 
		            var width = node.getData('width'), 
		            height = node.getData('height'), 
		            pos = this.getAlignedPos(node.pos.getc(true), width, height), 
		            posX = pos.x + width/2, 
		            posY = pos.y + height/2;
		            this.nodeHelper.rectangle.render('fill', {x: posX, y: posY}, 
		                width, height, canvas); 
		            this.nodeHelper.rectangle.render('stroke', {x: posX, y: posY}, 
		                width, height, canvas); 
		          } 
		        } 
		      }); 
		      
		      var st = new $jit.ST({
		        injectInto: vizId,
		        orientation: "left",  
		        levelsToShow: 2,  
		        subtreeOffset: 8,  
		        siblingOffset: 5,  
		        levelDistance: 30,  
		        withLabels: true,  
		        align: "center",  
		        multitree: false,  
		        indent: 10,  
		        //set distance between node and its children
		        levelDistance: 50,
		        Navigation: {  
		          enable:true,  
		          panning:true,
		          zooming: 20
		        },
		        Node: {  
		          overridable: true,
		          type: 'stroke-rect',
		          /*type: 'rectangle',*/  
		          color: '#ccb',  
		          lineWidth: 1,  
		          height: 20,  
		          width: 90,  
		          dim: 15,  
		          align: "center",
		          CanvasStyles: {  
		            fillStyle: '#ccb',  
		            strokeStyle: '#829bcd',  
		            lineWidth: 2  
		          }  
		        },  
		        Edge: {  
		          overridable: true,  
		          type: 'bezier',  
		          dim: 15,  
		          lineWidth: 1  
		        },
		        Tips: {  
		          enable: true,
		          force: true,
		          type: 'auto',  
		          offsetX: 10,  
		          offsetY: 10,  
		          onShow: function(tip, node) {
		            tip.style.border = "1px solid #c0c0c0";
		            tip.style.backgroundColor = "#ddd";
		            tip.innerHTML = node.name;
		            tip.style.zIndex = 1000000000;
		          }  
		        },
		        duration: 700,  
		        fps: 25,  
		        transition: $jit.Trans.Quart.easeInOut,  
		        clearCanvas: true,  
		        
		        onBeforeCompute: function(node) {  
		          //do something onBeforeCompute  
		        },  
		        onAfterCompute: function(){
		          var node = $jit.Graph.Util.getClosestNodeToOrigin(st.graph, "current");
		          qParent.selection = node;
		          //fire selection event
		          parent.info("Sending selected node: "+node.id);
		          var req = org.eclipse.swt.Request.getInstance();
		          req.addParameter(widgetId + ".selectedNode", node.id);
		          req.addEvent( "org.eclipse.swt.events.widgetSelected", widgetId );
		          req.send();
		        },  
		        onCreateLabel:   function(domElement, node) {  
		          domElement.id = node.id;            
		          domElement.innerHTML = node.name;
		          domElement.onclick = function(){
		            st.onClick(node.id);
		          };
		          //set label styles
		          var style = domElement.style;
		          var font = parent.getFont();
  		          style.fontFamily = font.getFamily();
  		          try {
  		            style.fontStyle = font.generateStyle();
  		          }
  		          catch (e) {
  		            //ignore..some items are not cross - browser compatible
  		          }
  		          style.fontSize = font.getSize();
  		          style.width = st.controller.Node.width + 'px';
  		          style.height = st.controller.Node.height + 'px';            
  		          style.cursor = 'pointer';
  		          style.textAlign= 'center';
  		          style.verticalAlign = 'middle';
  		          style.padding = '3px';
  		          var color = parent.getTextColor();
  		          style.color = color;
		        },  
		        onPlaceLabel:    function(domElement, node) {
		          //future use
		          var style = domElement.style;
		          //todo align top and left based on scale
		          var width = st.controller.Node.width*st.canvas.scaleOffsetX;
              var height = st.controller.Node.height*st.canvas.scaleOffsetY; 
              style.width = width + 'px';
              style.height = height + 'px';
		          
              var pos = node.pos.getc(true); 
              var w = node.getData('width');
              var h = node.getData('height');
              var radius = st.canvas.getSize();
          
              var ox = st.canvas.translateOffsetX;
              var oy = st.canvas.translateOffsetY;
              var sx = st.canvas.scaleOffsetX;
              var sy = st.canvas.scaleOffsetY;
              var posx = pos.x * sx + ox;
              var posy = pos.y * sy + oy;
              //use scaled width
              var left = Math.round(posx - width / 2 + radius.width/2);
              var top = Math.round(posy - height / 2 + radius.height/2);
              style.left = left+'px';
              style.top = top+'px';
              var font = parent.getFont();
              style.fontSize = Math.ceil(font.getSize()*sx)+'pt';
              
              //don't show if not in canvas
              var canvasSize = st.canvas.getSize();
              if(left >= canvasSize.width || left < 0 || top >= canvasSize.height || top < 0) {
                style.display = 'none';
              }
              else {
                style.display = '';
              }
		        },  
		        onBeforePlotNode:function(node) {  
		          //add some color to the nodes in the path between the
		          //root node and the selected node.
		          if (node.selected) {
		            node.setCanvasStyle('strokeStyle', "#fff");
		            node.setCanvasStyle('fillStyle', "#ff7");
//		            node.data.$color = "#ff7";
		          }
		          else {
//		            delete node.data.$color;
		            node.setCanvasStyle('strokeStyle', "#829bcd");
		            var GUtil = $jit.Graph.Util;
		            //if the node belongs to the last plotted level
		            if(!GUtil.anySubnode(node, "exist")) {
		              //count children number
		              var count = 0;
		              GUtil.eachSubnode(node, function(n) { count++; });
		              //assign a node color based on
		              //how many children it has
		              node.setCanvasStyle('fillStyle', ['#aaa', '#baa', '#caa', '#daa', '#eaa', '#faa'][count]);
//		              node.data.$color = ['#aaa', '#baa', '#caa', '#daa', '#eaa', '#faa'][count];                    
		            }
		          }  
		        },  
		        onAfterPlotNode: function(node) {  
		          //do something onAfterPlotNode  
		        },  
		        onBeforePlotLine:function(adj) {  
		          if (adj.nodeFrom.selected && adj.nodeTo.selected) {
		            adj.data.$color = "#fff";
		            adj.data.$lineWidth = 3;
		          }
		          else {
		            delete adj.data.$color;
		            delete adj.data.$lineWidth;
		          }  
		        },  
		        onAfterPlotLine: function(adj) {  
		          //do something onAfterPlotLine  
		        },
		        request:         false
		      });
		      this.addEventListener("changeWidth", function(e) {
		        if (vizParent != null) {
		          vizParent.width = e.getValue();
		          if (vizParent.height != null && vizParent.width != null) {
		            st.canvas.resize(vizParent.width, vizParent.height);
		            st.refresh();
		          }
		        }
		      });
		      this.addEventListener("changeHeight", function(e) {
		        if (vizParent != null) {
		          vizParent.height = e.getValue();
		          if (vizParent.height != null && vizParent.width != null) {
                st.canvas.resize(vizParent.width, vizParent.height);
                st.refresh();
              }
		        }
		      });
		      
		      this._viz = st;
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
		      var st = this._viz;
		      if (st != null) {
		    	  this.info("Loading spacetree data.");
		    	  var data = this.getWidgetData();
		    	  if (data != null) {
		    	    st.loadJSON(data);
		    	    //compute node positions and layout  
		    	    st.compute();
		    	    //Emulate a click on the root node.  
		    	    st.onClick(st.root);
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
    
//    zoomToFit : function () {
//      try {
//        var st = this._viz;
//        if (st != null) {
//          var sz = st.canvas.getSize();
//          var xratio = sz.width/st.canvas.virtualWidth;
//          var yratio = sz.height/st.canvas.virtualHeight;
//          st.canvas.scale(xratio,yratio);
//          st.refresh();
//        }
//      }
//      catch (e) {
//        this.info(e);
//      }
//    },
		
		selectNode : function (id) {
			try {
				var st = this._viz;
				if (st != null) {
					st.onClick(id);
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
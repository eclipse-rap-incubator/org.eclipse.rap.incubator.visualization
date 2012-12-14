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
{ extend :org.eclipse.rap.rwt.visualization.jit.BaseVisualization,
	
	members : {

		_createViz : function(domElement) {
			var vizId = domElement.getAttribute("id");
			var parent = this;
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
					//qParent.selection = node;
					//fire selection event
					parent.info("Sending selected node: "+node.id);
					var req = rwt.remote.Server.getInstance();
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
				if (domElement != null) {
					domElement.width = e.getValue();
					if (domElement.height != null && domElement.width != null) {
						rg.canvas.resize(domElement.width, domElement.height);
						rg.refresh();
					}
				}
			});
			this.addEventListener("changeHeight", function(e) {
				if (domElement != null) {
					domElement.height = e.getValue();
					if (domElement.height != null && domElement.width != null) {
						rg.canvas.resize(domElement.width, domElement.height);
						rg.refresh();
					}
				}
			});
			return rg;
		}
	}
});

org.eclipse.rap.rwt.visualization.jit.BaseVisualization.registerAdapter(
		"org.eclipse.rap.rwt.visualization.jit.RGraph",
		org.eclipse.rap.rwt.visualization.jit.RGraph);
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
{ extend :org.eclipse.rap.rwt.visualization.jit.BaseVisualization,
	
	members : {
		
		_createViz : function(domElement) {
			var vizId = domElement.getAttribute("id");
			var parent = this;
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
						//qParent.selection = node;
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
				if (domElement != null) {
					domElement.width = e.getValue();
					if (domElement.height != null && domElement.width != null) {
						ht.canvas.resize(domElement.width, domElement.height);
						ht.refresh();
					}
				}
			});
			this.addEventListener("changeHeight", function(e) {
				if (domElement != null) {
					domElement.height = e.getValue();
					if (domElement.height != null && domElement.width != null) {
						ht.canvas.resize(domElement.width, domElement.height);
						ht.refresh();
					}
				}
			});
			return ht;
		}
	}
});

org.eclipse.rap.rwt.visualization.jit.BaseVisualization.registerAdapter(
		"org.eclipse.rap.rwt.visualization.jit.HyperTree",
		org.eclipse.rap.rwt.visualization.jit.HyperTree);
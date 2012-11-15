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
qx.Class.define("org.eclipse.rap.rwt.visualization.jit.AreaChart",
{ extend :org.eclipse.rap.rwt.visualization.jit.BaseVisualization,
	
	members : {
		
		_createViz : function(domElement) {
			var vizId = domElement.getAttribute("id");
			var parent = this;
			var st = new $jit.AreaChart({
				injectInto: vizId,
				animate: true,
				Margin: {
					top:5,
					left:5,
					right:5,
					bottom:5
				},
				labelOffset: 10,
				type: 'stacked:gradient',
				showAggregates:true,
				showLabels:true,
				Label: {  
					type: "Native", //Native or HTML  
					size: 13,  
					family: 'Arial',  
					color: 'white'  
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
						tip.style.color = "#000";
						tip.innerHTML = node.name;
						tip.style.zIndex = 1000000000;
					}  
				}
			});
			this.addEventListener("changeWidth", function(e) {
				if (domElement != null) {
					domElement.width = e.getValue();
					if (domElement.height != null && domElement.width != null) {
						st.canvas.resize(domElement.width, domElement.height);
						var size = st.delegate.canvas.getSize();
						var margin = st.config.Margin;
//                if(horz) {
//                  delegate.config.offsetX = size.width/2 - margin.left
//                    - (config.showLabels && (config.labelOffset + config.Label.size));    
//                  delegate.config.offsetY = (margin.bottom - margin.top)/2;
//                } else {
						st.delegate.config.offsetY = -size.height/2 + margin.bottom 
						+ (st.config.showLabels && (st.config.labelOffset + st.config.Label.size));
						st.delegate.config.offsetX = (margin.right - margin.left)/2;
//                }
						st.normalizeDims();
						st.delegate.refresh();
					}
				}
			});
			this.addEventListener("changeHeight", function(e) {
				if (domElement != null) {
					domElement.height = e.getValue();
					if (domElement.height != null && domElement.width != null) {
						st.canvas.resize(domElement.width, domElement.height);
						var size = st.delegate.canvas.getSize();
						var margin = st.config.Margin;
//                if(horz) {
//                  delegate.config.offsetX = size.width/2 - margin.left
//                    - (config.showLabels && (config.labelOffset + config.Label.size));    
//                  delegate.config.offsetY = (margin.bottom - margin.top)/2;
//                } else {
						st.delegate.config.offsetY = -size.height/2 + margin.bottom 
						+ (st.config.showLabels && (st.config.labelOffset + st.config.Label.size));
						st.delegate.config.offsetX = (margin.right - margin.left)/2;
//                }
						st.normalizeDims();
						st.delegate.refresh();
					}
				}
			});
			return st;
		}
	}
});

org.eclipse.rap.rwt.visualization.jit.BaseVisualization.registerAdapter(
		"org.eclipse.rap.rwt.visualization.jit.AreaChart",
		org.eclipse.rap.rwt.visualization.jit.AreaChart);
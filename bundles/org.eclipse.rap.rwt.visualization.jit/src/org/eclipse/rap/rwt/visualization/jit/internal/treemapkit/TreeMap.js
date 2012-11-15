/******************************************************************************
 * Copyright � 2010-2011 Austin Riddle and others.
 * All Rights Reserved.
 * 
 * This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     Austin Riddle - initial API and implementation
 *     Austin Riddle (Texas Center for Applied Technology) - 
 *       data passing and widget scaling
 *     
 * 
 *****************************************************************************/
qx.Class.define("org.eclipse.rap.rwt.visualization.jit.TreeMap",
{ extend :org.eclipse.rap.rwt.visualization.jit.BaseVisualization,
	
	members : {
		
		_createViz : function(domElement) {
			var vizId = domElement.getAttribute("id");
			var parent = this;
			domElement.setAttribute("style","position:absolute;overflow:hidden;display:table-cell;width:100%;vertical-align:middle;height:100%;z-order:auto;");
			domElement.width = this.getWidth();
			domElement.height = this.getHeight();
			qParent.appendChild(domElement);
			var vizStyle = "#infovis div {position:absolute;overflow:hidden;font-size:11px;font-family:Verdana, Geneva, Arial, Helvetica, sans-serif;}#infovis .content {background-color:#333;border:0px solid #111;} #infovis .head {color:white;background-color:#444;} #infovis .head.in-path {background-color:#655;} #infovis .body {background-color:black;} #infovis .leaf {color:white;background-color:#111;display:table-cell;vertical-align:middle;border:1px solid #000;} #infovis .over-leaf {border:1px solid #9FD4FF;} #infovis .over-content {background-color: #9FD4FF;} #infovis .over-head {background-color:#A4D9FF;color:black;} .tip {color: #fff;width: 139px;background-color: black;opacity:0.9;filter:alpha(opacity=90);font-size:10px;font-family:Verdana, Geneva, Arial, Helvetica, sans-serif;padding:7px;} .album {width:100px;margin:3px;} input {font-size:10px;font-family:Verdana, Geneva, Arial, Helvetica, sans-serif;}";
			vizStyle = vizStyle.replace(/infovis/gi,vizId);
			qx.html.StyleSheet.createElement(vizStyle);
			
			var tm = null;
			var config = {
					titleHeight: 15,
					animate: true,
					//The id of the treemap container
					injectInto: vizId,
					//Set the max. depth to be shown for a subtree
					levelsToShow: 2,
					offset:1,
					Events: {  
						enable: true,  
						onClick: function(node) {  
							if(node) tm.enter(node);  
						},  
						onRightClick: function() {  
							tm.out();  
						}  
					},  
					duration: 800,  
					//Enable tips  
					Tips: {  
						enable: true,  
						//add positioning offsets  
						offsetX: 20,  
						offsetY: 20,  
						//implement the onShow method to  
						//add content to the tooltip when a node  
						//is hovered  
						onShow: function(tip, node, isLeaf, domElement) {
							tip.style.zIndex="100000000";
							var html = "<div class=\"tip-title\">" + node.name 
							+ "</div><div class=\"tip-text\">";
							var data = node.data;
							if(data.usecount) {
								html += "Usage Count: " + data.usecount;
							}
							tip.innerHTML =  html;  
						}    
					},  
					//Add the name of the node in the correponding label  
					//This method is called once, on label creation.  
					onCreateLabel: function(domElement, node){  
						domElement.innerHTML = node.name;  
						var style = domElement.style;  
						style.display = '';  
						style.border = '1px solid transparent';  
						domElement.onmouseover = function() {  
							style.border = '1px solid #9FD4FF';  
						};  
						domElement.onmouseout = function() {  
							style.border = '1px solid transparent';  
						};  
					}  
			};
			
			if (this._type == 2) {
				tm = new $jit.TM.Strip(config);
			}
			else if (this._type == 1) {
				tm = new $jit.TM.Squarified(config);
			}
			else {
				tm = new $jit.TM.SliceAndDice(config);
			}
			
//				tm.onLeftClick = function(elem) {
//			        this.enter(elem);
//			        var node = elem;
//		        	qParent.selection = node;
//		        	//fire selection event
//		        	var req = org.eclipse.swt.Request.getInstance();
//		        	req.addParameter(widgetId + ".selectedNode", node.id);
//		        	req.addEvent( "org.eclipse.swt.events.widgetSelected", widgetId );
//		        	req.send();
//			    };
//			    
//			    tm.onRightClick = function() {
//			        this.out();
//		        	qParent.selection = node;
//		        	//fire selection event
//		        	var req = org.eclipse.swt.Request.getInstance();
//		        	req.addParameter(widgetId + ".selectedNode", this.shownTree.id);
//		        	req.addEvent( "org.eclipse.swt.events.widgetSelected", widgetId );
//		        	req.send();
//			        
//			    };
			
			this.addEventListener("changeWidth", function(e) {
				domElement.width = this.getWidth();
				if (domElement.height != null && domElement.width != null) {
					tm.canvas.resize(domElement.width, domElement.height);
//  		        rwt.client.Timer.once(function() {
//  		          parent.refreshData();
//  		        },this,100);
				}
			});
			this.addEventListener("changeHeight", function(e) {
				domElement.height = this.getHeight();
				if (domElement.height != null && domElement.width != null) {
					tm.canvas.resize(domElement.width, domElement.height);
//  		        rwt.client.Timer.once(function() {
//  		          parent.refreshData();
//  		        },this,100);
				}
			});
			
			//This is a hack to ensure that a refresh is called after the style tag above is 
			//initialized
//		      rwt.client.Timer.once(function() {
//		        this.refreshData();
//		      },this,100);
			return tm;
		}
	}
});

org.eclipse.rap.rwt.visualization.jit.BaseVisualization.registerAdapter(
		"org.eclipse.rap.rwt.visualization.jit.TreeMap",
		org.eclipse.rap.rwt.visualization.jit.TreeMap);
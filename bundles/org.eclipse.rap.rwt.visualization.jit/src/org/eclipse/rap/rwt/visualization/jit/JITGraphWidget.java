package org.eclipse.rap.rwt.visualization.jit;

import java.util.HashMap;

import org.eclipse.swt.graphics.RGB;
import org.eclipse.swt.widgets.Composite;

public abstract class JITGraphWidget extends JITVisualizationWidget {
  
  protected RGB nodeColor;
  protected RGB edgeColor;
  
  public JITGraphWidget(Composite parent, int style) {
    super(parent, style);
  }
  
  /**
   * Sets the color for nodes in this visualization.
   * A <code>null</code> value is the same as black. 
   * @param nodeColor - an RGB representing the node color
   */
  public void setNodeColor(RGB nodeColor) {
    this.nodeColor = nodeColor;
    setNodeProperty("color",convertRGBToCSSString(getNodeColor()));
  }

  /**
   * Sets the color for edges in this visualization.
   * A <code>null</code> value is the same as black. 
   * @param nodeColor - an RGB representing the edge color
   */
  public void setEdgeColor(RGB edgeColor) {
    this.edgeColor = edgeColor;
    setEdgeProperty("color",convertRGBToCSSString(getEdgeColor()));
  }
  
  /**
   * Gets the color of the nodes in this visualization.
   * @return and rgb representing the color of the nodes.
   */
  public RGB getNodeColor() {
    return nodeColor;
  }
  
  /**
   * Gets the color of the edges in this visualization.
   * @return and rgb representing the color of the edges.
   */
  public RGB getEdgeColor() {
    return edgeColor;
  }
  
  /**
   * Sets a custom property of the graph implementation.
   * @see <A href="http://thejit.org">JIT API documentation </A>
   * @param propName - the name of the property
   * @param propValue - the value of the property
   */
  public void setProperty (String propName, Object propValue) {
    HashMap<String,Object> args = new HashMap<String,Object>();
    args.put( "propName", propName );
    args.put( "propValue", propValue );
    addCommand("setProperty", args);
  }
  
  /**
   * Sets a custom property of the graph node implementation.
   * @see <A href="http://thejit.org">JIT API documentation </A>
   * 
   * @param propName - the name of the property
   * @param propValue - the value of the property
   */
  public void setNodeProperty(String propName, Object propValue)
  {
    HashMap<String,Object> args = new HashMap<String,Object>();
    args.put( "propName", propName );
    args.put( "propValue", propValue );
    addCommand("setNodeProperty", args);
  }

  /**
   * Sets a custom property of the graph edge implementation.
   * @see <A href="http://thejit.org">JIT API documentation </A>
   * @param propName - the name of the property
   * @param propValue - the value of the property
   */
  public void setEdgeProperty(String propName, Object propValue)
  {
    HashMap<String,Object> args = new HashMap<String,Object>();
    args.put( "propName", propName );
    args.put( "propValue", propValue );
    addCommand("setEdgeProperty", args);
  }
  
  /**
   * Sets the zoom level of the graph canvas.
   * @see <A href="http://thejit.org">JIT API documentation </A>
   * @param percent - the percentage zoom level
   */
  public void setZoom(double percent) {
    HashMap<String,Object> args = new HashMap<String,Object>();
    args.put( "percent", Double.valueOf(percent) );
    addCommand("setZoom", args);
  }

  protected String convertRGBToCSSString(RGB color) {
     if (color == null) return "";
     StringBuffer sb = new StringBuffer("rgb(");
     sb.append(color.red).append(",").
     append(color.green).append(",").
     append(color.blue).append(")").toString();
     return sb.toString();
  }
}

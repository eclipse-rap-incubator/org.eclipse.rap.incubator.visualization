/******************************************************************************
 * Copyright � 2010-2011 Austin Riddle
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
package org.eclipse.rap.rwt.visualization.jit.internal;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;
import java.util.Vector;

import org.eclipse.rap.rwt.internal.protocol.ClientObjectFactory;
import org.eclipse.rap.rwt.internal.protocol.IClientObject;
import org.eclipse.rap.rwt.lifecycle.AbstractWidgetLCA;
import org.eclipse.rap.rwt.lifecycle.ControlLCAUtil;
import org.eclipse.rap.rwt.lifecycle.IWidgetAdapter;
import org.eclipse.rap.rwt.lifecycle.WidgetLCAUtil;
import org.eclipse.rap.rwt.lifecycle.WidgetUtil;
import org.eclipse.rap.rwt.visualization.jit.JITVisualizationWidget;
import org.eclipse.swt.widgets.Control;
import org.eclipse.swt.widgets.Widget;

public abstract class JITWidgetLCA extends AbstractWidgetLCA {
  
  private static final String WIDGET_DATA = "widgetData";
  private static final String PROP_VISIBLE = "visible";

  private static final String[] ALLOWED_STYLES = new String[] { "BORDER" };
  
  public abstract Class getWidgetType();
  
  protected Collection getInitializationParameters (JITVisualizationWidget vWidget) {
    ArrayList params = new ArrayList();
    String id = WidgetUtil.getId( vWidget );
    params.add(id);
    return params;
  }
  
  public void renderInitialization( final Widget widget ) throws IOException {
     Control control = (Control)widget;
     IClientObject clientObject = ClientObjectFactory.getClientObject( control );
     clientObject.create( getWidgetType().getCanonicalName() );
//     clientObject.set( "id", WidgetUtil.getId( control ) );
     clientObject.set( "parent", WidgetUtil.getId( control.getParent() ) );
     clientObject.set( "style", WidgetLCAUtil.getStyles( control, ALLOWED_STYLES ) );
   }
  
  public void preserveValues( final Widget widget ) {
    JITVisualizationWidget vWidget = (JITVisualizationWidget)widget;
    ControlLCAUtil.preserveValues( vWidget );
    IWidgetAdapter adapter = WidgetUtil.getAdapter( vWidget );
    adapter.preserve( PROP_VISIBLE, String.valueOf(vWidget.isVisible()));
    adapter.preserve( WIDGET_DATA, vWidget.getJSONData());
    // only needed for custom variants (theming)
    WidgetLCAUtil.preserveCustomVariant( vWidget );
  }

  public void renderChanges( final Widget widget ) throws IOException {
    ControlLCAUtil.renderChanges( ( Control )widget );
    WidgetLCAUtil.renderCustomVariant( widget );
    
    JITVisualizationWidget vWidget = ( JITVisualizationWidget )widget;
    IClientObject clientObject = ClientObjectFactory.getClientObject( vWidget );
    IWidgetAdapter adapter = WidgetUtil.getAdapter(widget);
    boolean changed = !adapter.isInitialized() || WidgetLCAUtil.hasChanged(widget, PROP_VISIBLE, vWidget.isVisible());
    if (changed) {
      clientObject.set(PROP_VISIBLE, vWidget.isVisible());
    }
    changed = WidgetLCAUtil.hasChanged(widget, WIDGET_DATA, vWidget.getJSONData());
    if (changed) {
      clientObject.set(WIDGET_DATA, vWidget.getJSONData());
    }
    
    WidgetCommandQueue cmdQueue = (WidgetCommandQueue) vWidget.getAdapter(WidgetCommandQueue.class);
    if (cmdQueue != null) {
      while (cmdQueue.peek() != null) {
        Object[] functionCall = (Object[])cmdQueue.poll();
        clientObject.call((String)functionCall[0], (Map<String,Object>)functionCall[1]);
      }
    }
  }

  public void renderDispose( final Widget widget ) throws IOException {
    ClientObjectFactory.getClientObject( widget ).destroy();
  }

  public void createResetHandlerCalls( String typePoolId ) throws IOException {
    //noop
  }

  public String getTypePoolId( Widget widget ) {
    return null;
  }
  
  /**
   * Respond to selection events, set the value of selectedItem on the widget Java object,
   * and broadcast a SWT.Selection event to any listeners  
   */
  public void readData( final Widget widget ) {
    if (widget==null) return;
    JITVisualizationWidget visWidget = ( JITVisualizationWidget )widget;
    String selectedNode = WidgetLCAUtil.readPropertyValue( visWidget, "selectedNode" );
    if (selectedNode!=null) {
      visWidget.setData("selectedNode", selectedNode);
      ControlLCAUtil.processSelection( visWidget, null, true );
    }
  }
  
  public static class WidgetCommandQueue extends Vector {
    private static final long serialVersionUID = -2296255246437590610L;

    public WidgetCommandQueue() {
      super(5);
    }
    
    public synchronized Object peek () {
      if (size() > 0) 
        return get(0);
      return null;
    }
    
    public synchronized Object poll () {
      if (size() > 0) 
        return remove(0);
      return null;
    }
  }

}
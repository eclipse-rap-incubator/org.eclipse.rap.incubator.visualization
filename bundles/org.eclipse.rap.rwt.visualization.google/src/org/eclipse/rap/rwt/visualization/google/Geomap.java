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
package org.eclipse.rap.rwt.visualization.google;

import org.eclipse.swt.widgets.Composite;

/**
 * Renders a Google Visualization Geomap.
 * <p>
 * This visualization is configured using the widget data and options 
 * set by <code>setWidgetData()</code> and <code>setWidgetOptions()</code>.  
 * Note that if the widget data or options are changed after initial rendering, 
 * the <code>redraw()</code> method should be called to render the changes.  
 * </p>
 * <p>
 * Note that this is a partial implementation of the Google GeoMap widget.
 * The Markers capability has been omitted since this would require a Google API developer key.  Support for markers could certainly
 * </p>
 * <p>
 * <b>Usage:</b>
 * <pre>
 * JSONGoogleDataTable dataTable = new JSONGoogleDataTable();
 * dataTable.addColumn("Country", "Country", "string", null);
 * dataTable.addColumn("Happiness", "Happiness", "number", null);
 * dataTable.addRow(new Object[] {"Tanzania", 25});
 * dataTable.addRow(new Object[] {"US", 40});
 * widgetData = dataTable.toString();
 *   
 * Geomap geomap = new Geomap( composite, SWT.NONE );
 * geomap.setWidgetOptions("{width: 500, height: 500}");
 * geomap.setWidgetData(widgetData);
 * geomap.addListener(SWT.Selection, this);
 *  </pre>
 *  </p>
 *  <p>
 *   <pre>
 * public void handleEvent(Event event) {
 *   System.out.println("Event: " + event);
 *   VisualizationWidget widget = (VisualizationWidget)event.widget;
 *   System.out.println("Selected item=" + widget.getSelectedItem());
 * }
 * </pre>
 * </p>
 * @see <a href="http://code.google.com/apis/visualization/documentation/gallery/geomap.html">Geomap Example</a>
 *
 */
public class Geomap extends VisualizationWidget {

  public static final String GEOMAP_API = "geomap";

  /**
   * Constructs a geomap widget in the specified parent and style. 
   * A visualization widget by default will auto-resize to fill its parent.
   * <p>
   * The style value is either one of the style constants defined in
   * class <code>SWT</code> which is applicable to instances of this
   * class, or must be built by <em>bitwise OR</em>'ing together
   * (that is, using the <code>int</code> "|" operator) two or more
   * of those <code>SWT</code> style constants. The class description
   * lists the style constants that are applicable to the class, if any.
   * Style bits are also inherited from superclasses.
   * </p>
   * @param parent the parent composite (cannot be <code>null</code>)
   * @param style the style bits of the widget
   * @exception IllegalArgumentException <ul>
   *    <li>ERROR_NULL_ARGUMENT - if the parent is null</li>
   * </ul>
   * @exception SWTException <ul>
   *    <li>ERROR_THREAD_INVALID_ACCESS - if not called from the thread that created the parent</li>
   * </ul>
   *
   */
  public Geomap( final Composite parent, final int style ) {
    super( parent, style );
  }

  @Override
  public String getGoogleAPI() {
    return GEOMAP_API;
  }

}

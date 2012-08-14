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
package org.eclipse.rap.rwt.visualization.google.internal.columnchartkit;

import org.eclipse.rap.rwt.visualization.google.ColumnChart;
import org.eclipse.rap.rwt.visualization.google.internal.VisualizationWidgetLCA;

public class ColumnChartLCA extends VisualizationWidgetLCA {

  @Override
  public Class<?> getWidgetType() {
    return ColumnChart.class;
  }
}

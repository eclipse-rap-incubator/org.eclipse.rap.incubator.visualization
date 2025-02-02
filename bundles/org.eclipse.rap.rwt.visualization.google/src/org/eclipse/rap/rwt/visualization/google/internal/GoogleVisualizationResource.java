/*******************************************************************************
 * Copyright (c) 2009-2010 David Donahue.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 * 
 * Contributors:
 *     David Donahue - initial API, implementation and documentation
 ******************************************************************************/
package org.eclipse.rap.rwt.visualization.google.internal;

import org.eclipse.rap.ui.resources.IResource;

/**
 * <p>Base type for visualization resources.</p>
 *
 */
public abstract class GoogleVisualizationResource implements IResource {

  public String getCharset() {
    return "ISO-8859-1";
  }

  public ClassLoader getLoader() {
    return this.getClass().getClassLoader();
  }

  public abstract String getLocation();

  public boolean isJSLibrary() {
    return true;
  }

  public boolean isExternal() {
    return false;
  }
}

/*******************************************************************************
 * Copyright (c) 2010-2011 Austin Riddle.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 * 
 * Contributors:
 *     Austin Riddle - initial API, implementation and documentation
 ******************************************************************************/
package org.eclipse.rap.rwt.visualization.jit.internal;

import org.eclipse.rap.ui.resources.IResource;

public abstract class JITVisualizationResource implements IResource {

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

/******************************************************************************
 * Copyright (c) 2008-2010 Texas Center for Applied Technology
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
 *        initial API and implementation
 * 
 *****************************************************************************/
package org.eclipse.rap.rwt.excanvas;

import org.eclipse.rap.ui.resources.IResource;


public class ExCanvasResource implements IResource {

  private String location;
  
  public String getCharset() {
    return "UTF-8";
  }

  public ClassLoader getLoader() {
    return this.getClass().getClassLoader();
  }

  public String getLocation() {
    if( location == null ) {
      location = "org/eclipse/rap/rwt/excanvas/excanvas.compiled.js";
    }
    return location;
  }

  public boolean isJSLibrary() {
    return true;
  }

  public boolean isExternal() {
    return false;
  }
}

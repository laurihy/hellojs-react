/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule flattenChildren
 */

"use strict";

var ReactTextComponent = require("./ReactTextComponent");

var escapeTextForBrowser = require("./escapeTextForBrowser");

var throwIf = require("./throwIf");

/**
 * @polyFill Array.isArray
 */
var INVALID_CHILD = 'INVALID_CHILD';

/**
 * If there is only a single child, it still needs a name.
 */
var ONLY_CHILD_NAME = '0';

var flattenChildrenImpl = function(res, children, nameSoFar) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      flattenChildrenImpl(res, children[i], nameSoFar + '[' + i + ']');
    }
  } else {
    var type = typeof children;
    var isOnlyChild = nameSoFar === '';
    var storageName = isOnlyChild ? ONLY_CHILD_NAME : nameSoFar;
    if (children === null || children === undefined || type === 'boolean') {
      res[storageName] = null;
    } else if (children.mountComponentIntoNode) {
      /* We found a component instance */
      res[storageName] = children;
    } else {
      if (type === 'object') {
        throwIf(children && children.nodeType === 1, INVALID_CHILD);
        for (var key in children) {
          if (children.hasOwnProperty(key)) {
            flattenChildrenImpl(
              res,
              children[key],
              nameSoFar + '{' + escapeTextForBrowser(key) + '}'
            );
          }
        }
      } else if (type === 'string') {
        res[storageName] = new ReactTextComponent(children);
      } else if (type === 'number') {
        res[storageName] = new ReactTextComponent('' + children);
      }
    }
  }
};

/**
 * Flattens children that are typically specified as `props.children`.
 * @return {!Object} flattened children keyed by name.
 */
function flattenChildren(children) {
  if (children === null || children === undefined) {
    return children;
  }
  var result = {};
  flattenChildrenImpl(result, children, '');
  return result;
}

module.exports = flattenChildren;

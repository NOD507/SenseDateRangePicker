/**
 * Copyright (c) 2010 - The OWASP Foundation
 * <p/>
 * The jquery-encoder is published by OWASP under the MIT license.
 * <p/>
 * This is encoder builds on jquery-encoder. It is refactored to suit the need for the QlikView Application.
 * Since it no longer has any dependencies to jQuery it now called
 * <em>encoder</em>
 */
define([], function() {
  var encoder = {
    encodeForHTML: function (input) {
      /** 
      * Encodes input for use in HTML context
      */    
      if (input === undefined) {
        return '';
      }
      let encoded = '',
        encodingDiv = document.createElement('div');
      const textNode = document.createTextNode(input);
      encodingDiv.appendChild(textNode);
      encoded = encodingDiv.innerHTML;
      encodingDiv.removeChild(textNode);
      return encoded;
    }
  };
  return encoder;
})
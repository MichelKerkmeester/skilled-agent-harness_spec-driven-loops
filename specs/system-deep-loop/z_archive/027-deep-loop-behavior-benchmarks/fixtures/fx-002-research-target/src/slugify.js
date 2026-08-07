'use strict';

/**
 * URL slug utility.
 *
 * Converts an input string into a URL-safe slug.
 */

function slugify(input, maxLen) {
  maxLen = maxLen || 60;

  // Numbers are stringified; other inputs are used as-is.
  var str = (typeof input === 'number') ? String(input) : input;

  str = str.toLowerCase().trim();

  // Collapse runs of non-alphanumeric characters to a single hyphen.
  str = str.replace(/[^a-z0-9]+/g, '-');

  // Remove leading and trailing hyphens.
  str = str.replace(/^-+|-+$/g, '');

  // Cap to the maximum length.
  if (str.length > maxLen) {
    str = str.slice(0, maxLen);
  }

  return str;
}

module.exports = slugify;

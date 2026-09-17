#!/usr/bin/env node
/**
 * Colour arithmetic for the diagram corpus and its token applicator.
 *
 * A copy rather than an import: the diagram skill must not depend on a sibling skill's file at
 * runtime, and the transfer curve is standard enough that two copies cannot drift in meaning.
 */

'use strict';

/**
 * Convert one sRGB channel to its linear-light value.
 *
 * @param {number} value A channel in the inclusive 0-255 range.
 * @returns {number} The linear-light channel value.
 */
function channel(value) {
  const normalized = value / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
}

/**
 * Calculate relative luminance for a six- or eight-digit hexadecimal colour.
 *
 * @param {string} hex A hexadecimal colour beginning with #.
 * @returns {number} Relative luminance.
 */
function luminance(hex) {
  const n = parseInt(hex.slice(1, 7), 16);
  return 0.2126 * channel((n >> 16) & 255)
    + 0.7152 * channel((n >> 8) & 255)
    + 0.0722 * channel(n & 255);
}

/**
 * Calculate the WCAG contrast ratio for two hexadecimal colours.
 *
 * @param {string} first First hexadecimal colour.
 * @param {string} second Second hexadecimal colour.
 * @returns {number} Contrast ratio with the lighter colour first.
 */
function contrast(first, second) {
  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);
  const high = Math.max(firstLuminance, secondLuminance);
  const low = Math.min(firstLuminance, secondLuminance);
  return (high + 0.05) / (low + 0.05);
}

/**
 * Round a ratio to the precision used in corpus messages and mappings.
 *
 * @param {number} value Number to round.
 * @returns {number} Value rounded to two decimal places.
 */
function round2(value) {
  return Math.round(value * 100) / 100;
}

module.exports = { channel, luminance, contrast, round2 };

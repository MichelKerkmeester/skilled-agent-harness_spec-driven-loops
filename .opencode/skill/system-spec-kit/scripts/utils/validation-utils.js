// ───────────────────────────────────────────────────────────────
// UTILS: VALIDATION UTILS
// ───────────────────────────────────────────────────────────────

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */
'use strict';

/* ─────────────────────────────────────────────────────────────
   2. PLACEHOLDER VALIDATION
──────────────────────────────────────────────────────────────── */

function validate_no_leaked_placeholders(content, filename) {
  const leaked = content.match(/\{\{[A-Z_]+\}\}/g);
  if (leaked) {
    console.warn(`⚠️  Leaked placeholders detected in ${filename}: ${leaked.join(', ')}`);
    console.warn(`   Context around leak: ${content.substring(content.indexOf(leaked[0]) - 100, content.indexOf(leaked[0]) + 100)}`);
    throw new Error(`❌ Leaked placeholders in ${filename}: ${leaked.join(', ')}`);
  }

  const partialLeaked = content.match(/\{\{[^}]*$/g);
  if (partialLeaked) {
    console.warn(`⚠️  Partial placeholder detected in ${filename}: ${partialLeaked.join(', ')}`);
    throw new Error(`❌ Malformed placeholder in ${filename}`);
  }

  const openBlocks = (content.match(/\{\{[#^][A-Z_]+\}\}/g) || []);
  const closeBlocks = (content.match(/\{\{\/[A-Z_]+\}\}/g) || []);
  if (openBlocks.length !== closeBlocks.length) {
    console.warn(`⚠️  Template has ${openBlocks.length} open blocks but ${closeBlocks.length} close blocks`);
  }
}

/* ─────────────────────────────────────────────────────────────
   3. ANCHOR VALIDATION
──────────────────────────────────────────────────────────────── */

function validate_anchors(content) {
  const openPattern = /<!-- (?:ANCHOR|anchor):([a-zA-Z0-9_-]+)/g;
  const closePattern = /<!-- \/(?:ANCHOR|anchor):([a-zA-Z0-9_-]+)/g;

  const openAnchors = new Set();
  const closeAnchors = new Set();

  let match;
  while ((match = openPattern.exec(content)) !== null) {
    openAnchors.add(match[1]);
  }
  while ((match = closePattern.exec(content)) !== null) {
    closeAnchors.add(match[1]);
  }

  const warnings = [];

  for (const anchor of openAnchors) {
    if (!closeAnchors.has(anchor)) {
      warnings.push(`Unclosed anchor: ${anchor} (missing <!-- /ANCHOR:${anchor} -->)`);
    }
  }

  for (const anchor of closeAnchors) {
    if (!openAnchors.has(anchor)) {
      warnings.push(`Orphaned closing anchor: ${anchor} (no matching opening tag)`);
    }
  }

  return warnings;
}

function log_anchor_validation(content, filename) {
  const anchorWarnings = validate_anchors(content);
  if (anchorWarnings.length > 0) {
    console.warn(`[generate-context] Anchor validation warnings in ${filename}:`);
    anchorWarnings.forEach(w => console.warn(`  - ${w}`));
  }
}

/* ─────────────────────────────────────────────────────────────
   4. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Primary exports (snake_case)
  validate_no_leaked_placeholders,
  validate_anchors,
  log_anchor_validation,
  // Backwards compatibility aliases (camelCase)
  validateNoLeakedPlaceholders: validate_no_leaked_placeholders,
  validateAnchors: validate_anchors,
  logAnchorValidation: log_anchor_validation,
};

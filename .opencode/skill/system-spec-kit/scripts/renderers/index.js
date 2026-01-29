// ───────────────────────────────────────────────────────────────
// RENDERERS: MODULE INDEX
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────────── */

const {
  populate_template,
  render_template,
  cleanup_excessive_newlines,
  strip_template_config_comments,
  is_falsy
} = require('./template-renderer');

/* ─────────────────────────────────────────────────────────────────
   2. EXPORTS
──────────────────────────────────────────────────────────────────── */

module.exports = {
  // Primary exports (snake_case)
  populate_template,
  render_template,
  cleanup_excessive_newlines,
  strip_template_config_comments,
  is_falsy,
  // Backwards compatibility aliases (camelCase)
  populateTemplate: populate_template,
  renderTemplate: render_template,
  cleanupExcessiveNewlines: cleanup_excessive_newlines,
  stripTemplateConfigComments: strip_template_config_comments,
  isFalsy: is_falsy
};

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */
'use strict';

const {
  populateTemplate,
  renderTemplate,
  cleanupExcessiveNewlines,
  stripTemplateConfigComments,
  isFalsy
} = require('./template-renderer');

/* ─────────────────────────────────────────────────────────────
   2. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  populateTemplate,
  renderTemplate,
  cleanupExcessiveNewlines,
  stripTemplateConfigComments,
  isFalsy
};

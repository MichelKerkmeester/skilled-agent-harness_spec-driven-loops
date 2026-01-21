// ───────────────────────────────────────────────────────────────
// UTILS: FORMAT HELPERS
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. FORMATTING UTILITIES
──────────────────────────────────────────────────────────────── */

/**
 * Format a date string as a human-readable age string
 * @param {string|null} date_string - ISO date string or null
 * @returns {string} Formatted age string (e.g., "2 days ago", "yesterday")
 */
function format_age_string(date_string) {
  if (!date_string) return 'never';

  const date = new Date(date_string);
  const now = Date.now();
  const age_ms = now - date.getTime();
  const age_days = Math.floor(age_ms / (24 * 60 * 60 * 1000));

  if (age_days < 1) {
    return 'today';
  } else if (age_days === 1) {
    return 'yesterday';
  } else if (age_days < 7) {
    return `${age_days} days ago`;
  } else if (age_days < 30) {
    const weeks = Math.floor(age_days / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else {
    const months = Math.floor(age_days / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
}

/* ─────────────────────────────────────────────────────────────
   2. MODULE EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  format_age_string,
};

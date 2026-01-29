// ───────────────────────────────────────────────────────────────
// UTILS: FILE HELPERS
// ───────────────────────────────────────────────────────────────

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */
'use strict';

/* ─────────────────────────────────────────────────────────────
   2. PATH UTILITIES
──────────────────────────────────────────────────────────────── */

function to_relative_path(filePath, projectRoot) {
  if (!filePath) return '';
  let cleaned = filePath;

  if (projectRoot && cleaned.startsWith(projectRoot)) {
    cleaned = cleaned.slice(projectRoot.length);
    if (cleaned.startsWith('/')) cleaned = cleaned.slice(1);
  }

  cleaned = cleaned.replace(/^\.\//, '');

  if (cleaned.length > 60) {
    const parts = cleaned.replace(/\\/g, '/').split('/');
    if (parts.length > 3) {
      return `${parts[0]}/.../${parts.slice(-2).join('/')}`;
    }
  }

  return cleaned;
}

/* ─────────────────────────────────────────────────────────────
   3. DESCRIPTION UTILITIES
──────────────────────────────────────────────────────────────── */

function is_description_valid(description) {
  if (!description || description.length < 8) return false;

  const garbagePatterns = [
    /^#+\s/,
    /^[-*]\s/,
    /\s(?:and|or|to|the)\s*$/i,
    /^(?:modified?|updated?)\s+\w+$/i,
    /^filtering\s+(?:pipeline|system)$/i,
    /^And\s+[`'"]?/i,
    /^Modified during session$/i,
    /\[PLACEHOLDER\]/i,
  ];

  return !garbagePatterns.some(p => p.test(description));
}

function clean_description(desc) {
  if (!desc) return '';
  let cleaned = desc.trim();

  cleaned = cleaned.replace(/^#+\s+/, '');
  cleaned = cleaned.replace(/^[-*]\s+/, '');
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
  cleaned = cleaned.replace(/[.,;:]+$/, '');

  if (cleaned.length > 60) {
    cleaned = cleaned.substring(0, 57) + '...';
  }

  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned;
}

/* ─────────────────────────────────────────────────────────────
   4. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Primary exports (snake_case)
  to_relative_path,
  is_description_valid,
  clean_description,
  // Backwards compatibility aliases (camelCase)
  toRelativePath: to_relative_path,
  isDescriptionValid: is_description_valid,
  cleanDescription: clean_description
};

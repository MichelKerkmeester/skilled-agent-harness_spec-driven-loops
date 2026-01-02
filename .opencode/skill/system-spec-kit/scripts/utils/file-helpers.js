/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */
'use strict';

/* ─────────────────────────────────────────────────────────────
   2. PATH UTILITIES
──────────────────────────────────────────────────────────────── */

function toRelativePath(filePath, projectRoot) {
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

function isDescriptionValid(description) {
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

function cleanDescription(desc) {
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
  toRelativePath,
  isDescriptionValid,
  cleanDescription
};

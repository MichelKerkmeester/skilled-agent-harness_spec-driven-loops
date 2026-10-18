// ───────────────────────────────────────────────────────────────────
// MODULE: Post Edit Quality Core
// ───────────────────────────────────────────────────────────────────
'use strict';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The plugin directory is the parent of this module's lib directory.
export const PLUGIN_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
export const MAX_CALL_IDS = 1_000;
export const MAX_PENDING_FINDINGS = 20;
const MAX_FINDING_LINE_CHARS = 500;

// Same mutating-tool set system-dist-freshness-guard.js watches, reused here
// because both plugins need the identical "did this tool just write a file"
// signal from tool.execute.before's args shape.
export const MUTATING_TOOLS = new Set([
  'write',
  'edit',
  'patch',
  'multiedit',
  'apply_patch',
  'apply-patch',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Read the edited path from a tool's argument payload.
 *
 * @param {object | undefined} args - Tool arguments.
 * @returns {string | null} The first supported non-empty file path.
 */
export function filePathFromArgs(args) {
  if (!args || typeof args !== 'object') return null;
  const value = args.filePath || args.file_path || args.path;
  return typeof value === 'string' && value ? value : null;
}

/**
 * Bounded callID to filePath map. The before hook stashes the edited path and
 * the after hook retrieves and evicts it.
 *
 * @param {number} [maxEntries=MAX_CALL_IDS] - Maximum entries to retain.
 * @returns {{ stash: Function, take: Function, size: Function }} The correlation map.
 */
export function createCorrelationMap(maxEntries = MAX_CALL_IDS) {
  const map = new Map();
  return {
    stash(callID, filePath) {
      if (!callID || !filePath) return;
      if (map.size >= maxEntries) map.delete(map.keys().next().value);
      map.set(callID, filePath);
    },
    take(callID) {
      if (!callID || !map.has(callID)) return null;
      const filePath = map.get(callID);
      map.delete(callID);
      return filePath;
    },
    size() {
      return map.size;
    },
  };
}

/**
 * Format a checker finding for the pending advisory buffer.
 *
 * @param {string} filePath - Path associated with the finding.
 * @param {object} finding - Checker result.
 * @returns {string} Bounded advisory text.
 */
export function formatFinding(filePath, finding) {
  const firstLine = String(finding.stdout || '').split('\n').find((line) => line.trim()) || '(no detail)';
  return `[${finding.label}] ${filePath}: ${firstLine}`.slice(0, MAX_FINDING_LINE_CHARS);
}

#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ extract-deliverable — output-contract region extraction (teaching T5)    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Pilot teaching T5 (spec 143): graders and linters that read a model's whole
 * transcript score its reasoning, rule-quoting and self-assessment instead of
 * the deliverable (almost every early lint hit was a false positive from
 * reasoning text). Outputs graded for quality must wrap ONLY the deliverable
 * in <DELIVERABLE>...</DELIVERABLE>; this helper extracts that region with an
 * explicit confidence so scorers can record what they actually scored.
 *
 * Mirrors the python extraction in the pilot's benchmark/grader/hvr_lint.py.
 */

const TAG_RE = /<DELIVERABLE>([\s\S]*?)<\/DELIVERABLE>/gi;
const FENCE_RE = /```[a-zA-Z]*\n([\s\S]*?)```/g;

/**
 * @param {string} raw - full model output text
 * @returns {{text: string, confidence: 'high'|'medium'|'low'}}
 *   high   = explicit <DELIVERABLE> tags
 *   medium = fenced code blocks (reasoning may leak into fences)
 *   low    = no contract markers; the whole text (reasoning contaminates)
 */
function extractDeliverable(raw) {
  const s = String(raw || '');
  const tags = [...s.matchAll(TAG_RE)].map((m) => m[1]);
  if (tags.length > 0) return { text: tags.join('\n').trim(), confidence: 'high' };
  const fences = [...s.matchAll(FENCE_RE)].map((m) => m[1]);
  if (fences.length > 0) return { text: fences.join('\n').trim(), confidence: 'medium' };
  return { text: s, confidence: 'low' };
}

module.exports = { extractDeliverable };

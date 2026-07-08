#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ model-family — different-family grader enforcement (anti-Goodhart T1/T3) ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Pilot teaching T1/T3 (spec 143): self-scores and same-family grading are the
 * score-inflation mechanism (~+6/25 measured). A grader that shares a model
 * family with the generator inherits its blind spots, so benchmark runs with
 * an LLM grader must refuse the combination unless explicitly overridden.
 *
 * Family extraction is heuristic by design: provider ids and model slugs both
 * carry family tokens. Unknown models map to their first slug token so two
 * unknown-but-identical models still collide.
 */

// token -> canonical family. Order does not matter; longest-token match wins.
const FAMILY_TOKENS = {
  deepseek: 'deepseek',
  minimax: 'minimax',
  mimo: 'xiaomi',
  xiaomi: 'xiaomi',
  claude: 'anthropic',
  anthropic: 'anthropic',
  sonnet: 'anthropic',
  opus: 'anthropic',
  haiku: 'anthropic',
  gpt: 'openai',
  openai: 'openai',
  opencode: 'openai',
  gemini: 'google',
  google: 'google',
  kimi: 'moonshot',
  moonshot: 'moonshot',
  qwen: 'qwen',
  glm: 'zhipu',
  zhipu: 'zhipu',
  llama: 'meta',
  mistral: 'mistral',
};

/**
 * Extract a canonical family token from a model identifier.
 *
 * @param {string} modelId - e.g. 'deepseek/deepseek-v4-pro', 'xiaomi/mimo-v2-pro',
 *   'claude-sonnet-4-5', or a profile entry's `${provider}/${model_slug}`.
 * @returns {string} canonical family, or the first alpha token lowercased when unknown
 */
function extractFamily(modelId) {
  const lower = String(modelId || '').toLowerCase();
  const tokens = Object.keys(FAMILY_TOKENS).sort((a, b) => b.length - a.length);
  for (const token of tokens) {
    if (lower.includes(token)) return FAMILY_TOKENS[token];
  }
  const first = lower.replace(/[^a-z0-9]+/g, ' ').trim().split(' ')[0];
  return first || 'unknown';
}

function familiesCollide(a, b) {
  return extractFamily(a) === extractFamily(b);
}

/**
 * Gate: the grader must not share a family with ANY generator model.
 *
 * @param {Array<string|{provider?: string, model_slug?: string, model?: string}>} generatorModels
 * @param {string} graderModel
 * @param {boolean} allowSameFamily - explicit override (journaled by the caller)
 * @returns {{ok: true, overridden: boolean} | {ok: false, collisions: string[]}}
 */
function assertGraderIndependence(generatorModels, graderModel, allowSameFamily) {
  const ids = (generatorModels || []).filter(Boolean).map((m) =>
    typeof m === 'string' ? m : `${m.provider || ''}/${m.model_slug || m.model || ''}`,
  );
  const collisions = ids.filter((id) => familiesCollide(id, graderModel));
  if (collisions.length === 0) return { ok: true, overridden: false };
  if (allowSameFamily) return { ok: true, overridden: true };
  return { ok: false, collisions };
}

module.exports = { extractFamily, familiesCollide, assertGraderIndependence, FAMILY_TOKENS };

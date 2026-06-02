#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ contamination-lint.cjs — pre-dispatch hint-free fixture gate             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * contamination-lint.cjs — pre-dispatch hint-free gate.
 *
 * A public fixture prompt must not leak the answer. The lint reuses the same
 * lowercased-substring logic the routers themselves use to decide a match, so
 * "hint-free" is decided by the identical mechanism that would otherwise be
 * gamed. Banned vocabulary is built from the target skill's own identity:
 * name/id, frontmatter triggers, router keywords, intent keys, resource path
 * segments + basenames, and the private gold labels for the scenario. A hard
 * leak is a FIXTURE failure (fix the fixture, not the skill).
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS/REQUIRES
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { parseRouter } = require('./router-replay.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readIfExists(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

/**
 * Extract trigger phrases and the skill name from a SKILL.md frontmatter block.
 * @param {string} skillMd - Raw SKILL.md contents (may be empty).
 * @returns {string[]} Trigger phrases plus the frontmatter name, if present.
 */
function frontmatterTriggers(skillMd) {
  const fm = /^---\n([\s\S]*?)\n---/.exec(skillMd);
  if (!fm) return [];
  const triggers = [];
  const block = fm[1];
  const tm = /trigger_phrases:\s*\n((?:\s*-\s*.+\n?)+)/.exec(block);
  if (tm) {
    for (const line of tm[1].split('\n')) {
      const v = /-\s*["']?([^"'\n]+)["']?\s*$/.exec(line);
      if (v) triggers.push(v[1].trim());
    }
  }
  const nameM = /^name:\s*["']?([^"'\n]+)/m.exec(block);
  if (nameM) triggers.push(nameM[1].trim());
  return triggers;
}

function pathTokens(resourcePath) {
  const tokens = new Set();
  const base = path.basename(resourcePath);
  tokens.add(base);
  tokens.add(base.replace(/\.[a-z]+$/i, ''));
  for (const seg of resourcePath.split('/')) if (seg && seg.length > 3) tokens.add(seg);
  return [...tokens];
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build the banned-substring vocabulary for a target skill.
 * @param {Object} params - Vocabulary parameters.
 * @param {string} params.skillRoot - Target skill root directory (holds SKILL.md).
 * @param {string} [params.skillId] - Skill id; defaults to the skillRoot basename.
 * @param {{ skillId?: string, intentKeys?: string[], resources?: string[], assets?: string[] }} [params.privateExpected] - Private gold labels for the scenario.
 * @returns {string[]} lowercased banned substrings
 */
function buildBannedVocab({ skillRoot, skillId, privateExpected }) {
  const skillMd = readIfExists(path.join(skillRoot, 'SKILL.md'));
  const vocab = new Set();
  const add = (s) => { if (s && String(s).trim().length > 2) vocab.add(String(s).toLowerCase()); };

  add(skillId || path.basename(skillRoot));
  add(path.basename(skillRoot));
  for (const t of frontmatterTriggers(skillMd)) add(t);

  const router = parseRouter(skillMd, skillRoot);
  for (const [intentKey, sig] of Object.entries(router.intentSignals)) {
    add(intentKey);
    for (const kw of sig.keywords) add(kw);
  }
  for (const [intentKey, resources] of Object.entries(router.resourceMap)) {
    add(intentKey);
    for (const r of resources) for (const tok of pathTokens(r)) add(tok);
  }

  if (privateExpected) {
    add(privateExpected.skillId);
    for (const k of privateExpected.intentKeys || []) add(k);
    for (const r of privateExpected.resources || []) for (const tok of pathTokens(r)) add(tok);
    for (const a of privateExpected.assets || []) for (const tok of pathTokens(a)) add(tok);
  }
  return [...vocab];
}

/**
 * Lint a public fixture prompt against the banned vocabulary.
 * @param {Object} params - Lint parameters.
 * @param {string} params.publicText - Public prompt text to scan for leaks.
 * @param {string[]} params.bannedVocab - Lowercased banned substrings from buildBannedVocab.
 * @returns {{ passed: boolean, hardLeaks: Array<{term:string}> }}
 */
function lintFixture({ publicText, bannedVocab }) {
  const hay = String(publicText || '').toLowerCase();
  const hardLeaks = [];
  for (const term of bannedVocab) {
    if (term && hay.includes(term)) hardLeaks.push({ term });
  }
  return { passed: hardLeaks.length === 0, hardLeaks };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { buildBannedVocab, lintFixture, frontmatterTriggers };

if (require.main === module) {
  const args = require('./_args.cjs').parse(process.argv.slice(2));
  if (!args.skill || !args.text) {
    process.stderr.write('usage: contamination-lint.cjs --skill <root> --text "<public prompt>"\n');
    process.exit(2);
  }
  const vocab = buildBannedVocab({ skillRoot: args.skill });
  const res = lintFixture({ publicText: args.text, bannedVocab: vocab });
  process.stdout.write(JSON.stringify(res, null, 2) + '\n');
  process.exit(res.passed ? 0 : 1);
}

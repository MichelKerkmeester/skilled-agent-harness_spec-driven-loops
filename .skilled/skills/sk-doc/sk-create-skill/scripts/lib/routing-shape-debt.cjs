// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ routing-shape-debt — routing-shape known-debt ledger reader               ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * routing-shape-debt.cjs — one reader for routing-shape-known-debt.json.
 *
 * The routing canon is enforced by a Python check and more than one JS check,
 * and the ledger that carries the migration has to mean the same thing to all
 * of them. This module is that one meaning: the effective SMART ROUTING limits
 * and the per-skill entries that may still keep an older shape while the skill
 * migrates.
 *
 * The known-debt ledger records, per skill, the shape that skill may keep:
 * how many SMART ROUTING lines and words it carries, how many machine-router
 * declarations it still holds in SKILL.md (a leftover section or a stray block,
 * one count each), and which finding codes it is allowed to raise at all.
 * Recording the codes is what keeps an entry from becoming a blanket
 * exemption — a skill listed for length alone still fails the day it grows a
 * router file. An unreadable, absent or half-written ledger records no debt, so
 * a broken ledger can only tighten the canon, never excuse a skill.
 *
 * Entries are keyed by a skill's path under .skilled/skills, so a same-named
 * folder anywhere else can never inherit another skill's debt, and a caller
 * outside that root finds no key at all. Two environment overrides let a test
 * point at its own ledger and its own skills root instead of the live ones.
 *
 * This is the one library in this folder that reads a file: the ledger is its
 * whole input, and every check must read it identically.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const ROUTING_SHAPE_DEBT_FILE = path.join(__dirname, '..', 'routing-shape-known-debt.json');
const ROUTING_SHAPE_MAX_LINES = 12;
const ROUTING_SHAPE_MAX_WORDS = 180;

// The finding codes a debt entry may record. An entry naming anything else is
// ignored outright rather than partially honoured, so a typo cannot widen it.
const ROUTING_SHAPE_CODES = ['RS-001', 'RS-002', 'RS-003', 'RS-004', 'RS-005'];
const ROUTING_SHAPE_DEBT_FIELDS = ['lines', 'words', 'machineBlocks', 'codes'];

// ─────────────────────────────────────────────────────────────────────────────
// 3. LEDGER
// ─────────────────────────────────────────────────────────────────────────────

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// A debt entry must state every limit, so a half-written entry cannot silently
// fall back to a default and excuse a skill; anything else is ignored and the
// skill stays held to the canon.
function isRoutingShapeDebtEntry(recorded) {
  if (!isPlainObject(recorded)) return false;
  if (Object.keys(recorded).length !== ROUTING_SHAPE_DEBT_FIELDS.length) return false;
  for (const field of ROUTING_SHAPE_DEBT_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(recorded, field)) return false;
  }
  for (const field of ['lines', 'words', 'machineBlocks']) {
    if (!Number.isInteger(recorded[field]) || recorded[field] < 0) return false;
  }
  return Array.isArray(recorded.codes)
    && recorded.codes.every((code) => ROUTING_SHAPE_CODES.includes(code));
}

/**
 * Read the ledger into the effective limits and the tolerated entries.
 *
 * @returns {{maxSmartRoutingLines:number, maxSmartRoutingWords:number,
 *   debt:Map<string, {lines:number, words:number, machineBlocks:number, codes:string[]}>}}
 *   The limits are the defaults unless the ledger raises them, and every entry
 *   in `debt` passed the shape test above.
 */
function loadRoutingShapeDebt() {
  const file = process.env.ROUTING_SHAPE_DEBT_FILE
    ? path.resolve(process.env.ROUTING_SHAPE_DEBT_FILE)
    : ROUTING_SHAPE_DEBT_FILE;
  const config = {
    maxSmartRoutingLines: ROUTING_SHAPE_MAX_LINES,
    maxSmartRoutingWords: ROUTING_SHAPE_MAX_WORDS,
    debt: new Map(),
  };
  let parsed;
  try {
    parsed = readJson(file);
  } catch {
    return config;
  }
  if (!isPlainObject(parsed)) return config;
  if (Number.isInteger(parsed.maxSmartRoutingLines) && parsed.maxSmartRoutingLines > 0) {
    config.maxSmartRoutingLines = parsed.maxSmartRoutingLines;
  }
  if (Number.isInteger(parsed.maxSmartRoutingWords) && parsed.maxSmartRoutingWords > 0) {
    config.maxSmartRoutingWords = parsed.maxSmartRoutingWords;
  }
  if (isPlainObject(parsed.debt)) {
    for (const [key, recorded] of Object.entries(parsed.debt)) {
      if (isRoutingShapeDebtEntry(recorded)) config.debt.set(key, recorded);
    }
  }
  return config;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  ROUTING_SHAPE_CODES,
  isRoutingShapeDebtEntry,
  loadRoutingShapeDebt,
};

#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ d5-connectivity — static structural scan, the D5 hard gate               ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * d5-connectivity.cjs — static structural scan, the D5 hard gate.
 *
 * Runs BEFORE any dispatch and caps the verdict regardless of weighted score.
 * Catches the failure class that makes a skill structurally unusable: a
 * RESOURCE_MAP path that does not exist (dead route), a RESOURCE_MAP key absent
 * from INTENT_SIGNALS (dead intent key), a routed path escaping the skill root,
 * and references present on disk but never reachable from any RESOURCE_MAP entry
 * (orphans — reported, not gated). A router that cannot be parsed at all is the
 * strongest gate failure.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS/REQUIRES
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { parseRouter } = require('./router-replay.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * List every markdown reference under the skill's references/ and assets/ trees.
 *
 * @param {string} skillRoot - Absolute path to the skill root.
 * @returns {string[]} Skill-root-relative paths to each markdown file found.
 */
function listMarkdownRefs(skillRoot) {
  const out = [];
  for (const dir of ['references', 'assets']) {
    const base = path.join(skillRoot, dir);
    if (!fs.existsSync(base)) continue;
    const stack = [base];
    while (stack.length) {
      const cur = stack.pop();
      for (const entry of fs.readdirSync(cur, { withFileTypes: true })) {
        const full = path.join(cur, entry.name);
        if (entry.isDirectory()) stack.push(full);
        else if (entry.isFile() && /\.md$/.test(entry.name)) out.push(path.relative(skillRoot, full));
      }
    }
  }
  return out;
}

// A routed path is contained if it stays within the skill root, or within the
// sibling shared/ dir one level up. Nested mode packets load family-wide docs
// such as the operating register from the parent packet's shared/ dir, so that
// single hop into shared/ is a sanctioned cross-packet resource location, not an
// escape. Separator-bounded checks stop a sibling dir that merely shares the
// root's name prefix from being mistaken for "inside".
function resolveRoutedPath(skillRoot, r) {
  const root = path.resolve(skillRoot);
  const sharedRoot = path.resolve(skillRoot, '..', 'shared');
  const resolved = path.resolve(skillRoot, r);
  const inRoot = resolved === root || resolved.startsWith(root + path.sep);
  const inShared = resolved === sharedRoot || resolved.startsWith(sharedRoot + path.sep);
  return { resolved, escapes: !inRoot && !inShared };
}

/**
 * Statically scan a skill's router connectivity and produce the D5 gate verdict.
 *
 * @param {Object} args - Scan inputs.
 * @param {string} args.skillRoot - Absolute path to the skill root.
 * @returns {{ score:number, gateFailed:boolean, findings:Array,
 *   deadResourcePaths:string[], deadIntentKeys:string[], orphanReferences:string[],
 *   pathEscapes:string[], routerParseable:boolean }}
 */
function scanConnectivity({ skillRoot }) {
  const findings = [];
  const skillMdPath = path.join(skillRoot, 'SKILL.md');
  if (!fs.existsSync(skillMdPath)) {
    // Score mirrors the normal penalty path (100 - one P0 of 40 = 60) so a
    // score-comparison consumer sees the same number for the same one-P0
    // condition; gateFailed is the authoritative verdict signal either way.
    return {
      score: 60, gateFailed: true, routerParseable: false,
      deadResourcePaths: [], deadIntentKeys: [], orphanReferences: [], pathEscapes: [],
      findings: [{ class: 'missing_skill_md', severity: 'P0', detail: 'SKILL.md not found' }],
    };
  }
  const router = parseRouter(fs.readFileSync(skillMdPath, 'utf8'), skillRoot);
  const intentKeys = new Set(Object.keys(router.intentSignals));
  const deadResourcePaths = [];
  const deadIntentKeys = [];
  const pathEscapes = [];
  const routedRefs = new Set();
  // Always-loaded default resources are reachable on every route, so they count
  // as covered (not orphans) even when no intent maps to them.
  for (const r of router.defaultResource || []) routedRefs.add(r);

  for (const [intent, resources] of Object.entries(router.resourceMap)) {
    if (!intentKeys.has(intent)) {
      deadIntentKeys.push(intent);
      findings.push({ class: 'dead_intent_key', severity: 'P1', locus: `RESOURCE_MAP.${intent}`, detail: `${intent} has no INTENT_SIGNALS entry` });
    }
    for (const r of resources) {
      routedRefs.add(r);
      const { resolved, escapes } = resolveRoutedPath(skillRoot, r);
      if (escapes) {
        pathEscapes.push(r);
        findings.push({ class: 'path_escape', severity: 'P0', locus: r, detail: `${r} resolves outside skill root` });
      } else if (!fs.existsSync(resolved)) {
        deadResourcePaths.push(r);
        findings.push({ class: 'dead_resource_path', severity: 'P0', locus: r, detail: `routed path ${r} does not exist` });
      }
    }
  }

  const orphanReferences = listMarkdownRefs(skillRoot).filter((ref) => !routedRefs.has(ref));
  for (const orphan of orphanReferences) {
    findings.push({ class: 'orphan_reference', severity: 'P2', locus: orphan, detail: `${orphan} is not reachable from any RESOURCE_MAP intent` });
  }

  // Hard gate: any P0 (dead path / escape / unparseable). Dead intent keys (P1)
  // and orphans (P2) lower the score but do not gate by themselves.
  const p0 = findings.filter((f) => f.severity === 'P0').length;
  const gateFailed = p0 > 0 || !router.parseable;
  if (!router.parseable) {
    findings.push({ class: 'router_unparseable', severity: 'P0', detail: 'INTENT_SIGNALS / RESOURCE_MAP could not be parsed from SKILL.md' });
  }
  // Score: start at 100, subtract per finding by severity, floor 0.
  const penalty = findings.reduce((acc, f) => acc + ({ P0: 40, P1: 12, P2: 3 }[f.severity] || 0), 0);
  const score = Math.max(0, 100 - penalty);

  return { score, gateFailed, routerParseable: router.parseable, deadResourcePaths, deadIntentKeys, orphanReferences, pathEscapes, findings };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { scanConnectivity, listMarkdownRefs };

if (require.main === module) {
  const args = require('./_args.cjs').parse(process.argv.slice(2));
  if (!args.skill) {
    process.stderr.write('usage: d5-connectivity.cjs --skill <skill-root>\n');
    process.exit(2);
  }
  const res = scanConnectivity({ skillRoot: args.skill });
  process.stdout.write(JSON.stringify(res, null, 2) + '\n');
  process.exit(res.gateFailed ? 1 : 0);
}

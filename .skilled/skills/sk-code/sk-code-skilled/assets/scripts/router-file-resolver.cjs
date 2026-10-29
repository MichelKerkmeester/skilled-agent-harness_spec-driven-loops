// ───────────────────────────────────────────────────────────────────
// MODULE: Machine Router Resolver
// ───────────────────────────────────────────────────────────────────
// A skill declares its machine router once: the intent signals and the resource map a reader
// parses to decide which resources a task loads. That declaration has always sat at the end of
// SKILL.md, so every reader opened that file and decided for itself that the router lived there.
// A skill that keeps the declaration in a sibling ROUTER.md is then indistinguishable from a
// skill with no router at all, and each reader would need its own copy of the new rule.
//
// This module owns that decision once. It names the heading, the two candidate documents and
// the verdict, and it refuses to choose when both documents declare: a reader that picked a
// side would route from one map while the other stayed invisible.
//
// It parses nothing. Router replay and the dead-route scan keep their own extractors, so the
// declaring section is handed back whole.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The heading that opens the machine-router section. The section number is optional, because a
// skill numbers its sections and a standalone document need not. The end-of-line anchor is what
// keeps a hub's `MACHINE-READABLE ROUTER` stage-two map out of this section: that heading carries
// a different word and a parenthesised suffix, so it never matches here and a hub that keeps its
// stage-two map in ROUTER.md keeps resolving through its hub router.
const MACHINE_ROUTER_HEADING_RE = /^##\s+(?:\d+\.\s+)?MACHINE ROUTER\s*$/m;

// A section declares a router when it carries an assignment header rather than prose about one.
// The three names are the heads the replay parser and the dead-route scan read. A default
// resource counts on its own: a mode can select no intent and still route every request through
// its always-loaded preamble, so reading only the two dictionaries would call it routerless.
const DECLARATION_RE = /^\s*(?:INTENT_SIGNALS|RESOURCE_MAP|DEFAULT_RESOURCES?)\s*=/m;

// A fence opens a code sample and closes on a line carrying nothing but its own marker. A
// heading inside one is an example of the grammar rather than a section of the document, so the
// sample stays out of the section a reader parses.
// The per-line test drops the multiline flag: with it, JavaScript also starts a line after a
// Unicode line separator, which the Python scan does not, and the two readers must agree.
const HEADING_LINE_RE = new RegExp(MACHINE_ROUTER_HEADING_RE.source);
const FENCE_OPEN_RE = /^ {0,3}(`{3,}|~{3,})/;
const FENCE_CLOSE_RE = /^ {0,3}(`{3,}|~{3,})[ \t]*\r?$/;

const ROUTER_FILE = 'ROUTER.md';
const SKILL_FILE = 'SKILL.md';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// A missing candidate is a skill that does not declare in that document, not an error. A file
// that exists but cannot be read still throws, so a permission or encoding fault stays loud.
function readDocument(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
}

// The first heading outside any fenced block, or -1. Fence state is tracked line by line because
// a heading inside a code sample is an example of the grammar: slicing from it would hand a
// reader the sample in place of the section, and a real heading below it would never be seen.
function sectionStart(text) {
  let fence = null;
  let offset = 0;
  for (const line of text.split('\n')) {
    if (fence === null) {
      const opener = FENCE_OPEN_RE.exec(line);
      if (opener) fence = opener[1];
      else if (HEADING_LINE_RE.test(line)) return offset;
    } else {
      const closer = FENCE_CLOSE_RE.exec(line);
      if (closer && closer[1][0] === fence[0] && closer[1].length >= fence.length) fence = null;
    }
    offset += line.length + 1;
  }
  return -1;
}

// The section runs from its heading to the end of the file. Stopping at the next heading would
// need a section-end rule that every future author keeps in step, and it buys nothing: a later
// section that carries an assignment header is declaring a router too, which is the case this
// module already refuses to resolve on its own.
function declaredSection(text, source) {
  if (typeof text !== 'string') return null;
  const start = sectionStart(text);
  if (start === -1) return null;
  const section = text.slice(start);
  return DECLARATION_RE.test(section) ? { source, text: section } : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Decide which document holds a skill's machine router.
 *
 * ROUTER.md is probed first, so the migration order is visible in the verdict: a skill that has
 * moved its router answers `router-md`, a skill that has not answers `skill-md`, and a skill that
 * has done both answers `dual-declaration` with no text, because two declarations disagreeing
 * about the same intent is a fault to report rather than a precedence to settle.
 *
 * @param {Object} args - The candidates.
 * @param {string} args.skillRoot - Skill root dir holding SKILL.md and optionally ROUTER.md.
 * @param {string} [args.skillMdText] - SKILL.md text the caller already holds; read from disk when absent.
 * @returns {{verdict: 'router-md'|'skill-md'|'dual-declaration'|'none', source: string|null, text: string|null}} The verdict, the declaring document and its machine-router section.
 */
function resolveMachineRouter({ skillRoot, skillMdText } = {}) {
  if (typeof skillRoot !== 'string' || skillRoot.length === 0) {
    throw new Error('resolveMachineRouter needs a skill root');
  }

  const routerFile = path.resolve(skillRoot, ROUTER_FILE);
  const skillFile = path.resolve(skillRoot, SKILL_FILE);
  const skillText = typeof skillMdText === 'string' ? skillMdText : readDocument(skillFile);

  const fromRouterFile = declaredSection(readDocument(routerFile), routerFile);
  const fromSkillFile = declaredSection(skillText, skillFile);

  if (fromRouterFile && fromSkillFile) return { verdict: 'dual-declaration', source: null, text: null };
  if (fromRouterFile) return { verdict: 'router-md', source: fromRouterFile.source, text: fromRouterFile.text };
  if (fromSkillFile) return { verdict: 'skill-md', source: fromSkillFile.source, text: fromSkillFile.text };
  return { verdict: 'none', source: null, text: null };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { resolveMachineRouter, MACHINE_ROUTER_HEADING_RE, DECLARATION_RE };

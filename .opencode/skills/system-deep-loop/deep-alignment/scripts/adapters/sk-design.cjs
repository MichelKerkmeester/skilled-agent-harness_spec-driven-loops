#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ sk-design.cjs — deep-alignment sk-design (STATIC v1) authority adapter   ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Implements the three-method adapter contract for the sk-design           ║
// ║ authority: discover(scope), standardSource(authority), check(artifact,   ║
// ║ rules). Shape copied from the reference adapter (sk-doc.cjs).            ║
// ║ STATIC-ONLY: reads DESIGN.md/tokens.json only. Never                     ║
// ║ renders, never invokes design-md-generator's Playwright pipeline, never  ║
// ║ drives chrome-devtools. Live-render audits belong to a separate          ║
// ║ live-render adapter, not this one.                                       ║
// ║                                                                          ║
// ║ Full specification: ../../references/adapters/sk_design_adapter.md       ║
// ║ Suppression list: ../../references/adapters/sk_design_known_deviations.md║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

/**
 * sk-design.cjs — checks DESIGN.md structural conformance against
 * design_md_format.md's Style Reference schema, plus tokens.json
 * parse-validity, plus a caller-supplied reasoning-agent audit-rubric layer.
 * Reads files; never renders, never invokes the extraction pipeline.
 *
 * discover(scope) takes the real, live scope shape from
 * ../../references/discover_contract.md §3 / ../../references/lane_config_schema.md §5.
 * sk-design's registered artifact-class is `designs`, which pairs with
 * `paths`/`globs` scopes (a `branchRange` scope resolves to an empty result
 * — see discover()'s own comment for why).
 *
 * Module usage:
 *   const adapter = require('./sk-design.cjs');
 *   const { artifacts, nodes } = adapter.discover({ type: 'paths', values: ['DESIGN.md'] });
 *   const rules = adapter.standardSource('sk-design');
 *   const findings = adapter.check(artifacts[0], rules);
 *
 * CLI usage (manual dry-run, no engine wiring required):
 *   node sk-design.cjs discover [--glob] <scope-value...>
 *   node sk-design.cjs check <artifact-path>
 *   node sk-design.cjs standard-source
 *
 * Examples:
 *   node sk-design.cjs discover .opencode/skills/sk-design/design-md-generator/references/examples
 *   node sk-design.cjs check .opencode/skills/sk-design/design-md-generator/references/examples/vercel/DESIGN.md
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Mirrors sk-doc.cjs's own SKILLS_DIR computation (4 levels up from a
// mode-packet's scripts/<subdir>/*.cjs file).
const SKILLS_DIR = path.resolve(__dirname, '..', '..', '..', '..'); // .opencode/skills
const REPO_ROOT = path.resolve(SKILLS_DIR, '..', '..'); // repo root

const SK_DESIGN_DIR = path.join(SKILLS_DIR, 'sk-design');
const DESIGN_MD_FORMAT_MD = path.join(SK_DESIGN_DIR, 'design-md-generator', 'references', 'design_md_format.md');
const DESIGN_TOKEN_VOCAB_MD = path.join(SK_DESIGN_DIR, 'shared', 'design_token_vocabulary.md');
const AUDIT_CONTRACT_MD = path.join(SK_DESIGN_DIR, 'design-audit', 'references', 'audit_contract.md');
const ACCESSIBILITY_PERFORMANCE_MD = path.join(SK_DESIGN_DIR, 'design-audit', 'references', 'accessibility_performance.md');
const ANTI_PATTERNS_PRODUCTION_MD = path.join(SK_DESIGN_DIR, 'design-audit', 'references', 'anti_patterns_production.md');
const AI_FINGERPRINT_TELLS_MD = path.join(SK_DESIGN_DIR, 'design-audit', 'references', 'ai_fingerprint_tells.md');
const KNOWN_DEVIATIONS_MD = path.resolve(__dirname, '..', '..', 'references', 'adapters', 'sk_design_known_deviations.md');

// Same excluded-segments set sk-doc.cjs ports from validate_document.py:54-64,
// reused here for consistency across every deep-alignment discover() walker.
const EXCLUDED_PATH_SEGMENTS = new Set([
  '.pytest_cache', 'node_modules', '__pycache__', '.git', 'vendor', 'dist', 'build', '.venv', 'venv',
]);

// The two static-artifact basenames this authority discovers, per
// spec.md/plan.md's Architecture section ("resolves a lane's scope into
// DESIGN.md / tokens.json artifact paths").
const DESIGN_ARTIFACT_BASENAMES = new Set(['DESIGN.md', 'tokens.json']);

// Ported from design_md_format.md's "Section presence" table — the 11 rows
// marked "yes" (hard-required). Imagery ("conditional") and Header+intro are
// checked separately with softer semantics — see checkDesignDoc()'s own
// comments and sk_design_adapter.md Section 3 "Required-Heading Scope".
const REQUIRED_HEADINGS = [
  { match: /^##\s+Tokens\s+—\s+Colors/m, label: 'Tokens — Colors' },
  { match: /^##\s+Tokens\s+—\s+Typography/m, label: 'Tokens — Typography' },
  { match: /^##\s+Tokens\s+—\s+Spacing\s+&\s+Shapes/m, label: 'Tokens — Spacing & Shapes' },
  { match: /^##\s+Components/m, label: 'Components' },
  { match: /^##\s+Do'?s\s+and\s+Don'?ts/m, label: "Do's and Don'ts" },
  { match: /^##\s+Surfaces/m, label: 'Surfaces' },
  { match: /^##\s+Elevation/m, label: 'Elevation' },
  { match: /^##\s+Layout/m, label: 'Layout' },
  { match: /^##\s+Agent\s+Prompt\s+Guide/m, label: 'Agent Prompt Guide' },
  { match: /^##\s+Similar\s+Brands/m, label: 'Similar Brands' },
  { match: /^##\s+Quick\s+Start/m, label: 'Quick Start' },
];

// Cardinal rule 4 (design_md_format.md Section 0): never print the
// extractor's internal CSS var names. These follow a distinctive
// `--_<name>---<name>--<n>` shape a hand-authored doc never produces; a
// match means raw extractor output leaked into the authored doc.
const EXTRACTOR_INTERNAL_VAR_RE = /--_[a-zA-Z0-9-]+/;

// Cardinal rule 4 + Section 6: "NEVER 'Variant-1'" as a component name.
const PLACEHOLDER_VARIANT_RE = /^###\s+Variant-\d+\s*$/m;

// Cardinal rule 4: raw frequency dumps, e.g. design_md_format.md's own
// illustrative example "border 9685, text 4258" — a bare extractor-category
// word (never a hyphenated compound like border-radius/font-weight) directly
// followed by a 3+-digit count with NO css-unit suffix, repeated at least
// once via a comma. Deliberately narrow (closed word set, no-unit
// requirement) rather than a broad "word number, word number" pattern: an
// earlier, broader version of this regex false-positived on real, legitimate
// CSS-value prose ("weight 400, border-radius 9999px, padding 8px 12px" in
// the vercel example doc) during this adapter's own dry-run against real
// files. Calibrated for low false-positive risk over broad recall, since
// design_md_format.md's own example is the only confirmed real shape this
// adapter has evidence for — see sk_design_adapter.md Section 4.2.
const FREQUENCY_DUMP_RE = /\b(?:border|text|background|shadow|color|spacing|radius|font)\s+\d{3,}(?!\s*(?:px|em|rem|%|s|ms|deg|vh|vw))\b(?:,\s*(?:border|text|background|shadow|color|spacing|radius|font)\s+\d{3,}(?!\s*(?:px|em|rem|%|s|ms|deg|vh|vw))\b){1,}/;

// Quick Start §14's own color-consistency rule: `--color-<slug>: <hex>;`
// declarations inside the CSS Custom Properties block.
const QUICK_START_COLOR_DECL_RE = /--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6});/g;

// Tokens — Colors table rows: `| Name | \`#hex\` | \`--token\` | Role |`.
const BACKTICKED_HEX_RE = /`(#[0-9a-fA-F]{6})`/g;

// ─────────────────────────────────────────────────────────────────────────────
// 3. DISCOVER(SCOPE)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Defense-in-depth repo-root containment check — scripts/scoping.cjs's own
 * validateScope() already enforces this before a lane reaches
 * DISCOVER; this is not the primary enforcement point. Mirrors sk-doc.cjs's
 * isInsideRepoRoot() exactly.
 * @param {string} absPath
 * @returns {boolean}
 */
function isInsideRepoRoot(absPath) {
  const rel = path.relative(REPO_ROOT, absPath);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

function globToRegExp(glob) {
  let reStr = '';
  for (let i = 0; i < glob.length; i += 1) {
    const c = glob[i];
    if (c === '*' && glob[i + 1] === '*') {
      reStr += '.*';
      i += 1;
      if (glob[i + 1] === '/') i += 1;
    } else if (c === '*') {
      reStr += '[^/]*';
    } else if (c === '?') {
      reStr += '[^/]';
    } else if (/[.+^${}()|[\]\\]/.test(c)) {
      reStr += `\\${c}`;
    } else {
      reStr += c;
    }
  }
  return new RegExp(`^${reStr}$`);
}

function globWalkRoot(glob) {
  const wildcardIndex = glob.search(/[*?]/);
  if (wildcardIndex === -1) return glob;
  const prefix = glob.slice(0, wildcardIndex);
  const lastSlash = prefix.lastIndexOf('/');
  return lastSlash === -1 ? '.' : prefix.slice(0, lastSlash);
}

function addIfNew(absPath, seen, out) {
  const relPath = path.relative(REPO_ROOT, absPath).split(path.sep).join('/');
  if (seen.has(relPath)) return;
  seen.add(relPath);
  out.push(relPath);
}

/**
 * Walk a scope entry collecting DESIGN.md/tokens.json files — same recursive
 * shape as sk-doc.cjs's collectMarkdownFiles(), generalized to this
 * authority's two artifact basenames instead of a blanket *.md filter.
 */
function collectDesignFiles(scopeEntry, seen, out) {
  const resolved = path.resolve(REPO_ROOT, scopeEntry);
  if (!isInsideRepoRoot(resolved)) return;

  let stat;
  try {
    stat = fs.statSync(resolved);
  } catch (err) {
    return; // Non-existent path resolves to zero-coverage, not an error (spec.md Data Boundaries).
  }

  if (stat.isFile()) {
    if (DESIGN_ARTIFACT_BASENAMES.has(path.basename(resolved))) addIfNew(resolved, seen, out);
    return;
  }
  if (!stat.isDirectory()) return;

  let entries;
  try {
    entries = fs.readdirSync(resolved, { withFileTypes: true });
  } catch (err) {
    return;
  }
  for (const dirent of entries) {
    const entryPath = path.join(resolved, dirent.name);
    if (dirent.isDirectory()) {
      if (EXCLUDED_PATH_SEGMENTS.has(dirent.name)) continue;
      collectDesignFiles(path.relative(REPO_ROOT, entryPath), seen, out);
    } else if (dirent.isFile() && DESIGN_ARTIFACT_BASENAMES.has(dirent.name)) {
      addIfNew(entryPath, seen, out);
    }
  }
}

function discoverPaths(values) {
  const seen = new Set();
  const out = [];
  for (const value of values) collectDesignFiles(value, seen, out);
  return out;
}

function discoverGlobs(values) {
  const positive = [];
  const negative = [];
  for (const value of values) {
    if (typeof value === 'string' && value.startsWith('!')) negative.push(globToRegExp(value.slice(1)));
    else positive.push(value);
  }
  const seen = new Set();
  const candidates = [];
  for (const pattern of positive) collectDesignFiles(globWalkRoot(pattern), seen, candidates);
  const positiveRes = positive.map(globToRegExp);
  return candidates.filter((relPath) => (
    positiveRes.some((re) => re.test(relPath)) && !negative.some((re) => re.test(relPath))
  ));
}

function artifactKindForPath(relPath) {
  const basename = path.basename(relPath);
  if (basename === 'DESIGN.md') return 'design-doc';
  if (basename === 'tokens.json') return 'tokens';
  return null;
}

function discoverDesignArtifacts(relPaths) {
  const artifacts = [];
  const nodes = [];
  for (const relPath of relPaths) {
    const artifactKind = artifactKindForPath(relPath);
    if (!artifactKind) continue;
    artifacts.push({ path: relPath, artifactKind });
    nodes.push({
      id: `file:${relPath}`,
      kind: 'FILE',
      name: relPath,
      metadata: { authority: 'sk-design', artifactClass: 'designs', artifactKind },
    });
  }
  return { artifacts, nodes };
}

/**
 * discover(scope) -> { artifacts, nodes }, for the sk-design authority's
 * `designs` artifact-class.
 *
 * @param {{type:'paths'|'globs', values:string[]}|{type:'branchRange', from:string, to:string}} scope
 * @returns {{artifacts:Array<{path:string, artifactKind:'design-doc'|'tokens'}>, nodes:Array<Object>}}
 */
function discover(scope) {
  if (!scope || typeof scope !== 'object' || typeof scope.type !== 'string') {
    throw new Error('discover(scope): scope must be an object with a "type" field (see discover_contract.md Section 3)');
  }

  let relPaths;
  if (scope.type === 'paths') {
    relPaths = discoverPaths(Array.isArray(scope.values) ? scope.values : []);
  } else if (scope.type === 'globs') {
    relPaths = discoverGlobs(Array.isArray(scope.values) ? scope.values : []);
  } else if (scope.type === 'branchRange') {
    // sk-design's only registered artifact-class is `designs`
    // (scripts/scoping.cjs's AUTHORITY_ARTIFACT_CLASSES), which pairs with
    // paths/globs scopes (lane_config_schema.md Section 4) — a DESIGN.md
    // file has no git-history-range meaning for this authority. Mirrors
    // sk-doc.cjs's own branchRange -> empty-result treatment.
    relPaths = [];
  } else {
    throw new Error(`discover(scope): unknown scope.type "${scope.type}"`);
  }

  return discoverDesignArtifacts(relPaths);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. KNOWN-DEVIATION SUPPRESSION
// ─────────────────────────────────────────────────────────────────────────────

function loadKnownDeviations() {
  let raw;
  try {
    raw = fs.readFileSync(KNOWN_DEVIATIONS_MD, 'utf8');
  } catch (err) {
    return [];
  }
  const match = raw.match(/```json\n([\s\S]*?)\n```/);
  if (!match) return [];
  try {
    const parsed = JSON.parse(match[1]);
    return Array.isArray(parsed.deviations) ? parsed.deviations : [];
  } catch (err) {
    return [];
  }
}

function matchesDeviation(finding, deviation) {
  if (!Array.isArray(deviation.matchTypes) || deviation.matchTypes.length === 0) return false;
  if (!deviation.matchTypes.includes(finding.type)) return false;
  if (Array.isArray(deviation.matchArtifactKinds) && !deviation.matchArtifactKinds.includes(finding.artifactKind)) return false;
  return true;
}

/**
 * Filter findings through the known-deviation list. A match suppresses only
 * that finding — never the whole artifact (spec.md's "Data Boundaries" edge
 * case, same invariant as sk-doc.cjs's suppressKnownDeviations()).
 */
function suppressKnownDeviations(findings, knownDeviations) {
  if (!Array.isArray(knownDeviations) || knownDeviations.length === 0) return findings;
  return findings.filter((finding) => !knownDeviations.some((dev) => matchesDeviation(finding, dev)));
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. STANDARDSOURCE(AUTHORITY)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * standardSource(authority) -> {rules, ...}, for the sk-design authority
 * (STATIC v1 only).
 * @param {string} authority - Must be 'sk-design'.
 * @returns {Object}
 */
function standardSource(authority) {
  if (authority !== 'sk-design') {
    throw new Error(`sk-design adapter standardSource() called with unsupported authority "${authority}"`);
  }
  return {
    authority: 'sk-design',
    determinism: 'hybrid', // Section 4.3: structural checks are deterministic; audit-rubric judgment is reasoning-agent (mirrors sk-doc's two-layer shape)
    scopeBoundary: 'static-only-v1', // live-render belongs to a separate live-render adapter, not this one — see sk_design_adapter.md Section 1
    rules: {
      structuralFormat: { doc: 'design_md_format.md', path: DESIGN_MD_FORMAT_MD },
      tokenVocabulary: { doc: 'design_token_vocabulary.md', path: DESIGN_TOKEN_VOCAB_MD },
      auditContract: { doc: 'audit_contract.md', path: AUDIT_CONTRACT_MD },
      accessibilityPerformance: {
        doc: 'accessibility_performance.md', path: ACCESSIBILITY_PERFORMANCE_MD,
        note: 'reasoning-agent-layer input only in v1 -- contrast/touch-target thresholds need a rendered surface or a stated color-pairing this adapter cannot mechanically derive from DESIGN.md alone. See sk_design_adapter.md Section 4.4.',
      },
      antiPatternsProduction: { doc: 'anti_patterns_production.md', path: ANTI_PATTERNS_PRODUCTION_MD },
      aiFingerprintTells: {
        doc: 'ai_fingerprint_tells.md', path: AI_FINGERPRINT_TELLS_MD,
        note: 'reasoning-agent-layer input only in v1 -- see sk_design_adapter.md Section 4.4.',
      },
    },
    knownDeviations: loadKnownDeviations(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CHECK(ARTIFACT, RULES) — STRUCTURAL CONFORMANCE (DETERMINISTIC)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Slice out one `##`-level section's body (from just after the matched
 * heading line to just before the next `##`-level heading, or end of
 * string). Deliberately index-based rather than a single "match up to the
 * next heading or end-of-string" regex: an earlier version used a
 * `(?=\n##\s|\n?$)` lookahead, which broke silently — `$` in multiline mode
 * matches immediately before *any* `\n` (including the one ending the
 * heading line itself), not only at the true end of string, so `\n?$`
 * matched the heading line's own end and the non-greedy capture returned an
 * empty string on every call. Caught by dry-running this adapter's
 * Quick-Start-consistency check against a deliberately mismatched synthetic
 * doc while building it (a real color-hex mismatch produced zero findings
 * instead of the expected one) — see sk_design_adapter.md Section 4.1.
 * @param {string} text
 * @param {RegExp} headingRe - Must NOT be global (no 'g' flag).
 * @returns {string|null}
 */
function extractSection(text, headingRe) {
  const headingMatch = text.match(headingRe);
  if (!headingMatch) return null;
  const startIdx = headingMatch.index + headingMatch[0].length;
  const rest = text.slice(startIdx);
  const nextHeadingMatch = rest.match(/\n##\s/);
  const endIdx = nextHeadingMatch ? nextHeadingMatch.index : rest.length;
  return rest.slice(0, endIdx);
}

function checkQuickStartConsistency(text) {
  const findings = [];
  const colorsSection = extractSection(text, /##\s+Tokens\s+—\s+Colors/m);
  const quickStartSection = extractSection(text, /##\s+Quick\s+Start/m);
  if (!colorsSection || !quickStartSection) return findings; // reported separately by the required-heading check

  const tableHexes = new Set();
  let hexMatch;
  const hexRe = new RegExp(BACKTICKED_HEX_RE.source, 'g');
  while ((hexMatch = hexRe.exec(colorsSection)) !== null) {
    tableHexes.add(hexMatch[1].toLowerCase());
  }

  const declRe = new RegExp(QUICK_START_COLOR_DECL_RE.source, 'g');
  let declMatch;
  let sawAnyDecl = false;
  while ((declMatch = declRe.exec(quickStartSection)) !== null) {
    sawAnyDecl = true;
    const slug = declMatch[1];
    const hex = declMatch[2].toLowerCase();
    if (!tableHexes.has(hex)) {
      findings.push({
        type: 'quick-start-color-drift', severity: 'P1',
        message: `Quick Start declares --color-${slug}: ${hex}, which does not match any hex in the Tokens — Colors table (design_md_format.md Section 14's own consistency rule).`,
      });
    }
  }
  if (!sawAnyDecl) {
    findings.push({
      type: 'quick-start-missing-css-block', severity: 'P1',
      message: 'Quick Start section has no --color-<slug>: <hex>; CSS Custom Properties declarations (design_md_format.md Section 14 requires this block; "it is not optional").',
    });
  }
  return findings;
}

function checkBannedPatterns(text) {
  const findings = [];
  if (EXTRACTOR_INTERNAL_VAR_RE.test(text)) {
    findings.push({
      type: 'extractor-internal-var-leak', severity: 'P1',
      message: 'Extractor-internal CSS var name (e.g. --_color-primitives---neutral--1400 shape) found in the doc -- design_md_format.md Cardinal rule 4 bans this; the doc must use named --color-<slug> tokens instead.',
    });
  }
  if (PLACEHOLDER_VARIANT_RE.test(text)) {
    findings.push({
      type: 'placeholder-variant-name', severity: 'P1',
      message: 'A component is named "Variant-N" -- design_md_format.md Section 6 requires functional naming (Primary CTA, Ghost Link, etc.) or folding into the nearest named component.',
    });
  }
  if (FREQUENCY_DUMP_RE.test(text)) {
    findings.push({
      type: 'raw-frequency-dump', severity: 'P1',
      message: 'A raw frequency-count-shaped line (e.g. "border 9685, text 4258") was found -- design_md_format.md Cardinal rule 4 bans printing raw frequency dumps; frequency should decide prominence, not appear in the doc.',
    });
  }
  return findings;
}

function checkDesignDoc(artifact) {
  const absPath = path.resolve(REPO_ROOT, artifact.path);
  let text;
  try {
    text = fs.readFileSync(absPath, 'utf8');
  } catch (err) {
    return [makeFinding({ severity: 'P1', type: 'adapter-error', artifact, sourceTool: 'fs.readFileSync', message: `Could not read DESIGN.md: ${err.message}` })];
  }

  const findings = [];

  if (!/^#\s+.+/m.test(text)) {
    findings.push(makeFinding({
      severity: 'P0', type: 'missing-required-section', artifact, sourceTool: 'sk-design.cjs structural check',
      message: 'No H1 file header found (design_md_format.md Section 1 requires "# <Brand> — Style Reference").',
    }));
  }

  for (const heading of REQUIRED_HEADINGS) {
    if (!heading.match.test(text)) {
      findings.push(makeFinding({
        severity: 'P0', type: 'missing-required-section', artifact, sourceTool: 'sk-design.cjs structural check',
        message: `Required section "## ${heading.label}" not found (design_md_format.md Section presence table).`,
      }));
    }
  }

  // Imagery is marked "conditional" in the Section-presence table (Section
  // 10: "no imagery signal — stamp ABSENT"), so an absent heading is only a
  // soft signal unless there is also no stamp-like phrase anywhere in the
  // doc -- see sk_design_adapter.md Section 3 for the precise rationale.
  if (!/^##\s+Imagery/m.test(text) && !/no (meaningful )?imagery/i.test(text)) {
    findings.push(makeFinding({
      severity: 'P2', type: 'imagery-section-unclear', artifact, sourceTool: 'sk-design.cjs structural check',
      message: 'No "## Imagery" heading and no ABSENT-style imagery stamp found -- confirm this is a genuine no-imagery-signal case, not an omission (design_md_format.md Section 10, conditional).',
    }));
  }

  for (const drift of checkQuickStartConsistency(text)) {
    findings.push(makeFinding({ severity: drift.severity, type: drift.type, artifact, sourceTool: 'sk-design.cjs Quick-Start consistency check', message: drift.message }));
  }
  for (const banned of checkBannedPatterns(text)) {
    findings.push(makeFinding({ severity: banned.severity, type: banned.type, artifact, sourceTool: 'sk-design.cjs banned-pattern check', message: banned.message }));
  }

  return findings;
}

function checkTokensJsonArtifact(artifact) {
  const absPath = path.resolve(REPO_ROOT, artifact.path);
  let raw;
  try {
    raw = fs.readFileSync(absPath, 'utf8');
  } catch (err) {
    return [makeFinding({ severity: 'P1', type: 'adapter-error', artifact, sourceTool: 'fs.readFileSync', message: `Could not read tokens.json: ${err.message}` })];
  }
  try {
    JSON.parse(raw);
  } catch (err) {
    return [makeFinding({ severity: 'P1', type: 'could-not-validate', artifact, sourceTool: 'JSON.parse', message: `tokens.json is not valid JSON: ${err.message}` })];
  }
  // Deeper per-field token-shape validation is out of this v1 adapter's
  // scope -- see sk_design_adapter.md Section 4.3's documented limit; this
  // check only confirms the file is well-formed JSON, not that its shape
  // matches design-md-generator's internal token schema.
  return [];
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. CHECK(ARTIFACT, RULES) — AUDIT RUBRIC (REASONING-AGENT)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reasoning-agent audit-rubric sub-check. Mirrors sk-doc.cjs's
 * checkRealityAlignment() shape exactly (sk_doc_adapter.md Section 4.2):
 * this function does NOT perform the semantic judgment itself (deciding
 * whether a DESIGN.md's Similar-Brands inference is credible, or whether a
 * component name reads as generic AI slop, is a reasoning act no
 * deterministic script can invent). It only translates ALREADY-JUDGED
 * findings (caller-supplied via options.verifiedFindings) into the return
 * shape, and REQUIRES both a rubric `dimension` and a `citation` per
 * plan.md's own Risk mitigation ("Require every finding to cite the
 * specific audit_contract.md or ai_fingerprint_tells.md dimension violated
 * ... not a bare 'looks off' verdict"). No verifiedFindings supplied -> no
 * reasoning-agent findings -- never an invented one.
 * @param {Object} artifact
 * @param {{verifiedFindings?: Array<{dimension:string, citation:string, severity?:string, note?:string}>}} [options]
 * @returns {Array<Object>} Findings, all tagged layer:'reasoning-agent'.
 */
function checkAuditRubric(artifact, options) {
  const verifiedFindings = (options && Array.isArray(options.verifiedFindings)) ? options.verifiedFindings : [];
  const findings = [];
  for (const vf of verifiedFindings) {
    if (!vf || !vf.dimension || !vf.citation) continue; // never assert without a cited rubric dimension
    findings.push(makeFinding({
      severity: vf.severity || 'P2',
      type: 'audit-rubric-finding',
      artifact,
      sourceTool: 'reasoning-agent audit (caller-supplied)',
      message: vf.note ? `${vf.dimension}: ${vf.note}` : `${vf.dimension} finding (see citation)`,
      detail: { dimension: vf.dimension, citation: vf.citation, note: vf.note || null },
      layerOverride: 'reasoning-agent',
    }));
  }
  return findings;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. CHECK(ARTIFACT, RULES) — SHARED
// ─────────────────────────────────────────────────────────────────────────────

function makeFinding({ severity, type, artifact, sourceTool, message, detail, layerOverride }) {
  return {
    severity,
    type,
    subcheck: artifact.artifactKind === 'design-doc' ? 'structural-conformance' : 'tokens-parse-validity',
    layer: layerOverride || 'deterministic',
    message,
    artifactId: artifact.path,
    artifactPath: artifact.path,
    artifactKind: artifact.artifactKind,
    sourceTool,
    detail: detail === undefined ? null : detail,
  };
}

function normalizeArtifact(artifact) {
  if (typeof artifact === 'string') {
    const absPath = path.isAbsolute(artifact) ? artifact : path.resolve(REPO_ROOT, artifact);
    if (!isInsideRepoRoot(absPath)) {
      throw new Error(`check(): artifact path "${artifact}" resolves outside the repo root`);
    }
    const relPath = path.relative(REPO_ROOT, absPath).split(path.sep).join('/');
    const artifactKind = artifactKindForPath(relPath);
    if (!artifactKind) {
      throw new Error(`check(): artifact "${artifact}" is not a DESIGN.md or tokens.json file`);
    }
    return { path: relPath, artifactKind };
  }
  if (artifact && typeof artifact === 'object' && typeof artifact.path === 'string') {
    return artifact.artifactKind ? artifact : { ...artifact, artifactKind: artifactKindForPath(artifact.path) };
  }
  throw new Error('check(artifact, rules): artifact must be a path string or a discover()-shaped object with a "path" field');
}

/**
 * check(artifact, rules) -> findings, for the sk-design authority (STATIC
 * v1). Two sub-checks: structural conformance (deterministic) and audit
 * rubric (reasoning-agent, VERIFY-FIRST-enforcing per sk-doc's precedent),
 * then known-deviation suppression. See sk_design_adapter.md Section 4.
 * @param {string|Object} artifact - A discover()-shaped object, or a bare path string.
 * @param {Object} [rules] - standardSource('sk-design') output; knownDeviations reloaded if omitted.
 * @param {{verifiedFindings?: Array<Object>}} [options] - Caller-supplied audit-rubric evidence.
 * @returns {Array<Object>} Findings after suppression.
 */
function check(artifact, rules, options) {
  const normalized = normalizeArtifact(artifact);
  const knownDeviations = (rules && Array.isArray(rules.knownDeviations)) ? rules.knownDeviations : loadKnownDeviations();

  let deterministicFindings;
  if (normalized.artifactKind === 'design-doc') {
    deterministicFindings = checkDesignDoc(normalized);
  } else if (normalized.artifactKind === 'tokens') {
    deterministicFindings = checkTokensJsonArtifact(normalized);
  } else {
    deterministicFindings = [makeFinding({ severity: 'P1', type: 'adapter-error', artifact: normalized, sourceTool: 'sk-design.cjs', message: `Unknown artifactKind '${normalized.artifactKind}' -- expected 'design-doc' or 'tokens'.` })];
  }

  const reasoningFindings = checkAuditRubric(normalized, options);
  const findings = deterministicFindings.concat(reasoningFindings);
  return suppressKnownDeviations(findings, knownDeviations);
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. CLI ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

function printJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function runCli(argv) {
  const [subcommand, ...rest] = argv;

  if (subcommand === 'discover') {
    const isGlob = rest[0] === '--glob';
    const values = isGlob ? rest.slice(1) : rest;
    if (values.length === 0) {
      process.stderr.write('Usage: sk-design.cjs discover [--glob] <scope-value...>\n');
      process.exitCode = 1;
      return;
    }
    printJson(discover({ type: isGlob ? 'globs' : 'paths', values }));
    return;
  }

  if (subcommand === 'check') {
    const target = rest[0];
    if (!target) {
      process.stderr.write('Usage: sk-design.cjs check <artifact-path>\n');
      process.exitCode = 1;
      return;
    }
    printJson(check(target, standardSource('sk-design')));
    return;
  }

  if (subcommand === 'standard-source') {
    printJson(standardSource('sk-design'));
    return;
  }

  process.stderr.write('Usage: sk-design.cjs <discover|check|standard-source> [args...]\n');
  process.exitCode = 1;
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  discover,
  standardSource,
  check,
  checkDesignDoc,
  checkTokensJsonArtifact,
  checkQuickStartConsistency,
  checkBannedPatterns,
  loadKnownDeviations,
};

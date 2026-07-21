#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ validate-compiled-routing-scenarios — content gate for the compiled       ║
// ║ routing scenario matrix (non-frozen sibling of the scorer trio)           ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * validate-compiled-routing-scenarios.cjs — the content admission gate for a
 * hub's compiled-routing scenario matrix.
 *
 * The frozen playbook loader admits an id-only scenario: a file whose only
 * assertion is an `id`, with null pass-criteria and no typed gold, loads clean
 * and then scores as vacuous "pass" forever. That loader is SHA-256-pinned and
 * must never change, so the stricter admission contract lives here, in a
 * non-frozen sibling that only READS the same files. This validator hard-rejects
 * an id-only or null-criteria scenario BEFORE it reaches the loader, and it
 * additionally requires the full compiled-routing evidence contract that proves a
 * scenario is really exercising compiled serving authority rather than silently
 * scoring legacy routing.
 *
 * A compiled-routing scenario MUST carry, in its YAML frontmatter:
 *   - id, expected_intent, expected_resources, expected_workflow_mode
 *   - typed expected_leaf_resources ({ workflow_mode, leaf_resource_id } pairs),
 *     each leaf contained under a packet root and (when the hub ships a
 *     leaf-manifest.json) resolving to a real manifest leaf
 *   - stage (routing | holdout | negative)
 *   - the seven-field evidence contract, every field present and non-null:
 *       evidence_compiled_route     (the compiled destination route)
 *       evidence_serving_authority  (the serving-status the run must observe)
 *       evidence_flag_state         (the compiled-routing flag state)
 *       evidence_fallback_cause     (the fall-back cause / cause code)
 *       evidence_manifest_digest    (the activation manifest identity)
 *       evidence_model              (the routing plane's model)
 *       evidence_reasoning_effort   (the routing plane's reasoning effort)
 *   - a parseable exact prompt in the body
 *   - a non-empty pass/fail-criteria section
 *
 * A holdout scenario has one extra rule: none of its own route strings
 * (expected_workflow_mode, the compiled-route's mode segment, or any typed
 * pair's workflow mode) may appear verbatim in its prompt text, so the holdout
 * stays a real generalization probe rather than a fitted one.
 *
 * The verdict vocabulary is the single PASS / FAIL / SKIP enum shared across the
 * content validator, the topology validator, the cutover executor, and the LUNA
 * acceptance stage. It never edits the frozen loader or either other frozen
 * scorer file.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const contract = require('./lib/leaf-resource-contract.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The unified verdict enum, shared across every stage of the compiled-routing
// coverage surface. PARTIAL/READY (the manual-testing-playbook template's older
// vocabulary) collapse into this set: a partial result is a FAIL until it is
// whole, and a not-applicable scenario is a SKIP.
const VERDICT = Object.freeze({ PASS: 'PASS', FAIL: 'FAIL', SKIP: 'SKIP' });

// The seven evidence-contract fields, without the `evidence_` frontmatter
// prefix. Every one must be present and non-null for a scenario to be admitted.
const EVIDENCE_FIELDS = Object.freeze([
  'compiled_route',
  'serving_authority',
  'flag_state',
  'fallback_cause',
  'manifest_digest',
  'model',
  'reasoning_effort',
]);

const VALID_STAGES = Object.freeze(new Set(['routing', 'holdout', 'negative']));

// ─────────────────────────────────────────────────────────────────────────────
// 3. FRONTMATTER PARSING
// ─────────────────────────────────────────────────────────────────────────────

function readFileSafe(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); } catch { return null; }
}

function extractFrontmatter(text) {
  const m = /^---\n([\s\S]*?)\n---/.exec(text || '');
  return m ? m[1] : null;
}

function bodyAfterFrontmatter(text) {
  const m = /^---\n[\s\S]*?\n---\n?([\s\S]*)$/.exec(text || '');
  return m ? m[1] : String(text || '');
}

// Single-line scalar, quote-tolerant, matching the loader's own convention so a
// value parses identically here and in the frozen loader.
function scalar(block, key) {
  const m = new RegExp(`(?:^|\\n)[ \\t]*${key}:[ \\t]*["']?([^"'\\n]+?)["']?[ \\t]*(?:\\n|$)`).exec(block);
  return m ? m[1].trim() : null;
}

// A frontmatter list in either inline (`key: [a, b]`) or dash-block form.
function list(block, key) {
  const inline = new RegExp(`(?:^|\\n)[ \\t]*${key}:[ \\t]*\\[(.*?)\\]`).exec(block);
  if (inline) {
    return inline[1].split(',').map((s) => s.trim().replace(/^["'\`]+|["'\`]+$/g, '')).filter(Boolean);
  }
  const dash = new RegExp(`(?:^|\\n)[ \\t]*${key}:[ \\t]*\\n((?:[ \\t]*-[ \\t]*.+\\n?)+)`).exec(block);
  if (!dash) return null;
  return dash[1].split('\n').map((l) => l.replace(/^[ \t]*-[ \t]*/, '').trim().replace(/^["'\`]+|["'\`]+$/g, '')).filter(Boolean);
}

// The typed-gold pair list, in the same fixed two-line shape the frozen loader
// and the topology validator both parse, plus the explicit empty-list form.
function leafPairs(block) {
  if (/(?:^|\n)[ \t]*expected_leaf_resources:[ \t]*\[\][ \t]*(?:\n|$)/.test(block)) {
    return { present: true, pairs: [] };
  }
  const m = /(?:^|\n)[ \t]*expected_leaf_resources:[ \t]*\n((?:[ \t]*-[ \t]*workflow_mode:.*\n[ \t]*leaf_resource_id:.*\n?)+)/.exec(block);
  if (!m) return { present: false, pairs: null };
  const pairs = [];
  const re = /-[ \t]*workflow_mode:[ \t]*["']?([^"'\n]+?)["']?[ \t]*\n[ \t]*leaf_resource_id:[ \t]*["']?([^"'\n]+?)["']?[ \t]*(?:\n|$)/g;
  let entry;
  while ((entry = re.exec(m[1])) !== null) {
    pairs.push({ workflowMode: entry[1].trim(), leafResourceId: entry[2].trim() });
  }
  return { present: true, pairs };
}

// Body prompt: the fenced `**Exact prompt**` block (the canonical shape) or an
// inline `Prompt:` line, mirroring what the frozen loader accepts.
function parsePrompt(body) {
  const fenced = /\*\*(?:Exact prompt|Realistic user prompt)\*\*:?\s*\n+```[a-z]*\n([\s\S]*?)\n```/i.exec(body);
  if (fenced) return fenced[1].trim();
  const inline = /(?:^|\n)\s*(?:[-*]\s+)?(?:\*\*)?Prompt(?:\*\*)?:\s*(.+)/i.exec(body);
  if (!inline) return null;
  let value = inline[1].trim();
  const wrapped = /^`([^`]*)`$/.exec(value);
  if (wrapped) value = wrapped[1].trim();
  return value || null;
}

// A non-empty pass/fail-criteria section: the null-criteria rejection hinges on
// this being present AND carrying real text, not just a heading.
function parsePassCriteria(body) {
  const m = /(?:^|\n)#{2,3}\s*Pass\/Fail Criteria\s*\n([\s\S]*?)(?:\n#{1,3}\s|$)/i.exec(body)
    || /\*\*Pass\/Fail Criteria\*\*:?\s*([\s\S]*?)(?:\n#{1,3}\s|\n\*\*[A-Z]|$)/i.exec(body);
  if (!m) return null;
  const text = m[1].replace(/[-*\s]/g, '').length ? m[1].trim() : null;
  return text;
}

/**
 * Parse one compiled-routing scenario file into the structured shape the
 * validator judges. Never throws on a malformed file — a read/parse failure is
 * returned as `ok:false` so the caller can score it FAIL rather than crash.
 *
 * @param {string} absPath - Absolute path to the scenario `.md` file.
 * @returns {Object} Parsed scenario, or `{ ok:false, error }`.
 */
function parseScenario(absPath) {
  const text = readFileSafe(absPath);
  if (text == null) return { ok: false, absPath, error: 'UNREADABLE_FILE' };
  const block = extractFrontmatter(text);
  if (block == null) return { ok: false, absPath, error: 'NO_FRONTMATTER' };
  const body = bodyAfterFrontmatter(text);

  const leaf = leafPairs(block);
  const evidence = {};
  for (const field of EVIDENCE_FIELDS) evidence[field] = scalar(block, `evidence_${field}`);

  return {
    ok: true,
    absPath,
    id: scalar(block, 'id'),
    stage: scalar(block, 'stage'),
    routeShape: scalar(block, 'route_shape'),
    expectedIntent: scalar(block, 'expected_intent'),
    expectedResources: list(block, 'expected_resources'),
    expectedWorkflowMode: scalar(block, 'expected_workflow_mode'),
    leafPresent: leaf.present,
    leafPairs: leaf.pairs || [],
    evidence,
    prompt: parsePrompt(body),
    passCriteria: parsePassCriteria(body),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MANIFEST RESOLUTION (read-only, best-effort)
// ─────────────────────────────────────────────────────────────────────────────

// A scenario lives at <hub>/manual-testing-playbook/compiled-routing/<file>.md,
// so the hub root — and its committed leaf-manifest.json — is three directories
// up from the file. Absent a manifest, leaf resolution is skipped (containment
// is still enforced); present, every typed leaf must be a real manifest leaf.
function loadHubLeaves(absPath) {
  const hubRoot = path.resolve(path.dirname(absPath), '..', '..');
  const manifestPath = path.join(hubRoot, 'leaf-manifest.json');
  if (!fs.existsSync(manifestPath)) return null;
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const byMode = new Map();
    for (const mode of manifest.modes || []) {
      if (mode && mode.workflowMode) byMode.set(mode.workflowMode, new Set(mode.leaves || []));
    }
    return byMode;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Judge one parsed scenario against the full admission contract.
 *
 * @param {Object} parsed - Output of parseScenario.
 * @param {Map<string,Set<string>>|null} [hubLeaves] - workflowMode -> leaf set, or null.
 * @returns {{ verdict:string, problems:string[] }} Verdict + problem list.
 */
function validateScenario(parsed, hubLeaves) {
  if (!parsed.ok) return { verdict: VERDICT.FAIL, problems: [parsed.error] };
  const problems = [];

  // (a) Required scalar contract — the id-only rejection lives here: an id with
  // nothing else fails on every missing field below.
  if (!parsed.id) problems.push('missing id');
  if (!parsed.expectedIntent) problems.push('missing expected_intent');
  if (!parsed.expectedResources || parsed.expectedResources.length === 0) problems.push('missing or empty expected_resources');
  if (!parsed.expectedWorkflowMode) problems.push('missing expected_workflow_mode');
  if (!parsed.stage) problems.push('missing stage');
  else if (!VALID_STAGES.has(parsed.stage)) problems.push(`invalid stage "${parsed.stage}" (expected routing|holdout|negative)`);

  // (b) Typed leaf gold — present, well-formed, contained, and (when a manifest
  // exists) resolving to a real leaf.
  if (!parsed.leafPresent) {
    problems.push('missing typed expected_leaf_resources');
  } else if (parsed.leafPairs.length === 0) {
    problems.push('expected_leaf_resources is empty (a compiled-routing scenario must assert at least one typed leaf)');
  } else {
    const declaredModes = new Set(String(parsed.expectedWorkflowMode || '').split(/\s*(?:\+|→|->)\s*/).map((s) => s.trim()).filter(Boolean));
    for (const pair of parsed.leafPairs) {
      if (!pair.workflowMode) problems.push(`typed pair missing workflow_mode (leaf_resource_id=${pair.leafResourceId || '?'})`);
      if (!pair.leafResourceId) { problems.push(`typed pair missing leaf_resource_id (workflow_mode=${pair.workflowMode || '?'})`); continue; }
      try { contract.assertContainment(pair.leafResourceId); } catch (err) {
        problems.push(`leaf_resource_id fails containment: ${pair.leafResourceId} (${err.code})`);
      }
      if (pair.workflowMode && !declaredModes.has(pair.workflowMode)) {
        problems.push(`typed pair mode "${pair.workflowMode}" not in expected_workflow_mode "${parsed.expectedWorkflowMode}"`);
      }
      if (hubLeaves && pair.workflowMode) {
        const leaves = hubLeaves.get(pair.workflowMode);
        if (!leaves) problems.push(`unregistered workflowMode in leaf-manifest: ${pair.workflowMode}`);
        else if (!leaves.has(pair.leafResourceId)) problems.push(`typed leaf not in manifest: (${pair.workflowMode}, ${pair.leafResourceId})`);
      }
    }
  }

  // (c) Evidence contract — all seven fields present and non-null.
  for (const field of EVIDENCE_FIELDS) {
    const value = parsed.evidence[field];
    if (value == null || value === '') problems.push(`missing or null evidence field: evidence_${field}`);
  }

  // (d) Parseable exact prompt + non-null pass criteria.
  if (!parsed.prompt) problems.push('missing or unparseable exact prompt');
  if (!parsed.passCriteria) problems.push('missing or empty pass/fail criteria (null-criteria scenario)');

  // (e) Holdout no-leak: the route must not be handed to the model in its own
  // prompt, or the holdout proves memorization, not generalization.
  if (parsed.stage === 'holdout' && parsed.prompt) {
    const promptText = parsed.prompt;
    const routeTokens = new Set();
    if (parsed.expectedWorkflowMode) String(parsed.expectedWorkflowMode).split(/\s*(?:\+|→|->)\s*/).forEach((m) => routeTokens.add(m.trim()));
    for (const pair of parsed.leafPairs) if (pair.workflowMode) routeTokens.add(pair.workflowMode);
    const compiledRoute = parsed.evidence.compiled_route;
    if (compiledRoute) String(compiledRoute).split('/').forEach((seg) => routeTokens.add(seg));
    for (const token of routeTokens) {
      if (token && token.length > 2 && new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(promptText)) {
        problems.push(`holdout prompt leaks its own route token "${token}" (route must be withheld from the prompt)`);
      }
    }
  }

  return { verdict: problems.length ? VERDICT.FAIL : VERDICT.PASS, problems };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function walkScenarioFiles(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    let entries;
    try { entries = fs.readdirSync(cur, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      const full = path.join(cur, e.name);
      if (e.isDirectory()) { stack.push(full); continue; }
      if (!e.isFile() || !e.name.endsWith('.md')) continue;
      if (e.name === 'manual-testing-playbook.md' || e.name === 'feature-catalog.md' || e.name === 'README.md') continue;
      out.push(full);
    }
  }
  return out.sort();
}

/**
 * Validate every compiled-routing scenario `.md` file under a directory.
 *
 * @param {Object} args - Run inputs.
 * @param {string} args.dir - Directory holding compiled-routing scenario files.
 * @returns {{ results:Array, pass:number, fail:number, skip:number }} Report.
 */
function runValidation({ dir }) {
  const files = walkScenarioFiles(dir);
  const results = [];
  for (const absPath of files) {
    const parsed = parseScenario(absPath);
    const hubLeaves = parsed.ok ? loadHubLeaves(absPath) : null;
    const verdict = validateScenario(parsed, hubLeaves);
    results.push({
      id: parsed.ok ? parsed.id : null,
      relPath: path.relative(dir, absPath),
      stage: parsed.ok ? parsed.stage : null,
      routeShape: parsed.ok ? parsed.routeShape : null,
      verdict: verdict.verdict,
      problems: verdict.problems,
    });
  }
  const pass = results.filter((r) => r.verdict === VERDICT.PASS).length;
  const fail = results.filter((r) => r.verdict === VERDICT.FAIL).length;
  const skip = results.filter((r) => r.verdict === VERDICT.SKIP).length;
  return { results, pass, fail, skip };
}

function formatReport(report) {
  const lines = [];
  for (const r of report.results) {
    const label = r.id || '(no id)';
    if (r.verdict === VERDICT.PASS) {
      lines.push(`PASS  ${label}  ${r.relPath}  stage=${r.stage}  shape=${r.routeShape}`);
    } else {
      lines.push(`${r.verdict}  ${label}  ${r.relPath}`);
      for (const p of r.problems) lines.push(`        - ${p}`);
    }
  }
  lines.push('');
  lines.push(`pass=${report.pass} fail=${report.fail} skip=${report.skip} total=${report.results.length}`);
  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  VERDICT,
  EVIDENCE_FIELDS,
  VALID_STAGES,
  parseScenario,
  validateScenario,
  loadHubLeaves,
  walkScenarioFiles,
  runValidation,
  formatReport,
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. CLI
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args = require(path.join(
    __dirname, '..', '..', '..', 'system-deep-loop', 'deep-improvement', 'scripts', 'skill-benchmark', '_args.cjs',
  )).parse(process.argv.slice(2));
  const dir = args.dir ? path.resolve(String(args.dir)) : null;
  if (!dir) {
    process.stderr.write('usage: validate-compiled-routing-scenarios.cjs --dir <compiled-routing scenario dir> [--strict] [--format json]\n');
    process.exit(2);
  }
  const report = runValidation({ dir });
  if (args.format === 'json') process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  else process.stdout.write(`${formatReport(report)}\n`);
  if (args.strict && report.fail > 0) process.exit(1);
  process.exit(0);
}

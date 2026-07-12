#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ sk-doc.cjs — deep-alignment reference authority adapter                  ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Implements the three-method adapter contract for the sk-doc              ║
// ║ authority: discover(scope), standardSource(authority), check(artifact,   ║
// ║ rules). This is the REFERENCE adapter — sk-git/sk-design and sk-code     ║
// ║ copy this file's shape, not its content.                                 ║
// ║                                                                          ║
// ║ Full specification: ../../references/adapters/sk_doc_adapter.md          ║
// ║ Suppression list:    ../../references/adapters/sk_doc_known_deviations.md║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

/**
 * sk-doc.cjs — wraps the real, already-shipping sk-doc validators
 * (validate_document.py, extract_structure.py) behind the deep-alignment
 * adapter contract. Wraps; does not reimplement document validation.
 *
 * discover(scope) takes the real, live scope shape from
 * ../../references/discover_contract.md §3 / ../../references/lane_config_schema.md §5:
 * `{type:'paths', values:[...]}` or `{type:'globs', values:[...]}` (a 'branchRange' scope
 * resolves to an empty result — see discover()'s own comment for why).
 *
 * Module usage:
 *   const adapter = require('./sk-doc.cjs');
 *   const { artifacts, nodes } = adapter.discover({ type: 'paths', values: ['.opencode/skills/cli-external'] });
 *   const rules = adapter.standardSource('sk-doc');
 *   const findings = adapter.check(artifacts[0], rules);
 *
 * CLI usage (manual dry-run, no engine wiring required):
 *   node sk-doc.cjs discover [--glob] <scope-value...>
 *   node sk-doc.cjs check <artifact-path>
 *   node sk-doc.cjs standard-source
 *
 * Examples:
 *   node sk-doc.cjs discover .opencode/skills/cli-external
 *   node sk-doc.cjs discover --glob '.opencode/skills/cli-external/**\/*.md'
 *   node sk-doc.cjs check .opencode/skills/cli-external/cli-opencode/README.md
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Mirrors deep-improvement/scripts/skill-benchmark/advisor-probe.cjs's own SKILLS_DIR
// computation (4 levels up from a mode-packet's scripts/<subdir>/*.cjs file).
const SKILLS_DIR = path.resolve(__dirname, '..', '..', '..', '..'); // .opencode/skills
const REPO_ROOT = path.resolve(SKILLS_DIR, '..', '..'); // repo root

const SK_DOC_DIR = path.join(SKILLS_DIR, 'sk-doc');
// Invoke the Python tools via their real shared/scripts/ directory, not the
// scripts/ symlink: the tools resolve template_rules.json as script_dir.parent/
// assets/, which is derived from the invoked path. Through the symlink that
// resolves to the non-existent sk-doc/assets/ (exit 2, "template_rules.json not
// found"); through the real dir it correctly resolves to sk-doc/shared/assets/.
const VALIDATE_DOCUMENT_PY = path.join(SK_DOC_DIR, 'shared', 'scripts', 'validate_document.py');
const EXTRACT_STRUCTURE_PY = path.join(SK_DOC_DIR, 'shared', 'scripts', 'extract_structure.py');
const CORE_STANDARDS_MD = path.join(SK_DOC_DIR, 'shared', 'references', 'core_standards.md');
const CREATE_SKILL_ASSETS_DIR = path.join(SK_DOC_DIR, 'create-skill', 'assets');
const CREATE_SKILL_REFERENCES_DIR = path.join(SK_DOC_DIR, 'create-skill', 'references');
const KNOWN_DEVIATIONS_MD = path.resolve(__dirname, '..', '..', 'references', 'adapters', 'sk_doc_known_deviations.md');

// Ported from validate_document.py:54-64 (EXCLUDED_PATH_PATTERNS) so discover() does not
// waste cycles walking directories the validator would exclude anyway.
const EXCLUDED_PATH_SEGMENTS = new Set([
  '.pytest_cache', 'node_modules', '__pycache__', '.git', 'vendor', 'dist', 'build', '.venv', 'venv',
]);

// validate_document.py's own --type argparse choices (validate_document.py:826). Any
// classifyDocumentType() result outside this set is omitted from --type so the validator
// falls back to its own content-based auto-detection instead of erroring on an invalid choice.
const VALIDATE_DOCUMENT_TYPE_CHOICES = new Set([
  'readme', 'skill', 'reference', 'asset', 'agent', 'command', 'install_guide', 'spec', 'changelog',
]);

// Review-contract policy floor carried forward from a prior real threshold — NOT a value
// read out of extract_structure.py itself, which only classifies a DQI total into qualitative
// bands (extract_structure.py:1119-1130) with no pass/fail notion of its own.
const DQI_FLOOR = 75;

const PYTHON_TIMEOUT_MS = 60000;
const MAX_BUFFER = 8 * 1024 * 1024;

// ─────────────────────────────────────────────────────────────────────────────
// 3. DOCUMENT-TYPE CLASSIFIER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Classify a document's type from its path alone.
 *
 * Ported 1:1 from extract_structure.py's detect_document_type() (extract_structure.py:617-653)
 * to reuse extract_structure.py's existing document-type detection rather than
 * re-implementing classification. This is deliberately
 * NOT core_standards.md's Section 3 narrative table and NOT validate_document.py's own
 * (content-dependent, so unusable for a pure-path discover() walk) classifier — see
 * sk_doc_adapter.md Section 3 "Classifier Provenance" for the full three-way comparison and
 * why this specific function was chosen as the port target.
 *
 * @param {string} relPath - Repo-relative path to classify.
 * @returns {{docType: string, detectedFrom: string}}
 */
function classifyDocumentType(relPath) {
  const filename = path.basename(relPath);
  const filenameLower = filename.toLowerCase();
  const filepathStr = relPath.split(path.sep).join('/');

  if (filenameLower.includes('template')) return { docType: 'template', detectedFrom: 'filename' };
  if (filepathStr.includes('/flowcharts/')) return { docType: 'flowchart', detectedFrom: 'path' };
  if (filename === 'SKILL.md') return { docType: 'skill', detectedFrom: 'filename' };
  if (filename === 'README.md') return { docType: 'readme', detectedFrom: 'filename' };
  if (filepathStr.includes('/command/') || filepathStr.includes('/commands/')) return { docType: 'command', detectedFrom: 'path' };
  if (filepathStr.includes('/specs/')) return { docType: 'spec', detectedFrom: 'path' };
  if (filepathStr.includes('/assets/')) return { docType: 'asset', detectedFrom: 'path' };
  if (filepathStr.includes('/references/')) return { docType: 'reference', detectedFrom: 'path' };
  if (filepathStr.includes('/knowledge/')) return { docType: 'knowledge', detectedFrom: 'path' };
  return { docType: 'generic', detectedFrom: 'default' };
}

/**
 * Map a classifyDocumentType() result onto validate_document.py's own --type choices.
 * Returns null when there is no direct match, so the caller omits --type entirely and lets
 * validate_document.py auto-detect from file content instead of erroring on an invalid choice.
 * @param {string} docType
 * @returns {string|null}
 */
function mapToValidateDocumentType(docType) {
  return VALIDATE_DOCUMENT_TYPE_CHOICES.has(docType) ? docType : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DISCOVER(SCOPE)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check that an absolute path stays inside the repo root. `scripts/scoping.cjs`'s own
 * `validateScope()` already enforces this on every `scope.values` entry before a
 * lane reaches DISCOVER, so this is defense-in-depth for a direct/test call that bypasses
 * scoping.cjs, not the primary enforcement point — it fails closed (silently excludes) rather
 * than throwing, consistent with the "empty/unreachable scope resolves to zero-coverage, not
 * an error" edge case (spec.md, discover_contract.md Section 5).
 * @param {string} absPath
 * @returns {boolean}
 */
function isInsideRepoRoot(absPath) {
  const rel = path.relative(REPO_ROOT, absPath);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

/**
 * Minimal glob-to-RegExp translation: `**` (any depth, including zero segments), `*` (within
 * one path segment), `?` (one character). No brace expansion or character classes — sufficient
 * for the docs artifact-class's real usage (`docs/**\/*.md`-shaped patterns), deliberately not
 * a fabricated "full" glob engine.
 * @param {string} glob
 * @returns {RegExp}
 */
function globToRegExp(glob) {
  let reStr = '';
  for (let i = 0; i < glob.length; i += 1) {
    const c = glob[i];
    if (c === '*' && glob[i + 1] === '*') {
      reStr += '.*';
      i += 1;
      if (glob[i + 1] === '/') i += 1; // "**/foo" also matches "foo" at the walk root
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

/**
 * The directory to actually walk for a glob pattern: everything before its first wildcard
 * character, trimmed back to the last complete path segment.
 * @param {string} glob
 * @returns {string}
 */
function globWalkRoot(glob) {
  const wildcardIndex = glob.search(/[*?]/);
  if (wildcardIndex === -1) return glob;
  const prefix = glob.slice(0, wildcardIndex);
  const lastSlash = prefix.lastIndexOf('/');
  return lastSlash === -1 ? '.' : prefix.slice(0, lastSlash);
}

function collectMarkdownFiles(scopeEntry, seen, out) {
  const resolved = path.resolve(REPO_ROOT, scopeEntry);
  if (!isInsideRepoRoot(resolved)) return;

  let stat;
  try {
    stat = fs.statSync(resolved);
  } catch (err) {
    return; // Non-existent path resolves to zero-coverage, not an error (spec.md Data Boundaries).
  }

  if (stat.isFile()) {
    if (resolved.endsWith('.md')) addIfNew(resolved, seen, out);
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
      collectMarkdownFiles(path.relative(REPO_ROOT, entryPath), seen, out);
    } else if (dirent.isFile() && dirent.name.endsWith('.md')) {
      addIfNew(entryPath, seen, out);
    }
  }
}

function addIfNew(absPath, seen, out) {
  const relPath = path.relative(REPO_ROOT, absPath).split(path.sep).join('/');
  if (seen.has(relPath)) return;
  seen.add(relPath);
  out.push(relPath);
}

function discoverPaths(values) {
  const seen = new Set();
  const out = [];
  for (const value of values) collectMarkdownFiles(value, seen, out);
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
  for (const pattern of positive) collectMarkdownFiles(globWalkRoot(pattern), seen, candidates);
  const positiveRes = positive.map(globToRegExp);
  return candidates.filter((relPath) => (
    positiveRes.some((re) => re.test(relPath)) && !negative.some((re) => re.test(relPath))
  ));
}

/**
 * discover(scope) -> { artifacts, nodes }, for the sk-doc authority's docs artifact-class.
 *
 * `scope` is the real, live shape from discover_contract.md Section 3 / lane_config_schema.md
 * Section 5 — `{type:'paths', values}`, `{type:'globs', values}`, or
 * `{type:'branchRange', from, to}`. Output shape is discover_contract.md Section 4 exactly:
 * a bare `{path}` per artifact, plus a parallel `nodes` array shaped for
 * `runtime/scripts/upsert.cjs --nodes` (this adapter does not call upsert.cjs itself — see
 * sk_doc_adapter.md Section 3).
 *
 * @param {{type:'paths'|'globs', values:string[]}|{type:'branchRange', from:string, to:string}} scope
 * @returns {{artifacts:Array<{path:string}>, nodes:Array<Object>}}
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
    // Git-history traversal is a materially different feature (per-ref file listing across a
    // range) than the filesystem walk the docs artifact-class needs, and neither wrapped tool
    // (validate_document.py, extract_structure.py) operates on anything but a live on-disk
    // file. sk-doc's only registered artifact-class is "docs" (scripts/scoping.cjs's
    // AUTHORITY_ARTIFACT_CLASSES), so a valid lane should never hand this adapter a
    // branchRange scope in the first place — this branch exists so an out-of-contract call
    // fails predictably (empty result) instead of throwing.
    relPaths = [];
  } else {
    throw new Error(`discover(scope): unknown scope.type "${scope.type}"`);
  }

  const artifacts = relPaths.map((relPath) => ({ path: relPath }));
  const nodes = relPaths.map((relPath) => {
    const { docType, detectedFrom } = classifyDocumentType(relPath);
    return {
      id: `file:${relPath}`,
      kind: 'FILE',
      name: relPath,
      metadata: { authority: 'sk-doc', artifactClass: 'docs', docType, detectedFrom },
    };
  });
  return { artifacts, nodes };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. KNOWN-DEVIATION SUPPRESSION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load and parse the machine-readable deviation list embedded in
 * sk_doc_known_deviations.md's fenced ```json block (Section 8). That file is the single
 * source of truth; there is no separate hand-synced copy of this list.
 * @returns {Array<Object>} Parsed deviation records, or [] if the file/block is missing or invalid.
 */
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
  if (deviation.matchSubcheck && deviation.matchSubcheck !== finding.subcheck) return false;
  if (Array.isArray(deviation.matchDocTypes) && !deviation.matchDocTypes.includes(finding.artifactDocType)) return false;
  if (deviation.requiresValidatorExitZero && finding.validatorExitCode !== 0) return false;
  return true;
}

/**
 * Filter findings through the known-deviation list. A match suppresses only that finding —
 * never the whole artifact (spec.md's "Data Boundaries" edge case).
 * @param {Array<Object>} findings
 * @param {Array<Object>} knownDeviations
 * @returns {Array<Object>}
 */
function suppressKnownDeviations(findings, knownDeviations) {
  if (!Array.isArray(knownDeviations) || knownDeviations.length === 0) return findings;
  return findings.filter((finding) => !knownDeviations.some((dev) => matchesDeviation(finding, dev)));
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. STANDARDSOURCE(AUTHORITY)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * standardSource(authority) -> {templates, rules}, for the sk-doc authority.
 * @param {string} authority - Must be 'sk-doc'.
 * @returns {Object}
 */
function standardSource(authority) {
  if (authority !== 'sk-doc') {
    throw new Error(`sk-doc adapter standardSource() called with unsupported authority "${authority}"`);
  }
  return {
    authority: 'sk-doc',
    validators: {
      templateConformance: { tool: 'validate_document.py', path: VALIDATE_DOCUMENT_PY },
      dqi: { tool: 'extract_structure.py', path: EXTRACT_STRUCTURE_PY },
    },
    templates: {
      assetsDir: CREATE_SKILL_ASSETS_DIR,
      referencesDir: CREATE_SKILL_REFERENCES_DIR,
    },
    standardsDoc: CORE_STANDARDS_MD,
    knownDeviations: loadKnownDeviations(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. SUBPROCESS WRAPPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run validate_document.py --json against one artifact.
 * Exit codes per validate_document.py:18-20: 0=valid, 1=invalid/blocking, 2=file-not-found/parse-error.
 * @param {string} relPath - Repo-relative artifact path.
 * @param {string|null} mappedType - A validate_document.py --type choice, or null to auto-detect.
 * @returns {{ok:boolean, exitCode:number|null, result:Object|null, adapterError:string|null}}
 */
function runValidateDocument(relPath, mappedType) {
  const absPath = path.resolve(REPO_ROOT, relPath);
  const args = [VALIDATE_DOCUMENT_PY, absPath, '--json'];
  if (mappedType) args.push('--type', mappedType);

  const res = spawnSync('python3', args, {
    encoding: 'utf8',
    timeout: PYTHON_TIMEOUT_MS,
    maxBuffer: MAX_BUFFER,
    cwd: REPO_ROOT,
  });

  if (res.error) {
    // Adapter-level failure (e.g. python3 not on PATH) — distinct from an artifact-level
    // finding per spec.md's "Error Scenarios" edge case.
    return { ok: false, exitCode: null, result: null, adapterError: res.error.message };
  }
  let result = null;
  if (res.stdout) {
    try {
      result = JSON.parse(res.stdout);
    } catch (err) {
      return { ok: false, exitCode: res.status, result: null, adapterError: `unparseable validate_document.py --json output: ${err.message}` };
    }
  }
  return { ok: true, exitCode: res.status, result, adapterError: null };
}

/**
 * Run extract_structure.py against one artifact. No --type flag exists on this script (it
 * always self-detects from the path via its own detect_document_type()); see
 * sk_doc_adapter.md Section 3. Exits 1 only when its JSON result carries an 'error' key
 * (extract_structure.py:1251-1252), 0 otherwise.
 * @param {string} relPath - Repo-relative artifact path.
 * @returns {{ok:boolean, result:Object|null, adapterError:string|null}}
 */
function runExtractStructure(relPath) {
  const absPath = path.resolve(REPO_ROOT, relPath);
  const res = spawnSync('python3', [EXTRACT_STRUCTURE_PY, absPath], {
    encoding: 'utf8',
    timeout: PYTHON_TIMEOUT_MS,
    maxBuffer: MAX_BUFFER,
    cwd: REPO_ROOT,
  });

  if (res.error) {
    return { ok: false, result: null, adapterError: res.error.message };
  }
  let result = null;
  if (res.stdout) {
    try {
      result = JSON.parse(res.stdout);
    } catch (err) {
      return { ok: false, result: null, adapterError: `unparseable extract_structure.py output: ${err.message}` };
    }
  }
  const ok = res.status === 0 && !!result && !result.error;
  return { ok, result, adapterError: result && result.error ? result.error : null };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. CHECK(ARTIFACT, RULES)
// ─────────────────────────────────────────────────────────────────────────────

function makeFinding({ severity, type, subcheck, layer, message, artifact, sourceTool, detail, validatorExitCode }) {
  return {
    severity,
    type,
    subcheck,
    layer,
    message,
    artifactId: artifact.id || artifact.path,
    artifactPath: artifact.path,
    artifactDocType: artifact.docType || null,
    sourceTool,
    validatorExitCode: typeof validatorExitCode === 'number' ? validatorExitCode : null,
    detail: detail === undefined ? null : detail,
  };
}

/**
 * Template-conformance sub-check: validate_document.py (structure/format) + extract_structure.py
 * (DQI). See sk_doc_adapter.md Section 4.1 and Section 7's severity mapping table.
 * @param {Object} artifact - {path, docType, ...}
 * @returns {Array<Object>} Findings, all tagged layer:'deterministic'.
 */
function checkTemplateConformance(artifact) {
  const findings = [];
  const validated = runValidateDocument(artifact.path, mapToValidateDocumentType(artifact.docType));

  if (!validated.ok) {
    findings.push(makeFinding({
      severity: 'P1', type: 'adapter-error', subcheck: 'template-conformance', layer: 'deterministic',
      message: `validate_document.py could not run against this artifact: ${validated.adapterError}`,
      artifact, sourceTool: 'validate_document.py',
    }));
  } else if (validated.exitCode === 2) {
    findings.push(makeFinding({
      severity: 'P1', type: 'could-not-validate', subcheck: 'template-conformance', layer: 'deterministic',
      message: (validated.result && validated.result.error) || 'validate_document.py exited 2 (file not found or parse error)',
      artifact, sourceTool: 'validate_document.py', validatorExitCode: 2,
    }));
  } else {
    for (const err of (validated.result && validated.result.blocking_errors) || []) {
      findings.push(makeFinding({
        severity: 'P0', type: err.type, subcheck: 'template-conformance', layer: 'deterministic',
        message: err.message, artifact, sourceTool: 'validate_document.py',
        detail: err, validatorExitCode: validated.exitCode,
      }));
    }
    for (const warn of (validated.result && validated.result.warnings) || []) {
      findings.push(makeFinding({
        severity: 'P1', type: warn.type, subcheck: 'template-conformance', layer: 'deterministic',
        message: warn.message, artifact, sourceTool: 'validate_document.py',
        detail: warn, validatorExitCode: validated.exitCode,
      }));
    }
  }

  const dqi = runExtractStructure(artifact.path);
  if (dqi.ok && dqi.result && dqi.result.dqi && typeof dqi.result.dqi.total === 'number') {
    if (dqi.result.dqi.total < DQI_FLOOR) {
      findings.push(makeFinding({
        severity: 'P2', type: 'dqi-below-threshold', subcheck: 'template-conformance', layer: 'deterministic',
        message: `DQI ${dqi.result.dqi.total}/100 (band: ${dqi.result.dqi.band}) is below the ${DQI_FLOOR} floor (130-packet precedent, iteration-001.md:113-117)`,
        artifact, sourceTool: 'extract_structure.py', detail: dqi.result.dqi,
        validatorExitCode: validated.ok ? validated.exitCode : null,
      }));
    }
  } else if (!dqi.ok) {
    findings.push(makeFinding({
      severity: 'P1', type: 'adapter-error', subcheck: 'template-conformance', layer: 'deterministic',
      message: `extract_structure.py could not run against this artifact: ${dqi.adapterError}`,
      artifact, sourceTool: 'extract_structure.py',
    }));
  }

  return findings;
}

/**
 * Reality-alignment sub-check: structurally VERIFY-FIRST, not a self-contained heuristic.
 * Extracting a specific live-behavior claim from an artifact's prose and re-probing it is a
 * reasoning act (see sk_doc_adapter.md Section 5's real examples) — this function
 * never invents that step. It only translates ALREADY-VERIFIED, ALREADY-CONTRADICTED claims
 * (caller-supplied via options.verifiedClaims) into findings. No verifiedClaims -> no findings.
 * @param {Object} artifact - {path, ...}
 * @param {{verifiedClaims?: Array<{claim:string, matchesLiveReality:boolean, reprobeEvidence:string, severity?:string}>}} [options]
 * @returns {Array<Object>} Findings, all tagged layer:'reasoning-agent'.
 */
function checkRealityAlignment(artifact, options) {
  const verifiedClaims = (options && Array.isArray(options.verifiedClaims)) ? options.verifiedClaims : [];
  const findings = [];
  for (const claim of verifiedClaims) {
    if (!claim || claim.matchesLiveReality !== false) continue; // only contradicted claims become findings
    if (!claim.reprobeEvidence) continue; // never assert without cited reprobe evidence
    findings.push(makeFinding({
      severity: claim.severity || 'P0',
      type: 'reality-drift',
      subcheck: 'reality-alignment',
      layer: 'reasoning-agent',
      message: claim.claim ? `Artifact claim contradicted by live reality: ${claim.claim}` : 'Artifact claim contradicted by live reality',
      artifact,
      sourceTool: 'live re-probe (caller-supplied)',
      detail: { claim: claim.claim, reprobeEvidence: claim.reprobeEvidence },
    }));
  }
  return findings;
}

function normalizeArtifact(artifact) {
  if (typeof artifact === 'string') {
    const absPath = path.isAbsolute(artifact) ? artifact : path.resolve(REPO_ROOT, artifact);
    if (!isInsideRepoRoot(absPath)) {
      throw new Error(`check(): artifact path "${artifact}" resolves outside the repo root`);
    }
    const relPath = path.relative(REPO_ROOT, absPath);
    const { docType, detectedFrom } = classifyDocumentType(relPath);
    return { id: relPath, kind: 'FILE', path: relPath, docType, detectedFrom };
  }
  if (artifact && typeof artifact === 'object' && typeof artifact.path === 'string') {
    return artifact.docType ? artifact : { ...artifact, ...classifyDocumentType(artifact.path) };
  }
  throw new Error('check(artifact, rules): artifact must be a path string or a discover()-shaped object with a "path" field');
}

/**
 * check(artifact, rules) -> findings, for the sk-doc authority.
 * Two sub-checks (template-conformance, reality-alignment), both VERIFY-FIRST, then
 * known-deviation suppression. See sk_doc_adapter.md Section 4.
 * @param {string|Object} artifact - A discover()-shaped object, or a bare path string.
 * @param {Object} [rules] - standardSource('sk-doc') output; knownDeviations reloaded if omitted.
 * @param {{verifiedClaims?: Array<Object>}} [options] - Caller-supplied reality-alignment evidence.
 * @returns {Array<Object>} Findings after suppression.
 */
function check(artifact, rules, options) {
  const normalizedArtifact = normalizeArtifact(artifact);
  const knownDeviations = (rules && Array.isArray(rules.knownDeviations)) ? rules.knownDeviations : loadKnownDeviations();
  const templateFindings = checkTemplateConformance(normalizedArtifact);
  const realityFindings = checkRealityAlignment(normalizedArtifact, options);
  const findings = templateFindings.concat(realityFindings);
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
      process.stderr.write('Usage: sk-doc.cjs discover [--glob] <scope-value...>\n');
      process.exitCode = 1;
      return;
    }
    printJson(discover({ type: isGlob ? 'globs' : 'paths', values }));
    return;
  }

  if (subcommand === 'check') {
    const target = rest[0];
    if (!target) {
      process.stderr.write('Usage: sk-doc.cjs check <artifact-path>\n');
      process.exitCode = 1;
      return;
    }
    printJson(check(target, standardSource('sk-doc')));
    return;
  }

  if (subcommand === 'standard-source') {
    printJson(standardSource('sk-doc'));
    return;
  }

  process.stderr.write('Usage: sk-doc.cjs <discover|check|standard-source> [args...]\n');
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
  classifyDocumentType,
  loadKnownDeviations,
};

#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ sk-code.cjs — deep-alignment sk-code authority adapter                   ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Implements the three-method adapter contract for the sk-code             ║
// ║ authority: discover(scope), standardSource(authority), check(artifact,   ║
// ║ rules, options). Shape copied from the reference adapter                 ║
// ║ (scripts/adapters/sk-doc.cjs) per this phase's own brief.                ║
// ║                                                                          ║
// ║ HYBRID (LOCKED): check() is two layers — deterministic                   ║
// ║ (surface detection + the real verify_alignment_drift.py / Webflow       ║
// ║ minification-verification scripts, invoked exactly the way sk-doc.cjs   ║
// ║ invokes validate_document.py/extract_structure.py) and reasoning-agent  ║
// ║ (pattern-conformance judgment this .cjs cannot perform itself — it only ║
// ║ builds the dispatch packet a reasoning agent needs; see                 ║
// ║ buildReasoningLayerDispatch() and checkPatternConformance() below).     ║
// ║ Every finding is tagged layer:'deterministic'|'reasoning-agent' — no    ║
// ║ false determinism.                                                       ║
// ║                                                                          ║
// ║ Full specification: ../../references/adapters/sk_code_adapter.md         ║
// ║ Suppression list:    ../../references/adapters/sk_code_known_deviations.md║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

/**
 * sk-code.cjs — wraps the real, already-shipping sk-code surface-detection
 * router (stack_detection.md/smart_routing.md, reused not reimplemented)
 * and the real deterministic pattern-drift tooling
 * (verify_alignment_drift.py for OPENCODE; verify-minification.mjs and
 * test-minified-runtime.mjs for WEBFLOW) behind the deep-alignment adapter
 * contract, plus a documented reasoning-agent dispatch hook for everything
 * that tooling cannot check.
 *
 * discover(scope) takes the real, live scope shape from
 * ../../references/discover_contract.md §3 / ../../references/lane_config_schema.md §5:
 * `{type:'paths', values:[...]}` or `{type:'globs', values:[...]}` (a 'branchRange' scope
 * resolves to an empty result — sk-code's only registered artifact-class is
 * "code", never "git-history"; see discover()'s own comment).
 *
 * Module usage:
 *   const adapter = require('./sk-code.cjs');
 *   const { artifacts, nodes } = adapter.discover({ type: 'paths', values: ['.opencode/skills/sk-code/code-opencode/assets/scripts'] });
 *   const rules = adapter.standardSource('sk-code');
 *   const findings = adapter.check(artifacts[0], rules);
 *
 * CLI usage (manual dry-run, no engine wiring required):
 *   node sk-code.cjs discover [--glob] <scope-value...>
 *   node sk-code.cjs check <artifact-path>
 *   node sk-code.cjs standard-source
 *   node sk-code.cjs reasoning-dispatch <artifact-path>
 *
 * Examples:
 *   node sk-code.cjs discover .opencode/skills/sk-code/code-opencode/assets/scripts
 *   node sk-code.cjs check .opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs
 *   node sk-code.cjs reasoning-dispatch .opencode/skills/sk-code/code-webflow/assets/scripts/verify-minification.mjs
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

// Mirrors sk-doc.cjs's own SKILLS_DIR/REPO_ROOT computation (same directory
// depth: deep-alignment/scripts/adapters/*.cjs, 4 levels above .opencode/skills).
const SKILLS_DIR = path.resolve(__dirname, '..', '..', '..', '..'); // .opencode/skills
const REPO_ROOT = path.resolve(SKILLS_DIR, '..', '..'); // repo root

const SK_CODE_DIR = path.join(SKILLS_DIR, 'sk-code');
const VERIFY_ALIGNMENT_DRIFT_PY = path.join(SK_CODE_DIR, 'code-opencode', 'assets', 'scripts', 'verify_alignment_drift.py');
const VERIFY_MINIFICATION_MJS = path.join(SK_CODE_DIR, 'code-webflow', 'assets', 'scripts', 'verify-minification.mjs');
const TEST_MINIFIED_RUNTIME_MJS = path.join(SK_CODE_DIR, 'code-webflow', 'assets', 'scripts', 'test-minified-runtime.mjs');
// Referenced for standardSource()'s excludedFromCheck record ONLY — check()
// never spawns this script. See Section 8 checkWebflowDeterministic()'s
// header comment for why (it writes z_minified/*.min.js + manifest.tsv,
// violating read-only-by-default).
const MINIFY_WEBFLOW_MJS = path.join(SK_CODE_DIR, 'code-webflow', 'assets', 'scripts', 'minify-webflow.mjs');
const SMART_ROUTING_MD = path.join(SK_CODE_DIR, 'shared', 'references', 'smart_routing.md');
const STACK_DETECTION_MD = path.join(SK_CODE_DIR, 'shared', 'references', 'stack_detection.md');
const OPENCODE_REFERENCES_DIR = path.join(SK_CODE_DIR, 'code-opencode', 'references');
const WEBFLOW_REFERENCES_DIR = path.join(SK_CODE_DIR, 'code-webflow', 'references');
const MOTION_OVERLAY_DIR = path.join(SK_CODE_DIR, 'code-webflow', 'references', 'animation');
const KNOWN_DEVIATIONS_MD = path.resolve(__dirname, '..', '..', 'references', 'adapters', 'sk_code_known_deviations.md');

// Ported verbatim from verify_alignment_drift.py:39-51's SUPPORTED_EXTENSIONS —
// this is the exact extension set the OPENCODE deterministic layer (layer 1)
// can actually check today. The real script's own docstring (lines 11-18) and
// this dict both list 7 languages including Rust — one more than spec.md's
// own acceptance-criteria prose names ("TS/JS/Python/Shell/JSON/
// JSONC"), confirmed by reading the live file in full; documented as a real
// spec-vs-tool discrepancy in sk_code_adapter.md rather than silently
// resolved either direction.
const OPENCODE_DRIFT_EXTENSIONS = Object.freeze({
  '.ts': 'typescript', '.tsx': 'typescript', '.mts': 'typescript',
  '.js': 'javascript', '.mjs': 'javascript', '.cjs': 'javascript',
  '.py': 'python', '.sh': 'shell', '.rs': 'rust',
  '.json': 'json', '.jsonc': 'jsonc',
});

// discover()'s own walked extension set: the OPENCODE-checkable set above,
// union CSS/HTML — sk-code's "code" artifact-class spans both surfaces
// (stack_detection.md:28: "WEBFLOW owns Webflow / vanilla HTML, CSS,
// JavaScript..."), but only the OPENCODE_DRIFT_EXTENSIONS subset gets real
// layer-1 deterministic coverage; CSS/HTML artifacts get a
// deterministic-layer-not-applicable finding (Section 8) and fall through to
// layer 2 only.
const CODE_EXTENSIONS = Object.freeze({
  ...OPENCODE_DRIFT_EXTENSIONS,
  '.css': 'css',
  '.html': 'html',
});

// Ported from verify_alignment_drift.py:53-63's EXCLUDED_DIRS — reused as-is
// (reuse, do not reimplement) so discover() does not walk directories
// the deterministic checker would exclude anyway.
const EXCLUDED_PATH_SEGMENTS = new Set([
  '.git', 'node_modules', 'dist', 'build', 'coverage', '__pycache__', '.next', '.venv', 'venv',
]);

// WEBFLOW content-marker regex, ported from stack_detection.md:48-49's grep
// pattern (`Webflow\.push\|--vw-` plus the animation-library globals line).
const WEBFLOW_CONTENT_MARKER_RE = /Webflow\.push|--vw-|window\.Motion|window\.gsap|gsap\.(?:to|from|set|timeline|registerPlugin)|new Lenis|new Hls|new Swiper|FilePond/;

// MOTION_DEV overlay content-marker regex — NOT a surface (smart_routing.md
// §5: "Motion.dev... is not a separate code surface; it supplements WEBFLOW,
// OPENCODE... when the request needs Motion API"). Translated from
// smart_routing.md's machine-readable MOTION_DEV keyword list ("animate()",
// "inview", "scroll()", "stagger()") into a content regex, since discover()
// has file content to check, not prompt text.
const MOTION_DEV_CONTENT_MARKER_RE = /window\.Motion\b|Motion\.animate|\banimate\(|\binView\(|\bstagger\(|\bscroll\(\s*\{/;

const PYTHON_TIMEOUT_MS = 60000;
const NODE_TIMEOUT_MS = 60000;
const MAX_BUFFER = 8 * 1024 * 1024;

// ─────────────────────────────────────────────────────────────────────────────
// 3. SURFACE CLASSIFIER (deterministic — the "deterministic
//    surface-detection" half of the HYBRID name)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Classify a code artifact's sk-code surface from its path and (when
 * available) content.
 *
 * Ported from stack_detection.md §2's real Detection Order — NOT
 * reimplemented from scratch. stack_detection.md's own precedence
 * rule is CWD-oriented ("CWD under .opencode/ OR any changed/target file
 * under .opencode/", line 42); discover() has no live interactive CWD, so
 * the artifact's own repo-relative path is the "target file" signal that
 * document already names as the strongest unambiguous OPENCODE signal
 * (stack_detection.md:56).
 *
 * @param {string} relPath - Repo-relative path to classify.
 * @param {string} [content] - File content, for the WEBFLOW content-marker
 *   fallback (stack_detection.md:48-49). Optional — a caller without content
 *   (e.g. a file that could not be read) still gets a path-only classification.
 * @returns {{surface: 'OPENCODE'|'WEBFLOW'|'UNKNOWN', detectedFrom: string}}
 */
function classifySurface(relPath, content) {
  const normalized = relPath.split(path.sep).join('/');

  // 1. OPENCODE — highest precedence (stack_detection.md:38,42,56).
  if (normalized === '.opencode' || normalized.startsWith('.opencode/')) {
    return { surface: 'OPENCODE', detectedFrom: 'path' };
  }

  // 2. WEBFLOW (stack_detection.md:44-50).
  if (normalized.includes('/src/2_javascript/') || normalized.startsWith('src/2_javascript/')) {
    return { surface: 'WEBFLOW', detectedFrom: 'path' };
  }
  if (normalized.endsWith('.webflow.js')) {
    return { surface: 'WEBFLOW', detectedFrom: 'filename' };
  }
  if (normalized === 'wrangler.toml' || normalized.endsWith('/wrangler.toml')) {
    return { surface: 'WEBFLOW', detectedFrom: 'filename' };
  }
  if (typeof content === 'string' && WEBFLOW_CONTENT_MARKER_RE.test(content)) {
    return { surface: 'WEBFLOW', detectedFrom: 'content' };
  }

  // 3. UNKNOWN (stack_detection.md:52-53) — spec.md Data Boundaries: this
  // becomes a surface-undetected finding in check(), never a guessed surface.
  return { surface: 'UNKNOWN', detectedFrom: 'default' };
}

/**
 * Detect the MOTION_DEV overlay signal — a supplemental resource-category
 * flag, never a surface (smart_routing.md §5). See spec.md Data Boundaries:
 * "MOTION_DEV overlay detected alongside WEBFLOW or OPENCODE: adapter loads
 * the Motion.dev overlay reference material as supplemental evidence... not
 * as a replacement surface."
 * @param {string} [content]
 * @returns {boolean}
 */
function detectMotionDevOverlay(content) {
  return typeof content === 'string' && MOTION_DEV_CONTENT_MARKER_RE.test(content);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DISCOVER(SCOPE)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check that an absolute path stays inside the repo root. `scripts/scoping.cjs`'s
 * own `validateScope()` already enforces this on every `scope.values`
 * entry before a lane reaches DISCOVER, so this is defense-in-depth for a
 * direct/test call that bypasses scoping.cjs — it fails closed (silently
 * excludes) rather than throwing, matching sk-doc.cjs's identical helper.
 * @param {string} absPath
 * @returns {boolean}
 */
function isInsideRepoRoot(absPath) {
  const rel = path.relative(REPO_ROOT, absPath);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

/**
 * Minimal glob-to-RegExp translation, identical to sk-doc.cjs's own
 * (adapter-local utility, not sk-doc-specific; this exact duplication is
 * accepted until a shared helper is worth
 * extracting — deferred, not designed here).
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
 * The directory to actually walk for a glob pattern: everything before its
 * first wildcard character, trimmed back to the last complete path segment.
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

function addIfNew(absPath, seen, out) {
  const relPath = path.relative(REPO_ROOT, absPath).split(path.sep).join('/');
  if (seen.has(relPath)) return;
  seen.add(relPath);
  out.push(relPath);
}

function collectCodeFiles(scopeEntry, seen, out) {
  const resolved = path.resolve(REPO_ROOT, scopeEntry);
  if (!isInsideRepoRoot(resolved)) return;

  let stat;
  try {
    stat = fs.statSync(resolved);
  } catch (err) {
    return; // Non-existent path resolves to zero-coverage, not an error (spec.md Data Boundaries).
  }

  if (stat.isFile()) {
    const ext = path.extname(resolved).toLowerCase();
    if (CODE_EXTENSIONS[ext]) addIfNew(resolved, seen, out);
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
      collectCodeFiles(path.relative(REPO_ROOT, entryPath), seen, out);
    } else if (dirent.isFile()) {
      const ext = path.extname(dirent.name).toLowerCase();
      if (CODE_EXTENSIONS[ext]) addIfNew(entryPath, seen, out);
    }
  }
}

function discoverPaths(values) {
  const seen = new Set();
  const out = [];
  for (const value of values) collectCodeFiles(value, seen, out);
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
  for (const pattern of positive) collectCodeFiles(globWalkRoot(pattern), seen, candidates);
  const positiveRes = positive.map(globToRegExp);
  return candidates.filter((relPath) => (
    positiveRes.some((re) => re.test(relPath)) && !negative.some((re) => re.test(relPath))
  ));
}

/**
 * discover(scope) -> { artifacts, nodes }, for the sk-code authority's code
 * artifact-class.
 *
 * Unlike sk-doc.cjs's purely path-based classifier, this discover() reads
 * each candidate file's content — real, justified extra I/O, not gratuitous
 * complexity: stack_detection.md §2's own WEBFLOW detection order includes a
 * content-grep fallback (animation-library globals, `Webflow.push`) that a
 * path-only classifier cannot reproduce faithfully.
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
    // sk-code's only registered artifact-class is "code" (scripts/scoping.cjs's
    // AUTHORITY_ARTIFACT_CLASSES), never "git-history" — a valid lane should
    // never hand this adapter a branchRange scope. Empty result, not a throw,
    // mirrors sk-doc.cjs's identical branch (same rationale, different authority).
    relPaths = [];
  } else {
    throw new Error(`discover(scope): unknown scope.type "${scope.type}"`);
  }

  const artifacts = [];
  const nodes = [];
  for (const relPath of relPaths) {
    const absPath = path.join(REPO_ROOT, relPath);
    let content = '';
    try {
      content = fs.readFileSync(absPath, 'utf8');
    } catch (err) {
      // Unreadable (binary, permissions, race with a concurrent delete) —
      // classify from path alone rather than failing the whole discover() call.
    }
    const { surface, detectedFrom } = classifySurface(relPath, content);
    const motionDevOverlay = detectMotionDevOverlay(content);
    artifacts.push({ path: relPath });
    nodes.push({
      id: `file:${relPath}`,
      kind: 'FILE',
      name: relPath,
      metadata: { authority: 'sk-code', artifactClass: 'code', surface, detectedFrom, motionDevOverlay },
    });
  }
  return { artifacts, nodes };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. KNOWN-DEVIATION SUPPRESSION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load and parse the machine-readable deviation list embedded in
 * sk_code_known_deviations.md's fenced ```json block. That file is the single
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
  if (Array.isArray(deviation.matchSurfaces) && !deviation.matchSurfaces.includes(finding.artifactSurface)) return false;
  return true;
}

/**
 * Filter findings through the known-deviation list. A match suppresses only
 * that finding — never the whole artifact (spec.md's "Data Boundaries" edge
 * case, same invariant sk-doc.cjs enforces).
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
 * standardSource(authority) -> {surfaceRouter, validators, references, ...},
 * for the sk-code authority.
 * @param {string} authority - Must be 'sk-code'.
 * @returns {Object}
 */
function standardSource(authority) {
  if (authority !== 'sk-code') {
    throw new Error(`sk-code adapter standardSource() called with unsupported authority "${authority}"`);
  }
  return {
    authority: 'sk-code',
    surfaceRouter: {
      smartRouting: SMART_ROUTING_MD,
      stackDetection: STACK_DETECTION_MD,
    },
    validators: {
      opencodeDrift: {
        tool: 'verify_alignment_drift.py', path: VERIFY_ALIGNMENT_DRIFT_PY,
        coversSurface: 'OPENCODE', layer: 'deterministic',
        coveredExtensions: Object.keys(OPENCODE_DRIFT_EXTENSIONS),
      },
      webflowMinificationVerify: {
        tool: 'verify-minification.mjs', path: VERIFY_MINIFICATION_MJS,
        coversSurface: 'WEBFLOW', layer: 'deterministic', requiresProjectRoot: true,
      },
      webflowRuntimeTest: {
        tool: 'test-minified-runtime.mjs', path: TEST_MINIFIED_RUNTIME_MJS,
        coversSurface: 'WEBFLOW', layer: 'deterministic', requiresProjectRoot: true,
      },
    },
    excludedFromCheck: [{
      tool: 'minify-webflow.mjs', path: MINIFY_WEBFLOW_MJS,
      reason: 'Writes src/2_javascript/z_minified/*.min.js and manifest.tsv — mutates the reviewed tree, violating ADR-005/NFR-S01 read-only-by-default. plan.md named it as part of the deterministic chain; this adapter excludes it from check() (sk_code_adapter.md Section 4.1.2).',
    }],
    references: {
      opencode: OPENCODE_REFERENCES_DIR,
      webflow: WEBFLOW_REFERENCES_DIR,
      motionOverlay: MOTION_OVERLAY_DIR,
    },
    knownDeviations: loadKnownDeviations(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. SUBPROCESS WRAPPERS — DETERMINISTIC LAYER
// ─────────────────────────────────────────────────────────────────────────────

// Parses verify_alignment_drift.py's text stdout. No --json flag exists on
// this script (confirmed by reading its full argparse block, lines 110-123);
// its findings line format is fixed by main()'s own print() calls
// (verify_alignment_drift.py:534-537):
//   "- {relpath}:{line} [{rule_id}] [{severity}] {message} Fix: {fix_hint}"
const ALIGNMENT_DRIFT_LINE_RE = /^- (.+):(\d+) \[([^\]]+)\] \[(ERROR|WARN)\] (.+?) Fix: (.+)$/;

function parseAlignmentDriftOutput(stdout) {
  const findings = [];
  for (const line of stdout.split('\n')) {
    const m = ALIGNMENT_DRIFT_LINE_RE.exec(line);
    if (!m) continue;
    findings.push({ relPath: m[1], line: Number(m[2]), ruleId: m[3], severity: m[4], message: m[5], fixHint: m[6] });
  }
  return findings;
}

/**
 * Run verify_alignment_drift.py --root <dir> and parse its text findings.
 * cwd is fixed to REPO_ROOT so the tool's own relpath() (verify_alignment_drift.py:500-504,
 * relative to os.getcwd()) prints repo-relative paths matching this adapter's
 * own artifact.path convention.
 * @param {string} absDirPath - Absolute directory to scan (the tool walks a
 *   directory via os.walk(); a single-file --root silently yields zero
 *   results, so callers must always pass a directory — see
 *   checkOpencodeDeterministic()).
 * @returns {{ok:boolean, findings:Array<Object>|null, exitCode:number|null, adapterError:string|null}}
 */
function runVerifyAlignmentDrift(absDirPath) {
  const res = spawnSync('python3', [VERIFY_ALIGNMENT_DRIFT_PY, '--root', absDirPath], {
    encoding: 'utf8',
    timeout: PYTHON_TIMEOUT_MS,
    maxBuffer: MAX_BUFFER,
    cwd: REPO_ROOT,
  });
  if (res.error) {
    return { ok: false, findings: null, exitCode: null, adapterError: res.error.message };
  }
  return { ok: true, findings: parseAlignmentDriftOutput(res.stdout || ''), exitCode: res.status, adapterError: null };
}

/**
 * Walk upward from a file's containing directory looking for a Webflow
 * project root — a directory containing `src/2_javascript/`. Bounded at
 * REPO_ROOT (never escapes the repo) and at the filesystem root as an
 * ultimate guard.
 *
 * Both verify-minification.mjs and test-minified-runtime.mjs hardcode
 * `SOURCE_DIR = 'src/2_javascript'` / `OUTPUT_DIR = 'src/2_javascript/z_minified'`
 * RELATIVE TO CWD (confirmed by reading both scripts in full) and accept NO
 * path argument — unlike verify_alignment_drift.py's `--root`, there is no
 * way to point either script at an arbitrary artifact. They must be invoked
 * with cwd set to the actual Webflow project root.
 * @param {string} absPath - Absolute path of the artifact being checked.
 * @returns {string|null}
 */
function findWebflowProjectRoot(absPath) {
  let dir = path.dirname(absPath);
  for (;;) {
    if (fs.existsSync(path.join(dir, 'src', '2_javascript'))) return dir;
    if (dir === REPO_ROOT) return null;
    const parent = path.dirname(dir);
    if (parent === dir) return null; // filesystem-root guard
    dir = parent;
  }
}

/**
 * Run a no-argument Webflow verification script (verify-minification.mjs or
 * test-minified-runtime.mjs) with cwd set to the discovered project root.
 * @param {string} scriptPath
 * @param {string} projectRoot
 * @returns {{ok:boolean, stdout:string, exitCode:number|null, adapterError:string|null}}
 */
function runNoArgWebflowScript(scriptPath, projectRoot) {
  const res = spawnSync('node', [scriptPath], {
    encoding: 'utf8',
    timeout: NODE_TIMEOUT_MS,
    maxBuffer: MAX_BUFFER,
    cwd: projectRoot,
  });
  if (res.error) {
    return { ok: false, stdout: '', exitCode: null, adapterError: res.error.message };
  }
  return { ok: true, stdout: res.stdout || '', exitCode: res.status, adapterError: null };
}

// Parses verify-minification.mjs's text stdout (no --json flag exists;
// confirmed by reading the full script). Block format per its own
// console.log calls (verify-minification.mjs:280-345): a bare relative-path
// line starts each file's block (relative to SOURCE_DIR, from
// find_js_files(SOURCE_DIR)), followed by indented "  ✓ ..."/"  ✗ FAIL: ..."
// lines and a "  RESULT: PASS|FAIL" line, or a "  ⊘ SKIP: <reason>" line.
function parseFileBlockOutput(stdout) {
  const results = new Map(); // relPath -> {status, messages: [string,...]}
  let current = null;
  for (const rawLine of stdout.split('\n')) {
    const line = rawLine.replace(/\r$/, '');
    if (line && !line.startsWith(' ') && !line.startsWith('=')) {
      current = line.trim();
      if (current) results.set(current, { status: null, messages: [] });
      continue;
    }
    if (!current) continue;
    const entry = results.get(current);
    if (!entry) continue;
    const skipMatch = /^\s*⊘ SKIP: (.+)$/.exec(line);
    if (skipMatch) { entry.status = 'SKIP'; entry.messages.push(skipMatch[1]); continue; }
    const failMatch = /^\s*✗ (?:FAIL: )?(.+)$/.exec(line);
    if (failMatch) { entry.messages.push(failMatch[1]); continue; }
    const resultMatch = /^\s*RESULT: (PASS|FAIL)\s*$/.exec(line);
    if (resultMatch) { entry.status = resultMatch[1]; }
  }
  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. CHECK(ARTIFACT, RULES, OPTIONS)
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
    artifactSurface: artifact.surface || null,
    sourceTool,
    validatorExitCode: typeof validatorExitCode === 'number' ? validatorExitCode : null,
    detail: detail === undefined ? null : detail,
  };
}

/**
 * Layer 1, OPENCODE surface: run verify_alignment_drift.py for real (same
 * subprocess pattern as sk-doc.cjs's runValidateDocument()), scoped to the
 * artifact's containing directory (the script walks a directory via
 * os.walk() — a single-file --root silently scans zero files, confirmed by
 * reading iter_code_files()), then filter the tool's own findings down to
 * just this one artifact. Re-run every call, never cache across
 * check() invocations, matching sk-doc.cjs's identical discipline.
 * @param {Object} artifact
 * @param {string} absPath
 * @returns {Array<Object>}
 */
function checkOpencodeDeterministic(artifact, absPath) {
  const ext = path.extname(absPath).toLowerCase();
  if (!OPENCODE_DRIFT_EXTENSIONS[ext]) {
    return [makeFinding({
      severity: 'P2', type: 'deterministic-layer-not-applicable', subcheck: 'opencode-pattern-drift', layer: 'deterministic',
      message: `verify_alignment_drift.py's SUPPORTED_EXTENSIONS does not include ${ext || '(no extension)'} (it covers .ts/.tsx/.mts/.js/.mjs/.cjs/.py/.sh/.rs/.json/.jsonc only); no deterministic OPENCODE finding applies to this artifact.`,
      artifact, sourceTool: 'verify_alignment_drift.py',
    })];
  }

  const run = runVerifyAlignmentDrift(path.dirname(absPath));
  if (!run.ok) {
    return [makeFinding({
      severity: 'P1', type: 'adapter-error', subcheck: 'opencode-pattern-drift', layer: 'deterministic',
      message: `verify_alignment_drift.py could not run against this artifact: ${run.adapterError}`,
      artifact, sourceTool: 'verify_alignment_drift.py',
    })];
  }

  const relPath = path.relative(REPO_ROOT, absPath).split(path.sep).join('/');
  const mine = run.findings.filter((f) => f.relPath.split(path.sep).join('/') === relPath);
  // Severity mapping mirrors sk-doc.cjs's own blocking_errors->P0 /
  // warnings->P1 structural analogy: ERROR is what drives this tool's OWN
  // exit code to 1 by default (should_fail = error_count > 0 or ...,
  // verify_alignment_drift.py:519), i.e. "blocking" in the tool's own terms;
  // WARN is present regardless of exit code (non-blocking unless
  // --fail-on-warn) — the same shape as sk-doc's warnings tier.
  return mine.map((f) => makeFinding({
    severity: f.severity === 'ERROR' ? 'P0' : 'P1',
    type: f.ruleId, subcheck: 'opencode-pattern-drift', layer: 'deterministic',
    message: `${f.message} Fix: ${f.fixHint}`,
    artifact, sourceTool: 'verify_alignment_drift.py', detail: f, validatorExitCode: run.exitCode,
  }));
}

/**
 * Layer 1, WEBFLOW surface: run the real, read-only verification scripts
 * (verify-minification.mjs, test-minified-runtime.mjs) when a genuine
 * Webflow project root is discoverable for this artifact; otherwise report
 * the required fallback finding rather than silently treating the
 * artifact as clean. minify-webflow.mjs is never invoked (see
 * standardSource()'s excludedFromCheck — it mutates the tree).
 * @param {Object} artifact
 * @param {string} absPath
 * @returns {Array<Object>}
 */
function checkWebflowDeterministic(artifact, absPath) {
  const findings = [];
  const projectRoot = findWebflowProjectRoot(absPath);
  if (!projectRoot) {
    findings.push(makeFinding({
      severity: 'P1', type: 'deterministic-layer-unavailable', subcheck: 'webflow-deterministic-availability', layer: 'deterministic',
      message: 'No Webflow project root (a directory containing src/2_javascript/) found at or above this artifact — verify-minification.mjs and test-minified-runtime.mjs cannot run against it. Falls back to reasoning-agent-only judgment for this artifact (NFR-R01).',
      artifact, sourceTool: 'adapter (project-root probe)',
    }));
    return findings;
  }

  const sourceDir = path.join(projectRoot, 'src', '2_javascript');
  const outputDir = path.join(sourceDir, 'z_minified');
  const relToSource = path.relative(sourceDir, absPath);
  const relToOutput = path.relative(outputDir, absPath);
  const isSourceFile = !relToSource.startsWith('..') && !path.isAbsolute(relToSource);
  const isOutputFile = !relToOutput.startsWith('..') && !path.isAbsolute(relToOutput);

  if (isSourceFile) {
    const run = runNoArgWebflowScript(VERIFY_MINIFICATION_MJS, projectRoot);
    if (!run.ok) {
      findings.push(makeFinding({
        severity: 'P1', type: 'adapter-error', subcheck: 'webflow-minification-pattern-preservation', layer: 'deterministic',
        message: `verify-minification.mjs could not run: ${run.adapterError}`, artifact, sourceTool: 'verify-minification.mjs',
      }));
    } else {
      const results = parseFileBlockOutput(run.stdout);
      const entry = results.get(relToSource.split(path.sep).join('/'));
      if (entry && entry.status === 'FAIL') {
        // FAIL is what makes this tool's own summary declare
        // "VERIFICATION FAILED — Do not deploy!" (verify-minification.mjs:355-358)
        // — the same "drives the wrapped tool's own hard block" logic behind
        // the ERROR->P0 mapping above, so P0 here for consistency.
        findings.push(makeFinding({
          severity: 'P0', type: 'minification-pattern-not-preserved', subcheck: 'webflow-minification-pattern-preservation', layer: 'deterministic',
          message: entry.messages.join('; ') || 'verify-minification.mjs reported FAIL for this file',
          artifact, sourceTool: 'verify-minification.mjs', detail: entry, validatorExitCode: run.exitCode,
        }));
      }
      // entry.status === 'SKIP' (no minified counterpart yet) or 'PASS', or no
      // entry at all (file not under SOURCE_DIR by the tool's own walk) -> no finding.
    }
  }

  if (isOutputFile) {
    const run = runNoArgWebflowScript(TEST_MINIFIED_RUNTIME_MJS, projectRoot);
    if (!run.ok) {
      findings.push(makeFinding({
        severity: 'P1', type: 'adapter-error', subcheck: 'webflow-runtime-execution', layer: 'deterministic',
        message: `test-minified-runtime.mjs could not run: ${run.adapterError}`, artifact, sourceTool: 'test-minified-runtime.mjs',
      }));
    } else {
      const results = parseFileBlockOutput(run.stdout);
      const entry = results.get(relToOutput.split(path.sep).join('/'));
      if (entry && entry.status === 'FAIL') {
        findings.push(makeFinding({
          severity: 'P0', type: 'minified-runtime-execution-failed', subcheck: 'webflow-runtime-execution', layer: 'deterministic',
          message: entry.messages.join('; ') || 'test-minified-runtime.mjs reported FAIL for this file',
          artifact, sourceTool: 'test-minified-runtime.mjs', detail: entry, validatorExitCode: run.exitCode,
        }));
      }
    }
  }

  if (!isSourceFile && !isOutputFile) {
    // A WEBFLOW-surface artifact inside a real project root but outside
    // src/2_javascript/ entirely (e.g. CSS/HTML) — neither script covers it.
    findings.push(makeFinding({
      severity: 'P1', type: 'deterministic-layer-unavailable', subcheck: 'webflow-deterministic-availability', layer: 'deterministic',
      message: 'Artifact is outside src/2_javascript/ (the only tree verify-minification.mjs/test-minified-runtime.mjs cover); no deterministic WEBFLOW check applies. Falls back to reasoning-agent-only judgment (NFR-R01).',
      artifact, sourceTool: 'adapter (project-root probe)',
    }));
  }

  return findings;
}

/**
 * Layer 1 dispatcher: routes to the surface-appropriate deterministic
 * sub-check, or reports surface-undetected (spec.md Data Boundaries) rather
 * than skipping or guessing.
 * @param {Object} artifact
 * @param {string} absPath
 * @returns {Array<Object>}
 */
function checkDeterministic(artifact, absPath) {
  if (artifact.surface === 'OPENCODE') return checkOpencodeDeterministic(artifact, absPath);
  if (artifact.surface === 'WEBFLOW') return checkWebflowDeterministic(artifact, absPath);
  return [makeFinding({
    severity: 'P1', type: 'surface-undetected', subcheck: 'surface-detection', layer: 'deterministic',
    message: 'Neither WEBFLOW nor OPENCODE surface markers matched this artifact (stack_detection.md Section 2); no standard applied.',
    artifact, sourceTool: 'stack_detection.md (ported classifier)',
  })];
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. CHECK — REASONING-AGENT LAYER
// ─────────────────────────────────────────────────────────────────────────────

// The conformance dimensions layer 1's tooling structurally cannot judge —
// named directly from plan.md's Architecture section (layer 2 bullet).
const REASONING_LAYER_DIMENSIONS = Object.freeze([
  'naming-conventions-beyond-regex',
  'architectural-pattern-conformance',
  'cross-file-consistency',
  'comment-hygiene-beyond-simple-patterns',
]);

function surfaceReferencePaths(surface, motionDevOverlay, rules) {
  const refs = (rules && rules.references) || { opencode: OPENCODE_REFERENCES_DIR, webflow: WEBFLOW_REFERENCES_DIR, motionOverlay: MOTION_OVERLAY_DIR };
  const paths = [];
  if (surface === 'OPENCODE') paths.push(refs.opencode);
  if (surface === 'WEBFLOW') paths.push(refs.webflow);
  if (motionDevOverlay) paths.push(refs.motionOverlay);
  return paths;
}

/**
 * Builds the structured input a reasoning agent needs to judge layer 2
 * (pattern-conformance) for one artifact. This function does NOT judge
 * anything itself — having the .cjs try to BE the reasoning agent is a
 * category error (plan.md's own framing). It only prepares the
 * well-formed dispatch packet: which dimensions to judge, which reference
 * material to read, and the exact finding shape the caller must feed back
 * via check(artifact, rules, { verifiedFindings }). The actual judgment is a
 * documented follow-on step for a future ITERATE-state reasoning
 * dispatch — not performed here.
 * @param {Object} artifact - A normalized artifact (has .path, .surface, .motionDevOverlay).
 * @param {Object} [rules] - standardSource('sk-code') output; falls back to live paths if omitted.
 * @returns {Object}
 */
function buildReasoningLayerDispatch(artifact, rules) {
  return {
    artifactPath: artifact.path,
    surface: artifact.surface,
    motionDevOverlay: !!artifact.motionDevOverlay,
    standardSourceRefs: surfaceReferencePaths(artifact.surface, artifact.motionDevOverlay, rules),
    dimensions: REASONING_LAYER_DIMENSIONS,
    instructions: 'Read the artifact at artifactPath and every path in standardSourceRefs. For each dimension, judge whether the artifact conforms to that reference material; cite file:line evidence for any contradiction found. Do not assert a finding without a specific cited line — an uncited judgment must not be reported. Feed results back into check(artifact, rules, { verifiedFindings }) using expectedFindingShape below.',
    expectedFindingShape: {
      dimension: 'one of dimensions[]',
      claim: 'string — the specific pattern checked and what was found',
      matchesStandard: 'boolean — false only for a confirmed contradiction',
      evidence: 'string, "path:line" format — required when matchesStandard is false',
      severity: 'P0|P1|P2 (default P2 if omitted)',
    },
  };
}

/**
 * Layer 2 (reasoning-agent) sub-check. Structurally VERIFY-FIRST, mirroring
 * sk-doc.cjs's checkRealityAlignment() exactly: never invents a finding from
 * nothing. options.verifiedFindings are ALREADY-JUDGED records the caller
 * produced by actually reading the artifact and the standardSource()
 * references named in buildReasoningLayerDispatch()'s packet — this function
 * only translates confirmed contradictions into findings. No
 * verifiedFindings supplied -> no findings, never a guess.
 * @param {Object} artifact
 * @param {{verifiedFindings?: Array<{dimension:string, claim:string, matchesStandard:boolean, evidence:string, severity?:string}>}} [options]
 * @returns {Array<Object>} Findings, all tagged layer:'reasoning-agent'.
 */
function checkPatternConformance(artifact, options) {
  const verifiedFindings = (options && Array.isArray(options.verifiedFindings)) ? options.verifiedFindings : [];
  const findings = [];
  for (const vf of verifiedFindings) {
    if (!vf || vf.matchesStandard !== false) continue; // only confirmed contradictions become findings
    if (!vf.evidence) continue; // never assert without cited file:line evidence
    findings.push(makeFinding({
      severity: vf.severity || 'P2',
      type: vf.dimension || 'pattern-conformance',
      subcheck: 'pattern-conformance',
      layer: 'reasoning-agent',
      message: vf.claim ? `Pattern-conformance judgment: ${vf.claim}` : 'Pattern-conformance judgment recorded a contradiction',
      artifact,
      sourceTool: 'reasoning-agent (caller-supplied)',
      detail: { dimension: vf.dimension, claim: vf.claim, evidence: vf.evidence },
    }));
  }
  return findings;
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. CHECK(ARTIFACT, RULES, OPTIONS) — TOP LEVEL
// ─────────────────────────────────────────────────────────────────────────────

function normalizeArtifact(artifact) {
  if (typeof artifact === 'string') {
    const absPath = path.isAbsolute(artifact) ? artifact : path.resolve(REPO_ROOT, artifact);
    if (!isInsideRepoRoot(absPath)) {
      throw new Error(`check(): artifact path "${artifact}" resolves outside the repo root`);
    }
    const relPath = path.relative(REPO_ROOT, absPath);
    let content = '';
    try { content = fs.readFileSync(absPath, 'utf8'); } catch (err) { /* classify from path alone */ }
    const { surface, detectedFrom } = classifySurface(relPath, content);
    return { id: relPath, kind: 'FILE', path: relPath, surface, detectedFrom, motionDevOverlay: detectMotionDevOverlay(content) };
  }
  if (artifact && typeof artifact === 'object' && typeof artifact.path === 'string') {
    if (artifact.surface) return artifact;
    const absPath = path.resolve(REPO_ROOT, artifact.path);
    let content = '';
    try { content = fs.readFileSync(absPath, 'utf8'); } catch (err) { /* classify from path alone */ }
    const { surface, detectedFrom } = classifySurface(artifact.path, content);
    return { ...artifact, surface, detectedFrom, motionDevOverlay: detectMotionDevOverlay(content) };
  }
  throw new Error('check(artifact, rules): artifact must be a path string or a discover()-shaped object with a "path" field');
}

/**
 * check(artifact, rules, options) -> findings, for the sk-code authority.
 * Two layers (deterministic, reasoning-agent), then known-deviation
 * suppression. See sk_code_adapter.md Section 4 for the full specification
 * and the rationale for why this split exists.
 * @param {string|Object} artifact - A discover()-shaped object, or a bare path string.
 * @param {Object} [rules] - standardSource('sk-code') output; knownDeviations reloaded if omitted.
 * @param {{verifiedFindings?: Array<Object>}} [options] - Caller-supplied reasoning-layer evidence.
 * @returns {Array<Object>} Findings after suppression.
 */
function check(artifact, rules, options) {
  const normalizedArtifact = normalizeArtifact(artifact);
  const absPath = path.resolve(REPO_ROOT, normalizedArtifact.path);
  const knownDeviations = (rules && Array.isArray(rules.knownDeviations)) ? rules.knownDeviations : loadKnownDeviations();
  const deterministicFindings = checkDeterministic(normalizedArtifact, absPath);
  const reasoningFindings = checkPatternConformance(normalizedArtifact, options);
  const findings = deterministicFindings.concat(reasoningFindings);
  return suppressKnownDeviations(findings, knownDeviations);
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. CLI ENTRY POINT
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
      process.stderr.write('Usage: sk-code.cjs discover [--glob] <scope-value...>\n');
      process.exitCode = 1;
      return;
    }
    printJson(discover({ type: isGlob ? 'globs' : 'paths', values }));
    return;
  }

  if (subcommand === 'check') {
    const target = rest[0];
    if (!target) {
      process.stderr.write('Usage: sk-code.cjs check <artifact-path>\n');
      process.exitCode = 1;
      return;
    }
    printJson(check(target, standardSource('sk-code')));
    return;
  }

  if (subcommand === 'standard-source') {
    printJson(standardSource('sk-code'));
    return;
  }

  if (subcommand === 'reasoning-dispatch') {
    const target = rest[0];
    if (!target) {
      process.stderr.write('Usage: sk-code.cjs reasoning-dispatch <artifact-path>\n');
      process.exitCode = 1;
      return;
    }
    printJson(buildReasoningLayerDispatch(normalizeArtifact(target), standardSource('sk-code')));
    return;
  }

  process.stderr.write('Usage: sk-code.cjs <discover|check|standard-source|reasoning-dispatch> [args...]\n');
  process.exitCode = 1;
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  discover,
  standardSource,
  check,
  classifySurface,
  detectMotionDevOverlay,
  buildReasoningLayerDispatch,
  loadKnownDeviations,
};

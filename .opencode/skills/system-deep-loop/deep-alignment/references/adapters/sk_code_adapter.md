---
title: sk-code Hybrid Adapter - standardSource, discover, check
description: The concrete standardSource("sk-code")/discover(scope)/check(artifact,rules,options) specification for the hardest of the four v1 authorities: a two-layer HYBRID check() (ADR-008 LOCKED) wrapping the real shared surface router plus verify_alignment_drift.py and the Webflow verification scripts for the deterministic layer, and a structured dispatch-packet builder (not a self-judging script) for the reasoning-agent layer.
trigger_phrases:
  - "sk-code alignment adapter"
  - "sk-code hybrid check"
  - "deep-alignment sk-code check"
  - "surface detection alignment adapter"
  - "reasoning agent dispatch packet sk-code"
importance_tier: important
contextType: implementation
version: 1.0.0.3
---

# sk-code Hybrid Adapter

The concrete `standardSource("sk-code")` / `discover(scope)` / `check(artifact, rules, options)` specification for the sk-code authority, the hardest of the four v1 `deep-alignment` authorities (ADR-004), built last so the adapter contract was already proven against sk-doc's fully-deterministic reference shape (phase 005) before this phase's honestly-partial HYBRID shape.

---

## 1. OVERVIEW

### Contract This Adapter Implements

ADR-003 (`.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md`, ANCHOR `adr-003`) freezes the same three-method, authority-agnostic contract every adapter implements: `discover(scope) -> artifacts`, `standardSource(authority) -> {templates, rules}`, `check(artifact, rules) -> findings`. This document specifies sk-code's implementation of all three, and `scripts/adapters/sk-code.cjs` is the real, executable code behind it, built to match `scripts/adapters/sk-doc.cjs`'s exact file shape (imports → constants → classifier → discover → suppression → standardSource → subprocess wrappers → check → CLI → exports) per this phase's own brief.

### ADR-008: HYBRID, Not a Deterministic Linter

ADR-008 (decision-record.md, ANCHOR `adr-008`) LOCKS this adapter's `check()` as a two-layer HYBRID: **deterministic surface-detection** (reusing sk-code's shared router, never reimplemented: REQ-001) **plus reasoning-based pattern-conformance** for everything the deterministic layer does not cover, every finding honestly labeled by producing `layer`. This document and `sk-code.cjs` implement that locked frame. They do not re-litigate whether to use it (spec.md's Open Questions §10 confirms this explicitly).

### What This Adapter Wraps (Not Reimplements)

Per REQ-001/REQ-002, four real, already-shipping sources, cited with exact line numbers so this specification stays checkable against the live files:

1. `.opencode/skills/sk-code/shared/references/stack_detection.md`: the surface-detection Detection Order (§2, lines 36-56) this adapter's `classifySurface()` ports directly.
2. `.opencode/skills/sk-code/shared/references/smart_routing.md`: the MOTION_DEV overlay's peer-category framing (§5) and the machine-readable `INTENT_SIGNALS`/`RESOURCE_MAP` this adapter's `standardSource()` points at.
3. `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py`: the real OPENCODE-surface deterministic pattern-drift checker. CLI usage at lines 110-123 (`--root` is `action='append'`, repeatable, directory-only, see Section 4.1's live-reality note). `SUPPORTED_EXTENSIONS` at lines 39-51 lists **7 languages**: TypeScript, JavaScript, Python, Shell, **Rust**, JSON and JSONC, one more than spec.md REQ-002's own acceptance-criteria prose names, "TS/JS/Python/Shell/JSON/JSONC". This was confirmed by reading the live docstring, lines 11-18, and `check_rust()`, lines 357-393, in full. It is a real spec-vs-tool discrepancy recorded here rather than silently resolved either direction. No `--json` flag exists (text stdout only, parsed by regex, Section 4.1).
4. `.opencode/skills/sk-code/code-webflow/assets/scripts/{verify-minification.mjs,test-minified-runtime.mjs}`: the real, read-only WEBFLOW-surface verification scripts (Section 4.2's live-reality findings explain why `minify-webflow.mjs`, the third script in this directory, is explicitly excluded).

Explicitly **not wrapped**: any new deterministic linter beyond what already exists (spec.md Out of Scope: "Building new deterministic linters beyond what already exists... out of scope; this phase reuses, not extends, the deterministic layer").

---

## 2. STANDARDSOURCE("SK-CODE")

`standardSource('sk-code')` returns a single object naming every real source Section 1 lists, the excluded script and the parsed known-deviation list. This is the **live output** of `node scripts/adapters/sk-code.cjs standard-source` (2026-07-11, paths shown resolved for this checkout):

```json
{
  "authority": "sk-code",
  "surfaceRouter": {
    "smartRouting": "<repo>/.opencode/skills/sk-code/shared/references/smart_routing.md",
    "stackDetection": "<repo>/.opencode/skills/sk-code/shared/references/stack_detection.md"
  },
  "validators": {
    "opencodeDrift": {
      "tool": "verify_alignment_drift.py",
      "path": "<repo>/.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py",
      "coversSurface": "OPENCODE",
      "layer": "deterministic",
      "coveredExtensions": [".ts", ".tsx", ".mts", ".js", ".mjs", ".cjs", ".py", ".sh", ".rs", ".json", ".jsonc"]
    },
    "webflowMinificationVerify": {
      "tool": "verify-minification.mjs",
      "path": "<repo>/.opencode/skills/sk-code/code-webflow/assets/scripts/verify-minification.mjs",
      "coversSurface": "WEBFLOW", "layer": "deterministic", "requiresProjectRoot": true
    },
    "webflowRuntimeTest": {
      "tool": "test-minified-runtime.mjs",
      "path": "<repo>/.opencode/skills/sk-code/code-webflow/assets/scripts/test-minified-runtime.mjs",
      "coversSurface": "WEBFLOW", "layer": "deterministic", "requiresProjectRoot": true
    }
  },
  "excludedFromCheck": [{
    "tool": "minify-webflow.mjs",
    "path": "<repo>/.opencode/skills/sk-code/code-webflow/assets/scripts/minify-webflow.mjs",
    "reason": "Writes src/2_javascript/z_minified/*.min.js and manifest.tsv -- mutates the reviewed tree, violating ADR-005/NFR-S01 read-only-by-default. plan.md named it as part of the deterministic chain; this adapter excludes it from check() (Section 4.1.2)."
  }],
  "references": {
    "opencode": "<repo>/.opencode/skills/sk-code/code-opencode/references",
    "webflow": "<repo>/.opencode/skills/sk-code/code-webflow/references",
    "motionOverlay": "<repo>/.opencode/skills/sk-code/code-webflow/references/animation"
  },
  "knownDeviations": [ /* 6 entries, parsed from sk_code_known_deviations.md Section 9 */ ]
}
```

Calling `standardSource()` with any authority other than `'sk-code'` throws. This file is the sk-code-specific implementation, not a cross-authority dispatcher (that dispatch belongs to phase 008's engine).

---

## 3. DISCOVER(SCOPE) FOR SK-CODE

### Behavior

Given a `scope` object (the real, live shape from `../discover_contract.md` §3: `{type:'paths'|'globs', values}` or `{type:'branchRange', from, to}`), `discover()`:

1. For `type:'paths'`/`type:'globs'`: resolves and walks each value against the repo root exactly as `sk-doc.cjs` does (same `isInsideRepoRoot`/`globToRegExp`/`globWalkRoot` utilities, duplicated per-adapter rather than shared. ADR-003's own Consequences section names this exact duplication as accepted until a shared helper is worth extracting).
2. Every walk skips `verify_alignment_drift.py`'s own `EXCLUDED_DIRS` (verify_alignment_drift.py:53-63: `.git`, `node_modules`, `dist`, `build`, `coverage`, `__pycache__`, `.next`, `.venv`, `venv`), reused verbatim per REQ-001, not reimplemented.
3. Collects every file matching `CODE_EXTENSIONS`: `verify_alignment_drift.py`'s own `SUPPORTED_EXTENSIONS` (11 extensions, 7 languages) **union** `.css`/`.html`, added because `stack_detection.md:28` names WEBFLOW as owning "Webflow / vanilla HTML, CSS, JavaScript" and `verify_alignment_drift.py` itself checks neither CSS nor HTML at all (confirmed: absent from its `SUPPORTED_EXTENSIONS` and from every `check_*` function). Only the narrower, OPENCODE-checkable subset gets real layer-1 coverage. CSS/HTML artifacts get a `deterministic-layer-not-applicable` finding (Section 4.1) and fall through to layer 2 only.
4. For each collected file, reads its content and calls `classifySurface(relPath, content)` (Section 3.1) and `detectMotionDevOverlay(content)` (Section 3.2), then returns `{ artifacts: [{path}, ...], nodes: [{id, kind:'FILE', name, metadata}, ...] }`, the real `discover_contract.md` §4 output shape exactly, `surface`/`detectedFrom`/`motionDevOverlay` carried in each node's `metadata`.
5. `branchRange`: returns `{artifacts:[], nodes:[]}`. sk-code's only registered artifact-class is `code` (`scripts/scoping.cjs`'s `AUTHORITY_ARTIFACT_CLASSES`), so a valid lane should never hand this adapter a `branchRange` scope. This mirrors `sk-doc.cjs`'s identical branch and rationale.

**Content-reading difference from sk-doc.cjs**: sk-doc's classifier is purely path-based (document type never depends on file content). sk-code's cannot be: `stack_detection.md` §2's own WEBFLOW detection order includes a content-grep fallback (animation-library globals, `Webflow.push`) a path-only classifier cannot reproduce faithfully, so `discover()` reads every candidate file's content (real, justified extra I/O, not gratuitous complexity).

### 3.1 Surface Classification (`classifySurface`)

Ported from `stack_detection.md` §2's real Detection Order, not reimplemented (REQ-001):

| Order | Rule | Source |
|---|---|---|
| 1 | Path is `.opencode/` or starts with `.opencode/` → **OPENCODE** | stack_detection.md:38,42,56, highest precedence |
| 2 | Path contains `/src/2_javascript/` or starts with `src/2_javascript/` → **WEBFLOW** | stack_detection.md:45 |
| 2 | Path ends `.webflow.js` → **WEBFLOW** | stack_detection.md:46 |
| 2 | Path is or ends `/wrangler.toml` → **WEBFLOW** | stack_detection.md:50 |
| 2 | Content matches `Webflow\.push\|--vw-\|window\.Motion\|window\.gsap\|gsap\.(to\|from\|set\|timeline\|registerPlugin)\|new Lenis\|new Hls\|new Swiper\|FilePond` → **WEBFLOW** | stack_detection.md:48-49, ported verbatim |
| 3 | None of the above → **UNKNOWN** | stack_detection.md:52-53 |

Rule 1 is checked first and short-circuits, exactly matching stack_detection.md's own documented precedent, including a consequence that precedent's own prose predicts and this adapter's live dry-run confirmed (Section 8).

### 3.2 MOTION_DEV Overlay Detection

`smart_routing.md` §5: "Motion.dev resources are a **peer category**... not a third surface." `detectMotionDevOverlay()` is therefore never a `surface` value: it is a boolean `metadata.motionDevOverlay` flag, tested against a Motion.dev-specific subset of the same marker family (`window\.Motion\b|Motion\.animate|\banimate\(|\binView\(|\bstagger\(|\bscroll\(\s*\{`), translated from `smart_routing.md`'s machine-readable `MOTION_DEV` `INTENT_SIGNALS` keyword list (`"animate()"`, `"inview"`, `"scroll()"`, `"stagger()"`) into a content regex, since `discover()` has file content available, not prompt text. Section 8 documents a real, honest limitation of this lightweight approach.

---

## 4. CHECK(ARTIFACT, RULES, OPTIONS)

`check()` runs two layers per artifact (deterministic, then reasoning-agent) and returns a flat findings array after known-deviation suppression, matching `sk-doc.cjs`'s exact shape. Per REQ-005, every call re-runs both layers fresh. Nothing is cached from `discover()` time or a prior `check()` call.

### 4.1 Layer 1 - Deterministic

Dispatches on the artifact's `surface` (from `classifySurface()`, re-derived if the caller passed a bare path):

#### 4.1.1 OPENCODE surface - `verify_alignment_drift.py`

1. If the artifact's extension is not in `verify_alignment_drift.py`'s own `SUPPORTED_EXTENSIONS` (for example a `.css`/`.html` file that classified OPENCODE by path), emit a single `P2` `deterministic-layer-not-applicable` finding. This tool structurally cannot check that extension, distinct from "ran and found nothing."
2. Otherwise, `spawnSync('python3', [verify_alignment_drift.py, '--root', dirname(absPath)], { cwd: REPO_ROOT })`, **for real**, same subprocess pattern `sk-doc.cjs` uses for `validate_document.py`. `--root` must be a **directory**: `verify_alignment_drift.py`'s own `iter_code_files()` walks via `os.walk(abs_root)`, which silently yields zero files for a file-shaped root (confirmed by reading the function). Passing the artifact's own path directly would silently under-scan, so this adapter always passes the artifact's *containing directory*.
3. No `--json` flag exists (confirmed by reading the full `argparse` block, lines 110-123). Stdout is text, parsed by a regex matching the tool's own fixed print format (verify_alignment_drift.py:534-537): `- {relpath}:{line} [{rule_id}] [{severity}] {message} Fix: {fix_hint}`. `cwd: REPO_ROOT` makes the tool's own `relpath()` (verify_alignment_drift.py:500-504, relative to `os.getcwd()`) print repo-relative paths matching this adapter's `artifact.path` convention.
4. The tool's own findings (for the whole scanned directory) are filtered down to just the lines matching this one artifact's repo-relative path.
5. Severity mapping (Section 7) translates the tool's own `ERROR`/`WARN` into `P0`/`P1`.
6. Subprocess failure (`python3` missing, etc.) becomes a `P1` `adapter-error` finding, distinct from an artifact-level conformance finding, the same discipline as `sk-doc.cjs`'s subprocess wrappers.

#### 4.1.2 WEBFLOW surface - the minification/verification scripts, honestly bounded

Building this adapter surfaced three real, load-bearing facts that reshape what "invoke the Webflow script chain" can honestly mean here, each verified live rather than assumed from plan.md's prose (Section 8 has full transcripts):

- **`minify-webflow.mjs` mutates the tree**. It shells out while doing it. `minify_file()` (lines 89-124) writes each `src/2_javascript/z_minified/*.min.js` output not via a direct file write but by shelling out to `execSync('npx terser "<source>" --compress --mangle -o "<output_path>"')` (line 104), a subprocess that can itself trigger an `npx` package fetch, a materially larger side effect than a plain file write. `save_manifest()` (line 146) separately writes `manifest.tsv` via `writeFileSync` (line 157). ADR-005/NFR-S01 require `check()` to be read-only by default. plan.md's Architecture section named this script as part of the deterministic chain to invoke. This adapter **excludes it from `check()` entirely** (recorded in `standardSource()`'s `excludedFromCheck`), a real, documented deviation from the plan's literal text, made because building the adapter surfaced a constraint (and a bigger one than initially assumed) the plan's prose had not accounted for, not silently reconciled.
- **`verify-minification.mjs` and `test-minified-runtime.mjs` take no path argument.** Both hardcode `SOURCE_DIR = 'src/2_javascript'` / `OUTPUT_DIR = 'src/2_javascript/z_minified'` **relative to `process.cwd()`** (confirmed by reading both scripts in full). Unlike `verify_alignment_drift.py --root <path>`, there is no way to point either script at an arbitrary artifact. They must run with `cwd` set to the actual Webflow project root. `findWebflowProjectRoot()` walks upward from the artifact's directory (bounded at `REPO_ROOT`) looking for a `src/2_javascript` subdirectory.
- **No such project root exists anywhere in this monorepo.** `find <repo-root> -type d -name "2_javascript"` and a repo-wide `wrangler.toml` search both returned **zero matches** (live, 2026-07-11, Section 8). This is not merely "WEBFLOW's deterministic layer is thinner," as the plan's Risk register anticipated: for any WEBFLOW-surface artifact currently discoverable inside this monorepo's own scope, the deterministic layer is **presently unavailable**, not thin. The scripts are written for a *consumer* repo (a live Webflow-project checkout with `src/2_javascript/` at its root) this monorepo does not itself contain.

Given a project root **is** found (a future consumer-repo lane, not this repo's own tree today):

1. If the artifact sits under `<projectRoot>/src/2_javascript/` (a source file), run `verify-minification.mjs` with `cwd: projectRoot`, parse its per-file text block (Section 4.1.3) and look up this artifact's own entry.
2. If the artifact sits under `<projectRoot>/src/2_javascript/z_minified/` (an output file), run `test-minified-runtime.mjs` with `cwd: projectRoot` the same way.
3. A `FAIL` status from either script becomes a `P0` finding: both scripts' own summaries declare a hard block on `FAIL` ("⚠️ VERIFICATION FAILED - Do not deploy!" / "⚠️ RUNTIME TESTS FAILED - Do not deploy!"), the same "drives the wrapped tool's own hard block" logic behind the OPENCODE layer's `ERROR`→`P0` mapping (Section 7).
4. `SKIP` (no counterpart file yet) or `PASS`, or no entry at all for this artifact in the tool's own output, produces no finding.

Given **no** project root is found (the default case in this repo today), or the artifact is WEBFLOW-surface but outside `src/2_javascript/` entirely (e.g. CSS/HTML): a single `P1` `deterministic-layer-unavailable` finding, per NFR-R01's own required language: "the adapter falls back to reasoning-agent-only judgment for that artifact and marks the deterministic layer as `unavailable` rather than silently treating it as clean."

#### 4.1.3 Text-Output Parsing (both Webflow scripts)

Neither script has a `--json` flag (confirmed by reading both in full). Both print a fixed per-file block shape: a bare relative-path line, then indented `  ✓ ...` / `  ✗ ...` / `  ⊘ SKIP: ...` lines, then `  RESULT: PASS|FAIL`. `parseFileBlockOutput()` (shared by both, since the block grammar is identical) parses this directly, the same "translate the wrapped tool's own real text output" discipline `sk-code.cjs`'s `verify_alignment_drift.py` parser follows.

#### 4.1.4 Surface `UNKNOWN`

Per spec.md's Data Boundaries edge case, a `P1` `surface-undetected` finding: never a silent skip, never a guessed surface.

### 4.2 Layer 2 - Reasoning-Agent (Structurally Cannot Self-Judge)

Extracting "does this code follow the surface's architectural patterns" from an artifact and judging it against `code-webflow/references/implementation/*` or `code-opencode/references/shared/universal_patterns.md` is a reasoning act: no deterministic script can invent that judgment, and having `sk-code.cjs` try to perform it internally would be **a category error** (plan.md's own framing, ADR-008). This adapter's answer, matching the task's explicit design requirement, is two separate pieces:

1. **`buildReasoningLayerDispatch(artifact, rules)`**, exported, independently callable (`node sk-code.cjs reasoning-dispatch <path>`), builds the well-formed input package a reasoning agent needs: the artifact path, its detected `surface` and `motionDevOverlay` flag, the exact `standardSource()` reference paths to read for that surface (plus the Motion overlay directory when the flag is set), the four conformance dimensions layer 1 cannot check (`naming-conventions-beyond-regex`, `architectural-pattern-conformance`, `cross-file-consistency`, `comment-hygiene-beyond-simple-patterns`, named directly from plan.md's Architecture section) and the exact `expectedFindingShape` the caller must produce. **This function never judges anything itself.** It is documentation-as-code for a follow-on step, not a hidden judgment engine.
2. **`checkPatternConformance(artifact, options)`**: the actual layer-2 sub-check inside `check()`. Mirrors `sk-doc.cjs`'s `checkRealityAlignment()` exactly: accepts `options.verifiedFindings`, an array of already-judged `{dimension, claim, matchesStandard, evidence, severity}` records the caller (a future phase-008 ITERATE-state reasoning-agent dispatch step) produced by actually reading the artifact and the cited references. A finding is emitted **only** for entries where `matchesStandard === false` **and** `evidence` is present. No `verifiedFindings` supplied → no findings, never an invented one, the identical "no verifiedClaims → no findings" invariant `sk-doc_adapter.md` §4.2 documents for its own reality-alignment sub-check.

REQ-005's VERIFY-FIRST re-probe requirement is satisfied structurally: `verifiedFindings` are supplied at `check()`-call time (never at `discover()`-time or cached from a prior pass), so a caller that re-reads the live file immediately before calling `check()` automatically satisfies "re-checked against the current file content, not a cached discover-time snapshot."

---

## 5. VERIFY-FIRST BEHAVIOR (ADR-005, HARD REQUIREMENT)

No reasoning-layer finding is ever asserted without a cited `evidence` field (`checkPatternConformance()` drops any `verifiedFindings` entry missing one). No deterministic-layer finding is ever asserted without an actual, fresh subprocess run against the live artifact in the same `check()` call (REQ-005). It is never reused from `discover()` time or a prior iteration. This mirrors `sk_doc_adapter.md` §5's identical discipline, applied to a hybrid rather than fully-deterministic adapter.

---

## 6. KNOWN-DEVIATION SUPPRESSION (ADR-005)

Every finding `check()` produces passes through `suppressKnownDeviations()` before being returned. The full seeded list, its structured evidence, and the machine-readable rule block `sk-code.cjs` actually parses live in [sk_code_known_deviations.md](./sk_code_known_deviations.md), not duplicated here. Unlike sk-doc's list, every current entry has `matchTypes: []`: the four `verify_alignment_drift.py`-native exemptions (context-advisory downgrade, test-heavy downgrade, TS pattern-asset skip, the one malformed-JSON fixture) are already reflected in that tool's own output before this adapter ever sees it, and the two adapter-specific entries (OPENCODE-precedence classification of Webflow-named tooling, Motion.dev peer-library references) are classification-outcome/reasoning-layer guidance, not finding-type suppressions. A suppression, when one is ever added, would only silence the matched deviation category on the matched artifact, never blanket-exempt the whole artifact from every other check (spec.md's Data Boundaries edge case).

---

## 7. SEVERITY MAPPING

| Source | Condition | Severity | `layer` |
|---|---|---|---|
| `verify_alignment_drift.py` | finding `severity === 'ERROR'` (drives the tool's own default exit-1 gate) | P0 | deterministic |
| `verify_alignment_drift.py` | finding `severity === 'WARN'` (present regardless of exit code, non-blocking by default) | P1 | deterministic |
| `verify_alignment_drift.py` | extension outside `SUPPORTED_EXTENSIONS` | P2 (`deterministic-layer-not-applicable`) | deterministic |
| `verify-minification.mjs` / `test-minified-runtime.mjs` | `FAIL` (drives the script's own "Do not deploy!" hard block) | P0 | deterministic |
| WEBFLOW surface, no project root or outside `src/2_javascript/` | n/a | P1 (`deterministic-layer-unavailable`) | deterministic |
| surface classification | `UNKNOWN` | P1 (`surface-undetected`) | deterministic |
| either subprocess | adapter-level failure (not an artifact defect) | P1 (`adapter-error`) | deterministic |
| reasoning-agent | caller-verified contradiction (`matchesStandard === false`, `evidence` present) | caller-supplied (default P2) | reasoning-agent |

The `ERROR`→P0 / `WARN`→P1 split mirrors `sk-doc.cjs`'s own `blocking_errors`→P0 / `warnings`→P1 structural analogy exactly: in both tools, the P0-mapped category is what independently drives *that tool's own* default exit/hard-fail behavior, and the P1-mapped category is present regardless of exit status. This is a faithful port of an existing pattern, not an invented third scale.

---

## 8. LIVE-REALITY FINDINGS (VERIFIED, NOT ASSUMED)

Building and dry-running this adapter against real repo files surfaced five genuine, load-bearing facts, exactly the class of grounded discovery `deep-alignment` exists to produce, found here by construction rather than invented for illustration. All commands below were run from the repo root on 2026-07-11.

### 8.1 The WEBFLOW deterministic layer has zero live project roots in this monorepo

```
$ find <repo-root> -type d -name "2_javascript" -not -path "*/node_modules/*"
(no output)
$ find <repo-root> -maxdepth 4 -iname "wrangler.toml" -not -path "*/node_modules/*"
(no output)
```

Confirms Section 4.1.2's claim directly: for any WEBFLOW-surface artifact this adapter can discover inside this repo's own scope, `checkWebflowDeterministic()` will report `deterministic-layer-unavailable`, not run a check. The script chain targets a consumer repo this monorepo does not itself contain.

### 8.2 sk-code's own Webflow-named tooling classifies OPENCODE, not WEBFLOW

```
$ node scripts/adapters/sk-code.cjs discover .opencode/skills/sk-code/code-webflow/assets/scripts
```
returned all three files (`minify-webflow.mjs`, `test-minified-runtime.mjs`, `verify-minification.mjs`) as `"surface": "OPENCODE"`, `"detectedFrom": "path"`, because they live under `.opencode/`, and `stack_detection.md`'s own Detection Order gives OPENCODE strict precedence, with a documented rationale (line 56) that names this exact scenario ("`.opencode/` system tools... may import vanilla animation libraries internally without being WEBFLOW-shipping artifacts"). Recorded as `sk_code_known_deviations.md` Section 6 so a reasoning-agent reviewer does not mistake this for a bug.

### 8.3 `minify-webflow.mjs` writes files (via a subprocess, not even a plain write); excluded from `check()`

Confirmed by reading the script: `minify_file()` (line 104) writes each `.min.js` output by shelling out to `execSync('npx terser ... -o <output_path>')`, and `save_manifest()` (line 157) calls `writeFileSync(MANIFEST_FILE, ...)`. Section 4.1.2 documents the exclusion. `standardSource()`'s `excludedFromCheck` records it machine-readably.

### 8.4 The deterministic OPENCODE layer is real, reproducible, and currently clean across this repo

Six live `verify_alignment_drift.py` dry-runs, increasing in corpus size, all returned `[alignment-drift] PASS` with zero findings:

| Root scanned | Files scanned | Findings |
|---|---|---|
| `deep-alignment/scripts` | 2 | 0 |
| `sk-code/code-opencode/assets/scripts` | 3 | 0 |
| `deep-review/scripts` | 7 | 0 |
| `runtime/scripts` | 14 | 0 |
| `sk-code` (whole skill) | 62 | 0 |
| `system-deep-loop` (whole hub) | 447 | 0 |

This is real, reproducible, deterministic behavior, not fabricated evidence of a violation. It is also informative on its own: either this repo's OPENCODE surface is already well-aligned to the tool's 12 mechanical rule types, or (more likely, per Section 9's estimate) those 12 rules check a narrow enough slice of "conformance" that a clean run here says little about the much larger reasoning-layer surface.

### 8.5 The MOTION_DEV content-marker regex has a real, reproducible false-positive mode

```
$ node scripts/adapters/sk-code.cjs check .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs
```
(via `discover()`'s metadata, and independently via a direct regex test against this adapter's own source) reports `"motionDevOverlay": true`: not because the file calls a Motion.dev API, but because line 134 of its own source is a docstring quoting `smart_routing.md`'s keyword list: `// smart_routing.md's machine-readable MOTION_DEV keyword list ("animate()", ...)`. The literal text `animate(` matches `MOTION_DEV_CONTENT_MARKER_RE` regardless of context. This is a real, accepted limitation of a lightweight regex-based overlay signal. It detects *mentioning* the pattern, not *using* it. This is recorded in `sk_code_known_deviations.md` Section 7 rather than silently smoothed over or hidden by excluding the adapter's own source from the demonstration.

---

## 9. AUTOMATABILITY-LIMITS STATEMENT (REQ-002, HONEST - THE WHOLE POINT OF ADR-008)

**Deterministic today (layer 1):**
- **Surface classification** (`classifySurface()`): fully deterministic, a direct port of `stack_detection.md` §2's real Detection Order. Confirmed accurate against real repo files (Section 8.2), including a correct-but-surprising precedence outcome.
- **OPENCODE pattern-drift**: real and reproducible via `verify_alignment_drift.py`. Its coverage is **12 mechanical rule types** across 7 languages: shebang-line presence, a `'use strict'` pragma, a docstring marker, a `MODULE:` header marker, `set -euo pipefail`, JSON/JSONC parseability, CRLF/UTF-8 hygiene and two Rust boundary-safety greps. Every one of these is a **syntax-shape or boilerplate-presence** check: none of them reads for architectural correctness, the right abstraction, or whether an implementation actually follows `code-opencode/references/shared/universal_patterns.md` or any per-language `style_guide.md`/`quality_standards.md`'s actual prose guidance. Six-plus full reference documents per language describe what "OPENCODE conformance" really means in this hub's own routing (`smart_routing.md` §6). The 12 mechanical rules check a narrow, real, but genuinely small slice of that.
- **WEBFLOW pattern-drift**: real and reproducible **only when a Webflow project root exists in scope**. Presently zero such roots exist anywhere in this monorepo (Section 8.1), so this layer is not merely "thinner" than OPENCODE's (as the plan's Risk register anticipated) but **currently unavailable** for every WEBFLOW-surface artifact this adapter can discover here. It remains real, working code for a consumer repo that does carry a live `src/2_javascript/` tree.

**Reasoning-agent, not automated today (layer 2):**
- All four named dimensions (naming conventions beyond simple regex, architectural/pattern conformance, cross-file consistency, comment hygiene beyond simple patterns) are 100% reasoning-agent judgment. `sk-code.cjs` does not perform this judgment. It prepares the dispatch packet (`buildReasoningLayerDispatch()`) and accepts pre-verified results back (`checkPatternConformance()`'s `options.verifiedFindings`). This is the majority of what "does this code follow the surface's stack patterns" actually asks. The mechanical layer answers a real but narrow "is the boilerplate present and does it parse" question. The reasoning layer answers the "is this the right pattern" question, and today, only a human or LLM reasoning agent can answer that.

**Honest fraction**: of the full conformance question, the deterministic layer's real, working coverage is a **minority slice restricted to mechanical hygiene** (12 OPENCODE rule types, WEBFLOW's real scripts gated on a project-root precondition presently unmet in this repo). The reasoning-agent layer covers everything else: the substantive "architectural/pattern conformance" the surface's own reference material (`code-webflow/references/implementation/*`, `code-opencode/references/shared/*`) actually prescribes. This is not a hedge. It is the concrete answer ADR-008 asked this phase to produce, and it is why every finding is layer-tagged rather than presented as one undifferentiated "conformance check."

---

## 10. REFERENCE IMPLEMENTATION

`scripts/adapters/sk-code.cjs` implements every function this document specifies: `discover(scope)`, `standardSource(authority)`, `check(artifact, rules, options)`, plus `classifySurface`, `detectMotionDevOverlay`, the three subprocess wrappers, `buildReasoningLayerDispatch` and the suppression matcher. It exposes a CLI (`discover`, `check`, `standard-source`, `reasoning-dispatch` subcommands) for a manual dry-run without any engine wiring. Every command and output shown in Section 8 above is real, reproducible output from that CLI. `node --check scripts/adapters/sk-code.cjs` passes.

---

## 11. REFERENCES AND RELATED RESOURCES

- [sk_code_known_deviations.md](./sk_code_known_deviations.md): the structured, evidence-cited suppression list.
- [sk-code.cjs](../../scripts/adapters/sk-code.cjs): the executable reference implementation.
- [sk_doc_adapter.md](./sk_doc_adapter.md), [sk-doc.cjs](../../scripts/adapters/sk-doc.cjs): the reference adapter (phase 005) this file's shape and this script's structure both copy.
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md` (ANCHORS `adr-003`, `adr-004`, `adr-005`, `adr-008`): the contract, sequencing rationale, alignment invariants and the HYBRID lock this adapter implements.
- `../discover_contract.md`, `../lane_config_schema.md`: the real, live `discover(scope)->artifacts` contract this adapter's `discover()` conforms to.
- `.opencode/skills/sk-code/shared/references/stack_detection.md`, `smart_routing.md`: the shared surface router this adapter reuses (REQ-001), never reimplements.
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py`: the real OPENCODE deterministic checker.
- `.opencode/skills/sk-code/code-webflow/assets/scripts/{verify-minification.mjs,test-minified-runtime.mjs,minify-webflow.mjs}`: the real WEBFLOW scripts (the third excluded from `check()`, Section 4.1.2).

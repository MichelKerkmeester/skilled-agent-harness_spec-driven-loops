---
title: sk-doc Reference Adapter — standardSource, discover, check
description: The concrete standardSource("sk-doc")/discover(scope)/check(artifact,rules) specification wrapping validate_document.py and extract_structure.py, the reference implementation every later deep-alignment adapter follows.
trigger_phrases:
  - "sk-doc alignment adapter"
  - "alignment reference adapter"
  - "deep-alignment sk-doc check"
  - "verify-first sk-doc findings"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# sk-doc Reference Adapter

The concrete `standardSource("sk-doc")` / `discover(scope)` / `check(artifact,rules)` specification wrapping the real, already-shipping sk-doc validators. This is the reference implementation every later `deep-alignment` adapter (sk-git/sk-design in phase 006, sk-code in phase 007) copies the shape of.

---

## 1. OVERVIEW

### Contract This Adapter Implements

ADR-003 (`.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md`, ANCHOR `adr-003`) freezes a three-method, authority-agnostic contract: `discover(scope) -> artifacts`, `standardSource(authority) -> {templates, rules}`, `check(artifact, rules) -> findings`. This document specifies sk-doc's implementation of all three, and `scripts/adapters/sk-doc.cjs` is the real, executable code behind it.

### Dependency Note: Phase 004's `discover_contract.md`

Phase 004 (`004-scoping-and-discovery`) owns the authority-agnostic `discover(scope) -> artifacts` contract every adapter must conform to. **This adapter's build started before phase 004 had executed** — its `implementation-summary.md` initially confirmed "Nothing yet... No file under `.opencode/skills/system-deep-loop/deep-alignment/` exists," and `references/discover_contract.md` did not exist on disk when work on this adapter began. Phase 004 executed **concurrently, during this adapter's own build**, landing `discover_contract.md`, `lane_config_schema.md`, `scoping_protocol.md`, and `scripts/scoping.cjs` as real, live files partway through. This adapter's `discover()` (Section 3 below, and `scripts/adapters/sk-doc.cjs`) was re-diffed against the real contract once it landed, and reconciled where the two disagreed — recorded plainly rather than silently kept on the earlier assumption:

- **Input**: `scope` is not a bare string/path array as first assumed from `plan.md`'s prose — it is the discriminated-union object `discover_contract.md` Section 3 actually specifies: `{type:'paths', values:[...]}`, `{type:'globs', values:[...]}`, or `{type:'branchRange', from, to}` (`lane_config_schema.md` Section 5), already validated against the repo root by `scripts/scoping.cjs`'s `validateScope()` before `DISCOVER` calls this method.
- **Output**: not a bare artifact array — the real contract's `{artifacts, nodes}` two-key shape (`discover_contract.md` Section 4): `artifacts` is a plain `{path}` (or `{path, ref}` for `branchRange`) per entry, and `nodes` is a parallel array shaped for `runtime/scripts/upsert.cjs --nodes` (`id`, `kind: "FILE"`, `name`, `metadata`), which is where `docType`/`detectedFrom`/`authority`/`artifactClass` actually belong per the real contract's own guidance, not on the `artifacts` entries themselves.
- **Guarantee**: unchanged from the original assumption and confirmed by the real contract — the signature carries no authority-specific parameters or branching (`discover_contract.md` Section 6).
- **`branchRange`**: `sk-doc`'s only registered artifact-class is `docs` (`scripts/scoping.cjs`'s `AUTHORITY_ARTIFACT_CLASSES`), so a valid lane should never hand this adapter a `branchRange` scope. `discover()` returns `{artifacts:[], nodes:[]}` for one rather than throwing, so an out-of-contract call fails predictably.

This adapter's `sk-doc.cjs` was written against the earlier plan-derived shape first, then corrected in place once `discover_contract.md` landed — both `node --check` and live CLI dry-runs (Section 9) were re-run after the correction to confirm the fix, not just the diff. This same specification exercise also surfaced a wording tension worth flagging rather than silently resolving: phase 004's `plan.md` NFR-P01 said sk-doc's `discover()` classification should "reuse `extract_structure.py`'s existing document-type detection... rather than re-implementing classification," while the current phase's own task brief said to "classify by `core_standards.md`'s detection order." Section 3 below documents exactly how this adapter reconciles the two, since they are not byte-identical (see "Classifier Provenance").

### What This Adapter Wraps (Not Reimplements)

Four real, already-shipping sk-doc sources, cited with exact line numbers so this specification stays checkable against the live files:

1. `.opencode/skills/sk-doc/scripts/validate_document.py` — template/format validator. CLI usage block at lines 12-27; exit codes at lines 18-20 (`0` valid, `1` invalid/blocking, `2` file-not-found/parse-error); `--type` choices at line 826 (`readme|skill|reference|asset|agent|command|install_guide|spec|changelog`); `--json` flag always prints machine-readable output regardless of the error/skip/normal path (lines 844-897).
2. `.opencode/skills/sk-doc/scripts/extract_structure.py` — Document Quality Index. `detect_document_type()` at lines 617-653; `calculate_dqi()` at line 940; DQI formula at line 951 ("Structure (40pts), Content (30pts), Style (30pts) = 100pts total"); CLI at lines 1234-1256, always prints JSON to stdout, exits `1` only when the result carries an `error` key (lines 1251-1252), `0` otherwise.
3. The `create-skill` templates under `.opencode/skills/sk-doc/create-skill/assets/` and `.opencode/skills/sk-doc/create-skill/references/` — the authored-document shape reference.
4. `.opencode/skills/sk-doc/shared/references/core_standards.md` — filename conventions (Section 2), document-type detection priority order (Section 3), structural validation rules (Sections 4-7).

Explicitly **not wrapped** by this adapter (out of this phase's scope, per `spec.md` Out of Scope): `.opencode/skills/sk-doc/scripts/quick_validate.py` (filename-casing enforcement lives there, not in either wrapped script — see `sk_doc_known_deviations.md` Section 4's Live-Reality Check).

---

## 2. STANDARDSOURCE("SK-DOC")

`standardSource('sk-doc')` returns a single object naming every real source Section 1 lists, plus the parsed known-deviation list:

```js
{
  authority: 'sk-doc',
  validators: {
    templateConformance: { tool: 'validate_document.py', path: '<repo>/.opencode/skills/sk-doc/scripts/validate_document.py' },
    dqi:                 { tool: 'extract_structure.py',  path: '<repo>/.opencode/skills/sk-doc/scripts/extract_structure.py' },
  },
  templates: {
    assetsDir:     '<repo>/.opencode/skills/sk-doc/create-skill/assets',
    referencesDir: '<repo>/.opencode/skills/sk-doc/create-skill/references',
  },
  standardsDoc: '<repo>/.opencode/skills/sk-doc/shared/references/core_standards.md',
  knownDeviations: [ /* parsed from sk_doc_known_deviations.md Section 8 */ ],
}
```

Calling `standardSource()` with any authority other than `'sk-doc'` throws — this file is the sk-doc-specific implementation, not a dispatcher across authorities (that dispatch belongs to phase 008's engine, which selects which adapter module to call).

---

## 3. DISCOVER(SCOPE) FOR SK-DOC

### Behavior

Given a `scope` object (the real, live shape — `{type:'paths'|'globs', values}` or `{type:'branchRange', from, to}`, per Section 1's dependency note), `discover()`:

1. For `type:'paths'`: resolves each `values` entry against the repo root and walks it.
2. For `type:'globs'`: computes each pattern's non-wildcard walk root, walks it, then filters the walked results against the pattern (translated to a `RegExp`) — `!`-prefixed entries in `values` are treated as negation filters, per `lane_config_schema.md` Section 5's own `"!src/**/*.test.ts"` example.
3. For `type:'branchRange'`: returns an empty result (see Section 1's dependency note for why).
4. Every walk skips the same excluded segments `validate_document.py` itself skips (`.pytest_cache`, `node_modules`, `__pycache__`, `.git`, `vendor`, `dist`, `build`, `.venv`, `venv` — ported from `validate_document.py:54-64`'s `EXCLUDED_PATH_PATTERNS`), so discovery does not waste cycles walking directories the validator would exclude anyway, and collects every `*.md` file found.
5. Classifies each file's document type (see "Classifier Provenance" below) and returns `{ artifacts: [{path}, ...], nodes: [{id, kind:'FILE', name, metadata}, ...] }` — the real `discover_contract.md` Section 4 output shape exactly, `docType`/`detectedFrom` carried in each node's `metadata`, not on the `artifacts` entries.

The `nodes` array is shaped for `runtime/scripts/upsert.cjs --nodes` (`id`, `kind`, `name`, `metadata`) so a future phase-008 DISCOVER-state caller can pass it through with minimal reshaping — but this adapter does **not** call `upsert.cjs` itself. Wiring discovered artifacts into the coverage graph, and extending `upsert.cjs`'s `loopType` validation to accept an `'alignment'` loop type, is phase 008's ITERATE/DISCOVER-state engine work (ADR-006), not this authority-adapter's job.

### Classifier Provenance

Two different instructions named two different classifiers for this adapter's `discover()`:

- This phase's task brief: "classify by `core_standards.md`'s detection order."
- `004-scoping-and-discovery/plan.md` NFR-P01: "`discover()`... should reuse `extract_structure.py`'s existing document-type detection (`extract_structure.py:617`, `detect_document_type`) rather than re-implementing classification."

Reading all three sources side by side (`core_standards.md` Section 3's table, `extract_structure.py:617-653`, and `validate_document.py:119-163`) shows they are **not** the same classifier — a real, load-bearing discrepancy this adapter surfaces rather than quietly picks a winner for:

| Source | Categories it can produce |
|--------|---------------------------|
| `core_standards.md` Section 3 (narrative table) | `readme`, `skill`, `llmstxt`, `command`, `knowledge`, `spec`, `generic` |
| `extract_structure.py:617-653` (`detect_document_type`) | `template`, `flowchart`, `skill`, `readme`, `command`, `spec`, `asset`, `reference`, `knowledge`, `generic` |
| `validate_document.py:119-163` (`detect_document_type`) | `playbook_feature`, `feature_catalog`, `command`, `install_guide`, `changelog`, `readme`, `skill`, `spec`, `agent`, `reference`, `asset` |

**Resolution**: `sk-doc.cjs`'s `classifyDocumentType()` ports `extract_structure.py:617-653` line-for-line (cited inline in code), because it is the executable function NFR-P01 explicitly names as the reuse target, and it is the more complete of the two real scripts' classifiers for path-only classification (`validate_document.py`'s classifier additionally needs file *content*, not just the path, so it cannot be reused for a pure-path `discover()` walk without first reading every file). `core_standards.md`'s table is the narrative canon describing the *intended* policy, but it is provably incomplete against both real scripts (missing `reference`/`asset`/`agent`/`install_guide`/`changelog`/`playbook_feature`/`feature_catalog`, all of which the real scripts already detect). This three-way gap between one prose doc and two real scripts is itself a legitimate first alignment-lane finding candidate once `deep-alignment` runs against `sk-doc`'s own tree — it is named here, not silently resolved, so a future iteration does not have to rediscover it.

`docType` from `classifyDocumentType()` is carried as artifact metadata (the `docType`/`detectedFrom` fields), not injected into the `discover(scope)->artifacts` contract signature itself — matching phase 004's authority-agnostic guarantee that no authority-specific parameter changes the contract shape.

---

## 4. CHECK(ARTIFACT, RULES)

`check(artifact, rules)` runs two sub-checks against one artifact, both VERIFY-FIRST (Section 5), and returns a flat findings array after known-deviation suppression (Section 6).

### 4.1 Template-Conformance

1. Run `validate_document.py <absPath> --type <artifact.docType-if-mappable> --json` via `child_process.spawnSync('python3', ...)`.
   - Exit `0`: no blocking-error findings from this sub-step.
   - Exit `1`: every entry in the JSON result's `blocking_errors` array becomes a `P0` finding (`type` taken directly from the validator's own error `type` field — this adapter does not invent its own vocabulary for validator-native errors).
   - Exit `2`: a single `P1` "could not validate" finding, per `spec.md`'s own Edge Case rule ("An artifact `validate_document.py` cannot classify... `check()` reports a P1 finding... rather than silently skipping the artifact").
   - Every entry in the JSON result's `warnings` array (present regardless of exit code) becomes a `P1` finding.
2. Run `extract_structure.py <absPath>` (no `--type` flag exists on this script; see Section 3's Classifier Provenance).
   - If `dqi.total < 75`, emit a `P2` `dqi-below-threshold` finding. `75` is the review-contract policy floor carried forward from the 130-packet's real threshold (`iteration-001.md:13,113-117`; `iteration-002.md:42`), not a value read out of `extract_structure.py` itself — that script only classifies a total into qualitative bands (`extract_structure.py:1119-1130`), it has no pass/fail notion of its own.
3. If either subprocess itself fails to run (non-artifact error — for example `python3` missing from `PATH`, or unparseable stdout), that becomes a `P1` `adapter-error` finding, tagged distinctly from an artifact-level conformance finding so it is never miscounted as a real defect in the artifact (`spec.md`'s "Error Scenarios" edge case).

### 4.2 Reality-Alignment

This sub-check is intentionally **not** a self-contained heuristic. Extracting a specific claim from an artifact's prose ("this command exists," "this script accepts this flag") and deciding how to re-probe it against live reality is a reasoning act the 130-packet's real reviews performed by hand (see Section 5's real examples) — no deterministic script can invent which claim to check or how. `sk-doc.cjs`'s `checkRealityAlignment()` therefore structurally **enforces** the VERIFY-FIRST invariant rather than performing the semantic extraction itself:

- It accepts an optional `options.verifiedClaims` array: pre-verified `{ claim, matchesLiveReality, reprobeEvidence, severity }` records, supplied by the caller (the ITERATE-state driving agent, per ADR-006) that already did the reading-and-re-probing work.
- It emits a `reality-drift` finding **only** for entries where `matchesLiveReality === false` **and** `reprobeEvidence` is present. No `verifiedClaims` supplied means no reality-alignment findings — never an invented one.

This mirrors the honesty-labeling pattern ADR-008 established for sk-code's hybrid `check()` (deterministic layer + reasoning-agent layer, every finding tagged with its real producing `layer`) — reused here on its own merits, not because ADR-008 itself governs sk-doc (it does not; ADR-008 is scoped to sk-code). Template-conformance findings are tagged `layer: 'deterministic'`; reality-alignment findings are tagged `layer: 'reasoning-agent'`. This is the same category of honesty problem (some part of `check()` is fully scriptable, some part fundamentally requires external judgment), so reusing the vocabulary keeps future adapters consistent rather than each inventing its own.

---

## 5. VERIFY-FIRST BEHAVIOR (ADR-005, HARD REQUIREMENT)

No reality-drift finding is ever asserted without first re-running the relevant validator, CLI, or grep against the live target. This is not a suggestion — it is how the 130-packet's real review actually worked, and it is the exact discipline `check()`'s design (Section 4.2) exists to preserve mechanically:

- `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-001.md:27` — "Counterevidence sought: Checked whether this was an established compact pointer-card exception; the prompt explicitly makes validator exit 0 mandatory for every document."
- `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-002.md:57` — a P0 reality-drift finding grounded in a literal live re-probe: "live `bdg 0.6.10 --help` exposes one global `status`/`stop` lifecycle and no session selector or named-session option," directly contradicting the reviewed doc's claims.
- Every P0 in both iterations carries a "Counterevidence sought" and "Downgrade trigger" field — the real pattern this adapter's `verifiedClaims` shape (Section 4.2) is designed to carry forward mechanically: a finding without re-probe evidence structurally cannot exist.

---

## 6. KNOWN-DEVIATION SUPPRESSION (ADR-005)

Every finding `check()` produces passes through `suppressKnownDeviations()` before being returned. The full seeded list, its structured evidence, and the machine-readable rule block `sk-doc.cjs` actually parses live in [sk_doc_known_deviations.md](./sk_doc_known_deviations.md) — not duplicated here. A suppression only silences the matched deviation category on the matched artifact; it never blanket-exempts the whole artifact from every other check (`spec.md`'s "Data Boundaries" edge case).

---

## 7. SEVERITY MAPPING

Per `plan.md`'s own risk-mitigation rule ("map `validate_document.py`'s own exit codes and warning/error distinctions directly onto P0/P1/P2, not a re-derived scale"):

| Source | Condition | Severity | `layer` |
|--------|-----------|----------|---------|
| `validate_document.py` | entry in `blocking_errors` (exit 1) | P0 | deterministic |
| `validate_document.py` | entry in `warnings` | P1 | deterministic |
| `validate_document.py` | exit 2 (file not found / parse error) | P1 (`could-not-validate`) | deterministic |
| `extract_structure.py` | `dqi.total < 75` | P2 (`dqi-below-threshold`) | deterministic |
| either script | adapter-level failure (not an artifact defect) | P1 (`adapter-error`) | deterministic |
| reality-alignment | caller-verified contradiction | caller-supplied (default P0) | reasoning-agent |

---

## 8. LIVE-REALITY FINDING: `validate_document.py`'S STALE ASSETS PATH (CURRENTLY BLOCKING)

Building and dry-running this adapter against real repo files (Section 9) surfaced a genuine, currently-live defect in the tool this adapter wraps — exactly the class of drift `deep-alignment` exists to catch, found here by construction rather than invented for illustration.

**The defect**: `validate_document.py`'s `load_template_rules()` hardcodes `script_dir.parent / "assets" / "template_rules.json"` (`validate_document.py:105`) — resolving to `.opencode/skills/sk-doc/assets/template_rules.json`. That path does not exist. The real file lives at `.opencode/skills/sk-doc/shared/assets/template_rules.json` (confirmed present, 22483 bytes). When the path is missing, `load_template_rules()` calls `sys.exit(2)` directly (`validate_document.py:106-108`) **before** any document is even opened — so `validate_document.py <any-file> --json` currently exits `2` and prints nothing to stdout for every invocation, regardless of the target file's own conformance.

**Root cause, confirmed via `git log`**: commit `ee5b348fd1` ("feat(sk-doc): remove hub-root assets/references facades + add create-changelog packet") deleted `sk-doc/assets/template_rules.json` as part of moving it under `sk-doc/shared/assets/`. `validate_document.py`'s own hardcoded path was never updated to match. The most recent commit touching `validate_document.py` (`24cad53438`, "convert monolith to WORKFLOW-ONLY parent hub") did not fix this either — reproduced live against current HEAD while building this adapter.

**What this means for this adapter right now**: `checkTemplateConformance()`'s `validate_document.py` half currently returns a `P1` `could-not-validate` finding for every artifact, not because of anything wrong with the artifact, but because the wrapped tool cannot run at all. This is the adapter's error-handling working *correctly* — `runValidateDocument()` (Section 4.1) does not crash; it surfaces the real exit code and the absence of JSON output exactly as designed for an adapter-level failure. `extract_structure.py` is unaffected (it has no `template_rules.json` dependency at all — confirmed by grep, zero matches for `template_rules`/`load_template_rules` in that file), so the DQI half of `checkTemplateConformance()` still works: a live re-run of `extract_structure.py` against the same file the 130-packet's R1-P0-001 flagged (`.opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-cli/README.md`, DQI 42 at review time) now scores DQI 90 ("excellent") — the file was fixed since that review, independent of this new finding.

**What this adapter does NOT do about it**: fix `validate_document.py`. That file is outside this phase's scope-lock (`.opencode/skills/sk-doc/` is not in this phase's Files to Change), and papering over the break inside `sk-doc.cjs` (for example by hardcoding the correct path ourselves and monkey-patching around the tool) would violate the "wraps, does not reimplement" principle Section 1 states — this adapter's job is to accurately reflect what the real tool does, including when the real tool is currently broken. This is recorded here as a live, operator-actionable finding, not silently routed around.

---

## 9. REFERENCE IMPLEMENTATION

`scripts/adapters/sk-doc.cjs` implements every function this document specifies: `discover(scope)`, `standardSource(authority)`, `check(artifact, rules)`, plus the classifier, the two subprocess wrappers, and the suppression matcher. It also exposes a small CLI (`discover`, `check`, `standard-source` subcommands) for a manual dry-run without any engine wiring, so this adapter is independently exercisable before phase 008's loop exists. See that file's own header comment for exact invocation examples.

---

## 10. REFERENCES AND RELATED RESOURCES

- [sk_doc_known_deviations.md](./sk_doc_known_deviations.md) — the structured, evidence-cited suppression list.
- [sk-doc.cjs](../../scripts/adapters/sk-doc.cjs) — the executable reference implementation.
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md` (ANCHORS `adr-003`, `adr-005`, `adr-008`) — the contract, alignment invariants, and honesty-labeling precedent this adapter implements.
- [../discover_contract.md](../discover_contract.md), [../lane_config_schema.md](../lane_config_schema.md), [../scoping_protocol.md](../scoping_protocol.md) — the real, live `discover(scope)->artifacts` contract this adapter's `discover()` conforms to (Section 1's dependency note). These live directly under `deep-alignment/references/` (built by phase 004, `.opencode/specs/system-deep-loop/059-deep-alignment-mode/004-scoping-and-discovery/`) — the skill packet itself has no phase-numbered subfolders.
- `.opencode/skills/sk-doc/shared/references/core_standards.md` — filename conventions and the narrative document-type detection table.

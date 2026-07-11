---
title: "Implementation Plan: Phase 5: adapter-sk-doc"
description: "Plan the sk-doc reference adapter: standardSource wiring to the real validators and templates, verify-first check(), and the known-deviation suppression list, as the template later adapters follow."
trigger_phrases:
  - "sk-doc adapter plan"
  - "alignment reference adapter plan"
  - "verify-first check plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/005-adapter-sk-doc"
    last_updated_at: "2026-07-11T14:16:14Z"
    last_updated_by: "claude"
    recent_action: "Executed the plan; built and corrected discover() against the real landed contract"
    next_safe_action: "Phase complete; no further action required for this phase's own scope"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/scripts/validate_document.py"
      - ".opencode/skills/sk-doc/scripts/extract_structure.py"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/references/discover_contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-adapter-sk-doc"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Classifier provenance: sk-doc.cjs's classifyDocumentType() ports extract_structure.py:617-653 line-for-line (per NFR-P01), not core_standards.md's narrative table -- the three sources disagree, documented rather than silently picked."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: adapter-sk-doc

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python (wrapped tools), OpenCode skill markdown (adapter spec docs), CommonJS (adapter wiring script) |
| **Framework** | Pluggable adapter contract (frozen in phase 002 as ADR-003; discovery half detailed in phase 004): `{ discover(scope)->artifacts, standardSource(authority)->templates+rules, check(artifact,rules)->findings }` |
| **Storage** | Future `deep-alignment/references/adapters/sk_doc_adapter.md`, `sk_doc_known_deviations.md`, and an adapter wiring script |
| **Testing** | None in this phase — design-only pass; a future implementation pass adds a dry-run against a known corpus (e.g. `cli-external`, `mcp-tooling`, matching the 130-packet's real scope) |

### Overview
This phase specifies the sk-doc adapter as a thin wrapper around tools that already exist and already work: `validate_document.py` for template/format conformance and `extract_structure.py` for DQI scoring. It does not design new validation logic. Its real design work is the VERIFY-FIRST discipline and the known-deviation suppression list, both proven manually in the 130/131 packets and now being specified as a repeatable, automatic behavior.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 004's `discover(scope)->artifacts` and the full three-function adapter contract are locked and re-read before drafting this adapter's implementation of them — Evidence: `discover_contract.md`, `lane_config_schema.md`, `scoping_protocol.md` read in full once they landed concurrently; `sk-doc.cjs`'s `discover()` re-diffed and corrected against them.
- [x] `.opencode/skills/sk-doc/scripts/validate_document.py` and `.opencode/skills/sk-doc/scripts/extract_structure.py` have been read in full, not just their docstrings — Evidence: both read in full (929 and 1257 lines respectively); exact CLI/exit-code/DQI behavior cited by line number throughout `sk_doc_adapter.md`.
- [x] `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-001.md` and `iteration-002.md` have been read for the real known-deviation findings this phase seeds its suppression list from — Evidence: both read in full; `iteration-001.md:14` and `iteration-002.md:116` both cited in `sk_doc_known_deviations.md`.

### Definition of Done
- [x] `standardSource("sk-doc")`, `check()`, and `discover()` are each specified with cited real-file line references, and `check()`'s VERIFY-FIRST behavior is stated as a hard requirement — Evidence: `sk_doc_adapter.md` Sections 2-5; `checkRealityAlignment()` in `sk-doc.cjs` structurally cannot emit a finding without caller-supplied `reprobeEvidence` (verified live, see `implementation-summary.md`).
- [x] The known-deviation suppression list contains only deviations traceable to a real prior finding or an explicit repo-wide convention — Evidence: all 5 entries in `sk_doc_known_deviations.md` cite `iteration-001.md`/`iteration-002.md` line numbers or a live file; 3 of 5 additionally re-verified against current `template_rules.json`/script behavior.
- [x] `validate.sh` passes `--strict` with Errors:0 on this phase folder — Evidence: see `implementation-summary.md` Verification table for the exact run.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin wrapper adapter: `discover()`/`check()` call the real sk-doc tools and templates; the adapter's own code is glue and severity-mapping, not a reimplementation of document validation.

### Key Components (built — see `sk_doc_adapter.md` for the as-built specification, which supersedes the plan-time detail below where the two differ, notably `discover()`'s real input/output shape)

**`standardSource("sk-doc")`** — a mapping to four real sources:
1. `.opencode/skills/sk-doc/scripts/validate_document.py` — template/format validator. Usage block at `validate_document.py:11-27`; exit codes `0` (valid), `1` (blocking errors), `2` (file-not-found/parse-error), per `validate_document.py:18-20`. Supports `--type` (readme/skill/reference/asset/agent/command/install_guide/spec/changelog), `--json`, `--fix --dry-run`, `--blocking-only`.
2. `.opencode/skills/sk-doc/scripts/extract_structure.py` — Document Quality Index. `calculate_dqi()` at `extract_structure.py:940` computes Structure (40pts) + Content (30pts) + Style (30pts) = 100pts total (`extract_structure.py:951`), against type-specific `CONTENT_THRESHOLDS` (`extract_structure.py:896-937`, e.g. `skill` type expects 2000-8000 words and >=6 headings).
3. The `create-skill` templates under `.opencode/skills/sk-doc/create-skill/assets/` and `.opencode/skills/sk-doc/create-skill/references/` — the authored-document shape reference (including the `parent_skill/` sub-templates already used as scaffold precedent in phase 003 of this same packet).
4. `.opencode/skills/sk-doc/shared/references/core_standards.md` — filename conventions (§2), document-type detection priority order (§3), and structural validation rules.

**`check(artifact, rules)`** — two sub-checks, both VERIFY-FIRST:
1. **Template-conformance**: run `validate_document.py <artifact> --type <detected-type> --json` and translate its blocking/non-blocking findings directly into P0/P1 alignment findings; run `extract_structure.py` and surface a DQI-below-threshold artifact as a P2 finding (quality, not conformance-blocking).
2. **Reality-alignment**: for any claim the artifact makes about live system behavior (a command exists, a script accepts a flag, a path is correct), the adapter re-probes the live target before asserting a finding — never trusts the artifact's own prose. This exactly matches the proven pattern at `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-001.md:27`: "Counterevidence sought: Checked whether this was an established compact pointer-card exception; the prompt explicitly makes validator exit 0 mandatory for every document."
3. Both sub-checks consult the known-deviation suppression list (below) before emitting a finding; a match suppresses that specific finding category, not the whole artifact.

**Known-deviation suppression list** (`sk_doc_known_deviations.md`, built) — seeded from real findings, not hypotheticals, and shipped as the single source of truth its own embedded `json` block is parsed from at runtime (`loadKnownDeviations()`):
- Repo-wide TOC ban (`.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-001.md:14`), despite `validate_document.py`'s own docstring describing "proper TOC" as part of its default checklist (`validate_document.py:10`) — this is exactly the kind of drift-vs-convention distinction the alignment contract exists to make. Re-verified against live `template_rules.json`: `tocRequired` is `false` for all 12 document types, so this is currently dormant, not currently load-bearing.
- Compact pointer-card DQI shape (same citation) — narrowed on build to only suppress `dqi-below-threshold` when the structural gate already passed (`validate_document.py` exit 0), matching the 130-packet's own explicit rejection of the exemption for structurally-failing files.
- Kebab-case legacy filename references, despite `core_standards.md`'s snake_case filename convention (`core_standards.md:32-38`) — an intentional legacy exception, not a defect. Currently dormant: neither wrapped script checks filename casing.
- cli-family `hard_rules` frontmatter shape (same citation) — currently dormant: neither wrapped script validates for unexpected/extra SKILL.md frontmatter fields.
- Changelog plain-H2, no-TOC convention, confirmed live at `.opencode/skills/system-deep-loop/deep-review/changelog/v1.0.0.0.md:1-10` and independently at `deep-alignment/changelog/v1.0.0.0.md:1-24`.

**`discover(scope)` for `docs`/`sk-doc`** — built as specified, with one correction once the real contract landed: `scope` is the discriminated-union object `discover_contract.md` actually specifies (`{type:'paths'|'globs', values}` or `{type:'branchRange', from, to}`), not the bare path array this plan's prose assumed. Enumerates matching `.md` files (real glob matching for `globs` scope, not just directory walking), classifies each with the same priority-order logic `extract_structure.py`'s `detect_document_type()` (`extract_structure.py:617`) already implements, and returns `{artifacts, nodes}` in the exact shape phase 004's real `discover()` contract specifies — no sk-doc-specific fields added to the corpus shape itself; type classification travels as each node's `metadata`, not a contract extension.

### Data Flow
Lane `(sk-doc, docs, scope)` -> `discover(scope)` enumerates + classifies files -> corpus fed to DISCOVER-state coverage-graph seeding (phase 004) -> ITERATE state calls `check(artifact, standardSource("sk-doc"))` per artifact -> template-conformance + reality-alignment findings, each pre-filtered through the suppression list -> P0/P1/P2 findings feed phase 008's alignment-report reducer.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase is not a bug fix — it is a new-feature build, not a remediation of an existing defect. It does write real files (`spec.md` §3's Files to Change table), but those files are inert reference/script additions under `.opencode/skills/system-deep-loop/deep-alignment/`, not yet wired into any live invocation path: phase 008 owns the ITERATE/DISCOVER-state engine wiring that would actually call this adapter, and phase 009 owns command/agent/advisor cutover. No existing production surface changes behavior as a result of this phase.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `.opencode/skills/sk-doc/scripts/validate_document.py` in full for its CLI contract and exit-code semantics — 929 lines, read in full.
- [x] Read `.opencode/skills/sk-doc/scripts/extract_structure.py` in full for its DQI scoring and document-type detection — 1257 lines, read in full.
- [x] Read `.opencode/skills/sk-doc/shared/references/core_standards.md` for filename conventions and document-type detection priority order — read in full.
- [x] Read `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-001.md` and `iteration-002.md` for the real known-deviation findings and the verify-first counterevidence pattern — both read in full.
- [x] Re-read phase 004's finalized `discover(scope)->artifacts` contract signature — read `discover_contract.md`, `lane_config_schema.md`, `scoping_protocol.md`, `scripts/scoping.cjs` once they landed concurrently during this phase's own build.

### Phase 2: Core Implementation
- [x] Author `deep-alignment/references/adapters/sk_doc_adapter.md` with the `standardSource`/`check`/`discover` specification from §3 — `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_adapter.md`, 10 sections.
- [x] Author `deep-alignment/references/adapters/sk_doc_known_deviations.md` seeded with the four findings plus the changelog convention — `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_known_deviations.md`, 5 entries, each evidence-cited.
- [x] Implement the adapter wiring script that shells out to `validate_document.py --json` and `extract_structure.py`, mapping their output onto P0/P1/P2 findings — `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs`, `runValidateDocument`/`runExtractStructure`/`checkTemplateConformance`.
- [x] Implement `discover()` for the `docs`/`sk-doc` lane, reusing `extract_structure.py`'s document-type detection logic rather than reimplementing it — `classifyDocumentType()` in `sk-doc.cjs`, ported 1:1 from `extract_structure.py:617-653`.

### Phase 3: Verification
- [x] Dry-run the adapter against a known corpus (e.g. `cli-external`, `mcp-tooling`) and confirm it reproduces the 130-packet's real findings, minus the four suppressed deviations — ran `sk-doc.cjs check` against `.opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-cli/README.md` (the exact R1-P0-001 file); the original finding no longer reproduces because the file was independently fixed since the review (DQI 42 -> 90 live), and the adapter instead correctly surfaced a new, real, live `validate_document.py` defect (`sk_doc_adapter.md` §8) rather than a false positive.
- [x] Confirm the adapter never asserts a reality-drift finding without first re-running the relevant validator against the live target (VERIFY-FIRST) — verified live: a 3-claim `verifiedClaims` fixture (matched / contradicted-with-evidence / contradicted-without-evidence) produced exactly 1 finding, for the only claim carrying both a contradiction and cited evidence.
- [x] Confirm the adapter's `discover()`/`check()` signatures match phase 004's contract exactly, with no sk-doc-specific parameter added — re-diffed against the real `discover_contract.md` once it landed; corrected `sk-doc.cjs` in place (`scope` object shape, `{artifacts,nodes}` output shape); re-verified via `node --check` and live CLI dry-run after the correction.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Documentation | This phase's own spec-folder documents | `validate.sh --strict` |
| Manual/live | Adapter wiring, `discover()`, suppression-list matching | `node --check` + live CLI dry-runs (`discover`/`check`/`standard-source`) against real repo files; a 6-case fixture for suppression-matching boundaries; a 3-claim fixture for the reality-alignment VERIFY-FIRST gate — see `implementation-summary.md` Verification |
| Live replay | Full adapter dry-run against a known corpus | Ran against `.opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-cli/README.md` (the real R1-P0-001 file); see Phase 3's own verification note for the outcome |
| Deferred | Formal Vitest suite | Not shipped in this phase — the phase's scope-lock names exactly 3 new files (`sk_doc_adapter.md`, `sk_doc_known_deviations.md`, `sk-doc.cjs`); a permanent `tests/` file would be a 4th file outside that lock. Live-verified via the manual/live row above instead; a formal suite is a reasonable follow-up once phase 008 wires this adapter into the engine and a real test harness location is chosen. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 004-scoping-and-discovery | Internal | Resolved (executed concurrently during this phase's build) | Would have left no finalized `discover()` contract to build against; instead required an in-flight correction, completed and verified |
| `.opencode/skills/sk-doc/scripts/validate_document.py` | Internal | **Degraded** — file present and its CLI/exit-code contract accurately cited, but its own `template_rules.json` path resolution is currently broken (`sk_doc_adapter.md` §8), so it cannot run standalone at all right now | This adapter's template-conformance sub-check currently always reports a `P1 could-not-validate` adapter-error finding rather than a real per-artifact conformance result, until this upstream defect is fixed |
| `.opencode/skills/sk-doc/scripts/extract_structure.py` | Internal | Green — confirmed working live (no `template_rules.json` dependency) | Without it, DQI scoring and document-type detection have no real tool to wrap |
| `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/` | Internal | Green | Without it, the suppression list and VERIFY-FIRST behavior would be designed from theory instead of a proven real run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase 004's contract changes shape again in a way that invalidates this adapter's `discover()`/`check()` signatures, or the discovered `validate_document.py` bug's eventual fix changes that script's exit/output contract.
- **Procedure**: `git rm` the 3 files this phase added (`sk_doc_adapter.md`, `sk_doc_known_deviations.md`, `sk-doc.cjs`) and revert this phase's spec-folder docs to their pre-build state; no other file in the repo depends on these three yet (phase 008 has not wired them in), so removal is fully self-contained.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
004 (Scoping + Discovery) ──────► 005 (sk-doc adapter) ──────► 006 (sk-git + sk-design adapters)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 004-scoping-and-discovery | 003-scaffold-mode-packet | 005 |
| 005-adapter-sk-doc | 004-scoping-and-discovery | 006, 008 |
| 006-adapter-sk-git-and-sk-design | 005-adapter-sk-doc (shape precedent) | 007 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Actual Effort |
|-------|------------|------------------|
| Setup | Low | Read four existing files/directories in full, plus three more once phase 004 landed concurrently (`discover_contract.md`, `lane_config_schema.md`, `scoping_protocol.md`) |
| Core Implementation | Medium | Two reference docs plus a 500+-line adapter wiring script; required one in-flight correction once the real `discover()` contract landed |
| Verification | Medium | Live CLI dry-runs, a 6-case suppression-matching fixture, a 3-claim reality-alignment fixture, and a live replay against a real 130-packet corpus file — surfaced one genuine upstream defect (`sk_doc_adapter.md` §8) in the process |
| **Total** | | One session; see `implementation-summary.md` for the full evidence trail |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] N/A — this phase ships inert reference/script files, not a deployed/wired production surface. Nothing runs these files yet; phase 008 owns that wiring.

### Rollback Procedure
1. `git rm` the 3 files this phase added (`sk_doc_adapter.md`, `sk_doc_known_deviations.md`, `sk-doc.cjs`) and revert this phase's spec-folder docs; nothing else in the repo references them yet.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->

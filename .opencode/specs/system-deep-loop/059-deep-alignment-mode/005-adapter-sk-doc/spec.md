---
title: "Feature Specification: Phase 5: adapter-sk-doc"
description: "Plan the sk-doc reference adapter: standardSource from validate_document.py + extract_structure.py DQI + create-skill templates + core_standards.md, and check with template-conformance plus verify-first reality-alignment and the known-deviation suppression list."
trigger_phrases:
  - "sk-doc alignment adapter"
  - "alignment reference adapter"
  - "deep-alignment sk-doc check"
  - "known deviation suppression list"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/005-adapter-sk-doc"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored sk-doc reference adapter plan"
    next_safe_action: "Await 004 gate before execution"
    blockers:
      - "004-scoping-and-discovery not yet executed"
    key_files:
      - ".opencode/skills/sk-doc/scripts/validate_document.py"
      - ".opencode/skills/sk-doc/scripts/extract_structure.py"
      - ".opencode/skills/sk-doc/shared/references/core_standards.md"
      - ".opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-001.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-adapter-sk-doc"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the suppression list ships as a static reference doc or a queryable rules file (phase-local build detail; ADR-005 only requires a per-authority list)"
    answered_questions: []
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: adapter-sk-doc

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-11 |
| **Branch** | `deep-alignment/005-adapter-sk-doc` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 9 |
| **Predecessor** | 004-scoping-and-discovery |
| **Successor** | 006-adapter-sk-git-and-sk-design |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the `deep-alignment` deep-loop mode specification (`.opencode/specs/system-deep-loop/059-deep-alignment-mode/`).

**Scope Boundary**: this phase plans the sk-doc adapter — the first, reference implementation of the pluggable adapter contract (`{ discover(scope)->artifacts, standardSource(authority)->templates+rules, check(artifact,rules)->findings }`, frozen in phase 002 as ADR-003 and detailed for discovery in phase 004). It is sequenced first, ahead of sk-git/sk-design (006) and sk-code (007), because sk-doc conformance checking is already fully deterministic and machine-scannable: a real 10-iteration manual run of this exact check (`.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/`) already proved the approach against `cli-external` and `mcp-tooling`. This phase productizes that proven manual process into the adapter contract; it does not repeat the manual review.

**Dependencies**:
- Phase 004's `discover(scope)->artifacts` contract must be locked before this adapter's `discover()` half can be specified against it.
- `.opencode/skills/sk-doc/scripts/validate_document.py` and `.opencode/skills/sk-doc/scripts/extract_structure.py` are the real, currently-shipping standard-authority tools this adapter's `check()` half wraps, not reimplements.
- The alignment contract's four invariants (VERIFY-FIRST, KNOWN-DEVIATION SUPPRESSION, READ-ONLY default, GATED remediation) apply to every adapter; this phase is where the sk-doc-specific instance of each invariant gets specified concretely, as the template the later adapters (006, 007) follow.

**Deliverables**:
- A specified `standardSource("sk-doc")` mapping to the real validator scripts, DQI scoring, create-skill templates, and `core_standards.md`.
- A specified `check(artifact, rules)` behavior: template-conformance plus reality-alignment, both VERIFY-FIRST.
- A specified known-deviation suppression list for sk-doc, seeded from the real 130-packet findings.
- A specified `discover(scope)` implementation for the `docs` artifact-class under the `sk-doc` authority.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`deep-alignment` has no reference adapter yet. Without one, the pluggable adapter contract from phase 004 is untested against a real authority, and the later adapters (sk-git/sk-design in 006, sk-code in 007) have no proven template to follow. sk-doc is the right authority to prove the contract against first: it already ships deterministic validators (`validate_document.py`, `extract_structure.py`) and a manually-run precedent (packets 130/131) that found real drift and separated it from intentional repo-wide conventions.

### Purpose
Specify the sk-doc adapter so a future implementation pass can wrap the existing deterministic validators behind the `discover`/`standardSource`/`check` contract, reproduce the 130-packet's verify-first and known-deviation-suppression behavior automatically, and hand later adapter phases a concrete template to follow.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Plan `standardSource("sk-doc")` as a mapping to: `.opencode/skills/sk-doc/scripts/validate_document.py` (template/format validation, exit codes 0/1/2), `.opencode/skills/sk-doc/scripts/extract_structure.py` (Document Quality Index: Structure 40pts + Content 30pts + Style 30pts, `extract_structure.py:951`), the `create-skill` templates under `.opencode/skills/sk-doc/create-skill/assets/` and `references/`, and `.opencode/skills/sk-doc/shared/references/core_standards.md` (filename conventions, document-type detection, structural rules).
- Plan `check(artifact, rules)` as two sub-checks: **template-conformance** (does the artifact match its detected document type's required structure, per `core_standards.md`'s document-type-detection table) and **reality-alignment** (does the artifact's claims match the live system it describes — the VERIFY-FIRST invariant).
- Plan the VERIFY-FIRST behavior concretely for sk-doc: any reality-drift finding must be re-probed by actually running `validate_document.py`/`extract_structure.py` against the live file (or the described live behavior) before being asserted as a finding, matching the proven pattern in `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-001.md:27` ("Counterevidence sought... the prompt explicitly makes validator exit 0 mandatory for every document").
- Plan the sk-doc known-deviation suppression list, seeded from the real findings at `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-001.md:14`: repo-wide TOC ban, compact pointer-card assets, kebab-case legacy references, and cli-family `hard_rules` frontmatter; plus the changelog plain-H2 convention confirmed at `.opencode/skills/system-deep-loop/deep-review/changelog/v1.0.0.0.md:1-10`.
- Plan `discover(scope)` for the `docs` artifact-class under the `sk-doc` authority: given a scope (paths/globs), enumerate markdown files, classify each by `core_standards.md`'s document-type-detection priority order, and emit the artifact corpus the phase-004 contract expects.

### Out of Scope
- Actually building any script, adapter module, or reference doc under `.opencode/skills/system-deep-loop/deep-alignment/` — a future implementation pass owns that, gated behind 004's execution.
- Any other authority's adapter (sk-git, sk-design in 006; sk-code in 007) — this phase only produces the template they follow.
- Iteration, convergence, or report generation — phase 008 owns those.
- Command/agent/advisor cutover — phase 009 owns that.
- Re-running the 130-packet's manual review — that packet is read-only precedent evidence, not work this phase repeats.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_adapter.md` | Create (future) | The `standardSource`/`check`/`discover` specification for sk-doc, deferred to the implementation pass |
| `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_known_deviations.md` | Create (future) | The seeded known-deviation suppression list, deferred to the implementation pass |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs` (or equivalent) | Create (future) | The adapter's executable wiring to `validate_document.py`/`extract_structure.py`, deferred to the implementation pass and to the reuse-boundary resolution (open ADR-010, phase 008) that settles the `scripts/` directory question |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The `standardSource("sk-doc")` plan names every real tool it wraps, with citable paths. | `plan.md` §3 cites `.opencode/skills/sk-doc/scripts/validate_document.py`, `.opencode/skills/sk-doc/scripts/extract_structure.py`, the create-skill templates directory, and `core_standards.md`, each with a real path. |
| REQ-002 | The `check()` plan states the VERIFY-FIRST rule as a hard requirement, not a suggestion. | `plan.md` §3 states that no reality-drift finding is asserted without first re-running the relevant validator or grep against the live target, citing the 130-packet's proven counterevidence-seeking pattern. |
| REQ-003 | The known-deviation suppression list plan seeds real, already-discovered deviations rather than inventing hypothetical ones. | `spec.md` §3 lists the four deviations found in the real 130-packet review plus the changelog plain-H2 convention, each with a citable source. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The `discover(scope)` plan for sk-doc conforms exactly to phase 004's authority-agnostic contract signature. | `plan.md` §3 shows the sk-doc `discover()` taking only a `scope` argument and returning the same artifact-corpus shape phase 004 specifies, with no sk-doc-specific parameter added to the signature. |
| REQ-005 | The plan states explicitly that later adapters (006, 007) should follow this phase's shape rather than re-deriving their own. | `spec.md` Phase Context states this adapter is sequenced first as "the template every other adapter follows." |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A future implementation pass can wire `validate_document.py` and `extract_structure.py` into the adapter's `check()` without inventing new validation logic — the plan reuses, it does not reimplement.
- **SC-002**: The known-deviation suppression list, once implemented, prevents the four seeded deviations from ever being raised as findings again, matching the real 130-packet outcome.
- **SC-003**: No live file under `.opencode/skills/system-deep-loop/deep-alignment/` exists at the close of this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 004's `discover(scope)->artifacts` contract not yet executed | This adapter's `discover()` plan could drift from the final signature | Restate the contract exactly as phase 004 specifies it; do not add sk-doc-specific parameters |
| Risk | Suppression list becomes a dumping ground for every future false positive instead of staying evidence-seeded | Findings quality erodes over time, the mode stops proving real drift | Require every suppression-list entry to cite a real prior finding or an explicit repo-wide convention, per REQ-003's acceptance criteria |
| Risk | `check()` treats validator warnings and errors identically, over- or under-weighting severity | Findings severity (P0/P1/P2) would misrepresent real risk | Plan `check()` to map `validate_document.py`'s own exit codes (0/1/2) and warning/error distinctions directly onto P0/P1/P2, not a re-derived scale |
| Dependency | `validate_document.py`/`extract_structure.py` API stability | If their CLI flags or exit codes change, the adapter wiring plan needs revision | Cite the exact current usage block (`validate_document.py:11-27`) as the contract surface this phase plans against |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `discover()` for the `docs` artifact-class should reuse `extract_structure.py`'s existing document-type detection (`extract_structure.py:617`, `detect_document_type`) rather than re-implementing classification, so discovery stays as fast as the existing tool.

### Security
- **NFR-S01**: `check()` must only invoke `validate_document.py`/`extract_structure.py` in read-only modes (no `--fix`) during the default alignment run, matching the alignment contract's READ-ONLY default invariant.

### Reliability
- **NFR-R01**: VERIFY-FIRST re-probing must use the same validator invocation every time for the same artifact, so two runs of the same lane against unchanged files produce identical findings.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- An artifact `validate_document.py` cannot classify (exit code 2, file not found or parse error): `check()` reports a P1 finding ("could not validate") rather than silently skipping the artifact.
- An artifact matching a suppressed known-deviation pattern that ALSO has a genuine unrelated defect: the suppression only silences the matched deviation category, not the whole artifact.

### Error Scenarios
- `validate_document.py` itself errors (not the artifact) — for example a missing dependency: `check()` surfaces this as an adapter-level error distinct from an artifact-level finding, so it cannot be miscounted as a conformance defect.

### State Transitions
- A suppression-list entry that stops matching real repo state (the convention it protected gets removed): flagged for the operator to review at REPORT time, not silently dropped or silently kept.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Three future files (adapter spec, suppression list, wiring script); the underlying validators already exist and are reused, not built |
| Risk | 10/25 | No production surface changed in this phase; adapter-design risk only |
| Research | 16/20 | Requires the phase-004 contract, both real validator scripts, `core_standards.md`, and the 130-packet's real findings |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether the suppression list ships as a static reference doc or a queryable rules file the adapter loads programmatically — a phase-local design detail settled at this phase's execution pass; ADR-005 locks only that a per-authority list exists, not its file format.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

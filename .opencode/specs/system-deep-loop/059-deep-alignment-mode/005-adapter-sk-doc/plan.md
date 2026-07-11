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
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted sk-doc reference adapter plan"
    next_safe_action: "Await 004 gate before execution"
    blockers:
      - "004-scoping-and-discovery not yet executed"
    key_files:
      - ".opencode/skills/sk-doc/scripts/validate_document.py"
      - ".opencode/skills/sk-doc/scripts/extract_structure.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-adapter-sk-doc"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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
- [ ] Phase 004's `discover(scope)->artifacts` and the full three-function adapter contract are locked and re-read before drafting this adapter's implementation of them.
- [ ] `.opencode/skills/sk-doc/scripts/validate_document.py` and `.opencode/skills/sk-doc/scripts/extract_structure.py` have been read in full, not just their docstrings.
- [ ] `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-001.md` and `iteration-002.md` have been read for the real known-deviation findings this phase seeds its suppression list from.

### Definition of Done
- [ ] `standardSource("sk-doc")`, `check()`, and `discover()` are each specified with cited real-file line references, and `check()`'s VERIFY-FIRST behavior is stated as a hard requirement.
- [ ] The known-deviation suppression list contains only deviations traceable to a real prior finding or an explicit repo-wide convention.
- [ ] `validate.sh` passes `--strict` with Errors:0 on this phase folder.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin wrapper adapter: `discover()`/`check()` call the real sk-doc tools and templates; the adapter's own code is glue and severity-mapping, not a reimplementation of document validation.

### Key Components (planned, not yet built)

**`standardSource("sk-doc")`** — a mapping to four real sources:
1. `.opencode/skills/sk-doc/scripts/validate_document.py` — template/format validator. Usage block at `validate_document.py:11-27`; exit codes `0` (valid), `1` (blocking errors), `2` (file-not-found/parse-error), per `validate_document.py:18-20`. Supports `--type` (readme/skill/reference/asset/agent/command/install_guide/spec/changelog), `--json`, `--fix --dry-run`, `--blocking-only`.
2. `.opencode/skills/sk-doc/scripts/extract_structure.py` — Document Quality Index. `calculate_dqi()` at `extract_structure.py:940` computes Structure (40pts) + Content (30pts) + Style (30pts) = 100pts total (`extract_structure.py:951`), against type-specific `CONTENT_THRESHOLDS` (`extract_structure.py:896-937`, e.g. `skill` type expects 2000-8000 words and >=6 headings).
3. The `create-skill` templates under `.opencode/skills/sk-doc/create-skill/assets/` and `.opencode/skills/sk-doc/create-skill/references/` — the authored-document shape reference (including the `parent_skill/` sub-templates already used as scaffold precedent in phase 003 of this same packet).
4. `.opencode/skills/sk-doc/shared/references/core_standards.md` — filename conventions (§2), document-type detection priority order (§3), and structural validation rules.

**`check(artifact, rules)`** — two sub-checks, both VERIFY-FIRST:
1. **Template-conformance**: run `validate_document.py <artifact> --type <detected-type> --json` and translate its blocking/non-blocking findings directly into P0/P1 alignment findings; run `extract_structure.py` and surface a DQI-below-threshold artifact as a P2 finding (quality, not conformance-blocking).
2. **Reality-alignment**: for any claim the artifact makes about live system behavior (a command exists, a script accepts a flag, a path is correct), the adapter re-probes the live target before asserting a finding — never trusts the artifact's own prose. This exactly matches the proven pattern at `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-001.md:27`: "Counterevidence sought: Checked whether this was an established compact pointer-card exception; the prompt explicitly makes validator exit 0 mandatory for every document."
3. Both sub-checks consult the known-deviation suppression list (below) before emitting a finding; a match suppresses that specific finding category, not the whole artifact.

**Known-deviation suppression list** (`sk_doc_known_deviations.md`, future) — seeded from real findings, not hypotheticals:
- Repo-wide TOC ban (`.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-001.md:14`), despite `validate_document.py`'s own docstring describing "proper TOC" as part of its default checklist (`validate_document.py:10`) — this is exactly the kind of drift-vs-convention distinction the alignment contract exists to make.
- Compact pointer-card asset shape (same citation).
- Kebab-case legacy filename references, despite `core_standards.md`'s snake_case filename convention (`core_standards.md:32-38`) — an intentional legacy exception, not a defect.
- cli-family `hard_rules` frontmatter shape (same citation).
- Changelog plain-H2, no-TOC convention, confirmed live at `.opencode/skills/system-deep-loop/deep-review/changelog/v1.0.0.0.md:1-10`.

**`discover(scope)` for `docs`/`sk-doc`** — given a scope (paths/globs), enumerate matching `.md` files, classify each with the same priority-order logic `extract_structure.py`'s `detect_document_type()` (`extract_structure.py:617`) already implements, and emit the artifact corpus (file path + detected type) in the exact shape phase 004's `discover()` contract specifies — no sk-doc-specific fields added to the corpus shape itself; type classification travels as artifact metadata, not a contract extension.

### Data Flow
Lane `(sk-doc, docs, scope)` -> `discover(scope)` enumerates + classifies files -> corpus fed to DISCOVER-state coverage-graph seeding (phase 004) -> ITERATE state calls `check(artifact, standardSource("sk-doc"))` per artifact -> template-conformance + reality-alignment findings, each pre-filtered through the suppression list -> P0/P1/P2 findings feed phase 008's alignment-report reducer.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase is not a bug fix and touches zero production surfaces; it produces planning documentation only, scoped to `.opencode/specs/system-deep-loop/059-deep-alignment-mode/005-adapter-sk-doc/`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `.opencode/skills/sk-doc/scripts/validate_document.py` in full for its CLI contract and exit-code semantics.
- [ ] Read `.opencode/skills/sk-doc/scripts/extract_structure.py` in full for its DQI scoring and document-type detection.
- [ ] Read `.opencode/skills/sk-doc/shared/references/core_standards.md` for filename conventions and document-type detection priority order.
- [ ] Read `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-001.md` and `iteration-002.md` for the real known-deviation findings and the verify-first counterevidence pattern.
- [ ] Re-read phase 004's finalized `discover(scope)->artifacts` contract signature.

### Phase 2: Core Implementation (future execution pass — not run in this phase)
- [ ] Author `deep-alignment/references/adapters/sk_doc_adapter.md` with the `standardSource`/`check`/`discover` specification from §3.
- [ ] Author `deep-alignment/references/adapters/sk_doc_known_deviations.md` seeded with the four findings plus the changelog convention.
- [ ] Implement the adapter wiring script that shells out to `validate_document.py --json` and `extract_structure.py`, mapping their output onto P0/P1/P2 findings.
- [ ] Implement `discover()` for the `docs`/`sk-doc` lane, reusing `extract_structure.py`'s document-type detection logic rather than reimplementing it.

### Phase 3: Verification (future execution pass — not run in this phase)
- [ ] Dry-run the adapter against a known corpus (e.g. `cli-external`, `mcp-tooling`) and confirm it reproduces the 130-packet's real findings, minus the four suppressed deviations.
- [ ] Confirm the adapter never asserts a reality-drift finding without first re-running the relevant validator against the live target (VERIFY-FIRST).
- [ ] Confirm the adapter's `discover()`/`check()` signatures match phase 004's contract exactly, with no sk-doc-specific parameter added.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Planning-only | This phase's own spec-folder documents | `validate.sh --strict` |
| Deferred unit | Adapter wiring, discover(), suppression-list matching | Vitest, run when this phase's execution pass actually happens |
| Deferred replay | Full adapter dry-run against a known corpus | Manual comparison against the real 130-packet findings registry, deferred to execution pass |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 004-scoping-and-discovery | Internal | Pending | No finalized `discover()` contract to implement against |
| `.opencode/skills/sk-doc/scripts/validate_document.py` | Internal | Green | Without it, template-conformance checking has no real tool to wrap |
| `.opencode/skills/sk-doc/scripts/extract_structure.py` | Internal | Green | Without it, DQI scoring and document-type detection have no real tool to wrap |
| `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/` | Internal | Green | Without it, the suppression list and VERIFY-FIRST behavior would be designed from theory instead of a proven real run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase 004's contract changes shape in a way that invalidates this adapter's `discover()`/`check()` signatures.
- **Procedure**: Revise this phase's spec.md/plan.md/tasks.md/checklist.md to match the new contract before any execution pass runs; no live files exist yet, so no code rollback is needed.
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

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Read four existing files/directories |
| Core Implementation (future) | Medium | Two reference docs plus an adapter wiring script that shells out to existing tools |
| Verification (future) | Medium | A real dry-run comparison against the 130-packet's findings registry |
| **Total** | | Deferred to the execution pass this phase plans for |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] N/A — no deployment in this planning phase.

### Rollback Procedure
1. This phase creates zero live files; there is nothing to roll back beyond reverting spec-folder edits if phase 004's contract changes.

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

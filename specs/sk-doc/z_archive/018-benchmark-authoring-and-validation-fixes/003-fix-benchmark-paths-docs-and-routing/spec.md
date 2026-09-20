---
title: "Feature Specification: create-benchmark audit remediation"
description: "A two-model (GPT-5.6 SOL + LUNA) audit found create-benchmark complete but surrounded by stale pointers and drift: broken _shared refs, a stale README, a hyphen/underscore Lane B path defect in deep-improvement, a stale deep-alignment index, and missing hub routing metadata. This packet fixes all P0/P1/P2 findings."
trigger_phrases:
  - "create-benchmark audit remediation"
  - "benchmark _shared fix"
  - "lane b hyphen underscore"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-benchmark-authoring-and-validation-fixes/003-fix-benchmark-paths-docs-and-routing"
    last_updated_at: "2026-07-14T08:20:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored spec for the create-benchmark audit remediation"
    next_safe_action: "Dispatch fix agents, then verify and fill the checklist"
    blockers: []
    key_files: []
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Feature Specification: create-benchmark audit remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-14 |
| **Branch** | `fix/create-benchmark-audit-remediation` |
| **Parent** | `sk-doc/018-benchmark-authoring-and-validation-fixes` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | `../002-complete-benchmark-guides-and-links/spec.md` |
| **Successor** | `../004-align-benchmark-docs-and-runtime/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An independent two-model audit (GPT-5.6 SOL max + LUNA max) of `sk-doc/create-benchmark` confirmed the packet's benchmark-family coverage is intentionally complete, but the code and docs around it carry real staleness and drift: three broken `_shared` references in `SKILL.md`, a semantically stale `README.md`, a confirmed hyphen/underscore Lane B path defect where 70 committed references point at `benchmark-profiles`/`benchmark-fixtures` while the on-disk dirs are underscore, a `deep-alignment` behavior-benchmark index that contradicts its own captured baseline, and hub routing metadata that omits the Lane A family the packet now documents.

### Purpose
Every audit finding (P0/P1/P2) is fixed so create-benchmark, its deep-loop consumers, and the sk-doc hub agree with each other and with the create-skill canon, with no broken reference, stale claim, or dangling path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Repair the 3 stale `_shared` references and README staleness in create-benchmark; add missing canon sections and concrete Smart Routing data.
- Resolve the Lane B hyphen/underscore defect by renaming the two directories to hyphens (operator-chosen direction) and aligning all live references.
- Reconcile the deep-alignment behavior-benchmark index to its captured baseline.
- Add Lane A routing keyword coverage to the sk-doc hub metadata.
- Reconcile the Lane B output-contract discrepancy to the runtime's real behavior.

### Out of Scope
- The broader repo-wide hyphen migration (packet 017) — only the two Lane B dirs are renamed here, per operator direction; other family names stay untouched.
- Editing frozen historical run-report artifacts (`deep-improvement/benchmark/*/skill-benchmark-report.json`) — they record past state.
- Rewriting benchmark scoring/evaluator contracts — those stay lane-owned.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/create-benchmark/SKILL.md` | Modify | `_shared`→`shared`; concrete Smart Router; add sections; hyphenate Lane B dir refs |
| `.opencode/skills/sk-doc/create-benchmark/README.md` | Modify | De-stale family count + Lane A ownership; fix inventory |
| `.opencode/skills/sk-doc/create-benchmark/references/**`, `assets/**` | Modify | Prose section numbers; version-field reconciliation |
| `.opencode/skills/sk-doc/{hub-router.json,mode-registry.json}` | Modify | Add Lane A routing keywords |
| `.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark_{profiles,fixtures}` | Rename | → hyphenated dir names |
| `.opencode/skills/system-deep-loop/deep-improvement/**`, `.opencode/commands/deep/**` | Modify | Align refs to hyphen; reconcile output contract |
| `.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/**` | Modify | Reconcile index to captured baseline |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Resolve the Lane B hyphen/underscore mismatch | The two dirs are renamed to hyphen; `DEFAULT_PROFILES_DIR` resolves on disk; the two referencing vitest suites pass; no live (non-historical) underscore ref to those two dirs remains |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Fix the 3 `_shared` refs in SKILL.md | `grep -rn '_shared'` in create-benchmark returns 0 |
| REQ-003 | De-stale README.md | README states the real five-family taxonomy and Lane A guide ownership; inventory lists the guide; no phantom `changelog/.gitkeep` |
| REQ-004 | Reconcile deep-alignment index to baseline | No stale `300000` provisional budget or `null` D5 remains for a baseline-measured scenario |
| REQ-005 | Reconcile the Lane B output contract | Docs/commands agree with the runtime's real output path, or the discrepancy is escalated with evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `package_skill.py --check create-benchmark` stays PASS; `_shared` count is 0.
- **SC-002**: The two Lane B vitest suites pass after the rename; the resolver default path exists on disk.
- **SC-003**: Repo-wide markdown-link + path resolution for the touched areas shows 0 new broken references.
- **SC-004**: `validate.sh --strict` on this packet returns Errors 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Renaming the two Lane B dirs pre-empts packet 017's frozen census | Low | Only two dirs; note the touch-up for 017; operator chose this direction |
| Risk | Output-contract reconciliation misreads the authoritative source | Med | Agent escalates instead of guessing; orchestrator adjudicates |
| Dependency | Historical run-report JSONs must stay frozen | — | Explicitly excluded from edits |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: No live reference regresses to a broken/dangling path after the changes.
- **NFR-R02**: Frozen historical artifacts remain byte-identical.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Template placeholders (`{{PATH_TO_*}}`, `./SOURCE.md`) are not broken links and must stay.
- A scenario absent from the baseline is left unchanged, not invented.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | ~4 skill areas, doc + config + one dir rename |
| Risk | 8/25 | One out-of-band rename; no runtime logic rewrite |
| Research | 6/20 | Output-contract reconciliation needs code reading |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open; the P0 direction and spec folder were operator-resolved.
<!-- /ANCHOR:questions -->

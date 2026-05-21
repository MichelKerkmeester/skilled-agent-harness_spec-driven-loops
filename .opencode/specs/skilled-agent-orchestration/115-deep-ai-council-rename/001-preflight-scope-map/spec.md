---
title: "Feature Specification: 115/001 — preflight scope-map (rename plan + resource map)"
description: "Sequential recon phase: capture rg baseline, classify each of the 375 deep-ai-council hits as live or historical, emit resource-map.md + rename-plan.json contract, dispatch 3 cli-devin SWE-1.6 jobs for per-surface verification. Output gates entry to phases 002-005."
trigger_phrases:
  - "preflight scope-map"
  - "115 preflight"
  - "rename plan emission"
  - "resource map"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/115-deep-ai-council-rename/001-preflight-scope-map"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 115/001 preflight spec.md"
    next_safe_action: "Author 115/001 plan.md"
    blockers: []
    key_files:
      - "scratch/resource-map.md"
      - "scratch/rg/rg-baseline-before-files.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115001"
      session_id: "115-001-spec-init"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions:
      - "Surface decomposition: 5 live groups + 2 historical groups (per resource-map.md §1-§2)"
      - "Naming: skill → sk-ai-council; agent → ai-council (per resource-map.md §3)"
      - "cli-devin dispatch count: 3 parallel SWE-1.6 jobs (per resource-map.md §4)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: 115/001 — preflight scope-map

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 (blocking gate for 002-005) |
| **Status** | Draft |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 6 |
| **Predecessor** | None (first phase) |
| **Successor** | 002-skill-dir-rename, 003-agent-runtime-rename, 004-cross-skill-edges-and-code, 005-root-docs-hooks-and-readmes (all parallel-eligible after this) |
| **Handoff Criteria** | `scratch/resource-map.md` + `scratch/rename-plan.json` emitted; rg baselines captured; 3 cli-devin SWE-1.6 bundles verified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the 115 arc. Purpose: produce the authoritative surface map + rename-plan contract that 002-005 work against. Outputs are stored in `scratch/`.

**Scope Boundary**: Read-only discovery + scratch writes only. NO mutations to skill/agent/code/docs surfaces in this phase.

**Dependencies**: None.

**Deliverables**:
- `scratch/resource-map.md` — Human-readable surface map (✓ authored)
- `scratch/rg/rg-baseline-before-files.txt` — Per-file rg list (375 entries)
- `scratch/rg/rg-baseline-before-counts.txt` — Per-file rg hit counts
- `scratch/rename-plan.json` — Machine-readable contract (schema in resource-map.md §5)
- `scratch/cli-devin/job-{1,2,3}-prompt.md` + `job-{1,2,3}.log` — 3 SWE-1.6 dispatches with verified bundles
- `scratch/rg-classification.json` — Per-file live/historical classification

**Changelog**: Written at parent close via nested-changelog.js.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Without a comprehensive surface map + rename-plan contract, phases 002-005 cannot run in parallel safely. The contract prevents file-scope overlap (disjoint scope invariant) and provides per-phase rename recipes that downstream phases execute.

### Purpose
Emit the resource-map.md + rename-plan.json contract; verify against cli-devin SWE-1.6 bundles; lock the live-vs-historical classification.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only rg sweep of the entire repo
- Per-file classification + scope-grouping
- cli-devin SWE-1.6 × 3 parallel context-gathering dispatches (read-only)
- Authoring `scratch/resource-map.md`, `scratch/rename-plan.json`, `scratch/rg-classification.json`
- This spec folder's own Level 2 docs (spec/plan/tasks/checklist/implementation-summary)

### Out of Scope
- Any file mutation outside this spec folder
- The actual renames + edits (those happen in 002-005)
- Decision-record.md (lives at parent 115 level if needed; or in 001 only if decisions emerge)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001/scratch/resource-map.md` | Create | Authored 2026-05-21 |
| `001/scratch/rg/*.txt` | Create | rg baselines |
| `001/scratch/rename-plan.json` | Create | Contract |
| `001/scratch/cli-devin/job-{1,2,3}-prompt.md` | Create | cli-devin prompts |
| `001/scratch/cli-devin/job-{1,2,3}.log` | Create | cli-devin outputs |
| `001/spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Author | Level 2 contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `scratch/resource-map.md` authored with full surface map | File exists; §1-§6 sections present |
| REQ-002 | `scratch/rename-plan.json` emitted with disjoint phase scopes | jq union/intersection check shows no file in multiple phase scopes |
| REQ-003 | rg baseline captured at `scratch/rg/rg-baseline-before-files.txt` | 375 files listed |
| REQ-004 | Per-file live/historical classification | `scratch/rg-classification.json` covers every baseline hit |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | 3 cli-devin SWE-1.6 bundles verified per [[feedback_cli_devin_bundle_verification]] + [[feedback_bundle_gate_smoke_run]] | Bundles emitted under `scratch/cli-devin/`; grep + smoke-run gates pass; unclassified count = 0 |
| REQ-006 | `validate.sh --strict` on 001 spec folder exits 0 | Validator output |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: resource-map.md + rename-plan.json + rg baselines all emitted in `scratch/`.
- **SC-002**: 3 cli-devin bundles verified; bundle gate passes.
- **SC-003**: validate.sh --strict exit 0 for 001.
- **SC-004**: Phases 002-005 can pick up the rename-plan.json contract and start in parallel.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:nfr -->
## 6. NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Threshold |
|----|----------|-------------|-----------|
| NFR-001 | Read-only | No mutations outside this spec folder | git status before/after preflight: only 001/scratch + 001/*.md modified |
| NFR-002 | Reproducibility | rg baselines deterministic | rerun on clean checkout produces same per-file hit counts |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 7. EDGE CASES

| Case | Behavior | Handling |
|------|----------|----------|
| cli-devin dispatch hangs or returns malformed JSON | Bundle gate rejects | Re-dispatch with explicit format hint; fall back to manual classification |
| rg finds files not classified in resource-map.md | Unclassified hit | Halt; classify manually before emitting rename-plan.json |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 8. COMPLEXITY ASSESSMENT

| Factor | Score |
|--------|-------|
| Domain | 1 (recon only) |
| File count | 375 hits + scratch outputs |
| LOC | ~200 LOC of authored scope docs |
| Parallel | n/a (sequential phase) |
| Type | Read-only discovery |

**Level 2** correct.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risks -->
## 9. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | rg baseline missing files due to glob excludes | Use `--hidden` + careful glob; re-verify with case-insensitive sweep per [[feedback_rename_grep_case_insensitive]] |
| Risk | cli-devin bundle hallucinates files | Bundle gate per [[feedback_cli_devin_bundle_verification]] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

(none — see parent spec.md §10 for arc-level open questions)
<!-- /ANCHOR:questions -->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->

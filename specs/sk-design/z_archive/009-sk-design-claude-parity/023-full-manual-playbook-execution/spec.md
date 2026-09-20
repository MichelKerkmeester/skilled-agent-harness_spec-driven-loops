---
title: "Feature Specification: Phase 023 - Full Manual Playbook Execution (Phase Parent)"
description: "Phase parent for manually executing all 37 sk-design manual_testing_playbook scenarios (55 real dispatches once multi-prompt batteries are expanded) through cli-opencode with openai/gpt-5.5-fast --variant medium, across 10 child waves, producing a genuine release-readiness verdict."
trigger_phrases:
  - "phase 023 sk-design"
  - "full manual playbook execution"
  - "55 dispatch playbook run"
  - "gpt-5.5-fast medium playbook"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution"
    last_updated_at: "2026-07-07T16:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored phase-parent spec.md"
    next_safe_action: "Author description.json, graph-metadata.json, then dispatch the 10 child wave agents"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "full-playbook-execution-023"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 023 - Full Manual Playbook Execution (Phase Parent)

<!-- SPECKIT_LEVEL: phase-parent -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase Parent |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

sk-design's `manual_testing_playbook` (37 scenarios, 8 categories) has only ever been exercised by the automated Lane C skill-benchmark harness, which structurally cannot reach the whole corpus (`PB-004..007`, `HM-*`, `FR-*` are never dispatched at all; every `MR-*` scenario is force-classified `browser` and routed out) and which deliberately wraps every dispatched prompt into a "state what you'd do, don't do it" routing-analysis-only request specifically to avoid real side effects. No genuine end-to-end execution of the playbook, as its own EXECUTION POLICY requires ("no mocks, no stubs... real execution against the live skill"), has ever happened.

### Purpose

Dispatch every scenario for real through `cli-opencode` (`openai/gpt-5.5-fast --variant medium`), raw scenario prompt (not the harness's analysis-only wrapper), and grade each against its own file's Pass/Fail Criteria — producing a genuine release-readiness verdict per the playbook's own Section 5 gate, not a partial automated proxy.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Real dispatch of all 55 constituent prompts (37 scenario IDs; `AI-001`, `TV-001`, `TV-002`, `SR-002`, `FR-001`, `FR-002` are themselves multi-prompt batteries that expand the count) via `cli-opencode`.
- A validated Gate-3-bypass dispatch-prompt recipe (see Known Limitations / decisions below) so non-interactive dispatch doesn't halt on this repo's own spec-folder question instead of doing real design work.
- Per-scenario grading against that scenario's own file's Pass/Fail Criteria (never a generic bar).
- A 3-tier verdict-rollup artifact (`verdict-matrix.md`) at this parent's root, computing the playbook's own Section 5 release-readiness gate.

### Out of Scope

- Re-litigating phase 018/019's transport architecture decisions, or phase 021/022's validator/coverage-fill work — this phase only executes and grades the existing playbook contract.
- Fixing anything the dispatches reveal as broken — this phase records findings; remediation is a follow-up phase's decision, made with the user after reviewing `verdict-matrix.md`.

### Children (planned)

| # | Folder | Dispatches | Track |
|---|--------|-----------|-------|
| 001 | `001-mode-routing-core` | MR-001, MR-002, MR-003, MR-004, MR-006 | Parallel |
| 002 | `002-transport-and-negative-controls` | MR-007, AI-002, AI-003, AI-004, SR-001 | Parallel |
| 003 | `003-advisor-positive-controls` | AI-001-P1, P2, P3, P4, P6 | Parallel |
| 004 | `004-transform-verb-make-it` | TV-001-V1..V4, TV-002-V1 | Parallel |
| 005 | `005-transform-verb-should-it-be` | TV-002-V2..V4, TV-003, TV-004 | Parallel |
| 006 | `006-excluded-aliases-and-shared-base` | TV-005, SR-002-P1..P3, SR-003 | Parallel |
| 007 | `007-shared-base-and-parity-core` | SR-004, PB-001, PB-002, PB-004, PB-005 | Parallel |
| 008 | `008-parity-proof-and-fallback-start` | PB-006, PB-007, FR-001-foundations/interface/motion | Parallel |
| 009 | `009-fallback-and-hub-intake` | FR-001-audit, FR-002-motion, HM-001..004 | Parallel |
| 010 | `010-md-generator-serial-pipeline` | MR-005, AI-001-P5, PB-003, MG-001..004, FR-001/002-md-generator variants | Serial |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 37 scenario IDs get a real dispatch (55 constituent prompts) | `verdict-matrix.md` Tier 2 shows 37/37 scenario IDs with a computed verdict |
| REQ-002 | Every verdict traces to that scenario's own Pass/Fail Criteria | Each child's `dispatch-log.md` cites the specific criterion the verdict was graded against |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Serial md-generator wave preserves real ordering (fixture dependency) | `MG-002`/`MG-003` dispatch only after `MG-001`'s real output is copied into their `/tmp` paths |
| REQ-004 | Post-dispatch safety check on the two live-extraction dispatches that lack an explicit output path | `git status --porcelain` recorded immediately after `MR-005` and `AI-001-P5` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** all 10 children complete, **Then** `verdict-matrix.md`'s Tier 3 shows a computed `READY`/`NOT READY` release verdict per the playbook's own Section 5 gate math.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Correlated `example.com` dependency across `MR-005`/`AI-001`-P5/`PB-003`/`MG-001` | Medium | Flagged explicitly in Tier 3 rollup rather than treated as independent flakes if it occurs |
| Risk | Grading is judgment-based, not scripted | Medium | Each dispatching agent reads the scenario's own criteria directly before grading, never a generic bar |
| Dependency | Validated Gate-3-bypass dispatch recipe (smoke-tested 5x before this phase started) | High | Recipe given verbatim to every child; do not re-derive |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding — dispatch concurrency, AI-001 probe-battery handling, and phase-parent structure were confirmed with the user before this phase started; the Gate-3 dispatch-halt fix was discovered and resolved via 5 live smoke-test dispatches before any child folder was scaffolded.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Predecessor Phase**: `../022-benchmark-rerun-and-coverage-fill/` (the corpus this phase now executes for real)
- **Approved Plan**: `~/.claude/plans/refactored-petting-blanket.md`

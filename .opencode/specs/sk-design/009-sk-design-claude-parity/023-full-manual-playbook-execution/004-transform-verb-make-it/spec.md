---
title: "Feature Specification: Phase 004 - Transform Verb make it Wave (TV-001, TV-002-V1)"
description: "Real cli-opencode dispatch of TV-001's 4 make-it transform-verb variants plus TV-002's first should-it-be variant, graded against each scenario file's own Pass/Fail Criteria."
trigger_phrases:
  - "wave 004 transform verb make it"
  - "TV-001 TV-002 dispatch"
  - "make it bolder quieter distill delight"
  - "phase 004 sk-design manual playbook"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/004-transform-verb-make-it"
    last_updated_at: "2026-07-07T17:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec.md"
    next_safe_action: "Author plan.md, tasks.md, checklist.md, implementation-summary.md, dispatch-log.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-004-transform-verb-make-it"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 004 - Transform Verb make it Wave (TV-001, TV-002-V1)

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
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 023's parent scope assigned this child wave 5 of the 55 real constituent dispatches: all 4 variants of `TV-001` (`make it` transform-verb prompts that should route to `interface`) plus the first variant of `TV-002` (`should it be` transform-verb prompts that should route to `audit`). Neither scenario had ever been dispatched for real through `cli-opencode`; only the automated Lane C benchmark's routing-analysis-only wrapper had touched this territory.

### Purpose

Dispatch each of the 5 assigned prompts for real via `openai/gpt-5.5-fast --variant medium`, capture the full JSON-lines trace, and grade each dispatch strictly against its own scenario file's Pass/Fail Criteria (`make-it-interface.md` for `TV-001`, `should-it-be-audit.md` for `TV-002`) — never a generic bar.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Advisor probe (deterministic `skill_advisor.py`, clean prompt, no addendum) for each of the 5 assigned prompts.
- Real `cli-opencode` dispatch for each of the 5 assigned prompts, using the validated Gate-3-bypass addendum recipe handed down from the phase parent.
- Grading each dispatch against the constituent scenario file's own Pass/Fail Criteria section, citing the specific criterion line.
- A post-dispatch `git status --porcelain` safety check after every dispatch (not just the two the parent flagged), and reverting any unintended real-repo edit the dispatch made, since every prompt in this wave lacked a named local UI target and the addendum decision rules therefore called for the empty (no-target-clause) form.
- A `dispatch-log.md` at this folder's root: one row per dispatch (dispatch_id, scenario_id, exact prompt, advisor top-1/confidence, resolved mode/packet/resources, verdict, rationale).

### Out of Scope

- `TV-002-V2..V4` — dispatched by wave 005 (`005-transform-verb-should-it-be`), not this wave.
- Remediating any routing defect this wave's dispatches reveal — this phase records findings only; remediation is a follow-up phase's decision after `verdict-matrix.md` review, per the phase-parent's own Out of Scope.
- Re-litigating the phase 018/019/021/022 architecture or validator work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/004-transform-verb-make-it/spec.md` | Create | This spec |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/004-transform-verb-make-it/plan.md` | Create | Implementation plan |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/004-transform-verb-make-it/tasks.md` | Create | Task breakdown |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/004-transform-verb-make-it/checklist.md` | Create | Verification checklist |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/004-transform-verb-make-it/implementation-summary.md` | Create | Final summary + verdicts |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/004-transform-verb-make-it/dispatch-log.md` | Create | Per-dispatch evidence table |
| `README.md` (this repo's own root) | Transient (reverted) | `TV-001-V1`'s dispatch made a real, unintended edit here; reverted via `git restore` before this folder's docs were written — see Known Limitations |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 assigned dispatches run for real via `cli-opencode` | 5 saved JSON-lines transcripts under `/tmp/skd-TV00*-response.jsonl` |
| REQ-002 | Every verdict traces to the constituent scenario's own Pass/Fail Criteria | `dispatch-log.md` cites the specific criterion line per row |
| REQ-003 | Any unintended real-repo edit made by a dispatch is caught and reverted before this folder's docs are finalized | `git status --porcelain` clean of stray edits at folder-write time |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Dispatches run strictly one at a time (per `cli-opencode`'s own dispatch-concurrency rule) | Sequential Bash calls in this session's own transcript, none backgrounded in parallel with another `opencode run` from this same wave |
| REQ-005 | Any real, unintended routing/behavioral defect a dispatch reveals is recorded, not silently absorbed into a PASS verdict | `dispatch-log.md` and `implementation-summary.md` both name the `TV-001-V1` repo-edit escalation and the `TV-001-V3` `foundations`/`interface` routing-prose tension as explicit findings |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** all 5 dispatches complete, **Then** `dispatch-log.md` has one evidence-backed row per dispatch with a PASS/PARTIAL/FAIL verdict.
- **SC-002**: **Given** `TV-001-V1`'s dispatch is inspected, **Then** the unintended `README.md` edit it made is confirmed reverted and documented as a finding, not silently dropped.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A `make it`/`should it be` prompt with no named local UI target causes the model to search this live repo for a target and edit real files | Realized — `TV-001-V1` edited this repo's own `README.md` via `apply_patch` | Post-dispatch `git status --porcelain` after every dispatch in this wave; reverted via `git restore` immediately upon detection |
| Risk | Grading is judgment-based, not scripted | Medium | Each verdict cites the scenario file's own criterion line directly, not a generic bar |
| Dependency | Validated Gate-3-bypass dispatch recipe handed down from the phase parent | High | Used verbatim, not re-derived |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding for this wave. Whether `TV-001-V1`'s repo-editing behavior and `TV-001-V3`'s `foundations`-primary misroute warrant a remediation phase is an operator decision made after reviewing the phase parent's `verdict-matrix.md`, not decided here.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase Parent**: `../spec.md` (`023-full-manual-playbook-execution`)
- **Constituent Scenario Files**: `.opencode/skills/sk-design/manual_testing_playbook/03--transform-verb-framing/make-it-interface.md`, `.opencode/skills/sk-design/manual_testing_playbook/03--transform-verb-framing/should-it-be-audit.md`
- **Sibling Wave (TV-002-V2..V4)**: `../005-transform-verb-should-it-be/`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Dispatch Evidence**: See `dispatch-log.md`

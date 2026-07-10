---
title: "Feature Specification: Fix all open deep-review findings across cli-opencode, the sk-prompt 124 hub, and the 125/126 planning packets"
description: "Phase parent for Fix all open deep-review findings across cli-opencode, the sk-prompt 124 hub, and the 125/126 planning packets"
trigger_phrases:
  - "001-deep-review-remediation"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/127-deep-review-remediation"
    last_updated_at: "2026-07-10T04:20:00Z"
    last_updated_by: "claude"
    recent_action: "All 3 phases fixed, sol-verified, rolled up"
    next_safe_action: "None; remediation complete"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "127-deep-review-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Fix all open deep-review findings across cli-opencode, the sk-prompt 124 hub, and the 125/126 planning packets

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | skilled-agent-orchestration/127-deep-review-remediation |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Validator + template + generator changes ship so parent validates under tolerant policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three deep-review passes this session (a 10-iter review of the sk-prompt 124 hub, a Fable-5 adversarial review of the 125/126 merge plans, and a 10-iter whole-program review) left a set of open findings — real content bugs in the live cli-opencode skill, incomplete referrer-sweep and pre-existing command-hardening gaps in the sk-prompt hub, and advisory clarity refinements to the 125/126 planning packets. This program fixes all of them, grouped by target tree so the fixes are independently executable and verifiable.

### Purpose
Close every open review finding with implementation by Sonnet-5 agents and independent cross-model verification by gpt-5.6-sol-fast, while keeping the two hub-merge plans (125/126) untouched as plans. Parent stays lean; each phase child owns its fix list and evidence.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and child phase manifest for Fix all open deep-review findings across cli-opencode, the sk-prompt 124 hub, and the 125/126 planning packets
- Per-phase implementation details in child folders

### Out of Scope
- Detailed per-phase implementation plans at the parent level

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| [Per-child files] | Modify/Create | Child phases | Detailed file scope lives in each child phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-cli-opencode-content-hygiene/ | Fix 5 live cli-opencode content bugs: Rule-16 pkill self-contradiction, stale codex sibling-row, parallel-session share gate, `--agent` recipe drift, 6 corrupted filename links | Complete |
| 2 | 002-sk-prompt-124-remediation/ | Complete the merge referrer sweep (4 stale refs), harden the `/prompt-improve` save-path (3 pre-existing gaps), add GLM-5.2 to the prompt-models doc map (+ folded-in 18-file dead-path sweep) | Complete |
| 3 | 003-packet-125-126-refinements/ | 5 advisory refinements to the 125/126 plans: resolution-based move gate, scaffold/scorer ordering invariant, clickup-drift cutover visibility, ADR-005 carve-out cross-ref, phase-001 read-only marker | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-cli-opencode-content-hygiene | 002-sk-prompt-124-remediation | cli-opencode fixes land + phase validates; the three run in parallel (independent trees) | gpt-5.6-sol-fast verify + `validate.sh --strict` |
| 002-sk-prompt-124-remediation | 003-packet-125-126-refinements | sk-prompt fixes land + 124 spec docs stay `--strict` 0/0 | gpt-5.6-sol-fast verify + `validate.sh --recursive --strict` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. All findings are enumerated in the two review reports (`124-sk-prompt-parent/review/review-report.md`, `125-cli-external-parent/review/review-report.md`); the fix set is closed. The three phases run in parallel on independent trees (cli-opencode / sk-prompt+command+agents / the 125-126 plan docs).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

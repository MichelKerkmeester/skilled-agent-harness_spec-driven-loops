---
title: "Feature Specification: Hub-doc conformance for the cli-external + mcp-tooling hubs"
description: "Phase parent for the cli-external + mcp-tooling hub-doc conformance program: review the hub docs against sk-doc templates and live CLI/MCP reality (001), then produce a collision-free remediation plan for the FAIL findings (002)."
trigger_phrases:
  - "hub doc conformance"
  - "cli-external mcp-tooling doc conformance"
  - "hub doc reality alignment"
  - "015-hub-doc-conformance-fixes"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-hub-doc-conformance-fixes"
    last_updated_at: "2026-07-11T08:56:59.117Z"
    last_updated_by: "claude"
    recent_action: "Grouped review (001) + remediation plan (002) under one phased parent"
    next_safe_action: "Execute the 002 remediation plan as a downstream fix packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hub-doc-conformance-fixes"
      parent_session_id: null
    completion_pct: 100
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

# Feature Specification: Hub-doc conformance for the cli-external + mcp-tooling hubs

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Packet Type** | Phase parent (lean trio) |
| **Children** | 2 (001–002) |
| **Active Child** | 002-hub-doc-conformance-fixes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `cli-external` and `mcp-tooling` hub docs — feature catalogs, manual testing playbooks, references, vendored `mcp-servers/**/README.md` files, and SKILL.md prose — have drifted from the live CLI/MCP surfaces they document and from the sk-doc create-skill templates. That drift mis-teaches readers: dead CLI flags, retired MCP tools, wrong transport/auth config, forbidden agent routes, dead links and stale paths, wrong playbook meta-counts, schema-failing vendored READMEs, and test-scenario logic bugs.

### Purpose
First measure the drift (a bounded deep-review against sk-doc templates and live reality), then turn its FAIL findings into an actionable, collision-free remediation plan a downstream execution packet can dispatch as parallel work-streams. Success is a plan that, once executed, moves the reviewed hub-doc surface from FAIL to PASS without any file edited by more than one work-stream.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. Detailed review artifacts and the remediation plan (spec/plan/tasks/checklist/decision-record) live in the child phase folders below. Remediation *execution* is intentionally a separate downstream packet — child 002 is plan-only.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `cli-external` and `mcp-tooling` hub docs: READMEs, SKILLs, mode READMEs/SKILLs, feature catalogs, manual testing playbooks, references, and vendored `mcp-servers/**/README.md`
- Reviewing those docs for sk-doc-template conformance + reality-alignment (001)
- Producing a ranked, collision-free remediation plan for the review's findings (002)

### Out of Scope
- Executing the remediation edits (a downstream fix packet dispatches 002's work-streams)
- SKILL.md routing blocks / INTENT_SIGNALS / RESOURCE_MAP / mode-registry (coordinated separately)

### Files to Change
Summary of aggregate scope. Per-child detail lives in each child.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| [Per-child files] | Review/Plan | Child phases | Detailed scope lives in each child phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (review artifacts, plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-hub-doc-conformance-review/ | Bounded deep-review (sk-doc-conformance + reality-alignment, ≤10 iterations) of the cli-external + mcp-tooling hub docs; verdict + ranked P0/P1/P2 findings | Complete (FAIL verdict) |
| 2 | 002-hub-doc-conformance-fixes/ | Collision-free remediation PLAN (spec/plan/tasks/checklist/decision-record) for the FAIL findings, partitioned into four parallel work-streams; plan-only, no doc edits | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as an integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-hub-doc-conformance-review | 002-hub-doc-conformance-fixes | Deep-review verdict recorded with ranked, deduped findings across all six themes | findings registry + per-iteration deltas present under `review/`; counts carried into the plan |
| 002-hub-doc-conformance-fixes | (downstream fix packet) | Remediation plan partitions every finding into a collision-free work-stream with verify-first steps | `validate.sh --strict` on 002; four work-streams named with disjoint file sets |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

Remediation-policy questions were answered in the 002 plan (vendored-README rebuild vs exempt → rebuild; reality-drift → fix all, verify-first; SKILL.md routing → out of scope, coordinated separately). The one remaining downstream item is execution: 002 is a plan, not the edits — a follow-up packet must dispatch its work-streams.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase docs and review artifacts
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

---
title: "Feature Specification: Align sk-doc create-* packet routing to the create-skill router standard"
description: "Phase parent for aligning the ten sk-doc create-* creation packets to the create-skill router standard — activation boundaries, sibling handoffs, hub registries, per-packet smart-routing posture, and the remaining router-marker conformance gap."
trigger_phrases:
  - "018-sk-doc-router-alignment"
  - "sk-doc router alignment"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-sk-doc-router-alignment"
    last_updated_at: "2026-07-13T14:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Opened the router-marker gap-analysis child"
    next_safe_action: "Decide the create-skill router-marker posture in child 006, then reconcile"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 90
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

# Feature Specification: Align sk-doc create-* packet routing to the create-skill router standard

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-13 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | None |
| **Parent Packet** | `sk-doc/018-sk-doc-router-alignment` |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Every create-* packet is the source of truth for its activation boundary, both hub registries match packet sources with zero drift, each packet documents its smart-routing posture, and the create-skill router-marker gap is analyzed with a recorded decision |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The ten sk-doc `create-*` creation packets did not present a uniform routing contract against the create-skill router standard. Trigger placement and sibling handoffs were inconsistent, the generated hub registries did not always reflect packet-owned vocabulary, most packets did not document why they carry (or do not carry) the create-skill keyed-discovery router mechanism, and the create-skill conformance checker still reports a smart-router-marker gap on the flat-resource packets.

### Purpose
Make each packet the single source of truth for its activation boundary, synchronize the hub registries to packet vocabulary, give every packet an explicit smart-routing posture, and analyze the residual create-skill router-marker conformance gap so an informed keep-vs-wire decision can be made.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit all ten `create-*` packet contracts and both hub router files.
- Resolve trigger collisions, narrow broad triggers, and correct sibling handoffs.
- Regenerate both router JSON projections and verify zero trigger drift.
- Document each packet's smart-routing posture (keyed-discovery mechanism or honest N/A note).
- Analyze the residual create-skill router-marker conformance gap and record the decision.
- Preserve create-benchmark layout and workstream-A benchmark-family vocabulary.

### Out of Scope
- Any create-benchmark layout change.
- Changes outside sk-doc packet contracts, hub routers, and this spec packet.
- Rebuilding stale system-spec-kit dist.
- Wiring the create-skill keyed-discovery markers into flat-resource packets — that decision is the subject of child 006, not a committed action here.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-doc/create-*/SKILL.md` | Modify | 002-005 | Trigger boundaries, exact sibling handoffs, heading placement, smart-routing posture notes |
| `.opencode/skills/sk-doc/{mode-registry.json,hub-router.json}` | Modify | 004 | Synchronized routing projections |
| `.opencode/specs/sk-doc/018-sk-doc-router-alignment/**` | Create | 001-006 | Audit map, evidence, decisions, verification, and router-marker gap analysis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-audit-and-fix-map/ | Read all sources, map all 14 trigger/handoff fixes, and capture the routing baseline | Complete |
| 2 | 002-p0-collision-fixes/ | Resolve README/flowchart quality-action collisions | Complete |
| 3 | 003-p1-trigger-scoping-and-handoffs/ | Narrow broad triggers and correct sibling handoffs | Complete |
| 4 | 004-p2-standardization-and-regen/ | Standardize packet shape, sync registries, and verify zero drift | Complete |
| 5 | 005-smart-routing-mechanism-notes/ | Give each flat-resource packet an honest smart-routing N/A note | Complete |
| 6 | 006-router-conformance-gap-analysis/ | Analyze the residual create-skill router-marker gap across all ten packets; record the keep-vs-wire decision | Open — decision pending |
| 7 | 007-hub-intent-keyword-coverage/ | Fix create-agent / create-changelog hub mis-routing by adding artifact-noun keyword coverage across the three synced surfaces | Complete |
| 8 | 008-create-benchmark-routing/ | Fix create-benchmark mis-routing under the word cap by swapping a redundant alias for `benchmark package` across the three synced surfaces | Complete |
| 9 | 009-packet-smart-routing-conformance/ | Normalize all ten flat-resource packets to the create-skill canon so `package_skill.py --check` passes without weakening the checker | Complete |
| 10 | 010-sk-doc-routing-research/ | Deep-research on sk-doc routing (10 iterations): falsified the alias theory, root-caused the three-part path-contract defect, and produced its Layer A/B fix plan | Complete (research) |
| 11 | 011-skill-advisor-routing-research/ | Deep-research on system-skill-advisor (10 iterations): confidence-floor saturation, three P0 defects, and the metadata-hub discovery boundary shared with sk-doc | Complete (research) |
| 12 | 012-sk-doc-routing-fixes/ | Implement the sk-doc path-contract fixes from the 010 research, coordinating the shared advisor-discovery boundary with 013 | Planned |
| 13 | 013-skill-advisor-routing-fixes/ | Implement the advisor P0 through P2 fixes from the 011 research, with the shared metadata-hub discovery deliverable owned jointly with 012 | Planned |
| 14 | 014-benchmark-harness-typed-wiring/ | Fix the two-classifier decoupling behind the dispatcher's zero-emission, wire the skill-benchmark loader/runner/live/scorer to typed gold, relocate the contract library out of sk-doc, and build a sealed independently-authored holdout corpus behind offline and live gates before Wave-2 propagation | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume .opencode/specs/sk-doc/018-sk-doc-router-alignment/006-router-conformance-gap-analysis/` to resume the active phase
- Run `validate.sh --recursive` on parent to validate all phases as an integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-audit-and-fix-map | 002-p0-collision-fixes | Exact 14-fix map and before-state recorded | Phase 001 plan/tasks contain 3/6/5 map |
| 002-p0-collision-fixes | 003-p1-trigger-scoping-and-handoffs | Quality-action ownership is unambiguous | Internal replay routes both quality queries to `create-quality-control` |
| 003-p1-trigger-scoping-and-handoffs | 004-p2-standardization-and-regen | Broad triggers removed and all handoffs name siblings | Grep and packet source review |
| 004-p2-standardization-and-regen | 005-smart-routing-mechanism-notes | Registries synchronized with zero drift | Extractor drift check |
| 005-smart-routing-mechanism-notes | 006-router-conformance-gap-analysis | Every packet has a documented smart-routing posture | `package_skill.py --check` PASS for all ten |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

The create-skill router-marker posture for the eight flat-resource packets is the sole open decision. Child 006 holds the analysis and the keep-vs-wire framing for that decision.
<!-- /ANCHOR:questions -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm the active child phase and its allowed files.
- Read source files before editing.
- Preserve create-benchmark vocabulary and layout.

### Execution Rules
| Rule | Required Behavior |
|---|---|
| Scope | Write only to approved sk-doc files and this packet |
| Source | Treat packet trigger lines as authoring truth |
| Verification | Run package, drift, routing, JSON, and spec gates |

### Status Reporting Format
Report phase, changed files, verification commands, results, and blockers.

### Blocked Task Protocol
Stop the blocked gate, preserve verified work, record the exact error, and do not write to a banned path to bypass it.

---

## RELATED DOCUMENTS

- **Phase children**: See the six numbered child folders above for per-phase canonical docs
- **Provenance**: See `./context-index.md` for the folder-history bridge
- **Parent Spec**: See `../spec.md`

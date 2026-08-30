---
title: "Feature Specification: A Gate Small Enough To Trust"
description: "Reduce the completion gate to the few checks a machine actually reads, and make the rest impossible to violate rather than detected afterwards."
trigger_phrases:
  - "validation reduction"
  - "delete validation rules"
  - "strict gate too strict"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/041-validation-reduction"
    last_updated_at: "2026-08-29T18:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Decomposed the reduction into phases"
    next_safe_action: "Execute the first phase: stop strict mode promoting every warning to a hard error"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
      - ".opencode/skills/system-spec-kit/scripts/spec/create.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-speckit-041"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: A Gate Small Enough To Trust

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-speckit |
| **Predecessor** | system-speckit/040-validation-gate-coherence |
| **Successor** | None |
| **Handoff Criteria** | Each phase leaves the gate runnable and the corpus no worse than it found it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The completion gate fails roughly two thirds of the live corpus, and the
scaffolder that creates packets cannot produce one that passes it. A freshly
created Level 2 folder, untouched by any author, fails on four hard errors. The
gate is mandatory for completion claims and enforces nothing mechanically: the
default branch has no protection, no git hook runs it, and its only whole-tree
job is a weekly cron that cannot block a merge. It has the full cost of a gate
and none of the protection.

Three structural causes produce most of the failures. Rules compare authored
prose against template files that are edited weekly, so a template commit
regrades the whole corpus retroactively. Facts the filesystem already knows are
copied into markdown, so moving a folder manufactures document defects. And
strict mode promotes every warning to a hard error, which makes the registry's
severity tiers decorative and turns advice into a blocker.

The largest single blocker rewards dishonesty: it accepts any string of
sufficient length containing a backtick span or a keyword, so the cheapest way
to satisfy it is to write a citation for work nobody did.

### Purpose

Reduce the gate to the few things a machine actually reads, make the rest
impossible to violate by construction rather than detected afterwards, and stop
the corpus being told it is broken by rules nothing consumes.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Stopping strict mode from promoting every warning into a hard error.
- Removing rules that encode taste, duplicate another rule, cannot be satisfied,
  or have no consumer.
- Deleting rule implementations that no code path can reach.
- Making the scaffolder produce a packet that passes the gate it ships with.
- Deriving facts the repository already knows instead of grading documents for
  copying them correctly.
- Reducing the gate to the checks with a real machine consumer, and scoping the
  hard block to packets the current change touched.

### Out of Scope

- Hand-repairing packets that fail on authored content. The reduction is
  measured by what it removes, not by how many documents get rewritten.
- Weakening any check that a machine actually reads.
- Changing what the templates ask an author to write. This packet changes what is
  graded, not what is offered.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `mcp-server/lib/validation/orchestrator.ts` | Modify | 001, 004, 007 | Verdict computation, rule set, scope |
| `scripts/lib/validator-registry.json` | Modify | 003, 004 | Rule inventory |
| `scripts/rules/*.sh` | Delete | 003, 004 | Rules removed and unreachable implementations |
| `scripts/spec/create.sh` | Modify | 005 | Scaffold from the document contract |
| `templates/core/*.tmpl` | Modify | 006 | Stop authoring derived facts |
| `.github/workflows/*.yml` | Modify | 008 | Replace the weekly sweep with a changed-packet check |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-warnings-stop-blocking` | Strict mode stops promoting warnings to errors | Complete |
| 2 | `002-tracks-are-not-packets` | Track directories stop being graded as packets | Complete |
| 3 | `003-scaffold-parity` | A fresh scaffold passes the gate it ships with | Complete |
| 4 | `004-stop-grading-prose-shape` | Remove prose-shape grading; narrow anchors to their consumers | Complete |
| 5 | `005-framework-doc-matches-behaviour` | The always-loaded document describes the gate that exists | Complete |
| 6 | `006-delete-taste-rules` | Remove rules that encode taste with no consumer | Complete |
| 7 | `007-derive-not-grade` | Stop copying derived facts into authored prose | Deferred |
| 8 | `008-the-small-gate` | Collapse to the checks with a machine consumer | Deferred |
| 9 | `009-retire-the-sweep` | Replace the weekly cron with a changed-packet check | Complete |
| 10 | `010-a-level-for-research` | A level whose contract fits research and audit packets | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Warnings no longer fail a strict run | Pass rate measured on a fixed sample before and after |
| 002 | 003 | Track directories report nothing and no packet is exempted | All fourteen tracks pass; a packet in a track's position still fails |
| 003 | 004 | A scaffold reports zero errors at every level | A test scaffolds and validates, and fails when a fixed defect returns |
| 004 | 005 | Prose-shape grading is removed and nothing references it | Rule inventory shrinks; no packet changes verdict for a reason other than the removal |
| 005 | 006 | A scaffold created with no human input passes | The scaffold-parity check runs in CI |
| 006 | 007 | Derived facts are computed, not authored | Moving a folder produces no findings |
| 007 | 008 | The gate is the four checks, scoped to changed packets | Runtime per packet and per change measured |
| 008 | — | The weekly sweep is gone and a changed-packet check blocks merges | The new check runs on a pull request |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Whether the four surviving checks should block a merge or only a completion
  claim. Nothing mechanical enforces the gate today, so making it block is a
  policy change with its own consequences.
- Whether any deleted rule is load-bearing for a consumer outside this
  repository, given the framework document is symlinked into others.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

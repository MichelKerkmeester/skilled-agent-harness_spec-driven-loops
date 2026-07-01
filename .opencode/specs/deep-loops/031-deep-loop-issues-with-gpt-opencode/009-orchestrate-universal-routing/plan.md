---
title: "Implementation Plan: Orchestrate NDP-Safe Universal Routing"
description: "Complete orchestrate's existing Priority table with the 2 missing deep-mode rows, make the Deep Route field registry-resolved, and codify that @deep is never Task-dispatched as a depth-1 worker -- across both the OpenCode and Claude mirrors."
trigger_phrases:
  - "implementation"
  - "plan"
  - "orchestrate universal routing"
  - "orchestrate registry delegation"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/009-orchestrate-universal-routing"
    last_updated_at: "2026-07-01T15:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 3 phases complete; validate.sh --strict passing"
    next_safe_action: "Proceed to phase 010"
    blockers: []
    key_files:
      - ".opencode/agents/orchestrate.md"
      - ".claude/agents/orchestrate.md"
      - ".opencode/skills/deep-loop-workflows/mode-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-009-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Orchestrate NDP-Safe Universal Routing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown agent definitions, OpenCode/Claude runtime mirrors |
| **Framework** | OpenCode agent loader, Claude agent mirror files, `mode-registry.json` |
| **Storage** | Filesystem agent definitions |
| **Testing** | Table-completeness check (manual trace + grep), NDP-consistency review, `validate.sh --strict` |

### Overview

`orchestrate.md`'s Priority table already routes every non-deep dispatch (`@code`, `@review`, `@markdown`, `@debug`, `@context`) deterministically. Two of four deep modes (`@deep-context`, `@deep-review`) are missing from it, and an already-uncommitted partial edit added them to the Task-format template's `Agent:` enum plus a free-text `Deep Route:` field without wiring either into the actual routing table. This phase completes that table (not a new mechanism), makes `Deep Route:` resolve against `mode-registry.json`, and adds an explicit "never Task-dispatch `@deep` itself as a worker" boundary next to the existing NDP "Illegal Chains" list.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 008 confirmed complete (predecessor dependency).
- [x] Current state of `orchestrate.md`'s Priority table (`:97-105`), NDP LEAF list (`:116`), Agent Files table (`:180-188`), and Task-format block (`:206-207`) re-read fresh (line numbers may have shifted since phase 008's edits).
- [x] `mode-registry.json`'s 4 entries (`context`, `research`, `review`, `ai-council`) re-confirmed as the source of truth for the 2 new rows.
- [x] `.claude/agents/orchestrate.md`'s equivalent sections identified (different line numbers, same structure).

### Definition of Done
- [x] All 4 deep modes present as distinct rows in the Priority table, NDP LEAF list, and Agent Files table (both `.opencode` and `.claude`).
- [x] `Deep Route:` field's value is derivable by direct `mode-registry.json` lookup, verified by manually tracing 2 sample requests (`/deep:context`, `/deep:review`) through the table.
- [x] Explicit "never dispatch `@deep` as a worker" boundary added near the NDP "Illegal Chains" block.
- [x] Non-deep routing (`@code`/`@review`/`@markdown`/`@debug`/`@context`) unchanged — confirmed by diffing only the intended line ranges.
- [x] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Table-completion, not new-mechanism: add missing rows to an existing deterministic lookup table; make a currently-free-text field resolve against the same registry the table itself should mirror.

### Key Components

- **`orchestrate.md` Priority table (`:97-105`)**: the single routing surface for all primary-agent dispatch decisions. Gains 2 rows.
- **NDP LEAF list (`:116`)**: must list every dispatchable leaf, including the 2 added deep modes.
- **Agent Files table (`:180-188`)**: maps each agent name to its definition file path; gains 2 rows.
- **Task-format `Deep Route:` field (`:206-207`)**: currently free-text template prose from an uncommitted partial edit; becomes a registry-resolved value.
- **`mode-registry.json`**: unchanged, read-only source of truth.

### Data Flow

A `/deep:*` request reaches orchestrate → orchestrate matches it against the completed Priority table → resolves the target leaf agent and its `Deep Route:` fields directly from `mode-registry.json` (no judgment call) → dispatches the resolved leaf at depth 1, never `@deep` itself.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/agents/orchestrate.md` Priority table | Missing 2 of 4 deep-mode rows | Add `@deep-context`/`@deep-review` rows | Manual trace of 2 sample requests |
| `.opencode/agents/orchestrate.md` NDP LEAF list | Missing 2 of 4 deep-mode entries | Add `@deep-context`/`@deep-review` | Grep cross-check against Priority table |
| `.opencode/agents/orchestrate.md` Agent Files table | Missing 2 of 4 deep-mode rows | Add `@deep-context`/`@deep-review` file paths | Grep cross-check |
| `.opencode/agents/orchestrate.md` Task-format `Deep Route:` field | Free-text prose (uncommitted partial edit) | Registry-resolved value | Manual trace |
| `.opencode/agents/orchestrate.md` NDP section | No explicit "@deep as worker" prohibition | Add explicit boundary | Re-read for clarity |
| `.claude/agents/orchestrate.md` (all of the above, mirrored) | Same gaps, Claude conventions | Mirror all edits | Same checks, Claude file |

Required inventories:
- Same-class producers: both `orchestrate.md` files (OpenCode + Claude) carry the same table structure; confirm line-number offsets differ before editing (phase 003's precedent: they always have).
- Consumers: any doc/prompt that quotes orchestrate's Priority table verbatim (grep before editing to catch stale copies).
- Matrix axes: 4 deep modes x 2 runtime mirrors x 3 table locations (Priority, NDP LEAF, Agent Files) = 24 cells to confirm consistent.
- Algorithm invariant: Priority table, NDP LEAF list, and Agent Files table must always agree on which agents are leaves — this phase's own edit must not introduce a NEW disagreement while fixing the old one.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm phase 008 is complete (dependency gate).
- [x] Re-read current `orchestrate.md` (both runtimes) in full around the 4 affected sections — line numbers may have drifted.
- [x] Re-confirm `mode-registry.json`'s 4 entries.
- [x] Grep the repo for any other doc quoting orchestrate's Priority table verbatim (stale-copy risk).

### Phase 2: Core Implementation
- [x] Add `@deep-context`/`@deep-review` rows to the Priority table (both runtimes).
- [x] Add `@deep-context`/`@deep-review` to the NDP LEAF list (both runtimes).
- [x] Add `@deep-context`/`@deep-review` rows to the Agent Files table (both runtimes).
- [x] Rewrite the `Deep Route:` field description to be explicitly registry-resolved, completing the uncommitted partial edit rather than leaving it as free-text (both runtimes).
- [x] Add an explicit "never dispatch `@deep` as a Task worker" boundary near the NDP "Illegal Chains" block (both runtimes).

### Phase 3: Verification
- [x] Manually trace 2 sample requests (`/deep:context`, `/deep:review`) through the completed table end-to-end; confirm the trace needs no judgment call.
- [x] Grep for consistency across the 3 table locations (Priority, NDP LEAF, Agent Files) — all 4 deep modes must appear in all 3, in both runtimes.
- [x] Confirm non-deep routing rows (`@code`/`@review`/`@markdown`/`@debug`/`@context`) are byte-unchanged.
- [x] Run `validate.sh --strict` for this phase folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual trace | 2 sample deep-mode requests through the completed table | Direct read-through |
| Static/grep | Cross-table consistency (Priority, NDP LEAF, Agent Files) | `rg`/`grep` |
| Static/grep | Non-deep routing rows unchanged | `git diff` scoped to line ranges |
| Spec | Phase documentation and metadata integrity | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Phase 008 | Predecessor | Complete | None — dependency satisfied |
| `mode-registry.json` | Source of truth | Confirmed stable | Fix would have no target to converge on |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The completed table causes orchestrate to mis-route a previously-working non-deep request, or the NDP boundary addition creates confusing/contradictory guidance.
- **Procedure**: Revert the 4 added-row edits and the NDP boundary addition in both `orchestrate.md` files; re-run the manual trace and grep checks against the pre-change state to confirm the revert is clean.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 008 (Mode-D + ai-council identity) -> Phase 009 (this phase) -> Phase 010 (ai-council subagent-only)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 008 | Core |
| Core | Setup | Verify |
| Verify | Core | Phase 010 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low | Small |
| Core Implementation | Medium | Medium (4 table locations x 2 runtimes) |
| Verification | Low-Medium | Small |
| **Total** | | **Medium** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No persisted data migration.
- [x] `mode-registry.json` re-read fresh immediately before writing new rows.
- [x] Both runtime mirrors edited in the same session (no one-sided intermediate state).

### Rollback Procedure
1. Revert the 4 table-location edits in both `orchestrate.md` files.
2. Revert the NDP boundary addition.
3. Rerun manual trace and grep checks against pre-change state.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: File revert only.
<!-- /ANCHOR:enhanced-rollback -->

---

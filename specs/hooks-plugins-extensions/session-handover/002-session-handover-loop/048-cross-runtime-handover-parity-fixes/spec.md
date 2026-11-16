---
title: "Feature Specification: Phase 48: cross-runtime-handover-parity-fixes"
description: "Pi and OpenCode receivers get no History Lookup, a failed arm on Codex, Pi or OpenCode leaves a stale record pending, and Claude and Codex have each delivered one nudge twice. These three phases close the gaps the Vibe hardening exposed on the other runtimes."
trigger_phrases:
  - "cross runtime handover parity fixes"
  - "phase 48 cross runtime handover parity fixes"
  - "pi opencode history lookup"
  - "shared nudge claim"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/048-cross-runtime-handover-parity-fixes"
    last_updated_at: "2026-11-15T20:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Phase parent created, child phases own continuity"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 48: cross-runtime-handover-parity-fixes

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/420-cross-runtime-handover-parity-fixes` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | 002-session-handover-loop |
| **Predecessor** | 047-vibe-handover-hardening |
| **Successor** | None |
| **Handoff Criteria** | Each child validates strict, the handover suite passes, and a live Pi hop and a live OpenCode hop each recover an off-note detail through History Lookup |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Only Claude Code, Codex and Vibe senders mint a History Lookup at claim, so a Pi or OpenCode receiver cannot recover a detail the note left out. On Codex, Pi and OpenCode, a turn end that cannot arm its record leaves it pending with no deferred mark, and their withdraw accepts only an armed record, so a later turn end can arm from a stale note. Claude and Codex have each delivered one nudge twice when two tool hooks ran at once: Claude on 2026-10-22 with two tool calls 16 ms apart, and Codex on 2026-11-15 with two developer messages 12 ms apart.

### Purpose
Every looped runtime hands over with the same safety and recall that phase 047 gave Vibe.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A History Lookup locator for Pi and OpenCode senders, read through the shared session readers.
- A deferred mark on every failed arm for Codex, Pi and OpenCode, with the withdraw policy that lets the next prompt cancel it.
- One shared nudge claim for Claude, Codex and Vibe, and side-word scoring in the live-hop harness.

### Out of Scope
- The nudge level reset after a compaction. Claude, Codex, Pi, OpenCode and Vibe already reset it.
- The wider hop-recall measurement, which the history packet's `008-wider-hop-recall-measurement` owns.
- Cursor and Devin, which have no relaunch hook.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/hooks/session-handover/lib/relaunch-core.cjs` | Modify | 001 | Pi and OpenCode arms in the locator mint |
| `.skilled/hooks/session-handover/codex/stop-arm.mjs`, `codex/shared.mjs` | Modify | 002 | Deferred mark and withdraw policy |
| `.skilled/hooks/session-handover/pi/session-handover.ts`, `opencode/session-handover.js` | Modify | 002 | Deferred mark on an arm error and withdraw policy |
| `.skilled/hooks/session-handover/lib/nudge.cjs` | Modify | 003 | Shared nudge claim |
| `.skilled/hooks/session-handover/claude/context-nudge.mjs`, `codex/shared.mjs`, `vibe/handover-parts.mjs` | Modify | 003 | Use the shared claim |
| Hand-over tests and README | Modify | All | Coverage and docs for each change |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-pi-opencode-history-lookup/ | Mint a History Lookup locator for Pi and OpenCode senders | Complete |
| 2 | 002-failed-arm-deferred-mark/ | Defer a record no turn end could arm on Codex, Pi and OpenCode | Complete |
| 3 | 003-nudge-parity-and-hop-scoring/ | One shared nudge claim and side-word scoring | Complete |
| 4 | 004-history-preview-readability/ | Readable model-turn previews and search excerpts, and a live Pi recall run | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Pi and OpenCode claims print a lookup that redeems | The new CLI tests pass |
| 002 | 003 | Each failed arm leaves a deferred record that a prompt withdraws | The new adapter tests pass |
| 003 | 004 | The live Pi receiver gave up on JSON previews | `live2-pi` scorecard and the receiver session |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Does a Pi or OpenCode receiver run the lookup on its own when the claim offers it? The live hops in phase 003 show it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

---
title: "Implementation Plan: Codex hook/plugin parity"
description: "Direct-core Codex adapters over neutral cores, lifecycle wiring, an install merge into user-global hooks, and a fixture-plus-live test matrix."
trigger_phrases: ["Codex hook parity plan"]
importance_tier: normal
contextType: planning
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/007-codex-hook-parity"
    last_updated_at: "2026-07-13T19:39:11Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the Level 3 implementation plan"
    next_safe_action: "Implement the eight portable Codex guard adapters"
    blockers: []
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Codex hook/plugin parity
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- ANCHOR:summary -->
## 1. SUMMARY
Port each Claude guard hook to a thin Codex sibling adapter that reuses the existing runtime-neutral core, wire the four neutral session scripts into Codex lifecycle events, handle the two non-portable guards honestly, install the versioned hook set into `~/.codex/hooks.json`, and verify every adapter with a fixture smoke plus a live `codex exec` run.
<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [ ] No neutral core, Claude hook, or OpenCode plugin changes behavior (diff-confirmed).
- [ ] Every adapter fails open on empty and malformed stdin.
- [ ] Deny-capable guards emit `permissionDecision: deny`; advisory guards emit only `additionalContext`.
- [ ] The installer preserves existing `~/.codex/hooks.json` entries and is idempotent.
- [ ] A representative live matrix confirms Codex fires and honors the new hooks.
<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Each Codex adapter reads the snake_case Codex payload from stdin, normalizes the tool name (`exec` to Bash, `apply_patch`/`edit` to Write/Edit), calls the neutral core, and emits the Codex response envelope (`additionalContext`, or `permissionDecision` for the two block-capable guards). Adapters are plain `.mjs`/`.cjs` siblings of the Claude adapter under `<skill>/runtime/hooks/codex/`. The repo `.codex/hooks.json` is the versioned source; an installer merges it into user-global `~/.codex/hooks.json`.
<!-- /ANCHOR:architecture -->
<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---|---|---|---|
| Neutral hook cores | Behavior authority | Read only | Diff confirms unchanged |
| Codex guard adapters | Host translation | Create | Fixture smoke + live matrix |
| `.codex/hooks.json` | Versioned registration | Modify | JSON parse + path existence |
| `~/.codex/hooks.json` | Runtime surface | Merge via installer | Backup + idempotent re-run |
<!-- /ANCHOR:affected-surfaces -->
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Portable guard adapters
- [ ] Author eight `runtime/hooks/codex/` adapters over their neutral cores.
### Phase 2: Session-lifecycle wiring
- [ ] Wire worktree-guard, check-git-hooks, check-dist-staleness into SessionStart; fold session-cleanup into Stop.
### Phase 3: Native equivalents
- [ ] Codex route-guard adapter (dormant, documented) and exec dispatch-shape recognizer.
### Phase 4: Install + registration
- [ ] Extend repo `.codex/hooks.json`; add and run the installer into `~/.codex/hooks.json`.
### Phase 5: Verification and closeout
- [ ] Fixture smoke + live matrix; manual playbook; strict validation; metadata reconcile.
<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Fixture stdin-pipe smoke per adapter (allow, advise, deny, fail-open) plus a live `codex exec --dangerously-bypass-hook-trust` matrix for a representative set (spec-gate on an edit, completion-evidence on Stop, spec-gate-classify on a prompt), cross-referenced against the cli-codex manual testing playbook.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Codex 0.144.2 hook contract | External | Green | Pinned in the decision record. |
| Runtime-neutral cores | Internal | Green | Present and dual-consumed; reused unchanged. |
<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Restore the `~/.codex/hooks.json` backup, revert repo `.codex/hooks.json`, and delete the new `runtime/hooks/codex/` adapters and the installer. No neutral core changes, so Claude and OpenCode behavior is unaffected.
<!-- /ANCHOR:rollback -->
<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH
- **T001 → T002 → T003** (Setup) gate everything.
- **T004–T010** (guard adapters) each depend only on core identification (T003) and are mutually independent — parallelizable.
- **T011–T014** (lifecycle wiring + native equivalents) depend on the adapters they register.
- **T015** (`.codex/hooks.json`) depends on all adapters existing on disk; **T016** (installer) depends on T015.
- **T017–T020** (verification + closeout) depend on T016.
<!-- /ANCHOR:dependency-graph -->
<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH
`T003 → T004` (spec-gate-enforce, the reference deny adapter) `→ T015` (registration) `→ T016` (installer) `→ T018` (live matrix) `→ T020` (closeout). The live deny-behavioral confirmation on T018 is the longest-lead item; fixture smoke (T017) de-risks it by proving every envelope before the live run.
<!-- /ANCHOR:critical-path -->
<!-- ANCHOR:milestones -->
## L3: MILESTONES
| Milestone | Definition | Gate |
|---|---|---|
| M1 Scaffold green | Docs conform; `validate.sh --strict` Errors: 0 | Phase 1 |
| M2 Adapters built | All seven guard adapters + native equivalents pass fixture smoke | Phase 2 |
| M3 Wired + installed | `.codex/hooks.json` extended; installer run into `~/.codex/hooks.json` | Phase 2 |
| M4 Verified | Live matrix fires/honors (or documented owed); playbook written | Phase 3 |
| M5 Closed out | Metadata reconciled; 134 parent noted; strict validation clean | Phase 3 |
<!-- /ANCHOR:milestones -->
## L3: AI EXECUTION PROTOCOL
### Pre-Task Checklist
Before each adapter: read the named Claude sibling and its neutral core; confirm the core's entry function and the tool-name normalization; confirm the target `codex/` sibling path.
### Task Execution Rules
- **TASK-SEQ**: Setup (T001–T003) precedes any Phase 2 work; install (T015–T016) runs only after every adapter exists on disk.
- **TASK-SCOPE**: touch only the new `codex/` adapters, `.codex/hooks.json`, the installer, and the playbook. Never modify a neutral core, a Claude hook, or an OpenCode plugin.
### Status Format
Report each task as `T### — <result> (evidence: fixture output / file:line / diff)`, distinguishing confirmed from inferred.
### Blocked Task Protocol
On a BLOCKED task (e.g. a live `codex exec` run that hangs), stop, record the fixture + schema evidence already gathered, mark the live-behavioral item as explicitly owed, and continue with the next unblocked task rather than claiming completion.

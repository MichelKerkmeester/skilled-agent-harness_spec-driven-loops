---
title: "Implementation Plan: Devin hook parity"
description: "Plan for building the remaining Devin hook adapters covering all 8 lifecycle events, mirroring the proven cli-codex hook-adapter pattern."
trigger_phrases: ["devin hook parity plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity"
    last_updated_at: "2026-07-24T06:43:46Z"
    last_updated_by: "claude-code"
    recent_action: "Authored Level 3 plan: dependency graph, critical path, milestones, ADR pointer"
    next_safe_action: "Wait for phase 004, then resolve ADR-001 discovery order"
    blockers: ["depends on phase 004 landing first", "devin auth login needed for live verification"]
    key_files: ["spec.md", "tasks.md", "decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 0
    open_questions: ["Does project-level .devin/hooks.v1.json work, or is an installer needed?"]
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Devin hook parity

<!-- ANCHOR:summary -->
## 1. SUMMARY
Build 9 new adapter files closing the remaining 6 guard-core gaps plus 2 lifecycle-completion adapters plus 1 dispatch-guard adapter, register all 8 Devin lifecycle events in `.devin/hooks.v1.json`, and resolve the discovery-order and SessionEnd-strictness questions from live evidence.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- Every new adapter fails open on malformed/missing input.
- All 8 neutral cores remain byte-unchanged (`git diff` empty).
- `PermissionRequest` ships as an explicit empty array, never silently absent.
- The `SessionEnd` decision is evidence-based, not assumed from the Codex precedent (which lacks this event entirely).
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Two adapter shapes, exactly mirroring the Codex precedent: (a) direct-core-call adapters that `import` a shared `.mjs`/`.cjs` core and add only a thin Devin tool-vocabulary translation layer (Devin's `exec`/`edit`/`run_subagent`/`mcp__.*` names in place of Claude's `Bash`/`Write|Edit`/`Task`/`mcp__claude_ai_.*`); (b) delegate-to-compiled-Claude-adapter adapters that `spawnSync` the existing compiled `hooks/claude/*.js` binary and translate its output into Devin's `hookSpecificOutput` envelope. `post-compaction.cjs` uses neither shape - it implements bespoke logic since Devin's `PostCompaction` has no Claude-side equivalent to spawn or port.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
None - this is new-file creation, not a fix to existing behavior.
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract resolution
Live-verify the 6 remaining event schemas, resolve `.devin/hooks.v1.json` discovery/precedence order (ADR-001), and determine `SessionEnd` stdout strictness before writing any registration.

### Phase 2: Guard-core adapters
Build the 6 direct-core-call adapters (dispatch-preflight-lint, dispatch-audit-posttooluse, post-edit-quality, code-graph-freshness, mcp-route-guard, task-dispatch-guard), each a thin Devin-vocabulary translation over its existing shared core.

### Phase 3: Lifecycle-completion adapters
Build `session-stop.ts` (delegate-to-compiled-Claude-adapter shape) and `post-compaction.cjs` (bespoke 5-step recovery chain, no delegation).

### Phase 4: Registration and closeout
Extend `.devin/hooks.v1.json` with all new entries plus the 4 existing-script SessionStart registrations, the empty `PermissionRequest`, and the evidence-based `SessionEnd` wiring; live-smoke every event; finalize `implementation-summary.md`.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Fixture stdin-pipe smoke tests for every new adapter (malformed/missing-field fail-open cases), then a live `devin` session matrix for the representative set once authentication is available. Diff all 8 neutral cores against pre-phase state as a final regression gate.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
`004-devin-hook-adapter-layer` only. Not blocked by 005/006/007. Shares the packet-wide `devin auth login` blocker for any live-verification task.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Delete the 9 new adapter files and their containing `hooks/devin/` sibling directories where newly created; revert `.devin/hooks.v1.json` to phase 004's 2-event version. Neutral cores were never modified, confirmed via `git diff`.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
Phase 1 (contract resolution) gates Phases 2-4; Phases 2 and 3 can run in parallel once Phase 1 clears.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
High - 9 new files, 1 bespoke semantic adapter, 1 deliberate architectural divergence, live-verification-gated decisions.
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
No feature flag needed - additive, Devin-only. No data migration involved.
<!-- /ANCHOR:enhanced-rollback -->

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH
`004-devin-hook-adapter-layer` → Phase 1 (contract resolution) → {Phase 2 (guard-core adapters), Phase 3 (lifecycle-completion adapters)} → Phase 4 (registration + closeout).
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 contract resolution** (discovery order + SessionEnd strictness) - CRITICAL, blocks everything else
2. **Guard-core adapters (Phase 2)** - CRITICAL
3. **Registration (Phase 4)** - CRITICAL

**Parallel Opportunities**: Phase 2's 6 adapters can be built in parallel with each other and with Phase 3's 2 adapters, since none depend on one another.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria |
|---|---|---|
| M1 | Contract resolved | Discovery order + SessionEnd strictness confirmed live |
| M2 | All 9 adapters exist | Syntax/lint clean, fail-open verified via fixtures |
| M3 | Registration complete | `.devin/hooks.v1.json` covers all 8 events; live smoke test passes |
<!-- /ANCHOR:milestones -->

## L3: ARCHITECTURE DECISION RECORD

5 ADRs govern this phase: contract/discovery resolution (ADR-001), dual adapter pattern confirmation (ADR-002), deny-capability verification (ADR-003), registration location (ADR-004), honest divergent/dormant/empty handling (ADR-005). See `decision-record.md` for full context, alternatives, consequences, and rollback notes.

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirmed phase 004 has landed (`SessionStart`/`UserPromptSubmit` adapters + `spec-gate-core.mjs` wiring exist)
- [ ] Confirmed all 5 ADRs in `decision-record.md` are Accepted before writing adapter code
- [ ] Confirmed an authenticated `devin` session is available for live-verification tasks, or explicitly deferred those tasks with a documented reason

### Execution Rules
| Rule | Requirement |
|---|---|
| TASK-SEQ | Resolve Phase 1 (contract) before any Phase 2/3 adapter code is written |
| TASK-SCOPE | Touch only the 9 named new files + `.devin/hooks.v1.json` - never edit any of the 8 neutral cores or phase 004's existing files |

### Status Reporting Format
Report each completed task as `T### done: <one-line evidence>`; report blocked tasks as `T### blocked: <reason>`.

### Blocked Task Protocol
If live evidence contradicts an assumption in this plan (e.g. Devin's `SessionEnd` proves strict, or project-level `.devin/hooks.v1.json` proves inert), mark the affected task `[B]` in `tasks.md`, record the actual observed behavior, and update `decision-record.md` before proceeding - do not silently code against the wrong assumption.
<!-- /ANCHOR:ai-execution -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`, `decision-record.md`

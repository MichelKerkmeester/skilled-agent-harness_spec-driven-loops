---
title: "Implementation Plan: Cursor hook adapter layer"
description: "Plan for adding thin Cursor hook adapters over the runtime-neutral guard cores, registered via a project .cursor/hooks.json, with per-event live delivery verification."
trigger_phrases: ["cursor hook adapter plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/004-cursor-hook-adapter-layer"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored plan.md for phase 004"
    next_safe_action: "Author tasks.md, checklist.md, decision-record.md"
    blockers: ["depends on 003-cli-cursor-skill-packet landing first"]
    key_files: ["spec.md", "decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Cursor hook adapter layer

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
Add sibling `cursor/` hook-adapter directories mirroring the live `cli-codex` structure (`mcp-server/hooks/cursor/`, `runtime/hooks/cursor/`), register the core events via a project `.cursor/hooks.json`, translate between Cursor's `{permission,...}`/exit-code envelope and the neutral cores, and live-verify per-event delivery under the installed `cursor-agent` CLI before claiming any guard is active — accounting for Cursor's editor-shared config and its documented CLI partial-event-delivery caveat.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [x] Neutral hook cores unchanged (`git diff` empty for `hooks/claude/**`, `runtime/lib/spec-gate/**`, `lib/hooks/completion-evidence-sentinel.cjs`).
- [x] Each wired event has captured live stdin/stdout evidence proving CLI delivery, not just config presence.
- [x] Adapters fail open on malformed payloads (protecting editor users of the shared config).
- [x] ADR-001 (registration scope) and ADR-002 (event mapping + partial-delivery) recorded with status + verification trigger.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Two-layer adapter mirroring the codex precedent, corrected against live-probe evidence: `mcp-server/hooks/cursor/` holds thin per-event adapters (`session-start.ts` for `sessionStart`, `session-end.ts` for `sessionEnd` — NOT `user-prompt-submit.ts`/`session-stop.ts`, since `beforeSubmitPrompt`/`stop` are confirmed to never fire) plus `shared.ts` that reads a Cursor hook payload from stdin, spawns the matching compiled `hooks/claude/*.js` neutral core, and re-encodes the result into Cursor's `{permission: allow|deny|ask, user_message, agent_message}` envelope (exit 0 succeed / exit 2 block — live-verified). `runtime/hooks/cursor/` wires `spec-gate-enforce.mjs` into the shared `spec-gate-core.mjs` via the generic `preToolUse` event (confirmed to fire for every tool, broader than `beforeShellExecution` alone), mapping Cursor's confirmed `Shell`/`Write` `tool_name` vocabulary onto the core's `bash`/`write` vocabulary; `spec-gate-classify.mjs` exists mapped to `beforeSubmitPrompt` but is dormant (never fires). Registration via a project `.cursor/hooks.json` is architecturally chosen (ADR-001) but the actual file is deferred to a later, explicitly-approved step (operator choice this phase).
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `mcp-server/hooks/cursor/**` | (new) thin Cursor adapters | Create | Live smoke test per event |
| `runtime/hooks/cursor/**` | (new) Cursor-side spec-gate wiring | Create | spec-gate classify/enforce round trip |
| `.cursor/hooks.json` | (new) project hook registration | Deferred (operator choice) | Verified instead via a temporary, uncommitted probe file |
| `hooks/claude/**`, `runtime/lib/spec-gate/**` | Neutral cores | No change | `git diff` empty |
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm phase 003 landed; read the live `hooks/codex/`+`runtime/hooks/codex/` files as the structural template.
- [x] Live-probe which Cursor events the installed `cursor-agent` CLI actually delivers (partial-delivery caveat).

### Phase 2: Core Implementation
- [x] Author `mcp-server/hooks/cursor/shared.ts`, `session-start.ts`, `session-end.ts`, `README.md` (renamed from the originally-planned `user-prompt-submit.ts`/`session-stop.ts` once live probing showed those events never fire).
- [x] Author `runtime/hooks/cursor/spec-gate-classify.mjs` (dormant), `spec-gate-enforce.mjs` (wired to `preToolUse`), `README.md`.
- [x] Project `.cursor/hooks.json` registration explicitly deferred by operator choice; verified instead via a temporary, uncommitted probe file.

### Phase 3: Verification
- [x] Live smoke test each wired event; capture stdin/stdout evidence.
- [x] Confirm neutral cores unchanged; confirm adapters fail open on malformed input.
- [x] Document any non-delivered event as an open gap.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Reuse the codex precedent's live-round-trip approach: pipe a representative Cursor hook payload into each adapter and assert a valid Cursor-envelope response, then confirm the same event fires end-to-end inside a real `cursor-agent` session. Because the CLI may not deliver every event, treat live per-event delivery as the gating evidence — a passing unit round trip is necessary but not sufficient. Fail-open behavior is tested by feeding malformed/empty stdin and asserting `{permission: allow}` (no block).
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 003 (skill packet) | Internal | Planned | No `cli-cursor` mode context for adapters to attach to |
| `hooks/codex/` + `runtime/hooks/codex/` precedent | Internal | Green (live) | Wrong adapter shape if not mirrored |
| Cursor CLI per-event delivery | External | Yellow — TBD, live-verify | A registered-but-undelivered event silently never guards |
| Installed `cursor-agent` | External | Green (phase 001, `2026.07.23-e383d2b`) | Needed for the live smoke test |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Delete `mcp-server/hooks/cursor/` and `runtime/hooks/cursor/`. `.cursor/hooks.json` was never committed (deferred by operator choice), so there is no editor-blast-radius effect to revert yet — registering it is a future, separately-approved step. The neutral cores were never modified, so no reversal is needed there — confirm with `git diff` showing no changes to those paths.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
003 (skill packet) precedes this phase. Phase 005 (model registry) is loosely gated after it.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|---|---|---|
| Setup (probe CLI delivery) | Medium | 30-60 min live probing |
| Core implementation | Medium | One focused session (10 files) |
| Verification | Medium | Live smoke test per event + fail-open test |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
Additive-only change: new adapter directories + one project config file. If the CLI's partial-event delivery makes the adapter layer ineffective for a given event, remove that event's registration from `.cursor/hooks.json` and mark it editor-only; the neutral cores and the other executors' adapters are untouched.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH
```
Phase 1 (probe delivery) ──► Phase 2 (adapters + .cursor/hooks.json) ──► Phase 3 (live-verify per event)
```

| Component | Depends On | Produces | Blocks |
|---|---|---|---|
| CLI delivery probe | Setup | Confirmed event list | Which events to wire |
| `mcp-server/hooks/cursor/**` | Probe + codex template | Thin adapters | `.cursor/hooks.json` |
| `runtime/hooks/cursor/**` | Probe + codex template | spec-gate wiring | `.cursor/hooks.json` |
| `.cursor/hooks.json` | Adapters exist | Registration | Live verification |
| Live verification | Registration | Per-event evidence | Phase closeout |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH
1. **Probe which CLI events fire** - ~45min - CRITICAL (determines the whole scope)
2. **Author adapters + `.cursor/hooks.json`** - ~2h - CRITICAL
3. **Live-verify each event end-to-end** - ~45min - CRITICAL

**Parallel Opportunities**: `mcp-server/hooks/cursor/` and `runtime/hooks/cursor/` authoring can proceed together once the delivered-event list is known.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES
| Milestone | Description | Success Criteria | Target |
|---|---|---|---|
| M1 | Delivered-event list confirmed | Live probe output recorded | End of Phase 1 |
| M2 | Adapters + registration authored | 10 files present, schema-valid | End of Phase 2 |
| M3 | Per-event delivery verified | stdin/stdout evidence per wired event; gaps documented | End of Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD
Two ADRs govern this phase: ADR-001 (registration scope given Cursor's editor-shared config) and ADR-002 (event mapping + CLI partial-delivery strategy). See `decision-record.md`.

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [x] Confirmed phase 003 landed (`cli-cursor` mode registered)
- [x] Confirmed which Cursor events the installed CLI actually delivers
- [x] Confirmed both ADRs Accepted before writing `.cursor/hooks.json`

### Execution Rules
| Rule | Requirement |
|---|---|
| TASK-SEQ | Probe delivery BEFORE registering any event; never register an event not confirmed to fire under the CLI |
| TASK-SCOPE | Touch only `mcp-server/hooks/cursor/**`, `runtime/hooks/cursor/**`, and `.cursor/hooks.json` — never modify the neutral cores |

### Status Reporting Format
Report each completed task as `T### done: <one-line evidence>`; report blocked tasks as `T### blocked: <reason>`.

### Blocked Task Protocol
If a registered event does not fire under the CLI, mark it editor-only, remove it from `.cursor/hooks.json`, record the gap in `implementation-summary.md`, and continue with the events that do fire — do not claim a guard is active without live delivery evidence.
<!-- /ANCHOR:ai-execution -->

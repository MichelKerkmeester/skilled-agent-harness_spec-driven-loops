---
title: "Implementation Plan: Cross-Runtime Goal Isolation"
description: "Replace the runtime-neutral singleton goal record with explicit per-session scope, then wire native session identity through management and injection surfaces."
trigger_phrases:
  - "goal isolation plan"
  - "session-scoped goal implementation"
  - "pi goal state migration"
  - "active-goal singleton replacement"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/042-goal-isolation"
    last_updated_at: "2026-08-10T19:20:00Z"
    last_updated_by: "codex"
    recent_action: "All six implementation and verification phases completed"
    next_safe_action: "Monitor session-isolated goals and compatibility migration during normal runtime use"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/lib/goal-core.cjs"
      - ".opencode/hooks/goal/bin/goal.cjs"
      - ".opencode/hooks/goal/pi/goal-context.ts"
      - ".opencode/hooks/goal/cursor/goal-inject.mjs"
      - ".opencode/hooks/goal/goal-plugin.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-isolation-spec-20260810"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The safest cutover is explicit per-session scope with no passive legacy fallback."
      - "Pi registered commands receive native session identity; Cursor's current prompt command does not."
      - "Devin goal adapters remain decommissioned."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Cross-Runtime Goal Isolation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS core, ESM hook scripts, TypeScript Pi extensions, JSON runtime config |
| **Runtime surfaces** | OpenCode plugin control, Pi extension, Cursor hook-only tier, decommissioned Devin surface |
| **Storage** | Repository-local JSON under `.opencode/skills/.goal-state/` |
| **Testing** | `node:test`, runtime adapter harnesses, isolated temp state roots, raw transcript canaries where supported |

### Overview

The implementation will introduce one scope resolver and make every runtime-neutral goal-core entry point require its output. State will move from the singleton `active-goal.json` to a cross-runtime namespace keyed by a collision-resistant digest of workspace, runtime, and native session id.

Tests led the change. The first failing matrix demonstrated two sessions replacing each other under the former core; the final matrix proves that set, read, injection, turn recording, status changes, and archive actions remain isolated. OpenCode's separate per-session plugin began as the compatibility control, then Phase 6 hardened its reversible, unbounded filename scheme without merging it into the sibling core.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Root cause reproduced with the supported manage CLI in an isolated state directory.
- [x] Current producer and consumer inventory recorded in `spec.md` and this plan.
- [x] Native session identity confirmed for Pi extension/command contexts and Cursor hook payloads.
- [x] Proposed state key and legacy policy documented in `decision-record.md`.
- [x] Pi management-surface identity confirmed: `registerCommand` handlers receive `CommandContext.sessionManager.getSessionId()`.
- [x] Cursor management boundary resolved: current prompt command lacks native identity and remains unsupported unless a native bridge is added.

### Definition of Done

- [x] Every requirement in `spec.md` has direct test or command evidence.
- [x] Two-session, same-id/different-runtime, missing-id, and legacy-state negative controls pass.
- [x] All goal-core, Pi, and retained Cursor-tier tests pass; Devin support-claim scans are clean.
- [x] The OpenCode `mk-goal` plugin suite remains green and expands from 119/119 to 125/125.
- [x] Runtime registrations parse and match tracked adapter files.
- [x] Goal docs, command text, runtime matrix, and state README describe the same final contract.
- [x] The sk-code packet-scoped delta and strict recursive packet validation pass from final state; the unrelated global backlog is recorded.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Explicit session-scoped repository with runtime adapters. The shared core owns validation, path derivation, state lifecycle, and rendering. Each runtime adapter owns only native identity extraction and delivery semantics.

### Key Components

- **GoalScope resolver**: validates `cwd`, runtime, and session id; derives a stable opaque scope key.
- **Scoped state repository**: reads, writes, archives, lists, and diagnoses one active record per scope.
- **Manage surface**: maps goal actions to the current session scope and refuses ambiguous mutation.
- **Runtime adapters**: extract native session identity and pass it to the core for injection and lifecycle updates.
- **Legacy quarantine**: detects the singleton, reports it, and supports explicit migration or archival without automatic binding.
- **Compatibility controls**: keep OpenCode's existing per-session plugin tests and storage untouched.

### Data Flow

```text
native runtime event or goal command
              |
              v
 workspace + runtime + native session id
              |
              v
        resolveGoalScope()
              |
              v
 .goal-state/cross-runtime/<runtime>/<scope-hash>.json
              |
       +------+------+
       |             |
   render/inject   mutate/archive
       |             |
 current session  current session only
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Surface | Current Role | Planned Action | Verification |
|---------|--------------|----------------|--------------|
| `.opencode/hooks/goal/lib/goal-core.cjs` | Hardcodes `active-goal.json`; all reads are unscoped. | Add required scope resolver and per-session paths; remove implicit singleton reads. | Core matrix with two sessions and two runtimes. |
| `.opencode/hooks/goal/bin/goal.cjs` | Calls core without identity and claims session resolution. | Require an adapter-provided scope or validated explicit session args; return stable missing-identity errors. | CLI set/show/clear tests for A and B plus missing id. |
| `.opencode/hooks/goal/pi/goal-context.ts` | Reads the singleton on three events although `ctx.sessionManager` is available. | Pass Pi session id on input, session start, and turn end. | Fake-context canaries and byte-equivalent non-owner state. |
| `.pi/prompts/goal-pi.md` | Runs the global manage CLI. | Replace/delegate to a registered Pi command that reads `ctx.sessionManager.getSessionId()`. | Set through the user-facing command, then inspect scoped state and raw transcript. |
| `.opencode/hooks/goal/cursor/goal-inject.mjs` | Uses workspace root only. | Validate `session_id`, with `conversation_id` as documented fallback if live-confirmed. | Payload variants and no-identity no-op tests. |
| `.cursor/commands/goal-cursor.md` | Runs the global manage CLI. | Bind to native session identity or remove unsupported management claims. | Current-session set/show canary or explicit supported-limit verdict. |
| Devin goal docs/matrices | Historical packets claim adapters that the current tree deliberately removed. | Remove stale current-support claims; do not restore the decommissioned adapters. | `git ls-files`, JSON registration check, and stale-claim scan. |
| `.opencode/plugins/mk-goal.js` | Separate per-OpenCode-session implementation. | Preserve native behavior while replacing reversible, unbounded filenames with digest keys and safe lazy migration. | Full plugin suite, long-id regression, and migration matrix. |
| Goal docs and playbooks | Describe the singleton as deliberate and some absent adapters as shipped. | Update to current scoped contract and verified runtime truth. | Focused stale-term scan and doc validation. |

Required pre-change inventories:

- Producers: `rg -n 'STATE_FILENAME|active-goal.json|goalPathForSession|resolveStateDir' .opencode/hooks/goal .opencode/plugins/mk-goal.js`.
- Consumers: `rg -n 'readGoalRecord|showGoal|setGoal|recordTurn|renderGoalBrief' .opencode .pi .cursor .devin`.
- Registration truth: compare `git ls-files .opencode/hooks/goal` with `.pi/extensions/`, `.cursor/hooks.json`, and `.devin/hooks.v1.json`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Lock the Identity Contract with Failing Tests

- [x] Define the `GoalScope` input and stable error codes.
- [x] Add a two-session test that fails against the singleton implementation.
- [x] Add same-id/different-runtime, missing-id, malicious-id, legacy-only, resume, and fork rows.
- [x] Capture baseline counts for every authoritative goal test suite.

### Phase 2: Replace Singleton Storage

- [x] Implement the shared scope resolver and opaque per-session path.
- [x] Thread scope through read, set, show, record, pause, resume, complete, clear, history, and health.
- [x] Preserve atomic writes and file modes.
- [x] Add legacy detection plus explicit migrate/archive behavior; remove passive fallback.

### Phase 3: Bind Pi End to End

- [x] Use `ctx.sessionManager.getSessionId()` at all three Pi lifecycle points.
- [x] Implement native `/goal-pi` management with `registerCommand` and command-context session identity.
- [x] Update `/goal-pi` to use that surface.
- [x] Live-smoke two isolated Pi sessions with distinct canaries; commands short-circuit before transcript bodies, and adapter harnesses cover injection.

### Phase 4: Reconcile Other Runtimes

- [x] Bind Cursor injection to native identity and document the explicit management limitation.
- [x] Remove stale Devin support claims and confirm no goal adapter remains registered.
- [x] Confirm Claude and Codex remain outside the custom cross-runtime goal hook.
- [x] Re-run the OpenCode goal plugin suite as the no-regression control.

### Phase 5: Cutover, Documentation, and Final Proof

- [x] Update contract docs, state README, command prompts, capability matrix, and playbooks.
- [x] Run the complete matrix, repository wrapper, and packet-scoped alignment delta.
- [x] Inspect final diff for unscoped calls, stale singleton claims, temporary files, and unrelated changes.
- [x] Record implementation evidence in `implementation-summary.md` and complete `checklist.md`.

### Phase 6: OpenCode Persistence Hardening and Playbook Alignment

- [x] Replace reversible hex filenames with fixed 64-character SHA-256 session keys.
- [x] Add validated lazy migration for active and archived legacy files without overwriting an occupied target.
- [x] Remove active retired Devin goal remnants while preserving unrelated runtime support and historical evidence.
- [x] Align all runtime goal manual playbooks and rerun final code, document, mirror, and strict packet gates.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

### Required Matrix

| Axis | Values |
|------|--------|
| Runtime | Pi, Cursor hook-only tier, decommissioned Devin truth check, OpenCode control |
| Session | A, B, missing, resumed A, forked C |
| Action | set, show, record, pause, resume, complete, clear, history, health |
| Existing state | none, same-session active, other-session active, malformed scoped, legacy singleton only |
| Collision | same runtime/different id, different runtime/same id, different workspace/same runtime/id |

### Test Layers

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Scope validation, path derivation, state lifecycle, legacy policy | `node --test` |
| Adapter | Pi context ids, Cursor payload ids, missing-id no-op | Existing fake runtime harnesses |
| CLI/native tool | Current-session set/show/mutate behavior | Spawned command/tool tests with isolated state roots |
| Integration | Two live Pi sessions with different canaries | Pi transcript JSONL inspection |
| Regression | OpenCode plugin and existing goal suites | Committed test commands from `goal-plugin.md` |
| Documentation | Stale contract terms, links, packet structure | `rg`, sk-doc checks, `validate.sh --strict` |

### Safe Negative Controls

1. Current core: setting A then B in one isolated state root must show `mutation=replaced` before the fix.
2. Final core: setting A and B under different scopes must keep both active and produce two distinct files.
3. Cross-read: rendering A with B's scope must never expose A's canary.
4. Legacy: a singleton alone must produce no injected block.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Pi `ctx.sessionManager.getSessionId()` | Internal runtime API | Confirmed in existing Pi hooks | Injection can be scoped immediately. |
| Pi identity-aware management API | Internal runtime API | Confirmed in installed declarations and existing extensions | Implement `/goal-pi` as a registered native command. |
| Cursor `session_id` / `conversation_id` payload | Internal runtime contract | Confirmed in shared adapter types and hooks | Injection can be scoped; command binding still needs proof. |
| Devin goal adapter | Historical runtime surface | Decommissioned | Remove stale claims; do not restore in this packet. |
| OpenCode per-session plugin | Existing implementation | Green reference design | Provides regression control and path/state precedent. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

- **Trigger**: session-scoped management cannot resolve identity, scoped files become unreadable, or the final matrix shows cross-session exposure.
- **Immediate safety action**: set `MK_GOAL_PLUGIN_DISABLED=1` for affected runtime sessions so no goal block is injected while rollback occurs.
- **Code rollback**: revert the scoped core, adapters, commands, and docs as one bundle. Do not leave a scoped writer paired with an unscoped reader.
- **Data handling**: retain scoped files and the quarantined singleton; do not merge multiple session goals back into one active record.
- **Rollback verification**: confirm injection is disabled, run goal health diagnostics, and verify no active goal block appears in a new session.

### Data Reversal

- **Has data migration?** Yes, runtime JSON path migration only.
- **Reversal procedure**: preserve both layouts, disable injection, and restore code. Never choose one scoped goal as the global replacement automatically.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 9. PHASE DEPENDENCIES

The scoped core is the shared prerequisite for every runtime binding. Pi's native management mechanism is resolved, so its end-to-end cutover follows the core. Cursor hook isolation and Devin documentation reconciliation can proceed independently once the core contract is stable.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:dependency-graph -->
## 10. DEPENDENCY GRAPH

```text
identity probes + failing matrix
              |
              v
       scoped core/store
              |
        +-----+-----+
        |           |
        v           v
    Pi binding   Cursor/Devin truth reconciliation
        |           |
        +-----+-----+
              v
       docs + final proof
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Identity contract and tests | Phase 1 research | Core and management design |
| Scoped core/store | Tests | All runtime bindings |
| Pi binding | Core and confirmed registered-command API | Live two-session proof |
| Cursor/Devin reconciliation | Core and accepted support boundaries | Final runtime matrix |
| Documentation and final proof | All implementation stages | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:effort -->
## 11. EFFORT

| Stage | Complexity | Relative Effort |
|-------|------------|-----------------|
| Identity probes and failing tests | Medium | 20% |
| Scoped core and migration | High | 30% |
| Pi end-to-end binding | High | 25% |
| Cursor/Devin reconciliation | Medium | 15% |
| Documentation and final proof | Medium | 10% |

The estimates size implementation and verification effort relative to this packet; they are not elapsed-time commitments.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:critical-path -->
## 12. CRITICAL PATH

Critical path: scoped core, native Pi binding, two-session live proof, final gate.

Parallel work is not required. Cursor/Devin reconciliation can begin after the scoped core contract is stable, but implementation ownership should remain serialized unless the user explicitly requests multi-agent work.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## 13. MILESTONES

| Milestone | Description | Success Criteria |
|-----------|-------------|------------------|
| M1 | Identity contract locked | Capability probes and failing matrix recorded. |
| M2 | Scoped storage green | Core tests prove no cross-session or cross-runtime mutation. |
| M3 | Pi isolated end to end | Two live Pi sessions retain and receive distinct canaries. |
| M4 | Runtime truth reconciled | Tracked adapters, registrations, docs, and tests agree. |
| M5 | Release ready | Full verification and workspace gate pass; legacy state is quarantined safely. |
<!-- /ANCHOR:milestones -->

---

## 14. ARCHITECTURE DECISION

The proposed decision is recorded in `decision-record.md`: require explicit composite session scope for the runtime-neutral goal system and prohibit passive fallback to `active-goal.json`.

---

## 15. AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the active write scope is this packet plus files explicitly selected by an approved implementation pass.
- Read the current goal core, every selected adapter, its registration, and its tests before editing.
- Run the focused negative control and record baseline test counts before changing behavior.
- Use the Phase 1 verdict: native Pi registered command; Cursor command unsupported without an equivalent native binding.

### Execution Rules

| Rule | Required Behavior |
|------|-------------------|
| Scope | Change only the core, adapters, commands, tests, configs, and docs named by the approved implementation scope. |
| Evidence | Treat historical completion claims as hypotheses until tracked source, registration, and a runnable test confirm them. |
| Ordering | Add failing isolation tests, fix the responsible producer once, then update consumers and docs. |
| Safety | Never bind the legacy singleton to a session implicitly; disable injection before rollback. |
| Verification | Run focused tests during repair, then the complete goal and workspace gates from final state. |

### Status Reporting Format

```text
status: PASS | FAIL | BLOCKED
scope: <runtime/session surface>
evidence: <command, exit code, and observed result>
files_changed: <scoped paths>
open_risk: <remaining uncertainty or none>
```

### Blocked Task Protocol

When native session identity is unavailable at a management surface, stop that runtime's cutover. Record the exact probe, output, and unsupported boundary. Do not substitute a global file, process-wide current-session pointer, or user-guessed id. Continue only with independent work that cannot produce a partial scoped/global deployment.

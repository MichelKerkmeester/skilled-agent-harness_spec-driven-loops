---
title: "Plan: Deep Loop Locks, State, and Recovery"
description: "Implementation plan for Deep Loop Locks, State, and Recovery."
trigger_phrases:
  - "deep-loop-locks-state-and-recovery"
  - "memory leak 4"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/004-deep-loop-locks-state-and-recovery"
    last_updated_at: "2026-05-22T10:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Scaffolded concrete phase scope for the memory leak remediation arc."
    next_safe_action: "Plan and execute this child phase when its predecessor handoff criteria pass."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0404040404040404040404040404040404040404040404040404040404040404"
      session_id: "009-memory-leak-remediation-arc-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This phase is scoped from the 020 and 024 memory-leak research packets."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Deep Loop Locks, State, and Recovery

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js filesystem/process APIs, Vitest |
| **Framework** | Spec Kit deep-loop runtime helpers under `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/` |
| **Storage** | Packet-scoped JSON lock file, JSONL state logs, JSON state snapshots |
| **Testing** | Targeted Vitest fixtures plus full `mcp_server/tests/deep-loop/` regression |

### Overview
Make deep-research, deep-review, ai-council, and embedded deep-loop flows share one interruption-safe state contract: packet-scoped locks with owner liveness, append-only JSONL recovery, and atomic replacement for full-state rewrites.

The current owner surfaces are:
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts`: writes executor provenance, `iteration_start`, `dispatch_failure`, and last-record executor audit updates.
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`: reads state logs, validates the last iteration record, and appends `verification_degraded` events.
- `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml`: declares `.deep-research.lock` and calls the shared TypeScript audit/validation helpers.
- `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml`: has no advisory lock today and writes the same class of deep-loop state.
- `.opencode/skills/sk-ai-council/scripts/lib/persist-artifacts.js` and `.opencode/skills/sk-ai-council/scripts/lib/audit-trail.js`: own ai-council JSONL persistence and rotation outside the TypeScript deep-loop helper set.

This phase will add shared helpers in `mcp_server/lib/deep-loop/`, wire the existing TypeScript state-log writers through them, and document the remaining non-TypeScript consumers if they cannot be safely reached without broad workflow rewrites.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Source evidence is anchored to remediation-map item 5 plus research findings on stale locks, JSONL partial writes, and cross-flow append-only gaps.
- [x] Verification fixtures are named: kill-during-append, corrupt trailing JSONL line, dead-PID lock, TTL-expired lock, concurrent acquire/release, and atomic state replacement.
- [x] No destructive cleanup is in scope; stale-lock recovery deletes or overwrites only the packet-local `.deep-loop.lock` after PID or heartbeat proof.

### Definition of Done
- [ ] REQ-001 is satisfied by JSONL tail repair plus append-safe writers and recorded evidence.
- [ ] REQ-002 is satisfied by packet-scoped lock acquire/refuse/reclaim fixtures.
- [ ] Targeted helper tests, full deep-loop regression, typecheck, build, and strict spec validation pass.
- [ ] This phase summary includes verification evidence and a parent-agent commit handoff.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Small shared filesystem primitives, then lowest-level caller wiring. The helper modules stay independent of command YAML runtimes so deep-research, deep-review, ai-council, and embedded complete-with-research flows can adopt the same semantics incrementally.

### Key Components
- **`loop-lock.ts`**: owns packet-scoped lock JSON, owner PID checks, heartbeat refresh, release, stale detection, and typed held-lock failures.
- **`jsonl-repair.ts`**: owns append-safe JSONL writes via append mode and corrupt trailing-line repair.
- **`atomic-state.ts`**: owns full-file JSON state replacement through temp write, fsync, and rename.
- **Existing writer wiring**: `executor-audit.ts` and `post-dispatch-validate.ts` will use shared JSONL helpers instead of private read-full/rewrite append paths where possible.
- **Command/runtime adoption note**: YAML lock acquisition remains declarative today; the reusable helper is the runtime contract to wire into command interpreters or generated runners.

### Data Flow
1. On deep-loop start, run `repairJsonlTail(stateJsonl)` before resume/reducer logic reads the log.
2. Acquire `<packet-dir>/.deep-loop.lock` using JSON lock metadata. If the holder is alive and fresh, fail fast with `LoopLockHeldError` or `{ acquired: false, holder }`; if it is stale, atomically overwrite with the new owner.
3. During the run, refresh `last_heartbeat_iso` on a bounded interval. Release deletes the lock only when `owner_pid` matches.
4. Append state events with `appendJsonlRecord(path, record)`, using append mode so appends land as newline-delimited records.
5. Rewrite full state snapshots with `writeStateAtomic(path, data)` so readers see either the prior complete file or the new complete file.

### Lockfile Format

The packet-scoped lock lives at `<packet-dir>/.deep-loop.lock` and is JSON:

```json
{
  "owner_pid": 12345,
  "started_at_iso": "2026-05-22T12:00:00.000Z",
  "ttl_ms": 300000,
  "last_heartbeat_iso": "2026-05-22T12:01:00.000Z",
  "packet_id": "system-spec-kit/.../004-deep-loop-locks-state-and-recovery",
  "runtime_kind": "cli-codex"
}
```

The TypeScript interface uses camelCase fields and serializes to the required snake_case JSON. `runtimeKind` is `ExecutorKind | "main"`.

### Acquire, Refresh, Release Contract

- `acquireLoopLock(lockPath, data)` writes to `<lockPath>.tmp.<pid>.<timestamp>`, fsyncs the file, renames it into place, and returns `{ acquired: true, lock }`.
- If the file exists, acquisition reads and validates it. A fresh live holder returns `{ acquired: false, holder }` without mutation.
- Stale detection is `(now - last_heartbeat_iso) > ttl_ms * 2` or `!processAlive(owner_pid)`.
- `refreshLoopLock(lockPath, ownerPid)` rewrites `last_heartbeat_iso` atomically and bails on owner mismatch.
- `releaseLoopLock(lockPath, ownerPid)` unlinks only when the current lock owner matches.
- `processAlive(pid)` uses `process.kill(pid, 0)`: `ESRCH` means dead, `EPERM` means alive, all other errors fail closed as alive.

### JSONL Append And Repair Contract

- `appendJsonlRecord(path, record)` writes `JSON.stringify(record) + "\n"` using append mode (`flag: "a"`).
- `repairJsonlTail(path)` reads newline-delimited records, parses through the last complete valid record, truncates a corrupt trailing line or trailing corrupt segment, and returns `{ repaired, droppedBytes }`.
- The repair helper only strips trailing corrupt bytes. It does not rewrite valid historical records or hide mid-file corruption.

### Atomic State Replacement Contract

- `writeStateAtomic(path, data)` writes JSON to `<path>.tmp.<pid>.<timestamp>`, fsyncs the file, renames it into place, and removes the temp file on failure.
- Existing readers either see the old complete state file or the new complete state file; no caller observes a half-written JSON document.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts` | Current JSONL append/rewrite owner for executor audit events | Replace private unsafe append path with `appendJsonlRecord`; keep targeted merge rewrites but atomicize through helper where appropriate | Existing executor-audit tests plus JSONL repair regression |
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` | Reads state log and appends verification-degraded events | Run JSONL tail repair before last-record validation; append degraded event through shared append helper | Existing post-dispatch tests plus corrupt-tail fixture |
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/loop-lock.ts` | New lock contract owner | Add PID, TTL, heartbeat, stale recovery, typed held-lock error | Dead-PID, TTL-expired, fresh-holder, concurrent acquire, refresh, release fixtures |
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/jsonl-repair.ts` | New JSONL state-log helper | Add append-safe writes and corrupt-tail repair | Corrupt trailing line, kill-during-append, empty file, concurrent append fixtures |
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/atomic-state.ts` | New full-state helper | Add write-temp/fsync/rename replacement | Atomic write and cleanup-on-failure fixtures |
| `.opencode/skills/sk-ai-council/scripts/lib/persist-artifacts.js` | Non-TypeScript ai-council JSONL writer | Inspect for compatibility; defer broad JS workflow rewrite unless a local low-risk helper adoption is obvious | Documented limitation if not wired |

Required inventories:
- Same-class producers found: `executor-audit.ts`, `post-dispatch-validate.ts`, deep-research YAML, deep-review YAML, ai-council persistence helpers.
- Consumers affected: post-dispatch validator, reducers reading state JSONL, executor audit tests, deep-loop command runtimes that consume `.deep-research.lock`/state logs.
- Matrix axes: normal acquire/release, fresh concurrent holder, dead PID, TTL expiry, corrupt trailing JSONL, partial append interruption, atomic rewrite failure.
- Algorithm invariant: no process is terminated in this phase. PID liveness is probe-only.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract And Docs
- [ ] Replace generic `plan.md` with the concrete lock, JSONL, and state contracts in this file.
- [ ] Replace generic `tasks.md` with file-scoped implementation and verification tasks.
- [ ] Strict-validate the phase after each spec-doc write.

### Phase 2: Shared Helpers
- [ ] Add `loop-lock.ts` with acquire, refresh, release, staleness, liveness, and held-lock error behavior.
- [ ] Add `jsonl-repair.ts` with append-mode writes and repairable corrupt trailing lines.
- [ ] Add `atomic-state.ts` with temp-write, fsync, rename, and cleanup-on-error behavior.

### Phase 3: Lowest-Level Wiring
- [ ] Update `executor-audit.ts` to share JSONL append semantics and normalize executor metadata to `kind`.
- [ ] Update `post-dispatch-validate.ts` to repair trailing JSONL corruption before validation and use shared append for verification events.
- [ ] Search command YAML and state writers for `executor: { type:` or `type: "{config.executor.type}"`; rewrite in-scope state/audit writers to `kind` or document no remaining TypeScript normalization needed.

### Phase 4: Verification And Handoff
- [ ] Add module-level Vitest fixtures for locks, JSONL repair, and atomic state.
- [ ] Run targeted new tests, full deep-loop regression, typecheck, build, and strict validation for child + parent.
- [ ] Fill `implementation-summary.md`, set continuity to 100%, and append the commit handoff file list.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Lock owner/TTL/heartbeat, JSONL repair, atomic state replacement | Vitest under `mcp_server/tests/deep-loop/` |
| Regression | Existing deep-loop executor, validator, config, prompt, and review-depth tests | `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/deep-loop/ --config mcp_server/vitest.config.ts` |
| Static | TypeScript and build correctness | `npm run typecheck --workspace=@spec-kit/mcp-server`; `npm run build --workspace=@spec-kit/mcp-server` |
| Spec | Phase and parent documentation conformance | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |

Required fixtures:
- Kill-during-append: child process writes a partial JSONL line, is killed, and `repairJsonlTail` drops the trailing bytes.
- Corrupt trailing line: file ending in `{"partial":` is truncated to prior valid records.
- Dead-PID lock: known-dead PID holder is overwritten.
- Concurrent run: second acquire sees the live holder and refuses until release.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 executor-audit guards | Internal predecessor | Complete | Shared audit functions are safe to reuse for state-writer normalization. |
| Source research packet 020 | Internal spec docs | Available | Defines stale lock, JSONL interruption, and `type`/`kind` drift evidence. |
| Existing deep-loop Vitest suite | Internal tests | Available | New fixtures must coexist with 114 currently passing tests. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New helper tests fail, existing deep-loop regression fails, typecheck/build fails, or strict validation fails.
- **Procedure**: Keep the failing diff for parent inspection, write `handover.md` with the failing command and next safe action, and do not claim completion.
- **Runtime Safety**: This phase does not kill or reap any process. Rollback is file-level only.
<!-- /ANCHOR:rollback -->

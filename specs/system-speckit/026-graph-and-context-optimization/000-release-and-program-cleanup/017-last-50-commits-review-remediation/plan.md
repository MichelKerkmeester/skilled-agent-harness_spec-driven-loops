---
title: "Implementation Plan: Remediation of the 016 Last-50-Commits Deep Review"
description: "Plan for remediating the 016 review's actionable findings as four parallel work streams (lifecycle/shutdown, IPC/socket/launcher, validator/memory-write, contract/config/docs) plus a dedicated test round, with the keystone shutdown unification done first. Verification: tsc clean, full + new suites green, byte-identical fork parity, alignment-drift PASS."
trigger_phrases:
  - "016 remediation plan"
  - "4 stream remediation partition"
  - "shutdown unification keystone"
  - "socket fresh-bind hardening plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/017-last-50-commits-review-remediation"
    last_updated_at: "2026-06-05T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored the 4-stream parallel remediation plan + test round"
    next_safe_action: "Operator builds + deploys the dist"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "last-50-commits-review-remediation-2026-06-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Remediation of the 016 Last-50-Commits Deep Review

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript MCP server + shared IPC, `.cjs` launchers, agent/config mirrors |
| **Framework** | spec-kit remediation packet; fixes verified with `tsc --noEmit` + vitest + `verify_alignment_drift.py` |
| **Storage** | SQLite/WAL via the vector-index store; lease files; IPC sockets (no schema change) |
| **Testing** | Affected vitest suites (1055), new/extended (154), code-graph fork drift+toctou (3); `validate.sh --strict` on this packet |

### Overview
The 016 report's actionable findings cluster into four largely independent surfaces plus a cross-cutting test round, so the work was partitioned into four parallel streams. The keystone — F-X19-02, unifying the divergent SIGTERM/SIGINT handler stacks into one ordered path — was done first because it unblocks the rest of the A4 lifecycle cluster (the ordered drain that F-A4-01's recoverability assumes). Stream 2 hardens the IPC/socket and launcher surface (both byte-identical `socket-server.ts` forks together). Stream 3 bounds the validator DFS and tightens the memory-write guards. Stream 4 closes contract/config/docs drift. A final test round adds drift, fresh-bind, contradiction-cycle, auto-fix, and rollout-bucket coverage and de-no-ops weak assertions. Items that were already correct by design are accepted with no code change rather than patched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Frozen finding list available (`016/review/review-report.md`) with per-finding `file:line` traces
- [x] Each finding classified actionable vs accept-no-action before work began
- [x] Verification commands defined (tsc, vitest suites, alignment drift)

### Definition of Done
- [x] All acceptance criteria met (every actionable finding fixed; accept-no-action items recorded)
- [x] `npx tsc --noEmit` exit 0, 0 errors; affected (1055) + new/extended (154) + fork (3) suites pass; alignment-drift PASS
- [x] Docs updated (spec/plan/tasks/checklist/decision-record/implementation-summary for this packet)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The shutdown path is the keystone: there must be exactly one ordered teardown sequence (file-watcher first, then ingest-worker fence via `job-queue.stopWorker()`/`shuttingDown`, then `vectorIndex.closeDb()`), reached deterministically from any signal with one exit code. The worker uses a non-reopen DB accessor once the shutting-down signal is set so it cannot resurrect a closed DB. The IPC socket layer fails closed on a fresh bind: it lstat-rejects a symlink tail, `fchmod`s under an lstat guard, and canonicalizes fail-closed; the shared copy and the code-graph fork stay byte-identical with a drift test as the enforcement seam. The validator's session-id DFS is bounded by dir/depth/time caps so `--strict` cannot be turned into a DoS. The contract/config/docs surface is brought into parity (embedder tools mapped, dangling refs removed, note keys present, the 015 miscount corrected). No DB schema, MCP wire protocol, or lease-file format changed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `context-server.ts` `fatalShutdown` + signal handlers | Cleanup list with no job-queue stop; divergent handler stacks | Add worker fence before `closeDb`; unify to one ordered path, deterministic exit | F-A4-01 + F-X19-02/F-A4-02; job-queue + drift tests pass |
| `lib/runtime/shutdown-hooks.ts` | Second divergent handler stack (exit 143/130) | Fold into the single ordered shutdown path | F-X19-02; deterministic exit verified |
| `lib/ops/job-queue.ts` | Worker loop had only a re-entrancy latch, no stop fn | Add `stopWorker()`/`shuttingDown` guard + non-reopen DB accessor | F-A4-01; new job-queue.vitest cases pass |
| `shared/ipc/socket-server.ts` (+ code-graph fork) | Fresh-bind symlink TOCTOU + fail-open canonicalize + non-re-entrant | lstat-reject symlink tail, lstat-guarded `fchmod`, fail-closed canonicalize, re-entrant guard | F-A5-01/03/F-A4-03; fresh-bind test + `diff -q` byte-identical |
| `bin/mk-spec-memory-launcher.cjs` | Lease reclaim fsync asymmetry | Add fsync parity | F-004 |
| `lib/validation/orchestrator.ts` | Unbounded session-id DFS on `--strict` | Add dir/depth/time caps | F-A5-02 |
| `handlers/memory-save.ts`, `lib/search/entity-density.ts`, `handlers/save/response-builder.ts` | `archived` not skipped; stale doc-comment; over-broad E089 substring | Skip `archived`; fix comment; tighten `access denied:` | F-A2-01/02/03 |
| `lib/architecture/layer-definitions.ts`, agent/config mirrors, 015 docs | Embedder tools unmapped; dangling `.gemini/agents` refs; missing note keys; P0 miscount | Map embedder tools; remove dangling refs; add note keys; 2 -> 1 | F-A7-01/A8-01/A8-02/A9-01 |
| `mcp_server/tests/**` | Drift/fresh-bind/contradiction/auto-fix/rollout coverage gaps + 7 no-op assertions | Add/extend tests; de-no-op assertions; gitignore fixture dir | F-X19-01/03, F-A6-01/02/03 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Freeze the 016 actionable finding list and classify actionable vs accept-no-action
- [x] Partition the work into four parallel streams + a test round; sequence the shutdown keystone first
- [x] Confirm verification commands (tsc, vitest suites, `verify_alignment_drift.py`)

### Phase 2: Core Implementation
- [x] Stream 1 keystone — unify the shutdown signal-handler stack and fence the ingest worker before `closeDb` (F-X19-02, F-A4-01, F-A4-02)
- [x] Stream 2 — socket fresh-bind hardening on both byte-identical forks + re-entrant guard + launcher lease fsync (F-A5-01/03, F-A4-03, F-004)
- [x] Stream 3 — bound the validator DFS and tighten memory-write guards (F-A5-02, F-A2-01/02/03)
- [x] Stream 4 — contract/config/docs parity + 015 miscount correction (F-A7-01, F-A8-01/02, F-A9-01)

### Phase 3: Verification
- [x] Test round — add/extend drift, fresh-bind, job-queue, auto-fix, contradiction-cycle, rollout-bucket tests; de-no-op 7 assertions; gitignore fixture dir (F-X19-01/03, F-A6-01/02/03)
- [x] Run `npx tsc --noEmit`; run affected + new/extended + fork suites; run `verify_alignment_drift.py`; confirm `diff -q` on both socket-server copies
- [x] Record accept-no-action ADRs; run `validate.sh <folder> --strict`; reconcile completion metadata
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Type check | `mcp_server`, `shared`, code-graph compile clean | `npx tsc --noEmit` (exit 0, 0 errors) |
| Affected unit/integration | Lifecycle, IPC, validator, memory-write, contract regression | vitest (1055 pass, 0 fail) |
| New/extended | processLiveness drift, fresh-bind, job-queue, auto-fix OR-path, contradiction cycle, rollout bucketing | vitest (154 pass) |
| Fork parity | Both `socket-server.ts` copies byte-identical; drift + TOCTOU | `diff -q` + code-graph fork suite (3 pass) |
| Alignment drift | spec-kit tree integrity | `verify_alignment_drift.py --root .opencode/skills/system-spec-kit` (PASS, 1510 files, 0 findings) |
| Packet integrity | `validate.sh <folder> --strict` RESULT PASSED | spec-kit validator |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `016/review/review-report.md` frozen finding list | Internal | Green | No remediation scope |
| Repo vitest suites + TypeScript toolchain | Internal | Green | No verification |
| `verify_alignment_drift.py` | Internal | Green | No tree-integrity check |
| Operator build + deploy of the dist | External | Deferred | Running daemon keeps old behaviour until deployed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A shipped fix regresses behaviour after deploy, or a fork drifts.
- **Procedure**: Revert the specific stream's commits (each stream is independent and individually verified); for the socket forks, restore both copies together to keep them byte-identical and re-run the drift test. The running daemon is unaffected until the dist is built and deployed, so a pre-deploy revert needs no daemon recycle.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## PHASE DEPENDENCIES (Level 3)

| Phase | Depends On | Rationale |
|-------|------------|-----------|
| Stream 1 (shutdown keystone) | None | Keystone — unifies the ordered drain the A4 cluster assumes; sequenced first |
| Stream 2 (IPC/socket/launcher) | None (parallel) | Independent surface; touches socket-server + launcher only |
| Stream 3 (validator/memory-write) | None (parallel) | Independent surface; validator + memory-write handlers |
| Stream 4 (contract/config/docs) | None (parallel) | Independent surface; layer map, mirrors, config notes, 015 docs |
| Test round | Streams 1-4 | Exercises the fixed surfaces; de-no-ops assertions once fixes land |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## EFFORT ESTIMATE (Level 3)

| Stream | Findings | Relative Effort | Notes |
|--------|----------|-----------------|-------|
| Stream 1 | F-A4-01, F-X19-02, F-A4-02 | High | Keystone; ordered drain + worker fence + non-reopen accessor |
| Stream 2 | F-A5-01, F-A5-03, F-A4-03, F-004 | Med | Two byte-identical forks kept in sync |
| Stream 3 | F-A5-02, F-A2-01/02/03 | Low-Med | DFS caps + small guard/comment fixes |
| Stream 4 | F-A7-01, F-A8-01/02, F-A9-01 | Low | Map + mirror + config-note + doc miscount |
| Test round | F-X19-01/03, F-A6-01/02/03 | Med | New files + de-no-op + gitignore fixture dir |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## ENHANCED ROLLBACK (Level 3)

| Stream | Rollback Unit | Verification After Rollback |
|--------|---------------|------------------------------|
| Stream 1 | Revert shutdown/job-queue commits together | tsc clean; job-queue + drift tests pass on the pre-fix baseline |
| Stream 2 | Revert both socket-server forks + launcher together | `diff -q` byte-identical; fresh-bind + fork suites pass |
| Stream 3 | Revert validator + memory-write commits | tsc clean; validator + memory-save tests pass |
| Stream 4 | Revert layer map + mirrors + config + 015 docs | alignment-drift PASS; ListTools output unchanged |
| Test round | Revert added/extended tests | Remaining suites still pass (no production dependency on the new tests) |
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────────────────────┐     ┌─────────────┐
│   Phase 1   │────►│          Phase 2            │────►│   Phase 3   │
│  Freeze +   │     │  Stream 1 keystone first    │     │ Test round  │
│  classify   │     │  Streams 2-4 in parallel    │     │  + verify   │
└─────────────┘     └──────────────┬──────────────┘     └─────────────┘
                                   │
                  ┌────────────────┼────────────────┐
                  ▼                ▼                ▼
            ┌──────────┐    ┌──────────┐    ┌──────────┐
            │ Stream 2 │    │ Stream 3 │    │ Stream 4 │
            │ IPC/sock │    │ validator│    │ contract │
            └──────────┘    └──────────┘    └──────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Stream 1 (keystone) | None | Ordered shutdown + worker fence | Test round |
| Stream 2 (IPC/socket) | None | Fail-closed bind on both forks | Test round |
| Stream 3 (validator) | None | Bounded DFS + guards | Test round |
| Stream 4 (contract/docs) | None | Layer/mirror/config/doc parity | Test round |
| Test round | Streams 1-4 | Coverage + de-no-op + verification gate | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Stream 1 — shutdown keystone** - highest effort - CRITICAL (unblocks the A4 cluster)
2. **Test round** - depends on all streams - CRITICAL (de-no-op + verification gate)
3. **Verification gate** - tsc + suites + alignment drift + validate - CRITICAL

**Total Critical Path**: Stream 1 -> test round -> verification gate.

**Parallel Opportunities**:
- Streams 2, 3, and 4 run simultaneously, independent of Stream 1.
- Within Stream 2, both `socket-server.ts` forks are edited together to stay byte-identical.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Keystone shutdown shipped | One ordered path + worker fence; job-queue tests pass | Phase 2 |
| M2 | Streams 2-4 shipped | Fail-closed bind, bounded DFS, contract/docs parity | Phase 2 |
| M3 | Verified + recorded | tsc clean; 1055+154+3 tests pass; alignment-drift PASS; ADRs recorded | Phase 3 |
<!-- /ANCHOR:milestones -->

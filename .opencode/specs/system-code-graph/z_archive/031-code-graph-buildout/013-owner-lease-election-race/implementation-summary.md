---
title: "Implementation Summary: owner-lease election race (OR-R-01) investigation"
description: "Read-only investigation of OR-R-01. Traces the launcher's 4-layer single-writer election, shows two of the gates are non-atomic and that writeLeaseFile runs outside the bootstrap-lock branch, and concludes the race is P2 benign-transient (corruption path closed by OR-1-01; bounded by the daemon heartbeat). Fix deferred pending an owner risk-decision."
trigger_phrases:
  - "OR-R-01 investigation summary"
  - "launcher 4-layer election analysis"
  - "writeLeaseFile reprobe non-atomic"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/013-owner-lease-election-race"
    last_updated_at: "2026-05-29T14:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed read-only investigation; root cause + severity P2 + Options A/B documented"
    next_safe_action: "Await owner decision on Option B (land vs schedule)"
    blockers:
      - "Fix touches operator-sensitive launch-election; no deterministic concurrency test"
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/skills/system-code-graph/mcp_server/index.ts"
    completion_pct: 50
    open_questions:
      - "Land Option B now or schedule with operator coordination?"
    answered_questions:
      - "Corruption-grade? No — P2 benign-transient; the migration corruption path is closed by OR-1-01."
      - "Does the server re-elect atomically? No — it only heartbeat-refreshes and self-shuts-down (index.ts:46-55)."
---
# Implementation Summary: Owner-Lease Election Race (OR-R-01) Investigation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-owner-lease-election-race |
| **Completed** | 2026-05-29 (investigation only; fix deferred) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet is an investigation, not a code change. It pins down OR-R-01, the residual owner-lease election race that the OR-1-01/OR-2-01 fix agent surfaced during the Opus R2 deep review, and it answers the one question that decides whether to act: is this a real corruption bug or a bounded transient? The answer is bounded transient (P2). Here is the proof.

### The launcher runs a 4-layer single-writer election, and two layers are non-atomic

All line numbers are `.opencode/bin/mk-code-index-launcher.cjs` at the current HEAD unless noted.

1. **Owner-lease reclaim** (`acquireOwnerLeaseFile`, 347-386). For a `stale-heartbeat-reclaim` lease the reclaim path writes the owner lease with a plain atomic tmp+rename and then re-reads to confirm its own pid survived (373-386, the DR-002-01 comment). This read-after-write only catches a *concurrent overlapping* write. If launcher L1 completes write+reread before L2 writes, both end up `acquired:true`.
2. **Bootstrap lock** (`acquireBootstrapLock`, 714-757). A `mkdir(lockDir)` — genuinely atomic, exactly one winner. But it only guards the build + DB migration inside the `if (lockHeld)` block (881-946). The EEXIST loser returns `false` when `artifactsReady()` (727-728).
3. **PID-lease reprobe** (`writeLeaseFile()` + `readLeaseFile()`, 948-954). This runs **outside** the `if (lockHeld)` block, so both the bootstrap-lock winner and loser reach it. `writeLeaseFile` (602-607) is a plain tmp+rename with no `O_EXCL`. The reprobe (949-954) reads back the lease and, if the pid is not its own, prints `LEASE_HELD_BY` and `process.exit(0)`. Same non-atomic flaw: if L1 writes+reprobes before L2 writes, both read their own pid and both proceed to `launchServer()` (955).
4. **Daemon heartbeat** (`mcp_server/index.ts:46-55`). The daemon does NOT re-elect atomically. It refreshes the owner lease on a timer (`OWNER_LEASE_REFRESH_INTERVAL_MS = DEFAULT_OWNER_LEASE_TTL_MS / 3`, index.ts:34) and self-shuts-down when a refresh finds the lease pid is no longer its own (48-51). So if two daemon children start, the loser exits only at the next heartbeat tick. That is exactly the "~12 s both alive" the fix agent observed.

### Severity: P2 (benign-transient), not P0/P1

The corruption-grade outcome of this class is two processes copying or writing the DB at once. That path is already closed: OR-1-01 moved the DB migration inside the atomic bootstrap-lock branch and added `COPYFILE_EXCL`, so two launchers can never both migrate. What remains under OR-R-01 is a rare window where two daemon children both open an already-built DB. SQLite in WAL mode tolerates concurrent connections, serializes writers (one retries on `database is locked`), and the non-owner daemon exits within one heartbeat tick. The visible symptoms are transient: a brief double process, short-lived `LEASE_HELD_BY` churn, and possible `database is locked` log noise. No persistent corruption, no permanent dual-writer.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `013-owner-lease-election-race/*` | Created | Investigation packet (spec/plan/tasks/this summary + metadata) |
| `.opencode/bin/mk-code-index-launcher.cjs` | Unchanged | Fix deferred — see plan.md Options A/B |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered as a read-only code trace. A planned 5-agent investigation workflow (mechanics / server-side / prosecutor / defender / empirical) failed on a transient dispatch error (0 subagent tokens), so the trace was done in the main loop by reading the launcher election flow, `owner-lease.ts`, and `index.ts` directly, then reasoning prosecutor-vs-defender to the severity verdict. No reviewed code was modified.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Classify OR-R-01 as P2, not P1/P0 | The corruption path is already closed by OR-1-01; the residual is a heartbeat-bounded double-daemon window that WAL tolerates |
| Defer the fix instead of landing it reactively | The fix touches operator-sensitive launch-election and bridge fallback, has no deterministic test, and the operator has concurrent launcher WIP — exactly the conditions where a rushed change caused regressions earlier this session |
| Prefer Option B (exclusive `writeLeaseFile`) over Option A (gate launch on the bootstrap lock) | Option B is minimal and localized and mirrors the existing `writeOwnerLeaseFileExclusive` pattern; Option A changes the loser path to a bridge whose target socket may not be up yet |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Root cause traced to exact lines | PASS — `mk-code-index-launcher.cjs` 347-386, 602-607, 880-955; `index.ts` 34-55 |
| Corruption path still open? | PASS (closed) — OR-1-01 bootstrap-lock gating + `COPYFILE_EXCL` confirmed in current code (880-946) |
| Server re-elects atomically? | Confirmed NO — `index.ts` imports only `refreshOwnerLease` and self-shuts-down on mismatch (20, 48-51) |
| Empirical 2-launcher repro | NOT RUN — investigation workflow failed transiently; severity derived from code trace. Recommend an empirical repro as part of the fix's regression test |
| Code modified | NONE (investigation only) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Severity is code-trace-derived, not empirically reproduced.** The 2-launcher empirical repro is deferred to the fix's regression test (the investigation workflow that would have run it failed on a transient dispatch error).
2. **No deterministic test exists for this race.** OR-1-01 already showed a 2-launcher concurrency test is only ~75% deterministic; the fix will ship a probabilistic detector plus a code-level invariant (the `O_EXCL` claim) as the real guarantee.
3. **Fix is unimplemented pending an owner decision** (Option A vs B, and risk acceptance given the operator's concurrent launcher WIP). See plan.md.
<!-- /ANCHOR:limitations -->

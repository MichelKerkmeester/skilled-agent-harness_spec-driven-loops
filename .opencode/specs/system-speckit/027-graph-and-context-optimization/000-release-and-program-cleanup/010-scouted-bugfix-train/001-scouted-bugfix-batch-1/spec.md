---
title: "Feature Specification: Scouted Bugfix Batch 1"
description: "An 8-agent scout surfaced 40 candidate deep-research targets across the codebase; the top 5 were selected, deep-dived in parallel by gpt-5.5-fast (which refuted the two pre-try lease-leak headlines but confirmed a real lesser defect in each), then fixed and tested by 5 disjoint-file implement agents. Five verify-first fixes landed across 10 files: two shell command-injection / rm-rf hardenings, one IPC socket hardening, and two MCP server bugs (a close()-blocks-on-backoff hang and a missing scan lease heartbeat)."
trigger_phrases:
  - "scouted bugfix batch 1"
  - "worktree reaper eval injection"
  - "setup cp sandbox rmrf guard"
  - "advisor ipc socket hardening"
  - "scan lease heartbeat fix"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/001-scouted-bugfix-batch-1"
    last_updated_at: "2026-06-03T05:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "8-agent scout (40 candidates -> top 5); 5 gpt-5.5-fast deep-dives confirmed/refuted each"
    next_safe_action: "Fix the 5 confirmed defects with disjoint-file implement agents, verify-first"
    blockers: []
    key_files:
      - ".opencode/bin/worktree-reaper.sh"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/ops/file-watcher.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scouted-bugfix-batch-1-session"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions:
      - "User directive: fix the first batch of 5 scouted bugs, verify-first; the two pre-try lease-leak headlines were refuted but each target still had a real lesser defect to fix."
---
# Feature Specification: Scouted Bugfix Batch 1

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-03 |
| **Branch** | `134-scouted-bugfix-batch-1` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A broad scout of the codebase surfaced a backlog of latent code and security defects that no single review had triaged. An 8-agent scout enumerated 40 candidate deep-research targets; the top 5 carried the highest risk: two shell scripts with command-injection / unguarded `rm -rf` exposure, an IPC socket server missing the path-confinement hardening its sibling already had, and two MCP-server bugs (a `close()` that could block on a non-cancellable backoff sleep, and a multi-batch index scan with no lease heartbeat). Two of the five had been headlined as "pre-try lease leaks," but that framing was unverified — acting on it directly risked fixing a defect that did not exist while missing the real one.

### Purpose
Run a verify-first batch fix: deep-dive each of the top 5 scouted targets to confirm or refute the headline before editing, then fix only the confirmed defect in each with disjoint-file implement agents so parallel writes never collide, and prove each fix with stack-appropriate verification before claiming completion.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **SCOUT** the codebase for candidate defects (8 agents → 40 candidates → top 5 selected).
- **DEEP-DIVE** each of the 5 targets in parallel (gpt-5.5-fast) to confirm/refute the headline against the real code.
- **FIX** the confirmed defect in each of the 5 targets across 10 files, using disjoint-file implement agents.
- **VERIFY** every fix: shellcheck/`bash -n` + live injection test for shell; typecheck + build + targeted vitest for TS.

### Out of Scope
- The remaining 35 scouted candidates (deferred to later batches; only the top 5 are in this packet).
- The refuted "pre-try lease leak" headline edits — NOT applied; each target's real lesser defect is fixed instead.
- The 2 pre-existing `handler-memory-index.vitest.ts` failures (a `[deferred - requires DB test fixtures]` describe block, unrelated to the heartbeat change).
- Deploy/daemon recycle itself: the orchestrator recycles the mk-spec-memory daemon (#1/#2) + skill-advisor (#3) after commit; the 2 shell fixes need no deploy.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/worktree-reaper.sh` | Modify | `eval "$@"` → argv-array `"$@"` at 5 call sites; `rm -rf --` guard; `%q` DRY_RUN |
| `setup-cp-sandbox.sh` (3 copies) | Modify | derive REPO_ROOT from BASH_SOURCE; `validate_sandbox_dir()` before destructive `rm -rf` |
| `system-skill-advisor/mcp_server/lib/ipc/socket-server.ts` | Modify | port 4 DR-008 IPC hardening items (canonicalize, allowed roots, confinement, post-mkdir stat) |
| `system-spec-kit/mcp_server/lib/ops/file-watcher.ts` (+ test, package.json) | Modify | RetryWaker wake-coordination so `close()` wakes in-flight retries; re-enable suite in test:core |
| `system-spec-kit/mcp_server/handlers/memory-index.ts` (+ test) | Modify | periodic lease heartbeat during processBatches (started in try, cleared in finally) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each headline is confirmed or refuted before any edit | 5 parallel gpt-5.5-fast deep-dives; each target classified CONFIRMED / REFUTED with code evidence |
| REQ-002 | Refuted headlines are NOT acted on | The two "pre-try lease leak" headlines are refuted (all throws precede lease acquisition; the one post-acquisition call swallows errors); no leak "fix" applied |
| REQ-003 | Only the confirmed real defect in each target is fixed | The lesser-but-real defect per target is remediated; no scope leak into unrelated code |
| REQ-004 | Every fix is verified with stack-appropriate checks | shell: `bash -n` + shellcheck + live injection test; TS: typecheck + build + targeted vitest |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The 3 security fixes close their exposure | worktree-reaper injection dead; setup-cp-sandbox rejects unsafe dirs before `rm -rf`; advisor IPC confined to allowed socket roots |
| REQ-006 | The 2 MCP-server bug fixes are proven by tests | file-watcher `close()` wakes mid-retry (22/22 incl new test); scan heartbeat keeps lease fresh across multi-batch scans (cooldown 9/9 incl new test) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 5 targets deep-dived; the two pre-try lease-leak headlines REFUTED with code evidence, each target's real lesser defect confirmed and fixed (10 files).
- **SC-002**: All 3 security fixes verified — worktree-reaper LIVE injection test shows injection dead with exit-status preserved; setup-cp-sandbox 11-input unit test + end-to-end rejects `$HOME` and `/tmp/../etc`; advisor IPC typecheck + build exit 0 faithful to the code-graph reference.
- **SC-003**: Both MCP builds exit 0; file-watcher suite 22/22 and cooldown suite 9/9 pass (the 2 handler-memory-index failures are pre-existing); `validate.sh --strict` Errors 0 for this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Acting on the unverified "pre-try lease leak" headline | Fix a non-existent defect, miss the real one | Verify-first deep-dive refuted the headline; fixed each target's real lesser defect instead |
| Risk | 5 parallel implement agents touching overlapping files | Conflicting edits / lost writes | Partition by disjoint file sets per agent (10 files, no overlap) |
| Risk | A "fix" could swallow exit status or change behavior | Silent regression | worktree-reaper preserves exit-status propagation; verified by live test |
| Risk | Re-enabling file-watcher.vitest.ts could surface flakiness | Test:core breaks | Added explicit close-mid-retry-sleep test; suite 22/22 green before re-enabling |
| Dependency | code-graph socket-server.ts DR-008 hardening (reference impl) | — | Ported the 4 items faithfully into the advisor socket-server |
| Dependency | Orchestrator daemon recycle (mk-spec-memory #1/#2, skill-advisor #3) | Fixes inert until recycle | Recycle after commit; the 2 shell fixes need no deploy |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: `worktree-reaper.sh` executes via argv array (`"$@"`), not `eval`, killing shell command injection through reaped-worktree path names; `rm -rf -- "$sd"` end-of-options guard prevents option-injection via hostile dir names.
- **NFR-S02**: `setup-cp-sandbox.sh` derives REPO_ROOT from `BASH_SOURCE` and rejects empty / non-absolute / `..` / non-`/tmp` paths before any destructive `rm -rf`.
- **NFR-S03**: The advisor IPC socket server canonicalizes paths via ancestor-realpath, enforces `allowedSocketRoots`, confines via `isWithinAllowedSocketRoot`, and re-stats post-mkdir for uid / group-writable, matching the code-graph DR-008 baseline.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. L2: EDGE CASES

- A hostile reaped-worktree directory name contains shell metacharacters → with argv-array execution the name is a literal arg, not evaluated; LIVE injection test (hostile `$sd` dir name) confirmed injection dead.
- `setup-cp-sandbox.sh` invoked from an unexpected CWD → REPO_ROOT now derives from `BASH_SOURCE`, not a hardcoded author absolute path, so the script is location-independent.
- A sandbox dir resolves to `$HOME` or `/tmp/../etc` → `validate_sandbox_dir()` rejects it (non-`/tmp` or `..` present) before the `rm -rf`; the default `/tmp/...` path still works.
- `watcher.close()` called while a `withBusyRetry` backoff sleep is in flight → RetryWaker wakes the in-flight retry immediately (sticky-after-wakeAll; clears the backoff timer) so close() does not block.
- A multi-batch index scan runs longer than the lease expiry → a `setInterval` heartbeat (expiry/3, min 10s, `.unref()`) re-asserts the lease so a concurrent caller does not treat it as stale; cleared in `finally`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 10 files across 5 disjoint targets (2 shell, 1 IPC, 2 MCP-server) |
| Risk | 16/25 | 3 security-class fixes + 2 concurrency bugs; verify-first to avoid acting on a refuted headline |
| Research | 12/20 | 8-agent scout (40 candidates), 5 parallel deep-dives (confirm/refute), 5 parallel implement-and-test |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Scope (top 5 of 40 scouted candidates), method (verify-first: confirm/refute before fix; disjoint-file implement agents), and the refuted lease-leak headline are confirmed.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

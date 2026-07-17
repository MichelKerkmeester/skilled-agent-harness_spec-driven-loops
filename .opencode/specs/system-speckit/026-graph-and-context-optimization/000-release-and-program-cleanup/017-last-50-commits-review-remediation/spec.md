---
title: "Feature Specification: Remediation of the 016 Last-50-Commits Deep Review"
description: "Remediate the actionable findings from the sibling 016 deep-review packet across four parallel work streams (lifecycle/shutdown, IPC/socket/launcher, validator/memory-write, contract/config/docs) plus a test round. All fixes shipped and verified: tsc clean, 1055+154+3 tests pass, alignment-drift PASS. Several P2 items accepted with no code change as deliberate decisions."
trigger_phrases:
  - "016 review remediation"
  - "last 50 commits remediation"
  - "ingest worker shutdown fence fix"
  - "unified SIGTERM shutdown path"
  - "socket fresh-bind symlink reject fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/017-last-50-commits-review-remediation"
    last_updated_at: "2026-06-05T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored remediation packet docs over the completed 016 fixes"
    next_safe_action: "Operator builds + deploys the dist for the running daemon"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/mcp_server/context-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/shared/ipc/socket-server.ts"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/016-last-50-commits-deep-review/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "last-50-commits-review-remediation-2026-06-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 pre-answered: create the canonical docs for the existing 017 remediation packet (authorized)."
      - "Source fixes are complete and verified; deploy of the dist is deferred to the operator."
---
# Feature Specification: Remediation of the 016 Last-50-Commits Deep Review

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## EXECUTIVE SUMMARY

This packet remediates the actionable findings from the sibling `016-last-50-commits-deep-review` (0 active P0, 3 P1, ~17 P2) across four parallel work streams plus a test round. Every actionable finding is fixed and verified; six items are accepted with no code change as deliberate decisions. Source fixes are complete; the dist build + deploy is deferred to the operator.

**Key Decisions**: Unify the shutdown signal-handler stacks into one ordered path with a worker fence (keystone); keep both `socket-server.ts` forks byte-identical under a drift test.

**Critical Dependencies**: The frozen finding list in `016/review/review-report.md`; operator build + deploy for the fixes to go live on the running daemon.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-05 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sibling deep-review packet `016-last-50-commits-deep-review` returned a CONDITIONAL verdict over the last 50 commits: 0 active P0, 3 actionable P1 (ingest-worker shutdown fence, compound concurrent-SIGTERM failure, runtime-fork drift guard), and ~17 P2 advisories spanning IPC/socket hardening, validator DoS, memory-write guards, MCP contract gaps, config-note drift, and test-integrity gaps. Left unremediated, the lifecycle P1s are operationally reachable under the concurrent-session daemon (dirty WAL + non-deterministic exit), and the security/validator P2s leave DoS and TOCTOU corners open. The findings are frozen in the 016 report and need a single remediation packet that fixes the actionable items, hardens the P2 batch, and explicitly records which items are accepted with no code change.

### Purpose
Drive the 016 report's actionable findings to closed by shipping verified source, test, config, and doc fixes; harden the P2 batch in the same pass; and document the deliberate accept-no-action decisions so the review chain is auditable end to end. Output is a remediated, verified codebase plus this packet's canonical docs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remediate the actionable findings from `016-last-50-commits-deep-review/review/review-report.md` (the frozen finding list) across four parallel work streams plus a test round:
  - **Stream 1 — Shutdown/lifecycle**: F-A4-01, F-X19-02, F-A4-02.
  - **Stream 2 — IPC/socket + launcher**: F-A5-01, F-A5-03, F-A4-03, F-004.
  - **Stream 3 — Validator + memory-write**: F-A5-02, F-A2-01, F-A2-02, F-A2-03.
  - **Stream 4 — Contract/config/docs**: F-A7-01, F-A8-01, F-A8-02, F-A9-01.
  - **Test round**: F-X19-01, F-A6-01, F-A6-02, F-A6-03, F-X19-03, plus validation tests for F-A4-01/F-A5-01.
- Record the deliberate accept-no-action items (F-002, F-A3-01, F-A3-02, F-CC-01, F-CC-P2-01/02) with rationale in `decision-record.md`.
- This packet's canonical docs (spec/plan/tasks/checklist/decision-record/implementation-summary) plus generated metadata.

### Out of Scope
- Building and deploying the dist to the running daemon — the running daemon uses the current dist; deploy is deferred to the operator.
- Any change to the completed 016 review state (`016/review/**` iterations, deltas, state.jsonl) beyond the single F-A9-01 miscount correction in the 015 review-report and changelog named in the finding list.
- Re-running the 016 deep review — the findings are frozen; this packet remediates them.
- New behaviour or features outside the frozen finding list (scope is FROZEN to the 016 actionable findings).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/context-server.ts` | Modify | Stream 1: fence ingest worker in `fatalShutdown`; unify signal-handler stack |
| `lib/runtime/shutdown-hooks.ts` | Modify | Stream 1: single ordered shutdown path, deterministic exit |
| `lib/ops/job-queue.ts` | Modify | Stream 1: `stopWorker()`/`shuttingDown` guard + non-reopen DB accessor |
| `shared/ipc/socket-server.ts` (+ code-graph fork) | Modify | Stream 2: fresh-bind symlink reject, lstat-guarded fchmod, fail-closed canonicalize, re-entrant guard |
| `bin/mk-spec-memory-launcher.cjs` | Modify | Stream 2: lease fsync parity |
| `lib/validation/orchestrator.ts` | Modify | Stream 3: bounded DFS (dir/depth/time caps) |
| `handlers/memory-save.ts` | Modify | Stream 3: enrichment skip-guard also skips `archived` |
| `lib/search/entity-density.ts` | Modify | Stream 3: corrected doc comment |
| `handlers/save/response-builder.ts` | Modify | Stream 3: E089 `access denied:` substring tightened |
| `lib/architecture/layer-definitions.ts` | Modify | Stream 4: embedder tools added to `TOOL_LAYER_MAP` |
| `.claude/agents/*` + `.codex/agents/*` | Modify | Stream 4: dangling `.gemini/agents` refs removed |
| `.codex/config.toml` + `.devin/config.json` | Modify | Stream 4: note keys added for parity |
| `015/review/review-report.md` + `changelog-000-015-docs-drift-review.md` | Modify | Stream 4: P0 miscount 2 -> 1 |
| `mcp_server/tests/**` | Add/Modify | Test round: drift guard, fresh-bind, job-queue, auto-fix, contradiction-cycle, rollout-bucket tests |
| `017-last-50-commits-review-remediation/{spec,plan,tasks,checklist,decision-record,implementation-summary}.md` | Create | This packet's canonical docs |
| `017-last-50-commits-review-remediation/{description,graph-metadata}.json` | Create | Generated metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The lifecycle P1s (F-A4-01, F-X19-02) are fixed: the ingest worker is fenced before `close_db` and the divergent signal-handler stacks are unified into one ordered, deterministic-exit path | `job-queue.ts` exports `stopWorker()`/`shuttingDown`; `fatalShutdown` calls it before `closeDb`; one ordered shutdown path with a deterministic exit; new tests cover the fence |
| REQ-002 | The security/DoS P2s are fixed fail-closed: socket fresh-bind rejects symlink tails with lstat-guarded fchmod, canonicalization fails closed, and the validator DFS is bounded | `socket-server.ts` (both byte-identical forks) reject symlink tails and fail closed; `orchestrator.ts` DFS has dir/depth/time caps; new fresh-bind test passes |
| REQ-003 | All fixes pass verification with no regressions | `npx tsc --noEmit` exit 0, 0 errors; 1055 affected-suite tests pass (0 fail); 154 new/extended pass; code-graph fork drift+toctou 3 pass; alignment-drift PASS |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The remaining actionable P2s are remediated: re-entrant socket guard, launcher lease fsync parity, `archived` skip-guard, E089 substring, embedder layer map, dangling agent refs, config-note parity, and the F-A9-01 miscount | Each finding's named file(s) carry the fix; the 015 review-report and changelog report 1 P0 |
| REQ-005 | The test round adds/extends coverage for the drift guard, fresh-bind, job-queue, auto-fix OR-path, contradiction cycle, de-no-op'd assertions, and rollout bucketing | New/extended test files under `mcp_server/tests/` exist and pass (154 total) |
| REQ-006 | The accept-no-action items are recorded as deliberate decisions with rationale | `decision-record.md` carries one ADR per accept-no-action item (F-002, F-A3-01/02, F-CC-01, F-CC-P2-01/02) with evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every actionable finding in the 016 report maps to a shipped fix (file + evidence) recorded in `tasks.md`, or to a recorded accept-no-action ADR in `decision-record.md`.
- **SC-002**: `npx tsc --noEmit` exits 0 with 0 errors across `mcp_server`, `shared`, and code-graph; the affected suites (1055), new/extended (154), and code-graph fork drift+toctou (3) all pass; `verify_alignment_drift.py --root .opencode/skills/system-spec-kit` is PASS (1510 files, 0 findings).
- **SC-003**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` passes (RESULT PASSED) with completion metadata reconciled across spec/plan/tasks/checklist/implementation-summary.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Source fixes land but the running daemon keeps the old behaviour | Med - operators may expect the fix to be live immediately | Documented deploy note: the running daemon uses the current dist; the fix takes effect after a build + deploy, deferred to the operator |
| Risk | The two `socket-server.ts` copies (shared + code-graph fork) drift after the fix | High - a security fix applied to one fork only | Both copies kept byte-identical (`diff -q`); a drift test enforces parity going forward |
| Risk | A P2 "fix" changes behaviour where the original was already correct by design | Med - regression / false remediation | Items that were correct by design are accepted with no code change and recorded in `decision-record.md`, not patched |
| Dependency | Frozen finding list in `016/review/review-report.md` | Ground truth for scope | Scope is FROZEN to the 016 actionable findings; no new findings introduced |
| Dependency | Repo test suites + `verify_alignment_drift.py` | Verification | All required suites pass; alignment drift is PASS |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The bounded validator DFS (F-A5-02) adds dir/depth/time caps without a measurable regression on a `--strict` run; affected suites stay green.

### Security
- **NFR-S01**: The IPC socket fresh-bind path is fail-closed — lstat-rejects a symlink tail, lstat-guarded `fchmod`, fail-closed canonicalize — on both byte-identical forks.

### Reliability
- **NFR-R01**: Shutdown is deterministic under concurrent-session SIGTERM (one ordered path, one exit code) and the ingest worker cannot reopen the DB after `closeDb`, so the dirty-WAL window is closed.

---

## 8. EDGE CASES

### Data Boundaries
- Symlink-tailed socket path on a fresh bind: rejected (F-A5-01), not followed.
- Deeply nested / large session-id trees on `--strict`: bounded by dir/depth/time caps (F-A5-02).

### Error Scenarios
- Concurrent-session SIGTERM race: one ordered drain runs deterministically; the worker is fenced before `closeDb` (F-A4-01, F-X19-02).
- Re-entrant `startIpcSocketServer` call: guarded (F-A4-03) rather than racing module-global state.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: ~20 across 4 surfaces + tests; multiple subsystems |
| Risk | 20/25 | Lifecycle/shutdown + security/IPC + a forked security file |
| Research | 8/20 | Findings pre-traced in the 016 report |
| Multi-Agent | 6/15 | 4 parallel work streams |
| Coordination | 10/15 | Keystone-first sequencing + byte-identical fork parity |
| **Total** | **62/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Socket-server forks drift after the security fix | H | L | Both copies byte-identical (`diff -q`); drift test enforces parity |
| R-002 | Running daemon keeps old behaviour until deploy | M | M | Documented deploy note; daemon uses the current dist |
| R-003 | A P2 "fix" regresses code that was correct by design | M | L | Correct-by-design items accepted with no code change (decision-record.md), not patched |

---

## 11. USER STORIES

### US-001: Durable shutdown under concurrent sessions (Priority: P0)

**As an** operator running the concurrent-session daemon, **I want** shutdown to be a single ordered drain with the ingest worker fenced, **so that** the DB closes clean with no dirty marker or stranded WAL.

**Acceptance Criteria**:
1. Given a SIGTERM under concurrent sessions, When the daemon tears down, Then one ordered path runs with a deterministic exit and the worker cannot reopen the DB after `closeDb`.

### US-002: Fail-closed socket bind (Priority: P1)

**As a** security reviewer, **I want** the IPC fresh-bind path to reject symlink tails and fail closed on canonicalization across both forks, **so that** the TOCTOU corner is closed everywhere it ships.

**Acceptance Criteria**:
1. Given a fresh bind against a symlink-tailed path, When the server binds, Then it rejects the path; both `socket-server.ts` copies are byte-identical.

---

## 12. OPEN QUESTIONS

- None. All actionable findings are remediated or recorded as deliberate accept-no-action decisions. The only deferred step is the operator build + deploy of the dist so the running daemon picks up the source fixes.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

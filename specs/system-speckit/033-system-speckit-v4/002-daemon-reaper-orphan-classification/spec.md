---
title: "Feature Specification: Process-Reaper MCP Classification Fix"
description: "The daemon-reaper misclassifies an orphaned spec-memory server as an external MCP process because its external-MCP guard matches the mcp-server/ directory in the daemon's own path. Orphaned project daemons therefore leak instead of becoming termination candidates."
trigger_phrases:
  - "process reaper classification"
  - "isExternalMcpProcess misclassification"
  - "external mcp stdio false positive"
  - "orphaned project daemon not reaped"
  - "daemon sweep classification fix"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/002-daemon-reaper-orphan-classification"
    last_updated_at: "2026-08-22T19:31:50Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented + verified reaper classification fix; validators 0"
    next_safe_action: "Await commit go-ahead"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-22-process-reaper-classification-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Root-cause fix is regex-tightening, not pipeline reorder: the external-MCP and project-daemon command sets become disjoint, so ordering is moot"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Process-Reaper MCP Classification Fix

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete — fix implemented and verified (negative control → fix → both suites green); awaiting commit go-ahead |
| **Created** | 2026-08-22 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 24 |
| **Predecessor** | `../001-plan-preflight-track-packets/spec.md` |
| **Successor** | `../003-spec-doc-template-reduction/spec.md` |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | system-speckit |
| **Predecessor** | Surfaced by the code-graph purge (the 2 pre-existing `process-sweep` failures) |
| **Successor** | None |
| **Handoff Criteria** | Both coupled vitest suites green; typecheck clean; the compiled reaper dist carries the fix; scoped diff is the single harness source file |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The daemon-reaper (`process-memory-harness.ts`) classifies each running process before deciding whether it is a termination candidate. The `isExternalMcpProcess` guard — meant to preserve genuine external MCP stdio tools forever — uses the regex `/(?:^|[\s/])mcp-[^\s/]+/`. That pattern matches the `mcp-server` **directory** inside the spec-memory server's own launch path (`.../system-spec-kit/mcp-server/dist/context-server.js`).

Because that guard runs **before** the project-daemon rules, a legitimate orphaned spec-memory server (parented to PID 1) is classified `external-mcp-stdio` — the "preserve, never terminate" bucket — instead of `orphaned-project-daemon`. The reaper then never reaps it. Orphaned project daemons leak across sessions. Two unit tests already encode the correct behavior and fail today, documenting the defect.

### Purpose

Make the external-MCP guard match only a genuine external MCP binary or the `--mcp-server` flag — never a directory component of a project daemon's path — so orphaned project daemons are classified and reaped correctly while real external MCP tools stay preserved.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Tighten `isExternalMcpProcess` in `process-memory-harness.ts` so the `mcp-<x>` pattern only matches when `mcp-<x>` is a terminal command/arg segment (followed by whitespace or end-of-string), not a directory component followed by `/`.
- Rebuild the gitignored `scripts/dist` so the live reaper runs the fixed logic.
- The two coupled vitest suites (`process-sweep`, `process-memory-harness`) — already asserting the correct behavior — become the regression proof.

### Out of Scope

- Reordering the classification pipeline (the regex fix makes the two command sets disjoint, so order is moot).
- Any change to a project-daemon rule, the `--mcp-server` flag branch, browser-session handling, or preserve semantics for genuine external MCP tools.
- The synthetic-fixture launcher representation in the harness (already valid from prior work).
- The separate `isExternalMcpProcess`-adjacent classifications (zombie, current-session, EPERM).

### Files to Change

- `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts`
- `.opencode/skills/system-spec-kit/scripts/dist/ops/process-memory-harness.js` (gitignored build output; rebuilt, not committed)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Orphaned project daemons under an `mcp-server/` directory classify correctly | A process running `.../system-spec-kit/mcp-server/dist/context-server.js` (ppid 1) classifies as `orphaned-project-daemon`, not `external-mcp-stdio`; the two failing `process-sweep` tests pass |
| REQ-002 | Genuine external MCP processes stay preserved | `node /tmp/mcp-example --stdio` and `node tool.js --mcp-server stdio` still classify `external-mcp-stdio`; the "preserves external MCP stdio processes" test stays green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No harness snapshot regression | `process-memory-harness.vitest.ts` stays 10/10 — the synthetic-fixture snapshot still reports `projectDaemonCount=2` / `orphanedProjectDaemonCount=2` |
| REQ-004 | Type safety preserved | `tsc --noEmit` on `@spec-kit/scripts` exits 0 with 0 TS errors after the edit |
| REQ-005 | Live reaper path carries the fix | `@spec-kit/scripts` is rebuilt and the tightened regex is present in the gitignored `scripts/dist/ops/process-memory-harness.js` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Negative control reproduced first: the 2 `process-sweep` failures observed BEFORE the change (`external-mcp-stdio` where `orphaned-project-daemon` is expected).
- After the fix: `process-sweep` 10/10 and `process-memory-harness` 10/10.
- `tsc --noEmit` exit 0, 0 TS errors; compiled dist rebuilt and confirmed to carry the fix.
- Scoped diff is the single harness source file; no stray or out-of-scope changes.
- Every completion claim carries observed command evidence (exit code / grep / diff).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Over-tightening the regex** — a lookahead that is too strict could stop matching a real external MCP binary. Mitigated: REQ-002's existing test covers both the `mcp-foo` binary and the `--mcp-server` flag; both stay green.
- **Directory edge case** — a project daemon whose path's final segment is literally `mcp-something` (no trailing `.js`) would still match. Not a real case: project daemons run named `.js`/`.cjs` files, so their terminal segment is never a bare `mcp-*` token; the daemon rules match specific file paths.
- **Live behavior change** — the reaper now correctly treats orphaned spec-memory servers under `mcp-server/` as termination candidates (still gated by known-project-identity for eligibility). This is the intended fix, encoded by the pre-existing tests.
- **Dependencies** — the `process-sweep` / `process-memory-harness` vitest suites; the `@spec-kit/scripts` `tsc --build`.
<!-- /ANCHOR:risks -->

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- No performance impact: the change is one regex lookahead in an already-per-process classification pass.

### Security

- No new external calls or credential surfaces. Command-string redaction (`redactSensitiveCommand`) is unchanged.

### Reliability

- The reaper stays fail-safe: eligibility for termination remains gated by known-project-identity markers and ancestor/self refusal, so a misclassification cannot cause the harness to kill an unowned or current-session process.

---

## L2: EDGE CASES

### Data Boundaries

- `node /tmp/mcp-example --stdio` — external binary, terminal segment → `external-mcp-stdio` (preserved).
- `node tool.js --mcp-server stdio` — external flag branch → `external-mcp-stdio` (preserved).
- `.../system-spec-kit/mcp-server/dist/context-server.js` — `mcp-server` is a directory component (`/` follows) → falls through to project-daemon rules.

### Error Scenarios

- A command with no `mcp-` token and no daemon-rule match still classifies `unknown-owner` (preserved), unchanged.

### State Transitions

- The fix is a single revertible source edit; reverting restores the prior (buggy) classification.

---

## L2: COMPLEXITY ASSESSMENT

One surface (the reaper's external-MCP guard), one source line plus a durable WHY comment, proven by two pre-existing coupled test suites. The change is small, but it alters live daemon-reaping classification behavior — the reason it is documented at Level 2 with a QA checklist rather than skipped.

---

## L2: BEFORE VS AFTER

| Surface | Before | After |
|---------|--------|-------|
| `isExternalMcpProcess` regex | `/(?:^|[\s/])mcp-[^\s/]+/` — matches `mcp-server` directory in a daemon path | `/(?:^|[\s/])mcp-[^\s/]+(?=\s|$)/` — matches only a terminal external-binary segment |
| Orphaned spec-memory server (ppid 1) | Misclassified `external-mcp-stdio` (preserve forever); leaks across sessions | `orphaned-project-daemon`; a termination candidate under known-identity gating |
| Genuine external MCP tool | `external-mcp-stdio` (preserved) | `external-mcp-stdio` (preserved) — unchanged |
| `process-sweep.vitest.ts` | 2 failed / 8 passed | 10 passed |

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

1. None. The consumer, the two affected test cases, and the external-vs-daemon command boundary are all confirmed; the fix is implemented and verified.
<!-- /ANCHOR:questions -->

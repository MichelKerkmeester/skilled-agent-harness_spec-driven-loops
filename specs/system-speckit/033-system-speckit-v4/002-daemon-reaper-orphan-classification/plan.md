---
title: "Implementation Plan: Process-Reaper MCP Classification Fix"
description: "Single-phase plan to tighten the reaper's external-MCP guard so a project daemon under an mcp-server/ directory is no longer misclassified as an external MCP process, proven by the two pre-existing coupled test suites."
trigger_phrases:
  - "process reaper classification plan"
  - "isExternalMcpProcess fix plan"
  - "external MCP misclassification"
  - "process-memory-harness regex tightening"
  - "orphaned project daemon"
  - "process-sweep negative control"
  - "guard order disjoint"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/002-daemon-reaper-orphan-classification"
    last_updated_at: "2026-08-22T19:31:50Z"
    last_updated_by: "claude-code"
    recent_action: "Reconciled plan to shipped fix state"
    next_safe_action: "Await commit go-ahead"
    blockers: []
    key_files:
      - "specs/system-speckit/033-system-speckit-v4/002-daemon-reaper-orphan-classification/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-22-process-reaper-classification-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Process-Reaper MCP Classification Fix

<!-- ANCHOR:summary -->
## 1. SUMMARY

One surface, one root cause, one phase. Reproduce the two failing `process-sweep` cases (negative control), tighten `isExternalMcpProcess` so its `mcp-<x>` pattern only matches a terminal external-binary segment, rebuild the gitignored dist, and prove both coupled test suites green. The fix makes the external-MCP and project-daemon command sets disjoint, so no pipeline reorder is needed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check |
|------|-------|
| Negative control | Observe the 2 `process-sweep` failures BEFORE the change (expected `orphaned-project-daemon`, got `external-mcp-stdio`) |
| Focused proof | Same suites re-run after the fix → both 10/10 |
| No preserve regression | The "preserves external MCP stdio processes" case stays green (binary + `--mcp-server` flag) |
| Live path | Rebuild `scripts/dist`; grep the compiled harness for the tightened regex |
| Observed evidence | Every completion claim carries real command output (exit code / grep / diff) |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

`classifyProcesses` evaluates each process through an ordered set of guards: zombie → current-session → EPERM → **external-MCP** → browser → project-daemon rules. The bug is that the external-MCP guard's first regex matches the `mcp-server` directory in the spec-memory daemon's own path, so a project daemon never reaches the daemon-rule branch. Tightening that regex with a `(?=\s|$)` lookahead removes the false match at the source, leaving guard order irrelevant because the two command sets no longer overlap.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Tighten the external-MCP guard (REQ-001, REQ-002) · reaper source

- **Do:** change `isExternalMcpProcess`'s first pattern from `/(?:^|[\s/])mcp-[^\s/]+/` to `/(?:^|[\s/])mcp-[^\s/]+(?=\s|$)/`; add a durable WHY comment; leave the `--mcp-server` flag branch untouched.
- **Prove:** negative control first (2 failing `process-sweep` cases got `external-mcp-stdio`), then `process-sweep` 10/10 with the genuine external-MCP case still green.

### Phase 2 — Rebuild + verify the live path & regressions (REQ-003, REQ-004, REQ-005) · build / verification

- **Do:** rebuild `@spec-kit/scripts` (`tsc --build`) so the gitignored compiled reaper carries the fix.
- **Prove:** `process-memory-harness.vitest.ts` 10/10 (no snapshot regression); `tsc --noEmit` exit 0; grep `dist/ops/process-memory-harness.js` for the tightened regex.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Reaper (Phase 1):** `process-sweep.vitest.ts` (classification + eligibility) and `process-memory-harness.vitest.ts` (fixture snapshot); both must be 10/10.
- **Negative control:** capture the failing case list before the edit; confirm the same checks pass after.
- **Live path:** `tsc --build` in `@spec-kit/scripts`; grep `dist/ops/process-memory-harness.js` for the tightened regex.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `process-sweep.vitest.ts` + `process-memory-harness.vitest.ts` (the pre-existing behavior contract).
- `@spec-kit/scripts` `tsc --build` toolchain (emits the gitignored `scripts/dist`).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Rollback = revert the single-line regex change in `process-memory-harness.ts` and rebuild the dist. No other file changes; the dist is a gitignored build artifact. No commit/push without explicit operator go-ahead.
<!-- /ANCHOR:rollback -->

---

## L2: PHASE DEPENDENCIES

- Phase 1 → Phase 2 (hard): Phase 2 rebuilds and verifies Phase 1's source change; do 1 first.

## L2: EFFORT ESTIMATION

| Phase | Rough size | Blast |
|-------|-----------|-------|
| 1 | Small (1 source line + comment) | Live daemon-reaping classification (proven by process-sweep) |
| 2 | Trivial (rebuild) | Compiled reaper path; snapshot + typecheck regression proof |

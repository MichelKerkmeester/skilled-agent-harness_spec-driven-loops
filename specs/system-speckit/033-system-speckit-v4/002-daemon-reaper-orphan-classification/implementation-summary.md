---
title: "Implementation Summary: Process-Reaper MCP Classification Fix"
description: "Current state: the reaper external-MCP classification fix is implemented and verified (negative control → fix → both suites 10/10, typecheck clean, dist rebuilt); uncommitted, awaiting commit go-ahead."
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/002-daemon-reaper-orphan-classification"
    last_updated_at: "2026-08-22T19:31:50Z"
    last_updated_by: "claude-code"
    recent_action: "Fix implemented + verified; docs authored"
    next_safe_action: "Await commit go-ahead"
    blockers: []
    key_files:
      - "specs/system-speckit/033-system-speckit-v4/002-daemon-reaper-orphan-classification/plan.md"
      - ".opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-22-process-reaper-classification-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Root-cause fix is regex-tightening, not a pipeline reorder — the external-MCP and project-daemon command sets are now disjoint"
trigger_phrases:
  - "isExternalMcpProcess regex lookahead"
  - "external MCP classification fix"
  - "orphaned project daemon misclassified"
  - "mcp-server directory false match"
  - "process-sweep failing cases"
  - "terminal external-binary segment"
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: Process-Reaper MCP Classification Fix

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete — implemented and verified; uncommitted, awaiting commit go-ahead |
| **Completion** | 100% (implemented, verified; not yet committed) |
| **Last Updated** | 2026-08-22 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

A one-line root-cause fix to the daemon-reaper's external-MCP guard, plus a durable WHY comment and a rebuild of the gitignored compiled reaper.

`isExternalMcpProcess` in `process-memory-harness.ts` matched any `mcp-<x>` token in a command, including the `mcp-server` directory in the spec-memory server's own launch path. Because that guard runs before the project-daemon rules, an orphaned spec-memory server was classified `external-mcp-stdio` (preserve forever) instead of `orphaned-project-daemon` (a termination candidate) — so orphaned project daemons leaked. Adding a `(?=\s|$)` lookahead makes the pattern match only a terminal external-binary segment, so a directory component (`mcp-server/`) no longer matches and the daemon falls through to the correct rule. The external-MCP and project-daemon command sets are now disjoint, so guard order is irrelevant — no pipeline reorder was needed.

### Files changed

| File | Change |
|------|--------|
| `scripts/ops/process-memory-harness.ts` | Tightened `isExternalMcpProcess` first regex with a `(?=\s|$)` lookahead + durable WHY comment |
| `scripts/dist/ops/process-memory-harness.js` | Rebuilt (gitignored build output; not committed) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Implemented directly (no dispatched agents). The two failing `process-sweep` cases were reproduced first as a negative control, the regex was tightened, the `@spec-kit/scripts` build was re-run so the live reaper carries the fix, and both coupled suites were re-run to green. Every claim is backed by observed command output.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **Regex tightening over pipeline reorder** — the root cause is an over-broad pattern, not guard order. Fixing the pattern makes the two command sets disjoint, which is smaller and more precise than reordering the classifier.
- **Terminal-segment lookahead** — `(?=\s|$)` distinguishes a real external binary (`mcp-foo` followed by args or end) from a directory component (`mcp-server/` followed by `/`).
- **Fixture left as-is** — the synthetic harness fixture (two spec-memory launcher rows) from prior work stays valid; the fix does not require touching it.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

- Negative control: `process-sweep.vitest.ts` before the fix → 2 failed / 8 passed (both got `external-mcp-stdio`).
- After the fix: `process-sweep.vitest.ts` 10/10; `process-memory-harness.vitest.ts` 10/10.
- `tsc --noEmit` exit 0, 0 TS errors; `@spec-kit/scripts` rebuilt; the tightened regex confirmed present in `dist/ops/process-memory-harness.js`.
- `validate.sh --strict` on this packet → exit 0.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- **Uncommitted** — the source fix and this packet are on `skilled/v4.0.0.0` in the working tree; not yet committed or pushed (awaiting operator go-ahead).
- **Live behavior** — the reaper now treats orphaned spec-memory servers under `mcp-server/` as termination candidates (still gated by known-project-identity for eligibility); this is the intended, test-encoded behavior.
- **Directory edge case** — a project daemon whose terminal path segment were a bare `mcp-*` token (no `.js`) would still match the external guard; not a real case, since daemons run named `.js`/`.cjs` files matched by specific rules.
<!-- /ANCHOR:limitations -->

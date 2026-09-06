---
title: "Tasks: Process-Reaper MCP Classification Fix"
description: "Task list for the single-phase reaper external-MCP classification fix."
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/002-daemon-reaper-orphan-classification"
    last_updated_at: "2026-08-22T19:31:50Z"
    last_updated_by: "claude-code"
    recent_action: "Marked tasks done with observed evidence"
    next_safe_action: "Await commit go-ahead"
    blockers: []
    key_files:
      - "specs/system-speckit/033-system-speckit-v4/002-daemon-reaper-orphan-classification/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-22-process-reaper-classification-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
trigger_phrases: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Process-Reaper MCP Classification Fix

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[~]` in progress · `[x]` done · `[!]` blocked. Evidence (exit code / grep / diff) required on completion. Stages below are lifecycle stages (Setup / Implementation / Verification).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T001** Root-cause the 2 pre-existing `process-sweep` failures — confirmed the external-MCP guard's regex matches the `mcp-server/` directory in the daemon path and runs before the daemon rules.
- [x] **T002** Negative control: run `process-sweep.vitest.ts` and capture the failing cases — "never marks ancestors as eligible even when they look orphaned" and "marks orphaned project daemons eligible only with known project identity" both got `external-mcp-stdio` where `orphaned-project-daemon` is expected.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T010** Tighten `isExternalMcpProcess` first pattern to `/(?:^|[\s/])mcp-[^\s/]+(?=\s|$)/`; add a durable WHY comment; leave the `--mcp-server` flag branch unchanged. — one-line source edit in `process-memory-harness.ts`.
- [x] **T011** Rebuild `@spec-kit/scripts` (`tsc --build`) so the compiled reaper carries the fix. — dist rebuilt; grep confirms the new pattern in `dist/ops/process-memory-harness.js`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T020** `process-sweep.vitest.ts` after the fix — 10/10 (both former failures now pass).
- [x] **T021** `process-memory-harness.vitest.ts` after the fix — 10/10 (no snapshot regression).
- [x] **T022** `tsc --noEmit` — exit 0, 0 TS errors.
- [x] **T023** Scoped-diff sweep — only `process-memory-harness.ts` changed in scripts/ (dist is gitignored); no stray files.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- REQ-001, REQ-002 (P0) and REQ-003 (P1) complete with observed evidence.
- Both coupled suites 10/10; typecheck clean; compiled dist carries the fix.
- Continuity refreshed via `generate-context.js`; `validate.sh --strict` clean on this packet.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` · Plan: `plan.md` · Checklist: `checklist.md` · Summary: `implementation-summary.md`
- Fix site: `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts`
<!-- /ANCHOR:cross-refs -->

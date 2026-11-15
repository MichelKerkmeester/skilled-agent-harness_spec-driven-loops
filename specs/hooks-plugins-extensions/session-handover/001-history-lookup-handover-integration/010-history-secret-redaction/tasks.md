---
title: "Tasks: Phase 10: history-secret-redaction"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "history secret redaction tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 10: history-secret-redaction

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce the leak against the pre-change build (`scratch/repro-secret-leak.mjs`). Verify: `node scratch/repro-secret-leak.mjs <engine>/dist/core.js` prints `load          leaked: ant,gh,aws,pem,auth,url`.
- [x] T002 Record the engine baseline (`.skilled/hooks/session-handover/history`). Verify: `npm --prefix .skilled/hooks/session-handover/history test` prints `Tests  140 passed (140)`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Redact every entry before projection (`.skilled/hooks/session-handover/history/lib/core.ts`). Verify: the repro prints `leaked: none` for all four replies.
- [x] T004 Add the redaction suite (`.skilled/hooks/session-handover/history/tests/history-secret-redaction.vitest.ts`). Verify: `vitest run tests/history-secret-redaction.vitest.ts` prints `Tests  4 passed (4)`.
- [x] T005 Document the redaction (`.skilled/hooks/session-handover/history/README.md`). Verify: `rg -n 'REDACTED:github-token' .skilled/hooks/session-handover/history/README.md` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run the negative control (`lib/core.ts`). Verify: with the intake call removed, the redaction suite prints `Tests  3 failed | 1 passed (4)`, and restored it prints `Tests  4 passed (4)`.
- [x] T007 Run the four suites, typecheck and build (`.skilled/hooks`). Verify: engine 144/144, hooks vitest 501/501, readers 103 pass 0 fail, handover 390 pass 0 fail, typecheck and build exit 0.
- [x] T008 Prove the real CLI path (`lib/cli.ts`). Verify: a throwaway copy of the CLI suite with a URL password and a GitHub token in the transcript prints `Tests  1 passed`, asserting both markers and neither secret, and the copy is deleted.
- [x] T009 Run the quality gate on the changed code (`lib/core.ts`, the new suite). Verify: `quality-gate.cjs --files ...` prints `"gate": "NO_BLOCKER_FOUND"`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

---
title: "Tasks: Packaging and Activation Fixes"
description: "Task breakdown for install-built output, packed operator files, and a real LM Studio enablement example."
trigger_phrases:
  - "packaging-and-activation-fixes"
  - "tasks"
  - "communication projection package activation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/032-packaging-and-activation-fixes"
    last_updated_at: "2026-08-15T09:15:00.000Z"
    last_updated_by: "opencode"
    recent_action: "Completed every scoped package activation task."
    next_safe_action: "Use the verified package activation flow."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-032-packaging-and-activation-fixes-20260815"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Packaging and Activation Fixes

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallel after dependencies |
| `[B]` | Blocked with a named condition |

**Task format**: `T### [P?] Description (primary surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read all required package, plugin, research, and standards files. [evidence: required file inventory recorded in `spec.md`]
- [x] T002 Capture baseline `npm run check` evidence with 76 files and 406 tests passing. [evidence: baseline `npm run check` output]
- [x] T003 Create and adapt the approved phase packet from the required sibling. [evidence: `spec.md:1` and six required authored docs]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `prepare`, packed operator files, and the wrapper bin map to `package.json`. [evidence: package manifest assertions pass]
- [x] T005 Replace `lmStudioExample` with the sole loader-owned LM Studio `localProvider` block. [evidence: `enablement.local.json.example` parses in the focused suite]
- [x] T006 Normalize the LM Studio `/v1` API base to the chat-completions request endpoint. [evidence: `test/config/local-provider.test.ts` passed 14/14 tests]
- [x] T007 [P] Add a shipped-example parser test and retain negative fail-closed controls. [evidence: focused loader suite passed 14/14 tests]
- [x] T008 [P] Extend the real tarball rehearsal to assert wrapper and example contents. [evidence: release rehearsal passed 5/5 tests]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run focused configuration and release tests. [evidence: Vitest passed 14/14 config tests and 5/5 release tests]
- [x] T010 Prove install rebuilds absent `dist/` through `prepare`. [evidence: `npm install` ran build and created `dist/index.js`]
- [x] T011 Run final `npm run check` with zero failed. [evidence: 76 files and 408/408 tests passed]
- [x] T012 Author the implementation summary and reconcile all checklist evidence. [evidence: `implementation-summary.md` and `checklist.md`]
- [x] T013 Regenerate metadata and pass strict validation with zero errors and warnings. [evidence: `generate-context.js` and final `validate.sh --strict` receipt]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 and P1 requirements have observed evidence.
- [x] Install and packing expose every required runtime artifact.
- [x] The shipped LM Studio example produces a valid local-only config.
- [x] Package and packet gates pass from the final state.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision**: `decision-record.md`
- **Research**: `../031-improvement-research/research/research.md`
<!-- /ANCHOR:cross-refs -->

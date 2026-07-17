---
title: "Tasks: MCP CLI Stress Tests"
description: "Completed task evidence for MCP CLI stress coverage."
trigger_phrases:
  - "mcp cli stress tests tasks"
  - "schema v37 stress tasks"
  - "cli front door stress tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/000-release-cleanup/005-mcp-cli-stress-tests"
    last_updated_at: "2026-06-10T16:06:30Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed release-cleanup stress tests with final 31-file/113-test pass."
    next_safe_action: "No follow-up required."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "2026-06-10-005-mcp-cli-stress-tests-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator approved implementation scope and isolation constraints."
---
# Tasks: MCP CLI Stress Tests

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Read existing stress harness and suites (`run-substrate-stress-harness.mjs`, `vitest.stress.config.ts`, durability/session/substrate suites). Evidence: harness and representative suites read before edits.
- [x] T002 Read CLI front-door shims and changelogs for schema, flags, and command counts. Evidence: `.opencode/bin/{spec-memory,code-index,skill-advisor}.cjs` and committed changelogs read before edits.
- [x] T003 Establish baseline before adding coverage. Evidence: initial unchanged stress run recorded 30 files, 108 tests, 106 passed, 2 existing failures; repaired baseline rerun passed 30 files, 108 tests.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T004 Repair existing stress baseline failures without weakening coverage. Evidence: schema canary now pins 37; substrate harness resolves slug-named scenario files by scenario title/heading.
- [x] T005 [P] Add schema v37 migration stress. Evidence: new stress suite repeats isolated v34-to-v37 migrations and checks v35/v36/v37 artifacts.
- [x] T006 [P] Add gated flag-path stress. Evidence: new stress suite covers idempotency default/off-on replay and conflict, tombstone default hard-delete and gated repeated delete, and semantic-trigger shadow load.
- [x] T007 [P] Add CLI front-door stress. Evidence: new stress suite validates list-tools parity counts 37/8/9, warm-only exit 75 behavior, temp socket usage, pinned reelection, and no process-table changes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T008 Run build. Evidence: `npm run build` exited 0.
- [x] T009 Run final stress suite. Evidence: final post-build `npm run stress` passed 31 files, 113 tests.
- [x] T010 Confirm schema version unchanged. Evidence: grep found `export const SCHEMA_VERSION = 37`.
- [x] T011 Run comment hygiene and alignment checks. Evidence: comment hygiene passed for three touched stress files; alignment drift passed with 36 files scanned and 0 findings.
- [x] T012 Run strict validation for this child phase. Evidence: `validate.sh --strict` exited 0 with 0 errors and 0 warnings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All planned tasks are complete or explicitly deferred with approval.
- [x] No blocked tasks remain.
- [x] Strict validation passes for this child phase.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

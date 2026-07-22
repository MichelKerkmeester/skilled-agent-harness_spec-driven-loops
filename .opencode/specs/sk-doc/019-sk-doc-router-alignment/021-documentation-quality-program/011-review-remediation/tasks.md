---
title: "Tasks: Deep-Review Remediation"
description: "Restore the corrupted headers, fix the non-runnable commands, route out-of-scope findings, and stage the validator hardening."
importance_tier: "high"
contextType: "implementation"
status: "in-progress"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/011-review-remediation"
    last_updated_at: "2026-07-22T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Restored headers and fixed commands; validator staged."
    next_safe_action: "Baseline the validator corpus before changing the gate."
    blockers: []
    key_files: []
---

# Tasks: Deep-Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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
## Phase 1: Setup

- [x] T001 Verify every FAIL P0 against disk and classify in-scope vs routed (`tr -dc '\000'`, `git show`, `validate.sh`).

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Restore the NUL-corrupted code span in `writing-style-guide.md` from the merge-base blob (`\x00 0 \x00` -> `` `## Tokens — Colors` ``).
- [x] T003 Restore the NUL-corrupted code span in `vision-audit-benchmark.md` from the merge-base blob (`\x00 0 \x00` -> `` `--file` ``).
- [x] T004 Make the create-skill Quick-Start runnable from the repo root (`create-skill/README.md`, repo-root-relative script paths).
- [x] T005 Make the mcp-server/api validation command runnable (`api/README.md`, `npm test` -> subshell `npx vitest run`).
- [ ] T006 Harden `is_uppercase_section` with a balanced-delimiter scanner and a true mixed-case gate (`validate_document.py`) — staged behind a corpus baseline.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Confirm zero NUL bytes across every changed markdown file and that both restored files pass `validate_document.py`.
- [x] T008 Confirm the fixed commands execute (`npx vitest run tests/import-policy-rules.vitest.ts` runs; create-skill paths resolve).
- [x] T009 Record the routed findings with evidence (`../review/review-report.md` links to sk-design; import-policy test failures).

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The in-scope P0 blockers (NUL corruption, named non-runnable commands) are fixed and verified
- [x] Out-of-scope findings are routed with evidence, not fixed on this branch
- [ ] The validator hardening (T006) lands with tests and a clean corpus re-run
- [x] `checklist.md` verified with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Source verdict**: See `../review/review-report.md`

<!-- /ANCHOR:cross-refs -->

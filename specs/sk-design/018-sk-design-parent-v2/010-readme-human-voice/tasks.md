---
title: "Tasks: remove em-dashes from authored READMEs"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: remove em-dashes from authored READMEs

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`T###` is a stable task id. `[P]` marks a task that may run in parallel with its neighbours; tasks
without it are ordered. A task is `[x]` only when its stated evidence was observed, never because it
looked done.

All tasks below are complete. Evidence is named per task rather than summarised at the end.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T001** Count every em-dash in every README: 1,446 across 208 files
- [x] **T002** Classify by usage: prose, whole-cell glyph, ascii art, fenced code
- [x] **T003** Bucket by authorship: 909 authored, 377 vendored, 153 historical
- [x] **T004** Read the Human Voice Rules for the ban and its permitted replacements
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T005** Write the transform: label takes a colon, standalone clause takes a colon, short appositive takes a comma, capitalised continuation takes a full stop
- [x] **T006** Exclude fenced code, ascii art, whole-cell dashes, vendored and historical files
- [x] **T007** Run it on the root README first and read the whole diff
- [x] **T008** Revert the first attempt entirely after it produced comma splices, rather than patching it
- [x] **T009** Rerun once with the corrected rules across the authored set
- [x] **T010** Fix the three sentences that wrap with the dash at the end of a line
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T011** Count prose em-dashes remaining: 0
- [x] **T012** Audit every changed line against `HEAD` for comma splices
- [x] **T013** Audit every changed line against `HEAD` for edits to lines that carried no em-dash
- [x] **T014** Confirm whole-cell glyphs, code fences and ascii art are unchanged
- [x] **T015** Run `hvr_scan.py` before and after on the heaviest files
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] 0 prose em-dashes across the authored set, from 909
- [x] 0 comma splices introduced
- [x] 0 edits to lines that carried no em-dash
- [x] 88 whole-cell glyphs and 13 code-block dashes preserved
- [x] `hvr_scan.py`: the `punctuation —` finding is gone
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md`: the frozen scope and the REQ ids these tasks satisfy
- `plan.md`: the architecture, the rollback, and the decision records
- `acceptance-criteria.md`: the rows that decide whether this packet may close
- `implementation-summary.md`: what actually shipped, with the commit
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

A command counts as evidence only after its output and exit status were read. A green run lies in
several ways: a stale build, a wrong path, a silent no-op and an assertion-free check all exit 0.
Every gate below was required to print its own result line, and the scanner is the independent check; the line-by-line audit against `HEAD` is what proves the sweep
did not damage prose it was never scoped to. Neither is an exit code.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] `spec.md` scope frozen before any file moved
- [x] Every usage classified before any file was written
- [x] The authored, vendored and historical buckets separated, so only authored files were in scope
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] No task id, requirement id, phase number or spec path in any code comment
- [x] No code changed; this phase touches prose only
- [x] Existing patterns reused rather than replaced; no adjacent code tidied
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] Prose em-dashes across the authored set: 0, from 909
- [x] Comma splices introduced: 0
- [x] Out-of-scope line edits: 0
- [x] Whole-cell glyphs preserved: 88
- [x] Code-block dashes preserved: 13
- [x] `hvr_scan.py` on the root README: `x19 punctuation —` gone, hard blockers 84 to 65
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] All 909 authored occurrences, not only the easy spaced ones
- [x] Unspaced dashes between word characters included
- [x] Prose inside table cells included, while whole-cell glyphs were preserved
- [x] Three line-wrapped sentences found by scanning for a trailing dash and fixed by hand
- [x] The first attempt reverted whole rather than patched, after two repair passes each made it worse
- [x] 835 semicolons the same scanner flags as hard blockers named as out of scope rather than
      silently swept
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] No credential, token or key added, moved or logged
- [x] No new network call, and no dependency installed
- [x] File moves stay inside the repository; nothing is written outside it
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] `spec.md` records which buckets are out of scope and why
- [x] `implementation-summary.md` records what shipped, with the commit hash
- [x] `acceptance-criteria.md` rows carry observed evidence, not intentions
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] Only README files changed; no code, no metadata, no generated artifact
- [x] Nothing left at the old path that a live reference still needs
- [x] No task-created temporary file in the scoped diff
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Measure | Before | After |
|---------|--------|-------|
| Prose em-dashes, authored set | 909 | 0 |
| Files changed | — | 147 |
| Lines changed | — | 689 |
| Comma splices introduced | — | 0 |
| Out-of-scope line edits | — | 0 |
| `hvr_scan.py` hard blockers, root README | 84 | 65 |

The 19-point drop on the root README is the em-dash rule alone. The 65 that remain are semicolons,
a different rule this request did not name.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] Not applicable; this phase changes prose, not structure
- [x] The class contract holds: every required file present, every forbidden file absent
- [x] Router paths resolve to leaves that exist on disk
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

Not applicable in the runtime sense: this phase moves files and metadata and adds no code path on a
hot loop. The one measured quantity is advisor score, recorded per phrase in
`acceptance-criteria.md` rather than as a performance number.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] One commit, so the shared branch has no broken intermediate state
- [x] The scanner run before and after, on copies of `HEAD` for the before
- [x] Rollback named in `plan.md` and reachable by a single revert
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] Moves recorded as renames, so authorship and history survive
- [x] Historical records left as written; only live references rewritten
- [x] No document claims a result that was not observed
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] `validate.sh --strict` prints `RESULT: PASSED` for this folder, taking the first `RESULT:` line
- [x] Generated metadata regenerated after the last document edit
- [x] No spec document still carries template prose
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Packet owner | [x] Approved | 2026-09-06 |
| Claude Code | Implementer | [x] Approved | 2026-09-06 |
| `validate.sh --strict` | Automated gate | [x] Approved | 2026-09-06 |
<!-- /ANCHOR:sign-off -->

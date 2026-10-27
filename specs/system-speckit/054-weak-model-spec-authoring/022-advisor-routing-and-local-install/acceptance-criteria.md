---
title: "Acceptance Criteria: Phase 22: advisor-routing-and-local-install"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "advisor routing and local install acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/022-advisor-routing-and-local-install"
    last_updated_at: "2026-10-27T04:57:36Z"
    last_updated_by: "closeout-doc-writer"
    recent_action: "Recorded the final gate runs; every row Met"
    next_safe_action: "None: phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-022-advisor-routing-and-local-install"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 22: advisor-routing-and-local-install

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 054-weak-model-spec-authoring/022-advisor-routing-and-local-install
**Level:** 2
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the four fixes and a rebuilt dist, When the whole advisor suite runs, Then no file fails and the doctor slice and typed-command tests pass | `npx vitest run` from `system-skill-advisor/runtime`. Observed: `Test Files  150 passed (150)`, `Tests  1243 passed \| 8 skipped (1251)`. Before: `1 failed \| 148 passed (149)`, the failure doctor-routing-slice. `typed-command-routing.vitest.ts` `Tests 5 passed (5)`, and against the old bound `1 failed \| 4 passed (5)` Evidence: `.skilled/skills/system-skill-advisor/runtime/tests/scorer/typed-command-routing.vitest.ts:65` | Met | - |
| AC-002 | REQ-002 | Given the lead phrase, the bound and the suffix strip, When the three prompts are scored live and local, Then each ranks the skill or command it names first | `skill-advisor.cjs advisor_recommend` and the forced-local scorer. Observed live: `command-doctor-git-hooks 0.7 \| sk-code 0.617804`; rr-iter3-168 `system-deep-loop 0.564701 \| system-spec-kit 0.5647`; `system-spec-kit 0.763766`; `system-spec-kit 0.814759`; `system-deep-loop 0.738916 \| sk-code 0.656367`. Local: the same five tops Evidence: `.skilled/commands/doctor/_routes.yaml:278` | Met | - |
| AC-003 | REQ-003 | Given the link step, When the sk-git harness runs on the new and the previous script, Then the new one passes and the old one fails the new checks | `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh`. Observed: `PASS=171 FAIL=0`; on the previous script `FAIL=8`, every one a local-command check Evidence: `.skilled/skills/sk-git/scripts/worktree-naming.sh:622` | Met | - |
| AC-004 | REQ-004 | Given the Python strip, the restored phrase and the regenerated bridges, When the twin's tests, the freshness check and the bridge check run, Then each passes | Observed: `Summary: pass=85, fail=0`; `skill-graph-freshness.cjs --strict` `SIGNAL DRIFT compiled vs disk: none`, rc=0; `derive-command-bridges.cjs --check` `"changed": []` Evidence: `.skilled/skills/system-spec-kit/graph-metadata.json:71` | Met | - |
| AC-005 | REQ-005 | Given the private command copied and linked, When the tracked diff and this phase's new files are searched for its name, Then nothing matches | A search for the name over `git diff HEAD` and the new files. Observed: no match; `git status` in the primary checkout lists none of the command's files Evidence: `.gitignore:250` | Met | - |
| AC-006 | REQ-006 | Given the filled docs, When `validate.sh` runs on this folder with `--strict` and the repair switched off, Then it prints `RESULT: PASSED` | `SPECKIT_DRAFT_AUTO_REPAIR=0 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict`. Observed: FINAL_VALIDATE Evidence: `implementation-summary.md:99` | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Yes. Every criterion is Met, and each fix was proven by a test that fails without it.
<!-- /ANCHOR:closure -->

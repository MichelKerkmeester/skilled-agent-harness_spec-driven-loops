---
title: "Acceptance Criteria: Phase 5: leak-and-routing-verification"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "leak and routing verification acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/005-leak-and-routing-verification"
    last_updated_at: "2026-10-23T07:03:41Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: leak-and-routing-verification

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/013-private-surface-skills/005-leak-and-routing-verification
**Level:** 2
**Status:** Draft
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fresh clone of `origin/main` at the phase commit, When `git ls-files` is filtered for `local-webflow`, `local-obsidian`, `sk-code-webflow` and `sk-code-obsidian`, Then nothing is printed and the recorded count is `0` | `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md`, first command; expected output: no lines, count `0` | Unmet | - |
| AC-002 | REQ-002 | Given the same clone, When the tracked-content sweep runs with the four path exclusions from `plan.md` step 3, Then every printed path starts with `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/` or `.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/`, and no other path appears; and when the bare-token sweep runs over `.skilled/skills/sk-code` and `.hermes/skills/sk-code` with the kept `WEBFLOW:` platform tag lines and the dated `changelog/` and `benchmark/reports/` records excluded, Then its count is `0` | `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md`, second command plus the classification list, and third command plus its count; expected output: only allowlisted paths, each one named, and `0` from the token sweep | Unmet | - |
| AC-003 | REQ-003 | Given CI has rebuilt the trigger index on `main` after the phase push, When the clone pulls and the index is counted for the four names, Then `grep -c` prints `0` | `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md`; expected output: `0`, with a `chore(system-spec-kit): rebuild the trigger index` commit above the phase commit in `git log --oneline -3` | Unmet | - |
| AC-004 | REQ-004 | Given a throwaway advisor database built from the clone with `SYSTEM_SKILL_ADVISOR_DB_DIR`, When the sk-code-family query runs, Then `count(*)` prints `0` and the rebuild reported `skillCount` greater than `0` with no `EMPTY-SKILL-SCAN` warning | `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/05-advisor-db.md`; expected output: `0` from the query, `14` or greater from `skillCount` at this commit | Unmet | - |
| AC-005 | REQ-005 | Given the operator's main checkout `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` with both private skills present and the advisor graph rebuilt, When the three probes run, Then the Webflow prompt returns `local-webflow`, the Obsidian prompt returns `local-obsidian`, and the generic frontend prompt returns `sk-code` | `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md`; expected output: the three `skillId` values in that order | Unmet | - |
| AC-006 | REQ-006 | Given the fresh clone, When `git diff --stat 42b41dd286 HEAD` runs over the ten D6 out-of-scope path prefixes from `plan.md` step 4, Then no output is printed, and the dated records outside that audit (surface `changelog/`, `benchmark/reports/`, `specs/**/z_archive/`) are not claimed unchanged | `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/04-d6-kept-records.md`; expected output: empty diff, exit `0` | Unmet | - |
| AC-007 | REQ-007 | Given the pushes recorded in the committed `09-ci.md`, When `gh run list --branch main --limit 10` is grouped by status and conclusion, Then every row is `completed/success` or `completed/skipped` and no `failure`, `cancelled` or `timed_out` appears, and the runs of the evidence push itself are reported in the phase handoff message with their run ids rather than appended to `09-ci.md` | `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/09-ci.md`; expected output: `uniq -c` lines for `completed/success` and `completed/skipped` only, plus the stated limit that the evidence push's own runs are reported in the handoff message | Unmet | - |
| AC-008 | REQ-008 | Given the eleven evidence files, When `validate.sh --strict` runs on this folder, Then it prints `RESULT: PASSED` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification --strict`; expected output: `RESULT: PASSED` | Unmet | - |
| AC-009 | REQ-009 | Given the operator checkout, When `git status --porcelain` is filtered for the private skills and `git check-ignore -v` is asked about both, Then the first prints nothing and the second names `/.skilled/skills/local-*` and `/.hermes/skills/local-*` | `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/08-local-invisibility.md`; expected output: no `git status` lines, two `check-ignore` lines naming the root `.gitignore` rules | Unmet | - |
| AC-010 | REQ-010 | Given the evidence set, When a reader looks for the recorded limits, Then `implementation-summary.md` Known Limitations and `09-ci.md` both state that removed content stays in git history (D7), that `git commit --no-verify` bypasses the pre-commit guard, and that the CI runs of the evidence push itself are reported in the phase handoff message rather than committed, and neither document claims a scrubbed history, an unbypassable guard or a committed CI result for that push | `implementation-summary.md` Known Limitations plus `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/09-ci.md`; expected output: all three limits present, no stronger claim anywhere in the packet | Unmet | - |
| AC-011 | REQ-011 | Given every `Met` row, When the reviewer re-runs its command, Then the quoted output in the evidence file matches, and no row is `Met` whose evidence file is missing or records a failure | `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md` reviewer round, at most 2 rounds; expected output: a per-row verdict, every `Met` row reproduced | Unmet | - |

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

**Closeable:** No

No row may be marked `Met` before its command has been run and its output quoted in the named evidence file. Fill this statement when the packet closes: which criteria carried it, and which checks were consciously left blocked and why.
<!-- /ANCHOR:closure -->

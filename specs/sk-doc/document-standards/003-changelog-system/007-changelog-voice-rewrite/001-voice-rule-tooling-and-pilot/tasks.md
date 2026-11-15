---
title: "Tasks: Phase 1: voice-rule-tooling-and-pilot"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "voice rule tooling and pilot tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: voice-rule-tooling-and-pilot

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

`S` is `specs/sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/scratch`. `O` is `specs/sk-doc/document-standards/003-changelog-system/002-skill-changelog-retrofit/scratch`. `V` is `.skilled/skills/sk-doc/sk-create-with-human-voice`.

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Split the scope list into one list per phase 002 to 012 (`$S/lists/`). Verify: `cat $S/lists/0*.txt | wc -l` prints 1571 and `sort $S/lists/0*.txt | uniq -d` prints nothing. Evidence: 11 lists sum 1571, no duplicates. The first split summed 1573. Two lines in 004.txt were templates (`templates/changelog/phase.md`, `root.md`), and the operator dropped them on 2026-11-15.
- [x] T002 Pick 20 pilot files, at least one per phase list, including `.skilled/changelog/skilled/v4.0.0.0.md` (`$S/lists/pilot.txt`). Verify: `wc -l < $S/lists/pilot.txt` prints 20. Evidence: 20 files, every list represented; baseline avg 14.7 words, 171 sentences over 22.
- [x] T003 [P] Copy the earlier briefs, driver, gate scripts and wave scripts (`$S/`). Verify: `ls $S` lists `brief-rewrite.md`, `brief-verify.md`, `rewrite-driver.cjs`, `wave-verify.cjs` and `wave-park.cjs`. Evidence: all five present plus `agent-wait.cjs`, `coverage-scan.py` and the old checker.
- [x] T004 [P] Classify the 55 files with a hard blocker as a fix or a self-reference (`$S/hard-blockers.md`). Verify: `rg -c '^\| ' $S/hard-blockers.md` prints 57, a header, a rule and 55 rows. Evidence: 57 rows counted; 54 fix, 1 self-reference (`sk-design-diagram` v1.2.10.0).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the retrofit carve-out to the released changelog row (`$V/references/scope-and-exemptions.md`). Verify: `rg -n 'operator-approved retrofit' $V/references/scope-and-exemptions.md` prints one line in section 3. Evidence: one line, section 3 row.
- [x] T006 Add the same carve-out to NEVER rule 2 and bump the version (`$V/SKILL.md`). Verify: `rg -n 'operator-approved retrofit' $V/SKILL.md` prints one line, and `version:` is one patch higher. Evidence: one line in NEVER 2; version 1.2.6.0 to 1.2.7.0.
- [x] T007 Write the changelog entry for the amendment (`$V/changelog/v<next>.md`). Verify: `check_changelog_shape.py` and `hvr_scan.py` on it exit 0. Evidence: `v1.2.7.0.md`; house checker PASS, voice scan 0 hard blockers.
- [x] T008 Rewrite the brief for sentence and voice work with fact rules first (`$S/brief-rewrite.md`). Verify: `rg -n 'keep every fact' $S/brief-rewrite.md` prints a line above the first style rule. Evidence: rewritten for a structure-locked sentence pass; `keep every fact` at line 12, style rules after.
- [x] T009 Adapt the fact-check brief to a same-format rewrite (`$S/brief-verify.md`). Verify: `rg -n 'dropped|added|changed' $S/brief-verify.md` prints the three finding types. Evidence: finding types are dropped, added and changed; the format-retrofit drop list is gone.
- [x] T010 Gate the driver on the sentence rules, the voice scan, no new shape failure and the fact check, record tokens per dispatch, and add a `--dry-run` mode that dispatches nothing (`$S/rewrite-driver.cjs`). Verify: `node $S/rewrite-driver.cjs --dry-run $S/lists/pilot.txt` exits 0 and prints the gate list. Evidence: rewritten driver; `--dry-run` exits 0 and prints five gates; structure lock self-compares clean on 1,571 entries.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Confirm the worker runs at high effort (`$S/state.jsonl`). Verify: every pilot rewrite row records `thinking` `high` from its `export.json`, and `rg -n 'thinking = "max"' .vibe/config.toml` still prints both roster rows. Evidence: all 20 rows record `thinking` `high`; `.vibe/config.toml` lines 20 and 26 still read max.
- [x] T011 Run the driver on the pilot list (`$S/state.jsonl`). Verify: `rg -c 'pilot' $S/state.jsonl` shows a row for each of the 20 files, each `pass` or `restored`. Evidence: 20 rows with `wave` pilot, all `pass` (26 attempts, 5 files needed a retry).
- [x] T012 Measure the kept pilot files (`$S/measure-voice.py`). Verify: it prints `avg_words` of 10 or less and `sentences_over_22=0`. Evidence: `avg_words=9.0`, `sentences_over_22=0` (baseline 14.7 and 171).
- [x] T013 Confirm each kept file and each restore against HEAD (`$S/wave-verify.cjs`). Verify: it exits 0. Evidence: `{"listed":20,"keep":20,"restored":0,"missing":0,"problems":0}`, exit 0.
- [x] T014 Sum the pilot's input and output tokens and compare them with the parent's estimate (`implementation-summary.md`). Verify: the summary names both numbers and the projected total for 1,573 files. Evidence: 1,023,037 tokens (worker 497,336, fact check 525,701); projected 80.4M for 1,571 entries against the parent's 600M mid estimate.
- [x] T015 Show the operator the pilot diffs and record the verdict (`implementation-summary.md`). Verify: the summary quotes the operator's answer. Evidence: the operator answered "Approve (Recommended)" on 2026-11-15, then "Approve final pilot (Recommended)" for the final state after the review fixes and 4 reruns.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The operator approved the pilot rewrites
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Earlier retrofit**: See `../../002-skill-changelog-retrofit/001-tooling-and-pilot/`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md Evidence: spec.md REQ-001 to REQ-009.
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: plan.md.
- [x] CHK-003 [P1] An executor with quota is reachable: a one-line dispatch returns Evidence: Vibe and Codex dispatches returned throughout the pilot.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check $S/rewrite-driver.cjs` exits 0 Evidence: exit 0.
- [x] CHK-011 [P0] `python3 -m py_compile $S/measure-voice.py` exits 0 Evidence: exit 0.
- [x] CHK-012 [P1] The driver restores a file that fails every attempt, shown by the dry run on a file built to fail Evidence: forced run restored the file byte for byte after 3 attempts (a direct run with a stubbed worker, since a dry run dispatches nothing).
- [x] CHK-013 [P1] No code comment carries a spec path or packet number Evidence: no spec path or packet id in a `.cjs` comment.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: AC-001 to AC-010 Met.
- [x] CHK-021 [P0] The operator read the pilot diffs Evidence: operator answered "Approve (Recommended)".
- [x] CHK-022 [P1] The largest entry, `v4.0.0.0.md`, ran through every gate Evidence: `v4.0.0.0.md` passed on attempt 2 in 207 s.
- [x] CHK-023 [P1] A file that already passes was left unchanged Evidence: `system-spec-kit/changelog/v2.13.2.0.md` recorded `unchanged`, attempts 0, diff empty.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this packet fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No brief or state row holds a credential Evidence: no key in briefs, state or logs; two `API-key` hits are changelog prose.
- [x] CHK-031 [P0] The fact-check executor runs with no write access Evidence: `--sandbox read-only`.
- [x] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] `scope-and-exemptions.md` and `SKILL.md` state the same carve-out Evidence: same phrase in both files.
- [x] CHK-042 [P2] N/A: no README changes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Tooling and run state live in the parent's `scratch/` only Evidence: all under `../scratch/`.
- [x] CHK-051 [P1] Parked rewrites are cleared before a commit Evidence: `failed/` holds no draft.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-15
<!-- /ANCHOR:summary -->

---




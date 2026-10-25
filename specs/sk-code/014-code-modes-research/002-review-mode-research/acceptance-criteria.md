---
title: "Acceptance Criteria: Phase 2: review-mode-research"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "review mode research acceptance criteria"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-code/014-code-modes-research/002-review-mode-research"
    last_updated_at: "2026-10-25T13:20:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Re-closed AC-003 to AC-005 at fifteen and AC-009 against ADR-003"
    next_safe_action: "None. The phase is closed"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-25-skcode-014"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: review-mode-research

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/014-code-modes-research/002-review-mode-research
**Level:** 2
**Status:** Complete
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Run every command from this phase folder, `specs/sk-code/014-code-modes-research/002-review-mode-research`. Read counts rather than exit status, because `grep` here is ugrep. `BASE_SHA` in AC-009 is the sha written in the Baseline row of the parent goal log before the first iteration.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-004 | Given the finished run, When the synthesis is read, Then `research/research.md` exists and holds a Ranked Recommendations section | `test -s research/research.md` exits 0 and `grep -c "Ranked Recommendations" research/research.md` prints 1 or more Observed: Met. `test -s` exit 0, `grep -c` printed 1 (2026-10-25 10:52 UTC) Evidence: research/research.md:73 | Met | - |
| AC-002 | REQ-004 | Given that section, When its labelled rows are counted, Then at least eight carry an evidence label | `awk '/Ranked Recommendations/{f=1} f&&/OBSERVED/{n++} f&&/DERIVED/{n++} f&&/INFERRED/{n++} END{print n}' research/research.md` prints 8 or more Observed: Met. The awk count printed 13 (twelve ranked rows, each labelled). Re-run after iteration 15: prints 26, because section 6a adds a labelled verdict per row Evidence: research/research.md:79 | Met | - |
| AC-003 | REQ-006 | Given the finished loop, When the iteration folder is listed, Then fifteen record files exist, ten first-pass and five from the second-model pass ADR-002 added | `ls -1 research/iterations/iteration-0*.md` prints `iteration-001.md` through `iteration-015.md`, 15 paths. First pass observed: 10 paths, `iteration-001.md` through `iteration-010.md`. Re-run after the second-model pass that ADR-002 added: 15 paths, `iteration-001.md` through `iteration-015.md`. Iterations 1 to 10 ran on cli-codex `gpt-6-luna` at max and fast, and 11 to 15 on cli-devin `deepseek-v4-1-flash-max` Evidence: research/iterations/iteration-015.md:1 | Met | - |
| AC-004 | REQ-006 | Given the state log, When its iteration records are counted, Then there are fifteen, per ADR-002 | `grep -c '"type":"iteration"' research/deep-research-state.jsonl` prints 15. First pass observed: `grep -c` printed 10. Re-run after the ADR-002 pass: prints 15 Evidence: research/deep-research-state.jsonl:13 | Met | - |
| AC-005 | REQ-006 | Given the state log, When the synthesis record is read, Then a stop reason is recorded | `grep '"event":"synthesis_complete"' research/deep-research-state.jsonl` prints two records, one per synthesis, and the latest has `stopReason` set and `totalIterations` equal to 15, per ADR-002. First pass observed: one record: `"stopReason":"maxIterationsReached","totalIterations":10`. Re-run after the ADR-002 pass: two records, one per synthesis. The latest reads `"stopReason":"maxIterationsReached","totalIterations":15` Evidence: research/deep-research-state.jsonl:14 | Met | - |
| AC-006 | REQ-001 | Given the synthesis, When Repo-Agnostic Findings is read, Then each repo-bound assumption is classed and carries a source tag | `grep -c "Repo-Agnostic Findings" research/research.md` prints 1 or more, and three source tags from that section opened by hand resolve to the quoted text Observed: Met. `grep -c` printed 1. Three tags opened by hand resolved: `.skilled/skills/sk-code/sk-code-review/SKILL.md:223` `SKILLED_PATH_MARKER = ".skilled/"`, `.skilled/skills/sk-code/sk-code-review/SKILL.md:503` `sha256(git remote get-url origin)`, `.skilled/skills/sk-code/sk-code-review/SKILL.md:530` `NEVER skip when diff touches` Evidence: research/research.md:23 | Met | - |
| AC-007 | REQ-002 | Given the synthesis, When Usefulness Findings is read, Then its judgements cite the packet's own benchmark, playbook, changelog or scripts | `grep -c "Usefulness Findings" research/research.md` prints 1 or more and `grep -c "benchmark/reports" research/research.md` prints 1 or more Observed: Met. `Usefulness Findings` printed 1, `benchmark/reports` printed 3 Evidence: research/research.md:39 | Met | - |
| AC-008 | REQ-003 | Given the synthesis, When Integration Findings is read, Then it covers the sibling modes and an External-User Modes subsection | `grep -c "External-User Modes" research/research.md` prints 1 or more and `grep -c "parent-skills-nested-packets" research/research.md` prints 1 or more Observed: Met. `External-User Modes` printed 1, `parent-skills-nested-packets` printed 4 Evidence: research/research.md:62 | Met | - |
| AC-009 | REQ-005 | Given the recorded baseline, When the diff is taken, Then neither subject mode folder changed over the research runs, the scope ADR-003 sets | `git diff --stat f8671e07c2 ee8c7e6f24 -- .skilled/skills/sk-code/sk-code-quality .skilled/skills/sk-code/sk-code-review`, run from the repository root, prints nothing. Superseded by ADR-003, which records the operator's scope: the original whole-folder check, `git diff --stat $BASE_SHA -- ':/.skilled'`, cannot pass while other sessions edit `.skilled/` in this worktree. Observed 2026-10-25: the scoped command printed nothing. The whole-folder form printed 131 at HEAD, all outside the two folders. No iteration log carries a write to `.skilled/` | Superseded | ADR-003 |
| AC-010 | REQ-006 | Given the packet, When strict validation runs, Then it passes and the source tags resolve | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/014-code-modes-research/002-review-mode-research --strict` prints `RESULT: PASSED` and no SOURCE_TAGS warning Observed: Met. `validate.sh --strict --no-recursive` printed `RESULT: PASSED` with `Errors: 0`, and SOURCE_TAGS passed with 493 resolving tags and no warning. Re-run after iteration 15, after `repair-derived.cjs --apply`, as part of `validate.sh specs/sk-code/014-code-modes-research --recursive --strict`: `RESULT: PASSED`, Errors 0, Warnings 0, and SOURCE_TAGS passed with 385 resolving tags and no warning. The count fell from 493 because the deleted quarantine copies no longer count Evidence: tasks.md:67 | Met | - |
| AC-011 | REQ-006 | Given the run, When the research files are searched for the sibling phase's research path, Then none names it | `grep -rc "001-quality-mode-research/research" research` prints 0 for every file. Narrowed by ADR-001 to the research content, and amended by the operator's ruling of 2026-10-25 to skip a line that only states the sibling folder was not read: `grep -rn "001-quality-mode-research/research" research/research.md research/iterations research/deep-research-state.jsonl research/deltas \| grep -vE '(was not read\|Nothing under .* was read)'` prints nothing. Observed 2026-10-25 from this phase folder: the command printed nothing. Without the skip, the narrowed grep matched `iteration-013.md and iteration-014.md`, which read as statements that the sibling folder was not read. Devin's session records show no read, grep or glob call naming the sibling folder. The containment copies are gone, deleted with the operator's approval | Met | - |

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

**Closeable:** Yes

Ten criteria are Met with observed command output, and AC-009 is Superseded by ADR-003, which scopes the boundary check to the two subject mode folders. AC-011 closed on the operator's ruling that the narrowed check may skip a line that only states the sibling folder was not read, recorded in ADR-001. The amended check printed nothing, and the synthesis, the state log and every delta print 0 for the sibling path.
<!-- /ANCHOR:closure -->

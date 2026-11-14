---
title: "Acceptance Criteria: Phase 18: sk-git-rebase-sentence"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "sk-git rebase sentence acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/018-sk-git-rebase-sentence"
    last_updated_at: "2026-11-14T13:30:00Z"
    last_updated_by: "documentation-agent"
    recent_action: "Built the probe and corrected the sentence"
    next_safe_action: "The orchestrator commits the scoped files and runs T013 against the fix commit"
    blockers: []
    key_files: [".skilled/skills/sk-git/SKILL.md", ".skilled/skills/sk-git/changelog/v1.11.12.0.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-018-sk-git-rebase-sentence"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which backend the 2026-11-13 20:41 rebase used is not recorded. The apply backend reproduces the kept ids."
    answered_questions:
      - "Did the 16 kept ids come from commits git did not replay? No. The minute holds 16 reflog lines, not 16 commits. 13 replayed picks kept their ids and 2549786f28 was not replayed."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 18: sk-git-rebase-sentence

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 018-sk-git-rebase-sentence
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a throwaway repository with the real hook, When the four rebase cases run, Then each records the git version, the id before, the `CHERRY_PICK_HEAD` state and the id after | `scratch/rebase-probe.txt` holds four `CASE:` blocks with those fields, and the probe exited 0. Cited: `scratch/rebase-probe.txt:3`, `:12`, `:21`, `:30` | Met | - |
| AC-002 | REQ-002 | Given the probe output, When the sk-git rebase sentence is read, Then it says only what the probe showed | `rg -c 'A rebase keeps an id only when the replayed message still carries one' .skilled/skills/sk-git/SKILL.md` exited 1 with no output on 2026-11-14, and `goal.md` maps each claim of the new sentence to a probe case. Cited: `.skilled/skills/sk-git/SKILL.md:322` | Met | - |
| AC-003 | REQ-003 | Given the edited skill, When its version is checked, Then it is `1.11.12.0` with a changelog file for it | `rg -n '^version:' .skilled/skills/sk-git/SKILL.md` printed `6:version: 1.11.12.0`, `ls .skilled/skills/sk-git/changelog/v1.11.12.0.md` exited 0 and `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs verify --skill sk-git` printed `ok=78` for 78 files with exit 0. Cited: `scratch/verification.txt:2`, `scratch/verification.txt:22`, `scratch/verification.txt:26` | Met | - |
| AC-004 | REQ-004 | Given the edited skill, When sk-doc's package and document checks run, Then both pass | `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/sk-git` printed `PASS` with exit 0 and `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-git/SKILL.md` printed `VALID` with 0 issues and exit 0. Cited: `scratch/verification.txt:8`, `:13` | Met | - |
| AC-005 | REQ-005 | Given the reflog of the rebase on 2026-11-13 at 20:41, When its picks are read, Then the cause of the 16 kept ids is recorded or written as an open question | `scratch/reflog-2041.txt` exists and `goal.md` holds the open question with what was checked. The extract finds 16 minute lines, 13 replayed picks that kept their ids and one commit that was not replayed. Cited: `scratch/reflog-2041.txt:1`, `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/018-sk-git-rebase-sentence/goal.md` | Met | - |
| AC-006 | REQ-006 | Given AC-004 of phase 9, When it is read, Then its Verification cell carries a dated note naming phase 18 and its status is unchanged | `rg -c 'phase 18' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/009-document-corrections/acceptance-criteria.md` printed 1 on 2026-11-14, and the row's status is still `Met`. Cited: `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/009-document-corrections/acceptance-criteria.md:59` | Met | - |
| AC-007 | REQ-007 | Given the end of the build, When the hook folder is compared with `HEAD`, Then nothing in it differs | `git diff --quiet HEAD -- .skilled/scripts/git-hooks` exited 0 on 2026-11-14. Cited: `scratch/verification.txt:19` | Met | - |


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

Every row is Met. The evidence is the four-case probe, the red and green runs, sk-doc's three checks and the unchanged hook folder.
<!-- /ANCHOR:closure -->

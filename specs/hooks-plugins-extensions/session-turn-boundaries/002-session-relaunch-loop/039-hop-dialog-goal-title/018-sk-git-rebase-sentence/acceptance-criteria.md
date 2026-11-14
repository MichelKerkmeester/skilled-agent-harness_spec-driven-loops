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
    last_updated_at: "2026-11-14T12:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Planned the rebase probe, the corrected sentence, the version bump and the changelog entry"
    next_safe_action: "Build the phase from tasks.md after the operator's workspace choice"
    blockers: []
    key_files: [".skilled/skills/sk-git/SKILL.md", ".skilled/scripts/git-hooks/prepare-commit-msg"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-018-sk-git-rebase-sentence"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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
**Status:** Draft
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a throwaway repository with the real hook, When the four rebase cases run, Then each records the git version, the id before, the `CHERRY_PICK_HEAD` state and the id after | `scratch/rebase-probe.txt` holds four blocks with those fields, and the probe exited 0 | Unmet | - |
| AC-002 | REQ-002 | Given the probe output, When the sk-git rebase sentence is read, Then it says only what the probe showed | `rg -c 'A rebase keeps an id only when the replayed message still carries one' .skilled/skills/sk-git/SKILL.md` prints nothing with exit 1, and `goal.md` maps each claim of the new sentence to a probe case | Unmet | - |
| AC-003 | REQ-003 | Given the edited skill, When its version is checked, Then it is `1.11.12.0` with a changelog file for it | `rg -n '^version:' .skilled/skills/sk-git/SKILL.md` prints `6:version: 1.11.12.0`, `ls .skilled/skills/sk-git/changelog/v1.11.12.0.md` exits 0 and `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs verify --skill sk-git` exits 0 | Unmet | - |
| AC-004 | REQ-004 | Given the edited skill, When sk-doc's package and document checks run, Then both pass | `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/sk-git` and `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-git/SKILL.md` exit 0 | Unmet | - |
| AC-005 | REQ-005 | Given the reflog of the rebase on 2026-11-13 at 20:41, When its picks are read, Then the cause of the 16 kept ids is recorded or written as an open question | `scratch/reflog-2041.txt` exists and `goal.md` holds the cause or the question with what was checked | Unmet | - |
| AC-006 | REQ-006 | Given AC-004 of phase 9, When it is read, Then its Verification cell carries a dated note naming phase 18 and its status is unchanged | `rg -c 'phase 18' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/009-document-corrections/acceptance-criteria.md` prints 1 or more | Unmet | - |
| AC-007 | REQ-007 | Given the end of the build, When the hook folder is compared with `HEAD`, Then nothing in it differs | `git diff --quiet HEAD -- .skilled/scripts/git-hooks` exits 0 | Unmet | - |


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

Every row is Unmet because the phase is planned and not built.
<!-- /ANCHOR:closure -->

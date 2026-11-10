---
title: "Acceptance Criteria: Phase 5: concise-release-format"
description: "The criteria this packet must satisfy before it may be closed: two model entries with length from the ceilings, a bounded expanded format and a blocking shape gate that passes v4.0.1.0 and is tested in the sk-doc suite."
trigger_phrases:
  - "concise release format acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system/005-concise-release-format"
    last_updated_at: "2026-11-05T23:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Set every criterion Met with the command that proves it"
    next_safe_action: "None. Rerun the cited commands before reopening a row"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md"
      - ".skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py"
      - ".skilled/skills/sk-doc/scripts/tests/test_check_changelog_shape.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-05-concise-release-format-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: concise-release-format

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/document-standards/003-changelog-system/005-concise-release-format
**Level:** 2
**Status:** Complete
**Date:** 2026-11-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Commands run from the worktree root. `G` is `.skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the template, `SKILL.md` and both references, When a writer reads them for the model entry, Then v4.0.1.0 is named for length, selection and shape and v4.0.0.0 for voice and a major release's opening | `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:29` names both entries and `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:36` says the ceilings win on length. `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:100` repeats it. `rg -n "canonical exemplar"` over the mode, past changelog entries excluded, prints nothing | Met | - |
| AC-002 | REQ-002 | Given the template's length table, When it is read, Then an expanded entry is bounded at 240 lines below the frontmatter and 26 H4 items, with one paragraph per item | `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:223` for one paragraph, `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:226` for 240 lines and `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:227` for 26 items | Met | - |
| AC-003 | REQ-003 | Given the gate, When it runs on v4.0.1.0 and on the long `bc28fcbbba` version, Then the first prints `PASS` and exits 0 and the second exits 1 on `file-total`, `h4-items` and `spec-line` | Ceilings at `.skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py:34` to `.skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py:36`. The run on v4.0.1.0 printed `PASS`, exit 0. The long version printed `[file-total] 311 lines`, `[h4-items] 38 H4 items` and `[spec-line] line 36`, exit 1 | Met | - |
| AC-004 | REQ-004 | Given both `/create:changelog` YAMLs and `SKILL.md`, When step 5 runs, Then the gate runs on the draft and a non-zero exit blocks the write | `.skilled/commands/create/assets/create-changelog-auto.yaml:672` and `.skilled/commands/create/assets/create-changelog-confirm.yaml:599` run the blocking gate. `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:261` lists it as check 11 and `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:280` gives its command | Met | - |
| AC-005 | REQ-005 | Given the sk-doc suite, When it runs, Then each rule has a passing case and a failing case and the suite passes | Cases from `.skilled/skills/sk-doc/scripts/tests/test_check_changelog_shape.py:51` to `.skilled/skills/sk-doc/scripts/tests/test_check_changelog_shape.py:109`. `run-script-tests.sh` printed `PASS test_check_changelog_shape.py` and `all sk-doc script tests passed`. A copy with the H4 ceiling raised to 27 failed `test_h4_items_fail_past_26` | Met | - |
| AC-006 | REQ-006 | Given the template skeletons, `SKILL.md` and the worked examples, When their spec-folder lines are read, Then none carries a level label | `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:60`, `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:84`, `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:107` and `.skilled/skills/sk-doc/sk-create-changelog/references/worked-examples.md:55` carry the path only | Met | - |
| AC-007 | REQ-007 | Given the template and both YAMLs, When an expanded entry is generated, Then it has the optional Smaller Fixes slot, section-ordered upgrade notes, reader-first selection, tagged glance bullets and three to eight domains, and the report counts H4 items | `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:112`, `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:133`, `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:143`, `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:128` and `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:127`. `.skilled/commands/create/assets/create-changelog-auto.yaml:538` starts selection from the reader. `.skilled/commands/create/assets/create-changelog-auto.yaml:840` and `.skilled/commands/create/assets/create-changelog-confirm.yaml:775` print `Items: {h4_item_count}` | Met | - |
| AC-008 | REQ-008 | Given the template, When a writer cuts an entry, Then the coverage sentence, the cut-at-H4 rule and the drop wording for tie-break order, test and scenario lists and how the work was done are stated | `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:132`, `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:145`, `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:160`, `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:163` and `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:164` | Met | - |
| AC-009 | REQ-009 | Given the version carriers, When the hub check and the Hermes check run, Then the mode is 1.4.0.0, the hub 2.9.5.0, each with a changelog entry, and the mirror is in sync | `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:5`, `.skilled/skills/sk-doc/SKILL.md:5`, `.skilled/skills/sk-doc/sk-create-changelog/changelog/v1.4.0.0.md:11` and `.skilled/skills/sk-doc/changelog/v2.9.5.0.md:10`. `parent-skill-check.cjs` printed `OK` and `sync-skills-hermes.cjs --check` printed `PASS: 65 Hermes skill copies in sync` | Met | - |

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

Every criterion is Met, each with the command or file section that shows it.
<!-- /ANCHOR:closure -->

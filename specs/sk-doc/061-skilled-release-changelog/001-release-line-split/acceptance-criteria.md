---
title: "Acceptance Criteria: Phase 1: release-line-split"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/061-skilled-release-changelog/001-release-line-split"
    last_updated_at: "2026-09-27T12:31:06Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked every acceptance criterion Met with evidence"
    next_safe_action: "Commit phase 1 when the operator asks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "75aab0e6-dcc7-401b-9d10-f48248374023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: release-line-split

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/061-skilled-release-changelog/001-release-line-split
**Level:** 2
**Status:** Complete
**Date:** 2026-09-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 135 GitHub release versions, When the release line and the kept spec-kit history are compared against them, Then every note in `.skilled/changelog/skilled/` has a release except v4.0.0.2, and none of the 66 kept spec-kit notes has one | `implementation-summary.md:113` and the rule at `.skilled/changelog/skilled/README.md:25`. `find .skilled/changelog/skilled -name 'v*.md'` counts 45. The comparison prints `skilled without release: ['4.0.0.2']`. The only spec-kit match is the new component entry 4.0.0.0, which cannot become a tag because only `skilled` publishes | Met | - |
| AC-002 | REQ-001 | Given the hashes taken before the move, When the 45 notes are hashed again, Then every hash is unchanged | `implementation-summary.md:114`. `diff` of the before-move and current `shasum` lists prints nothing | Met | - |
| AC-003 | REQ-002 | Given system-spec-kit's changelog, When its newest entries and version fields are read, Then entries 4.0.0.0, 4.1.0.0 and 4.1.1.0 describe only the skill, and the anchor, `SKILL.md` and `README.md` agree with the versioning standard | `.skilled/skills/system-spec-kit/SKILL.md:5` and `.skilled/skills/system-spec-kit/README.md:13`. `frontmatter-version.mjs compute --skill system-spec-kit` reports anchor 4.1.1.0, `SKILL.md` derived 4.1.1.0, `README.md` derived 4.1.0.99, matching the files. All three entries validate with 0 issues and 0 HVR hard blockers | Met | - |
| AC-004 | REQ-003 | Given changed files under `.skilled/skills/sk-git/`, When the workflow resolves a component with no hint, Then it picks `sk-git` and never `skilled` | `.skilled/commands/create/assets/create-changelog-auto.yaml:217` and `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:359`: the whole-segment strategy and rule 8, mirrored in the confirm YAML. Playbook CHG-009 | Met | - |
| AC-005 | REQ-003 | Given `--release` on a component other than `skilled`, When the release step runs, Then it reports the skip before any tag command and keeps the file | `.skilled/commands/create/assets/create-changelog-auto.yaml:623` and `.skilled/commands/create/assets/create-changelog-confirm.yaml:578`: the guard sits ahead of `Derive release_tag` in both YAMLs. Playbook CHG-010 | Met | - |
| AC-006 | REQ-004 | Given a trigger index built from the final tree, When "v4.0.0.0 release notes" is looked up, Then the exact hit is `.skilled/changelog/skilled/v4.0.0.0.md` and not spec-kit's own entry | `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:30` adds the root, and `implementation-summary.md:116` records the lookup. The scratch index returns exactly that path. The committed index still returns the old path, so it is rebuilt from committed content as the last commit | Met | - |
| AC-007 | REQ-005 | Given folders whose newest entries sit in generation folders, When the step 3 reader runs, Then it returns the newest entry and never a folder or README | `.skilled/commands/create/assets/create-changelog-auto.yaml:474` holds the reader. It returned `v3.9.0.0.md` for system-spec-kit before 4.0.0.0 landed, where the old reader returned `v3+`, and correct versions for eight other folders | Met | - |
| AC-008 | REQ-006 | Given the tree outside `specs/`, When it is searched for the old note paths, Then only generated index files, the Hermes mirror and moved notes match | `.skilled/changelog/skilled/v4.0.0.1.md:187` is one of the two moved-note lines. `rg` finds the committed trigger index and fixtures (rebuilt at commit), `.hermes/skills/sk-create-changelog/SKILL.md` (now resynced) and two plain-text lines in the moved v4.0.0.1 note, which stays unedited by design | Met | - |
| AC-009 | REQ-007 | Given the playbook, When the playbook validator runs, Then it reports 10 scenarios across 4 categories with no violation | `.skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/manual-testing-playbook.md:125` opens the new section. `validate-playbook-package.cjs --package sk-doc/sk-create-changelog` prints `PASS ... scenarios=10 categories=4 ... violations=0 warnings=0` | Met | - |
| AC-010 | REQ-008 | Given the mode's changelog, When its newest entry and `SKILL.md` are read, Then both say 1.2.0.0 | `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:5` reads 1.2.0.0, `v1.2.0.0.md` validates with 0 issues, and the `SKILL.md` diff is the one version line | Met | - |

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

AC-001, AC-002 and AC-006 carried the phase: the release line holds exactly the released notes, byte for byte, and Gate 1 finds them there. Search metadata across every changelog was left to phase 2, and nothing is committed until the operator asks.
<!-- /ANCHOR:closure -->

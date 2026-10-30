---
title: "Acceptance Criteria: Phase 7: docs-and-changelogs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "docs and changelogs acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/007-docs-and-changelogs"
    last_updated_at: "2026-10-30T05:21:18Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-docs-and-changelogs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 7: docs-and-changelogs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/075-doctor-sk-skill-command/007-docs-and-changelogs
**Level:** 2
**Status:** Implemented
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the edited docs, When `rg -c "/doctor:sk-skill"` runs over `README.md`, `.skilled/commands/README.txt`, the doctor scripts README and `sk-create-skill/SKILL.md`, Then each file prints 1 or more | `scratch/after.md:212` | Met | - |
| AC-002 | REQ-002 | Given the touched-skills list, When `ls .skilled/changelog/<link>/v<version>.md` runs for each qualifying skill, Then every path resolves | `scratch/after.md:237` shows the four links resolving. No entry resolves yet, and `scratch/touched-skills.md:11` names the two this phase adds | Unmet | - |
| AC-003 | REQ-003 | Given each new changelog entry, When `validate_document.py <entry> --type changelog` runs, Then it exits 0 | No entry exists yet. The four targets are in `scratch/touched-skills.md:8` and `:11` | Unmet | - |
| AC-004 | REQ-004 | Given the new scenarios and catalog entry, When `validate_document.py` runs with `--type playbook_feature` and `--type feature_catalog`, Then each exits 0 | `scratch/after.md:145` and `:141`, plus the package validators at `:163` and `:205` | Met | - |
| AC-005 | REQ-005 | Given all edits, When the five doc gates run, Then each exits 0 | `scratch/after.md:3` starts the five gates, each closing on `EXIT=0` by `:52` | Met | - |
| AC-006 | REQ-006 | Given `upgrading-a-skill-to-v4.md`, When a reader opens sections 1 and 5, Then they name `/doctor:sk-skill convert` for a single skill and `/create:skill-parent` for a hub | `scratch/after.md:219` | Met | - |

### Evidence per criterion

- **AC-001**: `rg -c "/doctor:sk-skill" README.md .skilled/commands/README.txt .skilled/commands/doctor/scripts/README.markdown .skilled/skills/sk-doc/sk-create-skill/SKILL.md` prints `README.md:2`, `.skilled/commands/README.txt:1`, the scripts README `2` and `SKILL.md:1`, exit 0.
- **AC-004**: the four scenarios print `Total issues: 0` at `--type playbook_feature`, the entry prints `Total issues: 0` at `--type feature_catalog`, `validate-playbook-package.cjs` reports `scenarios=11 categories=2 violations=0 warnings=0`, and `validate_catalog_package.py --package sk-doc` reports `PASS tier=fail violations=0`.
- **AC-005**: `scratch/after.md` holds the five gates, each with `EXIT=0`, plus the compiled-routing activation check.
- **AC-006**: `rg -n "doctor:sk-skill convert|create:skill-parent" .skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md` prints the convert lines in sections 1 and 5, and the hub path in sections 1, 2 and 4. The blanket no-convert-in-place sentence is gone: the remaining two name the hub scaffold they are about.
- **AC-002 and AC-003**: the four links resolve today, and no entry exists yet. The conductor writes one entry per touched skill once every phase has landed, which is the handoff this packet names.

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

The five documentation criteria are met and backed by the evidence above. Two stay unmet on purpose: the changelog entries are written by the conductor after every phase has landed, so no entry exists for a link to resolve to yet. Nothing in this phase can close those two.
<!-- /ANCHOR:closure -->

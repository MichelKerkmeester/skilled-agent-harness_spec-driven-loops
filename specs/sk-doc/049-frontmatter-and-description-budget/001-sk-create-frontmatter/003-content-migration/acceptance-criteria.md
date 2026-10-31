---
title: "Acceptance Criteria: Phase 3: content-migration"
description: "The six criteria that decide whether the migration may close: the residue scan, both validator runs, the untouched alias table, and the link-integrity delta that proves nothing now points at nothing."
trigger_phrases:
  - "migration acceptance criteria"
  - "old path residue scan"
  - "alias table unchanged proof"
  - "validator new location check"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/003-content-migration"
    last_updated_at: "2026-09-01T08:42:58Z"
    last_updated_by: "implementation"
    recent_action: "Closed the migration criteria; all six rows met against named command output"
    next_safe_action: "Proceed to phase 004 (routing integration)"
    blockers: []
    key_files:
      - "../001-inventory-and-contract/inventory/consumer-inventory.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: content-migration

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/049-sk-create-frontmatter/003-content-migration
**Level:** 3
**Status:** Complete
**Date:** 2026-09-01
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given both documents moved into the mode, When the repository is scanned for either old path, Then no live reference to it survives | A repo scan returns only three frozen benchmark report bundles under `sk-doc/benchmark/reports/compiled-routing/`, one line in `system-skill-advisor/manual-testing-playbook/auto-indexing/provenance-and-trust-lanes.md` that is closed to this packet by instruction, and three entries in the released changelog `sk-doc/changelog/v1.8.0.0.md` that record where the file used to be | Met | - |
| AC-002 | REQ-002 | Given the two scripts that name the documents in their output, When each is run after the move, Then it resolves the spec from its new home | `quick_validate.py` reports `Skill is valid!` and `package_skill.py --check --strict` reports `Result: PASS`. Neither prints a path that leads nowhere. Phase 001 established that neither script parses either document, so this is a run-clean proof rather than a repaired parse | Met | - |
| AC-003 | REQ-003 | Given the temptation to keep the old path working, When the phase closes, Then no alias table has grown | `git diff .opencode/skills/sk-doc/leaf-aliases.json` is empty; the table still holds its original 5 entries, none of them frontmatter | Met | - |
| AC-004 | SC-001 | Given a repo-wide scan for the old paths, When its results are classified, Then every survivor is frozen history or out of scope by instruction | The same scan as AC-001: three frozen benchmark bundles, one out-of-scope playbook line, and three released-changelog entries that stay true because they record where the file was | Met | - |
| AC-005 | SC-002 | Given the two validators, When both run against the new location, Then both run clean | `quick_validate.py`: `Skill is valid!`; `package_skill.py --check --strict`: `Result: PASS`. Hub-wide link integrity went from 113 failures to 112, with frontmatter-related failures at 0, and the vitest suite stayed at 54 files and 683 tests passing | Met | - |
| AC-006 | SC-003 | Given the alias table's length before the phase, When it is measured after, Then it is no longer than it was | 5 entries before, 5 entries after, and an empty `git diff` on the file | Met | - |

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

All six criteria are Met. Both documents live in the mode, 34 consumer files were repointed, which is
exactly the count the phase 001 inventory predicted, and hub-wide link integrity improved from 113
failures to 112 with frontmatter-related failures at zero. The single removed failure was the
pre-existing broken `./frontmatter-templates.md` link at `sk-create-changelog/assets/changelog-template.md:286`,
which the repoint fixed as a side effect. No alias was added, so the path a consumer reads is the path
the file is at.

One nuance sits behind AC-002 and AC-005 and should not be read as more than it is. Phase 001 established
that neither `quick_validate.py` nor `package_skill.py` actually parses either document; both carry the
paths in docstrings and in strings printed to an operator. "Both validators run clean against the new
location" therefore means the scripts still work and no longer print a path that leads nowhere. It does
not mean a broken parse was repaired, because there was never a parse.

Consciously left out: the frozen surfaces. Three benchmark report bundles, the released
`sk-doc/changelog/v1.8.0.0.md` entries and one `system-skill-advisor` playbook line still name the old
path, and all three are correct to do so. One side effect is left for the next phase: changing the disk
tree alone dropped the hub's compiled routing to `stale-manifest` with no routing input edited, and
phase 004's refresh closed it.
<!-- /ANCHOR:closure -->

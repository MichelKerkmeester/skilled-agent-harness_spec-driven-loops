---
title: "Acceptance Criteria: Chart versions move below 1.0, and the cleanup's residue closes"
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
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/039-prerelease-versioning-and-residue"
    last_updated_at: "2026-09-10T19:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Every criterion verified from the final state"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-10-chart-prerelease-versioning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Chart versions move below 1.0, and the cleanup's residue closes

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-design/018-sk-design-parent-v2/001-sk-create-chart/039-prerelease-versioning-and-residue
**Level:** 2
**Status:** Complete
**Date:** 2026-09-10
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the changelog directory, When it is listed in version order, Then it reads `v0.1.0.0` through `v0.22.0.0` with no gap | `sk-design-chart/changelog/v0.1.0.0.md:1` and `sk-design-chart/changelog/v0.22.0.0.md:1` bound a twenty-two entry listing with no gap | Met | - |
| AC-002 | REQ-001 | Given any changelog file, When its title and version field are read, Then both state the version in its own filename | `sk-design-chart/changelog/v0.22.0.0.md:2` reads the title and `:3` the version, both `0.22.0.0`, and all twenty-two agree | Met | - |
| AC-003 | REQ-002 | Given the packet, When it is searched for a `v1` or `v2` chart version, Then nothing on a live surface matches | `sk-design/command-metadata.json:80` was the last live holdout and now reads twenty-nine. A repository scan for a `v1` or `v2` chart version returns no live hit, benchmark report blobs excluded | Met | - |
| AC-004 | REQ-002 | Given a four-part number that is not this packet's version, When the rewrite runs, Then it is unchanged | `references/design-md-theming.md:148` still reads `generator=1.4.0.0` after the pass | Met | - |
| AC-005 | REQ-003 | Given `SKILL.md`, When its version is read, Then it equals the highest changelog | `SKILL.md:5` reads `0.22.0.0`, matching `changelog/v0.22.0.0.md` | Met | - |
| AC-006 | REQ-003 | Given every in-scope child document, When the version engine verifies them, Then it reports no mismatch | `sk-design-chart/references/template-contract.md:12` reads `0.22.0.30`, and `frontmatter-version.mjs verify` on the packet path list reports `ok=20 skip-no-frontmatter=3` with zero mismatches | Met | - |
| AC-007 | REQ-004 | Given the hub, When the doctor check runs, Then every leaf resolves and the manifest matches a fresh regeneration | `sk-design/leaf-manifest.json:9` no longer opens on a deleted delivery, and `parent-skill-check.cjs` reports `10b-byte-drift` and `10c-target-collision` PASS with zero invariant failures | Met | - |
| AC-008 | REQ-004 | Given the manual-testing playbook, When it is searched for the removed deliveries, Then nothing matches | `manual-testing-playbook/delivery-and-routing/opens-with-no-build-step.md:51` now copies `assets/templates/treemap.html`, and no `assets/examples` reference survives anywhere under the playbook | Met | - |
| AC-009 | REQ-005 | Given the final state, When the corpus check and the unit suite run, Then both pass | `check-corpus.cjs` reports `errors: 0` and `RESULT: PASSED`. `node --test scripts/tests/` reports 84 tests, 84 pass, 0 fail | Met | - |
| AC-010 | REQ-005 | Given the whole repository, When the frontmatter version gate runs, Then it exits zero | `check-frontmatter-versions.sh` over 2,961 files: `ok=2949 skip-no-frontmatter=12`, exit 0 | Met | - |
| AC-011 | REQ-006 | Given the regenerated retrieval fixtures, When the corpus manifest is searched, Then it names the new paths and none of the old ones | `system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json:2914` names a `v0` path. Old chart changelog paths: 0. New ones: 22 | Met | - |
| AC-012 | REQ-006 | Given the regenerated index, When a chart query is looked up, Then it resolves a chart document | `lookup-trigger-index.mjs -- "chart catalog form"` returns a `sk-design-chart/references` path as its first result | Met | - |

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

AC-003 and AC-004 carried the packet, because they are the pair a blanket search-and-replace fails: one demands every old version move, the other demands that a number belonging to a different tool stay.

Three rows sit below the evidence floor on purpose. AC-009, AC-010 and AC-012 are proved by a command's output and exit status rather than by a location in a file, and there is no line in the tree that shows a suite passing. Pointing them at a script path would satisfy the counter without adding proof, so the observed output stays in the cell and the advisory stays under floor.

Two things were consciously left out. The eight historical spec packets that name an old changelog path keep naming it, because each records an action taken when that file existed. And the version engine's explicit-path guard, which refuses the playbook index file because its name shares a prefix with its own directory, is reported rather than patched, since it is a defect in a script shared by every skill.
<!-- /ANCHOR:closure -->

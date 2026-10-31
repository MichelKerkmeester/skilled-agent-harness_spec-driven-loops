---
title: "Acceptance Criteria: Phase 11: template-phrase-census-and-cleanup"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "template phrase census and cleanup acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/011-template-phrase-census-and-cleanup"
    last_updated_at: "2026-10-07T13:12:41Z"
    last_updated_by: "deepseek-v4.1-flash"
    recent_action: "Rebuilt the trigger index and met the last criterion"
    next_safe_action: "None, the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "011-template-phrase-census-and-cleanup-close"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 11: template-phrase-census-and-cleanup

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/011-template-phrase-census-and-cleanup
**Level:** 2
**Status:** In Progress
**Date:** 2026-10-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the judge's phrase classes, When each of the four acceptance criteria template defaults is judged, Then it warns in the `template-default` class instead of passing as an author phrase. | `phrase-judge.mjs` adds `AC_TEMPLATE_DEFAULT_PHRASES` with `acceptance criteria`, `closure gate`, `ac traceability` and `waiver adr`, and the template-default check matches either set. `trigger-index.vitest.ts` asserts that `acceptance criteria` and `waiver adr` judge as template-default. | Met | - |
| AC-002 | REQ-002 | Given a spec tree, When the cleanup runs without `--apply`, Then no file is written, and when an applied tree is cleaned again, Then nothing changes. | `template-phrase-cleanup.vitest.ts` covers the dry run writing nothing and the idempotent second apply. After the operator-approved apply on 2026-10-07, a second dry run reported 0 files to change. | Met | - |
| AC-003 | REQ-003 | Given a new Level 2 packet, When its `acceptance-criteria.md` is scaffolded, Then it carries a slug-seeded phrase and no `closure gate`. | `create-root-numbering.vitest.ts` asserts the scaffolded file contains `seeded phrases acceptance criteria` and no `closure gate`, and the pin test ties the shell list to `templates/addons/acceptance-criteria.md.tmpl`. The seeding tests report 3 files and 80 tests passing. | Met | - |
| AC-004 | REQ-004 | Given the `specs/` tree, When the census runs, Then it counts exact-block carriers by track with live and archived kept apart, and counts the other templates' defaults informationally. | The census run over the real `specs/` tree scanned 4,412 `spec.md` and 489 `acceptance-criteria.md` files. `template-phrase-census.mjs` groups counts per track under live and archived, and reports the plan, tasks and implementation summary defaults as informational. | Met | - |
| AC-005 | REQ-005 | Given a packet that carries the exact template block plus author-written phrases, When the cleanup applies, Then only the block is replaced and the author phrases stay. | `template-phrase-cleanup.vitest.ts` covers keeping author phrases and duplicate suppression. The corpus apply touched frontmatter `trigger_phrases` only, and the three packets whose seeded phrase duplicated an author phrase were corrected and now pass strict validation. | Met | - |
| AC-006 | REQ-006 | Given the operator-approved `--apply`, When the run finished, Then the derived metadata was re-derived for every touched packet, every touched packet passed strict validation, and the trigger index was rebuilt. | Apply: 509 files in 375 packets, 0 archived, 7 files skipped for a leading HTML comment before the frontmatter. A second dry run reports 0 files to change. Derived metadata was re-derived for all 375 folders with 0 repairable left. Strict validation passed for all except three duplicate-phrase packets, which the orchestrator fixed and which now pass. The orchestrator then rebuilt the trigger index, and `--check` exited 0 with 0 stale and 0 missing documents. | Met | - |

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

Five of the six requirements are Met with recorded evidence: the judge class, the seeder and its pin, the census, the cleanup and its idempotence. AC-006 stays Unmet because the committed trigger index has not been rebuilt since the apply, and phase 008's strict validation waits on the same rebuild. Rebuild the index and rerun the freshness check to close the packet.
<!-- /ANCHOR:closure -->

---

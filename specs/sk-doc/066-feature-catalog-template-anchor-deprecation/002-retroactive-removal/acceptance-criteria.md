---
title: "Acceptance Criteria: Phase 2: retroactive-removal"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "retroactive removal acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-feature-catalog-template-anchor-deprecation/002-retroactive-removal"
    last_updated_at: "2026-10-10T20:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked every criterion with observed evidence"
    next_safe_action: "None, the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "t4-feature-catalog-anchor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: retroactive-removal

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/066-feature-catalog-template-anchor-deprecation/002-retroactive-removal
**Level:** 2
**Status:** Complete
**Date:** 2026-10-10
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the repository, When grepped for either spelling in feature catalog paths, Then no match | `git grep -E 'sk-doc-template: skill_asset_feature[_-]catalog' -- '.skilled/**/feature-catalog/**'` printed nothing; the script reported `files_changed=548 markers_removed=548 inline_copies_left=0` | Met | - |
| AC-002 | REQ-002 | Given the swept catalogs, When validated, Then results match the baseline | `validate_catalog_package.py --repo-root .` printed `FAIL: 761 violation(s) (42 fail, 719 warn)` before and after, and the two outputs diff clean once line numbers are normalized; `validate_document.py` passed 547 of 548 files, the one failure failing identically at HEAD | Met | - |
| AC-003 | REQ-003 | Given the 27 owning units, When their versions are read, Then each is patch-bumped with an entry | 27 new `changelog/v*.md` files, each `SKILL.md` (or the runtime changelog) one patch above its previous latest; `check-frontmatter-versions.sh` exit 0; `hvr_scan.py` 0 hard blockers on every entry | Met | - |
| AC-004 | REQ-004 | Given the derived artifacts, When checked, Then each passes | `compiled-route-guard.cjs` exit 0 with all hubs fresh; `compiled-route-sync.cjs --verify` printed move-simulation OK; `sync-skills-hermes.cjs --check` printed PASS; `generate-trigger-index.mjs --check` exit 0 | Met | - |

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

Every catalog copy is gone, validation results are unchanged and the 27 owning units are versioned. Per-document build counts in the catalog files were left as they were, since the versioning standard treats fleet reconciliation as advice.
<!-- /ANCHOR:closure -->

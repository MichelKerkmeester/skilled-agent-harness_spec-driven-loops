---
title: "Acceptance Criteria: Phase 13: corpus-wide-validation-repair"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "corpus wide validation repair acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair"
    last_updated_at: "2026-10-08T00:00:00Z"
    last_updated_by: "claude-opus-5.5"
    recent_action: "Re-validated all 4,371 packets against the baseline and closed the criteria"
    next_safe_action: "None, the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "013-corpus-wide-validation-repair-close"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 13: corpus-wide-validation-repair

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair
**Level:** 2
**Status:** Complete
**Date:** 2026-10-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the baseline result for every packet, When the final full run is joined to it by path, Then no packet that passed before fails now. | The final strict run over all 4,371 packets was joined to the baseline by path, with the one renamed folder mapped to its new name. 0 packets that passed the baseline fail now. | Met | - |
| AC-002 | REQ-002 | Given every modified document, When its body is compared with HEAD, Then each change is structure or metadata, and every reconstructed document opens with the dated note. | The body comparison flagged 279 of 6,249 modified documents. The orchestrator read each one: status and path cells, repointed or removed links, added scaffold sections and frontmatter. Three lane edits that changed what a record says were reverted. 157 of 157 reconstructed documents open with `Reconstructed on 2026-10-07 from spec.md and git history`. | Met | - |
| AC-003 | REQ-003 | Given all 4,371 packets, When strict validation runs on each, Then each reports RESULT: PASSED or is listed with the reason it cannot. | 4,368 report RESULT: PASSED. Three are listed under Known Limitations in `implementation-summary.md`: two quote an anchor marker as an example in prose, which the anchor check counts as a real anchor, and one has a `spec.md` and a summary that disagree on what was built. All three failed the baseline too. | Met | - |
| AC-004 | REQ-004 | Given the census over live and archived packets, When it runs, Then it reports 0 template carriers. | `template-phrase-census.mjs --json` reports 0 template blocks and 0 partial carriers for all five document kinds. | Met | - |
| AC-005 | REQ-005 | Given the 37 folders that are not packets, When the repair finishes, Then none of their files changed. | `git status` over each of the 37 folders is empty. The 91 files a repair run had touched inside them were restored. | Met | - |
| AC-006 | REQ-006 | Given the final corpus, When the trigger index is rebuilt and checked, Then the check exits 0 with nothing stale. | `generate-trigger-index.mjs` exited 0, and `generate-trigger-index.mjs --check` exited 0 with 0 obsolete paths. | Met | - |

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

All six criteria are Met: no regression against the baseline, structure-only changes plus marked reconstructions, 4,368 of 4,371 packets passing with three listed exceptions, 0 template carriers, untouched non-packet folders and a fresh trigger index. Changing the validator to tolerate quoted anchors is consciously left to phase 14's recommendations.
<!-- /ANCHOR:closure -->

---

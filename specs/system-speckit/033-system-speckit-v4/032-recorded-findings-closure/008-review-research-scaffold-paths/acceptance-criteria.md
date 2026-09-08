---
title: "Acceptance Criteria: Phase 8: review-research-scaffold-paths"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "review research scaffold acceptance criteria"
  - "review report template closure gate"
  - "path typed document criterion"
  - "scaffold golden ac"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/032-recorded-findings-closure/008-review-research-scaffold-paths"
    last_updated_at: "2026-09-07T15:05:50Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 8: review-research-scaffold-paths

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/032-recorded-findings-closure/008-review-research-scaffold-paths
**Level:** 2
**Status:** Complete
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `create.sh`, When it is invoked with `--level review` or `--level research`, Then it scaffolds a folder instead of rejecting the flag | `bash create.sh --json --skip-branch --level review --path <tmp> --number 999 'Review fixture'` exits 0 | Met | - |
| AC-002 | REQ-002 | Given the review level's `requiredCoreDocs`, When `review-report.md` is resolved by either resolver, Then it returns an existing template file | `templates/packet-types/review-report.md.tmpl` exists on disk and both resolvers return its path | Met | - |
| AC-003 | REQ-003 | Given a research scaffold, When it finishes, Then `research/research.md` exists at that nested path, not flat at the folder root | `find <tmp> -name research.md` shows it under `research/`, not at the folder root | Met | - |
| AC-004 | REQ-004 | Given `tests/scaffold-golden-snapshots.vitest.ts`, When it runs, Then it covers a review and a research fixture, each validating strict untouched | `tests/scaffold-golden-snapshots.vitest.ts` passing, both new fixtures present | Met | - |
| AC-005 | REQ-005 | Given `deep-review/SKILL.md` and `deep-research/SKILL.md`, When they are read, Then each states why the loop writes its own file rather than scaffolding through `create.sh` | `grep -n "create.sh\|review-report\|research/research.md" deep-review/SKILL.md deep-research/SKILL.md` shows the new note in both | Met | - |

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

Planning only. No criterion is met yet. The level gate, the template, the resolver wiring and the move-step generalization have not started.
<!-- /ANCHOR:closure -->

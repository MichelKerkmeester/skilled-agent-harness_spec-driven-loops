---
title: "Acceptance Criteria: Phase 2: subtrack-proposal"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "subtrack proposal acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/002-subtrack-proposal"
    last_updated_at: "2026-11-13T10:07:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-subtrack-proposal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: subtrack-proposal

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/002-subtrack-proposal
**Level:** 2
**Status:** Draft
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`S` is `.skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs`. `FLAT` is a real flat track with more than eight live packets.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `FLAT`, When `node S --track FLAT` runs, Then it exits 0 and prints a JSON map whose `from` entries are the live packets of `FLAT`, each exactly once | The `from` count equals the live packet count and no `from` repeats | Unmet | - |
| AC-002 | REQ-002 | Given the map from AC-001, When `relocate.mjs --map <file>` runs as a dry run, Then preflight accepts it and the exit code is 1 | The exit code of `node .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs --map scratch/flat-map.json` | Unmet | - |
| AC-003 | REQ-003 | Given two fixture packets that share `trigger_phrases` and one that shares none, When the tool clusters them, Then the two land in one cluster named from a shared term and the third lands in the remainder cluster | The fixture run output | Unmet | - |
| AC-004 | REQ-004 | Given a flat track of 7 live packets, When `node S --track <track>` runs, Then it prints no map and says the track is below the threshold, and `--threshold 5` prints a map | Both run outputs on the fixture track | Unmet | - |
| AC-005 | REQ-005 | Given a track with subtracks, When `node S --track <track> --describe "<text>"` runs, Then it prints one existing subtrack name, or `none fits` with a new subtrack as the proposal | The run output for a fitting and a non-fitting description | Unmet | - |
| AC-006 | REQ-006 | Given a clean tree, When both modes run, Then no file is created or changed | `git status --porcelain` prints the same lines before and after | Unmet | - |
| AC-007 | REQ-007 | Given a target track at or above the threshold, When `create.sh --json --skip-branch` runs in a scratch tree, Then stderr holds one advisory line that names `suggest-subtracks.mjs`, the exit code is 0 and stdout parses as JSON | The scratch run's stderr, stdout and exit code | Unmet | - |
| AC-008 | REQ-008 | Given the spec gate module, When its three exported strings are read, Then each option C names a new subtrack as a choice | `rg -c -i "subtrack\|sub-track" .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` prints 3 or more | Unmet | - |
| AC-009 | REQ-009 | Given the two presentation assets and `AGENTS.md`, When option C is read in each, Then each carries the subtrack clause | `rg -l -i "subtrack\|sub-track" AGENTS.md .skilled/commands/speckit/assets/speckit-plan-presentation.txt .skilled/commands/speckit/assets/speckit-complete-presentation.txt` prints three paths | Unmet | - |
| AC-010 | REQ-010 | Given the structure docs, When they are searched, Then `folder-structure.md` holds the new section, `phase-definitions.md` points to it and `SKILL.md` and `quick-reference.md` document `--track <track>/<sub>` | Four `rg -c` runs, one per file, each prints 1 or more | Unmet | - |

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

No work has started, so every criterion is unmet.
<!-- /ANCHOR:closure -->

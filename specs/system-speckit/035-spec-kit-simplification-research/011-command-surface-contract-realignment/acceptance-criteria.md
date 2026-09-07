---
title: "Acceptance Criteria: Command surface contract realignment"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "command surface realignment criteria"
  - "help printer criterion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/011-command-surface-contract-realignment"
    last_updated_at: "2026-09-07T03:45:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Marked every criterion met with the evidence observed"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Command surface contract realignment

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 035-spec-kit-simplification-research/011-command-surface-contract-realignment
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
| AC-001 | REQ-001 | Given the command directory, When it is searched for `checklist.md`, `level_contract_` and `T-YML` and every asset is parsed, Then only the sk-code authoring-checklist name matches and all eight assets load | the rewrite script's residue assertions passed; PyYAML loaded eight mappings; the search after the run returned zero lines outside `spec-folder-authoring-checklist.md` | Met | - |
| AC-002 | REQ-002 | Given the registry, When `validate.sh --help` runs, Then every rule id and every category appear | the help output printed 39 rule lines where it printed 33 before; `validate-help-lists-every-rule.vitest.ts` passed both cases | Met | - |
| AC-003 | REQ-003 | Given `complete.md`, When its presentation boundary is read, Then it names the layout and the four checkpoints the asset holds | line 92 rewritten; the asset's section headings were listed and matched | Met | - |
| AC-004 | REQ-004 | Given the validation reference, When the freshness clause is read, Then it names the hashed input | the clause names implementation-summary.md's normalized text, matching `normalizeForContinuityFingerprint` | Met | - |
| AC-005 | REQ-005 | Given the optimizer README, When its current state is read, Then it states the empty report directory and the manifest's remaining consumers | the bullet was added under Current state; the consumers were found by search before it was written | Met | - |
| AC-006 | REQ-006 | Given the runtime tests, When `SPECKIT_BM25_ENGINE` is searched, Then nothing matches | the fixture parses after removal; the search over the skill returned no line | Met | - |

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

Every criterion is met by observed command output. Consciously left out: the multiplexed registry rows, the hook adapter port, the optimizer's scripts and the playbook provenance lines, each with a recorded decision in the lane's confirmed-findings document.
<!-- /ANCHOR:closure -->

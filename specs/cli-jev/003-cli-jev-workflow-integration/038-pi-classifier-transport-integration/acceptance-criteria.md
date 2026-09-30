---
title: "Acceptance Criteria: Phase 38: pi-classifier-transport-integration"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "pi classifier transport acceptance criteria"
  - "pi transport closure gate"
  - "transport switch criteria"
  - "caller byte invariance criteria"
  - "pi transport waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration"
    last_updated_at: "2026-09-30T16:30:00Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Authored the acceptance criteria as a Planned phase, all five rows open"
    next_safe_action: "Build the phase, then mark each row from its evidence"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/scratch/context/context.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-038-pi-classifier-transport-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 38: pi-classifier-transport-integration

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration
**Level:** 2
**Status:** Planned
**Date:** 2026-09-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

The five rows mirror the five completion criteria in `goal.md`. The Verification cell names the command and the expected output. Nothing is built yet, so every row is open and no row carries observed evidence. When the build runs, `M` is `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` (proposed) and `T` its test file (proposed).

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-011 | Given the `choice` callers the design approves, When the switch is unset and a stub `jev` is first on `PATH`, Then each changed caller's stdout is byte-identical to its pre-change recording and its stub log matches the calls it made before | Run each changed caller twice against the stub `jev`, once from the pre-change state and once from the final state, then `diff` the two outputs. Expected: an empty `diff` and exit 0 both times, with the recordings under `scratch/verify/` | Unmet | - |
| AC-002 | REQ-002, REQ-003, REQ-004 | Given the built module and its tests, When the switch asks for Pi and both backends are stubbed, Then a `choice` question answers through the Pi stub and the returned value matches the shape callers read from the jev CLI's JSON today | `node --test $T`. Expected: 0 failed, with a shape test for the CLI result and a test proving a `bool` or `score` request reaches no Pi code | Unmet | - |
| AC-003 | REQ-005 | Given each gate of `spec.md` section 4, When the switch asks for Pi and that gate fails, Then the transport prints exactly one skip line naming the gate and falls back to the `jev` CLI, or stops with the CLI's own error and exit status when the CLI is also unavailable | `node --test $T` over the gate matrix, one test per gate plus the CLI-absent case. Expected: 0 failed, one skip line per gate, and no Pi call on any failure path | Unmet | - |
| AC-004 | REQ-009 | Given `cli-usage`, the `cli-pi/SKILL.md` classifier section, the catalog entry and the playbook scenario with their index rows, When `validate_document.py` runs on each changed doc, Then each is VALID and no doc claims a measurement no run printed | `python3 .skilled/skills/sk-doc/scripts/validate_document.py` on each changed doc. Expected: VALID on each, with no verdict, number or run claimed beyond what `037-pi-native-classifier-transport/scratch/live-run.stdout.txt` records | Unmet | - |
| AC-005 | REQ-008, REQ-010 | Given the 13 runtime-tree callers of `spec.md` section 3, When the phase closes, Then the follow-up list names each path and question type, no runtime-tree file changed, and `validate.sh --strict` prints `RESULT: PASSED` for this phase | `git diff --stat` on the three runtime trees, then `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration --strict`. Expected: empty runtime-tree diffs and `RESULT: PASSED` | Unmet | - |

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

This phase is Planned. All five rows are open because no module, caller change or doc exists yet, and the rows close only when the build's own recordings satisfy them.
<!-- /ANCHOR:closure -->

---

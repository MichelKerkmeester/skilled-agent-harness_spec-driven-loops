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
    last_updated_at: "2026-09-30T19:47:37Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Marked all five criteria Met from the build's records and the final-state gates"
    next_safe_action: "None. The orchestrator commits the build and the phase docs path-scoped"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/scratch/context/context.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-038-pi-classifier-transport-integration"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-09-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

The five rows mirror the five completion criteria in `goal.md`. The Verification cell names the command, the expected output and the observed result from the build's records under `scratch/verify/`. The build sits uncommitted at HEAD `c5c72d31ec`, and the orchestrator commits it path-scoped after this closure pass. `M` is `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` and `T` its test file.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-011 | Given the `choice` callers the design approves, When the switch is unset and a stub `jev` is first on `PATH`, Then each changed caller's stdout is byte-identical to its pre-change recording and its stub log matches the calls it made before | Run each changed caller twice against the stub `jev`, once from the pre-change state and once from the final state, then `diff` the two outputs. Expected: an empty `diff` and exit 0 both times, with the recordings under `scratch/verify/`. Observed: `leaf-route-replay.before.txt` and `.after.txt` (59 lines) and `score-clarify-default.before.txt` and `.after.txt` (202 lines) are byte-identical with `JEV_TRANSPORT` unset, `diff -q` printing nothing; the reviewer re-ran the HEAD source in memory and reproduced each before file byte for byte and the current tree reproduced each after file, the runs driving 16 and 91 jev calls through the changed call site (`scratch/verify/review-swe2-r1.txt`; `scratch/verify/session-evidence.md`, criterion 1) | Met | - |
| AC-002 | REQ-002, REQ-003, REQ-004 | Given the built module and its tests, When the switch asks for Pi and both backends are stubbed, Then a `choice` question answers through the Pi stub and the returned value matches the shape callers read from the jev CLI's JSON today | `node --test $T`. Expected: 0 failed, with a shape test for the CLI result and a test proving a `bool` or `score` request reaches no Pi code. Observed: `scratch/verify/transport-tests.txt` reports `tests 22`, `pass 22`, `fail 0`, including `spawn_call_switch_on_answers_through_pi`, which asserts one `classify()`, zero spawns and the CLI shape `answers.answer.{choice,probabilities,confidence}` plus the `model` line, and `spawn_call_never_reaches_pi_for_another_type`; the review records this criterion met (`scratch/verify/review-swe2-r1.txt`) | Met | - |
| AC-003 | REQ-005 | Given each gate of `spec.md` section 4, When the switch asks for Pi and that gate fails, Then the transport prints exactly one skip line naming the gate and falls back to the `jev` CLI, or stops with the CLI's own error and exit status when the CLI is also unavailable | `node --test $T` over the gate matrix, one test per gate plus the CLI-absent case. Expected: 0 failed, one skip line per gate, and no Pi call on any failure path. Observed: one row per gate in `scratch/verify/transport-tests.txt` (`spawn_call_package_gate_falls_back`, `spawn_call_model_gate_falls_back`, `spawn_call_credential_gate_falls_back` and `spawn_call_backend_refusal_falls_back`), each asserting one line and one CLI spawn, plus `spawn_call_spawn_error_is_127` for the CLI-absent stop; the review records this criterion met (`scratch/verify/review-swe2-r1.txt`) | Met | - |
| AC-004 | REQ-009 | Given `cli-jev`, the `cli-pi/SKILL.md` classifier section, the catalog entry and the playbook scenario with their index rows, When `validate_document.py` runs on each changed doc, Then each is VALID and no doc claims a measurement no run printed | `python3 .skilled/skills/sk-doc/scripts/validate_document.py` on each changed doc. Expected: VALID on each, with no verdict, number or run claimed beyond what `037-pi-native-classifier-transport/scratch/live-run.stdout.txt` records. Observed: 9 changed docs VALID, the hub playbook PASS with 8 scenarios and `warnings=0`, the catalog `cli-classifier` PASS, and no cli-classifier version at or above 1.0.0.0 (`scratch/verify/session-evidence.md`, criterion 4); the review confirms the sections match the module, the 037 numbers match the recorded run, and the playbook is stub-only (`scratch/verify/review-swe2-r1.txt`) | Met | - |
| AC-005 | REQ-008, REQ-010 | Given the 13 runtime-tree callers of `spec.md` section 3, When the phase closes, Then the follow-up list names each path and question type, no runtime-tree file changed, and `validate.sh --strict` prints `RESULT: PASSED` for this phase | `git diff --stat` on the three runtime trees, then `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration --strict`. Expected: empty runtime-tree diffs and `RESULT: PASSED`. Observed: `git diff --stat` on the three runtime trees prints nothing; the 13 callers stay listed in `spec.md` section 3 with their paths and question types, untouched (`scratch/verify/session-evidence.md`, criterion 5); `validate.sh --strict --recursive` prints `RESULT: PASSED` for every folder in this closure pass | Met | - |

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

All five rows are Met from the build's records under `scratch/verify/` and the working tree at HEAD `c5c72d31ec`. The switch-off recordings are byte-identical, the module suite is 22 of 22 with 0 failed and one row per gate, the 9 changed docs are VALID and the three runtime trees are untouched. The review printed `VERDICT: PASS` with no open P0 or P1 and four P2s recorded, P2-2 fixed with the env-switch test and P2-4 closed by this record. The orchestrator commits the build and these docs path-scoped after this pass.
<!-- /ANCHOR:closure -->

---

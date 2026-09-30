---
title: "Acceptance Criteria: Phase 37: pi-native-classifier-transport"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "pi transport acceptance criteria"
  - "pi transport closure gate"
  - "classifier census criteria"
  - "pi transport verdict criteria"
  - "pi transport waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport"
    last_updated_at: "2026-09-30T13:22:09Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Authored the planned criteria. All five rows are open pending the build"
    next_safe_action: "Build the phase, then mark each row from its observed evidence"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/context/context.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-037-pi-native-classifier-transport"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 37: pi-native-classifier-transport

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport
**Level:** 2
**Status:** Planned
**Date:** 2026-09-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

The five rows mirror the five completion criteria in `goal.md`. Every row is `Unmet` because nothing is built, and each Verification cell names the check that will decide it once the phase is built. The planned script is `S`, the proposed `.skilled/skills/cli-classifier/benchmark/pi-transport/compare-pi-transport.mjs`, and `T` its proposed test file.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the installed Pi 0.99.1, the `jev` CLI and the 019 baseline `calls.jsonl`, When the default run `node $S` runs with a stub `jev` first on `PATH`, Then it prints Pi's version, the classifier models known and available per provider, the jev CLI identity line, whether a llama.cpp router answers and the replay row count, makes no `classify()` call and writes no file | `node $S` with a stub `jev` first on `PATH`, then read the census lines and check `git status --porcelain` and the stub log. Expected: the version line, the per-provider model lines, the identity line, the llama.cpp line, the row and call counts, exit 0, and no classify call or written file. Open: nothing is built, so the run does not exist yet | Unmet | - |
| AC-002 | REQ-002, REQ-005 | Given the operator's yes for one live run, When `node $S --live --out <dir>` runs once on the real tree, Then it prints coverage, top-choice agreement, the median absolute probability difference, p95 latency per side and Pi's cost per 100 calls, and every call sits in the run's `calls.jsonl` with row id, order, wall ms, exit code, status and the full probability map | The run's stdout lines and its `calls.jsonl` in the operator-named directory. Expected: one line per metric, one `calls.jsonl` line per call, and the model identity on each side read from the run. Open: the build does not exist and the operator's yes has not been given | Unmet | - |
| AC-003 | REQ-006 | Given the keep rule fixed in `spec.md` section 4 at spec approval, When the live run completes, Then it ends in exactly one line `verdict pi-transport: <adopt\|keep-cli\|stop (<reason>)>` with its K, M, coverage, agreement, median difference, p95 pair and cost fields, and no threshold changed after the first call | The run's stdout and the same fields in `report.json`, compared against `spec.md` section 4. Expected: one verdict line, fields read from the run, thresholds unchanged. Open: no live run exists, so no verdict line exists | Unmet | - |
| AC-004 | REQ-009 | Given the built script and its tests, When `node --test $T` runs, Then it exits 0 with one happy path and one edge case for every public surface, both backends stubbed, and no test opens a socket or needs a credential | `node --test $T` from the repository root. Expected: `pass` counts for every surface with 0 failed, including the partial-map, missing-credential, unknown-model and timeout edges. Open: the script and its tests do not exist yet | Unmet | - |
| AC-005 | REQ-011, REQ-012 | Given every doc this phase changes and this phase folder, When `validate_document.py` runs on each changed doc and `validate.sh --strict` runs on the phase, Then every doc is VALID and the validator prints `RESULT: PASSED` with `Errors: 0  Warnings: 0` | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <each changed doc>` and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport --strict`. Expected: VALID on each doc, then `RESULT: PASSED`. Open: this is the planned-state pass, and the criterion closes on the built phase | Unmet | - |

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

Nothing is built, so all five rows are `Unmet` and each names the check that will decide it. The closure statement is written at closure, when the verdict line and the run records exist.
<!-- /ANCHOR:closure -->

---


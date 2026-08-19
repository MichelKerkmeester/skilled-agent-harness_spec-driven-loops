---
title: "DLR-055 -- append-mode-event.cjs"
description: "Manual validation scenario for append-mode-event.cjs in the runtime/ skill."
version: 1.4.0.4
---

# DLR-055 -- append-mode-event.cjs

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-055`.

---

## 1. OVERVIEW

Authorizes a mode event against the mode's durable authority record, appends it to the typed ledger behind a fence, returns a receipt, and refreshes the legacy projection so existing consumers keep reading the same file.

### Why This Matters

The append gateway is the sanctioned way every canonical record reaches a mode's state log. A drift in args, stdout JSON shape, exit codes, or the legacy projection refresh can break every mode that currently reads state through the projected legacy file, and can let uncounted or undeclared appends slip past the conformance check.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm append-mode-event.cjs behaves as documented and remains aligned with its implementation and tests.
- Layer partition: script entry points runtime.
- Real user request: `Validate append-mode-event.cjs and report whether the current source, script surface, and tests agree with the runtime/ contract.`
- Expected signals: stdout JSON with `"ok":true` and a receipt carrying `ledger_id`, `sequence`, `event_id`, `event_type`, `canonicalEventHash`, `recordHash`, and an `authorizationRef` with `audit_ledger_id` / `audit_sequence` / `decision_digest` / `policy_digest`; exit code 0 for an authorized, prefixed-stem event; exit code 2 when the write is refused and the refusal names the failing check; no authority record written so the mode stays on legacy authority.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature-catalog/script-entry-points/append-mode-event-script.md`.
- A scratch authority root and run directory are available outside the repository tree.

### Steps

1. Inspect `scripts/append-mode-event.cjs` for the implementation contract.
2. Inspect `tests/unit/mode-append-gateway.vitest.ts` for the primary regression coverage (its fixture pins authority at `legacy_authoritative` and asserts the legacy projection is refreshed).
3. Prepare a scratch authority root and run directory, then write an event file whose stem is prefixed (a bare stem is rejected):

   ```json
   {"stem":"deep_research.run_initialized",
    "scope":{"runId":"run-probe-1","lineageId":"lineage-probe-1"},
    "data":{"generation":1,"charterDigest":"<64 hex a>","configDigest":"<64 hex a>",
            "executorFingerprint":"<64 hex a>","replayFingerprint":"<64 hex a>",
            "maxIterations":10,"convergencePolicyVersion":"1.0.0"}}
   ```

4. Run the gateway against the scratch root:

   ```sh
   MK_DEEP_LOOP_AUTHORITY_ROOT=<tmp>/auth node .opencode/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs \
     --mode research --run-directory <tmp>/run --event-json <tmp>/ev.json
   ```

5. Capture stdout JSON, exit code, and the artifacts created under the run directory.
6. Confirm the projected legacy record and the projection watermark carry the documented fields.
7. Re-run each of the four measured negative cases and confirm none of them writes a state file or a ledger frame:
   - A bare, unprefixed stem (`"stem":"run_initialized"`) — exit 1, `reason` `"Envelope field must be a bounded non-empty string"`, code `RUNTIME_ERROR`.
   - An event file carrying neither stem nor event_type (e.g. `{"type":"event","event":"x"}`) — exit 1, `reason` `"Unrecognized event format: expected object with stem or event_type"`, code `RUNTIME_ERROR`.
   - An unresolvable mode name (`--mode not-a-real-mode`) — exit 1, `reason` `"Unsupported mode: not-a-real-mode"`, code `RUNTIME_ERROR`.
   - A mode that resolves but sits outside the frozen authority order (`--mode deep-improvement`) — exit 2, `reason` `"Mode 'deep-improvement' is not in the frozen authority order: deep-research, deep-review, deep-ai-council, deep-improvement-common, agent-improvement, model-benchmark, skill-benchmark, deep-alignment"`, code `AUTHORITY_DENIED`.
8. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

append-mode-event.cjs matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible. Specifically:

- stdout JSON carries `"ok":true` and a receipt with `ledger_id`, `sequence`, `event_id`, `event_type` `"deep-research.ledger.run-initialized"`, `canonicalEventHash`, `recordHash`, and an `authorizationRef` with `audit_ledger_id` / `audit_sequence` / `decision_digest` / `policy_digest`.
- Exit code is 0.
- Artifacts created under the run directory:
  - `deep-research-ledger/frames/0000000000000001.frame`
  - `deep-research-audit-ledger/frames/0000000000000001.frame`
  - `research/deep-research-state.jsonl` — the projected legacy file
  - `.legacy-projection-watermarks/research-state.json`
  - `locks-and-fencing-v1/<digest>/grant-journal.jsonl`
- The projected legacy record reads:

  ```json
  {"type":"config","topic":"run-probe-1","maxIterations":10,"generation":1,"timestamp":"..."}
  ```

- The watermark carries `ledger_sequence` 1, a `ledger_record_hash`, `projection_version` `"legacy-research-state@1"`, and `reducer_version` `"deep-research-state-reducer@1"`.
- No authority record is written, so the mode stays on legacy authority and this works before any cutover.
- Exit 1 and exit 2 mean different things and must not be treated interchangeably: exit 1 is a script error where the input never reached authority, exit 2 is a refusal at the authority boundary.

### Failure Modes

Two distinct exit codes carry two distinct meanings; do not conflate them.

**Exit 1 — script error, the input never reached authority.** No state file and no ledger frame are written.

- A bare, unprefixed stem (`"stem":"run_initialized"`) yields `reason` `"Envelope field must be a bounded non-empty string"`, code `RUNTIME_ERROR`.
- An event file carrying neither stem nor event_type (e.g. `{"type":"event","event":"x"}`) yields `reason` `"Unrecognized event format: expected object with stem or event_type"`, code `RUNTIME_ERROR`.
- An unresolvable mode name (`--mode not-a-real-mode`) yields `reason` `"Unsupported mode: not-a-real-mode"`, code `RUNTIME_ERROR`.

**Exit 2 — the write was refused at the authority boundary.** No state file and no ledger frame are written.

- A mode that resolves but sits outside the frozen authority order (`--mode deep-improvement`) yields `reason` `"Mode 'deep-improvement' is not in the frozen authority order: deep-research, deep-review, deep-ai-council, deep-improvement-common, agent-improvement, model-benchmark, skill-benchmark, deep-alignment"`, code `AUTHORITY_DENIED`.
- Admission denied, admission closed, or the append itself failing also exit 2.

Exit 2 is the refusal path, demonstrably: it is a halt, never a licence to write the state file directly.

- Source file no longer exposes the documented function, type, script argument, or output field.
- Matching test coverage is missing, renamed, or contradicts the documented behavior.
- Script or runtime output changes without corresponding catalog and playbook updates.
- Evidence is inferred from memory instead of captured from current source or command output.

---

## 4. SOURCE ANCHORS

### Implementation

| File | Role |
|---|---|
| `scripts/append-mode-event.cjs` | Authorizes a mode event against the mode's durable authority record, appends it to the typed ledger behind a fence, returns a receipt, and refreshes the legacy projection. |

### Validation

| File | Role |
|---|---|
| `tests/unit/mode-append-gateway.vitest.ts` | Primary regression coverage for append-mode-event.cjs (11 tests; its fixture pins authority at `legacy_authoritative` and asserts the legacy projection is refreshed). |

### Conformance

| File | Role |
|---|---|
| `scripts/check-protocol-append-sites.cjs` | Fails any workflow asset whose appends are undeclared or uncounted. |

---

## 5. SOURCE_METADATA

- Group: Script entry points
- Playbook ID: DLR-055
- Feature catalog entry: `feature-catalog/script-entry-points/append-mode-event-script.md`
- Scenario file path: `manual-testing-playbook/script-entry-points/append-mode-event-script.md`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min

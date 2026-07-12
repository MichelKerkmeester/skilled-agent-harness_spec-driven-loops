---
title: "DLR-026 -- Fan-out write-failure salvage"
description: "Validate fanout-salvage.cjs: opencode JSON text-part extraction, raw stdout fallback, missing-md recovery with state log event, and failed-marker placeholder when no content is recoverable."
version: 1.4.0.4
---

# DLR-026 -- Fan-out write-failure salvage

This document captures the validation contract, execution flow, and metadata for `DLR-026`.

---

## 1. OVERVIEW

Validates the write-failure salvage module `fanout-salvage.cjs` and the coverage-graph
per-sessionId isolation proof.

### Why This Matters

Proven necessary from the packet-122 prototype: weak CLI executors intermittently fail to
write iteration files. Without salvage, those lineages contribute nothing to the final merge.
The per-sessionId coverage-graph isolation prevents concurrent lineages from colliding in the
shared SQLite DB without any schema change.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `runSalvageSweep` recovers missing iteration files from stdout, `extractTextFromOpencodeJson` parses opencode JSON text parts correctly, and two distinct session IDs do not collide in the shared coverage-graph DB.
- Layer partition: salvage + coverage-graph isolation.
- Real user request: `Validate the fan-out salvage module and confirm the 11 unit tests pass, verifying opencode stdout parsing, iteration recovery, and per-sessionId coverage isolation.`
- Expected signals: opencode JSONL → text parts concatenated; too-short raw stdout → null; missing md + recoverable stdout → file written + `salvaged_from_stdout` event in state log; no recoverable content → `fanout_salvage_failed` placeholder; two lineage namespaces → each sees only its own coverage-graph nodes.
- Pass/fail: PASS only if all 11 tests pass with EXIT 0; FAIL otherwise.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `scripts/fanout-salvage.cjs` present.

### Steps

1. Inspect `scripts/fanout-salvage.cjs` — confirm `extractTextFromOpencodeJson` JSON parse loop, 50-char minimum for raw fallback, `STATE_LOG_BY_LOOP_TYPE` mapping.
2. Verify `runSalvageSweep` reads state log, iterates `type == 'iteration'` records, checks file existence via `statSync`.
3. `bash: cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run ../../runtime//tests/unit/fanout-salvage.vitest.ts`
4. Confirm 11 tests pass across the three groups: `extractTextFromOpencodeJson` (5), `runSalvageSweep` unit (5), coverage-graph isolation (1).

### Expected Outcome

11/11 pass. Salvage correctly recovers from opencode JSON format and raw stdout; appends `salvaged_from_stdout` event; writes placeholder when unrecoverable. Two lineage namespaces share the SQLite DB without collision.

### Failure Modes

- `extractTextFromOpencodeJson` fails to parse opencode JSONL format: all opencode lineages produce failed-marker placeholders regardless of content.
- State log scan misses iteration records: salvage never triggers even when files are missing.
- Coverage-graph rows collide across session IDs: shared DB accumulates mixed lineage data.

---

## 4. SOURCE ANCHORS

### Implementation

| File | Role |
|---|---|
| `scripts/fanout-salvage.cjs` | `extractTextFromOpencodeJson`, `runSalvageSweep`, `STATE_LOG_BY_LOOP_TYPE` |

### Validation

| File | Role |
|---|---|
| `tests/unit/fanout-salvage.vitest.ts` | 11 tests: extractText (5), salvage unit (5), coverage isolation (1) |

---

## 5. ADVERSARIAL REGRESSION

> Regression guard for a fixed deep-review finding. This scenario is adversarial: it PASSES only
> while the bug stays fixed and is phrased to FAIL the moment the regression returns.

### Adversarial Contract

- Bug under guard: a lineage that exited 0 but wrote no iteration artifact was reported as
  fulfilled instead of a salvage-miss, masking a silent fan-out failure.
- Must-stay-true invariant: an exit-0/no-artifact lineage must be treated as a salvage-miss
  (salvaged or retried, then failed if still missing), never counted as fulfilled.
- Pass/fail: PASS only if the command below exits 0 AND `tests/unit/fanout-run.vitest.ts` still
  contains the named assertions; FAIL if either is missing, renamed, skipped, or exits non-zero —
  any of which means the false-fulfilled regression has returned.

### Adversarial Steps

1. Run `cd .opencode/skills/runtime/ && PATH=/opt/homebrew/bin:$PATH npm test -- tests/unit/fanout-run.vitest.ts` and require EXIT 0.
2. Confirm `tests/unit/fanout-run.vitest.ts` asserts both `retries a salvage-miss lineage once and exits ok when the retry succeeds` AND `treats an exit-0/no-artifact lineage as salvage-miss and fails it after retry (not fulfilled)` — the latter uses an exit-0 stub (`writeNoArtifactStubBinary`) to exercise the exact bug-under-guard path, and `records exit 3 (all failed) when the only lineage exits non-zero`.
3. Record PASS only with captured EXIT 0 output; a prose-only, skipped, or absent test is FAIL.

### Regression Anchor

| File | Role |
|---|---|
| `tests/unit/fanout-run.vitest.ts` | Fails if an exit-0/no-artifact lineage is counted as fulfilled instead of a salvage-miss. |

---

## 6. SOURCE_METADATA

- Group: Fan-Out
- Playbook ID: DLR-026
- Feature catalog entry: `feature_catalog/fanout/fanout_salvage.md`
- Scenario file path: `manual_testing_playbook/fanout/fanout_salvage_recovery.md`
- Expected verdict mode: GREEN when 11/11 pass and source anchors agree
- Wall-time estimate: 5-10 min

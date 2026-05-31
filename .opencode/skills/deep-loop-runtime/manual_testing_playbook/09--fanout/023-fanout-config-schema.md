---
title: "DLR-023 -- Fan-out config schema"
description: "Validate parseFanoutConfig + expandLineages: unique-label enforcement, collision detection, count expansion, per-entry kind validation reuse, and lineageId byte-identity when absent."
---

# DLR-023 -- Fan-out config schema

This document captures the validation contract, execution flow, and metadata for `DLR-023`.

---

## 1. OVERVIEW

Validates the fan-out config schema layer added to `executor-config.ts`.

### Why This Matters

Foundation for all fan-out dispatch. If the schema drifts, all downstream pool, CLI driver,
salvage, and merge primitives receive malformed lineage descriptors.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `parseFanoutConfig` + `expandLineages` match their documented contracts and all 9 fan-out tests pass.
- Layer partition: executor config schema.
- Real user request: `Validate fan-out config schema and confirm the 9 fan-out tests pass and align with the executor-config.ts implementation.`
- Expected signals: `lineageExecutorSchema` extends `executorConfigSchema` without modifying it; `parseFanoutConfig` rejects duplicate labels and expanded-label collisions; `expandLineages` yields `label-1…label-N` for count>1; optional `lineageId` on `buildExecutorAuditRecord` is conditionally spread.
- Pass/fail: PASS if source inspection and all 9 fan-out tests agree with the implementation contract; FAIL if any fan-out test fails or `lineageId` is unconditionally included.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-loop-runtime` source tree present.
- vitest resolves from `.opencode/skills/system-spec-kit/mcp_server/`.

### Steps

1. Inspect `lib/deep-loop/executor-config.ts` — confirm `lineageExecutorSchema` at ~L294, `fanoutConfigSchema` at ~L304, `parseFanoutConfig` at ~L323, `expandLineages` at ~L381.
2. `bash: cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run ../../deep-loop-runtime/tests/unit/executor-config.vitest.ts`
3. Confirm 36 tests pass (27 original + 9 fan-out). Note the 9 fan-out test names.
4. Inspect `lib/deep-loop/executor-audit.ts` ~L491 — verify `lineageId` is spread conditionally (`...(lineageId !== undefined ? { lineageId } : {})`).

### Expected Outcome

36/36 pass. Fan-out tests cover: happy path, unique-label rejection, expanded-label collision, count expansion (label-1…label-N), per-entry kind validation reuse (cli-codex requires model). Audit records byte-identical when `lineageId` absent.

### Failure Modes

- Any fan-out test failure indicates schema drift in `executor-config.ts`.
- If `lineageId` is unconditionally included, single-executor audit records differ from pre-fan-out baseline.
- If `expandLineages` produces wrong labels (e.g. base label unchanged for count=2), downstream lineage dirs will collide.

---

## 4. SOURCE ANCHORS

### Implementation

| File | Role |
|---|---|
| `lib/deep-loop/executor-config.ts` | `lineageExecutorSchema`, `fanoutConfigSchema`, `parseFanoutConfig`, `expandLineages` |
| `lib/deep-loop/executor-audit.ts` | Optional `lineageId` on `RunAuditedExecutorCommandInput` and `buildExecutorAuditRecord` |

### Validation

| File | Role |
|---|---|
| `tests/unit/executor-config.vitest.ts` | 36 tests total (27 original + 9 fan-out) |

---

## 5. SOURCE_METADATA

- Group: Fan-Out
- Playbook ID: DLR-023
- Feature catalog entry: `feature_catalog/09--fanout/023-fanout-config-schema.md`
- Scenario file path: `manual_testing_playbook/09--fanout/023-fanout-config-schema.md`
- Expected verdict mode: GREEN when 36/36 pass and source anchors agree
- Wall-time estimate: 5-10 min

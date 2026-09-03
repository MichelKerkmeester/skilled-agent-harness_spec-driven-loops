---
title: "DAC-026 -- Council graph MCP surface retired"
description: "This scenario validates that no MCP tool family carries council graph operations and that they route through runtime/ --loop-type council."
version: 2.3.0.8
---

# DAC-026 -- Council graph MCP surface retired

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-026`.

---

## 1. OVERVIEW

This scenario validates the post-migration boundary: no MCP tool family exposes council graph operations, and council graph writes/queries/status/convergence run through `runtime/` CLI scripts with `--loop-type council`.

### Why This Matters

ADR-001 still rejects reusing the research/review graph semantics for council state. The migration keeps that semantic boundary but moves ownership out of any MCP server: council state is a runtime-owned derived SQLite projection, rebuilt from `ai-council/**` artifacts by the replay helper or direct runtime CLI calls.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-026` and confirm the expected signals without contradictory evidence.

- Objective: Verify the council graph MCP surface is retired and runtime CLI council support is present.
- Real user request: Confirm council graph operations no longer consume MCP tool slots.
- Prompt: `As a council-graph integration validator, assert that no council graph tool is exposed on any MCP surface, then run or inspect the runtime/ council CLI scripts for upsert, query, status, and convergence support.`
- Expected execution process: Grep the repository for the escaped council graph tool-name pattern, then run runtime council script coverage.
- Expected signals: no source file declares a tool matching `council[_]graph_(upsert|query|status|convergence)`; runtime council integration tests pass.
- Desired user-visible outcome: The user sees that council graph behavior remains available with no MCP surface behind it.
- Pass/fail: PASS if no council graph tool declaration exists and runtime CLI coverage passes; FAIL if a tool declaration remains or runtime council CLI support regresses.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Grep the repository for `council[_]graph_(upsert|query|status|convergence)` outside historical evidence.
2. Run runtime council integration tests.

### Prompt

`As a council-graph integration validator, assert that no council graph tool is exposed on any MCP surface, then run or inspect the runtime/ council CLI scripts for upsert, query, status, and convergence support.`

### Commands

1. `bash: rg --no-config -n --glob '!**/z_archive/**' --glob '!**/node_modules/**' 'council[_]graph_(upsert|query|status|convergence)' .opencode`
2. `bash: cd .opencode/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/integration/council-graph-script.vitest.ts`

### Expected

Step 1 returns no hits outside historical run evidence. Step 2 exits 0.

### Evidence

Capture grep output and the runtime council integration test result.

### Pass / Fail

- **Pass**: No council graph tool declaration, runtime council script tests pass.
- **Fail**: Any council graph tool declaration remains, or runtime council CLI coverage fails.

### Failure Triage

If a council graph tool declaration remains, inspect the declaring file directly from the grep output. If runtime CLI coverage fails, inspect `runtime//scripts/{upsert,query,status,convergence}.cjs` and `lib/council/**`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-026 | Council graph MCP surface retired | Verify MCP removal plus runtime CLI replacement | `As a council-graph integration validator, assert that no council graph tool is exposed on any MCP surface, then run or inspect the runtime/ council CLI scripts for upsert, query, status, and convergence support.` | grep for council graph tool declarations -> run runtime council integration test | No council graph tool declarations, runtime council tests pass | Grep output + Vitest result | PASS if retired from MCP and covered in runtime CLI | Inspect the declaring file or the runtime scripts |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `feature-catalog/` | Feature catalog mirror |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs` | Council node/edge projection writes |
| `.opencode/skills/system-deep-loop/runtime/scripts/query.cjs` | Council graph query modes |
| `.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-script.vitest.ts` | Runtime council CLI coverage |

---

## 5. SOURCE METADATA

- Group: COUNCIL GRAPH INTEGRATION
- Playbook ID: DAC-026
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `council-graph-integration/council-graph-tools-registered-separately-from-deep-loop.md`

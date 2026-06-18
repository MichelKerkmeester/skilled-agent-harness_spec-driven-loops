---
title: "Deep Review Report — 012-015 Integrated Cross-Packet Audit"
description: "10-iteration cli-codex (gpt-5.5 high fast) audit of the 012-015 integrated implementation + 28 catalog/playbook updates as a cohesive unit. Per-packet reviews already passed individually; this loop catches cross-cutting concerns. Verdict: CONDITIONAL — 0 P0 / 2 P1 / 7 P2; 3 remediation packets recommended (A required, B/C P2)."
created: 2026-04-28T08:00:00Z
loop_session_id: dr-rev-20260427T203106Z-012-015-integrated
loop_iterations: 10
loop_stop_reason: maxIterationsReached
loop_executor: cli-codex/gpt-5.5/high/fast
verdict: CONDITIONAL
findings_total: 9
p0: 0
p1: 2
p2: 7
---

# Deep Review Report — 012-015 Integrated Cross-Packet Audit

## 1. Executive Summary

A 10-iteration cli-codex (gpt-5.5 high fast) audit of the 012-015 integrated implementation + 28 catalog/playbook updates surfaced **9 cross-cutting findings (0 P0 / 2 P1 / 7 P2)** that individual per-packet reviews could not catch. The audit converged at iteration 7 (3 zero-finding stabilization passes) with no contradictions; iter-10 is the final synthesis-ready handoff.

**Verdict: CONDITIONAL.** No P0 surfaced. Two P1 findings reflect operator-facing degraded-state regressions in the 014/015 surfaces — `code_graph_context` and `code_graph_status` lose canonical readiness/trust metadata when underlying calls crash. These are genuine integration gaps, not cosmetic doc drift.

**3 remediation packets recommended:**

| Packet | Priority | Scope | Includes |
|--------|----------|-------|----------|
| **A** Degraded-readiness envelope parity | P1 (required) | production + tests | F-001, F-003, supporting F-002/F-006/F-008/F-009 |
| **B** cli-copilot dispatch test parity | P2 | tests/artifact replay | F-004 |
| **C** Catalog/playbook degraded alignment | P2 | docs (after A) | F-005, F-007, doc parts of F-008 |

**Loop health**: 10/10 iterations completed cleanly, 0 failures, 31 min wall-clock. `newFindingsRatio` decay 0.6 → 0.18 → 0 (clean monotonic, converged). Adversarial self-check passed: no P0 evidence found via authority-bypass / data-corruption / unconditional-dispatch lines.

---

## 2. Methodology

| Field | Value |
|-------|-------|
| Workflow | `/deep:start-review-loop:auto` |
| Executor | cli-codex (gpt-5.5, reasoning_effort=high, service_tier=fast, timeout=900s/iter) |
| Iterations | 10/10 (maxIterationsReached, NOT premature; convergence held from iter-7) |
| Convergence threshold | 0.05 (default) |
| Wall-clock | 31 min (2026-04-27T20:34:00Z → 21:05:25Z) |
| Review dimensions | correctness, security, traceability, maintainability |
| Sources read | 25+ files across mcp_server/, .opencode/commands/spec_kit/assets/, and the 4 packet trees |

**newFindingsRatio trajectory**: 0.6 → (iter-2 missing) → 0.2 → 0.18 → (iter-5/6 missing) → 0 → 0 → 0 → 0. Iters 7-10 are stabilization passes (zero new findings; validation, prioritization, synthesis). Pre-iter-7 the loop discovered all 9 findings.

---

## 3. P1 Findings (Required Remediation — Packet A)

### F-001 [P1] `code_graph_context` drops structured degraded metadata after a readiness crash

**Evidence**:
- `mcp_server/code_graph/handlers/context.ts:57-59` — `shouldBlockReadPath()` only blocks `readiness.action === 'full_scan'`
- `mcp_server/code_graph/handlers/context.ts:132-143` — readiness exception is converted to `freshness: 'error'` and `action: 'none'`
- `mcp_server/code_graph/handlers/context.ts:253` — falls through to `buildContext()`
- `mcp_server/code_graph/handlers/context.ts:308-317` — if `buildContext()` fails, handler returns generic `status: 'error'` / `code_graph_context failed`

**Risk**: When the graph readiness probe throws, `code_graph_context` silently attempts graph expansion via `buildContext()`. If that downstream path also fails, the handler returns a generic error envelope WITHOUT the structured `readiness`, `canonicalReadiness`, `trustState`, or `graphAnswersOmitted` fields that callers expect for degraded-state handling. Operator-facing observability degrades; downstream callers can't distinguish "graph unavailable" from "internal handler bug."

**Recommended remediation (Packet A)**: Treat `freshness === 'error'` as a degraded/blocking read path **before** `buildContext()`, preserving:
- `readiness` (the snapshot)
- `canonicalReadiness` (the canonical readiness contract projection)
- `trustState`
- `graphAnswersOmitted: true`
- An `rg` recovery signal (matching the query handler's fallbackDecision contract)

### F-003 [P1] `code_graph_status` can lose packet 014's unavailable-readiness envelope before the snapshot helper runs

**Evidence**:
- `mcp_server/code_graph/handlers/status.ts:161-169` — `handleCodeGraphStatus()` reads `graphDb.getStats()` BEFORE `getGraphReadinessSnapshot()`
- `mcp_server/code_graph/handlers/status.ts:239-248` — catch path returns only `Code graph not initialized: ...` without preserving the readiness snapshot

**Risk**: If `graphDb.getStats()` throws (e.g., DB file corrupted or locked), `code_graph_status` errors out before the new readiness snapshot helper runs — defeating packet 014's whole point. Operators see a generic init error instead of the action-level `readiness.action: full_scan|selective_reindex|none` surface.

**Recommended remediation (Packet A)**: Move the read-only snapshot ahead of `graphDb.getStats()`, OR isolate stats failure into a try/catch so unavailable readiness still surfaces. Either approach preserves the 014 contract under degraded DB state.

---

## 4. P2 Findings

### F-002 [P2] Status crash action remains weaker than query fallback taxonomy

**Evidence**: `mcp_server/code_graph/lib/ensure-ready.ts:516` — readiness crashes mapped to `action: 'none'` while `code_graph_query` reports the richer `nextTool: 'rg'` fallback decision.

**Recommended remediation**: Fold into Packet A by adding an explicit crash recovery signal (e.g., `action: 'rg_fallback'`) or document the handler-specific equivalent.

### F-004 [P2] cli-copilot dispatch regression test models legacy command-string shape

**Evidence**:
- `mcp_server/tests/deep-loop/cli-matrix.vitest.ts:17-20` — claims to mirror YAML
- `mcp_server/tests/deep-loop/cli-matrix.vitest.ts:40-56` — but its cli-copilot branch still builds `-p "$(cat ...)"` / `resolveCopilotPromptArg()` strings instead of the `built.argv` + `promptFileBody` flow that 012 introduced

**Risk**: Test passes today but tests the wrong shape. A future refactor of `buildCopilotPromptArg` could silently break the dispatch contract; this test wouldn't catch it.

**Recommended remediation (Packet B)**: Update the cli-copilot matrix test to model `built.argv`, `promptFileBody`, and `@PROMPT_PATH` behavior as 012 actually ships them.

### F-005 [P2] Catalog pages promise `fallbackDecision` on `code_graph_context` before code does

**Evidence**: `feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md:15-23` — current text says query/context readiness-crash states return `nextTool:"rg"`, but `code_graph_context` doesn't currently emit fallbackDecision; only `code_graph_query` does.

**Recommended remediation (Packet C, after Packet A)**: Once Packet A decides whether to add `fallbackDecision` to context (or use a different field), update catalog text to match shipped behavior.

### F-006 [P2] Readiness playbooks don't exercise the DB-unavailable ordering gap

**Recommended remediation**: Fold into Packet A test scope via a status stats-before-snapshot test.

### F-007 [P2] CocoIndex telemetry playbook describes `rankingSignals` as an object

**Evidence**:
- `manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:133-144` — says `rankingSignals (object)`
- `mcp_server/schemas/tool-input-schemas.ts:482-492` — shipped schema accepts `rankingSignals: z.array(z.string())`

**Risk**: Operator following the playbook constructs the wrong shape; test would fail validation.

---
title: "070 -- Dead code removal"
description: "This scenario validates Dead code removal for `070`. It focuses on Confirm dead path elimination."
version: 3.6.0.16
---

# 070 -- Dead code removal

## 1. OVERVIEW

This scenario validates Dead code removal for `070`. It focuses on Confirm documented removals remain absent.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm documented removals remain absent.
- Real user request: `Please validate Dead code removal against isShadowScoringEnabled and tell me whether the expected signals are present: Removed hybrid-search branches absent; retired helpers absent; dead module state and exports absent; representative flows execute without missing-reference errors.`
- Prompt: `Validate Dead code removal against isShadowScoringEnabled and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Removed hybrid-search branches absent; retired helpers absent; dead module state and exports absent; representative flows execute without missing-reference errors
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the documented removals have zero live references and representative flows execute cleanly

---

## 3. TEST EXECUTION

### Prompt

```
Validate Dead code removal against isShadowScoringEnabled and report cited pass/fail evidence.
```

### Commands

1. Search for removed branch helpers and symbols: `isShadowScoringEnabled`, `isRsfEnabled`, `stmtCache`, `lastComputedAt`, `activeProvider`, `flushCount`, `computeCausalDepth`, `getSubgraphWeights`, `RECOVERY_HALF_LIFE_DAYS`, `logCoActivationEvent`
2. Search for removed working-memory config fields: `decayInterval`, `attentionDecayRate`, `minAttentionScore`
3. Run representative flows
4. Confirm no missing-reference errors

### Expected

Removed hybrid-search branches absent; retired helpers absent; dead module state and exports absent; representative flows execute without missing-reference errors

### Evidence

Command: `rg -n "isShadowScoringEnabled|isRsfEnabled|stmtCache|lastComputedAt|activeProvider|flushCount|computeCausalDepth|getSubgraphWeights|RECOVERY_HALF_LIFE_DAYS|logCoActivationEvent" .opencode/skills/system-spec-kit/mcp_server .opencode/skills/system-spec-kit/scripts .opencode/skills/system-spec-kit/shared --glob '!**/node_modules/**' --glob '!**/dist/**'`

```text
.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:725:      const activeProvider = manifest.backend === 'ollama'
.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:730:      setActiveEmbedder(jobDb, initialJob.toName, initialJob.toDim, activeProvider);
```

Command: `rg -n "decayInterval|attentionDecayRate|minAttentionScore" .opencode/skills/system-spec-kit/mcp_server .opencode/skills/system-spec-kit/scripts .opencode/skills/system-spec-kit/shared --glob '!**/node_modules/**' --glob '!**/dist/**'`

```text
(no output)
```

Command: `npx vitest run tests/dead-code-regression.vitest.ts tests/memory-crud-extended.vitest.ts tests/intent-routing.vitest.ts`

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  3 passed (3)
      Tests  70 passed | 23 skipped (93)
   Start at  23:01:26
   Duration  1.63s (transform 802ms, setup 20ms, import 266ms, tests 1.15s, environment 0ms)
```

MCP representative flow: `memory_quick_search({ query: "SPECKIT search pipeline flags active inert retired RSF shadow scoring", limit: 5 })`

```text
summary: Found 5 memories
data.searchType: hybrid
data.count: 5
data.pipelineMetadata.stage1.searchType: hybrid
data.pipelineMetadata.stage1.candidateCount: 19
data.pipelineMetadata.stage2.sessionBoostApplied: off
data.pipelineMetadata.stage2.causalBoostApplied: applied
data.pipelineMetadata.stage2.durationMs: 817
data.pipelineMetadata.timing.total: 1498
data.fallbackState: ok
```

### Pass / Fail

FAIL

Reason: `activeProvider` still has live references in `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`, so the expected zero-live-reference condition did not hold; representative flows executed without missing-reference errors.

### Failure Triage

Re-check the dead-code audit list against the codebase; inspect string-based references; run targeted regression suites for the affected subsystems

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/dead-code-removal.md](../../feature_catalog/16--tooling-and-scripts/dead-code-removal.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 070
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/dead-code-removal.md`

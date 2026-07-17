---
title: "135 -- Grep traceability for feature catalog code references"
description: "This scenario validates Grep traceability for feature catalog code references for `135`. It focuses on Verify `grep -r \"// Feature catalog: <feature>\" mcp_server/` returns handler + lib hits."
version: 3.6.0.16
id: tooling-and-scripts-grep-traceability-for-feature-catalog-code-references
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 135 -- Grep traceability for feature catalog code references

## 1. OVERVIEW

This scenario validates Grep traceability for feature catalog code references for `135`. It focuses on Verify `grep -r "// Feature catalog: <feature>" mcp_server/` returns handler + lib hits.

---

## 2. SCENARIO CONTRACT


- Objective: Verify `grep -r "// Feature catalog: <feature>" mcp_server/` returns handler + lib hits.
- Real user request: `Please validate Grep traceability for feature catalog code references against grep -r "// Feature catalog: <feature>" .opencode/skills/system-spec-kit/mcp_server/ and tell me whether the expected signals are present: Each feature grep returns at least 2 hits spanning handlers and lib layers; all referenced files exist.`
- Prompt: `Validate Grep traceability for feature catalog code references against grep -r "// Feature catalog: <feature>" .opencode/skills/system-spec-kit/mcp_server/ and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Each feature grep returns at least 2 hits spanning handlers and lib layers; all referenced files exist
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all 3 features return multi-layer hits with no orphaned file references

---

## 3. TEST EXECUTION

### Prompt

```
Validate Grep traceability for feature catalog code references against grep -r "// Feature catalog: <feature>" .opencode/skills/system-spec-kit/mcp_server/ and report cited pass/fail evidence.
```

### Commands

1. Pick 3 features with known multi-layer implementations (e.g., "Hybrid search pipeline", "Classification-based decay", "Prediction-error save arbitration")
2. For each: `grep -r "// Feature catalog: <feature>" .opencode/skills/system-spec-kit/mcp_server/`
3. Verify each grep returns hits in both `handlers/` and `lib/` directories
4. Verify all returned files exist and contain the annotation

### Expected

Each feature grep returns at least 2 hits spanning handlers and lib layers; all referenced files exist

### Evidence

Commands run from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

Command: `grep -r "// Feature catalog: Hybrid search pipeline" ".opencode/skills/system-spec-kit/mcp_server/"`

```text
grep: .opencode/skills/system-spec-kit/mcp_server/database/.spec-memory-owner.json: No such file or directory
.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/embeddings.js:// Feature catalog: Hybrid search pipeline
.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/pipeline/stage3-rerank.js:// Feature catalog: Hybrid search pipeline
.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/pipeline/stage1-candidate-gen.js:// Feature catalog: Hybrid search pipeline
.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/vector-index-store.js:// Feature catalog: Hybrid search pipeline
.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/vector-index-mutations.js:// Feature catalog: Hybrid search pipeline
.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/vector-index-queries.js:// Feature catalog: Hybrid search pipeline
.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/vector-index-impl.js:// Feature catalog: Hybrid search pipeline
.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/vector-index.js:// Feature catalog: Hybrid search pipeline
.opencode/skills/system-spec-kit/mcp_server/lib/providers/embeddings.ts:// Feature catalog: Hybrid search pipeline
.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:// Feature catalog: Hybrid search pipeline
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:// Feature catalog: Hybrid search pipeline
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:// Feature catalog: Hybrid search pipeline
.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:// Feature catalog: Hybrid search pipeline
.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:// Feature catalog: Hybrid search pipeline
.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index.ts:// Feature catalog: Hybrid search pipeline
.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:// Feature catalog: Hybrid search pipeline
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:// Feature catalog: Hybrid search pipeline
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:// Feature catalog: Hybrid search pipeline
```

Line-numbered verification output:

```text
Found 10 matches
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:
  Line 125: // Feature catalog: Hybrid search pipeline

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:
  Line 91: // Feature catalog: Hybrid search pipeline

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:
  Line 4: // Feature catalog: Hybrid search pipeline

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:
  Line 4: // Feature catalog: Hybrid search pipeline

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:
  Line 66: // Feature catalog: Hybrid search pipeline

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:
  Line 40: // Feature catalog: Hybrid search pipeline

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:
  Line 4: // Feature catalog: Hybrid search pipeline

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/providers/embeddings.ts:
  Line 4: // Feature catalog: Hybrid search pipeline

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:
  Line 4: // Feature catalog: Hybrid search pipeline

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index.ts:
  Line 4: // Feature catalog: Hybrid search pipeline
```

Command: `grep -r "// Feature catalog: Classification-based decay" ".opencode/skills/system-spec-kit/mcp_server/"`

```text
grep: .opencode/skills/system-spec-kit/mcp_server/database/.spec-memory-owner.json: No such file or directory
.opencode/skills/system-spec-kit/mcp_server/dist/lib/cognitive/tier-classifier.js:// Feature catalog: Classification-based decay
.opencode/skills/system-spec-kit/mcp_server/dist/lib/cognitive/fsrs-scheduler.js:// Feature catalog: Classification-based decay
.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/fsrs.js:// Feature catalog: Classification-based decay
.opencode/skills/system-spec-kit/mcp_server/dist/lib/scoring/importance-tiers.js:// Feature catalog: Classification-based decay
.opencode/skills/system-spec-kit/mcp_server/dist/handlers/memory-triggers.js:// Feature catalog: Classification-based decay
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:// Feature catalog: Classification-based decay
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:// Feature catalog: Classification-based decay
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:// Feature catalog: Classification-based decay
.opencode/skills/system-spec-kit/mcp_server/lib/config/memory-types.ts:// Feature catalog: Classification-based decay
.opencode/skills/system-spec-kit/mcp_server/lib/search/fsrs.ts:// Feature catalog: Classification-based decay
.opencode/skills/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts:// Feature catalog: Classification-based decay
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:// Feature catalog: Classification-based decay
```

Line-numbered verification output:

```text
Found 7 matches
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:
  Line 9: // Feature catalog: Classification-based decay

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts:
  Line 4: // Feature catalog: Classification-based decay

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/config/memory-types.ts:
  Line 16: // Feature catalog: Classification-based decay

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:
  Line 4: // Feature catalog: Classification-based decay

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:
  Line 4: // Feature catalog: Classification-based decay

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:
  Line 4: // Feature catalog: Classification-based decay

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/fsrs.ts:
  Line 4: // Feature catalog: Classification-based decay
```

Command: `grep -r "// Feature catalog: Prediction-error save arbitration" ".opencode/skills/system-spec-kit/mcp_server/"`

```text
grep: .opencode/skills/system-spec-kit/mcp_server/database/.spec-memory-owner.json: No such file or directory
.opencode/skills/system-spec-kit/mcp_server/dist/handlers/pe-gating.js:// Feature catalog: Prediction-error save arbitration
.opencode/skills/system-spec-kit/mcp_server/dist/handlers/memory-save.js:// Feature catalog: Prediction-error save arbitration
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:// Feature catalog: Prediction-error save arbitration
.opencode/skills/system-spec-kit/mcp_server/handlers/pe-gating.ts:// Feature catalog: Prediction-error save arbitration
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:// Feature catalog: Prediction-error save arbitration
.opencode/skills/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:// Feature catalog: Prediction-error save arbitration
.opencode/skills/system-spec-kit/mcp_server/handlers/save/create-record.ts:// Feature catalog: Prediction-error save arbitration
```

Line-numbered verification output:

```text
Found 5 matches
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/handlers/save/create-record.ts:
  Line 37: // Feature catalog: Prediction-error save arbitration

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:
  Line 211: // Feature catalog: Prediction-error save arbitration

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:
  Line 19: // Feature catalog: Prediction-error save arbitration

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/handlers/pe-gating.ts:
  Line 27: // Feature catalog: Prediction-error save arbitration

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:
  Line 4: // Feature catalog: Prediction-error save arbitration
```

Existence check for the path named by each `grep -r` error:

```text
ls: .opencode/skills/system-spec-kit/mcp_server/database/.spec-memory-owner.json: No such file or directory
```

### Pass / Fail

- **FAIL**: The three selected feature greps returned multi-layer handler/lib annotation hits, but each required `grep -r` command also emitted `grep: .opencode/skills/system-spec-kit/mcp_server/database/.spec-memory-owner.json: No such file or directory`, and `ls -l ".opencode/skills/system-spec-kit/mcp_server/database/.spec-memory-owner.json"` confirmed the path is missing.
- **Pass**: all 3 features return multi-layer hits with no orphaned file references
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check annotation placement after MODULE: header → Verify feature name spelling matches catalog H3 heading exactly

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling_and_scripts/feature_catalog_code_references.md](../../feature_catalog/tooling_and_scripts/feature_catalog_code_references.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 135
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/grep_traceability_for_feature_catalog_code_references.md`

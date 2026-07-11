---
title: "052 -- Template anchor optimization (S2)"
description: "This scenario validates Template anchor optimization (S2) for `052`. It focuses on Confirm anchor metadata enrichment."
audited_post_018: true
version: 3.6.0.16
---

# 052 -- Template anchor optimization (S2)

## 1. OVERVIEW

This scenario validates Template anchor optimization (S2) for `052`. It focuses on Confirm anchor metadata enrichment.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm anchor metadata enrichment.
- Real user request: `Please validate Template anchor optimization (S2) against the documented validation surface and tell me whether the expected signals are present: Anchor metadata enriched in pipeline; anchor tags visible in query metadata; no score mutation from anchor presence.`
- Prompt: `Validate template anchor optimization (S2) against the documented validation surface and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Anchor metadata enriched in pipeline; anchor tags visible in query metadata; no score mutation from anchor presence
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Anchor metadata present; scores identical with/without anchor enrichment; FAIL: Anchor metadata missing or score mutation detected

---

## 3. TEST EXECUTION

### Prompt

```
Validate template anchor optimization (S2) against the documented validation surface and return pass/fail with cited evidence.
```

### Commands

1. Save anchored memory
2. query pipeline metadata
3. verify no score mutation

### Expected

Anchor metadata enriched in pipeline; anchor tags visible in query metadata; no score mutation from anchor presence

### Evidence

- Scenario file read in full from `.opencode/skills/system-spec-kit/manual_testing_playbook/pipeline-architecture/template-anchor-optimization-s2.md`.
- Observed Commands section exactly:
  ```
  1. Save anchored memory
  2. query pipeline metadata
  3. verify no score mutation
  ```
- Observed Expected section exactly:
  ```
  Anchor metadata enriched in pipeline; anchor tags visible in query metadata; no score mutation from anchor presence
  ```
- Referenced root playbook global preconditions observed:
  ```
  1. Working directory is project root.
  2. Feature summary files are accessible.
  3. Spec/memory commands are available in the runtime.
  4. Manual execution logging is enabled (terminal transcript capture).
  5. Destructive scenarios (`EX-008`, `EX-009`, `EX-018`, `EX-021`) MUST run only in a disposable sandbox spec folder (for example `specs/test-sandbox`), never in active project folders.
  6. Before each destructive scenario, create and record a named checkpoint for rollback evidence.
  ```
- Referenced feature catalog read from `.opencode/skills/system-spec-kit/feature_catalog/pipeline-architecture/template-anchor-optimization.md`; observed validation contract:
  ```
  Anchor markers in memory files (structured sections like `<!-- ANCHOR:state -->`) are parsed and attached as metadata to search pipeline rows. The module extracts anchor IDs and derives semantic types from structured IDs (for example, `DECISION-pipeline-003` yields type `DECISION`). Simple IDs like `summary` pass through as-is.

  This is a pure annotation step wired into Stage 2 as step 8. It never modifies any score fields. The enrichment makes Stage 3 (rerank) and Stage 4 (filter) anchor-aware without score side-effects. No feature flag. Always active.
  ```
- BLOCKED before executing command 1 because the scenario requires `Save anchored memory`, which is a mutation outside the single allowed write path for this run. The active run constraint was: `Do NOT modify, create, or delete any file OTHER than the single scenario file named below.` The only allowed write path was `.opencode/skills/system-spec-kit/manual_testing_playbook/pipeline-architecture/template-anchor-optimization-s2.md`.

### Pass / Fail

- **BLOCKED**: Command 1 (`Save anchored memory`) requires a real memory/spec mutation, but this run allowed writes only to `.opencode/skills/system-spec-kit/manual_testing_playbook/pipeline-architecture/template-anchor-optimization-s2.md`; therefore the anchored-memory save, pipeline metadata query against that saved memory, and score comparison could not be truthfully executed under the stated constraints.

### Failure Triage

Verify anchor metadata injection point → Check score isolation → Inspect metadata enrichment pipeline

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [pipeline-architecture/template-anchor-optimization.md](../../feature_catalog/pipeline-architecture/template-anchor-optimization.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 052
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `pipeline-architecture/template-anchor-optimization-s2.md`

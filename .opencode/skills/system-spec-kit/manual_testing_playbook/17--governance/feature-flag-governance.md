---
title: "063 -- Feature flag governance"
description: "This scenario validates Feature flag governance for `063`. It focuses on Confirm governance policy conformance."
audited_post_018: true
version: 3.6.0.17
---

# 063 -- Feature flag governance

## 1. OVERVIEW

This scenario validates Feature flag governance for `063`. It focuses on Confirm governance policy conformance.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm governance policy conformance.
- Real user request: `Please validate Feature flag governance against the documented validation surface and tell me whether the expected signals are present: All flags enumerated with default state, governing env var, gated automation, and added-in version; no undocumented flags found.`
- Prompt: `Validate Feature flag governance against the documented validation surface and report whether all expected governance signals are present.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All flags enumerated with default state, governing env var, gated automation, and added-in version (the documented governance columns); no undocumented flags found
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all flags carry the documented governance columns and no undocumented flag exists in code

---

## 3. TEST EXECUTION

### Prompt

```
Validate Feature flag governance against the documented validation surface and report whether all expected governance signals are present.
```

### Commands

1. enumerate flags
2. verify each flag row carries default state, env var, gated automation, and added-in version
3. record any flag present in code but missing from the table

### Expected

All flags enumerated with the documented governance columns (default, env, automation, added-in version); no undocumented flags found

### Evidence

Observed command transcript:

```text
Feature Flags Reference Table rows: 92
Documented governing env vars in table: 92
Source file scanned: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts
Unique SPECKIT_* tokens in source: 91
Rows missing required columns or env var: 0
Source SPECKIT_* tokens missing from table: 17
SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION
SPECKIT_CITE_WITH_CAVEAT
SPECKIT_CONFIDENCE_CALIBRATION
SPECKIT_CONFIDENCE_CALIBRATION_MODEL
SPECKIT_DERIVED_ID_PROVENANCE
SPECKIT_DETERMINISTIC_MULTIHOP
SPECKIT_EVIDENCE_GAP_VERDICT
SPECKIT_LANE_CHAMPION_BACKFILL
SPECKIT_LEXICAL_GROUNDING
SPECKIT_NOISE_FLOOR_SUBTRACTION
SPECKIT_POST_INSERT_ENRICHMENT_SYNC
SPECKIT_RELEVANCE_AWARE_GAP
SPECKIT_RETENTION_FORGETTING
SPECKIT_RETRIEVAL_CLASS_ROUTING
SPECKIT_ROLLOUT_PERCENT
SPECKIT_TRUE_CITATION_EMITTER
SPECKIT_WORLD_SUMMARY_PRELUDE
Table SPECKIT_* env vars not present in source: 18
SPECKIT_AC_COVERAGE
SPECKIT_AC_COVERAGE_ENFORCE
SPECKIT_AC_TRACEABILITY_TEMPLATE
SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT
SPECKIT_COMPLETION_FRESHNESS
SPECKIT_COMPLETION_FRESHNESS_ENFORCE
SPECKIT_FEEDBACK_RETENTION_LEARNING
SPECKIT_FEEDBACK_RETENTION_MODE
SPECKIT_MEMORY_IDEMPOTENCY
SPECKIT_SEMANTIC_TRIGGERS
SPECKIT_SEMANTIC_TRIGGERS_MODE
SPECKIT_SEMANTIC_TRIGGER_CACHE_TTL_MS
SPECKIT_SEMANTIC_TRIGGER_MARGIN
SPECKIT_SEMANTIC_TRIGGER_MAX
SPECKIT_SEMANTIC_TRIGGER_THRESHOLD
SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE
SPECKIT_SOFT_DELETE_TOMBSTONES
SPECKIT_TRIGGER_EMBEDDING_BACKFILL
```

The `ENV_REFERENCE.md` feature-flags table has the expected governance columns for each documented row, but the source-vs-table comparison found 17 `SPECKIT_*` tokens in `lib/search/search-flags.ts` that are missing from the feature-flags table.

### Pass / Fail

- **FAIL**: The documented rows carry the required governance columns, but the expected `no undocumented flags found` signal did not hold because 17 source flags are missing from the feature-flags table.

### Failure Triage

Verify flag enumeration covers all source files; diff code-declared flags against the ENV_REFERENCE feature-flags table and patch whichever side drifted

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [17--governance/feature-flag-governance.md](../../feature_catalog/17--governance/feature-flag-governance.md)

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 063
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `17--governance/feature-flag-governance.md`

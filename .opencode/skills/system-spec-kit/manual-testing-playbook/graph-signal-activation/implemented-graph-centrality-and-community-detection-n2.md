---
title: "091 -- Implemented: graph centrality and community detection (N2)"
description: "This scenario validates Implemented: graph centrality and community detection (N2) for `091`. It focuses on Confirm deferred->implemented status."
audited_post_018: true
version: 3.6.0.18
id: graph-signal-activation-implemented-graph-centrality-and-community-detection-n2
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 091 -- Implemented: graph centrality and community detection (N2)

## 1. OVERVIEW

This scenario validates Implemented: graph centrality and community detection (N2) for `091`. It focuses on Confirm deferred->implemented status.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm deferred->implemented status.
- Real user request: `Please validate Implemented: graph centrality and community detection (N2) against the documented validation surface and tell me whether the expected signals are present: N2 tables exist with data; feature flags show active status; graph queries include centrality/community contributions in scores.`
- Prompt: `Validate graph centrality and community detection and cite N2 tables, active flags, and score contribution evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: N2 tables exist with data; feature flags show active status; graph queries include centrality/community contributions in scores
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if N2 tables are populated, flags are active, and graph queries include centrality/community scoring. NOTE: ANCHOR-as-node is PLANNED/DEFERRED (archival deprecation record removed) and is excluded from pass criteria. This scenario passes based on the implemented N2 features (momentum, depth, community) alone.

---

## 3. TEST EXECUTION

### Prompt

```
Validate graph centrality and community detection and cite N2 tables, active flags, and score contribution evidence.
```

### Commands

1. inspect tables/flags
2. run graph queries
3. verify N2 contributions

### Expected

N2 tables exist with data; feature flags show active status; graph queries include centrality/community contributions in scores

### Evidence

Table inspection + flag status + graph query output showing N2 score contributions

### Pass / Fail

- **Pass**: N2 tables are populated, flags are active, and graph queries include centrality/community scoring. ANCHOR-as-node is DEFERRED/SKIPPED (archival deprecation record removed). Test actively guards against edge creation; this aspect must NOT be tested as a current requirement.
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify N2 migration completed; check feature flag state; inspect graph scoring pipeline for N2 channel integration

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [graph-signal-activation/community-detection.md](../../feature-catalog/graph-signal-activation/community-detection.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 091
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `graph-signal-activation/implemented-graph-centrality-and-community-detection-n2.md`

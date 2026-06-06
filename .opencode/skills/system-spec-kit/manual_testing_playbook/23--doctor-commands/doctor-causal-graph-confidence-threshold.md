---
title: "DOC-329 -- Doctor causal graph confidence threshold"
description: "This scenario validates /doctor causal-graph confidence threshold enforcement for DOC-329. It focuses on linking only candidates with confidence >= 0.7 and logging lower-confidence candidates as skipped."
---

# DOC-329 -- Doctor causal graph confidence threshold

## 1. OVERVIEW

This scenario validates the autonomous apply path for `/doctor causal-graph` when candidate causal edges have mixed confidence values. It proves the command applies only high-confidence links and leaves lower-confidence records unlinked with explicit skip reasons.

The threshold matters because causal links are evidence, not cleanup churn. The command may improve lineage recall, but it must not create weak causal edges from loose keyword overlap or ambiguous packet relationships.

---

## 2. SCENARIO CONTRACT

- Objective: Confidence threshold enforcement for add-only causal graph auto-linking.
- Playbook ID: DOC-329.
- Real user request: `Auto-link causal edges. I want only high-confidence links applied.`
- Prompt: `Auto-link causal edges. I want only high-confidence links applied.`
- Preconditions: A sandbox or target active resolved profile Memory MCP database has candidate causal edges with mixed confidence, including at least one `0.85`, one `0.65`, and one `0.40` candidate.
- Expected execution process: Run `/doctor causal-graph --confidence-threshold=0.7`, capture the candidate list, snapshot path, inserted count, skipped candidates, and post-run stats.
- Expected signals: candidates with confidence `>= 0.7` are linked; candidates below `0.7` are skipped with `skipped: below threshold`; causal edge count delta equals the number of newly inserted `>= 0.7` candidates.
- Desired user-visible outcome: A concise applied verdict that names inserted high-confidence edges and skipped lower-confidence records.
- Pass/fail: PASS if only candidates at or above 0.7 are inserted and all lower-confidence candidates are logged as skipped.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, `SKIP`, or `UNAUTOMATABLE`.

---

## 3. TEST EXECUTION

### Prompt

```
Auto-link causal edges. I want only high-confidence links applied.
```

### Commands

1. Confirm candidate analysis includes mixed confidence values such as `0.85`, `0.65`, and `0.40`.
2. Record baseline `memory_causal_stats({})` totals and the pre-run causal edge count.
3. Run `/doctor causal-graph --confidence-threshold=0.7`.
4. Capture the Phase 1 `candidate_edges` and `skipped_candidates` output.
5. Capture the Phase 2 snapshot path and Phase 3 `attempted`, `inserted`, `skipped`, and `threshold` fields.
6. Run `memory_causal_stats({})` after apply and calculate the causal edge count delta.
7. Compare the count delta with the number of candidates whose confidence was `>= 0.7` and whose existing-edge check passed.

### Expected

The command filters candidate edges before mutation. A `0.85` candidate can be linked if the existing-edge check passes. The `0.65` and `0.40` candidates are not linked and appear in skipped output with a reason equivalent to `skipped: below threshold`.

The state log or final report shows `threshold: 0.7`, the attempted count, inserted count, skipped count, and post-verify status. The causal edge count delta equals the number of inserted candidates at or above the threshold, not the total candidate count.

### Evidence

- Candidate list with confidence values.
- Snapshot path emitted before mutation.
- Link results showing `memory_causal_link` calls only for `confidence >= 0.7`.
- Skipped-candidate log entries for `0.65` and `0.40` records.
- Pre-run and post-run causal edge counts proving the delta equals the eligible insert count.
- Final state-log path and gold-battery result.

### Pass / Fail

- **PASS**: every inserted edge has confidence `>= 0.7`, every below-threshold candidate is skipped with a visible reason, and edge count delta equals the eligible inserted count.
- **FAIL**: any candidate below `0.7` is linked, below-threshold skips are not logged, the threshold is lowered, or edge count delta does not match the eligible insert count.
- **SKIP**: no sandbox or target dataset with mixed-confidence causal candidates is available.
- **UNAUTOMATABLE**: the runtime cannot execute `/doctor causal-graph` or inspect candidate/link evidence.

### Failure Triage

If a `0.65` or `0.40` candidate is linked, fail with `confidence-threshold-violation` and inspect `candidate_selection.confidence_threshold` plus Phase 3 validation in `.opencode/commands/doctor/assets/doctor_causal-graph.yaml`. If skip evidence is missing, inspect Phase 1 output assembly and state-log serialization before rerunning.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: [.opencode/commands/doctor/speckit.md](../../../../commands/doctor/speckit.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor_causal-graph.yaml](../../../../commands/doctor/assets/doctor_causal-graph.yaml)
- Design context: local doctor command contract
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-329
- Feature name: Doctor causal graph confidence threshold
- Command mode: `/doctor causal-graph --confidence-threshold=0.7`
- YAML asset: `doctor_causal-graph.yaml`
- Confidence floor: 0.7
- Mutation policy: add-only links through `memory_causal_link`
- Feature file path: `23--doctor-commands/doctor-causal-graph-confidence-threshold.md`

---
title: "Deep research dashboard — testing/document alignment"
status: "SYNTHESIZED"
session_id: "fanout-luna-1786120169844-ep05xl"
iterations_completed: 10
stop_policy: "max-iterations"
---

# Deep Research Dashboard

## Status

- Loop: research
- Executor: cli-codex model=gpt-5.6-luna
- Artifact directory: research/lineages/luna
- Stop reason: max-iterations reached
- Early convergence: telemetry only; no early synthesis
- Graph writeback: skipped_packet_scope for detached lineage
- Parent/spec writeback: deferred_out_of_scope

## Surface coverage

| Surface | Inventory | Broad match | High-signal result |
|---|---:|---:|---:|
| manual-testing-playbook.md | 41 | 3 root playbooks | 0 stale assertions |
| feature-catalog Markdown | 1,498 | 17 generic Gate-3/spec-gate matches | 2 relevant Cursor entries |

## Verified findings

| ID | Severity | Classification | File and lines | Status |
|---|---|---|---|---|
| f-detailed-cursor-catalog | P1 | must-fix | cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:28-36,48-70 | verified |
| f-root-cursor-catalog | P2 | optional | cli-external-orchestration/feature-catalog/feature-catalog.md:69-77 | verified |

## Alignment verdict

No playbook snippet asserts the old configured-receipt or epoch-zero behavior. CU-014's prompt-event non-delivery contract is correct; CU-013, CU-020, and CU-021 cover separate host-event/prebind/task-dispatch behavior. Codex and OpenCode Gate-3 matches are setup or generic hook-parity text.

No target catalog asserts the old behavior either. The two Cursor catalog entries omit load-bearing behavior documented in the updated shared-core README and tests: observed receipt, lifecycleEpoch >= 1, post-emission observation, default-off/fail-open suppression, and byte-identical baseline output.

## Iteration progress

| Iteration | Focus | Result |
|---:|---|---|
| 1 | Inventory and matched-doc triage | Candidate two-catalog omission isolated |
| 2 | Playbook contract audit | No stale playbook assertion |
| 3 | Catalog-to-source comparison | P1 detailed/P2 root split identified |
| 4 | Catalog paraphrase sweep | No additional catalog |
| 5 | Playbook indirect-language sweep | No stale playbook |
| 6 | Executable negative controls | P1 confirmed by tests |
| 7 | Old-contract search | No explicit old contract |
| 8 | Catalog ownership challenge | Only Cursor pair in scope |
| 9 | Severity challenge | P1/P2 classification retained |
| 10 | Final evidence audit | Findings frozen for synthesis |

## Follow-on queue

1. Must-fix: update the detailed Cursor catalog with the existing observed-delivery contract and source/test anchors.
2. Optional: add a concise summary or pointer in the root catalog.
3. Do not modify the frozen runtime behavior or rewrite aligned playbook scenarios.


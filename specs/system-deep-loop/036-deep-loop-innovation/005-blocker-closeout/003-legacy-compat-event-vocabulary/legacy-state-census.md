# Legacy state census

Date: 2026-08-07

The census was run before the replay fixtures and implementation changes. It is
evidence of state that exists in the repository and must remain readable during
the vocabulary migration; it is not an exit criterion.

## Inventory

| Mode/family | Repository inventory | Real representative selected for replay | Migration consequence |
| --- | ---: | --- | --- |
| Deep research | 74 `deep-research-state.jsonl` files | `.opencode/specs/system-deep-loop/036-deep-loop-innovation/003-drift-census-and-plan-revalidation/research/lineages/sol/deep-research-state.jsonl` (18 lines, 22,277 bytes) | Preserve config, iteration, terminal, and operational records while mapping the live non-canonical stems. |
| Deep review | 35 `deep-review-state.jsonl` files | `.opencode/specs/system-deep-loop/036-deep-loop-innovation/004-durable-write-boundaries/review/lineages/luna/deep-review-state.jsonl` (64 lines, 107,328 bytes) | Preserve config, iteration, convergence, adjudication, synthesis, and operational records. |
| Deep alignment | 1 `deep-alignment-state.jsonl` file | `.opencode/specs/system-deep-loop/036-deep-loop-innovation/001-whole-system-gate/alignment/deep-alignment-state.jsonl` (49 lines, 43,197 bytes) | Preserve the live `sessionId`-only config identity and treat iteration slices separately from terminal lane completion. |
| AI council | 6 `ai-council-state.jsonl` files | `.opencode/specs/system-deep-loop/z_archive/024-deep-loop-improved/012-deep-loop-divergent-mode/ai-council/ai-council-state.jsonl` (22 lines, 6,312 bytes); live emitters additionally produce heartbeat/topic/round records | Keep the archived council vocabulary and accept the live `progress_record` heartbeat plus `topic_completed` and `round_completed`. |
| Skill benchmark | No dedicated `skill_benchmark` JSONL state file was found | A real `loop-host.cjs --mode=skill-benchmark` output will be captured in the fixture provenance; no synthetic benchmark fixture is admissible | Delegate shared lifecycle rows to the common compatibility bridge and retain the benchmark-specific planned record. |
| Deep-improvement common | 2 real `improvement-journal.jsonl` files | `.opencode/specs/system-deep-loop/z_archive/013-agent-deep-review-optimization/improvement/improvement-journal.jsonl` (19 lines, 5,464 bytes), with the matching research journal as a second source | Preserve the common session/candidate/evaluation/terminal vocabulary across agent, model, and skill-benchmark consumers. |

## Excluded evidence

`.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/fixtures/low-sample-benchmark/improvement-journal.jsonl` is a synthetic test fixture. It was inspected to detect accidental reuse, but it is not a replay fixture and is not counted as real state.

The selected source logs are read-only repository artifacts. Fixture provenance records the source path, capture date, line count, and any redaction required to keep packet-local paths and identifiers deterministic without changing the event vocabulary or record shape.

## Source commands

```text
rg --files .opencode/specs/system-deep-loop | rg '(^|/)(deep-(research|review|alignment)-state|ai-council-state|council|improvement-journal|skill-benchmark).*\\.jsonl$|state.*\\.jsonl$' | sort
rg --files .opencode/specs/system-deep-loop | rg '(^|/)deep-research-state\\.jsonl$' | wc -l  # 74
rg --files .opencode/specs/system-deep-loop | rg '(^|/)deep-review-state\\.jsonl$' | wc -l    # 35
rg --files .opencode/specs/system-deep-loop | rg '(^|/)deep-alignment-state\\.jsonl$' | wc -l # 1
rg --files .opencode/specs/system-deep-loop | rg '(^|/)ai-council-state\\.jsonl$' | wc -l      # 6
rg --files .opencode/specs/system-deep-loop | rg '(^|/)improvement-journal\\.jsonl$' | wc -l   # 2
```


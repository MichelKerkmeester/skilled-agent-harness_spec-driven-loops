---
title: "Review-Packet Resource Map — 012 Causal Graph Channel Routing Utilization"
description: "Resource map for the 10-iteration deep-review packet of 012; lists every state file, iteration artifact, log, and report produced by the session."
session_id: "2026-05-11T05:42:00Z"
generated_at: "2026-05-11T09:50:00Z"
---

# Review-Packet Resource Map — 012 Causal Graph Channel Routing Utilization

## 1. STATE FILES

| Path | Kind | Owner | Status |
|------|------|-------|--------|
| `review/deep-review-config.json` | config | orchestrator | immutable |
| `review/deep-review-state.jsonl` | event log | reducer (append-only) | OK (12 records) |
| `review/deep-review-findings-registry.json` | registry | reducer | OK (42 findings) |
| `review/deep-review-strategy.md` | strategy | orchestrator + agents | OK (dimensions, charter, next-focus) |

## 2. ITERATION ARTIFACTS

| Path | Iter | Focus | Bytes |
|------|------|-------|-------|
| `review/iterations/iteration-001.md` | 1 | inventory (broad) | ~11.6 KB |
| `review/iterations/iteration-002.md` | 2 | correctness | ~13.9 KB |
| `review/iterations/iteration-003.md` | 3 | security | ~11.7 KB |
| `review/iterations/iteration-004.md` | 4 | traceability | ~13.3 KB |
| `review/iterations/iteration-005.md` | 5 | maintainability | ~11.6 KB |
| `review/iterations/iteration-006.md` | 6 | correctness-deep | ~11.9 KB |
| `review/iterations/iteration-007.md` | 7 | security-deep | ~9.6 KB |
| `review/iterations/iteration-008.md` | 8 | traceability-replay | ~13.6 KB |
| `review/iterations/iteration-009.md` | 9 | adversarial | ~12.9 KB |
| `review/iterations/iteration-010.md` | 10 | final-sweep | ~23.7 KB |

## 3. DELTA STREAMS

| Path | Iter | Records |
|------|------|---------|
| `review/deltas/iter-001.jsonl` | 1 | 14 (1 iteration + 5 findings + 4 classifications + 4 ruled_out) |
| `review/deltas/iter-002.jsonl` | 2 | 10 |
| `review/deltas/iter-003.jsonl` | 3 | 6 |
| `review/deltas/iter-004.jsonl` | 4 | 11 |
| `review/deltas/iter-005.jsonl` | 5 | 8+ (7 findings) |
| `review/deltas/iter-006.jsonl` | 6 | 4+ |
| `review/deltas/iter-007.jsonl` | 7 | 2+ |
| `review/deltas/iter-008.jsonl` | 8 | 8+ |
| `review/deltas/iter-009.jsonl` | 9 | 16+ (3 findings + 12 ruled_out + classifications) |
| `review/deltas/iter-010.jsonl` | 10 | 9+ (6 findings + classifications) |

## 4. PROMPT PACKS (input)

| Path | Iter |
|------|------|
| `review/prompts/iteration-001.md` | 1 |
| `review/prompts/iteration-002.md` | 2 |
| `review/prompts/iteration-003.md` | 3 |
| `review/prompts/iteration-004.md` | 4 |
| `review/prompts/iteration-005.md` | 5 |
| `review/prompts/iteration-006.md` | 6 |
| `review/prompts/iteration-007.md` | 7 |
| `review/prompts/iteration-008.md` | 8 |
| `review/prompts/iteration-009.md` | 9 |
| `review/prompts/iteration-010.md` | 10 |

## 5. DISPATCH LOGS

| Path | Iter | Note |
|------|------|------|
| `review/logs/iter-001..010.{stdout,stderr}.log` | 1..10 | opencode CLI raw output (stdout = JSON event stream; stderr = subagent fallback warning only) |

## 6. SYNTHESIS OUTPUTS

| Path | Kind | Owner | Status |
|------|------|-------|--------|
| `review/review-report.md` | synthesis | orchestrator | OK (10 sections, 42 findings synthesized, verdict CONDITIONAL) |
| `review/resource-map.md` | this file | orchestrator | OK |

## 7. RUNTIME

| Field | Value |
|-------|-------|
| **Executor** | `cli-opencode` |
| **Model** | `deepseek/deepseek-v4-pro` |
| **Reasoning Effort** | `high` (variant) |
| **Provider** | DeepSeek API (direct) |
| **Repo Root** | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` |
| **Dispatch Flags** | `--agent general --format json --dangerously-skip-permissions --pure --dir <root> --variant high "$(cat <prompt>)" </dev/null` |
| **Per-iteration timeout** | 900 s (15 min) |

## 8. SUMMARY COUNTS

| Category | Count |
|----------|-------|
| Iteration narratives | 10 |
| Delta files | 10 |
| Prompt packs | 10 |
| Dispatch logs | 20 (10 stdout + 10 stderr) |
| State files | 4 |
| Synthesis outputs | 2 |
| **Total artifacts** | **56** |

---
title: "Resource Map: deep-research loop iteration outputs (Phase 5a)"
description: "Inventory of the 10-iter deep-research loop's own artifacts — distinct from the spec folder's resource-map.md which catalogs the audit target."
trigger_phrases:
  - "deep-research loop artifacts"
  - "phase 5a research/ inventory"
  - "iteration outputs catalog"
importance_tier: "normal"
contextType: "general"
---

# Resource Map — Deep Research Loop Iteration Outputs

> **Scope**: this map catalogs the artifacts produced BY the deep-research loop itself (per-iter narratives, deltas, prompts, logs, dashboard, state). The spec folder's `../resource-map.md` catalogs the SKILL ARTIFACTS UNDER AUDIT.

---

## 1. Control & State Files

| Path | Action | Status | Note |
|------|--------|--------|------|
| `research/deep-research-config.json` | Updated each iter | OK | Iter 10 final: iterationCount=10, stopReason="discovery-saturation-after-9-iters" |
| `research/deep-research-state.jsonl` | Appended each iter (1 record per iter + init + synthesis_complete event) | OK | 11 records after iter 10 (1 init + 10 iter + 1 synthesis_complete event) |
| `research/deep-research-strategy.md` | Created at init | OK | 7-section charter; reducer-owned; iter 10 does not edit |
| `research/deep-research-dashboard.md` | Refreshed each iter | OK | Final state: 10-iter table + saturation judgment |

## 2. Per-Iteration Narratives

| Path | Iter | Wall | Findings | Executor |
|------|------|------|----------|----------|
| `research/iterations/iteration-001.md` | 1 | 90s | 11 (6 P1 + 5 P2) | cli-devin / swe-1.6 |
| `research/iterations/iteration-002.md` | 2 | 90s | 5 (3 P1 + 2 P2) | cli-devin / swe-1.6 |
| `research/iterations/iteration-003.md` | 3 | 0s | 8 (8 P1) | orchestrator-direct |
| `research/iterations/iteration-004.md` | 4 | 86s | 2 (2 P2) | cli-devin / swe-1.6 |
| `research/iterations/iteration-005.md` | 5 | 92s | 2 (1 P1 + 1 P2) | cli-devin / swe-1.6 |
| `research/iterations/iteration-006.md` | 6 | 34s | 4 (2 P1 + 2 P2) | cli-devin / swe-1.6 |
| `research/iterations/iteration-007.md` | 7 | 19s | 1 (1 P1) | cli-devin / swe-1.6 |
| `research/iterations/iteration-008.md` | 8 | 25s | 2 (1 P1 + 1 P2) | cli-devin / swe-1.6 |
| `research/iterations/iteration-009.md` | 9 | 47s | 1 (1 P1) | cli-devin / swe-1.6 |
| `research/iterations/iteration-010.md` | 10 | 0s | 0 (synthesis-only) | orchestrator-direct |

## 3. Per-Iteration Deltas (JSONL)

| Path | Records |
|------|---------|
| `research/deltas/iter-01.jsonl` | 1 iteration record + finding records |
| `research/deltas/iter-02.jsonl` | same |
| `research/deltas/iter-03.jsonl` | same |
| `research/deltas/iter-04.jsonl` | same |
| `research/deltas/iter-05.jsonl` | same |
| `research/deltas/iter-06.jsonl` | same |
| `research/deltas/iter-07.jsonl` | same |
| `research/deltas/iter-08.jsonl` | same |
| `research/deltas/iter-09.jsonl` | same |
| `research/deltas/iter-10.jsonl` | 1 iteration record (synthesis_only=true, novel_findings=0) |

## 4. Per-Iteration Prompts (cli-devin RCAF input)

| Path | Used by iter |
|------|-------------|
| `research/prompts/iter-01-prompt.md` | 1 |
| `research/prompts/iter-02-prompt.md` | 2 |
| `research/prompts/iter-03-prompt.md` | 3 (orchestrator-direct; written for audit trail) |
| `research/prompts/iter-04-prompt.md` | 4 |
| `research/prompts/iter-05-prompt.md` | 5 |
| `research/prompts/iter-06-prompt.md` | 6 |
| `research/prompts/iter-07-prompt.md` | 7 |
| `research/prompts/iter-08-prompt.md` | 8 |
| `research/prompts/iter-09-prompt.md` | 9 |
| (none for iter 10) | n/a |

## 5. Per-Iteration Dispatch Logs

| Path | Iter | Size |
|------|------|------|
| `research/logs/iter-01-stdout.txt` | 1 | ~9.6 KB |
| `research/logs/iter-01-stderr.txt` | 1 | 0 bytes (clean) |
| `research/logs/iter-02-stdout.txt` | 2 | ~10 KB |
| `research/logs/iter-02-stderr.txt` | 2 | 0 bytes |
| `research/logs/iter-03-stdout.txt` | 3 | orchestrator output (sweep results + recommended patch shape) |
| `research/logs/iter-03-stderr.txt` | 3 | 0 bytes |
| `research/logs/iter-04-stdout.txt` | 4 | ~12 KB |
| `research/logs/iter-04-stderr.txt` | 4 | 0 bytes |
| `research/logs/iter-05-stdout.txt` | 5 | 97 lines |
| `research/logs/iter-05-stderr.txt` | 5 | 0 bytes |
| `research/logs/iter-06-stdout.txt` | 6 | 91 lines |
| `research/logs/iter-06-stderr.txt` | 6 | 0 bytes |
| `research/logs/iter-07-stdout.txt` | 7 | 74 lines |
| `research/logs/iter-07-stderr.txt` | 7 | 0 bytes |
| `research/logs/iter-08-stdout.txt` | 8 | 63 lines |
| `research/logs/iter-08-stderr.txt` | 8 | 0 bytes |
| `research/logs/iter-09-stdout.txt` | 9 | 78 lines |
| `research/logs/iter-09-stderr.txt` | 9 | 0 bytes |

## 6. Synthesis Outputs (iter 10)

| Path | Status | Note |
|------|--------|------|
| `research/research.md` | Created | 17-section synthesis; transverse patterns + negative knowledge + Eliminated Alternatives + recommendations |
| `research/convergence-summary.md` | Created | Stop reason + novelty trail + wall-clock + remediation handoff |
| `research/resource-map.md` | Created | This file |
| `../resource-map.md` Phase-5 Augmentation | Updated | Merged 36 findings (grouped by cluster where applicable) |
| `../implementation-summary.md` Phase-5 sections | Updated | §1 What Was Built Phase 5 + §Verification rows + §Metrics filled |

## 7. Reducer-Owned Files (read-only for this loop)

| Path | Note |
|------|------|
| `research/findings-registry.json` | Reducer-owned; iter 10 does not edit. Will receive DR-037 supersede-relationship update on next reducer pass. |

## 8. Conformance with Loop Protocol

This loop conformed to `deep-research/references/loop_protocol.md`:

- §2 INITIALIZATION ✓ (config + state + strategy created at run start)
- §3 ITERATION LOOP ✓ (9 dispatch iters + iter 3 orchestrator-direct documented under ADR-002)
- §3a Per-iteration budget ✓ (each iter within 1500s timeout; mean ~57s)
- §4 SYNTHESIS ✓ (iter 10 — this synthesis)
- §5 SAVE — pending operator `/memory:save`
- §6 STATE TRANSITIONS ✓ (INITIALIZED → ITERATING → EVALUATING → SYNTHESIZING → SAVING-pending)
- §7 ERROR HANDLING ✓ (0 timeouts, 0 dispatch failures, 0 malformed JSONL)
- §17 NOT applicable — no synthesis numbering convention found; 17-section format in research.md follows the canonical structure documented in `state_format.md §6`

## 9. Compute Footprint Summary

| Metric | Value |
|--------|-------|
| Total cli-devin dispatch wall-clock | ~483s (~8.05 min) |
| Iter 3 orchestrator-direct | 0s (parallel `rg -F` |
| Iter 10 orchestrator-direct synthesis | 0s (no dispatch) |
| Mean cli-devin iter wall-clock | ~60s (483 / 8 iters with dispatch) |
| Min iter wall-clock | 19s (iter 7) |
| Max iter wall-clock | 92s (iter 5) |
| Bundle-gate orchestrator overhead per iter | ~3-5 min (ground-truth pre-pass + post-dispatch verification) |
| Aggregate orchestrator overhead | ~30-40 min across 9 iters |
| /tmp + process cleanup per iter | unconditional `pkill -9` + sweep |

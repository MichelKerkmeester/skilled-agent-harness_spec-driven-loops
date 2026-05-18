---
title: "Resource Map: 013 deep-review packet"
description: "Path ledger for the artifacts produced by /spec_kit:deep-review:auto on 010-doctor-update-orchestrator (10 iterations, cli-opencode + deepseek/deepseek-v4-pro)."
trigger_phrases:
  - "013 review resource map"
  - "deep-review packet 013"
importance_tier: "normal"
contextType: "implementation"
---
# Resource Map — 013 Deep-Review Packet

Path ledger for the artifacts produced by `/spec_kit:deep-review:auto` on the 013 phase parent. Paths are relative to repo root.

## Review Packet Root

| Path | Role | Status |
|------|------|--------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/review/` | Packet root | OK |
| `review/review-report.md` | Canonical synthesis (this run's output) | OK |
| `review/resource-map.md` | This file | OK |
| `review/deep-review-config.json` | Loop config + 24-file scope manifest + executor pinning | OK (immutable post-init) |
| `review/deep-review-state.jsonl` | Append-only state log (config + 10 iteration records) | OK |
| `review/deep-review-findings-registry.json` | Deduplicated + adjudicated finding registry (post-iter-10) | OK |
| `review/deep-review-strategy.md` | Review charter + dimension queue + stop conditions | OK |
| `review/run-loop.sh` | Loop driver (iters 2-10 dispatcher) | OK (review-internal tooling) |
| `review/run-loop.log` | Loop driver event log | OK |
| `review/run-loop.driver.log` | Loop driver stdout/stderr (top-level wrapper) | OK |

## Per-Iteration Artifacts (× 10)

| Path | Role | Status |
|------|------|--------|
| `review/iterations/iteration-NNN.md` | Iteration narrative (findings + traceability + verdict + next-dimension) | OK (10 files: 001..010) |
| `review/iterations/iter-NNN.log` | Raw `opencode run` JSON event stream for iteration NNN | OK (10 files) |
| `review/deltas/iter-NNN.jsonl` | Structured per-iteration delta stream (1 iteration + classifications + findings) | OK (10 files) |
| `review/prompts/iteration-N.md` | Rendered iteration prompt fed to executor (iter 1 hand-authored; iters 2-10 rendered by run-loop.sh) | OK (10 files) |

## Reviewed Surfaces (READ-ONLY — under review, not modified)

| Path | Role |
|------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/spec.md` | Parent spec |
| `…/description.json` · `…/graph-metadata.json` · `…/handover.md` · `…/resource-map.md` | Parent control + cross-cutting docs |
| `…/001-initial-doctor-commands/{spec,plan,tasks,checklist,decision-record,implementation-summary,resource-map}.md` | Child 001 Level 3 docs |
| `…/001-initial-doctor-commands/{description,graph-metadata}.json` | Child 001 metadata |
| `…/002-sandbox-testing-playbook/{spec,plan,tasks,checklist,decision-record,implementation-summary,resource-map,handover}.md` | Child 002 Level 3 docs |
| `…/002-sandbox-testing-playbook/{description,graph-metadata}.json` | Child 002 metadata |

Total scope: 24 files. See `deep-review-config.json.reviewScopeFiles` for the complete enumerated list.

## RM-8 Mitigation Provenance

| Layer | Artifact |
|-------|----------|
| L1 (prompt hardening) | `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl` §CONSTRAINTS (commit `ab9f25ae5`) |
| L1 packet of record | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/009-deep-review-iteration-prompt-hardening/` |
| L2 (worktree isolation) | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/013-doctor-review` (detached HEAD `ab9f25ae52`) |
| L3 (commit baseline) | `edf617470` (WIP snapshot) → `ab9f25ae5` (RM-8 hardening) |
| L4 (model selection) | cli-opencode + `deepseek/deepseek-v4-pro --variant high` — deliberately retained as RM-8 verification ride-along |
| cli-opencode awareness | `.opencode/skills/cli-opencode/references/destructive_scope_violations.md` + SKILL.md ALWAYS rule 13 (commit `77713142b`) |

## Notes

- Review target was read-only across all 10 iterations. Zero agent-driven scope violations.
- The 24 scope files are unchanged in the worktree post-review. Verify via `git status -- 010-doctor-update-orchestrator/spec.md 010-doctor-update-orchestrator/001-initial-doctor-commands/ 010-doctor-update-orchestrator/002-sandbox-testing-playbook/` (expects empty).
- Sync target on main: copy the `review/` packet to the same relative path on main; do NOT copy any other worktree changes (e.g. opencode plugin auto-bump in `.opencode/package.json` is harness churn, not part of this packet).

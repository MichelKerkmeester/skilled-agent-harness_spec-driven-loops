# Iteration 1: Correctness — Deep-loop command alignment

## Focus

Dimension: correctness. Surface: deep-loop command alignment (packet scope item 4). Files: `.opencode/commands/deep/assets/deep-review-auto.yaml`, `deep-review-confirm.yaml`, `deep-research-auto.yaml`, `deep-ai-council-auto.yaml`, `deep-agent-improvement-auto.yaml`, `compiled/*.contract.md`, `compiled/manifest.jsonl`, referenced runtime scripts.

Scope check: every referenced script path was verified to exist (12/12 spot-checked: `append-mode-event.cjs`, `loop-lock.cjs`, `fanout-run.cjs`, `upsert.cjs`, `status.cjs`, `convergence.cjs`, `reduce-state.cjs`, `lib/findings-registry.cjs`, `divergent-review-pivot.ts`, `review-research-paths.cjs`, `generate-context.js`, `deep-research/scripts/reduce-state.cjs`).

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 9
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
(none)

### P1, Required
(none)

### P2, Suggestion
- **F001**: Duplicated comment banner block at top of deep-review-auto.yaml, `.opencode/commands/deep/assets/deep-review-auto.yaml:1-5`. The `# ────` separator plus `# DEEP REVIEW: AUTONOMOUS DEEP REVIEW LOOP (AUTO MODE)` title block is repeated verbatim (lines 1-3 and 3-5 share the same text). No behavioral impact; a copy-paste artifact that adds noise to the canonical command source. Recommendation: collapse to one banner.
- **F002**: Confirm workflow omits the resource-map coverage audit step that auto has, `.opencode/commands/deep/assets/deep-review-confirm.yaml:1564-1572` (emits resource map) vs `.opencode/commands/deep/assets/deep-review-auto.yaml:2150` (`step_resource_map_coverage_gate`). Loop-protocol Step 3b (`.opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:322-335`) requires at least one iteration to audit implementation-vs-resource-map coverage when `resource_map_present` is true; the confirm path would skip the audit while still emitting the map. Advisory-class drift (the gate is conditional on a resource-map.md existing at init, which the current target lacks), but the two workflows should stay at parity for the audit step.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | `compiled/deep-review.contract.md:17-60` vs live hashes | All 16 recorded source digests for `/deep:review` match live files; deep-research and deep-ai-council contract digests spot-checked and match |
| checklist_evidence | notApplicable | hard | - | No checked completion claims in the command assets reviewed this iteration |

## Assessment

- New findings ratio: 1.00 (2 new P2, no prior findings)
- Dimensions addressed: correctness
- Novelty justification: both findings are new; F001 is a visible duplication in the canonical command source; F002 is an auto/confirm parity gap not previously recorded in this lineage.

## Ruled Out

- Compiled-contract staleness: ruled out — all recorded `sha256` digests in `compiled/deep-review.contract.md` match live files, including both workflow YAMLs, both SKILL.md files, the mode registry, and the prompt pack.
- Missing script references: ruled out — every script path referenced by the reviewed YAMLs resolves to an existing file (12/12).
- Auto/confirm step-set divergence as a bug: ruled out for approval-gate steps (expected); the divergence is limited to the resource-map audit step (F002).

## Dead Ends

- Verifying `agent_config.model: opus` in the auto YAML against the fan-out executor model (deepseek-v4-flash-max): the native branch and CLI lanes are intentionally different dispatch paths; no contradiction established.

## Recommended Next Focus

Iteration 2: security — general architecture: shared-checkout containment, fan-out runner (fanout-run.cjs, fanout-pool.cjs), merge (fanout-merge.cjs), quarantine layout, ledger fencing, path handling in append/reduce scripts.

Review verdict: PASS

# Iteration 4: Traceability overlays — agent parity, feature catalog, playbook

## Focus

Dimension: traceability. Surfaces: deep-loop agent alignment (packet scope item 5) and feature catalog / playbook alignment (packet scope item 2). Overlay protocols: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`. Files: `.opencode/agents/{deep-review,deep-research,deep-improvement,orchestrate}.md`, `.claude/agents/*`, `.pi/agents/*`, `.codex/agents/*.toml`, `feature-catalog/fanout-write-containment/fanout-write-containment.md`, `manual-testing-playbook/write-containment/shared-checkout-run.md`, `runtime/scripts/fanout-run.cjs`, `runtime/tests/unit/{write-containment,fanout-run}.vitest.ts`.

## Scorecard

- Dimensions covered: traceability (overlay protocols)
- Files reviewed: 10
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.00

## Findings

### P0, Blocker
(none)

### P1, Required
(none)

### P2, Suggestion
(none)

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| skill_agent | pass | advisory | deep-review SKILL.md vs `.opencode/agents/deep-review.md` | LEAF-only contract, canonical REFUSE string, severity/verdict mapping, 0.10 threshold, route-proof fields (agent:230) all agree |
| agent_cross_runtime | pass | advisory | .opencode/.claude/.pi/.codex deep-review definitions | Same contract in all four runtimes; codex TOML generated from canonical md; only metadata drift (tool-list formatting, model pin) |
| feature_catalog_code | pass | advisory | `feature-catalog/fanout-write-containment.md` vs runtime | Preservation default, quarantine under lineage dir, opt-in restore to pre-dispatch bytes, churn detector (fanout-run.cjs:1657-1665) — all match shipped behavior; test files cited exist |
| playbook_capability | pass | advisory | `manual-testing-playbook/write-containment/shared-checkout-run.md` (WC-001) | Scenario executable against reality: preservation default, lane settles complete with containment advisory, no reversion; no worktree references |

## Assessment

- New findings ratio: 0.00
- Dimensions addressed: traceability (overlay protocols)
- Novelty justification: no new findings; the overlay protocols were clean this pass.

## Ruled Out

- Agent drift across runtimes: ruled out — deep-review/deep-research/deep-improvement/orchestrate show consistent LEAF/refusal/route-proof contracts in all four runtime mirrors; deep-research carries WebFetch in every runtime while improvement carries none, matching each mode's documented surface.
- Catalog staleness: ruled out — every file the fanout-write-containment catalog cites exists (`write-containment.ts`, `fanout-run.cjs`, both vitest files), and its behavior claims reproduce in the runtime sources.
- Playbook impossibility: ruled out — WC-001's steps (hash → run → second-shell edit → re-hash) are executable against the shipped preserve-by-default remedy.

## Dead Ends

- Counting per-file tool-list differences between runtime mirrors as findings: these are presentation/metadata differences the generated codex TOML legitimately carries; no contract divergence.

## Recommended Next Focus

Iteration 5: maintainability — general architecture contradictions, dead paths, duplicated rules; stabilization replay of F001-F005.

Review verdict: PASS

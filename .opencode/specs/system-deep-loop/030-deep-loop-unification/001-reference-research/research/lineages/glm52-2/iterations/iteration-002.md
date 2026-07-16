# Iteration 002 — Bidirectional Path-Coupling Repair

**Focus:** Verify child 002 §8's directional path-repair rule at every coupling site (Q2). Highest-probability mechanical failure mode per 002 §6.
**Status:** complete · **newInfoRatio:** 0.85 · **Lineage:** glm52-2

## Approach
Traced concrete relative `require()` sites in both directions and the absolute-path sites, recomputing the post-merge target for each from first principles (cwd shift from sibling→nested-child).

## Findings

### F2.1 — Reverse rule (minus-one hop, rename segment) CONFIRMED correct [CONFIRM]
Representative site: `deep-research/scripts/reduce-state.cjs:15` → `require('../../../deep-loop-runtime/lib/deep-loop/artifact-root.cjs')`. The file lives at `…/deep-loop-workflows/deep-research/scripts/`; `../../../` climbs scripts→deep-research→deep-loop-workflows→skills, then `deep-loop-runtime/lib`. Post-merge the file is at `…/system-deep-loop/deep-research/scripts/`, runtime at `…/system-deep-loop/runtime/`. New require: `../../runtime/lib/deep-loop/artifact-root.cjs` (climb scripts→deep-research→system-deep-loop, then `runtime/lib`). That is **3 hops→2 hops (−1) + segment `deep-loop-runtime`→`runtime`**. Matches the spec's reverse rule exactly. Same shape verified at `reduce-state.cjs:20`, `runtime-capabilities.cjs:18`, `replay-graph-from-artifacts.cjs:56,65`, and the 4 council test files (`../../../../deep-loop-runtime/lib/council/…` → `../../../runtime/lib/council/…`).
[SOURCE: deep-loop-workflows/deep-research/scripts/reduce-state.cjs:15,20; deep-ai-council/scripts/tests/integration-deep-mode-e2e.vitest.ts:9-16]

### F2.2 — Forward rule (hop-unchanged, delete segment) CONFIRMED correct [CONFIRM]
Representative site: `runtime/scripts/render-command-contract.cjs:11` → `require('../../deep-loop-workflows/shared/rollout/resolve-injection-mode.cjs')`. File at `…/deep-loop-runtime/scripts/`; `../../` climbs scripts→deep-loop-runtime→skills, then `deep-loop-workflows/shared`. Post-merge file at `…/system-deep-loop/runtime/scripts/`, target at `…/system-deep-loop/shared/`. New require: `../../shared/rollout/resolve-injection-mode.cjs` (climb scripts→runtime→system-deep-loop, then `shared`). **2 hops→2 hops (unchanged) + segment deleted**. Matches the spec's forward rule exactly.
[SOURCE: deep-loop-runtime/scripts/render-command-contract.cjs:11; 002/spec.md:172-174]

### F2.3 — CORRECTION: the rule conflates absolute and relative paths [CORRECTION, precision]
`compile-command-contracts.cjs` and `check-contract-drift.cjs` do NOT use relative `require()` hops — they embed **absolute repo-rooted** strings like `.opencode/skills/deep-loop-workflows/mode-registry.json`. The spec's §8 "path-repair rule" (forward/reverse hop math) governs only relative requires; for absolute strings, "hop-count" is meaningless. These need a distinct, simpler treatment: a straight string rename of the segment `deep-loop-workflows`→`system-deep-loop` (and `deep-loop-runtime`→`system-deep-loop/runtime` where runtime paths appear absolutely). Not a correctness error, but the execution plan should state both repair classes explicitly so an editor doesn't apply hop-math to an absolute literal.
[SOURCE: deep-loop-runtime/scripts/compile-command-contracts.cjs:15-288; check-contract-drift.cjs:40-42]

### F2.4 — `compile-command-contracts.cjs` is the densest + highest-cascade forward site [RISK]
This single file embeds ~36 absolute `deep-loop-workflows/…` paths across three mode-contract definitions (ai-council: ~15, review: ~7, research: ~7, plus hub `mode-registry`/`SKILL.md`/`resolve-injection-mode`/`progress-record`). The spec lists it among "4 forward files" (true by file count) but understates per-file density. It is also the **generator** for `commands/deep/assets/compiled/*.contract.md`, which carry a runtime-consumed content hash — child 003 REQ-002 demands byte-identical regeneration, never hand-edit. A single mis-named path here desyncs the contract hash and fails silently at *command-invocation* time, not migration time. **Recommendation:** treat this file as the canonical forward-repair dry-run target and diff its regenerated output against committed contracts as the forward-direction exit gate.
[SOURCE: deep-loop-runtime/scripts/compile-command-contracts.cjs:15-288; 003/spec.md:126-127; 002/spec.md:87]

### F2.5 — `fanout-run.cjs` carries an absolute forward path too [CONFIRM]
`fanout-run.cjs:942-943` selects `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md` vs `…/deep-research/SKILL.md` for prompt-pack injection by loopType. Absolute literal → string rename to `system-deep-loop/…`. Minor but load-bearing for fan-out dispatch (the very mechanism running this lineage).
[SOURCE: deep-loop-runtime/scripts/fanout-run.cjs:942-943]

## Key Questions
- Considered: Q2 (path-coupling repair)
- Answered: Q2 — directional rule correct for relative requires; correction (F2.3) that absolute paths are a separate repair class; risk (F2.4) on the dense generator file.

## Ruled Out
- "Apply the forward/reverse hop-math uniformly to every `deep-loop-*` string" — WRONG for absolute literals (F2.3). Do NOT run a blind find/replace keyed on hop-count; classify each site as relative-require vs absolute-literal first.

## Novelty Justification
Substantially new (0.85): the directional-mechanics verification and the absolute/relative correction are net-new; mild overlap with iter 1's structural foundation.

## Next Focus
Iteration 3: the system-spec-kit tooling-borrow (Q3) — the load-bearing test wiring that 002 explicitly scopes INTO this phase, not 003.

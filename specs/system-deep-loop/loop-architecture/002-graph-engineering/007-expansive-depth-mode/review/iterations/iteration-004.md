# Iteration 004 - Maintainability

## Dispatcher
- Route: mode=review, target_agent=deep-review, native LEAF executor, iteration 4 of 10 (JSONL-derived count matches dispatch).
- Operator focus addressed: code and runtime surfaces first (both workflow YAMLs and the frontier-admit helper they call), docs second (command docs, presentation, references, SKILL/README). Every citation is in reviewScopeFiles.

## Dimension
maintainability -- repeated logic that can drift, logic hidden in workflow text instead of tested code, and doc surfaces that disagree with each other (review-core.md `review.maintainability`, P2 by default).

## Files Reviewed
- .skilled/commands/deep/assets/deep-review.yaml:320-345, 903-965, 1047, 1238, 2068 (diff 21c4b325b5a..1d2b49e4306)
- .skilled/commands/deep/assets/deep-research.yaml:343-360, 755-810, 686
- .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:360-395, 665-722
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:315-384 (seed partition consumer)
- .skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision-yaml-contract.vitest.ts:36-42, 436-460
- .skilled/commands/deep/review.md:3, 99-108 and .skilled/commands/deep/research.md:3, 106-115
- .skilled/commands/deep/assets/deep-review-presentation.txt (diff)
- Lineage-mode wording across deep-review/README.md:144, deep-review/references/protocol/quick-reference.md:109, deep-review/references/protocol/loop-protocol.md:616, deep-research/references/protocol/loop-protocol.md:122, deep-research/references/guides/quick-reference.md:111, .codex/agents/deep-review.toml:380, .dsh/agents/deep-review.patch.yml:375

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **The frontier seed step is written twice per workflow and the two copies already disagree on the budget-source flag** -- .skilled/commands/deep/assets/deep-review.yaml:343 -- Each workflow carries a top-level fan-out `step_frontier_seed` (deep-review.yaml:320-345, deep-research.yaml:343-360) and a phase_init `step_frontier_seed` (deep-review.yaml:903-928, deep-research.yaml:755-773) with the same decomposition instructions re-wrapped line by line. The phase_init copy passes `--max-iterations-source "{max_iterations_source}"` (deep-review.yaml:924, deep-research.yaml:769); the fan-out copy omits it (deep-review.yaml:343, deep-research.yaml:359), so `seedNodes` falls back to `maxIterationsSource='default'` (frontier-admit.cjs:670) and `seedBudget` derives a budget (frontier-admit.cjs:379). The YAML contract test only locates the six-space-indented phase_init copy (stop-decision-yaml-contract.vitest.ts:37) when it asserts the flag (stop-decision-yaml-contract.vitest.ts:459), so the two-space fan-out copy is unguarded. Impact today is informational (the fan-out seed's printed `derivedMaxIterations` is not bound; fanout-run.cjs sizes lineages itself), but any future fix to the seed instructions or command has to land in four places and nothing catches a missed one.
   Finding class: duplicated-workflow-text drift
   Scope proof: both workflow YAMLs, two seed steps each; frontier-admit.cjs seed CLI is the single consumer
   Affected surface hints: deep-review.yaml step_frontier_seed (top-level and phase_init); deep-research.yaml step_frontier_seed (both); stop-decision-yaml-contract.vitest.ts stepText
   Case: an expansive fan-out review launched with --max-iterations=12 and a matrix source runs the top-level seed, whose printed JSON reports a default-derived derivedMaxIterations instead of the explicit 12, while the single-executor path reports 12.

2. **The defaulted-budget config writer lives as an inline `node -e` program duplicated in both YAMLs, with no test executing it** -- .skilled/commands/deep/assets/deep-review.yaml:944 -- `step_frontier_budget` embeds a 14-line script that reads the config, calls `seedBudget`, compares, writes a `.tmp` file and renames it over the config (deep-review.yaml:944-958). deep-research.yaml:789-803 is the same program with only the config filename and `target` changed. The contract test asserts placement and substrings only (stop-decision-yaml-contract.vitest.ts:442-457); no test runs the write path, so the compare-then-atomic-rename behavior and the one writer of `maxIterations` after initialization (deep-review.yaml forbidden-list note, "step_extend_completed_run, step_frontier_budget and step_update_config_status") are untested logic in workflow text. frontier-admit.cjs already exposes a `seed` CLI that computes the same budget (frontier-admit.cjs:720); a `budget --write` subcommand (or a flag on `seed`) would put the writer in one tested place.
   Finding class: logic-in-workflow-text duplication
   Scope proof: two inline scripts, one per workflow YAML, both calling frontier-admit.cjs seedBudget
   Affected surface hints: deep-review.yaml step_frontier_budget; deep-research.yaml step_frontier_budget; frontier-admit.cjs CLI
   Case: a change to how the derived budget is persisted (for example also clamping maxFrontierNodes in the config) edited in deep-review.yaml but not deep-research.yaml ships with every test green, because no test executes either script.

3. **Both command argument-hints omit the program's headline opt-in flag `--depth-mode`** -- .skilled/commands/deep/review.md:3 -- The program added `[--extend=N]` to both `argument-hint` lines (review.md:3, research.md:3) but not `--depth-mode`, which both option tables document as the opt-in switch (review.md:100, research.md:107), nor `--extend-minutes` (review.md:108, research.md:115). The hint is what a runtime shows at invocation, so the one flag that turns on expansive depth is discoverable only by reading the body. Pre-existing omission of `--convergence-mode` follows the same pattern and is not counted here.
   Finding class: doc-surface drift
   Scope proof: two command docs, argument-hint frontmatter line vs their own option tables
   Affected surface hints: .skilled/commands/deep/review.md frontmatter; .skilled/commands/deep/research.md frontmatter
   Case: an operator typing /deep:review sees the hint list --extend=N but not --depth-mode, and runs a default-depth review when an expansive one was wanted.

## Traceability Checks
- spec_code: partial (unchanged; R1-P1-001 still open). This iteration's YAML reads add no new spec-vs-code contradiction.
- agent_cross_runtime: pass for the lineage-mode clause -- .claude/agents/deep-review.md:376-377, .codex/agents/deep-review.toml:380-381 and .dsh/agents/deep-review.patch.yml:375-376 carry the same `completed-continue` live / `fork` deferred wording; .vibe/agents/deep-review.toml:4 embeds the same instructions string.
- skill_agent: pass for lifecycle wording -- deep-review/README.md:144, deep-review quick-reference.md:109, both loop-protocol.md files (616, 122) and both YAMLs (deep-review.yaml:711, deep-research.yaml:686) agree that only `fork` is deferred; review.md `--extend` row matches the YAML extension step.

## Integration Evidence
- Command: `.skilled/commands/deep/review.md` and `.skilled/commands/deep/research.md` (frontmatter + option tables).
- Workflows: `.skilled/commands/deep/assets/deep-review.yaml`, `.skilled/commands/deep/assets/deep-research.yaml`.
- Script: `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` seed/seedBudget; `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` partition.
- Mirrors (read-only): `.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml`, `.dsh/agents/deep-review.patch.yml`, `.vibe/agents/deep-review.toml`.

## Edge Cases
- Severity of finding 1 kept at P2: the drifted flag only changes a printed budget the fan-out path does not bind. Downgrade trigger not needed; upgrade trigger would be any step that binds `frontier_seed_json.derivedMaxIterations` on the fan-out path.
- `fanout_graph_store` note is repeated three times in deep-review.yaml (1047, 1238, 2068) and three in deep-research.yaml; recorded as context, not a finding, because each copy sits on a different step that needs it and the text is identical.
- Carry-forward: 010 CHK-032 research scope intersection still unverified (not in this slice).

## Confirmed-Clean Surfaces
- Lineage-mode documentation (completed-continue live, fork deferred) is consistent across command docs, presentation, references, SKILL/README and four agent mirrors.
- deep-review-presentation.txt default table now matches the YAML defaults (maxIterations 7, depthMode default, minIterations 2).

## Ruled Out
- Stale "completed-continue is deferred" text anywhere in the slice: none found; all copies updated.
- Divergent `fanout_graph_store` text across copies: identical, so not drift.

## Verdict
No new P0/P1 this iteration; active P1 findings R1-P1-001 and the iteration-2 P1 remain open, so the run stays CONDITIONAL.

## Next Focus
- Dimension: overengineering. - Focus area: frontier-admit.cjs admission checks and options, divergent-pivot.ts retry attempt plumbing, step_frontier_reduce_seed / step_frontier_activate extra steps, maxFrontierNodes null derivation. - Reason: rotation; maintainability covered. - Rotation status: correctness, security, traceability, maintainability covered; overengineering, sk-code-alignment remain. - Carry-forward: spec_code partial (R1-P1-001); checklist_evidence partial; 010 CHK-032 unverified. - Required evidence: file:line in changed code, and what to delete or collapse.

Review verdict: CONDITIONAL

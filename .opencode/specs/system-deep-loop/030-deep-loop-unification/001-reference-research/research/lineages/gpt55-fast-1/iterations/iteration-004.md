# Iteration 4: Reference Migration

## Focus
This iteration stress-tested whether the external reference migration plan covers all non-executable surfaces that still speak `deep-loop-workflows` or `deep-loop-runtime`. It separated public-surface freezes (`/deep:*` commands and agent names) from skill-identity, path, graph, and corpus records that must be updated.

## Actions Taken
- Searched commands, agents, workflow/runtime docs, system-skill-advisor, system-spec-kit, CI, plugin, and spec references for `deep-loop-workflows` and `deep-loop-runtime`.
- Read the child 003 external-reference migration spec and plan as the design under test.
- Read representative high-risk references: `.opencode` and `.claude` agent mirrors, plugin registry path, CI and pre-commit mirror checker paths, advisor drift guard, routing corpus fixtures, divergence ledger, and sibling graph metadata.

## Findings
1. The external reference migration plan is directionally correct and already captures the key scale: 948 non-noise references across commands, doctor, agents, READMEs, plugin/hooks, `system-spec-kit`, and `system-skill-advisor`, with `.opencode/specs/**` history explicitly out of scope [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/spec.md:57-82]. Its staged architecture correctly avoids blind replacement, requires grep-before/grep-after bracketing, and treats executable/structured/advisor-facing references as mutable while leaving historical spec mentions alone [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:66-83].
2. The stable public surface should remain `/deep:*` commands and existing agent names, while the skill identity changes to `system-deep-loop`. The child 003 spec states that command names, `@agent` names, and mode-packet folder names are frozen, with the rename applying to folder, routing keys, advisor constants, and graph edges [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/spec.md:143-149]. This prevents a reference migration from becoming an avoidable user-facing command rename.
3. Agent references require a mirrored edit in both `.opencode/agents` and `.claude/agents`. The `.opencode` orchestrator requires `Deep Route` to cite `.opencode/skills/deep-loop-workflows/mode-registry.json` [SOURCE: .opencode/agents/orchestrate.md:185-206], while the `.claude` mirror contains the same registry contract and council helper path [SOURCE: .claude/agents/orchestrate.md:150-195]. The child 003 plan correctly calls out both trees as real non-symlinked duplicates [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:95].
4. Advisor migration is a codegen-and-test operation, not a text rewrite. The Python advisor, TypeScript alias/scoring lanes, drift-guard test, and routing corpus all embed `deep-loop-workflows` as a skill identity or expected label [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:83] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:97-109] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:22-27] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/intent-prompt-corpus.ts:67-130]. The plan's Stage C-D-I sequence is necessary: update constants, regenerate projection, field-scope corpus label changes, then re-run baseline scoring [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:75-104].
5. Hooks, plugins, and CI are live migration surfaces. The OpenCode plugin hardcodes the registry path [SOURCE: .opencode/plugins/mk-deep-loop-guard.js:35]. The pre-commit hook and GitHub Actions mirror-sync workflow hardcode the deep-improvement checker path [SOURCE: .opencode/hooks/pre-commit:36-45] [SOURCE: .github/workflows/agent-mirror-sync.yml:14-23]. The routing-registry drift workflow is now glob-enrolled for any skill with `mode-registry.json`, which is helpful, but the advisor drift test itself still hardcodes the old registry path and hash skill string [SOURCE: .github/workflows/routing-registry-drift.yml:42-65] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:26-77].
6. Sibling graph metadata must collapse duplicate old identities into one new edge. `cli-opencode` currently lists `deep-loop-workflows` twice in `manual.related_to` [SOURCE: .opencode/skills/cli-opencode/graph-metadata.json:25-34], `sk-code` has a prerequisite edge to `deep-loop-workflows` [SOURCE: .opencode/skills/sk-code/graph-metadata.json:24-35], and `sk-prompt` has a sibling edge to `deep-loop-workflows` [SOURCE: .opencode/skills/sk-prompt/graph-metadata.json:20-26]. The child 003 plan correctly says graph edges should collapse meaningful duplicate old-skill edges rather than create duplicate `system-deep-loop` edges [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:97].
7. Documentation/catalog/playbook migration must be allowlist-driven, not blanket history rewriting. Live skill docs, code-facing READMEs, feature catalogs, manual testing playbooks, and agent docs contain current operational paths [SOURCE: .opencode/skills/deep-loop-workflows/SKILL.md:20-43] [SOURCE: .opencode/skills/deep-loop-runtime/manual_testing_playbook/manual_testing_playbook.md:34-71]. Historical `.opencode/specs/**` mentions are out-of-scope by design, but the active 052 child specs are coordination documents that should continue documenting the migration boundary rather than being counted as stale runtime references [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/spec.md:77-82].

## Questions Answered
- Answered: Reference migration must update skill identity, structured routing fields, advisor constants/projections/corpus labels, generated command contracts, agent mirrors, hooks/plugins/CI, graph metadata edges, and live docs/playbooks/catalogs. It should freeze `/deep:*` command names and agent names, leave historical specs alone, and use residual-grep plus routing accuracy baselines as the closeout gate.

## Questions Remaining
- Whether fallback-router should become active GLM-5.2 to MiMo-v2.5-Pro wiring.

## Ruled Out
- A repo-wide blind find/replace is ruled out because advisor fixtures need field-scoped label replacement, compiled command contracts need regeneration, graph edges need deduplication, and historical specs remain out of scope.
- Renaming `/deep:*` command names or `@agent` names is ruled out for this migration because the old problem is duplicate skill identity, not public command ambiguity.

## Dead Ends
- Treating `.opencode/agents` as the only agent surface is insufficient; `.claude/agents` is a real mirrored tree with the same old paths.
- Treating CI/workflows as documentation misses hardcoded runtime paths that can disable guards after the move.

## Edge Cases
- Ambiguous input: "reference migration" overlaps with executable internal path repair from phase 002. This iteration classifies external identity/docs/corpus surfaces; executable command YAML and internal `require()` path repairs remain phase 002/Stage E subjects.
- Contradictory evidence: None. The 003 plan and live references agree on the core surface list.
- Missing dependencies: Exact residual count was taken from the child 003 spec rather than recomputed because this lineage is read-only and scoped to research artifacts.
- Partial success: The category list is strong, but the eventual implementation still needs a fresh Stage-A residual inventory immediately before editing because worktrees and concurrent changes can reintroduce stale references.

## Sources Consulted
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/spec.md:57-82`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/spec.md:143-149`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:66-104`
- `.opencode/agents/orchestrate.md:185-206`
- `.claude/agents/orchestrate.md:150-195`
- `.opencode/plugins/mk-deep-loop-guard.js:35`
- `.opencode/hooks/pre-commit:36-45`
- `.github/workflows/agent-mirror-sync.yml:14-23`
- `.github/workflows/routing-registry-drift.yml:42-65`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:22-77`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/intent-prompt-corpus.ts:67-130`
- `.opencode/skills/cli-opencode/graph-metadata.json:25-34`
- `.opencode/skills/sk-code/graph-metadata.json:24-35`
- `.opencode/skills/sk-prompt/graph-metadata.json:20-26`

## Assessment
- New information ratio: 0.57
- Novelty justification: This pass grounded the reference-migration plan against live agent mirrors, advisor tests/corpus, plugin/hook/CI paths, and graph metadata edge cases, while confirming the phase 003 staging is mostly adequate.
- Questions addressed: reference migration; advisor corpus; graph metadata; CI/plugin/hook surfaces.
- Questions answered: reference migration answered at category and sequencing level.
- Confidence: High for migration categories and sequencing; medium for exact occurrence counts because a fresh pre-edit inventory is still required at implementation time.

## Reflection
- What worked and why: Reading the child 003 spec/plan after live grep results let the pass test the design rather than rediscover it.
- What did not work and why: Broad grep over all specs surfaces lots of historical mentions that are explicitly out of scope; scope filters are essential for closeout.
- What I would do differently: Add a pre-edit machine inventory artifact to phase 003 so later implementers compare current counts against the 948-reference design baseline.

## Recommended Next Focus
Fallback-router wiring: inspect the runtime fallback router, fan-out pool/run orchestration, executor model config, and tests to decide whether real GLM-5.2 to MiMo-v2.5-Pro reroute should ship now or stay offline/reference-only.

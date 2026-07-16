# Iteration 2: External Reference Migration Coverage

## Focus
Inventory the live external reference surface and stress-test child 003's dependency-ordered migration plan across command YAML/contracts, doctor/plugin/hook/CI paths, duplicated agents, advisor routing corpus, graph metadata, README/prose, and active test/eval fixtures.

## Findings

1. Child 003's category model is broadly correct, but Stage A must capture a fresh live baseline instead of trusting the spec's older count. A non-history `rg -l 'deep-loop-workflows|deep-loop-runtime'` sweep excluding `node_modules`, `.opencode/specs`, `.worktrees`, and `dist` found 776 files with old-name hits; targeted category counts found 20 command-deep files, 5 doctor files, 5 `.opencode/agents` files, 5 `.claude/agents` files, 30 advisor files, and 43 `system-spec-kit` files [SOURCE: command: rg-count sweep 2026-07-08T05:02Z]. This does not disprove the plan's 948 figure because that may be match count or use different exclusions, but it does mean Stage A should be treated as authoritative and rerun immediately before edits.

2. Command migration must regenerate compiled contracts, not hand-edit them. Source YAML assets contain live `skill: deep-loop-workflows`, `skill_md`, runtime CLI, lock, and graph paths [SOURCE: .opencode/commands/deep/assets/deep_ai-council_confirm.yaml:40] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_confirm.yaml:47] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_confirm.yaml:89]. The compiled contracts embed source digests and old paths in a generated header; `deep_research.contract.md` names `generatedBy: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs` and includes `deep-loop-workflows` source paths [SOURCE: .opencode/commands/deep/assets/compiled/deep_research.contract.md:1] [SOURCE: .opencode/commands/deep/assets/compiled/deep_research.contract.md:6] [SOURCE: .opencode/commands/deep/assets/compiled/deep_research.contract.md:34]. Child 003 Stage E's regenerate-only rule is therefore necessary.

3. The advisor migration really is the highest-risk structured-data surface. `skill_advisor.py` hardcodes the mode registry path at `deep-loop-workflows/mode-registry.json` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:83], and `aliases.ts` hardcodes the merged skill id as `deep-loop-workflows` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:95] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:109]. Routing fixtures also store old-name labels directly in fields such as `skill_top_1` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl:18]. Child 003's field-scoped label replacement and accuracy re-baseline are correct; a whole-file rewrite would be riskier than targeted field edits.

4. Plugin, doctor, hook, and CI surfaces are covered but need explicit pair verification. `mk-deep-loop-guard.js` reads `.opencode/skills/deep-loop-workflows/mode-registry.json` via `REGISTRY_RELATIVE_PATH` [SOURCE: .opencode/plugins/mk-deep-loop-guard.js:35], and its regression fixture creates the same path and removes the same registry file for fail-open coverage [SOURCE: .opencode/plugins/tests/mk-deep-loop-guard.test.cjs:24] [SOURCE: .opencode/plugins/tests/mk-deep-loop-guard.test.cjs:104]. Doctor has hardcoded deep-loop runtime scripts and parent-skill defaults [SOURCE: .opencode/commands/doctor/_routes.yaml:108] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:95]. Hook/CI parity exists too: `.opencode/hooks/README.md` documents the mirror checker path while `.github/workflows/agent-mirror-sync.yml` executes it [SOURCE: .opencode/hooks/README.md:52] [SOURCE: .github/workflows/agent-mirror-sync.yml:17]. Stage C/J should verify these as matched pairs, as planned.

5. Updating both agent directories is mandatory, not optional prose cleanup. The OpenCode orchestrator references the old mode registry in its Deep Route template and resolution rule [SOURCE: .opencode/agents/orchestrate.md:185] [SOURCE: .opencode/agents/orchestrate.md:206], and the Claude duplicate carries the same references at different line numbers [SOURCE: .claude/agents/orchestrate.md:174] [SOURCE: .claude/agents/orchestrate.md:195]. Child 003 correctly calls out that `.opencode/agents/**` and `.claude/agents/**` are real duplicated trees, not a symlinked single source.

6. Correction to child 003's residual-grep framing: not every active, non-spec old-name occurrence should be blindly renamed. `system-spec-kit` active eval ground truth includes historical queries and decoys such as `"give me the full set of deep-loop-workflows consolidation phase specs"` and a hard-negative decoy mentioning `deep-loop-workflows parity baseline` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:795] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:960]. These are not executable references to the old skill path; they are search-evaluation fixtures for historical packets. Stage J's residual grep should allowlist such semantically historical eval fixtures or review them case-by-case, not force a mechanical zero-hit rewrite across all non-spec files.

7. Sibling graph metadata edges are correctly scoped to child 003. Live graph metadata still points at old identities across `system-skill-advisor`, `system-spec-kit`, `cli-opencode`, `sk-code`, and `sk-prompt` [SOURCE: .opencode/skills/system-skill-advisor/graph-metadata.json:35] [SOURCE: .opencode/skills/system-spec-kit/graph-metadata.json:40] [SOURCE: .opencode/skills/cli-opencode/graph-metadata.json:31] [SOURCE: .opencode/skills/sk-code/graph-metadata.json:31] [SOURCE: .opencode/skills/sk-prompt/graph-metadata.json:22]. Child 003 Stage G's collapse-to-one-edge rule is necessary because the old two-skill identity created duplicate relationship edges.

## Sources Consulted
- `.opencode/commands/deep/assets/*.yaml`
- `.opencode/commands/deep/assets/compiled/*.contract.md`
- `.opencode/commands/doctor/**`
- `.opencode/plugins/mk-deep-loop-guard.js`
- `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs`
- `.opencode/agents/*.md`
- `.claude/agents/*.md`
- `.opencode/skills/system-skill-advisor/**`
- `.opencode/skills/system-spec-kit/**`
- `.opencode/skills/*/graph-metadata.json`
- Root and skill-local README surfaces found by grep.

## Assessment
- newInfoRatio: 0.72
- Novelty justification: Most of child 003's migration plan was confirmed, but the active eval-fixture allowlist requirement and live-baseline-count caveat are new refinements.
- Confidence: High that child 003 covers the major migration categories; medium on exact total count because counts vary by hit vs file and exclusion policy.

## Reflection
- What worked: Splitting source YAML, generated contracts, advisor code, agents, plugin, doctor, and graph metadata made the migration blast radius legible.
- What failed: Counting all old-name hits without semantic classification would overstate required rewrites and risks corrupting historical eval fixtures.
- Ruled out: A blind repo-wide find/replace is eliminated; the migration needs category-specific rewrite, regeneration, or allowlist handling.

## Recommended Next Focus
Evaluate `fallback-router.ts`, its tests, current fanout retry behavior, and whether GLM-5.2 to MiMo-v2.5-Pro fallback should be wired in this packet or deferred.

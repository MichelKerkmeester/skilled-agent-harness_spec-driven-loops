# Iteration 10: Consolidation and Final Stale-Doc List

## Focus

Deduplicate all candidate findings into final stale-doc clusters, preserving source citations and contradiction phase evidence.

## Findings

1. Final stale cluster A: `cli-opencode` direct `ai-council` invocation docs. Affected docs include `SKILL.md`, `README.md`, `assets/prompt_templates.md`, plus related manual playbook files. Contradicts phase 010. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:31] [SOURCE: .opencode/skills/cli-opencode/SKILL.md:285] [SOURCE: .opencode/skills/cli-opencode/README.md:76] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:386-392] [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/010-ai-council-subagent-only/implementation-summary.md:48-60]
2. Final stale cluster B: `cli-opencode/SKILL.md` says `deep-review` must never route through orchestrate, contradicting phase 009/current `orchestrate.md` for `/deep:review`. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:292] [SOURCE: .opencode/agents/orchestrate.md:79] [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/009-orchestrate-universal-routing/implementation-summary.md:50-57]
3. Final stale cluster C: `.opencode/plugins/README.md` omits `mk-deep-loop-guard.js` and has an outdated entrypoint count, contradicting phase 011. [SOURCE: .opencode/plugins/README.md:1-4] [SOURCE: .opencode/plugins/README.md:42-50] [SOURCE: .opencode/plugins/mk-deep-loop-guard.js:1-8] [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/011-deep-route-guard-plugin/implementation-summary.md:129-139]
4. Final stale cluster D: core deep-loop docs still require `.opencode/agents/*.toml` mirrors despite 014's removed-obsolete-mirror requirement and current filesystem absence. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/SKILL.md:17-20] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/SKILL.md:16-20] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:279-287] [SOURCE: .opencode/skills/deep-loop-runtime/SKILL.md:253-261] [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/014-skill-doc-drift-audit/spec.md:56]
5. Final stale cluster E: deep-improvement scanner docs and scanner code still encode `.opencode/agents/{name}.toml` as active mirror surface. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/README.md:81] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/feature_catalog/02--integration-scanning/runtime-mirrors.md:29] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/agent_improvement/integration_scanning.md:42-47] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/agent-improvement/scan-integration.cjs:18]
6. Final stale cluster F: `deep-ai-council/SKILL.md` says `@ai-council` is primary and lists nonexistent `.opencode/agents/ai-council.toml`, contradicting phase 010 and TOML removal. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md:431-432] [SOURCE: .opencode/agents/ai-council.md:4]

## Sources Consulted

- All iteration source sets from iterations 1-9.

## Assessment

- newInfoRatio: 0.20
- Novelty: low; synthesis-focused iteration.
- Confidence: high for clusters A, B, C, D, F; high for E as drift, with note that E includes implementation-coupled behavior.

## Reflection

- Worked: deduping by contradiction class yields fixable clusters.
- Failed: none blocking.
- Ruled out: no live skill-doc stale old `deep-route-guard.js` reference found; the guard problem is README inventory omission, not lingering old name.

## Recommended Next Focus

Patch docs in a follow-up implementation phase and decide whether the deep-improvement scanner should drop TOML mirror templates before doc wording is updated.

# Iteration 019 — Complete impact inventory (skills/commands/agents/hooks/configs)

**Focus:** full impact surface of the 009/010/011 + coordination changes, tagged UX vs AUTO.
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only; orchestrator-written). **Status:** complete. **newInfoRatio:** 0.82.

## Findings (impact matrix — ~40 surfaces; full table in `prompts/iteration-019.out`)
- The surface is MUCH broader than the proposal's key-files. Net-new surfaces the proposal omitted: the **command YAMLs** (`/speckit:complete` `speckit_complete_*.yaml`, `/deep:start-review-loop` `deep_start-review-loop_*.yaml` synthesis/verdict gates, `/deep:start-model-benchmark-loop` `*.yaml`), the **`.claude/agents/*` mirrors** of review/deep-review/context/deep-research/orchestrate, the **hooks** (`hook_system.md`, `skill_advisor_hook.md`), **`ENV_REFERENCE.md`** (the flag table of record), and the **manual_testing_playbook** regression scenarios.
- High-blast UX surfaces: `CLAUDE.md`/`AGENTS.md` completion rule, `/speckit:complete`, `validation_rules.md`, the manifest templates (`spec.md.tmpl`, `checklist.md.tmpl`), `deep-review/SKILL.md`.
- High-blast AUTO surfaces: `validator-registry.json` (+ new `AC_COVERAGE` rule script), `continuity-freshness.ts`, `spec-doc-structure.ts` (recompute fingerprint), the deep-review YAML legal-stop/verdict gates, deep-improvement Lane B scripts/assets.
- Runtime-mirror rule: every `.opencode/agents/*` prompt-contract change needs a `.claude/agents/*` mirror update (or an explicit mirror-lag decision).

## Verdict contribution
The impact map is the spine of `integration-plan.md`. Two anchors: (1) the completion gate (`CLAUDE.md` §2 + `/speckit:complete` + `validate.sh`/validator-registry) carries T6 freshness, T7 anti-softening, and the AC gate; (2) deep-improvement Lane B carries the 010 benchmark. Mirrors + command YAMLs + ENV_REFERENCE + playbooks must be in each packet's scope or rollout will be incomplete.

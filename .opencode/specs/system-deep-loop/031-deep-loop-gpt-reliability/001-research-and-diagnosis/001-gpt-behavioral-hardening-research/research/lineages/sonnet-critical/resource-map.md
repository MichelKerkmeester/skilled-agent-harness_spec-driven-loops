# Resource Map — sonnet-critical lineage (evidence-derived)

> Emitted from converged research delta evidence. resource-map.md was NOT present at the spec-folder root at init (coverage gate skipped); this lineage-derived map inventories the files read as primary evidence across iterations 1-10, in addition to the prior round's syntheses (already inventoried in `../glm-max/resource-map.md` and `../gpt-fast-high/resource-map.md`; not repeated here except where re-read for verification).

## Documents
- `research/research.md` — consolidated synthesis of the prior round (re-read and adjudicated against, iters 1,6,10)
- `research/lineages/glm-max/research.md` — prior lineage synthesis (re-read, iters 1-10 throughout)
- `research/lineages/gpt-fast-high/research.md` — prior lineage synthesis (re-read, iters 1-10 throughout; primary target of the self-assessment-bias check)
- `../001-deep-agent-router-and-orchestration/research/research.md` — predecessor research §0/§5/§8b (re-verified, iter 1)
- `../005-gpt-verification-smoke/verification-smoke.md` — smoke procedure + results (re-derived from source table, iter 1)
- `../006-host-hard-identity-fix5/decision-record.md` — FIX-5 trigger (parsed for its disjunctive-condition structure, iter 1)

## Agents
- `.opencode/agents/deep.md` — full read, hard boundaries + routing workflow (iters 2, 5)
- `.opencode/agents/orchestrate.md` — full re-read with a depth-counting/NDP lens (iters 4, 5) — new finding: NDP depth cap, `Agent Selection Priority` table and `Agent Files` table both omit `@deep`
- `.opencode/agents/ai-council.md` — mode/depth confirmation (iter 4)

## Commands
- `.opencode/commands/deep/research.md:1-90` — Phase 0 `GENERAL AGENT REQUIRED` self-check, full read (iter 3) — new evidence for Mode D
- `.opencode/commands/deep/review.md:25-60` — same self-check pattern, confirmed near-identical (iter 3)
- `.opencode/commands/deep/{context,ai-council,skill-benchmark,agent-improvement,model-benchmark}.md` — grepped for the same pattern across the seven surviving command files (iter 3)
- `.opencode/commands/deep/assets/deep_ai-council_auto.yaml:95-140` — full read of `step_build_session_state` + `step_orchestrate_session`, emitter/validator split (iter 4)

## Skills / Runtime
- `.opencode/skills/cli-opencode/SKILL.md:16,175,271,310-353,375-420` — self-invocation guard scope, re-read to distinguish from native/CLI-cross dispatch (iter 2)
- `.opencode/skills/deep-loop-workflows/mode-registry.json:60-80` — ai-council registry entry, cross-checked against YAML (iter 4)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:619-665` — `validateRouteProofRecord`, read to code-trace the ai-council validator failure (iter 8)
- `.opencode/plugins/README.md` — plugin entrypoint inventory (iter 2)
- `.opencode/plugins/{mk-code-graph,mk-goal,mk-skill-advisor,mk-spec-memory}.js` — grepped for hook registrations (iter 2)
- `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:195-317` — full plugin SDK hook surface, the source of the `tool.execute.before` finding (iter 2) — NOT cited by either prior lineage

## New-this-round evidence not in either prior lineage's resource map
- `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts` (plugin SDK types)
- The 8-command-file Phase-0 self-check grep result set
- `deep_ai-council_auto.yaml:117-118` specifically (the emitter block, as distinct from the `:132-136` validator block both prior lineages cited)

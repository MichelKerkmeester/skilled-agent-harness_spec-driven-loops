# Iteration 6: `cli-external-orchestration`, remaining skills, `.skilled/bin` compiled routing

## Focus

The remaining non-hub skill surfaces: `cli-external-orchestration` benchmark READMEs and changelogs, `cli-classifier` README and measurement page, the `sk-code` benchmark README, the `sk-prompt` benchmark report, and the `.skilled/bin/lib/compiled-routing` system-deep-loop rollout fixtures and compilers (canary router, registry compiler, canary cases).

## Actions Taken

- Re-ran the sweep with `--max-columns` after a single-line JSON benchmark report flooded the first attempt; extracted matches with `rg -o` for the report files.
- Read the compiled-routing fixture and compiler matches; compared `.skilled/bin` and `.opencode/bin` compiled-routing trees at directory level (same seven stage dirs + manifest).

## Findings

1. `.skilled/agents/deep-improvement.md:58` carries the Lane awareness line naming both lanes. **EDIT** the agent definition (canonical; runtime mirrors regenerate from it) [SOURCE: .skilled/agents/deep-improvement.md:58]
2. Three benchmark READMEs describe `deep-improvement` as owning "the surviving improvement lanes (agent-improvement, model-benchmark)": `cli-external-orchestration/benchmark/README.md:46`, `cli-claude-code/benchmark/README.md:44`, `sk-code/benchmark/README.md:116`. **EDIT** all three [SOURCE: .skilled/skills/cli-external-orchestration/benchmark/README.md:46]
3. `cli-classifier/README.md:72-73` documents the JEV feature flags for `/deep:model-benchmark` reviewer and 5dim runs. **EDIT** — the JEV features themselves stay; only the mode callers disappear [SOURCE: .skilled/skills/cli-classifier/README.md:72-73]
4. `cli-classifier/feature-catalog/measurements/pi-transport-integration.md:95-96` and `:114-116` list the two Lane B measurement scripts as Jev-feature callers. **EDIT** the caller rows [SOURCE: .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:95-96]
5. `cli-external-orchestration/changelog/v1.5.0.0.md:12,21` and `cli-hermes/changelog/v1.0.0.0.md:31` describe Hermes joining model-benchmark runs. **KEEP-AS-HISTORY** [SOURCE: .skilled/skills/cli-external-orchestration/changelog/v1.5.0.0.md:21]
6. `system-deep-loop/benchmark/reports/baseline/skill-benchmark-report.md` and the `compiled-routing/**` reports name the mode in routing tables. **KEEP-AS-HISTORY** [SOURCE: .skilled/skills/system-deep-loop/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.md]
7. `sk-prompt/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.json` measures "model-benchmark.md + 2 YAML assets" write-target automation. **KEEP-AS-HISTORY** [SOURCE: .skilled/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.json]
8. `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs:32-33` lists `model-benchmark` in its compiled mode set. **EDIT** [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs:32-33]
9. Same rollout packet: `canary-router.cjs:19-21` documents model-benchmark as the canonical over-routing example (comment), and `fixtures/canary-cases.v1.json:82-96,180-181` carries the `single-model-benchmark` canary case with expected mode/intents/resources plus a mode list entry. **EDIT** both [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/fixtures/canary-cases.v1.json:82-96]
10. Gap flag: a mirrored compiled-routing tree exists under `.opencode/bin/lib/compiled-routing/` with the same stage directories (003..014 + closure manifest), including a `013-live-activation` stage. Whether its system-deep-loop activation artifact carries model-benchmark rows must be verified with a `--no-ignore` scan in iteration 7 (mirrors) because the top-level master sweep may have skipped ignored paths [INFERENCE: based on identical directory listings of both trees]

## Ruled Out

- Treating the sk-prompt/system-deep-loop benchmark reports as editable: they are historical measurements; no edit, KEEP-AS-HISTORY.
- Editing the JEV feature implementations for this deletion: only documentation caller references change.

## Dead Ends

- `cli-classifier/README.md` beyond the JEV table has no other mode references.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: the `.opencode/bin` mirror requires a `--no-ignore` scan (scheduled).
- Partial success: none.

## Sources Consulted

- .skilled/agents/deep-improvement.md
- .skilled/skills/cli-external-orchestration/benchmark/README.md
- .skilled/skills/cli-external-orchestration/changelog/v1.5.0.0.md
- .skilled/skills/cli-external-orchestration/cli-claude-code/benchmark/README.md
- .skilled/skills/cli-external-orchestration/cli-hermes/changelog/v1.0.0.0.md
- .skilled/skills/cli-classifier/README.md
- .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md
- .skilled/skills/sk-code/benchmark/README.md
- .skilled/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.json
- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs
- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/canary-router.cjs
- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/fixtures/canary-cases.v1.json

## Assessment

- New information ratio: 1.0
- Questions addressed: KQ4 (partially: skill-level surfaces; runtime mirrors next), KQ5 (partially: compiled-routing found)
- Questions answered: none complete

## Reflection

- What worked and why: the `--max-columns` retry after the flood; extracting with `rg -o` avoided re-reading single-line JSONs; directory comparison exposed the `.opencode/bin` mirror ahead of the dedicated mirror iteration.
- What did not work and why: the first sweep wasted output budget on a giant JSON line; corrected pattern now standard for report files.
- What I would do differently: check tree mirrors by directory listing early when a file appears in two roots.

## Recommended Next Focus

Iteration 7: runtime mirrors — `.claude`, `.opencode` (agents, commands, prompts, skill mirrors, `bin/lib/compiled-routing` with `--no-ignore`), `.codex`, `.cursor`, `.pi`, `.devin`, `.hermes`; classify each occurrence as symlink, generated copy, or hand-written file.

---
title: "In-process handler timing, segment four lane: build or decline rank 6"
description: "Measured answer to segment three rank 6: the cold and warm cost of scoring a degraded prompt with the TypeScript handler in process, compared with today's Python fallback, against the hook's 2.5 s budget, with the answer change and the floor check."
trigger_phrases:
  - "in-process advisor handler timing"
  - "degraded path timing"
---

# In-Process Handler Timing: Rank 6

Lineage `inprocess-timing-4`, segment four. Every number below comes from a command run in this lineage; outputs are in `scratch/`. No tracked file was modified and no model session, daemon or behaviour arm was started.

## 1. Answer

**Build, with two changes to the filter the rank names.**

Rank 6 says `runLocalScorer` should call `handleAdvisorRecommend` in process and then apply the Q026 filter. The timing is safe: the composed proposed path costs a median of 231.1 ms and a worst of 428.5 ms, against 219.9 ms and 544.3 ms today, so the worst case improves by 115.8 ms and the budget still has 2,071.5 ms (82.9 percent) left for the rest of the hook.

The answer gain is conditional. Fed to the current `degradedRecommendations` unchanged, handler rows lose the typed command on the typed readme prompt and lose the `needsMode` label on both hub prompts. Both fields are already on the handler row and both are read by the hook's payload mapper, so the fix is in `degradedRecommendations`, not a new module.

### Files

| File | Change |
|---|---|
| `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` (`runLocalScorer`, lines 1455-1475) | Dynamic-import `handleAdvisorRecommend` on the degraded branch, call it with the hook's options (`topK 3`, `includeCompiledRoute true`, `compiledRouteTopOnly true`, `confidenceThreshold 0.8`, `uncertaintyThreshold 0.35`), map its rows to `AdvisorRecommendation` carrying `command`, `policy`, `ownerSkillId`, `needsMode`, then call `degradedRecommendations`. Keep the Python path as the fallback when the import or the call throws. |
| `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` (`degradedRecommendations`, lines 1481-1526) | Use the row's own `command` when the prompt typed it (the Q026 rule), instead of re-deriving it from `commandRowFor(entry.skill)`; carry `needsMode` on the shaped row. |
| `.skilled/skills/system-skill-advisor/runtime/tests/cli-degraded-command-contract.vitest.ts` | A case that forces exit 75 and pins the degraded top, the typed command and `needsMode` against the live-heads prompts. |

The daemon path and the floors are untouched: the change is a second call site inside the CLI's existing degraded branch.

## 2. Method

- The tracked database and its generation file were copied to `scratch/db/`, and `SYSTEM_SKILL_ADVISOR_DB_DIR` pointed at the copy. No tracked file is written by any run.
- `scratch/timing-handler.mjs` imports the built handler `dist/runtime/handlers/advisor-recommend.js`, refuses any holdout row, and scores ten fixed non-holdout prompts with the hook's own options.
- Cold: ten fresh `node` processes, one prompt each. Warm: one process, ten distinct prompts after two warm-up rows outside the measured set. Fallback: `runAdvisorSubprocess`, the Python scorer today's `runLocalScorer` spawns.
- Composed: `scratch/compose-timing.mjs` pays the CLI's own import first, then either the handler or the Python spawn, in one fresh process per prompt. This is the whole-process budget number.
- Floors: the committed `capture-command-routing-baseline.mjs`.

## 3. Measurements

| Measure | Median | Worst | Source |
|---|---|---|---|
| Cold handler import plus one call | 224.7 ms | 337.7 ms | `scratch/iteration-001-summary.json` |
| Cold whole process, one prompt | 239.4 ms | 443.0 ms | `scratch/iteration-001-summary.json` |
| Warm handler call | 76.5 ms | 93.6 ms | `scratch/warm.jsonl` |
| Python fallback spawn, same prompts | 238.5 ms | 377.7 ms | `scratch/fallback.jsonl` |
| Composed proposed, whole process | 231.1 ms | 428.5 ms | `scratch/compose-proposed.jsonl` |
| Composed today, whole process | 219.9 ms | 544.3 ms | `scratch/compose-today.jsonl` |
| Proposed at the 10,000-character cap | — | 335.0 ms (one run) | `scratch/compose-proposed-long.jsonl` |

Headroom against 2,500 ms: proposed worst leaves 2,071.5 ms (82.9 percent); today's worst leaves 1,955.7 ms (78.2 percent). The CLI's own module import is 3.85 ms median and 5.26 ms worst, so it is not the driver.

## 4. Answer Change

| Prompt | Handler (live answer) | Today's fallback |
|---|---|---|
| plain readme | `sk-doc` | `system-spec-kit` |
| plain doctor setup | none | `sk-code` |
| create-agent | `sk-doc`, `/create:agent` attached | none |
| save | `sk-doc` | `system-spec-kit` |
| repo-rule | `sk-doc` | none |
| typed readme | `sk-doc`, `/create:readme` | `command-create-readme`, `/create:readme` |
| typed doctor | `command-doctor-setup`, `/doctor:setup` | same |
| hub prompts (synthetic) | `needsMode` true on 2 of 2 | no `needsMode` |

The in-process top differs from the fallback top on 5 of 10 corpus prompts. No untyped prompt gains a command under Q026; the gain is the correct top and the label, not new offers.

### The filter gap

- The literal wiring (handler `skillId` fed to `degradedRecommendations`) loses `/create:readme` on the typed readme prompt because `commandRowFor('sk-doc')` is empty. Today's fallback keeps it. That is a regression on Q026's one guarantee.
- A filter that trusts the row's own command only when the prompt typed it keeps 1 of 1 typed commands and adds 0 commands to 9 untyped prompts.
- `needsMode` is read by the hook at `hooks/lib/skill-advisor-cli-fallback.ts:389`, but the filter's rows do not carry it, so the label needs the pass-through change.

## 5. Floors

`node $RA/capture-command-routing-baseline.mjs` at the built HEAD:

```text
{"correct":24,"total":44}
{"count":0,"total":35}
{"own":8,"attached":15,"combined":23,"total":45}
{"count":0,"total":35}
```

Typed recall 24 of 44 is at the floor, false offers 0 of 35 holds. The change touches no scoring input, so the floors cannot move from this work; the capture is the proof.

## 6. Eliminated Alternatives

- Summing the separately measured medians instead of running the composed path: the composed run replaces the sum and is the quoted budget number.
- Measuring against the tracked database: without the copied generation file the status read `absent` and the handler returned zero rows; the copy keeps the run honest and inside the lineage.
- Warming the measured prompts before timing them: the prompt cache is keyed on prompt text and source signature, so warm-up used two rows outside the measured set.
- Treating `degradedRecommendations` as drop-in compatible with handler rows: it re-derives the command from the skill, which is exactly the field the handler already resolved.
- Carrying the untyped hub command through the degraded filter: that reverses Q026 and stays the operator's decision (segment three rank 12).

## 7. Divergence Map

- Completed pivots: none. This lineage followed one focus and one question set.
- Failed pivots: none.
- Saturated directions: none.
- Remaining frontier: none for this lane. The only follow-up is the build phase's vitest and the operator decision on rank 12.

## 8. Open Questions

1. Does a live hook render show the same `needsMode` label from the corrected filter that the handler row carries? Owner: the build phase's vitest plus one hook render.
2. Does rank 12 (carry the plain command through the degraded brief) now become cheaper? It is still an operator decision under Q026.
3. What does the handler cost when the embedder is cold? Not measured here; Ollama was already running and starting or pulling a model was out of scope.

## 9. Sources

- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-3.md
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/014-review-remediation/implementation-summary.md
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements/implementation-summary.md
- .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1455
- .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1481
- .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:716
- .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:305
- .skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:47
- .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts
- .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:144
- .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:228
- .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:389
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/iterations/iteration-001.md
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/iterations/iteration-002.md
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/iterations/iteration-003.md

## 10. Final Verification

- Re-ran the committed floor capture from the final state: the same four lines, 24 of 44 and 0 of 35. `scratch/floor-final.json`, exit 0.
- `git status --porcelain` outside this lineage shows only `fanout-run` heartbeat rows in the parent observability log and other lineages' untracked folders; no tracked file was changed by this lane.
- `deep-research-state.jsonl` holds three iteration records with `status: complete` and one `synthesis_complete` event, all written through the append gateway.
- `validate.sh` and `generate-context.js` were not run: both write outside this lineage, which the dispatch prompt forbids.

## 11. Convergence Report

- Stop reason: all_questions_answered (5 of 5 key questions checked in `deep-research-strategy.md`)
- Total iterations: 3
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 1 cold/warm cost and fallback baseline (1.0); run 2 answer change under the Q026 filter (1.0); run 3 composed budget headroom (1.0)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded

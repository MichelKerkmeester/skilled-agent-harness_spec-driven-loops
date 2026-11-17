---
title: Deep Research Strategy - inprocess-timing-4
description: Timing lane for segment three rank 6, the in-process TypeScript handler on the degraded advisor path.
trigger_phrases:
  - "in-process advisor timing"
  - "degraded path timing"
---

# Deep Research Strategy - inprocess-timing-4

## 1. OVERVIEW

### Purpose

Measure the cold and warm cost of scoring a degraded prompt with the TypeScript handler in process, as segment three rank 6 proposes, against the hook's 2.5 s budget and today's Python fallback scorer, then answer build or decline.

### Usage

- Init fills Topic, Key Questions, Known Context and Research Boundaries.
- Each iteration writes its evidence to `iterations/iteration-NNN.md`.
- The reducer refreshes the machine-owned sections after every iteration.

---

## 2. TOPIC

LANE inprocess-timing-4 (segment three rank 6). Phases 014 and 015 are built. Rank 6 proposes that `runLocalScorer` call `handleAdvisorRecommend` in process and then apply the Q026 filter (`degradedRecommendations`). Measure cold and warm cost, compare with today's Python fallback scorer on the same prompts, check the 2.5 s hook budget and the floors, and answer build or decline with numbers.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What does one in-process handler call cost from a cold node process, and does its worst case fit the hook's 2.5 s budget?
- [x] What does a warm handler call cost in a process that already loaded the modules, and how much of the cold cost is module load rather than scoring?
- [x] How does the in-process handler compare with today's Python fallback scorer on the same prompts?
- [x] Would the in-process answer change the degraded top, the typed command and the mode label under the Q026 filter, and do the floors hold?
- [x] How much of the hook's 2.5 s budget is left when the degraded CLI path uses the in-process handler instead of the Python spawn?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do not change tracked code, the tracked database, or any file outside the lineage folder.
- Do not start a model session, a behaviour arm, a daemon, or an Ollama pull; use the embedder already running.
- Do not read or print holdout prompt text; counts only, through the committed scripts.
- Do not reopen ranks already built, declined or waiting in segments one to three.

---

## 5. STOP CONDITIONS

- Stop when the five key questions above are answered with commands and quoted output.
- Stop when a further iteration would add no new measurement.
- Never exceed config.maxIterations.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What does one in-process handler call cost from a cold node process, and does its worst case fit the hook's 2.5 s budget?
- What does a warm handler call cost in a process that already loaded the modules, and how much of the cold cost is module load rather than scoring?
- How does the in-process handler compare with today's Python fallback scorer on the same prompts?
- Would the in-process answer change the degraded top, the typed command and the mode label under the Q026 filter, and do the floors hold?
- How much of the hook's 2.5 s budget is left when the degraded CLI path uses the in-process handler instead of the Python spawn?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- copying both the database and the generation file made the handler score against a live scratch graph, so the numbers reflect the real lane rather than an absent-graph early return. Measuring import and call separately showed that module load, not scoring, is the fixed cost. (iteration 1)
- measuring the literal wiring before the corrected one separated a design gap from a property of the handler. The handler already produces the live answer; the filter is what drops fields. (iteration 2)
- composing the path in one process measured the thing the hook pays, and it exposed that the worst case favors the in-process path even though the median does not. The CLI import turned out to be negligible, so the earlier `--version` spawn number was misleading on its own. (iteration 3)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the first run read `ADVISOR_FRESHNESS_ABSENT` and returned zero rows, because the copied database had no generation counter beside it. The code at `lib/freshness/generation.ts:47` shows the counter is a separate file. (iteration 1)
- the first shape pass reported only the naive filter, so it would have hidden the typed-command regression. Adding the corrected filter made the difference visible. (iteration 2)
- summing medians would have overstated the CLI's share and hidden the worst-case variance in the Python spawn. (iteration 3)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Measuring the in-process handler against the tracked database: the copy plus the copied generation file is what makes `readAdvisorStatus` report `live`, and it keeps every scratch write inside the lineage. Without the generation file the status read `absent` and the handler returned zero recommendations. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:47] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Measuring the in-process handler against the tracked database: the copy plus the copied generation file is what makes `readAdvisorStatus` report `live`, and it keeps every scratch write inside the lineage. Without the generation file the status read `absent` and the handler returned zero recommendations. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:47]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Measuring the in-process handler against the tracked database: the copy plus the copied generation file is what makes `readAdvisorStatus` report `live`, and it keeps every scratch write inside the lineage. Without the generation file the status read `absent` and the handler returned zero recommendations. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:47]

### None this iteration. -- BLOCKED (iteration 3, 2 attempts)
- What was tried: None this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None this iteration.

### None this iteration. The first scratch run returned zero recommendations because the generation file was missing; copying it fixed the status read and is recorded under Ruled Out rather than treated as a dead end. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None this iteration. The first scratch run returned zero recommendations because the generation file was missing; copying it fixed the status read and is recorded under Ruled Out rather than treated as a dead end.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None this iteration. The first scratch run returned zero recommendations because the generation file was missing; copying it fixed the status read and is recorded under Ruled Out rather than treated as a dead end.

### Reporting the synthetic hub prompts as corpus rows. They exist only for the label check, and their ids carry the `synthetic-` prefix in every artifact. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Reporting the synthetic hub prompts as corpus rows. They exist only for the label check, and their ids carry the `synthetic-` prefix in every artifact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reporting the synthetic hub prompts as corpus rows. They exist only for the label check, and their ids carry the `synthetic-` prefix in every artifact.

### Summing the separately measured medians (CLI startup, handler import, handler call) as if that were a measurement. The composed process run replaces the sum and is the number quoted for the budget. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Summing the separately measured medians (CLI startup, handler import, handler call) as if that were a measurement. The composed process run replaces the sum and is the number quoted for the budget.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Summing the separately measured medians (CLI startup, handler import, handler call) as if that were a measurement. The composed process run replaces the sum and is the number quoted for the budget.

### Timing the warm set on the same prompts used for warm-up: the prompt cache is keyed on prompt text and source signature, so a warm-up call would have filled the measured cache entry. Warm-up used two rows outside the measured set. [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:602] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Timing the warm set on the same prompts used for warm-up: the prompt cache is keyed on prompt text and source signature, so a warm-up call would have filled the measured cache entry. Warm-up used two rows outside the measured set. [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:602]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Timing the warm set on the same prompts used for warm-up: the prompt cache is keyed on prompt text and source signature, so a warm-up call would have filled the measured cache entry. Warm-up used two rows outside the measured set. [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:602]

### Treating `degradedRecommendations` as drop-in compatible with handler rows. It re-derives a command from `commandRowFor(entry.skill)`, so a hub's attached command never survives and a typed command is lost. [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1495] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating `degradedRecommendations` as drop-in compatible with handler rows. It re-derives a command from `commandRowFor(entry.skill)`, so a hub's attached command never survives and a typed command is lost. [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1495]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `degradedRecommendations` as drop-in compatible with handler rows. It re-derives a command from `commandRowFor(entry.skill)`, so a hub's attached command never survives and a typed command is lost. [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1495]

### Treating the `--version` spawn as the CLI's import cost. The spawn includes Node boot; the in-process import is 3.85 ms, and both are reported separately. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/compose-proposed.jsonl] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the `--version` spawn as the CLI's import cost. The spawn includes Node boot; the in-process import is 3.85 ms, and both are reported separately. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/compose-proposed.jsonl]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the `--version` spawn as the CLI's import cost. The spawn includes Node boot; the in-process import is 3.85 ms, and both are reported separately. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/compose-proposed.jsonl]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Measuring the in-process handler against the tracked database: the copy plus the copied generation file is what makes `readAdvisorStatus` report `live`, and it keeps every scratch write inside the lineage. Without the generation file the status read `absent` and the handler returned zero recommendations. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:47] (iteration 1)
- None this iteration. The first scratch run returned zero recommendations because the generation file was missing; copying it fixed the status read and is recorded under Ruled Out rather than treated as a dead end. (iteration 1)
- Timing the warm set on the same prompts used for warm-up: the prompt cache is keyed on prompt text and source signature, so a warm-up call would have filled the measured cache entry. Warm-up used two rows outside the measured set. [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:602] (iteration 1)
- None this iteration. (iteration 2)
- Reporting the synthetic hub prompts as corpus rows. They exist only for the label check, and their ids carry the `synthetic-` prefix in every artifact. (iteration 2)
- Treating `degradedRecommendations` as drop-in compatible with handler rows. It re-derives a command from `commandRowFor(entry.skill)`, so a hub's attached command never survives and a typed command is lost. [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1495] (iteration 2)
- Summing the separately measured medians (CLI startup, handler import, handler call) as if that were a measurement. The composed process run replaces the sum and is the number quoted for the budget. (iteration 3)
- Treating the `--version` spawn as the CLI's import cost. The spawn includes Node boot; the in-process import is 3.85 ms, and both are reported separately. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/compose-proposed.jsonl] (iteration 3)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- `ADV` is `.skilled/skills/system-skill-advisor/runtime`. The handler is `ADV/handlers/advisor-recommend.ts`, compiled at `ADV/dist/runtime/handlers/advisor-recommend.js`.
- Today's local scorer is `ADV/skill-advisor-cli.ts` `runLocalScorer` at lines 1455-1475, which spawns `python3 ADV/scripts/skill_advisor.py` through `runAdvisorSubprocess` (`ADV/lib/subprocess.ts:305-409`).
- The Q026 filter is `degradedRecommendations` at `ADV/skill-advisor-cli.ts:1481-1526`.
- The hook's budget is `DEFAULT_CLAUDE_HOOK_TIMEOUT_MS = 2500` at `hooks/claude/user-prompt-submit.ts:144`, and the hook's own advisor options are at `hooks/lib/skill-advisor-cli-fallback.ts:228-247`.
- The DB path override is `SYSTEM_SKILL_ADVISOR_DB_DIR` at `ADV/lib/skill-graph/skill-graph-db.ts:303-320`, so a scratch copy leaves the tracked database untouched.
- Floors: `node $RA/capture-command-routing-baseline.mjs | jq -c '.metrics.typed_recall_at_1, .metrics.false_offer, .attachedMetrics.plain.tune, .attachedMetrics.false_offer_attached'` with `RA=ADV/scripts/routing-accuracy`.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 8
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Question injection surface: not used in this lineage
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-11-13T11:45:49Z

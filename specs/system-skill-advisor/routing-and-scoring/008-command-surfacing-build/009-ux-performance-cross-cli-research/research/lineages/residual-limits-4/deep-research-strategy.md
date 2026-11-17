---
title: Deep Research Strategy - residual-limits-4 (residual limits after 014 and 015)
description: Tracks the residual-limits-4 lineage of the segment-four command-surfacing research on the built state after phases 014 and 015.
trigger_phrases: []
importance_tier: normal
contextType: planning
---
# Deep Research Strategy - residual-limits-4

## 1. OVERVIEW

Lane label `residual-limits-4`: what still limits command surfacing after phases 014 (review remediation) and 015 (health default and brief refinements) are built. Three angles: what the reader sees on each of six CLIs, what the hook and brief cost, and what still makes the advisor less useful than it could be across CLIs. Each recommendation must name files, a measured gain and a proof check; anything unmeasured is labelled a hypothesis.

## 2. TOPIC

Residual limits on the built state after phases 014 and 015. Read-first sources are `P/goal.md`, `P/009-ux-performance-cross-cli-research/research/research-segment-3.md` sections 3 and 4, `P/014-review-remediation/implementation-summary.md`, `P/015-health-default-and-brief-refinements/implementation-summary.md` and their scratch after files, then the code at HEAD those summaries name. Anything ranked, built, declined or waiting in segments one, two and three is closed unless a new measurement changes its disposition, in which case the rank and the measurement are named. No tracked file is edited and no live arm is started.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] KQ1: What does the reader see on each of claude, codex, opencode, pi, devin and dsh at HEAD after phases 014 and 015, and which runtime still loses the command, the policy or the skill, or reports the brief as unknown?
- [x] KQ2: What is the live brief size per prompt and the hook latency at HEAD after phase 015, and which bytes or milliseconds can be removed without losing the command, the policy or the skill?
- [x] KQ3: Which residual limits still make the advisor less useful across the CLIs, and which change is worth building next, with the files, the measured gain and the check that proves it?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Re-recommending or re-measuring anything ranked, built, declined or waiting in `research.md`, `research-segment-2.md` or `research-segment-3.md`, unless a new measurement changes its disposition and the rank is named.
- Re-measuring the two segment-four lanes: richer command embedding text (rank 10) and in-process timing of the degraded scorer (rank 6). Those own separate lineages.
- Changing scorer weights, corpus labels, pins, the Python scorer, or any tracked file.
- Starting a model CLI session, an arena, a live arm, or pulling/starting Ollama.
- Reading or printing holdout prompt text; holdout numbers only, through committed scripts.
- Editing files outside this lineage directory.

---

## 5. STOP CONDITIONS

- Convergence at newInfoRatio 0.05 or below with every key question answered or explicitly carried forward.
- Eight iterations at most; a thin iteration is recorded with status `timeout` or `stuck`, not skipped.
- Stop early only for unrecoverable state corruption or a missing control file.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- KQ1: What does the reader see on each of claude, codex, opencode, pi, devin and dsh at HEAD after phases 014 and 015, and which runtime still loses the command, the policy or the skill, or reports the brief as unknown?
- KQ2: What is the live brief size per prompt and the hook latency at HEAD after phase 015, and which bytes or milliseconds can be removed without losing the command, the policy or the skill?
- KQ3: Which residual limits still make the advisor less useful across the CLIs, and which change is worth building next, with the files, the measured gain and the check that proves it?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the raw run lines instead of the summary exposed the delivery split (`true` versus `unknown`) and the cap denominator, which the summary's aggregate fields hide behind a start rate. (iteration 1)
- importing the source handler instead of spawning the stale compiled hook produced 44 live heads where the committed script produced zero, and it exposed the `emittedBytes` field the health record already writes. (iteration 2)
- asking the CLI three ways isolated the plugin's missing flags from every other difference and turned a plausible parity worry into a measured zero. (iteration 3)
- querying the store by message `type` rather than by text separated host records from model output, which is exactly the distinction a delivery check needs. (iteration 4)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- `summary-final-after.json` cannot answer "what did the reader see" on its own, because it records the unknown count but not the per-line delivery value. (iteration 1)
- the committed cost script's live-head rule cannot be satisfied on a stale dist, so the honest fallback was a source-level harness rather than a build. (iteration 2)
- the final arm cannot say which of Claude's two started create rows ran, because the run log stores the offer, not the start, so the start-side claim is bounded to a count. (iteration 3)
- looking for a `system` row type found none, so there is no existing host record to read; the marker is not optional. (iteration 4)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `instruction_entry` and `instruction_blob`: 0 entries for these sessions, so the injected block is not in the instruction tables either. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `instruction_entry` and `instruction_blob`: 0 entries for these sessions, so the injected block is not in the instruction tables either.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `instruction_entry` and `instruction_blob`: 0 entries for these sessions, so the injected block is not in the instruction tables either.

### `part` and `message`: 0 rows for the arena session; the live table is `session_message`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `part` and `message`: 0 rows for the arena session; the live table is `session_message`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `part` and `message`: 0 rows for the arena session; the live table is `session_message`.

### A per-runtime text comparison of the brief: the render probe shows the same renderer output through both channels, so no content difference exists to measure. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A per-runtime text comparison of the brief: the render probe shows the same renderer output through both channels, so no content difference exists to measure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A per-runtime text comparison of the brief: the render probe shows the same renderer output through both channels, so no content difference exists to measure.

### A plugin request-flag change: 0 of 44 typed rows differ, so the flags buy nothing on the measured corpus. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A plugin request-flag change: 0 of 44 typed rows differ, so the flags buy nothing on the measured corpus.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A plugin request-flag change: 0 of 44 typed rows differ, so the flags buy nothing on the measured corpus.

### A plugin-local in-memory receipt: the arena turn ends the process, so only a durable write survives to scoring time. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A plugin-local in-memory receipt: the arena turn ends the process, so only a durable write survives to scoring time.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A plugin-local in-memory receipt: the arena turn ends the process, so only a durable write survives to scoring time.

### A reader-only fix against `session_message`: 10 of 24 sessions would read as delivered on assistant text alone, so the check would be wrong on 14 rows and truthy on model output. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A reader-only fix against `session_message`: 10 of 24 sessions would read as delivered on assistant text alone, so the check would be wrong on 14 rows and truthy on model output.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A reader-only fix against `session_message`: 10 of 24 sessions would read as delivered on assistant text alone, so the check would be wrong on 14 rows and truthy on model output.

### Comparing rendered heads from the plugin itself: the plugin's renderer is the same shared renderer, so the CLI answer is the only place a difference could enter, and the probe found none. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Comparing rendered heads from the plugin itself: the plugin's renderer is the same shared renderer, so the CLI answer is the only place a difference could enter, and the probe found none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Comparing rendered heads from the plugin itself: the plugin's renderer is the same shared renderer, so the CLI answer is the only place a difference could enter, and the probe found none.

### Measuring a new cold-daemon first prompt: that needs a fresh socket and a live arm-like start. The phase 010 figure of 742 ms (30 percent of budget) already covers it and is cited, not rerun. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Measuring a new cold-daemon first prompt: that needs a fresh socket and a live arm-like start. The phase 010 figure of 742 ms (30 percent of budget) already covers it and is cited, not rerun.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Measuring a new cold-daemon first prompt: that needs a fresh socket and a live arm-like start. The phase 010 figure of 742 ms (30 percent of budget) already covers it and is cited, not rerun.

### Piping rows through the committed `measure-brief-cost.mjs` with the compiled dist hook: it reads `degraded_brief` on this machine, which is the exact failure phase 015 recorded, so the source handler is the only path that yields live heads without a build. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Piping rows through the committed `measure-brief-cost.mjs` with the compiled dist hook: it reads `degraded_brief` on this machine, which is the exact failure phase 015 recorded, so the source handler is the only path that yields live heads without a build.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Piping rows through the committed `measure-brief-cost.mjs` with the compiled dist hook: it reads `degraded_brief` on this machine, which is the exact failure phase 015 recorded, so the source handler is the only path that yields live heads without a build.

### Re-opening rank 6 (in-process degraded scorer) or rank 10 (intent signals): separate segment-four lanes own them. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Re-opening rank 6 (in-process degraded scorer) or rank 10 (intent signals): separate segment-four lanes own them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-opening rank 6 (in-process degraded scorer) or rank 10 (intent signals): separate segment-four lanes own them.

### Re-opening segment-three rank 4 (OpenCode compiled-routing line): the after probe shows one entry per prompt on all nine labels, so its gain is already taken. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Re-opening segment-three rank 4 (OpenCode compiled-routing line): the after probe shows one entry per prompt on all nine labels, so its gain is already taken.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-opening segment-three rank 4 (OpenCode compiled-routing line): the after probe shows one entry per prompt on all nine labels, so its gain is already taken.

### Re-ranking the OpenCode turn cap as an advisor fix: it is the arena's cap and lands in the runner, not in the brief. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Re-ranking the OpenCode turn cap as an advisor fix: it is the arena's cap and lands in the runner, not in the brief.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-ranking the OpenCode turn cap as an advisor fix: it is the arena's cap and lands in the runner, not in the brief.

### Re-running the behaviour arm to get fresh OpenCode or DSH delivery evidence: the lane forbids a live arm and no model session may start. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Re-running the behaviour arm to get fresh OpenCode or DSH delivery evidence: the lane forbids a live arm and no model session may start.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-running the behaviour arm to get fresh OpenCode or DSH delivery evidence: the lane forbids a live arm and no model session may start.

### Reading message bodies for the brief text: it is model output, and it would put prompt-adjacent text in a score log. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Reading message bodies for the brief text: it is model output, and it would put prompt-adjacent text in a score log.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading message bodies for the brief text: it is model output, and it would put prompt-adjacent text in a score log.

### Rebuilding the stale `@spec-kit/cli` dist to make that script pass: a build writes outside this lineage, and the lane forbids it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Rebuilding the stale `@spec-kit/cli` dist to make that script pass: a build writes outside this lineage, and the lane forbids it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Rebuilding the stale `@spec-kit/cli` dist to make that script pass: a build writes outside this lineage, and the lane forbids it.

### Treating the cache-hit median as the repeat cost: the repeat head is 88 bytes in the corpus, not zero, because the reduced head still carries the first line. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the cache-hit median as the repeat cost: the repeat head is 88 bytes in the corpus, not zero, because the reduced head still carries the first line.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the cache-hit median as the repeat cost: the repeat head is 88 bytes in the corpus, not zero, because the reduced head still carries the first line.

### Treating the nine probe heads as a brief-size corpus: it is a render parity probe, and KQ2 needs the full typed corpus measured. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the nine probe heads as a brief-size corpus: it is a render parity probe, and KQ2 needs the full typed corpus measured.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the nine probe heads as a brief-size corpus: it is a render parity probe, and KQ2 needs the full typed corpus measured.

### Using `emittedBytes` from health records as the brief size: 82 percent of records are zero because the advisor emitted nothing, so the positive subset is the only size signal and the typed corpus is the only clean population. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Using `emittedBytes` from health records as the brief size: 82 percent of records are zero because the advisor emitted nothing, so the positive subset is the only size signal and the typed corpus is the only clean population.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using `emittedBytes` from health records as the brief size: 82 percent of records are zero because the advisor emitted nothing, so the positive subset is the only size signal and the typed corpus is the only clean population.

### Using `summary-final-after.json` alone for delivery: it carries `deliveryUnknown` but not `briefDelivered`, so the per-runtime truth had to come from the run lines. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Using `summary-final-after.json` alone for delivery: it carries `deliveryUnknown` but not `briefDelivered`, so the per-runtime truth had to come from the run lines.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using `summary-final-after.json` alone for delivery: it carries `deliveryUnknown` but not `briefDelivered`, so the per-runtime truth had to come from the run lines.

### Using the final arm's `startedOfOffered` without removing capped rows: it mixes a model choice with a harness stop, so the judgeable denominator was rebuilt. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Using the final arm's `startedOfOffered` without removing capped rows: it mixes a model choice with a harness stop, so the judgeable denominator was rebuilt.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using the final arm's `startedOfOffered` without removing capped rows: it mixes a model choice with a harness stop, so the judgeable denominator was rebuilt.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- A per-runtime text comparison of the brief: the render probe shows the same renderer output through both channels, so no content difference exists to measure. (iteration 1)
- Re-opening segment-three rank 4 (OpenCode compiled-routing line): the after probe shows one entry per prompt on all nine labels, so its gain is already taken. (iteration 1)
- Re-running the behaviour arm to get fresh OpenCode or DSH delivery evidence: the lane forbids a live arm and no model session may start. (iteration 1)
- Treating the nine probe heads as a brief-size corpus: it is a render parity probe, and KQ2 needs the full typed corpus measured. (iteration 1)
- Using `summary-final-after.json` alone for delivery: it carries `deliveryUnknown` but not `briefDelivered`, so the per-runtime truth had to come from the run lines. (iteration 1)
- Measuring a new cold-daemon first prompt: that needs a fresh socket and a live arm-like start. The phase 010 figure of 742 ms (30 percent of budget) already covers it and is cited, not rerun. (iteration 2)
- Piping rows through the committed `measure-brief-cost.mjs` with the compiled dist hook: it reads `degraded_brief` on this machine, which is the exact failure phase 015 recorded, so the source handler is the only path that yields live heads without a build. (iteration 2)
- Rebuilding the stale `@spec-kit/cli` dist to make that script pass: a build writes outside this lineage, and the lane forbids it. (iteration 2)
- Treating the cache-hit median as the repeat cost: the repeat head is 88 bytes in the corpus, not zero, because the reduced head still carries the first line. (iteration 2)
- Using `emittedBytes` from health records as the brief size: 82 percent of records are zero because the advisor emitted nothing, so the positive subset is the only size signal and the typed corpus is the only clean population. (iteration 2)
- A plugin request-flag change: 0 of 44 typed rows differ, so the flags buy nothing on the measured corpus. (iteration 3)
- Comparing rendered heads from the plugin itself: the plugin's renderer is the same shared renderer, so the CLI answer is the only place a difference could enter, and the probe found none. (iteration 3)
- Re-opening rank 6 (in-process degraded scorer) or rank 10 (intent signals): separate segment-four lanes own them. (iteration 3)
- Re-ranking the OpenCode turn cap as an advisor fix: it is the arena's cap and lands in the runner, not in the brief. (iteration 3)
- Using the final arm's `startedOfOffered` without removing capped rows: it mixes a model choice with a harness stop, so the judgeable denominator was rebuilt. (iteration 3)
- `instruction_entry` and `instruction_blob`: 0 entries for these sessions, so the injected block is not in the instruction tables either. (iteration 4)
- `part` and `message`: 0 rows for the arena session; the live table is `session_message`. (iteration 4)
- A plugin-local in-memory receipt: the arena turn ends the process, so only a durable write survives to scoring time. (iteration 4)
- A reader-only fix against `session_message`: 10 of 24 sessions would read as delivered on assistant text alone, so the check would be wrong on 14 rows and truthy on model output. (iteration 4)
- Reading message bodies for the brief text: it is model output, and it would put prompt-adjacent text in a score log. (iteration 4)

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

- Phase 015 built segment-three ranks 1, 2, 3, 4, 5, 9 and 11. Suite 183 files, 1755 passed. Floors unchanged: typed recall 24 of 44, false offers 0 of 35, eval `[160,50,21,5]`, holdout rows published 44 to 0.
- Final arm rescored with the phase 015 scorer: `claude` unsafe 0 of 0 no-changed-path, `devin` 2 and 1, `dsh` 2 and 2, `opencode` 2 and 0, `pi` 1 and 1. Codex not measurable because hooks are unapproved.
- Open limitations carried into this lane: live brief bytes not measured (T030 exited 2 with `degraded_brief`); OpenCode `deliveryUnknown` is 24; DSH has 1 unscored run; Codex 0 of 24 delivery.
- Read-only boundary: this lineage writes only inside `.../lineages/residual-limits-4/`.

### Bounded Context Snapshot

- Source pointers: `P/007-per-runtime-behaviour-proof/scratch/summary-final.json`, `P/015-health-default-and-brief-refinements/scratch/summary-final-after.json`, `P/015.../scratch/before.txt`, `P/015.../scratch/live-heads.txt`, `P/015.../scratch/render-entries-after.json`, `ADV/scripts/measure-brief-cost.mjs`, `ADV/scripts/routing-accuracy/score-command-transcripts.mjs`.
- Reuse candidates: committed capture and scoring scripts; the health record read through `advisor_status`; the committed render probes in phase 015 scratch.
- Integration points: `ADV/lib/render.ts`, `ADV/lib/skill-advisor-brief.ts`, `.opencode/plugins/system-skill-advisor.js`, `.skilled/hooks/shared/session-readers/`.
- Constraints and risks: no tracked writes; holdout text never read; no live arm or model session.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 8
- Convergence threshold: 0.05
- Per-iteration budget: 16 tool calls, 20 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Question injection surface: local `inbox.jsonl`
- Canonical pause sentinel: local `.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Current generation: 1
- Started: 2026-11-13T12:45:00Z

---
title: Deep Research Strategy - offer-reach-3
description: Segment three offer-reach lane: remaining plain tune rows after phase 012, intent-signal enrichment and re-embedding, and the degraded fallback path.
trigger_phrases:
  - "offer reach segment three strategy"
importance_tier: normal
contextType: planning
version: 1.0.0
---

# Deep Research Strategy - offer-reach-3

## 1. OVERVIEW

### Purpose

Persistent brain for the segment-three `offer-reach-3` fan-out lineage. Tracks what is left of the plain command-offer bottleneck after phases 011, 012 and 013, and the fallback path.

### Usage

- Read at every iteration before any research action.
- Machine-owned sections are rewritten by the reducer after each iteration; this file is not edited by the research agent.

---

## 2. TOPIC

SEGMENT THREE offer-reach lane. Phases 011, 012 and 013 are built and committed. Find what still limits command surfacing, measured from the built state. Lane owns (a) which plain tune rows of `command-prompts.jsonl` still get no command after phase 012 and why, by row id, with the cause named per row (no command evidence, hub defers, below threshold, policy or cap, wrong top); and (b) intent-signal enrichment and re-embedding of the skill graph, declined in segment two at rank 15: which tune rows it would move, its risk to the floors, and the cost of keeping vectors in step with the metadata. Also carried, unassigned to a lane: (g) the degraded fallback path when the advisor daemon is unreachable, which runtimes hit it, how often, and the smallest change that makes the fallback carry the same command as the live answer. Floors: typed recall 24 of 44, false offers 0 of 35, scorer eval [160,50,21,5].

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which plain tune rows of command-prompts.jsonl still get no command after phase 012, and what is the cause per row id?
- [x] Would intent-signal enrichment and re-embedding of the skill graph move the remaining plain tune rows, and at what risk to the floors?
- [x] What does keeping the embedding vectors in step with the metadata cost, and how is drift detected?
- [x] Which runtimes hit the degraded fallback path in practice, and how often?
- [x] What is the smallest change that makes the fallback answer carry the same command as the live answer?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Re-recommending anything already ranked, built, declined or eliminated in segment one (`research.md` plus the 009 `spec.md` dispositions) or segment two (`research-segment-2.md` sections 3 and 4). Reopen only with a new measurement that changes the disposition, naming the rank and the measurement.
- Renaming an operator-facing command.
- Starting any model CLI session, arena, daemon or Ollama server.
- Reading holdout row prompt text or `holdout-prompts.jsonl`.
- Editing any file outside this lineage directory.

---

## 5. STOP CONDITIONS

- Convergence at newInfoRatio 0.05 or below on two consecutive iterations, or 6 iterations, whichever comes first.
- Both lane questions (a) and (b) answered with command output or file:line evidence, plus a named measurable recommendation each.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which plain tune rows of command-prompts.jsonl still get no command after phase 012, and what is the cause per row id?
- Would intent-signal enrichment and re-embedding of the skill graph move the remaining plain tune rows, and at what risk to the floors?
- What does keeping the embedding vectors in step with the metadata cost, and how is drift detected?
- Which runtimes hit the degraded fallback path in practice, and how often?
- What is the smallest change that makes the fallback answer carry the same command as the live answer?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- calling the live recommend path per row turned a misleading aggregate into a per-row cause table, and reading the renderer explained why one of those rows still loses its command despite the route resolving correctly. (iteration 1)
- running the real-embedding capture against the already-running server turned a declined hypothesis into a bounded measurement, and diffing `top1` per row showed that the five moved rows were already reachable. (iteration 2)
- reading the CLI's own fallback branch explained the exact loss (a deliberate collapse of untyped rows), which a black-box comparison alone would have shown only as a symptom. (iteration 3)
- reading the two winning tune prompts against the alias classes produced an exact, low-risk edit rather than a general "improve the hub vocabulary" recommendation. (iteration 4)
- running the silent rows turned the floor from an aggregate into three named rows with score margins, which is what an implementing phase can check. (iteration 5)
- mapping each cause to a candidate forced the ranking to cover all 17 rows instead of the three most visible ones. (iteration 6)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the committed capture's `offered` field looked like the answer and is not, because it counts bridge-row reach rather than the rendered head; the first pass classified rows by `offered` and had to be redone. (iteration 1)
- the first pass compared `top` ids across the two captures and read one loss that was not there; `top1` is the field that matches the metric, and the id strings differ by mapping table. (iteration 2)
- the first sandbox probe used a directory inside this lineage and died on Darwin's socket-path limit, which hid the fallback behind a different failure; a loopback endpoint isolated the intended path. (iteration 3)
- ranking candidate 2 first on row count ignored that five of its rows need scoring evidence and it carries the only real floor risk; expected gain per unit of risk puts the two-row alias first. (iteration 4)
- the first canary count checked only the `none` split and missed that a busy tune row shares the word `rewrite`; reading the neighbouring tune prompts caught it. (iteration 5)
- earlier iterations quoted 23, 27 and 28 without a shared definition, which read as disagreement; the model now assigns one definition per number. (iteration 6)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `cmd-create-skill-parent-plain-tune-01`: no scorer row and no hub route, so no command can attach without new evidence; it is an alias or scorer-row question, not a table edit. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `cmd-create-skill-parent-plain-tune-01`: no scorer row and no hub route, so no command can attach without new evidence; it is an alias or scorer-row question, not a table edit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `cmd-create-skill-parent-plain-tune-01`: no scorer row and no hub route, so no command can attach without new evidence; it is an alias or scorer-row question, not a table edit.

### `cmd-doctor-skill-advisor-plain-tune-01`: the command has seven subcommands and no default, so no single command can be attached without a policy decision about which subcommand a bare request means. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `cmd-doctor-skill-advisor-plain-tune-01`: the command has seven subcommands and no default, so no single command can be attached without a policy decision about which subcommand a bare request means.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `cmd-doctor-skill-advisor-plain-tune-01`: the command has seven subcommands and no default, so no single command can be attached without a policy decision about which subcommand a bare request means.

### A second rendered head for candidate 5: it costs bytes on every prompt, which is the one budget the brief cannot grow. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A second rendered head for candidate 5: it costs bytes on every prompt, which is the one budget the brief cannot grow.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A second rendered head for candidate 5: it costs bytes on every prompt, which is the one budget the brief cannot grow.

### Adding a bare `rewrite` keyword to the human-voice class. It would steal a working diff row. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Adding a bare `rewrite` keyword to the human-voice class. It would steal a working diff row.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a bare `rewrite` keyword to the human-voice class. It would steal a working diff row.

### Adding intent text to the 14 `SKILL.md` descriptions. That is an operator-facing document change in `sk-doc` scope, not a routing fix, and it changes bytes the model reads. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Adding intent text to the 14 `SKILL.md` descriptions. That is an operator-facing document change in `sk-doc` scope, not a routing fix, and it changes bytes the model reads.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding intent text to the 14 `SKILL.md` descriptions. That is an operator-facing document change in `sk-doc` scope, not a routing fix, and it changes bytes the model reads.

### Closing the fallback-frequency gap from inside the lineage: it needs a persistent counter that only a build phase can add. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Closing the fallback-frequency gap from inside the lineage: it needs a persistent counter that only a build phase can add.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Closing the fallback-frequency gap from inside the lineage: it needs a persistent counter that only a build phase can add.

### Counting the six subcommand rows as misses in the final ranking; they are reach, and only the label granularity differs. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Counting the six subcommand rows as misses in the final ranking; they are reach, and only the label granularity differs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting the six subcommand rows as misses in the final ranking; they are reach, and only the label granularity differs.

### Counting the whole top three as "offered". The renderer emits one head plus an optional doctor `Also:` line, so a rank-2 command is invisible in 16 of the 17 no-command rows. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Counting the whole top three as "offered". The renderer emits one head plus an optional doctor `Also:` line, so a rank-2 command is invisible in 16 of the 17 no-command rows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting the whole top three as "offered". The renderer emits one head plus an optional doctor `Also:` line, so a rank-2 command is invisible in 16 of the 17 no-command rows.

### Estimating candidate 2's new scores without writing the anchors: no read-only switch scores a hypothetical anchor set, so the band is stated as a constraint on the implementing phase, not a predicted number. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Estimating candidate 2's new scores without writing the anchors: no read-only switch scores a hypothetical anchor set, so the band is stated as a constraint on the implementing phase, not a predicted number.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Estimating candidate 2's new scores without writing the anchors: no read-only switch scores a hypothetical anchor set, so the band is stated as a constraint on the implementing phase, not a predicted number.

### Measuring an enriched re-embedding without writing vectors. No read-only switch composes the enrichment, so the only honest statement is the bounded projection in finding 9. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Measuring an enriched re-embedding without writing vectors. No read-only switch composes the enrichment, so the only honest statement is the bounded projection in finding 9.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Measuring an enriched re-embedding without writing vectors. No read-only switch composes the enrichment, so the only honest statement is the bounded projection in finding 9.

### Measuring candidate 1 with a whole-file alias rewrite. The two exact phrases are isolated, so a narrower edit carries the same gain with no canary exposure. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Measuring candidate 1 with a whole-file alias rewrite. The two exact phrases are isolated, so a narrower edit carries the same gain with no canary exposure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Measuring candidate 1 with a whole-file alias rewrite. The two exact phrases are isolated, so a narrower edit carries the same gain with no canary exposure.

### Measuring OpenCode's degraded path: no delivery marker exists for the committed arm. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Measuring OpenCode's degraded path: no delivery marker exists for the committed arm.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Measuring OpenCode's degraded path: no delivery marker exists for the committed arm.

### Measuring the fallback rate from committed artifacts: no counter exists outside debug mode, so any frequency claim beyond the recorded arms would be invented. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Measuring the fallback rate from committed artifacts: no counter exists outside debug mode, so any frequency claim beyond the recorded arms would be invented.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Measuring the fallback rate from committed artifacts: no counter exists outside debug mode, so any frequency claim beyond the recorded arms would be invented.

### Proving candidate 1's gain by editing the router: out of scope for this lineage. The compiled-route probe on the current wording plus the alias-class read is the strongest available evidence. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Proving candidate 1's gain by editing the router: out of scope for this lineage. The compiled-route probe on the current wording plus the alias-class read is the strongest available evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Proving candidate 1's gain by editing the router: out of scope for this lineage. The compiled-route probe on the current wording plus the alias-class read is the strongest available evidence.

### Proving candidate 4's gain without the code change: the daemon path cannot be forced through `runLocalScorer` without an unreachable endpoint, and the Python branch is what answers there. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Proving candidate 4's gain without the code change: the daemon path cannot be forced through `runLocalScorer` without an unreachable endpoint, and the Python branch is what answers there.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Proving candidate 4's gain without the code change: the daemon path cannot be forced through `runLocalScorer` without an unreachable endpoint, and the Python branch is what answers there.

### Re-recommending the capture `offered` relabel. Phase 013 already built it and the remaining risk is a reader trusting the field, which iteration 1 documented. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Re-recommending the capture `offered` relabel. Phase 013 already built it and the remaining risk is a reader trusting the field, which iteration 1 documented.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-recommending the capture `offered` relabel. Phase 013 already built it and the remaining risk is a reader trusting the field, which iteration 1 documented.

### Reading the committed `attachedMetrics.plain.tune` line as a brief-offer count. It measures expected-command reach through scorer row ids and hub attach at capture time; the live head disagrees on six rows, so it cannot enumerate the rows this iteration asks about. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:491] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading the committed `attachedMetrics.plain.tune` line as a brief-offer count. It measures expected-command reach through scorer row ids and hub attach at capture time; the live head disagrees on six rows, so it cannot enumerate the rows this iteration asks about. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:491]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the committed `attachedMetrics.plain.tune` line as a brief-offer count. It measures expected-command reach through scorer row ids and hub attach at capture time; the live head disagrees on six rows, so it cannot enumerate the rows this iteration asks about. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:491]

### Reopening rank 15 on the real-embedder numbers alone. The +5 tune rows are top-1 exactness on rows that already carried a command; they do not move a single no-command row, so the disposition does not change. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Reopening rank 15 on the real-embedder numbers alone. The +5 tune rows are top-1 exactness on rows that already carried a command; they do not move a single no-command row, so the disposition does not change.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reopening rank 15 on the real-embedder numbers alone. The +5 tune rows are top-1 exactness on rows that already carried a command; they do not move a single no-command row, so the disposition does not change.

### Reopening rank 15 on this evidence. The measured brief-level gain is zero. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Reopening rank 15 on this evidence. The measured brief-level gain is zero.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reopening rank 15 on this evidence. The measured brief-level gain is zero.

### Reporting a single "plain recall" number without its definition. The four numbers differ by metric and regime, and quoting one alone would misstate the built state. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Reporting a single "plain recall" number without its definition. The four numbers differ by metric and regime, and quoting one alone would misstate the built state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reporting a single "plain recall" number without its definition. The four numbers differ by metric and regime, and quoting one alone would misstate the built state.

### Reusing `degradedRecommendations` alone. It has no command to preserve on an untyped prompt: the Python rows name bridge ids that the function intentionally reduces to their owner skill, so keeping the fields would still not produce the live command or the live skill. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Reusing `degradedRecommendations` alone. It has no command to preserve on an untyped prompt: the Python rows name bridge ids that the function intentionally reduces to their owner skill, so keeping the fields would still not produce the live command or the live skill.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing `degradedRecommendations` alone. It has no command to preserve on an untyped prompt: the Python rows name bridge ids that the function intentionally reduces to their owner skill, so keeping the fields would still not produce the live command or the live skill.

### Treating candidate 2 as one change: its six rows split into five anchor rows and one missing-scorer-row row, with different files and different risk. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating candidate 2 as one change: its six rows split into five anchor rows and one missing-scorer-row row, with different files and different risk.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating candidate 2 as one change: its six rows split into five anchor rows and one missing-scorer-row row, with different files and different risk.

### Treating Codex as a degraded-path runtime. Its hook never runs on this checkout (unapproved), so its failure is a missing brief, a different defect with a different fix. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating Codex as a degraded-path runtime. Its hook never runs on this checkout (unapproved), so its failure is a missing brief, a different defect with a different fix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Codex as a degraded-path runtime. Its hook never runs on this checkout (unapproved), so its failure is a missing brief, a different defect with a different fix.

### Treating cold start as a degraded-path trigger. The `--no-warm-only` flag and the 008 measurement rule it out. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating cold start as a degraded-path trigger. The `--no-warm-only` flag and the 008 measurement rule it out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating cold start as a degraded-path trigger. The `--no-warm-only` flag and the 008 measurement rule it out.

### Treating the 0 of 35 floor as the whole risk test for candidate 2. The three doctor-top rows are the ones that move first, and the aggregate would only show the failure after the fact. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating the 0 of 35 floor as the whole risk test for candidate 2. The three doctor-top rows are the ones that move first, and the aggregate would only show the failure after the fact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the 0 of 35 floor as the whole risk test for candidate 2. The three doctor-top rows are the ones that move first, and the aggregate would only show the failure after the fact.

### Treating the 4 needs-mode rows as fixable recall. They are a deliberate ask, and forcing a command on them would repeat the eliminated "default command for a deferring hub" item. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating the 4 needs-mode rows as fixable recall. They are a deliberate ask, and forcing a command on them would repeat the eliminated "default command for a deferring hub" item.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the 4 needs-mode rows as fixable recall. They are a deliberate ask, and forcing a command on them would repeat the eliminated "default command for a deferring hub" item.

### Treating the fixture capture's 23 and the real capture's 28 as a before/after pair. They are two scoring regimes at one commit. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the fixture capture's 23 and the real capture's 28 as a before/after pair. They are two scoring regimes at one commit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the fixture capture's 23 and the real capture's 28 as a before/after pair. They are two scoring regimes at one commit.

### Treating the six subcommand differences as wrong offers. All six are the expected command's own documented subcommand, so they are label granularity in the corpus, not a routing error. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:74] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the six subcommand differences as wrong offers. All six are the expected command's own documented subcommand, so they are label granularity in the corpus, not a routing error. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:74]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the six subcommand differences as wrong offers. All six are the expected command's own documented subcommand, so they are label granularity in the corpus, not a routing error. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:74]

### Using the holdout delta (1 to 3 of 44) as evidence for enrichment: it is the same real-embedder effect, and holdout prompt text was not read. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Using the holdout delta (1 to 3 of 44) as evidence for enrichment: it is the same real-embedder effect, and holdout prompt text was not read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using the holdout delta (1 to 3 of 44) as evidence for enrichment: it is the same real-embedder effect, and holdout prompt text was not read.

### Using the long lineage path as a socket dir: Darwin rejects it with exit 69 before any answer, so the probe was rerun on a loopback endpoint. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Using the long lineage path as a socket dir: Darwin rejects it with exit 69 before any answer, so the probe was rerun on a loopback endpoint.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using the long lineage path as a socket dir: Darwin rejects it with exit 69 before any answer, so the probe was rerun on a loopback endpoint.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- `cmd-create-skill-parent-plain-tune-01`: no scorer row and no hub route, so no command can attach without new evidence; it is an alias or scorer-row question, not a table edit. (iteration 1)
- `cmd-doctor-skill-advisor-plain-tune-01`: the command has seven subcommands and no default, so no single command can be attached without a policy decision about which subcommand a bare request means. (iteration 1)
- Counting the whole top three as "offered". The renderer emits one head plus an optional doctor `Also:` line, so a rank-2 command is invisible in 16 of the 17 no-command rows. (iteration 1)
- Reading the committed `attachedMetrics.plain.tune` line as a brief-offer count. It measures expected-command reach through scorer row ids and hub attach at capture time; the live head disagrees on six rows, so it cannot enumerate the rows this iteration asks about. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:491] (iteration 1)
- Treating the six subcommand differences as wrong offers. All six are the expected command's own documented subcommand, so they are label granularity in the corpus, not a routing error. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:74] (iteration 1)
- Adding intent text to the 14 `SKILL.md` descriptions. That is an operator-facing document change in `sk-doc` scope, not a routing fix, and it changes bytes the model reads. (iteration 2)
- Measuring an enriched re-embedding without writing vectors. No read-only switch composes the enrichment, so the only honest statement is the bounded projection in finding 9. (iteration 2)
- Reopening rank 15 on the real-embedder numbers alone. The +5 tune rows are top-1 exactness on rows that already carried a command; they do not move a single no-command row, so the disposition does not change. (iteration 2)
- Treating the fixture capture's 23 and the real capture's 28 as a before/after pair. They are two scoring regimes at one commit. (iteration 2)
- Using the holdout delta (1 to 3 of 44) as evidence for enrichment: it is the same real-embedder effect, and holdout prompt text was not read. (iteration 2)
- Measuring the fallback rate from committed artifacts: no counter exists outside debug mode, so any frequency claim beyond the recorded arms would be invented. (iteration 3)
- Reusing `degradedRecommendations` alone. It has no command to preserve on an untyped prompt: the Python rows name bridge ids that the function intentionally reduces to their owner skill, so keeping the fields would still not produce the live command or the live skill. (iteration 3)
- Treating Codex as a degraded-path runtime. Its hook never runs on this checkout (unapproved), so its failure is a missing brief, a different defect with a different fix. (iteration 3)
- Treating cold start as a degraded-path trigger. The `--no-warm-only` flag and the 008 measurement rule it out. (iteration 3)
- Using the long lineage path as a socket dir: Darwin rejects it with exit 69 before any answer, so the probe was rerun on a loopback endpoint. (iteration 3)
- A second rendered head for candidate 5: it costs bytes on every prompt, which is the one budget the brief cannot grow. (iteration 4)
- Proving candidate 1's gain by editing the router: out of scope for this lineage. The compiled-route probe on the current wording plus the alias-class read is the strongest available evidence. (iteration 4)
- Proving candidate 4's gain without the code change: the daemon path cannot be forced through `runLocalScorer` without an unreachable endpoint, and the Python branch is what answers there. (iteration 4)
- Re-recommending the capture `offered` relabel. Phase 013 already built it and the remaining risk is a reader trusting the field, which iteration 1 documented. (iteration 4)
- Reopening rank 15 on this evidence. The measured brief-level gain is zero. (iteration 4)
- Treating candidate 2 as one change: its six rows split into five anchor rows and one missing-scorer-row row, with different files and different risk. (iteration 4)
- Adding a bare `rewrite` keyword to the human-voice class. It would steal a working diff row. (iteration 5)
- Estimating candidate 2's new scores without writing the anchors: no read-only switch scores a hypothetical anchor set, so the band is stated as a constraint on the implementing phase, not a predicted number. (iteration 5)
- Measuring candidate 1 with a whole-file alias rewrite. The two exact phrases are isolated, so a narrower edit carries the same gain with no canary exposure. (iteration 5)
- Treating the 0 of 35 floor as the whole risk test for candidate 2. The three doctor-top rows are the ones that move first, and the aggregate would only show the failure after the fact. (iteration 5)
- Closing the fallback-frequency gap from inside the lineage: it needs a persistent counter that only a build phase can add. (iteration 6)
- Counting the six subcommand rows as misses in the final ranking; they are reach, and only the label granularity differs. (iteration 6)
- Measuring OpenCode's degraded path: no delivery marker exists for the committed arm. (iteration 6)
- Reporting a single "plain recall" number without its definition. The four numbers differ by metric and regime, and quoting one alone would misstate the built state. (iteration 6)
- Treating the 4 needs-mode rows as fixable recall. They are a deliberate ask, and forcing a command on them would repeat the eliminated "default command for a deferring hub" item. (iteration 6)

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

- `P/012-plain-offer-reach/implementation-summary.md`: plain tune 9 to 23 of 45; holdout plain 1 of 44; floors typed 24/44, false offers 0/35, eval [160,50,21,5]; `needsMode` label added; OpenCode plugin mapper dropped command/policy at the time of 012.
- `P/013-attribution-and-install-reach/implementation-summary.md`: brief delivery answered 119 of 144; OpenCode mapper keeps `command`, `policy`, `ownerSkillId`, `needsMode`; delivery leg in `/doctor:setup` reads DEGRADED for unapproved Codex hooks.
- `P/011-typed-command-delivery-and-guards/implementation-summary.md`: typed delivery 44/44 (24 own, 20 attached); `TRACKED_COMMANDS` table; visibility `claude 32/44, cursor 44/44`; hook health only with `SKILL_ADVISOR_DEBUG=1`.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 6
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-11-13T06:12:04Z

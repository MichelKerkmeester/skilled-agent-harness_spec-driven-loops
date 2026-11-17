---
title: Deep Research Strategy - cross-cli-3 delivery truth and command visibility
description: Segment-three cross-CLI lane: OpenCode plugin brief beside the hook brief, Claude's 32-of-44 command visibility, and whether phase 013's attribution reads true per runtime.
---

# Deep Research Strategy - cross-cli-3

## 1. OVERVIEW

### Purpose

Establish, per runtime, what each CLI actually renders into the model's context after phases 011, 012 and 013 are built: where the OpenCode plugin brief still differs from the hook brief for the same prompt, which commands each runtime's own command surface exposes to its operator, and whether the committed attribution now reports delivery truthfully on all six runtimes.

### Usage

- Reads the parent packet (`008-command-surfacing-build`), the built state of phases 011, 012 and 013 and their scratch evidence, then the code at HEAD.
- Writes only inside this lineage directory.
- Reducer owns Sections 3, 6, 7-11A.

### Question Injection Surface

`inbox.jsonl` in this lineage directory if an external question appears.

---

## 2. TOPIC
SEGMENT THREE, cross-CLI lane: after phases 011, 012 and 013 are built and committed, what still limits command surfacing across runtimes — the OpenCode plugin brief beside the hook brief, the Claude Code 32-of-44 command visibility collapse, and whether phase 013's delivery and attribution now read true per runtime.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] (d) After the plugin mapper fix, what still differs between the OpenCode plugin brief and the hook brief for the same prompt — wording, fields, order, bytes, command line, policy, fail-open path — rendered side by side from code or a renderer run?
- [x] (e) Claude Code lists 32 of 44 commands because a command file named `skill.md` collapses its folder: which options keep every operator-facing command name intact, what does each cost per runtime (claude, codex, opencode, pi, devin, dsh), and what check proves 44 of 44?
- [x] Does phase 013's delivery and attribution now read true per runtime on the committed after arm, and where does it still overstate or understate reach?
- [x] Which remaining cross-CLI gap ranks first by started-when-useful gain per unit of floor risk, and what file does each fix change?
- [x] What does the degraded (daemon-unreachable) path lose per runtime that the live path keeps, and what is the smallest change that makes the fallback carry the same command?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Re-recommending anything ranked, built, declined or eliminated in segment one (`research/research.md`, `spec.md` dispositions) or segment two (`research/research-segment-2.md` sections 3 and 4). Reopen only with a new measurement that changes a disposition, naming the rank and the measurement.
- Implementing any fix (research only).
- Offer-rate tuning for plain rows (lane `offer-reach-3`, questions a and b).
- Hook-health default and brief byte cost (lane `ux-cost-3`, questions c and f), except where a render difference changes bytes measurably.
- Starting CLI, arena or daemon sessions; starting ollama; editing anything outside this lineage.
- Reading or printing holdout prompt text from `command-prompts.jsonl`, or reading `holdout-prompts.jsonl` at all.

---

## 5. STOP CONDITIONS

- Max 6 iterations, convergence threshold 0.05 after the 3-iteration floor.
- Stop early only at legal convergence; record the reason in research.md.
- No writes outside this lineage directory; spec.md writeback and continuity save are deferred and recorded as scope decisions.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- (d) After the plugin mapper fix, what still differs between the OpenCode plugin brief and the hook brief for the same prompt — wording, fields, order, bytes, command line, policy, fail-open path — rendered side by side from code or a renderer run?
- (e) Claude Code lists 32 of 44 commands because a command file named `skill.md` collapses its folder: which options keep every operator-facing command name intact, what does each cost per runtime (claude, codex, opencode, pi, devin, dsh), and what check proves 44 of 44?
- Does phase 013's delivery and attribution now read true per runtime on the committed after arm, and where does it still overstate or understate reach?
- Which remaining cross-CLI gap ranks first by started-when-useful gain per unit of floor risk, and what file does each fix change?
- What does the degraded (daemon-unreachable) path lose per runtime that the live path keeps, and what is the smallest change that makes the fallback carry the same command?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- feeding the plugin the real CLI payload through its own `spawnOverride`, then rendering the same prompt through the hook's own reader function, removed both the network and the fixture as variables. That is why the byte-identical result is trustworthy: two different callers, one payload, one renderer. (iteration 1)
- running the committed check first made the per-folder arithmetic undeniable, and counting resolution per runtime turned "Claude is different" into "Claude is the only tree that mirrors folders". The g5 file supplied the mechanism without a new model run. (iteration 2)
- counting the field straight from the JSONL rather than trusting the summary caught the DSH row the summary cannot see. The summary is a view over scored rows, and one delivery fact lives on an unscored row. (iteration 3)
- capturing every system entry rather than the first turned "there is an extra line" into "561 bytes over nine prompts, 7 of 9". The ranking needed a number, not an observation. (iteration 4)
- calling the two functions the fallback itself calls, with the same scorer subprocess, reproduced the degraded answer without a daemon and let the loss be attributed to the shaper rather than the scorer. Running `compiled-route.cjs` beside it proved the missing target is already available offline. (iteration 5)
- reading the floor runner rather than re-running it turned a risk claim into a file-to-file trace, and it took one read instead of a build plus two captures. (iteration 6)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the first probe run happened under `AI_SESSION_CHILD=1` and both paths printed `parent-named only`, which would have hidden a policy-word difference. Re-running with the marker unset was necessary to see `(start)`. (iteration 1)
- the first resolution count read 45/45 everywhere including Claude, because it tested file existence rather than the resolved command name. Claude has all 45 files on disk; it just does not show them. Existence is not visibility. (iteration 2)
- my first per-runtime filter compared a boolean to the string `"true"`, so it printed every DSH row. The second pass selected on the string `unknown` and found the one row immediately. (iteration 3)
- the first attempt at that capture edited the earlier script by string replacement and broke it. A fresh script with the same stub was faster than repairing the edit. (iteration 4)
- the first attempt to price the compiled-route block by editing the earlier probe broke the script; a fresh file was faster. The grep for `~/.pi` initially read 523 stale files, which looked alarming until the count was scoped to the arm date and fell to zero. (iteration 5)
- iteration 2's answered-question text dropped the backticks around `skill.md`, so the reducer's exact-match tick skipped it. The lesson is mechanical: copy the strategy line, never retype it. (iteration 6)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Building a reader for `effectiveThresholds` in the plugin. No override exists in the tree; the restraint rule says not to build for a hypothetical. Recorded as a latent hazard in iteration 1 finding 4 instead. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Building a reader for `effectiveThresholds` in the plugin. No override exists in the tree; the restraint rule says not to build for a hypothetical. Recorded as a latent hazard in iteration 1 finding 4 instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building a reader for `effectiveThresholds` in the plugin. No override exists in the tree; the restraint rule says not to build for a hypothetical. Recorded as a latent hazard in iteration 1 finding 4 instead.

### Comparing against the `~/.claude` transcript brief. That is a delivered brief after host formatting, so a difference could be the host rather than the caller. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Comparing against the `~/.claude` transcript brief. That is a delivered brief after host formatting, so a difference could be the host rather than the caller.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Comparing against the `~/.claude` transcript brief. That is a delivered brief after host formatting, so a difference could be the host rather than the caller.

### Counting the private root command in the 44. `local-skilled-alignment.md` is untracked and outside the foldered set; including it would change every published number. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Counting the private root command in the 44. `local-skilled-alignment.md` is untracked and outside the foldered set; including it would change every published number.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting the private root command in the 44. `local-skilled-alignment.md` is untracked and outside the foldered set; including it would change every published number.

### Looking for a runtime that already solves this by a second namespace: none of the six has a folder-plus-`skill.md` layout, because only Claude mirrors the canonical folder structure. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Looking for a runtime that already solves this by a second namespace: none of the six has a folder-plus-`skill.md` layout, because only Claude mirrors the canonical folder structure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a runtime that already solves this by a second namespace: none of the six has a folder-plus-`skill.md` layout, because only Claude mirrors the canonical folder structure.

### Looking for a wording or field difference in the head: there is none left after the mapper fix. Any further gain in this area is in the extra block, the channel, or the threshold source, not in the brief text. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Looking for a wording or field difference in the head: there is none left after the mapper fix. Any further gain in this area is in the extra block, the channel, or the threshold source, not in the brief text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a wording or field difference in the head: there is none left after the mapper fix. Any further gain in this area is in the extra block, the channel, or the threshold source, not in the brief text.

### Looking for an OpenCode-side fallback record: the plugin's answer is in memory only, so a degraded OpenCode prompt leaves no trace at all. Its rate can only be inferred from an operator's own session, never from an arm. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Looking for an OpenCode-side fallback record: the plugin's answer is in memory only, so a degraded OpenCode prompt leaves no trace at all. Its rate can only be inferred from an operator's own session, never from an arm.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an OpenCode-side fallback record: the plugin's answer is in memory only, so a degraded OpenCode prompt leaves no trace at all. Its rate can only be inferred from an operator's own session, never from an arm.

### None. The floor-input trace is short and conclusive. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: None. The floor-input trace is short and conclusive.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. The floor-input trace is short and conclusive.

### Pricing rank 2 by tokens rather than bytes: at four characters per token the block is 18-21 tokens, which no cap binds; the gain is parity and noise, not budget. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Pricing rank 2 by tokens rather than bytes: at four characters per token the block is 18-21 tokens, which no cap binds; the gain is parity and noise, not budget.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Pricing rank 2 by tokens rather than bytes: at four characters per token the block is 18-21 tokens, which no cap binds; the gain is parity and noise, not budget.

### Putting the `create` skill in the canonical `.skilled/skills` tree. It would add a fifteenth skill to every runtime and to the advisor graph, which is the one route by which rank 1 could move the floors. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Putting the `create` skill in the canonical `.skilled/skills` tree. It would add a fifteenth skill to every runtime and to the advisor graph, which is the one route by which rank 1 could move the floors.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Putting the `create` skill in the canonical `.skilled/skills` tree. It would add a fifteenth skill to every runtime and to the advisor graph, which is the one route by which rank 1 could move the floors.

### Re-running the arm to answer OpenCode delivery. The brief never becomes a session part, so a rerun would produce the same 24 `unknown`; the only fix is a written marker, which the phase deliberately declined because a plugin-written marker proves the plugin ran, not that the host delivered. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Re-running the arm to answer OpenCode delivery. The brief never becomes a session part, so a rerun would produce the same 24 `unknown`; the only fix is a written marker, which the phase deliberately declined because a plugin-written marker proves the plugin ran, not that the host delivered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-running the arm to answer OpenCode delivery. The brief never becomes a session part, so a rerun would produce the same 24 `unknown`; the only fix is a written marker, which the phase deliberately declined because a plugin-written marker proves the plugin ran, not that the host delivered.

### Reading `briefDelivered: true` as obedience. It is a delivery fact; every start rate in this iteration is computed from the scorer's own start rows. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Reading `briefDelivered: true` as obedience. It is a delivery fact; every start rate in this iteration is computed from the scorer's own start rows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading `briefDelivered: true` as obedience. It is a delivery fact; every start rate in this iteration is computed from the scorer's own start rows.

### Rendering the plugin brief from a fixture alone. The committed probe offered a fixture case, but the mapper fix is only proven against a real CLI payload, so the nine-prompt real run carried the conclusion and the fixture was used only as a control. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Rendering the plugin brief from a fixture alone. The committed probe offered a fixture case, but the mapper fix is only proven against a real CLI payload, so the nine-prompt real run carried the conclusion and the fixture was used only as a control.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Rendering the plugin brief from a fixture alone. The committed probe offered a fixture case, but the mapper fix is only proven against a real CLI payload, so the nine-prompt real run carried the conclusion and the fixture was used only as a control.

### Running the floor scripts to re-measure. They write into the phase scratch directories, which are outside this lineage; the committed after files are the evidence, and the input trace answers the risk question without a run. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Running the floor scripts to re-measure. They write into the phase scratch directories, which are outside this lineage; the committed after files are the evidence, and the input trace answers the risk question without a run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Running the floor scripts to re-measure. They write into the phase scratch directories, which are outside this lineage; the committed after files are the evidence, and the input trace answers the risk question without a run.

### Starting a daemon or a second socket directory to measure the fallback live. The reproduction above reaches the same two functions without one, and a second daemon is forbidden in this lane. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Starting a daemon or a second socket directory to measure the fallback live. The reproduction above reaches the same two functions without one, and a second daemon is forbidden in this lane.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Starting a daemon or a second socket directory to measure the fallback live. The reproduction above reaches the same two functions without one, and a second daemon is forbidden in this lane.

### Treating the 012 note as the current behaviour. Two of its three claims do not reproduce at HEAD, and the third (mode label and doctor hand-off lost) does. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating the 012 note as the current behaviour. Two of its three claims do not reproduce at HEAD, and the third (mode label and doctor hand-off lost) does.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the 012 note as the current behaviour. Two of its three claims do not reproduce at HEAD, and the third (mode label and doctor hand-off lost) does.

### Treating the cursor 44/44 line as proof for all runtimes. It is computed as `visible = total` for cursor regardless of tree content, so it proves the cursor path only. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the cursor 44/44 line as proof for all runtimes. It is computed as `visible = total` for cursor regardless of tree content, so it proves the cursor path only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the cursor 44/44 line as proof for all runtimes. It is computed as `visible = total` for cursor regardless of tree content, so it proves the cursor path only.

### Treating the missing tick on (e) as a research gap. It is an exact-match bookkeeping difference — the record omitted the backticks around `skill.md` — and is corrected by this iteration's record, not by new evidence. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating the missing tick on (e) as a research gap. It is an exact-match bookkeeping difference — the record omitted the backticks around `skill.md` — and is corrected by this iteration's record, not by new evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the missing tick on (e) as a research gap. It is an exact-match bookkeeping difference — the record omitted the backticks around `skill.md` — and is corrected by this iteration's record, not by new evidence.

### Trying to derive the DSH unknown from the store: the row has no session id, so there is nothing to open. The row needs the runner to record a session id, not the reader to guess one. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Trying to derive the DSH unknown from the store: the row has no session id, so there is nothing to open. The row needs the runner to record a session id, not the reader to guess one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Trying to derive the DSH unknown from the store: the row has no session id, so there is nothing to open. The row needs the runner to record a session id, not the reader to guess one.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Comparing against the `~/.claude` transcript brief. That is a delivered brief after host formatting, so a difference could be the host rather than the caller. (iteration 1)
- Looking for a wording or field difference in the head: there is none left after the mapper fix. Any further gain in this area is in the extra block, the channel, or the threshold source, not in the brief text. (iteration 1)
- Rendering the plugin brief from a fixture alone. The committed probe offered a fixture case, but the mapper fix is only proven against a real CLI payload, so the nine-prompt real run carried the conclusion and the fixture was used only as a control. (iteration 1)
- Counting the private root command in the 44. `local-skilled-alignment.md` is untracked and outside the foldered set; including it would change every published number. (iteration 2)
- Looking for a runtime that already solves this by a second namespace: none of the six has a folder-plus-`skill.md` layout, because only Claude mirrors the canonical folder structure. (iteration 2)
- Treating the cursor 44/44 line as proof for all runtimes. It is computed as `visible = total` for cursor regardless of tree content, so it proves the cursor path only. (iteration 2)
- Re-running the arm to answer OpenCode delivery. The brief never becomes a session part, so a rerun would produce the same 24 `unknown`; the only fix is a written marker, which the phase deliberately declined because a plugin-written marker proves the plugin ran, not that the host delivered. (iteration 3)
- Reading `briefDelivered: true` as obedience. It is a delivery fact; every start rate in this iteration is computed from the scorer's own start rows. (iteration 3)
- Trying to derive the DSH unknown from the store: the row has no session id, so there is nothing to open. The row needs the runner to record a session id, not the reader to guess one. (iteration 3)
- Building a reader for `effectiveThresholds` in the plugin. No override exists in the tree; the restraint rule says not to build for a hypothetical. Recorded as a latent hazard in iteration 1 finding 4 instead. (iteration 4)
- Pricing rank 2 by tokens rather than bytes: at four characters per token the block is 18-21 tokens, which no cap binds; the gain is parity and noise, not budget. (iteration 4)
- Putting the `create` skill in the canonical `.skilled/skills` tree. It would add a fifteenth skill to every runtime and to the advisor graph, which is the one route by which rank 1 could move the floors. (iteration 4)
- Looking for an OpenCode-side fallback record: the plugin's answer is in memory only, so a degraded OpenCode prompt leaves no trace at all. Its rate can only be inferred from an operator's own session, never from an arm. (iteration 5)
- Starting a daemon or a second socket directory to measure the fallback live. The reproduction above reaches the same two functions without one, and a second daemon is forbidden in this lane. (iteration 5)
- Treating the 012 note as the current behaviour. Two of its three claims do not reproduce at HEAD, and the third (mode label and doctor hand-off lost) does. (iteration 5)
- None. The floor-input trace is short and conclusive. (iteration 6)
- Running the floor scripts to re-measure. They write into the phase scratch directories, which are outside this lineage; the committed after files are the evidence, and the input trace answers the risk question without a run. (iteration 6)
- Treating the missing tick on (e) as a research gap. It is an exact-match bookkeeping difference — the record omitted the backticks around `skill.md` — and is corrected by this iteration's record, not by new evidence. (iteration 6)

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

Evidence pointers (read-only):

- Parent packet `008-command-surfacing-build`: `goal.md` log (after-arm numbers, phase 011/012/013 rows), `spec.md`, `decision-record.md`.
- Built state: `011-typed-command-delivery-and-guards/implementation-summary.md`, `012-plain-offer-reach/implementation-summary.md`, `013-attribution-and-install-reach/implementation-summary.md`.
- Scratch evidence: `011/scratch/{after.txt,suite-after.txt,brief-cost.json,hook-health.json,typed-heads.json}`, `012/scratch/{after-final.txt,after-final-policy.txt,live-heads.txt,chat-after.json,routes-*.tsv}`, `013/scratch/{after.txt,delivery-leg.txt,runs-post-attributed.jsonl,summary-*-after.json}`.
- Renderer and plugin: `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`, `.opencode/plugins/system-skill-advisor.js`, `.skilled/skills/system-skill-advisor/hooks/`.
- Visibility: `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`, `.skilled/commands/`, `.claude/commands/`.
- Attribution: `.skilled/hooks/shared/session-readers/`, `runtime/scripts/routing-accuracy/{command-offer.mjs,score-command-transcripts.mjs,run-command-behaviour.mjs}`.

### Bounded Context Snapshot

- Source pointers: hook renderer, OpenCode plugin mapper, per-runtime command mirror trees, session readers and the scorer.
- Reuse candidates: the committed plugin probe, the capture and floor scripts, `sync-runtime-mirrors.cjs --check`.
- Integration points: hook registration per runtime, mirror sync, brief rendering, delivery probe.
- Constraints: read-only git, no CLI sessions, no ollama, no writes outside the lineage.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 6
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-11-13T07:40:00.000Z

---
title: "Cross-CLI lane, segment five: what the 033 arm can and cannot say per runtime"
description: "Detached deep-research lineage cross-cli-5 on the built state after phases 016 to 033 at HEAD 84de3d600fa: per-runtime delivery, follow-through and reader gaps on claude, codex, opencode, pi, devin and dsh."
trigger_phrases:
  - "command surfacing cross-cli segment five"
  - "033 untuned arm reader gaps"
---

# Cross-CLI lane, segment five

Detached research lineage `cross-cli-5`, run 2026-11-16 against HEAD `84de3d600fa`, eight iterations, executor `opencode-go/deepseek-v4.1-flash` at max effort through `cli-opencode`, convergence threshold 0.05 in default mode. Read-only: every finding comes from `033-untuned-arm-arena-run/scratch/`, the phase 033 step reader, the decision record and the scorer code at HEAD. No tracked file outside this lineage directory was edited.

## 1. What this lane set out to answer

The lane's subject was not "which runtime is best" but "what can this arm say about each runtime, and where does the instrument rather than the runtime set the limit". Phase 033 scored one untuned arm on five runtimes and returned `not shown` on a pooled p of 0.0769; this lane asked whether the per-runtime numbers under that verdict are comparable quantities.

The short answer: only partly. The arm's two headline measures, `followed` and `started`, are both pre-write document-access tests, and three of its per-runtime columns mix causes. Four of the seven items this lane ranks are instrument fixes, not product fixes, because the instrument is what moves a printed number fastest at this sample size.

## 2. What the arm actually measures

**`followed` is a document-access test.** `workflowPath` returns `command` when `followedBeforeWrite` finds a read of the command's document before the first write, and its own contract says "The measure asks whether a run opened a workflow before it acted, not whether it followed each step, so one load decides the path." [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1300-1341] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1182-1212]

**`started` is the same test without the write.** `startState` sets `started` from a document read, a reported `COMMAND:` line or a host expansion, and never consults a write boundary. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1477-1493] A second function, `startedCommand`, requires a write boundary before a read counts on a decline or skill-only row, so the same transcript can be a start under the start rate and not under the decline count. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1424-1441]

**The step-level counterpart exists once.** Phase 033's step reader graded 20 sessions across five runtimes against their command documents and printed `TOTAL setup=15/20 folder=12/20 output=4/20`. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/step-reader/report.txt:81]

| Runtime | arm followed off → on | step setup (of 4) | step folder (of 4) | step output (of 4) |
|---|---|---|---|---|
| claude | 4 of 28 → 6 of 28 | 3 | 3 | 2 |
| opencode | 11 of 28 → 13 of 28 | 3 | 2 | 1 |
| pi | 13 of 28 → 14 of 28 | 4 | 3 | 0 |
| devin | 24 of 28 → 24 of 28 | 2 | 2 | 1 |
| dsh | 18 of 28 → 23 of 28 | 3 | 2 | 0 |

Sources: arm followed rates from `scratch/summary-arm.json`; step counts from the 20 blocks of `scratch/step-reader/report.txt`. The order inverts: Pi leads on setup and is last on output, Devin leads the arm's followed rate and lands one of four outputs, and the two tables sample different rows, so neither corrects the other.

## 3. Delivery per runtime

`briefDelivered` answers per runtime as follows: claude reads one fixed hook attachment event in the transcript; pi, devin and dsh read the session store for a brief record or an injected block; codex returns `false` unread when its hook is unapproved and `unknown` when the store does not carry the brief; opencode has no branch and falls through to `unknown`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:239-303] The docstring is explicit that OpenCode's plugin "adds the brief in memory and the store keeps no copy". [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:220-229]

The cost is larger than a blank column. The offer-reached tally excludes an offer only when delivery is exactly `false`, so `unknown` is counted as reached. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2351-2353] The four runtimes with a reader each read `offerReached` 0 of 5 off and 5 of 5 on; opencode reads 5 of 5 in both arms. Its off-arm counterfactual — the five offers a switched-off plugin could not have delivered — is credited as reached.

Codex is not a reader gap. The runner refuses the whole arm before any turn when the project hook is unapproved, with `codex-hooks-unapproved` and `measurable: false`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1473-1488] Q075 is the operator's decision to leave it out. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/decision-record.md:1486-1499]

## 4. The ask path

The ask path accepts two transcript shapes: a `COMMAND:` line in the state `offered`, or a final assistant text containing `?` and a token naming the expected command. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1283-1296] Across five runtimes and two arms the classification fired once (claude, off), while each runtime carries five ask-policy rows per arm.

The single decline-row violation, dsh on `fresh-decline-refusal-02`, is an outcome difference rather than a representation loss. The head offered `/deep:review` with policy `ask`, `briefDelivered` is true on both on-arm runs, `changedPaths` is empty on both, the session text carries twelve `COMMAND: [/deep:review] → declined` lines, and `/create:sk-skill` was counted as the start. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/dsh.jsonl]

## 5. The two columns that mix causes

**`capped` means two different things.** It is true for exit 143 or for exit `null`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2035-2038] In 033, OpenCode's 26 capped lines are all exit 143 (15 off, 11 on); Devin's 19 are all exit `null` (10 off, 9 on); Pi has 2 off and 0 on; Claude and DSH have none. [INFERENCE: counted over the deduplicated run lines] Seventeen of Devin's 19 carry `restored: true` with no changed paths, so the missing exit code alone labels them capped. A capped start row leaves the start-rate denominator, so Devin's printed start rate rests on 11 and 12 judgeable rows of 15 for that reason alone. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2376-2383]

**The offer field is a replay.** `replayOffer` spawns the checkout's own hook after every turn in both arms, and the comment says why: "The head the reader saw is the only place the offer was named, and not every runtime keeps it, so the offer is replayed after the turn." [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1368-1372] All 400 deduplicated run lines carry an offer answer and none carries an `offerError`. The only cross-check is `offerSeen`, the model's own `COMMAND:` line, which reads 0/0/1/3/2 off and 0/2/1/3/7 on across claude, opencode, pi, devin and dsh.

**A row the runner calls unmeasurable is scored.** The scorer never reads `restored` or `headMoved`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1998-1999] `reruns.txt` calls the `fresh-skill-04` rows unmeasurable after they rebased the arena; on devin and dsh they are nevertheless counted, and dsh's carries exit 0 so it passes every filter.

**Claude carries a second rule book.** `~/.claude/CLAUDE.md` is a symlink to a 27,730-byte `AGENTS.md`, and the runner reads `CLAUDE_CONFIG_DIR` only to find the projects folder rather than isolating the turn. [SOURCE: /Users/michelkerkmeester/.claude/CLAUDE.md] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:466] The arena's own `CLAUDE.md` is the single line `@AGENTS.md`, git-excluded. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:518-526] Against the 306-byte median brief, Claude's arms each carry about ninety times as much un-isolated rules text.

## 6. Answers to the lane's questions

| Question | Answer |
|---|---|
| (a) Why does follow-through vary so widely per runtime, and which part is a runner artifact? | The spread is document access, not execution. The step reader gives the execution counterpart at 4 of 20 outputs and inverts the runtime order. The runner artifacts are the cap (OpenCode 8 of 15 start rows lost off, 5 on) and the exit-null "cap" (Devin 10 and 9). |
| (b) What does OpenCode's unknown cost, and is a receipt the smallest fix? | It costs 80 delivery rows plus the off-arm counterfactual on 5 offered rows, because unknown counts as reached. A receipt is necessary but not sufficient: the reader branch and the test at `command-offer.vitest.ts:259-265` must move with it. |
| (c) Which runtimes have a reader or attribution gap? | OpenCode structurally; Codex by arm refusal; Devin and DSH one unplaceable offer row each; and all five by the replay-only offer field. |
| (d) What decides whether an ask offer is representable per runtime? | Two transcript shapes only. The dsh decline start is a policy outcome with the offer represented and declined twelve times; the reader loses nothing there. |
| (e) Which cross-CLI gap ranks first? | The OpenCode receipt plus reader branch, ranked by measurement restored rather than claimed start gain, because no per-runtime start interval separates at 15 rows. |

## 7. Ranked recommendations

Ordered by measurement restored per unit of floor risk. The floors are typed recall 24 of 44, false offers 0 of 35 and the three doctor-family floor rows; none of items 1 to 6 touches a command, a vector, a brief byte or a scoring input.

| Rank | Recommendation | Files | What it restores | Confirming check |
|---|---|---|---|---|
| 1 | Prompt-free OpenCode delivery receipt plus the reader branch | `.opencode/plugins/system-skill-advisor.js` (after the emitted-block observer), `command-offer.mjs` `briefDelivered`, `command-offer.vitest.ts:259-265` | 80 delivery rows answered; off-arm counterfactual on 5 offered rows | Next arm: OpenCode off rows read `briefDelivered: false`, `offerReached` 0 of 5 off against 5 of 5 on |
| 2 | Start-shape field and per-runtime distribution | `score-command-transcripts.mjs` | Makes 15-row start counts comparable across five differently-earned numerators | A printed shape count per runtime |
| 3 | Split `capped` into exit 143 and exit null | `score-command-transcripts.mjs:2035-2038` | Devin's start rate returns to 15 rows; "capped" names its cause | Devin start rate printed over 15 rows |
| 4 | Score `restored: false` as unscored with a reason | `score-command-transcripts.mjs:1998-2040` | Runner and scorer agree about a head-moving row | DSH `unscored` 0 → 1, Devin by 2 |
| 5 | One Claude arm with `CLAUDE_CONFIG_DIR` on an empty directory | run setting only | Measures whether 27,730 bytes of home rules move any row | Same-rows followed comparison against 6 of 28 |
| 6 | Codex arm unlock | operator `/hooks` approval | A whole runtime | Runner stops refusing; 44 on rows appear |
| 7 | Widen ask representation beyond two shapes | `score-command-transcripts.mjs:1283-1296` | At most 1 of 280 runs today, and it rewrites prior arms' numbers | A prose-question ask classifies as `asked` without changing any prior arm's total |

Items 1, 2 and 3 are the ones a next segment should build; item 5 is a run setting that answers a confound in every cross-runtime table in this packet; items 6 and 7 are gated on the operator and on a measure change respectively.

## Eliminated Alternatives

- Reading the per-runtime followed rate as a UX or fit measure. The classifier's contract defines it as pre-write access.
- Treating OpenCode's `deliveryUnknown` as evidence the plugin failed to emit. No reader exists to observe either outcome.
- Treating Codex as a sixth measured runtime. No row exists and the stop is a runner refusal with an operator repair path.
- Attributing dsh's decline-row start to a delivery failure. The brief arrived and the offer was declined twelve times.
- Ranking by claimed start gain. All five per-runtime Wilson intervals overlap.
- Recovering the OpenCode delivery fact from the run logs by inspection. All 80 lines are unknown by construction.
- Comparing runtimes on start rate while the shape vocabulary differs and only Claude owns host expansion.

## Divergence Map

- Completed pivots: none. The lane stayed on one question family and widened within it.
- Saturated directions: none reached the two-iteration rule, because each iteration changed the object of study rather than repeating one.
- Remaining frontier: the three unrun measurements named in section 9.
- Audited overrides: none.

## 8. What the merged synthesis should and should not say

Should say: the arm's per-runtime spread measures document access; the step reader is the only execution-level number and it is 4 of 20 outputs; OpenCode's delivery column is missing by construction and inflates its off-arm offers; Devin's capped column is a missing exit code; the offer field is a replay in both arms.

Should not say: that any runtime's start gain is attributable to the brief; that the arm separates runtimes on follow-through quality; or that the 033 verdict `not shown` was caused by the brief rather than by the sample size and the instrument.

## 9. Open questions

1. Whether a longer OpenCode wall-clock cap raises its judgeable rows. The `performance-5` lane owns the cap; this lane only records that 8 of 15 off start rows and 5 of 15 on are lost to it.
2. Whether Claude's 27,730-byte home rules file moves any row. Item 5 is the test.
3. Which shape produced each existing start count. Item 2 is the test.
4. Whether `devin`'s exit-null turns are a CLI behaviour or a runner capture gap. The cause was not traced; only the effect on the score is measured.

## 10. References

- `033-untuned-arm-arena-run/scratch/arm-evidence.txt`, `summary-arm.json`, `reruns.txt`, `runs/*.jsonl`, `step-reader/report.txt`
- `decision-record.md` Q075
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts`
- `research/research-segment-4.md`
- Iteration files `iterations/iteration-001.md` to `iteration-008.md` in this lineage

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 8
- Questions answered: 5 / 5
- Remaining questions: 0 tracked, 4 carried in section 9 as unmeasured
- Last 3 iteration summaries: run 6 — what "capped" means per runtime (0.85); run 7 — the two remaining limit lines (0.80); run 8 — coverage close-out and final order (0.35)
- Convergence threshold: 0.05
- New-info ratio trend: 0.75, 0.80, 0.70, 0.65, 0.70, 0.85, 0.80, 0.35. The lane never approached the threshold; it stopped at its iteration ceiling with the questions answered and the instrument findings exhausted.
- Divergence summary: no divergent pivots recorded.

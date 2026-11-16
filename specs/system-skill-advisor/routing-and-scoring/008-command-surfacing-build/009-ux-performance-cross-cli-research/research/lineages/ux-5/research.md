---
title: "Command surfacing segment five, UX lane: offer fit, decline and refusal safety, and the brief's wording"
description: "ux-5 lineage synthesis on the built state after phases 016 to 033 at HEAD 84de3d600fa: what the brief offers, what decline rows still receive, what the wording costs, and which gaps remain unowned."
trigger_phrases:
  - "command surfacing ux lane segment five"
  - "offer fit decline refusal ux-5"
---

# Command Surfacing Segment Five, UX Lane

Lineage `ux-5`, run 2026-11-16, executor `cli-opencode` on `opencode-go/deepseek-v4.1-flash` at max effort, seven iterations, convergence threshold 0.05, stop reason `converged` (all four questions answered). Built state: `HEAD 84de3d600fa`, after phases 016 to 033. Every number below is read from the packet's own captures and run lines; every recommendation states what would confirm it.

## 1. What this lane asked

1. Which offer, ask and start decisions the built brief makes, and which of them phase 020's fit guard or phase 021's head parity already settled.
2. Why an ask offer of `/deep:review` reached the refusal decline row `fresh-decline-refusal-02`, and what a declined or refused offer does on each runtime.
3. What the brief's wording costs a model that would otherwise start a workflow.
4. Which offer-fit or decline-path UX gaps remain that no built or planned phase already covers.

## 2. Method

Read-only. Sources were the live attach path (`command-attach.ts`, `render.ts`), the fresh prompt corpus, the phase 016 to 033 summaries, the parent goal, and the 033 arm's run lines and summary. No model session was started, no corpus was re-scored, no holdout text was read. Two claims were corrected during the run and the corrections are kept in section 8.

## 3. Findings

1. The offer policy is a three-word enum on every command row: `run` executes, `start` opens a workflow, `ask` asks the person first. The two deep-loop commands are `ask`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:58]
2. The brief prints the policy word in the command label (`system-deep-loop → /deep:review (ask)`) but does not define it. The definition lives in `AGENTS.md`, which every measured arena loads. [SOURCE: AGENTS.md:68]
3. The mention guard that withholds a command from a refusal only fires when the prompt contains the typed command string. A prose refusal such as "skip the deep review" cannot reach it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:414]
4. The same file lists "deep review" as a depth-request phrase, so the prose words are read as a request for the heavy loop even inside a sentence that declines it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:276]
5. The fresh set defines eight decline rows as four kinds twice each (refusal, question, small-edit, app-problem), every one expecting no command. Five of the eight still receive one, identically on all five runtimes and in both arms: `/create:goal (start)`, `/speckit:ai-council (ask)`, `/create:readme (start)`, `/deep:review (ask)` and `/create:changelog (ask)`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/behaviour-fresh-prompts.jsonl:28]
6. Four of those five are prose mentions the typed-command guard cannot see; the fifth is a named exclusion, because the small-edit gate covers only `/create:readme`, `/create:feature-catalog` and `/create:manual-testing-playbook`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:339]
7. The arm's only decline start is dsh on arm run 1 on the refusal row, and it started `/create:sk-skill` while `/deep:review` was offered. It is a substitution, not a model following the offer. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json:1]
8. Explicitly declining an offer is almost absent: the on arm echoes a command line 7 times on dsh, 2 on OpenCode, 2 on pi, 3 on devin and 0 on Claude, and only one run marks the command `declined`. Offers are used or silently ignored. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json:1]
9. The on-arm brief carries a command on 7 of the 20 fresh plain rows, identically on all five runtimes; 13 rows carry none. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/claude.jsonl:1]
10. None of the five ask-policy plain rows carries a command, including the `/deep:research` and `/deep:review` rows. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/behaviour-fresh-prompts.jsonl:16]
11. The depth gate is inverted on the only two fresh rows that use a depth phrase: it offers `/deep:review` on the refusal and not on "Give the new billing module a thorough multi-pass review". [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/behaviour-fresh-prompts.jsonl:18]
12. Five of the seven plain-row offers are the expected command, one is a correct subcommand of the expected family, and two are a different doctor command (`/doctor:setup` for `/doctor:env`; `/doctor:overlay status` for `/doctor:update`). [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/behaviour-fresh-prompts.jsonl:11]
13. Every brief ends with a fixed 218-byte tail: a 12-byte `Directives:` label plus a 206-byte comment-hygiene directive. On the measured 306-byte median brief that is 71 percent, and the head is 88 bytes. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:127]
14. The command line is roughly 13 percent of a median brief (39-byte label plus about 15 bytes of scores and `pass.`), and the 80-token cap is far above the measured head, so nothing truncates the policy word. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:104]
15. At identical bytes, start-policy starts differ by runtime in the on arm: Claude 0 of 10, OpenCode 5 of 10, pi 4 of 10, devin 5 of 10, dsh 7 of 10. Claude also started 0 of 10 in the off arm and capped none, so wording cannot explain the spread. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json:1]
16. The ask word does not reliably produce an ask: on five ask rows the on arm started 1 on Claude, 0 on OpenCode, 0 on pi, 2 on devin and 3 on dsh. The policy describes a command's risk, not the model's next action. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json:1]
17. Phase 020 cut reproduction-probe offers from 26 to 8 but cost one real sealed row (real plain holdout 5 to 4 of 44); the 033 floor reads 5 of 44 at the arena commit. Phase 021 settled head parity at 17 of 17 probes. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/020-command-offer-fit-guards/implementation-summary.md:89]
18. Phase 023 already recorded that a command reaches 8 of 24 sealed decline rows and deliberately left it untuned; phases 024, 027 and 031 fixed typed-command refusals and or-lists but not prose mentions. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/023-untuned-outcome-evidence/implementation-summary.md:55]

## 4. The offer surface today

| Measure | Value | Source |
|---------|-------|--------|
| Fresh plain rows carrying a command | 7 of 20, identical on all five runtimes | run lines |
| Ask-policy plain rows carrying a command | 0 of 5 | run lines |
| Fresh decline rows carrying a command | 5 of 8 | run lines |
| Sealed decline rows carrying a command (earlier sample) | 8 of 24, recorded and untuned | phase 023 |
| Decline-row offers that became a start | 1 of 50 run-line offers | run lines |
| Start-policy starts, on arm | Claude 0/10, OpenCode 5/10, pi 4/10, devin 5/10, dsh 7/10 | summary |

The two numbers that matter for the next build are the 7 of 20 offer coverage and the 5 of 8 decline residue. The first bounds how often the policy word can matter at all; the second is the remaining false-offer class.

## 5. The decline and refusal path

The guard order in `attachCommand` is: route shape, no-edit wording, mode table, typed-command mention, small-edit gate, deep-loop depth gate. `fresh-decline-refusal-02` ("Skip the deep review on this branch. I only need you to check the diff for typos and formatting.") passes all six:

- not a no-edit request (the pattern covers "make no changes", "just show", "just list", not "only need you to check");
- no typed command, so the mention guard never fires;
- not a creation command, so the small-edit gate never fires;
- "deep review" satisfies the depth list, so the deep-loop gate attaches the offer.

The result is an `ask` offer on a prompt that refuses the workflow. On dsh, the model then began `/create:sk-skill` — a different creation workflow — so the arm counts a decline start even though the offer was not followed. The target "0 commands started on a decline row" therefore has two causes: a residual offer (five rows) and a model that improvises (one row). Offer fit owns the first only.

## 6. What the wording costs

- 218 bytes of fixed tail, 71 percent of the median 306-byte brief; the tail is a code-comment rule, unrelated to the command.
- 88 bytes of head, of which the command label is about 39 and the scores about 15.
- No truncation: the 80-token cap is about 320 characters.
- The policy word is defined in `AGENTS.md`, not the brief; all measured arenas load it.
- The wording is byte-identical across runtimes, yet start-policy starts range from 0 of 10 to 7 of 10. Wording is not the binding constraint at these sizes. The best-supported UX reading is that the brief's last sentence spends attention on a rule that cannot help the model act, but that is an inference with no arm behind it; an A/B with the tail moved or removed would confirm it.

## 7. What is already settled

- Phase 020: typed-command refusals, small edits in three documents, no-edit requests, the uncertainty bar, weak doctor cues. Offers 26 to 8 on the reproduction probe.
- Phase 021: head parity 17 of 17; the companion line prints its policy word.
- Phase 023: the decline count is recorded and left untuned on purpose.
- Phase 024: refusal leads for typed commands, a question mark ends a sentence.
- Phase 027: refusals and questions carry over or-lists, `offeredAs` is written by both run-log writers.
- Phase 031: the release note states the shipped offer rule; the decline rows are named as outside what the floors measure.
- The operator holds B-5 (reword the head so the command reads as an option) and the outcome target.

## 8. Corrections made during the run

- The lane first recorded that the brief has no policy legend. `AGENTS.md:68` defines the vocabulary, so the finding was narrowed to "the brief depends on the root doc" and R3 was withdrawn.
- The lane first proposed adding `/create:changelog` to the small-edit gate for `fresh-decline-small-edit-02`. That row carries no small-edit phrase ("Change the release date in CHANGELOG.md ..."), so the gate would not fire; R2 was corrected to a single-value edit phrase.
- The lane first scoped R1 from the refusal row alone. The same depth vocabulary has exactly one request row in the fresh set, so R1 was made two-sided.

## 9. Recommendations

| Id | Change | Measured basis | Confirmation | Floor risk |
|----|--------|----------------|--------------|------------|
| R1 | Teach the mention reader a command's own depth phrase, in both directions: a negated phrase is a refusal and a positive phrase is still a request | 4 of 8 decline rows lose a false offer; 1 request row must keep its offer | A render replay shows `fresh-fit-18` with `/deep:review` and `fresh-decline-refusal-02` without it; typed 24 of 44, false offers 0 of 35, real holdout at least 5 of 44 | Medium: a passing mention of "deep review" in a real request could lose its offer |
| R2 | Add a single-value edit phrase (release date, version number) to the small-edit vocabulary, not the changelog command | 1 of 8 decline rows | `fresh-decline-small-edit-02` prints no command; `fresh-fit-16` keeps `/create:changelog`; the typo-fix changelog test keeps its command | Low: one phrase; phase 020's three-failure gate history is the caution |
| R3 | Withdrawn. Do not add a policy legend to the brief | `AGENTS.md` defines the vocabulary for every measured runtime | n/a | n/a |
| R4 | Measure Claude's start-policy silence on the ten rows after phase 016's 44-of-44 listing | 0 of 10 starts, 0 capped, identical brief | A Claude-only run shows any start above zero, or names the runtime limit | None to other runtimes |
| R5 | Split the decline target between offer fit and model path choice | 1 substituted start; dsh acted with no tracked workflow on 5 of 28 on-arm rows | The next arm reports offers and starts separately on decline rows | None: a reporting change |

## 10. Limits

- No model run, no rerun of the arm, no hook replay. The cause of the missing offer on `fresh-fit-18` is not established; the next check is one hook replay of that prompt, read for the recommendation list and the head.
- The sealed fit sample (8 of 24) and the fresh sample (5 of 8) are different samples and are not pooled.
- The registry keys are read from the lane's own deltas; the lead's merge owns the cross-lane registry.
- Only five runtimes were measured. Codex is not in the arm (Q075).

## Eliminated Alternatives

- **A brief policy legend.** Withdrawn: `AGENTS.md` already defines `run`, `start` and `ask`, and a second definition spends bytes on every brief.
- **Gating `/create:changelog` by command name.** Eliminated: the release-date row carries no small-edit phrase, so the gate would not fire.
- **Treating an offer on a decline row as a safety failure.** Eliminated: 49 of 50 decline-row offers produced no start; the failure needs the model action too.
- **Truncation as a wording defect.** Eliminated: the 80-token cap is far above the 88-byte measured head.
- **Head parity as a per-runtime explanation.** Eliminated: phase 021 fixed it and the render is shared.
- **Cutting the scores and pass mark.** Settled in segment three section 4 (f); not reopened.

## Divergence Map

No divergent pivots, no saturation overrides, no Council artifacts. The lane changed direction once, from a broad built-state map to a row-level offer audit, when the run lines showed the aggregate fields did not describe decline rows. Remaining frontier: the cause of the `fresh-fit-18` miss, and the Claude start-policy silence, both named with their confirmation checks.

## Open Questions

None in this lane. The confirmation runs in section 9 are follow-up work, not open questions.

## Sources

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:58,276,339,414,510`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:104,127,133,618`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/behaviour-fresh-prompts.jsonl:11,16,18,28,30`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:100`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2314`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:312`
- `AGENTS.md:68`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/arm-evidence.txt:1,16,45`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json:1`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/claude.jsonl:1`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/dsh.jsonl:1`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/020-command-offer-fit-guards/implementation-summary.md:89`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/021-brief-head-parity/implementation-summary.md:51`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/023-untuned-outcome-evidence/implementation-summary.md:55`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/031-alignment-findings-remediation/implementation-summary.md:140`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:231`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-4.md:16`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/residual-limits-4/scratch/live-brief-ts.json:1`

---

## Convergence Report

- Stop reason: converged
- Total iterations: 7
- Questions answered: 4 / 4
- Remaining questions: 0
- Last 3 iteration summaries: run 5: verification pass, two corrections and one withdrawal (0.40); run 6: offer coverage on the fresh plain rows and the inverted depth gate (0.85); run 7: claims audit against two sources (0.20)
- Convergence threshold: 0.05
- Convergence score: 0.743, with question coverage 0.75, claim verification 0.833, contradiction density 0, source diversity 2, evidence depth 2
- Divergence summary: no divergent pivots; one direction change from built-state map to row-level offer audit
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report

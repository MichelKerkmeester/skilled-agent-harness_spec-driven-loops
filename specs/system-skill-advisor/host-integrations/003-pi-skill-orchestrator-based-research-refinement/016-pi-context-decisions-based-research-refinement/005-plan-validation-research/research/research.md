# Research Synthesis: Plan Validation for Refinement Phases 002 to 004

This synthesis covers a single-lineage `/deep:research` run on 2026-11-18. Claude Opus 5.5 ran 3 iterations at high effort through cli-claude-code on the operator's second Claude account. It checked the planned phases 002 to 004 and the parent's cut list against the advisor code at `655aa883009` and the pi-context-decisions extension. The iterations could not run commands that need approval, so the orchestrator ran the rule test and the citation check itself. Section 10 lists both.

## Table of Contents

- [1. Executive Summary](#1-executive-summary)
- [2. Scope, Method and Inputs](#2-scope-method-and-inputs)
- [3. RQ1 Phase 002, Pasted-Context Stripping](#3-rq1-phase-002-pasted-context-stripping)
- [4. RQ2 Phase 003, Follow-Up Benchmark](#4-rq2-phase-003-follow-up-benchmark)
- [5. RQ3 Phase 004, Crash Fallback and Threshold Doc](#5-rq3-phase-004-crash-fallback-and-threshold-doc)
- [6. RQ4 Gaps and Order](#6-rq4-gaps-and-order)
- [7. Plan Changes](#7-plan-changes)
- [Eliminated Alternatives](#eliminated-alternatives)
- [Divergence Map](#divergence-map)
- [8. Open Questions](#8-open-questions)
- [9. Proposed Order](#9-proposed-order)
- [10. Citation Verification Ledger](#10-citation-verification-ledger)
- [11. Evidence Quality and Caveats](#11-evidence-quality-and-caveats)
- [12. References](#12-references)
- [13. Convergence Report](#13-convergence-report)

---

## 1. Executive Summary

All three planned phases stay. None is dropped, and no cut item comes back. Each one needs changes to its plan before it is built, and the order changes to 002, 004, 003.

- **Phase 002 is sound.** The candidate rule strips the probe's pasted reply and leaves real tasks alone. The orchestrator ran it over the 700 prompts in the routing corpora and it changed none. Stripping in both the recommend handler and the scorer entry is required. The tests cannot catch a wrong placement, though, because under vitest the semantic lane never needs the stored embedding. Only the post-rebuild probe can, so that probe must check the semantic lane.
- **Phase 003 still has a target.** Commit `67782cf23f0` only touches short prompts with no task verb, and "fix" is a task verb, so "fix that too" still passes on the floor. But a pasted reply that names a skill turns the planned guard off, because the policy sees a skill name in the raw text. The guard and the bench must both read phase 002's stripped text. The ship branch is probably unreachable, since "floored" also marks real tasks, and the plan should say so up front. "Emit nothing" should return the policy's skipped result.
- **Phase 004 should run before 003.** Both edit the same hook file, and 003's guard would shift every line 004 pins. Phase 004 needs nothing from 003.
- **The parent phase map has drifted.** Its row for 002 names only the scorer placement, which is the wrong half.

## 2. Scope, Method and Inputs

- **Questions:** RQ1 to RQ4 from the phase `spec.md` Research Brief.
- **Iterations:** 1 took RQ1, 2 took RQ4, 3 took RQ2. RQ3 had no iteration of its own. Section 5 answers it from iteration 2's findings and the orchestrator's own reads, and says what stays open.
- **Code state:** `655aa883009`, with the advisor runtime rebuilt before the run.
- **Limits:** the iterations could not run `node -e`, `git show` or the advisor CLI, because the unattended session needed approval for them. They used `rg` and file reads. The orchestrator ran the rule test and the citation check.

## 3. RQ1 Phase 002, Pasted-Context Stripping

- **The dual placement is required.** Confirmed from code. The handler embeds and scores the raw prompt [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:569]. The semantic lane uses the stored embedding only when the prompt text matches exactly [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:249]. So a scorer-only strip leaves the live lane with no vector.
- **The tests cannot catch a wrong placement.** Confirmed from code. Under vitest, `withSemanticShadowPromptEmbedding` returns early [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:145] and the lane falls back to a fixture vector of whatever text it holds [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:251]. Every vitest gate passes with either placement. Only the live probe after the rebuild shows the difference.
- **Compiled routes still read the raw prompt.** Confirmed from code; the risk is inferred. `enrichCompiledRoutes` gets `input.prompt` [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:563]. A pasted reply that names a slash command may still surface that command after the strip. One probe settles it.
- **The rule works.** Confirmed by the orchestrator's run. The rule matches a leading reported-speech cue or quote, then strips through the first `Now:` or `Task:` marker. It returns the input unchanged if nothing is left. Results:
  - The probe's pasted prompt becomes the plain refactor task, which routes sk-code at 0.82.
  - `You said: run the tests. Task: fix the failing parser test` becomes `fix the failing parser test`.
  - A task containing a quoted `"you said:"`, a task with `Now:` mid-sentence and a cue with no marker all come back unchanged.
  - Of the 700 prompts in `runtime/scripts/routing-accuracy/` and `runtime/scripts/fixtures/`, none changed.
  - The corpora contain no near-miss negatives, so the zero shows the rule is safe on today's corpora, not that it is precise. The inline negatives carry that check.
- **The extension's approach does not transfer.** Confirmed from code. It tells the task from the reply by message role in the transcript [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/past-turn-summaries.ts:22]. The advisor gets one string with no role boundary inside it.

## 4. RQ2 Phase 003, Follow-Up Benchmark

- **The target still exists.** Confirmed from code. The `67782cf23f0` change runs only on the low-information branch [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1503]. That branch needs three or fewer meaningful tokens and no task verb [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1494]. "fix" is a task verb [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:80]. None of the eight planned pairs can reach the change.
- **A skill name in a pasted reply switches the guard off.** Confirmed from code. The policy treats any `sk-`, `system-`, `cli-` or `mcp-` name as an explicit marker [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:58]. It checks that marker before work intent [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:171]. The guard fires only on work intent, so with the raw prompt it lets the floored route through. The bench reads the raw row in the same way.
- **The ship branch is probably unreachable.** Inferred. "Floored" marks any work-intent prompt whose task-intent floor lifted it [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:478]. That includes moderate real matches, like the standalone refactor task. One correct corpus row like that makes `C > 0`, and the rule then closes with no guard. The rule is right to refuse in that case. The plan should name that as the expected outcome.
- **The ship bar needs an integer.** Confirmed from the plan. With a ninth pair, `N / 2` is 4.5. Pairs 2 and 4 have no task verb, so they rarely count toward `H`.
- **"Emit nothing" means the policy's skipped result.** Confirmed from code. The renderer shows `Advisor: prompt skipped.` only when `status` is `skipped` and `freshness` is `unavailable`. Any other empty shape renders as "no skill matched" [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:644]. Every head keeps the hygiene directive. `{}` drops it.
- **The ship branch touches a strict schema.** Confirmed from code. `AdvisorRecommendationSchema` is `.strict()` [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:332]. The ship-branch checks run only the hook tests, which do not parse daemon output against the schema.
- **The extension's benchmark method does not fit.** Confirmed from its docs. It is a billed, model-backed run with hand-labelled gold sets [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/docs/benchmarks/relevance-choice-vs-score.md:3]. Phase 003 measures a deterministic scorer and needs no labels.

## 5. RQ3 Phase 004, Crash Fallback and Threshold Doc

No iteration took RQ3 as its focus. This section rests on iteration 2's reads and the orchestrator's own checks.

- **The fix reaches four runtimes.** Confirmed from code. Pi, DSH and Vibe call the shared Claude handler [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:289] [SOURCE: .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:124] [SOURCE: .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:192]. OpenCode has its own fallback and is not affected.
- **The planned doc sentence is incomplete.** Confirmed from code. The plan's sentence says the daemon reads the variable once at start and names the per-request option. But the hook sends `confidenceThreshold: 0.8` with every request [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:245]. So hook briefs never use the variable, even after a daemon restart. The sentence must say that too.
- **Not checked:** how the extension surfaces its own decision failures. It does not affect the plan, because R2 and N6 already settled what the advisor does on a crash.

## 6. RQ4 Gaps and Order

- **Run phase 004 before 003.** Confirmed from the plan files. Both change `hooks/claude/user-prompt-submit.ts` and its hook test [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/003-follow-up-routing-benchmark/spec.md:111] [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/004-crash-path-fallback/spec.md:100]. 003's guard goes above the lines 004 pins, so building 003 first moves 004's anchors and trips the line-mismatch halt. 004 needs nothing from 003. With 004 first, a throw from the new guard also reaches a catch that already shows the outage line.
- **Keep 002 before 003.** Confirmed from the plan files. 002 rewrites the calibration baseline, which 003 forbids itself to touch.
- **The parent map row for 002 is wrong.** Confirmed from the file. It says the strip goes "at the entry of `scoreAdvisorPrompt`" [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/spec.md:131]. 002's own plan strips in the handler too. Row 5 and the 004-to-005 handoff row still hold scaffold text.
- **The cut list holds.** Nothing in the advisor or the extension brings back R1, R4, R6, R7, R8, N4, N5, N6 or N7. The 003 ship branch adds a field to the strict schema, which is part of what got R4 cut. But the guard is that field's one reader, and R4's reason, that its fields had no reader, still stands.

## 7. Plan Changes

| ID | Phase | Verdict | Change |
|----|-------|---------|--------|
| C1 | 002 | CHANGE | The post-rebuild probe (T013) also checks that the stripped probe still gets a semantic-lane contribution, since no vitest gate can see a wrong placement |
| C2 | 002 | CHANGE | Add one probe to T013: a pasted reply that names a slash command, in front of a plain task. Compare the compiled-route field with and without the strip. Open a follow-up only if it leaks |
| C3 | 002 | CHANGE | T002's check adds inline negatives (a quoted `"you said:"` inside a task, `Now:` mid-sentence, a cue with no marker) and a nested paste, and states that one pass is enough |
| C4 | 002 | CHANGE | Export the strip function so phase 003 can call it |
| C5 | 003 | CHANGE | The guard and the bench call `shouldFireAdvisor` on phase 002's stripped text, not the raw prompt |
| C6 | 003 | CHANGE | Add a ninth pair, the pasted-reply form of pair 1 |
| C7 | 003 | CHANGE | Write the bar as `H >= ceil(N / 2)`, so `H >= 5` with nine pairs. Mark pairs 2 and 4 as negative controls |
| C8 | 003 | CHANGE | Report `Hsame`, the guarded pairs whose follow-up matches the task's top skill, and print each follow-up's full floored set. Report only; do not gate on it |
| C9 | 003 | CHANGE | State in `plan.md` that a close is the expected outcome, and list the ids of the `C` rows |
| C10 | 003 | CHANGE | "Emit nothing" returns the policy's skipped result through its existing builder. The test asserts the `Advisor: prompt skipped.` head and the hygiene directive. This closes 003's open question |
| C11 | 003 | CHANGE | The ship-branch checks add the schema or handler tests, since `AdvisorRecommendationSchema` is strict |
| C12 | 003 | CHANGE | The `67782cf23f0` risk row says the change touches only short prompts with no task verb, so it can move corpus floored counts but not the follow-up pairs |
| C13 | 004 | CHANGE | The `ENV-REFERENCE.md` sentence also says hook briefs always send 0.8, so the variable never reaches them |
| C14 | order | CHANGE | Build in the order 002, 004, 003. Update the handoff rows and the predecessor and successor fields |
| C15 | parent | CHANGE | Map row 2 names both placements. Row 5 gets its focus. The 004-to-005 handoff row becomes a 005-to-002 row |
| K1 | 002, 003, 004 | KEEP | All three phases stay |
| K2 | cut list | KEEP | No cut item returns |

## Eliminated Alternatives

| Idea | Why rejected | Evidence |
|------|--------------|----------|
| The extension's role-based task separation | The advisor gets one string with no role boundary inside it | Section 3 |
| A strip inside the semantic lane instead of the handler | Puts a prompt-policy dependency inside a scorer lane for no gain | Iteration 1, finding 2 |
| Stripping only the advisor's own output lines | Does not fix the plain-prose case confirmed live | `../../001-deep-research/research/review-overengineering-opus-high.md` |
| The extension's single-winner benchmark for phase 003 | Billed, needs gold labels, answers a different question | Section 4 |
| `{}` or a no-match shape as "emit nothing" | `{}` drops the hygiene directive, and no-match claims no skill matched | Section 4 |
| `then:` and `next:` as task markers | They appear inside real multi-step tasks | Iteration 1, finding 5 |

## Divergence Map

- Saturated directions: none. Each iteration took a different question.
- Pivots taken: none. The divergent mode was not enabled.
- Pivot failures and audited overrides: none.
- Remaining frontier: RQ3's comparison with the extension's failure handling, and whether compiled routes leak through a pasted command (C2).

## 8. Open Questions

- Does a pasted reply naming a slash command still surface that command after phase 002's strip? C2's probe answers it.
- What is `C` on the real corpus? Phase 003's bench answers it once phase 002 lands.
- Which plan changes does the operator accept? Decided after this synthesis.

## 9. Proposed Order

1. `002-pasted-context-stripping`, with C1 to C4.
2. `004-crash-path-fallback`, with C13.
3. `003-follow-up-routing-benchmark`, with C5 to C12.

C14 and C15 are edits to the parent and the phase specs, made before 002 starts.

## 10. Citation Verification Ledger

| Check | Result |
|-------|--------|
| Every `[SOURCE: path:line]` tag in `iterations/iteration-001.md` to `iteration-003.md`, deduplicated | 76 unique, 76 resolve, 0 failed |
| Content check behind each CHANGE | Opened by the orchestrator: `semantic-shadow.ts:143-146,249-252`, `prompt-policy.ts:58,105-109,171,182`, `fusion.ts:80,1321,1492-1505`, `render.ts:644-647`, `advisor-tool-schemas.ts:331-332`, parent `spec.md:131,134,149-150`, `003/spec.md:111`, `004/spec.md:100`, `003/plan.md:76`, adapter call sites, `skill-advisor-cli-fallback.ts:245`. All match the claims |
| Rule test the iterations could not run | The orchestrator ran it with `node -e`: the probe strips to the refactor task, three negatives come back unchanged, and 0 of 700 corpus prompts change |

## 11. Evidence Quality and Caveats

- **One model family.** Opus planned the phases, Opus reviewed them, and the orchestrator is Opus too. C9's "probably unreachable" and C8's `Hsame` are judgments; the bench run decides them.
- **The iterations could not execute anything that needed approval.** The rule test and the probes come from the orchestrator. The guard-off case in C5 is confirmed from code, not from a captured hook turn.
- **RQ3 had no iteration of its own.** Section 5 rests on reads from iteration 2 and the orchestrator.
- **Permission layer.** In all three iterations the leaf's gateway call was refused. The orchestrator appended the leaf's own delta record unchanged, and `verify-iteration.cjs` passed all three.

## 12. References

- `iterations/iteration-001.md`, `iteration-002.md`, `iteration-003.md`
- `resource-map.md`
- `../spec.md` (research brief)
- `../../002-pasted-context-stripping/`, `../../003-follow-up-routing-benchmark/`, `../../004-crash-path-fallback/`
- `../../001-deep-research/research/research.md`, `review-fable-5-2.md`, `review-overengineering-opus-high.md`
- `specs/system-skill-advisor/routing-and-scoring/011-surfacing-scorer-follow-ups/`

## 13. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 3
- Questions answered: 3 / 4 by iterations; RQ3 answered in part by the orchestrator
- Remaining questions: RQ3's extension comparison
- Last 3 iteration summaries: RQ1 placement and rule (0.79); RQ4 gaps and order (0.64); RQ2 floor ties, ship rule and guard return (0.79)
- Convergence threshold: 0.05
- Divergence summary: no pivots; each iteration took a separate question
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.

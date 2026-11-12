# Research: Elephant-Goldfish fresh-context checks inside /speckit:plan and /speckit:implement

Lineage `deepseek-flash`, five iterations. Every claim traces to a numbered finding in `iterations/iteration-00N.md`; citations are inline.

## 1. The question

Can system-spec-kit adopt the Elephant-Goldfish Model's fresh-context checks - a document-alone comprehension paraphrase, a decision-free implementation readiness check, an optional critic - inside the existing `/speckit:plan` and `/speckit:implement` steps, without new commands or agents and without forcing Level 1 work through them?

## 2. Verdict

Yes, on three conditions the evidence makes concrete:

1. **Both checks are extensions of existing checkpoints, not new stages.** The paraphrase seats inside plan step 5's existing post-write/confidence sequence and reports into the checkpoint that already asks the operator to review `plan.md`; the readiness check seats inside implement's existing hard-blocking pre-implementation quality gate, in the `plan_clarity` slot that already exists.
2. **The contribution is the evaluator, not the rubric.** Both commands already score plan clarity - in plan step 5 with five weighted factors, in implement's gate with 25 points - and both are scored by the context that read or wrote the plan. A fresh reader changes who answers, not what is asked.
3. **Fresh context is a structural property, and neither command has an automatic pre-coding dispatch.** The plan command's subagent wave is conclusion-free by contract and runs before `plan.md` exists; the implement command's only automatic dispatch happens after coding starts, and its one fresh-perspective agent is deliberately user-dispatched. Adoption that stays inside existing steps therefore has to *prompt* a fresh read, not *spawn* one, unless a dispatch mechanism is reused with its contract changed - which is a larger decision than this research question licenses.

Level 1 is not forced through the ceremony: it takes two short paraphrase sentences inside a checkpoint it already has, and skips the readiness check entirely.

## 3. What the upstream model requires (iteration 1)

EGM runs a five-stage review pipeline - initial zoom-out, comprehension, design critique, intermediate zoom-out, implementation readiness - in fresh subagents with no conversation history, and refuses to run a review in-context at all: without a subagent tool, "a review in the same context is not a Goldfish review" [SOURCE: https://github.com/google/elephant-goldfish-model/blob/main/skills/egm-review/SKILL.md].

The comprehension check is **Paraphrase First**: write "What this proposes" and "How the existing system works, per this document", 2-5 sentences each, and a section that cannot be paraphrased is a Blocker. The stated reason is exact: a list of undefined terms does not find a document whose terms are all defined but whose parts do not connect [SOURCE: https://github.com/google/elephant-goldfish-model/blob/main/agents/comprehension.md]. Comprehension alone reads the document without a reference reading list [SOURCE: https://github.com/google/elephant-goldfish-model/blob/main/skills/egm-review/SKILL.md].

The readiness check is a role-played implementer asking "Do I know exactly what to code, where, and how?", flagging any instruction that forces an independent design choice [SOURCE: https://github.com/google/elephant-goldfish-model/blob/main/agents/implementation_readiness.md]. Its standard sets the pass test at first-attempt execution by an engineer unfamiliar with the codebase, with no guessing, no questions and no design choices, backed by phasing, a file-boundary list, per-file steps and a test plan [SOURCE: https://github.com/google/elephant-goldfish-model/blob/main/resources/document_standards/implementation-readiness-standard.md].

Findings use a flat Blocker/Major/Nit vocabulary with scope and rationale. No measured effectiveness evidence appears upstream; the visible README fragment only says a review does not replace tests [SOURCE: https://github.com/google/elephant-goldfish-model/blob/main/README.md].

## 4. Plan-side placement (iteration 2)

The plan command runs seven checkpoints and terminates after step 7 [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:21]. Step 5 is the step whose post-write state is a finished `plan.md`, and it holds three relevant surfaces:

- a self-scored confidence checkpoint - clarity 0.25, risk 0.20, dependency 0.20, pattern alignment 0.15, affected surface 0.20 - with a >=80 / 40-79 / <40 ladder [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:765];
- mechanical validation after the write: `validate.sh --strict` with a STOP-and-repair rule, plus non-blocking drift guards [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:781];
- four parallel `@context` explorers whose prompts all end "Do NOT draw conclusions - just report findings" [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:692].

**Placement:** immediately after `post_write_validation`, before the confidence checkpoint, reporting *into* that checkpoint. Not a new gate: the command's rules forbid a new approval prompt on the autonomous path [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:870]. Not a fifth explorer in the existing wave: that wave is conclusion-free by contract, and a paraphrase is a conclusion [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:692]. Not step 7: step 7 is closeout emission whose validation is `workflow_finish_confirmed`, so a verdict there is separated from the approval it should inform [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:816].

**Host for the record:** step 5 Phase 0 already generates `research/research.md` [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:758], so the two headings can be written there. Step 6 has no slot for a separate report anyway.

## 5. Implement-side placement (iteration 3)

Implement runs twelve checkpoints. Step 1 first reads `plan.md` and already emits `requirements_summary`, `technical_approach_understanding`, `identified_dependencies` and `potential_challenges` [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:472]. But the leverage is the **hard-blocking pre-implementation gate before step 6**: threshold 70, with `prerequisites_complete` 30, `plan_clarity` 25, `task_breakdown_quality` 25, `checklist_verified` 20, and "Fix issues before coding" on failure [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:382]. The precondition `plan_understood` is already named in the request-analysis framework [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:430].

**Placement:** the readiness check supplies the evidence for `plan_clarity` and reports its open design decisions as P0-class items; the gate already blocks, so no new termination path is needed. The check reuses step 1's four outputs rather than re-reading `plan.md` - they are the readiness report's fields already.

**Constraint:** the command's one automatic dispatch (`pre_phase_parallel_check`) fires inside the coding phase [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:602], and its freshest-perspective agent is explicitly user-dispatched because the workflow never invokes the Task tool [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:623].

## 6. Level scaling (iteration 4)

The controlling contract is structural, not the command summary: Level 1 (<100 LOC) is spec/plan/tasks plus the summary, Level 2 (100-499) adds `acceptance-criteria.md` as the closure gate, Level 3 (>=500) requires the same set [SOURCE: .skilled/skills/system-spec-kit/references/structure/folder-structure.md:129] [SOURCE: .skilled/skills/system-spec-kit/references/structure/folder-structure.md:144] [SOURCE: .skilled/skills/system-spec-kit/references/structure/folder-structure.md:162]. **There is no Level 3+ row in that contract**; the plan template map's `level_3_plus` entry has the same required files as `level_3` [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:296]. So 3+ is a risk band, not a fourth file tier.

| Level | Comprehension paraphrase (plan step 5) | Decision-free readiness (implement gate) | Optional critic |
|---|---|---|---|
| **1** (<100 LOC) | Required, inline: the two headings, 2-5 sentences each, written into `research/research.md`. No severity list, no dispatch, no separate report. | Not run. | Not run. |
| **2** (100-499) | Required, same shape; wrong paraphrase reported as a P1 item. | Required: supplies `plan_clarity` evidence; open design decisions become P0/P1 items in the gate. | Not run. |
| **3** (>=500) | Required; the paraphrase must cover each implementation phase in `plan.md`, not just the document. | Required and blocking: an open design decision fails the gate rather than lowering a score. | Optional, default off; on when the plan carries competing options or `decision-record.md` exists to audit against. |
| **3+** (risk band) | Same as Level 3, plus one paragraph per phase child when the packet has phase children. | Same as Level 3. | Default on, still skippable, never gating. |

Rationale: `plan.md` is required at every level, so the paraphrase always has a document; the level question for it is cost, and the cost is an artifact and a dispatch rather than the sentences [SOURCE: .skilled/skills/system-spec-kit/references/structure/folder-structure.md:129]. Level 2's `acceptance-criteria.md` verifies outcomes only after the fact, which makes the pre-coding readiness pass the only pre-emptive check at that level. Both commands already gate ceremony by level, so this is an established pattern: plan requires a checklist only for Level 2+ [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:877]; implement skips step 4 for Level 1 and marks steps 5.5/7.5 optional for quick fixes [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:536] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:570]. Level comes from `recommend-level.sh`, which both commands already run [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:271].

## 7. What to leave out (iteration 5)

Judged by the repo's own reversal-cost order, which climbs from "extend an existing function in place" to "add an abstraction or a dependency" and demands the sentence that says what fails at the cheaper move [SOURCE: .skilled/repo-rules/prevent-overengineering.md:54].

- **The five-stage pipeline as a plan sub-pipeline.** The plan command already runs seven checkpoints and a four-explorer wave; five more stages duplicate gates [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:21].
- **`GoldfishContext` plumbing** - link resolution, URL saving, approval flow. It exists so reviewers can read a document plus referenced sources; a single-document check does not need the subsystem [SOURCE: https://github.com/google/elephant-goldfish-model/blob/main/skills/egm-review/SKILL.md].
- **The synthesizer and the Blocker/Major/Nit scale as new vocabulary.** Two verdicts fit one checkpoint message; the repo already carries P0/P1/P2 for checklists and Met/Waived/Superseded for criteria [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:544].
- **Brainstorm-mode persona variants, a numeric confidence score for the checks, and any new report file.** Both commands already carry weighted confidence ladders [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:765] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:417].
- **Any level vocabulary beyond the three tiers** plus the 3+ risk band. A fourth tier forks what `recommend-level.sh` and the validators share.

## 8. How to measure whether it helps (iteration 5)

The cheapest honest signal is the paraphrase's own verdict, marked by the author: correct or wrong. It is binary, it costs one word, and a wrong paraphrase *is* a caught defect, so the check labels itself.

Three counters already exist and need no new file: open design decisions the readiness check surfaces that were not already P0 checklist items; the `[DEVIATION: reason]` markers implement already requires [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:431]; and debug delegations at the three-failure threshold [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:623]. Acceptance-criteria rows give caught items a durable home (`AC-ID`, Verification, Status, Waiver) without a metrics file [SOURCE: .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:35].

Do **not** use the PREFLIGHT/POSTFLIGHT learning index: it is optional, skipped for quick fixes, and scored 0-10 by the same context that did the work [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:570]. And state the caveat: upstream reports no measured effect, so the first packets are a baseline, not a result [SOURCE: https://github.com/google/elephant-goldfish-model/blob/main/README.md].

## 9. Eliminated Alternatives

- **Step 7 (handover check) as the paraphrase seat**: closeout emission whose validation is `workflow_finish_confirmed`; a verdict there is separated from the approval it should inform.
- **Steps 3 or 4 as the paraphrase seat**: both precede `plan.md`, so there is no plan to paraphrase.
- **Treating the existing confidence checkpoint as sufficient**: rejected on evaluator identity, not rubric quality - it scores the same context's own draft.
- **A fifth explorer inside the existing plan wave**: rejected because that wave is conclusion-free by contract.
- **Step 6's parallel dispatch as the readiness seat**: it fires after coding begins, so any verdict is retrospective.
- **Step 3 (consistency analysis) as the readiness seat**: it answers "is every requirement covered", not "can an implementer proceed without choosing".
- **Step 4 (acceptance criteria) as the readiness seat**: right rubric shape, wrong question - outcomes verified after the fact, and already skipped for Level 1.
- **Reusing the debug-delegation contract as an automated gate**: it is user-dispatched by design.
- **Treating Level 3+ as a fourth file tier**: the structural contract has three.
- **Gating on LOC at check time**: re-derives a value the level contract already fixed, and the first plan revision moves the threshold.
- **Making the critic mandatory**: duplicates the design-critique stage with no blocking output to justify the dispatch.
- **A dedicated metrics file or dashboard**: acceptance criteria, the task checklist and deviation markers already carry countable rows.
- **Local clone of the upstream repository for repeated reads**: the fetch clone path was ephemeral.

## 10. Divergence Map

- **Saturated directions:** none. No direction was retried twice without new evidence.
- **Pivots taken:** none of the divergent-mode kind. One focus correction: from iteration 2 on, the first unchecked key question replaced the reducer-derived Next Focus, which regenerates from the latest finding text and therefore names what was just learned rather than what is open.
- **Pivot failures / audited overrides:** none.
- **Remaining frontier:** a cost test on a real Level 2 packet - instrument the paraphrase verdict and the readiness counters for two consecutive packets - plus a decision on whether any future work may reuse a dispatch mechanism for the fresh read. Both are follow-up work, not open research questions answered here.

## 11. Open Questions

No key question remains open. Two items are explicitly UNKNOWN rather than open:

1. **UNKNOWN - quantitative benefit.** No upstream measurement exists and this lineage ran no cost test. The smallest next evidence is two consecutive Level 2 packets with the counters on.
2. **UNKNOWN - whether a fresh read may be dispatched.** The plan command's wave could carry a conclusion-bearing brief, and implement could automate its debug-agent pattern, but both change a stated contract. The smallest next evidence is a decision record, not more research.

## 12. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 5 of 5
- Questions answered: 5 / 5
- Remaining key questions: 0
- newInfoRatio trend: 1.00 -> 1.00 -> 1.00 -> 0.78 -> 0.65 (declining as expected: later iterations synthesize rather than discover)
- Convergence threshold: 0.05, not reached - the run stopped on its cap by policy, so the threshold was telemetry only
- Findings recorded: 8 + 8 + 9 + 9 + 12 = 46, with 0 corruption events
- Divergence summary: no saturated directions, no pivots, no audited overrides

## 13. Workflow Scope Notes

This lineage ran as a detached fan-out worker, so three synthesis steps were out of its write authority and were recorded rather than performed:

- `step_writeback_spec_findings` (generated fence in the packet's `spec.md`): not run - `spec.md` lies outside this lineage directory.
- `step_validate_post_synthesis_spec_doc` (`validate.sh --strict`): not run - the dispatch forbids repository tooling runs from a lineage.
- `phase_init.step_preinit_spec_branch` and `step_telemetry_heartbeat_started`: not run - one writes outside the lineage, the other is skipped when `config.fanout` is present.
- `step_fanout_merge`: owned by the parent run after all lineages complete, not by a lineage.

The parent run must perform the spec.md writeback and the post-synthesis validation against this document.

## 14. References

- https://github.com/google/elephant-goldfish-model - README, `skills/egm-review/SKILL.md`, `agents/comprehension.md`, `agents/implementation_readiness.md`, `resources/document_standards/implementation-readiness-standard.md`
- .skilled/commands/speckit/assets/speckit-plan.yaml
- .skilled/commands/speckit/assets/speckit-implement.yaml
- .skilled/skills/system-spec-kit/references/structure/folder-structure.md
- .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl
- .skilled/repo-rules/prevent-overengineering.md
- iterations/iteration-001.md ... iterations/iteration-005.md (this lineage)

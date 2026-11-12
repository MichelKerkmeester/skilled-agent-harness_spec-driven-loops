---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: How can a natural-chat session get the protection of the spec-kit command workflows without the user typing a command, while staying flexible? Today the skill advisor recommends a skill or command in a hook brief, and a recommendation is not automatic use. A chat session that writes files loads AGENTS.md, the system-spec-kit SKILL.md, its ROUTER.md, the authoring card, the packet templates and validate.sh. It does not load .skilled/commands/speckit/assets/speckit-plan.yaml, speckit-implement.yaml or speckit-complete.yaml. Candidate mechanisms: a gate in AGENTS.md that routes a write request into workflow steps; a small shared step reference both paths read; a hook that injects the one relevant step at prompt or tool time; enforcement carried by templates and validate.sh; the session invoking the command itself when the advisor is confident. Rank them and recommend one, with the smallest set of changes to existing files. Prefer changing an existing line over a new file, hook, command or agent.
- Started: 2026-11-11T19:50:01Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: 2026-11-11T19:50:01Z
- Parent Session: fanout-deepseek-flash-1794420820017-ddvs8f
- Lifecycle Mode: restart
- Generation: 2
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Which checks exist only in the three command workflow files and are absent from the chat path, and which are already duplicated there | enforcement-gap | 0.90 | 12 | complete |
| 2 | Q3 - how Level 1 and trivial edits stay light under each of the five mechanisms, and how a user opts out in one sentence | lightness-and-opt-out | 0.87 | 12 | complete |
| 3 | Q5 - per-turn token cost per mechanism and the single recommendation, plus Q4's child-dispatch half | architecture | 0.85 | 10 | complete |
| 4 | Q2 - cost, breakage and cross-runtime / child-dispatch behaviour for all five mechanisms | cross-runtime-delivery | 0.93 | 8 | complete |
| 5 | Re-rank the five mechanisms against iteration 4's delivery column and state the recommendation's exact, delivery-verified edit set | delivery | 0.90 | 7 | complete |
| 6 | Test the edit set's one unfalsifiable clause - 'a review verdict on that plan is recorded before the first implementation edit' - against the chat path, and re-verify the three line targets and the carrier arithmetic | chat-path-producer | 0.80 | 5 | complete |
| 7 | Falsify the enforcement half of the plan-shape rule: write and run the candidate phase predicate, and re-derive where the validator backstop actually lands | - | 0.83 | 6 | complete |
| 8 | Test the two clauses the edit set never earned - the level qualifier and the validator backstop - by measuring level-independence of the phases section and the strict predicate's existing adoption, and re-derive the retroactivity radius from a tracked-corpus denominator | enforcement-carrier | 0.92 | 6 | complete |
| 9 | Compile the edit set to the byte and test where it can be delivered: drafted the six replacement lines plus the AGENTS.md bullet, then measured the per-line delivery window, the verify's false-pass class over the corpus, and the drafted predicate against the drafted and current examples | implementation-shape | 0.86 | 7 | complete |
| 10 | Final iteration: price the per-turn carrier in evicted rules rather than residual bytes, which reverses the AGENTS.md placement to an amendment of the existing :186 line, close Q4's child-dispatch half, and consolidate the ranked recommendation | placement-cost | 0.92 | 8 | complete |

- iterationsCompleted: 10
- keyFindings: 84
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Which checks exist only in the three command workflow files and are absent from the chat path (AGENTS.md, system-spec-kit SKILL.md and ROUTER.md, the authoring card, templates/core, validate.sh rules, hooks), and which are already duplicated there? Cite file and line for each.
- [x] For each of the five candidate mechanisms, what does it cost, what does it break, and how does it behave across the seven runtimes and in a dispatched child with no user present?
- [x] How do Level 1 and trivial edits stay light under each mechanism, and how does a user opt out in one sentence?
- [x] Where does a plan that only its author can follow get through on the chat path today, and what is the smallest change to an existing line that stops it?
- [x] What is the per-turn token cost of each mechanism measured from file sizes, what should not be built, and which single mechanism is recommended?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▆▆▅▄▄▅▇▇▇▅▂▁▂▃▆▇▆▄▆▇
- score sparkline: ▆▆▅▄▄▅▇▇▇▅▂▁▂▃▆▇▆▄▆▇
- Last 3 ratios: 0.92 -> 0.86 -> 0.92
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.92
- coverageBySources: {"code":157,"other":75}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **Reading the three YAMLs in full to diff them.** The plan YAML alone is 885 lines and its gates are front-loaded into a contiguous block; two targeted reads of the gate blocks plus a vocabulary grep produced the same inventory at a fraction of the budget. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:403-424] (iteration 1)
- **Searching `.skilled/` for the planning-gate check ids to find a second implementation.** No hits outside the YAMLs at any depth. This is a confirmed absence, not a thin search — do not re-run it as a way of finding a hidden enforcer. (iteration 1)
- **Treating `speckit-resume-*.yaml` and the presentation `.txt` assets as comparison targets.** The topic froze the comparison to plan, implement and complete; `resume` is the continuity path, not a protection gate, and the presentations are display text. Deferred rather than excluded — if a mechanism later needs the resume path this must be reopened. (iteration 1)
- **Looking for a hook that gates a write at tool time.** The advisor hook is a `UserPromptSubmit` / system-transform hook: it injects text and returns `{}` on failure, so it informs a turn and never blocks one. Any mechanism claiming tool-time enforcement would need a different hook family, which is a new hook concern — the frozen preference order's last resort. Not re-investigating the advisor hook for enforcement capability. (iteration 2)
- **Reading `recommend-level.sh` end to end to understand Level 0.** The boundary constants and the mapping branch are contiguous; a 20-line read produced the whole ladder. The scorer's weighting arithmetic is not in scope for a lightness answer. (iteration 2)
- **Treating "Level 1 is cheap" as a premise to measure.** The four Level-1 templates total ~49.6 KB. Level 1 is a *bounded* cost, not a small one, so the lightness question is only ever about marginal cost per mechanism. Measuring absolute Level-1 weight would have produced a number that answers nothing. (iteration 2)
- **Treating the email-style "exempt (typo fix)" checklist line as a separate exemption.** It is the same rung as `AGENTS.md:245`, restated in a checklist. Counting it twice would have over-stated the number of opt-out surfaces. (iteration 2)
- **Assuming a new gate inherits the child-dispatch exemption.** The exemption enumerates the clauses it converts; a later gate is outside that list. Recorded as a requirement of the recommendation rather than an assumption. (iteration 3)
- **Comparing the mechanisms by total file size.** The denominator is paid before any mechanism is chosen — `AGENTS.md` is 6,800 tokens resident whether or not a gate is added — so a total-size comparison prices the file, not the change. Only the delta is comparable, which is why finding 3's line-versus-block measurement carries the answer. (iteration 3)
- **Looking for a validator rule that already anchors plan phases.** All 42 rule ids and descriptions were dumped; `FILE_EXISTS`, `LEVEL_MATCH`, `PLACEHOLDER_FILLED`, `SCAFFOLD_NEVER_TOUCHED`, `COMPLEXITY_MATCH` and `AC_CLOSURE` cover existence, level, placeholders, scaffold markers, content complexity and closure. None reads a phase line for a path or a proof command. Do not re-run this as a way of finding a hidden anchoring check. (iteration 3)
- **Treating the observed 91-character advisor brief as the mechanism's cost.** It is one sample; the ceiling is 2,048 characters. Used the observed value only for the "what it actually costs when it fires" row and the ceiling for the bound. (iteration 3)
- **Re-auditing `.claude`, `.codex`, `.opencode` and `.pi` for `AGENTS.md` delivery.** The open instance was the two runtimes outside the advisor contract; the other four are contract-named and were counted in iteration 3. Re-reading them would have spent the iteration confirming a count already taken. (iteration 4)
- **Reading `.dsh/patches/*.patch.yml` in full to find an instruction loader.** A grep for `AGENTS` across all of `.dsh/` answered it: no patch references the file, and the only `system-prompt` row shape the repo generates is the persona patch. (iteration 4)
- **Searching for an adapter that arbitrates precedence.** None exists, and the reason is structural rather than a gap: the contract declines authority for the injected text instead of resolving conflicts in it. Recorded as finding 4 rather than as a missing capability. (iteration 4)
- **Testing the 16,384-byte cut empirically by running Devin.** The repo's own runtime doc records the limit *and* an observed instance of the worse variant ("could not be injected due to token limits"); an empirical re-run would be a stronger source but is not available in this session, and the bound is the conservative reading either way. (iteration 4)
- **Treating `.devin/hooks/` as a hook implementation surface.** It holds a single `README.md`; the real Devin hook wiring is `.devin/hooks.v1.json`, rendered from the shared registry. The directory name is not the adapter. (iteration 4)
- **Anchoring the requirement on `.cursor/rules/skill-routing.md` instead of `AGENTS.md`.** It is inside any size budget at 2,257 bytes and is injected on Cursor and Devin, but it is absent on the other five runtimes, so it would be an additional file serving a subset of the runtimes the existing line already serves. Measured, then rejected (finding 4). (iteration 5)
- **Assuming an existing delivered line already carries the obligation.** The directed search over lines 1–183 found four `plan` hits and none of them is a plan-shape or verdict rule (finding 2), which is what makes a line amendment a genuine addition rather than a restatement. (iteration 5)
- **Numeric phase-readiness thresholds as a chat-path carrier.** The YAML planning gate's 70/100 weighting cannot be replicated in prose without inventing a scoring scheme the chat path does not have, and no validator rule reads a phase line. Structurally the same dead end iteration 3 recorded for anchoring rules; noted here only to close the question of whether the recommendation should carry a score. It should not. (iteration 5)
- **Re-deriving iteration 3's cost axis or iteration 4's runtime matrix.** Both are inherited as measured; this iteration adds only the delivery-window arithmetic and the re-rank the matrix enables. (iteration 5)
- **Treating `SKILL.md` or `ROUTER.md` as truncated in practice.** Both exceed 16,384 bytes, which makes "they are cut too" a tempting extension of iteration 4's result. It is not the same mechanism: they are read by a tool call, not injected as rules, so the rule-file budget does not bind them. Ruled out to prevent an over-broad defect claim (finding 3). (iteration 5)
- **A plan-review verdict as a chat-path carrier.** Structurally dead: the only producer is a command loop, and the artifact it emits is a self-report by its own contract. This is the last of the three places iteration 1's hole could have been closed by prose about review; with the YAML gates (iteration 1), the validator rules (iteration 3) and now the verdict surface (this iteration) all checked, the prose-plus-decidable-shape edit set is the whole of what remains. (iteration 6)
- **Adding a review or approval section to `plan.md.tmpl` as the chat-path carrier.** It needs a new template section plus a new validator rule to mean anything, it still leaves the verdict unfalsifiable, and it re-introduces a reviewer step into a session the topic says has no operator typing anything. The decidable shape check reaches the checkable half with amended existing lines. (iteration 6)
- **Claiming "no review surface exists anywhere in the repo".** False as stated and therefore not claimed: `.skilled/commands/deep/review.md` is a review surface. The scoped claim in finding 3 is about the packet-shaped chat path — the references, the SKILL entry point and the two templates a writing session actually loads. (iteration 6)
- **Treating the deep-review verdict line as a truth-bearing artifact to anchor on.** Its own contract says the check is shape-only and the registry is the record (finding 4), so a chat-path rule requiring "a recorded verdict" would have been the card's unanchored verify in a new costume: satisfiable by writing the line. (iteration 6)
- **A predicate that passes on the card's own example for free.** The first candidate — "the three phase lines exist and are one line each" — is exactly what the current verify already approximates, and it passes on `:120`, on the FILL stub and on `## 4. AFFECTED SURFACES`. It measures the count, not the shape, so it inherits the false positive in finding 2. Rejected rather than tuned, since tuning it towards "has backticks" would still pass `--keep <n>`. (iteration 7)
- **Making the backstop an inline rule inside `validate.sh`.** `validate.sh:5-11` forecloses it in its own words, and the architecture it describes is the reason the rule registry exists: a second implementation would let a packet's verdict depend on which caller asked. Recorded as a correction to iteration 6 rather than implemented around. (iteration 7)
- **Requiring the phase predicate at every documentation level.** Tightening a rule that 23% of the existing corpus fails, with no soundness coverage added, would convert a low-cost prose fix into a migration project. Deferred to finding 4's scoping decision. (iteration 7)
- **Treating `PLACEHOLDER_FILLED` as proof that templates enforce their own shape.** The 63 surviving stubs are direct counter-evidence at the surface the backstop would join (finding 5). Not escalated into a claim about cause, because the cause was not investigated and is not needed to withdraw the premise. (iteration 7)
- **`description.json`'s `level` as a reliable corpus join key.** It works for 4,915 tracked packets, but 38 carry `unset` and 6 have no description at all; those 44 sit at 47.4% and 33.3% heading presence. Not a defect worth chasing — the join is strong on the population that matters — but a future corpus measurement should report the unjoined residue instead of folding it into the denominator, which is the same error finding 4 corrects. (iteration 8)
- **Fixing the card alone and leaving the template's `tasks.md` ownership clause in place.** Finding 5's contradiction is bidirectional; amending one side leaves the scaffolded file instructing the opposite of the reference. The template edit is not a nice-to-have, it is the half that reaches sessions which never open the card. (iteration 8)
- **Keeping the level qualifier out of caution.** It reads as the safe choice, but the phases section is unguarded in the template at every level and Level 1 requires `plan.md`, so the clause would exempt a packet class that already carries the heading 96.6% of the time. A clause that changes nothing on the scaffolded path is dead text in a section whose problem is that it already says too much and disagrees with itself. (iteration 8)
- **Taking the backstop with a creation-date cutoff, following `AC_CLOSURE`'s dated-scoping precedent.** `folder-structure.md:156` shows the mechanism exists and works. Rejected on finding 3 rather than on cost: a dated cutoff suits a rule whose subject is universally present and newly required, and the path-plus-proof line is present in 1 of 4,915 packets, so the cutoff would police a behaviour nothing has ever produced while the prose that would produce it is the thing being shipped. (iteration 8)
- **The strict predicate as a rule.** 1 of 4,915. Recorded as finding 3 rather than as a defective predicate — the predicate does discriminate (it returns 3 on the amended example, 0 on the current `:120`), which is what a rule needs and a corpus does not have. (iteration 8)
- **Adding a shape-count command to card `:124` so the verify proves the acceptance rather than locating it.** Measured: 31 of 4,965 plans have three compliant phase lines, so this verify would fail on 99.4% of the corpus. That is the same new-obligation-as-rule problem that withdrew the validator backstop in iteration 8, arriving this time on the verify line instead of in the registry. The verify stays a locator; the acceptance carries the obligation. (iteration 9)
- **Keeping the bullet at `:176` because 926 B is the number that was inherited.** The 926 B is a property of one address, not of the rule. The Execution Behavior slot takes a 292-byte draft with 17 B of headroom, so the choice between "the right section with a smaller budget" and "the wrong section with a larger one" resolves to the right section — the budget only binds if the text is written at the size of iteration 8's 351-byte draft rather than the 292-byte one. (iteration 9)
- **Placing the bullet after `:183` or later.** `:183` ends at byte 16,356, leaving 27 B — not a slot. `:184` and everything after it starts at or beyond 16,357, where residual budget is negative. This also explains finding 2: the section is not merely crowded, it is already cut. (iteration 9)
- **Re-deriving the by-level corpus cross-tab.** Iteration 8 answered it (96.6 / 96.2 / 93.4 / 90.6% heading presence) and the level qualifier is withdrawn; a second derivation would confirm a withdrawn clause. (iteration 9)
- **Treating the drafted example's file names as real paths to test.** `progress.sh` and `progress.test.sh` are illustrative in the same way the current example's "ten archives become three" is illustrative; the commands in the drafted example are shape demonstrations, and card `:107` already establishes the pattern of a real command against `<packet folder>` elsewhere in the same file. (iteration 9)
- **Assuming a fix to the `AGENTS.md` truncation belongs to this recommendation.** It does not: the (iteration 10)
- **Compressing the rule into the ≤ 27 B bracket.** The bracket is free but 27 bytes cannot express a (iteration 10)
- **Offsetting the eviction by pointing at a duplicate carrier under `.skilled/repo-rules/`.** Checked; (iteration 10)
- **Placing the bullet after `:181` at 283–293 B.** Not ruled out of scope: ruled out on price. It (iteration 10)
- **Pricing an insertion by residual bytes.** Residual bytes past the cut are live instruction, so the (iteration 10)
- **Restoring the level qualifier in `AGENTS.md` rather than in the card.** Same bracket accounting, (iteration 10)
- **Treating the residual budget after `:183` (28 B) as a candidate.** Falls inside the same (iteration 10)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->

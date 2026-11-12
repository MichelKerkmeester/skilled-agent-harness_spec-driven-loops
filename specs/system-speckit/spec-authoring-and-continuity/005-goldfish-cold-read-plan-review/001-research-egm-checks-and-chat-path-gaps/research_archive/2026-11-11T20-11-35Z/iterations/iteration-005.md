# Iteration 5: Re-rank the five mechanisms against the delivery column and fix the recommendation's edit target

## Focus

Iteration 4 showed that the recommended mechanism (M1, an `AGENTS.md` line) was priced against `AGENTS.md:186`, a line that does not exist on Devin because Devin cuts each rule file at 16,384 bytes. It explicitly deferred the re-rank because re-scoring without re-reading the edit set would be a claim without evidence.

This iteration does exactly that and nothing wider: it verifies the delivery window byte-exactly, searches the delivered prefix for an existing line that can carry the same requirement, re-scores the five mechanisms on the corrected delivery column, and states the edit set as concrete line replacements. No new mechanism is introduced and no new file is proposed.

## Actions Taken

1. Measured all four chat-path carriers against the 16,384-byte rule-file budget (`wc -c`, `wc -l`).
2. Computed per-line absolute byte offsets of `AGENTS.md` with a whole-file accumulator to find the exact last delivered line and the delivered/severed/absent status of every candidate.
3. Read `.devin/SYNC.md:80-105` to confirm the cut's scope wording ("each rule file") and the Cursor-rule inheritance row.
4. Searched `AGENTS.md` lines 1–183 for any existing plan-shape or review-verdict obligation.
5. Listed `.cursor/rules/` and sized its single rule file to test whether a second always-injected carrier exists.
6. Read `spec-authoring-card.md:105-132` to state the card half of the edit set as exact line replacements.
7. Read `iteration-004.md`'s tail to avoid re-deriving what iteration 4 already concluded.

## Findings

1. **The recommendation's carrier line must move from `AGENTS.md:186` to `AGENTS.md:176`, or it deletes itself on one runtime.** Measured with a whole-file accumulator: line 183 ends at byte 16,357 and is the last fully delivered line; line 184 starts at 16,358 and is severed at 16,384 after 26 of its 145 bytes; line 186 — the recommended target — starts at byte 16,889 and is **wholly absent** from a Devin session's prompt. Line 176 occupies bytes 15,324–15,458 and is fully delivered with 926 bytes of margin, and it is the same kind of line: it opens on non-trivial work and states an obligation that precedes the first edit. [SOURCE: AGENTS.md:176] [SOURCE: .devin/SYNC.md:93] [SOURCE: AGENTS.md:184]

2. **No plan-shape or review-verdict obligation exists anywhere in the delivered prefix, so the move is not a duplicate.** A case-insensitive pattern for plan/verdict over lines 1–183 returns three substantive hits and none is the requirement: `AGENTS.md:22` and `:26-27` are PLAN-WORKFLOW LOCK, which binds only when an approved plan *names a workflow*; `AGENTS.md:89` is Gate 4's skill-advisor tiebreaker; `AGENTS.md:134` is "rerun the objective proof plan", a final-state check. Nothing in the first 183 lines requires a plan a second reader can follow, or a recorded verdict on one, before the first implementation edit. [SOURCE: AGENTS.md:22] [SOURCE: AGENTS.md:89] [SOURCE: AGENTS.md:134]

3. **The 16,384 cut binds injected rule files, not documents opened by a tool read — so the defect is scoped to one carrier and three mechanisms do not inherit it.** All three large chat-path documents exceed the budget (`AGENTS.md` 27,372 bytes, `SKILL.md` 28,185, `ROUTER.md` 26,012), but only `AGENTS.md` is *injected*: `devin rules list` reports `AGENTS [Standard]` alongside the inherited Cursor rule, while `SKILL.md` and `ROUTER.md` reach the model through a read the session performs. The runtime note's wording is "each rule file is still cut at 16,384 bytes", and the budget concern it names is rule-budget exhaustion, not tool output. Consequence for the ranking: M2 (shared reference) and M4 (validator/templates) do not inherit the truncation, and the card at 9,699 bytes is below the budget even if the limit were applied to it. [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:1] [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:1] [SOURCE: .devin/SYNC.md:93] [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:1]

4. **A second always-injected carrier exists and is ruled unnecessary.** `.cursor/rules/skill-routing.md` is 2,257 bytes and Devin inherits the repo's Cursor rules ("Devin inherits the repo's Cursor rules plus root `AGENTS.md`"), so it is delivered on both Cursor and Devin at no prompt size risk. It is rejected as a third file because line 176 already serves every runtime that receives `AGENTS.md`, so the only runtime it would add is DSH — which reads neither `AGENTS.md` nor Cursor rules. A third file therefore buys nothing that survives the check, and it spends the frozen preference order's last resort. [SOURCE: .cursor/rules/skill-routing.md:1] [SOURCE: .devin/SYNC.md:89]

5. **Re-ranked recommendation: M1, carried by an existing line, with the anchor corrected — plus M4 as the decidable backstop, because M1 cannot reach DSH and M4 is the only 7-of-7 carrier.** Ordered on the three axes the evidence now supports — marginal prompt cost per turn, position relative to the first implementation edit, and how many runtimes actually receive the carrier:

   | Rank | Mechanism | Marginal cost/turn | Reaches | Position | Can carry a reader-decided verdict |
   |---|---|---|---|---|---|
   | 1 | **M1** `AGENTS.md:176` + card `123-124` | ~28-30 tokens | 6/7 (DSH carries no `AGENTS.md`) | before first edit | yes |
   | 2 | **M4** templates + `validate.sh` (one new rule) | 0 tokens | 7/7 | after implementation | no — decidable shape only |
   | 3 | M3 advisor-style hook | 0-512 tokens | 6/7, not delivered in a DSH child | prompt time | no enforcement |
   | 4 | M2 shared step reference | pointer always + 256-512 when loaded | load-dependent, unreachable on DSH's absent command path | when loaded | yes, but authority only once loaded |
   | 5 | M5 invoke the command | 15,025-23,374 per invocation | 5/7 (no command surface on Devin or DSH) | whole workflow | yes, but needs a user for 12 checkpoints |

   M1 stays first because position is the load-bearing property: the hole iteration 1 found is a check that runs *before* implementation, and M4 is decidable-only and post-hoc by construction. M4's rank rises relative to iteration 3 because the card's replacement verify (finding 6) is a fail-able shape check, which makes a matching validator rule exact rather than speculative. The pair is not redundancy: M1 is the only mechanism that reaches the pre-edit moment, and M4 is the only mechanism that reaches all seven runtimes. [SOURCE: AGENTS.md:176] [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:123]

6. **The exact edit set: two existing files, three existing lines, no new file, hook, command, agent or numbered gate.**
   - `AGENTS.md:176` — extend the existing bullet so the stakes read must produce a plan a second reader can follow: at Level 2+ on a spec-backed change, each of the plan's three phase lines names a repo-relative path or symbol and the command that proves the phase done, and a review verdict on that plan is recorded before the first implementation edit; under `AI_SESSION_CHILD=1`, record the verdict and continue without waiting. It keeps the Level 2+ qualifier that keeps Level 1 and typo edits free, and the child qualifier that keeps a fan-out leaf from blocking on a user who is not there.
   - `spec-authoring-card.md:113` — add the same Level 2+ qualifier to the section that states the three-phase rule, since as written it binds every packet including Level 1.
   - `spec-authoring-card.md:123-124` — replace the acceptance+verify pair. Today the acceptance is heading presence and the verify is `rg -n '^## 4' <plan.md>` printing one line, which passes on exactly the unanchored example the card itself prints. The replacement requires each phase line to carry a path or symbol token and a verify clause, and the verify must be a read of those three lines that can fail. [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:113] [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:123] [SOURCE: AGENTS.md:176]

7. **The anchor move has a measurable budget consequence, not just a semantic one.** The one-clause amendment adds roughly 110 characters (~28 tokens) on the 6 runtimes that carry `AGENTS.md`, in the same bracket iteration 3 measured for the 186 edit, and it reduces the line's remaining margin to the cut from 926 to roughly 816 bytes. That margin is now the binding constraint on the wording: a replacement clause longer than ~900 bytes re-creates the defect it is written to fix. [SOURCE: AGENTS.md:176] [SOURCE: .devin/SYNC.md:93] [INFERENCE: from finding 1's 15,458 end offset and 16,384 limit]

## Questions Answered

All five strategy key questions were already ticked before this iteration, so nothing new is ticked and `answeredQuestions` is recorded empty. This iteration answered the two questions iterations 3 and 4 left open: the re-rank, and whether the recommended edit's target line sits inside the first 16,384 bytes of the file it is written into. The second answered itself in the negative and required a correction (finding 1).

## Questions Remaining

None in the tracked set. The one open item is not a research question but an implementation constraint carried into the next step: the `AGENTS.md:176` clause must stay under roughly 900 added bytes (finding 7).

## Ruled Out

- **Anchoring the requirement on `.cursor/rules/skill-routing.md` instead of `AGENTS.md`.** It is inside any size budget at 2,257 bytes and is injected on Cursor and Devin, but it is absent on the other five runtimes, so it would be an additional file serving a subset of the runtimes the existing line already serves. Measured, then rejected (finding 4).
- **Treating `SKILL.md` or `ROUTER.md` as truncated in practice.** Both exceed 16,384 bytes, which makes "they are cut too" a tempting extension of iteration 4's result. It is not the same mechanism: they are read by a tool call, not injected as rules, so the rule-file budget does not bind them. Ruled out to prevent an over-broad defect claim (finding 3).
- **Assuming an existing delivered line already carries the obligation.** The directed search over lines 1–183 found four `plan` hits and none of them is a plan-shape or verdict rule (finding 2), which is what makes a line amendment a genuine addition rather than a restatement.
- **Re-deriving iteration 3's cost axis or iteration 4's runtime matrix.** Both are inherited as measured; this iteration adds only the delivery-window arithmetic and the re-rank the matrix enables.

## Dead Ends

- **Numeric phase-readiness thresholds as a chat-path carrier.** The YAML planning gate's 70/100 weighting cannot be replicated in prose without inventing a scoring scheme the chat path does not have, and no validator rule reads a phase line. Structurally the same dead end iteration 3 recorded for anchoring rules; noted here only to close the question of whether the recommendation should carry a score. It should not.

## Edge Cases

- **Ambiguous input:** none in the dispatch — iteration 4's Recommended Next Focus named this exact task. One interpretation was required inside it: whether "re-rank" permits changing the recommendation's target line, or only its order. Chosen: yes, because a ranking of mechanisms whose chosen carrier is absent on a runtime is a ranking of something other than what would be built. The narrower alternative — keep line 186 and note the Devin gap as accepted risk — is recorded here as deferred, and would be the right choice only if Devin were declared out of scope for the chat path.
- **Contradictory evidence:** the same pair iteration 4 flagged, now read against the cut's scope wording. `.devin/README.md` says Devin's instructions are the root `AGENTS.md` plus the inherited Cursor rule, while `.devin/SYNC.md:93` says each rule file is cut and has previously arrived "only as a path". Resolution unchanged and now narrower: the README names the delivered files, the SYNC note bounds their content, and the bound applies to rule files specifically — which is why the correction is one line in one file rather than a mechanism change.
- **Missing dependencies:** `research/research.md` does not exist although `progressiveSynthesis` is true. Not created — see SCOPE VIOLATIONS; the registry's `keyFindings` supplied the accumulated evidence instead, so no finding depends on it.
- **Partial success:** none. Every action completed; the one correction needed was to my own first offset computation (the accumulator started at line 170 and reported relative rather than absolute byte offsets, which would have put line 176 at "byte 205"). It was re-run seeded from line 1 before any number was written into this file, so no finding rests on it. Stated because a silently-relative offset would have looked plausible and supported the same conclusion for the wrong reason.

## Sources Consulted

- `AGENTS.md:1` (27,372 bytes / 300 lines), `:176-177`, `:183-189`, `:22`, `:26-27`, `:89`, `:134`, `:184` (per-line absolute byte offsets)
- `.devin/SYNC.md:83-93` (rules list, Cursor-rule inheritance, 16,384-byte cut, "only as a path" observed failure)
- `.skilled/skills/system-spec-kit/SKILL.md:1` (28,185 bytes), `.skilled/skills/system-spec-kit/ROUTER.md:1` (26,012 bytes)
- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:1` (9,699 bytes), `:105-132` (section 6, acceptance/verify pair, the unanchored worked example)
- `.cursor/rules/skill-routing.md:1` (2,257 bytes)
- `iteration-004.md` (runtime matrix and cut boundary, inherited), `iteration-003.md` (cost axis, inherited), `findings-registry.json` (accumulated key findings)

## Assessment

- New information ratio: 0.90 — findings 1, 2, 3, 4 and 6 are new measurements or new objects; finding 5 is a synthesis of those with iteration 3's cost axis and iteration 4's runtime matrix; finding 7 is partially new (it re-prices an edit iteration 3 measured, at a different line). Four fully new, one partial, one synthesis: (4 + 0.5) / 5 = 0.90, with no simplicity bonus claimed because the re-rank rests on new external measurements rather than a cleaner model of the same evidence.
- Questions addressed: the re-rank and edit-set question left open by iterations 3 and 4, plus the verification thread iteration 4 carried forward (whether the target line sits inside the first 16,384 bytes).
- Questions answered: both. All five strategy key questions were already ticked; nothing new is ticked, and `answeredQuestions` is recorded empty for that reason.

## Reflection

- **What worked and why:** measuring the *carrier* rather than the *mechanism* turned a ranking question into a byte-arithmetic question with one answer. Iteration 4 established that a cut exists; this iteration converted it into a per-line delivered/severed/absent status, and that table immediately refuted the specific line the recommendation was pinned to. The general lesson is that a delivery defect invalidates an *edit*, not just a mechanism, so a recommendation should be stated as a line replacement only after the line has been located in the delivered prefix.
- **What did not work and why:** my first byte-offset pass seeded the accumulator at the wrong line and produced relative offsets that read as absolute. It did not change the conclusion — line 183 versus 184 came from a correctly seeded pass — but it would have produced a confident, wrong "line 176 ends at byte 205". The fix was to print the accumulator's total and check it against `wc -c` before trusting any row. Caught because the number was absurd for a 27 KB file, not because the method was wrong in a way the output revealed.
- **What I would do differently:** carry a size budget beside every carrier in the comparison table from the first iteration, not the fourth. Three of the five mechanisms were priced accurately and incompletely for four iterations because the table had a cost row and no budget row. Also, when a recommendation names a line number, verify that line's eligibility (delivered, in-budget, in-scope) at the moment it is named, not two iterations later.

## Next Focus

Research is complete. Every key question is ticked and this iteration closed the ranking and the exact edit set. The remaining work is implementation, in a separate follow-up: apply the three line replacements (finding 6) and, if the follow-on is taken, add the matching `validate.sh` rule for the phase-anchoring shape so M4's decidable backstop exists. The one live constraint for whoever writes them is finding 7: the `AGENTS.md:176` clause must stay under roughly 900 bytes added, or the edit re-creates the truncation defect it repairs.

## SCOPE VIOLATIONS

- `research/research.md` was not created although `deep-research-config.json` sets `progressiveSynthesis: true`. The dispatch's allowed-write list for this run names only `iterations/iteration-005.md`, `deltas/iter-005.jsonl` and the append gateway's own writes, so writing the synthesis file would have been an out-of-scope mutation. Recorded rather than executed. The reducer or a later run with a wider allowlist must create it; the registry's `keyFindings` already holds the material it would consolidate.

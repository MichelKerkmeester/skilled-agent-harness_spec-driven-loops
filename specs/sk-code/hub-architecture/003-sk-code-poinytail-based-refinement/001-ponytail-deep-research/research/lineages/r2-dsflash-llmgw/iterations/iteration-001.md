# Iteration 001

## Focus
Round-two gap map plus the first target family: the two code-working agent definitions that carry the most implementation weight, `.skilled/agents/code.md` and `.skilled/agents/review.md`, against Ponytail's core skill and review skill. Round one's `research/research.md` was re-read first; findings that only restate its settled ground were checked and marked rather than re-proposed.

## Actions Taken
- Re-read round one's settled synthesis (`research/research.md`, all 17 sections) to fix the ALREADY-COVERED baseline before mining.
- Inventoried the Ponytail 5.1.0 vendored tree and the round-two target sets (agent definitions, repo rules, root docs, runtime mirrors).
- Read Ponytail's core doctrine (`skills/ponytail/SKILL.md`), its review skill (`skills/ponytail-review/SKILL.md`), its portable rule copy (`.agents/rules/ponytail.md`) and its portability doc (`docs/agent-portability.md`).
- Read `.skilled/agents/code.md` and `.skilled/agents/review.md` in full and mapped each Ponytail teaching to the exact target section.
- Checked three suspected NEW items against the current tree to avoid false novelty: `Not checked:` already exists in sk-code-review, the `ceiling:` suppression rule is already in the checklist, and the plain-language reading rules already live in `communication-prose.md`.

## Findings
1. **The reach list before editing is missing from @code's pre-implementation gate. NEW target, ALREADY-COVERED idea.** Ponytail opens with "List every place your change must reach: callers, tests, fixtures, config, exports" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/AGENTS.md:14] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:21]. @code's pre-implementation checklist checks scope, allowlist, routing and verification, but never enumerates the reach set [SOURCE: .skilled/agents/code.md:205] [SOURCE: .skilled/agents/code.md:211]. Round one recommended the same reach list for `workflow-implement.md` [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md:146]; the agent definition was not a target there. Priority P1: @code loads on every implementation dispatch, and the list is what makes its scope check concrete.
2. **@code's RETURN has no gap-disclosure line. NEW target, idea adopted on the review side.** Ponytail ends every reply with "what you skipped or did not check, and any risk the user must know" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:15]. @code's RETURN contract has Mode, Files, Verification, Command, Exit Code, Rubric Score, Escalation and Confidence, plus Summary, Adversarial Summary, Out Of Scope and Spec Drift [SOURCE: .skilled/agents/code.md:297] [SOURCE: .skilled/agents/code.md:331] — no field names unchecked work or user-facing risk. The review side already adopted the analogous line [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:380]. Priority P1: an implementation RETURN can currently pass with silence about what it never checked.
3. **@review has no no-case-no-finding bar. NEW.** Ponytail's review checks before reporting: "Every finding needs a concrete case: 'this input or situation leads to this wrong result'. No case, no finding" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:59]. @review's Issue Evidence Requirements ask for file:line plus snippet or pattern reference, but not a reproducing input or situation [SOURCE: .skilled/agents/review.md:358] [SOURCE: .skilled/agents/review.md:364]. The Hunter/Skeptic/Referee pass challenges phantom issues by disposition, not by demanding a case [SOURCE: .skilled/agents/review.md:394]. Priority P1: this is the single cheapest upgrade to the review evidence floor.
4. **@review never reads the connected code as a named workflow step. NEW.** Ponytail's review reads "the diff, then the code it touches: callers of every changed function, the functions it calls, the tests, the README", and greps every caller when a signature, return value or behavior changes [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:21] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:24]. @review's ANALYZE step is tool-oriented (Grep, Glob, Read) and its Read-Budget Discipline actively discourages wide reads [SOURCE: .skilled/agents/review.md:48] [SOURCE: .skilled/agents/review.md:72]. The two are compatible: read the connected set once, deliberately; the budget rule forbids repeats, not coverage. Priority P1.
5. **@review findings carry no assumed-load statement. NEW target, ALREADY-COVERED idea.** Ponytail tells the reviewer to find the expected load in the repo and "say which load you assumed" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:26]. @review's Performance dimension and checklist judge inefficiencies without naming the load they were judged against [SOURCE: .skilled/agents/review.md:132] [SOURCE: .skilled/agents/review.md:197]. Round one already lodged this as a "stated workload for performance findings" addition for sk-code-review [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md:139]; the agent rubric is a second, untreated target. Priority P2.
6. **@review reports are not numbered across severity groups. NEW.** Ponytail numbers findings across all groups "so the user can say 'fix 2 and 5'" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:82]. @review's report formats list Blockers (P0), Required (P1) and Suggestions (P2) as separate sections with no shared numbering [SOURCE: .skilled/agents/review.md:277] [SOURCE: .skilled/agents/review.md:286]. Priority P2: cheap addressing win for the orchestrator that consumes these reports.
7. **@review has no stated order of importance for report ordering. NEW.** Ponytail fixes an order: "correct, safe, holds under load, tested, fast, lean" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:12]. @review's rubric has weights (Correctness 30, Security 25, Patterns 20, Maintainability 15, Performance 10) but no instruction to order the final report by them [SOURCE: .skilled/agents/review.md:126] [SOURCE: .skilled/agents/review.md:132]. Priority P2.
8. **@code's bug-fix root-cause doctrine is already carried by the Critic pass. ALREADY-ADOPTED.** Ponytail says to grep every caller before editing and "fix the root cause once in the shared code" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:38]. @code's Critic pass already asks whether the edited file is the right ownership boundary and requires escalating `SCOPE_CONFLICT` rather than patching downstream [SOURCE: .skilled/agents/code.md:475] [SOURCE: .skilled/agents/code.md:516]. No action; recorded so the round-two pass does not re-propose it.

## Questions Answered
- None fully. Key question 1 covers all four agent definitions and their mirrors; this iteration covered its first two files (`code.md`, `review.md`) and holds the question open until `debug.md`, `orchestrate.md` and the mirrors are examined.

## Questions Remaining
- Which Ponytail teachings improve `debug.md` and `orchestrate.md` and their runtime mirrors, and which are already adopted there?
- Which Ponytail teachings improve the repository rules (`.skilled/repo-rules/*.md`) without weakening floors?
- Which Ponytail teachings improve the root `REPO RULES.md` and `AGENTS.md` framework?
- Which Ponytail teachings improve the sk-code hub core beyond round one?
- Which Ponytail teachings improve the sk-code shared layer and the quality/review modes beyond round one's adopted set?
- Which Ponytail teachings improve the per-surface packets beyond round one's cited defects?
- How do Ponytail's cross-runtime mirror mechanics compare with the repo's generated mirrors and drift checks?
- Which original ideas does Ponytail inspire for these targets, and which transfers should be rejected?
- Which round-two findings are NEW, ALREADY-COVERED or ALREADY-ADOPTED, and at what priority?

## Ruled Out
- **Importing Ponytail's "lazy senior developer" persona sentence into @code.** Ponytail frames identity first ("You are a lazy senior developer. The best code is the code never written.") [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:15]. @code is a contract-style definition whose every section maps to an enforceable gate [SOURCE: .skilled/agents/code.md:23] [SOURCE: .skilled/agents/code.md:152]. A persona sentence adds no enforceable behavior, duplicates restraint already carried by the standards and the P0 tier, and trades contract precision for tone. Rejected.
- **Re-proposing round one's conclusion that the always-loaded restraint ladder lacks the reuse step.** Round one settled it and recommended the fix for the shared standards [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md:212]; re-proposing it here would repeat settled ground instead of finding new targets.
- **Treating Ponytail's session-wide `lite|full|ultra` levels as a candidate for @code or @review.** Round one rejected the intensity state machine twice [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md:168]; the agent definitions already dispatch mode explicit per task [SOURCE: .skilled/agents/code.md:142].

## Dead Ends
- Checking for a Ponytail-window stdin/BOM counterpart (round one open question 1) belongs to the hooks iteration, not the agent definitions; nothing in Ponytail's agent text touches it.

## Edge Cases
- Ambiguous input: none. Round two's target list is explicit.
- Contradictory evidence: none. Ponytail's read-the-connected-code advice and the repo's Read-Budget Discipline could look contradictory; they are read as complementary (coverage once, no repeats) and finding 4 states that reading explicitly.
- Missing dependencies: none.
- Partial success: the key question spans six files; this iteration covers two by design and reports the question as partially addressed rather than answered.

## Sources Consulted
- specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/AGENTS.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/.agents/rules/ponytail.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/docs/agent-portability.md
- .skilled/agents/code.md
- .skilled/agents/review.md
- .skilled/skills/sk-code/sk-code-review/SKILL.md
- .skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md
- .skilled/repo-rules/communication.md
- .skilled/repo-rules/communication-prose.md

## Assessment
- New information ratio: 0.69 (4 fully new: findings 3, 4, 6, 7; 3 partially new for a new target: findings 1, 2, 5; 1 reconfirmation: finding 8)
- Questions addressed: key question 1 (partially)
- Questions answered: none

## Reflection
- What worked and why: reading the round-one synthesis before touching targets prevented three false-novelty claims — `Not checked:` already exists in the review mode, the `ceiling:` suppression rule is already in the checklist, and the plain-language rules already live in the repo rules. The pre-check turned them into classified evidence instead of re-proposals.
- What did not work and why: the first pass read `.skilled/agents/review.md` before checking the review mode it loads, which briefly made the `Not checked:` line look absent from the whole review surface; the mode file corrected it. Read the loaded mode with the agent next time.
- What I would do differently: for the remaining agent definitions, read the loaded skill/mode first so adopted state is current before judging the agent body.

## Recommended Next Focus
Finish agent key question 1: examine `.skilled/agents/debug.md` and `.skilled/agents/orchestrate.md` against Ponytail's audit and portability material, then the runtime mirrors.

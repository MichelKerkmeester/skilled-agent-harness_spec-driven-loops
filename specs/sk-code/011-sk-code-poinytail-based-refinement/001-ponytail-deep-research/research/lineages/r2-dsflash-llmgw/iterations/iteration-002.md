# Iteration 002

## Focus
Complete the agent-definition family: `.skilled/agents/debug.md` and `.skilled/agents/orchestrate.md` against Ponytail's audit and debt skills, plus the first check for a debt-harvest counterpart in sk-code.

## Actions Taken
- Read Ponytail's audit skill and debt skill; read the portable rule copy `.agents/rules/ponytail.md` to confirm what instruction-only hosts receive.
- Read `@debug`'s phase methodology, tool routing and response contracts; read `@orchestrate`'s Task Format, scoped predicates and output-verification sections.
- Searched the sk-code tree for a ceiling/shortcut debt-harvest counterpart and found only the producer convention and the reviewer downgrade rule, with no reporting surface.
- Checked @orchestrate's verification actions against Ponytail's "check before you report" discipline and found it already mirrored.

## Findings
1. **The `ceiling:` convention has no harvest report. NEW mechanism, missing counterpart.** Ponytail-debt scans the repo for its shortcut markers and produces one debt ledger, groups rows by file, flags any marker that names no upgrade path with a `no-trigger` tag ("those are the ones that silently rot"), and closes with `<N> markers, <M> with no trigger` [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-debt/SKILL.md:9] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-debt/SKILL.md:36] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-debt/SKILL.md:39]. sk-code adopted the producer `ceiling:` convention [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-style-guide.md:175] [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-style-guide.md:183] and the reviewer downgrade rule [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md:153], but sk-code-quality's script folder holds only the comment-hygiene and dist-staleness checkers [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/README.md:1], and no sk-code file names a debt-harvest report. A deferral marked `ceiling:` today can become permanent unnoticed; the no-trigger tag names exactly those rows. Round one covered the convention as adopted and the "lean line" as deferred; the harvest ledger is new ground. Target: sk-code-quality mode. Priority P1.
2. **@debug's response contract has no not-checked disclosure. NEW target, ALREADY-COVERED idea.** Ponytail's audit closes with `Not checked:` naming the parts not read or not runnable [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-audit/SKILL.md:98] and tells a big-repo audit to "say which parts you did not read" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-audit/SKILL.md:27]. @debug's Success Response carries Phase Trace, Changes Made, Verification, Explanation and Prevention [SOURCE: .skilled/agents/debug.md:380] [SOURCE: .skilled/agents/debug.md:410], and its Blocked and Escalation responses carry Remaining Possibilities and Recommended Next Steps [SOURCE: .skilled/agents/debug.md:414] [SOURCE: .skilled/agents/debug.md:458] — none names what could not be checked or run. Its observed-scope field covers "what is NOT failing", not "what was not examined" [SOURCE: .skilled/agents/debug.md:203]. Priority P2. Target: debug.md §6.
3. **@debug's fresh-observation and counter-evidence discipline is already adopted. ALREADY-ADOPTED.** Ponytail's report checks (concrete case, re-read the lines, confirm the caller exists) are matched by @debug's Phase 1 "Record at least one observation that does not depend on the prior-attempt narrative" [SOURCE: .skilled/agents/debug.md:177] and Phase 4's counter-evidence search with hypothesis downgrade [SOURCE: .skilled/agents/debug.md:288] [SOURCE: .skilled/agents/debug.md:291]. No action.
4. **Bounded candidates should disclose the omitted count. NEW mechanism.** Ponytail caps an audit at 20 findings and requires "if you left smaller ones out, say how many" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-audit/SKILL.md:83] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-audit/SKILL.md:84]. @debug tells the debugger to "Generate 2-3 hypotheses ranked by likelihood" with no instruction to state how many candidates were considered and dropped [SOURCE: .skilled/agents/debug.md:248], and @orchestrate's Output Size field controls response *length*, not candidate disclosure [SOURCE: .skilled/agents/orchestrate.md:194]. A bounded choice without a stated omission count hides whether the list was exhaustive. Priority P2. Target: debug.md Phase 3.
5. **@orchestrate's sub-agent verification already covers Ponytail's report-check discipline. ALREADY-ADOPTED.** Ponytail's "Check before you report" discipline (concrete case, re-read the lines, confirm the caller exists) is mirrored by @orchestrate's mandatory review checklist (output matches scope, files exist, evidence for claims, no hallucinated paths) plus its verification actions [SOURCE: .skilled/agents/orchestrate.md:510] [SOURCE: .skilled/agents/orchestrate.md:533]. No action.
6. **The reach set is not a dispatch field in @orchestrate's Task Format. NEW target, ALREADY-COVERED idea.** Ponytail puts the reach list at the top of every change brief: callers, tests, fixtures, config, exports [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/AGENTS.md:14]. @orchestrate's Task Format carries Scope (inclusions and exclusions) and Boundary but no reach-set field [SOURCE: .skilled/agents/orchestrate.md:186] [SOURCE: .skilled/agents/orchestrate.md:187]. The orchestrator decomposes before the leaf starts, so the reach set is cheapest to state in the dispatch brief; this compounds iteration 1's @code checklist gap. Priority P2. Target: orchestrate.md §3 Task Format.
7. **@debug does not read the tests and build config that cover the failing path. NEW.** Ponytail's audit maps a repo by reading the README, deploy and build config, dependency list, entry points and the tests before judging [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-audit/SKILL.md:20] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-audit/SKILL.md:21]. @debug Phase 2 traces call paths and data flow and checks recent changes, but never reads the existing tests or the build/deploy config that exercise the failing path [SOURCE: .skilled/agents/debug.md:213] [SOURCE: .skilled/agents/debug.md:220]. Reading the test harness first is what makes reproduction steps real instead of described. Priority P2. Target: debug.md Phase 2.

## Questions Answered
- None fully. The agent question also covers the runtime mirrors; the four canonical bodies are now covered and the mirrors remain.

## Questions Remaining
- Which Ponytail teachings improve the four agents' runtime mirrors, and which are already adopted there?
- Which Ponytail teachings improve the repository rules (`.skilled/repo-rules/*.md`) without weakening floors?
- Which Ponytail teachings improve the root `REPO RULES.md` and `AGENTS.md` framework?
- Which Ponytail teachings improve the sk-code hub core beyond round one?
- Which Ponytail teachings improve the sk-code shared layer and the quality/review modes beyond round one's adopted set?
- Which Ponytail teachings improve the per-surface packets beyond round one's cited defects?
- How do Ponytail's cross-runtime mirror mechanics compare with the repo's generated mirrors and drift checks?
- Which original ideas does Ponytail inspire for these targets, and which transfers should be rejected?
- Which round-two findings are NEW, ALREADY-COVERED or ALREADY-ADOPTED, and at what priority?

## Ruled Out
- **Porting Ponytail's `shortcut:` marker spelling to replace `ceiling:`.** The repo's convention is adopted, documented, scenario-validated and pinned as a neutral WHY [SOURCE: .skilled/skills/sk-code/changelog/v1.4.0.0.md:22]; renaming it for brand alignment is churn without behavior change. The transferable part is the harvest report (finding 1), not the token.
- **Adopting Ponytail's "ask before persisting the debt ledger" as a new @debug or @review behavior.** Both agents already have write boundaries by design; the persist-on-request nuance only matters for the new report surface and is folded into finding 1.
- **Re-proposing sub-agent rule injection for @orchestrate's own dispatches.** The dispatch prompt already includes the agent definition and skills [SOURCE: .skilled/agents/orchestrate.md:191], which achieves what Ponytail's subagent hook approximates; round one already recorded the general-purpose-sub-agent gap as deferred.

## Dead Ends
- Ponytail-debt's per-row owner idea (`git blame -L<line>,<line>`) [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-debt/SKILL.md:34] is captured inside finding 1 as an implementation option; it is not worth a separate finding.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none; all cited targets exist.
- Partial success: key question 1 remains partially addressed; four of four agent bodies done, mirrors pending.

## Sources Consulted
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-audit/SKILL.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-debt/SKILL.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/.agents/rules/ponytail.md
- .skilled/agents/debug.md
- .skilled/agents/orchestrate.md
- .skilled/skills/sk-code/sk-code-quality/scripts/README.md
- .skilled/skills/sk-code/shared/references/universal/code-style-guide.md
- .skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md
- .skilled/skills/sk-code/changelog/v1.4.0.0.md

## Assessment
- New information ratio: 0.57 (3 fully new: findings 1, 4, 7; 2 partially new for new targets: findings 2, 6; 2 reconfirmations: findings 3, 5)
- Questions addressed: key question 1 (all four bodies; mirrors remain)
- Questions answered: none

## Reflection
- What worked and why: checking first for a harvest tool before claiming its absence turned the biggest finding of the iteration into a verified gap rather than an inference; the empty search plus the two adopted convention sites is strong evidence.
- What did not work and why: nothing material. The debug and orchestrate bodies are each strong in the areas Ponytail probes, so most comparisons landed as ALREADY-ADOPTED, which is itself signal about where the agent family sits.
- What I would do differently: for the mirror iteration, compare the canonical body against each mirror mechanically (diff-shaped) rather than re-reading for themes, because parity drift is the risk there, not doctrine.

## Recommended Next Focus
Agent runtime mirrors: check parity and drift across `.claude/agents`, `.opencode/agents`, `.codex/agents`, `.cursor/agents`, `.devin/agents`, `.pi/agents` and `.hermes/agents` for the four code-working agents, against Ponytail's adapter-thinness rule.

# STEER: luna-compliance (GPT-6 Luna max via codex) (3 iterations), WHAT READING A RULE CHANGES
Scope is fixed here. Do not re-derive it.
Question: which measured prohibitions change after the rule is read, which do not, and what explains the difference?
Data: prep/evidence-pack.md §3. Tables in replies are not reduced by reading communication.md. Semicolons roughly halve after reading communication-prose.md.
Hypotheses to test: (a) conflict with system-prompt or harness defaults, (b) volume, 10.7k tokens of reply rules, (c) placement, a tool result read once versus always-loaded text, (d) abstract dispositions versus concrete lexical bans, (e) no mechanical check, compared with the comment-hygiene directive a pre-commit gate enforces.
Repo evidence: AGENTS.md (§1 Comment Hygiene, §2 Gate 5, §8), .skilled/hooks/git/pre-commit, .skilled/repo-rules/communication.md, .skilled/repo-rules/communication-prose.md.
Also name any cause outside (a) to (e) that the data supports.
Iteration 1: Output: one entry per hypothesis with evidence for, evidence against (each cited), the intervention it predicts, and whether the data can tell it apart from the others.
Iteration 2: Output: a list of candidate interventions, each with type (wording, placement, volume, mechanical check such as a reply linter or Stop hook, or other), hypothesis targeted, cost, and how prep/measure-rule-compliance.py would measure its effect.
Iteration 3: Output: the interventions ranked, with the evidence behind each rank and the result that would reorder them.

## STEERING after other lineages' iteration 1 (orchestrator)
New fact from the loading lineage, checked by the orchestrator: the Devin runtime delivers AGENTS.md truncated at 16,384 bytes, which cuts §5-§10, including the §8 line that tells the model to load the reply rules.
The prep/ compliance data comes from Claude Code transcripts, which load AGENTS.md in full. So truncation cannot explain the table rate in that data. Treat it as a separate, cross-runtime cause under hypothesis (c) placement, and do not merge the two.

## STEERING for your next iteration (orchestrator)
Two measured inputs for your interventions list:
1. Orchestrator, local transcripts, post-2026-09-15: 93 of 265 compaction windows load any rule; those load 3.5 distinct rules on average, median 3, 90th percentile 7. Re-reads inside one window: 1. After compaction: 104.
2. Loading lineage: a rule "card" (frontmatter, "Fires when", "The rule") is 935 to 1,784 bytes; full files are 5,644 to 11,823.
For each intervention, state whether it depends on the rule being re-delivered later in a window (decay) or only on first delivery. prep/evidence-pack.md §3 shows no decay for tables by distance from the read.
3. From the concision lineage (swe-2-max iteration 1, §7, lineages/swe-2-max/iterations/iteration-001.md): the semicolon ban that moves after a read is a 9-word statement at communication-prose.md:109. The table ban that does not move is a ~500-byte block with justification and an exception in communication.md (§2, near line 91). This bears on your hypothesis (d). Test it against every measured prohibition in prep/evidence-pack.md §3, not only these two, and say what sample size the comparison rests on.

## STEERING after your iteration 1 (orchestrator)
Your iteration 1 is the right posture: the data cannot separate the hypotheses. Two inputs:
1. Sample sizes you marked UNKNOWN (post-2026-09-15, same script): em dash before 138, after 1,015, never 215. Empty opener and label-first-line use the same replies as tables: before 219, after 1,063, never 86.
2. Hypothesis (a), one concrete fact: the Claude Code harness system prompt in these sessions states that assistant text "is displayed to the user as Github-flavored markdown in a terminal". It says nothing about tables either way. Treat it as a standing cue that tables render, not as a proven cause.
For iteration 2, since attribution is unresolved, rank interventions first by whether prep/measure-rule-compliance.py can measure their effect within about two weeks of sessions, then by cost. Say which interventions work whatever the cause turns out to be.

## STEERING for iteration 3 (orchestrator)
Two corrections before you rank:
1. Your intervention 2 uses plain cards ("Fires when" + "The rule"). The concision lineage measured that this card drops every operative prohibition in 6 of 13 files, including "No semicolon" (lineages/swe-2-max/iterations/iteration-002.md §1). It proposes a card that adds the file's self-check list. Rank the card intervention on that form, or say why not.
2. Your intervention 3 assumes a check on the final reply. Verify what a Stop or completion hook can do here before ranking it: whether it fires after the reply is already shown, and whether it can block, rewrite, or only add context for the next turn. Read .claude/settings.json (Stop entries), .skilled/hooks/completion/, and .skilled/hooks/injection-contract.md (completion rows). Rank on the capability you find, not the ideal.

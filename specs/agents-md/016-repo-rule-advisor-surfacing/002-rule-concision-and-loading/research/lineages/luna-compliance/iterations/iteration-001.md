# Iteration 1: Why Some Read Rules Move Measured Prohibitions

## Focus

Answer the five steer hypotheses against all five measured reply checks, keeping measured association separate from causation. The comparison rests on 219 before / 1,063 after / 86 never table replies and 138 / 1,015 / 215 semicolon replies. Counts for em dash, empty opener, and label-first-line are not reported per group, so those sample sizes are UNKNOWN. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:43-51]

## Findings

### (a) A rule conflicts with system-prompt or harness defaults

- **Evidence for:** Table hits are not lower after reading `communication.md` (17.4% before, 20.3% after, 11.6% never), while semicolons are lower after reading `communication-prose.md` (37.0%, 17.0%, 43.7%). This difference is compatible with rule-specific interaction with other instructions or runtime behavior. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:45-46]
- **Evidence against / limit:** The supplied data contains no record of which system or harness instruction competed in an individual reply. `AGENTS.md` says delivery rules cannot weaken the separate evidence and rigor standards, but that is a precedence rule, not evidence that the table instruction actually conflicted. [SOURCE: AGENTS.md:261-263]
- **Predicted intervention:** Run matched prompts with and without a known competing format requirement, keeping model, task, and rule exposure fixed. Add or change precedence wording only if the conflict condition predicts the failure.
- **Can the data distinguish it?** No. The different table and semicolon rates fit this account, but also fit wording, exposure, task mix, and detector explanations. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:43-51; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:52-106]

### (b) Volume makes the rules hard to use

- **Evidence for:** The five reply-time files total about 10.7k estimated tokens, while all 13 rule files total about 26.8k estimated tokens. These are file-size estimates at roughly four bytes per token, not session billing. Across 265 compaction windows, only 93 loaded any rule; loaded windows averaged 3.5 distinct rules (median 3, 90th percentile 7). This is consistent with a large rule set competing for attention or time. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:19-26; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:16-20]
- **Evidence against / limit:** Among replies classified after a semicolon-rule read, the measured rate is lower, so rule size does not make the instruction uniformly unusable once surfaced. The data does not link per-session token load to compliance, and 93/265 is not a randomized comparison of compact versus full rules. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:46; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:18-19]
- **Predicted intervention:** Replace repeatedly loaded prose with a short operational rule card and keep longer rationale/examples available only when triggered.
- **Can the data distinguish it?** No. Current aggregates lack session-level token exposure, paired rule size and outcomes, and randomized compression. The current file costs are measured; intervention savings are UNKNOWN. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:19-26,51]

### (c) Placement is wrong: rules arrive as a tool result instead of always-loaded text

- **Evidence for:** `AGENTS.md` §8 routes communication rules to a later read before substantive replies, and the measurement script defines a rule read from a tool-use path. The evidence pack reports that just 14 of 44 recent sessions read any rule through `Read` (shell reads are omitted), and only 93 of 265 compaction windows loaded a rule in the wider count. A separate runtime observation says Devin truncates `AGENTS.md` at 16,384 bytes, removing §§5–10 including §8. [SOURCE: AGENTS.md:259-261; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:52-53,86-90; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:32-37; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:12-14]
- **Evidence against / limit:** The table rate does not decay with reply distance after reading: 20.8% at replies 1–3 versus 22.7% at 31+, and the semicolon rate is lower in the after group. So repeated re-delivery later within a window is not supported as the fix for table hits. Devin truncation is a distinct cross-runtime placement failure; the measured compliance corpus is Claude Code with full `AGENTS.md`, so it cannot explain its table result. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:13,43,45-46; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:12-14]
- **Predicted intervention:** Put a compact route cue where it is present at reply time, and separately ensure each runtime receives the required section. A first-delivery cue is the test for missed placement; re-delivery should be tested only if compliance declines with distance.
- **Can the data distinguish it?** Partly. It shows rules are often not observed as reads and reports no table decay, but it does not observe all shell reads or system injections. The Devin case is separately identified by the steer and must not be pooled with Claude results. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:52-53,95-119; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:12-14]

### (d) Concrete lexical bans work better than abstract dispositions

- **Evidence for:** Semicolon use is the only check with a substantial read-associated shift: 37.0% before to 17.0% after, while the table check moves from 17.4% to 20.3%. The no-semicolon instruction is a short direct replacement rule (`No semicolon. Two sentences, or a conjunction.`). The table rule text includes rationale and an exception. A directly counted UTF-8 span including line breaks is 53 bytes for `communication-prose.md:109` and 612 bytes for `communication.md:91-99`; this is a size contrast, not token cost. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:45-46; .skilled/repo-rules/communication-prose.md:109; .skilled/repo-rules/communication.md:91-99]
- **Evidence against / limit:** This is not a clean “concrete versus abstract” test: both rules explicitly prohibit a behavior, and only two checks have per-group sample sizes in the pack. Also, the steer calls the semicolon sentence a 9-word rule, but the quoted text is seven whitespace-delimited words excluding the Markdown bullet; its separate “about 500-byte” table estimate is approximate, while the direct cited line span is 612 bytes. Treat only the direction of the size contrast as evidence. An explicit short em-dash ban does not show a clear read improvement (after 4.5%, never 6.5%); empty openers are 0% in every group and label-first-line hits remain 2.3–2.7%. Those three checks have UNKNOWN per-group sample sizes. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:19-20; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:45-49; .skilled/repo-rules/communication-prose.md:103-110]
- **Predicted intervention:** A/B test terse “do X instead” wording against current wording, leaving placement and enforcement unchanged; separately compare exception-aware wording for table outputs.
- **Can the data distinguish it?** No. The available comparison is at most five rule checks, with explicit sample sizes only for tables and semicolons, and the behavior, wording length, rule file, and detector all change together. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:43-51; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:19-39]

### (e) There is no mechanical reply check

- **Evidence for:** The comment-hygiene directive is explicitly described as load-bearing because the pre-commit gate enforces its concrete prohibition. The hook stages file contents, invokes the checker, and blocks on a violation or checker failure. The reply-rule measurement script only classifies transcripts after the fact; it does not block or repair a reply. [SOURCE: .skilled/hooks/injection-contract.md:52-65; .skilled/hooks/git/pre-commit:29-75; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:19-39,113-119]
- **Evidence against / limit:** Semicolon use is associated with a lower rate after a read despite no reply gate being measured here, so a mechanical check is not necessary for every observed shift. The supplied data has no before/after compliance measurement for code-comment hygiene, so the pre-commit example is an architecture comparison, not proof of its effect size on replies. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:46,51; .skilled/hooks/git/pre-commit:55-75]
- **Predicted intervention:** Add a response-time linter or Stop check for objective syntax bans, with an exception path for requested tables and with fenced/inline code excluded for prose rules.
- **Can the data distinguish it?** No. It lacks an enforced-reply treatment group, and the detector already has known false positives. A mechanical intervention needs a controlled deployment and measured false-positive rate. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:51; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:19-39]

### Supported causes outside (a)–(e)

- **Confounding and task mix:** Sessions are not randomized, and users who read a rule may be handling different tasks from users who do not. The detector counts legitimate requested-document tables and semicolons in unfenced code, so observed hits are not all true reply-rule violations. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:51; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:19-39,67-106]
- **Time drift:** The em-dash rate among never-read sessions is 6.5% in the short window but 30.2% when earlier sessions are included; that supports a period effect, not a rule-read effect. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:47]
- **Cross-runtime delivery:** Devin’s truncation removes the reply-rule pointer, but the supplied Claude corpus has full `AGENTS.md`; report this as a separate population problem. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:12-14; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:13]

## Ruled Out

- Devin truncation as an explanation for the Claude Code table result; the cited measurement population reads the full file. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:13; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:12-14]
- Re-delivery decay as the supported explanation for table hits; the observed early and late post-read rates are close. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:45]

## Edge Cases

- Ambiguous input: none; tested the five hypotheses and the listed additional causes.
- Contradictory evidence: the table rule is explicit but has no observed read-associated improvement, while the explicit semicolon rule does; the evidence does not identify the reason.
- Missing dependencies: system-prompt text and per-group n for em dash, empty opener, and label-first-line are unavailable; mark these UNKNOWN.
- Partial success: source-backed association and implementation options are available, but causal attribution remains unresolved.

## Sources Consulted

- [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:1-22]
- [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:13-62]
- [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:19-119]
- [SOURCE: AGENTS.md:32-34,259-263]
- [SOURCE: .skilled/repo-rules/communication.md:91-99]
- [SOURCE: .skilled/repo-rules/communication-prose.md:103-110]
- [SOURCE: .skilled/hooks/injection-contract.md:52-66]
- [SOURCE: .skilled/hooks/git/pre-commit:29-75]
- [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/swe-2-max/iterations/iteration-001.md:65-67]

## Assessment

- New information ratio: 0.50
- Novelty justification: six findings comprise one new cross-runtime and rule-size refinement, four partial evidence interpretations, and one restatement of the supplied compliance pattern; no simplicity bonus applies because open causal questions remain.
- Confidence: high in the reported aggregate rates and cited rule text; low in causal explanations because exposure is nonrandomized and the detectors have known false positives.

## Reflection

- What worked and why: comparing every measured check exposed that the semicolon result is an exception, not a general “reading helps” pattern.
- What did not work and why: the aggregates cannot separate instruction conflict, wording, placement, volume, or enforcement because those dimensions were not varied independently.
- What I would do differently: use controlled exposure and task matching before treating any proposed cause as established.

## Recommended Next Focus

List candidate interventions with their type, targeted hypothesis, context/engineering cost, first-delivery versus re-delivery dependence, and a concrete measurement plan using `prep/measure-rule-compliance.py`.

# Iteration 3: Ranking Rule-Writing and Loading Interventions

## Focus

Rank the candidate interventions by the steer's criterion: first whether the current compliance measurement can read their effect within about two weeks, then by known cost. This is a measurement-feasibility and cost ranking, not a predicted-effect ranking. The baseline sessions are observational, and whether a two-week sample has enough independent sessions is UNKNOWN. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:23-32; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:43,51]

The five reply-time rules total 42,811 bytes, approximately 10.7k token-equivalents at the evidence pack's rough four-bytes-per-token estimate. They have different triggers, so that total is not the load on every reply or measured billing. The full thirteen-rule set is 107,092 bytes, approximately 26.8k token-equivalents. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:19-25; AGENTS.md:259-261]

## Ranked Interventions

### 1. Run a same-path randomized wording test for the table rule

**Why this ranks first:** The existing script already detects table and prose patterns in eligible replies, so a two-cohort run can compare outcomes without changing its predicates. It handles replies of at least 400 characters with no tool call; its table regex does not determine whether a table was a legitimate requested artifact. It prints rates and denominators, not confidence intervals or assignment effects. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:19-39,86-119]

**Test:** Randomly assign sessions to the current text or a shorter text at the same rule path and trigger. Preserve the present policy: the only named reply exception is the in-flight block in communication-handoff.md §6. Do not add a user-requested-table exception without a policy decision. Record task type and report requested-document table cases separately as detector-confound cases, not as newly permitted replies. The current ban and its named exception are at communication.md lines 91-99; the evidence pack says requested-document tables count as pattern hits. [SOURCE: .skilled/repo-rules/communication.md:91-99; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:51]

One candidate replacement is: “No tables in a reply, except the in-flight block in communication-handoff.md §6. Use a sentence for one or two facts; use bullets for parallels.” Direct UTF-8 measurement gives 612 bytes for the current lines 91-99 including line breaks and 152 bytes for that replacement: a 460-byte reduction, or about 115 token-equivalents by the four-byte estimate. Actual billed-context savings are UNKNOWN. The after-read table rate was 20.3% of 1,063 replies versus 17.4% of 219 before and 11.6% of 86 never; this is an association pattern, not a causal estimate. [MEASURE: direct UTF-8 count of communication.md:91-99 against the replacement above; SOURCE: .skilled/repo-rules/communication.md:91-99; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:19,45]

**Reorder if:** Move this test down if random assignment cannot be retained by cohort directory or the two-week sample is too small to interpret (adequate sample is UNKNOWN). Move it up as a follow-on compression candidate if the short wording lowers audited violations without increasing missed/false classifications; move it down if the change has no effect after task-type review or the apparent rate is dominated by requested-document tables. The prep script itself does not stratify request type or print confidence intervals, so those must be added to the analysis or audited separately. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:20-39,113-119; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:45,51]

### 2. Add exposure, assignment, task, and runtime metadata

**Why this ranks second:** This does not change model behavior, but it is the lowest-context prerequisite for interpreting the next interventions. The current script identifies a rule read from a tool-use input path; it does not record randomized assignment, injected-rule receipts, runtime, user-requested table context, or linter/display replacement. Sessions are not randomized in the baseline. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:52-53,86-106; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:51]

Record treatment assignment, actual read or injection receipt, task category, runtime, relevant exception context, and any linter or display action outside the model prompt. Keep the existing five pattern checks stable for comparison. This can be checked within two weeks as telemetry completeness, but it does not itself produce a behavior effect estimate. It adds zero model-context tokens if kept out of the prompt; schema, adapter, and analysis engineering cost are UNKNOWN. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:19-39,52-119]

**Reorder if:** Make this the first operational step if injection-only treatment is selected; the current read detector would otherwise label those exposures as “never.” Defer it if the first experiment stays at the same file path and cohort directories already encode randomized assignment. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:52-53,99-106]

### 3. A/B test a slim card: frontmatter, Fires when, The rule, plus the full relevant self-check

**Why this ranks third:** A bare card is not a safe compression: a cross-lineage byte analysis says that this form drops operative prohibitions or procedures in six of thirteen files, including the no-semicolon norm and the communication rule's measured checks. The same analysis identifies the self-check as the compact restatement of each rule's norms and recommends card plus self-check. This is structural evidence; whether the compressed form preserves behavior is UNKNOWN until tested. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/swe-2-max/iterations/iteration-002.md:17-25; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/swe-2-max/iterations/iteration-001.md:30-31]

For communication.md and communication-prose.md together, the measured full files total 18,340 bytes. Their measured slim cards total 4,757 bytes: communication is 1,809 + 1,228 = 3,037 bytes, and communication-prose is 960 + 760 = 1,720 bytes. The paired difference is 13,583 bytes, roughly 3.4k token-equivalents at four bytes per token, or about 74% fewer bytes for those two artifacts if they replace both full files. This does not establish billed savings per session: the rules are trigger-loaded, actual delivery is not in the compliance data, and session-level savings are UNKNOWN. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/swe-2-max/iterations/iteration-001.md:30-31; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/swe-2-max/iterations/iteration-002.md:17,25; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:19-25; AGENTS.md:259-261]

Test only after logging actual slim-card exposure and assignment. Compare the five existing outcomes and audit the rules' own self-check norms; do not repeat the card within a window merely to chase table misses because the table rate did not decay by distance after reading (20.8% at replies 1-3, 22.7% at 31+). [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:45; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:52-53,86-119]

**Reorder if:** Promote it over wording compression if a randomized slim-card pilot keeps every audited norm intact while reducing measured misses and delivered bytes. Demote it if compliance worsens, if self-check content cannot remain within the target budget, or if prompt receipts show that full files are not being delivered often enough for the theoretical savings to matter. Actual token billing remains UNKNOWN. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/swe-2-max/iterations/iteration-002.md:19-25; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:19-25]

### 4. Move Devin's reply-rule pointer into the delivered AGENTS.md prefix

The supplied steer says Devin truncates AGENTS.md at 16,384 bytes, removing §§5-10 including the §8 route to reply rules; the measured compliance pack is from Claude Code with the full file, so this cannot explain its table result. Moving existing pointer text before the cutoff can add zero file bytes, but behavior impact in Devin is UNKNOWN. Keep Devin as a separate runtime cohort. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:12-14; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:13,19-22]

A delivery receipt can verify within two weeks that the pointer arrived. The current prep script's tool-path reader is Claude-shaped; whether Devin transcripts match its input schema is UNKNOWN, so the existing script cannot be assumed to measure Devin's compliance effect. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:52-53,56-106; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:12-14]

**Reorder if:** Move this up for a cross-runtime delivery objective if receipts confirm the omission and a Devin-compatible transcript adapter can report outcomes. Move it down if the pointer already arrives in actual Devin prompts or if the runtime-specific adapter cannot be built and audited in the test window.

### 5. Consider a MessageDisplay filter only if the goal is what users see

The current repository settings have asynchronous Stop hooks; the completion-evidence hook reads the finished assistant text, writes an advisory, and exits normally. Its README says adapters never block or fail a turn. That is not a rewrite of the generated reply. [SOURCE: .claude/settings.json:167-182; .skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs:5-20,103-139; .skilled/hooks/completion/README.md:18-22,64-69,132-137]

Claude Code's current hook reference distinguishes Stop, which runs after the assistant has finished responding, from MessageDisplay, which runs while assistant text streams and can replace displayed text. MessageDisplay's display replacement changes the visible rendering; transcript/model text stays original. Thus it is cause-robust for a displayed-output constraint, but does not make the model obey the rule or repair the transcript. No MessageDisplay hook was found in the inspected .claude/settings.json search. Runtime engineering, delay, and display-filter false-positive rates are UNKNOWN; the hook itself adds no prompt-context tokens. [SOURCE: [Claude Code Hooks reference, Stop and MessageDisplay](https://code.claude.com/docs/en/hooks); .claude/settings.json:167-182; search check: rg MessageDisplay .claude/settings.json returned no matches]

The prep script measures transcript text, not display replacements, so a pilot needs display-action telemetry and a check of the actual rendered output before its result is measurable. **Reorder if:** promote this only if the product target is visible formatting and a prototype shows that replacement is accurate; demote it when the target is model behavior, transcript correctness, or auditability from stored text. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:19-39,92-106]

### 6. Do not rank the current Stop/completion hook as a reply linter

The configured completion sentinel detects unsupported completion claims, not tables or prose punctuation. In this repository it is explicitly advisory-only: it can log or warn but never emits a blocking decision. [SOURCE: .skilled/hooks/completion/README.md:18-22,60-69,132-137; .skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs:18-20,132-139]

Claude's general Stop contract can reject stopping and ask the model to continue with a reason or additional context; it does not rewrite the already finished assistant text. A continuation could produce more output, with additional generation cost and latency both UNKNOWN. A display-only replacement is a separate MessageDisplay capability. Neither capability is the current repo sentinel. [SOURCE: [Claude Code Hooks reference, Stop and MessageDisplay](https://code.claude.com/docs/en/hooks); .claude/settings.json:167-182; .skilled/hooks/injection-contract.md:237-241]

**Reorder if:** Consider a synchronous, controlled retry only if the requirement changes to validated transcript text and a retry/linter prototype demonstrates lower audited violation rates with acceptable extra output and false positives. Do not treat the current asynchronous completion advisory as mechanical reply enforcement. [SOURCE: .skilled/hooks/completion/README.md:18-22,132-137; .skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs:5-20,132-139]

## What Works Across Causes

A display-only output filter can affect only the displayed surface regardless of whether the source is wording, placement, or volume; the available MessageDisplay path does not alter model behavior or stored transcript. Same-path wording and slim-card tests can each test a specific intervention, but neither has an observed causal effect yet. The Devin pointer fix addresses the known delivery omission only in that runtime. These conclusions follow from the hook contract and the nonrandomized baseline, not a measured intervention effect. [SOURCE: [Claude Code Hooks reference, Stop and MessageDisplay](https://code.claude.com/docs/en/hooks); specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:43,51; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:12-14]

The system prompt's GitHub-flavored-Markdown terminal-rendering statement is only evidence that Markdown renders; the steer says it contains no table requirement, so it does not establish a competing instruction. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:26]

## Ruled Out

- Plain cards without their self-check list as a safe compression: the measured card structure drops operative norms in six rule files, while the self-check carries the compact norm restatement. Whether slim cards preserve behavior still requires a pilot. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/swe-2-max/iterations/iteration-002.md:19-25]
- The current completion sentinel as a final-reply block or rewrite: local files specify advisory-only behavior and normal Stop approval. [SOURCE: .skilled/hooks/completion/README.md:18-22,132-137; .skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs:45-51,132-139]
- Devin truncation as an explanation of the Claude Code compliance measurements: those sessions receive the full AGENTS.md. Treat its fix as a separate runtime track. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:13,21; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:12-14]

## Edge Cases and Open Limits

- The five pattern checks do not equate every hit with a violation: requested-document tables and semicolons in unfenced code can count. No requested-table exception was added to the communication rule here. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:51; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:20-39]
- No measured intervention in this work establishes causality. Two-week sample adequacy, actual billed tokens saved, and engineering or latency costs are UNKNOWN. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:19,43,51]
- The exact Stop display ordering guarantee and any runtime-specific rewrite behavior beyond the documented hook contracts are UNKNOWN; the repository's current Stop hook does not rewrite either way. [SOURCE: [Claude Code Hooks reference, Stop and MessageDisplay](https://code.claude.com/docs/en/hooks); .skilled/hooks/completion/README.md:18-22,64-69]

## Sources Consulted

- [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:1-32]
- [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:13-51]
- [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:19-119]
- [SOURCE: AGENTS.md:259-261]
- [SOURCE: .skilled/repo-rules/communication.md:91-99]
- [SOURCE: .skilled/hooks/completion/README.md:18-22,60-69,132-137]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs:5-20,103-139]
- [SOURCE: .skilled/hooks/injection-contract.md:237-241]
- [SOURCE: .claude/settings.json:167-182]
- [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/swe-2-max/iterations/iteration-001.md:30-31]
- [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/swe-2-max/iterations/iteration-002.md:17-25]
- [SOURCE: [Claude Code Hooks reference, Stop and MessageDisplay](https://code.claude.com/docs/en/hooks)]

## Assessment

- New information ratio: 0.85.
- Novelty justification: this pass verifies the actual completion hook capability and corrects the reply-linter ranking, replaces the unsafe bare-card proposal with measured card-plus-self-check costs, corrects the requested-table policy claim, and ranks the interventions by the steer's two-week measurability-then-cost rule. The output-surface distinction is newly evidenced; baseline causal uncertainty remains.
- Confidence: high in the cited aggregate rates, measured file byte counts, and current local hook configuration; medium in prospective two-week observability; low or UNKNOWN in causal effects, statistical adequacy, exact billed tokens, and implementation costs.

## Reflection

- What worked and why: checking the actual hook contracts separated visible replacement from model-side enforcement and stopped the Stop proposal from inheriting capabilities it does not have here.
- What did not work and why: the current compliance script cannot read injection-only, requested-table, display-replacement, or Devin runtime context, which limits comparisons without metadata or an adapter.
- What I would change next: first run the same-path wording pilot; capture assignment, task class, and exposure so the next slim-card pilot is interpretable. Keep Devin as a separate delivery test.

## Recommended Next Focus

Synthesize the three passes and preserve the max-iteration stop reason.

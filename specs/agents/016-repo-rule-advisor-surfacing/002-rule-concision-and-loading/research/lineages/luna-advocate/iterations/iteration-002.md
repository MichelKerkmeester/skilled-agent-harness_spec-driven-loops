# Iteration 2 — Adversarial claim review

## Focus

Attack the seven claims named in the current steering file, return a verdict and a measurement that would settle each, and adjudicate the card-only versus information-loss conflict. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-advocate/steer.md:10-17]

## Actions Taken

1. Read the current steering note before this iteration and listed all seven named claims. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-advocate/steer.md:10-17]
2. Read the cited deepseek, swe-2, and luna-compliance iteration passages, then checked the repository rule anatomy, actual compliance measurement code, Claude Stop registration, and completion-hook implementation.
3. Compared claim wording with the source evidence. Findings below distinguish measured counts, inference, and unmeasured effects.

## Findings

### Claim 1 — F24 rule cards cut 70–80% and need no new measurement to start

**Source claim.** deepseek-v4-1-flash-max iteration 4 F24 proposes loading matched cards containing Fires when and the binding sentence, opening the full file only for ambiguity or when work touches its mechanism. It estimates 70–80% savings per load event and says this changes the payload on an existing action-keyed path. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/deepseek-v4-1-flash-max/iterations/iteration-004.md:49-55]

**Strongest counter-argument.** A smaller card is a cost result, not evidence that the model still receives the operative rule. The independently measured card test from swe-2-max found the 18,207-byte card corpus retained 17% of the full corpus while omitting numbered body rules in six files and partially omitting them in five. In communication-prose, it drops “No semicolon,” the one rule with a read-associated decrease in the current baseline. Rule anatomy requires numbered sections and a final self-check with one item per body obligation. F24's full-file-on-ambiguity fallback could reduce loss, but its recognition accuracy and fallback frequency are UNKNOWN. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/swe-2-max/iterations/iteration-002.md:17-25; .skilled/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md:61-65,81-85; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:46]

**Measurement that would settle it.** Randomize matched action tasks between full-file loading and the exact F24 card-plus-on-demand fallback. Record actual input tokens, full-file fallback frequency, and violations of each rule's operative obligations, pre-registering the semicolon and table cases and the requested-table exception. Keep the model, runtime, task distribution, and trigger fixed; sample size/power is UNKNOWN until the baseline variance is measured.

**Verdict: weakened.** Card size savings are plausible; card-only behavioral safety and the claim that no pre-rollout measurement is needed are not established.

### Claim 2 — AGENTS.md binding clauses plus pointers are already the working design

**Source claim.** deepseek-v4-1-flash-max iteration 4 F23 says AGENTS.md should carry always-binding clauses plus one pointer per rule family, citing its existing §8 pattern. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/deepseek-v4-1-flash-max/iterations/iteration-004.md:26-47]

**Strongest counter-argument.** “Already working” is stronger than the evidence. The wide read count found answer-the-actual-request.md in four sessions out of 82, but there is no count of prompts that met its specific warning/narrowing/declining trigger; low reads could be correct selectivity or missed loads. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:35-37; AGENTS.md:261] Separately, deepseek's report records one observed 16,384-byte Devin delivery ending at line 175, while the §8 pointer is at line 261; that delivery did not contain the pointer. This is runtime-specific evidence, not a universal cap. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/deepseek-v4-1-flash-max/iterations/iteration-004.md:22,40-45]

**Measurement that would settle it.** By runtime and eligible action, log whether AGENTS.md and the relevant pointer actually arrived before the decision, whether the rule was then loaded, and whether that action required it. Report missed eligible opportunities divided by eligible opportunities, not raw reads divided by sessions.

**Verdict: weakened.** The pointer architecture is coherent, but neither the 4/82 count nor one runtime's truncation proves fleet-wide success or failure.

### Claim 3 — Do not build a hook until Gate 5 misses are measured

**Source claim.** deepseek-v4-1-flash-max iteration 4 F25 says no hook now; a future hook should wait for a measured miss rate. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/deepseek-v4-1-flash-max/iterations/iteration-004.md:57-65]

**Strongest counter-argument.** The 104 reads after compaction boundaries and only four answer-rule reads are signals to investigate. They are not opportunity-adjusted misses: they do not identify which rule was needed before which action, whether a rule arrived by another path, or whether behavior failed. Prior research likewise says the Gate 5 miss rate is unknown and recommends a logging-only observer; the repository's recorded injection decision says event frequency must come from a log. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:35-37; specs/agents/016-repo-rule-advisor-surfacing/001-advisor-surfacing/research/research.md:21-25,50-54,72-77; specs/hooks/022-smart-rule-injection/decisions.md:33-36]

**Measurement that would settle it.** Run a non-model-facing observer that records eligible first writes and later action categories, whether the matching rule arrived/read before each decision, and whether a specified rule violation followed. Estimate miss rate and consequence by runtime before any context-injecting hook.

**Verdict: stands.** Existing read counts do not meet the proposed miss-rate threshold. F24's card payload can be evaluated separately; it is not itself evidence that a new prompt-time hook is needed.

### Claim 4 — Reading communication.md does not reduce tables in replies

**Source claim.** The prep report says table-pattern frequency is 20.3% after a read, versus 11.6% in never-read sessions, and concludes the read does not reduce tables. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:43-51]

**Strongest counter-argument.** This is descriptive, not causal. The script includes only assistant replies of at least 400 characters with no tool call, records exposure when a tool-use input contains the rule path, and classifies before/after/never inside non-randomized sessions. It checks a pipe-row plus separator regex against the raw reply; a table inside a requested document or a fenced block can count as a violation. The script does not record task type, whether a table was requested, prompt-time injection exposure, or a randomized treatment. It therefore cannot establish that reading has zero effect, and its table rate is not a clean measure of an unwanted table. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:19-39,52-54,82-106; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:43-51]

The observed table rates still stand for that detector and sample: after 20.3% of 1,063, never 11.6% of 86, before 17.4% of 219. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:43-45]

**Measurement that would settle it.** Randomize matched sessions to the same rule delivery versus no delivery, capture actual read/injection receipts, annotate whether a table was explicitly requested or belongs in a requested artifact, and audit detector hits. Compare unwanted-table rates by task and runtime with denominators and confidence intervals; required sample size is UNKNOWN.

**Verdict: weakened.** The measured association is valid within its filtered pattern test; the sentence “reading does not reduce tables” is too causal for the design.

### Claim 5 — The short prohibition works and the long one does not, so shorter literal statements bind better

**Source claim.** swe-2-max iteration 1 §7 contrasts the nine-word “No semicolon. Two sentences, or a conjunction.” with a roughly 500-byte table-rule block and infers that a short imperative may be the behavior-changing unit. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/swe-2-max/iterations/iteration-001.md:65-67]

**Strongest counter-argument.** The two observations change several variables at once: punctuation versus table behavior, measured baseline rates, denominators, exception structure, and likely task mix. The semicolon “after” rate is 17.0% of 1,015 versus 43.7% of 215 never; the table rate is 20.3% of 1,063 after versus 11.6% of 86 never. Sessions were not randomized, and the table detector counts legitimate tables in requested documents. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:43-51] The semicolon instruction is a standalone checkable ban, while the table passage names permitted alternatives and an in-flight exception. [SOURCE: .skilled/repo-rules/.skilled/repo-rules/communication-prose.md:109; .skilled/repo-rules/.skilled/repo-rules/communication.md:91-99]

**Measurement that would settle it.** Randomize wording length for the same prohibition while holding file path, trigger, model, task mix, and exceptions constant. Compare brief literal wording with a longer explanation, verify actual delivery, and score the same task-aware outcome. Power/sample size is UNKNOWN until measured.

**Verdict: refuted as a causal inference.** Two different prohibitions generate a hypothesis, not an estimate of a general length effect.

### Claim 6 — Card-only loading versus dropping operative prohibitions

**Source conflict.** F24 favors matched cards because they save tokens. swe-2-max iteration 2 §1 reports the tested card loses numbered-body norms in six files, partially loses them in five, and drops the semicolon ban. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/deepseek-v4-1-flash-max/iterations/iteration-004.md:51-55; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/swe-2-max/iterations/iteration-002.md:15-25]

**Strongest counter-argument to card-loss finding.** Some binding top-line rules may be sufficient, and F24 proposes opening a full file when a card is ambiguous or work touches its mechanism. swe-2 identifies two files where the headline is approximately sufficient and a self-check section that restates obligations. Its classification of all six losses includes dominant-function judgments even though the byte totals reconcile exactly; direct examples such as the absent “No semicolon” line are stronger than the aggregate count alone. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/swe-2-max/iterations/iteration-002.md:17-25; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/swe-2-max/iterations/iteration-001.md:15-18; .skilled/repo-rules/communication-prose.md:109]

**Adjudication.** The evidence supports the warning against wholesale frontmatter/Fires-when/The-rule-only cards. For the defined card, “No semicolon” is absent, so the card does not preserve every operative prohibition. This refutes card-only safety as an already-established fact, but does not prove a measured compliance regression. A card plus all self-checks is a plausible alternate payload: 18,207 + 10,941 = 29,148 bytes, about 72.8% fewer bytes than 107,092. That is derived byte arithmetic, not a behavior result. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/swe-2-max/iterations/iteration-002.md:17,25; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:23]

**Single measurement that would decide it.** Randomize the exact F24 card-plus-on-demand design against full-file loading on matched tasks across all 13 rules. Measure task-aware violations of obligations omitted by the card, full-file fallback frequency, and actual input-token totals. Pre-register the semicolon and table cases. No sample size or behavior delta is currently measured.

**Verdict: weakened.** The card-only safety claim itself is refuted by the missing operative sentence; a measured compliance regression is not established. Token savings survive as a sizing claim; evidence does not support dropping body rules without that paired test.

### Claim 7 — A reply linter or Stop check works whatever cause is ultimately correct

**Source claim.** luna-compliance iteration 2 §3 proposes checking final replies for semicolons, em dashes, and unrequested tables, with a warning or narrow rewrite; it says this is cause-robust because it checks the produced reply. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/iterations/iteration-002.md:31-39]

**Strongest counter-argument.** The existing Claude Stop hook is not such a linter. settings.json registers the current completion-evidence Stop adapters as async. The completion adapter reads the last assistant message, checks completion-claim evidence, logs a warning, returns approve, and never blocks; the shared README says the sentinel is advisory only. It does not inspect punctuation or tables, and an after-message warning does not rewrite the already-produced response. Other adapters differ: several log only, while Pi sends a model-visible advisory on the next turn. [SOURCE: .claude/settings.json:167-181; .skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs:5-21,110-139; .skilled/hooks/completion/README.md:18-20,58-69,128-137]

A new pre-delivery linter could be independent of why the model made a mistake only if it can prevent or repair the output. A raw table regex is unsafe: the current detector flags tables inside requested documents, and AGENTS.md gives an explicit operator instruction precedence over rule files. The linter must understand user-requested tables and the in-flight table exception. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:19-39; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:51; AGENTS.md:24-29; .skilled/repo-rules/communication.md:91-99]

This executor and luna-compliance both record model gpt-6-luna. I agree with the need to test enforcement and false positives, but that agreement is not independent-model corroboration. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-advocate/invocation-metadata.json:1; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/invocation-metadata.json:1]

**Measurement that would settle it.** In a supported synchronous pre-delivery runtime, randomize linter-on versus off for matched tasks. Measure final unwanted-ban violations, false positives on explicitly requested tables and in-flight exceptions, false negatives, correction/extra-token cost, and latency. Keep raw detections distinct from corrected outputs.

**Verdict: weakened.** A truly enforcing pre-delivery linter could be cause-robust; the current Stop hook cannot establish that behavior.

## Questions Answered

- Which cross-lineage claims survive adversarial review?

## Questions Remaining

- No research questions remain in this two-iteration scope. The causal effects of cards, pointer delivery, shorter wording, and a response linter remain unmeasured.

## Next Focus

Synthesize the two iterations. Preserve the distinctions between byte savings, context occupancy, runtime support, and causal behavior evidence.

## Telemetry Note

newInfoRatio 0.84 is a subjective novelty estimate, not a measured statistic.

## Scope Constraints

No repository source was modified. The standard reducer, packet validator, and memory generator were not run because they target or mutate files outside the authorized lineage root.

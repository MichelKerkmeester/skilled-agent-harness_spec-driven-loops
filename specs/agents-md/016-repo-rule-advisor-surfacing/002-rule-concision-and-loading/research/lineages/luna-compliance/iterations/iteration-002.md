# Iteration 2: Candidate Interventions and Their Measurement Cost

## Focus

List interventions by how readily their effects could be measured within about two weeks of sessions, then by known context cost. This is a measurement-feasibility order, not the final impact ranking. The supplied steer adds group sizes for all five checks: table, empty opener, and label-first-line each use 219 before / 1,063 after / 86 never replies; semicolon and em dash each use 138 / 1,015 / 215. The Claude system prompt presents assistant text as GitHub-flavored Markdown in a terminal, which signals that tables render but does not instruct the model to use them. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:23-27]

The existing script analyzes assistant replies of at least 400 characters with no tool call, classifies exposure from a tool-use path containing the rule filename, and counts five patterns. It strips fenced and inline code from prose checks but not the table pattern. Thus it can measure final-reply rates, but it cannot presently identify injected-rule exposure, random assignment, user-requested tables, or a linter intervention. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:19-39,52-106]

## Findings

### 1. Randomized wording test for the table rule and semicolon rule

- **Type:** Wording.
- **Hypotheses targeted:** (a) prompt-format cue, (b) volume, and (d) specificity/length. Keep the system prompt’s Markdown-rendering cue constant; it establishes rendering capability, not a table requirement. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:26]
- **Intervention:** Randomly assign sessions to the current wording or a short action form at the same file path and trigger, for example, “Use prose or bullets; use a table only when requested or for the in-flight block.” Keep the semicolon instruction unchanged as a positive comparison because it is already a short action rule. This tests the table wording while holding delivery location steady. [SOURCE: .skilled/repo-rules/communication.md:91-96; .skilled/repo-rules/communication-prose.md:109]
- **Cost:** The measured `communication.md` file is 11,458 bytes, and the current table-rule span at lines 91–99 is 612 UTF-8 bytes including line breaks. A new wording’s byte/token delta is UNKNOWN until finalized and counted. Across all five reply rules, the static total is 42,811 bytes, about 10.7k estimated tokens, though §8 does not load all five on every reply. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:19-25; AGENTS.md:261]
- **Measure with the prep script:** Preserve the same rule path so its current read detector still works. Run the script on the randomized treatment and control transcript cohorts, compare table and semicolon rates with denominators and confidence intervals, and stratify by requested-table tasks. The current script has no assignment or request-context fields; put cohort markers in separate transcript directories or extend it to read treatment metadata before analysis. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:52-106,113-119]
- **Delivery dependence:** First delivery only. The table rate shows no decay by distance after its read, so repeated reminder messages later in one compaction window are not part of this test. Whether the semicolon effect decays is UNKNOWN from the supplied summary. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:45-46]
- **Two-week feasibility / cause-robustness:** The outcomes are already detected by the script, so a two-week collection is measurable; whether it accumulates adequate independent sessions is UNKNOWN. A clearer action rule could help under either a wording or exposure account, but only random assignment attributes an effect to the wording change.

### 2. Compact reply-rule cards delivered at the reply-time boundary

- **Type:** Placement and volume, with wording compressed into a “Fires when / The rule” card.
- **Hypotheses targeted:** (b) volume and (c) placement. This also tests whether the rule is more usable when surfaced without an extra file-read decision.
- **Intervention:** Deliver only the relevant compact card for the requested reply; keep longer examples and rationale on demand. `AGENTS.md` already uses reply-type triggers for the five files, while the current hook system shows that a fixed directive can be routed through prompt-time delivery and lifecycle-aware deduplication. [SOURCE: AGENTS.md:259-261; .skilled/hooks/injection-contract.md:52-66; .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:37-47,72-74]
- **Cost:** Measured cards are 935–1,784 bytes each, roughly 234–446 token-equivalents using the evidence pack’s four-bytes-per-token estimate. Full files in the loading-lineage measurement are 5,644–11,823 bytes. Matched card/file pairs and actual billed-token savings are UNKNOWN. If a 935–1,784-byte card replaced the full 11,458-byte `communication.md`, the arithmetic saving would be 9,674–10,523 bytes, about 2.4–2.6k token-equivalents; this is a conditional bound, not measured per-session savings. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:18-19; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:19-24]
- **Measure with the prep script:** Log card exposure and assignment in transcripts, then extend `reads_rule()` to treat a proven injection receipt as exposure. Without that change, injected-only sessions are misclassified as “never.” Compare randomized card/control groups for all five pattern rates; report the table check separately for requested artifacts because its current regex counts those tables as hits. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:20-39,52-53,99-106; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:51]
- **Delivery dependence:** First delivery only within a window. The observed table rate has no distance decay; the present lifecycle mechanism sends full directive text at first proven delivery and lifecycle boundaries, then may deduplicate it. Re-delivery at every later reply would add cost without current evidence of benefit for tables. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:45; .skilled/hooks/injection-contract.md:64]
- **Two-week feasibility / cause-robustness:** The script can measure the outcomes once exposure is logged; whether enough randomly assigned sessions accrue is UNKNOWN. A card present at the decision point could help under volume, wording, or placement explanations. The script alone cannot prove which explanation caused an effect.

### 3. Response-time linter or Stop check for objective bans

- **Type:** Mechanical check.
- **Hypotheses targeted:** (e) lack of mechanical enforcement; also works regardless of whether the underlying miss comes from volume, placement, or wording because it checks the produced reply.
- **Intervention:** Check the final reply for semicolons and em dashes outside code, and for tables where the user did not request a table. Start with a warning or narrowly scoped rewrite and log each intervention. The repository’s pre-commit hook demonstrates the relevant enforcement shape for code comments: inspect staged content and block a violation, but it does not establish a reply-linter effect. [SOURCE: .skilled/hooks/git/pre-commit:40-75; .skilled/hooks/injection-contract.md:52-65]
- **Cost:** Zero extra model context on a clean pass if implemented outside the prompt; runtime engineering, latency, false-positive rate, and correction-token costs are UNKNOWN. A broad table check risks rejecting legitimate requested artifacts, already counted as hits by the current measurement regex. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:51; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:20-39]
- **Measure with the prep script:** Compare final reply violation rates for randomly assigned linter-on and linter-off sessions using the same transcript cohorts. Add a linter-action marker to distinguish caught-and-repaired drafts from unmodified misses; use the existing pattern checks for final outputs and manually audit the table-request exception. Script-only output cannot measure latency, false positives, or draft repairs. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:19-39,52-106]
- **Delivery dependence:** No repeated rule delivery is needed; the check runs on every eligible final reply. A rule card may remain helpful to avoid triggering repairs, but enforcement itself is independent of later re-delivery.
- **Two-week feasibility / cause-robustness:** Final violation rates are observable in two weeks; enough linter-on/off sample size is UNKNOWN. This is the candidate that works whatever cause is ultimately correct, subject to correct exceptions and a false-positive audit.

### 4. Move the short reply-rule pointer inside Devin’s delivered prefix

- **Type:** Placement.
- **Hypotheses targeted:** (c) cross-runtime delivery failure.
- **Intervention:** Place a concise §8 pointer or its required trigger statement before the first 16,384 bytes of `AGENTS.md`, which the steer says Devin currently delivers before truncating later sections. This is a separate runtime fix and does not explain the full-file Claude Code measurements. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:12-14]
- **Cost:** `AGENTS.md` is 27,012 bytes / about 6.8k estimated tokens. Relocating existing text can add zero file bytes; adding a card would use 935–1,784 bytes and displace the same amount of tail content unless other material is shortened. Exact section offset and net context change are UNKNOWN. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:19-22; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:13-14,19]
- **Measure with the prep script:** It can measure outcomes only if Devin transcripts conform to its Claude JSONL schema; that compatibility is UNKNOWN. Otherwise collect a runtime delivery receipt proving §8 arrives and use a Devin transcript adapter before applying the same five checks. Do not pool those sessions with Claude. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:56-106; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:12-14]
- **Delivery dependence:** The pointer must appear in each delivered prompt prefix, but it need not be repeated multiple times within a compaction window. The baseline’s Claude table result has no distance decay; it says nothing about Devin after a previously missing pointer is restored. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:45; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:12-14,20]
- **Two-week feasibility / cause-robustness:** Receipt completeness is directly testable; behavior effect is not measurable by the existing script unless Devin capture is compatible. This helps only the affected runtime and only if pointer omission is causally relevant.

### 5. Add exposure, task, and exception metadata to the measurement stream

- **Type:** Other: measurement instrumentation, not a behavior rule.
- **Hypotheses targeted:** (a) instruction conflict, (c) placement, (d) wording/task type, (e) mechanical check, and the known confounding explanation.
- **Intervention:** Record randomized cohort, actual read or injection receipt, linter status, reply distance from first delivery, runtime, and whether a table was requested. Keep the actual reply text private as today; aggregate counts only. The present script only identifies tool-use paths and pattern hits, while the evidence pack warns that session types are not randomized. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:52-106; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:13,43,51]
- **Cost:** No rule tokens; schema and parser changes plus telemetry integration have UNKNOWN engineering cost. Cohort tags add no model-context cost if kept outside the prompt.
- **Measure with the prep script:** Extend its grouping keys rather than changing the five predicates: randomized treatment, runtime, delivery type, request exception, and linter intervention. Preserve the current before/after/never report for comparability and print per-check denominators. A 14-day readout can be produced; whether the interval has adequate power is UNKNOWN.
- **Delivery dependence:** Logging must distinguish first delivery, later re-delivery, and lifecycle-boundary re-delivery. It is instrumentation only, so it does not itself require a rule to be repeated.
- **Two-week feasibility / cause-robustness:** This can make any tested intervention interpretable, but does not itself change model behavior. It is the common measurement layer needed to compare the other candidates without treating read timing as randomized exposure.

## Ruled Out

- Treating the current “after” group as a causal treatment estimate; the exposure is observational and the prompt/task/runtime context is not assigned. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:43,51]
- Loading all five reply-time files on every prompt as the default intervention; their 10.7k-token estimate is the total file load, while `AGENTS.md` gives different reply triggers and only 93 of 265 windows load any rule. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:24,32-37; AGENTS.md:261]

## Edge Cases

- Ambiguous input: none; rank order below means measurability first, not expected effect.
- Contradictory evidence: the current system prompt makes Markdown tables render but does not say whether they should be used; the measured sessions therefore do not establish a prompt conflict. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:26]
- Missing dependencies: sufficient 14-day sample size, exact card/file byte pairing, actual billed-token savings, and Devin transcript-schema compatibility are UNKNOWN.
- Partial success: five candidates and measurement paths are specified; none has a measured causal effect yet.

## Sources Consulted

- [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-compliance/steer.md:1-27]
- [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:13-51]
- [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/measure-rule-compliance.py:19-119]
- [SOURCE: AGENTS.md:259-263]
- [SOURCE: .skilled/repo-rules/communication.md:91-99]
- [SOURCE: .skilled/repo-rules/communication-prose.md:103-110]
- [SOURCE: .skilled/hooks/injection-contract.md:52-66]
- [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:37-47,72-74]
- [SOURCE: .skilled/hooks/git/pre-commit:29-75]

## Assessment

- New information ratio: 0.70
- Novelty justification: added measured denominators for all five checks and the system-prompt rendering cue from the latest steer, then converted the earlier causes into five measurable candidates with explicit context estimates; there is no simplicity bonus because causal uncertainty remains.
- Confidence: high in baseline counts, rule-read instrumentation, and current static file costs; medium in two-week observability; low/UNKNOWN in causal effect, power, actual billed tokens, and implementation effort.

## Reflection

- What worked and why: separating behavior measurement from exposure measurement made the current script’s limits explicit; the measured table denominator can now be stratified by requested-table context.
- What did not work and why: the existing script alone cannot attribute a behavior change to injection or enforcement because it records neither treatment assignment nor those delivery events.
- What I would do differently: in the next pass, rank candidates by cross-cause effectiveness and evidence strength, then state the specific result that would change each placement.

## Recommended Next Focus

Rank the five interventions, separating expected behavior impact from two-week measurability and context cost; specify the results that would reorder each rank.

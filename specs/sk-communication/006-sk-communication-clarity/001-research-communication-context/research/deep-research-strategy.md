---
title: Deep Research Strategy - sk-communication clarity context
description: Session tracking for the research run that classifies three vendored communication sources against this repository's own communication stack.
trigger_phrases:
  - "deep research strategy"
  - "sk-communication clarity research"
  - "communication source classification"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking

Runtime state for the deep-research session bound to
`specs/sk-communication/006-sk-communication-clarity/001-research-communication-context`.

---

## 2. TOPIC

Which recommendations in the three vendored communication sources under
`specs/sk-communication/006-sk-communication-clarity/context` are already covered by this
repository's own communication stack, which are genuinely new, and which contradict a rule the
repository already has. The three sources are `clarity.md`, `claude-style-patch-main/STYLE.md`
with its README, and `i-have-adhd-main` including its SKILL.md, hooks, evals and runtime
manifests. Every recommendation is classified and assigned a candidate owning surface.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Which recommendations in each source are already covered by a named line in the current stack, cited file:line?
- [ ] Which are genuinely new, and what specific failure does each prevent that no current rule names?
- [ ] Which contradict a rule the repository already has, and on what exact point does the disagreement turn?
- [ ] For each candidate, which single surface should own it: the root doc, a named existing repo rule, a new repo rule, the skill, or the wording standard?
- [ ] What does the ADHD source's mechanism half offer, citing its session-start hook, runtime mirrors, eval harness and release gate by path, that this repository has no equivalent for?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Deciding what to adopt. This session classifies and recommends; adoption is phase 002's decision record.
- Editing any rule, skill, command, root doc or the wording standard. Write authority is this phase folder only.
- Fetching the sources' upstream repositories. The vendored copies under `../context/` are the frozen input.
- Designing the prompt-time injection mechanism. An active packet at `specs/hooks/022-smart-rule-injection` already owns that question, and its research concluded the corpus's own remedy for read-only binding was promotion into the root doc rather than a hook.
- Scoring or measuring reply quality. That is phase 005's harness, not this session's.

---

## 5. STOP CONDITIONS

- All 10 iterations complete. Convergence cannot stop this run early: `antiConvergence.convergenceMode` is `off`, so convergence is recorded as telemetry and never as a stop.
- Three consecutive iteration failures route to stuck recovery rather than continuing to retry.
- The pause sentinel `research/.deep-research-pause` appears.
- Every recommendation across all three sources carries both a classification and a candidate owning surface, and the remaining iterations would only restate them.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading HVR before classifying was decisive. Seven rules (6, 7, 9, 11, 12, (iteration 1)
- reading the source and all three stack rule files plus HVR before the (iteration 2)
- reading the two excluded sections as files rather than trusting their labels. (iteration 8)
- reading the repo's own machinery before judging the source. The repo already (iteration 9)
- reading the two named files before designing anything. The benchmark README (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the first classification pass used `repo-rules/` and `AGENTS.md` (iteration 1)
- row 31's comment half is under-evidenced. I confirmed that (iteration 2)
- nothing failed outright. The scanner contract was left unread for (iteration 8)
- the first attempt to read `REPO RULES.md` failed on an unquoted path with (iteration 9)
- the grep for candidate labels confirmed the numbered merge set exists (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "A document/reply split removes the hand-maintained exclusion list" — eliminated. Candidate for -- BLOCKED (iteration 8, 1 attempts)
- What was tried: "A document/reply split removes the hand-maintained exclusion list" — eliminated. Candidate for
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A document/reply split removes the hand-maintained exclusion list" — eliminated. Candidate for

### **`README.md:22-30` (install) and `:99-101` (license)** as communication recommendations — -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`README.md:22-30` (install) and `:99-101` (license)** as communication recommendations —
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`README.md:22-30` (install) and `:99-101` (license)** as communication recommendations —

### **Counting the rule restatements in `README.md:71-80` and `agents/gemini.toml:7-23` as -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Counting the rule restatements in `README.md:71-80` and `agents/gemini.toml:7-23` as
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Counting the rule restatements in `README.md:71-80` and `agents/gemini.toml:7-23` as

### **Reading the source as if it carried a rubric for reply quality.** It does not; `rubric.md` is -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Reading the source as if it carried a rubric for reply quality.** It does not; `rubric.md` is
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading the source as if it carried a rubric for reply quality.** It does not; `rubric.md` is

### **The `.github/readme/*.md` translations and `.github/install/*.md` locales** as independent -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The `.github/readme/*.md` translations and `.github/install/*.md` locales** as independent
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `.github/readme/*.md` translations and `.github/install/*.md` locales** as independent

### **Treating the Gemini/OpenAI agent mirrors as alternative rulesets.** `agents/openai.yaml:1-7` -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Treating the Gemini/OpenAI agent mirrors as alternative rulesets.** `agents/openai.yaml:1-7`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the Gemini/OpenAI agent mirrors as alternative rulesets.** `agents/openai.yaml:1-7`

### **Treating the source's six overrides as new rules.** Five map onto existing repo rules -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Treating the source's six overrides as new rules.** Five map onto existing repo rules
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the source's six overrides as new rules.** Five map onto existing repo rules

### `sk-communication` as an owning surface for any of the 18 rules. Its SKILL.md defines a -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `sk-communication` as an owning surface for any of the 18 rules. Its SKILL.md defines a
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `sk-communication` as an owning surface for any of the 18 rules. Its SKILL.md defines a

### A pre-writing reader-model rule hiding inside `presenting-decisions.md` §3 or -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A pre-writing reader-model rule hiding inside `presenting-decisions.md` §3 or
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A pre-writing reader-model rule hiding inside `presenting-decisions.md` §3 or

### Candidate for reducer promotion to "exhausted": using the existing routing benchmark as the -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Candidate for reducer promotion to "exhausted": using the existing routing benchmark as the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Candidate for reducer promotion to "exhausted": using the existing routing benchmark as the

### Counting the conflict ADRs as additional allocation rows on top of the 29 candidates: C-1 is -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Counting the conflict ADRs as additional allocation rows on top of the 29 candidates: C-1 is
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting the conflict ADRs as additional allocation rows on top of the 29 candidates: C-1 is

### Expecting the mirror check to execute its targets as a load smoke test: the fallback rows are -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Expecting the mirror check to execute its targets as a load smoke test: the fallback rows are
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Expecting the mirror check to execute its targets as a load smoke test: the fallback rows are

### No new dead ends to promote. The `sk-communication` display-only boundary and the -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No new dead ends to promote. The `sk-communication` display-only boundary and the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead ends to promote. The `sk-communication` display-only boundary and the

### No new dead ends worth reducer promotion. The standing exhausted items (`sk-communication` as a -- BLOCKED (iteration 6, 1 attempts)
- What was tried: No new dead ends worth reducer promotion. The standing exhausted items (`sk-communication` as a
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead ends worth reducer promotion. The standing exhausted items (`sk-communication` as a

### No new dead ends worth reducer promotion. The standing exhausted items (`sk-communication` as a rule -- BLOCKED (iteration 7, 1 attempts)
- What was tried: No new dead ends worth reducer promotion. The standing exhausted items (`sk-communication` as a rule
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead ends worth reducer promotion. The standing exhausted items (`sk-communication` as a rule

### No new dead ends worth reducer promotion. The synthesis confirmed the two standing constraints and -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No new dead ends worth reducer promotion. The synthesis confirmed the two standing constraints and
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead ends worth reducer promotion. The synthesis confirmed the two standing constraints and

### No new dead ends worth reducer promotion. The two standing exhausted items (`sk-communication` -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No new dead ends worth reducer promotion. The two standing exhausted items (`sk-communication`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead ends worth reducer promotion. The two standing exhausted items (`sk-communication`

### No new dead ends worth reducer promotion. The two standing items remain the `sk-communication` -- BLOCKED (iteration 10, 1 attempts)
- What was tried: No new dead ends worth reducer promotion. The two standing items remain the `sk-communication`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead ends worth reducer promotion. The two standing items remain the `sk-communication`

### Note for the reducer: candidates 11, 21, 24 and 28 have no home surface today. That is a finding -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Note for the reducer: candidates 11, 21, 24 and 28 have no home surface today. That is a finding
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Note for the reducer: candidates 11, 21, 24 and 28 have no home surface today. That is a finding

### Re-deriving the mechanism-half inventory inside this iteration: dropped for budget, and it is a -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Re-deriving the mechanism-half inventory inside this iteration: dropped for budget, and it is a
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-deriving the mechanism-half inventory inside this iteration: dropped for budget, and it is a

### Re-enumerating the consumers: the dispatch pre-completed the enumeration and it was reused. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Re-enumerating the consumers: the dispatch pre-completed the enumeration and it was reused.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-enumerating the consumers: the dispatch pre-completed the enumeration and it was reused.

### Re-opening the merge, the corrected counts (32 gate-facing rows) or the two closed verifications -- BLOCKED (iteration 7, 2 attempts)
- What was tried: Re-opening the merge, the corrected counts (32 gate-facing rows) or the two closed verifications
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-opening the merge, the corrected counts (32 gate-facing rows) or the two closed verifications

### Re-reading the three vendored sources to "re-derive" the merge: the three iteration narratives carry -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Re-reading the three vendored sources to "re-derive" the merge: the three iteration narratives carry
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-reading the three vendored sources to "re-derive" the merge: the three iteration narratives carry

### Retrying any strategy §9 BLOCKED direction: none was approached; the standing blocked items were used -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Retrying any strategy §9 BLOCKED direction: none was approached; the standing blocked items were used
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Retrying any strategy §9 BLOCKED direction: none was approached; the standing blocked items were used

### Retrying any strategy §9 BLOCKED direction. None was approached; the two standing blocked items -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Retrying any strategy §9 BLOCKED direction. None was approached; the two standing blocked items
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Retrying any strategy §9 BLOCKED direction. None was approached; the two standing blocked items

### Rule 10 as covered by `communication.md:74`: that clause is sentence-internal (nested -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Rule 10 as covered by `communication.md:74`: that clause is sentence-internal (nested
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Rule 10 as covered by `communication.md:74`: that clause is sentence-internal (nested

### Rule 15 as covered by the atomic-paragraph rule: atomicity and progression are different axes, -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Rule 15 as covered by the atomic-paragraph rule: atomicity and progression are different axes,
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Rule 15 as covered by the atomic-paragraph rule: atomicity and progression are different axes,

### Spending further research actions on the content of the five key questions: the dispatch focus holds, and -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Spending further research actions on the content of the five key questions: the dispatch focus holds, and
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Spending further research actions on the content of the five key questions: the dispatch focus holds, and

### STYLE.md as a second source for a pre-drafting reader model: its reader constraints are -- BLOCKED (iteration 2, 1 attempts)
- What was tried: STYLE.md as a second source for a pre-drafting reader model: its reader constraints are
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: STYLE.md as a second source for a pre-drafting reader model: its reader constraints are

### The comment-tic half as covered by HVR: HVR's scope is documents (`HVR:29`), so it cannot -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The comment-tic half as covered by HVR: HVR's scope is documents (`HVR:29`), so it cannot
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The comment-tic half as covered by HVR: HVR's scope is documents (`HVR:29`), so it cannot

### The depth-signaling ban and the "honestly" ban as new: covered by `HVR:304`, `HVR:318`, -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The depth-signaling ban and the "honestly" ban as new: covered by `HVR:304`, `HVR:318`,
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The depth-signaling ban and the "honestly" ban as new: covered by `HVR:304`, `HVR:318`,

### The prose half of ADHD rule 5 (`SKILL.md:73-78`) is a candidate for reducer promotion to -- BLOCKED (iteration 9, 1 attempts)
- What was tried: The prose half of ADHD rule 5 (`SKILL.md:73-78`) is a candidate for reducer promotion to
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The prose half of ADHD rule 5 (`SKILL.md:73-78`) is a candidate for reducer promotion to

### The README install and license sections as communication recommendations: they are -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The README install and license sections as communication recommendations: they are
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The README install and license sections as communication recommendations: they are

### Treating "defer" as a closure-legal verdict for c11/c21/c24/c28: AC-001's vocabulary is -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating "defer" as a closure-legal verdict for c11/c21/c24/c28: AC-001's vocabulary is
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating "defer" as a closure-legal verdict for c11/c21/c24/c28: AC-001's vocabulary is

### Treating a document/reply file split as the mechanism that deletes the exclusion table: findings 2 -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating a document/reply file split as the mechanism that deletes the exclusion table: findings 2
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a document/reply file split as the mechanism that deletes the exclusion table: findings 2

### Treating the 34 covered rows as merge inputs: covered rows are closed; only candidate rows (47) -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating the 34 covered rows as merge inputs: covered rows are closed; only candidate rows (47)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the 34 covered rows as merge inputs: covered rows are closed; only candidate rows (47)

### Treating the four-occurrence count in C-4 as wrong because only three lines are named: the count -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating the four-occurrence count in C-4 as wrong because only three lines are named: the count
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the four-occurrence count in C-4 as wrong because only three lines are named: the count

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- `sk-communication` as an owning surface for any of the 18 rules. Its SKILL.md defines a (iteration 1)
- A pre-writing reader-model rule hiding inside `presenting-decisions.md` §3 or (iteration 1)
- Rule 10 as covered by `communication.md:74`: that clause is sentence-internal (nested (iteration 1)
- Rule 15 as covered by the atomic-paragraph rule: atomicity and progression are different axes, (iteration 1)
- No new dead ends to promote. The `sk-communication` display-only boundary and the (iteration 2)
- STYLE.md as a second source for a pre-drafting reader model: its reader constraints are (iteration 2)
- The comment-tic half as covered by HVR: HVR's scope is documents (`HVR:29`), so it cannot (iteration 2)
- The depth-signaling ban and the "honestly" ban as new: covered by `HVR:304`, `HVR:318`, (iteration 2)
- The README install and license sections as communication recommendations: they are (iteration 2)
- **`README.md:22-30` (install) and `:99-101` (license)** as communication recommendations — (iteration 3)
- **Counting the rule restatements in `README.md:71-80` and `agents/gemini.toml:7-23` as (iteration 3)
- **Reading the source as if it carried a rubric for reply quality.** It does not; `rubric.md` is (iteration 3)
- **The `.github/readme/*.md` translations and `.github/install/*.md` locales** as independent (iteration 3)
- **Treating the Gemini/OpenAI agent mirrors as alternative rulesets.** `agents/openai.yaml:1-7` (iteration 3)
- **Treating the source's six overrides as new rules.** Five map onto existing repo rules (iteration 3)
- No new dead ends worth reducer promotion. The synthesis confirmed the two standing constraints and (iteration 4)
- Note for the reducer: candidates 11, 21, 24 and 28 have no home surface today. That is a finding (iteration 4)
- Re-reading the three vendored sources to "re-derive" the merge: the three iteration narratives carry (iteration 4)
- Retrying any strategy §9 BLOCKED direction. None was approached; the two standing blocked items (iteration 4)
- Treating the 34 covered rows as merge inputs: covered rows are closed; only candidate rows (47) (iteration 4)
- Counting the conflict ADRs as additional allocation rows on top of the 29 candidates: C-1 is (iteration 5)
- Expecting the mirror check to execute its targets as a load smoke test: the fallback rows are (iteration 5)
- No new dead ends worth reducer promotion. The two standing exhausted items (`sk-communication` (iteration 5)
- Treating "defer" as a closure-legal verdict for c11/c21/c24/c28: AC-001's vocabulary is (iteration 5)
- No new dead ends worth reducer promotion. The standing exhausted items (`sk-communication` as a (iteration 6)
- Re-opening the merge, the corrected counts (32 gate-facing rows) or the two closed verifications (iteration 6)
- Treating the four-occurrence count in C-4 as wrong because only three lines are named: the count (iteration 6)
- No new dead ends worth reducer promotion. The standing exhausted items (`sk-communication` as a rule (iteration 7)
- Retrying any strategy §9 BLOCKED direction: none was approached; the standing blocked items were used (iteration 7)
- Spending further research actions on the content of the five key questions: the dispatch focus holds, and (iteration 7)
- "A document/reply split removes the hand-maintained exclusion list" — eliminated. Candidate for (iteration 8)
- Re-enumerating the consumers: the dispatch pre-completed the enumeration and it was reused. (iteration 8)
- Treating a document/reply file split as the mechanism that deletes the exclusion table: findings 2 (iteration 8)
- Re-deriving the mechanism-half inventory inside this iteration: dropped for budget, and it is a (iteration 9)
- The prose half of ADHD rule 5 (`SKILL.md:73-78`) is a candidate for reducer promotion to (iteration 9)
- Candidate for reducer promotion to "exhausted": using the existing routing benchmark as the (iteration 10)
- No new dead ends worth reducer promotion. The two standing items remain the `sk-communication` (iteration 10)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- The other four key questions stay open for the other two sources: covered-vs-new for (iteration 1)
- Cross-source synthesis across clarity.md and STYLE.md is now largely in place (two two-source (iteration 2)
- The deferred `sk-code-quality` comment-checklist read (F8). (iteration 2)
- `i-have-adhd-main` remains uninventoried, including the mechanism half: session-start hook, (iteration 2)
- The deferred `sk-code-quality` comment-checklist read (F8 from iteration 2) is still open. (iteration 3)
- `research/research.md` was not created. `deep-research-config.json` sets (iteration 3)
- The three sources are now all inventoried. The cross-source synthesis the topic finally needs (iteration 3)
- Whether the repo's doctor runtime-mirror surface performs a byte-compare or a load smoke test, (iteration 3)
- Whether the doctor runtime-mirror surface performs a byte-compare or a load smoke test, and whether (iteration 4)
- The deferred `sk-code-quality` comment-checklist read (candidate 25; F8 from iteration 2) — still (iteration 4)
- `research/research.md` config-vs-strategy discrepancy — still open (iteration 3 edge case). (iteration 4)
- New: which phase schedules the baseline capture for the reply-quality harness (phase 002's record (iteration 4)
- Whether the unread `code-style-guide.md` §4 / Webflow style-guide §5 comment sections carry (iteration 5)
- The baseline-capture scheduling question from iteration 4's F4 — still with the reducer/operator. (iteration 5)
- Whether CI also runs the pi checkers, the codex-hooks-installer check and the fallback-health (iteration 5)
- Duplicate `CHK-CMT-01` id in the checklist asset — belongs to `sk-code-quality`'s owner. (iteration 5)
- The 001→002 handoff's missing `research.md` — now a named gate blocker (F2); resolution belongs (iteration 5)
- New: the reducer should republish C-4 with the corrected location list before phase 002 consumes (iteration 6)
- The 001 to 002 handoff's missing `research.md` (iteration 5 F2), a named gate blocker owned by the (iteration 6)
- The baseline-capture scheduling question from iteration 4's F4 (with the reducer/operator). (iteration 6)
- Whether CI also runs the pi checkers, the codex-hooks-installer check and the fallback-health rows (iteration 6)
- Duplicate `CHK-CMT-01` id in the `sk-code-quality` checklist asset (owned by that skill). (iteration 6)
- Whether the unread `code-style-guide.md` section 4 and Webflow style-guide section 5 comment (iteration 6)
- Baseline-capture scheduling (phase 002's record with the operator). (iteration 7)
- 001 to 002 handoff's missing `research.md` (workflow/reducer; gate blocker). (iteration 7)
- Duplicate `CHK-CMT-01` id (`sk-code-quality` owner). (iteration 7)
- CI runs the pi checkers, the codex-hooks-installer check and the fallback-health rows (repo CI surface; (iteration 7)
- C-4 republication (reducer, F2). (iteration 7)
- Unread comment sections in `code-style-guide.md` section 4 / Webflow section 5 (sk-code-quality surface; (iteration 7)
- New: does `scripts/hvr_scan.py` hard-require section 9's headings? That decides whether extracting (iteration 8)
- The five key questions stay open as recorded in `strategy.md:34-43`. (iteration 8)
- Carried forward: 001 to 002 handoff's missing `research.md`; baseline-capture scheduling; the (iteration 9)
- The five key questions stay open as recorded in strategy.md:34-43; this iteration did not close any. (iteration 9)
- Open for the reducer: if the operator adopts the split model, who owns the mode's failure mode when (iteration 9)
- The five key questions stay open as recorded in `strategy.md:34-43`; this iteration answers the (iteration 10)
- Which phase owns the blind judge and the weighted scorer (conditions 1-3) — a phase-002/005 (iteration 10)
- Carried forward unchanged: the 001→002 handoff's missing `research.md`; C-4 republication; the (iteration 10)
- Baseline-capture ownership (Finding 4) — still with the reducer/operator; this iteration names it (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Baseline-capture ownership (Finding 4) — still with the reducer/operator; this iteration names it

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

`resource-map.md` not present; skipping coverage gate.

### Bounded Context Snapshot

- **Source pointers.** The stack to read and cite: `AGENTS.md` sections 3 and 8; `REPO RULES.md` section 2 trigger table and section 3 index; `repo-rules/communication.md`, `repo-rules/presenting-decisions.md`, `repo-rules/handoff-and-questions.md`; `.opencode/skills/sk-communication/SKILL.md`; `.opencode/commands/rewrite/response.md` and `.opencode/commands/rewrite/response-by-external-agent.md`; `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md` and that mode's `references/scope-and-exemptions.md`.
- **Reuse candidates.** The existing repo-rule file shape, which every rule follows: a routed-from line, a bounded-by statement, a fires-when list, numbered sections and a self-check. The wording standard as the single home a rewrite path points at. The skill's existing `benchmark/` folder as the place a measurement would live.
- **Integration points.** The router's trigger table is the only path from an action to a rule file, so a rule with no trigger row never loads. The skill deliberately carries no wording rubric and points at the standard instead, so a recommendation that would add a rubric to a command is barred by the skill's own rule.
- **Constraints and risks.** `repo-rules/communication.md` records that it reached a length ceiling, which is why the decision-shape rules were split into their own file, so a recommendation that grows it needs a split rather than an append. The wording standard is written for documents, with a pre-publish checklist and a hundred-point score, and the skill consumes it for live replies by excluding two sections by hand. `AGENTS.md` section 8 keeps only the two clauses that must bind when nothing loads, and Gate 5 fires on the first write, so a read-only turn loads no rule file at all.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05, recorded as telemetry only
- Convergence mode: `off`, so convergence never stops this run
- Stop policy as requested by the operator: max-iterations, forced depth, no early convergence
- Per-iteration budget: 12 tool calls, 10 minutes
- Executor: `cli-pi`, model `deepseek-v4.1-flash` through the DevPass LLM Gateway, thinking pinned to `max`
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `research/inbox.jsonl`
- Question conflict owner: reducer registry
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Current generation: 1
- Started: 2026-09-12T13:59:00Z

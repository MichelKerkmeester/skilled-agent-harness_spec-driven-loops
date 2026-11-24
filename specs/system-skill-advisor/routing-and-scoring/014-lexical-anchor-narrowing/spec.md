---
title: "Feature Specification: Narrow the advisor's shared lexical anchor so two generic words no longer lift a skill to the task-intent floor"
description: "The advisor's task-intent floor treats a lexical score of 0.45 as the prompt naming a skill, so two generic words, one of them a task-verb synonym, lift unrelated skills to 0.82."
trigger_phrases:
  - "lexical anchor narrowing"
  - "narrow the advisor s shared lexical anchor"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Narrow the advisor's shared lexical anchor so two generic words no longer lift a skill to the task-intent floor

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Blocked |
| **Created** | 2026-11-24 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The task-intent confidence floor needs the prompt to name the skill. One of the four ways it accepts is a lexical score of `taskIntentLexicalAnchorFloor` (0.45). The lexical lane expands task verbs into synonyms ("fix" adds "debug", "correct" and "patch") and divides by the prompt's own word count. So a three or four word prompt with one generic noun and one synonym hit reaches 0.5 or more for any skill whose vocabulary holds both, and the floor lifts it to 0.82.

### Purpose
A skill passes the lexical anchor only when the prompt itself names something that skill owns, so generic prompts stop lifting several unrelated skills at once.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
In-process advisor probe on advisor 2.0.3.0, skills at 0.8 or above
fix the container orchestration config => sk-code:0.820, mcp-code-mode:0.820, mcp-browser-use:0.820
fix the code in the parser => sk-code:0.826, local-webflow:0.820
rewrite this prompt so it is shorter => sk-prompt:0.884, sk-doc:0.820, sk-code:0.820
run the doctor update check => cli-classifier:0.820, sk-doc:0.820, system-skilled-doctor:0.820
update the plan for the mode rollout => system-spec-kit:0.820, cli-external-orchestration:0.820

Anchor trace from the same scorer: each lift above at exactly 0.820 that names
no skill came from the lexical clause, with raw lexical scores 0.50 to 1.00
built from tokens such as "debug" (a "fix" synonym), "check", "run" and "code".
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Measure which lexical tokens carry each false lift: prompt words, synonym expansions or partial-word matches.
- Change the lexical anchor so synonym expansions alone, or generic tokens alone, do not count as naming a skill.
- Add the probe prompts above to a pinned slice, with the skill each should and should not reach.

### Out of Scope
- The explicit lane, the category hints and the id-noun rule - advisor 2.0.3.0 settled those.
- The lexical score itself, used for ranking - this packet changes only when a lexical score counts as an anchor for the floor.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Modify | The lexical anchor test in the `hasNamedAnchor` computation |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts` | Modify, if the measurement needs it | Mark which evidence tokens came from synonym expansion |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/` slices and baselines | Modify | New pinned rows; re-pins only with operator approval |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | None of the five probe prompts lifts a skill it does not name to 0.8 or above, and the named skills keep their lift: sk-prompt on the prompt rewrite, system-skilled-doctor on the doctor check. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The eight ratchet metrics hold, and any moved pin in the command, doctor or divergence slices is approved by the operator before it lands. |
| REQ-003 | The mcp-browser-use two-stage replay still fails only MBU-PB-04. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The probe prompts return only the skills they name.
- **SC-002**: The full advisor suite fails only tests that failed before the change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The ratchet, command, doctor and ledger slices | A slice that moves blocks the change | Stop and ask before any re-pin |
| Risk | Real requests that rely on two shared words lose their 0.82 lift | High | Measure the corpus delta per candidate rule before choosing one |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

N/A: the change is a scoring rule, and no latency or service limit applies.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: an empty prompt has no lexical score and is unaffected.
- Maximum input: a long prompt dilutes the lexical score already, so the rule matters most for prompts of three to six words.
- Failure path: a candidate rule that moves a pinned slice is not landed without approval.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One rule in `fusion.ts`, maybe evidence tagging in `lexical.ts` |
| Risk | 15/25 | It touches every skill's confidence |
| Research | 10/20 | Candidate rules need corpus measurement |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Which rule can narrow the anchor without moving the command and doctor slices? Three candidate families moved them (see `implementation-summary.md`). Open until a rule keeps sk-doc's typed `/create:*` rows.
<!-- /ANCHOR:questions -->

---



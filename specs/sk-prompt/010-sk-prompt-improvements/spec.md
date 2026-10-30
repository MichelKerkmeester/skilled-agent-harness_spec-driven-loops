---
title: "Feature Specification: Fix sk-prompt drift and recommend improvements from a survey of other prompt improvers"
description: "sk-prompt carries a stale advisor path, runs a scripted 3-10 round DEPTH process no surveyed prompt improver uses, and lacks the pasted-prompt guard and router fixtures its AI Systems sibling has. This packet fixes the drift and records ranked, sourced recommendations for rebuilding it."
trigger_phrases:
  - "sk prompt improvements"
  - "fix sk prompt drift and recommend improvements"
  - "replace depth in sk-prompt"
  - "prompt improver survey"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Fix sk-prompt drift and recommend improvements from a survey of other prompt improvers

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-30 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-prompt named a retired advisor script (`skill_advisor.py`), and the AI Systems Prompt Improver named a skill that no longer exists (`sk-prompt-small-model`). More important, sk-prompt runs a scripted DEPTH process of 3 to 10 rounds with a five-perspective minimum, and none of the surveyed vendor or community prompt improvers works that way. It also asks before it delivers, routes on text the user pasted, and has no runnable router fixtures. Its AI Systems sibling already fixed those last three gaps.

### Purpose
Fix the two stale references now, and give the next build of sk-prompt a ranked list of sourced recommendations, starting with what replaces DEPTH.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -c "DEPTH|depth-framework" .skilled/skills/sk-prompt/SKILL.md .skilled/skills/sk-prompt/ROUTER.md .skilled/agents/prompt-improver.md .skilled/commands/prompt/improve.md
.skilled/agents/prompt-improver.md:8
.skilled/skills/sk-prompt/ROUTER.md:14
.skilled/skills/sk-prompt/SKILL.md:19
.skilled/commands/prompt/improve.md:3
$ rg -c "strip_source_prompt" .skilled/skills/sk-prompt/ROUTER.md
strip_source_prompt hits exit=1
$ ls .skilled/skills/sk-prompt/benchmark
README.md
reports
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the stale `skill_advisor.py` reference in sk-prompt with `.skilled/bin/skill-advisor.cjs`.
- Remove the `sk-prompt-small-model` mention from the AI Systems Prompt Improver skill and README.
- Survey the local Prompt Improver and public prompt improvers, and record ranked recommendations with sources.
- Specify the DEPTH replacement and the follow-on improvements as requirements a build can be checked against.

### Out of Scope
- Building the recommendations - the operator decides the build after reading them.
- The AI Systems copy of sk-prompt at `AI Systems/.skilled/skills/sk-prompt` - it is a vendored copy whose sync is owned by that repo.
- Per-model output profiles and a `target_model` field - sk-prompt stays model-agnostic, by operator decision on 2026-10-30.
- Prompt Improver's creative modes (`$vibe`, `$image`, `$video`) - no requirement asks sk-prompt to grow into them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-prompt/SKILL.md` | Modify | Advisor path fixed now; DEPTH removal and the rebuilt pipeline later |
| `AI Systems/Prompt Improver/sk-prompt-improver/SKILL.md` and `README.md` | Modify | Dead related-skill mention removed now |
| `.skilled/skills/sk-prompt/references/depth-framework.md` | Delete or replace | Becomes the one-pass checklist |
| `.skilled/skills/sk-prompt/ROUTER.md`, `references/patterns-evaluation.md`, `assets/cli-prompt-quality-card.md` | Modify | Drop DEPTH loading, add the pasted-prompt guard and the component skeleton |
| `.skilled/agents/prompt-improver.md`, `.skilled/commands/prompt/` (4 files), `manual-testing-playbook/` (25 files naming DEPTH) | Modify | Callers that name DEPTH today |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

The recommendations are ranked by impact. Each names its source; the survey ledger is `scratch/prompt-improver-survey.md`.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both stale references are gone. | `rg -n "skill_advisor.py" .skilled/skills/sk-prompt/SKILL.md` prints nothing, and `rg -n "sk-prompt-small-model"` over the Prompt Improver skill and README prints nothing. |
| REQ-002 | Replace DEPTH with one checklist pass: check the prompt once against about ten components (role, task, context, examples, format, constraints, success criteria, contradictions, length), mark each present, absent or not needed with a one-line reason, write the prompt, then self-check it once against stated criteria. Sources: Anthropic best practices ("Prefer general instructions over prescriptive steps", "Before you finish, verify your answer against" stated test criteria), OpenAI's edit meta-prompt, the christabone checklist. | `references/depth-framework.md` is replaced by `references/improvement-checklist.md`, and `rg -c "DEPTH"` over sk-prompt, the agent and the command prints 0 outside changelogs. |
| REQ-003 | Add an early exit: a prompt that already passes the checklist gets minimal edits or none, and the reply says so. Sources: OpenAI's "Simple Change" check, christabone's "Not every prompt needs improvement", severity1's pass-through. | A playbook scenario feeds a well-formed prompt and expects an unchanged or minimally changed prompt. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Deliver first and list defaults as numbered open items; ask one question only when there is no prompt and no task. Source: Prompt Improver's 2026-10-18 change; vendor improvers ask nothing. | `SKILL.md` §4 no longer says to ask before processing, and a playbook scenario with a soft gap expects a prompt plus an open item. |
| REQ-005 | Route only on the user's own words: set a pasted prompt aside before mode detection. Source: Prompt Improver `strip_source_prompt()`. | `rg -c "strip_source_prompt" .skilled/skills/sk-prompt/ROUTER.md` prints at least 1, and a fixture with `$json` inside a pasted prompt does not select JSON. |
| REQ-006 | Add runnable router fixtures in `benchmark/router/`. Source: Prompt Improver's `run_fixtures.sh`, which passes 32 of 32. | `bash .skilled/skills/sk-prompt/benchmark/router/run_fixtures.sh` prints a `PASSED n/n` line. |
| REQ-007 | Judge quality by test inputs before a self-score: an optional quick test runs 2 or 3 realistic inputs through the old and new prompt. CLEAR stays as a short screen with the reason written before each score. Sources: Anthropic skill-creator, promptfoo, DSPy, OpenAI's optimizer and Vertex. | `SKILL.md` describes the quick test, and the structured output block carries a test line next to the CLEAR line. |
| REQ-008 | Build every prompt from one default component skeleton, and keep the seven framework names as optional presets a user or caller may still name. No source says to retire named frameworks, so presets stay until tests show they add nothing. | The selection matrix in `SKILL.md` §3 and `references/patterns-evaluation.md` §2 is replaced by the skeleton plus presets; `assets/framework-registry.json` is benchmark scaffold and stays. |
| REQ-009 | Add three craft checks to the pass: examples when they help (at least 1, about 3 typical, at most 5, in `<example>` tags), a contradiction check, and softer wording in place of CRITICAL and MUST with the reason given, without banning capitals. Sources: Anthropic best practices and skill-creator, the GPT-5 prompting guide. | Each check appears as a checklist row, and a playbook scenario with two clashing rules expects them resolved. |
| REQ-010 | Dropped: sk-prompt stays model-agnostic, by operator decision on 2026-10-30. No per-model profiles and no `target_model` field; sk-prompt v3.0.0.0 already retired its model profiles. | Outside `changelog/` and `benchmark/reports/`, `rg -l -i "model profile\|target_model" .skilled/skills/sk-prompt` lists no file, as it does today. |
| REQ-011 | Cap growth and report changes: the reply warns when the improved prompt grows past about 3 times the original, the user's guidelines and examples are preserved as closely as possible (word for word only on request), and the reply lists what was added, changed, removed and skipped. Sources: christabone, the OpenAI meta-prompt. | The transparency report holds a change list, and a playbook scenario checks the length cap. |
| REQ-012 | Rename the DEPTH-named caller surfaces: the confirm checkpoints `after_discover/after_prototype/after_test` and the `DEPTH Rounds` display field. Source: both research lineages. | `rg -n "after_discover\|DEPTH Rounds" .skilled/commands/prompt` prints nothing. |
| REQ-013 | Use one repair limit everywhere: up to 3 repair cycles, the value both command YAMLs and Prompt Improver already use. | `rg -n "retry once\|one retry\|exactly once" .skilled/skills/sk-prompt/SKILL.md .skilled/agents/prompt-improver.md` prints nothing. |
| REQ-014 | Replace DEPTH energy with three effort levels: quick for `$short`, standard by default, thorough for `$refine`. Effort changes checklist breadth and whether the quick test runs, never a hidden round count. | `references/improvement-checklist.md` defines the three levels, and the agent maps `complexity_hint` onto them. |
| REQ-015 | Give CLEAR one canonical home in `references/patterns-evaluation.md` §10. | `rg -n "CLEAR" .skilled/skills/sk-prompt/references/improvement-checklist.md` lines point to patterns-evaluation, not a second rubric. |

<!-- BEGIN GENERATED: deep-research/spec-findings -->
### Deep Research Findings

Three iterations on Devin SWE 2 Max (`research/research.md`) validated REQ-002 to REQ-011 and refuted none. Five adjustments:

- **REQ-008:** aim the criterion at `SKILL.md` §3 and `references/patterns-evaluation.md` §2. `assets/framework-registry.json` is benchmark scaffold, not the selection surface. Keep framework names as internal labels so the agent's `FRAMEWORK:` field still emits one.
- **REQ-009:** make the example count a range (at least 1, about 3 typical, at most 5) because vendor guides disagree.
- **REQ-005:** port all of `strip_source_prompt()`, including whole-token matching and the two-command conflict rule.
- **REQ-010:** both runs recommended per-model-version profiles; the operator dropped REQ-010 to keep sk-prompt model-agnostic.
- **REQ-007:** the quick test runs locally, since OpenAI Evals shuts down on 2026-11-30.

A second opinion from GPT-6 Luna (one iteration, `research/lineages/codex-luna/research.md`) agreed on the rest and differed in three places:

- **REQ-008:** keep one default skeleton plus optional presets or aliases, and remove presets only once tests show they add nothing. No source says to retire named frameworks.
- **REQ-009:** use examples when they help, not a fixed count, and soften capitalised constraints without banning them.
- **REQ-011:** OpenAI says to preserve user content "entirely, or as closely as possible", not word for word, so keep text verbatim only on request and treat 3x as a warning.

Uncovered work to add to the build: rename the confirm checkpoints `after_discover/after_prototype/after_test` and the `DEPTH Rounds` display field; settle the CLEAR retry count, which is one in `SKILL.md:273` and the agent but 3 in both command YAMLs; name an effort knob to replace DEPTH energy for `$short`, `$refine` and `complexity_hint`; and give CLEAR one canonical home.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both residue greps in REQ-001 print nothing.
- **SC-002**: After the build, `rg -c "DEPTH"` over sk-prompt, `.skilled/agents/prompt-improver.md` and `.skilled/commands/prompt/` prints 0 outside changelogs, and the new router fixtures print `PASSED n/n`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `@prompt-improver` and `/prompt:improve` read sk-prompt's DEPTH and output-block contract | Removing DEPTH without them breaks the agent and the command | Change sk-prompt, the agent, its runtime mirrors and the command in one build, and check them with `/doctor:runtime-mirrors` |
| Risk | Survey claims rest on one delegate's reading of fetched pages | Med | Three load-bearing quotes were re-fetched and confirmed; the rest are marked by source in the scratch ledger, and UNVERIFIED items carry no requirement |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the seven framework names survive as aliases a user can still ask for, or be removed outright (REQ-008)?
- ~~Should the vendored copy in AI Systems be refreshed from Skilled after the build, and by whom?~~ Resolved 2026-10-30: no. The operator chose to keep DEPTH in the AI Systems copy, so it stays on the pre-v4 method by design.
<!-- /ANCHOR:questions -->

---

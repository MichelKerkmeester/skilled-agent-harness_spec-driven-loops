---
title: "Feature Specification: Carry the deep-loop offer in the advisor hint"
description: "The advisor brief names a deep-loop command only as `/deep:review (ask)`, so a session that asks for the target first never opens the command doc and never asks the three-option offer. This packet puts the offer's options in the brief itself."
trigger_phrases:
  - "deep loop offer in hint"
  - "carry the deep loop offer in the advisor"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Carry the deep-loop offer in the advisor hint

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-11-23 |
| **Branch** | `worktrees/527-deep-loop-offer-in-hint` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The advisor brief names a deep-loop command as `system-deep-loop → /deep:review (ask)` and nothing more. The three-option offer (A run it with `:auto`, B `:confirm`, C no loop) lives only in the command doc, so a session that asks for the review target first never opens that doc and never asks the offer. Packet `012-deep-loop-command-offers` measured this on prompt F6: after its routing-step edit, one of four sessions asked the full offer and the other three asked for the target first.

### Purpose
A session that sees a `/deep:research` or `/deep:review` command with policy `ask` in the brief can ask the three-option offer without opening the command doc first.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ printf '%s' '{"prompt":"extend the finished deep review by 3 iterations","session_id":"probe","cwd":"<repo root>","hook_event_name":"UserPromptSubmit"}' \
    | node .skilled/hooks/skill-advisor/claude/user-prompt-submit.js
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"Advisor: live; use system-deep-loop → /deep:review (ask) 0.95/0.12 pass.\nDirectives:\n- Comment hygiene [HARD BLOCK]: NEVER embed ADR-/REQ-/CHK-/task-ids or spec paths in code comments — forbidden regardless of instruction. Write the durable WHY instead. Pre-commit gate blocks violations."}}

Run 2026-11-23 in worktree 527 at 72599d47a52. F6 rate from packet 012 after its routing-step edit: 1 of 4 sessions asked the offer
(scratch/behaviour/F6-after-step0.md and F6-sample-1.md to F6-sample-3.md in that packet).
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Render the three offer options after a `/deep:research` or `/deep:review` command whose policy word is `ask`, in the brief head that `lib/render.ts` builds, for example `system-deep-loop → /deep:review (ask: A /deep:review:auto, B /deep:review:confirm, C no loop)`.
- Keep every other command label as it renders today, including other `ask` commands and the child-session `parent-named only` label.
- Update the golden brief tests and the brief format line in the injection contract to the new head.
- Rerun F6 four times in a behaviour arena and record how many sessions ask the offer.

### Out of Scope
- Other `ask` commands such as `/create:changelog` or `/doctor:mcp debug`. Their offers have no fixed option set to name.
- The command docs and presentation contracts. Packet 012 already names the options there.
- Scoring, attachment and the policy table. The brief only changes how an attached command is printed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | Modify | Print the offer options after a `/deep:*` command with policy word `ask` |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-brief-golden.vitest.ts` | Modify | Expect the new head on the two deep-loop goldens, unchanged heads elsewhere |
| `.skilled/hooks/injection-contract.md` | Modify | Show the deep-loop variant of the brief head |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The brief head for a `/deep:research` or `/deep:review` command with policy word `ask` names options A, B and C, with A the command plus `:auto` and B the command plus `:confirm`. | The Measured Behavior command prints `system-deep-loop → /deep:review (ask: A /deep:review:auto, B /deep:review:confirm, C no loop)` in its first line, and the golden test for `/deep:research` expects the research names. |
| REQ-002 | Every other command label renders as before. | `npx vitest run` in the advisor runtime reports 0 failed, and the golden heads for `/doctor:git hooks (ask)` and every non-deep row are unchanged in the diff. |
| REQ-003 | A child session keeps the `parent-named only` label with no options. | A test renders a `/deep:review` recommendation with `childSession: true` and expects `(parent-named only)` with no `A ` option text. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The longer head still fits the default token cap with its companion line. | A test renders a `/deep:review` head with a `/doctor:deep-loop` companion at the default cap and expects both lines. |
| REQ-005 | F6 is sampled four times after the change and the rate is recorded. | `implementation-summary.md` states how many of four F6 sessions asked the three-option offer, with each run's file under `scratch/behaviour/`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The Measured Behavior command prints the three options in the brief head, and the advisor suite reports 0 failed.
- **SC-002**: At least three of four F6 sessions ask the three-option offer, against one of four before.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The behaviour arena from packet 012 (`prepare-behaviour-arena.mjs`, `claude -p` with a budget cap) | Without it SC-002 cannot be measured | Record REQ-005 as deferred with the reason and keep SC-001 as the closure evidence |
| Risk | Pi shows the brief inside the operator's visible prompt, so a longer head is longer there too | Low | Keep the suffix to one parenthesis under 80 characters, and check the Pi rendering once by hand |
| Risk | A session may run option A at once instead of asking | Med | The policy word `ask` stays first in the parenthesis, and F6 samples show whether sessions ask or run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Should the options also name the Gate 3 spec folder answer, for example `A /deep:review:auto --spec-folder=<answer>`? The plan assumes no, because the brief cannot know the answer and a placeholder costs length.
- Should other `ask` commands gain a generic hint such as `(ask: offer it, then wait)`? The plan assumes no, as Out of Scope says.
<!-- /ANCHOR:questions -->

---



---
title: "Feature Specification: Enforce asking operator decisions through each runtime's native ask-question tool instead of prose option menus"
description: "Agents end turns with prose A/B/C option menus instead of calling the runtime's ask-question tool, because the rule text permits it and no hook enforces it. This packet tightens the rule text and adds a turn-end guard on every runtime that can re-prompt."
trigger_phrases:
  - "ask surface enforcement"
  - "enforce asking operator decisions through each runtime s"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Enforce asking operator decisions through each runtime's native ask-question tool instead of prose option menus

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-08 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Agents end turns with a prose menu of lettered options and a closing question instead of calling the runtime's ask-question tool, so the operator has to type an answer to a question the runtime could have asked as a structured choice. The rule that should prevent it, `.skilled/repo-rules/communication-handoff.md` §4 and §5, asks for "a structured choice" and keeps a prose fallback that matches the failure exactly, and `AGENTS.md` Gate 3 teaches the prose `A) Existing B) New` format in the always-loaded file. No hook checks the turn end: all three Claude Code Stop hooks run with `async: true`.

### Purpose
On every runtime that has an ask tool and a turn-end seam that can re-prompt, a turn that ends in a prose option menu with no ask-tool call is sent back once with an instruction to ask through the tool.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ jq -r '.hooks.Stop[].hooks[] | "\(.async) \(.command|capture("node (?<s>[^ ]+)").s)"' .claude/settings.json
true .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-stop.js
true .skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs
true .skilled/hooks/session-relaunch/claude/stop-arm.mjs
$ grep -n "OPTION_LINE =" .skilled/hooks/decision-capture/lib/chat-questions.mjs
24:const OPTION_LINE = /^\s*(?:[-*]\s+)?(?:\*\*)?[A-D]\)/;
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Amend `communication-handoff.md` §4 and §5 so the ask tool named in §5 is the required surface and the prose fallback applies only where no surface exists, and point `AGENTS.md` Gate 3 at §5 without naming a tool.
- Add a shared detector under `.skilled/hooks/ask-surface-guard/lib/` that finds a closing prose option menu (lettered, numbered or bold labels, fences and quotes stripped) and checks the turn for an ask-tool call.
- Add enforcing guards that re-prompt once per turn on Claude Code (synchronous Stop with `decision: "block"`), DSH (`agent/turn-stopping`), OpenCode (`session.idle` plus `promptAsync`) and Pi (turn end plus a steered `sendMessage`).
- Add advisory-only adapters for Codex and Devin Stop that log the miss and never block.
- Log each fire to `.skilled/skills/.state/ask-surface/fires.jsonl` and prove the live behavior with three conversation scenarios in the system-spec-kit playbook: a live decision, the kill switch and a numbered summary.
- Register the guard through `hook-registry.json`, the DSH repo-guards bundle, `.opencode/plugins/` and `.pi/extensions/`, with a kill switch through `isHookEnabled('ask-surface')`.

### Out of Scope
- Cursor - it has no ask-question tool, so the prose fallback is the correct behavior there.
- Hermes - the runtime was removed in v4.0.2.0.
- Blocking on Codex and Devin - neither Stop event has a documented block contract in this repository; the adapters stay advisory until one is confirmed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/repo-rules/communication-handoff.md` | Modify | §4 and §5: required surface, capability-only fallback, corrected tool table |
| `AGENTS.md` | Modify | Gate 3: ask through the §5 surface; the A/B/C/D labels are the options passed to it |
| `.skilled/hooks/ask-surface-guard/lib/` | Create | Shared detector, tool scan, per-turn marker |
| `.skilled/hooks/ask-surface-guard/{claude,dsh,pi,codex,devin}/` | Create | Per-runtime adapters and tests |
| `.opencode/plugins/ask-surface-guard.js` | Create | OpenCode `session.idle` guard |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Modify | Register the Claude, Codex and Devin bindings; generated configs follow |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The detector fires on a closing prose menu (two or more `A)`, `1)` or `**A)**` option lines plus a question) and passes on numbered steps with no question, a question with no options, a menu inside a code fence or blockquote, and a turn whose transcript holds an ask-tool call. Verify: the fixture suite passes with each fixture's expected verdict. |
| REQ-002 | The Claude Code Stop guard runs synchronously, returns `{"decision":"block","reason":...}` once for a firing turn, and returns nothing when `stop_hook_active` is true. Verify: adapter tests over a firing payload and a `stop_hook_active: true` payload. |
| REQ-003 | `communication-handoff.md` §5 is the only rule text that names an ask tool, and `AGENTS.md` Gate 3 points at §5. Verify: `rg -n "AskUserQuestion\|request_user_input\|ask_user_question" AGENTS.md .skilled/repo-rules` lists only §5 lines. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | DSH, OpenCode and Pi guards re-prompt once per turn through their native seam, and never on a session with no ask tool (DSH headless, a subagent). Verify: each adapter's test asserts one re-prompt for a firing turn and none for the second fire in the same turn. |
| REQ-005 | Codex and Devin adapters log an advisory and never block. Verify: adapter tests assert an empty or non-blocking envelope. |
| REQ-006 | `SYSTEM_ASK_SURFACE_DISABLED=1` turns every guard off. Verify: each adapter test with the flag set returns no re-prompt. |
| REQ-007 | The registry and generated configs agree. Verify: `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` exits 0. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: A Claude Code turn that ends in the prose menu from the original report is sent back once with the instruction to use `AskUserQuestion`, shown by the adapter test over that message.
- **SC-002**: All ten fixtures in the detector suite return their expected verdict, including the four false-positive guards.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Claude Code Stop payload fields (`stop_hook_active`, `transcript_path`, `last_assistant_message`) | Without the last message the guard cannot see the menu | Read the last assistant entry from `transcript_path`, reusing the decision-capture transcript reader |
| Risk | A false positive re-prompts an ordinary summary | Med | Fence and quote stripping, a two-option minimum, one re-prompt per turn, and the kill switch |
| Risk | A guard loops by re-prompting its own re-prompted turn | High | `stop_hook_active` on Claude, a per-turn marker on every runtime |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The synchronous Claude Stop guard finishes inside its 5-second registry timeout on a 10 MB transcript.

### Reliability
- **NFR-R01**: Any guard error fails open: the turn ends normally and the error goes to stderr, never a block.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: an empty last assistant message or a missing transcript passes with no re-prompt.
- Maximum input: only the closing block of the last assistant message is scanned, so a long message costs the same as a short one.
- Failure path: a parse error exits 0 with nothing on stdout, so the turn ends normally.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About 20 files and 900 LOC across six runtimes and two rule files |
| Risk | 12/25 | A blocking Stop hook can loop or re-prompt good turns; AGENTS.md is always loaded |
| Research | 8/20 | Done in `research/lineages/deepseek/research.md`, with OpenCode and Pi corrected by hand |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Does Codex `Stop` accept a block decision? Decision: treat it as advisory until a Codex release documents one.
- Does Devin `Stop` accept a block decision? Decision: advisory, the same as Codex.
<!-- /ANCHOR:questions -->

---



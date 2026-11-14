---
title: "Feature Specification: Phase 3: relaunch-goal-quote"
description: "The relaunch note's Goal is written each hop from the session's own memory and never quotes the bound packet's purpose. This phase makes both note writers ask for a copied Purpose line at the top of Goal when a packet is bound."
trigger_phrases:
  - "relaunch goal quote"
  - "phase 3 relaunch goal quote"
  - "purpose line in the handoff note goal"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: relaunch-goal-quote

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/371-purpose-retention-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-resume-purpose-row |
| **Successor** | 004-compaction-purpose-line |
| **Handoff Criteria** | Both note writers ask for the copied Purpose line, and the session-relaunch suite and the four mirror checks pass with the counts in `plan.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Carry a packet's purpose across handovers and compactions specification.

**Scope Boundary**: The text that tells a session how to write the relaunch note's `## Goal`. No hook logic, no validation rule and no receiver step changes.

**Dependencies**:
- None blocking. Child 002 adds a Purpose row to the `/speckit:resume` brief and uses the same purpose rule. This phase does not call its code or wait for it.

**Deliverables**:
- One guidance sentence group in `.skilled/commands/speckit/handoff.md`
- One guidance line in `.skilled/hooks/session-relaunch/lib/nudge.cjs`
- Two checks in the first test of `.skilled/hooks/session-relaunch/tests/nudge.test.cjs`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The parent exists to keep a packet's problem, purpose and user need in front of the next session across relaunch hops and compactions, because the purpose is written once in `spec.md` and no hop reads it back.

Locally, the relaunch note is the one hand-over text every receiver reads first, and its `## Goal` carries no copy of the packet's purpose. A session writes the note from one of two places. On a manual `/speckit:handoff` it follows `.skilled/commands/speckit/handoff.md`, which says only "Goal states what the work is for." On an automatic hop it follows the nudge that `handoffText` in `.skilled/hooks/session-relaunch/lib/nudge.cjs` builds for the Claude, Codex, OpenCode and Pi adapters, and that nudge says nothing about what Goal holds beyond "each non-empty". `prepare` and `keep` check only that Goal is non-empty (`validateHandoff` in `lib/relaunch-core.cjs`). The reason this matters is the orchestrator's inference, not a measured result: a Goal that each hop rewrites from its own memory degrades with every hop, so the note should quote a text that does not change between hops.

### Purpose
When a packet is bound, every relaunch note opens its Goal with one line copied word for word from the packet's purpose, so the text that says why the work exists reads the same after every hop.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ rg -n '^## Goal$|^Goal states' .skilled/commands/speckit/handoff.md && node -e "const n=require('./.skilled/hooks/session-relaunch/lib/nudge.cjs');const t=n.handoffText({notePath:'/tmp/n.md',sessionId:'s1',specFolder:'specs/demo/001-demo',runtime:'pi',loopId:'L1'});t.split('\n').forEach((l,i)=>{if(/## Goal/.test(l))console.log('nudge line '+i+':'+l)});console.log('nudge lines that say what Goal holds: '+t.split('\n').filter(l=>/(open|write|under) ## Goal/i.test(l)).length)"; echo "EXIT=$?"
110:## Goal
133:Goal states what the work is for.
nudge line 11:   followed by ## Goal, ## Done, ## Remaining work, ## In-flight state, each non-empty.
nudge lines that say what Goal holds: 0
EXIT=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Add to `handoff.md` Step 3 the rule that Goal opens with a copied `Purpose (<file>): <text>` line when `spec_folder` names a packet, with the parent and `goal.md` fallbacks.
- Add the same rule as one guidance line in the nudge that `handoffText` builds, placed after the `spec_folder` guidance line. Without it, automatic hops never see the rule, because the nudge spells out the note shape itself and never points at `handoff.md`.
- Add two checks to the first existing nudge test: the bound nudge carries the line in its fixed place, and the unbound nudge still carries it.

### Out of Scope
- A hook step that writes or checks the Purpose line at `prepare` or `keep` - weighed and rejected in `plan.md` section 3: it needs a purpose resolver in the hook, and child 004 owns that helper.
- The receiver steps in `handoff.md` section 5 and in `seedText` - the receiver already reads the note body that `claim` prints, so a copied line reaches it unchanged.
- The `/speckit:resume` Purpose row, the compaction line, the scaffold text and the continuity field - children 002, 004, 001 and 005 own them.
- The note template block at `handoff.md` lines 100-122 - the guidance under it is enough, and Step 3 calls that block exact.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/speckit/handoff.md` | Modify | Seven guidance lines after "Goal states what the work is for." |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modify | A `GOAL_GUIDANCE` constant and one entry in the `handoffText` line list |
| `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` | Modify | One constant and two checks in the first `handoffText` test |

The runtime mirrors need no edit. `.claude/commands/speckit/handoff.md` and `.cursor/commands/speckit-handoff.md` are symlinks to the canonical file, and `.opencode/commands/speckit` is a symlink to the canonical folder. The Codex, DeepSeek Harness and Pi prompt files are generated pointer stubs that name the canonical file and do not copy its body. The hook folder has no copy: `.opencode/hooks` and the `.claude/hooks` entries are symlinks.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The nudge that `handoffText` builds asks for the copied Purpose line | The line right after the `spec_folder is a repo-relative` line starts with `   When spec_folder names a packet, open ## Goal with one line` and holds `### Purpose`, `from parent` and `goal.md` |
| REQ-002 | `handoff.md` Step 3 states the same rule | `rg -n 'open Goal with one line .Purpose' .skilled/commands/speckit/handoff.md` prints one line, and the next three lines name the parent fallback, the `goal.md` Objective and when to leave the line out |
| REQ-003 | No existing behavior breaks | The full session-relaunch suite passes with 1014 tests and 0 failures, and the four mirror checks each exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The two writers ask for the same thing | Both texts name the `Purpose (<file>): <text>` form, the `Purpose (from parent <file>): <text>` form, the `goal.md` Objective fallback and leaving the line out when no text exists |
| REQ-005 | The session goal and the purpose cannot be read as two rival goals | `handoff.md` says a bound `goal.md` still binds the session goal and that the Purpose line says why that goal exists |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The Measured Behavior command prints `nudge lines that say what Goal holds: 1` after the change, where it printed 0 before.
- **SC-002**: `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs` prints `pass 89` and `fail 0`, and the full suite prints `pass 1014` and `fail 0`.
- **SC-003**: `git diff --stat` lists only the three files in Files to Change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Child 002's Purpose row in the `/speckit:resume` brief | Low. The receiver runs resume right after it reads the note when `spec_folder` is set, so 002 already shows the purpose there. This phase still works without 002 | Ship each child on its own. Both use the same purpose rule, so they cannot disagree on which text is the purpose |
| Risk | The line is model-followed, so a session can skip it or paraphrase it | Med | The rule says "word for word" and names the source file in the line, so a reader can check the copy. A hook check was weighed and held back in `plan.md` section 3 |
| Risk | A session adds the line and a later hop drops it | Low | The nudge repeats the rule on every hop, so each new note is asked for it again |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- How much does this phase add over child 002? Decision: little. When `spec_folder` is set, the receiver's seed tells it to read the note and run `/speckit:resume` in the same step (`seedText` in `nudge.cjs`), so 002's Purpose row reaches the same session. This phase adds the copy that sits in the note the receiver reads first, a sending session that rereads its packet purpose at each hop, and a fallback when resume is skipped or fails. That is why the plan stays at text only.
- Should a hook step check for the line later? Open. Revisit only if notes from real hops show sessions skip the line. No relaunch notes were sampled for this plan.
<!-- /ANCHOR:questions -->

---

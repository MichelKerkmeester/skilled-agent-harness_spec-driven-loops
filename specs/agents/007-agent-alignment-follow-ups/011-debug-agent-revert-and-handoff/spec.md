---
title: "Feature Specification: Phase 11: debug-agent-revert-and-handoff"
description: "The debug agent stacks a failed fix under the next one, can restart its method without end, claims a handoff file the workflows create and gives no path for it, keeps its output handoff inside its input template and asks questions it cannot ask. It is also 648 lines against a cap of 600. This phase fixes the four debug findings it owns and brings the file under the cap."
trigger_phrases:
  - "debug agent revert and handoff"
  - "phase 11 debug agent revert and handoff"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 11: debug-agent-revert-and-handoff

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 14 |
| **Predecessor** | 010-deep-loop-leaf-state-and-status |
| **Successor** | 012-review-agent-gates |
| **Handoff Criteria** | Every requirement in section 4 holds on the built tree, `wc -l < .skilled/agents/debug.md` prints 600 or less, `sync-agent-roster.cjs --check` prints `agent-roster: OK` and `check-agent-mirror-sync.cjs` exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the agent alignment follow-ups packet. It owns findings debug-1, debug-2, debug-4 and debug-5 of the agent review in `../scratch/agent-review/agents-review.out.md`. It also owns the debug part of across-6.

**Scope Boundary**: The canonical `.skilled/agents/debug.md`, its hand-kept `.claude` fork and the three generated runtime copies. The `Max 5 tool calls` clause, the pre-ticked checklist, the untrusted-content rule, the "Daemon-free retrieval" paragraph and the "Skip the Layer 1" line belong to phase 6. The code agent's quality gate and status words belong to phase 7. No workflow, script, skill or other agent file changes here.

**Dependencies**:
- Predecessor `010-deep-loop-leaf-state-and-status` and successor `012-review-agent-gates` touch other agent files and share no text with this phase.
- Phase 6 (`006-shared-agent-contract`) edits the same file first. It owns the "Max 5 tool calls" clause, the pre-ticked "Tests pass" line and the untrusted-content rule. This phase builds on the tree phase 6 leaves.
- Phase 7 (`007-code-agent-retry-and-status`) settles the code agent's quality gate and its `PASS`, `FAIL` and `BLOCKED` meanings, which the debug-to-code handoff relies on.

**Deliverables**:
- A Phase 5 that reverts a rejected fix before the next one and counts every rejected hypothesis, across Phase 1 restarts, toward the existing three-rejection escalation
- A handoff-file rule with a path, its creator and the case where @debug writes no file
- The output handoff out of the input template, and one rule for when @debug fixes and when it hands off
- An incomplete handoff that returns `Debug Blocked` with `missing_info`, and one escalation template
- A file of 600 lines or less, with the same required sections in the same order
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
When a fix fails, Phase 5 of the debug agent goes to the next hypothesis or back to Phase 1 and never undoes the failed edit, so fixes stack in the file against its own rule "single fix at a time". A restart after a new error rejects no hypothesis, so the three-rejection escalation never counts it. The agent says only it may create `debug-delegation.md`, yet `/speckit:implement` and `/speckit:complete` create that file with `scaffold-debug-delegation.sh`, sometimes as `debug-delegation-NNN.md`, and the agent names no path. One rule makes writing it ALWAYS while two others make it conditional. The four `@code` handoff fields sit inside the template the agent receives, and nothing says when it fixes and when it hands off. It is told to ask for missing information, which a subagent with no task tool cannot do. Two escalation templates disagree, and the file is 648 lines against a cap of 600.

### Purpose
A debug run leaves at most one fix in place, stops after three rejected hypotheses in total, writes only the handoff file it was given, returns instead of asking and fits under the agent size cap.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run at `c1dbb1bcc4` from the worktree root. The first command shows the file is unchanged since the review's base `09f1d6499a`, so the review's line numbers hold.

```text
$ git diff --stat 09f1d6499a HEAD -- .skilled/agents/debug.md | wc -l
       0
exit=0
$ wc -l < .skilled/agents/debug.md
     648
exit=0
$ sed -n '62p' .skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md | cut -c1-61
Production agent files should stay at or below **600 lines**.
exit=0
$ sed -n '335p;349,352p' .skilled/agents/debug.md
2. Make MINIMAL changes - single fix at a time
   └─► Tests fail?
       ├─► New error? → New observation cycle (Phase 1)
       └─► Same error? → Try next post-challenge hypothesis
           └─► All hypotheses exhausted? → ESCALATE
exit=0
$ rg -n -i 'revert|undo|roll ?back|restore' .skilled/agents/debug.md
286:- Reversibility (easily undone fixes first)
exit=0
$ rg -n 'earliest affected phase|3\+ hypotheses|3 failed hypotheses' .skilled/agents/debug.md
177:- If new evidence invalidates an earlier phase, return to the earliest affected phase and restate the updated observation, analysis, or hypothesis.
524:**Trigger:** 3+ hypotheses tested and rejected
610:❌ **Never continue past 3 failed hypotheses without escalating**
exit=0
$ sed -n '61p;339p;531p;631p' .skilled/agents/debug.md
- ONLY @debug may create, edit, or replace `debug-delegation.md`.
6. If writing `debug-delegation.md`, follow the exclusive write boundary in Section 0B
5. If `debug-delegation.md` is in scope, update it directly as @debug with the same evidence package
- Write all findings and evidence to `debug-delegation.md`; never modify source files without phase authorization.
exit=0
$ rg -n 'spec_folder|spec folder|debug-delegation-[0-9N]|scaffold' .skilled/agents/debug.md
exit=1
$ rg -n -o 'Run scaffold-debug-delegation.sh to generate .{0,95}' .skilled/commands/speckit/assets/speckit-implement.yaml .skilled/commands/speckit/assets/speckit-complete.yaml
.skilled/commands/speckit/assets/speckit-complete.yaml:949:Run scaffold-debug-delegation.sh to generate {spec_folder}/debug-delegation.md (versioned to debug-delegation-NNN.md if a prior file exists)
.skilled/commands/speckit/assets/speckit-implement.yaml:510:Run scaffold-debug-delegation.sh to generate <spec_folder>/debug-delegation.md (versioned to debug-delegation-NNN.md if a prior file exists)
exit=0
$ sed -n '96p;128,132p' .skilled/agents/debug.md
You receive structured input, not raw conversation:
### Debug To Implementation Handoff (only when diagnosis crosses to @code)
- **root_cause:** [Evidence-backed root cause, not a guessed symptom]
- **target_files:** [Recommended repo-relative files for the fix]
- **fix_recommendations:** [Smallest safe fix steps and verification target]
- **confidence:** [high | medium | low, matching the diagnosis evidence]
exit=0
$ rg -n -i 'quality-gate|quality gate|dispatch allows|allowed to fix' .skilled/agents/debug.md
exit=1
$ sed -n '4p;16p;139p' .skilled/agents/debug.md
mode: subagent
  task: deny
**If handoff is incomplete:** Ask for missing information before proceeding.
exit=0
$ rg -n '^## (Debug Escalation|ESCALATION: Debug Exhausted|Debug Blocked)' .skilled/agents/debug.md
435:## Debug Blocked
462:## Debug Escalation
535:## ESCALATION: Debug Exhausted
exit=0
$ node .skilled/bin/sync-agent-roster.cjs --check
agent-roster: OK
exit=0
$ node .skilled/bin/check-agent-mirror-sync.cjs | rg -c 'all comparable mirrors in sync'
1
exit=0
```

Classification of each owned finding against this output:

| Finding | Class | Evidence |
|---------|-------|----------|
| debug-1 | Reproduced | `:351` moves to the next hypothesis and `:350` to Phase 1, and no line reverts a fix (the only match is `:286`, a ranking criterion). The bound half is narrower than the review says: `:524` and `:610` already escalate at three rejected hypotheses, but the `:350` restart rejects none, so a fix that keeps raising new errors never reaches that trigger. |
| debug-2 | Reproduced | `:61` claims sole creation while both workflows run the scaffold script, at `speckit-implement.yaml:510` and also `speckit-complete.yaml:949`, which the review did not cite. `:631` says ALWAYS while `:339` and `:531` are conditional, and the file names no folder and no versioned name. |
| debug-4 | Reproduced | The four output fields sit under "You receive structured input" (`:96`, `:128-132`) and repeat the `AGENT_IO_HANDOFF v1` group in section 7. No line names a quality gate or says when to fix and when to hand off. |
| debug-5 | Reproduced | `:139` asks for information while the agent is a subagent with `task: deny` (`:4`, `:16`). Two escalation templates exist at `:462` and `:535`. The "Max 5 tool calls" part at `:153` is phase 6's and is not planned here. |
| across-6 (debug) | Reproduced | 648 lines against the 600 at `agent-template.md:62`. |
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Make Phase 5 revert a rejected fix with `Edit` before the next attempt, and count every rejected hypothesis, across Phase 1 restarts, toward the existing three-rejection trigger in section 8 (debug-1)
- Rewrite section 0B to name `<spec_folder>/debug-delegation.md` or the versioned `debug-delegation-NNN.md`, the scaffold script that seeds it and the rule that @debug updates only the file the dispatch names, then align the lines that repeat it (debug-2)
- Delete the four handoff fields from the input template, keep the `AGENT_IO_HANDOFF v1` group in section 7 as the one output handoff and add the fix-or-hand-off rule with the quality runner for a fix (debug-4)
- Turn the incomplete-handoff line into a `Debug Blocked` return with `missing_info`, and keep one escalation template (debug-5)
- Cut duplicated text until the file is 600 lines or less, keeping every required section in order (across-6)

### Out of Scope
- The "Max 5 tool calls" clause at `:153`, the pre-ticked lines at `:419-421`, the untrusted-content rule, the "Daemon-free retrieval" paragraph and the "Skip the Layer 1" line - phase 6 owns them (debug-3, across-1, across-2, across-4, across-5)
- The code agent's quality gate step and its status words - phase 7 owns `code.md`
- The consumers that name @debug as the only agent writer: `.skilled/skills/system-spec-kit/SKILL.md:72`, `README.md:339`, `.skilled/agents/orchestrate.md:466` and `.skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:154`, `:183` and `:402` - the new rule keeps each of them true, and `orchestrate.md` is phase 8's file
- The stale `lines 60-89` pointer at `scaffold-debug-delegation.sh:352` - no finding owns it, and the script parses nothing from `debug.md`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/agents/debug.md` | Modify | The five fixes and the size cut |
| `.claude/agents/debug.md` | Modify | The same edits by hand, keeping the fork's frontmatter and its `.claude/agents/` paths |
| `.pi/agents/debug.md` | Regenerate | `sync-agents-pi.cjs` |
| `.codex/agents/debug.toml` | Regenerate | `sync-agents.cjs` |
| `.dsh/agents/debug.patch.yml` | Regenerate | `sync-agents-dsh.cjs` |
| `.opencode/agents/debug.md`, `.cursor/agents/debug.md`, `.devin/agents/debug/AGENT.md` | None | Symlinks to the canonical file or to the `.claude` fork |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

`D` is `.skilled/agents/debug.md`. A count of "none" means `rg -c` prints nothing and exits 1.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A rejected fix is reverted with `Edit` before the next attempt, and hypotheses rejected across Phase 1 restarts add up toward the one three-rejection trigger in section 8 (debug-1). | `rg -c -i 'revert' D` prints 2 or more (none today). `rg -c -i 'in total' D` prints 2 or more, one in Phase 5 and one in the section 8 trigger (none today). `rg -n 'Same error\? → Try next post-challenge hypothesis$' D` prints nothing (1 line today). |
| REQ-002 | The file is 600 lines or less and keeps every required section in order (across-6). | `wc -l < D` prints 600 or less (648 today) and `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK` |
| REQ-003 | Every runtime copy carries the change. | `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0 and prints `all comparable mirrors in sync`, and `rg -c -i 'revert'` prints the same count for `D`, `.claude/agents/debug.md`, `.pi/agents/debug.md`, `.codex/agents/debug.toml` and `.dsh/agents/debug.patch.yml` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Section 0B names the file path and its versioned form, says the workflow scaffold seeds it and says @debug updates only the file the dispatch names and writes none when none is named. The ALWAYS rule and the conditional lines agree (debug-2). | `rg -c 'ONLY @debug may create' D` and `rg -c 'Write all findings and evidence to' D` each print none (1 today). `rg -c 'scaffold-debug-delegation.sh' D` and `rg -c 'debug-delegation-NNN.md' D` each print 1 or more (none today). |
| REQ-005 | The four handoff fields leave the input template, section 7 holds the one output handoff, Phase 5 says when @debug fixes and when it hands off and a fix reports the quality runner's gate (debug-4). | `sed -n '/^## 2\./,/^## 3\./p' D \| rg -c 'root_cause'` prints none (1 today). `rg -c 'AGENT_IO_HANDOFF v1' D` prints 1. `rg -c 'quality-gate.cjs' D` prints 1 or more (none today). Under default A, `rg -c 'diagnose only' D` prints 1 or more (none today). Answer B swaps the pattern for `asks for a fix`. |
| REQ-006 | An incomplete handoff returns `Debug Blocked` with `missing_info`, and one escalation template remains (debug-5). | `rg -c 'Ask for missing information' D` prints none (1 today). `rg -c '^## (Debug Escalation\|ESCALATION: Debug Exhausted)' D` prints 1 (2 today). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each REQ acceptance command in section 4 prints its after value on the built tree, and each before value matches the Measured Behavior block.
- **SC-002**: `wc -l < .skilled/agents/debug.md` prints 600 or less, and the roster and mirror checks exit 0.
- **SC-003**: `validate.sh --strict` on this folder prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 6 edits the same file first and may add lines | The line numbers above move and the cut may fall short of 600 | Build only after phase 6 lands. Anchor every edit on quoted text, re-run `wc -l` in Phase 1 and size the cut from that number. The planned cut removes about 80 lines against a need of 48 plus phase 6's additions. |
| Dependency | Phase 7 may rename or reword the code agent's quality step | The debug fix rule would point at a step that moved | Cite `quality-gate.cjs` by path and never by a `code.md` line number |
| Risk | A revert instruction that says `git checkout` or `git restore` would discard the operator's uncommitted work | High | The revert rule says to undo the agent's own edit with `Edit` and names both git commands as forbidden for this |
| Risk | Dropping section 11 renumbers RELATED RESOURCES | Low | The roster check compares title prefix and order, not numbers. `rg` found no `debug.md` section number cited anywhere outside the file. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Question 1, for the operator: when the dispatch says nothing, does @debug fix or only diagnose? A) Fix by default, as Phase 5 does today, and only diagnose when the dispatch says `diagnose only`. B) Only diagnose by default and fix when the dispatch asks for a fix, as the review proposes. Planning default: A, because the agent is user-invoked and the cli-opencode example expects "applied fix (or refusal with rationale)" (`agent-delegation.md:402`). Either way a fix runs the quality runner and a diagnosis returns the `AGENT_IO_HANDOFF v1` group for @code. Task T006 applies the answer.
- The `lines 60-89` pointer at `scaffold-debug-delegation.sh:352` was already stale before this phase and moves further after it. No phase owns it. It is recorded here for the operator and left unchanged.
<!-- /ANCHOR:questions -->

---

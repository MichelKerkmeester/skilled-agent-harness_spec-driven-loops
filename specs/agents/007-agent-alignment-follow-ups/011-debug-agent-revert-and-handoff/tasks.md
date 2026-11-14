---
title: "Tasks: Phase 11: debug-agent-revert-and-handoff"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "debug agent revert and handoff tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 11: debug-agent-revert-and-handoff

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Variables**: `D` is `.skilled/agents/debug.md`. `F` is `.claude/agents/debug.md`. `scratch/` is this folder's `scratch/`. Every edit is found by its quoted text, because phase 6 moves the line numbers in `spec.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phase 6 landed its `D` edits before any edit here (`D`). Verify: `git log -1 --format=%s -- .skilled/agents/debug.md` names the phase 6 commit, and `rg -c 'Max 5 tool calls' D` prints what phase 6's `tasks.md` says it leaves.
- [ ] T002 Re-run every command in the `spec.md` Measured Behavior block and save each command with its output (`scratch/baseline.txt`). Verify: `rg -c '^\$ ' scratch/baseline.txt` prints 15, and each output matches the block except the line numbers and the `wc -l` count phase 6 moved.
- [ ] T003 Record the post-phase-6 line count and the cut it needs (`scratch/baseline.txt`). Verify: the file holds a line `need=<wc -l minus 600>`, and the planned cut of about 99 lines in `plan.md` section 3 exceeds it.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 debug-1: add Phase 5 rule 7 "Revert a rejected fix with `Edit` before the next attempt", with the sentence that forbids `git checkout` and `git restore` for it (`D`). Verify: `rg -n 'git checkout|git restore' D` prints one line and it is that sentence.
- [ ] T005 debug-1: rewrite the `Tests fail?` branch so both arms revert first and count the hypothesis as rejected, and set the section 8 trigger to three rejected in total across every Phase 1 restart (`D`). Verify: `rg -c -i 'revert' D` prints 2 or more, `rg -c -i 'in total' D` prints 2 or more and `rg -n 'Same error\? → Try next post-challenge hypothesis$' D` prints nothing.
- [ ] T006 debug-4: delete the `### Debug To Implementation Handoff` block and the paragraph after the fence in section 2, move the legacy-file sentence to section 7 and add the fix-or-hand-off rule in the operator's answer to question 1 (default A, `diagnose only`) with the quality-runner sentence (`D`). Verify: `sed -n '/^## 2\./,/^## 3\./p' D | rg -c 'root_cause'` prints nothing, `rg -c 'AGENT_IO_HANDOFF v1' D` prints 1 `rg -c 'quality-gate.cjs' D` prints 1 or more and, under default A, `rg -c 'diagnose only' D` prints 1 or more.
- [ ] T007 debug-2: rewrite section 0B with the path, the versioned name, the scaffold that seeds it and the named-file rule, then align Phase 5 rule 6, section 8 item 5, the "Create only if absent" row, the checklist line and the ALWAYS line (`D`). Verify: `rg -c 'ONLY @debug may create' D` and `rg -c 'Write all findings and evidence to' D` print nothing, and `rg -c 'scaffold-debug-delegation.sh' D` and `rg -c 'debug-delegation-NNN.md' D` each print 1 or more.
- [ ] T008 debug-5: replace "Ask for missing information" with the `missing_info` Blocked return, and replace section 8's Escalation Output block with a pointer to section 7's Escalation Response (`D`). Verify: `rg -c 'Ask for missing information' D` prints nothing and `rg -c '^## (Debug Escalation|ESCALATION: Debug Exhausted)' D` prints 1.
- [ ] T009 across-6: make the five remaining cuts in `plan.md` section 3: the section 1 block, the Tool Selection Flow, the Quality Criteria table and sections 10 and 11 merged into one ANTI-PATTERNS table, with RELATED RESOURCES renumbered to 11 (`D`). Verify: `wc -l < D` prints 600 or less and `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK`.
- [ ] T010 Hand-edit the fork with the same body changes, keeping its frontmatter and its `.claude/agents/` paths (`F`). Verify: `diff <(sed -n '/^# The Debugger/,$p' D) <(sed -n '/^# The Debugger/,$p' F)` prints only the three path lines, and `wc -l < F` prints 600 or less.
- [ ] T011 Regenerate the Pi, Codex and DSH copies (`.pi/agents/debug.md`, `.codex/agents/debug.toml`, `.dsh/agents/debug.patch.yml`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs`, `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs` and `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs` each exit 0, and `git status --short .pi .codex .dsh` lists the three debug files.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Run every command in `plan.md` section 5 and save the outputs (`scratch/after.txt`). Verify: each prints the after value its line names.
- [ ] T013 Run the roster and mirror checks (`scratch/after.txt`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK` and `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0 and prints `all comparable mirrors in sync`.
- [ ] T014 Compare the change across the copies (`scratch/after.txt`). Verify: `rg -c -i 'revert' D F .pi/agents/debug.md .codex/agents/debug.toml .dsh/agents/debug.patch.yml` prints the same count for all five.
- [ ] T015 Confirm no file outside the scope changed (`spec.md`). Verify: `git status --short` lists only `D`, `F`, the three generated copies and files inside this folder.
- [ ] T016 Validate this folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/007-agent-alignment-follow-ups/011-debug-agent-revert-and-handoff --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every owned finding (debug-1, debug-2, debug-4, debug-5 and the debug part of across-6) has a row in `implementation-summary.md` with the command that shows it fixed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
- **Review**: See `../scratch/agent-review/agents-review.out.md`, sections `## debug` and `## Across agents`
<!-- /ANCHOR:cross-refs -->

---

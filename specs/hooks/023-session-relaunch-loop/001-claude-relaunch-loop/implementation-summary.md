---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "claude relaunch loop implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/001-claude-relaunch-loop"
    last_updated_at: "2026-10-18T11:56:53Z"
    last_updated_by: "generate-context"
    recent_action: "Reconciled phase 001 at packet closure; strict validation PASSED"
    next_safe_action: "Verify nothing remains; phase 001 is complete and closed"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs"
    session_dedup:
      fingerprint: "sha256:ef8f4e30a51caf6a7dfe65529970325954ff0a3c275d17641a03e5b3e8771d04"
      session_id: "scaffold-001-claude-relaunch-loop"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-claude-relaunch-loop |
| **Completed** | 2026-10-16 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 001 adds a Claude relaunch path that saves a handoff note, arms a relaunch record, waits for the current process to become idle, then starts a fresh session in the same wrapper. The recorded live run completed one hop and claimed and completed its note. The killer suite now has a named test for refusing a non-descendant target, and all ten acceptance criteria are Met. Phase 001 is Complete: every P0 and P1 verification item in tasks.md is checked and strict validation passes. Evidence for the live run is in run-ledger.md, Live run 1 and Gate PG. The new test is in tests/killer.test.cjs:219.

### Phase 1: claude-relaunch-loop

The implementation combines a runtime-neutral core and CLI with Claude adapters and the skilled-loop wrapper. Claude's context nudge prepares a handoff before the configured context threshold. The Stop adapter arms a pending record when no background tasks remain, then starts the detached killer. The wrapper consumes an armed record and starts a new Claude session with the handoff seed. Auto-compaction remains unchanged as the fallback. Evidence: interface-contract.md, sections 1, 6 to 9 and run-ledger.md, Live run 1.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| .skilled/hooks/session-relaunch/lib/relaunch-core.cjs, context-usage.cjs, killer.cjs | Created | Handoff and relaunch state, Claude transcript usage reading and detached process termination. Evidence: interface-contract.md, sections 1, 4, 5 and 9. |
| .skilled/hooks/session-relaunch/bin/session-relaunch.cjs | Created | prepare, arm, claim, complete, consume and relaunch decision commands. Evidence: interface-contract.md, sections 1, 4 and 6. |
| .skilled/hooks/session-relaunch/claude/context-nudge.mjs, stop-arm.mjs | Created | Claude context and Stop adapters. Evidence: interface-contract.md, sections 1 and 8. |
| .skilled/bin/skilled-loop | Created | Runs Claude and handles bounded relaunch hops. Evidence: interface-contract.md, sections 1 and 7. |
| .skilled/hooks/session-relaunch/tests/*.test.cjs and test fixtures | Created | Six node:test suites cover the core, usage reader, CLI, wrapper, killer and Claude adapters. The killer suite includes `killer never signals a target that is not a descendant of SKILLED_LOOP_ID` at .skilled/hooks/session-relaunch/tests/killer.test.cjs:219. Evidence: run-ledger.md, Red run and Gate PG, PG1 and lane 1.10. |
| Claude hook registration and runtime mirrors | Added | Adds the three session-relaunch commands to Claude settings and the registry, with generated runtime mirrors. Evidence: run-ledger.md, D12 and Gate PG, PG2 to PG3. |
| /speckit:handoff command and mirrors | Added | Provides the manual handoff command and runtime mirrors. Evidence: run-ledger.md, D7. |
| Phase reference docs, feature catalog and playbook entries | Added or updated | Documents switches, hook behavior, feature entry and Claude scenarios. Evidence: run-ledger.md, D8, D21 and D24. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The team implemented against the interface contract, ran a red test-first pass and resolved review findings. It then recorded Gate PG, a live Claude hop, a forced killer-timeout run and the playbook scenarios. Evidence: run-ledger.md, Red run and D10 to D24, with Gate PG, Live runs 1 and 2 plus PG7 playbook results.

### S1 Answers

| Question | Recorded answer |
|----------|-----------------|
| (a) Hook payload shapes | PostToolUse carries session_id, transcript_path, cwd, prompt_id, permission_mode, effort, hook_event_name, tool_name, tool_input, tool_response, tool_use_id and duration_ms. Stop carries the shared session fields plus stop_hook_active, last_assistant_message, background_tasks (list) and session_crons (list). UserPromptSubmit carries the shared session fields plus prompt. None carries context size, tokens or a percentage. Evidence: run-ledger.md, D1 result and scratch/spike/SPIKE-REPORT.md. |
| (b) Usage field names | Assistant message.usage provides input_tokens, cache_creation_input_tokens, cache_read_input_tokens and output_tokens. Fill uses the first three. The probe measured 299,315 tokens. Evidence: run-ledger.md, Lane 1.0. |
| (c) Compaction verdict | PROVEN. There were 67 automatic compaction boundaries across three transcripts, at preTokens 463,636 to 474,210. The 80% trigger for a 500,000-token window is 400,000, at least 63,636 tokens below the lowest observed boundary. One recorded comparison was fill 466,534 versus preTokens 466,949. Evidence: run-ledger.md, Lane 1.0. |
| (d) Duplicate Stop registrations | FOUND. Both ~/.claude/settings.json and project .claude/settings.json register session-stop.js and completion-evidence-stop.cjs. The relaunch hooks are project-only. stop-arm is idempotent and the killer lock permits only one killer. Evidence: run-ledger.md, Lane 1.0 and D1 result. |

The D1 payload also records CLAUDE_PID, CLAUDE_CODE_SESSION_ID, CLAUDE_PROJECT_DIR and CLAUDECODE in the hook environment. Evidence: run-ledger.md, D1 result.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Target the Stop hook's CLAUDE_PID, falling back to its parent pid. | The killer is detached, so its own parent is not the Claude process. The loop-id ancestry check remains. Evidence: run-ledger.md, Design amendments from S1 and interface-contract.md, section 9. |
| Check active work through shell ancestry and Stop background_tasks. | Plain pgrep would treat MCP child processes as active shell work. The two checks preserve those processes while refusing an active shell child or pending background task. Evidence: run-ledger.md, Design amendments from S1. |
| Preserve the operator's session name and pass an explicit session id from the nudge. | Relaunches retain the chosen name. prepare uses --session when supplied and otherwise reads CLAUDE_CODE_SESSION_ID. Evidence: run-ledger.md, Design amendments from S1. |

### Recorded Deviations

| Deviation | Reason and handling |
|-----------|--------------------|
| D3 and D5 used SWE instead of Luna for the 003 and 004 spec-doc lanes. | The ledger records that parallel work on disjoint files was authorized. Evidence: run-ledger.md, D3 and D5. |
| Lane 1.7a used SWE instead of Luna for the documentation slice. | The role change is recorded, but its reason is not recorded. Evidence: run-ledger.md, D8. |
| The lane 1.4 build brief skipped the required deep prompt-improver path. | The cause is not recorded. The review brief used the deep path and the orchestrator reran the killer suite outside the sandbox, with 4/4 passing at that point. Evidence: run-ledger.md, Deviation: lane 1.4 brief skipped the deep path. |
| The orchestrator updated the pinned hook binding count from 92 to 95. | Adding three Claude bindings caused the pinned test to fail 6/7. The repository convention is to update the pin with the hook change. Rerun passed 7/7. Evidence: run-ledger.md, Deviation: pinned binding count bumped by the orchestrator. |
| The first killer suite run had a realpath assertion failure. | D11 records the mismatch between /var and /private/var. The test fix was folded into F9 and the later full suite passed. Evidence: run-ledger.md, D11 and D15. |
| The orchestrator's K2 contract amendment broke a stop-arm adapter test. | The amendment required the loop id to be an ancestor of the killer, which is impossible after stop-arm exits and the killer is reparented. The contract was corrected and the follow-up suite passed. Evidence: run-ledger.md, D16 and D18. |
| Luna's lane 1.2 intent-to-add failed with index-lock EPERM. | The sandbox could not update the index. The orchestrator used intent-to-add for the drift-guard run and removed the cached entries afterward. Evidence: run-ledger.md, D6 and Gate PG, PG4. |
| The runtime mirror generator ran in write mode after the check failed. | PG3 identified two missing Claude hook mirrors. The generator linked two and removed none, then the mirror check passed at 189 against baseline 185. Evidence: run-ledger.md, Gate PG, PG3. |
| Playbook scenario 03 received a one-token assertion correction. | The test used record.reason, while the contract names the field disarmReason. The rerun passed. Evidence: run-ledger.md, PG7 playbook results, scenario 03 and interface-contract.md, section 4. |
| The review sandbox could not run its mkdtemp-based test. | The review result was marked void for that test. The orchestrator ran the adapter suite, which passed 7/7. Evidence: run-ledger.md, D20. |
| Luna-owned work paused after the quota limit. | The operator requested a pause until the quota reset. Work resumed after the recorded reset time. Evidence: run-ledger.md, H6. |
| The Codex and Pi prompt stubs for /speckit:handoff were generated after the doctor found them missing. | AC-1.6 requires mirrors at baseline or better in 001. The Codex and Pi prompt mirrors were generated, and both rechecks passed at 38. The Hermes prompt stub remains for a later runtime phase. Evidence: run-ledger.md, Doctor runtime-mirrors and D7. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| node --test .skilled/hooks/session-relaunch/tests/*.test.cjs | 102 tests, 102 pass, 0 fail, exit 0. The new non-descendant test is at killer.test.cjs:219. Evidence: lane 1.10 test run. |
| sync-hook-registrations.cjs --check | PASS, 32 registry hooks against baseline 31, only the session-relaunch object changed and settings diff contains three commands. Exit 0. Evidence: run-ledger.md, Gate PG, PG2. |
| sync-runtime-mirrors.cjs --check | Initial check exit 1 for two missing Claude hook mirrors. Generator linked two and removed none. Recheck passed at 189 mirrors against baseline 185. Recheck exit code was not recorded. Evidence: run-ledger.md, Gate PG, PG3. |
| run-all-drift-guards.sh and verify_alignment_drift.py | Drift wrapper exit 0 with 4/4 guards and 278 warnings, equal to baseline. Alignment scan found 0 findings across 15 hook files and 123 bin files. Individual alignment scan exit codes were not recorded. Evidence: run-ledger.md, Gate PG, PG4. |
| shellcheck .skilled/bin/skilled-loop | PASS, exit 0. Evidence: run-ledger.md, Gate PG, PG5. |
| Shared hook node:test and hook-registration-sync.vitest.ts | Shared suite 22/22, at baseline. Registry suite 7/7 after the binding count update. Their exit codes were not recorded. Evidence: run-ledger.md, Gate PG, PG5 and D12. |
| Documentation and authored-name validators | check_authored_name_kebab.py and validate_document.py --type command passed with exit 0. Final hvr_scan on the four edited documents passed with exit 0 and 0 em dashes. Evidence: run-ledger.md, D7 and D24. |
| Runtime-mirror checker set | sync-runtime-mirrors --check passed at 189, codex sync-agents --check passed at 11, agent-roster-mirror-check returned STATUS=OK, install-codex-hooks --check --allow-worktree returned OK and pi sync-agents-pi --check passed at 11. The orchestrator generated .codex/prompts/speckit-handoff.md and .pi/prompts/speckit-handoff.md. Both prompt mirror rechecks passed at 38. Evidence: run-ledger.md, Doctor runtime-mirrors. |
| Command catalog | command-catalog-mirror-check.cjs returned STATUS=OK. The command catalog lists 40/40 commands and the speckit catalog lists 7/7. Evidence: lane 1.10 command output. |
| Live Claude relaunch | One hop in the same tmux pane, with the name preserved. The handoff moved open to claimed to done. The wrapper exited 0 after declining a second hop because no file remained. Evidence: run-ledger.md, Live run 1 and scratch/live-run-1-note.md and scratch/live-run-1-relaunch.log. |
| Forced killer timeout | Target ignored SIGTERM. The killer recorded killer-timeout, disarmed with that reason and returned after about 8 seconds. No Claude session was used because of quota. Evidence: run-ledger.md, Live run 2 and scratch/forced-failure.sh. |
| Playbook scenarios | P, L1 and scenarios 01 to 10 passed after the recorded scenario 03 assertion correction. See the result table below. Evidence: run-ledger.md, PG7 playbook results and scratch/playbook-run/. |
<!-- /ANCHOR:verification -->

---

### Review Rounds

| Round | Recorded findings or result |
|-------|-----------------------------|
| D10 | 1 P1 and 10 P2. The P1 and selected P2 findings were reproduced. Evidence: run-ledger.md, D10. |
| D14 | 7 P1, 6 P2 and 8 safe rows. Four P1 findings were reproduced and the contract was amended. Evidence: run-ledger.md, D14. |
| D17 | 7 of 8 prior findings fixed, 1 partial, with 3 new P2 findings. Evidence: run-ledger.md, D17. |
| D19 | 12 of 12 earlier findings fixed, with 1 new P1 and 6 P2 findings. Evidence: run-ledger.md, D19. |
| D20 | No P0 or P1 findings and 5 P2 findings. Its sandbox test was void because mkdtemp was blocked. Evidence: run-ledger.md, D20. |
| D22 and D23 | Follow-up acceptance: all suites at 101/101 and adapter suite at 9/9. Evidence: run-ledger.md, D22 and D23. |

### Playbook Results

| Scenario | Mode | Result |
|----------|------|--------|
| P, Claude session relaunch | Live | PASS, one hop and note open to claimed to done. |
| L1, nudge at threshold | Live | PASS, nudge followed the first tool call and prepared the handoff. |
| 01, no nudge below threshold | Auto | PASS, 9/0. |
| 02, prepare order and shell-child refusal | Auto | PASS, 17/0. |
| 03, killer timeout disarms and notifies | Auto | PASS on rerun after changing the assertion field to disarmReason. |
| 04, kill switch disables both hooks | Auto | PASS. |
| 05, hop cap | Auto | PASS, 16/0. |
| 06, zero limits and corrupt relaunch file | Auto | PASS, 17/0. |
| 07, read failures | Auto | PASS, 47/0. |
| 08, adapter session and transcript gates | Auto | PASS, 9/0. |
| 09, killer lock and signal checks | Auto | PASS, 12/0. |
| 10, wrapper edge cases | Auto | PASS, 16/0. |

Evidence for every row: run-ledger.md, PG7 playbook results and individual outputs are in scratch/playbook-run/. The scenario 03 first attempt failed because the assertion used record.reason. The final rerun passed with the contract field disarmReason.

### Carried Items

The Codex and Pi prompt stubs for /speckit:handoff were generated at .codex/prompts/speckit-handoff.md and .pi/prompts/speckit-handoff.md. Both prompt mirror rechecks passed at 38. The Hermes prompt stub remains for a later runtime phase. Evidence: run-ledger.md, Doctor runtime-mirrors and D7.

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Only direct shell children are checked.** A process reparented to pid 1 by nohup is not seen. A long-running direct background shell keeps prepare refusing until it exits. Evidence: interface-contract.md, section 6.
2. **There is no relaunch-file lock.** The protocol sequences prepare, Stop arm and wrapper consume. The killer has a separate lock. Evidence: interface-contract.md, sections 2, 6 and 9.
3. **PID reuse is not checked between ancestry validation and signal.** The contract bounds the unchecked interval to milliseconds but does not remove the risk. Evidence: interface-contract.md, section 9.
4. **A 0.05 test threshold can chain hops.** A fresh session begins above 25,000 tokens and can be nudged immediately until the hop cap. Evidence: run-ledger.md, Live run 1.
5. **On-screen notification display was not observed.** The timeout path calls osascript, but successful display is not logged. Evidence: run-ledger.md, Live run 2 and scratch/forced-failure.sh.
<!-- /ANCHOR:limitations -->

---



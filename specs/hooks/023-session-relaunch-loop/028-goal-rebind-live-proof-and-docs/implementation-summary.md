---
title: "Implementation Summary"
description: "Live hops show the goal surviving a hand-over on Claude and Pi, the controls show none, and the runs found that no hop reaches Devin or Cursor; the OpenCode 2 hop passed after the phase 030 fixes."
trigger_phrases:
  - "goal rebind live proof implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/028-goal-rebind-live-proof-and-docs"
    last_updated_at: "2026-10-24T19:40:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Ran live hops and controls, wrote playbooks and docs"
    next_safe_action: "None; closed after the phase 030 OpenCode 2 hop rerun"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-28-goal-rebind-live-proof-and-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-goal-rebind-live-proof-and-docs |
| **Completed** | 2026-10-25, after the phase 030 OpenCode 2 hop rerun |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No product code changed. The phase ran live hops with a goal on each runtime that could run, ran the switch-off and no-goal controls beside them, added the goal carry-over scenarios to the three relaunch playbooks and brought the READMEs and catalog entry in line with what the runs showed.

### Phase 28: goal-rebind-live-proof-and-docs

**Claude and Pi: the goal carries.** A sender with a goal wrote a `goal_packet` line at `prepare`, which means the sender-side resolver worked live too (Claude from its session log, Pi from its goal record). The wrapper relaunched and the receiver held the goal. On Claude the receiver's log has a `goal_status` entry with a 3,990-character condition and `relaunch.log` has `goal-start-claim`. On Pi the receiver's log has `goal-context-restore` naming goal id `goal-31277a81...`, against the sender's `goal-90d89492...`, and the store holds two records. `printenv SESSION_RELAUNCH_GOAL_PACKET` run by each receiver printed the packet. Evidence: `scratch/claude-a-goal/`, `scratch/pi-a-goal/`.

**Controls.** With `SESSION_RELAUNCH_GOAL=0` on the launch only, the note still carried the packet, and neither receiver had a goal (`scratch/claude-b-switch-off/`, `scratch/pi-b-switch-off/`). With the switch off at `prepare` as well, the note carried no packet (`scratch/pi-b2-switch-off-at-prepare/`). A sender with no goal wrote no `goal_packet` and the receiver had none (`scratch/claude-c-no-goal/`, `scratch/pi-c-no-goal/`). The receivers still claimed and completed every note.

**Codex.** A hop carries no packet by design. The one run is the no-goal control: the note has no `goal_packet` line and the receiver's `printenv` printed nothing (`scratch/codex-c-no-goal/`). A first run was discarded because the sender judged the task short and finished it without a hand-over, so the prompt now says the operator requires the hand-over (`scratch/codex-c-discarded-run1/`).

**OpenCode 2.1.4: no hop.** The sender's `prepare` wrote the packet from its goal record, so the sender half works. The killer then logged `killer-signal` and no `relaunch` followed: the TUI stayed up showing `Connection lost... Reconnecting to the server automatically`, and the note stayed open (`scratch/opencode-a-hop-attempt/`). The plugin passes its own `process.pid` to the killer, and the process tree shows the TUI with a `serve --stdio` child that probably hosts the plugin (`scratch/opencode-process-tree.txt`). That cause is inferred and needs the tree captured before the kill to confirm. Separately, the wrapper relaunches with `-m <model>`, which the OpenCode 2 root command rejects. The receiver half does work: a session started with the packet variable bound it, and the switch-off and no-packet controls bound nothing (`scratch/opencode-receiver-a-goal/`, `-b-switch-off/`, `-c-no-goal/`). Phase 030 later confirmed that cause with a probe, fixed it and two defects behind it, and the rerun reached the receiver (`../030-opencode2-killer-target/`).

**Devin and Cursor: no hop can reach them.** Both ship on the command trigger, so a prepared record stays pending and the wrapper never relaunches, and the manual command that `prepare` prints is a first launch that drops the packet. A headless Devin session started with the variable set by hand bound the packet, and the two controls bound nothing (`scratch/devin-receiver-*`). Cursor was not logged in.

**Hermes.** Skipped: `hermes chat ... --provider llmgateway --model gpt-6-luna` exited 1 with `Billing or credits exhausted: HTTP 402` (`scratch/availability/hermes-probe.txt`).

**Docs.** Each playbook has Goal Carry-Over scenarios with a runnable form, the controls and a recorded-results table. The session-relaunch README has a section on what was shown live and the limits, the goal plugin doc and the handoff command state the OpenCode 2 and Cursor or Devin limits, and the feature catalog entry has a Goal Carry-Over section.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` | Modified | GR-1 to GR-3, recorded results, version 1.0.12.0 |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md` | Modified | GR-P1 to GR-P3, GR-O1, GR-O2, recorded results, version 1.0.12.0 |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md` | Modified | GR-C1 to GR-C4, a reach table, recorded results, version 1.0.11.0 |
| `.skilled/hooks/session-relaunch/README.md` | Modified | A section on what was shown live and the limits |
| `.skilled/hooks/goal/goal-plugin.md` | Modified | The OpenCode 2 hop is unproven, version 3.8.2.0 |
| `.skilled/commands/speckit/handoff.md` | Modified | A Cursor or Devin receiver does not get the goal |
| `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` | Modified | Goal Carry-Over section, version 1.0.11.0 |
| `specs/hooks/023-session-relaunch-loop/spec.md` | Modified | Map row 28 |
| `scratch/` | Created | The harness, run extracts, receiver status, availability checks and gate counts |
| `decision-record.md` | Created | ADR-001 splits two criteria, ADR-002 waives the Devin hop |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The gates were baselined first. Each run used its own tmux socket and `XDG_RUNTIME_DIR`, a throwaway checkout holding copies of the real hooks, wrapper and goal hooks, and an environment with the host's `SKILLED_LOOP_*`, `CLAUDE*`, `ORCA_*`, `SESSION_RELAUNCH_GOAL*` and `AI_SESSION_CHILD` variables dropped. The harness reuses the phase 27 approach and extends it to Pi and OpenCode. The operator-approved bypass flags were not needed: Claude's user setting already skips prompts, and Codex uses `--sandbox danger-full-access` from its own config and the launch line.

Deviations. Two runs broke because the harness script was edited while it ran, and were rerun from a copy. The first Pi switch-off run also passed the switch to `prepare`, so it tests the sender side; it is kept as a second control and the main switch-off run keeps `prepare` default so the note carries the packet. Two OpenCode receiver runs answered through a different model after the operator's own OpenCode changed the shared default, failed on billing and were rerun one at a time. OpenCode 2 needed `--standalone` through a PATH shim, because its default is a background service the operator's sessions share.

Cleanup: every tmux server and runtime process this phase started was killed, the ev028 tmux sockets were removed, raw transcripts were deleted after their extracts were taken (the Claude project folders, the Pi session folders and the OpenCode sessions of the throwaway directories), and the throwaway checkouts and private runtime directories were removed. The Codex run wrote its note into this checkout's gitignored handoffs folder, and that note was deleted. The hop-history lines the Codex run wrote stay in the gitignored `hop-history.log`. No token or key appears in the saved evidence (searched for key patterns before copying). `.opencode/cli.json` and `AGENTS.md` were not touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read the goal from the receiver | A sender-side log says nothing about what the receiver holds |
| Record SKIP rather than a pass | A runtime that did not run proved nothing |
| Replace AC-001 and AC-002 with per-outcome rows (ADR-001) | One row could not state a hop that worked, one that failed and one that cannot exist |
| Waive the Devin hop (ADR-002) | No arm event exists, so a hop is not reachable without building one |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Relaunch gate, `node --test --test-reporter=tap .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` | Baseline 833 of 833, exit 0. Final 833 of 833, exit 0. Delta 0 |
| `.opencode/plugins/tests/*.test.cjs` | Baseline 551 of 551, exit 0. Final 551 of 551, exit 0. Delta 0 |
| Six goal hook suites and `hook-flags.test.cjs` | Baseline 208 of 208, exit 0. Final 208 of 208, exit 0. Delta 0 |
| `check-rule-copies.test.sh` | Baseline exit 0, `All rule-canary test cases passed`. Final the same |
| `validate-playbook-package.cjs --package system-spec-kit` | `PASS ... violations=0 warnings=1`, exit 0. The one warning is in another playbook file |
| `validate_catalog_package.py --package system-spec-kit --strict` | `PASS ... violations=0`, exit 0 |
| `validate.sh specs/hooks/023-session-relaunch-loop --strict --recursive` | `RESULT: PASSED` for all 30 folders (parent and 29 children), exit 0, after `repair-derived.cjs --apply` on this folder and the parent |
| `validate.sh specs/sk-doc/060-create-goal-mode --strict --recursive` | `RESULT: PASSED` for all 16 folders, exit 0, run read-only |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. A live hop shows the behavior on these runtime versions and this machine only.
2. The OpenCode 2 hop failed here and passed in phase 030 after three fixes (AC-009). It runs only with `--standalone`: on OpenCode 2's default background service nothing arms.
3. Devin and Cursor receivers are never handed a packet by a hop. The Devin receiver half was shown by hand, not by a hop.
4. The model-quoted goal line on Pi, `GOALSEEN.marker`, is the model's own report, and on Pi it sometimes quoted the note's Goal heading. The session log extract is the evidence.
5. Follow-ups outside this phase's file list: `SESSION_RELAUNCH_GOAL` is still not named in `.skilled/hooks/hook-flags.env.example`, `.skilled/hooks/README.md`, `.skilled/commands/doctor/assets/doctor-env.yaml` and `.skilled/hooks/session-relaunch/tests/README.md`. The goal playbooks (the goal-opencode plugin playbook and the cli-opencode goal-hook playbook) were not given hop scenarios. The 060 parent has no row for this work.
6. The `-m` relaunch argument noted above is not a hop defect: the wrapper adds `-m` on a relaunch only when the first launch passed it, and OpenCode 2 rejects that first launch the same way (phase 030).
<!-- /ANCHOR:limitations -->

---

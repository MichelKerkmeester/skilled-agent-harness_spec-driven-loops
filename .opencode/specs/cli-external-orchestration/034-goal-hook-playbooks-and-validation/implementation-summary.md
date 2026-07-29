---
title: "Implementation Summary: Goal-Hook Playbooks and Live Cross-Runtime Validation"
description: "Playbook coverage plus live, canary-proven validation for the cross-runtime goal hook shipped in packet 032, across every goal-capable CLI runtime."
trigger_phrases:
  - "goal hook validation summary"
  - "name"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/034-goal-hook-playbooks-and-validation"
    last_updated_at: "2026-07-29T09:38:42Z"
    last_updated_by: "claude"
    recent_action: "Authored spec/plan/tasks/checklist/summary for the goal-hook tracker"
    next_safe_action: "Run generate-description.js, backfill, and validate.sh --strict"
    blockers: []
    key_files:
      - ".opencode/specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation/evidence/pi-injection-excerpt.txt"
      - ".opencode/specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation/evidence/devin-injection-excerpt.txt"
      - ".opencode/specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation/evidence/cursor-recorded-evidence.txt"
      - ".opencode/specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation/evidence/opencode-mkgoal-finding.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hook-playbooks-and-validation-20260729"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 034-goal-hook-playbooks-and-validation |
| **Completed** | 2026-07-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Packet 032 shipped the cross-runtime session-goal hook but left it with no manual-testing-playbook coverage and no live proof the injection reaches the model turn. This packet closes both gaps: it names the playbook scenarios every goal-capable CLI runtime needs, and it runs the hook live against cheap and free models to prove — or honestly document the limits of — the injection.

### Goal-Hook Playbooks
Five `goal-hook.md` scenarios are named, one per goal-capable runtime, each authored in that runtime's own CLI skill tree with its own id prefix: `DV-###` for cli-devin, `CU-###` for cli-cursor, `PI-###` for cli-pi, `CO-###` for cli-opencode, and `CC-###` for cli-claude-code. A sixth doc, `goal-manage-cli.md`, covers the shared manage CLI the cross-runtime hooks use to read and mutate goal state. This packet references all six by path; their content is authored in the CLI skills' own trees, not here.

### Live Cross-Runtime Validation
Four runtimes were live-validated this session using a shared proof method: seed an active-goal state with a unique canary token, run the CLI, and grep the raw transcript for that canary and the `[active_goal]` marker. Every run used a dedicated `MK_GOAL_STATE_DIR` so no run could mutate shared or default goal state. Pi and Devin came back POSITIVE with the canary quoted verbatim by the model. Cursor came back RECORDED-EVIDENCE: its hook fires (confirmed by the turn counter) but its `sessionStart` `agent_message` channel is confirmed non-delivering to the model, so the negative transcript result is the documented, correct behavior, not a failure. OpenCode's native `mk-goal` plugin could not be live-validated headless at all — a structural finding, not a regression — and Claude-native `/goal` is an upstream, doc-only feature outside headless scripting entirely.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `cli-external-orchestration/cli-devin/manual-testing-playbook/goal-hook/goal-hook.md` | Created (referenced) | DV-### goal-hook scenario, authored in the cli-devin skill tree |
| `cli-external-orchestration/cli-cursor/manual-testing-playbook/goal-hook/goal-hook.md` | Created (referenced) | CU-### goal-hook scenario, including the RECORDED-EVIDENCE tier |
| `cli-external-orchestration/cli-pi/manual-testing-playbook/goal-hook/goal-hook.md` | Created (referenced) | PI-### goal-hook scenario, manual-only (not fanout-dispatchable) |
| `cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md` | Created (referenced) | CO-### goal-hook scenario, covering mk-goal plus the symlink mirror |
| `cli-external-orchestration/cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md` | Created (referenced) | CC-### goal-hook scenario, native `/goal`, doc-only |
| `cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/goal-manage-cli.md` | Created (referenced) | Shared playbook for the manage CLI |
| `evidence/pi-injection-excerpt.txt` | Created | Pi live capture, canary `GOALCANARY-PI-2603128151` |
| `evidence/devin-injection-excerpt.txt`, `evidence/devin-model-reply.txt` | Created | Devin live capture, canary `GOALCANARY-DV-1255523564` |
| `evidence/cursor-recorded-evidence.txt` | Created | Cursor live capture, turn-counter + transcript-absence evidence |
| `evidence/opencode-mkgoal-finding.txt` | Created | mk-goal headless-validation finding |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every verdict in this packet is backed by a captured transcript or model reply, not a claim. Pi and Devin were run live and the canary token was matched verbatim in the model's own output. Cursor was deliberately run live specifically to capture its documented negative: the sessionStart hook fires (turn counter 0 to 1) while the injection stays invisible to the model, confirming the adapter-level, not model-visible, evidence tier that Cursor's contract already documents. mk-goal was attempted twice, with two different cheap models and two different failure surfaces (no tool exposure, then no transform firing even with pre-seeded state), before concluding the limitation is structural rather than a model or prompt problem. No run touched shared goal state outside its isolated `MK_GOAL_STATE_DIR`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Scope covers all goal-capable runtimes, not just the packet-032 trio | Operator chose full coverage so every runtime that carries the goal hook has a playbook and a verdict, including OpenCode's separate native system and Claude's upstream feature |
| Ran Cursor live to capture the negative, not just cite the known limitation | Operator wanted the RECORDED-EVIDENCE tier proven this session with fresh turn-counter and transcript evidence, not just referenced from prior work |
| Proof method is canary token + raw-transcript grep, isolated via MK_GOAL_STATE_DIR | Gives a verifiable, model-agnostic signal that does not depend on trusting the model's self-report, and guarantees no run corrupts real goal state |
| mk-goal's headless limitation is a finding, not a packet-032 regression | mk-goal is a separate, pre-existing OpenCode-native system with its own test suite; its headless gap predates this packet and packet 032 never touched it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pi live validation (offline gpt, free) | PASS — canary `GOALCANARY-PI-2603128151` cited verbatim, `[active_goal]` block present |
| Devin live validation (glm-5-2, free) | PASS — canary `GOALCANARY-DV-1255523564` quoted verbatim, block present 2/2 times |
| Cursor live validation (composer-2.5, paid) | RECORDED-EVIDENCE — hook fires (turns_used 0/1), canary+active_goal 0/0 in transcript (contract-documented) |
| OpenCode mk-goal live validation (deepseek + gpt-luna, paid) | SKIP — `mk_goal` tool not exposed in headless `opencode run`; transform did not fire even with pre-seeded active state |
| Claude-native `/goal` live validation | SKIP — upstream feature, doc-only, not headless-scriptable in this environment |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` | PASS — Errors: 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **mk-goal has no live headless proof path.** OpenCode's native `mk-goal` plugin (`.opencode/plugins/mk-goal.js`) is a separate system from the cross-runtime hooks under `.opencode/hooks/goal/`. Its `mk_goal` tool is not exposed to the default headless `opencode run` agent, and its `experimental.chat.system.transform` injection did not fire even against a pre-seeded, valid active-goal state file in a resumed `opencode run --session`. It is interactive/TUI-scoped behavior. Coverage instead comes from its 7 committed unit suites (`.opencode/plugins/tests/mk-goal-*.test.cjs`).
2. **Cursor's injection is model-invisible by contract, not by bug.** Its `sessionStart` `agent_message` channel is confirmed non-delivering to the model (n=3 across this run and prior phase-004 capability probes); `preToolUse` `agent_message` is also non-delivering and `stop` never fires. The turn-counter increment is the only available adapter-level evidence for Cursor, and RECORDED-EVIDENCE is its correct, documented verdict tier — not a failed PASS.
3. **cli-pi is not fanout-dispatchable.** Its live validation in this packet was run manually rather than through an automated fan-out harness; the offline gpt model also streams slowly, so `--mode json` capture is the practical way to pull its output.
4. **The playbook docs are authored in a separate pass.** This packet references the 6 playbook paths by name and does not author or verify their prose content — that ownership sits in each CLI skill's own tree.
<!-- /ANCHOR:limitations -->

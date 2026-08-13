---
title: "Feature Specification: Goal-Hook Playbooks and Live Cross-Runtime Validation"
description: "Packet 003 shipped the cross-runtime goal hook but left no manual-testing-playbook coverage and no live proof the injection reaches the model turn in each runtime. This packet authors the playbook scenarios (by reference) and captures live validation evidence per runtime."
trigger_phrases:
  - "goal hook playbook"
  - "goal hook validation"
  - "cross runtime goal hook testing"
  - "goal manage cli playbook"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/004-goal-hook-playbooks-and-validation"
    last_updated_at: "2026-07-29T09:38:42Z"
    last_updated_by: "claude"
    recent_action: "Authored spec/plan/tasks/checklist/summary for the goal-hook tracker"
    next_safe_action: "Run generate-description.js, backfill, and validate.sh --strict"
    blockers: []
    key_files:
      - ".opencode/specs/hooks/004-goal-hook-playbooks-and-validation/evidence/pi-injection-excerpt.txt"
      - ".opencode/specs/hooks/004-goal-hook-playbooks-and-validation/evidence/devin-injection-excerpt.txt"
      - ".opencode/specs/hooks/004-goal-hook-playbooks-and-validation/evidence/cursor-recorded-evidence.txt"
      - ".opencode/specs/hooks/004-goal-hook-playbooks-and-validation/evidence/opencode-mkgoal-finding.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hook-playbooks-and-validation-20260729"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Scope covers every goal-capable CLI runtime (Devin, Cursor, Pi, OpenCode, Claude-native), operator choice."
      - "Cursor was run live to capture its documented negative (model-invisible injection), operator choice."
      - "The repo-blessed proof method is canary token + raw-transcript grep + mandatory MK_GOAL_STATE_DIR isolation."
      - "mk-goal is a separate pre-existing system; its headless-injection limitation is a finding, not a packet-032 regression."
---
# Feature Specification: Goal-Hook Playbooks and Live Cross-Runtime Validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-29 |
| **Branch** | `004-goal-hook-playbooks-and-validation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet `003-goal-hooks-cross-runtime` shipped the runtime-neutral session-goal hook for Devin, Cursor, and Pi (plus the OpenCode plugin symlink mirror), but it closed without any manual-testing-playbook coverage for the hook and without live evidence that the hook's injected `[active_goal]` block actually reaches the model turn in each runtime. Only unit-level and structural evidence existed; nobody had proven the injection live, end to end, with a real model.

### Purpose
Every goal-capable CLI runtime has an authored goal-hook manual-testing-playbook scenario, and each runtime's live injection behavior is proven — or its limitation honestly documented — with captured evidence tracked under this packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author `goal-hook.md` manual-testing-playbook scenarios (ids `DV/CU/PI/CO/CC-###`) for cli-devin, cli-cursor, cli-pi, cli-opencode, and cli-claude-code, each in its own skill tree
- Author the shared `goal-manage-cli.md` playbook covering the manage CLI the cross-runtime hooks share, under `cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/`
- Run live validation of the goal-hook injection for Pi (offline gpt, free), Devin (glm-5-2, free), and Cursor (composer-2.5, paid) and capture transcript-level evidence per runtime
- Attempt live validation of OpenCode's native `mk-goal` plugin under headless `opencode run` and document the structural limitation as a finding
- Record Claude-native `/goal` as an upstream, doc-only feature that is not headless-scriptable in this environment

### Out of Scope
- Modifying goal-hook implementation code — packet 003 already shipped and closed it; this packet is documentation plus validation only
- Building headless `mk_goal` tool exposure for `opencode run` — captured as a finding for a future packet, not built here

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `cli-external-orchestration/cli-devin/manual-testing-playbook/goal-hook/goal-hook.md` | Create | DV-### goal-hook playbook scenario (authored in the CLI skill tree, referenced by path here) |
| `cli-external-orchestration/cli-cursor/manual-testing-playbook/goal-hook/goal-hook.md` | Create | CU-### goal-hook playbook scenario, including the RECORDED-EVIDENCE tier |
| `cli-external-orchestration/cli-pi/manual-testing-playbook/goal-hook/goal-hook.md` | Create | PI-### goal-hook playbook scenario, manual-only (not fanout-dispatchable) |
| `cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md` | Create | CO-### goal-hook playbook scenario, covering mk-goal plus the symlink mirror |
| `cli-external-orchestration/cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md` | Create | CC-### goal-hook playbook scenario, native `/goal`, doc-only |
| `cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/goal-manage-cli.md` | Create | Shared playbook for the manage CLI used by the cross-runtime hooks |
| `.opencode/specs/hooks/004-goal-hook-playbooks-and-validation/evidence/*.txt` | Create | Live validation capture files (already staged, this packet) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every goal-capable CLI runtime has an authored goal-hook manual-testing-playbook scenario | 5 `goal-hook.md` files exist at their runtime-owned paths, each using the runtime's `DV/CU/PI/CO/CC-###` id prefix |
| REQ-002 | The shared manage-CLI playbook documents the CLI the cross-runtime hooks share | `goal-manage-cli.md` exists at `cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/` |
| REQ-003 | Live validation is captured for every runtime whose hook is headless-scriptable, with honest verdict tiers | `evidence/` contains pi, devin, and cursor capture files, each cited with a verdict in `checklist.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | mk-goal's headless-validation limitation is documented as a finding, not silently dropped | `implementation-summary.md` Known Limitations states the finding and its structural cause |
| REQ-005 | The proof method (canary token + raw-transcript grep + `MK_GOAL_STATE_DIR` isolation) is recorded as repo-blessed | `plan.md` architecture section and `implementation-summary.md` both name the method |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 playbook docs (5 `goal-hook.md` + 1 `goal-manage-cli.md`) are named as deliverables and referenced by exact path from this packet
- **SC-002**: Live validation evidence exists for Pi, Devin, and Cursor, plus the mk-goal finding, each carrying an honest PASS/RECORDED-EVIDENCE/SKIP verdict
- **SC-003**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` reports `Errors: 0`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet `003-goal-hooks-cross-runtime` (goal-hook implementation) | Validation is meaningless if the hook code is not shipped | Confirmed shipped at `completion_pct: 100` before this packet started |
| Risk | cli-pi is not fanout-dispatchable | Low — blocks automated re-runs, not the one-time proof | Ran the Pi validation manually and captured the transcript directly |
| Risk | mk-goal headless proof is structurally infeasible via `opencode run` | Medium — no live model-turn proof for OpenCode's native goal system | Documented as a finding instead of claimed complete; covered by its 7 unit suites |
| Risk | Playbook docs are authored in a separate CLI-skill-tree pass, not by this packet | Low — this tracker could go stale if the paths never land | This spec references paths only and does not claim their content; verify on next touch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable — documentation and validation packet, no runtime performance target

### Security
- **NFR-S01**: All live-model validation runs used a mandatory `MK_GOAL_STATE_DIR` isolation directory so no run could mutate the shared/default goal state

### Reliability
- **NFR-R01**: Not applicable — no service uptime target; the deliverable is captured evidence and playbook docs
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: not applicable, no runtime input surface owned by this packet
- Maximum length: not applicable
- Invalid format: not applicable

### Error Scenarios
- Injection does not reach the model turn: recorded honestly as RECORDED-EVIDENCE (Cursor, adapter fires but the agent_message channel is model-invisible by contract) rather than claimed PASS
- Headless tool surface does not expose the plugin's tool: recorded as SKIP with the structural cause (OpenCode mk-goal) rather than silently dropped

### State Transitions
- Not applicable — this packet does not introduce or change goal-hook state machines
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 6 playbook doc paths across 5 skill trees, 5 tracker docs, 5 evidence files |
| Risk | 5/25 | Doc-only tracker; no code paths touched |
| Research | 12/20 | 4 live multi-runtime validation runs with distinct capabilities per CLI |
| **Total** | **27/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None — scope and verdict tiers were settled by operator choice before this packet closed.
<!-- /ANCHOR:questions -->

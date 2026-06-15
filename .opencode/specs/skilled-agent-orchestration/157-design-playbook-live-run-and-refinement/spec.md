---
title: "Feature Specification: Live-run and refine the design playbooks"
description: "Both design skills' manual testing playbooks had never been executed end to end, so unknown gaps lurked in their scenarios. This packet runs every scenario live (two models for the judgment ones, Code Mode for the reads, real od generation for the gated one) and refines each scenario where the live run exposes a gap."
trigger_phrases:
  - "design playbook live run"
  - "mcp-open-design playbook scenarios"
  - "sk-interface-design playbook scenarios"
  - "kimi deepseek design judgment"
  - "playbook scenario refinement"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/157-design-playbook-live-run-and-refinement"
    last_updated_at: "2026-06-15T10:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran all 13 scenarios live and refined the playbooks; finalizing the packet"
    next_safe_action: "Validate, commit, then restructure 157 under 150-mcp-open-design"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/skills/sk-interface-design/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/specs/skilled-agent-orchestration/157-design-playbook-live-run-and-refinement/scratch/results-matrix.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-157-design-playbook-live-run-and-refinement"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions:
      - "Model-judgment scenarios run via Kimi K2.7 + DeepSeek v4 Pro; WIRE-001 installs into Code Mode UTCP"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Live-run and refine the design playbooks

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Review |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mcp-open-design (4 scenarios) and sk-interface-design (9 scenarios) manual testing playbooks had never been executed end to end against the real tooling, so it was unknown whether the scenarios were accurate, runnable, or complete. The earlier live Open Design work showed that running for real surfaces things the docs assume.

### Purpose
Every playbook scenario is run live with real evidence and an honest verdict, and each scenario is refined wherever the live run exposes a concrete gap.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run all 13 scenarios live: deterministic checks, routing + model-judgment via Kimi K2.7 and DeepSeek v4 Pro, design-system reads, the gated Open Design generation, and the daemon-failure path.
- A per-scenario results matrix (verdict + evidence + refinement surfaced).
- Evidence-driven, in-place refinements to both playbooks (preserving the self-check counts and the prompt-equality invariant).
- The cross-finding fix: real WCAG contrast failures in the 154 designs (handled in packet 154).

### Out of Scope
- Rewriting scenarios that the run confirmed accurate.
- Adding net-new scenarios (the optional variation scenario is deferred).
- mcp-figma (not named).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp-open-design/manual_testing_playbook/{manual_testing_playbook.md, 02--reading/*, 03--gated-runs/*}` | Modify | Socket-export precondition, READ token-wall note, RUN model-pinning + form-answer path |
| `mcp-open-design/references/mcp_wiring.md` | Modify | Code Mode (UTCP) wiring path |
| `sk-interface-design/manual_testing_playbook/{03,04,06,07}--*/*` | Modify | Fixture, bundled-system source, exact de-vendor tokens, runId source |
| `157-.../{spec,plan,tasks,checklist,implementation-summary}.md` | Create | The packet record + results matrix |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run all 13 scenarios live | Each scenario has a verdict (PASS/PARTIAL/FAIL/SKIP) backed by real evidence (transcript, run id, tool output) |
| REQ-002 | Honest verdicts, no fake passes | Any dependency-blocked scenario is SKIP-with-blocker, never a fabricated PASS |
| REQ-003 | Evidence-driven refinements | Each playbook edit traces to a concrete gap the live run exposed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Preserve playbook self-checks | mcp-od "5 features / 4 scenarios" and sk-id 9-scenario counts unchanged; sk-id prompt-equality invariant held |
| REQ-005 | Wire open-design into Code Mode | open-design manual installed in `.utcp_config.json`, valid, launch spec matches `od --print` |
| REQ-006 | Address the cross-finding | The real WCAG contrast failures both models caught in the 154 designs are fixed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 13 scenarios run live with honest verdicts (final tally 12 PASS, 1 PARTIAL, 0 SKIP).
- **SC-002**: Both skills pass `package_skill --check` after refinement, with no house-voice or comment-hygiene regressions.
- **SC-003**: The refinements make previously-vague or blocked scenarios concrete and runnable.

### Acceptance Scenarios

- **Given** the 13 scenarios, **When** run live, **Then** each has a verdict with real evidence.
- **Given** Kimi and DeepSeek, **When** they run the model-judgment scenarios with the skill loaded, **Then** both pass (deviation, pinned-brief, quality-floor, routing).
- **Given** the bundled Open Design systems, **When** read, **Then** the design-system scenarios run live (not SKIP).
- **Given** the refined playbooks, **When** `package_skill --check` runs, **Then** both skills are valid and the self-check counts are preserved.
- **Given** the 154 designs, **When** re-graded after the fix, **Then** the cited contrast ratios pass WCAG AA.
- **Given** WIRE-001, **When** verified, **Then** the open-design manual is installed and valid (live tools list pending a Code Mode reload).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Open Design app + daemon | Reads/generation need it open | Confirmed running; OD_SIDECAR_IPC_PATH exported |
| Dependency | Kimi + DeepSeek providers | Model-judgment scenarios | Confirmed configured (kimi-for-coding/k2p7, deepseek/deepseek-v4-pro) |
| Risk | Code Mode does not hot-reload a new manual | WIRE-001 live tools list | Honest PARTIAL; manual installed + valid, needs a fresh Code Mode session |
| Risk | Model hallucinating CLI/system facts | Wrong verdicts | Host-verified every generated artifact against the real source |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The deterministic and read scenarios complete quickly; generation runs are a few minutes and are polled, not blocked on.

### Security
- **NFR-S01**: No secrets printed; the gated generation uses a throwaway project; no destructive verbs fired.

### Reliability
- **NFR-R01**: Blocked scenarios degrade to SKIP-with-blocker rather than failing the run or faking a pass.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty design-systems data dir: the built-in systems live in the app bundle, so reads still work.
- A scenario with no fixture: the refinement names a concrete fixture.

### Error Scenarios
- Daemon unreachable: FAIL-001 simulated via a bogus socket so the live app is not disrupted.
- Standalone `od tools` without a token: documented as the read-path wall, routed through the wired MCP.

### State Transitions
- Turn-1 discovery form (zero files): answered via a follow-up message to fire the build.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 13 scenarios, 2 skills, 2 models, Code Mode wiring, plus refinements |
| Risk | 7/25 | Read-only/gated-with-throwaway; no destructive verbs; reversible doc edits |
| Research | 9/20 | Required the live od + Code Mode + bundled-system facts |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open. Model executor (Kimi + DeepSeek) and the Code Mode wiring target were resolved with the user.
<!-- /ANCHOR:questions -->

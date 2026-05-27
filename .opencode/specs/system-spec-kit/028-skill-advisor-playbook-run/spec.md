---
title: "Feature Specification: Skill Advisor Manual Testing Playbook Run"
description: "Execute all 46 scenarios of the system-skill-advisor manual testing playbook across native MCP, CLI hooks, compat, daemon, indexing, lifecycle, scorer and python-compat surfaces, with CLI-delegated waves (cli-devin SWE-1.6, cli-opencode DeepSeek) and recorded verdicts + evidence."
trigger_phrases:
  - "skill advisor playbook run"
  - "skill-advisor manual testing playbook"
  - "028 skill advisor playbook"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "playbook-run-operator"
    recent_action: "All phases complete: playbook run, finding remediation, P1 routing tuning"
    next_safe_action: "None; F4 cold-env residual is an optional follow-up"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-playbook-run"
      parent_session_id: null
    completion_pct: 98
    open_questions: []
    answered_questions:
      - "Phase granularity: 4 grouped phases (user-selected)"
      - "CLI depth: maximize delegation (user-selected) — devin PC/AU/CP, opencode SC/AI/LC"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase list + outcome only. No migration narrative; heavy docs live in children. -->

# Feature Specification: Skill Advisor Manual Testing Playbook Run

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (F4 cold-env residual) |
| **Created** | 2026-05-26 |
| **Branch** | `main` |
| **Parent Spec** | (root packet) |
| **Parent Packet** | system-spec-kit/028-skill-advisor-playbook-run |
| **Predecessor** | system-spec-kit/027-xce-research-based-refinement |
| **Successor** | None |
| **Handoff Criteria** | All 46 scenarios executed with a recorded verdict (PASS/PARTIAL/FAIL/SKIP) and evidence; findings triaged; phase children validate under tolerant policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `system-skill-advisor` skill ships a 46-scenario manual testing playbook (`manual_testing_playbook/`) spanning native MCP tools, CLI runtime hooks, compatibility shims, auto-update daemon state, auto-indexing, lifecycle routing, scorer fusion and Python compatibility. The playbook had not been executed end-to-end against the current build, so its real PASS/PARTIAL/FAIL/SKIP state and any drift between documented expected signals and live behavior were unknown.

### Purpose
Execute every playbook scenario against the current MCP build, capture deterministic evidence, assign verdicts per the playbook §5 rubric, and surface any behavior-vs-doc drift as findings. Part of the run is delegated to two CLI executors per operator direction: `cli-devin` (SWE-1.6) and `cli-opencode` (DeepSeek), with all CLI evidence independently verified.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. Per-phase planning, tasks, checklists and results live in the child phase folders below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Execute all 46 playbook scenarios across 9 categories (NC, CL, CP, OP, AU, AI, LC, SC, PC).
- Capture evidence (MCP envelopes, hook stdout/stderr/exit, command transcripts) under `/tmp/skill-advisor-playbook/`.
- Assign per-scenario verdicts and roll up per-category and release readiness.
- Delegate self-contained waves to CLI executors (cli-devin SWE-1.6; cli-opencode DeepSeek) and verify their evidence.
- Record findings where live behavior diverges from documented expected signals.

### Out of Scope
- Fixing any defect or drift discovered (findings are recorded, not remediated, in this packet).
- Modifying the playbook scenario files or the skill-advisor implementation.
- Establishing a full disposable-workspace + active-daemon-watcher test harness (scenarios requiring it are SKIP-with-blocker).

### Files to Change
This is a test-execution + documentation packet. The only repo writes are the spec-folder docs themselves; all test evidence is written under `/tmp/`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `028-skill-advisor-playbook-run/00*-*/**` | Create | all | Phase-child spec docs + recorded verdicts/evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Phased decomposition by execution surface (operator-selected: 4 grouped phases). All implementation detail lives in the children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-preconditions-and-build/` | Global preconditions: MCP server builds, env flags, evidence workspaces, CLI availability probes | Complete |
| 002 | `002-mcp-native-scenarios/` | NC-001..009 native MCP tools + MCP-native lanes (advisor_recommend/status/validate/rebuild, skill_graph_*) — local | Complete |
| 003 | `003-cli-hooks-and-plugin/` | CL-001/003/004/005/006 runtime hooks + opencode plugin bridge — local | Complete |
| 004 | `004-shell-python-daemon/` | CP/OP/AU/AI/LC/SC/PC — CLI-delegated (devin PC/AU/CP, opencode SC/AI/LC) + OP local | Complete |
| 005 | `005-finding-remediation/` | Deep-research (cli-codex gpt-5.5) root-causing the 5 findings + 7 remediation phase children (sub-parent) | Complete (F4 cold-env residual) |
| 006 | `006-p1-routing-tuning/` | Skill-advisor P1 routing/abstention tuning: remediate the residual non-alias P1 regression failures across both scorers (5 classes; both scorers 0 regression failures) | Complete (verified 2026-05-27) |

### Phase Transition Rules
- Each phase passes `validate.sh` independently before rollup.
- Parent tracks aggregate verdict counts via this map and the rollup in 004.
- Use `/spec_kit:resume [parent]/[NNN-phase]/` to resume a specific phase.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Builds current, env unset, evidence dirs exist | `advisor_status` returns live |
| 002 | 003 | NC scenarios executed with verdicts | NC results table populated |
| 003 | 004 | CL hook smokes executed with verdicts | CL results table populated |
| 004 | rollup | CP/OP/AU/AI/LC/SC/PC executed or SKIP-with-blocker | Per-wave verdict counts recorded |
| 005-finding-remediation | 006-p1-routing-tuning | Findings + alias follow-ups closed; residual non-alias P1s scoped for routing/abstention tuning | validate.sh + both regression harnesses |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- ~~Should the surfaced findings be filed as follow-on remediation packets?~~ **Resolved:** all 5 findings were remediated in phase `005-finding-remediation` (F1-F5; F4 has a flagged cold-env residual), and the residual P1 routing/abstention gaps in phase `006-p1-routing-tuning`. Both scorers now report 0 regression failures.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: `001-preconditions-and-build/`, `002-mcp-native-scenarios/`, `003-cli-hooks-and-plugin/`, `004-shell-python-daemon/`, `005-finding-remediation/` (sub-parent), `006-p1-routing-tuning/`
- **Playbook source**: `.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md`
- **Graph Metadata**: `graph-metadata.json` (`derived.last_active_child_id` pointer)

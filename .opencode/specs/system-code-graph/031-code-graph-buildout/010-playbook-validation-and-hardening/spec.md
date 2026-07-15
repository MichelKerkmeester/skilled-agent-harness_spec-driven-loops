---
title: "Feature Specification: Code Graph Playbook Validation"
description: "Operator validation run of the system-code-graph manual testing playbook (22 scenarios) via cross-AI dispatch, producing release-readiness evidence."
trigger_phrases:
  - "code graph playbook validation"
  - "system-code-graph manual testing run"
  - "029 code graph playbook validation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/010-playbook-validation-and-hardening"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Initialize phase-parent for the code-graph playbook validation run"
    next_safe_action: "Plan or resume child phase 001-opencode-runtime-scenarios"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-26-code-graph-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Dispatch concurrency: SEQUENTIAL (single-dispatch discipline, kill between) — operator confirmed 2026-05-26"
      - "Rollout: SMOKE-TEST FIRST (1 scenario per executor, then full run) — operator confirmed 2026-05-26"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase list + what needs done only. -->

# Feature Specification: Code Graph Playbook Validation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (Phase Parent) |
| **Priority** | P1 |
| **Status** | Complete — validation CONDITIONAL PASS (16/2/4); after remediation (phases 004-008) all findings fixed (F-019-1, F-025-1, F-RUNTIME-2, F-011-1, F-020-1, F-021-1, F-022-1) |
| **Created** | 2026-05-26 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (004-code-graph phase parent) |
| **Parent Packet** | system-spec-kit/026-graph-and-context-optimization/004-code-graph |
| **Predecessor** | 027-xce-research-based-refinement |
| **Successor** | None |
| **Handoff Criteria** | All 22 playbook scenarios run with PASS/FAIL/SKIP + evidence; release-readiness matrix assembled in phase 003 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `system-code-graph` skill ships a 22-scenario manual testing playbook (`manual_testing_playbook/`) that validates the `mk-code-index` MCP runtime: read-path freshness, manual scan/verify/status, detect_changes, context retrieval, coverage graph, MCP tool surface, doctor-code-graph policy, post-rename infrastructure, and the Devin SessionStart hook. These scenarios have no captured, dated operator run on record. Release readiness cannot be asserted without one.

### Purpose
Execute every playbook scenario through cross-AI dispatch, capture per-scenario evidence (command, JSON proof, verdict), and assemble a single release-readiness matrix. The code-graph MCP is not registered in the orchestrating Claude Code runtime, so live-runtime scenarios are dispatched to `cli-opencode` (full project MCP runtime) and static/infrastructure/hook scenarios to `cli-devin` SWE-1.6.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All planning, task breakdowns, checklists, and per-scenario evidence live in the child phase folders below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Running all 22 manual-testing-playbook scenarios for `system-code-graph` (IDs 001-011, 015-025).
- Cross-AI dispatch via `cli-opencode` (`deepseek/deepseek-v4-pro`) and `cli-devin` (`swe-1.6`).
- Per-scenario evidence capture and a final PASS/FAIL/SKIP release-readiness matrix.
- Disposable-workspace discipline for any scenario that mutates files or graph state.

### Out of Scope
- Fixing any defect the playbook surfaces (a FAIL produces a follow-on packet, not an in-place fix here).
- Editing the playbook scenarios or the `mk-code-index` runtime itself.
- Registering the code-graph MCP into the Claude Code runtime.

### Files to Change
This is a validation run; production code is not modified. Authored artifacts are evidence and continuity docs inside this packet tree only.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `029-.../001-opencode-runtime-scenarios/**` | Create | 001 | Evidence for the 15 live-runtime scenarios |
| `029-.../002-devin-static-scenarios/**` | Create | 002 | Evidence for the 7 static/infra/hook scenarios |
| `029-.../003-release-readiness-synthesis/**` | Create | 003 | Aggregated release-readiness matrix |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each phase is an independently executable child spec folder. Implementation detail lives inside the children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-opencode-runtime-scenarios/` | 15 live-MCP/coverage/doctor scenarios via cli-opencode DeepSeek | Complete (11 PASS, 4 SKIP) |
| 002 | `002-devin-static-scenarios/` | 7 static/build/infra + Devin-hook scenarios via cli-devin SWE-1.6 | Complete (5 PASS, 2 FAIL) |
| 003 | `003-release-readiness-synthesis/` | Aggregate 22 verdicts into release-readiness matrix | Complete (CONDITIONAL PASS) |
| 004 | `004-hook-and-doc-fixes/` | Remediation: F-025-1 Devin hook path + P2 playbook doc-sync | Complete (fixed + verified) |
| 005 | `005-db-binding-cleanup/` | Remediation: F-019-1 stale legacy DB removal | Complete (resolved) |
| 006 | `006-parser-quarantine-recovery/` | Remediation: F-RUNTIME-2 recovery + re-run of 002/005/022/024 | Complete (shipped + re-verified) |
| 007 | `007-followup-hook-docs-and-022/` | Follow-ups: cross-skill hook-doc reconciliation + 022 transitive re-verify | Complete (docs fixed; 022 PARTIAL → F-022-1 raised) |
| 008 | `008-blast-radius-transitive-flag/` | Fix F-022-1: blast_radius honors includeTransitive (default 1-hop) | Complete (shipped + 85 tests pass) |

### Scenario → Phase Mapping (audit trail)

| Group | Scenario IDs | Surface | Phase |
|-------|--------------|---------|-------|
| 01 read-path-freshness | 001, 002 | live MCP | 001 |
| 02 scan/verify/status | 003, 004, 005, 006 | live MCP | 001 |
| 03 detect-changes | 007, 024 | live MCP | 001 |
| 04 context-retrieval | 008 | live MCP | 001 |
| 05 coverage-graph | 009, 010 | deep-loop runtime | 001 |
| 06 mcp-tool-surface | 011, 022 | live MCP | 001 |
| 06 mcp-tool-surface | 016 | static manifest inspect | 002 |
| 08 doctor-code-graph | 015, 023 | doctor runtime | 001 |
| 09 post-rename-infra | 017, 018, 019, 020, 021 | static/build | 002 |
| 10 devin-hooks | 025 | Devin hook | 002 |

### Phase Transition Rules
- Each phase passes `validate.sh --strict` independently before the next begins.
- Parent tracks aggregate progress via this map.
- Resume a phase via `/spec_kit:resume 010-playbook-validation-and-hardening/[NNN-phase]/`.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | 15 live-runtime verdicts captured with JSON evidence | child 001 checklist complete |
| 002 | 003 | 7 static/hook verdicts captured with command evidence | child 002 checklist complete |
| 003 | done | 22/22 verdicts aggregated; FAIL/SKIP triaged | release-readiness matrix present |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Sequential single-dispatch discipline (default) vs operator-authorized parallel cli-opencode + cli-devin dispatch?
- For any scenario that FAILs, confirm the "log only, no in-place fix" boundary holds for this packet.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: `001-opencode-runtime-scenarios/`, `002-devin-static-scenarios/`, `003-release-readiness-synthesis/`
- **Playbook source**: `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md`
- **Graph Metadata**: `graph-metadata.json` (`derived.last_active_child_id`)

---
title: "Feature Specification: Agent Loops Improved"
description: "Research and phased implementation of loop-system improvements mined from vendored external references (loop-cli-main, kasper)."
trigger_phrases:
  - "deep loop improved"
  - "030 deep loop improved"
  - "agent loops improved"
  - "loop systems improvement"
  - "deep-loop improvements implementation"
  - "156 agent loops"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved"
    last_updated_at: "2026-07-02T15:45:49Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Phase 011 complete: child 007 sliding-window mode shipped and verified"
    next_safe_action: "Run the final strict recursive sweep once the shared-dist gate clears"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-011-followup-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Agent Loops Improved

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | None (top-level packet in the skilled-agent-orchestration track) |
| **Parent Packet** | skilled-agent-orchestration |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child phase validates independently under `validate.sh`; the parent validates recursively |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Our loop-based systems (deep-loop-runtime, deep-loop-workflows, and the system-spec-kit commands/agents that drive them) carry known gaps in resilience, convergence quality, observability, safety, and interconnection. We need a disciplined way to discover concrete, evidence-backed improvements and then apply them without losing track of dependencies.

### Purpose
This packet first researches two vendored reference codebases for portable patterns (phase `001-reference-research`), then applies the resulting loop-system improvements as independently-executable phases (`002`-`007`, by subsystem). Phase `008` remediates deep-review follow-ups. Phase `009` implements the prioritized backlog from a deep-research fan-out run against the packet itself (`research/research.md`). Phase `010` dispatched a 10-iteration deep-review that confirmed the root `README.md` had drifted from everything shipped in `001`-`009` (a stale section label, an under-promoted feature, a missing safety-posture disclosure), and applied every confirmed fix. Phase `011` closes the 4 remaining deliberately-deferred follow-up items from phase 009's own changelog: 2 active review findings, a validate.sh architectural gap, the scaffold-content debt that gap would otherwise expose, and the sliding-window convergence mode a decision record recommended building next.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reference research mining loop-cli-main + kasper into a ranked recommendation backlog (`001-reference-research`).
- Phased implementation of the 40 loop-system recommendations as top-level phases `002`-`007` (by subsystem), followed by remediation in `008`.

### Out of Scope
- Subsystems unrelated to loop orchestration.
- Implementing improvements at the parent level — all work is delegated to child phases.

### Files to Change
Audit-trail summary only; per-phase detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/deep-loop-runtime/**` | Modify | 002-deep-loop-runtime | Resilience, convergence, observability improvements |
| `.opencode/skills/deep-loop-workflows/**` | Modify | 003-deep-loop-workflows | Anti-convergence, injection, interconnection improvements |
| `.opencode/commands/{deep,speckit}/**` | Modify | 004-006 | Telemetry, run-now, autopilot improvements |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-reference-research` | 50-iteration mining of loop-cli-main + kasper → 40 recommendations | Complete |
| 002 | `002-deep-loop-runtime` | 18 runtime recs: atomic-state, loop-lock, sleep, jsonl, executor/fallback, coverage-graph, fanout, lifecycle | Complete |
| 003 | `003-deep-loop-workflows` | 12 workflow recs: anti-convergence + ADRs, injection-inbox, ideas/rejected caches, benchmark, push-wave | Complete |
| 004 | `004-system-spec-kit` | Speckit autopilot lifecycle | Complete |
| 005 | `005-skill-interconnection` | Advisor routing projection | Complete |
| 006 | `006-ux-observability-automation` | Dashboards, telemetry heartbeat, run-now, dry-run, observability envelope, memory-upsert | Complete |
| 007 | `007-testing` | Hermetic test isolation, record-replay cassette harness | Complete |
| 008 | `008-loop-systems-remediation` | Remediate deep-review deferred findings + MiMo-campaign recs (rollback hash-guard, promotion safety, benchmark ledger, adversarial playbook scenarios, tightened pass-criteria, test-adequacy) | Complete |
| 009 | `009-research-backlog-remediation` | Implement Tier 0/1/2 of the deep-research fan-out's 19-item backlog (`research/research.md`) plus 2 generation-2 findings: fanout-merge/runtime bug fixes, claimed-vs-actual drift closure, convergence/observability hardening, synthesis-integrity + orchestrator watchdog (11 children total) | Complete |
| 010 | `010-documentation-truth-audit` | Dispatched 10-iteration GPT-5.5-fast deep-review checking README.md/AGENTS.md/AGENTS_Barter.md drift against everything shipped in 001-009; found and fixed 4 P1 + 1 P2 findings (Spec Kit Framework rename, Goal Plugin FEATURES section, Deep Loop safety-posture disclosure, phase-metadata self-consistency, review-artifact integrity) | Complete |
| 011 | `011-followup-remediation` | Close the 4 deferred follow-ups from phase 009: 2 active review findings (fanout session-id propagation, LEAF-identity conflation), scaffold-content authoring across phases 002-007 (~40 leaves), the validate.sh registry-bridge gap (sequenced after scaffold cleanup), and the sliding-window convergence mode (7 children) | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Ranked recommendation backlog synthesized | `001-reference-research/research/research.md` present |
| 007 | 008 | Implementation phases shipped + deep-reviewed; remediation backlog triaged | `review/review-report.md` + `review/mimo-campaign-report.md` present |
| 008 | 009 | Deep-research fan-out run against the packet; prioritized backlog synthesized | `research/research.md` present |
| 009 | 010 | All 11 remediation children shipped; documentation drift risk identified | `009-research-backlog-remediation/implementation-summary.md` present |
| 010 | 011 | Documentation drift closed; 4 deferred follow-ups from phase 009 remained open | `009-research-backlog-remediation/changelog-009-root.md` Follow-Ups section |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Cross-subsystem convergence dependencies (the convergence-profile ADR must precede new convergence signals) are tracked via per-phase `Predecessor` fields rather than folder order.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: None (top-level packet)
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

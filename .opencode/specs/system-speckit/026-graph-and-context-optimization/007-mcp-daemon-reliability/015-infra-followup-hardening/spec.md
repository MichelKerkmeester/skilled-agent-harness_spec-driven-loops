---
title: "Phase Parent: Infra follow-up hardening (032/035 deferred items)"
description: "Control file coordinating the three deferred follow-ups from the 032/035 daemon-lifecycle + worktree session: live two-launcher integration test, substrate Code-Graph scenario correctness, and worktree child-marker dispatch documentation."
trigger_phrases:
  - "infra follow-up hardening"
  - "032 035 deferred items"
  - "live two-launcher substrate child-marker"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening"
    last_updated_at: "2026-05-30T22:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Created phase parent for the three deferred 032/035 follow-ups"
    next_safe_action: "Implement child 001 live two-launcher test"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003600"
      session_id: "036-parent"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Scope = the 3 swarm-scoped deferred items from 032/035; substrate item was REJECTED as naive daemon-wiring and needs a playbook tool-contract fix or an infeasibility verdict."
---
# Phase Parent: Infra follow-up hardening (032/035 deferred items)

<!-- SPECKIT_LEVEL: phase -->
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Type** | Phase Parent (control file) |
| **Status** | Active |
| **Created** | 2026-05-30 |
| **Children** | 3 (planned) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:purpose -->
## 2. PURPOSE

Coordinates the three deferred follow-ups surfaced by the 032 (daemon-lifecycle healing) and 035 (worktree-per-session) work and triaged by an Opus scope+verify swarm. This is a CONTROL FILE — each child carries its own spec/plan/tasks and lands as an independent, gated commit.

<!-- /ANCHOR:purpose -->
---

<!-- ANCHOR:children -->
## 3. PHASE CHILDREN

| Child | Status | Purpose |
|-------|--------|---------|
| 001-live-two-launcher-test | In progress | End-to-end test of the F2 clean-close barrier: a second launcher reaps an unresponsive incumbent and verifies clean DB close (the gap 031/009 + 032/001 left open). Swarm verdict CONFIRM_GO. |
| 002-substrate-codegraph-scenarios | Planned | Make substrate scenarios 403/404/407 run for real, not SKIP. Swarm REJECTED naive daemon-wiring (playbooks call structural code_graph_query with a semantic payload); needs a tool-contract fix or an infeasibility verdict. |
| 003-worktree-child-marker-dispatch | Planned | Document AI_SESSION_CHILD=1 injection at cli-* dispatch sites so orchestrated children never create their own worktree (035 T006, in-repo doc portion). |

<!-- /ANCHOR:children -->
---

<!-- ANCHOR:sequencing -->
## 4. SEQUENCING

Children are independent and committed serially (no parallel writes to the shared tree — the daemon-lifecycle/launcher surface is the repo's highest blast radius). Order: 001 (ready design) → 002 (investigation-first; may land as infeasible+documented) → 003 (doc-only).

<!-- /ANCHOR:sequencing -->

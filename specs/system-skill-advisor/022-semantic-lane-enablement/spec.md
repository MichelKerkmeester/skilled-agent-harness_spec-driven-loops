---
title: "Feature Specification: Semantic Lane Enablement"
description: "Phase parent for turning the advisor's semantic lane into a lane that actually contributes: measure what it does today, embed the five hubs that have no vector, plan the weight research, then enable it behind a reversible flag."
trigger_phrases:
  - "semantic lane enablement"
  - "advisor lane weight"
  - "skill embedding coverage"
  - "gate b routing rate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase parent and its five children as a plan-only packet"
    next_safe_action: "Execute 001-baseline-and-instrumentation"
    blockers: []
    key_files:
      - "goal.md"
      - "001-baseline-and-instrumentation/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-semantic-lane-enablement"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "What weight the semantic lane should carry once every hub has a vector"
    answered_questions:
      - "The lane is live in the registry at weight 0.05, not shadow-only"
      - "Nine of fourteen hubs carry a vector in the active table, not zero"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Semantic Lane Enablement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-03 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-skill-advisor/023-semantic-lane-enablement |
| **Predecessor** | sk-doc/052-routing-completeness |
| **Successor** | None |
| **Handoff Criteria** | Each phase validates under `validate.sh --strict` before the next one starts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Eight of 172 realistic phrasings reach the mode they were written for. That measurement lives in
`specs/sk-doc/052-routing-completeness/003-gate-b-realistic-corpus/`, and it found that 94 of its
180 rows returned nothing at all. Keyword work cannot move a row that matches no keyword, so the
only lane that could read meaning instead of spelling is the one that has to carry it.

That lane is weighted 0.05 out of a live total of 1.00, which is the ceiling on what it can
contribute to any fused score. Two further beliefs about it turned out to be wrong when read
against the running system, and this packet exists partly to correct them:

- The lane was recorded as shadow-only. It is not. `LANE_DEFINITIONS` carries
  `semantic_shadow` with `live: true`, so `isLiveScorerLane` returns true and fusion never sets
  `shadowOnly` on it.
- Coverage was recorded as zero of fourteen. That count reads the retired `skill_nodes.embedding`
  column, which is genuinely empty. The live read path prefers the active `vec_<dim>` table
  instead, and `vec_768` holds nine rows against an active pointer of `nomic-embed-text-v1.5`.

Five hubs have no vector: `mcp-tooling`, `sk-code`, `sk-design`, `sk-vision` and
`system-deep-loop`. Two of them are exactly the hubs Gate B scored at zero. So the lane is on, it
is starved rather than switched off, and nobody can currently see what it does because the advisor
reports one dominant lane per recommendation and no per-lane breakdown.

### Purpose

Give the lane real vectors, a weight chosen from measurement rather than from a default, and a
switch that reverts in one command, without losing a row of the scorer accuracy ratchet.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The lane weight for `semantic_shadow` and the four live lanes it shares a budget with.
- Skill embedding coverage in the active vector table, and the pass that populates it.
- Instrumentation that makes the lane's contribution readable from outside the process.
- A reversible enable, its canaries, its rollback and its Gate B target.

### Out of Scope

- The legacy duplicate advisor entries that shadow six executor rows. Packet 052 phase 004 owns them.
- Adding vocabulary so a corpus row lands. That measures the corpus rather than the routing.
- Command-bridge modes. They are never advisor-scored, which is why the denominator is 172 rather than 180.
- Reconciling the daemon scorer with the Python scorer. That is a separate scoring change.

### Files to Change

Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `mcp-server/scripts/routing-accuracy/scorer-eval-baseline.json` | Modify | 001, 005 | Re-captured baseline, before and after |
| `mcp-server/handlers/advisor-status.ts` | Modify | 001 | Read-only lane and coverage reporting |
| `mcp-server/lib/skill-graph/skill-graph-db.ts` | Modify | 002 | The population pass and its content-hash guard |
| `mcp-server/handlers/skill-graph/scan.ts` | Modify | 002 | Embedding refresh on scan |
| `mcp-server/lib/scorer/lane-registry.ts` | Modify | 004 | The default weight, if research moves it |
| `references/scoring/advisor-scorer.md` | Modify | 004, 005 | The lane's documented weight and state |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-baseline-and-instrumentation/ | Freeze the three corpora as gates, re-capture the scorer baseline, record real embedding coverage per node, and make the lane's contribution visible from outside the daemon | Pending |
| 2 | 002-embedding-population/ | Embed the five hubs that have no vector, using the embedder the runtime already points at, with a content hash so an edited hub re-embeds and a failure keeps the old vector | Pending |
| 3 | 003-weight-and-fusion-research/ | Write the deep-research plan for the weight sweep, the coverage-versus-weight question, the RRF interaction and the abstain regression. Planning only, no run | Pending |
| 4 | 004-gated-enable/ | Turn the lane up behind the existing env override, with five named canaries, a one-command rollback and a Gate B target stated as a number | Pending |
| 5 | 005-verification-and-closeout/ | Re-run all three suites against the frozen corpora, reconcile the 052 roadmap and findings register, and close the packet | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-baseline-and-instrumentation | 002-embedding-population | Coverage, latency and the scorer baseline are recorded from the running system, and the lane's contribution is readable | `advisor_status` reports a per-node coverage count that matches a direct query of the active vec table |
| 002-embedding-population | 003-weight-and-fusion-research | Every hub in `skill_nodes` carries a vector under the active pointer | `select count(*) from vec_768;` returns the same number as `select count(*) from skill_nodes;` |
| 003-weight-and-fusion-research | 004-gated-enable | The research plan names its iterations, its executor and its questions, and a reviewer can run it without asking anything | `research/research-plan.md` exists and every question carries the artifact that answers it |
| 004-gated-enable | 005-verification-and-closeout | The lane runs at the researched weight, five canaries pass, and no ratchet metric dropped | `npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts` exits 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- What weight the lane should carry once every hub has a vector. Phase 003 plans the sweep that answers it, and phase 004 applies the answer rather than guessing ahead of it.
- Whether a coverage fix alone moves Gate B far enough to leave the weight at 0.05. That ordering is deliberate: coverage is cheap and reversible, and a weight change measured on top of missing vectors would be measuring the wrong thing.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Packet goal**: See `goal.md` for the durable directive and its phase binding
- **Predecessor measurement**: See `specs/sk-doc/052-routing-completeness/003-gate-b-realistic-corpus/research/gate-b-measurement.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

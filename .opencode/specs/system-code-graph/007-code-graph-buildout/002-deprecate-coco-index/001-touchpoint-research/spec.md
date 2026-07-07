---
title: "001: Touchpoint Research — CocoIndex / Rerank-Sidecar Deprecation Discovery"
description: "Deep-research subphase that maps every LIVE touchpoint of mcp-coco-index, system-rerank-sidecar, and the system-code-graph to CocoIndex coupling into a classified resource map (DELETE / EDIT-decouple / EDIT-remove-ref / LEAVE-historical) plus a dependency-ordered deprecation phase DAG. 10 iterations cli-devin swe-1.6 + 2 iterations cli-opencode deepseek-v4 cross-model validation."
trigger_phrases:
  - "cocoindex deprecation touchpoint research"
  - "rerank sidecar consumers map"
  - "code-graph cocoindex decouple research"
  - "deprecation resource map"
  - "ccc bridge touchpoints"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/002-deprecate-coco-index/001-touchpoint-research"
    last_updated_at: "2026-05-25T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Research complete: 12 iters, resource-map promoted to 014 root"
    next_safe_action: "Scaffold/plan deprecation phases 002-008 then implement"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000014001"
      session_id: "014-001-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Touchpoint Research — CocoIndex / Rerank-Sidecar Deprecation Discovery

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-25 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Deprecating mcp-coco-index + system-rerank-sidecar and decoupling system-code-graph touches a large, dispersed surface (skills, commands, agents, hooks, 4-runtime configs, READMEs) with two dangerous couplings (sidecar to mk-spec-memory; code-graph to coco via the ccc bridge). Acting without an exhaustive, classified touchpoint map risks breaking memory reranking, semantic-search routing, or the structural code-graph.

### Purpose
Produce a classified, deduplicated touchpoint resource map plus a dependency-ordered deprecation phase DAG so the parent (014) can scaffold safe deletion phases.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Exhaustive inventory of LIVE references to coco / cocoindex / cocoindex_code / ccc, system-rerank-sidecar, and the code-graph to coco coupling.
- Per-file mutation class: DELETE / EDIT-decouple / EDIT-remove-ref / LEAVE-historical.
- Consumer + fallback analysis for the rerank sidecar (especially mk-spec-memory) and the semantic-search vacuum left by coco removal.
- Dependency-ordered phase DAG + risk register + negative-knowledge list.

### Out of Scope
- Any code edits or deletions (research only; report findings, do not implement).
- Editing frozen historical spec docs under `.opencode/specs/**`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| research/research.md | Create | Synthesized findings (workflow-owned) |
| research/resource-map.md | Create | Classified touchpoint map (promoted to 014 root) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Exhaustive classified inventory of live touchpoints (RQ1) | resource-map.md lists every live file with a mutation class; deduped across coco / cocoindex / cocoindex_code / ccc spellings |
| REQ-002 | Rerank-sidecar consumer + memory fallback map (RQ2) | All consumers enumerated; explicit decision on what mk-spec-memory loses + the safe fallback |
| REQ-003 | code-graph decouple edit-set (RQ3) | Precise edit list to sever ccc_* bridge + semantic/hybrid routing while code-graph stays green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Semantic-search replacement policy (RQ4) | Options + recommendation for post-coco "find code by concept" |
| REQ-005 | 4-runtime mirror + config touchpoints (RQ5) | Every opencode.json / .vscode / .gemini / .claude / .codex + mirrored agent / command edit listed |
| REQ-006 | Phase DAG + ordering + risk + negative knowledge (RQ6) | Dependency-correct ordering, rollback points, explicit out-of-scope list |
| REQ-007 | Deletion completeness (RQ7) | venv, daemon sockets / pids, gitignored index dirs, model cache, install / doctor scripts, git hooks accounted for |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: resource-map.md at 014 root classifies 100% of live touchpoints with a mutation class.
- **SC-002**: Deprecation phase DAG scaffolded inside 014 with dependency-correct ordering.
- **SC-003**: Both dangerous couplings (sidecar to memory, code-graph to coco) have explicit, evidence-cited remediation paths.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing sidecar breaks mk-spec-memory cross-encoder rerank | High | RQ2 defines fallback before any deletion phase |
| Risk | Semantic-search routing vacuum after coco removal | Med | RQ4 replacement policy |
| Dependency | Deep-research loop runtime (deep-loop-runtime, reduce-state.cjs) | Loop cannot run if broken | Verified present at scaffold time |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- (Deep-research loop appends the active research topic here.)
<!-- /ANCHOR:questions -->

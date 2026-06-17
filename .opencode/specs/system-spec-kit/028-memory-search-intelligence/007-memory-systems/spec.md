---
title: "Feature Specification: External Memory Systems — Search-Intelligence Mining"
description: "Mine four external agent-memory systems (Mem0, Graphiti/Zep, Letta/MemGPT, Cognee) for evidence-backed, code-mapped improvements to Memory MCP retrieval/ranking/consolidation/currentness (+ Advisor fusion, Deep-Loop continuity)."
trigger_phrases:
  - "028 memory systems mining"
  - "mem0 graphiti letta cognee mining"
  - "agent memory search intelligence"
  - "bi-temporal fact graph contradiction"
  - "memory tiers consolidation forgetting"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/007-memory-systems"
    last_updated_at: "2026-06-17T09:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffold memory-systems child for 4-model deep-research mining"
    next_safe_action: "Run 40-iter 4-model mining (DeepSeek/MiMo/Kimi/Opus)"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-17-028-007-memory-systems"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: External Memory Systems — Search-Intelligence Mining

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-17 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Packet** | system-spec-kit/028-memory-search-intelligence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 028 campaign mined aionforge + galadriel (and 027 mined OpenLTM + memclaw), but the broader open-source agent-memory frontier — Mem0, Graphiti/Zep, Letta/MemGPT, Cognee — encodes mature, *un-mined* techniques for memory extraction/consolidation, bi-temporal fact-invalidation, hybrid retrieval fusion, self-editing memory tiers, and contradiction/forgetting. The originally-named `xce-mcp` was verified to be a thin config/steering wrapper over a closed cloud service (no minable source; 027 already exhausted it), so the operator redirected this run to real external **memory systems**.

### Purpose
Produce evidence-backed, code-mapped improvement candidates for **Memory MCP (primary)** + Skill-Advisor (fusion/ranking) + Deep-Loop (continuity), each **diffed for novelty** against what 027/028 already shipped, ranked by leverage × effort. Research-only — the packet ends at the candidate list.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only analysis of `external/{mem0, graphiti, letta, cognee}` (Apache-2.0, vendored).
- Mapping external techniques to specific Memory MCP / Advisor modules with file:line.
- Novelty-diff vs the existing 028 roadmap + 027's shipped doctrine.
- Candidate proposals with citations + effort estimates, across a 4-model sweep (DeepSeek v4 Pro, MiMo v2.5 Pro, Kimi K2.7, Opus 4.8).

### Out of Scope
- Implementing any candidate (deferred to a later packet).
- Modifying the external reference systems.
- Code-search / code-graph as a primary lens (operator scoped this to memory systems).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each candidate cites an external source and an internal module | Source path + internal file:line per candidate |
| REQ-002 | Every candidate is novelty-tagged vs already-mined work | EXTENDS / NET-NEW / NO-TRANSFER tag per candidate |
| REQ-003 | Candidates ranked by leverage × effort | Ranked table in research.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: research.md contains code-mapped candidates citing an external source + an internal module, each novelty-tagged.
- **SC-002**: The four systems (Mem0, Graphiti, Letta, Cognee) are each covered; findings diffed against aionforge/galadriel/OpenLTM/memclaw.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Re-surfacing already-mined findings | Low novelty | Mandatory novelty-diff (Opus lineage) vs 027/028 |
| Risk | Early saturation | Fewer iterations than budget | Broaden angles; mark genuine saturation, do not pad |
| Dependency | External code readability | Weak mappings | Cite file:line per candidate; mark inferences |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which Mem0/Graphiti/Letta/Cognee techniques are NET-NEW vs aionforge/galadriel (028) + OpenLTM/memclaw (027)?
- Does Graphiti's bi-temporal fact-invalidation supersede or extend 028's bi-temporal candidates (C3-x)?
- Does Graphiti's hybrid retrieval (semantic+keyword+graph) add a fusion technique beyond the 5-channel RRF?
- Do Letta's self-editing memory tiers map to recall assembly / context budgeting?
- Which techniques generalize to Skill-Advisor fusion and Deep-Loop continuity?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Research output**: See `research/research.md`.
- **Parent Spec**: See `../spec.md`.
<!-- /ANCHOR:related-docs -->

---
title: "998: 026 aggressive restructure research (20-iter cli-devin SWE-1.6, post Wave-1)"
description: "Deeper second-pass restructure research targeting the items DEFERRED by packet 107's council-approved reduced variant: 000-release-cleanup recatalog, 008-skill-advisor internal phase structure, 18 SHALLOW+MEDIUM deletes with ref-count proof, M1/M8/M9/M10 unblock, additional cross-phase regroupings. 20 cli-devin SWE-1.6 iter."
trigger_phrases:
  - "998 spec"
  - "026 aggressive restructure"
  - "deeper restructure research"
  - "post-wave-1 followon research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research"
    last_updated_at: "2026-05-16T07:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded 998 packet"
    next_safe_action: "Author 20 iter prompts then dispatch"
    blockers: []
    key_files:
      - "research/iterations/iteration-NNN.md"
      - "research/research.md"
      - "resource-map.md"
    session_dedup:
      fingerprint: "sha256:99888aaa11122233344455566677788899900011122233344455566677788899"
      session_id: "998-spec"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "000-release-cleanup has 59 children with duplicate 006/007 prefixes — what's the right recatalog scheme?"
      - "008-skill-advisor has 26 children with no internal phase structure — what natural sub-phases emerge from the work?"
      - "18 SHALLOW+MEDIUM delete candidates: what's the ref-count threshold for safe delete vs archive?"
      - "M10 (015 → 000): how to absorb without colliding with existing 000 children?"
    answered_questions:
      - "Wave 1 council-approved reduced variant already shipped (packet 107); this packet covers DEFERRED items"
      - "Use cli-devin SWE-1.6 with v1.0.4.1 recipe (sequential_thinking mandatory + narrow Write scope + MCP permission)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# 998: 026 aggressive restructure research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Target Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Lifespan** | Temporary — DELETE after Wave 2 restructure ships |
| **Executor** | cli-devin / SWE-1.6 (v1.0.4.1 recipe) |
| **Iterations** | 20 (fixed) |
| **Predecessor** | 999-spec-026-restructure-research (Wave 1 already executed) |
| **Wave 1 executor** | packet 107 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 107 executed the council-approved Wave 1 reduced variant — captured ~75% of recall benefit at ~40% effort. The DEFERRED items represent real but complex work that the council prudently postponed:

- M1 (014/052+053), M8 (010→008), M9 (010→013) — LOW_PRIORITY per iter 045
- M10 (015 → 000) — BLOCKED on 000-release-cleanup recatalog (59 children, duplicate 006/007 prefixes)
- 18 SHALLOW + MEDIUM deletes — require per-packet ref-count proof
- 008-skill-advisor internal phase structure — 26 children with no internal phases
- iter 039 full 20-section parent-doc restructure
- Phase lifecycle governance (iter 047)

Some of these are interdependent (M10 blocks on 000 recatalog; 008-skill-advisor internal structure affects M8/M9 rehome targets).

### Purpose

Produce a verified deeper restructure proposal that aggressively consolidates the deferred items. Validate per-operation safety via 20 cli-devin SWE-1.6 iter using the v1.0.4.1 recipe (sequential_thinking mandatory + narrow Write + MCP permission scope).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (20 iter)

| Track | Iter | Focus |
|------:|-----:|-------|
| 1 | 001-003 | 000-release-cleanup recatalog (59-child enumeration → 5-7 sub-phases) |
| 2 | 004-006 | 008-skill-advisor internal phase structure (26 children → 4-6 sub-phases) |
| 3 | 007 | 010-template-levels parent retention + child rehoming decisions |
| 4 | 008 | M10 unblock — 015 → 000 absorption with renumbered prefix |
| 5 | 009-010 | SHALLOW + MEDIUM delete ref-count proofs (per-packet) |
| 6 | 011-012 | First-principles 11-surface taxonomy applied + phase numbering scheme |
| 7 | 013-015 | Parent-doc restructure (026/spec.md + resource-map.md + graph-metadata.json per iter 039) |
| 8 | 016 | Additional renames in nested children |
| 9 | 017 | Additional cross-026 reorgs (e.g., 003 absorbing 005?) |
| 10 | 018 | Hop-count validation pre/post aggressive variant |
| 11 | 019-020 | Synthesis-prep: per-operation risk + cost + verdict for Wave 2 |

### Out of Scope

- Executing the proposed restructure (that's a follow-on Wave 2 packet, similar to 107)
- Modifying any existing packet contents
- Deleting the 999 packet (separate cleanup)
- Council review of this packet (out of scope; the package itself IS the council-grade analysis)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | 20 iter outputs each ≥ 1000 bytes with file:line citations + JSONL row |
| REQ-002 | All iter use cli-devin SWE-1.6 with v1.0.4.1 recipe (sequential_thinking pre-output) |
| REQ-003 | Per-iter immediate commit on main |
| REQ-004 | Synthesis produces research/research.md citing every iter |
| REQ-005 | Per-track deliverable maps to a concrete Wave 2 operation |
| REQ-006 | Strict-validate exits 0 on 998 packet |
| REQ-007 | resource-map.md produced after synthesis with Wave 2 operation list |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- 20 iter committed on main
- research.md cites every iter
- resource-map.md proposes Wave 2 operations with iter-cited rationale
- Strict-validate exits 0
- Sequential_thinking visible in at least 80% of iter outputs (v1.0.4.1 mandate)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Iter dispatch hangs (like packet 999 iter 039) | Low | Medium | v1.0.4.0 gtimeout 900 wrapper now active per packet 105 |
| Sequential_thinking MCP rejected by Devin | Low | Low | v1.0.4.1 hotfix added mcp__sequential_thinking__* permission scope |
| Aggressive proposals introduce RM-8 risk | Medium | High | Read-only research; execution is a follow-on packet that goes through council review again |

### Dependencies

- Packet 999 (research foundation; resource-map.md as input)
- Packet 105 (cli-devin v1.0.4.1 — recipe with sequential_thinking + MCP permission)
- Packet 107 (Wave 1 executed; current 15-child state)
- HEAD baseline: `c2fcdaa56`
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Cost**: 20 iter × ~100s ≈ 35 min wall-clock; Devin units modest
- **Safety**: read-only on the rest of the codebase
- **Reversibility**: per-iter immediate commit means partial completion is recoverable
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **000-release-cleanup duplicate prefixes (006-, 007-)**: iter 001 enumerates; iter 002-003 propose renumber scheme
- **008-skill-advisor missing internal phases**: iter 004-006 propose first internal phase set
- **999 packet still present**: this 998 packet does NOT depend on 999 deletion; both can coexist
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Will the 20-iter sweep validate the aggressive variant or surface blockers?
- Are there cross-026 reorganizations more impactful than the 11-phase target?
- Does the iter 044 first-principles taxonomy hold under stress-testing in this packet?
<!-- /ANCHOR:questions -->

---
title: "Initial Phase: Skill Advisor semantic lane (Gemma local embeddings)"
description: "Initial phase for activating a real semantic/cosine lane in the skill advisor using the local EmbeddingGemma runtime shipped by the 014 setup-A line. Children promoted to siblings 014-023 on 2026-05-15."
trigger_phrases:
  - "skill advisor semantic lane"
  - "advisor cosine lane"
  - "advisor gemma embeddings"
  - "skill advisor optimization"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/002-semantic-routing-lane"
    last_updated_at: "2026-05-15T00:00:00Z"
    last_updated_by: "opencode-deepseek"
    recent_action: "Restructured: children promoted to siblings 014-023, slot converted to initial leaf phase"
    next_safe_action: "Resume at child 003-embedding-cache-cosine-wiring"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000515"
      session_id: "002-semantic-routing-lane"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Strategy decomposed into two initial children (now siblings 014-015)."
      - "Embedding plumbing decoupled from weight rebalance risk."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Initial Phase: Skill Advisor semantic lane (Gemma local embeddings)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Shipped |
| **Created** | 2026-05-13 |
| **Restructured** | 2026-05-15 (children promoted to 014-023) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 014 setup-A line shipped local EmbeddingGemma 300m at ~6ms per embed via llama-cpp + Metal. The skill advisor's five-lane scorer (`scorer/lane-registry.ts`) carried a dormant `semantic_shadow` lane at `weight: 0.00, live: false` that was NOT a real semantic lane — it was token-overlap with a 0.8 multiplier (see `scorer/lanes/semantic-shadow.ts`). Prompts that describe intent without naming the skill's keywords got no semantic recall signal.

### Purpose
Convert that lane into a real cosine-similarity lane and rebalance the five-lane weights so it actually contributes to advisor recommendations. The split into two initial children isolated the risk of a behavior-changing weight rebalance from the underlying embedding-cache plumbing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define the advisor semantic lane strategy.
- Decompose work into child phases for implementation.
- Restructure phase layout as the work matured (children promoted to siblings 014-023).

### Out of Scope
- Actual code implementation (shipped in siblings 014-023).
- Live behavior changes (handled by siblings after ablation sweeps).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Strategy document exists and is validated. | Strict spec validation passes. |
| REQ-002 | Children are structured and validated. | All children pass strict validation. |
| REQ-003 | Phase restructuring preserves all work-in-progress files. | WIP files moved intact with git mv. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict spec validation passes for this packet.
- **SC-002**: All 10 children pass strict validation.
- **SC-003**: No stale 013/0XX path references remain in the 008 subtree.
- **SC-004**: Cross-tree references updated in external files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 014-local-embeddings-setup-a (017, 018) | Provider foundation for embedding work | Already shipped and verified |
| Risk | Phase restructuring breaks path references | Navigation and validation failures | sed + graph metadata refresh |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. All implementation decisions were resolved in sibling children.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. FOLLOW-ON PHASES

All phases complete. Structural layout:
- [003-embedding-cache-cosine-wiring](003-embedding-cache-cosine-wiring/) — embedding cache + cosine wiring
- [004-ablation-sweep-and-weight-promotion](004-ablation-sweep-and-weight-promotion/) — ablation sweep + lane promotion
- [005-routing-weight-sweep-harness](005-routing-weight-sweep-harness/) — weight sweep harness
- [006-seeded-corpus-evaluation-sweep](006-seeded-corpus-evaluation-sweep/) — corpus seeded sweep
- [003-skill-metadata-embedding-quality-audit](003-skill-metadata-embedding-quality-audit/) — metadata quality audit
- [004-metadata-fixes-and-seeded-sweep-rerun](004-metadata-fixes-and-seeded-sweep-rerun/) — metadata fixes + resweep
- [007-hard-intent-corpus-resweep](007-hard-intent-corpus-resweep/) — harder intent corpus resweep
- [005-intent-signals-and-skill-relationships](005-intent-signals-and-skill-relationships/) — intent signals + relationships
- [006-system-skill-advisor-package-extraction](006-system-skill-advisor-package-extraction/) — skill advisor extraction (phase parent)
- [008-routing-confidence-calibration](008-routing-confidence-calibration/) — advisor routing calibration
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

None. This is a strategy packet with no runtime code paths.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Aspect | Rating | Note |
|--------|--------|------|
| **LOC estimate** | 0 | Strategy only; all code in siblings |
| **Surface area** | None | No code surface |
| **Risk** | Low | Documents only |
| **Reversibility** | Full | git revert single commit |
<!-- /ANCHOR:complexity -->

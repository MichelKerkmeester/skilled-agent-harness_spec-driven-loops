---
title: "Decision Record: 011 Coco Memory Context Extras"
description: "Preserved audit decisions from the original Phase 008 packet, retained with child 001 as packet-local historical context."
trigger_phrases:
  - "027 phase 011 ADRs"
  - "coco memory context extras decisions"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: 011 Coco Memory Context Extras

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use Level 3 Governance For The Original Combined Packet

**Status:** Accepted

The original packet treated Coco exemplars and memory context curation as a governed pair because both add presentation output to retrieval surfaces, both carry nondeterministic or history-sensitive behavior, and both require Phase 004 lift evidence before active rollout. The phase-parent split keeps that governance but moves execution detail into Level 2 children.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Extend Existing Feedback Capture Before Adding A New Writer

**Status:** Accepted

The preferred Coco exemplar capture path is to extend `ccc_feedback` with optional identity fields first. A narrow `ccc_example_positive` writer remains a follow-on option if the extended schema becomes noisy or hard to maintain.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Keep Coco Exemplars Separate From Ranking

**Status:** Accepted

Coco exemplars must be returned as a separate response group. They represent prior helpful examples, not rank evidence for the current query, so they must never blend into `QueryResult` scoring or ordering.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Place Memory Curator After Deterministic Retrieval

**Status:** Accepted

The memory curator runs after deterministic retrieval and returns a packaging plan as `data.curatedContext`. It does not mutate Stage 4 ordering, scores, or canonical retrieval output.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Split Retrieval And Presentation Budgets

**Status:** Accepted

Memory curation needs a broader candidate set than callers usually display. The design uses `retrievalCandidateLimit`, `presentationLimit`, and computed `curationTokenBudget` so overfetch can support packaging without changing visible result caps.
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Validate Curator JSON Strictly

**Status:** Accepted

Curator output must be strict JSON with selected IDs drawn from the candidate set. Invented IDs, invented paths, malformed JSON, and cache entries that fail validation all fall back to deterministic results.
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Default-Off And Phase 004 Lift Gate

**Status:** Accepted

Both tracks remain default-off and shadow-first. Active mode requires Phase 004 eval lift over deterministic baseline for task success, cited-source correctness, missed-critical-context rate, latency, and nondeterministic variance.
<!-- /ANCHOR:adr-007 -->

---
title: "Decision Record: Fleet Route-Gold Reconciliation (full-fix, not gold-only)"
description: "Records why the route-gold reconciliation was ratified as a hub-by-hub full-fix of real router-precision defects rather than a gold-only pass, and why precision was tuned via weights and vocabulary classes rather than the inert ambiguity-delta config field."
trigger_phrases:
  - "route-gold full-fix decision"
  - "catch-all removal decision"
  - "ambiguity delta inert decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/001-3-tier-consistency-standard"
    last_updated_at: "2026-07-17T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Route-gold gate full-fix: 7/7 hubs PASS (91 scenarios), pushed to v4"
    next_safe_action: "REQ-001 harness de-skill-specific + REQ-002 convergence, then REQ-006 fleet verification"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 45
    open_questions:
      - "REQ-006 fleet verification (mutation/blind-holdout/live-mode) not yet run"
    answered_questions:
      - "Route-gold reconciliation ratified as FULL-FIX hub-by-hub, done for all 7 hubs"
---
# Decision Record: Fleet Route-Gold Reconciliation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Reconcile route-gold by full-fix, not gold-only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-17 |
| **Deciders** | Operator (ratifier), claude-code (executor + independent verifier) |

---

<!-- ANCHOR:adr-001-context -->
### Context

At session start, 6 of 7 parent hubs were BLOCKED-BY-ROUTE-GOLD: the deterministic gate that asserts each hub's router selects exactly the intended mode set and surfaces exactly the intended leaf set was failing. Three independent model reviews (GPT-5.6-SOL, GPT-5.6-LUNA, Fable-5) warned that a green `typedPairRecall=1.0` might be circular, meaning the gold was matching whatever the router emitted rather than what the scenario actually asked for. The decision was whether to clear the blocks cheaply by refreshing gold to the router's current output, or to diagnose and fix the underlying router-precision defects.

### Constraints

- The shared benchmark scorer (`router-replay.cjs` and friends) was frozen for this slice; no shared-machinery edits.
- Each hub had to stay scope-locked and land as its own revertible commit; no git history rewriting.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: reconcile every blocked hub with a hub-by-hub FULL-FIX of the real router defect, never a gold-only refresh.

**How it works**: for each hub we derived the correct answer from the scenario's own prose, fixed the router to emit it, and only then set the gold to that answer. Diagnosis split the blocks into three classes: stale gold where the router was already correct, genuine router-precision defects (a specialized mode carrying a generic catch-all vocabulary class), and frontmatter-versus-prose mismatches where the authored intent contradicted the scenario prose.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Full-fix hub-by-hub (Chosen)** | Fixes real defects; green means something | Slower; needs per-hub diagnosis and re-verify | 9/10 |
| Gold-only refresh | Fast; clears blocks immediately | Bends gold to a broken router; measures nothing; entrenches the circularity the 3-model review flagged | 3/10 |

**Why this one**: a gold-only pass cannot honestly clear a hub whose router genuinely mis-selects. Bending gold to a broken router measures nothing, and it would have baked the flagged oracle circularity into the committed baseline.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The route-gold gate went from 6/7 BLOCKED to 7/7 PASS across 91 scenarios, and it caught genuine router bugs (an sk-doc request selecting eight modes; sk-prompt's specialized `prompt-models` outranking the default on the bare word "prompt").
- The dominant over-emission root cause was removed fleet-wide by dropping the generic catch-all vocabulary class from specialized modes.

**What it costs**:
- Live routing quality remains inferred, not measured. Mitigation: REQ-006 stages mutation, blind-holdout, and live-mode verification with precision before the packet claims done.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Keyword enrichment absorbs a holdout phrase into vocab | M | Keep additions semantically general; re-check per hub |
| A fix regresses a sibling hub | H | Re-run the whole route-gold gate after every hub; revert the hub-local commit |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 6/7 hubs were blocking; the gate was red |
| 2 | **Beyond Local Maxima?** | PASS | Gold-only alternative explicitly weighed and rejected |
| 3 | **Sufficient?** | PASS | Deterministic gate green with real teeth; simplest honest fix |
| 4 | **Fits Goal?** | PASS | Route-gold is the coherence layer the 3-tier standard depends on |
| 5 | **Open Horizons?** | PASS | REQ-006 verification stays open for live measurement |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Specialized modes across sk-prompt, cli-external-orchestration, system-deep-loop, and sk-doc lost their generic catch-all vocabulary class.
- Weights were separated where a specific signal must beat a generic default beyond the hardcoded `AMBIGUITY_DELTA=1`; the JSON `ambiguityDelta` field is inert and was never edited.
- Stale `expected_resources` / `expected_leaf_resources` and contradictory frontmatter intent were reconciled to the scenario prose.

**How to roll back**: each hub's fix is a single commit on `skilled/v4.0.0.0`; revert the offending hub commit to restore its prior router and gold. No shared machinery was touched, so a revert is hub-local.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

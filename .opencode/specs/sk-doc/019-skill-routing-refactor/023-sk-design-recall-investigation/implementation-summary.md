---
title: "Implementation Summary: Close the sk-design routed-intra recall gap"
description: "Two shared-router intents took sk-design from CONDITIONAL 92 to PASS 95; LUNA investigation genuine, its SR-004 call corrected."
trigger_phrases:
  - "sk-design recall investigation"
  - "routed-intra recall"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/023-sk-design-recall-investigation"
    last_updated_at: "2026-07-29T03:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Wired two recall intents; sk-design PASS 95; committed 8cb2e8dfdc"
    next_safe_action: "None; all four hubs PASS. PB-007 D3 precision is a separate future item"
    blockers: []
    completion_pct: 100
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-sk-design-recall-investigation |
| **Completed** | 2026-07-29 |
| **Level** | 2 |
| **Commits** | 8cb2e8dfdc |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two phrase-scoped intents in `sk-design/shared/references/smart-routing.md`: `PREFLIGHT_OWNERSHIP`
(SR-004's ownership vocabulary -> the interface preflight card) and `VARIATION_DIVERSITY` (PB-007's
multi-direction phrasing -> variation-diversity and brief-to-dials). Both were derived from a genuine
LUNA-xhigh cli-pi investigation, verified against the files and router-replay, with SR-004's proposed
gold-trim refuted and corrected to a wire.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

LUNA investigated read-only through cli-pi (after a provider-qualification fix: bare
`--model gpt-5.6-luna` resolved to an unauthenticated provider and pi exited 0 anyway;
`openai-codex/gpt-5.6-luna --thinking xhigh` was the working route). The orchestrator verified both
findings, resolved the SR-004 disagreement with the operator, applied the edits, and gated on an exact
per-scenario diff before committing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Rationale |
|----------|-----------|
| SR-004: wire the vocabulary, not trim the gold | The scenario is built to assert the preflight card is the pass/fail owner; trimming would gut the test. Operator confirmed the correction over LUNA's proposal |
| PB-007 intent maps to both expected files | The scoring model (multiples of the weight, delta 1) makes co-selection require an exact tie; mapping both files makes the fix robust to a tie miscount |
| Narrow phrase-scoped keywords | Avoids over-routing into other interface scenarios |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## VERIFICATION

Exactly SR-004 (recall 0.4 -> 1.0) and PB-007 (0.7 -> 1.0) moved; D1intra 98 -> 100; sk-design
CONDITIONAL 92 -> PASS 95. sk-prompt 100, sk-code 96, sk-doc 98 unchanged; broken-link set constant at
84. With this, all four hubs PASS for the first time.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

PB-007's D3 over-routing precision stays low because INTERFACE loads its full resource set for a narrow
request -- a pre-existing precision dimension, not a recall concern, out of this packet's scope.
<!-- /ANCHOR:limitations -->

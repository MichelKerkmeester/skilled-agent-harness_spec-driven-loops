---
title: Deep Research Strategy - Sibling-Subsystem Revisit + Follow-ups (028 x 027)
description: Session tracking for reconciling 028's Advisor + Code-Graph findings against 027, mining aionforge-procedural, and re-verifying the GO list.
trigger_phrases:
  - "deep research strategy"
  - "sibling revisit strategy"
  - "advisor codegraph procedural readiness"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW
### Purpose
Persistent brain for the 006 sibling-revisit + follow-up sprint (extends 005 toward packet total 200).

---

## 2. TOPIC
Reconcile 028's Skill-Advisor (003) + Code-Graph (002) candidates against 027's shipped advisor + code-graph code; mine the skipped aionforge-procedural crate (outcome-weighted skill ranking + failure-mode recall) for the advisor; second-pass adversarially re-verify the top GO candidates. Live 027 code + the aionforge-procedural crate under `external/`. Read-only.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] PA: Advisor x 027 — do 028 C4 (bounded Beta lane auto-tune), C5 (lane elision / 13% skew), C3 (shared RRF import), C1 (split-conflict re-rank), QCR (query-class per-lane weights) supersede/extend/already-cover 027's shipped advisor feedback-calibration + reconnect?
- [ ] PB: Code-Graph x 027 — do 028 Q1-C1 (code_edges bi-temporal), Q6-C1 (generation watermark), Q4-C1 (rank-time trust), CG-incremental-edge-staleness, Q3-C1 (PPR) / Q2-C1 (transient/fatal parser skip) reconcile against 027's code-graph tombstone-audit + adoptions?
- [ ] PC: aionforge-procedural — outcome-weighted skill ranking (Beta-posterior reliability) + per-skill failure-mode recall mapped to system-skill-advisor (net-new vs 027/028 advisor)?
- [ ] PD: GO re-verify — do the top GO candidates (C8 threat-model, bi-temporal C3-B migration, C4-A deferred-wiring, two-primitive coupling, C5-B, the build sequence) survive a second independent skeptic?
- [ ] PE: completeness + honest close at 200.
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any candidate; modifying 027 or external code.

## 5. STOP CONDITIONS
- ~40-minute time box (hard stop wherever reached), OR packet total 200, OR genuine saturation.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[None yet]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Round P: Advisor x 027 (PA1-5) + Code-Graph x 027 (PB1-5) mapping wave.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT
028 Advisor candidates: C3 (import shared RRF), C5 (runtime-empty lane elision, "~13% skew" UNSOURCED), C4 (bounded Beta lane auto-tune; 028 found the estimator is RAW-FREQUENCY not Beta), C1 (split-conflict re-rank), QCR. 028 Code-Graph: Q1-C1 (valid_at/invalid_at on code_edges), Q6-C1 (generation watermark), Q4-C1 (rank-time trust = RRF-additive), Q3-C1 (PPR), Q2-C1 (transient/fatal parser skip), CG-incremental-edge-staleness (structural-indexer mtime-skip). 027: 003-advisor-and-codegraph (causal-traversal BFS, XCE feature adoption, advisor reconnect resilience) + 005-advisor-feedback-calibration + code-graph tombstone-audit.

## 13. RESEARCH BOUNDARIES
- Max iterations: 60 (sprint targets ~50 to reach packet 200); convergence 0.03; per-iter 12 tool calls / 10 min; reduce once at end (time box); machine-owned sections 3,6,7-11; generation 1; started 2026-06-17T05:19:00Z.

---
title: "Implementation Summary"
description: "Router-declared vocabulary now reaches the stage the advisor scores. Real routing failures fell from 173 to 20, and the gate that had certified the broken state now fails closed and judges by rank."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/024-routing-perfection-research"
    last_updated_at: "2026-09-07T09:40:00Z"
    last_updated_by: "implementation"
    recent_action: "Landed the reach-gate repair, the sk-design invariants and the stage-one generator"
    next_safe_action: "Decide the gated scorer tranche: lexical evidence harvesting and cross-hub arbitration"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs"
      - ".opencode/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "024-routing-perfection-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should the lexical lane harvest evidence from the same candidate set it scores?"
      - "What arbitrates the review verb across hubs?"
    answered_questions:
      - "Is intent_signals membership causal or a selection artifact? Causal, shown with a negative control."
      - "Does carrying stage-two vocabulary up flood stage one? No: 438 of 439 phrases are uniquely owned."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

Routing runs in two stages that were never connected, and the disconnection was invisible because the gate measuring it could not see most of the failure. Carrying each router's declared vocabulary into the stage the advisor actually reads took real routing failures from **173 to 20**, and the 20 that remain are a different problem than the 173 were.

---

<!-- ANCHOR:what-built -->
## 1. WHAT SHIPPED

| Commit | Change |
|--------|--------|
| `a5b553121b` | The reach gate fails closed and judges by rank |
| `0ed06e1d1d` | `sk-design`'s six hub invariants closed |
| `3975edd394` | Router-declared vocabulary carried into stage one |

**The gate first, deliberately.** `ci-router-vocabulary-reach.cjs` collapsed every probe failure into a result that classified as no-reach, which never failed the run, so a missing binary or a cold daemon printed a clean pass over an advisor that never answered. It also asked whether the declaring hub appeared above the confidence bar rather than whether it ranked first, hiding 18 phrases that were losing to another hub. Both had to be true before the generator ran, because otherwise the generator would have improved the metric while routing stayed wrong.

**`sk-design` next.** It was the only hub of six failing `parent-skill-check`, and the root cause of the important failure was a type error rather than a missing field: `resourceContractVersion` was the string `"1.0.0"` where every peer carries the number `1`, and a numeric check reads a string as absent. That single value silently disabled the manifest byte-drift, target-collision and reachability checks, all three of which printed `INFO: skipped`. The hub's mode-to-leaf resolution was therefore unverified, which is why nothing generated could be written to it first.

**The generator last.** It merges and never replaces, because the stage-one list is authored and `sk-design` alone carries 159 curated entries a regeneration would have discarded. It reuses the reach check's own extractor, so the gate and the generator cannot disagree about what a router declared.

---

<!-- /ANCHOR:what-built -->

<!-- ANCHOR:verification -->
## 2. VALIDATION EVIDENCE

Measured across all 439 declared phrases, before at advisor generation 698 and after at 704:

| | before | after |
|---|---:|---:|
| wrong-hub | 19 | 0 |
| outranked | 18 | 18 |
| no-reach | 136 | 2 |
| **real failures** | **173** | **20** |

**Causality, not correlation.** Before any hub metadata was written, one phrase was added to one hub, the advisor rebuilt, probed, and reverted. `corner radius` moved from nothing to `sk-design` at 0.8286 on the `explicit_author` lane and back to nothing on revert, while `font size` — an untouched control on the same router line — stayed dead throughout, and `type scale`, always a member, held at 0.8828. One variable, the predicted effect, a control that did not move, and the effect vanishing on revert.

**The gate watched failing.** Pointed at an absent advisor the check reported `probe-error=77`, `RESULT: FAILED`, exit 1, where it had previously reported `declared=77 wrong-hub=0 no-reach=0`, `RESULT: PASSED`, exit 0. A sampled run under CI exits 2; by-hand sampling still works.

**No collateral.** All six hubs pass `parent-skill-check`. Root metadata 13/13, derived freshness 13/13, leaf-manifest freshness 13/13. The generator is idempotent: a second `--check` after the write reports zero missing.

---

<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 3. WHAT REMAINS, AND WHY IT IS DIFFERENT

The 20 residual failures are no longer reach failures. Every declaring hub now surfaces; 18 of them lose on score to another hub that surfaces higher.

- **Ten are the review verb.** `sk-code` takes `design review`, `review this screen`, `review the docs`, `review bar`, `pass review`, `review request`, `iterative review` and three more, whatever artifact is being reviewed.
- **Six are other ownership questions**, including `design tokens`, the single phrase in the fleet declared by two hubs.
- **Two are no-reach**: `dom inspect`, which the research already isolated as a separate cause, and `show the full`, a sentence fragment.

None is fixable by vocabulary. A controlled test confirmed the shape: adding `decision branch` to its declaring hub moved that hub from absent to rank two behind an unchanged incumbent. Arbitration is a scorer change, and it is gated rather than attempted here.

---

<!-- /ANCHOR:limitations -->

<!-- ANCHOR:follow-up -->
## 4. CONTINUATION NOTES

Two decisions are open and both are scorer changes with fleet-wide blast radius. The lexical lane computes its score over `intentSignals` and `keywords` but harvests evidence only from `{id, name, description, domains}`, so a candidate can reach confidence 0.82 carrying no evidence, take the no-evidence uncertainty default, and be deleted before it is offered. Fixing that is a correctness change and must not become a threshold move. Cross-hub arbitration is the second, and the residue above is the list it would work against.

One measurement caveat worth carrying forward: the full scan costs roughly 37 minutes because every probe spawns a fresh node process, so a before-and-after pair is a 75-minute commitment rather than a quick check.


<!-- /ANCHOR:follow-up -->
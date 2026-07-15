---
title: "Implementation Summary: Advisor-Scorer Saturation-Class Root Fix (WS1–WS6) + Advisor Projection Vocab"
description: "Pre-implementation summary for the shared advisor-scorer saturation-class root fix and Layer 1b projection vocabulary. Not yet implemented; this packet is the forward-looking spec, GATED on the live advisor-TS lane standing down and a fresh 193-row re-baseline."
trigger_phrases:
  - "advisor scorer root fix summary"
  - "post-cap demotion summary"
  - "pre-implementation advisor scorer"
importance_tier: "high"
contextType: "implementation"
status: "Closed"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/016-skill-advisor-tuning/001-scorer-saturation-root-fix"
    last_updated_at: "2026-07-07T17:37:00.000Z"
    last_updated_by: "opus-4.8"
    recent_action: "Pre-implementation spec authored"
    next_safe_action: "Await advisor-lane standdown, then execute WS3→WS1→re-run→WS2/4/5/6"
    blockers:
      - "GATED on the live advisor-TS lane (lib/scorer/*.ts, the 009 dispatch-hardening + 40-iteration alignment audit) standing down"
      - "GATED on a fresh 193-row re-baseline captured after Layer 1b metadata lands"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - "research/scorer-fix-recommendation.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-skill-advisor-001-preimpl"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - question: "WS1 Design A vs Design B?"
        answer: "Start with Design A (post-cap demotion); escalate to Design B (first-class disambiguation channel) only if the scorer must rank by negative evidence, pending the corpus re-run evidence."
    answered_questions:
      - question: "Where does this advisor-scorer work live?"
        answer: "Under .claude/specs/system-skill-advisor as Layer 2 + Layer 1b of the sk-code routing + shared-advisor-scorer program; Layer 1 shipped separately as packet 024."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-scorer-saturation-root-fix |
| **Status** | Closed — WS1 falsified / superseded |
| **Level** | 2 |
| **Actual Effort** | Not yet implemented — this packet is the pre-implementation spec |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

WS1's post-cap demotion (Design A) was implemented, measured, and reverted: on the 193-row corpus it scored a net -2, fixing 0 of the 6 target regressions and breaking 2. It was superseded by audit-intent phrase calibration — two explicit-lane phrase boosts that landed instead under commit e2711fb580 — which moved the 193-row TS-vs-gold agreement from 145 to 147 on the filesystem projection and from 144 to 146 on SQLite, lifted parity preservation from 99 to 101, and resolved-and-dropped regressions rr-iter3-100 and rr-iter3-104. The four remaining accepted divergences are fusion-level and labeling-edge losses, not absorbed-penalty saturation, so the saturation thesis that motivated WS1 was empirically falsified. The packet's original design — the shared advisor-scorer saturation-class root fix (WS1–WS6) plus the Layer 1b advisor projection vocabulary, sequenced by leverage and gated on the live advisor-TS lane standing down — is retained below as the historical proposal, now superseded:

- **WS1 [ROOT]**: a post-cap demotion channel so disambiguation penalties survive clamp headroom and fusion instead of being erased by saturating positive support.
- **WS2**: a metadata-driven `executor-delegation.ts` resolver with a post-fusion routing override, replacing the inline `-3.0` OpenCode regex.
- **WS3**: an honest, green TS↔Python parity gate (five named regressions ledgered/preserved, suite renamed 197 to 193, force-local in CI, SQLite/source-evaluated).
- **WS4**: a graph-causal visited-guard order fix (score-first/traversal-second; `bestPositiveStrengthByTarget`).
- **WS5**: eval hardening (empirical ambiguity slice, schema-enforced buckets, ratcheted baseline, frozen independent holdout).
- **WS6**: a semantic_shadow prove-or-freeze ablation with a pinned provider.
- **Layer 1b**: single-pass audit/review/release-readiness projection vocabulary for sk-code, and the removal of two bare terms from deep-loop-workflows.

### Files Changed

No files changed yet. The intended change set is documented in `spec.md` (Files to Change During Execution). It spans `lib/scorer/lanes/explicit.ts`, `lib/scorer/fusion.ts`, a new `lib/scorer/executor-delegation.ts`, `lib/scorer/lanes/graph-causal.ts`, the eval baseline, and the sk-code + deep-loop-workflows advisor metadata.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The intended delivery order is leverage-first: unblock and re-baseline, then WS3 ledger to make the parity gate honest, then WS1's post-cap demotion, then a full 193-row re-run to count how many regressions self-resolve before any rules are hand-written, then WS2's executor resolver on the WS1 machinery, and finally WS4/WS5/WS6 with the eval harness (WS5) gating the semantic ablation (WS6). Layer 1b projection vocabulary lands in the same window so the re-baseline reflects the corrected routing. This document is completed with real evidence once the gate clears and the work executes.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Full 6-workstream scorer fix (operator-locked) | The `-3.0`/`+3.0` offsets are band-aids on a pre-clamp penalty class; only a post-cap channel removes the class |
| Fix the shared D3 proxy (operator-locked, delivered in Layer 1) | Empty positive-resource gold must be not-applicable, not zero; shipped in packet 024 |
| Both-hub vocab (operator-locked) | sk-code must own single-pass audit/review while deep-loop-workflows keeps loop/convergence identity |
| House advisor work under `.claude/specs/system-skill-advisor` | Keeps the shared-scorer program out of the 028 tree and its live lane |
| WS1 Design A first, Design B only on evidence | Post-cap demotion is minimal risk; a first-class disambiguation channel is justified only if the scorer must rank by negative evidence |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:blockers -->
## Blockers

GATED. This packet cannot start until two conditions clear: (1) the live advisor-TS lane (`lib/scorer/*.ts` — the 009 dispatch-hardening plus the 40-iteration alignment audit) stands down, because concurrent edits to the same scorer files collide; and (2) a fresh 193-row baseline is captured after the Layer 1b metadata lands, because two of the five named parity regressions misroute to deep-loop-workflows and pre-Layer-1b numbers are not comparable. Pre-authorized on unblock: self-capture the baseline (run `rebuild-native-modules.sh`, PID-scoped, if the full corpus scan SIGBUSes on the native ABI), own this packet, and bundle Layer 1b in the same window.

<!-- /ANCHOR:blockers -->
---

<!-- ANCHOR:verification -->
## Verification

Pending. No verification has run because implementation has not started. The intended verification set is:

| Test Type | Status | Coverage | Evidence |
|-----------|--------|----------|----------|
| Fresh 193-row baseline | Pending | Whole scorer | tsCorrect, pythonCorrect, regressions, holdout after Layer 1b |
| Verbose-saturation fixtures | Pending | WS1 demotion survival | topSkill + demoted candidate contribution |
| Executor-delegation parity | Pending | WS2 resolver | Shared TS + Python fixture |
| Graph-causal repro | Pending | WS4 order bug | Seeded conflicts_with vs enhances repro |
| Eval harness | Pending | WS5 gates | Ambiguity slice, buckets, ratcheted baseline, holdout |
| Semantic ablation | Pending | WS6 | Paired 5-lane vs disabled, pinned providerModelId, fail-on-skip |
| Robustness guard | Pending | All weight changes | per-skill = 0, memory-save + read-only-review = 0, no near-tie/UNKNOWN rise |

### Test Coverage Summary

| Area | Result |
|------|--------|
| Demotion survival | Pending WS1 |
| Executor routing | Pending WS2 |
| Parity | Pending WS3 re-baseline |
| Correctness + hardening | Pending WS4/WS5/WS6 |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-R01 | Parity deterministic + force-local, evaluated against SQLite/source metadata | Not yet verified | Pending |
| NFR-R02 | No weight promotes unless the robustness guard is clean | Not yet verified | Pending |
| NFR-M01 | WS2 alias table built from metadata, never hardcoded | Not yet verified | Pending |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The whole packet is GATED and cannot begin until the advisor-TS lane stands down; the start date is not under this packet's control.
2. Scorer numbers are not comparable until a fresh 193-row baseline is captured after Layer 1b lands, because two of the five parity regressions misroute to deep-loop-workflows under the current projection.
3. The WS6 semantic_shadow keep-vs-drop verdict is genuinely unknown; the ablation is the experiment, and its result may change the recommended weight.
4. The regression-rule burden after WS1 is unknown until the post-WS1 re-run shows how many of the five regressions self-resolve.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

Governing deviation: the packet's central thesis was falsified. WS1's saturation fix (Design A post-cap demotion) was implemented and measured, then reverted — it scored a net -2 on the 193-row corpus, fixed 0 of 6 target regressions, and broke 2. The saturation thesis was re-scoped accordingly: the parity win the packet sought landed instead through audit-intent phrase calibration (two explicit-lane phrase boosts) under commit e2711fb580, and the surviving four divergences were accepted as fusion-level and labeling-edge losses rather than absorbed-penalty saturation. Design B (the first-class disambiguation channel) was not pursued: with the thesis falsified there was no ranking-by-negative-evidence case to justify it.

<!-- /ANCHOR:deviations -->

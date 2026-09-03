---
title: "Handover: 036/006/007 improvement-promotion-authority (95% — go-live gated behind acceptance review)"
trigger_phrases: []
---
# Handover: 036/006/007 improvement-promotion-authority (95% — go-live gated behind acceptance review)

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v2.2 -->

**Status:** All 13 promotion-authority findings landed **additive-dark** (`0d1827eef50`, `f6cdf604a25`, `a28a39354b7`; reconciled `ab6aae0a714`). An independent adversarial pass found and fixed a **Medium candidate-rebind TOCTOU** gap — the approval receipt binds the approved candidate bytes but they were not re-hashed at the copy/accept consumption boundary; fixed with a shared `assertCandidateMatchesApproval` guard that fails closed (`c897dcf294`). The code is live but **dark** (no behavior change). One deferred end remains, and it is the go-live gate.

**Handover Time:** 2026-08-18 · **From:** orchestrator · completion 95%

---

## 1. The deferred end

### CHK-018 [P0] — Additive-dark acceptance review before promotion enforcement goes live
- **State:** Open — GATED (`[Deferred: gated — go-live blocked behind acceptance review]`).
- **What:** before the promotion-authority enforcement is *turned on*, an acceptance review must confirm the hardening is a genuine no-op in dark mode and correctly fails closed when enforcement is enabled.
- **Why deferred:** external sign-off; the review could not be run this session. Turning enforcement live without it risks blocking legitimate promotions or leaving the TOCTOU window open.

## 2. Resume steps (to close CHK-018 and go live)
1. **Baselines first** (CHK-002/CHK-010): capture the two vitest project baselines before any change —
   `npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.*` (both projects).
2. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/007-improvement-promotion-authority --strict` → exit 0 (CHK-008).
3. **Acceptance review:** prove (a) in dark mode the guard is a no-op on a matching candidate, and (b) with enforcement on, a *swapped* candidate is rejected with `errorType: 'approved_candidate_changed'` (the negative test in `promote-candidate-approval-binding.vitest.ts` already asserts this) at every consumption site — single-phase copy, accept snapshot, and ship.
4. Get sign-off, then flip enforcement live. CHK-111 is already closed: receipts cost about 4.3 ms per promotion and whole-promotion wall clock did not regress against the pre-binding baseline (`scratch/chk-111-promotion-receipt-cost.md`).

## 3. Epic tie-in
This is one of the "turn the feature on" gates for the deep-loop-innovation epic. It is independent of the `009` live-authority cutover chain but shares the same discipline: ship dark → acceptance review → flip. Do not enable enforcement until CHK-018 passes.

## 4. Key files
`.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs` (guard `assertCandidateMatchesApproval`),
`.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/promote-candidate-approval-binding.vitest.ts` (negative test),
`.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs`.

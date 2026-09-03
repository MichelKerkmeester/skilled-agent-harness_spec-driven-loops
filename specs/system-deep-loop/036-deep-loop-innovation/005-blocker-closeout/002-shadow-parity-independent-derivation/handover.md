---
title: "Handover: 036/005/002 shadow-parity-independent-derivation (95% — external verification gate open)"
trigger_phrases: []
---
# Handover: 036/005/002 shadow-parity-independent-derivation (95% — external verification gate open)

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v2.2 -->

**Status:** Blocker 1 discharged — all six shadow-parity modes (council, agent-improvement, model-benchmark, skill-benchmark, deep-alignment, deep-review) were built and verified with real red-before / green-after divergence tests. REQ-005 full-surface fixtures landed in sibling `006-residual-finding-closeouts`. One deferred end remains: an **independent** adversarial verification pass. It cannot be self-certified, so it is an external sign-off gate.

**Handover Time:** 2026-08-18 · **From:** orchestrator · completion 95%

---

## 1. The deferred end

### T020 / CHK-005 [P1] — Independent adversarial verification of oracle independence
- **State:** `[ ]` deferred (tasks.md T020; checklist CHK-005; sign-off table checklist.md ~L242 "Approved — Deferred").
- **What:** an adversarial pass, by an actor **other than the builder**, targeted at *oracle independence* — proving each mode's shadow-parity oracle is genuinely derived independently of the projection it checks (not a near-copy that cannot fail).
- **Why deferred:** the builder cannot be the independent verifier. External sign-off pending; the builder-authored red-before/green-after evidence is present but does not satisfy the independence requirement.

## 2. Resume steps (to close T020/CHK-005)
1. Dispatch an **independent** adversarial verifier — a different model/actor than the builder (e.g. a fresh reviewer model, not the one that authored the harness adapters).
2. Scope: audit oracle independence across all six modes. For each, confirm the oracle reconstructs canonical state from the event log independently, and that injecting a projection-semantic divergence makes the oracle FAIL (not pass).
3. Record the verdict in **CHK-005** and the sign-off table (checklist.md), replacing "Approved — Deferred" with the approver + evidence.
4. Set `completion_pct: 100` and reconcile status once approved.

## 3. Key surfaces
`.opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-shadow-parity/harness-adapter.ts`,
`.opencode/skills/system-deep-loop/runtime/lib/agent-improvement-shadow-parity/harness-adapter.ts`, and the sibling per-mode adapters. The independence claim is what the verifier must attack.

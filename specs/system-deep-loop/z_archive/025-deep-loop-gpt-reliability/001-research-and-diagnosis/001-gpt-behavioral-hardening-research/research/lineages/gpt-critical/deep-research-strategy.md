# Deep Research Strategy: gpt-critical

## Research Topic

Critical re-review of GPT behavioral hardening research (packet 031) -- operator-confirmed symptoms, correct for GPT-self-assessment bias, find concrete fixes -- see `research-prompt.md` section 9.

## Known Context

- Required inputs read before iteration 1: consolidated `research/research.md`, prior `glm-max` and `gpt-fast-high` lineage syntheses, `sonnet-critical` synthesis, and partial `glm-critical` iteration 001.
- `resource-map.md not present; skipping coverage gate`.
- Operator-confirmed symptoms are treated as ground truth: GPT is slow as `@orchestrate`, invokes the wrong sub-agent, gets stuck on predefined flows, and overthinks/needs literal instructions.

## Key Questions

1. Where did the prior GPT lineage soften or defer conclusions because it was assessing GPT failures?
2. Which concrete mechanism explains stuck predefined flows now that the symptom is confirmed?
3. Is ai-council route-proof drift a cosmetic mismatch, a false-fail, or a false-pass?
4. What exact orchestrate hardening avoids NDP violations while preserving the deterministic `deep.md` pattern?
5. Which plugin hook can enforce route contracts, and what can it not enforce?
6. How should the benchmark change after operator-confirmed symptoms?
7. Should FIX-5 unpark now, later, or conditionally under a sharper criterion?
8. What concrete implementation deliverables should the next phase carry?
9. What claims in this GPT-critical lineage need downgrading under the same self-bias audit?

## Answered Questions

All 9 questions are answered in `research.md` with file-line citations and residual risks.

## What Worked

- Re-reading source citations instead of relying on prior summaries exposed the Phase 0 Mode-D failure and ai-council false-pass risk.
- Treating operator symptoms as confirmed separated mechanism diagnosis from proof-of-existence arguments.
- Applying NDP literally prevented an unsafe reading of "orchestrate dispatches @deep and STOP".

## What Failed

- The prior GPT lineage's "not yet route-proof" framing was technically accurate but decision-misaligned after operator confirmation.
- Prior "ai-council naming drift" language under-described the bug; it is a registry/YAML/runtime route-proof contradiction.

## Exhausted Approaches

- Re-litigating whether GPT symptoms exist.
- Treating more smoke evidence as a prerequisite for acknowledging current behavioral failures.
- Treating plugin injection as hard custom-agent identity.

## Ruled-Out Directions

- Immediate ai-council subagent-only conversion.
- Literal Task-dispatch from `@orchestrate` to primary `@deep` as a depth-1 worker.
- Benchmarking ai-council before route-proof canonicalization.
- Using Phase 0 self-assessment gates as a GPT-safe command precondition.

## Next Focus

Synthesis complete. Recommended next implementation focus: Phase 008 should first replace Phase 0 self-assessment gates and canonicalize ai-council route-proof fields, then apply NDP-safe orchestrate registry reuse, then add plugin/benchmark layers.

## Non-Goals

- Do not implement code in this lineage.
- Do not write outside the lineage artifact directory.
- Do not treat route-proof artifacts as the gate for whether operator-confirmed symptoms are real.

## Stop Conditions

- Stop only after 10 iterations because `stopPolicy=max-iterations`.
- Early convergence telemetry is ignored except to broaden angles.

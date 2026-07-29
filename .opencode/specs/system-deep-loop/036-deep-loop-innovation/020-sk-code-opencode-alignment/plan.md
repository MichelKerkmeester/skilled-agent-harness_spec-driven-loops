<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: sk-code / code-opencode Alignment for the system-deep-loop Runtime

<!-- ANCHOR:summary -->
## 1. SUMMARY
Audit the system-deep-loop runtime against the sk-code code-opencode surface conventions, enumerate concrete divergences,
and align them while preserving behavior. Planned and deferred — not executed during the per-mode migration landing.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- Divergences from the code-opencode standard are enumerated with source-level citations, not assumed.
- Each divergence is aligned or recorded as an accepted, documented exception.
- Behavior is preserved: whole-runtime vitest and tsc are green before and after, compared as a delta.
- `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
The runtime under `.opencode/skills/system-deep-loop/runtime` was authored across many independent fan-out sessions and
never run through the sk-code code-opencode alignment pass. The sk-code smart router resolves the code-opencode surface,
whose documented patterns, structure, and verification wiring are the target standard for this alignment.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Run the sk-code code-opencode surface audit over the runtime; produce an evidence-backed divergence list.
2. Align divergences in behavior-preserving units, re-verifying vitest + tsc after each.
3. Record accepted exceptions; final whole-runtime gate; strict-validate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Behavior-preserving refactor, so testing is a strict no-regression discipline: capture the baseline vitest + tsc, and
after each aligned unit re-run and compare as a delta — the tests passing today must pass unchanged.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- sk-code smart router and its code-opencode surface (the alignment standard and verification).
- Phase 019 (code READMEs) — ideally a module gets its README and its alignment pass together.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Alignment is behavior-preserving and lands in small units; rollback is reverting the specific aligned unit. The green test
suite is the tripwire — any behavior delta blocks the unit.
<!-- /ANCHOR:rollback -->

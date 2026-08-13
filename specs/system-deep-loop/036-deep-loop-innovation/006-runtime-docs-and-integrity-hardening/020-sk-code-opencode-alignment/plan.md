---
title: "Implementation Plan: sk-code / code-opencode Alignment"
description: "Completed plan for the behavior-preserving system-deep-loop runtime alignment pass."
trigger_phrases:
  - "sk-code alignment plan"
  - "code-opencode runtime alignment"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/020-sk-code-opencode-alignment"
    last_updated_at: "2026-08-07T00:20:36Z"
    last_updated_by: "codex"
    recent_action: "Completed the audit, header-only alignment, and serial verification matrix"
    next_safe_action: "No additional runtime changes; orchestrator verification and landing remain"
    blockers: []
    completion_pct: 100
    open_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: sk-code / code-opencode Alignment for the system-deep-loop Runtime

<!-- ANCHOR:summary -->
## 1. SUMMARY
Audit the system-deep-loop runtime against the sk-code code-opencode surface conventions, enumerate concrete divergences,
and align them while preserving behavior. Completed: the runtime audit found 13 missing TypeScript module headers; all 13
were aligned with header-only edits.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- Divergences from the code-opencode standard are enumerated with source-level citations, not assumed.
- Each divergence is aligned or recorded as an accepted, documented exception.
- Behavior is preserved: the required serial per-mode/per-file Vitest matrix and whole-runtime tsc are green before and
  after, compared as a delta.
- `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
The runtime under `.opencode/skills/system-deep-loop/runtime` was authored across many independent fan-out sessions and
had not been run through the sk-code code-opencode alignment pass. The sk-code smart router resolved the code-opencode
surface, whose documented patterns, structure, and verification wiring were the target standard for this alignment.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Audit and baseline

**Complete.** Resolve the sk-code route, load the code-opencode conventions, and capture the baseline tsc plus serial matrix.

### Phase 2: Alignment and closeout

**Complete.** Align the 13 header findings, record the out-of-scope repository drift, rerun the matrix, and strict-validate.

1. **Complete.** Run the sk-code code-opencode surface audit over the runtime; produce an evidence-backed divergence list.
2. **Complete.** Align divergences in behavior-preserving units, re-verifying Vitest + tsc after each.
3. **Complete.** Record accepted exceptions; run the required serial matrix and strict validation.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Behavior-preserving refactor, so testing is a strict no-regression discipline: capture the baseline Vitest + tsc, then
re-run the exact serial 40-file per-mode/substrate matrix after alignment and compare as a delta. A one-process aggregate
is excluded because it hangs on shared-graph SQLite append-lock.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- sk-code smart router and its code-opencode surface (the alignment standard and verification).
- Phase 019 (code READMEs) — ideally a module gets its README and its alignment pass together.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Alignment was behavior-preserving and landed as 13 four-line module-header additions. Rollback is reverting those specific
header-only hunks. The green test suite is the tripwire; no behavior delta was observed.
<!-- /ANCHOR:rollback -->

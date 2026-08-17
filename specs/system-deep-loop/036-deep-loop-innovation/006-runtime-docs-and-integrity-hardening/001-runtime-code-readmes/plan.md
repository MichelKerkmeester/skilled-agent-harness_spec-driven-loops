---
title: "Implementation Plan: Runtime Code README Coverage"
description: "Execution plan and verification gates for runtime code README coverage and repairs."
trigger_phrases:
  - "runtime README coverage plan"
  - "deep-loop code README repairs"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/001-runtime-code-readmes"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Completed runtime README authoring and repair"
    next_safe_action: "Regenerate metadata and run final strict validation"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 100
    open_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Code README Coverage for the system-deep-loop Runtime

<!-- ANCHOR:summary -->
## 1. SUMMARY
Add a code README to every source-bearing folder in the system-deep-loop runtime, and repair the fourteen recorded defects in
the READMEs that already exist, authored to the sk-doc create-readme standard. Pure documentation: no runtime code changes.
Execution is complete. The final scope contains 56 additions and 14 repairs.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- Every in-scope folder carries a README conforming to the sk-doc create-readme code-README standard.
- Every runtime README passes the generic README validator; the 70 authored or repaired READMEs also pass the code-folder validator.
- Each README's claims (purpose, exports, dependencies) verified against real source, not guessed.
- Whole-runtime tsc passes and the Vitest result is unchanged from the captured baseline failure.
- `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
The runtime is `.opencode/skills/system-deep-loop/runtime`. Code lives under `lib/<module>/` with 93 direct module folders.
The final census has zero missing READMEs. Each authored README is based on the real direct-file inventory and the module's
public barrel or test surface, following the accepted sk-doc code-folder format.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Census and Standard

Re-verify the 14 recorded defects, rerun the runtime/lib census and apply the accepted Directory-Tree ruling.

### Phase 2: Authoring and Repair

Author READMEs in batches by clone column across the eight lanes and repair the 14 recorded defects in existing runtime READMEs.

### Phase 3: Verification

Complete coverage, conformance, no-regression and strict-validation checks with evidence in the implementation summary.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Documentation-only, so testing is a no-regression guard: the captured baseline and post-change whole-runtime Vitest runs both
report the same failure in `tests/unit/legacy-projections.test.ts`; the post-change tsc exits 0. The sk-doc README-standard
check passes all 70 authored or repaired files.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- sk-doc create-readme mode (the code-README standard and authoring workflow).
- The landed runtime source (READMEs are authored from the real module surface).
- The accepted sk-doc code-folder decision record, including the Directory-Tree ruling.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Rollback is deleting the 56 added README files and restoring the 14 repaired README files from the pre-task baseline. No
runtime behavior can be affected.
<!-- /ANCHOR:rollback -->

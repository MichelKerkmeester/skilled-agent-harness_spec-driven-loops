---
title: "Implementation Plan: Whole-System Gate"
description: "Plan for freezing a candidate and baseline SHA, running the enumerated whole-system check set, and recording a blocking receipt."
trigger_phrases:
  - "whole system gate plan"
  - "frozen sha gate plan"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate"
    last_updated_at: "2026-08-19T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Planned the gate run"
    next_safe_action: "Freeze the candidate and baseline"
    blockers:
      - "Predecessor 004-legacy-writer-retirement must pass first"
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Whole-System Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Evidence artifacts only |
| **Change class** | Measurement; no runtime mutation |
| **Authority** | Read and recorded, never changed |
| **Blast radius** | None to the system; high to the verdict |
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Command | Blocking |
|------|---------|----------|
| Predecessor | `004` complete | Yes |
| Frozen candidate | Every check confirmed to have run at the same SHA | Yes |
| Receipt written | Present whether the gate passes or fails | Yes |
| Tree unchanged | `git status` and diff clean after the run | Yes |
| Spec validation | `validate.sh <this folder> --strict` Errors: 0 | Yes |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The gate is a script that freezes two SHAs, runs an enumerated check set, and writes a receipt.

Enumerating the check set in the spec rather than deriving it at runtime is deliberate. A gate that discovers its own
checks can silently shrink — a renamed file, a moved directory, and the gate passes because it ran fewer checks. An
enumerated set makes a missing check a failure rather than a smaller pass.

The receipt is written on failure as well as success. A gate that only records passes leaves no trace of the run that
found the problem, which is the run most worth having a record of.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Resolve the candidate and baseline SHAs from the environment.
- Confirm the working tree is clean, so the candidate SHA actually describes what is about to be measured.
- Capture the baseline runtime suite result at the baseline SHA.

### Phase 2: Implementation
- Run the runtime suite at the candidate.
- Run every mode's reader contract at the candidate.
- Read and record the authority state of all seven modes.
- Run a real fan-out to completion.
- Write the receipt naming both SHAs, every check, and the verdict.

### Phase 3: Verification
- Confirm every check ran at the frozen candidate SHA.
- Confirm the suite result is expressed as a delta against the baseline.
- Confirm the receipt exists and is complete.
- Confirm the working tree is unchanged by the run.
- Run strict packet validation.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

This phase is itself a test, so the meta-question is whether the gate can fail. Before trusting a pass, the gate is run
once against a deliberately broken condition to confirm it reports failure and still writes a receipt. Without that,
a pass is unfalsifiable.

The tree-unchanged check is performed with `git status` and a diff rather than by reasoning about what the gate does,
because a measurement tool that mutates while measuring is a known and easy mistake.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | State | Note |
|------------|-------|------|
| `004-legacy-writer-retirement` | Predecessor | The system must be in its final enabled shape |
| Cutover binding resolver | Landed | Supplies the SHAs without hand entry |
| Per-mode reader contracts | Built in `001` and `003` | Reused here, not rewritten |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not applicable: the gate changes nothing. Its only artifacts are the receipt and its output, and discarding them is
safe.

If the gate fails, the response is a forward-fix phase, consistent with the packet's forward-only policy. The receipt
is retained in either case as the record of what the system looked like at that commit.
<!-- /ANCHOR:rollback -->

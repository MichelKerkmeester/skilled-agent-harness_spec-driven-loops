---
title: "Implementation Summary: Route-Proof Validation & Citation Corrections"
description: "Route-proof validation now rejects schema-valid wrong-mode deep-loop records before downstream phases rely on validator pass results. The phase also records the unrecovered prior research as explicit axioms and corrects citation drift."
trigger_phrases:
  - "implementation"
  - "summary"
  - "route-proof validation"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/002-route-proof-validation"
    last_updated_at: "2026-06-30T19:40:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Phase 001 route-proof validation complete"
    next_safe_action: "Proceed to phase 002-agent-dispatch-hardening"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts"
      - ".opencode/skills/deep-loop-runtime/tests/unit/post-dispatch-validate.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-001-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Wrong-mode schema-valid artifacts reject through route-proof validation."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-route-proof-validation |
| **Completed** | 2026-06-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Route-proof validation now makes a schema-valid wrong-mode artifact fail instead of passing as a valid iteration. The validator checks route identity on both the canonical state-log record and the per-iteration delta record, which closes the false-negative that blocked trustworthy downstream GPT smoke tests.

### Route-Proof Validator

`validateIterationOutputs` accepts a `routeProof` expectation and verifies exact `mode`, `target_agent`, `agent_definition_loaded`, and `resolved_route` values. It returns `route_proof_missing` or `route_proof_mismatch` before stamping a passing record.

### Workflow Contracts

The research, review, context, and council autonomous workflow contracts now declare route-proof requirements. Research and review prompt packs tell leaf agents to emit the fields. Context writes them from the host. Council round completion records now include the same route identity fields.

### Evidence Boundary

The missing prior research packets were not recovered in the current worktree. `decision-record.md` accepts the taxonomy and fix ordering as explicit operator-asserted axioms with a revisit condition if the files are recovered later.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` | Modified | Enforce route-proof fields and add failure reasons |
| `.opencode/skills/deep-loop-runtime/tests/unit/post-dispatch-validate.vitest.ts` | Modified | Cover wrong-mode state-log and delta rejection |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modified | Require research route proof |
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | Modified | Require review route proof |
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Modified | Emit and require context route proof |
| `.opencode/commands/deep/assets/deep_ai-council_auto.yaml` | Modified | Require council route proof on round records |
| `.opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl` | Modified | Tell research leaves to emit route proof |
| `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl` | Modified | Tell review leaves to emit route proof |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs` | Modified | Emit council route proof |
| `research-prompt.md` | Modified | Correct `ai-council.md` mode and missing prior-research wording |
| `decision-record.md` | Created | Record prior-research axiom boundary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation was delivered as a minimal validator extension plus workflow contract updates. The key confidence check is a direct falsification test: records that are otherwise schema-valid now fail when the mode or target agent proves the wrong route.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use exact route-proof values | Exact comparison makes the wrong route unrepresentable as a passing record. |
| Validate state-log and delta records | A correct state log with a wrong delta would still poison replay, so both persisted records must agree. |
| Accept missing prior research as axioms | The files are absent from disk, but phase 001 can prove its own gate with direct wrong-mode rejection. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm test -- post-dispatch-validate.vitest.ts` | PASS, 30 tests including wrong state-log mode and wrong delta target-agent rejection |
| `npm run typecheck` | PASS |
| `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh <modified-code-file>` | PASS for both modified code files |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/commands/deep` | PASS |
| `validate.sh --strict` | PASS, 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Council uses round records, not iteration/delta records.** The council contract now carries the same route-proof fields on `round_completed` records, but it does not use `validateIterationOutputs` because its state model differs from research/review/context.
2. **Prior research remains unrecovered.** Downstream phases must not claim those missing packets were read unless they are recovered later.
<!-- /ANCHOR:limitations -->

---

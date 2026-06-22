---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. Scaffolded phase that will make requestQuality and citationPolicy conditionally-mandatory render slots, add a deterministic post-render envelope-fidelity check with a grandfather report mode, and emit a pre-rendered verdict fragment, every behavioral change behind a default-OFF flag. No code change has landed."
trigger_phrases:
  - "envelope fidelity enforcement"
  - "mandatory render slots verdict"
  - "post render envelope fidelity check"
  - "pre rendered verdict fragment"
  - "requestQuality citationPolicy render"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/027-envelope-fidelity-enforcement"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the planned doc for the render mandate, check and fragment"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/commands/memory/search.md"
      - ".opencode/commands/memory/assets/search_presentation.txt"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/check-envelope-fidelity.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-027-envelope-fidelity-enforcement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 027-envelope-fidelity-enforcement |
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Conditionally-mandatory render slots

The phase will reclassify `requestQuality` and `citationPolicy` from sanctioned-but-droppable extras to conditionally-mandatory render slots, required-when-present, in the command render contract and the presentation asset. Today the contract names the two fields as the only sanctioned extras but states their absence is valid, so a weaker model drops them and the verdict goes model-dependently absent. The new rule requires a render that has the fields to keep them and extends the render self-check to re-emit a field the tool shipped but the render dropped. The reclassification ships behind a default-OFF flag so the legacy absence-is-valid rule stays the default until the grandfather report is clean, which keeps the existing renders from failing the moment the mandate lands (rec #5).

### Post-render envelope-fidelity check

The phase will build a `check-envelope-fidelity.mjs` that replays the tool verdict against the rendered block and asserts each field the tool shipped is present and unmodified in the render. It has a fail mode that exits non-zero on a dropped, renamed or altered field, and a grandfather report mode that lists the same non-conforming render with a zero exit so existing renders are surfaced rather than broken. A confidence-disabled run, where the tool ships no verdict, is treated as nothing-to-replay rather than a failure. The check verdicts render fidelity, so a dropped field is caught instead of tolerated (rec #6).

### Pre-rendered verdict fragment

The phase will emit a ready-to-paste pre-rendered verdict fragment from `handlers/memory-search.ts`, rendered from the same verdict object the handler already ships, so the model pastes the fragment rather than transcribing `requestQuality` and `citationPolicy` field by field. Removing the per-field transcription step removes the source of the drop. The fragment is gated behind a default-OFF flag and the verdict logic in `confidence-scoring.ts` is read but unchanged, so the fragment renders the existing verdict rather than recomputing it (rec #9, the lowest priority of the three and deferrable if the render mandate and the fidelity check land).

### Files Changed

This table lists the planned changes. None have been applied.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/memory/search.md` | Planned modify | Reclassify the two verdict fields to conditionally-mandatory required-when-present render slots with a re-emit self-check, behind a default-OFF flag |
| `.opencode/commands/memory/assets/search_presentation.txt` | Planned modify | Mirror the conditionally-mandatory rule and the re-emit rule so the contract and asset agree |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Planned modify | Emit a pre-rendered verdict fragment from the shipped verdict object, behind a default-OFF flag |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/check-envelope-fidelity.mjs` | Planned create | Deterministic post-render fidelity check with a fail mode and a grandfather report mode |
| `.opencode/skills/system-spec-kit/mcp_server/tests/envelope-fidelity.vitest.ts` | Planned create | Prove the check fails a dropped-field render, passes a faithful render, and grandfather mode does not fail an existing non-conforming render |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` | Verify only | The verdict logic that produces the label is read for the fragment and replay, the gate is unchanged |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned sequence reclassifies the two verdict fields to conditionally-mandatory render slots behind a default-OFF flag first, then builds the fidelity check that replays the verdict against a rendered block with a fail mode and a grandfather report mode, then emits the pre-rendered fragment from the shipped verdict object behind a default-OFF flag. The dropped-field proof that the check fails in fail mode and lists in grandfather report mode, the faithful-render proof that the check passes, and the confidence-disabled proof that nothing-to-replay is not a failure, land with the vitest. The default-on flip of the render mandate is a follow-on gated on a clean grandfather report, not part of this phase.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Enforce render fidelity, not verdict content | The verdict is correct whenever rendered, the gap is that a weak model drops it, so this phase touches the render contract not the scoring pipeline |
| Ship every behavioral change behind a default-OFF flag or grandfather report mode | The existing renders and the shipped contract carry the looser absence-is-valid rule the new mandate rejects, so a live flip would break them |
| Render the fragment from the shipped verdict object | A parallel copy would drift if the verdict label set changed, so the fragment reads the same object `assessRequestQuality` returns |
| Treat a confidence-disabled run as nothing-to-replay | The verdict is presence-gated by `isResultConfidenceEnabled`, so a run that ships no verdict is not a fidelity failure |
| Defer the default-on flip to a follow-on | The flip is gated on a clean grandfather report over a render corpus, which is a separate audit from shipping the mandate dark |
| Keep rec #9 as the deferrable item | The fragment is the lowest-priority of the three, the render mandate and the fidelity check carry the enforcement even without it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has run. The checks below are planned and currently unmet. The planned gate command is `node check-envelope-fidelity.mjs --mode fail` and the planned docs gate is `validate.sh --strict`.

| Check | Result |
|-------|--------|
| A render that drops a tool-shipped field fails the fidelity check in fail mode | PLANNED, not yet run |
| The same dropped-field render lists in grandfather report mode with a zero exit | PLANNED, not yet run |
| A renamed field and an altered verdict value also fail in fail mode | PLANNED, not yet run |
| A confidence-disabled run is treated as nothing-to-replay rather than a failure | PLANNED, not yet run |
| The render contract and asset describe the two fields as conditionally-mandatory required-when-present behind a default-OFF flag | PLANNED, not yet run |
| The handler fragment emit is default-OFF and renders the verdict verbatim with the verdict logic unchanged | PLANNED, not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a scaffold. No code change has landed and no check has passed.
2. **Default-OFF until graduated.** The render mandate and the fragment ship dark, so the model-dependent drop persists in live renders until the default-on flip graduates on a clean grandfather report.
3. **Grandfather corpus precondition.** The default-on flip cannot graduate until a render corpus is captured and the grandfather report runs clean, which is a separate audit from this phase.
4. **Soft spot B only.** This phase enforces render fidelity for a correct verdict and does not touch the off-corpus false-relevance defect, which is soft spot A and a separate phase.
<!-- /ANCHOR:limitations -->

---

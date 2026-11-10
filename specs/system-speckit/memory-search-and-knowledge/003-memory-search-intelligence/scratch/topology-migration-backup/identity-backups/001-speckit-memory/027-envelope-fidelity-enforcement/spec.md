---
title: "Feature Specification: Envelope-Fidelity Enforcement [template:level_2/spec.md]"
description: "The memory-search tool always ships requestQuality and citationPolicy on a non-empty result but the command render contract lets a weaker model drop them, so the verdict is model-dependently absent in the rendered block. This phase makes the two verdict fields conditionally-mandatory render slots, adds a deterministic post-render envelope-fidelity check that replays the tool verdict against the rendered prose, and emits a pre-rendered verdict fragment so the model transcribes nothing. Every behavioral change ships behind a default-OFF flag or a grandfather report mode because existing renders carry the looser contract."
trigger_phrases:
  - "envelope fidelity enforcement"
  - "mandatory render slots verdict"
  - "post render envelope fidelity check"
  - "pre rendered verdict fragment"
  - "requestQuality citationPolicy render"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/027-envelope-fidelity-enforcement"
    last_updated_at: "2026-07-04T17:51:01.493Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented and verified recs 5, 6, 9 behind SPECKIT_ENVELOPE_FIDELITY_V1, vitest 12/12 green"
    next_safe_action: "Run the grandfather report over a captured render corpus before the default-on flip follow-on"
    blockers: []
    key_files:
      - ".opencode/commands/memory/search.md"
      - ".opencode/commands/memory/assets/search_presentation.txt"
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/check-envelope-fidelity.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-027-envelope-fidelity-enforcement"
      parent_session_id: "phase-027-envelope-fidelity-enforcement"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Whether the kubernetes false-positive is in scope, it is not, that is soft spot A and a separate phase"
      - "The pre-rendered fragment is a new additive data.envelopeRender field, not a string baked into the existing envelope, and it survives the memory_context re-wrap"
---
# Feature Specification: Envelope-Fidelity Enforcement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope and verification evidence.
- Remove placeholders, stale status and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | COMPLETE |
| **Created** | 2026-06-22 |
| **Branch** | `027-envelope-fidelity-enforcement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 029 model benchmark exposed soft spot B, envelope fidelity. The memory-search tool always computes and ships `requestQuality` and `citationPolicy` on a non-empty result, the verdict itself is correct, but the command render contract lets a weaker model drop the two fields from the rendered block. The benchmark scored fidelity from rendered prose and the cross-model disagreements were null omissions rather than conflicts, so the field is model-dependently absent. The research verified this against the live code. The verdict is computed and shipped at `handlers/memory-search.ts:1325-1327` and the field is presence-gated by `isResultConfidenceEnabled`, so the contract is mandatory-when-enabled (`benchmark-results.md:79`). The render contract names `requestQuality` and `citationPolicy` as the only sanctioned extras but states their absence is valid (`commands/memory/search.md:76`, `:144`), and the presentation asset lists them as optional trailing fields (`assets/search_presentation.txt:103`, `:110-111`). The net effect is that a reader of a weak-model render cannot tell whether the verdict was withheld or simply dropped, so the correct verdict is robust only when a strong model renders it.

This is a robustness gap, not the benchmarked false-positive defect. The kubernetes off-corpus false-relevance is soft spot A and a separate phase, it cites a wrong match with confidence. This phase does not touch the scoring or citation pipeline. It enforces that the verdict the tool already ships reaches the rendered block faithfully and is legible whether the model is strong or weak.

### Purpose
Make the two verdict fields conditionally-mandatory render slots so a render that has them must keep them, add a deterministic post-render envelope-fidelity check that replays the tool verdict against the rendered prose so a dropped field is caught rather than tolerated, and emit a pre-rendered verdict fragment so the model pastes the fragment instead of transcribing the fields. Every behavioral change ships behind a default-OFF flag or a grandfather report mode, because the existing renders and the shipped contract carry the looser any-field-may-drop rule the new contract rejects, so the enforcement must graduate only after a grandfather report confirms the aligned good and correctly-weak renders do not regress.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reclassify `requestQuality` and `citationPolicy` from sanctioned-but-droppable extras to conditionally-mandatory render slots, required-when-present, in the command render contract (`commands/memory/search.md`) and the presentation asset (`commands/memory/assets/search_presentation.txt`), with the command self-check extended to detect a present-on-the-tool-but-absent-in-render field and re-emit it. The reclassification ships behind a default-OFF flag so the legacy absence-is-valid rule stays the default until the grandfather report is clean (rec #5).
- A deterministic post-render envelope-fidelity check that replays the tool verdict against the rendered block, asserting each field the tool shipped is present and unmodified in the render, emitting a fidelity report and a grandfather report mode that lists existing non-conforming renders without failing them (rec #6).
- A pre-rendered verdict fragment the tool emits ready-to-paste, so the model copies the fragment rather than transcribing `requestQuality` and `citationPolicy` field by field, removing the per-field transcription step that is the source of the drop, gated behind a default-OFF flag (rec #9).
- A vitest that asserts the fidelity check fails a render with a dropped field, passes a faithful render, and runs the grandfather report mode without failing a pre-existing non-conforming render.

### Out of Scope
- Any change to the scoring, banding, citation or grounding pipeline. The verdict is correct, this phase enforces its render, not its content. The off-corpus false-relevance fix is soft spot A and a separate phase.
- Any change to `assessRequestQuality` or the verdict logic in `confidence-scoring.ts`. The fragment is rendered from the verdict the tool already computes, the verdict itself is unchanged.
- Flipping the new render mandate on by default. This phase ships the mandate, the check and the fragment dark, and the default-on flip is a follow-on gated on a clean grandfather report.
- Surfacing a grounding or low-grounding signal in the envelope, which is rec #7 and a separate soft-spot-A phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/memory/search.md` | Modify | Reclassify `requestQuality` and `citationPolicy` to conditionally-mandatory render slots, required-when-present, and extend the render self-check to re-emit a tool-present field absent from the render, behind a default-OFF flag |
| `.opencode/commands/memory/assets/search_presentation.txt` | Modify | Move the two named optional fields to the conditionally-mandatory slot list and document the re-emit rule, matching the command contract |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modify | Emit a pre-rendered verdict fragment alongside the shipped `requestQuality` and `citationPolicy`, behind a default-OFF flag, so the model pastes the fragment rather than transcribing the fields |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/check-envelope-fidelity.mjs` | Create | Deterministic post-render fidelity check that replays the tool verdict against a rendered block, with a fail mode and a grandfather report mode |
| `.opencode/skills/system-spec-kit/mcp_server/tests/envelope-fidelity.vitest.ts` | Create | Assert the check fails a dropped-field render, passes a faithful render, and the grandfather report mode lists a non-conforming render without failing |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` | Verify (no change) | The verdict logic that produces `requestQuality.label` is read but not modified, the fragment renders the verdict it already returns |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The command render contract MUST reclassify `requestQuality` and `citationPolicy` from droppable extras to conditionally-mandatory render slots, required-when-present, with the render self-check extended to re-emit a field the tool shipped but the render dropped, and the reclassification MUST ship behind a default-OFF flag (rec #5) | `commands/memory/search.md` and `assets/search_presentation.txt` describe the two fields as required-when-present rather than absence-is-valid, the self-check re-emits a dropped tool-present field, and a flag default-OFF preserves the legacy absence-is-valid rule until the grandfather report is clean |
| REQ-002 | A deterministic post-render envelope-fidelity check MUST replay the tool verdict against the rendered block and assert each field the tool shipped is present and unmodified, with a fail mode and a grandfather report mode that lists pre-existing non-conforming renders without failing them (rec #6) | `check-envelope-fidelity.mjs` takes a tool verdict and a rendered block, exits non-zero when a shipped field is dropped or altered in fail mode, and in grandfather report mode lists the same render as non-conforming with a zero exit |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The tool SHALL emit a ready-to-paste pre-rendered verdict fragment alongside the shipped verdict fields so the model pastes the fragment rather than transcribing `requestQuality` and `citationPolicy` field by field, behind a default-OFF flag, and the fragment SHALL render the verdict the tool already computes without changing it (rec #9, the lowest-priority of the three and deferrable if REQ-001 and REQ-002 land) | `handlers/memory-search.ts` emits a fragment string that contains both field names and their values verbatim from the shipped verdict, the fragment is gated default-OFF, and `confidence-scoring.ts` verdict logic is unchanged |
| REQ-004 | The vitest SHALL prove the fidelity check fails a dropped-field render, passes a faithful render, and runs the grandfather report mode without failing a pre-existing non-conforming render | `envelope-fidelity.vitest.ts` has a dropped-field case that fails, a faithful case that passes, and a grandfather-report case that reports without failing |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A render that drops a tool-shipped `requestQuality` or `citationPolicy` field fails `check-envelope-fidelity.mjs` in fail mode and is listed in grandfather report mode with a zero exit, proving the check verdicts render fidelity and the grandfather mode does not break existing renders.
- **SC-002**: The render contract in `commands/memory/search.md` and `assets/search_presentation.txt` describes the two fields as conditionally-mandatory required-when-present with a re-emit rule, behind a default-OFF flag, proving the mandate ships dark rather than flipping the live contract.
- **SC-003**: The tool emits a pre-rendered verdict fragment that contains both field names and their verbatim verdict values, gated default-OFF, with the `confidence-scoring.ts` verdict logic unchanged, proving the fragment renders the existing verdict rather than recomputing it.
- **SC-004**: The vitest fails a dropped-field render, passes a faithful render, and runs the grandfather report mode without failing a pre-existing non-conforming render, proving the enforcement is provable before the default-on flip.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Flipping the render mandate on by default breaks existing renders that carry the looser contract | High | Ship the mandate, the check and the fragment behind a default-OFF flag and graduate only after a clean grandfather report, never flip on in this phase |
| Risk | The fidelity check fails a faithful render because the verdict was legitimately absent (empty result or confidence disabled) | Med | Replay only the fields the tool actually shipped, treat a tool that emitted no verdict as nothing-to-check, and key presence on `isResultConfidenceEnabled` |
| Risk | The pre-rendered fragment drifts from the verdict logic if the verdict label set changes | Med | Render the fragment from the same verdict object `assessRequestQuality` returns, never from a parallel copy, so a label change propagates without a second edit |
| Dependency | The shipped verdict at `handlers/memory-search.ts:1325-1327` and `assessRequestQuality` at `confidence-scoring.ts:433` | Internal, Green | The verdict already ships, this phase reads it for the fragment and the replay and does not modify it |
| Dependency | This phase is soft spot B only and shares no code with soft spot A | Internal, Green | The off-corpus false-relevance fix lives in `assessRequestQuality` or the absolute-relevance score, this phase lives in the render contract, so the two ship independently |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The fidelity check runs on a captured tool verdict and a rendered string with no live retrieval, so it adds no query-path latency.

### Reliability
- **NFR-R01**: The check is deterministic on a fixed verdict and render pair, so the fidelity exit code is stable across reruns of the same inputs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty result set: the tool ships no verdict, so the fidelity check has nothing to replay and passes, and the render uses the empty-result fallback rather than a missing-field failure.
- Confidence disabled (`isResultConfidenceEnabled` false): the verdict is not shipped, so the conditionally-mandatory slots are not required and the check treats the absence as expected.

### Error Scenarios
- A render that renames a field (for example `quality` instead of `requestQuality`): the fidelity check reads it as a dropped sanctioned field and fails in fail mode, listed in grandfather report mode.
- A render that alters a verdict value (for example `good` rendered as `high`): the replay detects the mismatch and fails in fail mode, distinct from a clean omission so the report can separate dropped from altered.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two contract-doc edits plus one handler fragment emit and one net-new check file with a vitest, no scoring or ranking change |
| Risk | 7/25 | No verdict-logic change, risk is the default-on flip and the faithful-render false fail, both flag-gated and grandfather-guarded |
| Research | 4/20 | Seams verified to file:line in research.md section 4 and the live render contract |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether the pre-rendered fragment is a new tool response field or a string baked into the existing envelope, given the render contract caps the sanctioned extras at the two named fields.
- Whether the grandfather report is a one-off audit over captured renders or a standing report the default-on flip gates on.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:verdict -->
## 11. VERDICT

Soft spot B robustness hardening, GO-on-cost and buildable-now. The verdict is correct whenever rendered, this phase makes it always rendered. It touches the render contract and a handler fragment emit, not the scoring or citation pipeline, so it shares no code with the benchmarked off-corpus false-positive and ships independently. The three recommendations are the render mandate (rec #5, the highest priority of the three), the post-render fidelity check (rec #6), and the pre-rendered fragment (rec #9, the lowest priority and deferrable if the first two land). Every behavioral change ships behind a default-OFF flag or a grandfather report mode because the existing renders carry the looser absence-is-valid contract the new mandate rejects, so the enforcement graduates only after a grandfather report confirms the aligned good and correctly-weak renders do not regress. The default-on flip is a follow-on, not this phase.
<!-- /ANCHOR:verdict -->

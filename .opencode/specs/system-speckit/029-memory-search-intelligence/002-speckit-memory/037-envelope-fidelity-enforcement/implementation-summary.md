---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status COMPLETE. Shipped envelopeRender pre-rendered verdict fragment, the conditionally-mandatory render-slot contract, and a deterministic post-render fidelity check with a grandfather report mode, all behind the default-OFF SPECKIT_ENVELOPE_FIDELITY_V1 flag. Vitest 12/12 green, flag-off byte-identical, typecheck clean."
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
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/037-envelope-fidelity-enforcement"
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
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The pre-rendered fragment is a new additive data.envelopeRender response field, not a string baked into an existing field, and it survives the memory_context re-wrap because the handler spreads data wholesale"
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
| **Completed** | 2026-06-22, status COMPLETE |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All three recommendations shipped behind the single default-OFF flag `SPECKIT_ENVELOPE_FIDELITY_V1`. With the flag off the response shape is byte-for-byte the shipped behavior.

### Pre-rendered verdict fragment (rec #9)

The formatter emits a new additive `data.envelopeRender` string built from the same `requestQuality` label and `citationPolicy` pair the tool already ships, so the model pastes the two verdict lines verbatim rather than transcribing each field. The fragment is derived at the existing derive site in `formatters/search-results.ts` (the `memory_search` handler delegates to this formatter, which is where the verdict pair is populated and shipped), built by the exported helper `buildEnvelopeRenderFragment`, and gated behind the flag. It returns the two lines `requestQuality <label>` and `citationPolicy <policy>`, matching the presentation asset exactly. The verdict logic in `confidence-scoring.ts` is read but unchanged, so the fragment renders the existing verdict rather than recomputing it.

### Conditionally-mandatory render slots (rec #5)

The command render contract and the presentation asset reclassify `requestQuality` and `citationPolicy` from sanctioned-but-droppable extras to conditionally-mandatory render slots, required-when-present, gated on the same flag. Under the default contract their absence stays valid. When the flag is set a verdict field the tool response carries MUST appear unaltered in the render, the render pastes the `data.envelopeRender` fragment verbatim, and the render self-check re-emits from the fragment any verdict field the tool shipped but the render dropped. The flag is default-OFF so the legacy absence-is-valid rule stays the default until the grandfather report is clean.

### Post-render envelope-fidelity check (rec #6)

`check-envelope-fidelity.mjs` replays the tool verdict against a rendered block and asserts each field the tool shipped is present and unmodified. Fail mode exits non-zero on a dropped, renamed or altered field. Grandfather report mode lists the same non-conforming render with a zero exit so existing renders are surfaced rather than broken. A dropped field and an altered value are distinct finding kinds. A run where the tool shipped no verdict (empty result or confidence disabled) is treated as nothing-to-replay and passes. The check is importable, so the vitest drives the same functions the CLI uses.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Modify | Add the default-OFF `isEnvelopeFidelityEnabled` gate reading `SPECKIT_ENVELOPE_FIDELITY_V1` |
| `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts` | Modify | Add `buildEnvelopeRenderFragment` and emit `data.envelopeRender` at the verdict derive site behind the flag, protect the key in the extraData merge |
| `.opencode/commands/memory/search.md` | Modify | Reclassify the two verdict fields to conditionally-mandatory required-when-present render slots with a re-emit self-check, behind the flag |
| `.opencode/commands/memory/assets/search_presentation.txt` | Modify | Mirror the conditionally-mandatory rule and the re-emit rule so the contract and asset agree |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/check-envelope-fidelity.mjs` | Create | Deterministic post-render fidelity check with a fail mode and a grandfather report mode |
| `.opencode/skills/system-spec-kit/mcp_server/tests/envelope-fidelity.vitest.ts` | Create | Prove the fragment emit, the flag-off byte-identical shape, the context passthrough, and the check across all matrix axes |
| `.opencode/skills/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts` | Modify | Add the new flag to the search-flags mock now that the formatter depends on it |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Register the flag in the summary and detail feature-flag tables |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` | Verify only | The verdict logic that produces the label is read for the fragment and replay, unchanged |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The flag landed first as a default-OFF opt-in gate. The formatter then gained the `buildEnvelopeRenderFragment` helper and emits `data.envelopeRender` only when the flag is on and the verdict was shipped, which keeps the flag-off path byte-identical. The contract and asset were reclassified to the conditionally-mandatory required-when-present rule with a re-emit self-check, behind the same flag. The deterministic check was built as an importable ESM module with fail and grandfather modes. The vitest proves the fragment matches the structured label and policy, is absent flag-off (byte-identical minus only the additive key), survives the memory_context re-wrap, and that the check fails a dropped, renamed and altered render in fail mode while listing them without failing in grandfather mode. The default-on flip of the render mandate is a follow-on gated on a clean grandfather report, not part of this phase.

A documented deviation: the spec scaffold named `handlers/memory-search.ts:1325-1327` as the fragment emit site, but the verdict pair is populated and shipped in `formatters/search-results.ts` (the handler delegates there), which the research verification row also cites as `search-results.ts:1167-1176`. The fragment is emitted at that derive site, which is the faithful location and the one the build brief directed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One flag for all three behavioral changes | The fragment, the render mandate and the check graduate together on the same clean grandfather report, so a single `SPECKIT_ENVELOPE_FIDELITY_V1` keeps the dark-ship coherent |
| Emit the fragment at the formatter derive site, not the handler | The verdict pair is populated and shipped in the formatter, so the fragment reads the same object rather than a re-derived copy in the handler |
| Enforce render fidelity, not verdict content | The verdict is correct whenever rendered, the gap is that a weak model drops it, so this phase touches the render contract not the scoring pipeline |
| Render the fragment from the shipped verdict pair | A parallel copy would drift if the verdict label set changed, so the fragment reads the same pair the formatter ships |
| Grandfather mode is a check argument, not a flag | The mode selects fail versus report at invocation, which is per-run, while the flag gates the response-shape change |
| Treat a confidence-disabled run as nothing-to-replay | The verdict is presence-gated by `isResultConfidenceEnabled`, so a run that ships no verdict is not a fidelity failure |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Run command: `npx vitest run tests/envelope-fidelity.vitest.ts` from the mcp_server package. Docs gate: `validate.sh --strict` on the 027 folder.

| Check | Result |
|-------|--------|
| `data.envelopeRender` matches the structured label and policy when the flag is on | PASS (vitest) |
| `data.envelopeRender` absent flag-off, response otherwise byte-identical to flag-on | PASS (vitest) |
| The fragment is present whenever the verdict is shipped (good and weak) | PASS (vitest) |
| The fragment survives the memory_context re-wrap passthrough | PASS (vitest) |
| A render that drops a tool-shipped field fails the check in fail mode (exit 1) | PASS (vitest + CLI smoke) |
| The same dropped-field render lists in grandfather report mode with a zero exit | PASS (vitest + CLI smoke) |
| A renamed field reads as dropped, an altered value fails distinctly, in fail mode | PASS (vitest) |
| A confidence-disabled run is nothing-to-replay rather than a failure | PASS (vitest) |
| The check replays the exact fragment the formatter emits | PASS (vitest) |
| Vitest total | 12/12 PASS |
| Typecheck `tsc --noEmit` | PASS (exit 0) |
| Regression: search, formatter, confidence, empty-result, envelope tests | PASS, no new failures (the 4 anchor-prefix-matching failures pre-exist on baseline) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Default-OFF until graduated.** The render mandate and the fragment ship dark, so the model-dependent drop persists in live renders until the default-on flip graduates on a clean grandfather report.
2. **Grandfather corpus precondition.** The default-on flip cannot graduate until a render corpus is captured and the grandfather report runs clean, which is a separate audit from this phase.
3. **Soft spot B only.** This phase enforces render fidelity for a correct verdict and does not touch the off-corpus false-relevance defect, which is soft spot A and a separate phase.
4. **Not committed.** The work is staged in the working tree; the commit is deferred to the user per the build brief.
<!-- /ANCHOR:limitations -->

---

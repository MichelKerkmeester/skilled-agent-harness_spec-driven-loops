---
title: "Changelog: Envelope Fidelity Enforcement [001-speckit-memory/027-envelope-fidelity-enforcement]"
description: "Chronological changelog for the envelope fidelity enforcement phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-22

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/027-envelope-fidelity-enforcement` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

This phase shipped a pre-rendered verdict fragment, a conditionally-mandatory render-slot contract and a deterministic post-render fidelity check, all behind the default-off `SPECKIT_ENVELOPE_FIDELITY_V1` flag. The formatter emits a new additive `data.envelopeRender` string built from the same `requestQuality` label and `citationPolicy` pair the tool already ships, so a weak model pastes the two verdict lines verbatim rather than dropping them. With the flag off the response shape is byte-for-byte the shipped behavior. The vitest is 12/12 green and the typecheck is clean.

### Added

- Added the `buildEnvelopeRenderFragment` helper and the additive `data.envelopeRender` field emitted at the verdict derive site in `formatters/search-results.ts`, gated behind the flag.
- Added the default-off `isEnvelopeFidelityEnabled` gate reading `SPECKIT_ENVELOPE_FIDELITY_V1`.
- Added `check-envelope-fidelity.mjs`, a deterministic post-render check that replays the tool verdict against a rendered block, with a fail mode and a grandfather report mode.
- Added `envelope-fidelity.vitest.ts` proving the fragment emit, the flag-off byte-identical shape, the context passthrough and the check across all matrix axes.

### Changed

- Reclassified the `requestQuality` and `citationPolicy` render fields from sanctioned-but-droppable extras to conditionally-mandatory required-when-present render slots in `search.md` and the presentation asset, gated on the same flag, with a re-emit self-check.
- Registered the flag in the `ENV_REFERENCE.md` summary and detail feature-flag tables.
- Added the new flag to the search-flags mock in `provenance-envelope.vitest.ts` now that the formatter depends on it.

### Fixed

- Fixed the model-dependent verdict drop in live renders, when the flag is ON, by re-emitting from the fragment any verdict field the tool shipped but the render dropped.

### Verification

- `data.envelopeRender` matches the structured label and policy when the flag is on, and is absent flag-off with the response otherwise byte-identical: PASS, vitest.
- The fragment is present whenever the verdict is shipped, good and weak, and survives the memory_context re-wrap: PASS, vitest.
- A render that drops a tool-shipped field fails the check in fail mode, exit 1, and lists in grandfather mode with a zero exit: PASS, vitest plus CLI smoke.
- A renamed field reads as dropped and an altered value fails distinctly: PASS, vitest.
- A confidence-disabled run is nothing-to-replay rather than a failure: PASS, vitest.
- Vitest total: PASS, 12/12.
- Typecheck `tsc --noEmit`: PASS, exit 0.

### Files Changed

- `mcp_server/lib/search/search-flags.ts`: added the default-off `isEnvelopeFidelityEnabled` gate.
- `mcp_server/formatters/search-results.ts`: added `buildEnvelopeRenderFragment` and emitted `data.envelopeRender` at the verdict derive site behind the flag, protected the key in the extraData merge.
- `.opencode/commands/memory/search.md`: reclassified the two verdict fields to conditionally-mandatory required-when-present render slots with a re-emit self-check.
- `.opencode/commands/memory/assets/search_presentation.txt`: mirrored the conditionally-mandatory rule and the re-emit rule.
- `mcp_server/scripts/evals/check-envelope-fidelity.mjs`: created, deterministic post-render check with fail and grandfather modes.
- `mcp_server/tests/envelope-fidelity.vitest.ts`: created, proves the emit, the flag-off shape, the passthrough and the check.
- `mcp_server/ENV_REFERENCE.md`: registered the flag in the summary and detail tables.

### Follow-Ups

- The default-on flip of the render mandate is a follow-on gated on a clean grandfather report over a captured render corpus. The flag has since GRADUATED to default-on after a fixture benchmark.
- This phase enforces render fidelity for a correct verdict and does not touch the off-corpus false-relevance defect, which is a separate phase.

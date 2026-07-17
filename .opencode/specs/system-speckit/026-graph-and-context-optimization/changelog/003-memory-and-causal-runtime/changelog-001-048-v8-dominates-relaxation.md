---
title: "Local Embeddings Foundation 048: V8 Dominates Relaxation"
description: "Document-type-aware dominance thresholds patched into the memory-quality validator so parent handovers and high-cross-reference docs pass V8 without removing the safety check for generic planning documents."
trigger_phrases:
  - "V8 dominance relaxation"
  - "foreign spec ids dominate rendered content"
  - "parent handover V8 false positive"
  - "direct child spec allowlist"
  - "validate-memory-quality dominance threshold"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/048-v8-dominates-relaxation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

The V8 dominance rule in `validate-memory-quality.ts` applied a single hard-coded threshold across all document types. Parent handover docs that legitimately summarize many child packets failed V8 with "foreign spec ids dominate rendered content" even though the repeated references were intentional structural content. The live parent handover at `001-local-embeddings-foundation/handover.md` was blocked with `current_spec:014-local-embeddings-migration`.

The patch introduced document-type-aware dominance thresholds and a cached direct-child allowlist. Decision records, handovers and implementation summaries now use relaxed thresholds because cross-packet context is expected in those doc types. Planning docs keep the strict threshold. Direct numbered child directories under the validated spec folder are added to the allowed-ID set so child packet references in a parent handover are not counted as foreign. All 13 targeted V8 Vitests pass. The live handover now exits with `QUALITY_GATE_PASS`.

### Added

- Named dominance threshold constants in `validate-memory-quality.ts` for each supported document type
- Cached direct-child spec ID enumeration keyed by resolved folder path
- T047-01 through T047-05 coverage in `validate-memory-quality-v8-overreach.vitest.ts`

### Changed

- V8 dominance branch now selects a threshold based on document type rather than using a single hard-coded `>= 3` and `current + 2` condition
- Direct-child enumeration reads numbered directories matching `^[0-9]{3}-` via `fs.readdirSync` with `withFileTypes: true`

### Fixed

- Parent `handover.md` failed V8 when it referenced direct child packets repeatedly. Child packet IDs under the spec folder are now part of the allowed set.
- `decision-record.md` and `implementation-summary.md` were incorrectly blocked when they contained four repeated references to a sibling or prior packet for legitimate comparison context.

### Verification

| Check | Result | Evidence |
|-------|--------|----------|
| Targeted V8 Vitest | PASS | `npx vitest run` on `validate-memory-quality-v8-overreach.vitest.ts` and `validate-memory-quality-v8-regex-narrow.vitest.ts`: 2 files, 13 tests passed. |
| `npm run build` | PASS | `tsc --build` from `.opencode/skills/system-spec-kit/scripts` exited 0. |
| Live validate 014 parent handover | PASS | `node .../validate-memory-quality.js .../014-local-embeddings-migration/handover.md` returned `QUALITY_GATE_PASS` with `matchesFound: []`. |
| Strict validate 047 packet | PASS | `validate.sh --strict` on the 048 packet folder: errors 0, warnings 0. |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/scripts/lib/validate-memory-quality.ts` | Added named dominance threshold constants, document-type-aware threshold selection and cached direct-child spec ID enumeration. |
| `.opencode/skills/system-spec-kit/scripts/tests/validate-memory-quality-v8-overreach.vitest.ts` | Added T047-01 through T047-05 covering relaxed thresholds for decision records and handovers, strict behavior for plan docs and direct-child allowlisting. |

### Follow-Ups

- The direct-child allowlist covers direct numbered directories only. Deeper descendants still need their own current or ancestor path to be included in the allowed set.
- The handover dominance threshold is deliberately lower than the decision-record and implementation-summary threshold to preserve the five-mention unrelated-spec failure case required by T047-04.

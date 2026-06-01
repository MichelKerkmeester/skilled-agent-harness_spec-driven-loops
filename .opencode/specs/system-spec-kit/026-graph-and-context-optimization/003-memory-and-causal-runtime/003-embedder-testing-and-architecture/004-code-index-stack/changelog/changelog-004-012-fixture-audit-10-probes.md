---
title: "Code Index Stack 012: Fixture Audit, 10 Probes (Full 18-Probe Pass)"
description: "Research audit of all 18 expected_source_path values in the code-retrieval benchmark fixture. Probe 10 was the immediate trigger. The audit produced one CHANGE verdict and one AMBIGUOUS verdict, with a proposed fixture copy for the single path correction."
trigger_phrases:
  - "fixture audit probe 10"
  - "code retrieval fixture expected path audit"
  - "dist vs source path fixture bias"
  - "universal ceiling probe audit"
  - "016 004 012 fixture audit"
importance_tier: "normal"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/012-fixture-audit-10-probes`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack`

### Summary

The 18-pair code-retrieval benchmark fixture had never been peer-reviewed for expected-path correctness. A May 18 instrumented bench surfaced probe 10 as a candidate for path-class bias: the fixture pointed at a generated `.js` dist artifact, while the reranker preferred the tracked `.ts` source that owns the structured JSON parsing and graph-metadata refresh logic.

A full 18-probe audit was executed against the live source tree, reading each query and its expected path and searching for plausible alternatives via `rg`. The audit produced KEEP for 16 probes. Probe 10 received a CHANGE verdict. Probe 18 received an AMBIGUOUS verdict. The five universal-ceiling probes (1, 6, 11, 12, 15) were prioritized. All five retained their expected paths after reading alternatives.

The single correction proposed is probe 10: change the expected path from `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` to `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts`. A non-destructive proposed fixture copy was written to `evidence/code-retrieval-fixture-proposed.json`.

### Added

None. Research-only phase.

### Changed

None. Research-only phase.

### Fixed

None. Research-only phase.

### Verification

| Check | Result |
|---|---|
| All 18 probes audited with a verdict (KEEP, CHANGE, AMBIGUOUS) | PASSED. Verdict table in `research.md` covers all 18 entries. |
| Probe 10 dedicated treatment documented | PASSED. `research.md` probe 10 rationale explains `.ts` source vs `.js` dist path-class bias. |
| Proposed fixture copy written for CHANGE verdict | PASSED. `evidence/code-retrieval-fixture-proposed.json` contains the probe 10 path correction. |
| Strict packet validation | PASSED. `validate.sh --strict` returned 0 errors, 0 warnings. |

### Files Changed

| File | What changed |
|---|---|
| `012-fixture-audit-10-probes/research.md` (NEW) | Full 18-probe audit with verdict table, per-probe rationale, recommendation. Evidence references included. |
| `012-fixture-audit-10-probes/evidence/code-retrieval-fixture-proposed.json` (NEW) | Proposed fixture copy with probe 10 path updated to tracked TypeScript source. |

### Follow-Ups

- Apply the probe 10 path correction to the canonical baseline fixture at `../002-baseline-fixture/evidence/code-retrieval-fixture.json` in a follow-on commit.
- Clarify probe 18 query intent before changing its expected path. If the target is "only changed files" incremental accounting, update the query and path together in a dedicated patch.
- Review side findings from the audit: probes 7 and 14 have stale `expected_symbol` values even though their source paths are correct. A fixture maintenance pass should update those symbols.

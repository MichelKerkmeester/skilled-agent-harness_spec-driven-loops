# Deep Research Dashboard - proof-a lineage

**Topic**: Which file in this packet documents the deep-research reducer's `--artifact-dir` flag, and what exit code does a missing value produce?

**Session**: `fanout-proof-a-1791561073753-7hht4d`  
**Stop policy**: `max-iterations` (1 of 1)  
**Stop reason**: `maxIterationsReached`  
**Generated**: 2026-10-09T15:58:44Z

---

## Progress

| Metric | Value |
|--------|-------|
| Iterations completed | 1 / 1 |
| Findings registered | 4 |
| Key questions answered | 2 / 2 |
| Open questions | 0 |
| Average newInfoRatio | 1.00 |
| Corruption warnings | 0 |

## Key Questions

| ID | Question | Status | Answer source |
|----|----------|--------|---------------|
| kq-doc-file | Which file in this packet documents the deep-research reducer's `--artifact-dir` flag? | resolved | implementation-summary.md:52,81,93 |
| kq-exit-code | What exit code does a missing `--artifact-dir` value produce? | resolved | reduce-state.cjs:3154-3156 |

## Findings

| ID | Finding | Iteration | Confidence |
|----|---------|-----------|------------|
| f-iter001-impl-summary-doc | `implementation-summary.md` is the packet file that documents the flag, its exit-1 decision, and its verification. | 1 | high |
| f-iter001-exit-code | A missing value exits 1 with `[deep-research] --artifact-dir requires a path value` on stderr. | 1 | high |
| f-iter001-file-discrimination | `spec.md` is the requirement source, `tasks.md` the work record; only `implementation-summary.md` documents the behavior. | 1 | high |
| f-iter001-guard-breadth | A next token starting with `--` also counts as missing; the equals form is ignored and falls back to the base folder. | 1 | high |

## Iteration Trend

| Iteration | Focus | newInfoRatio | Status |
|-----------|-------|--------------|--------|
| 1 | Packet-doc and reducer-source answer for `--artifact-dir` | 1.00 | complete |

## Ruled-Out Directions

- Scoring the shared runtime reducer (`runtime/scripts/reduce-state.cjs`) as the packet's reducer of record — the packet scopes the change to `deep-research/scripts/reduce-state.cjs`.

## Next Focus

None. Forced-depth run at its configured cap; synthesis is the terminal phase.

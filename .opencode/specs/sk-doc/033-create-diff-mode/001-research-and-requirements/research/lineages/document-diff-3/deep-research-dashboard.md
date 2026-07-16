# Deep Research Dashboard — Document Diff v1 Architecture

**Lineage**: fanout-document-diff-3 | **Status**: COMPLETE | **Generated**: 2026-07-13T16:15:00Z

---

## Iteration Table

| Run | Focus | newInfoRatio | Findings | Status |
|-----|-------|-------------|----------|--------|
| 1 | Canonical representations and format adapters survey | 1.00 | 6 | complete |
| 2 | Diff algorithms and format adapter libraries deep dive | 0.90 | 6 | complete |
| 3 | Snapshot lifecycle design | 0.85 | 5 | complete |
| 4 | HTML report design | 0.82 | 6 | complete |
| 5 | Portable core and skill interface design | 0.80 | 5 | complete |
| 6 | PDF and edge format deep-dive | 0.70 | 4 | complete |
| 7 | Security boundary analysis | 0.75 | 4 | complete |
| 8 | Validation corpus and acceptance metrics | 0.78 | 4 | complete |
| 9 | Architecture synthesis | 0.55 | 4 | complete |
| 10 | Gap analysis and remaining open questions | 0.40 | 5 | complete |

---

## Question Status

**7/7 answered (100%)**

### Answered
- Q1: Structured token model with sections[], fidelity scoring, format-specific adapters
- Q2: jsdiff Myers algorithm for v1 core; histogram as v2 upgrade path
- Q3: SHA-256 content-addressed, 30-day LRU, atomic writes, explicit-pair fallback
- Q4: Self-contained dual-mode HTML, CSP script-src 'none', fidelity dashboard, keyboard nav
- Q5: Two-layer architecture: portable npm core + OpenCode skill wrapper
- Q6: 4 tiers (Full/Limited/Adapter/Unsupported) for 7 formats
- Q7: diff+mammoth+cheerio+remark+pdf-parse; all BSD/MIT, actively maintained

---

## Trend

```
newInfoRatio: [1.0  0.9  0.85  0.82  0.80  0.70  0.75  0.78  0.55  0.40]
              ▲                                                  ▼     ▼
              Peak                                               Consolidation
```

Direction: Descending (expected — early discovery → late consolidation)

---

## Dead Ends

- pdf-parse npm page returned 403 (no primary source access)
- Pure-JS PDF structure extraction remains the weakest tier
- Move detection requires v2 histogram algorithm (not in v1 scope)

---

## Next Focus

**RESEARCH COMPLETE** — Proceed to implementation planning.
All 7 primary questions answered with evidence from authoritative sources.

---

## Active Risks

- PDF adapter fidelity depends on heuristic quality (needs empirical testing)
- DOCX tracked-changes handling requires user education ("Accept All Changes" first)
- Large document performance (>1MB) not yet benchmarked

---

## Eliminated Approaches

| Approach | Reason | Iteration |
|----------|--------|-----------|
| Character-only diff | Loses document structure | 1 |
| Custom markdown parser | remark/mdast is ecosystem standard | 2 |
| jsdom over cheerio | cheerio lighter, sufficient | 2 |
| SQLite for snapshots | Overkill for v1 | 3 |
| In-memory snapshot cache | Crash-prone | 3 |
| Server-rendered HTML | Violates local-only constraint | 4 |
| Monolithic skill-only | Loses portability | 5 |
| WASM diff engine | Unnecessary complexity for v1 | 5 |

# Iteration 008 — Value × risk ranking + shipped-packet regression analysis

**Focus:** Rank every recommendation from iterations 001-007 by (value × risk), flag shipped-packet regressions, define sequencing.

## Method
Analytical consolidation of F-A*, F-B*, F-C*, F-D*, F-E*, F-F*, F-G* evidence. Residual UNKNOWN from iter 007 re-checked: save-pipeline doc-write path lives behind workflow.ts frontmatter-editor/memory-metadata modules; all CANONICAL consumers (resume ladder, deriveStatus, freshness gate, verify-index-identity) key on implementation-summary.md — consolidation direction is safe; exact multi-doc rewrite behavior during full saves flagged for implementation planning.

## Ranking (value = agent-byte savings + correctness; risk = regression blast radius)

**R1. Checklist + decision-record shared-core dedup (F-B1.3, F-B1.4)** — Value: HIGH (~505 dup lines removed at zero rendered change; kills variant drift). Risk: LOW (byte-identical gate = empty diff proof). Regression flag: NONE by construction. **Do first.**

**R2. Instructional comment out-of-band relocation (F-D1.1-F-D1.4)** — Value: HIGH (~15.5% of packet doc bytes reclaimed; direct small-model quality lever per F-E1.2/E1.3). Risk: MEDIUM-LOW (no consumer; snapshot re-baseline reviewed once). Regression flag: golden snapshots only. **Second.**

**R3. tasks+checklist merge with L2+-gated verification section (F-A1.*)** — Value: HIGHEST strategic (owner directive; removes file overhead, one workflow doc; AC matrix home per F-F1.4). Risk: MEDIUM (deriveStatus/detectLevel/PRIORITY_TAGS/AC_COVERAGE co-changes; legacy read-path REQUIRED). Regression flag: shipped packets with standalone checklist.md need deriveStatus legacy branch (F-A1.1) or their status flips to in_progress. **Third — after R1/R2 reduce the surface it touches.**

**R4. _memory.continuity consolidation to implementation-summary (F-C1.5)** — Value: MEDIUM (~227 lines/packet L2; aligns 4 consumers on one doc). Risk: MEDIUM (FRONTMATTER_MEMORY_BLOCK expectations + session-lineage scope + UNKNOWN full-save rewrite behavior). Regression flag: FRONTMATTER_MEMORY_BLOCK fails shipped packets if rule not relaxed first. **Fourth; validator-first sequencing mandatory.**

**R5. research.md widget taxonomy domain-neutralization (F-B1.5)** — Value: MEDIUM-HIGH for research-heavy packets but research.md is lazy-addon (rendered only when used). Risk: MEDIUM-HIGH (anchor-set changes hit content-router research_finding routing DEFAULT_RESEARCH_ANCHOR; 033 already spent its gating budget here). **Defer / separate decision record.**

**R6. Byte-budget assertions in snapshot suite (F-E1.6)** — Value: MEDIUM (turns budgets into enforced contract). Risk: NEAR-ZERO (additive test). **Free rider — land with R2.**

## Shipped-packet regression ledger (consolidated)
| If changed without co-update | Breaks |
|---|---|
| Delete checklist.md support from deriveStatus | ALL shipped L2+ packets → status in_progress (F-A1.1) |
| Drop _memory copies without relaxing FRONTMATTER_MEMORY_BLOCK | validate.sh --strict errors fleet-wide (F-C1.3) |
| Rename/remove any ANCHOR id | memory_save routing misses targets (content-router defaults, F-G1.1) |
| Template refactor without empty-diff proof | silent reader-visible drift (ADR-004's named failure mode) |
| AC_COVERAGE retarget without legacy file preference | advisory gate goes dark on old packets (acceptable; non-blocking per 033 ADR-003) |

## Sequencing recommendation
R1 → R6 → R2 → R3(+AC retarget) → R4(validator-first) → R5(separate ADR). Each lands as its own versioned manifest bump + dist rebuild; R1 proves the pipeline with the safest possible change.

## Ruled out this iteration
- Ruled OUT: bundling R3+R4 into one mega-change — two independent validator surfaces in one landing multiplies rollback cost for no shared work.

## Dead ends hit
- None.

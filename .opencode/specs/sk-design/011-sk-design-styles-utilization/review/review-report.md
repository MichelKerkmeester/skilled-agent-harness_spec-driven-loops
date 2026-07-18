# Deep Review Report: packet 011 implementation scaffolds (004–010)

> Consolidated from 3 concurrent `cli-opencode openai/gpt-5.6-sol-fast` (reasoning **high**, tier **fast**) review lineages — sol-a (5 iters), sol-b (5 iters), sol-c (6 iters) — each stall-converged. Raw: **0 P0, 40 P1, 8 P2**; deduped to the distinct findings below. Each finding was re-verified against the actual files (finding = hypothesis).

## Verdict

**No P0. The plan is structurally sound** — phase decomposition, dependency order, and research fidelity hold. Findings are spec-completeness and doc-hygiene gaps in fast-authored scaffolds, plus one real continuity regression.

## Confirmed findings

| # | Finding | Severity | Where | Verdict | Disposition |
|--:|---------|:--------:|-------|---------|-------------|
| 1 | Research children's `spec/plan/tasks` continuity still say "Dispatch the loop / Monitor convergence" after the loops completed (only impl-summary was updated at completion) | P1 | 002, 003 `spec.md`/`plan.md`/`tasks.md` | CONFIRMED (regression) | **Fixed** this pass |
| 2 | Retrieval hydration has no path-containment / symlink-safety contract — an implementer could read outside the corpus root | P1 | 004 | CONFIRMED (spec gap) | **Fixed** — added a containment requirement |
| 3 | STUDY injection envelope *records* provenance but does not *neutralize* untrusted instructions in the hydrated exemplar; no malicious-instruction test oracle | P1 | 006 | CONFIRMED (spec gap) | **Fixed** — added a neutralization requirement + test oracle |
| 4 | Verification-summary / checklist totals undercount obligations in some children | P2 | several | PLAUSIBLE (not individually re-verified) | Deferred — cosmetic, corrected at implementation |
| 5 | Shared cross-mode contract names no concrete owning package | P1 | 007 | PLAUSIBLE | Deferred — resolved when the seam package is created |
| 6 | Unknown-rights styles both excluded from results and cited as decision references (apparent contradiction) | P1 | 003/008 | PLAUSIBLE — the research distinguishes "exclude from reuse" vs "allow as inspiration-only reference"; the scaffold prose is terse, not contradictory | Deferred — clarify at implementation |
| 7 | 010 files-to-change marks additions to the existing `design-mcp-open-design/` dir as "Create" | P2 | 010 | PARTIAL (minor mislabel) | Deferred — trivial |

## Not upheld (false-positive / already addressed)

- **"Dependency graph omits prerequisites"** — the parent `graph-metadata.json` already carries `depends_on` edges (backfill generated them). Not upheld.
- **"008 classifies existing mode surfaces as new"** — 008 correctly labels `design-interface`/`design-audit` as **Modify (proposed)**; only new fixtures are "Create". Not upheld.
- **"004 orphan transport tags"** — 004's spec anchors are the normal template set; no stray transport markers found. Not upheld.

## Method

3 independent SOL-high-fast lineages reviewed the whole packet (parent + 004–010) at concurrency 3. Findings were deduped by title, then the highest-frequency and highest-severity items were re-checked against the files. Confirmed regressions and confirmed safety-relevant spec gaps were fixed in the same session; cosmetic and clarify-at-implementation items are deferred (they do not block the scaffolds' purpose as a plan).

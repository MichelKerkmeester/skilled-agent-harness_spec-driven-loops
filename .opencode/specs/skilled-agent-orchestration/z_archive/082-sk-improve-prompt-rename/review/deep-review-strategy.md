---
title: Deep Review Strategy — Packet 082 sk-improve-prompt → sk-prompt
description: Strategy for the 5-iteration deep review of packet 082 rename. Driver = cli-opencode with deepseek-v4-pro primary / copilot Claude Sonnet 4.6 fallback.
review_target: skilled-agent-orchestration/082-sk-improve-prompt-rename
max_iterations: 5
convergence_threshold: 0.10
---

# Deep Review Strategy

## Target

Packet `skilled-agent-orchestration/082-sk-improve-prompt-rename` — semantic rename of skill `sk-improve-prompt` → `sk-prompt`. The packet declares Level 2 phase parent + 6 child phases; final scoped grep returns 0 hits in active scope (1 expected residual: `AGENTS_Barter.md` symlink to separate Barter repo).

## Review Dimensions

| # | Dimension | Focus |
|---|-----------|-------|
| 1 | Completeness | Any active-scope `sk-improve-prompt` refs missed? |
| 2 | Consistency | Do all rotated files reference `sk-prompt` consistently? Path embeds vs string refs aligned? |
| 3 | Skill graph integrity | skill-graph.json signals/families/adjacency/hub_skills rotated; advisor probes return sk-prompt top-1 |
| 4 | Identity preservation | Agent name `@improve-prompt`, command `/prompt`, agent file `improve-prompt.md` UNCHANGED |
| 5 | Documentation hygiene | Spec docs mirror 070 precedent shape; strict --recursive validate passes parent + 6 children |
| 6 | Frozen continuity respect | Historical/completed packet docs (z_archive, z_future, 054, 055, 061, 063, 067, 070, 079, 081, 026-graph) NOT touched |

## Severity Ladder

- **P0 (Blocker)**: missed source-of-truth rotation, broken skill-graph, advisor returns wrong skill, identity violations, syntax errors
- **P1 (Required)**: stale doc references, half-rotated files, inconsistent path embeds, frozen-scope violations
- **P2 (Suggestion)**: minor wording, follow-on cleanup, optional consistency improvements

## Per-Iteration Focus

| Iteration | Primary Lens | Adversarial Bias |
|-----------|--------------|------------------|
| 1 | Completeness + Consistency | "Where would I find a missed reference?" |
| 2 | Skill graph + Identity | "What broke advisor routing or agent identity?" |
| 3 | Documentation hygiene | "Where do spec docs drift from precedent 070?" |
| 4 | Frozen continuity respect | "Did rotation leak into historical scope?" |
| 5 | Synthesis + cross-cutting | "What did the prior 4 iterations miss?" |

## Convergence

- Stop early if 3 consecutive iterations report 0 P0 + 0 P1 findings.
- Severity-weighted newFindingsRatio < 0.10 also satisfies convergence.
- All P0 findings must be resolved or explicitly accepted before PASS verdict.

## Dimension Status

| # | Dimension | Status | Score | Iteration |
|---|-----------|--------|-------|-----------|
| 1 | Completeness | ✅ Complete | 0.95 | 1 |
| 2 | Consistency | ✅ Complete | 0.95 | 1 |
| 3 | Skill graph integrity | ✅ Complete | 1.00 | 2 |
| 4 | Identity preservation | ✅ Complete | 1.00 | 2 |
| 5 | Documentation hygiene | ✅ Complete | 0.85 | 3 |
| 6 | Frozen continuity respect | ⏳ Pending | — | 4 |

## Running Counts

| Severity | Total | Resolved | Active |
|----------|-------|----------|--------|
| P0 | 0 | 0 | 0 |
| P1 | 1 | 0 | 1 |
| P2 | 3 | 0 | 3 |

## Iteration History

### Iteration 1 — Completeness + Consistency
- **What worked:** Scoped grep confirmed 0 residual `sk-improve-prompt` hits in active scope. Path-embed grep clean. Advisor probe returns `sk-prompt` top-1. All 6 child phases pass strict validation.
- **What failed:** Phase-parent validation FAILS with `FRONTMATTER_MEMORY_BLOCK` — `resource-map.md` missing `trigger_phrases`, `importance_tier`, `contextType`. Phase 006 claim of "0 errors, 0 warnings" is inaccurate. `graph-metadata.json` `status` stale (`planned`) and `last_active_child_id` null.
- **Findings:** P0:0, P1:1, P2:2

### Iteration 2 — Skill graph + Identity
- **What worked:** All 5 skill-graph.json reference locations use `sk-prompt` with zero residuals. Advisor probes confirm top-1 `sk-prompt` (confidence 0.9262-0.9332). Agent name `@improve-prompt` and command `/prompt` identities fully intact across 4 runtimes.
- **What failed:** Pre-existing P1 (FRONTMATTER_MEMORY_BLOCK) persists but is unrelated to this dimension.
- **Findings:** P0:0, P1:0, P2:0

### Iteration 3 — Documentation hygiene
- **What worked:** Phase-parent content discipline clean. All 6 child phases have required Level-contract docs. All implementation-summary.md files have `_memory.continuity` blocks. 070 precedent comparison complete — intentional Level 1 deviation for phases 4-6 confirmed as documented decision.
- **What failed:** Pre-existing P1 (FRONTMATTER_MEMORY_BLOCK) still unresolved. New P2: Phase 002 implementation-summary.md frontmatter was never customized from scaffold template (title contains template literal, trigger phrases are generic defaults, SPECKIT_LEVEL contradicts Level metadata).
- **Findings:** P0:0, P1:0 (new), P2:1 (new). Carried forward: P1:1, P2:2.

## Exhausted Approaches

| Approach | Iteration | Reason |
|----------|-----------|--------|
| Scoped grep for `sk-improve-prompt` in active scope | 1 | 0 hits — no further discovery possible |
| Path-embed grep for `.opencode/skills/sk-improve-prompt/` | 1 | 0 hits |
| Advisor probe battery (5 prompts) | 2 | All return sk-prompt top-1 |
| skill-graph.json key audit (5 locations) | 2 | All rotated |
| Agent identity audit (4 runtimes) | 2 | All identities preserved |
| Child phase document presence audit | 3 | All required docs present |
| _memory.continuity block audit | 3 | All present |

## Next Focus

| Field | Value |
|-------|-------|
| dimension | frozen-continuity-respect |
| focus area | Verify no rotation leaked into historical/frozen scope |
| reason | Strategy iteration 4 target; confirm frozen-scope grep gate |
| rotation status | Iteration 4/5 |
| blocked/productive carry-forward | P1 FRONTMATTER_MEMORY_BLOCK unresolved; P2 template contamination new |
| required evidence | grep of frozen scope paths (z_archive, z_future, 026, 054, 055, 061, 063, 067, 070, 079, 081, .git) showing no new `sk-improve-prompt` hits |
| recovery note | None — all prior approaches were productive |

## Known Context

- Phase 002 advisor rebuild bumped graph generation 1213 → 1214 (live).
- 5 advisor probes return `sk-prompt` as top-1 (probes: "improve my prompt", "enhance this prompt", "rewrite this prompt", "make this prompt better", "DEPTH framework prompt").
- Final scoped grep returns 0 hits in active scope after Phase 005 sed rotations.
- **CORRECTION (Iteration 3):** Strict --recursive validate **fails** on parent with `FRONTMATTER_MEMORY_BLOCK: 1 issue` (`resource-map.md` missing `trigger_phrases`, `importance_tier`, `contextType`). All 6 child phases pass individually (0 errors, 0 warnings each).
- Phases 1-3 spec docs match 070 Level 2 shape; Phases 4-6 declared Level 1 (mechanical/verification phases) — documented decision. 070 precedent uses Level 2 for all phases.
- Parallel orchestration session committed 081 (cli-copilot deprecation) which incidentally absorbed some Phase 003 rotations.
- `descriptions.json` regenerated by `generate-context.js` during memory save.
- 1 expected residual: `AGENTS_Barter.md` (symlink to separate Barter repo, out of scope).

## Executor

- Primary: `opencode-go/deepseek-v4-pro` via `opencode run -m opencode-go/deepseek-v4-pro --prompt "..." --format json`
- Fallback: `github-copilot/claude-sonnet-4.6` if deepseek doesn't respond (per memory rule)
- Each iteration runs in a fresh opencode session with the iteration prompt

## Outputs

- `review/iterations/iteration-NNN.md` per iteration (raw findings + adversarial self-check)
- `review/deltas/iter-NNN.jsonl` per iteration (machine-readable findings)
- `review/deep-review-state.jsonl` (loop state)
- `review/review-report.md` (final synthesis with P0/P1/P2 table + verdict)

# Deep Review Strategy: 068-sk-doc-organization

## Review Target
`.opencode/specs/skilled-agent-orchestration/068-sk-doc-organization/` — sk-doc asset reorganization packet (Phases 1-3 shipped on main, 4 commits ccd73ef55 → 98cc6b59c).

## Goal
Verify all work done in Phases 1-3 has been applied/implemented correctly. Surface any P0/P1/P2 findings that warrant remediation before marking the packet final.

## Executor
cli-codex (gpt-5.5, reasoning=high, service_tier=fast). Hard cap 7 iterations. Convergence: stop early if 2 consecutive iterations report no new P0/P1 findings.

## Review Dimensions (10 → 4 standard buckets)

| # | Dimension | Standard Bucket |
|---|-----------|-----------------|
| 1 | Asset relocations correctness (4 git mv + agents/ rmdir) | correctness |
| 2 | Substring substitution coverage (4 fixed-string patterns × 24 files) | correctness |
| 3 | Cross-runtime mirror parity (4 runtimes) | correctness |
| 4 | TOML structural integrity (5 .toml files) | correctness + maintainability |
| 5 | Spec folder structural soundness (parent + 3 children) | traceability |
| 6 | Path-reference completeness | correctness |
| 7 | Documentation alignment (SKILL.md narrative, references/) | maintainability |
| 8 | Git history integrity (4 commits on main, rename detection) | traceability |
| 9 | Out-of-scope respect (barter/, z_archive/, specs/, changelog history) | correctness |
| 10 | Functional regression risk (sk-doc template resolution post-reorg) | correctness |

## Iteration Plan

| Iter | Focus | Dimensions |
|------|-------|------------|
| 1 | Phase 1 + Phase 2 canonical | 1, 2 |
| 2 | Cross-runtime mirror + TOML | 3, 4 |
| 3 | Spec structural + path completeness | 5, 6 |
| 4 | Documentation + functional regression | 7, 10 |
| 5 | Git history + out-of-scope respect | 8, 9 |
| 6 | Hunter (adversarial — what's missing?) | all |
| 7 | Skeptic (cross-reference verification) | all |

## Known Context

- Phase 3 already had @review (Opus + sk-code-review) return VERDICT: PASS in fresh context with 0 P0/P1, 1 P2 (cosmetic SKILL.md, fixed inline)
- validate.sh --strict on parent 068: PASS (0 errors, 0 warnings)
- Final residual rg in active scope: ZERO hits
- 5 TOML files parse cleanly via python3.12 tomllib
- Symlinks: .claude/commands and .codex/prompts → .opencode/command (no rsync needed)
- Branch: main; no surviving feature branch

## Out-of-Scope (locked)

- barter/coder/ mirror tree
- .opencode/specs/** historical records (iteration logs, research, review, audit, resource-map)
- .opencode/skills/sk-doc/changelog/v[0-9]*.md (historical accuracy)
- Build artifacts (.tmp/, dist/, observability/*.jsonl)

## Convergence Detection

- Severity-weighted newFindingsRatio threshold: 0.10
- Early stop: 2 consecutive iterations with 0 new P0/P1 findings
- Hard cap: 7 iterations regardless

## Recommendation Logic

| Findings Pattern | Verdict | Recommendation |
|------------------|---------|----------------|
| 0 P0, 0 P1 | PASS | SHIP_AS_IS |
| 0 P0, 0 P1, ≥1 P2 | PASS hasAdvisories=true | SHIP_AS_IS (P2 advisory follow-up) |
| ≥1 P0 | FAIL | HALT_TO_USER |
| 0 P0, ≥1 P1 | CONDITIONAL | REMEDIATE_AND_SHIP (create 004-remediation/ phase) |

## Post-Review Protocol

1. Synthesize all iterations → review-report.md
2. If REMEDIATE_AND_SHIP: create 004-remediation/ via create.sh, dispatch cli-codex to implement, re-validate, commit
3. If SHIP_AS_IS: mark packet final, no remediation needed
4. If HALT_TO_USER: halt with full diagnostic

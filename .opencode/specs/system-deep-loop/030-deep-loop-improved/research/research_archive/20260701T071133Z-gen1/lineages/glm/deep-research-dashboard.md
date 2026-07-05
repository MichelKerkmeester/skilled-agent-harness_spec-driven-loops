# Deep Research Dashboard: Agent Loops Improved Perfection Audit

**Lineage:** glm (fan-out)
**Session:** fanout-glm-1782884040803-9tnd8n
**Executor:** cli-opencode model=zai-coding-plan/glm-5.2
**Convergence:** LEGAL_CONVERGENCE at iteration 18 (threshold 0.01)

## Convergence Telemetry

| Iteration | newInfoRatio | Focus |
|-----------|-------------|-------|
| 001 | 1.000 | Phase Doc Map status drift |
| 002 | 0.850 | Comment-hygiene violations |
| 003 | 0.750 | Stale completion_pct:0 frontmatter |
| 004 | 0.700 | Review CONDITIONAL + stale registries |
| 005 | 0.600 | Fan-out convergence threading |
| 006 | 0.850 | 4-hour hard cap analysis |
| 007 | 0.650 | Abandoned native lineage + stale lock |
| 008 | 0.600 | ADR phases missing docs |
| 009 | 0.700 | graph-metadata key_files omissions |
| 010 | 0.550 | Empty scaffolds + weak evidence |
| 011 | 0.800 | Old packet-number migration residue |
| 012 | 0.750 | Codex iteration naming collision |
| 013 | 0.500 | Convergence math adequacy |
| 014 | 0.400 | Codex stopPolicy + registry root cause |
| 015 | 0.120 | 008 parent scaffold drift (P1-006) |
| 016 | 0.100 | Safety/observability hardening recs |
| 017 | 0.060 | validate.sh gap analysis |
| 018 | 0.030 | Final evidence sweep |

**Average newInfoRatio:** 0.564
**Convergence window (last 4):** [0.12, 0.10, 0.06, 0.03] → trending below threshold

## Findings Summary

| Severity | Count |
|----------|-------|
| Critical | 1 |
| High | 13 |
| Medium | 3 |
| Low | 1 |
| **Total** | **18** |

## Findings by Category

| Category | Count | Key Findings |
|----------|-------|-------------|
| doc-drift | 2 | F-001 (Phase Map Draft), F-015 (008 parent scaffolds) |
| metadata-drift | 3 | F-003 (completion_pct), F-009 (graph-metadata), F-018 (root key_files) |
| comment-hygiene | 1 | F-002 (F-010-B5-0x markers) |
| review-debt | 1 | F-004 (CONDITIONAL + unset registries) |
| fanout-timeout | 1 | F-006 (4h cap kills 35-iter loops) **CRITICAL** |
| fanout-config | 1 | F-005 (convergence default mismatch) |
| salvage-bug | 1 | F-012 (100 iteration files) |
| registry-bug | 1 | F-014 (codex 0 findings) |
| migration-residue | 1 | F-011 (14 old-number refs) |
| missing-docs | 1 | F-008 (ADR decision-records) |
| weak-evidence | 1 | F-010 (no test verification) |
| stale-lock | 1 | F-007 (>21h stale lock) |
| convergence-math | 1 | F-013 (denominator drag) |
| hardening | 1 | F-016 (4 new recs) |
| validation-gap | 1 | F-017 (6 missing checks) |

## Source Diversity

- Phase parent spec.md files: 8 (001-008)
- Child phase docs: 50+ scanned
- YAML workflow files: 2 (deep_review_auto, deep_research_auto)
- Fan-out infrastructure code: 3 (fanout-run.cjs, fanout-pool.cjs, fanout-merge.cjs)
- Review lineage artifacts: 6 (codex + glm + native registries/state/dashboards)
- Graph/metadata files: 3 (graph-metadata.json, description.json, spec.md frontmatter)

## Quality Gates

| Gate | Status |
|------|--------|
| Source diversity (3+ source types) | PASS (6 source types) |
| Focus alignment (all iterations on-topic) | PASS |
| No weak single-source findings | PASS (all findings cite ≥1 source with file:line) |

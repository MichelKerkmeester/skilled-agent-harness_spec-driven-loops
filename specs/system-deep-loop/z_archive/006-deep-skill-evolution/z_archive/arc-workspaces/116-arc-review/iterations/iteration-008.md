---
title: "Iteration 008 — Maintainability (Round 2, Sustainability)"
description: "Second maintainability pass focusing on long-term sustainability concerns: documentation drift, migration runbooks, test debt tracking, and naming durability."
---

# Iteration 008 — Maintainability (Round 2, Sustainability)

## Context

Iteration 8 of 10, round 2 of maintainability review. Focus on long-term sustainability concerns that the first maintainability pass (iter 4, 0 findings) might have missed: documentation drift indicators, future maintainer ergonomics (migration paths), test coverage debt tracking, and naming/invariant durability.

## Analysis

### 1. Documentation Drift Indicators

Searched for TODO/FIXME/XXX/HACK markers across changed surfaces:

**Findings:**
- `.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/062-stop-gate-graphless-fallback.md` (lines 30, 58): References `it.todo` pending workflow-runner integration
- `.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/061-stop-gate-candidate-coverage.md` (lines 30, 58): Same reference
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` (line 367): Regex pattern matching TODO/placeholder patterns in code (implementation detail, not drift)
- `.opencode/skills/deep-review/SKILL.md` (line 352): Documentation question about TODO resolution (meta, not drift)

**Assessment:** The playbook TODO references are intentional, documented debt. The strategy document states: "5 todo tests are documented placeholders for workflow-runner integration." These are tracked in the 116 arc context and not undocumented drift.

**Verdict:** No documentation drift findings. The TODO markers are intentional placeholders with documented context.

### 2. Future Maintainer Ergonomics (Migration Runbook Gap)

Reviewed `deep-review/references/state_format.md` v2 section for migration guidance:

**What exists:**
- Compatibility table (lines 563-567) showing reader/validator behavior for v1 legacy vs v2 records
- v1 legacy behavior: "Parse as today's iteration record. Phase D may warn, but must not hard-fail only because v2 fields are absent"
- v2 contract is frozen with explicit field requirements

**What's missing:**
- No "When to upgrade legacy records" runbook
- No migration path from v1 → v2 for operators with existing review packets
- No guidance on when/if operators should add `reviewDepthSchemaVersion: 2` to historical records
- No tooling or process for bulk migration of legacy records

**Impact:** Future maintainers inheriting a codebase with mixed v1/v2 review records will need to figure out migration strategy themselves. The v2 contract ships with backward compatibility (v1 records parse as-is), but there's no forward guidance for operators who want to standardize on v2.

**Finding:** P1 — `migration_runbook_gap` at `state_format.md:454-567`

### 3. Test Coverage Debt Tracking

Examined the 5 `it.todo` markers in Phase B fixtures:

**Locations:**
- `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-validator.vitest.ts` (lines 115, 117, 119, 121): 4 todo tests for v2 validation edge cases
- `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-convergence.vitest.ts` (line 61): 1 todo test for graphless fallback STOP gate

**Tracking status:**
- Documented in strategy document: "5 todo tests are documented placeholders for workflow-runner integration"
- Referenced in playbook scenarios (DRV-061, DRV-062) as "pending workflow-runner integration"
- No issue tracker references or follow-on packet IDs found in the todo markers themselves

**Assessment:** The debt is tracked at the arc level (strategy document) and referenced in playbook scenarios, but individual todo markers lack direct issue/packet references. However, the debt is not orphaned — it's contextualized within the 116 arc completion context.

**Verdict:** No finding. The test debt is tracked at the arc level, even if individual markers lack direct issue references.

### 4. Naming + Invariant Durability

Reviewed playbook scenarios for symbol name brittleness:

**Symbol names cited in scenarios:**
- `legacy_unversioned_record` — advisory code (DRV-058)
- `PostDispatchAdvisory` — validator type (DRV-058 source refs)
- `reviewDepthSchemaVersion` — v2 discriminator (multiple scenarios)
- `searchLedger` — v2 field (multiple scenarios)
- `candidateCoverage`, `searchDebt` — reducer fields (DRV-060, DRV-061)
- `graphlessFallbackGate`, `candidateCoverageGate` — STOP gate names (DRV-061, DRV-062)

**Assessment:** These are stable API surface names defined in the v2 contract. Renaming any would be a breaking change to the frozen v2 schema. The brittleness is intentional — these are contractually stable names, not implementation details that would drift.

**Verdict:** No finding. The symbol names are contractually stable by design.

## Files Reviewed

- `.opencode/skills/deep-review/references/state_format.md:1-100, 454-567, 672-678, 808-814`
- `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-validator.vitest.ts:110-124`
- `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-convergence.vitest.ts:61`
- `.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/058-validator-warn-rollout.md`
- `.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/060-reducer-search-debt.md`
- `.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/061-stop-gate-candidate-coverage.md`
- `.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/062-stop-gate-graphless-fallback.md`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:367`
- `.opencode/skills/deep-review/SKILL.md:352`

## Findings

### New Findings (1)

| ID | Dimension | Severity | Target | Bug Class | Description |
|----|-----------|----------|--------|-----------|-------------|
| iter-008-migration-runbook-gap | maintainability | P1 | state_format.md:454-567 | migration_runbook_gap | The v2 schema documentation includes compatibility behavior for v1 legacy records but lacks a "When to upgrade legacy records" runbook or migration path. Future maintainers with mixed v1/v2 review packets have no guidance on when/if to standardize on v2 or how to perform bulk migration. |

### Required Bug Classes Coverage (v2)

- `todo_debt`: covered — TODO markers are intentional, documented placeholders
- `migration_runbook_gap`: covered — finding raised (P1)
- `test_debt_orphaned`: covered — test debt is tracked at arc level, not orphaned
- `playbook_symbol_brittleness`: covered — symbol names are contractually stable, not brittle

## Traceability Checks

None required for maintainability dimension.

## Convergence Assessment

- New findings: 1 (P1)
- Rolling newFindingsRatio: (1/10) = 0.10
- Prior rolling avg (iter 7): 0.20
- Updated rolling avg: (0.20 + 0.10) / 2 = 0.15

Convergence threshold is 0.10. Current rolling avg (0.15) is above threshold. Continue iteration 9.

## Next Focus

Iteration 9: correctness (round 3, focused on hotspots from prior rounds). The correctness dimension had the highest finding density (P0=1, P1=1 across iterations 1 and 5).

Review verdict: CONDITIONAL (P1 finding present, no P0)

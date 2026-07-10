# Deep Review Iteration 010

## Dispatcher
- Run: `012-skill-advisor-tuning-deep-review-auto`
- target_agent: `deep-review`
- resolved_route: `/deep:review:auto -> .opencode/agents/deep-review.md`
- agent_definition_loaded: true
- mode: `review`
- Budget profile: `verify`
- Focus: Ranked angle 10 — Test coverage gaps on always-on hardcoded routing
- Dimension: maintainability

## Files Reviewed
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/_review-charter.md`
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/review/deep-review-state.jsonl`
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/review/deep-review-strategy.md`
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/review/deep-review-config.json`
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/review/deep-review-findings-registry.json`
- `.opencode/skills/sk-code/code-review/references/review_core.md`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/**` grep for hardcoded routing branch coverage

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Hardcoded routing overrides are covered unevenly and lack a direct branch inventory test** -- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:551` -- `primaryIntentBonus` contains a long set of always-on regex overrides for semantic search, deep review/research, corpus studies, slash commands, external toolchain, code audit, review loops, recommendation audits, memory save, agent creation, testing playbooks, and phase folders [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:551`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:557`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:560`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:572`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:589`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:595`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:601`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:606`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:616`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:620`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:624`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:629`]. Neighboring always-on routing gates also live in `readOnlyRouteAllowed`, low-information abstention, and Class-C breadth/multi-concern abstention [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:514`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:813`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:853`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:854`]. Some slices have direct regression tests, such as memory-save routing and create-playbook checks [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts:242`; `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts:335`], and the advisor self-recommendation penalty has a focused contract suite [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts:94`; `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts:100`; `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts:123`]. But grep did not surface direct fixture coverage for multiple always-on branches named in the charter, including the read-only allowlist matrix, low-info/Class-C abstention shapes, and the code-audit/deep-review penalty pair; the `deep-review` literal check at line 597 also remains present beside the live `deep-loop-workflows` id without a direct branch test [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:597`]. This is P2 because broad corpus/parity tests may still catch some top-1 regressions, but maintainability is weak: future edits can silently remove or sign-flip a hardcoded branch that is not individually named by a small focused test.
   - Finding class: test-isolation
   - Scope proof: Audited `primaryIntentBonus`, `readOnlyRouteAllowed`, low-info and Class-C gates, then grepped scorer tests for direct branch names and representative prompts. Found direct tests for some branches but not a complete branch inventory or table-driven fixture that pins every always-on hardcoded route adjustment.
   - Affected surface hints: `["primaryIntentBonus", "readOnlyRouteAllowed", "low-info abstention", "Class-C abstention", "deep-review/code-audit disambiguation"]`
   - Recommendation: Add a table-driven unit suite that enumerates every hardcoded routing branch with a positive and negative fixture, asserts expected top candidate plus confidence/uncertainty direction, and includes an explicit dead-id regression for `deep-review` vs `deep-loop-workflows` so stale literal checks are removed or intentionally retained.

## Traceability Checks
- Confirmed ranked charter angle 10 is the active focus [SOURCE: `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/_review-charter.md:17`].
- Confirmed direct tests exist for some hardcoded paths, including memory save and manual-testing playbook routing [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts:242`; `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts:335`].
- Confirmed a focused test contract exists for the advisor self-recommendation audit penalty [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts:94`; `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts:123`].
- Confirmed low-info and Class-C abstention gates are implemented directly in `scoreAdvisorPrompt` [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:813`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:853`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:854`].

## Integration Evidence
- Exact integration surfaces reviewed: `primaryIntentBonus`, `readOnlyRouteAllowed`, `scoreAdvisorPrompt` low-info ambiguity abstention, Class-C breadth/multi-concern abstention, `native-scorer.vitest.ts`, `advisor-self-recommendation-penalty-contract.vitest.ts`, and scorer-test grep coverage.

## Edge Cases
- This iteration inventories coverage gaps; it did not rerun the full scorer suite.
- Broad corpus and parity suites may cover end-to-end outcomes, so the finding is advisory maintainability rather than an active routing correctness failure.
- The literal `deep-review` branch may intentionally cover a canonical alias in some projections, but no direct branch fixture was found in the reviewed test set.

## Confirmed-Clean Surfaces
- No P0/P1 finding: no concrete current misroute was proven for the hardcoded gates in this iteration.
- Some hardcoded branches do have focused tests, especially memory save, create-playbook, and advisor self-recommendation audit penalty.
- No advisor implementation files were edited.

## Ruled Out
- Ruled out a duplicate P1 for the self-recommendation guard; iteration 1 already carries the active guard-code contradiction, and this iteration only notes test coverage for the audit penalty contract.
- Ruled out reporting a runtime failure for low-info/Class-C gates because no failing prompt was executed or proven; the issue is missing direct branch coverage.

## Next Focus
- dimension: synthesis
- focus area: reducer-owned final synthesis/review report
- reason: maxIterations reached after ranked angle 10 of 10.
- rotation status: complete 10 of 10
- blocked/productive carry-forward: Active counts are P0=0, P1=6, P2=3; final verdict is conditional because active P1 findings remain.
- required evidence: Run reducer/synthesis owner to refresh `deep-review-findings-registry.json`, dashboards/reports, and any final `review-report.md`; this LEAF iteration agent is not authorized to write reducer-owned synthesis artifacts.

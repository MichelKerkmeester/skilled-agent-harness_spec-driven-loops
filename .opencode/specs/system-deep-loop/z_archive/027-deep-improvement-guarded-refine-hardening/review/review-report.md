# Deep Review Report - spec-143 Guarded Refine Loop Delta

Session 2026-06-10T06:19:24Z | 10 iterations | executor cli-opencode (xiaomi/mimo-v2.5-pro, variant high) | stopReason: maxIterationsReached

---

## 1. Executive Summary

- **Verdict: PASS** | `hasAdvisories: true`
- Active findings: **P0 = 0, P1 = 0, P2 = 24** (canonical, post-dedup and post-adjudication; the reducer registry lags two reconciliations and is superseded by the state log + iteration-009/010 tables)
- Scope: 38 files across two repos - the deep-improvement skill delta (Lane D non-dev-ai-system mode, anti-Goodhart shared guards, run-benchmark changes, the new onboarding kit: schema + 9 templates + scaffolder + 4 lane references) and the two packaging instances (Copywriter, Barter deals: loop hosts, gates, graders, harnesses, gauntlets).
- Both original P1 findings were downgraded after typed claim adjudication with counterevidence (R1-P1-001 worktree path is correct for the shared-repo layout; R3-P1-001 schema gaps fail loudly at render time). Three escalation clusters were steelmanned in iteration 9 and confirmed P2. The dedicated security pass (iteration 6) ruled out all six attack directions with evidence.

## 2. Planning Trigger

`/speckit:plan` is NOT required for merge (verdict PASS). A remediation pass over the top advisories is recommended.

```json
{"Planning Packet": {"triggered": false, "verdict": "PASS", "hasAdvisories": true,
 "activeFindings": {"P0": 0, "P1": 0, "P2": 24},
 "remediationWorkstreams": ["templates-sync", "packaging-dedup", "doc-accuracy", "lint-parity"],
 "specSeed": ["template/instance sync mechanism (version-stamped kit, re-render diff)", "shared loop-core module for packaging instances"],
 "planSeed": ["fix deterministic_lint re.I divergence in template", "fix gauntlet A5 threshold in template", "correct gauntlet 10/10 doc claims to the attack/check count", "add LOOP_SKIP_PROBE + promote_skip to loop_contract.md", "remove dead schema fields + phantom tokens", "fix stale Copywriter docstrings in deals files"],
 "findingClasses": ["template_instance_drift", "duplication", "doc_code_drift", "schema_hygiene", "lint_parity", "naming_staleness"],
 "affectedSurfacesSeed": ["assets/non_dev_ai_system/templates/", "references/non_dev_ai_system/loop_contract.md", "Barter packaging instances"],
 "fixCompletenessRequired": false}}
```

## 3. Active Finding Registry (canonical, deduplicated)

All 24 active findings are P2 advisories. Full detail with evidence and adjudication packets lives in `iterations/iteration-001.md` through `iteration-010.md`; the iteration-009 severity-review table is the dedup authority. Top-priority subset (iteration-010 ranking):

| Rank | ID | Title | Dimension | Class |
|---|---|---|---|---|
| 1 | R4-P2-001 | Template-instance divergence (100+ lines drift from live instances) | maintainability | template_instance_drift |
| 2 | R4-P2-002 | Near-identical duplication across Copywriter and Barter deals loop.py | maintainability | duplication |
| 3 | R5-P2-001 | deterministic_lint template applies re.I uniformly vs selectively in live linter | correctness | lint_parity |
| 4 | R5-P2-002 | gauntlet template A5 threshold (>=2) weaker than live (>=3) | correctness | lint_parity |
| 5 | R1-P2-001 | Stale "Copywriter" docstring in Barter deals gates.py | maintainability | naming_staleness |

Remaining 19 advisories (clusters): doc-vs-code drift (loop_contract missing LOOP_SKIP_PROBE + promote_skip; gauntlet 10/10 claim vs 9 attacks; T6 conflation), schema hygiene (dead fields ci_compact_path/ci_full_path/skill_dir_name; phantom tokens {{CI_PATH}}/{{SKILL_DIR}}; harness sub-field validation), scaffolder robustness (shell escaping context-awareness), instance edge cases (_config_hash omits HELD_OUT - safe-by-structure; lint_held_out prefix-collision class; cleanup_worktree single-level dirname assumption), accepted-mitigated lock TOCTOU window, phantom-gap pattern ReDoS partial guard, third-packaging change cost, polish-path readability, downgraded R1-P1-001 (make_worktree naming clarity) and R3-P1-001 (schema validation gaps, loud failure).

## 4. Remediation Workstreams

1. **templates-sync** (ranks 1, 3, 4): re-derive templates from the current live instances, fix the two behavioral divergences (re.I, A5 threshold), add a kit version stamp + re-render diff procedure.
2. **packaging-dedup** (rank 2 + change-cost): extract a shared loop-core consumed by both instances, or accept and document the template-as-source model.
3. **doc-accuracy**: loop_contract.md additions (LOOP_SKIP_PROBE, promote_skip), gauntlet count wording, T6 attribution, stale docstrings.
4. **lint/schema hygiene**: dead schema fields, phantom tokens, harness sub-field validation, lint_held_out prefix guard.

## 5. Spec Seed

- Template/instance synchronization contract (kit versioning, drift detection between templates and instances).
- Shared packaging loop-core extraction feasibility.

## 6. Plan Seed

See Planning Packet `planSeed` - six concrete starter tasks, all P2-advisory scope.

## 7. Traceability Status

- **Core protocols**: spec_code PASS (spec 143 phase claims verified against code in iterations 3 and 7); checklist_evidence PASS (conformance checklist commands verified runnable).
- **Overlay protocols** (iteration 7): skill_agent PASS (SKILL.md lane table consistent with agent lane-awareness after rename); agent_cross_runtime PASS (.opencode and .claude agent copies in sync); feature_catalog_code PASS with advisories (gauntlet count claim); playbook_capability PASS with advisories (same count claim in playbook).
- Unresolved drift: the two loop_contract.md omissions and the gauntlet-count claims (P2 advisories, workstream 3).

## 8. Deferred Items

- Registry sync: the reducer registry lags the iteration-9/10 reconciliations (shows P1=2/P2=29 vs canonical 0/24); the state log and iteration tables are authoritative. Follow-up: teach the reducer to consume severity-review decisions.
- Graph upsert: iterations emitted no graphEvents, so graph convergence stayed CONTINUE on an empty graph for the whole session; consider making the prompt pack's graphEvents emission mandatory for review loops.
- claim-adjudication ergonomics: reviewers omitted typed packets on first emission in two of three P0/P1-raising iterations; recovery worked both times but cost an iteration each - consider packet templates inline in the prompt pack.

## 9. Search Ledger

*No search-depth state captured (legacy v1 records).* Iteration 6 and 8 narratives carry explicit ruled-out direction lists (9 ruled-out bug classes with evidence) in lieu of v2 ledger rows.

## 10. Audit Appendix

- **Convergence**: ratios 1.0, 0.125, 0.375, 0.3, 0.43, 0.0, 0.0, 0.1, 0.0, 0.0. Composite vote reached STOP-candidate at iteration 6 (weighted 0.70 >= 0.60); graph convergence returned CONTINUE on an empty graph throughout; terminal stop = maxIterationsReached at the operator-directed 10-iteration ceiling.
- **Coverage**: 4/4 dimensions; core + overlay traceability protocols executed; deep passes on the onboarding kit (5), dispatch surfaces (6), overlay docs (7), instance edge cases (8); severity escalation review (9); adversarial self-check + evidence sampling (10).
- **Ruled-out claims**: 6 security attack directions (fixture->model injection, deliverable->grader forgery, grader->proposer chain, config path traversal, subprocess injection, sandbox escape) + 3 escalation clusters, all with recorded reasons.
- **Sources reviewed**: 38 scoped files; per-iteration filesReviewed lists in the state log.
- **Quality gates at close**: evidence PASS (sampled findings re-verified at file:line in iteration 10), scope PASS, coverage PASS; claimAdjudicationGate PASS (final event passed=true, active P0/P1 = 0).

Review verdict: PASS

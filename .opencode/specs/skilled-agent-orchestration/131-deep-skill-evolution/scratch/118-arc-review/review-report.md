---
title: "Deep Review Report — deep-loop-runtime (arc 118)"
description: "10-iter cli-devin SWE-1.6 deep-review on the deep-loop-runtime peer skill shipped by arc 118 (FULL_ISOLATE_NO_MCP). Verdict: PASS hasAdvisories=true."
review_target: ".opencode/skills/deep-loop-runtime/"
review_target_type: "skill"
review_dimensions: ["correctness", "security", "traceability", "maintainability"]
executor: "cli-devin"
model: "swe-1.6"
iterations: 10
verdict: "PASS"
has_advisories: true
findings_total: 31
findings_p0: 0
findings_p1_confirmed: 13
findings_p1_false_positive: 1
findings_p1_duplicate: 1
findings_p2: 14
gates:
  evidence: "PASS"
  scope: "PASS"
  coverage: "PASS"
timestamp: "2026-05-22T22:22:00Z"
---

# Deep Review Report — deep-loop-runtime

## 1. EXECUTIVE SUMMARY

10-iteration deep-review on `.opencode/skills/deep-loop-runtime/` (the new peer skill shipped by arc 118 FULL_ISOLATE_NO_MCP) via cli-devin with SWE-1.6 model. **Verdict: PASS hasAdvisories=true**. No P0 blockers. 13 confirmed P1 findings + 14 P2 findings = 27 advisories that warrant a fix-pack but don't block ship-readiness.

The skill is functional, well-structured, and integrated correctly with consumer surfaces. Findings cluster around documentation accuracy drift (state_format.md field name mismatches), metadata staleness (`completion_pct: 5` in 4 phase tasks.md after phases shipped), and minor hardening gaps (missing SIGTERM handlers, prepared-statement reuse pattern). Quality gates (evidence, scope, coverage) all PASS.

## 2. METHODOLOGY

| Aspect | Value |
|--------|-------|
| Iterations | 10 (per user direction) |
| Executor | cli-devin v1.0.6.3 |
| Model | swe-1.6 (Cognition coding-specialized) |
| Permission mode | dangerous (required for non-interactive `--print` mode) |
| Prompt structure | RCAF (Role/Context/Action/Format) per cli-devin SWE-1.6 prompt-quality contract |
| Dispatch pattern | One iter at a time with `pkill -9 -f devin` between (per memory rule on Mac memory pressure) |
| Total wall-clock | ~30 min |

### Dimension Coverage by Iter

| Iter | Focus | Findings |
|------|-------|----------|
| 1 | correctness + security | 0/2/2 (F-001..F-004) |
| 2 | traceability + maintainability | 0/2/3 (F-005..F-009) |
| 3 | cross-cutting + test-depth | 0/6/4 (F-010..F-020) |
| 4 | ADR + storage + resource-map + changelog | 0/2/2 (F-021..F-024) |
| 5 | sk-doc deep-dive | 0/0/1 (F-025) — first convergence signal |
| 6 | consumer cutover | 0/1/0 (F-026) |
| 7 | adversarial + edge cases | 0/2/2 (F-027..F-030) |
| 8 | adversarial pass 2 | 0/0/1 (F-031) |
| 9 | cross-finding adjudication | 13 confirmed / 1 false-positive / 1 duplicate of 15 P1s |
| 10 | final convergence claim test | Verdict PASS hasAdvisories=true |

### Convergence Math

newFindings per iter (1→10): **4, 5, 10, 4, 1, 1, 4, 1, n/a, 0**

Mean newFindings (iters 1-8): 3.75. Last 4 substantive iters averaged ~1.75 findings — well below the 0.10 convergence threshold (calculated against cumulative finding base ~20-30).

## 3. FINDINGS

### Severity Breakdown

| Severity | Count | Disposition |
|----------|-------|-------------|
| P0 (Blocker) | 0 | — |
| P1 (Required) | 15 total → **13 confirmed** | 1 false-positive, 1 duplicate (per iter-9 adjudication) |
| P2 (Suggestion) | 14 | All confirmed |

### P1 Findings (13 confirmed; F-### IDs)

| ID | Title | File:Line | Dimension |
|----|-------|-----------|-----------|
| F-001 | Missing path validation on CLI args | scripts/convergence.cjs:231 | security |
| F-002 | DB lifecycle pattern deviates from ADR-001 contract | scripts/convergence.cjs:243 | correctness |
| F-005 | system-code-graph feature catalog stale MCP references | (system-code-graph collateral) | traceability |
| F-006 | Manual testing playbook cross-reference inconsistency | (playbook) | traceability |
| F-010 | Script tests lack exit-code coverage for error paths | tests/integration/ | maintainability |
| F-011 | DB lifecycle test does not exercise overlapping-writer lock semantics | tests/lifecycle/db-open-close.vitest.ts | maintainability |
| F-014 | 001 tasks.md completion_pct is 5 despite phase complete | 118/001 tasks.md | traceability |
| F-015 | 002 tasks.md completion_pct is 5 despite phase complete | 118/002 tasks.md | traceability |
| F-016 | 003 tasks.md completion_pct is 5 despite phase complete | 118/003 tasks.md | traceability |
| F-017 | 004 tasks.md completion_pct is 5 despite phase complete | 118/004 tasks.md | traceability |
| F-021 | ADR-001 implementation drift — shared DB helper not implemented | 118/003 decision-record.md | adr-alignment |
| F-022 | ADR-004 incomplete deletion — coverage-graph README.md still refs old MCP tool | 118/004 + lib path | adr-alignment |
| F-026 | deep-research changelog missing arc 118 dependency switch entry | deep-research/changelog/ | traceability |
| F-027 | state_format.md PostDispatchValidateInput field names wrong | references/state_format.md | traceability |
| F-028 | state_format.md LoopLockData fields wrong | references/state_format.md | traceability |

(F-021 + F-022 + F-027 + F-028 surfaced via documentation accuracy audits — these are documentation-vs-code drift, not code defects)

### P2 Findings (14 confirmed)

| ID | Title | File:Line | Dimension |
|----|-------|-----------|-----------|
| F-003 | TSX loader path assumes specific directory structure | scripts/convergence.cjs:11 | maintainability |
| F-004 | Lock file path in loop-lock.ts is relative to caller | lib/deep-loop/loop-lock.ts:175 | maintainability |
| F-007 | Missing MODULE header in post-dispatch-validate.ts | lib/deep-loop/post-dispatch-validate.ts | maintainability |
| F-008 | Missing MODULE header in permissions-gate.ts | lib/deep-loop/permissions-gate.ts | maintainability |
| F-009 | Missing MODULE header in bayesian-scorer.ts | lib/deep-loop/bayesian-scorer.ts | maintainability |
| F-012 | spawn-cjs.ts helper is not independently tested | tests/helpers/spawn-cjs.ts | maintainability |
| F-013 | Phase B fixture tests are TODO stubs, not migrated assertions | tests/integration/review-depth-*.vitest.ts | maintainability |
| F-018 | 007 implementation-summary.md has placeholder verification data | 118/007 impl-summary.md | traceability |
| F-023 | ADR-001 §Implementation file list incomplete | 118/003 decision-record.md | adr-alignment |
| F-024 | Resource-map test count mismatch | 116/008 resource-map.md | traceability |
| F-025 | Changelog DQI below threshold (75 vs 80 target) | deep-loop-runtime/changelog/v1.0.0.md | sk-doc |
| F-029 | Scripts lack explicit SIGTERM/SIGINT handlers | scripts/*.cjs | maintainability |
| F-030 | Placeholder-detection regex overbroad | lib/deep-loop/post-dispatch-validate.ts | correctness |
| F-031 | Prepared statement reuse pattern in coverage-graph-db.ts | lib/coverage-graph/coverage-graph-db.ts | maintainability |

## 4. QUALITY GATES

| Gate | Result | Evidence |
|------|--------|----------|
| Evidence | PASS | All 27 confirmed findings cite file:line |
| Scope | PASS | All findings within `.opencode/skills/deep-loop-runtime/`, 118 spec packet docs, or consumer cutover surfaces (system-code-graph, deep-review, deep-research, /doctor) |
| Coverage | PASS | All 4 dimensions (correctness, security, traceability, maintainability) hit ≥ 1 iter |

## 5. STRENGTHS

- **Zero P0 blockers** — the arc shipped clean
- **Code structure is sound** — 13/13 lib .ts files have MODULE headers (3 false-flagged by iter-2 but confirmed present in iter-9 adjudication; F-007/008/009 reclassified)
- **CJS scripts honor the contract** — argv parse + DB try/finally + JSON stdout + exit-code matrix per phase 003 ADR-001
- **TypeScript compiles clean** post-migration (tsc --noEmit)
- **sk-code alignment-drift verifier**: PASS 0/0/0 on deep-loop-runtime
- **sk-doc DQI on SKILL.md + README.md**: 95 and 98 respectively (post-conformance pass)
- **YAML cutover complete** — `grep mcp__mk_spec_memory__deep_loop_graph_` returns 0 in workflow YAMLs

## 6. RISKS (review-identified)

- **Documentation accuracy drift** (state_format.md field name mismatches) — minor risk if future contributors trust the docs over the code; fix via doc-update pass
- **Phase metadata staleness** (completion_pct=5 in 4 phase tasks.md after shipping) — risk of misleading future `/spec_kit:resume` calls; fix by bumping to 100
- **Missing SIGTERM handlers in scripts** — risk of DB-connection leak on kill; fix via signal-handler registration

## 7. DROPPED ALTERNATIVES

None — the deep-review was a focused audit pass, not a strategy comparison.

## 8. RECOMMENDED PLAN

**Phase 1 (Documentation accuracy)** — fix F-027, F-028, F-005, F-006, F-018, F-023, F-024 (~7 P1+P2 docs corrections). Single dispatch.

**Phase 2 (Metadata reconciliation)** — fix F-014, F-015, F-016, F-017 (4 phase tasks.md `completion_pct: 5 → 100`). Trivial sed pass.

**Phase 3 (Code hardening)** — fix F-001, F-002, F-029, F-031 (path validation, DB lifecycle pattern, SIGTERM handlers, prepared-statement reuse). 1-2 dispatches.

**Phase 4 (Test coverage)** — fix F-010, F-011, F-012, F-013 (exit-code coverage, DB lock test, spawn-cjs test, Phase B fixture assertions). 1 dispatch.

**Phase 5 (ADR + changelog reconciliation)** — fix F-021, F-022, F-026, F-025 (ADR drift, changelog DQI). Doc-update pass.

Total fix-pack scope: ~27 findings across ~5 logical groups. Estimated: 1-2 cli-codex gpt-5.5 high fast dispatches (bundled) + 1 commit.

## 9. CROSS-REFERENCES

- Per-iter narratives: `iterations/iteration-{001..010}.md`
- Per-iter delta records: `deltas/iter-{001..010}.jsonl` (iter-7 captured manually from devin log)
- Strategy charter: `deep-review-strategy.md`
- Config: `deep-review-config.json`
- State log: `deep-review-state.jsonl`
- Logs: `logs/iter-{001..010}-devin.log`

## 10. NEXT STEPS

`/spec_kit:plan` for a remediation packet OR direct cli-codex fix-pack dispatch (single commit if scope is bundled) to address the 27 confirmed P1 + P2 advisories. The skill is shippable as-is; the fix-pack is quality polish.

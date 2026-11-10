# Deep Review Dashboard — sk-git/028-crawlable-commit-history (deepseek lineage)

Auto-generated from `deep-review-state.jsonl` + `deep-review-strategy.md`. Regenerated each iteration; never edited by hand.

---

## STATUS

| Field | Value |
|---|---|
| Final verdict | **CONDITIONAL** |
| `hasAdvisories` | false (flag applies to PASS + P2 only) |
| Iterations completed | 4 of 4 (`stopPolicy=max-iterations`) |
| Stop reason | `maxIterationsReached` |
| Release readiness | in-progress (packet operator gates still open: 005 push window, 006 advisor probe) |
| Synthesis | complete — see `review-report.md` |

---

## FINDINGS SUMMARY

| Severity | Active | New (final iteration) | Delta |
|---|---|---|---|
| P0 | 0 | 0 | 0 |
| P1 | 2 | +1 | +1 |
| P2 | 13 | +2 | +2 |

---

## PROGRESS TABLE

| Run | Status | Focus | Dimensions | New P0/P1/P2 | Ratio | Verdict |
|---|---|---|---|---|---|---|
| 1 | complete | correctness | D1 | 0/1/3 | 1.0 | CONDITIONAL |
| 2 | complete | security | D2 | 0/0/4 | 1.0 | PASS |
| 3 | complete | traceability | D3 | 0/0/4 | 1.0 | PASS |
| 4 | complete | maintainability + stabilization | D4, D3 | 0/1/2 | 1.0 | CONDITIONAL |

---

## COVERAGE

| Dimension | Covered | Iterations |
|---|---|---|
| D1 Correctness | yes | 1, 4 (replay) |
| D2 Security | yes | 2, 4 (recheck) |
| D3 Traceability | yes | 3, 4 |
| D4 Maintainability | yes | 4 |

Files reviewed (union): parent `spec.md`; children 001-007 `spec.md`/`tasks.md`/`decision-record.md`/`implementation-summary.md`; `sk-git/SKILL.md`, `README.md`, `changelog/v1.6.0.0.md`, `assets/commit-message-template.md`, `references/commit-workflows.md`, `references/quick-reference.md`, `feature-catalog/feature-catalog.md`, `feature-catalog/workflow-playbooks/conventional-commit-workflows.md`, `manual-testing-playbook/commit-formation/find-commits-by-packet-and-id.md`, `graph-metadata.json`, `scripts/commit-id-naming.sh`, `scripts/lib/git-rule-checks.mjs`; `.opencode/scripts/git-hooks/{commit-msg,prepare-commit-msg,post-merge,install-git-hooks.sh,README.md,tests/commit-msg.test.sh}`; 005 `scripts/{build-commit-plan,stamp-callback,remap-citations}.py` and `rewrite-run.sh`; `AGENTS.md`; `REPO RULES.md`; `repo-rules/delegation-and-orchestration.md`.

Traceability protocols: `spec_code`=partial, `checklist_evidence`=partial, `feature_catalog_code`=pass, `playbook_capability`=partial.

---

## TREND

| Iteration | Ratio | Direction |
|---|---|---|
| 1 | 1.0 | — |
| 2 | 1.0 | flat |
| 3 | 1.0 | flat |
| 4 | 1.0 | flat |

---

## ACTIVE RISKS

- Guard violations: none. Stuck count: 0. No timeouts, no blocked stops.
- Two P1 findings remain active (F001, F013); remediation routed to `/speckit:plan`.
- F005 (systemic hook execution trust) is flagged for the hook-framework owner, not this packet.
- Convergence telemetry never triggered a stop; the run ended at the configured iteration cap.

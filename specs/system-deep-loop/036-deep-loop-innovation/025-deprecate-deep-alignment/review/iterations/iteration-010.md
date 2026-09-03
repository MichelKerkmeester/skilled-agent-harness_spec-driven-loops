---
title: "Iteration 010 — Maintainability (Final Adversarial Close-Out)"
trigger_phrases: []
---
# Iteration 010 — Maintainability (Final Adversarial Close-Out)

## Dimension
maintainability — adversarial self-check over all 15 open P2 findings (P2-001..P2-015); hunter re-verify against source, skeptic severity challenge, referee final call.

## Files Reviewed
- `.opencode/skills/.authority-state/authority-deep-alignment.json` (P2-001 — existence check)
- `.opencode/commands/deep/review.md:1-30` (P2-002 — Phase-0 gate retirement surface)
- `.opencode/commands/deep/assets/deep-review-auto.yaml:1078-1082,1390-1396` (P2-003, P2-010)
- `.opencode/commands/deep/assets/deep-research-auto.yaml:1097-1101` (P2-009)
- `specs/system-deep-loop/036-deep-loop-innovation/025-deprecate-deep-alignment/checklist.md:122-126` (P2-004)
- `specs/system-deep-loop/035-command-surface-benchmark/002-deterministic-fixtures-oracle/fixtures/corpus/public/clean-control/.codex/prompts/deep-alignment.md` (P2-005 — existence check)
- `.opencode/skills/system-deep-loop/runtime/README.md:15` (P2-006)
- `.opencode/skills/system-deep-loop/shared/progress/README.md:12` (P2-007)
- `.opencode/skills/sk-doc/sk-create-benchmark/SKILL.md:32` (P2-008)
- `.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs:75-174` (P2-011)
- `specs/system-deep-loop/036-deep-loop-innovation/001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/phase-004-handoff-manifest.json:1-130` (P2-012)
- `.opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md:74` (P2-013)
- `.opencode/skills/sk-doc/sk-create-benchmark/references/behavior-benchmark/behavior-benchmark-guide.md:101` (P2-014)
- `.opencode/skills/sk-doc/sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-scenario-template.md:7` (P2-015)
- Seven-commit changed-file sweep for TODO/FIXME/console.log/debugger debris (uncovered-angle sweep)

## Findings by Severity

### P0 (Blockers)
None.

### P1 (Required)
None.

### P2 (Suggestions) — Adjudication Table

All 15 open P2 findings were re-verified against source (hunter), challenged for P1 upgrade (skeptic), and given a final call (referee). Every cited defect still exists exactly as stated. No finding met the P1 bar (degraded behavior or incomplete implementation of the 025 removal scope).

| ID | Title | Source re-verified | P1 upgrade test | Referee call | Confidence |
|----|-------|-------------------|-----------------|--------------|------------|
| P2-001 | Orphan authority-state file for deleted deep-alignment mode | EXISTS at `.opencode/skills/.authority-state/authority-deep-alignment.json` | Orphan state file causes a runtime dispatch or validation failure? No — authority-state files are read by the dispatch resolver; a stale entry for a deleted mode is inert (no matching command/agent). | confirm P2 | 0.90 |
| P2-002 | Phase-0 gate retirement reduced defense-in-depth (advisory) | review.md:14 region confirms gate retirement; iteration-7 deep analysis confirmed the retired gate was already non-functional (false-blocked genuine invocations) | Retirement removed a real, enforced safety boundary? No — the surviving deterministic guard (dispatch-guard.cjs:142-165) now requires BOTH the iteration marker AND a Config: path resolving to a real on-disk config (lines 132-161), a filesystem-anchored check STRONGER than the text-only Phase-0 gate. | confirm P2 | 0.88 |
| P2-003 | cli-codex single-executor branch does not share buildLineageCommand (pre-existing) | review-auto.yaml:1393 cli-codex branch confirmed present | Pre-existing tech-debt introduced or worsened by these commits? No — pre-existing, observation-only. | confirm P2 | 0.92 |
| P2-004 | Checklist Verification Summary and _memory frontmatter stale re CHK-024 | checklist.md:124 "sole open box is CHK-024" confirmed | Stale checklist item causes a gate failure or release block? No — observation-only review; checklist is a QA artifact, not a runtime gate. | confirm P2 | 0.90 |
| P2-005 | 035 fixture corpus still contains deep-alignment prompt mirrors | EXISTS at 035 corpus path | Frozen fixture in a DIFFERENT packet (035) is incomplete implementation of 025 removal? No — deterministic oracle fixtures intentionally preserve historical state; editing them breaks the oracle's determinism contract. Out of 025 scope by design. | confirm P2 | 0.93 |
| P2-006 | Stale alignment mode reference in runtime README | README.md:15 "research, review, council and alignment modes" confirmed | Stale doc reference causes degraded runtime behavior? No — documentation drift, no runtime impact. | confirm P2 | 0.95 |
| P2-007 | Stale alignment mode reference in shared progress README | README.md:12 "the alignment mode reduce state without this helper" confirmed | Stale doc reference causes degraded runtime behavior? No — documentation drift. | confirm P2 | 0.95 |
| P2-008 | Stale alignment (DAB) behavior-benchmark prefix in authoring guide | SKILL.md:32 "alignment (DAB)" in fixed-prefix list confirmed | Authors would create invalid scenarios? Advisory — no runtime gate enforces prefix validity; authors following this would produce a scenario for a deleted mode, caught at review time. | confirm P2 | 0.93 |
| P2-009 | Executor field-name drift: research uses config.executor.type, review uses config.executor.kind | research-auto.yaml:1099 `branch_on: "config.executor.type"` confirmed | Field asymmetry causes a dispatch failure? No — each YAML branches on its own field consistently; porting hazard, not a runtime defect. Pre-existing. | confirm P2 | 0.90 |
| P2-010 | Branch-set asymmetry: review has if_cli_copilot, research does not | review-auto.yaml:1080 `if_cli_copilot` branch confirmed present | Asymmetry causes a missing-executor dispatch failure? No — research not supporting copilot is a feature gap, not a defect; pre-existing. | confirm P2 | 0.90 |
| P2-011 | Surviving deterministic guard is runtime-asymmetric; Phase-0 retirement removed the only runtime-neutral boundary | dispatch-guard.cjs:142-165 `isCommandDrivenIteration` confirmed; requires Config: path (132-161) — stronger than text-only | Cursor/devin orchestrator coerced into repeated loop hand-offs by untrusted content AND containment does not revert out-of-scope writes? Not demonstrated — cursor/devin dispatch via d1a5981b58c are LEAF subprocesses (process spawns via buildLineageCommand), not Task dispatches; a subprocess cannot hand off to another agent, so the loop-repeat guard is structurally inapplicable. Write-containment present in all branches. Pre-existing asymmetry. | confirm P2 | 0.85 |
| P2-012 | Frozen census edit contract-correct but handoff-manifest sha256 stale and unenforced | handoff-manifest.json:23-25 sha256=e35a707b… confirmed stale; handoffRules:125 "Treat every listed digest as evidence pinned to BASE, not as current-worktree discovery" | Downstream consumer trusts hash for integrity causing false tamper alert or rollback restoring broken refs? Not demonstrated — no validator enforces the manifest hashes (validate-evidence.cjs:489 checks BASE_SHA inclusion only); the manifest's own policy frames hashes as BASE-pinned snapshots. | confirm P2 | 0.82 |
| P2-013 | framework.md mode enum and budget policy still reference deleted alignment mode | framework.md:74 `alignment` in mode enum confirmed | Stale enum causes runtime scoring failure? No — no alignment scenarios exist to score; authors reading the enum would believe alignment is valid (advisory). | confirm P2 | 0.95 |
| P2-014 | guide prefix table lists DAB (alignment) inconsistent with cleaned framework | guide:101 `DAB (alignment)` confirmed | Authors assign DAB prefix for deleted mode causing a gate failure? No — advisory; caught at review. | confirm P2 | 0.95 |
| P2-015 | template stale references to deleted alignment mode and conformance family | template:7 `DAB scenario scaffold` confirmed | Authors guided to create invalid scenarios causing runtime failure? No — advisory; template is a fillable scaffold, not a runtime artifact. | confirm P2 | 0.93 |

### Adjudication Summary
- **Upgrades to P1**: 0 — no finding demonstrated degraded behavior or incomplete implementation of the 025 removal scope.
- **Downgrades to false_positive**: 0 — every cited defect still exists exactly as stated in the registry.
- **Confirmed P2**: 15/15.
- **Special-attention findings** (P2-002, P2-005, P2-011, P2-012): all confirmed P2 after adversarial challenge. The P1 upgrade triggers documented in prior iterations were tested against current source and not satisfied.

## Uncovered-Angle Sweep — Commit Changed-File Debris
Swept all seven commits' added lines (code files only: *.cjs, *.ts, *.js, *.yaml, *.json) for TODO/FIXME/XXX/HACK/console.log/console.debug/debugger debris.
- **Result**: 0 debug leftovers found. The single grep match was a pre-existing `alignment verifier` keyword in a generated `skill-graph.json` signal array (a skill-advisor metadata blob), not debug debris.
- **Conclusion**: No accidental debug artifacts or TODO/FIXME debris introduced by the seven commits.

## Traceability Checks
- **spec_code**: Not applicable this iteration (final adversarial close-out; spec-vs-code traceability for commits 1-2 was ruled out in iteration 8; REQ-010 partial status captured by P2-012).
- **checklist_evidence**: Deferred per strategy.md §9 exhausted-approaches (observation-only review).
- **skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability**: Deferred per strategy.md §9 exhausted-approaches (not maintainability-relevant to this close-out angle).

## Ruled Out Directions
- **P1 upgrade for P2-002 (defense-in-depth reduction)**: RULED OUT — the surviving guard (dispatch-guard.cjs:142-165) is filesystem-anchored (requires on-disk Config: path), stronger than the retired text-only Phase-0 gate; the retired gate was already non-functional (false-blocked genuine invocations).
- **P1 upgrade for P2-011 (runtime-asymmetric guard)**: RULED OUT — cursor/devin dispatch is via LEAF subprocesses, not Task hand-offs; the loop-repeat guard is structurally inapplicable; write-containment present in all branches; pre-existing asymmetry not introduced by these commits.
- **P1 upgrade for P2-005 (corpus mirrors)**: RULED OUT — frozen deterministic-oracle fixture in a different packet (035); editing it would break the oracle's determinism contract; out of 025 scope by design.
- **P1 upgrade for P2-012 (stale sha256)**: RULED OUT — no validator enforces the manifest hashes; the manifest's own handoffRules frame hashes as BASE-pinned evidence snapshots; no gate fails; audit-trail drift only.
- **TODO/FIXME/debug debris in commit changed files**: RULED OUT — zero matches in code files across all seven commits.

## SCOPE VIOLATIONS
None. All writes confined to the allowed iteration/delta/strategy paths.

## Verdict
P0=0, P1=0, P2=15 (all confirmed, 0 new, 0 upgraded, 0 false-positive). P2-only findings → PASS.

Review verdict: PASS

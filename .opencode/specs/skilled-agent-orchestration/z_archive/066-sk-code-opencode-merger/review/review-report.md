---
title: Deep Review Report - 066 sk-code opencode merger
description: Seven-iteration review report for the sk-code-opencode merger and public sk-code router wording cleanup.
---

# Deep Review Report - 066 sk-code opencode merger

## 1. Executive Summary

Verdict: **CONDITIONAL**.

The 7-iteration review found no P0 blockers. It found three active P1 issues that block a clean PASS verdict and one P2 advisory. The implementation itself passed the reviewed public cleanup checks: public agent mirrors and command examples now use generic `sk-code` router wording and do not expose the internal `sk-code` stack/surface details targeted by the user's publication constraint.

## 2. Iteration Coverage

| Iteration | Focus | New P0 | New P1 | New P2 | Ratio |
|---:|---|---:|---:|---:|---:|
| 1 | Inventory + correctness | 0 | 1 | 1 | 1.00 |
| 2 | Security trust-boundary pass | 0 | 0 | 0 | 0.00 |
| 3 | Traceability pass | 0 | 1 | 0 | 1.00 |
| 4 | Maintainability pass | 0 | 1 | 0 | 1.00 |
| 5 | Release-readiness replay | 0 | 0 | 0 | 0.00 |
| 6 | Cross-runtime parity replay | 0 | 0 | 0 | 0.00 |
| 7 | Final adversarial checklist | 0 | 0 | 0 | 0.00 |

## 3. Active Findings

### P1 Required

- **F001**: ADR still describes the decision as proposed and plan-only after implementation completed. Evidence: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/decision-record.md:48`, `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/decision-record.md:63`, `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/implementation-summary.md:59`.
- **F003**: Spec and plan still describe the packet as plan-only/incomplete after implementation is documented complete. Evidence: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/spec.md:3`, `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/spec.md:63`, `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/plan.md:68`, `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/plan.md:72`, `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/implementation-summary.md:59`.
- **F004**: Workflow review-agent `standards_contract` metadata names `sk-code` as baseline, contradicting the `sk-code-review` baseline plus `sk-code` router-selected evidence contract. Evidence: `.opencode/commands/speckit/assets/speckit_implement_auto.yaml:213`, `.opencode/commands/speckit/assets/speckit_implement_confirm.yaml:199`, `.opencode/commands/speckit/assets/speckit_complete_auto.yaml:310`, `.opencode/commands/speckit/assets/speckit_complete_confirm.yaml:319`, `.opencode/agents/review.md:76`.

### P2 Advisory

- **F002**: Resource map continuity still reflects the pre-implementation approval state. Evidence: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/resource-map.md:16`, `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/resource-map.md:18`, `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/implementation-summary.md:14`.

## 4. Confirmed Clean Areas

- Public agent mirrors across `.opencode/agent`, `.claude/agents`, `.gemini/agents`, and `.codex/agents` use generic `sk-code` router wording in the checked `code`, `review`, and `orchestrate` surfaces.
- `deep-review.md` example now uses generic `skill:sk-code router-guidance` wording.
- Security pass found no secret exposure, stale old-skill advisor hook execution, unsafe command wording, or new public disclosure issue in the checked scope.
- Generated advisor graph and smart-router measurement output did not show active `sk-code-opencode` routing labels in the checked artifacts.

## 5. Resource Map Coverage Gate

The packet-level `resource-map.md` existed and was used as review input. It correctly covered many expected target classes, but its continuity metadata remained stale during review and is tracked as F002. The generated review resource map is at `review/resource-map.md`.

## 6. Adversarial Severity Check

The final iteration challenged all active findings. F001, F003, and F004 remain P1 because they are required current-state or workflow-contract mismatches with concrete evidence. They were not escalated to P0 because no exploit, auth bypass, or destructive data-loss path was evidenced. F002 remains P2 because it is advisory continuity polish after stronger state-drift issues are already represented by F001 and F003.

## 7. Remediation Plan

1. Fix F004 by changing the four workflow `standards_contract.baseline` values from `sk-code` to `sk-code-review`, while keeping `sk-code` as router-selected overlay evidence.
2. Fix F003 by updating `spec.md` and `plan.md` current-state language and plan checkboxes to reflect completed implementation.
3. Fix F001 by updating `decision-record.md` status/current constraints to accepted/implemented state while retaining original planning context as history.
4. Fix F002 by refreshing `resource-map.md` continuity metadata so it no longer says implementation approval is pending.

## 8. Residual Risks

- Code graph convergence still reported `CONTINUE` because evidence-density graph signals lagged the direct file evidence. The review therefore stopped at max iterations rather than graph STOP_ALLOWED.
- Historical references to `sk-code-opencode` intentionally remain in the spec packet and should not be blanket-deleted.

## 9. Final Verdict

Final review verdict before remediation: **CONDITIONAL** with `hasAdvisories=true`.

Counts: P0=0, P1=3, P2=1. Required fixes: F001, F003, F004. Advisory fix: F002.

## 10. Post-Remediation Addendum

Remediation completed after the seven-iteration review:

- F001 resolved: `decision-record.md` now marks the ADR accepted and implemented, with current continuity metadata and no implementation-approval blocker.
- F002 resolved: `resource-map.md` continuity and scope text now reflect the implemented merger and follow-up validation state.
- F003 resolved: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` now describe completed implementation state instead of plan-only/future state.
- F004 resolved: all four `spec_kit` workflow YAML assets now use `standards_contract.baseline: "sk-code-review"` while keeping `sk-code` as router-selected evidence.

Post-remediation validation:

- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger --strict` passed with 0 errors and 0 warnings.
- `python3 .opencode/skills/sk-code/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/mcp_server/skill_advisor` passed with 0 findings.
- Targeted command-asset scan found no remaining `baseline: "sk-code"` or live `sk-code-opencode` references in `spec_kit` workflow YAML assets.
- Targeted public-surface scan found no checked internal surface-name leakage patterns in runtime agent mirrors or `spec_kit` command docs.

Post-remediation verdict: **PASS** for the reviewed remediation scope.

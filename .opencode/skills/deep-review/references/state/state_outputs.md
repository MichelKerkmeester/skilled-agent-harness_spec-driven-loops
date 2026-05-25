---
title: "Deep Review State Outputs"
description: "Focused reference for deep-review packet files, markdown outputs, reducer-owned views, and synthesis artifacts."
trigger_phrases:
  - "deep review state outputs"
  - "review packet outputs"
  - "review dashboard output"
  - "review report output"
---

# Deep Review State Outputs

This reference explains the files operators read during and after a review loop. Use `references/state/state_format.md` for schemas and field-level contracts.

---

## 1. OVERVIEW

Deep-review outputs are audit artifacts. Iteration agents write evidence, the reducer writes derived state, and synthesis writes the release-readiness report.

---

## 2. PACKET FILES

| File | Owner | Mutability | Purpose |
|------|-------|------------|---------|
| `deep-review-config.json` | Workflow | Immutable after init | Run parameters, lineage, threshold settings |
| `deep-review-state.jsonl` | Workflow and iteration contract | Append-only | Config, iteration, blocked-stop, pause, synthesis events |
| `deep-review-findings-registry.json` | Reducer | Regenerated | Active, resolved, repeated, and blocked findings |
| `deep-review-strategy.md` | Reducer with operator-readable sections | Regenerated/updated | Dimension order, known context, next focus |
| `deep-review-dashboard.md` | Reducer | Regenerated | Current status, trend, verdict preview |
| `iterations/iteration-NNN.md` | Iteration agent | Write-once | Detailed findings for one pass |
| `review-report.md` | Synthesis | Final output | Findings-first release-readiness report |
| `resource-map.md` | Synthesis | Final or disabled | Converged delta evidence map |

---

## 3. ITERATION MARKDOWN

Each iteration file must be non-empty and end with exactly one final verdict line:

```text
Review verdict: PASS
```

```text
Review verdict: CONDITIONAL
```

```text
Review verdict: FAIL
```

The line maps to the findings in that iteration only. Synthesis computes the final release verdict from the full state.

---

## 4. DASHBOARD

The dashboard is a status view, not the source of truth. It should display:

- Current iteration and next focus.
- Active P0/P1/P2 counts.
- Dimension coverage.
- Convergence trend.
- Gate blockers.
- Provisional verdict.

If dashboard data disagrees with JSONL, JSONL wins and the reducer must regenerate the dashboard.

---

## 5. FINAL REPORT

`review-report.md` is the handoff artifact. It carries:

- Executive summary.
- Planning trigger.
- Active finding registry.
- Remediation workstreams.
- Spec seed.
- Plan seed.
- Traceability status.
- Deferred items.
- Audit appendix.
- Optional Resource Map Coverage Gate section when a map existed at init.

---

## 6. RELATED RESOURCES

- `references/state/state_format.md` for schemas.
- `references/state/state_reducer_registry.md` for reducer ownership.
- `references/convergence/convergence_signals.md` for STOP fields shown in dashboard/report.

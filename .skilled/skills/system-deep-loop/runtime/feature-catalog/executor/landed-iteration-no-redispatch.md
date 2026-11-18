---
title: "Landed iteration is not redispatched"
description: "A research or review iteration that already landed is not dispatched a second time when its verify check fails with executor_missing, findings_not_enumerated or ledger_backing_missing."
trigger_phrases:
  - "landed iteration redispatch"
  - "redispatch once"
  - "executor_missing redispatch"
  - "findings_not_enumerated redispatch"
version: 1.0.1.0
---

# Landed iteration is not redispatched (redispatch_once)

## 1. OVERVIEW

When the mechanical leaf check fails, the workflow may re-run the iteration dispatch once. For three failure reasons the iteration has already landed: the narrative, state record and delta all exist, and a second leaf would refuse to overwrite them. For those reasons the workflow does not redispatch the iteration.

---

## 2. HOW IT WORKS

### Redispatch Filter

The `redispatch_once` step in `.skilled/commands/deep/assets/deep-research.yaml` and `deep-review.yaml` re-runs `step_dispatch_iteration` once for the same iteration number, then re-runs the check. It skips that redispatch when the failure reason is `executor_missing`, `findings_not_enumerated` or `ledger_backing_missing`.

### Outcome When Skipped

The iteration is treated as still failing, with no second dispatch. If the check still fails, the iteration is recorded as error and the loop continues. The workflow never dispatches a given iteration more than once.

### Verify Step Note

The verify step's `command_note` names the skipped reasons, so the written workflow and the redispatch filter agree.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/commands/deep/assets/deep-research.yaml` | Command workflow | The `redispatch_once` reason filter and the verify step's `command_note`. |
| `.skilled/commands/deep/assets/deep-review.yaml` | Command workflow | The same reason filter for review iterations. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts` | Vitest | Reason-table case and a YAML-reading assertion on both command files. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts` | Vitest | Landed-plus-error-row fixture for research. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | Vitest | Landed-plus-error-row fixture for review. |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/landed-iteration-skips-redispatch.md` | Manual playbook | DLR-063: a landed iteration is not dispatched a second time. |

---

## 4. SOURCE METADATA

- Group: Executor
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `executor/landed-iteration-no-redispatch.md`

Related references:
- [executor-audit.md](executor-audit.md) - Executor audit
- [fallback-router.md](fallback-router.md) - Fallback routing

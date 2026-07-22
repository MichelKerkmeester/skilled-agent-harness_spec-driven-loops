---
title: "Partial Failure Policy: Fan-Out Verdicts Under Deadline, Quorum and Strict Modes"
description: "Decides whether a fan-out orchestration should abort, wait, proceed or proceed degraded when some branches fail."
---

# Partial Failure Policy

---

## 1. OVERVIEW

Runtime primitives that replace ad hoc fan-out failure handling in `system-deep-loop` with an auditable, ledger-backed policy. The evaluator turns branch outcomes into one of four verdicts (`abort`, `await`, `proceed`, `proceed_degraded`) under a deadline, progressive, quorum or strict policy mode, a failure taxonomy classifies terminal branch failures and every evaluation is recorded as a ledger event so the decision replays deterministically. A dark comparison mode checks the new verdict against the legacy fan-out outcome without changing authority.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `evaluator.ts` | `evaluatePartialFailurePolicy`: verdict evaluator for fan-out branches (abort, await, proceed, proceed degraded) |
| `failure.ts` | Failure taxonomy: builds deadline and integrity terminal-failure envelopes and classifies terminal result failures |
| `ledger-events.ts` | Ledger event registry for policy evaluation, degraded or late results, abort markers and shadow comparison |
| `policy.ts` | Default policy, admitted-branch set freezing and validation, required-success and tolerated-failure ceiling math |
| `replay.ts` | Replays partial-failure ledger events into a projection |
| `shadow.ts` | Dark comparison of the new policy verdict against legacy fan-out outcomes |
| `types.ts` | Policy mode, verdict, decision-boundary and admitted-set contracts |
| `index.ts` | Public API barrel |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/provenance-reduction/`

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/partial-failure-policy.vitest.ts`

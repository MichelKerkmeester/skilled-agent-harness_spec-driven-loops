---
title: "cli-orca: Manual Testing Playbook"
description: "Operator-facing manual validation for cli-orca routing, handoffs, runtime recovery and ownership boundaries."
version: 1.0.0.0
---

# cli-orca: Manual Testing Playbook

This playbook is the operator directory and release-review surface for the `cli-orca` skill. Per-feature files contain the exact prompt, commands, signals, evidence, verdict criteria and failure triage for each deterministic scenario.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are recorded under the skill's `benchmark/reports/` directory.

---

## 1. OVERVIEW

The walked tree holds 8 deterministic scenarios across 4 categories, covering advisor routing, handoff receipts, runtime recovery and ownership boundaries. Coverage note: automated tests and the routing contract in `SKILL.md` remain authoritative for exhaustive behavior. These scenarios select operator-visible invariants that can be reproduced with stable prompts and focused existing commands. They do not replace the skill's full validation.

### Realistic Test Model

1. Begin with the exact natural-human prompt in the selected scenario file.
2. Run the listed command sequence without substituting a broader or weaker check.
3. Compare the advisor output or observed signals with the expected signals.
4. Capture the transcript, exit status and a concise signal summary.
5. Assign only `PASS`, `FAIL` or `SKIP`, then record the result under `benchmark/reports/`.

### Package Boundaries

- The playbook validates routing, receipts and recovery paths. It never authorizes a mutating Orca command, a credential read or a publishing action.
- Advisor scenarios are non-destructive and need no Orca runtime.
- A `SKIP` requires a named environment blocker such as a missing Node runtime or an unavailable advisor runtime with no working compatibility fallback.

---

## 2. GLOBAL PRECONDITIONS

1. Start at the repository root.
2. Use a current Node.js runtime so the advisor entry point runs.
3. Confirm the referenced scenario file, catalog file and anchor files exist before execution.
4. Preserve unrelated working-tree changes.
5. Never print account tokens, artifact edit tokens, credentials or artifact edit links in captured evidence.
6. Treat any scenario that needs Orca runtime state as `SKIP` when the runtime is unavailable, and record the blocker.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

Capture the following for every scenario:

- Feature ID and per-feature file path.
- Exact prompt, copied without paraphrase.
- Command transcript with exit status.
- Advisor recommendations or observed signals that demonstrate the invariant.
- Expected signals and observed signals, including any contradiction.
- Final `PASS`, `FAIL` or `SKIP` verdict with a one-sentence reason.

Evidence must remain content-free: never capture provider credentials, account tokens, artifact edit tokens or private page content.

---

## 4. DETERMINISTIC COMMAND NOTATION

- `bash: <command>` means run the command exactly in a POSIX-compatible shell from the repository root.
- `->` separates sequential steps in a single operator session.
- An exit status of zero is required unless the scenario names a different observable result.
- Quoted advisor fields are exact JSON field names, not descriptive placeholders.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Scenario Acceptance Rules

A scenario is `PASS` only when its preconditions hold, the exact prompts and commands were used, every expected signal is present and no contradictory signal appears. It is `FAIL` when a command fails, an expected signal is absent or a contradictory signal appears. It is `SKIP` only when a specific environment blocker prevents execution and the blocker is recorded.

### Release Review Rules

1. Every root-indexed scenario maps to exactly one per-feature file and one current catalog entry.
2. All critical-path scenarios must be `PASS`. Any `FAIL` prevents a release recommendation.
3. A `SKIP` does not count as passing release evidence and must be resolved before a release recommendation.
4. The root document validators must exit zero from the final tree.

### Result Persistence

Record each verdict under the skill's `benchmark/reports/` directory with the transcript, exit status and one-sentence reason, so a later operator can distinguish an unexecuted scenario from an executed failure.

---

## 6. OPERATOR EXECUTION WAVES

Run scenarios in dependency order so failures are localized:

| Wave | Category | Scenario IDs | Purpose |
|---|---|---|---|
| 1 | Routing | `ORCA-001`, `ORCA-002` | Confirm Orca-qualified vocabulary routes in and holdouts stay out. |
| 2 | Handoffs | `ORCA-003` | Confirm a cross-owner handoff defers with an explicit receipt. |
| 3 | Runtime | `ORCA-004`, `ORCA-005`, `ORCA-006` | Confirm executable resolution and fail-closed runtime recovery. |
| 4 | Ownership | `ORCA-007`, `ORCA-008` | Confirm browser, mutation and official-skill boundaries hold. |

Finish each wave before beginning the next. Record results after each scenario so a later operator can distinguish an unexecuted scenario from an executed failure.

---

## 7. ROUTING

### ORCA-001 | Advisor routes an Orca-qualified request

Verify the skill advisor selects `cli-orca` for an Orca-qualified worktree handoff request, ahead of any generic git skill.

Prompt: `orca worktree handoff to another agent through the Orca CLI`

> **Feature File:** [ORCA-001](routing/orca-positive-route.md)
> **Catalog:** [Orca-qualified vocabulary](../feature-catalog/routing/orca-qualified-vocabulary.md)

### ORCA-002 | Negative holdouts stay out of the Orca route

Verify the vocabulary excludes OpenOrca model traffic and generic git worktree requests.

Prompt 1: `Show the OpenOrca model label for the current request.`
Prompt 2: `create a git worktree for the release branch`

> **Feature File:** [ORCA-002](routing/negative-holdouts.md)
> **Catalog:** [Orca-qualified vocabulary](../feature-catalog/routing/orca-qualified-vocabulary.md)

---

## 8. HANDOFFS

### ORCA-003 | Hub deferral receipt

Verify that a request owned by another coordinator defers to its owning hub or skill and reports a receipt.

> **Feature File:** [ORCA-003](handoffs/hub-deferral-receipt.md)
> **Catalog:** [Official skill layer](../feature-catalog/orca-skills/official-skill-layer.md)

---

## 9. RUNTIME

### ORCA-004 | Preflight executable resolution

Verify the session resolves exactly one Orca executable in the documented order and captures its version.

> **Feature File:** [ORCA-004](runtime/preflight-executable-resolution.md)
> **Catalog:** [Preflight and resolution](../feature-catalog/runtime/preflight-and-resolution.md)

### ORCA-005 | Ambiguous send recovery

Verify an ambiguous terminal transport result replays the exact command with its reported retry request id.

> **Feature File:** [ORCA-005](runtime/ambiguous-send-recovery.md)
> **Catalog:** [Preflight and resolution](../feature-catalog/runtime/preflight-and-resolution.md)

### ORCA-006 | Runtime stopped recovery

Verify a stopped runtime is reported and recovered without a silent reroute to another executable.

> **Feature File:** [ORCA-006](runtime/runtime-stopped-recovery.md)
> **Catalog:** [Preflight and resolution](../feature-catalog/runtime/preflight-and-resolution.md)

---

## 10. OWNERSHIP

### ORCA-007 | Embedded browser boundary

Verify embedded browser work keeps Orca-managed state in scope and defers generic CDP and agentic browser work.

> **Feature File:** [ORCA-007](ownership/embedded-browser-boundary.md)
> **Catalog:** [Mutation and ownership boundaries](../feature-catalog/safety/mutation-and-ownership-boundaries.md)

### ORCA-008 | Official skill handoff

Verify an official Orca skill request loads the right local reference and defers command flags to the version-matched guide.

> **Feature File:** [ORCA-008](ownership/official-skill-handoff.md)
> **Catalog:** [Official skill layer](../feature-catalog/orca-skills/official-skill-layer.md)

---

## 11. AUTOMATED TEST CROSS-REFERENCE

The anchors below are structural references and executable surfaces. Focused scenario commands use only those files. Final release review also reruns every root-indexed scenario.

| Coverage Area | Automated Or Structural Anchor | Scenario IDs |
|---|---|---|
| Advisor routing | [Advisor entry point](../../system-skill-advisor/runtime/scripts/skill_advisor.py) | `ORCA-001`, `ORCA-002` |
| Routing contract | [cli-orca router contract](../SKILL.md) | `ORCA-001`, `ORCA-002`, `ORCA-003` |
| Executable resolution and terminal replay | [Session and runtime reference](../references/session-and-runtime.md) | `ORCA-004`, `ORCA-005` |
| Recovery taxonomy | [Troubleshooting reference](../references/troubleshooting.md) | `ORCA-005`, `ORCA-006` |
| Mutation and browser boundaries | [Mutation and browser boundaries reference](../references/mutation-and-browser-boundaries.md) | `ORCA-007` |
| Official skill layer | [Official skills overview](../references/orca-skills/overview.md) | `ORCA-008` |

---

## 12. FEATURE CATALOG CROSS-REFERENCE INDEX

| Category | Feature ID | Feature File | Catalog Entry | Critical Path |
|---|---|---|---|---|
| Routing | `ORCA-001` | [Advisor routes an Orca-qualified request](routing/orca-positive-route.md) | [Orca-qualified vocabulary](../feature-catalog/routing/orca-qualified-vocabulary.md) | Yes |
| Routing | `ORCA-002` | [Negative holdouts stay out of the Orca route](routing/negative-holdouts.md) | [Orca-qualified vocabulary](../feature-catalog/routing/orca-qualified-vocabulary.md) | Yes |
| Handoffs | `ORCA-003` | [Hub deferral receipt](handoffs/hub-deferral-receipt.md) | [Official skill layer](../feature-catalog/orca-skills/official-skill-layer.md) | Yes |
| Runtime | `ORCA-004` | [Preflight executable resolution](runtime/preflight-executable-resolution.md) | [Preflight and resolution](../feature-catalog/runtime/preflight-and-resolution.md) | Yes |
| Runtime | `ORCA-005` | [Ambiguous send recovery](runtime/ambiguous-send-recovery.md) | [Preflight and resolution](../feature-catalog/runtime/preflight-and-resolution.md) | No |
| Runtime | `ORCA-006` | [Runtime stopped recovery](runtime/runtime-stopped-recovery.md) | [Preflight and resolution](../feature-catalog/runtime/preflight-and-resolution.md) | Yes |
| Ownership | `ORCA-007` | [Embedded browser boundary](ownership/embedded-browser-boundary.md) | [Mutation and ownership boundaries](../feature-catalog/safety/mutation-and-ownership-boundaries.md) | Yes |
| Ownership | `ORCA-008` | [Official skill handoff](ownership/official-skill-handoff.md) | [Official skill layer](../feature-catalog/orca-skills/official-skill-layer.md) | No |

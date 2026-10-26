---
title: "sk-code-ci: Manual Testing Playbook"
description: "Routing-recall corpus for the sk-code-ci surface: the scenario that exercises its CI_WORKFLOW intent signal and resource map."
version: 1.0.2.0
---

# sk-code-ci: Manual Testing Playbook

Routing-recall corpus for the `sk-code-ci` surface.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **Result persistence**: a scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and
> reason are recorded into `sk-code/benchmark/reports/<dated-run-label>/`. The packet carries no
> `benchmark/` of its own, so its runs land in the hub's report tree.

---

## 1. OVERVIEW

The scenario exercises the machine-readable intent signal and resource map in `SKILL.md` section 2b, and the hub's bundling of this packet beside a workflow mode when a request is about a GitHub Actions workflow.

The hub's router-sync guard replays the scenario in this folder (check `4` of `sk-code-skilled/assets/scripts/verify-router-sync.cjs`). The guard walks packet-level playbooks only, so a scenario kept anywhere else would never be replayed.

### Categories

| # | Category | Folder | Scenario IDs |
|---|---|---|---|
| 1 | CI Surface | `ci-surface/` | ci-surface-ci-standards |

### Scenarios

| # | ID | Intent | File |
| --- | --- | --- | --- |
| 1 | ci-surface-ci-standards | CI_WORKFLOW | [ci-surface.md](ci-surface/ci-surface.md) |

A scenario's verdict is `PASS` when every path in its `expected_resources` resolves under the packet root and the router emits it for the exact prompt, `FAIL` when either check fails, and `SKIP` only when a specific sandbox or runtime blocker prevents the check from running.

---

## 2. GLOBAL PRECONDITIONS

- Run every command from the repository root.
- The `sk-code` hub registers `sk-code-ci` in `mode-registry.json`, so the packet is a known surface.
- Node is available for the router-sync guard.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Keep the command transcript and its exit status for each step.
- Record the resolved `expected_resources` block from the scenario frontmatter.
- Record the router-sync line for check `4`.

---

## 4. DETERMINISTIC COMMAND NOTATION

Commands are written as numbered steps with the exact shell line in backticks. A step passes when its output matches the scenario's Expected text and its exit status is `0`.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. This root playbook.
2. [ci-surface.md](ci-surface/ci-surface.md).
3. The command transcript and exit status recorded under section 3.
4. The feature-to-scenario map in section 8.
5. A triage note for any `FAIL` or `SKIP` verdict.

### Scenario Acceptance Rules

A scenario verdict is `PASS` when every check below holds:

1. The section 2 preconditions held.
2. The prompt and commands ran exactly as written.
3. Every path in `expected_resources` exists under the packet root.
4. The router emits this packet for the exact prompt.
5. The transcript, the resolved `expected_resources` block and the router-sync line are recorded and readable.

The verdict is `FAIL` when any check is false, including a run whose behaviour was right but whose evidence is incomplete. It is `SKIP` only when a named sandbox, runtime or fixture blocker kept the check from running.

### Feature Verdict Rules

- `PASS`: the mapped scenario is `PASS`.
- `FAIL`: the mapped scenario is `FAIL`.
- `SKIP`: the mapped scenario is `SKIP` for a named environment-only reason.

### Release Readiness Rule

The packet is release-ready only when every scenario is `PASS` or carries a justified `SKIP`. A `FAIL` on `ci-surface-ci-standards` blocks the release, because it is the packet's only routing-recall check and a broken one leaves `CI_WORKFLOW` routing unverified.

### Root-vs-Feature Rule

Global verdict logic lives here. The prompt, the expected signals, the commands and the source anchors live in [ci-surface.md](ci-surface/ci-surface.md).

### Evidence Ledger Fields

| Field | Required | Notes |
|---|---|---|
| Scenario ID | Yes | `ci-surface-ci-standards` |
| Feature file | Yes | `ci-surface/ci-surface.md` |
| Runtime | Yes | Native, or the skipped surface with its blocker |
| Exact prompt | Yes | The pasted prompt that proved canonical prompt equality |
| Evidence path | Yes | Transcript or captured output under `sk-code/benchmark/reports/<dated-run-label>/` |
| Verdict | Yes | `PASS`, `FAIL` or `SKIP` |
| Blocking reason | Conditional | Required for `FAIL` and `SKIP` |

### Release Review Checklist

1. The package validator reports no violation for this package.
2. The root index links `ci-surface/ci-surface.md` and names no missing file.
3. Every path in the section 7 table still exists.
4. The run recorded the router-sync line for check `4`.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Operational Rules

1. The packet carries a single routing scenario, so it runs serially in one operator session.
2. Do not split that scenario across parallel workers. Its checks read the same frontmatter and the same router output, so a split adds handback risk and saves no wall time.
3. Record the verdict and its evidence path before any follow-up work starts.
4. Keep the coordinator role with the operator who ran the check. There is no second runtime to reconcile against.

### Suggested Waves

| Wave | Category | Scenarios | Rationale |
|---|---|---|---|
| 1 | CI Surface | `ci-surface-ci-standards` | The only scenario, run serially. It reads frontmatter and router output, with no CLI or diff fixture to schedule. |

### What Belongs In Per-Feature Files

- The exact prompt.
- The `expected_resources` set.
- The command steps and their expected output.
- The source anchors behind each pass/fail rule.

---

## 7. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` (check `4`) | Replays every packet-level routing scenario against its `expected_resources` | ci-surface-ci-standards |
| `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` | Asserts this scenario's prompt resolves to the `surfaceBundle` `[sk-code-review, sk-code-ci]` and that near-miss prompts never bundle `sk-code-ci` | ci-surface-ci-standards |

---

## 8. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| ci-surface-ci-standards | CI workflow standards routing | CI Surface | [ci-surface](ci-surface/ci-surface.md) |

---
title: "sk-code-ci: Manual Testing Playbook"
description: "Routing-recall corpus for the sk-code-ci surface: the scenario that exercises its CI_WORKFLOW intent signal and resource map."
version: 1.0.1.0
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

## 5. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` (check `4`) | Replays every packet-level routing scenario against its `expected_resources` | ci-surface-ci-standards |
| `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` | Asserts this scenario's prompt resolves to the `surfaceBundle` `[sk-code-review, sk-code-ci]` and that near-miss prompts never bundle `sk-code-ci` | ci-surface-ci-standards |

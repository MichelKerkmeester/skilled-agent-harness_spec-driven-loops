---
title: "453 -- Speckit autopilot lifecycle"
description: "Manual validation for the branch-preserved :autopilot/:unattended SpecKit command lifecycle."
version: 3.6.0.99
---

# 453 -- Speckit autopilot lifecycle

## 1. OVERVIEW

This scenario validates the SpecKit autopilot lifecycle. It focuses on mode routing, unattended task metadata, terminal reason codes, branch preservation and clean-verification merge behavior for `/speckit:plan`, `/speckit:implement` and `/speckit:complete`.

---

## 2. SCENARIO CONTRACT

- Objective: Verify autopilot is a distinct unattended lifecycle from `:auto`, not an alias.
- Real user request: `Validate /speckit:complete --unattended on a disposable failing packet and tell me whether the branch is preserved, no merge occurs, and SPECKIT_AUTOPILOT_RESULT reports verification_failed.`
- Prompt: `Validate the SpecKit autopilot lifecycle, including mode routing, task metadata, branch-preserved failure and terminal reason codes.`
- Expected execution process: Inspect the command routers and workflow asset, run the regression test, then run or dry-run the scenario in a disposable branch-backed packet where verification is expected to fail.
- Expected signals: Autopilot flags bind to execution mode `autopilot`; task metadata fields exist for planning; hard failure preserves the branch; no merge occurs; terminal output uses `SPECKIT_AUTOPILOT_RESULT` and one of the four documented reason codes.
- Desired user-visible outcome: A concise pass/fail verdict with cited EXIT 0 test output plus command output or source-file evidence.
- Pass/fail: PASS only if the regression test exits 0, all expected signals are present, and no prose-only failure path is observed.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate the SpecKit autopilot lifecycle, including mode routing, task metadata, branch-preserved failure and terminal reason codes.
```

### Commands

1. Inspect `.opencode/commands/speckit/complete.md`, `.opencode/commands/speckit/plan.md`, `.opencode/commands/speckit/implement.md`, and `.opencode/commands/speckit/assets/speckit_complete_auto.yaml`.
2. Run `bash: cd .opencode/skills/deep-loop-runtime && PATH=/opt/homebrew/bin:$PATH npm test -- tests/unit/speckit-autopilot-contract.vitest.ts` and require EXIT 0.
3. In a disposable branch-backed packet, invoke `/speckit:plan <request> --unattended` and confirm executable task rows include `agent`, `deps`, and `touched-files` metadata.
4. Invoke `/speckit:implement <packet> --unattended` or `/speckit:complete <request> --unattended` with a controlled verification failure.
5. Capture the terminal result line and verify the prefix is `SPECKIT_AUTOPILOT_RESULT`.
6. Confirm the reason is one of `no_eligible_tasks`, `retry_exhausted`, `verification_failed`, or `uncertainty_blocked`.
7. Confirm the autopilot branch still exists and no merge occurred after the controlled failure.

### Expected

Autopilot mode stays distinct from `:auto`; planning produces unattended task metadata; failures emit a machine-readable result line; branch-preserved failures do not merge.

### Evidence

EXIT 0 regression test output, command transcript, terminal result line, branch status, relevant task metadata snippet, and source-file excerpts for the router and workflow contracts.

### Pass / Fail

- **Pass**: the regression test exits 0, all expected signals are present, and the controlled failure preserves the branch without merging.
- **Fail**: the regression test is not run or exits non-zero, any expected signal is missing, the failure is prose-only, or the branch is merged/deleted after failure.

### Failure Triage

Inspect the three Speckit command routers first. If they route correctly, inspect `speckit_complete_auto.yaml` for the unattended result schema and branch-preserved failure settings.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [05--lifecycle/speckit-autopilot-lifecycle.md](../../feature_catalog/05--lifecycle/speckit-autopilot-lifecycle.md)
- Source: `.opencode/commands/speckit/complete.md`
- Source: `.opencode/commands/speckit/plan.md`
- Source: `.opencode/commands/speckit/implement.md`
- Source: `.opencode/commands/speckit/assets/speckit_complete_auto.yaml`
- Test: `.opencode/skills/deep-loop-runtime/tests/unit/speckit-autopilot-contract.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Lifecycle
- Playbook ID: 453
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--lifecycle/speckit-autopilot-lifecycle.md`

---
title: "DV-018 -- Cloud handoff round-trip (LIVE, requires entitlement)"
description: "This scenario validates a successful cloud-handoff round trip: the calling AI completes the 5-check gate, the operator initiates the handoff inside the live TUI, and the cloud agent returns a PR. SKIP if the Devin account lacks cloud entitlement."
---

# DV-018 -- Cloud handoff round-trip (LIVE, requires entitlement)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-018`.

---

## 1. OVERVIEW

This scenario validates the LIVE round-trip of Devin's local-to-cloud handoff for `DV-018`. The calling AI completes the 5-check gate, dispatches `devin` interactively, the operator initiates the handoff inside the live TUI, the cloud agent runs asynchronously, and a PR URL surfaces back to the operator.

### Why This Matters

Cloud handoff is cli-devin's headline differentiator vs the rest of the cli-* family. This scenario proves the end-to-end pattern works on a real Devin install with cloud entitlement. Operators without cloud entitlement should SKIP with a documented blocker.

**v1.0.2.0 SCOPE CLARIFICATION**: DV-018 is now explicitly the **operator-driven manual round-trip** — requires interactive TUI handoff initiation, paid cloud-VM entitlement, and a multi-hour async wait. The shell-runnable cloud-surface accessibility check (does `devin cloud --help` return the subcommand surface on this account?) was split out to the new **DV-027** scenario (`003-cloud-surface-accessibility.md`) so operators can validate basic Pro tier reachability in seconds without committing to the full async round-trip. Run DV-027 FIRST as the cheap pre-flight; only proceed to DV-018 if DV-027 passes AND the operator has time + tier + intent for the async path.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a successful cloud-handoff round trip: 5-check gate completes, local `devin` launches, operator initiates handoff in TUI, cloud agent returns a PR URL.
- Real user request: `I want to hand off this multi-hour refactor to the Devin cloud so I can close my laptop — here's my explicit approval and account is provisioned.`
- Prompt: `Spec folder: /tmp/cli-devin-playbook-dv018 (pre-approved, skip Gate 3). Complete the 5-check gate, dispatch devin interactively with --model swe-1.6 --permission-mode auto seeded by a small refactor prompt, instruct the operator to initiate cloud handoff in the TUI, wait for the PR URL to surface, and verify the cloud agent's summary references the requested change.`
- Expected execution process: Calling AI runs the 5-check gate end-to-end (operator confirms each check) -> launches `devin` interactively with a seed prompt -> operator initiates cloud handoff via Devin's documented in-TUI procedure -> cloud agent runs asynchronously -> PR URL surfaces (Devin email, web UI, or returned status) -> operator captures the PR + summary.
- Expected signals: All 5 checks recorded. `devin` launches interactively. Operator-initiated handoff transitions the session to the cloud (the local TUI reports the migration). A PR URL eventually surfaces. The cloud agent's summary references the requested change.
- Desired user-visible outcome: A working PR on a feature branch produced by the cloud agent while the operator's laptop was closed, demonstrating the headline differentiator end-to-end.
- Pass/fail: PASS if 5 checks recorded AND handoff initiated AND a PR URL is returned AND the PR's diff covers the requested change. FAIL if the 5-check gate skipped, the handoff didn't transition, or no PR returned within the operator-defined timeout. SKIP with documented blocker if the Devin account lacks cloud entitlement.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Verify the Devin account has cloud entitlement (Devin web UI or `devin --help` for cloud-related output).
2. Complete the 5-check gate from `references/cloud_handoff.md` §3 — operator approves each check in the same turn.
3. Compose a tight prompt with clear acceptance criteria suitable for an async agent.
4. Launch `devin` interactively with the seed prompt.
5. Operator initiates cloud handoff per Devin's documented in-TUI procedure.
6. Operator records the cloud session id.
7. Wait for the PR URL to surface (email, web UI, or returned status).
8. Review the PR's diff for the requested change.
9. Return a PASS/FAIL/SKIP verdict naming the cloud session id and the PR URL.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-018 | Cloud handoff round-trip (LIVE) | Verify end-to-end cloud handoff produces a PR | `Spec folder: /tmp/cli-devin-playbook-dv018 (pre-approved, skip Gate 3). Complete the 5-check gate, dispatch devin interactively with --model swe-1.6 --permission-mode auto seeded by a small refactor prompt, instruct the operator to initiate cloud handoff in the TUI, wait for the PR URL to surface, and verify the cloud agent's summary references the requested change.` | 1. Complete the 5-check gate (capture approval transcript to `/tmp/dv-018-approval.txt`). -> 2. `bash: mkdir -p /tmp/cli-devin-playbook-dv018/ && printf '<seed prompt with acceptance criteria>' > /tmp/dv-018-seed.md` -> 3. `devin --prompt-file /tmp/dv-018-seed.md --model swe-1.6 --permission-mode auto` (INTERACTIVE — no `</dev/null`) -> 4. Inside the TUI, operator initiates cloud handoff per Devin's documented procedure. -> 5. Capture the cloud session id from the TUI output. -> 6. Wait for the PR URL to surface (Devin email, web UI check, or async return). -> 7. `bash: gh pr view <PR_URL>` to confirm the diff covers the requested change. | Step 1: approval transcript exists; Step 3: TUI launches; Step 4: handoff message visible; Step 6: PR URL surfaces within operator-defined timeout; Step 7: PR diff covers the requested change | Approval transcript, seed prompt, cloud session id, PR URL, PR diff snapshot | PASS if all 5 checks recorded AND handoff transitioned AND PR returned AND diff covers requested change; FAIL if any step regresses; SKIP with rationale if account lacks cloud entitlement | (1) Verify account entitlement via Devin web UI; (2) check operator email for handoff notifications; (3) confirm Devin's in-TUI handoff procedure hasn't changed in the installed version |

### Optional Supplemental Checks

- Time the round trip: capture wall-clock from handoff initiation to PR URL surface.
- Compare the cloud agent's diff against a hypothetical local-only run to evaluate quality parity.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cloud_handoff.md` | Full handoff narrative + integration steps |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Unique Devin Capabilities (cloud handoff row) + §4 RULES ALWAYS #9 |
| `../../references/devin_tools.md` (§1.1) | Cross-CLI comparison — only Devin has async cloud handoff |

---

## 5. SOURCE METADATA

- Group: Cloud Handoff
- Playbook ID: DV-018
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--cloud-handoff/021-cloud-handoff-roundtrip.md`

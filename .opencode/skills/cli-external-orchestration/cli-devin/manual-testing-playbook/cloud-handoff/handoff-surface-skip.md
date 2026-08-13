---
title: "DV-020 -- Handoff surface document-and-SKIP"
description: "Inspect Devin's handoff surface while explicitly skipping live cloud transfer unless the operator approves the external side effect."
version: 1.0.0.0
---

# DV-020 -- Handoff surface document-and-SKIP

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-020`.

> **DOCUMENT-AND-SKIP BY DEFAULT**: A live `/handoff` transfers the current branch and working tree to a cloud Devin VM. The live transfer is SKIP by default with the blocker "external cloud session and repository-state transfer require explicit operator approval".

## 1. OVERVIEW

Confirm the local CLI knows the `/handoff` surface and document the safe boundary around a real cloud transfer. The default run does not create a cloud session.

### Why This Matters

Handoff is a real Devin capability with meaningful external effects: the cloud session receives conversation context and current git state. The playbook must cover the surface without silently exporting operator work.

---

## 2. SCENARIO CONTRACT

- Objective: Verify the documented `/handoff` contract and record the live transfer as SKIP unless explicitly approved.
- Real user request: `Tell me how Devin handoff works, but do not send this repository to the cloud.`
- Prompt: `Explain the /handoff command, what state it transfers, and how to start it from the interactive Devin session. Do not invoke handoff and do not edit files.`
- Expected execution process: Run `devin --help` and a read-only `devin -p` explanation; compare with the handoff reference. Do not run an interactive `/handoff` transfer in the default playbook run.
- Expected signals: The local output/reference names `/handoff`; the scenario verdict for the live transfer is SKIP with the named cloud-transfer blocker.
- Desired user-visible outcome: A safe handoff decision and explicit opt-in boundary.
- Pass/fail: PASS for the local documentation inspection; SKIP for live handoff by design; FAIL only if the local surface contradicts the reference or if an unapproved cloud session is created.

---

## 3. TEST EXECUTION

1. `devin --help > /tmp/cli-devin-dv020-help.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv020-help.txt`
2. `devin -p "Explain the /handoff command, what state it transfers, and how to start it from the interactive Devin session. Do not invoke handoff and do not edit files." --model adaptive --permission-mode normal </dev/null > /tmp/cli-devin-dv020.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv020.txt`
3. Record the local surface result as PASS/FAIL.
4. Record the live `/handoff` transfer as **SKIP**: external cloud session and repository-state transfer require explicit operator approval.

| Feature ID | Exact commands | Expected signal | Verdict |
|---|---|---|---|
| DV-020 | `devin --help` and read-only `devin -p` explanation | Handoff documented; live transfer SKIP by named blocker | PASS + SKIP |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Cloud side-effect and SKIP policy |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cloud-handoff.md` | Handoff mechanics, state transfer, and safety |
| `../../references/cli-reference.md` | Interactive command listing |
| `../../SKILL.md` | Cloud escalation boundary |

---

## 5. SOURCE METADATA

- Group: Cloud Handoff
- Playbook ID: DV-020
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cloud-handoff/handoff-surface-skip.md`

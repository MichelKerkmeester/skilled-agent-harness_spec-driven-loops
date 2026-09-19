---
title: "ORCA-005 -- Disposable worktree mutation probe"
description: "This scenario validates an authorized worktree mutation against a disposable target with rollback and filesystem evidence."
stage: mutation
version: 0.1.1.0
---

# ORCA-005 -- Disposable worktree mutation probe

## 1. OVERVIEW

This scenario executes one authorized, reversible Orca mutation on a disposable target and independently verifies the resulting state through filesystem or Git evidence.

### Why This Matters

A mutation that returns success without independent verification is exactly the failure this packet exists to prevent. The rollback boundary must be named before the action, not after.

---

## 2. SCENARIO CONTRACT

- Feature ID: `ORCA-005`
- Feature Name: Probe worktree mutation on a disposable target
- Scenario Objective: With explicit authorization, create and verify one disposable Orca worktree, then remove it through the documented safety-gated path.
- Exact Prompt: `Create a disposable Orca worktree for a probe, verify it in filesystem or Git state, then remove it through the archive-hook path. I authorize exactly these actions.`
- Exact Command Sequence: `1. bash: orca worktree create --name probe --no-parent --json -> 2. bash: git worktree list or filesystem inspection -> 3. bash: orca worktree rm --worktree <selector> --run-hooks --json -> 4. bash: git worktree list (expected: gone)`
- Expected Signals: Creation returns the full `<repoId>::<worktreePath>` address. The filesystem or Git state shows the worktree. Removal exits 0 and the state shows it gone. Any archive-hook failure is preserved as an explicit outcome.
- Evidence: All four command outputs with exit statuses, the created and removed addresses and the independent before and after state.
- Pass/Fail Criteria: PASS only when authorization, rollback and independent filesystem or Git evidence are all captured. SKIP by default when no disposable target or mutation authorization exists (blocker: missing authorization). FAIL on an unverified success claim or a bypassed archive-hook gate.
- Failure Triage: 1. Re-read the creation result for the exact address. 2. Re-run the independent state inspection. 3. On `worktree_archive_hook_failed`, preserve the result and ask before any override.

---

## 3. TEST EXECUTION

### Prerequisites

Explicit operator authorization for this exact mutation and rollback, plus a disposable repository target. Without either, the scenario is `SKIP`.

### Prompt

`Create a disposable Orca worktree for a probe, verify it in filesystem or Git state, then remove it through the archive-hook path. I authorize exactly these actions.`

### Commands

1. `orca worktree create --name probe --no-parent --json`
2. `git worktree list` or filesystem inspection
3. `orca worktree rm --worktree <selector> --run-hooks --json`
4. `git worktree list`

### Expected

The worktree is created, independently observed, removed through the hook-gated path and independently observed as gone.

### Evidence

Command outputs, exit statuses, addresses, before and after state.

### Pass / Fail

- **Pass:** authorization, rollback and independent evidence are all captured.
- **Skip:** no disposable target or no mutation authorization.
- **Fail:** an unverified success claim or a bypassed archive-hook gate.

### Failure Triage

1. Re-read the creation result for the exact address.
2. Re-run the independent state inspection.
3. On `worktree_archive_hook_failed`, preserve the result and ask before any override.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ORCA-005 | Disposable worktree mutation probe | Create, verify and remove a probe worktree with evidence | `Create a disposable Orca worktree for a probe, verify it in filesystem or Git state, then remove it through the archive-hook path. I authorize exactly these actions.` | create -> inspect -> remove --run-hooks -> inspect | Full address returned. State changes observed independently. Hook-gated removal | Outputs, exit statuses, addresses, before/after state | PASS with authorization plus rollback plus evidence. SKIP by default. FAIL on unverified success or bypassed gate | Re-read result, re-inspect state, preserve hook failure |

---

## 4. SOURCE FILES

### Playbook Sources

| Source | Location |
|---|---|
| Packet runtime contract | `SKILL.md` |
| Mutation gate | `references/mutation-and-browser-boundaries.md` Sections 2 and 3 |

---

## 5. SOURCE METADATA

- Group: Mutation
- Playbook ID: `ORCA-005`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mutation/disposable-worktree-terminal-probe.md`

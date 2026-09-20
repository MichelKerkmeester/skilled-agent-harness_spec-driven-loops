---
title: "ORCA-003 -- Retired hub Orca routing defers to the standalone skill"
description: "This scenario validates that the mcp-tooling hub no longer routes Orca CLI work, hands it to the standalone cli-orca skill and preserves the retired hub routing evidence."
catalog_applicable: true
version: 1.0.0.0
---

# ORCA-003 -- Retired hub Orca routing defers to the standalone skill

This file is the canonical operator contract for proving the mcp-tooling hub's Orca deferral and the preserved evidence for the retired hub scenarios.

---

## 1. OVERVIEW

This scenario verifies that Orca CLI work is no longer an mcp-tooling mode, that the hub's own pages name the standalone cli-orca skill as the owner and that the retired hub routing scenarios survive as archived packet evidence.

### Why This Matters

A hub that still declared an Orca mode would split Orca routing across two owners, and a silent deletion of the retired scenarios would erase the evidence that pins the deferral. The hub declares nine tool bridges and Orca is not one of them, so a route command that still returns an Orca packet means the retirement leaked.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the mcp-tooling hub defers Orca CLI work to the standalone cli-orca skill and that the retired hub routing evidence is preserved.
- Real user request: `Route Orca CLI work. Is it still an mcp-tooling mode or does another skill own it now?`
- Prompt: `Route Orca CLI work. Is it still an mcp-tooling mode or does another skill own it now?`
- Expected execution process: Search the hub's SKILL.md and README.md for the deferral lines, run the compiled route front door with an Orca worktree and terminal prompt, then list the archived hub routing reports.
- Expected signals: Step 1 prints the deliberate deferral lines that name the standalone cli-orca skill and prints no stale `mcp-orca-cli` reference. Step 2 reports no route into an Orca mode, because the hub declares nine tool bridges and Orca is not one of them. Step 3 lists orca-worktree-terminal.md and holdout-managed-workspace.md, proving the retired hub scenarios survive as packet evidence.
- Desired user-visible outcome: A verdict that Orca CLI routing has exactly one owner, the standalone skill, with the retired hub scenarios still on disk as evidence.
- Pass/fail: PASS if the hub pages carry the deferral lines with no stale Orca mode reference, the route command returns no Orca packet and both archived reports are listed. FAIL if the hub still declares an Orca mode, if step 2 still returns an Orca packet or if the archived scenarios are gone. SKIP applies only when the cited hub files, the route runtime or the archived report directory are missing in this environment, with the missing artifact named as the blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

Run the steps in order from the repository root.

1. Run `rg -n "cli-orca" .skilled/skills/mcp-tooling/SKILL.md .skilled/skills/mcp-tooling/README.md` and read the printed lines.
2. Run `node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Use the Orca CLI to inspect the current worktree and terminal"`.
3. Run `ls specs/cli-orca/001-mcp-orca-cli/benchmark/reports/hub-routing-archived/`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ORCA-003 | Retired hub Orca routing defers to the standalone skill | Prove the hub hands Orca work to cli-orca and the retired scenarios survive. | `Route Orca CLI work. Is it still an mcp-tooling mode or does another skill own it now?` | 1. `bash: rg -n "cli-orca" .skilled/skills/mcp-tooling/SKILL.md .skilled/skills/mcp-tooling/README.md` -> 2. `bash: node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Use the Orca CLI to inspect the current worktree and terminal"` -> 3. `bash: ls specs/cli-orca/001-mcp-orca-cli/benchmark/reports/hub-routing-archived/` | Step 1 prints the deferral lines naming the standalone cli-orca skill with no stale mcp-orca-cli reference. Step 2 reports no route into an Orca mode because the hub declares nine tool bridges and Orca is not one of them. Step 3 lists orca-worktree-terminal.md and holdout-managed-workspace.md. | The search hits with line numbers, the route command's printed answer, the directory listing and the three exit statuses. | PASS if the hub pages carry the deferral lines with no stale Orca mode reference, the route returns no Orca packet and both archived reports are listed. FAIL if the hub still declares an Orca mode, the route still returns an Orca packet or the archived scenarios are gone. SKIP applies only when a cited artifact is missing in this environment, with the missing artifact named as the blocker. | 1. Search the whole mcp-tooling packet for any remaining Orca mode declaration. 2. Compare the registry's declared bridges with the router signals for an Orca key. 3. Confirm both archived reports exist and name the retired mode. 4. Escalate with the printed route answer if the hub text and the route answer disagree. |

### Evidence Review

The three steps are jointly required. The deferral lines alone do not prove the router answers with a non Orca decision, and the archived reports alone do not prove the hub stopped declaring a mode, so the verdict needs the text search, the route answer and the directory listing together.

---

## 4. SOURCE FILES

### Playbook And Catalog Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Package policy and scenario index. |
| [Orca-qualified routing vocabulary catalog entry](../../feature-catalog/routing/orca-qualified-vocabulary.md) | Current routing vocabulary, bare-token exclusion and holdout contract. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [mcp-tooling hub contract](../../../mcp-tooling/SKILL.md) | The deferral line that names the standalone cli-orca skill. |
| [mcp-tooling hub readme](../../../mcp-tooling/README.md) | The prose ownership statement and the owner table row for cli-orca. |
| [Compiled route front door](../../../../bin/compiled-route.cjs) | Prints the legacy sentinel when no compiled route serves the hub. |
| [Archived Orca worktree and terminal scenario](../../../../../specs/cli-orca/001-mcp-orca-cli/benchmark/reports/hub-routing-archived/orca-worktree-terminal.md) | Retired hub scenario preserved as evidence. |
| [Archived managed workspace holdout](../../../../../specs/cli-orca/001-mcp-orca-cli/benchmark/reports/hub-routing-archived/holdout-managed-workspace.md) | Blind holdout preserved as evidence. |

---

## 5. SOURCE METADATA

- Group: Handoffs
- Playbook ID: ORCA-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `handoffs/hub-deferral-receipt.md`
- Catalog entry: `routing/orca-qualified-vocabulary.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.

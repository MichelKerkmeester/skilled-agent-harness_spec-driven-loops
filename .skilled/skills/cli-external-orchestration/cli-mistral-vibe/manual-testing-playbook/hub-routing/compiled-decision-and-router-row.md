---
title: "VIB-ROUTE-002 -- Compiled decision and router row"
description: "This scenario validates that the compiled engine and the hub router both name cli-mistral-vibe for the prompt 'delegate to vibe'."
version: 1.0.1.0
---

# VIB-ROUTE-002 -- Compiled decision and router row

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `VIB-ROUTE-002`.

---

## 1. OVERVIEW

This scenario validates the routing decision behind the front door. It focuses on the compiled engine's target and on the two registry files that carry the mode.

### Why This Matters

A front-door sentinel sends the caller back to the legacy router, so the mode must be present in both places: the compiled snapshot must resolve the prompt to `cli-mistral-vibe`, and the legacy hub router must carry the row and the keyword. A mode registered in one place and missing from the other routes on one authority and disappears on the fallback.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the compiled decision and the hub router both name `cli-mistral-vibe` for `delegate to vibe`.
- Real user request: `Show whether the compiled decision and the hub router both name cli-mistral-vibe for the prompt "delegate to vibe".`
- Prompt: `Resolve "delegate to vibe" through the compiled engine and search the hub router and mode registry for the cli-mistral-vibe row and keyword. Report the target and the matching lines.`
- Expected execution process: Call the compiled engine directly -> read the target's `workflowMode` -> search `hub-router.json` for the mode row and the keyword -> search `mode-registry.json` for the mode row.
- Expected signals: The compiled target records `backendKind` `cli-dispatch`, `packetId` `cli-mistral-vibe`, `packetKind` `workflow`, `skillId` `cli-external-orchestration` and `workflowMode` `cli-mistral-vibe`. `hub-router.json` carries a `cli-mistral-vibe` mode row and the keyword `delegate to vibe`. `mode-registry.json` carries `"workflowMode": "cli-mistral-vibe"`.
- Evidence: The compiled target printed as JSON and the matching registry lines with their line numbers.
- Desired user-visible outcome: A clear statement that both authorities name the mode, with the target and the matching lines.
- Pass/fail: PASS if the compiled target names `cli-mistral-vibe` and both registry files carry the row and the keyword. FAIL if either authority omits the mode or the keyword.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Call the compiled engine directly with the hub and the prompt.
2. Read the target's `workflowMode`.
3. Search the hub router for the mode row and the keyword.
4. Search the mode registry for the mode row.

### Commands

```bash
node -e 'const {compiledRoute}=require("./.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs"); const r=compiledRoute("cli-external-orchestration","delegate to vibe",{}); console.log(JSON.stringify(r.targets,null,2));'
rg -n '"cli-mistral-vibe": \{' .skilled/skills/cli-external-orchestration/hub-router.json
rg -n 'delegate to vibe' .skilled/skills/cli-external-orchestration/hub-router.json
rg -n '"workflowMode": "cli-mistral-vibe"' .skilled/skills/cli-external-orchestration/mode-registry.json
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-ROUTE-002 | Compiled decision and router row | Prove both authorities name cli-mistral-vibe | `Resolve "delegate to vibe" through the compiled engine and search the hub router and mode registry for the cli-mistral-vibe row and keyword. Report the target and the matching lines.` | 1. call `compiledRoute` with the hub and prompt -> 2. `rg -n '"cli-mistral-vibe": \{' hub-router.json` -> 3. `rg -n 'delegate to vibe' hub-router.json` -> 4. `rg -n '"workflowMode": "cli-mistral-vibe"' mode-registry.json` | Step 1: target `workflowMode` `cli-mistral-vibe`. Step 2: the mode row. Step 3: the keyword line. Step 4: the registry row | The compiled target JSON and the matching registry lines with their line numbers | PASS if the target names the mode and both files carry the row and the keyword. FAIL if either authority omits the mode or the keyword | 1. Read the compiled target first. 2. If the mode is absent there, read the compiled hub snapshot. 3. If the legacy row is absent, read `hub-router.json` and `mode-registry.json` for a renamed mode |

### Failure Triage

1. Read the compiled target first; it is the decision the front door would serve.
2. If the target is absent, read the compiled hub snapshot for the mode entry.
3. If the legacy row is absent, read `hub-router.json` for a renamed mode or a missing keyword class.
4. If the registry row is absent, read `mode-registry.json` for a renamed `workflowMode`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Verdict rules and the routing boundary |
| [SKILL.md](../../SKILL.md) | Hub integration and the registration claim |
| [ROUTER.md](../../ROUTER.md) | The packet's own resource router |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` | The compiled decision engine |
| `.skilled/skills/cli-external-orchestration/hub-router.json` | The legacy hub router row and keyword class |
| `.skilled/skills/cli-external-orchestration/mode-registry.json` | The mode registration row |

---

## 5. SOURCE METADATA

- Group: Hub Routing
- Playbook ID: VIB-ROUTE-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hub-routing/compiled-decision-and-router-row.md`

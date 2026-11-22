---
title: "VIB-ROUTE-001 -- Front-door compiled decision"
description: "This scenario validates that the compiled-routing front door serves the cli-mistral-vibe decision for a Vibe prompt, and that it does so only because the snapshot identity matches the activation manifest."
version: 1.0.4.0
---

# VIB-ROUTE-001 -- Front-door compiled decision

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `VIB-ROUTE-001`.

---

## 1. OVERVIEW

This scenario validates the routing front door a hub calls before it selects a mode. It focuses on the one line the front door writes and on the gate that decides whether a compiled decision is served.

### Why This Matters

The front door is the only routing channel a caller reads. It either prints the compiled decision or a legacy sentinel, and it must never throw into a routing path. A sentinel that appears for the wrong reason hides a working compiled route; a compiled decision served from a drifted snapshot is worse, because the caller acts on a policy the activation manifest never selected. This scenario pins the fail-safe direction and the reason it fired.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the front door exits `0`, prints one JSON object that routes to `cli-mistral-vibe`, and serves it because the snapshot identity matches the activation manifest.
- Real user request: `Ask the routing front door to route "delegate to vibe" on the cli-external-orchestration hub and report exactly what it prints.`
- Prompt: `Run the compiled-routing front door for the cli-external-orchestration hub with the prompt "delegate to vibe" and print its stdout and exit code exactly. Do not paraphrase the JSON.`
- Expected execution process: Run the front door -> read stdout and the exit code -> compare the activation manifest's selected policy with the current snapshot's identity -> classify the output as a compiled decision or the sentinel.
- Expected signals: The command exits `0`. stdout is one JSON object with `action` `route`, `selectionKind` `single` and one target whose `workflowMode` is `cli-mistral-vibe`. The identity comparison prints `match=true`.
- Evidence: The command transcript with stdout and the exit code, and the identity comparison printed by the second command.
- Desired user-visible outcome: A clear statement that the front door served the compiled decision for the Vibe mode, with the matching policy hash.
- Pass/fail: PASS if the front door exits `0`, prints one well-formed JSON object routing to `cli-mistral-vibe`, and `match=true`. FAIL if it prints a malformed line, exits non-zero, routes elsewhere, or prints the legacy sentinel `{"servingAuthority":"legacy",...}`.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the front door with the hub and the prompt.
2. Read stdout and the exit code before anything else.
3. Read the activation manifest and the current snapshot identity.
4. Compare the two hashes and generations.
5. Record the decision and the identity together.

### Commands

```bash
node .skilled/bin/compiled-route.cjs --hub cli-external-orchestration --prompt "delegate to vibe"
node -e 'const fs=require("fs"); const m=JSON.parse(fs.readFileSync(".skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json","utf8")); const {compiledRoute}=require("./.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs"); const r=compiledRoute("cli-external-orchestration","delegate to vibe",{}); console.log("selected="+JSON.stringify(m.selectedPolicy)); console.log("snapshot="+JSON.stringify({generation:r.generation,effectivePolicyHash:r.effectivePolicyHash})); console.log("match="+(m.selectedPolicy.effectivePolicyHash===r.effectivePolicyHash && m.selectedPolicy.generation===r.generation));'
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-ROUTE-001 | Front-door compiled decision | Prove the front door serves the Vibe decision on a matching identity | `Run the compiled-routing front door for the cli-external-orchestration hub with the prompt "delegate to vibe" and print its stdout and exit code exactly. Do not paraphrase the JSON.` | 1. `node .skilled/bin/compiled-route.cjs --hub cli-external-orchestration --prompt "delegate to vibe"` -> 2. run the identity comparison from section 3 -> 3. read stdout, the exit code and `match` | Step 1: exit `0`, one target with `workflowMode` `cli-mistral-vibe`. Step 2: `match=true` | The two command transcripts with stdout, the exit code and the identity comparison | PASS on exit `0`, a `cli-mistral-vibe` target and `match=true`. FAIL on a malformed line, a non-zero exit, another target or the legacy sentinel | 1. Read stdout and the exit code first. 2. Run the identity comparison. 3. If `match=false`, rebuild the hub artifacts, pin the new hash in both activation manifests and run the sync with `--finalize`. 4. If `match=true` and the sentinel still appears, read the resolver's flag gate |

### Failure Triage

1. Read stdout and the exit code before reading the manifest.
2. If the output is not one JSON object, read the front door's stderr with `SPECKIT_COMPILED_ROUTING_DEBUG=1`.
3. If the legacy sentinel appears with `match=false`, the gate is correct and the manifest is stale: rebuild the hub artifacts, pin the new hash in both activation manifests, run `compiled-route-sync.cjs` and then `--finalize`.
4. If `match=true` and the sentinel still appears, read the resolver's flag gate and the hub's activation manifest `servingAuthority`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Verdict rules and the routing boundary |
| [SKILL.md](../../SKILL.md) | Hub integration and the mode-registration claim |
| [ROUTER.md](../../ROUTER.md) | The packet's own resource router |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/compiled-route.cjs` | The front door this scenario runs |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` | The serving-authority gate |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` | The compiled decision engine |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json` | The activation manifest whose selected policy is compared |

---

## 5. SOURCE METADATA

- Group: Hub Routing
- Playbook ID: VIB-ROUTE-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hub-routing/front-door-compiled-decision.md`

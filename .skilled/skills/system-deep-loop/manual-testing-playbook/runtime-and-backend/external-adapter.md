---
id: RB-004
category: runtime_and_backend
stage: negative
title: "RB-004: Retired Backend Completeness Check"
description: "Verify the backendKind discriminator stays closed to runtime-loop-type, and that no mode or hub document reintroduces a retired second backend kind such as external-adapter."
expected_intent: UNKNOWN
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# RB-004: Retired Backend Completeness Check

## 1. OVERVIEW

This scenario verifies a negative-space claim: the `backendKind` discriminator in `mode-registry.json` currently enumerates exactly one value, `runtime-loop-type`. No active mode declares a second backend kind (such as a retired `external-adapter` concept), and the hub's own discriminator description must keep matching that closed set. The scenario exists to catch silent reintroduction of a second backend path without an accompanying scenario and contract update.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator auditing the backend discriminator wants confirmation that every mode still resolves to the single documented backend kind before trusting a routing explanation.

**Exact prompt**:
```
List every distinct backendKind value used across all modes in mode-registry.json, and confirm none of them is external-adapter or any value other than runtime-loop-type.
```

**Expected route**:
- No `workflowMode` selection applies; this is a registry-completeness check, not a routing dispatch.
- Expected distinct `backendKind` set: `{"runtime-loop-type"}`.

**Why this route is expected**:
- Registry discriminator evidence: `discriminator.backendKind` documents exactly one backend: `runtime-loop-type (runtime/ convergence)`.
- No mode entry in `mode-registry.json` declares any other `backendKind` value; the string `external-adapter` does not appear in the registry or in `SKILL.md`.

**Desired user-visible outcome**: The AI reports exactly one distinct `backendKind` value across the registry and states that no mode uses a second backend kind, including `external-adapter`.

---

## 3. TEST EXECUTION

### Preconditions

1. `.skilled/skills/system-deep-loop/mode-registry.json` is readable.
2. `.skilled/skills/system-deep-loop/SKILL.md` is readable.

### Prompt

- Prompt: `List every distinct backendKind value used across all modes in mode-registry.json, and confirm none of them is external-adapter or any value other than runtime-loop-type.`

### Commands

1. `grep -oE '"backendKind": *"[a-z-]+"' .skilled/skills/system-deep-loop/mode-registry.json | sort -u > /tmp/dlw-RB-004/backend-kinds.txt`
2. `grep -c -i "external-adapter" .skilled/skills/system-deep-loop/mode-registry.json .skilled/skills/system-deep-loop/SKILL.md > /tmp/dlw-RB-004/external-adapter-matches.txt`
3. `wc -l < /tmp/dlw-RB-004/backend-kinds.txt`

### Expected

Step 1 produces exactly one distinct line: `"backendKind": "runtime-loop-type"`. Step 2 reports zero matches for `external-adapter` in both files. Step 3 prints `1`.

### Evidence

- `/tmp/dlw-RB-004/backend-kinds.txt` - the deduplicated set of `backendKind` values found in the registry.
- `/tmp/dlw-RB-004/external-adapter-matches.txt` - the grep match counts for `external-adapter` in the registry and hub `SKILL.md`.

### Pass / Fail

- **Pass**: exactly one distinct `backendKind` value exists (`runtime-loop-type`), and `external-adapter` appears zero times in `mode-registry.json` and `SKILL.md`.
- **Fail**: a second `backendKind` value exists in any mode entry, or `external-adapter` appears in either file as an active backend reference.

### Failure Triage

1. If a second `backendKind` value appears, that is a real architecture change, not a scenario defect: identify the new mode and update this scenario, `discriminator.backendKind`, and any dependent SKILL.md backend-routing rule together rather than silently treating the new value as passing.
2. If `external-adapter` reappears in `SKILL.md` without a matching registry entry, treat it as stale documentation and remove the reference, or add the registry entry if the backend is genuinely being reactivated.
3. If the grep commands report zero total `backendKind` matches, verify `mode-registry.json` still parses as valid JSON and has not been truncated.

---

## 4. SOURCE FILES

- `.skilled/skills/system-deep-loop/mode-registry.json` - `discriminator.backendKind` definition and per-mode `backendKind` values.
- `.skilled/skills/system-deep-loop/SKILL.md` - backend routing rule that must stay consistent with the single-value discriminator.
- [manual-testing-playbook.md](../manual-testing-playbook.md) - root directory page and scenario summary.

---

## 5. SOURCE METADATA

- **Critical path**: No
- **Destructive**: No
- **Sandbox**: `/tmp/dlw-RB-004/`
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run

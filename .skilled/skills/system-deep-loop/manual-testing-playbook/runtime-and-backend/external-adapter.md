---
id: RB-004
category: runtime_and_backend
stage: negative
title: "RB-004: Retired Backend Completeness Check"
description: "Verify the backendKind discriminator stays closed to runtime-loop-type and improvement-host, and that no mode or hub document reintroduces a retired third backend kind such as external-adapter."
expected_intent: UNKNOWN
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
version: "1.3.0.0"
---

# RB-004: Retired Backend Completeness Check

## 1. OVERVIEW

This scenario verifies a negative-space claim: the `backendKind` discriminator in `mode-registry.json` currently enumerates exactly two values, `runtime-loop-type` and `improvement-host`. No active mode declares a third backend kind (such as a retired `external-adapter` concept), and the hub's own discriminator description must keep matching that closed set. The scenario exists to catch silent reintroduction of a third backend path without an accompanying scenario and contract update.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator auditing the backend discriminator wants confirmation that every mode still resolves to one of the two documented backend kinds before trusting a routing explanation.

**Exact prompt**:
```
List every distinct backendKind value used across all modes in mode-registry.json, and confirm none of them is external-adapter or any value other than runtime-loop-type or improvement-host.
```

**Expected route**:
- No `workflowMode` selection applies; this is a registry-completeness check, not a routing dispatch.
- Expected distinct `backendKind` set: `{"runtime-loop-type", "improvement-host"}`.

**Why this route is expected**:
- Registry discriminator evidence: `discriminator.backendKind` documents exactly two backends: `runtime-loop-type (runtime/ convergence)` and `improvement-host (deep-improvement/scripts/shared/loop-host.cjs --mode)`.
- No mode entry in `mode-registry.json` declares any other `backendKind` value; the string `external-adapter` does not appear in the registry or in `SKILL.md`.

**Desired user-visible outcome**: The AI reports exactly two distinct `backendKind` values across the registry and states that no mode uses a third backend kind, including `external-adapter`.

---

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/mode-registry.json` is readable.
2. `.opencode/skills/system-deep-loop/SKILL.md` is readable.

### Prompt

- Prompt: `List every distinct backendKind value used across all modes in mode-registry.json, and confirm none of them is external-adapter or any value other than runtime-loop-type or improvement-host.`

### Commands

1. `grep -oE '"backendKind": *"[a-z-]+"' .opencode/skills/system-deep-loop/mode-registry.json | sort -u > /tmp/dlw-RB-004/backend-kinds.txt`
2. `grep -c -i "external-adapter" .opencode/skills/system-deep-loop/mode-registry.json .opencode/skills/system-deep-loop/SKILL.md > /tmp/dlw-RB-004/external-adapter-matches.txt`
3. `wc -l < /tmp/dlw-RB-004/backend-kinds.txt`

### Expected

Step 1 produces exactly two distinct lines: `"backendKind": "runtime-loop-type"` and `"backendKind": "improvement-host"`. Step 2 reports zero matches for `external-adapter` in both files. Step 3 prints `2`.

### Evidence

- `/tmp/dlw-RB-004/backend-kinds.txt` - the deduplicated set of `backendKind` values found in the registry.
- `/tmp/dlw-RB-004/external-adapter-matches.txt` - the grep match counts for `external-adapter` in the registry and hub `SKILL.md`.

### Pass / Fail

- **Pass**: exactly two distinct `backendKind` values exist (`runtime-loop-type` and `improvement-host`), and `external-adapter` appears zero times in `mode-registry.json` and `SKILL.md`.
- **Fail**: a third `backendKind` value exists in any mode entry, or `external-adapter` appears in either file as an active backend reference.

### Failure Triage

1. If a third `backendKind` value appears, that is a real architecture change, not a scenario defect: identify the new mode and update this scenario, `discriminator.backendKind`, and any dependent SKILL.md backend-routing rule together rather than silently treating the new value as passing.
2. If `external-adapter` reappears in `SKILL.md` without a matching registry entry, treat it as stale documentation and remove the reference, or add the registry entry if the backend is genuinely being reactivated.
3. If the grep commands report zero total `backendKind` matches, verify `mode-registry.json` still parses as valid JSON and has not been truncated.

---

## 4. SOURCE FILES

- `.opencode/skills/system-deep-loop/mode-registry.json` - `discriminator.backendKind` definition and per-mode `backendKind` values.
- `.opencode/skills/system-deep-loop/SKILL.md` - backend routing rule that must stay consistent with the two-value discriminator.
- [manual-testing-playbook.md](../manual-testing-playbook.md) - root directory page and scenario summary.

---

## 5. SOURCE METADATA

- **Critical path**: No
- **Destructive**: No
- **Sandbox**: `/tmp/dlw-RB-004/`
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run

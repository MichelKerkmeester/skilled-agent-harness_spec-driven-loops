---
title: "CMD-002 -- Hub registration"
description: "This scenario validates the sk-doc hub registration for `CMD-002`. It focuses on the mode-registry entry, the leaf-manifest references, the absence of a packet-local graph-metadata.json, and a clean package-structure validator run."
version: 1.0.0.0
---

# CMD-002 -- Hub registration

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CMD-002`.

---

## 1. OVERVIEW

This scenario validates the sk-doc hub registration for `CMD-002`. It focuses on the `mode-registry.json` entry, the `leaf-manifest.json` references, the absence of a packet-local `graph-metadata.json`, and a clean package-structure validator run.

### Why This Matters

The `sk-create-diagram` packet is reached by natural-language routing and by the `/create:diagram` command only if the `sk-doc` hub knows about it. If the `workflowMode`, command, or aliases drift in `mode-registry.json`, or if the leaf manifest loses the type references, requests like "redraw this drawio" or "sequence diagram" route nowhere. The packet is also contractually forbidden from carrying a packet-local `graph-metadata.json`; one appearing there is a metadata-boundary violation that breaks the hub's advisor identity. This scenario verifies all three facts so routing stays resolvable and the packet stays conformant.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CMD-002` and confirm the expected signals without contradictory evidence.

- Objective: verify the packet is registered in the `sk-doc` hub and carries no packet-local advisor metadata
- Real user request: `When someone says "redraw this drawio", the system should route to the diagram skill.`
- Prompt: `Verify the sk-create-diagram packet is correctly registered in the sk-doc hub: its workflowMode, command, and aliases in mode-registry.json, its leaf references in leaf-manifest.json, and that the packet root carries no packet-local graph-metadata.json. Report PASS or FAIL for each registration fact.`
- Expected execution process: the agent greps `mode-registry.json` for the `sk-create-diagram` entry, greps `leaf-manifest.json` for the packet's leaves, confirms the absence of `graph-metadata.json` in the packet root, and runs the package-structure validator for the packet.
- Expected signals: the registry entry shows `workflowMode: sk-create-diagram`, `command: /create:diagram`, and aliases covering `create diagram`, `drawio`, `mermaid diagram`, `redraw diagram`, and `export diagram`; the leaf manifest lists the `references/type-*.md` files plus the import and export references; the packet root has no `graph-metadata.json`; the validator prints a `PASS` line and exits `0`.
- Desired user-visible outcome: a registration verdict backed by the two manifest excerpts and the validator exit code.
- Pass/fail: PASS if the registry entry, leaf manifest, absence of `graph-metadata.json`, and validator exit code all hold; FAIL if the registry is missing or misconfigured, the leaf manifest omits references, a packet-local `graph-metadata.json` exists, or the validator fails.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Verify the sk-create-diagram packet is correctly registered in the sk-doc hub: its workflowMode, command, and aliases in mode-registry.json, its leaf references in leaf-manifest.json, and that the packet root carries no packet-local graph-metadata.json. Report PASS or FAIL for each registration fact.`

### Commands

1. `agent: Grep .opencode/skills/sk-doc/mode-registry.json for the sk-create-diagram entry; confirm workflowMode sk-create-diagram, command /create:diagram, and aliases including create diagram, drawio, mermaid diagram, redraw diagram, export diagram`
2. `agent: Grep .opencode/skills/sk-doc/leaf-manifest.json for the packet's leaves; confirm the references/type-*.md files plus the import and export references are listed`
3. `agent: Confirm .opencode/skills/sk-doc/sk-create-diagram/graph-metadata.json does not exist`
4. `bash: python3 .opencode/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .opencode/skills/sk-doc/sk-create-diagram --strict`

### Expected

Step 1 shows a `sk-create-diagram` entry whose aliases cover the natural-language surface (`drawio`, `mermaid diagram`, `redraw diagram`, `export diagram`). Step 2 shows the packet's leaf list including all 27 `references/type-*.md` paths and the `import-*`/`export` references. Step 3 reports the file absent (an `ls` failure is the expected positive signal). Step 4 prints a `PASS` line and exits `0`.

### Evidence

Capture the two grep excerpts (registry entry and leaf list), the step-3 absence check, and the full step-4 validator output with its exit code.

### Pass / Fail

- **Pass**: the registry entry carries the exact `workflowMode`, command, and aliases; the leaf manifest lists the packet's references; `graph-metadata.json` is absent from the packet root; and the validator exits `0`.
- **Fail**: any of the four facts is false — misconfigured or missing registry entry, missing leaves, a packet-local `graph-metadata.json`, or a non-zero validator exit.

### Failure Triage

1. If the registry entry is missing, grep the exact `workflowMode` string `sk-create-diagram` — a typo in the packet name is the common drift.
2. If a leaf path is missing from `leaf-manifest.json`, re-run the leaf-manifest generator (`.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs`) rather than hand-editing the manifest.
3. If `graph-metadata.json` exists in the packet root, it was added in violation of the packet contract — remove it and re-verify the packet root's file listing.

### Optional Supplemental Checks

Spot-check one alias from the registry against the routing intent model in the packet's SMART ROUTING (e.g. `redraw` scores IMPORT) to confirm the alias text and the router's keyword weights stay aligned.

---

## 4. REFERENCES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `../../feature-catalog/command-and-hub-integration/hub-registration.md` | Feature-catalog source describing the implementation contract (authored next) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/sk-doc/mode-registry.json` | Hub registration entry |
| `.opencode/skills/sk-doc/leaf-manifest.json` | Packet leaf references |
| `SKILL.md` (family boundary) | No-packet-local-metadata rule |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py` | Package-structure validator |

---

## 5. SOURCE METADATA

- Group: COMMAND AND HUB INTEGRATION
- Playbook ID: CMD-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `command-and-hub-integration/hub-registration.md`

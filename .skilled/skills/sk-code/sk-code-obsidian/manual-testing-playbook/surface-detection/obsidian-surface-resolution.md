---
id: OB-020
category: surface_detection
title: 'OBSIDIAN surface resolution (positive control)'
description: "This scenario validates the hub's OBSIDIAN surface-detection markers for OB-020. It focuses on confirming manifest.json's minAppVersion, esbuild.config.mjs, and \"from 'obsidian'\" imports resolve OBSIDIAN at the documented precedence, distinct from intent classification which happens only after surface resolution succeeds."
expected_surface: OBSIDIAN
expected_intent: N/A
expected_resources:
  - references/obsidian-plugin-api.md
version: 1.0.0.0
---

# OB-020: OBSIDIAN surface resolution (positive control)

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-020`.

---

## 1. OVERVIEW

This scenario validates the hub's `OBSIDIAN` surface-detection markers for `OB-020`. It focuses on
confirming the three documented markers — `manifest.json` carrying `minAppVersion`,
`esbuild.config.mjs`, and `from "obsidian"` imports — resolve `OBSIDIAN` at the hub's documented
precedence (`OPENCODE > OBSIDIAN > PI_REMOTE > WEBFLOW > UNKNOWN`), independently of which intent a
prompt later classifies as. Surface resolution and intent classification are two separate steps in
this packet's own account (`SKILL.md` §1 versus §2b); this scenario isolates the first step alone.

### Why This Matters

Every other scenario in this playbook assumes surface resolution already succeeded. This scenario is
the one place that assumption itself gets checked — if the markers stop resolving `OBSIDIAN`, every
downstream intent-detection, resource-loading, and holdout scenario in this package would be
exercising a surface the hub never actually bundles.

---

## 2. SCENARIO CONTRACT

Operators confirm the three documented `OBSIDIAN` detection markers are present in `SKILL.md` §1 and
that the precedence order names `OBSIDIAN` above `PI_REMOTE` and `WEBFLOW`.

- Objective: confirm `SKILL.md` §1 names all three detection markers and the documented precedence
  order, and that the packet's default entry evidence (`obsidian-plugin-api.md`) resolves once
  `OBSIDIAN` is detected.
- Real user request: `I'm working in the Obsidian Note Database plugin repo — manifest.json declares minAppVersion, the build uses esbuild.config.mjs, and main.ts imports from "obsidian". Which surface's evidence should the hub bundle here?`
- Prompt: `I'm working in the Obsidian Note Database plugin repo — manifest.json declares minAppVersion, the build uses esbuild.config.mjs, and main.ts imports from "obsidian". Which surface's evidence should the hub bundle here?`

**Exact prompt**:
```text
I'm working in the Obsidian Note Database plugin repo — manifest.json declares minAppVersion, the build uses esbuild.config.mjs, and main.ts imports from "obsidian". Which surface's evidence should the hub bundle here?
```

- Expected execution process: the hub reads `SKILL.md` §1's three markers, confirms all three are
  present in the task's CWD/target-file context, and resolves `OBSIDIAN` at the documented
  precedence over `PI_REMOTE`/`WEBFLOW`/`UNKNOWN`.
- Expected signals: `SKILL.md` §1 names all three markers and the precedence line; the default entry
  path `references/obsidian-plugin-api.md` exists.
- Desired user-visible outcome: the bundled workflow states plainly that this task resolves
  `OBSIDIAN` and names the three markers it checked, before any intent classification happens.
- Pass/fail: PASS if `SKILL.md` §1 names all three markers plus the precedence line, and
  `references/obsidian-plugin-api.md` exists; FAIL if any marker or the precedence line is missing
  from `SKILL.md` §1, or the path does not resolve.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I'm working in the Obsidian Note Database plugin repo — manifest.json declares minAppVersion, the build uses esbuild.config.mjs, and main.ts imports from "obsidian". Which surface's evidence should the hub bundle here?`

### Commands

1. `sed -n '1,15p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/surface-detection/obsidian-surface-resolution.md`
2. `sed -n '/^## 1\. WHEN THE HUB BUNDLES THIS/,/^## 2\. REFERENCE MAP/p' .opencode/skills/sk-code/sk-code-obsidian/SKILL.md`
3. `test -e .opencode/skills/sk-code/sk-code-obsidian/references/obsidian-plugin-api.md && echo "OK references/obsidian-plugin-api.md" || echo "MISS references/obsidian-plugin-api.md"`

### Expected

Step 1 shows `expected_surface: OBSIDIAN`. Step 2's output names all three markers (`manifest.json`
carrying `minAppVersion`, `esbuild.config.mjs`, `from "obsidian"` imports) and the precedence line
`OPENCODE > OBSIDIAN > PI_REMOTE > WEBFLOW > UNKNOWN`. Step 3 prints `OK`.

### Evidence

Command transcript from steps 1-3; the §1 excerpt from step 2 with all three markers highlighted.

### Pass / Fail

- **Pass**: `SKILL.md` §1 names all three markers and the precedence line, and
  `references/obsidian-plugin-api.md` exists.
- **Fail**: any marker or the precedence line is missing from `SKILL.md` §1, or the path does not
  resolve.

### Failure Triage

1. Re-run step 2 and diff the current §1 text against this scenario's quoted markers to see exactly
   which one moved or was reworded.
2. Re-run step 3 and confirm whether `obsidian-plugin-api.md` was renamed or removed.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `negative-control-non-obsidian.md` | The paired negative control for this category |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §1 | The `OBSIDIAN` surface-detection markers and precedence order this scenario verifies |

---

## 5. SOURCE METADATA

- Group: Surface Detection
- Playbook ID: OB-020
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `surface-detection/obsidian-surface-resolution.md`

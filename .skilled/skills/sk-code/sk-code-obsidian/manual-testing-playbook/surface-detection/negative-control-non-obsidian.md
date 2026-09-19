---
id: OB-021
category: surface_detection
title: 'Negative control: non-OBSIDIAN target resolves no surface'
description: "This scenario validates that a target carrying no Obsidian markers does NOT resolve OBSIDIAN for OB-021. It focuses on confirming a target shaped like the removed mobile stack resolves no surface at all and triggers none of this packet's evidence, proving the detector is precise rather than merely permissive."
expected_surface: UNKNOWN
expected_intent: "N/A — no surface resolves"
expected_resources: []
version: 1.0.0.0
---

# OB-021: Negative control -- non-OBSIDIAN target resolves no surface

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-021`.

---

## 1. OVERVIEW

This scenario validates that a target carrying no Obsidian markers does NOT resolve `OBSIDIAN` for
`OB-021`. It focuses on confirming that a task whose CWD/target files sit under `app-mobile/`,
`app-relay/`, or `packages/pi-rpc-protocol/` carries only paths that no live surface claims, so it
resolves `UNKNOWN`, not `OBSIDIAN`, and pulls in none of this packet's evidence. This is the
negative-control pair to `OB-020`: a detector that only ever fires is not proven precise; one that
correctly stays silent on a genuinely different surface is.

### Why This Matters

An over-eager surface detector that bundles `sk-code-obsidian` evidence for an unowned mobile-stack
task would hand the operator irrelevant, potentially misleading evidence — `.db-*` class
grammar and `styles.css` guidance mean nothing in a SvelteKit app repository, and citing them there
would be actively wrong, not merely unhelpful.

---

## 2. SCENARIO CONTRACT

Operators confirm a mobile-stack target carries none of the three `OBSIDIAN` markers and
resolves `UNKNOWN` instead, with zero `sk-code-obsidian` resources cited.

- Objective: confirm a task whose target files sit under `app-mobile/`, `app-relay/`, or
  `packages/pi-rpc-protocol/` resolves surface `UNKNOWN`, not `OBSIDIAN`, and `expected_resources`
  for this packet stays empty.
- Real user request: `I'm adding a new primitive token to app-mobile/src/shared/primitives/ in the Mobile CLI app repo — which surface's evidence applies here?`
- Prompt: `I'm adding a new primitive token to app-mobile/src/shared/primitives/ in the Mobile CLI app repo — which surface's evidence applies here?`

**Exact prompt**:
```text
I'm adding a new primitive token to app-mobile/src/shared/primitives/ in the Mobile CLI app repo — which surface's evidence applies here?
```

- Expected execution process: the hub checks for `manifest.json`'s `minAppVersion`,
  `esbuild.config.mjs`, and `from "obsidian"` imports; none is present in an `app-mobile/` target;
  no live surface claims `app-mobile/`, `app-relay/`, or `packages/pi-rpc-protocol/`, so the hub
  resolves `UNKNOWN` and bundles no surface evidence.
- Expected signals: none of the three `OBSIDIAN` markers appear in the target context; this packet's
  `expected_resources` list stays empty; no `sk-code-obsidian/references/` or
  `sk-code-obsidian/assets/` path is cited in the response.
- Desired user-visible outcome: the hub states this task resolves `UNKNOWN`, with no surface claiming
  it, and cites zero `sk-code-obsidian` paths.
- Pass/fail: PASS if zero `OBSIDIAN` markers are present in the target context and zero
  `sk-code-obsidian` resources are cited in the response; FAIL if any `OBSIDIAN` marker is found in
  the negative-control target, or `sk-code-obsidian` evidence is cited for a mobile-stack task.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I'm adding a new primitive token to app-mobile/src/shared/primitives/ in the Mobile CLI app repo — which surface's evidence applies here?`

### Commands

1. `sed -n '1,15p' .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/surface-detection/negative-control-non-obsidian.md`
2. `sed -n '/^## 1\. WHEN THE HUB BUNDLES THIS/,/^## 2\. REFERENCE MAP/p' .skilled/skills/sk-code/sk-code-obsidian/SKILL.md | grep -n 'minAppVersion\|esbuild.config.mjs\|from "obsidian"'`
3. `grep -c '^  - ' .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/surface-detection/negative-control-non-obsidian.md`

### Expected

Step 1 shows `expected_surface: UNKNOWN` (not `OBSIDIAN`). Step 2 lists the three `OBSIDIAN` markers
`SKILL.md` §1 detects, none of which the negative-control target carries. Step 3 prints `0`,
confirming this scenario's own `expected_resources` list is
empty — no `sk-code-obsidian` path should ever be cited for this target.

### Evidence

Command transcript from steps 1-3; the `OBSIDIAN` marker excerpt from step 2; confirmation that
the response cites zero `sk-code-obsidian/references/` or `sk-code-obsidian/assets/` paths.

### Pass / Fail

- **Pass**: step 3 prints `0`, step 2 confirms none of the three `OBSIDIAN` markers appears in the
  target context, and a live dispatch resolves `UNKNOWN` and cites zero `sk-code-obsidian` paths.
- **Fail**: an `OBSIDIAN` marker is found in the negative-control target, or a live dispatch cites any
  `sk-code-obsidian/references/` or `sk-code-obsidian/assets/` path for this mobile-stack task.

### Failure Triage

1. Re-run step 2 and confirm the `OBSIDIAN` marker set in `SKILL.md` §1 has not changed; if it has,
   update this negative control's marker excerpt to match the current set rather than
   the stale one.
2. If a live dispatch cites an `sk-code-obsidian` path for this target, that is a surface-detection
   over-firing regression in the hub — report it against `SKILL.md` §1's precedence rule, not against
   this packet's own evidence content.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `obsidian-surface-resolution.md` | The paired positive control for this category |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §1 | The `OBSIDIAN` markers this negative-control target must NOT carry |
| [stack-detection.md](../../../shared/references/stack-detection.md) | The hub's surface table and `UNKNOWN` fallback, where no surface claims the target's marker paths |

---

## 5. SOURCE METADATA

- Group: Surface Detection
- Playbook ID: OB-021
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `surface-detection/negative-control-non-obsidian.md`

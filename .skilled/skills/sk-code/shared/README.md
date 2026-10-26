---
title: sk-code shared
description: Index of the sk-code hub shared folder, which holds only doctrine about the parent hub and its nested modes, such as surface detection, the phase lifecycle, the implement, debug and verify workflow doctrine and the universal quality standards.
trigger_phrases:
  - "sk-code shared folder"
  - "sk-code shared references"
  - "shared workflow doctrine"
  - "sk-code surface detection"
importance_tier: normal
contextType: general
version: 1.1.1.0
---

# sk-code shared

> The hub-level doctrine every sk-code mode and surface reads: how a surface is chosen, how the phases run and which quality bar applies. Mode-owned material lives in its mode, never here.

---

## 1. OVERVIEW

`shared/` holds the material that belongs to the `sk-code` parent hub and to no single nested mode. The workflow modes `sk-code-quality` and `sk-code-review` act. The surface packets `sk-code-ci` and `sk-code-skilled` supply read-only evidence. All of them read the files below, so each file lives once here instead of being copied into every packet.

This README is also the hub's zero-signal fallback. [`../hub-router.json`](../hub-router.json) names this file as `routerPolicy.defaultResource`, and the router offers it with the disambiguation checklist when a prompt scores no mode. A scored route never loads it.

The folder ships reference files only, with no scripts, assets or graph metadata. Authoritative content lives in the linked files. This page only says what each one is for and who reads it.

---

## 2. STRUCTURE

```text example
shared/
+-- README.md                          # this index and the hub's zero-signal fallback
`-- references/
    +-- stack-detection.md             # surface detection, the primary routing key
    +-- phase-detection.md             # phase lifecycle and per-surface evidence
    +-- workflow-implement.md          # implementation doctrine, symlinked into surfaces
    +-- workflow-debug.md              # debugging doctrine, symlinked into surfaces
    +-- workflow-verify.md             # verification doctrine, symlinked into surfaces
    `-- universal/
        `-- code-quality-standards.md  # severity model for the quality gate
```

---

## 3. SURFACE ROUTING AND LIFECYCLE

| File | Purpose | Read by |
|---|---|---|
| [`references/stack-detection.md`](./references/stack-detection.md) | Surface detection over the declared surfaces, plus SKILLED language sub-detection. Specific surfaces go first in declared order, private `local-*` surfaces among them. `sk-code-skilled` is the one fallback surface and always ranks last, so any declared surface outranks it. UNKNOWN comes after that | `../SKILL.md` for the session surface hint, `../ROUTER.md` as part of the always-loaded preamble, `sk-code-quality` and `sk-code-review` for surface identity |
| [`references/phase-detection.md`](./references/phase-detection.md) | The phase lifecycle from research through the Phase 1.5 quality gate to verification, its iron laws and the evidence each surface supplies per phase | `../ROUTER.md` preamble and `sk-code-quality` |

The second-stage router itself is [`../ROUTER.md`](../ROUTER.md) at the hub root, not in this folder. It maps a code intent to the leaf resources the selected mode loads.

---

## 4. SHARED WORKFLOW DOCTRINE

Implement, debug and verify are phases, not modes. Their doctrine is surface-agnostic and lives once here. Each surface packet reaches it through symlinks, so the active surface carries the full workflow without a forked copy:

```text
../sk-code-ci/references/workflow-implement.md       -> ./references/workflow-implement.md
../sk-code-ci/references/workflow-debug.md           -> ./references/workflow-debug.md
../sk-code-ci/references/workflow-verify.md          -> ./references/workflow-verify.md
../sk-code-skilled/references/workflow-implement.md  -> ./references/workflow-implement.md
../sk-code-skilled/references/workflow-debug.md      -> ./references/workflow-debug.md
../sk-code-skilled/references/workflow-verify.md     -> ./references/workflow-verify.md
```

Paths are relative to this folder. On disk each link is the relative target `../../shared/references/workflow-<phase>.md`.

| File | Purpose | Read by |
|---|---|---|
| [`references/workflow-implement.md`](./references/workflow-implement.md) | Research and mutating build work after the router resolves the active surface | Both surface packets through their symlinks, `../SKILL.md` |
| [`references/workflow-debug.md`](./references/workflow-debug.md) | Root-cause diagnosis and scoped repair after a symptom, failing command, runtime error or failed gate, plus the command-failure recovery order | Both surfaces, `../ROUTER.md` with the DEBUGGING intent, hand-offs from `sk-code-quality` and `sk-code-review` |
| [`references/workflow-verify.md`](./references/workflow-verify.md) | The non-mutating evidence phase that runs last, compares against a baseline and gates any done, works, fixed or passing claim | Both surfaces, `../ROUTER.md` with the VERIFICATION intent, hand-offs from both workflow modes, the `sk-code-review` rule-copy check |

Edit the file under [`./references/`](./references/). A symlink resolves to it, so a change here reaches every surface at once.

---

## 5. UNIVERSAL STANDARDS

| File | Purpose | Read by |
|---|---|---|
| [`references/universal/code-quality-standards.md`](./references/universal/code-quality-standards.md) | The stack-agnostic P0/P1/P2 severity model for the Phase 1.5 Code Quality Gate | `sk-code-quality` before any implementation-done claim, the `../ROUTER.md` preamble, the `sk-code-review` rule-copy check |

The language-agnostic style guide, comment hygiene included, belongs to the quality mode at [`../sk-code-quality/references/code-style-guide.md`](../sk-code-quality/references/code-style-guide.md).

---

## 6. WHAT BELONGS HERE

A file belongs in `shared/` only when it is doctrine about the parent hub or about how its nested modes work together. Surface detection, the phase lifecycle, the cross-surface workflow doctrine and the cross-mode severity model pass that test.

A file stays out of `shared/` when a single mode or surface owns it:

- A mode's checklists, style guides and recovery playbooks go in that mode's own references or assets folder.
- Stack-specific standards go in the surface packet that owns the stack.
- Per-mode workflow contracts never land here, and neither does graph metadata. The hub carries the only [`../graph-metadata.json`](../graph-metadata.json).

When a shared file turns out to serve a single mode, move it into that mode and update its readers.

---

## 7. RELATED RESOURCES

- [`../SKILL.md`](../SKILL.md): the `sk-code` runtime contract that routes workflow modes and surfaces into these references.
- [`../ROUTER.md`](../ROUTER.md): the second-stage router and its always-loaded `DEFAULT_RESOURCE` preamble.
- [`../hub-router.json`](../hub-router.json): stage-one mode selection, the `tieBreak` order and the `defaultResource` that points here.
- [`../mode-registry.json`](../mode-registry.json): the two-axis mode registry and each surface's `surfaceDetection` block.
- [`../sk-code-quality/README.md`](../sk-code-quality/README.md): the workflow mode that applies the universal standards at its Phase 1.5 gate.

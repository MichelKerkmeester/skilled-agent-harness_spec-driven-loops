---
title: code-implement
description: Mutating implementation mode for sk-code. Owns Phase 0 research, Phase 1 implementation, WEBFLOW/OPENCODE authoring, and Motion.dev overlay loading.
trigger_phrases:
  - "implement code"
  - "build feature"
  - "webflow implementation"
  - "opencode authoring"
  - "motion.dev implementation"
version: 1.0.0.1
---

# code-implement

> Surface-aware implementation mode for `sk-code`: read first, consume the shared WEBFLOW/OPENCODE/UNKNOWN router, load the smallest authoring resource set, write the simplest correct change, then hand off quality and verification.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Researching and writing code in the resolved `sk-code` surface |
| **Invoke with** | "implement", "build", "refactor", "Webflow", "OpenCode", "Motion.dev", or hub routing to `workflowMode = implement` |
| **Works on** | WEBFLOW and OPENCODE surfaces, with Motion.dev as an overlay resource intent |
| **Produces** | A scoped implementation plus handoff notes for `code-quality`, `code-debug`, and `code-verify` |

---

## 2. OVERVIEW

`code-implement` is the mutating build packet in the `sk-code` parent hub. The hub chooses this mode through `mode-registry.json`; the shared router resolves the surface; this packet owns the implementation workflow and resource loading for that resolved surface.

It does not own final quality, debugging, review, or completion evidence. After writing, it hands off to sibling packets: `code-quality` for author checks, `code-debug` for failures, `code-verify` for evidence, and `code-review` for findings-first review output.

---

## 3. QUICK START

1. Resolve the mode through the parent hub and consume the shared surface decision from `../shared/references/stack_detection.md`.
2. Read target files before editing.
3. Load packet-owned references for the resolved surface: `references/webflow/`, `references/opencode/`, and `references/motion_dev/` only when Motion.dev intent is present.
4. For OPENCODE, detect the language sub-key and load the matching `references/opencode/<language>/` set.
5. For skills, agents, commands, MCP servers, or spec-folder docs, load the write-time checklist from `../code-quality/assets/opencode-checklists/` before writing.
6. Apply the Design Restraint Ladder, implement the smallest correct change, and hand off to quality and verification.

---

## 4. KEY CONTRACTS

| Contract | Rule |
|---|---|
| Surface routing | Surface identity is decided once in `../shared/`; this packet consumes it and does not re-detect |
| Read first | Target files must be read before editing |
| OPENCODE language | JavaScript, TypeScript, Python, Shell, and Config resources are selected by extension first |
| OpenCode authoring | Authoring checklists live in `../code-quality/assets/opencode-checklists/` and load at write-time |
| Motion.dev | Motion.dev is an overlay, not a surface |
| Completion | This mode never claims done; `code-verify` owns Iron Law evidence |
| Metadata | Mode packets do not get packet-local `graph-metadata.json` files |

---

## 5. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime mode contract |
| [`../SKILL.md`](../SKILL.md) | Parent hub routing contract |
| [`../mode-registry.json`](../mode-registry.json) | Source of truth for mode tool surfaces and packet mapping |
| [`../shared/references/stack_detection.md`](../shared/references/stack_detection.md) | Shared surface and language detection |
| [`../shared/references/smart_routing.md`](../shared/references/smart_routing.md) | Shared intent and resource routing |
| [`../shared/references/phase_detection.md`](../shared/references/phase_detection.md) | Shared lifecycle map |
| [`references/webflow/implementation/implementation_workflows.md`](./references/webflow/implementation/implementation_workflows.md) | Webflow implementation entry point |
| [`references/opencode/typescript/quick_reference.md`](./references/opencode/typescript/quick_reference.md) | Example OpenCode language entry point |
| [`references/motion_dev/quick_start.md`](./references/motion_dev/quick_start.md) | Motion.dev overlay entry point |
| [`../code-quality/assets/opencode-checklists/skill_authoring.md`](../code-quality/assets/opencode-checklists/skill_authoring.md) | Write-time OpenCode skill authoring checklist |

---

## 6. VERIFICATION

| Check | How to run it |
|---|---|
| Skill structure | `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-code/code-implement/ --check` |
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-code/code-implement/README.md --type readme` |
| Parent registry match | Confirm `allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task]` matches `implement.toolSurface.allowed` in `../mode-registry.json` |

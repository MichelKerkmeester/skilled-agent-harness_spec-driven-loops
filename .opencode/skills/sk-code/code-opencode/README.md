---
title: opencode
description: Read-only OPENCODE surface evidence for the sk-code hub — TypeScript/Python/shell/Rust/config standards, language-agnostic patterns, hooks, alignment verification, and authoring checklists. Bundled alongside a workflow mode; never a primary.
trigger_phrases:
  - "opencode system code"
  - "opencode authoring"
  - "system code standards"
version: 1.0.0.4
---

# opencode — System-Code Evidence (sk-code surface)

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Kind** | Surface evidence packet (`packetKind: surface`, read-only, advisor-invisible). |
| **Carries** | System-code evidence for the `.opencode/` tree: TypeScript/Python/shell/Rust/config standards, language-agnostic patterns, hook contracts, alignment verification, and skill/agent/command/MCP authoring checklists. |
| **Reached by** | The hub bundling it alongside a workflow mode when it detects a system-code surface, then slicing by the detected language — never routed as a primary. |
| **Mutates** | Nothing. The paired workflow mode owns all edits, tests, and commits. |

## 2. LAYOUT

- `SKILL.md` — the surface contract, reference map, and standards.
- `references/` — `typescript/`, `python/`, `shell/`, `rust/`, `config/`, `javascript/` (language standards); `shared/` (language-agnostic patterns, hooks, alignment verification).
- `assets/checklists/` — component authoring (skill/agent/command/mcp-server) + per-language quality gates.
- `changelog/` — release history.

Spec-folder authoring lives in system-spec-kit, not here. See `SKILL.md` for the full reference map and standards.

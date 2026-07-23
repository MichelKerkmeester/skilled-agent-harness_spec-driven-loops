---
title: opencode
description: Read-only OPENCODE surface evidence for the sk-code hub: TypeScript/Python/shell/Rust/config standards, language-agnostic patterns, hooks, alignment verification and authoring checklists. Bundled alongside a workflow mode, never a primary.
trigger_phrases:
  - "opencode system code"
  - "opencode authoring"
  - "system code standards"
version: 1.0.0.4
---

# opencode: System-Code Evidence (sk-code surface)

> The right language standard and authoring checklist for `.opencode/` work, handed to the paired workflow mode without you having to know which reference tree to open.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Kind** | Surface evidence packet (`packetKind: surface`, read-only, advisor-invisible). |
| **Carries** | System-code evidence for the `.opencode/` tree: TypeScript/Python/shell/Rust/config standards, language-agnostic patterns, hook contracts, alignment verification and skill/agent/command/MCP authoring checklists. |
| **Reached by** | The hub bundling it alongside a workflow mode when it detects a system-code surface, then slicing by the detected language. Never routed as a primary. |
| **Mutates** | Nothing. The paired workflow mode owns all edits, tests and commits. |

---

## 2. OVERVIEW

### Why This Surface Exists

A task that touches `.opencode/` (a skill, agent, command, plugin, MCP server or descriptor) needs the right language rules and the right authoring checklist, not the whole sk-code reference tree. Without this surface, a workflow mode would either have to hold every language's standards itself or guess which trio applies, and a TypeScript edit would end up pulling Python and shell guidance it never needed.

### What It Carries

This surface holds the `.opencode/` evidence: language standards for TypeScript, Python, shell, Rust and config, a language-agnostic shared tier (naming, organization, hooks, alignment verification), and authoring checklists for skills, agents, commands and MCP servers. The sk-code hub detects the `.opencode/` surface first, then slices to the one language trio the task actually touches. Its sibling `code-webflow` carries frontend/browser evidence instead. The hub picks one surface by detection, and only an interop task spanning both languages legitimately loads both.

---

## 3. LAYOUT

- `SKILL.md`: the surface contract, reference map and standards.
- `references/`: `typescript/`, `python/`, `shell/`, `rust/`, `config/`, `javascript/` (language standards), plus `shared/` (language-agnostic patterns, hooks, alignment verification).
- `assets/checklists/`: component authoring (skill/agent/command/mcp-server) plus per-language quality gates.
- `scripts/`: the drift-guard runner for this surface.
- `changelog/`: release history.

Spec-folder authoring lives in system-spec-kit, not here. See `SKILL.md` for the full reference map and standards.

---
title: "Resource Map — Bring the \"Pi Remote\" mobile PWA's chat UI and UX really close to the Claude and GPT mobile apps, both the interaction UX and the visual UI styling in general. Pi Remote is an installable iPhone PWA (Vite + React 19 + Tailwind 4 + React Aria) that remote-controls the Pi coding agent over a Tailscale tailnet. The single live session is driven from a compose box; the transcript renders typed blocks (text, thinking, plan, tool_call, tool_result, file_diff, usage) with live streaming. RESEARCH GOAL: find concrete, adoptable improvements so the chat experience feels like a first-class modern AI app. Cover these four operator-requested capabilities in depth, plus overall chat UI/UX polish: 1. Easy model switching from the phone — how Claude, GPT, Cursor mobile, and similar apps expose a model picker (placement, affordance, in-conversation vs settings, showing the active model), and how to wire it to pi RPC model selection. 2. Easy effort / reasoning-level switching — how leading apps present thinking/effort tiers (e.g. a segmented control, a quick menu), and how to map to pi thinking levels. 3. Typed commands — a command input surface (slash commands and quick actions), discoverability, autocomplete, and how it maps to pi commands without weakening safety. 4. Tab-to-plan-mode — a fast toggle into read-only plan mode using the pi plan-mode extension (the --plan flag); how apps present a mode switch and keep it obvious which mode is active. Also study the general chat UI/UX and visual styling of the Claude and GPT apps and other strong references (message layout, streaming feel, spacing, typography, color, motion, input bar ergonomics, empty states, quick actions), and extract patterns worth adopting for Pi Remote's restrained-token, one-accent, light/dark, prefers-reduced-motion, React-Aria design. For each finding give: the source, the pattern, why it helps ease-of-use, and how to apply it concretely to Pi Remote's stack. Read the current implementation at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src (App.tsx, state.ts, relay.ts, attention.ts, style.css) and the design docs under /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs, plus the earlier UI/UX research at specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/research.md. Note: pi now runs in full-access desktop-parity mode per operator choice, but the transport keeps redaction and foreground-authority, so recommendations must fit the PWA + relay architecture."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 19
- **By category**: READMEs=0, Documents=14, Commands=0, Agents=0, Skills=0, Specs=0, Scripts=5, Tests=0, Config=0, Meta=0
- **Missing on disk**: 19
- **Scope**: research convergence output for 047-pi-remote-desktop-parity-chat-ux
- **Generated**: 2026-08-15T07:32:58.986Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| 044-pi-mobile-ui-ux-research/research/research.md | Cited | MISSING | Citations=1; Iterations=1 |
| App.tsx | Cited | MISSING | Citations=1; Iterations=1 |
| Claude model/effort settings | Cited | MISSING | Citations=1; Iterations=1 |
| docs/security.md | Cited | MISSING | Citations=1; Iterations=1 |
| Pi docs/rpc.md | Cited | MISSING | Citations=2; Iterations=2 |
| Pi docs/sdk.md | Cited | MISSING | Citations=1; Iterations=1 |
| Pi docs/usage.md | Cited | MISSING | Citations=1; Iterations=1 |
| Pi README.md | Cited | MISSING | Citations=1; Iterations=1 |
| Pi Remote App.tsx | Cited | MISSING | Citations=1; Iterations=1 |
| Pi Remote security.md | Cited | MISSING | Citations=1; Iterations=1 |
| Pi Remote style.css | Cited | MISSING | Citations=1; Iterations=1 |
| PromptService | Cited | MISSING | Citations=1; Iterations=1 |
| RpcSupervisor | Cited | MISSING | Citations=1; Iterations=1 |
| style.css | Cited | MISSING | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| attention.ts | Cited | MISSING | Citations=1; Iterations=1 |
| pi-rpc-protocol/guards.ts | Cited | MISSING | Citations=1; Iterations=1 |
| pi-rpc-protocol/types.ts | Cited | MISSING | Citations=1; Iterations=1 |
| relay.ts | Cited | MISSING | Citations=1; Iterations=1 |
| state.ts | Cited | MISSING | Citations=1; Iterations=1 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| gptsol | lineages/gptsol/deltas/iter-001.jsonl |
| gptsol | lineages/gptsol/deltas/iter-002.jsonl |
| gptsol | lineages/gptsol/deltas/iter-003.jsonl |
| gptsol | lineages/gptsol/deltas/iter-004.jsonl |
| gptsol | lineages/gptsol/deltas/iter-005.jsonl |
| grok45 | lineages/grok45/deltas/iter-001.jsonl |
| grok45 | lineages/grok45/deltas/iter-002.jsonl |
| grok45 | lineages/grok45/deltas/iter-003.jsonl |
| grok45 | lineages/grok45/deltas/iter-004.jsonl |
| grok45 | lineages/grok45/deltas/iter-005.jsonl |

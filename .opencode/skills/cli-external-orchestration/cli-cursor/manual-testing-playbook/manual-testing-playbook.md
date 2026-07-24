---
title: "cli-cursor: Manual Testing Playbook"
description: "Scaffold placeholder for the cli-cursor skill's manual testing playbook. Scenario content is authored in a later phase of the same creation packet."
version: 1.0.0.0
---

# cli-cursor: Manual Testing Playbook

> **STATUS: SCAFFOLD ONLY.** This directory exists for family-parity with `cli-codex`/`cli-claude-code`/`cli-opencode` (each of which ships a populated playbook). Cursor-native scenario content — plan/ask modes, worktree isolation, cloud worker, MCP, shared hooks, session continuity — is authored in `006-cursor-manual-testing-playbook`, a later phase of the same `030-cli-cursor-creation` creation packet. This file is not yet a scored validation corpus.

> **SELF-INVOCATION GUARD**: When populated, this playbook will validate the `cli-cursor` skill from a non-Cursor runtime (Claude Code, Codex, OpenCode, or shell). Operators MUST NOT execute future scenarios from inside Cursor CLI itself — the skill refuses to load when Cursor env vars (`CURSOR_AGENT`/`CURSOR_CONVERSATION_ID`) or process ancestry are detected. See `../SKILL.md` §2 Self-Invocation Guard.

---

## 1. WHY THIS IS A SCAFFOLD, NOT CONTENT

`030-cli-cursor-creation/003-cli-cursor-skill-packet/spec.md` explicitly scopes manual-testing-playbook *content* authoring to a later phase of the packet: "this phase only scaffolds the directory; the Cursor-native scenarios are authored in phase 006." Populating real scenarios here now would either duplicate work the later phase already owns, or ship placeholder scenarios that look real but were never executed — both against this repo's "Never fabricate" mandate.

---

## 2. PLANNED CATEGORIES (NOT YET AUTHORED)

The later phase's spec names these Cursor-native scenario categories (not a sibling's categories copy-pasted, since Cursor's real capabilities differ materially):

- Plan/ask read-only modes
- Default agent write-capable dispatch (approval-flag matrix)
- Model selection (Auto router, Composer, hosted-frontier ids)
- Native worktree isolation (`-w`, opt-in escape hatch)
- Cloud worker (`cursor-agent worker`, opt-in escape hatch)
- MCP client integration
- Shared editor-config surface (hooks/rules/MCP inheritance)
- Session continuity (`--resume`/`--continue`)

---

## 3. WHEN THIS FILE IS SUPERSEDED

Once `006-cursor-manual-testing-playbook` lands, this file's content is replaced with a real scenario directory and index, following the Feature Catalog split-document pattern the sibling packets already use (root playbook as directory/orchestration guide, category subfolders holding per-scenario execution contracts).

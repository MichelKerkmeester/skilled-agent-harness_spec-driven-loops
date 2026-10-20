---
title: "Implementation Plan: Phase 33: battery-mcp-prompt-commands"
description: "Read the private v2 server's config sources once per run, take the MCP server names from the keys of `info.mcp.servers`, and accept a `<server>:<prompt>` command name only for a configured server. A separate array parser reads the config endpoint, and the pass detail names how many prompts were accepted."
trigger_phrases:
  - "battery mcp prompt commands plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 33: battery-mcp-prompt-commands

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS) |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` |

### Overview
The v2 read gains one call to the private server's `GET /api/config`, whose body is a top-level array, so `readApiJson` takes a selectable parser and `parseJsonArray` reads that endpoint. `mcpServerNames` turns the config sources into a sorted list of server names. `legCommandListed` keeps its required-and-allowed test and gains one exemption: a listed name with a prefix that names a configured server passes, and each such name is counted in the PASS details as `mcp prompts: <n>`. Nothing else changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met (pending: the CI handoff)
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other - diagnostic tooling.

### Key Components
- **`parseJsonArray(text)`**: reads a top-level JSON array from a stream that may carry noise, returns null when nothing parses.
- **`readApiJson(..., parse)`**: gains a parser argument, defaulting to `parseJsonObject`, so the array endpoint can share the authenticated read.
- **`mcpServerNames(configResponse)`**: collects the keys of each source's `info.mcp.servers`, or the older direct `info.mcp` keys, and returns them sorted.
- **`legCommandListed(family, listed, sources)`**: keeps the required and allowed test; a colon-prefixed name whose prefix is in `sources.mcpServers` passes and increments the accepted count.
- **`readV2(...)`**: reads `GET /api/config` once with the same project environment and puts the result in `config`.

### Data Flow
`readV2` reads the config sources, `mcpServerNames` reduces them to names, `legsForV2` passes those names into `legCommandListed`, and the verdict adds `mcp prompts: <n>` when any prompt name was accepted.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The unit suite moves from 45 to 50 tests. The five new tests (C9 to C13) cover both config shapes and a non-array body, a configured prompt that passes, an unprefixed stray that fails, an unconfigured prefix that fails and an unreadable config that degrades a prefixed name. Five mutations of the new code were run: never accept, always accept and ignore `info.mcp.servers` each fail 2 tests, and degrade-whenever-any-prefixed-name and drop-the-config-read each fail at least 1. The battery itself runs in worktree 173 for both families, and the v2 family runs nine times over two sessions with `--root` on the main checkout so both listing sizes are observed. The nested worktree read is also checked: it reads only its own `.opencode` folder, so no MCP prompt appears and the leg still passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The private OpenCode 2 server's `GET /api/config` endpoint, which returns the config sources it read as a top-level array. The `code_mode` MCP server in the repository's `.opencode` config supplies the prompt the v2 runtime lists.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit. Only the battery script, its unit tests and docs change, so a revert restores the strict stray test and the v2 leg can fail at random again when the MCP prompt is listed.
<!-- /ANCHOR:rollback -->

---

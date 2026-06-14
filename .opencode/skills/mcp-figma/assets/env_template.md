---
title: Figma Code Mode Env Template - prefixed token line
description: The single prefixed .env line for the optional Framelink figma MCP token used by this project's Code Mode.
trigger_phrases:
  - "figma env template"
  - "figma api key prefixed"
  - "figma code mode token"
  - "figma_figma_api_key env"
importance_tier: normal
contextType: implementation
---

# Figma Code Mode Env Template - prefixed token line

The single prefixed `.env` line that authenticates the OPTIONAL Framelink `figma` MCP through this project's Code Mode.

---

## 1. OVERVIEW

### Purpose

The `figma-ds-cli` itself needs NO Figma API key, since it drives the live Figma Desktop session. This env line is only for the opt-in Code Mode path that pulls design context FROM Figma via the community Framelink `figma-developer-mcp`. It exists so the token is supplied in the prefixed form Code Mode expects.

### Usage

Copy the line below into the project `.env`, replace the placeholder with a Figma personal access token (Figma → Settings → Account → Personal Access Tokens), and never commit `.env`. The manual entry that consumes this key lives in [utcp_figma_manual.md](./utcp_figma_manual.md).

---

## 2. ENV LINE

**Key Points**:
- Code Mode prefixes env vars with `{manual_name}_`. The Figma manual `name` is `figma`, so the key MUST be `figma_FIGMA_API_KEY` (the bare `FIGMA_API_KEY` is not found by Code Mode).
- The value is a Figma personal access token, shown only once at creation.
- Keep all credentials out of version control and out of user-facing output.

**Template** (add to `.env`):

```bash
# Figma Configuration
# (Code Mode prefixes all env vars with the manual name "figma" from .utcp_config.json)
figma_FIGMA_API_KEY=figd_your_token_here
```

**Field Guidelines**:

**`figma_FIGMA_API_KEY`**:
- Prefix `figma_` is the Code Mode manual name, and `FIGMA_API_KEY` is the variable the manual references as `${FIGMA_API_KEY}`.
- Format: a Figma personal access token, typically `figd_...`.
- Required only for the optional Code Mode Figma MCP path, and the CLI does not use it.

---

## 3. VERIFY

Confirm the prefixed key is present before relying on the optional MCP:

```bash
grep '_FIGMA_API_KEY' .env   # should show: figma_FIGMA_API_KEY=figd_...
```

A bare `FIGMA_API_KEY=...` line will surface the Code Mode error "Variable 'figma_FIGMA_API_KEY' ... not found".

---

## 4. RELATED RESOURCES

- [utcp_figma_manual.md](./utcp_figma_manual.md) - The paste-ready `.utcp_config.json` manual entry that consumes this key.
- [mcp_wiring.md](../references/mcp_wiring.md) - The optional Figma MCP wiring reference.

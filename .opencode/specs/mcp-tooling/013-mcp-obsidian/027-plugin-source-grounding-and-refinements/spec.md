# Spec — mcp-obsidian plugin source-grounding + Local REST API reference

## Status

- **Level:** 1
- **State:** complete
- **Type:** Documentation refinement (skill docs only; no runtime code)

## Purpose

Follow-up refinements on the `mcp-obsidian` skill after the 025 coverage review and 026 template-conformance passes: ground the `VERIFY`-marked claims that the installed plugin sources actually resolve, and document the Local REST API plugin's own REST + built-in-MCP surface (which the skill referenced but never described).

## Scope

- **Ground 2 VERIFY markers** against installed plugin source — Minimal's enabled-snippets key and the Charts block-language registrations.
- **Add `references/lra-rest-surface.md`** — a conformant reference documenting the Local REST API plugin's 14 REST endpoints and its built-in Streamable-HTTP MCP at `/mcp/`, wired into the `MCP_ADVANCED` router and cross-linked from `mcp-tools.md`.
- **Out of scope:** the remaining VERIFY markers, which are legitimate runtime/API/minified-source caveats and stay as honest markers (documented, not removed).

## Acceptance criteria

- AC1: the 2 grounded claims cite the exact source token (`enabledCssSnippets`; `registerMarkdownCodeBlockProcessor("chart")` / `("advanced-chart")`), and their `data-model.md` docs still pass `validate_document.py`.
- AC2: `references/lra-rest-surface.md` passes `validate_document.py`, is reachable from the router (`MCP_ADVANCED` + loading levels + `PLUGINS` fallback) and cross-linked from `mcp-tools.md`, with 0 dangling links.
- AC3: SKILL.md version bumped, changelog authored, leaf-manifest regenerated; every touched doc validates and 0 files outside `mcp-tooling/` are staged.

## Outcome

All met. Shipped to v4 as `5ab29d5bfc`. The grounding pass was deliberately low-yield — only 2 of ~17 markers were cleanly groundable from installed source; the rest are honest runtime/API caveats and were kept. Details in `implementation-summary.md`.

# Plan — mcp-obsidian source-grounding + Local REST API reference

## Approach

Two evidence-backed refinements, done directly (no fan-out) in an isolated worktree from `origin/skilled/v4.0.0.0`; the main tree and real vaults are never touched.

1. **Ground the groundable VERIFY markers.** Sweep the ~17 `VERIFY` markers across the plugin references; for each, check whether the installed plugin source resolves it. Only rewrite a marker into a grounded claim when the source gives an exact token — leave runtime/API/minified-source caveats as honest markers.
2. **Author `references/lra-rest-surface.md`.** Read the Local REST API plugin's `openapi.yaml` for the endpoint list; confirm the built-in Streamable-HTTP MCP at `/mcp/` live via the initialize→initialized→tools/list handshake; write a template-conformant reference and wire it into the router.
3. **Version + changelog + manifest.** Bump SKILL.md, author the changelog, regenerate the leaf-manifest.
4. **Verify + ship.** Validate every touched doc, confirm no dangling links and nothing outside `mcp-tooling/`, commit + push to v4 via the worktree, record here.

## Critical files

- Grounded: `references/plugins/minimal/data-model.md`, `references/plugins/charts/data-model.md`.
- New: `references/lra-rest-surface.md`; `changelog/v0.15.0.0.md`.
- Wiring: `SKILL.md` (`MCP_ADVANCED` map, loading levels, `PLUGINS` fallback, version), `references/mcp-tools.md` (cross-link + 2 header-case fixes surfaced during validation).
- Regenerated: `mcp-tooling` leaf-manifest.

## Verification

- `validate_document.py` exit 0 on every touched doc (the 2 grounded data-models, the new reference, mcp-tools.md).
- Dangling-link sweep on the new reference: 0 unresolved relative links.
- `git diff --cached` shows 0 files outside `.opencode/skills/mcp-tooling/`.
- Grounded claims trace to a real source token, not a paraphrase.

## Risk note

Low-blast, reversible — additive docs plus two claim tightenings, no runtime code. The only real risk is over-claiming during grounding (asserting a source fact that is not actually there); mitigated by requiring an exact source token per grounded marker and keeping every uncertain marker as-is.

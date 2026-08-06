# Implementation Summary — mcp-obsidian source-grounding + Local REST API reference

## Final state: complete — shipped to v4 as `5ab29d5bfc`

Two evidence-backed refinements landed: the groundable VERIFY markers are now grounded claims, and the Local REST API plugin's REST + built-in-MCP surface has its own conformant reference, wired into the router.

## What changed

- **2 VERIFY markers grounded to installed source:**
  - Minimal — the enabled-snippets key is `enabledCssSnippets` in `appearance.json` (absent until the first snippet is enabled).
  - Charts 3.9.0 — registers exactly two block languages, `chart` and `advanced-chart` (confirmed from `main.js`: `registerMarkdownCodeBlockProcessor("chart")` and `("advanced-chart")`).
- **New `references/lra-rest-surface.md`** — documents the Local REST API plugin's 14 REST endpoints (read from its `openapi.yaml`) and its built-in Streamable-HTTP MCP at `/mcp/` exposing 16 `vault_*` tools (confirmed live via the initialize→initialized→tools/list handshake), with the loopback-only TLS caveat. Wired into `MCP_ADVANCED`, the loading levels, and the `PLUGINS` fallback; cross-linked from `mcp-tools.md`.
- **`mcp-tools.md`** — added the cross-link and, surfaced during validation, uppercased 2 H2 headers that still carried lowercase `notesmd-cli` (the root reference docs were never in the 026 conformance pass; this one now passes, the other two already did).
- **Housekeeping** — SKILL.md bumped to 0.15.0.0, `changelog/v0.15.0.0.md` authored, mcp-tooling leaf-manifest regenerated.

## How

Done directly in an isolated worktree from `origin/skilled/v4.0.0.0` — no fan-out; the grounding is a source-read judgment task, not a rewrite. Every touched doc validated before commit.

## Verification (all passed)

- `validate_document.py`: PASS on both grounded data-models, the new reference, and `mcp-tools.md`.
- Dangling links on `lra-rest-surface.md`: **0**; quoted/1.x version residue: **0**.
- Staged scope: **0** files outside `.opencode/skills/mcp-tooling/` (7 files).
- Each grounded claim traces to an exact source token, not a paraphrase.

## Scar tissue

- The grounding pass was low-yield by design: only 2 of ~17 VERIFY markers were cleanly groundable from installed source. The rest are legitimate runtime/API/minified-source caveats and were kept as honest markers rather than forced into false certainty.
- The 3 root reference docs (`mcp-tools.md`, `obsidian-cli-commands.md`, `troubleshooting.md`) were never part of the 026 conformance pass (which scoped `references/plugins/` + assets). `mcp-tools.md` is now clean; the other two already validated.

## Follow-ups (not done here)

- BRAT release fixture to make the OBS-013 scenario headlessly testable (currently SKIP — needs network).
- Commit the scenario-test harness (`run-plugin-scenarios.sh`) as a reusable asset.
- Full Iconic parity (file/folder/tag rules) across the vaults, and cleanup of the vault `.bak-ribbon-menu` backups.

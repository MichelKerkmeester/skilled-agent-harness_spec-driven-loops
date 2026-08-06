# Tasks — mcp-obsidian source-grounding + Local REST API reference

- [x] T1: Sweep the VERIFY markers; determine which resolve against installed plugin source. — *~17 markers reviewed; 2 cleanly groundable.*
- [x] T2: Ground Minimal's enabled-snippets marker to `enabledCssSnippets` (key absent until first snippet enabled). — `references/plugins/minimal/data-model.md`
- [x] T3: Ground Charts' block-language marker to `chart` + `advanced-chart` (from `main.js` `registerMarkdownCodeBlockProcessor`). — `references/plugins/charts/data-model.md`
- [x] T4: Read the Local REST API `openapi.yaml`; confirm the built-in `/mcp/` MCP live via handshake. — *14 REST endpoints; 16 `vault_*` tools confirmed.*
- [x] T5: Author `references/lra-rest-surface.md` (7 sections: overview, auth/transport, REST endpoints, built-in MCP, when-to-use, must-not-do, related). — passes `validate_document.py`.
- [x] T6: Wire into router — `MCP_ADVANCED` map, loading levels, `PLUGINS` fallback; cross-link from `mcp-tools.md`. — SKILL.md + mcp-tools.md.
- [x] T7: Fix 2 lowercase `notesmd-cli` H2 headers in `mcp-tools.md` surfaced by validation. — → `NOTESMD-CLI`, PASS.
- [x] T8: Bump SKILL.md to 0.15.0.0, author changelog, regenerate leaf-manifest.
- [x] T9: Validate all touched docs, dangling-link + scope sweep, commit + push to v4. — shipped `5ab29d5bfc`.

# Iteration 2: Community CLI identities and headless value

## Focus

Verify installable CLI identities and binaries, separate content automation from Sync/Publish tooling, and measure community coverage against the official `obsidian` CLI.

## Findings

1. **The maintained community content CLI is `Yakitrak/notesmd-cli`, binary `notesmd-cli`.** The project was renamed from `obsidian-cli` after the official CLI shipped, specifically to remove identity ambiguity. Verified installs are Homebrew `yakitrak/yakitrak/notesmd-cli`, Scoop `notesmd-cli`, AUR `notesmd-cli-bin`, or a Go build from the repository. The old binary/package name `obsidian-cli` is legacy and should not appear in new configuration. [SOURCE: https://github.com/Yakitrak/notesmd-cli]
2. **`notesmd-cli` is genuinely headless because it edits the vault filesystem directly.** It can register an absolute vault directory without Obsidian installed, and read/create/update/append/move/delete files, fuzzy-search filenames, content-search with JSON output, manage YAML frontmatter, and create daily notes using `.obsidian/daily-notes.json` plus the configured template. No REST token is required; the trust boundary is filesystem access to the vault path. [SOURCE: https://github.com/Yakitrak/notesmd-cli]
3. **Its headless value comes with a smaller semantic surface.** Dedicated backlinks/outgoing-link queries, vault-wide tag indexes, generic template discovery/insertion, plugin commands, and Obsidian's live metadata cache are absent from the documented command set. Move/rename rewrites links by scanning files, but this is not equivalent to querying the live Obsidian link index. It is a credible fallback, not a feature-parity replacement for the official CLI. [SOURCE: https://github.com/Yakitrak/notesmd-cli]
4. **The official headless package is `obsidian-headless`, binary `ob`.** The repository is `obsidianmd/obsidian-headless`, installation is `npm install -g obsidian-headless`, and Node 22+ is required. Its responsibility is Obsidian Sync and Publish without the desktop app; it is not a note-management CLI and does not expose CRUD/search/backlinks/tags/templates. [SOURCE: https://github.com/obsidianmd/obsidian-headless]
5. **`obsidian-headless` has account credentials, unlike content CLIs.** `ob login` uses Obsidian account email/password/MFA interactively, stores credentials, and supports non-interactive JSON modes for subsequent sync/publish commands. It should be treated as an optional sync bootstrap for a headless vault, not as the CLI surface of `mcp-obsidian`. [SOURCE: https://github.com/obsidianmd/obsidian-headless]
6. **A second app-coupled community direction—`dsebastien/obsidian-cli-rest`—wraps the official CLI into REST/MCP.** Its identity is an Obsidian community plugin (`cli-rest-mcp` folder), not an npm executable. It requires Obsidian Desktop and the official CLI, starts a bearer-token HTTP server, and exposes all CLI commands plus a two-tool MCP interface. This duplicates the stronger Local REST API plugin's transport role and adds another dependency layer. [SOURCE: https://github.com/dsebastien/obsidian-cli-rest]
7. **CLI ranking after identity verification:** (1) adopt official `obsidian` for the primary local CLI; (2) optionally adopt `notesmd-cli` only when a documented headless-filesystem profile is required; (3) use `obsidian-headless` only for Sync/Publish provisioning; (4) do not build a new general CLI unless a single stable JSON schema across app-running and headless profiles is a hard requirement. A thin adapter can normalize output and safety without reimplementing note semantics.

## Sources Consulted

- NotesMD CLI upstream repository: https://github.com/Yakitrak/notesmd-cli
- Official Obsidian Headless repository: https://github.com/obsidianmd/obsidian-headless
- Obsidian CLI REST plugin documentation: https://github.com/dsebastien/obsidian-cli-rest
- Official Obsidian CLI comparison baseline: https://obsidian.md/help/cli

## Assessment

- `newInfoRatio`: **0.78**
- Novelty justification: this pass verified three distinct install identities and proved that only `notesmd-cli` is a headless content CLI; it also narrowed `obsidian-headless` to Sync/Publish and eliminated a redundant REST-wrapper option.
- Confidence: high for package/binary and headless claims from upstream READMEs; medium for completeness gaps because undocumented commands could exist, though the published command inventory is explicit.

## Reflection

What worked: repository rename/migration notes eliminated the most dangerous identity collision; command inventories separated content management from Sync/Publish cleanly.

What failed or was ruled out: npm searches around `obsidian-cli` are an unreliable discovery mechanism because the current official CLI is bundled, while the maintained community tool is distributed primarily as a Go binary. `obsidian-headless` is ruled out as a note CLI; `obsidian-cli-rest` is ruled out as the preferred MCP server because it stacks an extra wrapper on the app and official CLI.

## Recommended Next Focus

Verify MCP server candidates, exact package/binary identities, transport/auth models, and feature coverage—especially backlinks, tags, frontmatter, templates, and whether they can run directly on vault files.

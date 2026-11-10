# mcp-code-mode changelog digest

Skill path: `.opencode/skills/mcp-code-mode/` · Versions covered: v1.0.0.0 through v1.0.8.0 (9 entries, the full changelog directory, fewer than 10 exist) · Date range: 2025-12-28 through 2026-08-04.

Note on ordering: `sort -V` places `v1.0.0.31.md` second, but it is dated 2026-08-04 and is the newest entry by date. There is no `v1.0.6.0.md`, so the version series has a gap between v1.0.5.0 and v1.0.7.0.

---

## Per version, newest first

### v1.0.0.31 (2026-08-04, newest by date)

`v1.0.0.31.md` records a documentation-only rewrite of `README.md` into the purpose-first narrative voice every standalone skill README now uses, shaped after the refined skill README template with the mcp-obsidian README as the reference. The README now opens with a one-line pitch blockquote, an AT A GLANCE table and a problem-first OVERVIEW carrying WHY THIS SKILL EXISTS and WHAT IT DOES, plus a new Tool Surface capability table naming the tool families Code Mode operates. Section headers moved to numbered ALL-CAPS H2 form with `---` dividers. The entry states the README version moved from `1.0.0.30` to `1.0.0.31`, which is a README-local version and not the SKILL.md version. No runtime behavior changed.

### v1.0.8.0 (2026-02-20)

`v1.0.8.0.md` is a wording-only change that makes `SKILL.md` the explicitly stated starting point and reframes the older navigation page as supplemental, so readers stop treating it as the primary guide. REMOVED in practice since that entry: the `index.md` it reframed no longer exists at the skill root, so the entry's Files Changed row for `.opencode/skills/mcp-code-mode/index.md` points at a path that is gone. No behavior change was claimed.

### v1.0.7.0 (2026-02-16)

`v1.0.7.0.md` strips decorative symbols from headings across `SKILL.md`, `README.md`, `INSTALL-GUIDE.md`, `references/configuration.md` and `references/tool-catalog.md`, and normalizes the heading style so the package clears current documentation validation rules. Readability and validation cleanup only.

### v1.0.5.0 (2026-02-15)

`v1.0.5.0.md` adds hidden section markers around the main sections of `README.md` so retrieval and memory tooling can target a section precisely instead of the whole document, and lightly cleans up wording that did not match the project writing rules.

### v1.0.4.0 (2026-02-07)

`v1.0.4.0.md` brings the maintenance scripts up to the project shell and Python standards. `scripts/update.sh` gains stricter defaults, clearer variable handling and better error output. `scripts/validate_config.py` gains clearer documentation, stronger typing and narrower exception handling. This is the only entry in the window that touches executable behavior rather than prose.

### v1.0.3.0 (2026-02-03)

`v1.0.3.0.md` adds the standard project file header to `scripts/update.sh` and `scripts/validate_config.py` so the maintenance scripts read like the rest of the codebase. Presentation only.

### v1.0.2.0 (2026-01-31)

`v1.0.2.0.md` rewrites the environment-setting documentation so the required prefix pattern for environment variable names is stated the same way in every document. It touches `assets/env-template.md`, `assets/config-template.md`, `references/configuration.md`, `SKILL.md`, `README.md` and `INSTALL-GUIDE.md`. The entry frames this as fixing an easy-to-miss setup detail rather than changing the required format itself.

### v1.0.1.0 (2026-01-05)

`v1.0.1.0.md` embeds the runner source directly inside the skill folder at `.opencode/skills/mcp-code-mode/mcp-server/`, so the skill and its core source travel as one self-contained package. It also strengthens the environment-setup guidance in `assets/env-template.md`, `INSTALL-GUIDE.md` and `references/configuration.md` around the required naming format.

### v1.0.0.0 (2025-12-28)

`v1.0.0.0.md` is the first release. It introduces one shared TypeScript tool runner that can call many connected tools from a single flow, loads tool details on demand rather than up front and keeps state between steps, which is the context-reduction claim the skill is built on. It ships `SKILL.md`, `README.md`, `references/configuration.md`, `references/naming-convention.md`, `references/tool-catalog.md`, `assets/config-template.md` and `assets/env-template.md`.

---

## Facts the v4 draft gets wrong or misses

- The draft never mentions `mcp-code-mode` by name anywhere in its MCP Tooling section (lines 371 to 391) or in its Upgrade Notes, even though `SKILL.md` states Code Mode is MANDATORY for ALL MCP tool calls and the draft itself routes two hub modes through it. Draft line 388 says `mcp-notion` runs "through the official server over Code Mode" and line 389 says `mcp-magicpath` runs over a `cli` manual, both of which depend on this skill, but the skill delivering that capability is never introduced. Verified against `v1.0.0.0.md`, which is the entry that establishes the shared runner.
- Draft line 377 says "Every bridge lives under a single `mcp-tooling` parent." That is not true of `mcp-code-mode`, which is still a top-level standalone skill at `.opencode/skills/mcp-code-mode/` and is not one of the nine mode directories under `.opencode/skills/mcp-tooling/`. Its own `graph-metadata.json` records `mcp-tooling` under `prerequisite_for`, not as a parent. No changelog entry in this window records any move into the hub.
- Draft line 385 through 389 lists what the hub's shelf gained, but no entry in this changelog window records `mcp-code-mode` gaining, losing or renaming any transport, so nothing in these nine entries contradicts that list. The gap is only the omission above.
- The draft's "Repoint what moved" bullet at draft line 444 lists `mcp-figma` moving under `mcp-tooling/` but does not mention that `.opencode/skills/mcp-code-mode/mcp-server/` became the embedded home of the runner source. That move is recorded in `v1.0.1.0.md` and would matter to anyone who had pinned the runner source elsewhere.
- The draft has no record of the `index.md` situation. `v1.0.8.0.md` reframes `.opencode/skills/mcp-code-mode/index.md` as supplemental, and that file no longer exists at the skill root, so a reader following the v1.0.8.0 entry is sent to a path that is gone. The draft neither documents the removal nor warns about it.
- Nothing in these nine entries supports or contradicts the draft's `.utcp_config.json` instructions at draft lines 294 and 445. The changelog entries discuss `assets/config-template.md` and `assets/env-template.md` only, never `.utcp_config.json` by name, so the draft's claim is neither confirmed nor refuted here.

---

## Current version and identity

- Version in `SKILL.md` frontmatter: `1.0.8.0`. This does not match the newest changelog entry by date, `v1.0.0.31.md`, because that entry versions the README rather than the skill.
- Identity: **standalone**. The skill root holds `graph-metadata.json` but no `mode-registry.json`, no `description.json` and no `hub-router.json`, which is the standalone signature under the skill-root metadata contract. Its parent directory `.opencode/skills/` is the flat skills root and not a hub, and `mcp-code-mode` does not appear among the nine mode directories under `.opencode/skills/mcp-tooling/`. It is therefore neither a hub nor a mode of one.

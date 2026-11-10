# sk-code-obsidian changelog digest

Skill path: `.opencode/skills/sk-code/sk-code-obsidian/`. Versions covered: v0.1.0.0 only (the changelog folder holds exactly one entry, so all of it is taken). Date range: none. The entry carries no date in its frontmatter or body. For reference only, the file's last modification timestamp is 2026-08-28.

---

## Per version, newest first

### v0.1.0.0 (`changelog/v0.1.0.0.md`)

First release of the `sk-code-obsidian` surface packet on the `sk-code` hub's surface axis, and the declared single source of truth for the Note Database Obsidian plugin (plugin id `note-database`, package `obsidian-note-database`). Before this packet, code work on that plugin resolved to the `UNKNOWN` surface and loaded none of its conventions, meaning no Obsidian plugin API boundary, no single-stylesheet ownership model, no `.db-*` class grammar and no screenshot harness contract. The packet ships a `SKILL.md` surface contract, 18 reference files plus 3 workflow documents symlinked from `../../shared/`, 7 checklists under `assets/`, 7 routing scenarios plus an index under `manual-testing-playbook/` and `scripts/run-source-gates.sh` as one entry point running the plugin's four source gates (`scan-naming.mjs`, `scan-comments.mjs`, `scan-folder-docs.mjs`, `scan-skill-references.mjs`) in sequence with a PASS or FAIL line per guard. It is read-only by construction, with `packetKind: surface`, `backendKind: evidence-base`, a tool surface limited to Read, Bash, Grep and Glob plus `routingClass: metadata`, which makes it advisor-invisible and reachable only when the hub bundles it beside a workflow mode through `routerPolicy.outcomes.surfaceBundle` (`changelog/v0.1.0.0.md`).

Hub wiring landed in three parent files. `mode-registry.json` gained a new `modes[]` entry and a new member of `extensions.surface-axis.surfaces`. `hub-router.json` gained `routerSignals["sk-code-obsidian"]`, the vocabulary classes `code-obsidian-aliases` and `code-obsidian-runtime` and membership in `routerPolicy.tieBreak`. `shared/references/stack-detection.md` gained the OBSIDIAN markers, which are a `manifest.json` carrying `minAppVersion`, an `esbuild.config.mjs`, `from "obsidian"` imports and `.db-*` classes in the single `styles.css` (`changelog/v0.1.0.0.md`).

BREAKING: the surface detection precedence order in `shared/references/stack-detection.md` was changed to `OPENCODE > OBSIDIAN > PI_REMOTE > WEBFLOW > UNKNOWN`, inserting OBSIDIAN as a new second-place surface, and an explicit symlink guard was added so an OPENCODE target only wins when its resolved real path lands inside the hub's own `.opencode/` directory. Any prior assumption about which surface a repo resolves to can flip under this ordering (`changelog/v0.1.0.0.md`).

RENAME: 235 files in the plugin tree were renamed from PascalCase and camelCase to lowercase-kebab using `git mv`, with 0 failures and 0 collisions, alongside 189 rewritten import specifiers, 56 rewritten repo-relative path references and 10 bare-filename references across 6 renamed target files that only a live vitest run caught (`changelog/v0.1.0.0.md`).

The plugin tree also adopted two other conventions in this release. Nineteen folder documents (10 `README.md` and 9 `CODE.md`) were added across every source folder under `src/` and `tools/` that owed them, taking `scan-folder-docs.mjs` from 19 violations to a clean exit. The 312-line Chinese tutorial preamble in `styles.css` was replaced with an English header, and its 33 section banners were renumbered and rewritten in place as numbered upper-case box-drawing sections, with a byte-equality guard proving no CSS rule moved (`changelog/v0.1.0.0.md`).

The entry closes by calling itself an open packet, not a closed one. `scan-comments.mjs` still reports 249 files missing the per-file `MODULE:` banner and numbered sections, deliberately deferred. `description.json` could not be generated for any phase leaf in the packet's spec-kit trail because the `system-spec-memory` MCP was down for the duration of the work. Doc-template conformance and surface-reality conformance audits had not run. Note also what was deliberately left alone: `ROUTER.md` and the router-sync drift guard's `SURFACES` list were not modified, because this packet exposes no leaf resources needing a stage-two routing entry and has no `RESOURCE_MAP` projection to keep in sync (`changelog/v0.1.0.0.md`).

---

## Facts the v4 draft gets wrong or misses

- Draft line 307 lists `sk-code-obsidian` in a run of four surface packets but never says what it is for. The entry is explicit that this surface covers exactly one thing, the Note Database Obsidian plugin (`changelog/v0.1.0.0.md`). A reader of the draft cannot tell whether it means Obsidian plugin development in general or one specific plugin.
- The draft never mentions the surface detection precedence change. The entry records the new order `OPENCODE > OBSIDIAN > PI_REMOTE > WEBFLOW > UNKNOWN` plus a new symlink guard on the OPENCODE arm in `shared/references/stack-detection.md` (`changelog/v0.1.0.0.md`). Draft line 308 says only that the move is breaking because paths shifted, which understates a routing-behavior change.
- The draft never mentions the 235-file kebab-case rename in the plugin tree, or the 189 import specifiers and 56 path references rewritten with it (`changelog/v0.1.0.0.md`). This is user-visible churn in a real repository and nothing in the draft's breaking-changes material at lines 444 to 447 covers it.
- The draft never mentions `scripts/run-source-gates.sh` or the four source scanners it drives (`changelog/v0.1.0.0.md`). That is the one executable the packet ships and the only thing in it a reader would run.
- The draft omits the honest caveats the entry carries, namely 249 files still missing the `MODULE:` banner, the missing `description.json` files caused by the `system-spec-memory` MCP being down and the two conformance audits that had not run (`changelog/v0.1.0.0.md`). Draft line 397 is candid about the rough edges of `mcp-obsidian`, so the same candor is missing here by contrast rather than by policy.
- The draft never distinguishes `sk-code-obsidian` from `mcp-obsidian`, which appear at lines 307 and 397 as similarly named but unrelated things. One is a read-only source-convention surface for a single plugin, the other is a vault-notes bridge (`changelog/v0.1.0.0.md`).
- Draft lines 444 and 455 describe the `sk-code` routing contract as having moved under the new mode and surface packets. For this packet specifically that is incomplete. The entry states that `ROUTER.md` and the drift guard's `SURFACES` list were deliberately not modified, because the surface is reached only through the mode-registry bundle path (`changelog/v0.1.0.0.md`).

---

## Current version and identity

The version in `sk-code-obsidian/SKILL.md` frontmatter is `0.1.0.0`, matching the sole changelog entry. Its frontmatter carries `name: sk-code-obsidian`, `allowed-tools: [Read, Bash, Grep, Glob]` and `metadata.family: sk-code` with `metadata.packetKind: surface`.

It is a **mode**, not a hub and not standalone. There is no `mode-registry.json`, `hub-router.json`, `description.json` or `graph-metadata.json` at `sk-code-obsidian/`. The parent `.opencode/skills/sk-code/` holds `mode-registry.json`, `hub-router.json`, `description.json` and `graph-metadata.json`, and its `mode-registry.json` carries a `sk-code-obsidian` entry with `packetKind: surface`, `backendKind: evidence-base`, `mutatesWorkspace: false` and `advisorRouting.routingClass: metadata`, plus membership in `extensions.surface-axis.surfaces`. Being `metadata` class, it has no advisor identity of its own and is reached only through the `sk-code` hub bundling it.

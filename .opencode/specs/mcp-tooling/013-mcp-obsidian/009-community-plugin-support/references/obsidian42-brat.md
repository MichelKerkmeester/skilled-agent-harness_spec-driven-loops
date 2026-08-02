# Reference — obsidian42-BRAT (Beta Reviewer's Auto-update Tool)

> Destined for `mcp-tooling/mcp-obsidian/references/` at Phase 5. BRAT is the **installer** for beta plugins not in the community list (e.g. `obsidian-flat-financing`). It is the enabling piece for the other two plugins.

## 1. IDENTITY (verified)

| Field | Value |
|-------|-------|
| Manifest id | `obsidian42-brat` |
| Repo / author | `TfTHacker/obsidian42-brat` · tfthacker · License MIT |
| Version | 2.2.0 (as fetched) |
| Docs | https://tfthacker.com/BRAT |
| Install BRAT itself | Community plugin browser ("Add to Obsidian"), or the URI `obsidian://show-plugin?id=obsidian42-brat` |

## 2. WHAT IT DOES

Automates installing and updating Obsidian **plugins and themes distributed on GitHub but not in the official community list**. You give BRAT a GitHub repo path; it downloads the release assets and installs them, and can check all beta items for updates in one command.

## 3. COMMANDS (verified names)

- **`BRAT: Add a beta plugin for testing`** — prompts for a GitHub repo address, then downloads + installs it.
- **`Check for updates to all beta plugins and themes`** (a.k.a. "…and UPDATE") — updates every registered beta item.
- Additional (well-known, `VERIFY` exact wording against v2.2.0): add a beta plugin **with a frozen version** (pin to a release tag), update a single plugin, and `BRAT: Restart Obsidian`.

## 4. INSTALL FLOW (how a beta plugin gets onto disk)

1. Run **`BRAT: Add a beta plugin for testing`** and paste the repo address (format: `owner/repo`, e.g. `pranjulsingh/obsidian-flat-financing`; a full `https://github.com/owner/repo` URL also works).
2. BRAT fetches the **latest GitHub release** assets — `main.js`, `manifest.json`, and (if present) `styles.css` — and writes them to `<vault>/.obsidian/plugins/{plugin-id}/`.
3. The user **enables** the plugin under **Settings → Community plugins** (installation ≠ enabled).
4. Later, **`Check for updates…`** re-pulls newer releases.

## 5. ON-DISK STATE

- Installed plugin lands at `<vault>/.obsidian/plugins/{plugin-id}/{main.js,manifest.json,styles.css}`.
- Enabled plugins are listed in `<vault>/.obsidian/community-plugins.json` (a JSON array of enabled plugin ids).
- BRAT's own beta list lives at `<vault>/.obsidian/plugins/obsidian42-brat/data.json` — `VERIFY` exact key names (it stores the list of registered beta repo paths + any frozen-version pins). See `assets/brat-data-entry.example.json`.

## 6. FILE-LAYER RECIPES (via mcp-obsidian CLI/MCP)

Two paths, in preference order:
- **Preferred — command path**: if the mode can trigger BRAT's command (e.g. a future URI/command bridge), use `BRAT: Add a beta plugin for testing` — it handles release fetch + folder layout correctly.
- **File path (headless install)**: fetch the release `main.js`/`manifest.json`/`styles.css` from the GitHub repo, write them to `<vault>/.obsidian/plugins/{id}/`, then add `{id}` to `.obsidian/community-plugins.json` to enable. Register the repo in BRAT's `data.json` so future update checks include it. `VERIFY` the `data.json` shape first.

## 7. GOTCHAS / VERIFY

- Installation does not auto-enable — you must add the id to `community-plugins.json` (or toggle it in the UI).
- A repo must publish releases with the plugin assets; some repos ship them at the repo root instead — `VERIFY` per target.
- Obsidian typically needs a reload for a newly-added plugin folder to be detected.

## Sources
- Repo: https://github.com/TfTHacker/obsidian42-brat · Docs: https://tfthacker.com/BRAT
- Community page: https://community.obsidian.md/plugins/obsidian42-brat
- Usage guides: https://note.com/pouhon01/n/n2becd856caee , https://fullstackdeveloper.novkovic.net/blog/obsidian42-brat/ , https://21obsidian.com/en/blog/obsidian-plugin-install-guide

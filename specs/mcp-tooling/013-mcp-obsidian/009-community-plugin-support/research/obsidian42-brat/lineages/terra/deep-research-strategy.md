# Deep Research Strategy

## 1. RESEARCH TOPIC

Deep-dive research on `obsidian42-brat` v2.2.0+ for a file-layer AI: exact persistent schema, install/update/theme commands, installation mechanics, safe automation recipes, and edge cases.

## 2. KNOWN CONTEXT

- Bound detached fan-out lineage: all artifacts must remain in this directory.
- The supplied target identifies BRAT as `TfTHacker/obsidian42-brat`, plugin id `obsidian42-brat`, and author `TfTHacker`.
- `resource-map.md` is absent at the supplied spec folder, so no prior resource map constrains evidence discovery.
- The normal spec anchoring and memory-save steps are out of scope for this detached lineage; the canonical synthesis here is `research.md`.

## 3. KEY QUESTIONS (remaining)

- [x] What is the source-defined `data.json` schema in BRAT v2.2.0+, including the beta-plugin list and frozen-version list, field types, defaults, and identity rules? (iteration 1)
- [x] Which BRAT commands map to add, frozen-release add, check, update one, restart, and add/remove theme behavior? (iterations 1 and 3)
- [x] How does BRAT fetch and install plugin/theme artifacts, validate manifests and versions, write vault files, and enable plugins? (iterations 2 and 3)
- [x] What is the safe file-layer workflow for an AI to install, register, enable, freeze, and validate a beta plugin without using the UI? (iteration 2)
- [x] Which errors and edge cases materially affect automation, including absent releases, asset mismatches, reload visibility, private repositories, and stale settings? (iteration 3)

## 4. NON-GOALS

- Changing a real vault or installing software during this research run.
- Supplying private-repository credentials or bypassing GitHub/Obsidian permissions.
- Treating undocumented UI behavior as authoritative when repository source differs.

## 5. STOP CONDITIONS

- Run exactly three iterations. `stopPolicy=max-iterations` makes early convergence telemetry-only.
- Do not synthesize an exact schema claim without repository-source evidence.
- Keep all outputs inside this detached lineage.

## 6. ANSWERED QUESTIONS

- Schema: `pluginList` holds repo strings; `pluginSubListFrozenVersion` always tracks a repo, using `version:"latest"` for a moving install and a tag string for a pin. (iteration 1)
- Command surface: current source presents a unified add command plus update-all, check-only, single update, reinstall, restart, and enable/disable. (iteration 1)
- Plugin mechanics: BRAT resolves releases, validates manifest `id`/`version`, requires `main.js`, writes under the manifest id, registers the repository, then can enable through Obsidian. (iteration 2)
- File-layer equivalent: preserve BRAT settings, write package files atomically, then conditionally register `manifest.id` in the enabled-plugin list and restart/reload. (iteration 2)
- Theme mechanics: source prefers root `theme-beta.css`, falls back to `theme.css`, uses a root manifest, writes a manifest-name theme folder, and tracks a CSS checksum. (iteration 3)
- Private repositories: a data-file-only actor cannot create the required SecretStorage secret; it can only use a separately authorized `tokenName`. (iteration 3)
- Error guardrails: exact release asset names, compatibility, frozen pins, cache delays, and stale optional stylesheets are all distinct failure classes. (iteration 3)

## 7. WHAT WORKED

- Direct repository source for `settings.ts`, `PluginCommands.ts`, `main.ts`, and `manifest.json` established the schema/defaults/current palette behavior. (iteration 1)
- `BetaPlugins.ts` and `githubUtils.ts` provided exact release selection, asset matching, manifest compatibility, and local-write semantics; BRAT and Obsidian docs corroborated the package/reload model. (iteration 2)
- `themes.ts`, the private-repo guide, and the theme guide resolved the distinct theme/checksum route and the SecretStorage limit. (iteration 3)

## 8. WHAT FAILED

- No source failure. The raw-source cache did not return two modal files, so install semantics will be established from `BetaPlugins.ts` and BRAT documentation instead. (iteration 1)
- Direct modal source remains unavailable through the web cache, but the relevant parameters and runtime behavior are exposed by the caller and `BetaPlugins.addPlugin()`. (iteration 2)
- The BRAT theme documentation describes older commit-date wording, while current source uses a checksum; synthesis will treat source as authoritative. (iteration 3)

## 9. EXHAUSTED APPROACHES (do not retry)

- Treating `pluginSubListFrozenVersion` as pin-only: false; ordinary installs receive `version:"latest"`. (iteration 1)
- Persisting a personal access token in `data.json`: out of date; `token` is deprecated and the source uses a SecretStorage key name. (iteration 1)
- Normal install from repository-root `main.js`/`manifest.json`: false for the current release-based path. (iteration 2)
- Automatically overriding `minAppVersion`: unsafe; BRAT requires a deliberate compatibility override. (iteration 2)
- Removing a beta theme from BRAT tracking as an implicit uninstall: false; its files intentionally remain. (iteration 3)
- Solving private GitHub access by writing a token into `data.json`: false; use SecretStorage or fail closed. (iteration 3)

## 10. RULED OUT DIRECTIONS

- Root-branch artifact fetching as the normal v2.2.0+ plugin route: eliminated; current code reads exact named release assets. (iteration 2)
- Auto-forcing an incompatible manifest: eliminated; preserve the source's explicit compatibility gate. (iteration 2)
- Treating theme unregistration as a deletion command: eliminated; preserve files unless a separate destructive uninstall is authorized. (iteration 3)
- Retrying a just-published GitHub release or theme without accounting for cache delay: eliminated as a reliable verification method. (iteration 3)

## 11. NEXT FOCUS

Complete. All five key questions are answered and the three write-once iteration artifacts have been synthesized into research.md with resource-map.md.

## 12. RESEARCH BOUNDARIES

- Max iterations: 3
- Convergence threshold: 0.05; early convergence is telemetry only.
- Executor contract: `cli-codex`, model `gpt-5.6-terra`.
- Per-iteration budget: 12 tool calls and 10 minutes.
- Source standard: repository source first; BRAT documentation and official Obsidian documentation for corroboration.
- Output model: write-once iteration narratives and append-only JSONL deltas, followed by local reducer-equivalent projections.

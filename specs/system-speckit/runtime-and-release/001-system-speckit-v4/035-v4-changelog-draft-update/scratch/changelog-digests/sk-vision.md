# sk-vision changelog digest

Skill path: `.opencode/skills/sk-vision/`
Versions covered: v0.2.0.0 only (oldest and newest are the same entry, the changelog directory holds exactly one file)
Date range: the entry carries no date in its text. Git first records `changelog/v0.2.0.0.md` on 2026-08-22, and `SKILL.md` on 2026-08-16.

---

## Per-version digest, newest first

### v0.2.0.0 (`changelog/v0.2.0.0.md`)

Vision became opt-in instead of always-on. Per `changelog/v0.2.0.0.md`, OpenCode, Cursor and Pi all gained a `/vision` command, where `/vision <question>` answers against the most recent image and bare `/vision` returns a full read in OpenCode. Cursor and Pi ask in the conversation or return a full read because a prompt file cannot open a UI input box. Devin has no command surface and calls `sk_vision_inspect` directly. OpenCode handles the command in a `command.execute.before` hook and injects a `<SK-VISION COMMAND>` evidence block, Cursor's prompt drives its registered MCP tool, and Pi's prompt drives a hidden tool that stays callable without showing up in the tool list. The entry states plainly that Claude has no sk-vision integration.

BREAKING: the default runtime posture flipped. Per `changelog/v0.2.0.0.md`, OpenCode no longer registers the sk-vision tools at all by default and Pi registers them hidden, so no host auto-inspects an attached image during a normal message any more. Cursor and Devin keep their MCP tools available. Anything that relied on the old always-on auto-inspect stops working silently until it is turned back on.

The same entry adds runtime teardown controls, so each command call can shut the local runtime down and stop memory and GPU creep. `SK_VISION_TEARDOWN=close` shuts the runtime down after each `/vision` call, `unload` frees the model but keeps the process, and `keep` leaves the process running. Reversibility is explicit: `SK_VISION_AUTOINSPECT=1` restores the legacy always-on auto-inspect and visible tools in OpenCode and Pi. The upgrade note says no migration is required.

The entry's Files Changed table records documentation updates across `SKILL.md`, `README.md`, `hooks/README.md`, the feature catalog and its three host-adapter pages (`opencode-plugin.md`, `pi-extension.md`, `mcp-transport.md`), and the manual testing playbook, which gained two new scenarios (`opencode-vision-command.md` and `pi-vision-command.md`) and gated its legacy auto-inspect coverage on `SK_VISION_AUTOINSPECT=1`. Its stated source packet is `specs/sk-vision/001-sk-vision-fork-of-opencode-senses/023-command-gated-vision-and-runtime-teardown`.

No rename, removal or moved path is recorded in this entry.

---

## Facts the v4 draft gets wrong or misses

- The draft never mentions sk-vision at all. A case-insensitive grep for `vision`, `moondream` and `OCR` across all 463 lines of `CHANGELOG-v4.0.0.0.md` returns zero hits, yet `.opencode/skills/sk-vision/` is a full skill in the release with its own `SKILL.md`, README, hooks, feature catalog, benchmark and manual testing playbook. The whole local-vision capability described in `changelog/v0.2.0.0.md` is absent from the release notes.
- Draft line 47 says "Prompt craft stayed a single standalone skill because it never needed a second mode", and draft line 35 presents `sk-prompt` as the standalone. `sk-vision` is also a standalone skill in this release (no `mode-registry.json` at its root, and no hub claims it), so the draft's implied "one standalone survivor" framing is incomplete. `changelog/v0.2.0.0.md` documents it as a first-class skill with its own command surface.
- Draft line 21 says "Six hubs now route to modes" and draft line 47 lists the six families. That count is not contradicted by `changelog/v0.2.0.0.md`, but the draft's skill inventory has no slot where a reader would learn sk-vision exists, so the release notes undercount the shipped skill roster.
- The draft's Upgrade Notes section (line 439) carries no sk-vision entry. `changelog/v0.2.0.0.md` documents a genuine behavior flip that a user could hit, namely OpenCode registering no vision tools by default and Pi hiding them, plus the `SK_VISION_AUTOINSPECT=1` escape hatch. That belongs in upgrade notes and is missing.
- The draft says nothing about the `/vision` command, so its command-family inventory (the `/deep:*`, `/create:*`, `/design:*` and `/speckit:*` families named in the opening section) omits a command that `changelog/v0.2.0.0.md` says ships on three hosts.

Nothing in `changelog/v0.2.0.0.md` states a fact that the draft asserts incorrectly. Every issue above is an omission rather than a contradiction.

---

## Current version and identity

- Version in `SKILL.md` frontmatter: `0.2.0.0`. It matches the single changelog entry, so the changelog is current.
- Identity: standalone. `.opencode/skills/sk-vision/` has no `mode-registry.json`, `hub-router.json` or `description.json` at its root, only `graph-metadata.json`, `leaf-aliases.json`, `leaf-manifest.config.json` and `leaf-manifest.json`. No parent hub under `.opencode/skills/` names sk-vision in a `mode-registry.json`, and `sk-vision` sits at the top level of `.opencode/skills/` rather than nested under a hub. Its own `graph-metadata.json` describes it as a "Standalone local-vision skill" that "does not own hub routing".

---
title: "Iteration 2: Runtime Resolution Contracts and the Residual .opencode/"
trigger_phrases: []
---
# Iteration 2: Runtime Resolution Contracts and the Residual .opencode/

## Focus
Surface 2 (runtime resolution contracts for Claude Code, Codex, Cursor, Devin, Pi, Hermes, opencode — where each reads skills/commands/agents/hooks/plugins from, and whether that path is configurable or hardcoded) plus surface 3 (the minimum that must remain resolvable at `.opencode/` for opencode itself, and whether a symlink satisfies each case).

## Findings

### F2.1 — Seven runtimes, seven discovery contracts; none of the seven reads a relocatable path

| Runtime | Skills | Commands | Agents | Hooks / plugins | Deciding evidence |
|---|---|---|---|---|---|
| **opencode** | `.opencode/skills/` | `.opencode/commands/` | `.opencode/agents/<slug>.md` | plugins: flat glob over `.opencode/plugins/` | [SOURCE: .opencode/skills/cli-external-orchestration/cli-opencode/README.md:47,105,135] [SOURCE: .opencode/plugins/README.md:16] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:41] |
| **Claude Code** | `.claude/skills` (whole-dir link) | `.claude/commands/**` (filtered per-file links) | `.claude/agents/*.md` (real fork) | `.claude/settings.json` hook commands | [SOURCE: .claude/SYNC.md:14,27,32] |
| **Codex** | none (no `.codex/skills/`) | `.codex/prompts/*.md` (generated stubs) | `.codex/agents/*.toml` (generated) | outbound `~/.codex/hooks.json` | [SOURCE: .codex/SYNC.md:18,28,29,36] |
| **Cursor** | none in-repo (`~/.cursor/skills-cursor/`) | `.cursor/commands/*.md` (flattened links) | `.cursor/agents/*.md` → `.claude/agents/` | `.cursor/hooks.json`; `.cursor/rules/` | [SOURCE: .cursor/SYNC.md:10-14,22-29] |
| **Devin** | native `.opencode/skills` scan (documented) + observed `.claude/skills` resolution | none mirrored | `.devin/agents/<name>/AGENT.md` (nested links) | `.devin/hooks.v1.json` | [SOURCE: .devin/SYNC.md:14,21,29,34] |
| **Pi** | `.pi/skills` (whole-dir link) | `.pi/prompts/*.md` (generated) | `.pi/agents/*.md` (generated; no live consumer) | `.pi/extensions/*.ts` (hand-authored native) | [SOURCE: .pi/SYNC.md:26,27,34,87] |
| **Hermes** | `.hermes/skills/` (generated copies, trust-gated) | `.hermes/prompts/*.md` (generated stubs) | `.hermes/agents` (whole-dir link) | `.hermes/plugins/` (opt-in) | [SOURCE: .hermes/SYNC.md:24,25,27] |

Every path is the runtime's own directory name (`opencode` → `.opencode/`, `claude` → `.claude/`, …). No repo-visible configuration key relocates any of them: the repo's entire mirror architecture exists **because** each runtime only looks at its own name, and the manifests record live probes where a *documented* alternative path failed (Devin's docs claim `.claude/agents/*.md` auto-import — "a live probe on 3000.2.17 proved that false" [SOURCE: .devin/SYNC.md:16]; Cursor's `~/.cursor/agents/` is documented but "a live probe found the CLI did **not** load a profile placed there" [SOURCE: .cursor/SYNC.md:16]). A runtime that cannot be pointed elsewhere is a constraint the design accepts: the move cannot reduce the number of runtime-named directories, only change what they contain.

- **Classification**: manual (accept the constraint) — with one mechanical part: every generator/mirror that *produces* those directories must be repointed and re-run.
- **Consequence for the cutover**: the design must keep seven runtime-named directories populated (six outside `.opencode` plus `.opencode` itself, plus `specs/` archive links). "Turn every runtime directory into a consumer that links into `.skilled/`" is achievable for six of seven; **`.opencode/` itself cannot be reduced to a pure consumer** because opencode's runtime reads `.opencode/skills`, `.opencode/commands`, `.opencode/agents`, `.opencode/plugins` and a launcher under `.opencode/bin/` (F2.2, F2.3).

### F2.2 — Seven MCP registrations carry the same relative `.opencode/bin/...` string, and the launcher appends a literal `.opencode/skills/...` path

The MCP server that Code Mode runs is registered in seven places, all with the same repo-relative command:

- `opencode.json:15` — `".opencode/bin/mcp-code-mode-launcher.cjs"` (root opencode config)
- `.codex/config.toml:13` — `args = [".opencode/bin/mcp-code-mode-launcher.cjs"]`
- `.pi/mcp.json:5`, `.devin/mcp_config.json:6`, `.cursor/mcp.json:6`, `.claude/mcp.json:6` — same string (root `.mcp.json` is a symlink to `.claude/mcp.json`, so Claude reads it through the hop)
- `~/.hermes/config.yaml:17` — the same string in the **home-level** Hermes config (see F6 for the external-reference class)

The launcher then computes `REPOSITORY_ROOT = path.resolve(__dirname, '..', '..')` and appends the **hardcoded string** `.opencode` before `skills/mcp-code-mode/mcp-server`, resolving `dist/index.js` as the entrypoint [SOURCE: .opencode/bin/mcp-code-mode-launcher.cjs:19-28]. Two consequences:

1. A symlink at `.opencode/` satisfies every one of these (the OS resolves the literal path); deleting `.opencode/` breaks all seven at once, including the home-level Hermes registration that `git mv` cannot touch.
2. `dist/index.js` is a **build artifact**: the launcher requires the MCP server to be built, not just present [SOURCE: .opencode/bin/mcp-code-mode-launcher.cjs:28]. Regeneration belongs to q4's inventory.

- **Classification**: mechanical (seven one-line rewrites) but **blocker-shaped if `.opencode/` is deleted** — the home-level Hermes registration and the root `opencode.json` would both fail closed.
- **Consequence for the cutover**: whichever direction the design picks, the launcher's internal string (`.opencode`, launcher lines 20-26) and its `dist/` requirement are the concrete proof that "minimum residual `.opencode/`" is a real constraint, not a preference.

### F2.3 — opencode's five reads are all inside `.opencode/`; nothing about them is relocatable by config

opencode loads "every plugin in `opencode.json`, every skill under `.opencode/skills/` and every MCP server registered there" [SOURCE: .opencode/skills/cli-external-orchestration/cli-opencode/README.md:47,105]; agents resolve from `.opencode/agents/<slug>.md` [SOURCE: cli-opencode/README.md:135]; plugins are a flat, non-recursive glob over `.opencode/plugins/` [SOURCE: .opencode/plugins/README.md:16]; commands live at `.opencode/commands` per the mirror generator's own constant [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:41]. The root `opencode.json` is the project config the runtime reads — but the *directory* `.opencode/` is the runtime's convention, and no repo-visible key moves it.

- **Classification**: manual
- **Consequence for the cutover**: a symlink at `.opencode/` must satisfy a flat glob (`.opencode/plugins/`) and a set of file reads (skills/agents/commands). Path resolution through a symlinked directory is standard filesystem behavior, but whether opencode's plugin glob follows a symlinked directory is **UNKNOWN** and would be settled by a probe (open a scratch project whose `.opencode` is a symlink and confirm plugins load). The repo cannot answer it from text.

### F2.4 — Generated runtime files carry literal `.opencode` instructions that the runtime *executes*

These are not documentation — the runtime reads them and follows them:

- `.codex/prompts/*.md` (35 stubs): "The canonical, authoritative command definition lives in the OpenCode tree at: `.opencode/commands/create/agent.md`. Read that file in full and follow it exactly" [SOURCE: .codex/prompts/create-agent.md]
- `.pi/prompts/*.md` (36 stubs): same contract, generated by `sync-prompts-pi.cjs` [SOURCE: .pi/prompts/create-agent.md]
- `.codex/agents/*.toml` (12): prompt bodies embed `.opencode/...` paths as operating instructions, e.g. "Use only `.opencode/agents/*.md` as the canonical runtime path reference", "Read `.opencode/skills/system-spec-kit/runtime/data/trigger-index.json`" [SOURCE: .codex/agents/context.toml:17,61,65,157,418-419]

A text rewrite of these files is the wrong fix: they are generator output (each carries a "Generated by … — do not edit by hand" banner), so the next `sync-*` run would overwrite the rewrite — and the generators themselves read from `.opencode` source paths (F1.4). The correct move is repoint-the-generator then regenerate.

- **Classification**: regenerate
- **Consequence for the cutover**: the generated trees are *runtime-consumed content*, so they sit between "source text" and "derived state". They must be regenerated after the move, and until they are, every Codex/Pi prompt instructs the model to read a path that no longer resolves — a silent behavioral break, not a crash.

### F2.5 — Devin: two skill surfaces, and a live-observed resolution through the `.claude/skills` link

`.devin/SYNC.md` says Devin "discovers the repo's `.opencode/skills/` packets on its own — exposed as `/sk-doc`, `/sk-git`" with no mirror [SOURCE: .devin/SYNC.md:21,34]. Separately, this research session (running under the Devin CLI) resolves its available skills through `.claude/skills/<name>/SKILL.md` paths — i.e. through the whole-dir symlink into `.opencode/skills`. Both surfaces are live; the SYNC.md does not mention the `.claude/skills` path. Whether Devin's *native* `.opencode/skills` discovery traverses a symlinked directory remains **UNKNOWN** (carried from F1.6); what would settle it: a probe with `.opencode` replaced by a symlink, or the runtime's discovery source.

- **Classification**: manual (probe required) / blocker-risk
- **Consequence for the cutover**: Devin is the only runtime whose skill access is not mirrored — it has no `.devin/skills` fallback. If the design deletes or re-points `.opencode/skills` without a probe, Devin loses skills silently while every drift checker reports healthy.

### F2.6 — Hermes: home-level trust and MCP registration keyed to paths, not to the repo's contents

`~/.hermes/config.yaml` carries `skills.trusted_project_dirs: [/Users/…/Code_Environment/Public]` (the main checkout root, survives the move) and the home-level `mcp_servers.code_mode` with the relative `.opencode/bin/mcp-code-mode-launcher.cjs` (does not survive a deletion of `.opencode/`) [SOURCE: ~/.hermes/config.yaml:6-7,17]. Hermes also gates writes whose immediate parent is `.hermes` [SOURCE: .hermes/SYNC.md:16] — the generated copies are therefore authored from outside a Hermes session, which is a workflow constraint the migration inherits.

- **Classification**: manual (home config edit is operator action) — see q6 iteration for the full external list.
- **Consequence for the cutover**: external registrations cannot be updated by the migration commit; they are a documented post-merge operator step, and they fail *silently* (MCP server missing at first tool call).

### F2.7 — Codex hooks are installed outbound into `~/.codex/hooks.json`; the installed copy is where the `.opencode` strings live

Codex "reads hooks from the user-global `~/.codex/hooks.json`, not from this repo", and `install-codex-hooks.mjs` reconciles the repo's `.codex/hooks.json` into that global file [SOURCE: .codex/SYNC.md:18]. The installed file contains 18 distinct `.opencode/...` command strings (e.g. `node .opencode/skills/system-spec-kit/runtime/dist/hooks/codex/session-start.js`, `bash .opencode/bin/check-git-hooks.sh`) [SOURCE: ~/.codex/hooks.json]. The repo-side `.codex/hooks.json` is hand-authored and is the source for the install [SOURCE: .codex/SYNC.md:31].

- **Classification**: mechanical (rewrite repo-side) + manual (re-run the installer; the global file is outside the repo)
- **Consequence for the cutover**: two-step ordering — rewrite `.codex/hooks.json`, then re-run `install-codex-hooks.mjs` to push the new strings into `~/.codex/hooks.json`. If the installer is run before the rewrite, the stale global file is reported as "no drift".

### F2.8 — Contradiction: the cli-codex packet claims `[agents.*]` wiring in `.codex/config.toml` that does not exist in either config

`cli-codex/README.md:131` states: "`.codex/config.toml` declares `[agents.<name>]` entries whose `config_file` values point at `.codex/agents/<name>.toml`." Neither the in-repo `.codex/config.toml` (which holds only `[features]` and `[mcp_servers.code_mode]` [SOURCE: .codex/config.toml:1-17]) nor `~/.codex/config.toml` contains any `[agents.*]` table or `config_file` key (grep count: 0). Both surfaces are named rather than one chosen. **UNKNOWN**: what wires the 12 `.codex/agents/*.toml` files into the runtime — a newer Codex auto-discovery of the project `.codex/agents/` directory, or an unwired roster. What would settle it: the installed Codex version's configuration documentation, or a probe that dispatches a named Codex agent and observes whether the TOML is read.

- **Classification**: manual
- **Consequence for the cutover**: if the roster is auto-discovered from the project directory, `.codex/agents/*.toml` is a live runtime surface whose *contents* embed `.opencode` paths (F2.4) and must be regenerated; if it is unwired, regeneration is only drift-hygiene. The cutover design cannot assume either without the probe.

### F2.9 — Pi's generated agent tree has no installed consumer today; its prompts and extensions are live

"No installed surface reads `.pi/agents/**/*.md` today. Pi core exposes `--skill` and `--prompt-template` but has no agent flag" [SOURCE: .pi/SYNC.md:87]. `.pi/prompts/*.md` are consumed as prompt templates and `.pi/extensions/*.ts` are executed natively [SOURCE: .pi/SYNC.md:18,27]. The `.pi/skills` whole-dir link and `.pi/extensions/*` links (17) all point into `.opencode` (iteration 1).

- **Classification**: mechanical (retarget) — with a documentation correction: `.pi/agents` is drift-checked output with no runtime reader, so its `.opencode` references are stale text rather than a live break.
- **Consequence for the cutover**: priority ordering within Pi — extensions and prompts first (live), agents last (dormant).

## Sources Consulted
- `.opencode/skills/cli-external-orchestration/cli-opencode/README.md`, `cli-codex/README.md`, `cli-pi/SKILL.md`
- `.opencode/plugins/README.md`; `.opencode/bin/mcp-code-mode-launcher.cjs`; `.opencode/scripts/git-hooks/README.md`; `.opencode/scripts/install-git-hooks.sh`
- Runtime configs: `opencode.json`, `.codex/config.toml`, `.pi/mcp.json`, `.pi/settings.json`, `.devin/mcp_config.json`, `.cursor/mcp.json`, `.claude/mcp.json`, `.codex/prompts/create-agent.md`, `.pi/prompts/create-agent.md`, `.codex/agents/context.toml`
- Home configs (read-only): `~/.hermes/config.yaml`, `~/.codex/config.toml`, `~/.codex/hooks.json`, `~/.config/devin/config.json`, `~/.config/opencode/opencode.jsonc`, `~/.config/git/hooks/`, `~/.pi/agent/`
- Live observation: this session's skill sources resolving through `.claude/skills/...`

## Assessment
- **newInfoRatio**: 0.85
- **Novelty justification**: the seven-runtime contract table is the first consolidated statement in this packet; the launcher's literal-string finding, the runtime-consumed generated stubs, the Codex `[agents.*]` contradiction, and the home-level Hermes/MCP registrations are all new. Overlap with iteration 1 is limited to re-citing the SYNC.md mechanism columns.
- **Confidence**: High on config contents (read directly). Medium on runtime behaviors asserted only by manifests (Devin native scan, Cursor/Pi probes — recorded as manifest claims). UNKNOWN flagged for opencode plugin-glob-through-symlink, Devin native-scan-through-symlink, and the Codex agent roster wiring.

## Reflection
- **What worked**: reading the runtime configs directly turned the manifests' claims into checkable facts, and two claims failed (F2.8) or narrowed (F2.5).
- **What failed**: searching for a repo-visible "relocate the runtime directory" key found none in any of the seven — recorded as the absence-of-evidence finding it is, with the probe named that would settle the runtime-internal behavior.
- **Ruled out**: nothing this iteration.

## Recommended Next Focus
Iteration 3: derived and generated state (q4). Enumerate every artifact that stores a `.opencode` path as data — compiled routing tables, `descriptions.json`, trigger indexes, leaf manifests, SQLite databases, `dist/` outputs, build attestations, graph metadata — separate absolute from repo-relative paths, and name the regeneration command for each.

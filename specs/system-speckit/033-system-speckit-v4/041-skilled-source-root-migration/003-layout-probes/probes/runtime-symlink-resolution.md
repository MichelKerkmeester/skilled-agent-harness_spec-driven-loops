---
title: "Runtime symlink resolution"
description: "Question 2: whether each runtime's loaders find skills, commands, agents, plugins and extensions when the authored tree is reached through links, measured by planted nonce fixtures in baseline, shape A, shape B and shape B2 clones."
---

# Runtime symlink resolution (Q2)

**Result:** every loader probed works through links. That holds for a whole-directory `.opencode -> .skilled` link (shape A) and for per-entry links inside a real `.opencode/` (shape B). There is one exception, and it separates the shapes: an opencode plugin that imports a package, as three repository plugins do with `@opencode-ai/plugin/tool`, loads at baseline and in shape A but not in shape B or B2. Codex could not be probed: its model-free listing is blind, and a live run would need credentials copied into the isolated home.

## Method

Run by the orchestrator on 2026-09-16 in `/tmp/skilled-probes-003/links-*`, the shallow clones at base `d26f0c60ca`.

**Shapes:**
- **A:** `rm -rf .skilled && mv .opencode .skilled && ln -s .skilled .opencode`.
- **B:** a real `.opencode/` whose `skills`, `commands`, `agents`, `hooks`, `plugins`, `bin` and `scripts` are relative links into `.skilled/`.
- **B2:** shape B with `.opencode/package.json`, `bun.lock` and `package-lock.json` moved into `.skilled/`, and `.opencode/node_modules` removed. It was built with `cp -cR` from shape B.

**Dangling links:** counts are 40 in the baseline, shape A and shape B, identical once the root prefix is normalized. No link crosses between a moved entry and an unmoved sibling.

**Controls:**
- Each run planted a fresh `uuidgen` nonce, checked absent first, and removed its fixtures after the run.
- Runs exported `SYSTEM_HOOKS_DISABLED=1`, which makes every repository plugin a no-op.
- Runtimes ran with isolation variables under `/tmp/skilled-probes-003/iso/`.
- The guarded home configuration matched its pre-run hashes afterwards (`probe-environment.md`).

**Logs:** `/tmp/skilled-probes-003/logs/`.

## Matrix

| Row | Runtime and surface | Observation | Baseline | Shape A | Shape B | Shape B2 |
|-----|---------------------|-------------|----------|---------|---------|----------|
| R1 | opencode plugin, no imports | factory wrote the nonce marker during `opencode debug config` (not during `debug startup`) | loaded | loaded | loaded | n/a |
| R1-dep | opencode plugin importing `@opencode-ai/plugin/tool` | marker `"<nonce> function"` | loaded | loaded | **not loaded** | **not loaded** |
| R2 | opencode command | `probe-nonce-command` in `opencode debug config` | listed | listed | listed | n/a |
| R3 | opencode agent | `probe-nonce-agent` in `opencode agent list` | listed | listed | listed | n/a |
| R12 | opencode skill | `probe-nonce-skill` in `opencode debug skill` | listed | listed | listed | n/a |
| R13 | `code_mode` launcher (`.opencode/bin/mcp-code-mode-launcher.cjs`) | with a probe server manifest planted, stderr reports the manifest's node range (`unsupported-range`) rather than `unreadable-manifest` | resolved | resolved | resolved | resolved |
| R4 | Devin skills | `devin skills list` shows the 13 repository skills at `./.opencode/skills/<skill>` | 13 listed | 13 listed | 13 listed | n/a |
| R5 | Pi extension importing `../../.opencode/hooks/shared/hook-flags.mjs`, linked from `.pi/extensions/` | factory wrote `"<nonce> object"` during a live `pi -p --approve` turn | loaded | loaded | loaded, with the link retargeted to `.skilled/` and also with it unchanged | n/a |
| R6 | Claude Code command, per-file link in `.claude/commands/` | `slash_commands` in the stream-json init event | listed | listed | listed | n/a |
| R7 | Claude Code agent; shapes A and B replace `.claude/agents` with a link to `.skilled/agents` | `agents` in the init event | listed | listed | listed | n/a |
| R8 | Cursor Agent command, per-file link in `.cursor/commands/` | nonce in the stream-json reply | returned | returned | returned | n/a |
| R9 | Cursor Agent agent; shapes A and B replace `.cursor/agents` with a link | reply delegated through `subagentType: {custom: {name: "probe-nonce-agent"}}` and returned the nonce | returned | returned | returned | n/a |
| R10, R11 | Codex prompts and agents | `codex debug prompt-input` never lists project prompts or agents, even at baseline, so the method is blind. A live `codex exec` needs `auth.json` in the isolated `CODEX_HOME`, and copying credentials is out of bounds | not probed | not probed | not probed | n/a |

## Row notes

- **R1 install location.** After the runs, shape A held `.skilled/node_modules` (67 entries) because opencode installed its dependencies through the link. Shape B held only `.opencode/node_modules`. A plugin reached as `.opencode/plugins/<file> -> ../.skilled/plugins/<file>` resolves packages from its real path, and `.opencode/node_modules` is not an ancestor of `.skilled/plugins`. B2 shows that moving the install files alone does not help, because opencode still installed into `.opencode/node_modules`.
- **R13 first attempt.** Every clone, the baseline included, reported `unreadable-manifest`, which marked the method blind. The server's `package.json` is not tracked (`git ls-files` finds none under `.opencode/skills/mcp-code-mode/mcp-server`), so a fresh checkout cannot start the launcher at all. The rerun planted `{"name":"probe-mcp-server","engines":{"node":">=20"}}`.
- **Claude Code isolation.** `CLAUDE_CONFIG_DIR` under `/tmp` gave `Not logged in · Please run /login`. The init event that lists commands and agents is emitted before authentication, so R6 and R7 needed no credentials.
- **Cursor isolation.** `CURSOR_CONFIG_DIR` and `CURSOR_DATA_DIR` were honored for chats and settings, which were written under `/tmp`. Authentication still came from the login (`"apiKeySource":"login"`), and one home file, `~/.cursor/skills-cursor/.sync-manifest.json`, was rewritten. The guarded configuration was unchanged.
- **Devin paths.** `devin skills paths` lists `.devin/skills`, `.cognition/skills` and `.agents/skills` as project locations and does not name `.opencode/skills`, yet `devin skills list` loads from `./.opencode/skills`. The listing command under-reports the scan.

## Implications

- Shape A: every probed loader, both plugin forms and the launcher work, with no runtime-specific change on the day of the move. This passes phase 004's P1 and P3 for the whole-directory link.
- Shape B: plugins that import packages fail to load unless dependencies are installed under `.skilled/`, which opencode does not do by itself. Three repository plugins import `@opencode-ai/plugin/tool` (`opencode-goal.js`, `system-skill-advisor.js`, `system-speckit-completion.js`). P2a and P2b both fail for them.
- Shape C: the opencode surfaces keep working only for the entries it keeps. Every other runtime reads through `.opencode/` paths today, so each dropped entry becomes a precondition of the move.

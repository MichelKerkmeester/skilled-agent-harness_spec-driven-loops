# Iteration 6: Generator Coverage

## Focus

Which mirrors are generated and which are hand-maintained? For each generated one, does a `--check`
drift mode exist and is it wired into a gate that runs? For each hand-maintained one, estimate the
drift already present and what a generator would cost to write.

## Findings

### F1. Generator inventory: eight mirror generators plus one content gate

| Generator | Produces | `--check` |
|---|---|---|
| `runtime-mirrors/sync-runtime-mirrors.cjs` | `.claude/commands/**` symlinks, `.cursor/commands/*.md` symlinks, `.cursor/agents/*.md`, `.devin/agents/*/AGENT.md`, `.claude/hooks`, `.codex/hooks`, `.cursor/hooks`, `.devin/hooks` symlink trees | yes (`:58`) |
| `codex/sync-prompts.cjs` | `.codex/prompts/*.md` (33 pointer stubs) | yes (`:33`) |
| `codex/sync-agents.cjs` | `.codex/agents/*.toml` (12) | yes |
| `codex/generate-command-routers.cjs` | Codex command router surface | — |
| `hermes/sync-prompts-hermes.cjs` | `.hermes/prompts/*.md` (33) | yes (`:33`) |
| `hermes/sync-skills-hermes.cjs` | `.hermes/skills/**` (68) | yes |
| `pi/sync-prompts-pi.cjs` | `.pi/prompts/*.md` (35) | yes (`:33`) |
| `pi/sync-agents-pi.cjs` | `.pi/agents/*.md` (12) | yes |
| `runtime-mirrors/sync-hook-registrations.cjs` | 4 hook registration files from `hook-registry.json` | yes |
| `runtime-mirrors/sync-gate1-pointers.cjs` | Gate 1 pointer blocks in `.codex/AGENTS.md`, `.cursor/rules/skill-routing.md` | yes |
| `deep-improvement/scripts/check-agent-mirror-sync.cjs` | — (content gate for OpenCode↔Claude agent pairs) | `--all` |

[SOURCE: shell `find .opencode -name 'sync-*.cjs' -o -name 'generate-*.cjs' -o -name 'check-*-sync.cjs'`]

### F2. Corrected: the hook registration files ARE generated — three manifests say otherwise

`hook-registry.json` names five runtimes with their target files:
`.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json` (pi has no
file — its hooks are hand-authored extensions). `sync-hook-registrations.cjs` renders each from the
one registry, and `:144` documents the merge rule: "`.claude/settings.json` keeps every other key;
only `hooks` is rendered."
[SOURCE: file:.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json (runtimes table)]
[SOURCE: file:.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:8,23,144]

Three claims in the runtime manifests are therefore false as written:

| Claim | Reality |
|---|---|
| `.codex/SYNC.md:120` "`hooks.json` and `config.toml` are hand-authored. **No generator produces them**, and the four runtimes' hook dialects are too different for one to exist." | `hooks.json` is generated from one registry that spans all four dialects; only `config.toml` remains hand-authored |
| `.devin/SYNC.md:31` "`hooks.v1.json` \| **hand-authored** \| — \| —" | rendered from `hook-registry.json` |
| `.devin/SYNC.md:126` "`hooks.v1.json` is hand-authored and unmirrorable." | the *event set* is genuinely different; the file is not hand-authored |

`.devin/SYNC.md` even contradicts itself: §3 says "A hook is registered in `hooks.v1.json` → re-run
the generator."
[SOURCE: file:.codex/SYNC.md:120] [SOURCE: file:.devin/SYNC.md:31,46,126]

**Why this matters more than a doc nit:** a maintainer following `.codex/SYNC.md:120` would hand-edit
`hooks.json` and be contradicted by `sync-hook-registrations.cjs --check` at pre-commit. The "known
gap" is closed and the entry announcing it was never removed.

### F3. Gate wiring: six checkers run per commit, seven in CI, four `--check` modes run nowhere

| Checker | pre-commit | CI |
|---|---|---|
| `sync-runtime-mirrors.cjs --check` | `:147` | `spec-kit-check.yml:142` |
| `codex/sync-agents.cjs --check` | `:148` | `:143` |
| `codex/sync-prompts.cjs --check` | `:149` | `:144` |
| `agent-roster-mirror-check.cjs` | `:150` | `:145` |
| `command-catalog-mirror-check.cjs` | `:151` | `:146` |
| `sync-hook-registrations.cjs --check` | `:152` | `:147` |
| `sync-gate1-pointers.cjs --check` | **absent** | `:148` |
| `check-agent-mirror-sync.cjs` | separate block `:87-104` (staged files only) | `agent-mirror-sync.yml` (PR range only) |
| `validate-command-tree-parity.sh` | — | `command-tree-parity.yml:33` |
| **`pi/sync-agents-pi.cjs --check`** | **absent** | **absent** |
| **`pi/sync-prompts-pi.cjs --check`** | **absent** | **absent** |
| **`hermes/sync-prompts-hermes.cjs --check`** | **absent** | **absent** |
| **`hermes/sync-skills-hermes.cjs --check`** | **absent** | **absent** |

Four working drift modes are unreachable by any automated gate, and they cover the two runtimes whose
mirrors are *most* translation-heavy (Pi's dialect mapping, Hermes's markdown-only copies). The
pre-commit set is also one entry short of CI's — a maintainer who only ever runs the hook never checks
the Gate 1 pointer blocks.
[SOURCE: file:.opencode/scripts/git-hooks/pre-commit:87-104,147-155]
[SOURCE: file:.github/workflows/spec-kit-check.yml:142-148]

### F4. Hand-maintained inventory — what genuinely has no generator

| Runtime | Hand-maintained files |
|---|---|
| `.claude` | `mcp.json`, `settings.json` (all keys except `hooks`), `settings.local.json`, `statusline-command.sh` |
| `.codex` | `config.toml` (MCP servers inlined), `AGENTS.md` prose (only its Gate 1 pointer block is generated) |
| `.cursor` | `hooks.json` (generated `hooks` key plus a hand-authored `version`), `mcp.json`, `rules/skill-routing.md` (packet list hand-written; pointer block generated) |
| `.pi` | `mcp.json`, `models.json`, `settings.json`, `statusline.sh`, three `pi-*config.json`, `git/`, `npm/` |
| `.hermes` | `.gitkeep` only — every other file is generated or symlinked |
| `.devin` | `config.local.json` (gitignored), `mcp_config.json` |

[SOURCE: shell `find <runtime> -maxdepth 2 -type f` per runtime, plus the generator table above]

### F5. Measured drift already present in hand-maintained surfaces

**(a) `.cursor/SYNC.md:36` documents a symlink that is not one.** The table row reads
```| `mcp.json` | symlink | `../.mcp.json` → `.claude/mcp.json` | double hop |```
but `.cursor/mcp.json` is a **real file** (`ls -la` → `-rw-r--r--`). Root `.mcp.json` is the symlink
(`.mcp.json -> .claude/mcp.json`), so the hop exists — just not through Cursor's. The consequence is
three independent copies of the same config: `.claude/mcp.json`, `.cursor/mcp.json`,
`.devin/mcp_config.json` are currently byte-identical (`md5 ae5cfafa993ef0609adb051616757952`), and
`.pi/mcp.json` differs **by design** (adds `"transport": "stdio"` and `"lifecycle": "lazy"`). Nothing
would notice the first three diverging.

**(b) `.cursor/rules/skill-routing.md` lists 8 of 13 top-level skill packets.** Present:
`cli-external-orchestration`, `sk-code`, `sk-design`, `sk-doc`, `sk-git`, `sk-prompt`,
`system-deep-loop`, `system-spec-kit`. Missing: `mcp-code-mode`, `mcp-tooling`, `sk-communication`,
`sk-vision`, `system-skill-advisor`. This is the known gap at `.cursor/SYNC.md:114` ("no generator …
a new skill packet will not appear in it automatically") with a number attached: 5 of 13 packets are
unrouted in the runtime that also feeds Devin's rules.

**(c) Count drifts already recorded in this lineage:** `.cursor/SYNC.md:32` says 36 commands (live 35,
iteration 3); every agents table says 13 (live 12, iteration 5); `.devin/SYNC.md:74` teaches with a
removed command surface in the present tense (iteration 2).

### F6. Cost of the two candidate generators

| Candidate | Cost | Why |
|---|---|---|
| Extend `sync-gate1-pointers.cjs` to render the `skill-routing.md` packet list from the skills directory | **low** | the generator already reads a canonical source, renders into `.cursor/rules/skill-routing.md` and `.codex/AGENTS.md`, and implements `--check`; the delta is a second rendered block plus a directory scan |
| A generator for the four MCP configs | **medium** | `.claude`/`.cursor`/`.devin` are byte-identical today but `.pi` needs a dialect map (`transport`, `lifecycle`); the same shape as `sync-hook-registrations.cjs`, so the pattern exists — the work is the per-runtime dialect table, not the machinery |
| A generator for `.codex/config.toml` | **high** | TOML + inline MCP servers + a hand-authored `[features]` section; the merge rule that works for `.claude/settings.json` (render one key, keep the rest) has no clean TOML analogue at this size |
| Any generator for `.pi/settings.json`, `models.json`, `statusline.sh` | **not worth it** | Pi-specific operator state, not derived from a canonical repo source |

## Sources Consulted

- Shell: full generator inventory; per-runtime real-file inventory; `md5` across four MCP configs;
  `diff .claude/mcp.json .pi/mcp.json`; packet-list extraction from `.cursor/rules/skill-routing.md`.
- `file:.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`
- `file:.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:8,23,144`
- `file:.opencode/scripts/git-hooks/pre-commit:87-104,147-155`
- `file:.github/workflows/spec-kit-check.yml:142-148`, `agent-mirror-sync.yml`, `command-tree-parity.yml`
- `file:.codex/SYNC.md:118-124`; `file:.devin/SYNC.md:31,46,126`; `file:.cursor/SYNC.md:32,36,114`

## Assessment

`newInfoRatio: 0.90` — Highest-value iteration so far. Three manifests state that the hook
registration files are hand-authored and that no generator could exist for them; one registry and one
generator produce all four, and its `--check` runs at pre-commit and in CI. That is a documented
known-gap that was closed without the documentation being corrected, and it is the exact inverse of
the drift this research is looking for: not a runtime falling behind, but a *claim* falling behind.
Also new: the four unwired `--check` modes are concentrated on the two translation-heavy runtimes, the
pre-commit set is one checker short of CI's, and the Cursor packet list has a counted gap (5 of 13).

Confidence: **high** on F1–F5 (all read or counted), **medium** on F6's cost ranks, which are
estimates from the shape of the existing generators rather than measurements.

## Reflection

Worked: enumerating generators *and* the files they target, then asking which target files have no
producer. That inversion is what surfaced the hook-registration correction — reading the manifests
alone would have preserved their claim, and reading the generator alone would not have shown the
contradiction.

Failed: iterations 1–5 recorded `.devin/hooks.v1.json`, `.codex/hooks.json` and `.cursor/hooks.json`
as "hand-authored" by repeating the manifests. That framing was wrong for six iterations' worth of
accumulated notes and is corrected here in one pass. Repeating a manifest's self-description is not
evidence about the file.

Ruled out: recommending a generator for `.codex/config.toml` or Pi's operator-state files. The
`config.toml` merge has no clean analogue and Pi's files are not derived from a canonical repo source.

## Recommended Next Focus

Iteration 7: Hook parity — inventory the repo's hook packages against each runtime's hook surface.
Which packages reach which runtimes, which are runtime-specific by nature, and which are simply
unported? Reconcile against the Hermes hook-parity work. Carry forward the corrected fact that all
four JSON registrations are rendered from `hook-registry.json` (5 runtimes: claude, codex, cursor,
devin, pi with no file), that `sync-hook-registrations.cjs --check` is gated in both places, and the
already-observed per-runtime adapter directories under `.opencode/hooks/**`.

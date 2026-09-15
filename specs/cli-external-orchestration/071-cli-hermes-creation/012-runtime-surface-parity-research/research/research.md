---
title: "Deep-Research Synthesis: runtime surface parity across the seven runtimes"
description: "Ten-iteration synthesis of the runtime mirror audit: the corrected 35-command matrix with its exclusion rule, the surface parity table across seven runtimes, the Devin boundary with proof per row, the ranked plan and a six-phase decomposition."
trigger_phrases:
  - "runtime surface parity research"
  - "devin commands gap"
  - "command mirror matrix"
  - "runtime mirror drift detection"
---
# Deep-Research Synthesis: runtime surface parity across the seven runtimes

> One lineage, `deepseek-v4.1-flash` at max via cli-pi, ten iterations, stop policy max-iterations. Every load-bearing claim carries the citation the iteration recorded. Claims the lineage could not confirm are marked inferred and carry the check that would settle them, collected in §7.

## 1. Two corrections to the charter, stated first

The charter's own framing was wrong in two places, and the iterations caught both. Everything downstream uses the corrected figures.

**The authored command surface is 35 files, not 46.** `find .opencode/commands -name '*.md' -not -path '*/assets/*' -not -path '*/scripts/*' -not -name 'README.md' | wc -l` returns 35. The raw `*.md` count under `.opencode/commands` is 46, and the eleven extras are asset and note files that are not commands, for example `.opencode/commands/deep/assets/compiled/deep-research.contract.md`, `.opencode/commands/deep/assets/legacy/deep-research.body.md` and `.opencode/commands/scripts/fixtures/README.md`. The charter counted asset and script markdown alongside the commands. The 35 is independently confirmed by the catalog checker, which prints its own canonical count. [`.opencode/commands/`, live census 2026-09-15] [`command-catalog-mirror-check.cjs`, observed exit 0: `canonical: .opencode/commands frontmatter (35 commands)`]

The 35 authored entries are `agent-router`, `create-{agent,benchmark,changelog,command,diff,feature-catalog,manual-testing-playbook,readme,repo-rule,skill,skill-parent,with-human-voice}`, `deep-{agent-improvement,ai-council,model-benchmark,research,review}`, `design-{chart,diagram,extract}`, `doctor-{mcp,speckit,update}`, `goal-opencode`, `prompt-improve`, `rewrite-{response,response-by-external-agent}`, `speckit-{complete,implement,plan,resume,save,search}` and `vision`.

**Devin's command surface was removed, not never built.** It existed as 35 skill-shaped directories at `.devin/skills/<command>/SKILL.md`, and an operator directive removed it in July 2026. The commit is explicit and dated:

```
feat(goal)!: decommission Devin commands + goal hook   (a2241041b0, Wed Jul 29 2026)

- Drop devin-skills generation in sync-runtime-mirrors.cjs and the
  .devin/skills exemption in command-scope.cjs; the mirror's orphan
  cleanup removes all 35 .devin/skills/<cmd>/SKILL.md mirrors. Devin keeps
  its 13 agent mirrors and natively-discovered .opencode/skills/ packets.

BREAKING CHANGE: the Devin CLI no longer exposes any mirrored slash-command
or a passive session-goal hook.
```

The commit body names the reason as an operator directive and records that it reverses packet 032/003. So the count of zero is right and the conclusion "unported" is wrong. `git log --diff-filter=D --name-only -- .devin/commands` and the same query for `.devin/prompts` both return nothing, so no command-tree mirror at either path ever existed in this history. [`git show --stat a2241041b0`, read-only]

## 2. Command matrix and the rule behind every exclusion

Entry names are normalized, so a renamed native command is shown as renamed rather than absent.

| Authored entry | `.claude/commands` | `.codex/prompts` | `.cursor/commands` | `.pi/prompts` | `.hermes/prompts` | `.devin` |
|---|---|---|---|---|---|---|
| the 33 shared commands | present, symlink | present, copy | present, symlink | present, copy | present, copy | **absent** |
| `goal-opencode.md` | absent, excluded | absent, excluded | renamed to `goal-cursor.md`, native | renamed to `goal-pi.md`, native | absent, excluded | absent |
| `vision.md` | absent, excluded | absent, excluded | present, native, a different file | present, native, a different file | absent, excluded | absent |
| **Total** | **33** | **33** | **35** | **35** | **33** | **0** |

[shell census using `comm` over `find`-normalized entry names, 2026-09-15]

**The exclusion rule is policy, not drift**, and it lives in one file the generators consult:

- `CANONICAL_MIRROR_EXCLUDES = new Set(['goal-opencode.md', 'vision.md'])`, the canonical entries that must not be mirrored into any generated runtime tree. [`runtime-mirrors/command-scope.cjs:21`]
- `RUNTIME_NATIVE_COMMANDS = { '.cursor/commands': {goal-cursor.md, vision.md}, '.pi/prompts': {goal-pi.md, vision.md} }`, real hand-authored entries a generator must never prune nor flag as drift. [`command-scope.cjs:27-30`]

The arithmetic closes exactly: 35 authored minus 2 excluded gives 33 for Claude, Codex and Hermes, and Cursor and Pi reach 35 because each re-adds two native entries, a renamed goal command plus its own `vision.md`. The stated reason is a host-integration asymmetry rather than a packaging preference: "Goal and vision are per-runtime because each host reaches the feature differently: OpenCode uses a plugin hook, Cursor and Devin use an MCP tool, and Pi uses a hidden extension tool. Claude has no sk-vision integration." [`command-scope.cjs:8-12`]

Two mechanics matter for anyone re-running the census:

- **Enumeration method changes the answer.** `.claude/commands` holds 0 regular files and 33 symlinks, and `.cursor/commands` holds 2 regular files and 33 symlinks, so `find -type f` reports Claude as carrying zero commands. Codex, Pi and Hermes hold no symlinks and are generated copies carrying a provenance header that names the generator and the canonical source file and says not to edit by hand. [`.codex/prompts/deep-research.md:1`, `.hermes/prompts/deep-research.md:1`]
- **`vision.md` is three distinct documents, not one mirrored file.** MD5s: `.opencode/commands/vision.md` is `79cc0588ba88e5fa1a5f28080fb3bdfc`, `.cursor/commands/vision.md` is `8ab3ddc34d1060a1c03e34bb5ef5b5a9` and `.pi/prompts/vision.md` is `fc7ff4cab1d72441433bc5f8f17633ac`. The three `goal-*` entries differ the same way, each declaring its own host contract. [`.opencode/commands/goal-opencode.md:4`, `.cursor/commands/goal-cursor.md:2`, `.pi/prompts/goal-pi.md:1`]

Generator and drift-mode coverage per mirror:

| Mirror | Generator | `--check` | Wired into a gate |
|---|---|---|---|
| `.claude/commands`, symlinks | `runtime-mirrors/sync-runtime-mirrors.cjs` | yes, `:58` | pre-commit `:147` and `spec-kit-check.yml:142` |
| `.cursor/commands`, symlinks | `runtime-mirrors/sync-runtime-mirrors.cjs` | yes, `:58` | same |
| `.codex/prompts`, copies | `codex/sync-prompts.cjs` | yes, `:33` | pre-commit `:149` and `spec-kit-check.yml:144` |
| `.hermes/prompts`, copies | `hermes/sync-prompts-hermes.cjs` | yes, `:33` | **nowhere automated** |
| `.pi/prompts`, copies | `pi/sync-prompts-pi.cjs` | yes, `:33` | **nowhere automated** |
| `.devin` | none, no command tree | not applicable | not applicable |

## 3. Surface parity table

Each cell is present, absent-correct where the runtime cannot load the surface, or absent-gap where it could and does not.

| Surface | OpenCode | Claude | Codex | Cursor | Pi | Hermes | Devin |
|---|---|---|---|---|---|---|---|
| Commands | source of truth, 35 authored | present, 33 symlinks | present, 33 pointer stubs | present, 35 with 2 native | present, 35 with 2 native | present, 33 copies | **absent-correct**, removed by operator directive, no loader for a command tree |
| Skills | source of truth, 56 canonical `SKILL.md` | present, whole-dir symlink | **absent-correct**, `prompts/` stubs serve the role. **Inferred:** that Codex has no skill loader at all | **absent-correct**, Cursor's skills live in `~/.cursor/skills-cursor/` and are Cursor-managed | present, whole-dir symlink | present, 68 generated markdown copies, 61 of which load | **absent-correct**, native discovery of `.opencode/skills/*` |
| Agents | source of truth, 12 `*.md` | present, 12 files | present, 12 `.toml`, one-way derivation | present, 12 symlinks into `.claude/agents` | present, 12 generated `*.md`, **no gate** | present, whole-dir symlink | present, 12 nested symlinks |
| Goal | present, full, native plugin | **absent-correct**, host-native command. **Unverified** against a live host | **absent-gap or absent-correct, undecided**, the claim is "same as Claude" restated | present, injection only, an identity limit in the host | present, full, extension with `/goal-pi` | present, read-only projection through the repo plugin, missing from the hub's own table | present, injection only, no command surface to manage from |
| Hooks | source of truth, 20 concerns | present, 21 registered bindings | present, 18 bindings | present, 17 bindings | present, hand-authored `extensions/*.ts`, **no registry entry and no checker** | present, plugin bridge over six hook points | present, 21 bindings, the richest event set |
| MCP config | not applicable | present, `mcp.json`, hand-maintained | present, inlined in `config.toml` | present, `mcp.json`, a real file, hand-maintained | present, `mcp.json` with its own dialect | not applicable | present, `mcp_config.json`, Devin-owned |
| Rules | source, `AGENTS.md` | present, `CLAUDE.md` symlink | present, `AGENTS.md` with a generated Gate 1 block | present, `rules/`, packet list hand-written | present | present | inherited, no local `rules/` directory |

Four supporting facts behind those cells:

- **Mirror shape is a runtime constraint, so a parity recommendation must name a shape.** Claude and Pi resolve a whole-directory symlink into `.opencode/skills`. Hermes ships generated markdown-only copies because "a symlinked directory is scanned in full, so the whole-tree link cost ten minutes per session and quarantined every hub". [`.claude/SYNC.md:27`, `.pi/SYNC.md:34`, `.hermes/SYNC.md:16`]
- **Hermes's 68 skill directories reconcile exactly**, 56 canonical `SKILL.md` copies plus 12 `agent-<name>` persona skills, because "Hermes has no flag that loads an agent file, and a plugin prompt section is capped at 4000 characters". Live count of canonical `SKILL.md` files is 56 and `.hermes/skills/` holds 68 directories. [`hermes/sync-skills-hermes.cjs:24-27`, `.hermes/SYNC.md:24`, live count 2026-09-15]
- **A generated mirror can pass `--check` and still not load.** `hermes skills list` shows 61 of 68 as loadable, and the other seven are quarantined because Hermes's prose scanner rates their own text dangerous, excluding them from the listing and from `-s`. The generator cannot detect this, because the failure is in the runtime's scanner rather than in the file. Green `--check` does not mean 68 skills load. [`.hermes/SYNC.md:24`]
- **Cursor serves the skill capability without a skills directory**, through the hand-authored `rules/skill-routing.md`, which names canonical packet paths directly. The adjacent gap is that this list has no generator, so a new packet never appears automatically. It currently lists 8 of 13 top-level packets, missing `mcp-code-mode`, `mcp-tooling`, `sk-communication`, `sk-vision` and `system-skill-advisor`. [`.cursor/SYNC.md:39,114`, `.cursor/rules/skill-routing.md:9-16`]

### 3.1 Agents parity, where the gate passes and one blind spot is live

The mirror gate passes today. `node .opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs --all` reports `12 agent(s) checked`, all mirrors in sync, at exit 0. That is an observed result rather than an inference.

The gate compares exact normalized token sets, never order or proximity, and that is a blind spot with a live instance. `compareBodyTokens` requires both `missingTokens` and `unexpectedTokens` to be empty after `normalizeRuntimeSpecificText`. [`lib/mirror-sync-verify.cjs:104-118,209-220`]

| Pair | Body bytes | Token sets | Semantic difference | Gate verdict |
|---|---|---|---|---|
| `deep-research.md` | 37091 against 37109 | 1188 against 1188, identical after path normalization | `.opencode` says append `idea_observed` only when dispatch explicitly allows it. `.claude` says record `idea_observed` **through the gateway** only when dispatch explicitly allows it | **passes** |
| `orchestrate.md` | differs | equal after normalization | `.claude` adds a runtime-mirror parenthetical, stripped by design | passes |
| `ai-council.md` | differs | equal | box-drawing padding widths differ, and interior whitespace is not tokenized | passes |

A rewrite that reuses vocabulary already present in the document is invisible to this gate. Token-set equality is not semantic equality. [computed with the gate's own exported `extractAgentBody` and `compareBodyTokens`]

Two more agent facts. The roster is 12, not the 13 every manifest states, because a sibling `README.txt` is counted by a plain `ls` while the roster checker filters correctly. [`agent-roster-mirror-check.cjs:79-81`] And two scripts call a different tree canonical: `check-agent-mirror-sync.cjs:5-9` says agents are authored under `.opencode/agents/` and mirrored to `.claude/agents/`, while `agent-roster-mirror-check.cjs:24` says the Claude tree is canonical because it holds the bodies Cursor and Devin symlink back to. Both are correct about their own question and the vocabulary collides, which is exactly the drift the first script exists to catch. [`.codex/SYNC.md:20`, `.pi/SYNC.md:16`]

### 3.2 Hook parity, the surface where the discipline holds

`.opencode/hooks/<concern>/<runtime>/` holds one adapter per runtime that needs one. `hook-registry.json` names 29 hooks with per-runtime bindings, and `sync-hook-registrations.cjs` renders four registration files from it. Registered binding counts are claude 21, codex 18, cursor 17 and devin 21. Pi has a registry entry with no file, because it has no `hooks.json` dialect at all.

| Concern | opencode | claude | codex | cursor | devin | pi |
|---|---|---|---|---|---|---|
| completion | yes | yes | yes | yes | yes | yes |
| dispatch | yes | yes | yes | yes | yes | yes |
| mcp-route-guard | yes | yes | yes | yes | yes | yes |
| post-edit-quality | yes | yes | yes | yes | yes | yes |
| skill-advisor | yes | yes | yes | yes | yes | yes |
| spec-gate | yes | yes | yes | yes | yes | yes |
| session-lifecycle | . | yes | yes | yes | yes | yes |
| session-cleanup | yes | yes | yes | yes | yes | . |
| task-dispatch | yes | yes | **.** | yes | yes | yes |
| goal | symlink only | . | . | yes | yes | yes |
| dist-freshness | yes | yes | yes | yes | yes | bundled |
| git-hooks-check | . | yes | yes | yes | yes | bundled |
| git-worktree-guard | . | yes | yes | yes | yes | bundled |
| git-primary-reconcile | . | yes | yes | . | . | bundled |
| git-preflight | yes | . | . | . | . | yes |
| sk-vision | yes | . | . | rule file | yes | yes |
| hook-install | . | yes | . | yes | yes | . |
| permission-policy | . | . | . | . | yes | . |
| directive-lifecycle | . | yes | . | . | . | . |
| codex-watchdog | yes | . | . | . | . | . |

The answer to "which hook packages are unported" is none. Four absences are correct by nature and the Hermes work already named them: `codex-watchdog` is OpenCode-hosted, `directive-lifecycle` is Claude-only, `permission-policy` is Devin-only because Devin is the only runtime with a `PermissionRequest` event and `hook-install` exists only where an installer is needed. [`.hermes/SYNC.md:88`] Two cells that look like gaps are mechanism differences: Cursor reaches sk-vision through `.cursor/rules/sk-vision.md`, a symlink into the skill's own rule file, and Pi bundles `dist-freshness`, `git-hooks-check`, `git-worktree-guard` and the primary reconcile into one extension that declares all four by their concern names. [`.pi/extensions/session-start-advisories.ts:34-48`]

What makes this surface enforceable is one shared vocabulary rather than four translations: `hook-flags.env` documents a master switch plus 22 per-concern switches read by `.opencode/hooks/shared/hook-flags.{cjs,mjs,ts,sh}`, so one switch disables the same concern in every runtime's adapter. [`.opencode/hooks/hook-flags.env:1-22`]

Pi is the least protected hook surface. Its manifest states three times that the guard layer is native code rather than config, that the bridges are hand-authored with no checker and that a core behavior change surfaces only at runtime or in the manual playbook. [`.pi/SYNC.md:18,29,113`]

### 3.3 Goal parity against the hub's own bar

The hub states the standard: "A runtime is not called fully supported unless injection and management bind the same native current-session identity." [`.opencode/hooks/goal/README.md:84`]

| Runtime | Adapter and path | Event wiring | Identity source | Verdict against the bar |
|---|---|---|---|---|
| OpenCode | `.opencode/plugins/opencode-goal.js`, with a browsability symlink under `hooks/goal/opencode/` | native plugin lifecycle | native OpenCode session | **full**, native bind, resent and packet tools with a verifier |
| Pi | `pi/goal-context.ts`, discovered at `.pi/extensions/goal-context.ts` | `input`, `session_start`, `turn_end`, registers `/goal-pi` | `ctx.sessionManager.getSessionId()` | **full**, injection plus management plus heuristic verify |
| Cursor | `cursor/goal-inject.mjs` at `.cursor/hooks.json:36` | `sessionStart` only | `session_id`, else `conversation_id` | **injection only**, no mid-session refresh and no verify |
| Devin | `devin/goal-inject.mjs` at `.devin/hooks.v1.json:33,55` | `SessionStart` and `UserPromptSubmit` | `session_id`, with `cwd` or `DEVIN_PROJECT_DIR` | **injection only**, no prompt-command surface to manage from |
| Hermes | `repo-guards` section `repo-guards-goal` at `__init__.py:845` | session-start system prompt section | `_session_goal(_session_id(...))` falling back to `_goal_slice()` | **read-only projection**, a real path absent from the hub's own table |
| Claude | none in repo | host-native goal command, with speckit workflows rendering the durable slice | host-native | **native equivalent**, operator-confirmed only |
| Codex | none in repo | stated as "same as Claude, on the same confirmation" | host-native | **native equivalent**, the weakest evidence chain |

Three properties that change how these rows should be read:

- **Injection without management is not read-only.** The hub is explicit that both partial adapters record a turn on the bound record, which is the one write they make, so the question is never injection alone. [`goal/README.md:84`]
- **Cursor's limit is an identity limit, not an adapter limit.** Management needs identity the prompt command does not carry, so `/goal-cursor` answers only `packet <path>`, a session-free read, and the command's own frontmatter says any management action fails closed. A Cursor adapter and a Cursor host capability are the same missing thing. [`goal/README.md:77`, `.cursor/commands/goal-cursor.md:2`]
- **Nothing repo-side would fail loudly if the Claude or Codex host behavior changed.** Neither `.claude/settings.json` nor `.codex/hooks.json` carries a goal registration, checked directly. The repo-side fallback that does exist is the speckit YAML assets plus the always-on posture row at `AGENTS.md:185`. [`goal/goal-plugin.md:159-160`]

Cost of each partial path to an operator mid-session: on Cursor and Devin a fresh `bind` is not re-read, so the session keeps operating on the goal captured at `sessionStart`. On Claude and Codex an absent or renamed host command produces a silently unbound goal with nothing in the repo failing. On Hermes the cost falls on maintainers rather than the session, as a false "no goal support" conclusion in the next audit.

## 4. The Devin boundary, with proof per row

`.devin/` holds six entries across three kinds of ownership: the `SYNC.md` manifest as a real file, 12 agent directories each holding a symlinked `AGENT.md`, 21 hook symlinks, a generated `hooks.v1.json`, a Devin-owned `mcp_config.json`, a gitignored `config.local.json` at mode 0600 and a whole-directory playbook symlink.

Observed parity rather than asserted: all 21 distinct `.opencode/**` scripts invoked by `hooks.v1.json` have a matching resolving symlink in `.devin/hooks/`, with zero missing and zero broken, and all 12 `AGENT.md` symlinks resolve.

| Repo surface | Devin | Proof |
|---|---|---|
| Agents, 12 | **yes**, nested directory shape | `.devin/agents/<name>/AGENT.md` resolves to `../../../.claude/agents/<name>.md`, 12 of 12 resolve. [`.devin/SYNC.md:29,37`] |
| Hooks, 8 events | **yes**, the richest event set of any runtime | `hooks.v1.json` top-level keys `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `PermissionRequest`, `Stop`, `PostCompaction`, `SessionEnd`, with 21 of 21 script symlinks resolving |
| MCP servers | **yes**, Devin owns the file | `.devin/mcp_config.json` carrying `{"mcpServers": {"code_mode": ...}}`. [`.devin/SYNC.md:32,127`] |
| Slash commands | **yes, but skill-derived** | `devin --help` documents `skills  Manage agent skills (slash commands and agent-triggered context blobs)`, and `devin skills list` shows 12 repo-local packets. [`cli-devin/SKILL.md:257-275`] |
| Skills mirror | **not needed** | native discovery of `.opencode/skills/*`, no `.devin/skills/` authored. [`.devin/SYNC.md:20`] |
| Mirrored commands | **no** | no loader in `devin --help`, `.devin/skills/` absent, retired by operator directive in commit `a2241041b0` |
| Rules | **inherited, no local directory** | `devin rules paths` reports `.windsurf/rules/*.md`, absent here, and `.cursor/rules/*.md`. `devin rules list` reports `skill-routing [Cursor]`, `CLAUDE [Claude]`, `AGENTS [Standard]`, `global_rules [Windsurf]`. [`.devin/SYNC.md:78-84`, quoted second-hand] |
| Goal | **injection only** | `hooks.v1.json:33,55` register `goal-inject.mjs`, and there is no prompt-command surface to manage from |
| One-shot prompts | **yes** | `--prompt-file <FILE>` and `[PROMPT]...` after `--`, both in `devin --help` |
| Vision | **yes** | the `sk-vision-inject` binding for devin, plus the `.devin/hooks/sk-vision.mjs` symlink |
| Permission modes | **yes, 8 values** | `normal`/`auto`, `accept-edits`, `dangerous`/`yolo`/`bypass`, `autonomous`, plus `--sandbox`. `--help` prints only 4 of them. [`.devin/SYNC.md:90`, `cli-devin/SKILL.md:336`] |
| Playbook | **yes** | `.devin/manual-testing-playbook` whole-directory symlink |
| Subagents | **yes** | `run_subagent` using `.devin/agents/<name>/AGENT.md` profiles. [`cli-devin/SKILL.md:292`] |
| Plugins, cloud, ssh, acp | **yes** | the `devin --help` subcommand list |

The installed binary is v3000.10.27 (`bcbe88c7`), and `devin skills --help` confirms the subcommand set is `list | show | paths | help`. There is no `devin commands`, no `devin prompts` and no flag that registers a directory of command templates. [`devin --help`, `devin skills --help`, `devin version`, `cli-devin/references/cli-reference.md:567`]

**The four surfaces Devin cannot carry**, each with a proof above: a mirrored command tree, a `.devin/skills/` mirror, a local `.devin/rules/` directory and goal management. None is an omission.

**The shape rule any future Devin parity work must obey.** A repo-authored surface reaches Devin only as one of four shapes: a nested symlink, a generated entry in a Devin-owned registry, a skill-shaped directory at `.devin/skills/<name>/SKILL.md` or nothing at all through native discovery and inheritance. Shape three is the finding for a planner: if the operator ever wants the 35 authored commands reachable in Devin, the mechanism is a generated `.devin/skills/<flat-name>/SKILL.md` per command, the exact tree `a2241041b0` deleted, and the strict-YAML constraint below applies to every file in it.

**Devin's one silent failure mode has no gate.** Its frontmatter parser is stricter than Claude's or OpenCode's. An unquoted `description:` containing a colon is invalid YAML and Devin silently drops the entire file rather than erroring. That hid 12 of 36 commands once, with no warning anywhere. `.devin/SYNC.md:128` names the gap directly: nothing blocks a colon-bearing unquoted `description:` from being committed to a canonical file. [`.devin/SYNC.md:67-74,128`]

**Devin's two unique events are one inert and one unobserved.** This repo dispatches with `--permission-mode bypass`, under which `PermissionRequest` is never raised, so `permission-request-policy.mjs` is registered and inert. Guard coverage is intact because `PreToolUse` still fires under bypass, verified directly. `PostCompaction` has never been observed firing. [`.devin/SYNC.md:92,129-130`]

## 5. Drift detection, and why the Devin class passed every gate

There is no single gate. There are four automated entry points and one manual route.

| Entry point | Trigger | What it runs |
|---|---|---|
| `.opencode/scripts/git-hooks/pre-commit` | every commit | the agent-mirror block at `:87-104` plus six mirror checkers at `:147-155` |
| `.github/workflows/spec-kit-check.yml` | CI | the same six checkers plus `sync-gate1-pointers.cjs --check` |
| `.github/workflows/agent-mirror-sync.yml` | PR to main | `check-agent-mirror-sync.cjs` over the PR range |
| `.github/workflows/command-tree-parity.yml` | CI | `validate-command-tree-parity.sh` |
| `/doctor runtime-mirrors` | manual, read-only | five mirror checkers plus a hook-adapter fallback health check, aggregated per surface |

The diagnostic is stronger than the gate. `doctor-runtime-mirrors.yaml` lists seven upstream assets, two of which no automated gate runs: `pi/sync-agents-pi.cjs` and `pi/sync-prompts-pi.cjs`. It also carries a per-host `hook_adapter_fallback_health_checks` table, one `file_exists` row per adapter behind an `mkHookDrift` fallback chain, which detects the degraded-adapter state rather than mirror structure. [`doctor-runtime-mirrors.yaml:3-7,28-46`]

| Gate | Blind spot |
|---|---|
| `sync-runtime-mirrors.cjs --check` | symlink-tree shape only, silent about whether the runtime loads what the links point at |
| `codex/sync-agents.cjs --check`, `codex/sync-prompts.cjs --check` | Codex only |
| `agent-roster-mirror-check.cjs` | presence and link resolution only, never content for independently authored surfaces |
| `check-agent-mirror-sync.cjs` | token-set equality, with a live instance in `deep-research.md`, and change-scoped in both executions |
| `command-catalog-mirror-check.cjs` | catalog and hub metadata only, so a 35-command tree passes while a runtime mirror is missing entirely |
| `validate-command-tree-parity.sh` | command trees and their scope policy. Devin has no entry, and the policy file is consulted by generators rather than used to assert coverage |
| `sync-hook-registrations.cjs --check` | the four JSON registrations, not Pi's extension layer and not Hermes's plugin |
| `sync-gate1-pointers.cjs --check` | one generated block in two files, and absent from pre-commit |
| four `--check` modes invoked nowhere | `pi/sync-agents-pi.cjs`, `pi/sync-prompts-pi.cjs`, `hermes/sync-prompts-hermes.cjs`, `hermes/sync-skills-hermes.cjs` |
| no gate at all | strict-YAML frontmatter validity, Pi's hand-authored guard bridges, Hermes's scanner quarantine and surface-level coverage for any runtime |

**The structural gap:** every existing checker answers "is this mirror equal to its source?" and none answers "does this runtime have a mirror for every surface that should reach it?" A whole surface can be absent, which is exactly what happened to Devin's 35 commands, and every gate stays green.

The cheapest detector is a generalization rather than a new mechanism. `agent-roster-mirror-check.cjs` already is a surface-coverage assertion for one surface: it walks a canonical roster, asserts coverage per runtime, distinguishes symlink mirrors that must resolve from independently authored surfaces checked for presence and reports orphans in both directions. [`agent-roster-mirror-check.cjs:24-46,68-81`] And `command-scope.cjs` already is the exemption registry for commands, with two recorded reasons an entry is legitimately absent. It is consulted by generators to decide what to write, never by a checker to assert what must exist. [`command-scope.cjs:19-30`] One table of `runtime x surface` mapped to a mechanism or an exemption reason, one walk and exit 1 on an uncovered pair with no recorded reason would have flagged "devin: commands, no mirror, no recorded exemption" on the commit that removed it. The fix at that moment would have been a one-line exemption entry recording the operator directive.

**Cost:** the roster checker is a file-existence walk over seven directories reporting in milliseconds, and the pre-commit hook already runs six such node checkers in sequence. One more table-driven walk is within the noise of the existing gate and needs no new dependency, no build and no network. This cost is estimated from the closest existing analogue rather than measured.

### 5.1 The corrected generator picture

Three manifests state that the hook registration files are hand-authored and that no generator could exist for them. One registry and one generator produce all four, and its `--check` runs at pre-commit and in CI. `hook-registry.json` names five runtimes with their target files, `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json` and `.devin/hooks.v1.json`, with Pi having no file, and `sync-hook-registrations.cjs:144` documents the merge rule that `.claude/settings.json` keeps every other key while only `hooks` is rendered.

| Claim | Reality |
|---|---|
| `.codex/SYNC.md:120` says `hooks.json` and `config.toml` are hand-authored with no generator, and that the four hook dialects are too different for one to exist | `hooks.json` is generated from one registry spanning all four dialects. Only `config.toml` remains hand-authored |
| `.devin/SYNC.md:31` lists `hooks.v1.json` as hand-authored | rendered from `hook-registry.json` |
| `.devin/SYNC.md:126` says `hooks.v1.json` is hand-authored and unmirrorable | the event set is genuinely unique, the file is not hand-authored. `.devin/SYNC.md:46` contradicts `:31` by telling maintainers to re-run the generator |

A maintainer following `.codex/SYNC.md:120` would hand-edit `hooks.json` and be contradicted by `sync-hook-registrations.cjs --check` at pre-commit. The known gap was closed and the entry announcing it was never removed.

What genuinely has no generator: `.claude` keeps `mcp.json`, most of `settings.json`, `settings.local.json` and the statusline script. `.codex` keeps `config.toml` and its `AGENTS.md` prose. `.cursor` keeps `mcp.json`, the `version` key of `hooks.json` and the packet list in `rules/skill-routing.md`. `.pi` keeps its operator-state files. `.hermes` keeps only a `.gitkeep`. `.devin` keeps `config.local.json` and `mcp_config.json`. Measured drift inside that set: `.cursor/SYNC.md:36` documents `mcp.json` as a symlink when it is a real file, so `.claude/mcp.json`, `.cursor/mcp.json` and `.devin/mcp_config.json` are three byte-identical copies (`md5 ae5cfafa993ef0609adb051616757952`) that nothing would notice diverging, while `.pi/mcp.json` differs by design with `"transport": "stdio"` and `"lifecycle": "lazy"`.

## 6. Ranked recommendations

Score is operator impact times confidence divided by cost, each on three bands. Operator impact is the reduction of silent failure risk for someone using a runtime, not the elegance of the fix. R1 through R7 are all list edits and text edits with no new mechanism. The only genuinely new code worth writing is R3 and R4.

### Do now

| ID | Recommendation | Impact | Confidence | Cost | Citation |
|---|---|---|---|---|---|
| R1 | Wire the four existing `--check` modes into pre-commit and CI. Two of seven runtimes have translation-heavy mirrors whose working drift modes run in neither gate, and Pi also has no hooks checker. This is a list edit, not code | high | high | low | `pre-commit:147-155`, `spec-kit-check.yml:142-148` |
| R2 | Add `sync-gate1-pointers.cjs --check` to pre-commit. It already runs in CI, so the dev-time and CI gate sets disagree about the same file | medium | high | low, one line | `spec-kit-check.yml:148` |
| R3 | Add a strict-YAML frontmatter parse gate over canonical agent and command files. This is the only silent failure class in the research, it has already hidden 12 of 36 files once, and the files it checks are canonical for all seven runtimes | high | high | low | `.devin/SYNC.md:67-74,128` |
| R4 | Build the surface-coverage assertion table. Generalize the roster checker from one surface to `runtime x surface` mapped to a mirror or an exemption reason. This is the check that would have caught the Devin class | high | medium-high | low | `agent-roster-mirror-check.cjs:24-46` |
| R5 | Record the Devin command exemption where the other two exclusions live. The operator-directed removal exists only in prose and a commit message, so the next auditor must re-derive it | medium | high | trivial, about 2 lines | `command-scope.cjs:21,27-30`, `.devin/SYNC.md:20` |
| R6 | Correct the eight documentation drifts in the table below. Every future audit currently re-derives wrong numbers | medium | high | low, text only | see R6 table |
| R7 | Add the Hermes row to the goal hub and to `goal-plugin.md`. The omission causes a false "no goal support" conclusion, and the binding is real | medium | high | trivial | `repo-guards/__init__.py:124,744,845` |

R6 in detail:

| # | File | Claim | Live truth |
|---|---|---|---|
| a | `.codex/SYNC.md:120` | `hooks.json` and `config.toml` are hand-authored with no generator | `hooks.json` is generated from `hook-registry.json`. Only `config.toml` is hand-authored |
| b | `.devin/SYNC.md:31` | `hooks.v1.json` is hand-authored | generated from the same registry |
| c | `.devin/SYNC.md:126` | `hooks.v1.json` is hand-authored and unmirrorable | the event set is unique, the file is generated |
| d | `.devin/SYNC.md:74` | a present-tense "36 commands" teaching example | historical. The surface was removed |
| e | `.cursor/SYNC.md:32` | `commands/*.md (36)` | 35 |
| f | `.cursor/SYNC.md:36` | `mcp.json` is a symlink with a double hop | it is a real file |
| g | `.codex/SYNC.md:25`, `.pi/SYNC.md:26`, `.devin/SYNC.md:29` | agents "(13)" | 12, because `README.txt` is counted |
| h | `.opencode/hooks/goal/README.md:71-84` | a per-runtime table of six | Hermes has a working binding and is missing from the table |

One more count drift sits inside a checker's own prose rather than a manifest: `command-catalog-mirror-check.cjs:17` still says the metadata covers 20 of the 39 shipped commands, while the same file's live output counts 35 and its metadata rows sum to 20. A third home for the stale counts is the cli-devin playbook results table, which still carries unmarked `DV-012` PASS at 13 roster agents, `DV-014` PASS at 36 of 36 mirrored commands and `DV-016` PASS at 36 frontmatters, under a header note that supersedes all three. [`.devin/manual-testing-playbook/manual-testing-playbook.md:44-71`]

### Do next

| ID | Recommendation | Impact | Confidence | Cost | Citation |
|---|---|---|---|---|---|
| R8 | Extend `sync-gate1-pointers.cjs` to render the `.cursor/rules/skill-routing.md` packet list. 5 of 13 top-level packets are unrouted in the file Devin also reads, and the generator already reads a canonical source, renders into two targets and implements `--check` | medium | medium | low-medium | `.cursor/SYNC.md:114` |
| R9 | Write an MCP config generator for `.claude`, `.cursor` and `.devin`. Three byte-identical copies with no checker, one of which a manifest wrongly calls a symlink. `.pi/mcp.json` needs a dialect map | low-medium | medium | medium | `sync-hook-registrations.cjs:144` |
| R10 | Probe the Claude and Codex native goal commands on live hosts. The repo's only evidence is a dated operator confirmation, and neither config carries a registration that would fail loudly. If the probe fails, the named fallback is a `goal-codex.md` prompt stub, added after the probe rather than instead of it | medium | low until probed | low, needs operator hosts | `goal/README.md:82` |
| R11 | Review the seven Hermes-quarantined skills. 61 of 68 load, and the rest are excluded by Hermes's own scanner and cannot be fixed by changing the generator. The action is a prose rewrite or an accepted limitation recorded as such | low-medium | medium | unknown | `.hermes/SYNC.md:24` |
| R12 | Set up a periodic manual review of Pi's hand-authored guard bridges against the shared cores. They are native code with no drift checker, so a core change surfaces only at runtime | medium | medium | ongoing, low per cycle | `.pi/SYNC.md:18,29,113` |

### Do not

| ID | Recommendation | Why not |
|---|---|---|
| D1 | Do not mirror the 35 commands into `.devin/commands/` | No Devin loader consumes a command tree. The retired mirror was `.devin/skills/<cmd>/SKILL.md` and it was removed on operator directive in `a2241041b0`. If the surface is ever wanted back, the shape is shape three in §4 |
| D2 | Do not add `.cursor/skills/` | Cursor's skills live in `~/.cursor/skills-cursor/` and are Cursor-managed. The real Cursor gap is R8. [`.cursor/SYNC.md:39`] |
| D3 | Do not mirror `vision.md` into Claude, Codex or Hermes | Claude has no sk-vision integration, and the host asymmetry is the recorded reason. [`command-scope.cjs:10,21`] |
| D4 | Do not add goal adapters for Cursor or Devin management | Cursor's limit is an identity limit in the host rather than a missing adapter, and both adapters already write a turn on every injection. [`goal/README.md:77,84`] |
| D5 | Do not write a `.codex/config.toml` generator | TOML plus an inline MCP block plus a hand-authored `[features]` section has no clean single-key merge analogue, which is the still-true half of `.codex/SYNC.md:120` |
| D6 | Do not automate semantic agent-body comparison | Token-set equality is what the repo has and it hid a real instruction change. A similarity score would either fire constantly or miss it. The control is a reviewer |
| D7 | Do not add content gates for the Cursor, Devin or Hermes agent trees | They are symlinks, and link resolution is the correct check and already exists. [`agent-roster-mirror-check.cjs:27-32`] |

## 7. Phase decomposition

Six phases. P4 is text-only and can run first.

| Phase | One-line scope | Changes | Dependencies | Closing gate |
|---|---|---|---|---|
| **P1. Gate coverage close-out** | Make every working `--check` mode reachable by both gates, and make the two gate sets agree | `pre-commit:147-155` and `spec-kit-check.yml:142-148` each gain the four unwired modes, and pre-commit gains `sync-gate1-pointers.cjs --check` | none | the four generators' `--check` modes exit 1 on induced drift and 0 on restore, and the pre-commit list and the CI list are provably identical (R1, R2) |
| **P2. Silent-failure guard** | Nothing canonical may be silently dropped by a stricter host parser | one gate script parsing frontmatter strictly over `.opencode/agents/*.md` and `.opencode/commands/**/*.md`, wired like the other checkers | P1's wiring pattern, or independent | a fixture file with an unquoted colon-bearing `description` fails, and the same file with quotes passes (R3) |
| **P3. Surface-coverage assertion** | A whole surface cannot go missing without a recorded reason | one table of `runtime x surface` mapped to a mechanism or exemption, one walk, exit 1 on an uncovered pair, seeded with the Devin command exemption and the reclassified command-scope sets | P1 | removing a mirror directory, or replaying the Devin case, fails the assertion, and adding an exemption entry passes it (R4, R5) |
| **P4. Documentation reconciliation** | Every manifest states the count and the mechanism today's files actually have | the eight rows in R6 plus R7, each edit carrying its live count as evidence | none. Do this first if only one phase runs | a reviewer re-derives each corrected number from the tree (R6, R7) |
| **P5. Cursor routing completeness** | The routing rule that Cursor and Devin both read lists every loadable packet | extend `sync-gate1-pointers.cjs` to render the packet list into `.cursor/rules/skill-routing.md` | P4, since the same file is already being corrected | adding a skill packet directory without regenerating fails `--check` (R8) |
| **P6. Host-behaviour probes** | Replace unverifiable claims about host behaviour with recorded probe outcomes | probe the Claude and Codex native goal command, classify the seven Hermes-quarantined skills as rewrite or accept, review Pi's guard bridges against the shared cores | none, but requires live hosts | each claim in the goal hub and the runtime manifests is either backed by a reproduced observation or marked unverified with its confirming check (R10, R11, R12) |

The dependency that matters is P1 before P3. P2 and P3 could merge into one gate script and P5 could fold into P4 if the operator prefers fewer landings.

## 8. What this lineage could not settle

| Open item | Status | Confirming check |
|---|---|---|
| Claude's and Codex's native goal commands | operator-confirmed 2026-09-12, re-checkable only on a live host | a live host probe, carried as R10 |
| Codex having no skill loader at all | **inferred** from a manifest that asserts the absent directory without naming the missing capability. Nothing in the repo contradicts it, and the runtime's own contract was not read | enumerate Codex's loader surfaces, or read the runtime's documented skill mechanism |
| Devin's retired mirror roster | the commit states 35 entries, not which 35 | list the deleted paths in `a2241041b0` and diff them against today's command tree |
| The load-time cost of a new pre-commit checker | estimated from `agent-roster-mirror-check.cjs`, a file walk, rather than measured | write the checker and time it |
| Two Devin rows, rules inheritance and skill discovery | quoted second-hand. Only `--help`, `skills --help` and `version` were run in-session | re-run `devin rules paths` and `devin skills list` |
| Whether Cursor's rule file and Pi's bundled extension are behaviorally equivalent to dedicated adapters | both files were read, neither runtime was run | exercise each concern in a live Cursor and Pi session |

---
title: Deep Research Synthesis - root README rewrite
description: What changed in Skilled from v4.0.0.0 to main after v4.0.2.1, what the repository holds today, every hook, plugin and extension per runtime, which root README claims are stale, and a reader-first order for a shorter README.
trigger_phrases:
  - "root readme rewrite research synthesis"
importance_tier: normal
contextType: planning
version: 1.1.0.0
---

# Research Synthesis - root README rewrite

## 1. Research Metadata

| Field | Value |
| --- | --- |
| Packet | `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/` |
| Session | `2026-11-16T07:59:25.000Z`, generation 1 |
| Executor | `cli-devin`, model `deepseek-v4-1-flash-max`, 900 s timeout, `workspace-write` (devin `--permission-mode dangerous`) |
| Iterations | 20 of 20 |
| Stop reason | `maxIterationsReached` |
| Questions answered | 5 of 5 |
| HEAD at synthesis | `3c15d3fde6a` (`v4.0.2.1-38-g3c15d3fde6a`) |

## 2. Executive Summary

The root `README.md` is mostly accurate on numbers and mostly wrong on shape. Every relative link resolves, every environment switch it names exists, and most of its counts reconcile against the tree: 14 shipped skills, 42 validation rules, 17 doctor commands, 27 hook cores, 29 chart forms, 27 diagram types and seven Code Mode tools. The defects are a stale six-runtime summary at line 16 against the real eight, two contradicting self-dispatch statements, a single-version Node claim, a hyphen-spelling sentence that names three runtimes instead of five, and a command partition that reaches the right total of 45 through two compensating errors. The bigger problem is structure. Install starts at line 160, the only navigation hub is the last section, half the file is four catalogs that skill READMEs already own, and eight shipped skill READMEs are never linked. A reader-first rewrite of about 500 to 620 lines can link out for the catalogs and lead with a runtime matrix built from the doctor's `runtimeFolders` manifest.

## 3. Research Question & Objectives

Topic: the current reality of the Skilled repository for a root README rewrite, covering everything that changed since v4.0.0.0 and weighted toward v4.0.2.0, v4.0.2.1 and main after the v4.0.2.1 tag.

- Q1 release delta per tag range.
- Q2 current inventory verified on disk.
- Q3 every dedicated hook, plugin and extension per runtime.
- Q4 claim audit of the 1,773-line root README.
- Q5 reader-first section order and the shrink-to-link map.

## 4. Method

Twenty single-iteration dispatches to Devin, each reading externalized state and writing one iteration file and one delta. The orchestrator ran `convergence.cjs` before every dispatch, the reducer after it, and spot-checked load-bearing counts with its own commands (Section 14). Later iterations audited earlier ones, so several early conclusions are corrected below. Where an iteration and a later one disagree, the later measured value is used and the correction is named.

## 5. Release Delta (Q1)

**Tags.** 22 `v4` tags. Headline tags: `v4.0.0.0` 2026-09-21, `v4.0.1.0` 2026-11-05, `v4.0.2.0` 2026-11-10, `v4.0.2.1` 2026-11-16. `v4.0.0.1` to `v4.0.0.16`, `v4.0.0.0-beta.1` and `v4.0.0.3-fixture` sit in the first range. The `v4.0.2.1` tag was moved after creation (`c951a23b975` records it), so a stated release date should use the final tag object. [SOURCE: iterations/iteration-001.md]

**Range scale (orchestrator re-ran `git rev-list --count`).** `v4.0.0.0..v4.0.1.0` 3,365 commits; `v4.0.1.0..v4.0.2.0` 374; `v4.0.2.0..v4.0.2.1` 1,042; `v4.0.2.1..HEAD` 38. File counts are not a change measure: the first range's 142,262 files are mostly deleted spec archives, and the post-tag +576,916 insertions are about 83% two scratch patch dumps in the hook-cleanup packet.

**Release history lives in** `.skilled/changelog/<skill>/<version>.md`. There is no root `CHANGELOG`. The release documents are `.skilled/changelog/skilled/v4.0.1.0.md`, `v4.0.2.0.md` and `v4.0.2.1.md` (516 lines). Each release's `> Spec folders:` line is the authoritative closure list (9, 10 and about 25 packets).

**v4.0.1.0, "Every Skill Routes From Its Own File".** Routing tables moved from each `SKILL.md` to a sibling `ROUTER.md`; loaded corpus fell 328,333 to 238,406 tokens. The doctor family, decision capture and `sk-code-frontend` arrived. Retired: `mcp-magicpath`, `sk-vision` with `/vision`, `sk-design-fundamentals`. OpenCode-only files moved to `.opencode/`. `v4.0.0.17` was withdrawn.

**v4.0.2.0, "Skilled in Your Own Project".** Root `INSTALL-SKILLED.md`, `system-skilled-doctor` with ten setup commands and `/doctor:overlay`, host-index discovery, history lookup after compaction and DeepSeek Harness as an experimental CLI. Hermes Agent removed (`.hermes/`, `cli-hermes`, the `hermes` shell function).

**v4.0.2.1.** Patched Node required: the nine manifests declare `^22.23.4 || ^24.22.1 || >=26.12.1`, and Code Mode needs `>=24.22.1 <25.0.0`. New `env-secret-guard` on all eight runtimes [SOURCE: .skilled/changelog/skilled/v4.0.2.1.md:80]. Session relaunch renamed to session handover (`.skilled/hooks/session-handover/`, `SYSTEM_SESSION_HANDOVER_ENABLED`), on by default for Claude Code only. AI Council moved to `/speckit:ai-council` and `/deep:ai-council` is gone. Deep-loop stop decisions are computed by a script. Advisor hub recommendations name a command with a `run`/`start`/`ask` policy.

**After the tag (38 commits).** Five workstreams: cross-runtime handover parity, Mistral Vibe hardening, the hook-library cleanup from worktree 411 (`1c88ed62854` removes dead files and renames folders literally, `3fd4e4bdf1a` imports each Pi hook core once), deep-loop review verdict work and trigger-index rebuilds. The shipped surface that moved is `.skilled/hooks` (378 files), `.skilled/skills` (118) and `.skilled/commands` (6). `README.md` changed three lines, all propagating the cleanup, and its hook-core list matches the 27 directories on disk.

## 6. Current Inventory (Q2)

| Surface | Count | Oracle |
| --- | --- | --- |
| Shipped skills | 14 | `git ls-tree HEAD .skilled/skills/`; the 15th directory, `local-webflow`, is an operator symlink outside the repo with no tracked files |
| Skills with `ROUTER.md` | 14 of 14 | every tracked skill |
| Hub skills with `mode-registry.json` | 7 | `sk-doc` 15, `cli-external-orchestration` 8, `mcp-tooling` 8, `sk-code` 5, `sk-design` 3, `system-deep-loop` 2, `cli-classifier` 1 |
| Routed modes | 42 | sum of the seven `modes` arrays |
| Standalone skills | 7 | `cli-orca`, `mcp-code-mode`, `sk-git`, `sk-prompt`, `system-skill-advisor`, `system-skilled-doctor`, `system-spec-kit` |
| Canonical commands | 44 | `.skilled/commands/<group>/<name>.md`: doctor 17, create 13, speckit 8, design 3, deep 2, prompt 1 |
| Runtime-authored commands | 2 | `.opencode/commands/goal-opencode.md`, `.cursor/commands/goal-cursor.md` (plus `.pi/prompts/goal-pi.md` as a prompt) |
| Operator-local commands | 2, gitignored | `.skilled/commands/local-doc-alignment.md`, `local-skilled-alignment.md` |
| Agents | 11 | `.skilled/agents/*.md`; `.claude/agents/` adds `Explore.md` |
| Runtimes | 8 | `.claude`, `.codex`, `.cursor`, `.devin`, `.dsh`, `.opencode`, `.pi`, `.vibe`; machine-readable in `repin.runtimeFolders` [SOURCE: .skilled/skills/system-skilled-doctor/references/overlays.md:193] |
| CLI executor modes | 8 | `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`, `cli-deepseek-harness`, `cli-mistral-vibe`, all advisor-routed with `command: null` |
| MCP modes | 8 | five workflow (`mcp-chrome-devtools`, `mcp-click-up`, `mcp-aside-devtools`, `mcp-obsidian`, `mcp-notion`), three read-only transports (`mcp-figma`, `mcp-refero`, `mcp-mobbin`) |
| Code Mode tools | 7 | `registerTool` calls in `.skilled/skills/mcp-code-mode/mcp-server/index.ts` |
| UTCP manual templates | 14 | `.utcp_config.json` `manual_call_templates`, credentials as `${VAR}` |
| Doctor commands | 17 | `.skilled/commands/doctor/` |
| Validation rules | 42 | `runtime/cli/lib/validator-registry.json` (8 warn-only) |
| Repo-rule files | 10 | `.skilled/repo-rules/`; root `repo-rules/` is a byte-identical tracked duplicate nothing references |

**Runtime matrix (iterations 7, 10, 11).**

| Runtime | Folder | Command surface | Spelling | Hook adapter form | Code Mode registration |
| --- | --- | --- | --- | --- | --- |
| Claude Code | `.claude/` | `commands/`, per-file symlinks into `.skilled/commands` | `/speckit:complete` | 32 symlinks in `hooks/`, wired in `settings.json` | `.mcp.json` |
| Codex | `.codex/` | `prompts/`, generated flat stubs | `/speckit-complete` | 27 symlinks, wired in `hooks.json` | `config.toml` `[mcp_servers.code_mode]` |
| Cursor | `.cursor/` | `commands/`, flat files plus `goal-cursor` | `/speckit-complete` | 25 symlinks, wired in `hooks.json` | `mcp.json` |
| Devin | `.devin/` | none; skills appear as slash commands | `/system-spec-kit` | 29 symlinks, wired in `hooks.v1.json` | `mcp_config.json` |
| OpenCode | `.opencode/` | `commands/`, directory symlinks plus `goal-opencode` | `/speckit:complete` | 20 native `.js` plugins | `opencode.json` `mcp` |
| Pi | `.pi/` | `prompts/`, generated flat templates plus `goal-pi` | `/speckit-complete` | 22 `.ts` extension entries plus two vendored extension packages | JSON `mcpServers` with `transport` and `lifecycle` (unverified: file path not named) |
| DeepSeek Harness | `.dsh/` | `prompts/`, generated pointer stubs | `/speckit-complete` | one `repo-guards` plugin importing 22 adapters (orchestrator-traced) | hand-authored YAML patch in `.dsh/patches/` |
| Mistral Vibe | `.vibe/` | `prompts/`, flat files | `/speckit-complete` (unverified: filename evidence only) | 18 `[[hooks]]` entries in `hooks.toml` | none in `config.toml`; whether Vibe supports MCP was not established |

`/doctor:mcp install` writes six of the seven registrations; DSH's is hand-authored. Hermes is not a runtime: `.hermes/` is absent and `cli-hermes` was removed in `cli-external-orchestration` v2.0.0.0.

## 7. Hooks, Plugins and Extensions (Q3)

**Shape.** One policy tree, `.skilled/hooks/` with 26 concern cores plus `shared`, and three adapter forms: symlink mirrors (Claude, Codex, Cursor, Devin), native modules (OpenCode plugins, Pi extensions, the DSH `repo-guards` bundle) and a TOML hook list (Vibe). Some adapters live with their owning skill rather than in `.skilled/hooks/`: Spec Kit's session, spec-gate and completion adapters under `.skilled/skills/system-spec-kit/runtime/hooks/`, sk-git's message gate and preflight under `.skilled/skills/sk-git/scripts/hooks/`, sk-code's `check-dist-staleness.sh`, and the git-hook checks under `.skilled/bin/`. The inventories differ per runtime, so "the same hooks on every runtime" is false; "the same policy cores with runtime-specific adapters" is accurate. `.skilled/hooks/README.md` (436 lines) already holds the coverage matrix.

### 7.1 Shared hook cores (`.skilled/hooks/<core>/`) with verified runtime coverage

The purpose column comes from each core's own `README.md` frontmatter. The runtime column was traced by the orchestrator from the actual wiring, not from README prose. The sources were `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json` and `.devin/hooks.v1.json` (each command resolved through its symlink), the imports of the 20 OpenCode plugins and 22 Pi extensions, the 22 imports in `.dsh/plugins/repo-guards/index.mjs`, and the 18 `.vibe/hooks.toml` commands. Composers were followed where one entry runs several cores. Pi's and DSH's `session-start-advisories` run the git and dist session-start checks. Vibe's `session-start` imports the OpenCode `session-cleanup` plugin, which runs the four git primitives. Vibe's `turn-start` composes the advisor brief, and its `turn-end` runs completion, ask-surface and handover. Cursor's `post-tool-use.mjs` runs post-edit-quality and the dispatch audit.

Runtime abbreviations: C Claude Code, X Codex, Cu Cursor, D Devin, O OpenCode, P Pi, H DeepSeek Harness, V Mistral Vibe.

| Core | Runtimes (traced) | What it does |
| --- | --- | --- |
| `ask-surface-guard` | C X D O P H V (not Cu) | Sends a turn that ends in a prose option menu back once, so the agent asks through the runtime's question tool. |
| `classifier-injection-screen` | C D O P H V (not X, Cu) | After a web fetch, asks the Jev classifier whether the text holds instructions aimed at an agent and adds one advisory line. Runs only when a Jev credential is stored; never blocks. |
| `cli-dispatch` | preflight lint on all eight; audit trail on C X Cu D O P H | Hard-rule preflight lint and JSONL audit trail for composed CLI dispatch commands. |
| `codex-global-hooks-check` | C Cu D P H, plus O through `codex-hooks-watchdog.js` (not X, V) | At session start, checks that Codex's user-global hook file holds no copy of this repository's hooks. |
| `completion-evidence` | all eight | Advisory check that fires when the assistant claims completion and surfaces missing proof. |
| `decision-capture` | C D O P H V (not X, Cu) | Queues each answer to a question tool so the next full-auto save can quote it. |
| `directive-lifecycle` | internal, used by the advisor adapters | Tracks directive delivery so constant advisor directives appear once per startup or compaction boundary, not every turn. |
| `dist-freshness` | all eight (shell check on C X Cu D, advisories on P H, plugin on O, two Vibe hooks) | Detects a stale compiled `dist` build and rebuilds it. |
| `env-secret-guard` | all eight | Stops reads and writes of dotenv files, undoes a dotenv write a shell call made anyway, and offers value-free list, validate and fingerprint tools. |
| `git-hooks-check` | all eight | Session-start check that the repository's versioned git hooks are installed and current. |
| `git-live-follow` | all eight | Session-start fast-forward of the primary checkout to the live branch. |
| `git-message-gate` | all eight | Refuses a commit message, PR description or branch name that breaks the sk-git templates. |
| `git-preflight` | C X Cu D O P H (not V) | Prints one advisory line about surprising git behavior before a git command; never blocks. |
| `git-primary-reconcile` | all eight | Converges the primary checkout onto its live branch: fast-forward when behind, rebase-publish when ahead. |
| `git-worktree-guard` | all eight | Warns when a top-level session runs on the shared checkout instead of a worktree. |
| `goal` | Cu D P H V; O runs its own `opencode-goal.js`; not C, X | Packet-bound goals: `goal.md` is the directive and each session injects its slice. |
| `mcp-route-guard` | all eight | Adds a Code Mode routing advisory to a native external MCP tool call. |
| `overlay-guard` | all eight | Refuses an edit to a file a vendored Skilled tree's overlay owns and names the overlay file to edit. |
| `permission-policy` | D only | Answers Devin's PermissionRequest event with allow or deny from the write-target and dispatch cores; fails closed. |
| `post-edit-quality` | all eight | Runs comment-hygiene, dist-staleness and related checks after every write or edit. |
| `session-cleanup` | C X Cu D O V (not P, H) | Bounded startup guards and teardown; kills only proven session-descendant MCP helpers. |
| `session-handover` | C X O P V (not Cu, D, H); on by default only on C | Hands unfinished work to a fresh session in the same terminal near the context limit. |
| `session-lifecycle` | C X Cu D P H V; O by design inside its plugins | Primes, restores and checkpoints continuity context at session start, stop and compaction. |
| `shared` | n/a | Kill-switch resolver, fail-open stdin and JSON helpers, read-only session readers. |
| `skill-advisor` | all eight (C X Cu D via `user-prompt-submit.js`, O plugin, P and H `prompt-advisor`, V `turn-start`) | Puts a prompt-safe skill routing brief on each user prompt; advisory, fail-open. The core's README names only six runtimes, so its own prose is stale. |
| `spec-gate` | all eight | Asks for a spec folder before the first file mutation of a session and remembers the answer; advisory unless `SYSTEM_SPEC_GATE_ENFORCE` is set. |
| `subagent-dispatch-guard` | C Cu D O P H V (not X) | Deep-loop repeat protection for Task and subagent dispatch, plus Claude's Fable-model subagent policy. |

Claude's `settings.json` also starts one backgrounded SessionStart command whose parse showed only `null 2>&1 &`. It was not attributed to a core.


### 7.2 Per-runtime adapter files

**Claude Code, `.claude/hooks/` (32 symlinks, wired in `.claude/settings.json`).** `ask-surface-stop.cjs`, `check-dist-staleness.sh`, `check-git-hooks.sh`, `classifier-injection-screen-posttooluse.mjs`, `compact-inject.js`, `completion-evidence-stop.cjs`, `decision-capture-posttooluse.mjs`, `dispatch-audit-posttooluse.mjs`, `dispatch-preflight-lint.mjs`, `env-secret-guard.cjs`, `env-secret-guard-after.cjs`, `fable-subagent-guard.mjs` (Claude only), `git-live-follow.sh`, `git-message-gate.mjs`, `git-preflight-advisory.mjs`, `git-primary-reconcile.sh`, `handover-compact-pointer.mjs`, `handover-context-nudge.mjs`, `handover-stop-arm.mjs`, `handover-subagent-guard.mjs` (Claude only), `install-codex-hooks.mjs`, `mcp-route-guard.cjs`, `overlay-guard.cjs`, `post-edit-quality.cjs`, `session-cleanup.sh`, `session-prime.js` (Claude only), `session-stop.js`, `spec-gate-classify.mjs`, `spec-gate-enforce.mjs`, `task-dispatch-guard.cjs`, `user-prompt-submit.js`, `worktree-guard.sh`.

**Codex, `.codex/hooks/` (27 symlinks, wired in `.codex/hooks.json`).** Same families without the Claude-only files and without classifier screen, decision capture or task dispatch; adds `handover-prompt-seed.mjs` and `session-start.js`. Its README says 26 links and 11 core targets; disk has 27 and 12 (the unlisted link is `handover-compact-pointer.mjs`). [SOURCE: .codex/hooks/README.md:11]

**Cursor, `.cursor/hooks/` (25 symlinks, wired in `.cursor/hooks.json`).** No ask-surface, classifier screen or decision capture adapter. Adds `completion-evidence-response.mjs`, `goal-inject.mjs`, `post-tool-use.mjs`, `precompact.js`, `session-end.js`, `spec-gate-prebind.mjs`.

**Devin, `.devin/hooks/` (29 symlinks, wired in `.devin/hooks.v1.json`).** Claude's set minus the Claude-only files, plus `goal-inject.mjs`, `permission-request-policy.mjs` (Devin only), `post-compaction.cjs` and `session-start.js`.

**OpenCode, `.opencode/plugins/` (20 plugins).** `ask-surface-guard.js`, `classifier-injection-screen.js`, `cli-dispatch-audit.js`, `codex-hooks-watchdog.js` (reports Codex hook-install drift), `decision-capture.js`, `env-secret-guard.js`, `mcp-route-guard.js`, `opencode-goal.js` (the goal state machine, supervisor and goal tools, owned here rather than in the shared `goal` core), `overlay-guard.js`, `session-cleanup.js`, `session-handover.js`, `sk-code-post-edit-quality.js`, `sk-git-message-gate.js`, `sk-git-preflight-advisory.js`, `system-completion-sentinel.js`, `system-deep-loop-guard.js`, `system-dist-freshness-guard.js`, `system-skill-advisor.js`, `system-spec-gate.js`, `system-speckit-completion.js` (read-only completion-evidence tool). [SOURCE: .opencode/plugins/README.md]

**Pi, `.pi/extensions/` (22 `.ts` entries).** `ask-surface-guard`, `classifier-injection-screen`, `completion-evidence`, `decision-capture`, `dispatch-audit`, `dispatch-preflight-lint`, `env-secret-guard`, `git-message-gate`, `git-preflight-advisory`, `goal-context`, `mcp-route-guard`, `overlay-guard`, `post-edit-quality`, `prompt-advisor`, `session-compact-context`, `session-handover`, `session-start-advisories`, `session-start-context`, `session-stop-context`, `spec-gate-classify`, `spec-gate-enforce`, `task-dispatch-guard`. Pi also ships two vendored extension packages that are not hook adapters: `pi-cache-optimizer`, which improves provider prompt-cache hit rates, and `pi-fast-mode-w-subagent-support`, a Fast Mode toggle that sends OpenAI's priority service tier for GPT-5.4 to GPT-6 models. No iteration covered these two, and their README treatment is undecided.

**DeepSeek Harness, `.dsh/plugins/repo-guards/` (22 registered adapters).** `ask-surface-guard`, `classifier-injection-screen`, `completion-evidence`, `decision-capture`, `dispatch-audit`, `dispatch-preflight-lint`, `env-secret-guard`, `git-message-gate`, `git-preflight-advisory`, `goal-context`, `goal-manage`, `mcp-route-guard`, `overlay-guard`, `post-edit-quality`, `prompt-advisor`, `session-compact-context`, `session-start-advisories`, `session-start-context`, `session-stop-context`, `spec-gate-classify`, `spec-gate-enforce`, `task-dispatch-guard`. `dsh-llm.mjs` and `session-role.mjs` are helpers. A fan-out lineage leaf (`lineage-leaf.mjs`) runs the bundle with four state-writing adapters off.

**Mistral Vibe, `.vibe/hooks.toml` (18 entries; scripts in `.vibe/plugins/repo-guards/`).** `spec-gate-classify`, `turn-start` (advisor brief and every turn-start part in one entry), `turn-end` (completion advisory plus the ask-surface reprompt), `spec-gate`, `env-secret-guard`, `dispatch-preflight`, `overlay-guard`, `mcp-route-guard`, `git-message-gate`, `deep-loop-guard`, `post-edit-quality`, `dist-freshness-edit`, `dist-freshness-shell`, `classifier-injection-screen`, `compaction-post-tool`, `decision-capture-ask`, `session-start`, `session-cleanup-end`. `.vibe/plugins/README.md:18` says there are 21 OpenCode plugins; disk has 20.

## 8. Claim Audit of the Root README (Q4)

### 8.1 Stale or wrong

| README line | Claim | Reality | Source |
| --- | --- | --- | --- |
| `:16` | "Built for Claude Code, Codex, OpenCode, Pi Agent, Devin and Cursor CLI" | Eight runtimes; DSH and Mistral Vibe missing. `:184` already has the correct eight-name sentence, byte-identical to `INSTALL-SKILLED.md:57` | `overlays.md:193`, `v4.0.2.1.md:80` |
| `:873` | "Every bridge but `cli-pi` refuses to dispatch the runtime it runs in" | Contradicts `:73`, which correctly names both `cli-pi` and `cli-deepseek-harness` as exempt | `cli-pi` SKILL.md |
| `:164` | "You need Node.js 24" | Imprecise, not wrong. It holds for Code Mode, whose launcher accepts only `>=24.22.1 <25` because isolated-vm has no Node 25+ build. But it omits the patch floor and hides that the other nine manifests accept `^22.23.4 \|\| ^24.22.1 \|\| >=26.12.1`. Say "Node 24.22.1 or a newer 24.x" and give the wider range for the rest | package manifests, `.codex/config.toml` |
| `:208` | Hyphen spelling for "Codex, Cursor and Pi" | Five runtimes use hyphen spelling: Codex, Cursor, Pi, DSH and Vibe | `.dsh/prompts/`, `.vibe/prompts/`, `.codex/README.md:42` |
| `:1174` | "45 commands: 43 in six groups plus two utilities" | The total of 45 is right for canonical plus OpenCode, but the six group folders hold 44, and `/prompt:improve` is one of them. Counting `/goal-cursor`, the unique shipped surface is 46 | `.skilled/commands/`, `.cursor/commands/goal-cursor.md` |
| `:214` | "The first AI session installs the repository's git hooks" | No caller installs them automatically. `install-git-hooks.sh` runs only from `/doctor:git`, `/doctor:update --apply` and create-skill follow-ups; the session hook only checks | `.skilled/scripts/install-git-hooks.sh` |
| `:234-243` | Doctor digest framed as complete ("The rest each cover one area") | Lists 9 of 17; `/doctor:speckit`, `:mcp`, `:git`, `:sk-code`, `:deep-loop` and `:env` missing | `.skilled/commands/doctor/` |
| `:1618` (and the runtime README links near `:871`) | Runtime-folder enumeration: "`.claude/`, `.codex/`, `.opencode/`, `.cursor/`, `.pi/` and `.devin/`" | Omits `.dsh/` and does not list `.vibe/` with the runtime folders | tree, `repin.runtimeFolders` |
| `:1408` | "seven project runtime configs" | Seven files exist, but `/doctor:mcp install` writes six; DSH's is a hand-authored patch. Vibe has none | `.skilled/commands/doctor/mcp.md` |
| `:1058`, `:1108`, `:1130`, `:1227`, `:1346` | "relaunch" wording | Feature, folder and switches are session handover since v4.0.2.1. This is wording, not a factual error | `v4.0.2.1.md` |
| `:153` | "4 levels" | Correct count, but "Level 4" also names a validation-verbosity axis. Spell it "four documentation levels (1, 2, 3, 3+)" | `quick-reference.md:72-90` |
| `:1729` (FAQ) | "No session data, code or context leaves the machine" | True for continuity: a committed index, ripgrep, and Ollama on 127.0.0.1. False as an unscoped guarantee once CLI bridges, MCP servers or the Jev screen are used | iteration 14 |

### 8.2 Verified correct: do not "fix"

14 skills (`:801`, `:226`, `:1689`); 42 validation rules (`:153`, `:403`, `:410`, `:809`) and eight warn-only (`:405`); 10 repo-rule files (`:452`); 27 hook cores (`:1166`); 17 doctor commands (`:1316`); 15 templates (`:310`); seven Code Mode tools (FAQ, §13); 14 UTCP templates; `code_mode` as the only registered server (`:1465`, `:676`); the clone URL (`:167`) and both build commands; the advisor `list-tools` check (run, exit 0); all four `INSTALL-SKILLED.md` anchors; all 69 relative links (40 targets, all tracked); all 18 same-file anchors; all 24 environment switch names; and the Claude-only handover default.

### 8.3 Over-detailed

The four catalogs carry 898 of 1,773 lines (50.6%): §6 Spec Kit 304 (260-563), §12 Command Library 283 (1172-1454), §9 Skill Library 162 (799-960), §11 Plugin & Extension Library 149 (1023-1171). The doctor block alone is 129 lines (1314-1442) and repeats `system-skilled-doctor/README.md`. §3's ASCII diagram uses 49 of its 70 lines (111-159).

## 9. Reader-First Order (Q5)

**Measured defects.** No table of contents. Install begins at `:160` behind 149 lines of positioning. The only link hub, §17 Related Documents, is last at `:1751`. Runtime support is stated twice with different answers and never as a table. Eight shipped skill READMEs are never linked from the root (`cli-classifier`, `cli-external-orchestration`, `cli-orca`, `mcp-code-mode`, `mcp-tooling`, `sk-doc`, `sk-git`, `sk-prompt`). `sk-design` has no top-level README.

**Proposed order, five tiers, about 500 to 620 lines.**

1. First screen, at most 60 lines: title and badges, six capability bullets, the eight-runtime matrix from Section 6, and a documentation map promoted from §17.
2. Get running, at most 120 lines: clone and build, `/doctor:setup`, a first task with the colon-versus-hyphen spelling note, and a pointer to `INSTALL-SKILLED.md` for own-project use.
3. How it works, at most 120 lines: gates, Spec Kit at concept level (levels table and folder shape), Deep Loop, Skill Advisor, Code Mode.
4. Catalogs as tables, at most 120 lines: 14 skills, 11 agents, six command groups, and hooks and plugins as one table of the 26 cores linking `.skilled/hooks/README.md`.
5. Reference, at most 100 lines: configuration, worktrees, FAQ.

**Shrink map.** §6 to `system-spec-kit/README.md` (716 lines, owns commands and configuration); §12 Doctor to `system-skilled-doctor/README.md` (144); §9 to the skill READMEs (3,179 lines combined); §11 to `.skilled/hooks/README.md` (436) plus `hooks/goal/` and `hooks/session-handover/`; §13 to `mcp-code-mode/README.md`; §8 to `system-skill-advisor/README.md`; §7 to `system-deep-loop/README.md`; §14 to `.skilled/scripts/git-hooks/README.md` (202); install and §5 to `INSTALL-SKILLED.md` (368). `sk-design` must keep a root entry or gain a README first.

## 10. Supporting Evidence

The runtime roster has four independent oracles (tree, `README.md:184`, `INSTALL-SKILLED.md:57`, `v4.0.2.1.md:80` and `:355`) plus the doctor `runtimeFolders` array. Hook counts were re-listed by the orchestrator (Section 14). Iterations 8, 13, 14 and 18 executed or parsed their oracles: the validator registry, a link and anchor audit script, the Code Mode `registerTool` calls and `quick-reference.md`.

## 11. Recommendations

1. Replace `README.md:16` with the existing eight-runtime sentence from `:184`, and build the runtime matrix from `repin.runtimeFolders`.
2. Delete the `:873` self-dispatch sentence or align it with `:73`.
3. State the Node range with its patch floor, and give Code Mode's narrower range separately.
4. Name five hyphen-spelling runtimes at `:208`.
5. Restate commands as "44 canonical commands in six groups, plus `/goal-opencode` and `/goal-cursor`".
6. Correct or remove the `:214` git-hook auto-install claim, and point to `/doctor:git`.
7. Scope the local-first FAQ answer to the continuity path.
8. Rename remaining "relaunch" prose to "handover".
9. Restructure to the five-tier order and link the skill READMEs instead of repeating them.
10. Fix the two sibling READMEs with stale counts: `.codex/hooks/README.md:11` (27 links, 12 cores) and `.vibe/plugins/README.md:18` (20 plugins). Both are out of this packet's scope.

## Eliminated Alternatives

| Approach | Reason eliminated | Evidence | Iteration(s) |
| --- | --- | --- | --- |
| `git diff --stat` over the early tag ranges | Rename detection does not finish in 120 s; `--no-renames` returns in seconds | timing | 1, 2 |
| File counts as a change measure | Mass deletions of spec archives and scratch patches dominate | `v4.0.0.0..v4.0.1.0` 142,262 files | 2, 3 |
| A root `CHANGELOG` | None exists | tree | 1 |
| Counting skills with `ls` or `ls -ld .skilled/skills/*/` | Counts the operator symlink; the trailing slash dereferences it | `git ls-tree` gives 14 | 16, 19 |
| Counting commands with a recursive markdown glob | Returns 89 because reference files are nested inside command folders | depth-2 count is 44 | 16, 17 |
| Counting validation rules from `validation-rules.md` or `runtime/cli/rules/` | The doc lists 16; the directory holds 33 scripts and 10 helpers; the registry holds 42 | `validator-registry.json` | 8, 18 |
| Treating the six-name runtime line as current | Four oracles give eight | Section 10 | 6, 20 |
| Listing Hermes as a runtime | Removed in v4.0.2.0 | `cli-external-orchestration/changelog/v2.0.0.0.md:3` | 20 |
| Inferring "Vibe has no MCP" from a missing registration | Absence of a project file says nothing about the runtime | `.vibe/config.toml` | 11 |

## Divergence Map

Divergent mode was not active (`convergence_mode: default`). No pivots were prepared, taken or overridden. Saturated directions: none recorded. Remaining frontier: the two vendored Pi extension packages and the unread `INSTALL-SKILLED.md` body. The per-runtime wiring in Section 7.1 was closed by the orchestrator trace.

## 12. Open Questions

- Should the README count `/goal-cursor`, which would make 46 commands, or keep the canonical-plus-OpenCode 45?
- Does Mistral Vibe support MCP natively? Repository evidence does not say.
- Should the two vendored Pi extension packages appear in the README's extension section?
- The parent `004-v4-release-line-research/spec.md` PHASE DOCUMENTATION MAP (`:97`) ends at row 24 (`:126`) and has no row for `025-root-readme-rewrite`. Should the operator add one?
- What does the backgrounded Claude SessionStart command (parsed as `null 2>&1 &`) run?
- Should root `repo-rules/`, the duplicate nothing references, stay in the tracked tree?

## 13. Risks & Caveats

- Iteration claims are model output. The orchestrator re-verified the counts in Section 14; the remaining claims rest on the cited iteration's evidence.
- The early progressive synthesis published wrong numbers that later iterations corrected: 15 skills, a `local-webflow` ROUTER exception, an "undercounts by one" conclusion, four Code Mode tools and README anchors at `:15` and `:805`. They are fixed here, so do not reuse that text.
- `main` moved during the run: a concurrent session committed `3c15d3fde6a`. Line numbers are against the README at synthesis time.

## Appendix: Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 20
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 18: the remaining numeric claims (0.62); run 19: synthesis-surface audit (0.71); run 20: runtime roster (0.85)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Why no earlier stop: from iteration 8 every question was answered, but the source-diversity quality guard failed on three questions (`qualityGuardFailed`) and the graph stayed `STOP_BLOCKED` on `source_diversity_guard` and `unverified_claims` (later also `evidence_depth_guard`). `newInfoRatio` stayed between 0.6 and 0.95 throughout, so the 0.05 threshold was never approached.
- Segment transitions, wave scores and checkpoint metrics are experimental and omitted from the live report.

## References

- Iteration narratives: `research/iterations/iteration-001.md` to `iteration-020.md`; deltas in `research/deltas/`.
- Resource map: `research/resource-map.md`.
- Release notes: `.skilled/changelog/skilled/v4.0.1.0.md`, `v4.0.2.0.md`, `v4.0.2.1.md`.
- Hook coverage: `.skilled/hooks/README.md` and the 27 `.skilled/hooks/*/README.md` files; `.opencode/plugins/README.md`; `.dsh/plugins/repo-guards/README.md`; `.vibe/hooks.toml`.
- Prior context: `specs/system-speckit/runtime-and-release/004-v4-release-line-research/research/research.md`, child `024-root-release-docs-alignment`.

## 14. Orchestrator Verification

Re-run by the orchestrator, outside the dispatched iterations:

- `git rev-list --count` for the four ranges: 3,365 / 374 / 1,042 / 38.
- `v4.0.2.1.md:80` names the eight runtimes for `env-secret-guard`.
- `.skilled/commands/speckit/ai-council.md` exists; `.skilled/commands/deep/` holds only `research.md` and `review.md`.
- Command groups: doctor 17, create 13, speckit 8, design 3, deep 2, prompt 1 (44). The two root `local-*.md` files are gitignored operator commands, so 44 is the tracked canonical count.
- Mode registries: 1 + 8 + 8 + 5 + 3 + 15 + 2 = 42.
- `.claude/agents/` has `Explore.md` beyond `.skilled/agents/`.
- Symlinks: Claude 32, Codex 27, Cursor 25, Devin 29; OpenCode 20 `.js`; Pi 22 `.ts`; Vibe 18 `[[hooks]]`; 27 hook-core directories.
- `README.md:16`, `:73`, `:164` and `:873` read as cited; `local-webflow` is a symlink outside the repo; `sk-design/README.md` does not exist.
- `mcp-server/index.ts` has seven `registerTool` calls.
- Root README links: `sk-code` 3, `system-spec-kit` 2, `system-skill-advisor` 2, `system-deep-loop` 1, `system-skilled-doctor` 1, all others 0.

- Hook wiring for all eight runtimes, traced from the config files and plugin imports into Section 7.1.
- Parent phase map: `spec.md:126` is row 24; no row exists for 025.
- README lines `:208`, `:214`, `:234-243`, `:1174`, `:1408`, `:1618`, `:1729` and the five "relaunch" lines read as cited.

Workflow notes for the operator:

- The YAML loop was driven step by step by a scratchpad wrapper: `iter.cjs` ran the commands of one phase of one iteration, and `cycle.sh` ran one iteration boundary. The wrapper dispatched only when `convergence.cjs` returned CONTINUE. It did not run `step_rejected_pattern_cache`, `step_ideas_backlog_lifecycle`, `step_marker_scan` or `record_executor_audit`; the iteration_start executor row was written before each dispatch instead.
- The config was written once at `step_create_config`, executor block included, not at setup. Writing it at setup would have made the session classify as invalid-state.
- The convergence snapshot for iteration 2 was persisted twice. The halt before iteration 7 came from the wrapper truncating long output; the real decision was CONTINUE, and the iteration was then dispatched.
- No iteration failed and none was redispatched.

- The reducer's Next Focus kept repeating iteration 1's carried-forward Q1 residual for iterations 2 to 4 after Q1 was checked. The leaves corrected course on their own.
- Iterations 1 to 5 edited `research/research.md` directly, outside the prompt's allowed write paths but inside the packet. Iterations 7 to 20 refused the same edit and logged it as a scope violation, so this synthesis folds in their material.
- The write-containment guard quarantined copies of files a concurrent `044-named-subtracks-and-host-repos` review lineage changed during iteration 1. The originals were left in place; none were written by this run.

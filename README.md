# Skilled - Spec-Driven Agent Loops

[![GitHub Stars](https://img.shields.io/github/stars/MichelKerkmeester/skilled-agent-harness_spec-driven-loops?style=for-the-badge&logo=github&color=fce566&labelColor=222222)](https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops/stargazers)
[![License](https://img.shields.io/github/license/MichelKerkmeester/skilled-agent-harness_spec-driven-loops?style=for-the-badge&color=7bd88f&labelColor=222222)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/MichelKerkmeester/skilled-agent-harness_spec-driven-loops?style=for-the-badge&color=5ad4e6&labelColor=222222)](https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops/releases)

> Like it? [buymeacoffee.com/michelkerkmeester](https://buymeacoffee.com/michelkerkmeester)

&nbsp;

&nbsp;

## 1. 📝 SUMMARY

**[Quick Start](#2--quick-start)** · [Overview](#overview) · [How It Works](#4--how-it-works) · [Workflows](#5--everyday-workflows) · [Skills](#6--skills) · [Hooks](#7--hooks-plugins-and-extensions) · [Agents](#8--agents) · [Commands](#9--commands) · [Runtimes](#10--runtimes-and-cli-bridges) · [Doctor](#11--doctor-commands) · [FAQ](#16--faq)

An assistant framework that gives your AI coding agent a memory, a paper trail and a team of specialists.

All of it lives inside your own repository, as files you can read and diff.

Built for Claude Code, Codex, OpenCode, Pi Agent, Devin, Cursor CLI, DeepSeek Harness and Mistral Vibe

**What's inside**

- **Spec Kit Framework** - structured plans, task tracking, validation gates and handover docs
- **Spec Memory & Search** - session context saved into each spec folder and recovered through instant keyword search, surviving resets and compactions
- **Skill Advisor Daemon** - dynamic prompt-time skill suggestions using 5-lane fusion and a live skill graph
- **Autonomous Deep Loops** - research and review loops that run unattended and stop only when their own evidence says done
- **11 Specialized Agents** - focused roles for implementation, review, research, docs, git and more
- **14 On-Demand Skills** - deep capabilities for code, design, docs, multi-CLI dispatch and installing Skilled in your own projects

&nbsp;

## 2. 🚀 QUICK START

### Install

You need Node.js, `npm`, `git` and a POSIX shell. Use a patched Node release. The floors are 22.23.4, 24.22.1 and 26.12.1. Any newer release on those lines works. Code Mode is stricter and needs Node 24.22.1 or a newer 24.x, so Node 24 is the one line every part accepts.

The [install guide](INSTALL-SKILLED.md#2-install-a-skilled-checkout) walks through every step. In short, clone the repository and build the Spec Kit and the Skill Advisor:

```bash
git clone https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops.git
cd skilled-agent-harness_spec-driven-loops

npm --prefix .skilled/skills/system-spec-kit install
npm --prefix .skilled/skills/system-spec-kit run build

npm --prefix .skilled/skills/system-skill-advisor/runtime install
npm --prefix .skilled/skills/system-skill-advisor/runtime run build
node .skilled/bin/skill-advisor.cjs list-tools --format json
```

The Spec Kit comes first, because the session hooks load its build and the advisor build uses its compiler.

&nbsp;

### Check The Setup

Open the repository in any of the eight runtimes and run:

```
/doctor:setup
```

It checks the install without changing anything. Each failing check names one repair command. Run `/doctor:mcp install` to build and register Code Mode, which builds on its own.

&nbsp;

### Use It In Your Own Project

Skilled does not have to live inside each project. You can bring it into a project in one of two ways.

**Link it.** Keep one Skilled checkout and link it into each project. One `git pull` in the checkout then updates every linked project. Your own changes live in the project's files, next to the links. This is the simpler choice. See [Link It Into Your Project](INSTALL-SKILLED.md#3-link-it-into-your-project).

**Copy it.** Commit a copy of Skilled into the project, so the whole team shares one pinned version. Your changes to the copy live in an overlay folder, and `/doctor:overlay` puts them back after each update. See [Copy It Into Your Project](INSTALL-SKILLED.md#4-copy-it-into-your-project).

`/doctor:install` prints the ordered steps for your project. Each step shows a plan before it writes, and each one prints how to undo it.

&nbsp;

### First Task

```
/speckit:complete Build a user authentication system
```

This creates a spec folder, plans the work, builds it and saves the session context as it goes. Add `:with-research` to research before planning. In a later session, `/speckit:resume` picks up where the last one stopped. On Codex, Cursor, Pi, DSH and Mistral Vibe, type `/speckit-complete` instead.

&nbsp;

### Git Hooks

The repository ships versioned git hooks that check every commit and push in this checkout and its worktrees:

- **pre-commit** blocks code comments that cite spec ids and keeps generated files in step with what you stage
- **commit-msg** holds each message to the [commit template](.skilled/skills/sk-git/assets/commit-message-template.md): a `type(scope): summary` subject, a body and no `Co-Authored-By` lines
- **pre-push** blocks a push that deletes more than 100 tracked files, and asks before a push to a branch outside the sk-git allowlist

The session-start check installs any missing hook link in the main checkout while live sync is on, which is the default. It never installs from a linked worktree. `/doctor:git setup` checks the hooks and the sk-git settings. `/doctor:git hooks` switches a gate on or off, and `/doctor:git standards` changes the commit rules. A clone other than the one that installed the hooks runs their checks only after `git config --local skilled.trustRepoHooks true`. The [git hooks README](.skilled/scripts/git-hooks/README.md) describes each gate.

&nbsp;

<a id="overview"></a>

## 3. 🗺️ OVERVIEW

Three building blocks carry the whole system:

1. **Structured documentation** 

   Every file change gets a spec folder recording what changed, why and how. Like a lab notebook for software.

2. **Spec memory and search**

   Session context written into the spec folder it belongs to, then found again through a committed trigger index and ripgrep recipes over the same files.

3. **Coordinated agents and skills**

   11 specialized agents routed by a gate system that loads the right skills at the right time.

From request to documented result:

```
                         YOUR REQUEST
                              │
                              ▼
         ┌──────────────────────────────────────────┐
         │       GATE SYSTEM (6 mandatory gates)    │
         │                                          │
         │  Gate 1: Context     Gate 2: Skills      │
         │  Surface relevant    Auto-load the right │
         │  prior context       domain expertise    │
         │                                          │
         │  Gate 3: Spec Folder (HARD BLOCK)        │
         │  Every file change needs documentation   │
         │                                          │
         │  Gate 4: Workflow tiebreakers            │
         │  Gate 5: Repo rules load (HARD BLOCK)    │
         │  Gate 6: Reply rules load (HARD BLOCK)   │
         └──────────────────────┬───────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │    HOOKS, PLUGINS + EXTENSIONS           │
         │  26 shared hooks, one thin adapter in    │
         │  each of the 8 runtimes                  │
         │                                          │
         │  Enforce the gates, guard secrets and    │
         │  git, carry the session across resets    │
         └──────────────────────┬───────────────────┘
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
         ┌───────────────┐          ┌──────────────────┐
         │ AGENT NETWORK │          │  SKILLS LIBRARY  │
         │ 11 specialized│          │ 14 domain skills │
         │ agents with   │◄────────►│ auto-loaded by   │
         │ routing logic │          │ task keywords    │
         └───────┬───────┘          └────────┬─────────┘
                 │                           │
                 ▼                           ▼
         ┌──────────────────────────────────────────┐
         │       ROUTING + MCP TOPOLOGY             │
         │  code_mode MCP server, plus the advisor  │
         │  daemon on its own socket protocol       │
         │                                          │
         │  skill-advisor.cjs    skill routing      │
         │  code_mode            external tools     │
         │                                          │
         │  Shared contract: startup payload via    │
         │  runtime hooks                           │
         └──────────────────────┬───────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │     SPEC KIT (documentation framework)   │
         │  specs/<track>/###-feature/ - scratch/   │
         │  4 levels - template set - 42 rules      │
         │  trigger index │ ripgrep retrieval       │
         └──────────────────────────────────────────┘
```

&nbsp;

## 4. 🧭 HOW IT WORKS

### Gates

Six gates run before the agent acts. They are defined in [AGENTS.md](AGENTS.md), which every runtime reads.

Gate 1 surfaces prior context for each new message from a committed trigger index. Gate 2 routes the request to a skill through the skill advisor. Gate 3 asks which spec folder the work belongs to, before the first file write. It is a hard block. Gate 4 settles ties between a skill route and a CLI executor. Gate 5 loads the repository rules before the first write. Gate 6 loads the reply rules before every substantive answer.

Four more rules run after the work. The agent checks the final state, proves completion with fresh evidence, saves continuity through one writer and keeps the bound goal in view. The ten rule files live in `.skilled/repo-rules/`, and `REPO RULES.md` at the root routes each action to the files it needs.

&nbsp;

### Skill Routing

You never need to remember a skill name. The skill advisor scores each prompt and puts a one-line routing brief in front of the agent. At a confidence of 0.8 or more, the agent must load that skill.

The advisor is a resident daemon behind one CLI, `node .skilled/bin/skill-advisor.cjs`. It is not an MCP server. When the daemon is down, a local scorer answers instead and marks its answer stale. When no skill matches, the brief says so in one line. A setup or health prompt with no match gets a pointer to `/doctor:setup`. A hub skill can also name the command to type, with a policy that says whether to run it, start it or ask first. The [Skill Advisor README](.skilled/skills/system-skill-advisor/README.md) has the scoring and the CLI.

&nbsp;

### Spec Folders

Every conversation that changes files gets a folder under `specs/<track>/<###-name>/`. The depth of its documents scales with the task. There are four documentation levels (1, 2, 3 and 3+). Level 1 holds `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md`. Level 2 adds `acceptance-criteria.md`, the closure gate. Each of its rows must be Met before the packet can close. A row marked Waived or Superseded also passes when it cites a decision record. Level 3 adds architecture sections and a decision record. Level 3+ adds governance for complex work.

A typical folder looks like this:

```text
specs/<track>/<###-feature-name>/
├── description.json             # Spec identity and continuity metadata
├── spec.md                      # What the feature is and why it exists
├── plan.md                      # How to build it
├── tasks.md                     # The step-by-step task list
├── acceptance-criteria.md       # The closure gate (Level 2 and up)
├── decision-record.md           # Architecture decisions, when needed
├── implementation-summary.md    # What shipped and how it was checked
├── graph-metadata.json          # Packet graph metadata, refreshed on save
└── scratch/                     # Temporary working files
```

`validate.sh` runs 42 rules against a folder and reports what fails.

Folders nest in a fixed way. A track is the top folder, usually named after the skill or system the work touches. As a track grows, it can hold one level of named sub-tracks that group its packets by theme. Each sub-track numbers its own packets from `001` and keeps its own `z_archive/` for finished work. A sub-track is always a proposal the operator approves. `suggest-subtracks.mjs` suggests a grouping once a flat track reaches eight live packets, and `relocate.mjs` moves the packets and rewrites every stored path.

A large feature becomes a phase parent instead. The parent keeps only `spec.md`, `description.json` and `graph-metadata.json`, and its `spec.md` maps the phases. Each phase is a numbered child folder with its own plan, tasks and summary. A series parent works the same way for separate small changes to one artifact, such as one script or one command. It starts at the second change, so the history of that artifact stays in one place.

```text
specs/<track>/
├── <sub-track>/                 # Optional theme group, numbered from 001
│   ├── 001-<feature>/           # A standard packet
│   └── 002-<phase-parent>/      # A large feature split into phases
│       ├── spec.md              # Holds the phase map
│       ├── 001-<phase>/
│       └── 002-<phase>/
└── z_archive/                   # Finished packets
```

The [Spec Kit README](.skilled/skills/system-spec-kit/README.md) covers the templates, the scripts and the validator.

&nbsp;

### Continuity

The agent writes its progress into the spec folder it is working in. `/speckit:save` returns a save plan by default. With `--full-auto` it writes the session summary, decisions and next steps. `/speckit:resume` reads them back in a fixed order: `handover.md`, then the continuity block, then the spec docs.

Search stays plain on purpose. A committed trigger index matches the phrases authors declared, and ripgrep recipes cover free text. There is no database and no daemon on this path. A phrase nobody wrote returns a clean no-hit instead of a nearest guess.

After a compaction, a session can read back its own earlier turns with one read-only command. Your answers to the agent's questions are saved too, so the reason behind a choice lands in the packet's decision record.

&nbsp;

### Handing Over A Long Session

A long session can hand its work to a fresh one before the context window fills. Near the limit, the session writes a handoff note and saves its spec folder. The `skilled-loop` wrapper then starts the same runtime in the same terminal, and the new session claims the note. The running command, the goal, the model and the session name all carry over.

Handover is on by default for Claude Code and off elsewhere until you turn it on. The [Session Handover](#session-handover) hook below has the runtimes and switches.

&nbsp;

## 5. 🔄 EVERYDAY WORKFLOWS

### You Just Ask

You do not need to remember any command. Describe the task in plain words and the session does the rest. On every prompt, the [skill advisor](#skill-advisor) reads the request and tells the agent which skill fits. When a workflow fits too, the brief names its command and how to take it: start it now, start it with its setup questions or offer it to you first.

The session automation covers the rest of the path. The [spec gate](#spec-gate) asks once which spec folder the work belongs to. The [session lifecycle](#session-lifecycle) hooks prime the context at start and save continuity at stop and compaction. Near the context limit, [session handover](#session-handover) carries the work into a fresh session.

The commands below are what runs underneath. Type one yourself only when you want a specific workflow or mode.

&nbsp;

### Spec Kit Commands

`/speckit:complete` runs the whole path: intake, research, plan, build, verify and save. `/speckit:plan` stops after the plan, so someone can review it before any code is written. `/speckit:implement` builds from an existing `plan.md`. Each one accepts `:auto` to run without stopping or `:confirm` to pause at each step.

`/speckit:save` plans a continuity save and writes it with `--full-auto`. `/speckit:resume` restores it in a new session. `/speckit:search` runs the trigger index and the ripgrep recipes over spec docs and skill docs. `/speckit:handoff` hands the work to a fresh session now, instead of waiting for the context limit.

&nbsp;

### Deep Research And Deep Review

The deep loops run unattended and stop only when their own evidence says the work is done. `/deep:research` investigates a question one focused pass at a time. Results grow in `research/research.md` inside the spec folder. `/deep:review` audits code in passes, ranks every finding P0, P1 or P2 and never edits the code it reviews.

Each pass runs in a fresh context against state kept on disk. A script, not the agent, decides when to stop. A review stays open while a P0 is active or a required check still fails, and it ends in a PASS, CONDITIONAL or FAIL verdict. A loop survives crashes and new sessions, because its progress lives in files.

A loop can also spread across several AI CLIs at once. Each executor runs its own lineage, and for a review the strictest verdict wins the merge. A pool caps how many lineages run at once. A stall watchdog stops a lineage that stops making progress, and a cost cap bounds what each one spends. The [Deep Loop README](.skilled/skills/system-deep-loop/README.md) describes both modes and the shared runtime.

&nbsp;

### AI Council

`/speckit:ai-council` brings several AI viewpoints to a hard planning decision. The `@ai-council` agent runs the seats. Each one reasons from a different angle, then they critique each other and converge on a recommendation with its evidence. The council only plans. It writes its reasoning into the spec folder and never touches your code.

&nbsp;

## 6. 🧰 SKILLS

Fourteen skills ship in `.skilled/skills/`. Gate 2 loads one when the advisor matches it to a task. Seven of them are parent hubs. A hub holds several modes and routes each request to the mode that fits, 42 modes in all. The other seven skills work on their own.

### Parent Hubs

**[sk-code](.skilled/skills/sk-code/README.md)** writes, reviews and verifies code in the stack you are in. Its five modes are quality, for the checks after implementation, and review, for findings-first code review. CI covers GitHub Actions workflows and frontend covers CSS, HTML and browser work. The skilled mode holds the standards for this repository's own TypeScript, Python, shell and config code.

**[sk-doc](.skilled/skills/sk-doc/README.md)** authors documentation and components. Its fifteen modes create skills, parent hubs, READMEs, agents, commands, feature catalogs, manual testing playbooks, benchmarks, changelogs, diffs, frontmatter, repo rules and goals. Two more run quality control and apply the human voice rules.

**[sk-design](.skilled/skills/sk-design/SKILL.md)** turns one design identity into an artifact. Its three modes extract a measured style reference from a live site, draw a diagram and build a chart.

**[system-deep-loop](.skilled/skills/system-deep-loop/README.md)** runs the autonomous loops over one shared runtime. Its two modes are deep research and deep review.

**[cli-external-orchestration](.skilled/skills/cli-external-orchestration/README.md)** hands work to another AI CLI. Its eight modes are bridges to OpenCode, Claude Code, Codex, Cursor, Devin, Pi, DeepSeek Harness and Mistral Vibe.

**[cli-classifier](.skilled/skills/cli-classifier/README.md)** asks a hosted classifier for typed judgments. It has one mode today, the Jev transport, and future classifiers join as new modes.

**[mcp-tooling](.skilled/skills/mcp-tooling/README.md)** bridges outside tools through Code Mode. Its eight modes cover Chrome DevTools, ClickUp, the Aside browser, Notion and Obsidian. Three more are read-only design sources: Figma, Refero and Mobbin.

&nbsp;

### Standalone Skills

**[system-spec-kit](.skilled/skills/system-spec-kit/README.md)** owns spec folders, documentation levels, the validator, continuity and lexical search. Every file change goes through it.

**[system-skill-advisor](.skilled/skills/system-skill-advisor/README.md)** routes each prompt to the skill that fits, through a daemon-backed CLI.

**[system-skilled-doctor](.skilled/skills/system-skilled-doctor/README.md)** holds the doctor commands that install Skilled in a project and keep it current, overlays included.

**[sk-git](.skilled/skills/sk-git/README.md)** handles worktrees, conventional commits, pull requests and finishing a branch.

**[sk-prompt](.skilled/skills/sk-prompt/README.md)** turns a rough request into a structured, checked prompt.

**[cli-orca](.skilled/skills/cli-orca/README.md)** drives the Orca app's worktrees, terminals, browser and automations.

**[mcp-code-mode](.skilled/skills/mcp-code-mode/README.md)** calls external MCP tools through one TypeScript interface.

Only `sk-code` carries stack-specific patterns, so start there when you adapt Skilled to your own stack. The [sk-code README](.skilled/skills/sk-code/README.md#4-adapting-to-your-stack) walks through it, and `/doctor:sk-code setup` checks the result. Add a skill of your own with `/create:skill`, and the advisor finds it from its metadata.

&nbsp;

## 7. 🧩 HOOKS, PLUGINS AND EXTENSIONS

Skilled enforces its rules through hooks that each runtime calls at fixed moments: at session start, on each prompt, around each tool call and at session end. Every hook has one home folder in `.skilled/hooks/<name>/`, with the shared policy and a README. Each runtime reaches it through a thin adapter in its own place: `.claude/hooks/`, `.codex/hooks/`, `.cursor/hooks/`, `.devin/hooks/`, `.dsh/plugins/`, `.opencode/plugins/`, `.pi/extensions/` and `.vibe/hooks.toml`.

A few hooks keep their code with the skill that owns the logic and link into that folder. The spec gate and the session-lifecycle adapters live in `system-spec-kit`. The git message gate and preflight live in `sk-git`. The session-start git checks live in `.skilled/bin/`. The `shared` folder holds the helpers every hook uses: the off-switch resolver, the input readers and the session readers.

Runtime support is uneven on purpose, because each runtime exposes different events. The [hooks README](.skilled/hooks/README.md) holds the full coverage matrix and every off switch. `SYSTEM_HOOKS_DISABLED=1` turns them all off at once, except the git message gate.

&nbsp;

The hooks below are grouped by purpose. Each entry says what the hook does, which runtimes run it and where its code lives.

&nbsp;

### Safety And Secrets

These hooks keep secrets, vendored files and untrusted web text in check.

#### Env Secret Guard

The agent may not read or write a `.env` file, because that would send every secret in it to the model. The guard refuses the call, undoes a dotenv write a shell command made anyway and watches command output for a dotenv value. In place of the file, it lists key names, reports parse errors and fingerprints a value.

**Source:** [`.skilled/hooks/env-secret-guard/`](.skilled/hooks/env-secret-guard/README.md)

#### Overlay Guard

A project that commits a copy of Skilled keeps its own changes in overlay files. This guard refuses an edit to a file an overlay owns and names the overlay file to edit instead, so the next update does not wipe the change.

**Source:** [`.skilled/hooks/overlay-guard/`](.skilled/hooks/overlay-guard/README.md)

#### Permission Policy

Devin asks for permission before some tool calls. This hook answers that request with allow or deny, from the same spec-gate and dispatch rules the other hooks use. Anything it cannot classify is denied. The Devin adapter file is `permission-request-policy.mjs`.

**Source:** [`.skilled/hooks/permission-policy/`](.skilled/hooks/permission-policy/README.md)

#### Classifier Injection Screen

After the agent fetches a web page, this hook asks the Jev classifier whether the text holds instructions aimed at an AI agent. When a section does, it adds one advisory line. It runs only once a Jev key is stored, and it never blocks.

**Source:** [`.skilled/hooks/classifier-injection-screen/`](.skilled/hooks/classifier-injection-screen/README.md)

&nbsp;

### Git

These hooks keep the git history clean and the main checkout current. Four of them run at session start.

#### Git Hooks Check

At session start, this check confirms that the repository's versioned git hooks are installed and current. In the main checkout with live sync on, it installs a missing hook link itself. It prints a warning and never blocks a session.

**Source:** [`.skilled/hooks/git-hooks-check/`](.skilled/hooks/git-hooks-check/README.md)

#### Git Live Follow

At session start, this hook starts a follower that fast-forwards your main checkout to the shared live branch as new commits land. Your editor then shows the combined work of every session. It is one half of [live sync](#13--git-worktrees-and-live-sync).

**Source:** [`.skilled/hooks/git-live-follow/`](.skilled/hooks/git-live-follow/README.md)

#### Git Primary Reconcile

At session start, this hook brings the main checkout back onto its live branch. It fast-forwards when the checkout is behind and publishes local commits when it is ahead. It is the other half of live sync.

**Source:** [`.skilled/hooks/git-primary-reconcile/`](.skilled/hooks/git-primary-reconcile/README.md)

#### Git Worktree Guard

At session start, this guard warns when a top-level session runs on the shared checkout instead of its own worktree. Parallel sessions on one checkout step on each other's changes.

**Source:** [`.skilled/hooks/git-worktree-guard/`](.skilled/hooks/git-worktree-guard/README.md)

#### Git Message Gate

Before a commit, a pull request or a new branch, this gate checks the message, description or branch name against the sk-git templates. It refuses one that breaks them. It has no off switch, because the rules carry no bypass. Change a rule with `/doctor:git standards` instead.

**Source:** [`.skilled/hooks/git-message-gate/`](.skilled/hooks/git-message-gate/README.md)

#### Git Preflight

Before a git command runs, this hook checks it against the sk-git hard rules and prints one line about any behavior that tends to surprise. It never blocks.

**Source:** [`.skilled/hooks/git-preflight/`](.skilled/hooks/git-preflight/README.md)

&nbsp;

### Sessions And Continuity

These hooks carry context, goals and decisions from one session to the next.

#### Session Lifecycle

At session start, this hook primes the session with the continuity of its spec folder. At stop it saves a checkpoint, and after a compaction it restores the context the summary dropped.

**Source:** [`.skilled/hooks/session-lifecycle/`](.skilled/hooks/session-lifecycle/README.md)

#### Session Handover

Near the context limit, this hook asks the session to write a handoff note and arms a record for the next one. The `skilled-loop` wrapper then starts a fresh session in the same terminal, and that session claims the note. Started without the wrapper, Claude Code keeps the note and returns to it after its own auto-compaction.

To start every plain runtime launch under the wrapper, add this line to your shell profile with your checkout's absolute path:

```bash
source /abs/path/to/skilled-agent-harness_spec-driven-loops/.skilled/bin/skilled-loop-shell.sh
```

The note carries what the next session needs. It holds the goal and what is left. It also names the running command with its mode and arguments. The model, effort, launch flags and session name carry over too. The hop waits for the session's background tasks, and your next prompt calls off a hop that is still waiting.

Handover is on by default for Claude Code only. `SYSTEM_SESSION_HANDOVER_ENABLED=1` turns it on everywhere. `SYSTEM_SESSION_HANDOVER_<RUNTIME>_ENABLED` sets one runtime, with `<RUNTIME>` one of `CLAUDE`, `CODEX`, `PI`, `OPENCODE`, `CURSOR`, `DEVIN` or `VIBE`. A runtime's own flag wins over the global one. `SYSTEM_SESSION_HANDOVER_DISABLED=1` beats every enable flag. While handover is off for a runtime, `/speckit:handoff` refuses there and the runtime's own compaction handles a full window.

**Source:** [`.skilled/hooks/session-handover/`](.skilled/hooks/session-handover/README.md)

#### Session Cleanup

This hook runs bounded checks at startup and cleans up at teardown. It stops only MCP helper processes it can prove the session started.

**Source:** [`.skilled/hooks/session-cleanup/`](.skilled/hooks/session-cleanup/README.md)

#### Goal

A spec folder can hold a `goal.md` with the directive and the criteria that decide when the work is done. This hook binds a session to that file and injects a short slice of it, so the goal survives context resets. `/create:goal` writes the file. Claude Code and Codex use their own `/goal` command instead, and the spec workflows hand you the slice to paste. OpenCode manages the goal with `/goal-opencode`, Pi with `/goal-pi` and DSH with `/goal-dsh`.

**Source:** [`.skilled/hooks/goal/`](.skilled/hooks/goal/README.md)

#### Decision Capture

Each answer you give to the agent's question tool is queued as you give it. The next full-auto `/speckit:save` writes it into the packet's `decision-record.md`, with the question, the options and your answer word for word. Questions about process, such as which spec folder to use, are left out.

**Source:** [`.skilled/hooks/decision-capture/`](.skilled/hooks/decision-capture/README.md)

&nbsp;

### Routing And Dispatch

These hooks send each request, tool call and question down the right path.

#### Skill Advisor

On each prompt, this hook puts the skill advisor's one-line routing brief in front of the agent. It advises only. When the advisor cannot answer, the brief says why in one line and the prompt goes through.

**Source:** [`.skilled/hooks/skill-advisor/`](.skilled/hooks/skill-advisor/README.md)

#### Directive Lifecycle

The skill advisor repeats a few fixed directives. This hook tracks which ones a session already received, so they appear once per startup or compaction instead of on every turn.

**Source:** [`.skilled/hooks/directive-lifecycle/`](.skilled/hooks/directive-lifecycle/README.md)

#### MCP Route Guard

When the agent calls an external MCP tool directly, this hook adds an advisory that the call should go through Code Mode instead.

**Source:** [`.skilled/hooks/mcp-route-guard/`](.skilled/hooks/mcp-route-guard/README.md)

#### CLI Dispatch

Before the agent runs a composed CLI dispatch, a preflight lint checks it against the bridge's hard rules. A broken rule stops the call. After the call, an audit trail records it as one JSON line.

**Source:** [`.skilled/hooks/cli-dispatch/`](.skilled/hooks/cli-dispatch/README.md)

#### Subagent Dispatch Guard

Before the agent hands a task to a subagent, this guard checks for a deep loop that repeats itself. On Claude Code it also applies the model policy for subagents.

**Source:** [`.skilled/hooks/subagent-dispatch-guard/`](.skilled/hooks/subagent-dispatch-guard/README.md)

#### Ask Surface Guard

A turn that ends in a typed menu of options gets sent back once. The agent then asks the same question through the runtime's question tool, where you can pick an answer. On Codex and Devin it warns instead of sending the turn back.

**Source:** [`.skilled/hooks/ask-surface-guard/`](.skilled/hooks/ask-surface-guard/README.md)

&nbsp;

### Quality And Evidence

These hooks ask for a spec folder, check each edit and hold the agent to its proof.

#### Spec Gate

Before the first file change of a session, this hook asks which spec folder the work belongs to and remembers the answer. It advises by default. `SYSTEM_SPEC_GATE_ENFORCE` turns the question into a hard stop. Mistral Vibe always enforces it.

**Source:** [`.skilled/hooks/spec-gate/`](.skilled/hooks/spec-gate/README.md)

#### Completion Evidence

This hook fires when the agent claims a task is done. It looks for the proof behind the claim and names what is missing. It advises and never blocks.

**Source:** [`.skilled/hooks/completion-evidence/`](.skilled/hooks/completion-evidence/README.md)

#### Post-Edit Quality

After every write or edit, this hook runs the comment-hygiene check, the dist-staleness check and related checks on the changed file. It reports what it finds next to the edit.

**Source:** [`.skilled/hooks/post-edit-quality/`](.skilled/hooks/post-edit-quality/README.md)

#### Dist Freshness

Several hooks run compiled scripts from a `dist` build. This hook detects a build that is older than its TypeScript sources and rebuilds it, so a hook never runs stale code.

**Source:** [`.skilled/hooks/dist-freshness/`](.skilled/hooks/dist-freshness/README.md)

#### Codex Global Hooks Check

At session start, this check confirms that Codex's user-global hook file holds no copy of this repository's hooks. A stale copy there would run the hooks twice in every Codex session.

**Source:** [`.skilled/hooks/codex-global-hooks-check/`](.skilled/hooks/codex-global-hooks-check/README.md)

&nbsp;

### Runtime-Only Hooks

A few hooks exist for one runtime only, because they answer an event the others lack.

#### Fable Subagent Guard (Claude Code)

When the main Claude Code session runs on a Fable model, this guard denies a subagent dispatch that would inherit that model. Only an explicit Opus or Sonnet override passes. It belongs to the subagent dispatch guard above.

**Source:** `.claude/hooks/fable-subagent-guard.mjs`, from `.skilled/hooks/subagent-dispatch-guard/claude/`

#### Session Prime (Claude Code)

At session start, this script injects the continuity of the active spec folder into a Claude Code session. Mistral Vibe's session-start hook reuses it.

**Source:** `.claude/hooks/session-prime.js`, built from `system-spec-kit`

#### Handover Subagent Guard (Claude Code)

A subagent shares its parent's session id, so a handover command run inside one would act on the parent's handoff note. This guard refuses that command and leaves the note to the parent.

**Source:** `.claude/hooks/handover-subagent-guard.mjs`, from `.skilled/hooks/session-handover/claude/`

#### Handover Prompt Seed (Codex)

On each Codex prompt, this hook adds the claim instructions to a handover seed prompt, or the context nudge as the session nears its limit.

**Source:** `.codex/hooks/handover-prompt-seed.mjs`, from `.skilled/hooks/session-handover/codex/`

#### Spec Gate Prebind (Cursor)

Cursor's CLI delivers no prompt-classification event, so this hook sets up the spec gate's state at session start. When `SYSTEM_SPEC_FOLDER` names a valid spec folder, that counts as the Gate 3 answer.

**Source:** `.cursor/hooks/spec-gate-prebind.mjs`, from `system-spec-kit`

#### Post-Compaction Recovery (Devin)

Devin fires its compaction event after the summary is written, with no transcript. This hook keeps the summary and restores the spec folder's continuity from disk. Devin's other runtime-only hook, `permission-request-policy`, is the [permission policy](#permission-policy) above.

**Source:** `.devin/hooks/post-compaction.cjs`, from `system-spec-kit`

&nbsp;

### Pi Extension Packages

Pi loads two extension packages from this repository and eight from outside it. They add features, not policy.

#### Pi Cache Optimizer

A Pi extension package that raises provider prompt-cache hit rates. It moves stable prompt content ahead of the parts that change, adds a careful cache-key fallback for OpenAI-compatible providers and shows cache statistics in the footer. It also stops a paid retry loop when a whole batch of tool calls keeps failing. It is a fork of `jiangge/pi-cache-optimizer` under the MIT license, and the vendored copy is the live source.

**Source:** [`.pi/extensions/pi-cache-optimizer/`](.pi/extensions/pi-cache-optimizer/README.md)

#### Fast Mode With Subagent Support

A Pi extension package that adds a Fast Mode toggle for OpenAI GPT-5.4 through GPT-6 models. It sends OpenAI's priority service tier on matching requests and passes the setting on to subagents. `/fast` switches it, and `--fast` turns it on at startup.

**Source:** [`.pi/extensions/pi-fast-mode-w-subagent-support/`](.pi/extensions/pi-fast-mode-w-subagent-support/README.md)

#### Community Packages

Pi also loads eight community packages that `.pi/settings.json` lists: `rpiv-ask-user-question`, `rpiv-todo`, `pi-blackhole`, `pi-statusline`, `pi-web-access`, `pi-btw`, `pi-plan-build` and `pi-claude-code-ui`. They come from npm or GitHub, not from this repository. The [Pi extensions README](.pi/extensions/README.md) maps every Skilled hook entry to its real file.

&nbsp;

## 8. 🤖 AGENTS

Eleven agents own focused roles. Their source is `.skilled/agents/`, which OpenCode links to. Codex, Pi, DSH and Mistral Vibe carry copies generated from it. Claude Code keeps a hand-carried copy in `.claude/agents/`, and Cursor and Devin link to that copy.

- **`@orchestrate`** splits multi-step work, hands each part to a specialist and merges the results
- **`@code`** writes and fixes code for the detected stack and proves it works before it says done
- **`@context`** finds what is already known, from packet continuity first and code search second
- **`@review`** reviews code without editing it and ranks findings by severity
- **`@debug`** takes a fresh look at a bug after three failed attempts, from a clean handoff
- **`@markdown`** writes docs from templates and runs the `/create:*` commands
- **`@prompt-improver`** turns a high-stakes prompt into a checked, structured package
- **`@design`** decides visual values and builds style references, charts and diagrams
- **`@ai-council`** runs several AI viewpoints toward one vetted plan and never writes code
- **`@deep-research`** runs one research pass of a `/deep:research` loop
- **`@deep-review`** runs one review pass of a `/deep:review` loop

&nbsp;

## 9. 💻 COMMANDS

Forty-four commands ship in six groups under [`.skilled/commands/`](.skilled/commands/). Each one is a Markdown file, and most hand their steps to a YAML workflow beside it.

**Spec Kit (8).** `/speckit:complete`, `/speckit:plan`, `/speckit:implement`, `/speckit:resume`, `/speckit:save`, `/speckit:search`, `/speckit:handoff` and `/speckit:ai-council`. These run the spec workflow and its continuity, as [Everyday Workflows](#5--everyday-workflows) describes.

**Create (13).** `/create:skill`, `/create:skill-parent`, `/create:agent`, `/create:command`, `/create:readme`, `/create:changelog`, `/create:feature-catalog`, `/create:manual-testing-playbook`, `/create:goal`, `/create:benchmark`, `/create:diff`, `/create:repo-rule` and `/create:with-human-voice`. These scaffold or revise one kind of artifact to the `sk-doc` standards.

**Deep (2).** `/deep:research` and `/deep:review` run the autonomous loops.

**Design (3).** `/design:extract` measures a live site into a style reference. `/design:chart` builds a standalone HTML chart, and `/design:diagram` draws an HTML and SVG diagram.

**Prompt (1).** `/prompt:improve` turns a rough prompt into a structured one.

**Doctor (17).** Health checks and repairs, listed under [Doctor Commands](#11--doctor-commands).

Some runtimes add a goal command of their own: `/goal-opencode` in `.opencode/commands/`, `/goal-cursor` in `.cursor/commands/` and `/goal-pi` in `.pi/prompts/`. DSH registers `/goal-dsh` from its plugin.

&nbsp;

## 10. 🔌 RUNTIMES AND CLI BRIDGES

Skilled runs in eight AI runtimes. Each one keeps its own folder and loads the hooks its own way:

| Runtime | Folder | Commands look like | Hooks load from |
| --- | --- | --- | --- |
| Claude Code | `.claude/` | `/speckit:complete` | `.claude/settings.json` |
| Codex | `.codex/` | `/speckit-complete` | `.codex/hooks.json` |
| Cursor | `.cursor/` | `/speckit-complete` | `.cursor/hooks.json` |
| Devin | `.devin/` | skills as slash commands, such as `/system-spec-kit` | `.devin/hooks.v1.json` |
| OpenCode | `.opencode/` | `/speckit:complete` | `.opencode/plugins/` |
| Pi | `.pi/` | `/speckit-complete` | `.pi/extensions/` |
| DeepSeek Harness (DSH) | `.dsh/` | `/speckit-complete` | `.dsh/plugins/repo-guards/` |
| Mistral Vibe | `.vibe/` | `/speckit-complete` | `.vibe/hooks.toml` |

Each runtime folder is mostly generated from `.skilled/`, the one source of truth. Its README says which files are generated and which are authored there: [Claude Code](.claude/README.md), [Codex](.codex/README.md), [Cursor](.cursor/README.md), [Devin](.devin/README.md), [OpenCode](.opencode/README.md), [Pi](.pi/README.md) and [DeepSeek Harness](.dsh/README.md). Mistral Vibe keeps the same notes in [`.vibe/SYNC.md`](.vibe/SYNC.md).

Each runtime folder is mostly generated from `.skilled/`, the one source of truth. Its README says which files are generated and which are authored there: [Claude Code](.claude/README.md), [Codex](.codex/README.md), [Cursor](.cursor/README.md), [Devin](.devin/README.md), [OpenCode](.opencode/README.md), [Pi](.pi/README.md) and [DeepSeek Harness](.dsh/README.md). Mistral Vibe keeps the same notes in [`.vibe/SYNC.md`](.vibe/SYNC.md).

The eight runtimes share one source tree. Skills, agents, commands and hooks live in `.skilled/`, and a generator writes each runtime's copy. `/doctor:runtime-mirrors` checks that every copy still matches. Claude Code and OpenCode spell commands with a colon, as in `/speckit:complete`. Codex, Cursor, Pi, DSH and Mistral Vibe use a hyphen, as in `/speckit-complete`. Devin shows each skill as a slash command, so it reaches the spec workflow through `/system-spec-kit`.

A few runtimes need one step of their own. Codex runs a repository hook only after you approve that entry, so open `/hooks` after an update and approve each entry it lists. Mistral Vibe loads its hooks only in a trusted checkout. DSH loads plugins only from the patches a run names, and `.dsh/patches/guards.patch.yml` loads the guard bundle. OpenCode loads the same plugins on OpenCode 2 and OpenCode 1.

The `cli-external-orchestration` hub carries eight CLI bridges: `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`, `cli-deepseek-harness` and `cli-mistral-vibe`. A bridge lets one runtime hand a task to another AI CLI and read back the result. The calling agent stays in charge. Each bridge checks that its CLI is installed and checks the dispatch against its own hard rules before it runs.

Six bridges refuse to dispatch the runtime they run in. `cli-pi` and `cli-deepseek-harness` may call their own runtime, but neither dispatches from inside a fan-out lineage or a dispatch that already uses it. That bound keeps delegation from looping. The DeepSeek Harness and Mistral Vibe bridges are experimental. All eight also work as deep-loop executors, so one research or review run can bind several of them.

&nbsp;

## 11. 🩺 DOCTOR COMMANDS

Seventeen doctor commands check and repair the setup, one area each. Every target that writes shows its plan and waits for your yes. `/doctor:helper` names the command that fits a problem you describe. The [system-skilled-doctor README](.skilled/skills/system-skilled-doctor/README.md) has the details.

| Command | What it does |
| --- | --- |
| `/doctor:setup` | Runs the read-only setup checks and names one repair for each failing check |
| `/doctor:helper` | Ranks the doctor commands against a problem in your own words |
| `/doctor:install` | Prints the ordered steps that install Skilled in your own project |
| `/doctor:symlink` | Checks, links or unlinks a Skilled checkout in another project |
| `/doctor:overlay` | Checks a vendored copy's overlays, puts them back or moves the copy to a newer commit |
| `/doctor:update` | Checks, applies or rolls back a new Skilled release |
| `/doctor:agents-md` | Checks your root `AGENTS.md` against the shipped template, then embeds or restores it |
| `/doctor:runtime-mirrors` | Checks that each runtime folder still matches `.skilled/` |
| `/doctor:env` | Shows every setting and where it is set, then saves a change after your yes |
| `/doctor:mcp` | Installs, registers or debugs Code Mode |
| `/doctor:git` | Checks the git hooks and sk-git settings, switches gates and edits the commit rules |
| `/doctor:ci` | Lists the GitHub Actions workflows, scaffolds one or toggles a CI switch |
| `/doctor:speckit` | Checks the trigger index, its lookup and the ripgrep recipes |
| `/doctor:skill-advisor` | Tunes and rebuilds the skill advisor and audits its graph |
| `/doctor:sk-skill` | Checks a skill against the Skilled format, or converts one |
| `/doctor:sk-code` | Runs the sk-code setup checks, or checks and creates the quality config |
| `/doctor:deep-loop` | Reads the coverage graphs and convergence of research and review runs |

&nbsp;

## 12. 🔗 CODE MODE MCP

Code Mode lets the agent call external tools, such as Figma, GitHub, Chrome DevTools, ClickUp and Webflow, through one TypeScript interface. Tool definitions load when a call needs them, not up front, so they cost no context until then.

`code_mode` is the only MCP server Skilled registers. It has seven tools: `search_tools`, `tool_info`, `call_tool_chain`, `list_tools`, `register_manual`, `deregister_manual` and `get_required_keys_for_tool`. The external providers are declared in `.utcp_config.json`, which holds 14 manual templates. Their keys live in `.env`, which only Code Mode reads.

`/doctor:mcp install` builds Code Mode and registers it in seven project config files for six runtimes: OpenCode, Claude Code (two files), Codex, Cursor, Pi and Devin. Each write waits for its own approval. DSH loads Code Mode from a hand-written patch in `.dsh/patches/`, and Mistral Vibe has no Code Mode registration. `/doctor:mcp debug` reports PASS, WARN or FAIL per check, and `--fix` adds guided repair.

A call runs TypeScript against the registered tools. One chain can call several tools in a single round trip:

```typescript
call_tool_chain({ code: "return await figma.figma_get_file({fileKey: 'abc123'})" })
```

The [Code Mode README](.skilled/skills/mcp-code-mode/README.md) covers the call patterns and the naming of each tool.

&nbsp;

## 13. 🌿 GIT WORKTREES AND LIVE SYNC

Each session can work in its own git worktree, so parallel sessions never edit the same files. `sk-git` creates numbered worktrees and provisions them, so dependencies install and the Spec Kit builds before the first task.

Live sync keeps your main checkout current. A session started through the launch wrapper publishes each commit to a shared live branch. At session start, the [live-follow](#git-live-follow) and [primary-reconcile](#git-primary-reconcile) hooks keep the main checkout on that branch. Your editor then shows every session's committed work in one place.

Live sync is on by default in the main checkout. `SYSTEM_LIVE_SYNC_DISABLED=1` turns the whole loop off. `SYSTEM_LIVE_FOLLOW_DISABLED=1` and `SYSTEM_PRIMARY_RECONCILE_DISABLED=1` turn off one part each. The [continuous integration reference](.skilled/skills/sk-git/references/continuous-integration.md) describes the full model.

&nbsp;

## 14. 🔧 CONFIGURATION AND PRIVACY

### Core Files

[AGENTS.md](AGENTS.md) holds the gates and behavior rules for every runtime. Claude Code and Codex read it directly, so the repository ships no `CLAUDE.md`. `opencode.json` holds OpenCode's permissions and its Code Mode binding. `.utcp_config.json` declares the Code Mode providers.

&nbsp;

### Environment Settings

Every setting has a working default, so you can start without setting anything. [`.env.example`](.env.example) lists every setting the code reads, with its default and purpose. [`hook-flags.env.example`](.skilled/hooks/hook-flags.env.example) lists the switches that can also live in a file.

Set a value as an `export` in your shell profile, which wins over everything else. Or write a hook switch into `.skilled/hooks/hook-flags.env`, which git ignores. Claude Code also reads the `env` block of `.claude/settings.local.json`. `/doctor:env` shows each setting by name and never by value. It saves a change only after you approve the exact line.

&nbsp;

### Off Switches

The AI hooks, the validators, the git hooks and the CI workflows all have off switches. Create the personal switch file once:

```bash
cp .skilled/hooks/hook-flags.env.example .skilled/hooks/hook-flags.env
```

`SYSTEM_HOOKS_DISABLED=1` turns off every AI hook except the git message gate. Each hook also has its own switch, listed in the [hooks README](.skilled/hooks/README.md). `SPECKIT_SKIP_VALIDATION=1` and `SKDOC_SKIP_VALIDATION=1` switch off the spec and sk-doc validators. A skipped run says so, so it proves nothing about a document. CI workflows read repository variables, and `/doctor:ci report` shows their state.

For the git hooks, each blocking gate names its one-time bypass in its message. `/doctor:git hooks` switches a gate off until you switch it back on. To remove the git hooks and stop the session check from installing them again:

```bash
bash .skilled/scripts/install-git-hooks.sh --uninstall
echo 'SYSTEM_GIT_HOOKS_CHECK_DISABLED=1' >> .skilled/hooks/hook-flags.env
```

&nbsp;

### What Stays On Your Machine

Continuity stays local. Spec folders, the trigger index and the ripgrep search are files in your own repository, and no service reads them.

That guarantee covers continuity, not every feature. Your AI runtime sends your prompts and the files it reads to its model provider. A CLI bridge sends the task to the CLI it calls. A Code Mode tool talks to its external service, and the Jev screen sends fetched text to the hosted classifier once a key is stored. Check each provider's terms before you use it on private code.

&nbsp;

## 15. 🆕 WHAT'S NEW SINCE v4.0.0.0

### v4.0.1.0: Every Skill Routes From Its Own File

Each skill now keeps its routing tables in a `ROUTER.md` beside its `SKILL.md`, so the agent reads less before it starts. Every request routes as it did before. A skill you wrote yourself needs the same move, and `/doctor:sk-skill` makes it for you.

The doctor family grew. `/doctor:install` and `/doctor:symlink` link Skilled into your own project. `/doctor:agents-md` keeps your root instruction file current, and `/doctor:helper` names the command for a problem.

Your answers to the agent's questions started landing in the decision record. `sk-code` gained a web frontend surface, and playbooks can now script a whole conversation. MagicPath, `sk-vision` and the old design values mode were retired. See the [v4.0.1.0 release notes](.skilled/changelog/skilled/v4.0.1.0.md).

&nbsp;

### v4.0.2.0: Skilled In Your Own Project

`INSTALL-SKILLED.md` arrived as the single setup guide for linking or copying Skilled into a project. The new `system-skilled-doctor` skill owns the setup commands. `/doctor:overlay` keeps a copied project's own changes through each update. A project whose `specs` folder links elsewhere can save again, and Gate 1 now finds the project's own packets.

A compacted session can read back its earlier turns through one read-only command. A reply that ends in a typed option menu now goes back once, so the agent asks through the question tool.

DeepSeek Harness joined as an experimental CLI. Hermes Agent was removed, together with `cli-hermes`, the `.hermes/` folder and the `hermes` shell function. See the [v4.0.2.0 release notes](.skilled/changelog/skilled/v4.0.2.0.md).

&nbsp;

### v4.0.2.1: Chat Automation, Search And Session Handover

Skilled now requires a patched Node release. The new `env-secret-guard` keeps `.env` values away from the agent on all eight runtimes. The skill advisor names the command behind a hub skill, with a run, start or ask policy.

Claude Code now hands over by default. Pi, OpenCode and Mistral Vibe finish a hop too. The whole feature is now called session handover. Its old switch names are no longer read, so rename any you set, as the [release notes](.skilled/changelog/skilled/v4.0.2.1.md#session-handover) describe.

The AI Council moved out of Deep Loop. Run `/speckit:ai-council`, because `/deep:ai-council` is gone. Deep loops now stop on a decision a script computes, and a deep review fails while a required check still fails. Search answers now say how much they left out, and a new spec document is found before the index catches up. A vendored tree can now refuse writes that no overlay owns. Pi 1.5.2 loads every hook adapter again. See the [v4.0.2.1 release notes](.skilled/changelog/skilled/v4.0.2.1.md).

&nbsp;

## 16. ❓ FAQ

### Must all 14 skills be installed?

No. Gate 2 loads a skill only when a task needs it. The MCP and CLI skills need their own tools or keys before they can run.

&nbsp;

### What happens if I skip the spec folder?

Gate 3 waits for an answer before the first file change. Option D skips it, but that work leaves no record for `/speckit:resume` or `/speckit:search` to find. A fix of a few characters in one file does not trigger the gate.

&nbsp;

### What happens when a session runs out of context?

On Claude Code, the session hands over to a fresh one under the `skilled-loop` wrapper. Without the wrapper, it keeps a handoff note it returns to after auto-compaction. Other runtimes fall back to their own compaction until you turn handover on.

&nbsp;

### Can I use Skilled without the continuity features?

Yes. Spec folders, the gates, the agents and the skills all work without `/speckit:save`. You lose cross-session recovery.

&nbsp;

### How can I add a skill or an agent?

Run `/create:skill` for a skill. The advisor finds it from its `SKILL.md` and `graph-metadata.json`, with no registration step. Run `/create:agent` for an agent, which writes the source file in `.skilled/agents/` and the Claude Code copy.

&nbsp;

### How can I keep Skilled current after a new release?

Run `/doctor:update check` to see what a release changes, then `/doctor:update apply` to bring it in after your yes. It can roll the update back. Afterwards, `/doctor:runtime-mirrors` checks that every runtime folder still matches `.skilled/`, and `/doctor:setup` runs the full health check.

&nbsp;

### Why is the skill advisor not an MCP server?

It runs as a resident daemon behind one CLI, so every runtime can call it the same way from a hook. `code_mode` is the only MCP server Skilled registers.

&nbsp;

## 17. 📚 RELATED DOCUMENTS

**Start here**

- **[AGENTS.md](AGENTS.md)** - the gates, behavior rules and agent routing every runtime reads
- **[Install Guide](INSTALL-SKILLED.md)** - install a checkout, then link or copy Skilled into your own project
- **[Contributing](CONTRIBUTING.md)** - how to propose a change
- **[Security](SECURITY.md)** - how to report a problem and what the guards cover

**Core systems**

- **[Spec Kit README](.skilled/skills/system-spec-kit/README.md)** - spec folders, templates, the validator and continuity
- **[Skill Advisor README](.skilled/skills/system-skill-advisor/README.md)** - the daemon-backed CLI and how routing scores a prompt
- **[Deep Loop README](.skilled/skills/system-deep-loop/README.md)** - deep research, deep review and the shared runtime
- **[Doctor README](.skilled/skills/system-skilled-doctor/README.md)** - the setup commands and overlays for a vendored copy
- **[Code Mode README](.skilled/skills/mcp-code-mode/README.md)** - external tools through one TypeScript interface

**Hooks and runtimes**

- **[Hooks README](.skilled/hooks/README.md)** - every hook, which runtimes run it and its off switch
- **[Session Handover README](.skilled/hooks/session-handover/README.md)** - the handoff note, the wrapper and the shell shim
- **[Git Hooks README](.skilled/scripts/git-hooks/README.md)** - each git hook gate and its bypass
- **[OpenCode Plugins README](.opencode/plugins/README.md)** - the OpenCode plugins and the hooks they call
- **[Pi Extensions README](.pi/extensions/README.md)** - the Pi extension entries and their real files
- **[DSH Bundle README](.dsh/plugins/repo-guards/README.md)** - the DeepSeek Harness guard bundle

**Reference**

- **[Release Notes](.skilled/changelog/skilled/)** - every Skilled release, one file per version
- **[Skills Index](.skilled/skills/README.txt)** - the skill library at a glance
- **[Spec Kit Feature Catalog](.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md)** - the Spec Kit's shipped features by area

# Skilled - Spec-Driven Agent Loops

[![GitHub Stars](https://img.shields.io/github/stars/MichelKerkmeester/skilled-agent-harness_spec-driven-loops?style=for-the-badge&logo=github&color=fce566&labelColor=222222)](https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops/stargazers)
[![License](https://img.shields.io/github/license/MichelKerkmeester/skilled-agent-harness_spec-driven-loops?style=for-the-badge&color=7bd88f&labelColor=222222)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/MichelKerkmeester/skilled-agent-harness_spec-driven-loops?style=for-the-badge&color=5ad4e6&labelColor=222222)](https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops/releases)

> Like it? [buymeacoffee.com/michelkerkmeester](https://buymeacoffee.com/michelkerkmeester)

&nbsp;

## 1. 📝 SUMMARY

**[Quick Start](#2--quick-start)** · [Overview](#overview) · [How It Works](#4--how-it-works) · [Workflows](#5--everyday-workflows) · [Skills](#6--skills) · [Hooks](#7--hooks-plugins-and-extensions) · [Agents](#8--agents) · [Commands](#9--commands) · [Runtimes](#10--runtimes-and-cli-bridges) · [Doctor](#11--doctor-commands) · [FAQ](#15--faq)

---

An assistant framework that gives your AI coding agent a memory, a paper trail and a team of specialists.

All of it lives inside your own repository, as files you can read and diff.

Built for Claude Code, Codex, OpenCode, Pi Agent, Devin, Cursor CLI, DeepSeek Harness and Mistral Vibe

**What's inside**

- **Gate System** - six gates check every request before the agent acts: prior context, the right skill, a spec folder and the repository rules
- **Spec Kit Framework** - spec folders with plans, tasks and a 42-rule validator, grouped into tracks, sub-tracks and phases
- **Continuity & Search** - progress saved into each spec folder and found again through a trigger index and ripgrep search, surviving resets and compactions
- **Session Handover** - near the context limit, the work moves to a fresh session with a handoff note
- **Skill Advisor** - routes every prompt to the right skill and workflow using 5-lane fusion and a live skill graph, so you never need to remember a command
- **Autonomous Deep Loops** - research and review loops that run unattended and stop only when their own evidence says done
- **CLI Orchestration** - hand work to another AI CLI on its own subscription, with any provider and model you have set up
- **14 On-Demand Skills** - seven parent hubs with 42 modes, plus standalone skills for specs, git, prompts and Orca
- **26 Shared Hooks** - session handover, goals, routing, quality checks, git and secret guards, running in all eight runtimes through one thin adapter each
- **11 Specialized Agents** - focused roles for implementation, review, research, docs, design and orchestration
- **17 Doctor Commands** - install Skilled in your own project, check the setup and keep it current
- **Code Mode MCP** - external MCP tools called through one TypeScript interface
- **Git Worktrees & Live Sync** - each session in its own worktree, with the main checkout following along

&nbsp;

## 2. 🚀 QUICK START

### Install

You need Node.js, npm, git and a POSIX shell. Use a patched Node release. The floors are 22.23.4, 24.22.1 and 26.12.1. Any newer release on those lines works. Code Mode is stricter and needs Node 24.22.1 or a newer 24.x, so Node 24 is the one line every part accepts.

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

### Check The Setup

Open the repository in any of the eight runtimes and run:

```
/doctor:setup
```

It checks the install without changing anything. Each failing check names one repair command. Run `/doctor:mcp install` to build and register Code Mode, which builds on its own.

### Use It In Your Own Project

Skilled does not have to live inside each project. You can bring it into a project in one of two ways.

**Link it.** Keep one Skilled checkout and link it into each project. One `git pull` in the checkout then updates every linked project. Your own changes live in the project's files, next to the links. This is the simpler choice. See [Link It Into Your Project](INSTALL-SKILLED.md#3-link-it-into-your-project).

**Copy it.** Commit a copy of Skilled into the project, so the whole team shares one pinned version. See [Copy It Into Your Project](INSTALL-SKILLED.md#4-copy-it-into-your-project).

A copy needs the overlay system. An update replaces the whole copy, so a change made straight in it would be lost. Instead, each of your changes lives in an overlay folder next to the copy, and the overlay engine applies it back after every update. The [overlay guard](#overlay-guard) refuses an edit to a file an overlay owns and names the overlay to edit instead.

Three commands run the overlays. `/doctor:overlay status` shows every overlay that is out of sync and how to fix it. `/doctor:overlay apply` puts the overlays back after showing what will change. `/doctor:overlay repin` moves the copy to a newer Skilled commit, with a backup it can roll back. The [overlay guide](.skilled/skills/system-skilled-doctor/references/overlays.md) explains each state.

The [system-skilled-doctor](#11--doctor-commands) skill runs all of this. Say "put Skilled into my project repo", or run `/doctor:install` for the ordered steps. Each step shows a plan before it writes and prints how to undo it.

### First Task

```
/speckit:complete Build a user authentication system
```

This creates a spec folder, plans the work, builds it and saves the session context as it goes. Add `:with-research` to research before planning. In a later session, `/speckit:resume` picks up where the last one stopped. On Codex, Cursor, Pi, DSH and Mistral Vibe, type `/speckit-complete` instead.

### Git Hooks

The repository ships versioned git hooks that check every commit and push in this checkout and its worktrees:

- **pre-commit** blocks code comments that cite spec ids and keeps generated files in step with what you stage
- **commit-msg** holds each message to the [commit template](.skilled/skills/sk-git/assets/commit-message-template.md): a conventional subject line, a body and no co-author lines
- **pre-push** blocks a push that deletes more than 100 tracked files, and asks before a push to a branch outside the sk-git allowlist

The session-start check installs any missing hook link in the main checkout while live sync is on, which is the default. It never installs from a linked worktree. `/doctor:git setup` checks the hooks and the sk-git settings. `/doctor:git hooks` switches a gate on or off, and `/doctor:git standards` changes the commit rules. A clone other than the one that installed the hooks runs their checks only after you mark it as trusted. The [git hooks README](.skilled/scripts/git-hooks/README.md) describes each gate and shows the trust setting.

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

Four more rules run after the work. The agent checks the final state, proves completion with fresh evidence, saves continuity through one writer and keeps the bound goal in view. Ten rule files hold those rules, and a router file at the repository root sends each action to the files it needs.

### Skill Routing

You never need to remember a skill name. The skill advisor scores each prompt and puts a one-line routing brief in front of the agent. At a confidence of 0.8 or more, the agent must load that skill.

The advisor is a resident daemon behind one command-line front door. It is not an MCP server. When the daemon is down, a local scorer answers instead and marks its answer stale. When no skill matches, the brief says so in one line. A setup or health prompt with no match gets a pointer to `/doctor:setup`. A hub skill can also name the command to type, with a policy that says whether to run it, start it or ask first. The [Skill Advisor README](.skilled/skills/system-skill-advisor/README.md) has the scoring and the CLI.

### Spec Folders

Every conversation that changes files gets a numbered folder in the specs tree, grouped by track. The depth of its documents scales with the task. There are four documentation levels (1, 2, 3 and 3+). Level 1 holds a spec, a plan, a task list and an implementation summary. Level 2 adds acceptance criteria, the closure gate. Each of its rows must be Met before the packet can close. A row marked Waived or Superseded also passes when it cites a decision record. Level 3 adds architecture sections and a decision record. Level 3+ adds governance for complex work.

Beside those documents, each folder keeps two small metadata files that the save step refreshes and a scratch folder for temporary work. The validator runs 42 rules against a folder and reports what fails.

Folders nest in a fixed way. A track is the top folder, usually named after the skill or system the work touches. As a track grows, it can hold one level of named sub-tracks that group its packets by theme. Each sub-track numbers its own packets from 001 and keeps its own archive for finished work. A sub-track is always a proposal the operator approves. One script suggests a grouping once a flat track reaches eight live packets. Another moves the packets and rewrites every stored path.

A large feature becomes a phase parent instead. The parent keeps only its spec and the two metadata files, and its spec maps the phases. Each phase is a numbered child folder with its own plan, tasks and summary. A series parent works the same way for separate small changes to one artifact, such as one script or one command. It starts at the second change, so the history of that artifact stays in one place.

The [Spec Kit README](.skilled/skills/system-spec-kit/README.md) shows the folder layout and covers the templates, the scripts and the validator.

### Continuity

The agent writes its progress into the spec folder it is working in. `/speckit:save` returns a save plan by default. Its full-auto mode writes the session summary, decisions and next steps. `/speckit:resume` reads them back in a fixed order: the handoff note, then the continuity block, then the spec docs.

Search stays plain on purpose. A committed trigger index matches the phrases authors declared, and ripgrep recipes cover free text. There is no database and no daemon on this path. A phrase nobody wrote returns a clean no-hit instead of a nearest guess.

After a compaction, a session can read back its own earlier turns with one read-only command. Your answers to the agent's questions are saved too, so the reason behind a choice lands in the packet's decision record.

### Handing Over A Long Session

A long session can hand its work to a fresh one before the context window fills. Near the limit, the session writes a handoff note and saves its spec folder. A small wrapper then starts the same runtime in the same terminal, and the new session claims the note. The running command, the goal, the model and the session name all carry over.

Handover is on by default for Claude Code and off elsewhere until you turn it on. The [Session Handover](#session-handover) hook below explains how to turn it on.

&nbsp;

## 5. 🔄 EVERYDAY WORKFLOWS

### You Just Ask

You do not need to remember any command. Describe the task in plain words and the session does the rest. On every prompt, the [skill advisor](#skill-advisor) reads the request and tells the agent which skill fits. When a workflow fits too, the brief names its command and how to take it: start it now, start it with its setup questions or offer it to you first.

The session automation covers the rest of the path. The [spec gate](#spec-gate) asks once which spec folder the work belongs to. The [session lifecycle](#session-lifecycle) hooks prime the context at start and save continuity at stop and compaction. Near the context limit, [session handover](#session-handover) carries the work into a fresh session.

The commands below are what runs underneath. Type one yourself only when you want a specific workflow or mode.

### Spec Kit Commands

`/speckit:complete` runs the whole path: intake, research, plan, build, verify and save. `/speckit:plan` stops after the plan, so someone can review it before any code is written. `/speckit:implement` builds from an existing plan. Each one accepts `:auto` to run without stopping or `:confirm` to pause at each step.

`/speckit:save` plans a continuity save and writes it in full-auto mode. `/speckit:resume` restores it in a new session. `/speckit:search` runs the trigger index and the ripgrep recipes over spec docs and skill docs. `/speckit:handoff` hands the work to a fresh session now, instead of waiting for the context limit.

### Deep Research And Deep Review

The deep loops run unattended and stop only when their own evidence says the work is done. `/deep:research` investigates a question one focused pass at a time. Results grow in one research document inside the spec folder. `/deep:review` audits code in passes, ranks every finding P0, P1 or P2 and never edits the code it reviews.

Each pass runs in a fresh context against state kept on disk. A script, not the agent, decides when to stop. A review stays open while a P0 is active or a required check still fails, and it ends in a PASS, CONDITIONAL or FAIL verdict. A loop survives crashes and new sessions, because its progress lives in files.

A loop can also spread across several AI CLIs at once. Each executor runs its own lineage, and for a review the strictest verdict wins the merge. A pool caps how many lineages run at once. A stall watchdog stops a lineage that stops making progress, and a cost cap bounds what each one spends. The [Deep Loop README](.skilled/skills/system-deep-loop/README.md) describes both modes and the shared runtime.

### CLI Orchestration

Your main CLI does not have to do every task itself. The CLI orchestration hub hands a task to another AI CLI on the same machine and reads the result back. The agent you are talking to stays in charge. It writes the brief, waits for the answer and checks it before using it.

This lets you mix subscriptions. You can stay in Claude Code or Codex on that plan and send research, reviews or bulk work to a cheaper model through another CLI. The bridges are provider agnostic. Each CLI runs whatever providers and models you have set up in it, so you match the bridge to the subscriptions you already pay for. That is why Skilled supports eight runtimes: whichever plans you have, one of them is your main CLI and the others take the work you hand off. Each dispatch is billed to that CLI's own plan, not to your main one.

You ask for it in plain words, for example "use cli-opencode to review this diff". The advisor routes the request to the matching bridge. The bridge checks that its CLI is installed and that the dispatch passes its hard rules, then runs it. The deep loops use the same bridges, so one research or review run can spread its passes across several models. [Runtimes And CLI Bridges](#10--runtimes-and-cli-bridges) lists all eight.

### Create And Update Skills, Agents And Commands

Extending Skilled follows the same framework that built it. The [sk-doc](.skilled/skills/sk-doc/README.md) hub holds a template, a set of standards and a validator for each kind of component. Ask for a new skill, agent or command in plain words and the advisor loads the matching sk-doc mode, so the result matches the rest of the repository.

Each kind also has a `/create` command for when you want the workflow directly. `/create:sk-skill` creates or updates a skill, and `/create:skill-parent` scaffolds a parent hub with its modes. `/create:agent` and `/create:command` do the same for agents and slash commands. `/create:readme`, `/create:changelog`, `/create:goal` and `/create:repo-rule` cover the documents around them. Every one runs with `:auto` or with `:confirm` to pause at each step.

Updating works the same way as creating. Name the component and the change, and the workflow edits it in place, checks it against its template and runs the sk-doc validator. A new skill needs no registration step, because the advisor finds it from its own metadata.

&nbsp;

## 6. 🧰 SKILLS

Fourteen skills ship with Skilled. Gate 2 loads one when the advisor matches it to a task. Seven of them are parent hubs. A hub holds several modes and routes each request to the mode that fits, 42 modes in all. The other seven skills work on their own.

### Parent Hubs

**[sk-code](.skilled/skills/sk-code/README.md)** writes, reviews and verifies code in the stack you are in. Its five modes are quality, for the checks after implementation, and review, for findings-first code review. CI covers GitHub Actions workflows and frontend covers CSS, HTML and browser work. The skilled mode holds the standards for this repository's own TypeScript, Python, shell and config code.

**[sk-doc](.skilled/skills/sk-doc/README.md)** authors documentation and components. Its fifteen modes create skills, parent hubs, READMEs, agents, commands, feature catalogs, manual testing playbooks, benchmarks, changelogs, diffs, frontmatter, repo rules and goals. Two more run quality control and apply the human voice rules.

**[sk-design](.skilled/skills/sk-design/SKILL.md)** turns one design identity into an artifact. Its three modes extract a measured style reference from a live site, draw a diagram and build a chart.

**[system-deep-loop](.skilled/skills/system-deep-loop/README.md)** runs the autonomous loops over one shared runtime. Its two modes are deep research and deep review.

**[cli-external-orchestration](.skilled/skills/cli-external-orchestration/README.md)** hands work to another AI CLI. Its eight modes are bridges to OpenCode, Claude Code, Codex, Cursor, Devin, Pi, DeepSeek Harness and Mistral Vibe.

**[cli-classifier](.skilled/skills/cli-classifier/README.md)** asks a hosted classifier for typed judgments. It has one mode today, the Jev transport, and future classifiers join as new modes.

**[mcp-tooling](.skilled/skills/mcp-tooling/README.md)** bridges outside tools through Code Mode. Its eight modes cover Chrome DevTools, ClickUp, the Aside browser, Notion and Obsidian. Three more are read-only design sources: Figma, Refero and Mobbin.

### Standalone Skills

**[system-spec-kit](.skilled/skills/system-spec-kit/README.md)** owns spec folders, documentation levels, the validator, continuity and lexical search. Every file change goes through it.

**[system-skill-advisor](.skilled/skills/system-skill-advisor/README.md)** routes each prompt to the skill that fits, through a daemon-backed CLI.

**[system-skilled-doctor](.skilled/skills/system-skilled-doctor/README.md)** gets Skilled into your own project and keeps it working there. It owns eleven doctor commands for installing, linking, updating and checking a project, including the overlays that carry a copied project's own changes through each update.

**[sk-git](.skilled/skills/sk-git/README.md)** handles worktrees, conventional commits, pull requests and finishing a branch.

**[sk-prompt](.skilled/skills/sk-prompt/README.md)** turns a rough request into a structured, checked prompt.

**[cli-orca](.skilled/skills/cli-orca/README.md)** drives the Orca app's worktrees, terminals, browser and automations.

**[mcp-code-mode](.skilled/skills/mcp-code-mode/README.md)** calls external MCP tools through one TypeScript interface.

Only `sk-code` carries stack-specific patterns, so start there when you adapt Skilled to your own stack. The [sk-code README](.skilled/skills/sk-code/README.md#4-adapting-to-your-stack) walks through it, and `/doctor:sk-code setup` checks the result. Add a skill of your own with `/create:sk-skill`, and the advisor finds it from its metadata.

&nbsp;

## 7. 🧩 HOOKS, PLUGINS AND EXTENSIONS

Skilled enforces its rules through hooks that each runtime calls at fixed moments: at session start, on each prompt, around each tool call and at session end. Every hook has one home folder in the shared hook library, with its policy and a README. Each runtime reaches it through a thin adapter in that runtime's own folder, and the [Runtimes](#10--runtimes-and-cli-bridges) table shows where each one loads them.

A few hooks keep their code with the skill that owns the logic and link into that folder. The spec gate and the session-lifecycle adapters live in the Spec Kit skill. The git message gate and preflight live in sk-git. The session-start git checks are shared scripts. A shared helpers folder holds what every hook uses: the off-switch resolver, the input readers and the session readers.

Runtime support is uneven on purpose, because each runtime exposes different events. The [hooks README](.skilled/hooks/README.md) holds the full coverage matrix and every off switch. Each hook has its own off switch, and one master switch turns them all off except the git message gate. [Off Switches](#off-switches) names the few you are likely to set.

The hooks below are grouped by purpose. Each entry says what the hook does and links the README that holds its runtimes, switches and code.

### Sessions And Continuity

These hooks carry context, goals and decisions from one session to the next.

#### Session Handover

Near the context limit, this hook asks the session to write a handoff note and arms a record for the next one. The skilled-loop wrapper then starts a fresh session in the same terminal, and that session claims the note. Started without the wrapper, Claude Code keeps the note and returns to it after its own auto-compaction.

To start every runtime under the wrapper, add the wrapper to your shell profile. The session handover README shows the line.

The note carries what the next session needs. It holds the goal and what is left. It also names the running command with its mode and arguments. The model, effort, launch flags and session name carry over too. The hop waits for the session's background tasks, and your next prompt calls off a hop that is still waiting.

Handover is on by default for Claude Code only. You can turn it on for every runtime at once or for one runtime at a time, and a runtime's own setting wins. One off switch beats every on setting. While handover is off for a runtime, `/speckit:handoff` refuses there and the runtime's own compaction handles a full window.

Read more in the [session handover README](.skilled/hooks/session-handover/README.md).

#### Goal

A spec folder can hold a goal file with the directive and the criteria that decide when the work is done. This hook binds a session to that file and injects a short slice of it, so the goal survives context resets. `/create:goal` writes the file. Claude Code and Codex use their own `/goal` command instead, and the spec workflows hand you the slice to paste. OpenCode manages the goal with `/goal-opencode`, Pi with `/goal-pi` and DSH with `/goal-dsh`.

Read more in the [goal hook README](.skilled/hooks/goal/README.md).

#### Session Lifecycle

At session start, this hook primes the session with the continuity of its spec folder. At stop it saves a checkpoint, and after a compaction it restores the context the summary dropped.

Read more in the [session lifecycle README](.skilled/hooks/session-lifecycle/README.md).

#### Decision Capture

Each answer you give to the agent's question tool is queued as you give it. The next full-auto `/speckit:save` writes it into the packet's decision record, with the question, the options and your answer word for word. Questions about process, such as which spec folder to use, are left out.

Read more in the [decision capture README](.skilled/hooks/decision-capture/README.md).

#### Session Cleanup

This hook runs bounded checks at startup and cleans up at teardown. It stops only MCP helper processes it can prove the session started.

Read more in the [session cleanup README](.skilled/hooks/session-cleanup/README.md).

&nbsp;

### Routing And Dispatch

These hooks send each request, tool call and question down the right path.

#### Skill Advisor

On each prompt, this hook puts the skill advisor's one-line routing brief in front of the agent. It advises only. When the advisor cannot answer, the brief says why in one line and the prompt goes through.

Read more in the [skill advisor README](.skilled/hooks/skill-advisor/README.md).

#### CLI Dispatch

Before the agent runs a composed CLI dispatch, a preflight lint checks it against the bridge's hard rules. A broken rule stops the call. After the call, an audit trail records it as one JSON line.

Read more in the [CLI dispatch README](.skilled/hooks/cli-dispatch/README.md).

#### MCP Route Guard

When the agent calls an external MCP tool directly, this hook adds an advisory that the call should go through Code Mode instead.

Read more in the [MCP route guard README](.skilled/hooks/mcp-route-guard/README.md).

#### Subagent Dispatch Guard

Before the agent hands a task to a subagent, this guard checks for a deep loop that repeats itself. On Claude Code it also applies the model policy for subagents.

Read more in the [subagent dispatch guard README](.skilled/hooks/subagent-dispatch-guard/README.md).

#### Ask Surface Guard

A turn that ends in a typed menu of options gets sent back once. The agent then asks the same question through the runtime's question tool, where you can pick an answer. On Codex and Devin it warns instead of sending the turn back.

Read more in the [ask surface guard README](.skilled/hooks/ask-surface-guard/README.md).

#### Directive Lifecycle

The skill advisor repeats a few fixed directives. This hook tracks which ones a session already received, so they appear once per startup or compaction instead of on every turn.

Read more in the [directive lifecycle README](.skilled/hooks/directive-lifecycle/README.md).

&nbsp;

### Quality And Evidence

These hooks ask for a spec folder, check each edit and hold the agent to its proof.

#### Spec Gate

Before the first file change of a session, this hook asks which spec folder the work belongs to and remembers the answer. It advises by default. An opt-in switch turns the question into a hard stop, and Mistral Vibe always enforces it.

Read more in the [spec gate README](.skilled/hooks/spec-gate/README.md).

#### Completion Evidence

This hook fires when the agent claims a task is done. It looks for the proof behind the claim and names what is missing. It advises and never blocks.

Read more in the [completion evidence README](.skilled/hooks/completion-evidence/README.md).

#### Post-Edit Quality

After every write or edit, this hook runs the comment-hygiene check, the dist-staleness check and related checks on the changed file. It reports what it finds next to the edit.

Read more in the [post-edit quality README](.skilled/hooks/post-edit-quality/README.md).

#### Dist Freshness

Several hooks run compiled scripts from a build folder. This hook detects a build that is older than its TypeScript sources and rebuilds it, so a hook never runs stale code.

Read more in the [dist freshness README](.skilled/hooks/dist-freshness/README.md).

#### Codex Global Hooks Check

At session start, this check confirms that Codex's user-global hook file holds no copy of this repository's hooks. A stale copy there would run the hooks twice in every Codex session.

Read more in the [Codex global hooks check README](.skilled/hooks/codex-global-hooks-check/README.md).

&nbsp;

### Git

These hooks keep the git history clean and the main checkout current. Four of them run at session start.

#### Git Live Follow

At session start, this hook starts a follower that fast-forwards your main checkout to the shared live branch as new commits land. Your editor then shows the combined work of every session. It is one half of [live sync](#13--git-worktrees-and-live-sync).

Read more in the [git live follow README](.skilled/hooks/git-live-follow/README.md).

#### Git Primary Reconcile

At session start, this hook brings the main checkout back onto its live branch. It fast-forwards when the checkout is behind and publishes local commits when it is ahead. It is the other half of live sync.

Read more in the [git primary reconcile README](.skilled/hooks/git-primary-reconcile/README.md).

#### Git Worktree Guard

At session start, this guard warns when a top-level session runs on the shared checkout instead of its own worktree. Parallel sessions on one checkout step on each other's changes.

Read more in the [git worktree guard README](.skilled/hooks/git-worktree-guard/README.md).

#### Git Message Gate

Before a commit, a pull request or a new branch, this gate checks the message, description or branch name against the sk-git templates. It refuses one that breaks them. It has no off switch, because the rules carry no bypass. Change a rule with `/doctor:git standards` instead.

Read more in the [git message gate README](.skilled/hooks/git-message-gate/README.md).

#### Git Preflight

Before a git command runs, this hook checks it against the sk-git hard rules and prints one line about any behavior that tends to surprise. It never blocks.

Read more in the [git preflight README](.skilled/hooks/git-preflight/README.md).

#### Git Hooks Check

At session start, this check confirms that the repository's versioned git hooks are installed and current. In the main checkout with live sync on, it installs a missing hook link itself. It prints a warning and never blocks a session.

Read more in the [git hooks check README](.skilled/hooks/git-hooks-check/README.md).

&nbsp;

### Safety And Secrets

These hooks keep secrets, vendored files and untrusted web text in check.

#### Env Secret Guard

The agent may not read or write a dotenv file, because that would send every secret in it to the model. The guard refuses the call, undoes a dotenv write a shell command made anyway and watches command output for a dotenv value. In place of the file, it lists key names, reports parse errors and fingerprints a value.

Read more in the [env secret guard README](.skilled/hooks/env-secret-guard/README.md).

#### Overlay Guard

A project that commits a copy of Skilled keeps its own changes in overlay files. This guard refuses an edit to a file an overlay owns and names the overlay file to edit instead, so the next update does not wipe the change.

Read more in the [overlay guard README](.skilled/hooks/overlay-guard/README.md).

#### Classifier Injection Screen

After the agent fetches a web page, this hook asks the Jev classifier whether the text holds instructions aimed at an AI agent. When a section does, it adds one advisory line. It runs only once a Jev key is stored, and it never blocks.

Read more in the [classifier injection screen README](.skilled/hooks/classifier-injection-screen/README.md).

#### Permission Policy

Devin asks for permission before some tool calls. This hook answers that request with allow or deny, from the same spec-gate and dispatch rules the other hooks use. Anything it cannot classify is denied.

Read more in the [permission policy README](.skilled/hooks/permission-policy/README.md).

&nbsp;

### Runtime-Only Hooks

A few hooks exist for one runtime only, because they answer an event the others lack.

#### Fable Subagent Guard (Claude Code)

When the main Claude Code session runs on a Fable model, this guard denies a subagent dispatch that would inherit that model. Only an explicit Opus or Sonnet override passes. It belongs to the subagent dispatch guard above.

Built from the [subagent dispatch guard](.skilled/hooks/subagent-dispatch-guard/README.md).

#### Session Prime (Claude Code)

At session start, this script injects the continuity of the active spec folder into a Claude Code session. Mistral Vibe's session-start hook reuses it.

Built from [system-spec-kit](.skilled/skills/system-spec-kit/README.md).

#### Handover Subagent Guard (Claude Code)

A subagent shares its parent's session id, so a handover command run inside one would act on the parent's handoff note. This guard refuses that command and leaves the note to the parent.

Built from the [session handover hook](.skilled/hooks/session-handover/README.md).

#### Handover Prompt Seed (Codex)

On each Codex prompt, this hook adds the claim instructions to a handover seed prompt, or the context nudge as the session nears its limit.

Built from the [session handover hook](.skilled/hooks/session-handover/README.md).

#### Spec Gate Prebind (Cursor)

Cursor's CLI delivers no prompt-classification event, so this hook sets up the spec gate's state at session start. When the session starts with a valid spec folder already named in its environment, that counts as the Gate 3 answer.

Built from [system-spec-kit](.skilled/skills/system-spec-kit/README.md).

#### Post-Compaction Recovery (Devin)

Devin fires its compaction event after the summary is written, with no transcript. This hook keeps the summary and restores the spec folder's continuity from disk. Devin's permission request hook is the [permission policy](#permission-policy) above.

Built from [system-spec-kit](.skilled/skills/system-spec-kit/README.md).

&nbsp;

### Pi Extension Packages

Pi loads two extension packages from this repository and eight from outside it. They add features, not policy.

#### Pi Cache Optimizer

A Pi extension package that raises provider prompt-cache hit rates. It moves stable prompt content ahead of the parts that change, adds a careful cache-key fallback for OpenAI-compatible providers and shows cache statistics in the footer. It also stops a paid retry loop when a whole batch of tool calls keeps failing. It is a fork of the upstream pi-cache-optimizer project under the MIT license, and the copy in this repository is the live source.

Read more in the [Pi cache optimizer README](.pi/extensions/pi-cache-optimizer/README.md).

#### Fast Mode With Subagent Support

A Pi extension package that adds a Fast Mode toggle for OpenAI GPT-5.4 through GPT-6 models. It sends OpenAI's priority service tier on matching requests and passes the setting on to subagents. `/fast` switches it, and a startup flag turns it on.

Read more in the [Pi fast mode README](.pi/extensions/pi-fast-mode-w-subagent-support/README.md).

#### Community Packages

Pi also loads eight community packages that its settings file lists, among them a question tool, a todo list, a status line, web access and a plan and build mode. They come from npm or GitHub, not from this repository. The [Pi extensions README](.pi/extensions/README.md) maps every Skilled hook entry to its real file.

&nbsp;

## 8. 🤖 AGENTS

Eleven agents own focused roles. Their source lives in the shared agents folder, which OpenCode links to. Codex, Pi, DSH and Mistral Vibe carry copies generated from it. Claude Code keeps its own hand-carried copy, and Cursor and Devin link to that copy.

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

Forty-four commands ship in six groups in the [commands folder](.skilled/commands/). Each one is a Markdown file, and most hand their steps to a YAML workflow beside it.

**Spec Kit (8).** `/speckit:complete`, `/speckit:plan`, `/speckit:implement`, `/speckit:resume`, `/speckit:save`, `/speckit:search`, `/speckit:handoff` and `/speckit:ai-council`. These run the spec workflow and its continuity, as [Everyday Workflows](#5--everyday-workflows) describes.

**Create (13).** `/create:sk-skill`, `/create:skill-parent`, `/create:agent`, `/create:command`, `/create:readme`, `/create:changelog`, `/create:feature-catalog`, `/create:manual-testing-playbook`, `/create:goal`, `/create:benchmark`, `/create:diff`, `/create:repo-rule` and `/create:with-human-voice`. These scaffold or revise one kind of artifact to the sk-doc standards.

**Deep (2).** `/deep:research` and `/deep:review` run the autonomous loops.

**Design (3).** `/design:extract` measures a live site into a style reference. `/design:chart` builds a standalone HTML chart, and `/design:diagram` draws an HTML and SVG diagram.

**Prompt (1).** `/prompt:improve` turns a rough prompt into a structured one.

**Doctor (17).** Health checks and repairs, listed under [Doctor Commands](#11--doctor-commands).

Some runtimes add a goal command of their own: `/goal-opencode`, `/goal-cursor` and `/goal-pi`. DSH registers `/goal-dsh` from its plugin.

&nbsp;

## 10. 🔌 RUNTIMES AND CLI BRIDGES

Skilled runs in eight AI runtimes, so you can work from the subscriptions you already have and hand work between them. Each one keeps its own folder and loads the hooks its own way:

| Runtime | Folder | Commands look like | Hooks load through |
| --- | --- | --- | --- |
| Claude Code | `.claude/` | `/speckit:complete` | its settings file |
| Codex | `.codex/` | `/speckit-complete` | its hooks file |
| Cursor | `.cursor/` | `/speckit-complete` | its hooks file |
| Devin | `.devin/` | skills as slash commands, such as `/system-spec-kit` | its hooks file |
| OpenCode | `.opencode/` | `/speckit:complete` | one plugin per hook |
| Pi | `.pi/` | `/speckit-complete` | one extension per hook |
| DeepSeek Harness (DSH) | `.dsh/` | `/speckit-complete` | one guard plugin bundle |
| Mistral Vibe | `.vibe/` | `/speckit-complete` | its hooks file |

Each runtime folder is mostly generated from one shared source. Its README says which files are generated and which are authored there: [Claude Code](.claude/README.md), [Codex](.codex/README.md), [Cursor](.cursor/README.md), [Devin](.devin/README.md), [OpenCode](.opencode/README.md), [Pi](.pi/README.md) and [DeepSeek Harness](.dsh/README.md). Mistral Vibe keeps the same notes in its [sync notes](.vibe/SYNC.md).

The eight runtimes share one source tree. Skills, agents, commands and hooks live there once, and a generator writes each runtime's copy. `/doctor:runtime-mirrors` checks that every copy still matches. Claude Code and OpenCode spell commands with a colon, as in `/speckit:complete`. Codex, Cursor, Pi, DSH and Mistral Vibe use a hyphen, as in `/speckit-complete`. Devin shows each skill as a slash command, so it reaches the spec workflow through `/system-spec-kit`.

A few runtimes need one step of their own. Codex runs a repository hook only after you approve that entry, so open `/hooks` after an update and approve each entry it lists. Mistral Vibe loads its hooks only in a trusted checkout. DSH loads plugins only from the patches a run names, and a guards patch loads the guard bundle. OpenCode loads the same plugins on OpenCode 2 and OpenCode 1.

The CLI orchestration hub carries eight bridges, one each for OpenCode, Claude Code, Codex, Cursor, Devin, Pi, DeepSeek Harness and Mistral Vibe. A bridge lets one runtime hand a task to another AI CLI and read back the result. The calling agent stays in charge. Each bridge checks that its CLI is installed and checks the dispatch against its own hard rules before it runs.

Six bridges refuse to dispatch the runtime they run in. The Pi and DeepSeek Harness bridges may call their own runtime, but neither dispatches from inside a fan-out lineage or a dispatch that already uses it. That bound keeps delegation from looping. The DeepSeek Harness and Mistral Vibe bridges are experimental. All eight also work as deep-loop executors, so one research or review run can bind several of them.

&nbsp;

## 11. 🩺 DOCTOR COMMANDS

Seventeen doctor commands check and repair the setup, one area each. Eleven belong to the `system-skilled-doctor` skill, which owns everything about Skilled inside a project. The rest sit with the skill they check, such as `/doctor:git` with sk-git. Every target that writes shows its plan and waits for your yes. `/doctor:helper` names the command that fits a problem you describe, and you can also just describe the problem in chat. The [system-skilled-doctor README](.skilled/skills/system-skilled-doctor/README.md) has the details.

| Command | What it does |
| --- | --- |
| `/doctor:setup` | Runs the read-only setup checks and names one repair for each failing check |
| `/doctor:helper` | Ranks the doctor commands against a problem in your own words |
| `/doctor:install` | Prints the ordered steps that install Skilled in your own project |
| `/doctor:symlink` | Checks, links or unlinks a Skilled checkout in another project |
| `/doctor:overlay` | Checks a vendored copy's overlays, puts them back or moves the copy to a newer commit |
| `/doctor:update` | Checks, applies or rolls back a new Skilled release |
| `/doctor:agents-md` | Checks your root AGENTS.md against the shipped template, then embeds or restores it |
| `/doctor:runtime-mirrors` | Checks that each runtime folder still matches the shared source |
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

Code Mode is the only MCP server Skilled registers. Its seven tools find tools, describe one, list them all, run a chain of calls, add or remove a provider and name the keys a tool needs. A provider config file declares 14 external providers. Their keys live in a dotenv file that only Code Mode reads.

`/doctor:mcp install` builds Code Mode and registers it in seven project config files for six runtimes: OpenCode, Claude Code (two files), Codex, Cursor, Pi and Devin. Each write waits for its own approval. DSH loads Code Mode from a hand-written patch, and Mistral Vibe has no Code Mode registration. `/doctor:mcp debug` reports PASS, WARN or FAIL per check, and its fix mode adds guided repair.

A call runs TypeScript against the registered tools, and one chain can call several tools in a single round trip. The [Code Mode README](.skilled/skills/mcp-code-mode/README.md) shows example calls and how each tool is named.

&nbsp;

## 13. 🌿 GIT WORKTREES AND LIVE SYNC

Each session can work in its own git worktree, so parallel sessions never edit the same files. sk-git creates numbered worktrees and provisions them, so dependencies install and the Spec Kit builds before the first task.

Live sync keeps your main checkout current. A session started through the launch wrapper publishes each commit to a shared live branch. At session start, the [live-follow](#git-live-follow) and [primary-reconcile](#git-primary-reconcile) hooks keep the main checkout on that branch. Your editor then shows every session's committed work in one place.

Live sync is on by default in the main checkout. One switch turns the whole loop off, and two more turn off one part each. [Off Switches](#off-switches) names the main one. The [continuous integration reference](.skilled/skills/sk-git/references/continuous-integration.md) describes the full model.

&nbsp;

## 14. 🔧 CONFIGURATION AND PRIVACY

### Core Files

[AGENTS.md](AGENTS.md) holds the gates and behavior rules for every runtime. Claude Code and Codex read it directly, so there is no separate Claude instruction file. OpenCode keeps its permissions and its Code Mode binding in its own config file. Code Mode reads its providers from one provider config file.

### Environment Settings

Every setting has a working default, so you can start without setting anything. The [environment example](.env.example) lists every setting the code reads, with its default and purpose. The [hook switch example](.skilled/hooks/hook-flags.env.example) lists the switches that can also live in a file.

Set a value as an export in your shell profile, which wins over everything else. Or copy the hook switch example to a personal switch file beside it, which git ignores. Claude Code also reads the env block of its local settings file. `/doctor:env` shows each setting by name and never by value. It saves a change only after you approve the exact line.

### Off Switches

The AI hooks, the validators, the git hooks and the CI workflows all have off switches. Most people only ever set a few of them:

- **`SYSTEM_HOOKS_DISABLED=1`** turns off every AI hook except the git message gate
- **`SYSTEM_SESSION_HANDOVER_ENABLED=1`** turns session handover on for every runtime
- **`SYSTEM_LIVE_SYNC_DISABLED=1`** turns off live sync
- **`SPECKIT_SKIP_VALIDATION=1`** switches off spec folder validation. A skipped run says so, so it proves nothing about a document

Each hook also has its own switch, and the [hooks README](.skilled/hooks/README.md) lists them all with their defaults. CI workflows read repository variables, and `/doctor:ci report` shows their state.

For the git hooks, each blocking gate names its one-time bypass in its message. `/doctor:git hooks` switches a gate off until you switch it back on. To remove the git hooks entirely, run the uninstall step in the [git hooks README](.skilled/scripts/git-hooks/README.md), then turn off the session check so it does not install them again.

### What Stays On Your Machine

Continuity stays local. Spec folders, the trigger index and the ripgrep search are files in your own repository, and no service reads them.

That guarantee covers continuity, not every feature. Your AI runtime sends your prompts and the files it reads to its model provider. A CLI bridge sends the task to the CLI it calls. A Code Mode tool talks to its external service, and the Jev screen sends fetched text to the hosted classifier once a key is stored. Check each provider's terms before you use it on private code.

&nbsp;

## 15. ❓ FAQ

### Must all 14 skills be installed?

No. Gate 2 loads a skill only when a task needs it. The MCP and CLI skills need their own tools or keys before they can run.

### What happens if I skip the spec folder?

Gate 3 waits for an answer before the first file change. Option D skips it, but that work leaves no record for `/speckit:resume` or `/speckit:search` to find. A fix of a few characters in one file does not trigger the gate.

### What happens when a session runs out of context?

On Claude Code, the session hands over to a fresh one under the skilled-loop wrapper. Without the wrapper, it keeps a handoff note it returns to after auto-compaction. Other runtimes fall back to their own compaction until you turn handover on.

### Can I use Skilled without the continuity features?

Yes. Spec folders, the gates, the agents and the skills all work without `/speckit:save`. You lose cross-session recovery.

### How can I add a skill or an agent?

Run `/create:sk-skill` for a skill. The advisor finds it from its own metadata, with no registration step. Run `/create:agent` for an agent, which writes the source file and the Claude Code copy.

### How can I keep Skilled current after a new release?

Run `/doctor:update check` to see what a release changes, then `/doctor:update apply` to bring it in after your yes. It can roll the update back. A project that commits a copy of Skilled moves it with `/doctor:overlay repin` instead, which puts your overlays back on the new copy. Afterwards, `/doctor:runtime-mirrors` checks that every runtime folder still matches the shared source, and `/doctor:setup` runs the full health check.

### Why is the skill advisor not an MCP server?

It runs as a resident daemon behind one command-line front door, so every runtime can call it the same way from a hook. Code Mode is the only MCP server Skilled registers.

&nbsp;

## 16. 📚 RELATED DOCUMENTS

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

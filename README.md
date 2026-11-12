# Skilled - Spec-Driven Agent Loops

[![GitHub Stars](https://img.shields.io/github/stars/MichelKerkmeester/skilled-agent-harness_spec-driven-loops?style=for-the-badge&logo=github&color=fce566&labelColor=222222)](https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops/stargazers)
[![License](https://img.shields.io/github/license/MichelKerkmeester/skilled-agent-harness_spec-driven-loops?style=for-the-badge&color=7bd88f&labelColor=222222)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/MichelKerkmeester/skilled-agent-harness_spec-driven-loops?style=for-the-badge&color=5ad4e6&labelColor=222222)](https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops/releases)

> Like it? [buymeacoffee.com/michelkerkmeester](https://buymeacoffee.com/michelkerkmeester)

&nbsp;

## 1. 📝 SUMMARY
An assistant framework that gives your AI coding agent a memory, a paper trail and a team of specialists.

All of it lives inside your own repository, as files you can read and diff.

Built for Claude Code, Codex, OpenCode, Pi Agent, Devin and Cursor CLI

**What's inside**

- **Spec Kit Framework** - structured plans, task tracking, validation gates and handover docs
- **Spec Memory & Search** - session context saved into each spec folder and recovered through instant keyword search, surviving resets and compactions
- **Skill Advisor Daemon** - dynamic prompt-time skill suggestions using 5-lane fusion and a live skill graph
- **Autonomous Deep Loops** - research and review loops that run unattended and stop only when their own evidence says done
- **11 Specialized Agents** - focused roles for implementation, review, research, docs, git and more
- **14 On-Demand Skills** - deep capabilities for code, design, docs, multi-CLI dispatch and installing Skilled in your own projects

&nbsp;

## 2. 🎁 WHAT YOU GET

### 📋 Spec Kit

Every file change gets a spec folder that records what changed, why and how. Like a lab notebook for software.

Documentation depth scales with the task, from a small fix to a phased architecture change. Mandatory gates run before file changes and after execution, so "done" needs fresh evidence, not the agent's say-so. Reviews rank findings P0/P1/P2 and re-challenge critical findings before they stick. An open blocker forces another pass.

Every packet is plain markdown in your repo, so the history is yours to read, diff and keep.

&nbsp;

### 🧠 Spec Memory & Search

Your architecture, decisions and session history are written into the spec folder they belong to. Instant keyword search finds them again.

`/speckit:resume` reads the packet's own continuity files and picks up where the last session stopped. A committed trigger index plus ripgrep recipes find prior work fast, with no database and no daemon on this path. A phrase nobody wrote is a clean no-hit, never a nearest guess.

After a compaction, a session can search and load its own earlier turns through one read-only command. A detail the summary dropped is not lost. Your answers to the AI's questions are captured as you give them. They are saved into the packet's decision record, with the exact exchange beside each one.

&nbsp;

### 🔄 Deep Loop

Research and review loops run unattended and stop only when their own evidence says done.

Progress lives on disk, so a loop survives crashes, new sessions and long runs. One shared runtime sits under every loop, so you learn the workflow once. Run fully hands-off or pause at each step, your choice.

&nbsp;

### 🎯 Skill Advisor

Type a prompt and the matching expertise loads before any tool runs. No memorizing skill names.

A resident daemon scores your prompt across five signal lanes and renders its pick as a one-line route. A live skill graph tracks what each skill depends on, enhances and conflicts with. Daemon down? A local scorer answers instead and marks itself stale rather than pretending to be live.

&nbsp;

### 🤖 Agent Library

Eleven specialized agents own focused roles. Seven CLI bridges let a runtime dispatch other AI CLIs as sub-tools, including the experimental DeepSeek Harness target.

A review can fan out across several models at once, with the safest verdict winning. The conducting AI stays in charge. Each dispatched CLI handles the part it is best at and returns.

The six bridges for repository-opening runtimes refuse self-dispatch except `cli-pi`. The experimental dsh target is a separate run surface, for a headless dispatch or an interactive session such as `dsh web`. Fan-out lineages and dispatch stacks are bounded, so delegation never loops.

&nbsp;

### 🧩 Plugin & Extension Library

The framework extends each runtime through plugins, hooks and extensions rather than asking you to wire anything by hand.

- **Goal Plugin:** binds a session to a spec packet's `goal.md`. On every turn (at session start on Cursor) it injects a pointer to that file plus its completion criteria, so intent survives context resets instead of fading with the window
- **In-Session Handover:** off by default. Once turned on, a session near its context limit hands its work to a fresh session in the same terminal. See [In-Session Handover](#in-session-handover)
- **`pi-cache-optimizer` ("Cache Pi"):** our custom Pi extension package that keeps Pi-side context costs down across dispatches. `pi-fast-mode-w-subagent-support` sits beside it for fast mode with subagent support
- **Plus the rest of the extension surface:** spec-gate enforcement, skill-advisor prompt briefs, a guard that keeps dotenv secrets out of the model, post-edit quality checks, session lifecycle and cleanup, MCP route guards and git preflight advisories. These are thin runtime adapters over shared policy cores in `.skilled/hooks/`

Behind them: 14 on-demand skills, 45 command entry points and the Code Mode MCP server, each detailed in its own section below.

&nbsp;

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
         │  Every file change needs documentation    │
         │                                          │
         │  Gate 4: Workflow tiebreakers             │
         │  Gate 5: Repo rules load (HARD BLOCK)    │
         │  Gate 6: Reply rules load (HARD BLOCK)   │
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

## 4. 🚀 QUICK START

### Install

You need Node.js 24, `npm`, `git` and a POSIX shell. The [install guide](INSTALL-SKILLED.md#2-install-a-skilled-checkout) walks through every step, Code Mode included. These commands clone the repository and build the two parts the runtimes load:

```bash
git clone https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops.git
cd skilled-agent-harness_spec-driven-loops

# Spec Kit: the runtimes' session hooks load this build
npm --prefix .skilled/skills/system-spec-kit install
npm --prefix .skilled/skills/system-spec-kit run build

# Skill Advisor: build it after the Spec Kit, then check its CLI
npm --prefix .skilled/skills/system-skill-advisor/runtime install
npm --prefix .skilled/skills/system-skill-advisor/runtime run build
node .skilled/bin/skill-advisor.cjs list-tools --format json
```

&nbsp;

### Check The Setup

Open the repository in any of the six runtimes: OpenCode, Claude Code, Codex, Cursor, Devin or Pi. Then run:

```
/doctor:setup
```

It checks the install without changing anything and names one repair command for each failure. Code Mode builds separately, and `/doctor:mcp install` builds and registers it for you.

&nbsp;

### Use It In Your Own Project

You can also use Skilled in your own projects. Link this checkout into a project, or commit a copy and keep your changes as overlays. The [install guide](INSTALL-SKILLED.md) walks through both.

&nbsp;

### First Task

```
/speckit:complete Build a user authentication system
```

This creates a spec folder, plans the work, builds it and saves the session context into the folder as it goes. Add `:with-research` to research before planning. In a later session, `/speckit:resume` picks up where the last one stopped.

Codex, Cursor and Pi spell commands with a hyphen, as in `/speckit-complete`. Devin reaches the same workflow through its `/system-spec-kit` skill.

&nbsp;

### Git Hooks

The first AI session installs the repository's git hooks. They check every commit and push in this checkout and its worktrees:

- **pre-commit** blocks code comments that cite spec ids and keeps generated files in step with what you stage
- **commit-msg** holds each message to the [commit template](.skilled/skills/sk-git/assets/commit-message-template.md): a `type(scope): summary` subject, a body and no `Co-Authored-By` lines
- **pre-push** blocks a push that deletes more than 100 tracked files. It asks before a push to a branch other than `main`, a `skilled/v*` release branch or one on the sk-git allowlist

Another clone is checked only after `git config --local skilled.trustRepoHooks true`. `/doctor:git setup` checks the hooks and sk-git settings. `/doctor:git hooks` switches a gate on or off, and `/doctor:git standards` changes the commit rules. The [git hooks README](.skilled/scripts/git-hooks/README.md) describes each gate.

&nbsp;

### Make It Yours

Only `sk-code` carries stack-specific patterns, so start there when you fork. The other 13 skills work in any codebase, and the [customization guide](#customizing-for-your-stack) walks through adapting it. `/doctor:sk-code setup` then checks the result.

Every setting has a working default. To change one, see [Environment Settings](#environment-settings), or run `/doctor:env`, which lists them all and saves a change after your yes.

&nbsp;

### Keep It Healthy

The doctor commands check and repair one area each. `/doctor:helper` names the one that fits a problem you describe, and `/doctor:setup` lists them all. The rest each cover one area:

- `/doctor:update` brings in a new release
- `/doctor:runtime-mirrors` finds runtime copies that drifted from `.skilled/`
- `/doctor:skill-advisor` rebuilds or tunes skill routing
- `/doctor:sk-skill` reports how far a skill is from the Skilled format and converts one after a plan
- `/doctor:agents-md` checks your root instruction file against the shipped template. After a plan it embeds the shipped sections plus your own block
- `/doctor:install` prints the ordered steps that install Skilled in your own project repo, and `/doctor:symlink` checks and repairs the framework links there
- `/doctor:overlay` keeps a copied Skilled's own changes through an update
- `/doctor:ci` reports and toggles the CI workflow switches

The [Doctor](#doctor) commands section lists every command and target in one table. It shows which ones only read and which write after your yes, then describes each one.

&nbsp;

## 5. 🔗 USE IT IN YOUR OWN PROJECT

Skilled does not have to live inside each project. You can set up a project in two ways, and the [install guide](INSTALL-SKILLED.md) walks through both.

- **Link it.** Keep one Skilled checkout and link it into each project. One `git pull` then updates them all. See [Link It Into Your Project](INSTALL-SKILLED.md#3-link-it-into-your-project).
- **Copy it.** Commit a copy of Skilled to the project, so the whole team shares one pinned version. Your changes to the copy live in an overlay folder. See [Copy It Into Your Project](INSTALL-SKILLED.md#4-copy-it-into-your-project).

Each step shows you a plan before it writes, and each one prints how to undo it.

&nbsp;

## 6. 📋 SPEC KIT

The Spec Kit enforces structured spec folders for every file-modifying conversation.

Gate 3 requires a spec folder answer before any file modification begins. Only a trivial fix of a few characters in one file is exempt.

&nbsp;

#### Documentation Levels

Documentation depth scales with task complexity.

| Level | Size | Files | For |
| --- | --- | --- | --- |
| **Level 1** | under 100 LOC | `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Small features, bug fixes and single-file changes |
| **Level 2** | 100 to 499 LOC | Level 1 plus `acceptance-criteria.md` (scaffolded, required for closure) | Features needing QA verification and multi-file changes |
| **Level 3** | 500+ LOC | Level 2 file set plus architecture sections, with `decision-record.md` as an add-on | Architecture changes and complex refactors |
| **Level 3+** | complexity score 80+ | Level 3 file set plus governance sections inside `spec.md` | High-complexity work needing review tracking and workstream coordination |

The LOC ranges are guidance, not hard rules. Risk, complexity and the number of affected files can push a task to a higher level. When in doubt, choose the higher level.

**What each level must contain**

`spec.md`, `plan.md` and `tasks.md` are hard requirements at initial scaffolding across every level. `implementation-summary.md` is scaffolded with the folder. It becomes required once the first task in `tasks.md` is checked off. `acceptance-criteria.md` is scaffolded at Level 2 and above, and its satisfaction gates packet closure. Every other add-on is lazy at every level: present when requested, skipped otherwise.

The machine contract is the `levels` section of `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json`. The `documents` section beside it is a descriptive index.

&nbsp;

#### Spec Folder Structure

```text
specs/<track>/<###-feature-name>/
├── description.json             # Spec identity and continuity metadata
├── spec.md                      # What the feature is and why it exists
├── plan.md                      # How to implement it
├── tasks.md                     # Step-by-step task breakdown
├── acceptance-criteria.md       # Criteria that gate packet closure (Level 2+)
├── decision-record.md           # Architecture decisions (lazy add-on, any level)
├── implementation-summary.md    # Post-implementation summary (all levels)
├── graph-metadata.json          # Packet-level graph metadata (auto-refreshed on save)
└── scratch/                     # Temporary workspace files
```

`resource-map.md` is not a packet add-on. The deep-research and deep-review loops write their own evidence ledger of that name. They extract it from their deltas into the loop's own `research/` or `review/` artifact directory, never into the packet root.

&nbsp;

#### Available Templates

Fifteen templates ship under `.skilled/skills/system-spec-kit/templates/`. Which ones a packet gets depends on how each document is triggered, not on its level alone.

##### Core

| Template | What it holds | When it is required |
| --- | --- | --- |
| `spec.md` | What the feature is and why it exists | At every level |
| `plan.md` | How the work gets done: approach, phases and verification | At every level |
| `tasks.md` | The step-by-step breakdown with P0/P1/P2 priorities | At every level |
| `implementation-summary.md` | What shipped and how it was verified | Scaffolded with the folder, and required once the first task in `tasks.md` is checked off |
| `acceptance-criteria.md` | The closure gate: every row Met, Unmet, Waived or Superseded before the packet may close | Lives in `addons/`, scaffolded at Level 2 and above |

##### Lazy Add-ons

Render these with `--with-lazy-addons` or `--with-goal` on `create.sh`, or with the inline gate renderer on an existing packet. A `goal.md` for an existing packet comes from `/create:goal` instead. All live in `addons/`.

| Template | What it holds | Notes |
| --- | --- | --- |
| `decision-record.md` | Architecture decision records: choices, alternatives, consequences and implementation notes | Required backing for any `Waived` or `Superseded` acceptance-criteria row |
| `goal.md` | The durable directive the packet executes against plus the criteria that decide when it is done | Scaffolded by `--with-goal`, into each child only under `--phase`. Authored, amended or retrofitted with `/create:goal`, which also writes a phase parent's goal and binding table |
| `timeline.md` | Chronological record of events, outcomes and milestones | For long-running or incident-driven work |

##### Command & Agent Owned

A command or agent writes these, not the scaffold flags. All live in `addons/`.

| Template | What it holds | Written by |
| --- | --- | --- |
| `handover.md` | Session handover preserving context so the next session picks up cleanly | The memory-save flow (`/speckit:save`) |
| `debug-delegation.md` | The escalation record for a stuck issue handed to a specialized debugging agent after 3+ failed attempts | `@debug` |
| `research.md` | The technical investigation: analysis, architecture patterns and implementation guidance | A `/deep:research` loop |

##### Packet Types

A different packet shape, not a level. All live in `packet-types/`.

| Template | What it is for |
| --- | --- |
| `phase-parent.spec.md` | Spec for a phase parent that decomposes one feature into child phase packets. A `phase` packet needs only `spec.md` |
| `research.spec.md` | Spec for a research packet, which also requires `[spec-folder]/research/research.md` |
| `review.spec.md` | Spec for a review packet, which also requires `[spec-folder]/review/review-report.md` |
| `review-report.md` | The verdict, active finding counts and audited scope a review packet must produce |

<!-- readme-check
allow-ref phase-parent.spec.md | a packet-type template, shipped as a .tmpl file under the spec-kit templates' packet-types/ folder
allow-ref research.spec.md | a packet-type template, shipped as a .tmpl file under the spec-kit templates' packet-types/ folder
allow-ref review.spec.md | a packet-type template, shipped as a .tmpl file under the spec-kit templates' packet-types/ folder
allow-ref .speckit-index/ | the index folder a host repository builds for its own packets; this repository keeps none
allow-ref .skilled-host.json | the settings file a host repository writes; this repository keeps none
-->

&nbsp;

#### Task Priority System

Checklist items in `tasks.md` carry a priority so reviewers know what blocks shipping and what can wait.

- **P0** - Hard blocker. Cannot ship without this. Cannot defer
- **P1** - Required. Must complete or receive explicit user approval to defer
- **P2** - Optional. Can defer without approval, except under `--strict`, where an incomplete P2 blocks

`check-completion.sh` reads the verification section of `tasks.md` and requires every item to carry a P0, P1 or P2 tag. A Level 1 packet without that section exits the check unenforced.

`acceptance-criteria.md` is the closure gate and does not use priorities. Each row is `Met`, `Unmet`, `Waived` or `Superseded`, and a `Waived` or `Superseded` row must cite an ADR in `decision-record.md`.

`validate.sh` enforces `AC_CLOSURE`. An unmet criterion fails a packet that claims completion and only informs while the work is in progress. Packets created before the rule's rollout stay advisory. `AC_COVERAGE` advises on criteria carrying `file:line` citations.

&nbsp;

#### Phase Decomposition

Phase decomposition splits large features into a parent spec folder (overall specification) and child folders (one per phase).

```text example
specs/<track>/022-big-feature/     # Parent spec folder
├── spec.md                        # Overall specification
├── 001-data-model/                # Phase 1 child
│   ├── spec.md
│   └── ...
├── 002-api-endpoints/             # Phase 2 child
│   ├── spec.md
│   └── ...
└── 003-frontend/                  # Phase 3 child
    ├── spec.md
    └── ...
```

`create.sh --phase` creates a parent with three child phases in one step, and `--phases <N>` or `--phase-names` sets the children. `validate.sh --recursive` validates the parent and all children together.

&nbsp;

#### Scripts and Validation

`validate.sh` runs 42 rules against a spec folder and reports what passes and what needs fixing. Rules check required files, template compliance, placeholder detection, anchor markers and cross-reference consistency.

Eight of them only warn and never fail a run. Two of those are worth knowing. `FRONTMATTER_VALUES` checks each doc's `contextType` and `importance_tier` against the one value list in `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-values.json`. `SOURCE_TAGS` checks that the `[SOURCE: path:line]` tags in research and review artifacts point at a file and line that exist.

**Spec management scripts** in `.skilled/skills/system-spec-kit/runtime/cli/spec/`:

- **`create.sh`** - create spec folders with level-appropriate templates. Use `--phase` for a parent with child phases
- **`validate.sh`** - run 42 validation rules. Use `--recursive` for phase folders and `--quiet` for the result line only. A `--strict` run on a Draft packet whose only errors are derived metadata repairs it once and revalidates, so it can write files. `SPECKIT_DRAFT_AUTO_REPAIR=0` turns that off
- **`upgrade-level.sh`** - upgrade a spec folder to a higher level by injecting new sections
- **`recommend-level.sh`** - analyze scope and risk to recommend the right documentation level
- **`calculate-completeness.sh`** - calculate spec folder completeness as a percentage
- **`check-completion.sh`** - verify all completion criteria are met
- **`check-placeholders.sh`** - find remaining `[PLACEHOLDER]` values after level upgrade

**`validate.sh` exit codes**

| Exit | Meaning |
| --- | --- |
| **0** | All rules pass. Ready to proceed |
| **1** | User error (bad flags or invalid input) |
| **2** | Validation error. Must fix before claiming completion |
| **3** | System error (file I/O failure, missing manifest or other environment problem) |

**Useful flags and behaviors**

`--verbose` shows details behind each rule. `--recursive` validates a parent and all child phase folders. `validate.sh` implements no rules itself. It hands every rule decision to a single Node orchestrator.

The default scaffold path skips post-create validation. Set `SPECKIT_POST_VALIDATE=1` to enable it for strict CI workflows. Path traversal inputs, for example a `--path` value that climbs above the repository root, are rejected before any filesystem write.

Concurrent `/speckit:save` writes to the same packet cannot interleave. The continuity writer holds a packet-level lock, and a second save fails fast while it is held.

**Continuity scripts** in `.skilled/skills/system-spec-kit/runtime/cli/continuity/`:

- **`generate-context.ts`** - primary workflow for updating packet continuity and supporting generated context artifacts
- **`backfill-frontmatter.ts`** - add missing frontmatter to existing generated context artifacts and indexed spec docs
- **`validate-memory-quality.ts`** - run quality checks on continuity content before it is written

**Runtime testing**

The package includes a dedicated `stress-test/` suite under `.skilled/skills/system-spec-kit/runtime/stress-test/` for load, contention and capacity checks. It runs separately from standard test runs via its own `vitest.stress.config.ts`.

TypeScript sources compile to `.skilled/skills/system-spec-kit/runtime/cli/dist/`. The runtime entry point for continuity saves is `.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js`.

&nbsp;

#### Gate System

Six mandatory gates run before acting. Gates 1 to 5 run before any file change, and Gate 6 runs before every substantive reply, read-only turns included. Gates 5 and 6 load the 13 rule files in `.skilled/repo-rules/`: `REPO RULES.md` routes the write rules, and Gate 6 names the five reply rules. Four more rules sit under the post-execution gates: final-state verification, completion verification, the memory save rule and the always-on goal posture rule.

```
  User message arrives
         │
         ▼
  ┌─────────────────────────────────────────────┐
  │  Gate 1: Understanding (SOFT BLOCK)         │
  │  trigger index lookup surfaces context      │
  │  Classify intent: Research / Implementation │
  │  Levels: 80%+ go, 40-79% caveat, <40% ask   │
  └──────────────────┬──────────────────────────┘
                     │
                     ▼
  ┌─────────────────────────────────────────────┐
  │  Gate 2: Skill Routing (REQUIRED)           │
  │  advisor_recommend recommends skill         │
  │  confidence >= 0.8 ─► MUST load skill        │
  └──────────────────┬──────────────────────────┘
                     │
                     ▼
  ┌─────────────────────────────────────────────┐
  │  Gate 3: Spec Folder (HARD BLOCK)           │
  │  Asked first when a file write is coming    │
  │  A) Existing                                │
  │  B) New, for new or unrelated work          │
  │  C) Related, a phase child or a series      │
  │     parent for the same artifact            │
  │  D) Skip                                    │
  └──────────────────┬──────────────────────────┘
                     │
                     ▼
  ┌─────────────────────────────────────────────┐
  │  Gate 4: Workflow Tiebreakers               │
  │  Executor CLI never overrides skill route   │
  │  command-spec-kit wins on ambiguity         │
  └──────────────────┬──────────────────────────┘
                     │
                     ▼
  ┌─────────────────────────────────────────────┐
  │  Gate 5: Repo Rules Load (HARD BLOCK)       │
  │  REPO RULES.md routes the first write        │
  └──────────────────┬──────────────────────────┘
                     │
                     ▼
  ┌─────────────────────────────────────────────┐
  │  Gate 6: Reply Rules Load (HARD BLOCK)      │
  │  communication rules load before a reply    │
  └──────────────────┬──────────────────────────┘
                     │
                     ▼
              EXECUTION
                     │
                     ▼
  ┌─────────────────────────────────────────────┐
  │  Post-Rules                                 │
  └─────────────────────────────────────────────┘
```

For the full spec folder workflow, Level contract template architecture, gate definitions and anti-pattern detection rules, see the [→ Spec Kit README](.skilled/skills/system-spec-kit/README.md) and [→ AGENTS.md](AGENTS.md).

&nbsp;

#### 🧠 Spec Memory & Search

Spec memory and retrieval are packet-local and file-based, integrated into the spec folder itself.

**Where memory lives**

Canonical continuity lives in the spec packet itself. `generate-context.js` updates it and may emit supporting generated context artifacts inside the spec folder. `/speckit:resume` is the recovery surface. It rebuilds in this order: `handover.md` -> `_memory.continuity` -> canonical spec docs.

**How search works**

Gate 1 matches a prompt against author-declared trigger phrases through the committed trigger index at `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`. Free-text retrieval uses the ripgrep recipes in [retrieval-conventions.md](.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md). The trigger index is a committed file, and on a zero-hit the lookup also checks spec docs in the working tree that the index does not list yet. The ripgrep recipes read the working tree. Neither lane needs a running daemon.

A host repository that vendors Skilled keeps its own index in `.speckit-index/` at its root. It can name another folder with `{ "indexDir": ".index" }` in a `.skilled-host.json` file there, and the generator and the lookup both follow it.

The trigger-index generator names the checkout it indexes. Run from a project that links the Skilled source, it indexes the source checkout unless `--repo-root` names another. It now prints one stderr line naming both roots and the `--repo-root` and `--out` flags. The default root, stdout and exit codes are unchanged.

Retrieval is lexical only. Semantic paraphrase, vector and BM25 fusion, decay, access tracking and session dedup are unsupported. A miss is a clean no-hit rather than a degraded guess.

When the index has no scored candidate, Gate 1 also scores declared trigger phrases in unindexed spec docs in a git work tree and reports the scan in the answer's `staleFallback` field.

**History after compaction**

After a compaction on Claude, Codex, Pi, Devin, DSH or OpenCode, the returned context can carry a `## History Lookup` section with one read-only command. The command searches, browses, loads and pages the session's own earlier turns, at most 16 KiB per reply. It returns only what the conversation showed.

Search finds a turn from part of what the model remembers. `MARKER` or `dv-2b7e` finds the turn that said `LIVE-MARKER-dv-2b7e`, and the preview shows the match. The handle works for 30 minutes and only for the session and checkout that minted it, including a session started in a subfolder. Cursor is not offered yet.

The command runs the compiled helper, so run `npm run build` in `.skilled/skills/system-spec-kit/runtime` first.

**The moving parts**

`/speckit:save` returns a save plan by default. Its apply and full-auto modes refresh packet metadata through the continuity writer `node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js`. A save that is not `--full-auto` ends its summary with `Continuity fields not written: plan-only save; pass --full-auto to write them`. A plan-only save no longer looks like a full one. When the save passes `--session-id` and `--runtime`, `/speckit:save` records the runtime and session that wrote a packet's continuity.

`/speckit:resume` stays the primary recovery path. The history lookup only adds to it. When its handle is missing or stale, the section is left out and recovery runs as before.

`/speckit:search` runs the two lexical lanes, and `/doctor:speckit` checks that the index and the recipes are still healthy. The skill advisor owns the shared model server and embedding provider.

&nbsp;

## 7. 🔄 DEEP LOOP

The Deep Loop system runs autonomous, iterative agent workflows.

Each loop dispatches a fresh-context worker against externalized state. It keeps going until a convergence check, not the agent's own claim, decides a stop is safe.

Three loop families (research, review and AI council) live as nested mode packets inside one parent skill, `system-deep-loop`. All consume one shared runtime, `runtime/`, for state, scoring and fan-out. Research, review and AI council also share its loop contract.

&nbsp;

#### How It Works

```
                    ┌──────────────────────────────────────┐
                    │      CONVERGENCE CONTROLLER          │
                    │  (scores each pass, owns the stop)   │
                    └──────────────┬───────────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
       DISPATCH fresh       LEAF executes          REDUCE state
       worker with          one bounded            + score signal
       clean context        iteration              + coverage
              │                    │                    │
              └────────────────────┴────────────────────┘
                                   │
                                   ▼
                  legal stop ─► SYNTHESIZE + write-back
```

&nbsp;

#### Convergence and Stopping

A loop decides for itself when the work is finished, instead of trusting an agent that says so.

After each pass the runtime reduces the new state. It scores how much fresh signal the pass added and checks coverage against the loop's own model. Evidence decides, not vibes.

A stop must be earned. The loop ends only when the convergence score clears its threshold and every quality gate passes. An open blocker forces another pass: an active P0 in a review, or an uncovered dimension in research.

You can also run to depth on purpose. Set `--stop-policy max-iterations` to keep going for a fixed budget when you want breadth over an early stop.

Once a stop is legal, the loop synthesizes. It writes its report and saves continuity, so the run leaves a durable artifact instead of a chat transcript.

&nbsp;

#### Deep Loop Runtime (the shared foundation)

One engine sits under every loop, so they all work the same way and you learn the workflow once. Research, review and council dispatch, track and stop the same way.

Progress is saved outside the chat, so you can pause and resume anytime. A loop survives crashes, new sessions and long runs. A loop ends only when the work has converged and passed its quality checks, never because an agent says it is done.

Run fully autonomous with `:auto` or pause at each step with `:confirm`. You can start fresh, resume or restart at will.

Autonomy stays bounded. Cross-AI fan-out lineages can run with elevated CLI permissions in their own sandboxed workdir. A stall watchdog, a per-lineage cost cap and a lag-ceiling guard bound and observe those subprocesses, so autonomy stays supervised, not unattended.

The runtime is self-contained and MCP-free. It declares its own dependency manifest and resolves `zod`, `better-sqlite3` and the `tsx` loader from its own `node_modules`. Its one sibling dependency is system-spec-kit's shared package, and it type-checks with that skill's TypeScript. It carries executor config, atomic state, scoring, fallback routing and the coverage / council graph scripts.

&nbsp;

#### State, the Ledger and the Append Gateway

Every loop keeps its progress in files, not in the chat, and those files are the single source of truth. A typed, append-only event ledger records each iteration. The `deep-*-state.jsonl` you read is a projection the runtime rebuilds from that ledger.

There is one way in. A leaf records its iteration through the append gateway. The gateway authorizes the write, fences it behind the ledger, returns a receipt, then refreshes the state projection. Nothing writes the state file directly, so the log never drifts from the ledger.

A record is durable or refused, never half-written. The gateway either commits the record and hands back a receipt, or refuses it and names the failed check so the leaf halts. There is no partial append and no silent fallback to a direct write.

Runs are replayable. Convergence scores and verdicts recompute from the stored events, so a run can be audited, resumed or rebuilt after a crash from the ledger alone.

Deltas feed the reducer. Each iteration also writes a structured delta file that the reducer folds into the registry, dashboard and strategy. The reducer owns those derived artifacts. The gateway owns the state log.

&nbsp;

#### Cross-AI Fan-Out

A loop can spread its iterations across several AI models at once, then merge what they find. Bind executors on the command and each one becomes its own lineage.

You can run the same review or research across native agents and CLI bridges in parallel: Codex, Claude Code, OpenCode, Cursor, Devin, Pi and DeepSeek Harness. Each lineage runs on its own state, and a pool caps how many run at once.

For a review, the merge follows the strongest restriction. Any lineage that reports an active P0 pulls the merged verdict to FAIL, so the safest reading wins rather than the average one.

Fan-out is supervised, not unattended. A stall watchdog aborts a lineage that stops emitting progress, and a per-lineage cost cap bounds spend. A dead or rate-limited lineage is tolerated without failing the whole run.

Every executor kind dispatches through the same shared runner, selected per lineage. Adding a model is a list edit rather than new plumbing. A Cursor, Pi or Devin model must be on the runner's allowlist. DeepSeek Harness accepts only models in its two-route roster.

&nbsp;

#### Deep Research

Investigates a question for you, one focused pass at a time, until the answers hold up. `/deep:research` runs `@deep-research`.

It knows when it is done: it stops once findings stabilize, not after a fixed number of tries. It won't quit early either. It keeps going until the question is covered from enough angles and sources. Ruled-out directions are saved, so you never re-investigate a dead end. Results land in a growing `[spec-folder]/research/research.md` you can read as it works.

&nbsp;

#### Deep Review

Audits your code in passes and never edits it. `/deep:review` runs `@deep-review`.

Every issue is ranked P0/P1/P2 across correctness, security, traceability and maintainability, so you fix what matters first. Each critical finding is re-challenged before it sticks, which cuts false alarms. An open P0 forces another pass, and the audit must clear its quality checks before it can stop. The result is a `review-report.md` that ends in a PASS, CONDITIONAL or FAIL verdict.

&nbsp;

#### Multi AI Council

Brings several AI viewpoints together to plan hard decisions. `@ai-council` runs the seats, and `/deep:ai-council` handles multi-topic sessions.

Different AI seats reason from different angles, then critique each other. They converge on a recommendation with the evidence behind it. The council plans only, so it never touches your implementation files. The plan and its reasoning persist as `ai-council/**` files in the packet.

For details, see the [Deep Loop Runtime README](.skilled/skills/system-deep-loop/runtime/README.md), or the [system-deep-loop README](.skilled/skills/system-deep-loop/README.md), which documents each mode.

&nbsp;

## 8. 🎯 SKILL ADVISOR

The Skill Advisor matches what you type to the right skill before any tool runs.

**The shape of it**

A resident daemon sits behind one CLI front door: `node .skilled/bin/skill-advisor.cjs`. The CLI speaks the advisor's own newline-delimited protocol over a unix socket. There is no MCP registration, in `opencode.json` or any other runtime config.

It has nine commands. Four `advisor_*` commands cover routing, freshness, rebuild and validation. Five `skill_graph_*` commands cover scan, query, status, graph validation and `enhances` propagation. The three writes need a trusted caller.

When the daemon is unreachable, the CLI answers from the Python scorer at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`. It marks the response degraded, so the prompt-time brief reports `Advisor: stale` rather than claiming live.

When there is no brief, the prompt hooks and the OpenCode plugin still say why in one line above the directives. The line reads `Advisor: outage (...)` with the command to route by hand, or `Advisor: no skill matched.`, or `Advisor: prompt skipped.` for casual prompts such as `thanks`, which never reach the CLI. A setup, install, configure or check-the-tooling prompt with no match also gets `For setup or health checks, run /doctor:setup.`

The advisor also suggests doctor commands. A setup or health prompt that no skill answers gets a runnable `/doctor:<command> <target>` line. When a skill also matches, the skill comes first and the brief adds `Also: /doctor:<command> <target>` on a second line.

&nbsp;

#### How It Works

```
  YOU TYPE: "use chrome-devtools to inspect a page"
                      │
                      ▼
           ┌──────────────────────┐
      1.   │  NORMALIZE           │  Clean up the prompt, never store
           │                      │  the raw text
           └──────────┬───────────┘
                      ▼
           ┌──────────────────────┐
      2.   │  5-LANE FUSION       │  Explicit author signals 0.42
           │                      │  Lexical match 0.28
           │                      │  Causal graph 0.13
           │                      │  Derived hints 0.12
           │                      │  Semantic evidence 0.05
           └──────────┬───────────┘
                      ▼
      ┌───────────────────────────────┐
      │  3. FRESHNESS + LIFECYCLE     │  Is each candidate still alive?
      │                               │  live / stale / absent / archived
      │  Reads SQLite skill graph     │  with redirect metadata
      │  + generated metadata         │  Falls open on errors
      └───────────────┬───────────────┘
                      ▼
           ┌──────────────────────┐
      4.   │  VALIDATE + FILTER   │  Apply confidence + uncertainty
           │                      │  thresholds, cache the trust
           │                      │  envelope
           └──────────┬───────────┘
                      ▼
           ┌──────────────────────┐
      5.   │  RENDER              │  Either a hook brief (one route
           │                      │  line) or a JSON recommendation list
           └──────────┬───────────┘
                      ▼
                RESULT:
           advisor_recommend -> list of skill recommendations
           hook adapter -> "Advisor: live; use ..."
           local scorer fallback -> degraded, "Advisor: stale"
```

&nbsp;

#### Native Package Layout

```text
.skilled/skills/system-skill-advisor/runtime/
├── advisor-server.ts      resident daemon behind the CLI socket protocol
├── skill-advisor-cli.ts   the nine-command CLI implementation
├── bench/      benchmarks
├── compat/     stable compatibility entry for compiled consumers and the Python shim
├── config/     route exclusions
├── data/       the default prompt policy that skips casual prompts
├── database/   SQLite skill graph
├── handlers/   the nine command handlers
├── lib/        scorer, normalizer, freshness, cache
├── schemas/    JSON + Zod schemas
├── scripts/    the Python compatibility scorer and doc checks
├── tests/      test suite
└── tools/      command registration
```

**The nine commands**

| Command | What it does |
| --- | --- |
| **`advisor_recommend`** | Recommends skills for a prompt with lane breakdown, lifecycle redirects and a freshness trust signal. Returns the workspace root and the effective thresholds it used |
| **`advisor_rebuild`** | Rebuilds the advisor skill graph when `advisor_status` reports stale, absent or unavailable state. `force:true` rebuilds even when live |
| **`advisor_status`** | Reports freshness, generation, lane weights, skill count, last scan time and a trust state that reads `unavailable` when the daemon is down. It counts skill roots only and reports `indexStaleness`, which flags any stored source hash that no longer matches the file on disk |
| **`advisor_validate`** | Runs measurement slices: corpus accuracy, holdout, parity, safety, latency. Surfaces the workspace root, effective thresholds, threshold semantics (aggregate vs runtime) and prompt-safe outcome counts (accepted / corrected / ignored) |
| **`skill_graph_scan`** | Indexes skill metadata into the advisor-owned skill graph surface |
| **`skill_graph_query`** | Queries skill graph relationships such as dependencies, families, hubs, conflicts and subgraphs |
| **`skill_graph_status`** | Reports graph counts, families, categories, staleness, validation and database status |
| **`skill_graph_validate`** | Validates schema drift, broken edges, reciprocal symmetry and dependency-cycle issues |
| **`skill_graph_propagate_enhances`** | Reports, proposes or applies missing inbound `enhances` edges. Report, propose and dry-run stay read-safe, and apply writes need a trusted caller |

&nbsp;

#### How Runtimes Talk To It

Each runtime reaches the advisor its own way:

- **Claude Code, Codex, Cursor and Devin** call the prompt-time hook adapters under `.skilled/skills/system-spec-kit/runtime/hooks/`. Each adapter labels its diagnostics with its own runtime name
- **OpenCode** uses `.opencode/plugins/system-skill-advisor.js`, which spawns `.skilled/bin/skill-advisor.cjs` and renders the returned brief through the shared renderer
- **Pi** runs the same hook in-process through the extension `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`. It falls back to the outage status line and the directives if the advisor misses its deadline
- **DeepSeek Harness** runs the same hook in an interactive session through the adapter `.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs`. A fan-out lineage gets no brief

To disable it everywhere, set `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1`, or `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED=1` for the OpenCode plugin alone. The legacy `SPECKIT_`-prefixed names still work. At the prompt, the threshold contract is confidence ≥ 0.8 and uncertainty ≤ 0.35 by default.

The CLI front door serves the same nine commands over the warm daemon for hooks, cron and shell diagnostics. Mutation commands (`advisor_rebuild`, `skill_graph_scan`, apply-mode `skill_graph_propagate_enhances`) are gated behind `--trusted` or `SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1`.

The launcher is resilient. It uses an owner lease, a reconnecting session proxy and dead-socket respawn under a bootstrap lock. A hung daemon is reaped and replaced instead of stranding the session or spawning a second writer. A daemon launched before the current build is replaced on the next call, so a rebuild takes effect without a manual restart. `SPECKIT_BRIDGE_RESPAWN_DISABLED=1` turns that off.

&nbsp;

#### Affordance Evidence

Callers can pass structured tool and resource hints as affordance evidence: `skillId`, `name`, `triggers[]`, `category`, `dependsOn[]`, `enhances[]`, `siblings[]`, `prerequisiteFor[]`, `conflictsWith[]`.

A normalizer strips URLs, emails, token-shaped fragments, control characters and instruction-shaped strings before the scorer sees anything. Free-form `description` text is ignored on purpose. Sanitized triggers feed the derived-hints lane at reduced weight. Normalized relations become temporary edges in the causal-graph lane, reusing the standard relation multipliers (`depends_on`, `enhances`, `siblings`, `prerequisite_for`, `conflicts_with`).

None of this adds a scoring lane or an entity kind, and payloads carry no raw matched phrases. Evidence labels stay as stable `affordance:<skillId>:<index>` identifiers.

For details, see the [Skill Advisor README](.skilled/skills/system-skill-advisor/README.md).

&nbsp;

## 9. 🧰 SKILL LIBRARY

14 skills in `.skilled/skills/`. Gate 2 loads them on demand when the advisor matches a task (confidence >= 0.8 means the skill must be loaded). By default, no skills are excluded from advisor routing.

&nbsp;

#### SYSTEM

**`system-spec-kit`**

The mandatory orchestrator for all file modifications. It activates automatically for any code file change. It creates numbered spec folders with manifest templates rendered through Level contracts across 4 levels (1-3+). It owns the packet continuity writer, the generated trigger index and the ripgrep retrieval recipes. Trigger lookup reports the full candidate count before `--limit`, marks truncated results, and on a zero-hit checks spec docs the index does not list yet. The structured ripgrep wrapper keeps one row per file, cuts at `--limit` files (default 20) and reports what it hid. It also manages the manifest template source, 42 validation rules, the spec-kit script suite and the feature-catalog / testing-playbook documentation surfaces.

**`system-skill-advisor`**

The Gate 2 skill-routing subsystem at `.skilled/skills/system-skill-advisor/`. It owns prompt-time skill routing, the `skill_graph_*` commands, freshness and lifecycle checks, plus the shared embeddings stack. Its front door is `node .skilled/bin/skill-advisor.cjs` over the resident daemon's socket protocol, with no MCP registration and no client namespace.

**`system-skilled-doctor`**

The doctor-command skill at `.skilled/skills/system-skilled-doctor/`, for installing Skilled in your own project and keeping it current there. It owns eleven of the seventeen doctor commands: `/doctor:install`, `/doctor:symlink`, `/doctor:update`, `/doctor:agents-md`, `/doctor:runtime-mirrors`, `/doctor:env`, `/doctor:setup`, `/doctor:helper`, `/doctor:speckit`, `/doctor:mcp` and `/doctor:overlay`. Each keeps its workflow in `.skilled/commands/doctor/`, and the skill matches a request to one of them.

It keeps a vendored copy's own changes. `/doctor:overlay` reports an overlay that drifted and restores it, and it re-pins the copy to a newer upstream commit. See [Copy It Into Your Project](INSTALL-SKILLED.md#4-copy-it-into-your-project). The other six doctor commands stay with the skill whose own checks they run, such as `/doctor:git` with `sk-git`. The [Doctor](#doctor) section lists them.

&nbsp;

#### CODE WORKFLOW

**`sk-code`** - write code that fits the stack you're in

`sk-code` loads surface-aware patterns, checklists and verification recipes per surface. It detects the active stack from paths and library markers. Unsupported stacks (Go, React/Next.js server code, generic Node.js, React Native, Swift) trigger a quick disambiguation question.

It has three surfaces:

- **Skilled** (native) covers this framework's own code: scripts, MCP servers, agents, commands and skills
- **CI** holds GitHub Actions workflow standards for triggers, filters, permissions, timeouts, concurrency and caching, with scaffold templates
- **Frontend** holds stack-agnostic web frontend practice (markup, CSS, accessibility, i18n, performance and the five-pass Figma check). It also holds the visual references that decide a value: spacing, type, colour and elevation scales, the hierarchy method and visual review pass, and motion and interaction rules

A declared specific surface, including an operator-private surface skill, ranks ahead of Skilled.

It verifies before it claims done. Three mandatory phases run implementation, then testing and debugging, then verification.

A quality runner, `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs`, gives one verdict for a change in any repository. A committed `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` runs its commands only after `git config --local skilled.trustRepoChecks true`. Without it each configured check reads `SKIPPED_UNTRUSTED`.

There is a fixed hard floor plus rules your repository can change. Secrets, conflict markers, parse failures, input validation and a few more stay on everywhere. Any other rule can be dropped or replaced in a `## Rule overrides` section of a checklist your repository declares. `commentHygiene.disableRules` switches off named comment-hygiene rules. A quality run applies those sections and records each accepted row, and a refused section stops it. This framework's own house style lives in the Skilled surface, so another repository does not inherit it.

It reviews before you ship (`code-review` mode). The security and correctness floor always runs first, then the default lens with your repository's overrides, then the surface evidence above. Findings come ranked P0, P1 or P2, and the report names the rules it applied on one `Rule sources:` line.

**`sk-git`** - one clean path from change to PR

`sk-git` runs git work through three phases, each backed by its own reference, so branches and commits stay tidy:

- **Workspace setup** (`worktree-workflows.md`): isolated workspaces, branch creation, parallel development
- **Work and commit** (`commit-workflows.md`): conventional-commit format, staged-change analysis, scope detection
- **Complete and integrate** (`finish-workflows.md`): PR creation via `gh pr create`, branch cleanup, integration

&nbsp;

#### DEEP LOOP

One skill powers the autonomous loops described in [Deep Loop](#7--deep-loop), in two layers. **`runtime/`** is the shared MCP-free execution layer every active loop consumes. **`system-deep-loop`** is the parent skill routing to active nested modes (`deep-research`, `deep-review`, `ai-council`).

Use `@context` separately for one-shot retrieval. This parent-nested-skill pattern is the reusable standard behind `/create:skill-parent`.

&nbsp;

#### CROSS-AI CLI

Run **cross-CLI agent teams from supported runtimes**. Claude Code, OpenCode or a plain shell can dispatch another AI CLI as a one-shot sub-tool that streams its result back. The conducting AI stays in charge, and the dispatched CLI handles the part it is best at.

A bridge works with any model its CLI supports. Point it at another provider or model and the next dispatch uses it.

The bridges are built for deep-loop fan-out. Bind several bridges to one research, review or council run, and each becomes its own lineage with its own state, budget and stall watchdog. The safest verdict wins the merge.

Skills, agents and commands travel with the dispatch. Each bridge mirrors them into the runtime's own config, and commit hooks plus a CI check keep those mirrors in step with `.skilled/`. Each runtime folder's README says what is generated there: [Claude Code](.claude/README.md), [Codex](.codex/README.md), [OpenCode](.opencode/README.md), [Cursor](.cursor/README.md), [Pi](.pi/README.md) and [Devin](.devin/README.md).

A bridge checks before it runs. It confirms its CLI is installed and usable, so a missing tool stops the route up front. Every bridge but `cli-pi` refuses to dispatch the runtime it runs in, so delegation never loops.

**`cli-external-orchestration`** - parent hub for external CLI dispatch

One skill with seven bridges: `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi` and `cli-deepseek-harness`. Each bridge checks a dispatch against the rules in its own `hard-rules.json` before the command runs, and the `dsh` bridge carries 13 of them. That bridge is experimental. Its LLM Gateway `deepseek-v4.1-flash-1017` route passed a keyed run on 2026-11-06 and is the default. Its OpenCode Go route passed one on 2026-11-07 and runs only when you name it. All seven bridges are also deep-loop fan-out executors, so a research, review or council run can bind any of them as a lineage.

&nbsp;

#### JUDGMENT TRANSPORT

**`cli-classifier`** - typed judgments from Typesafe's Jev classifier

When a decision needs a number rather than prose, this hub asks the hosted Jev classifier (mode `cli-jev`) for one. It returns a probability, a choice between options, a score or a batch of keyed answers, and changes nothing else. The answer is structured JSON or a bare number, never a paragraph.

Two features run on their own once a key is stored. `validate_document.py` flags a `file:line` citation whose code no longer shows the claim. Fetched web pages receive one advisory line when a section reads as instructions aimed at an AI agent. `JEV_FEATURES=0` stops both features, and without a stored key nothing calls Jev.

&nbsp;

#### MCP INTEGRATION

**`mcp-code-mode`**

Reach 200+ external tools without bloating context. One TypeScript interface fronts every external MCP tool (Figma, GitHub, Chrome DevTools, ClickUp, Webflow). Tool schemas load on demand at first use, with zero upfront cost, type safety and autocomplete. That cuts context overhead by 98.7%.

**`mcp-tooling`** - parent hub for MCP tool bridges

One advisor identity routing to eight modes through `mode-registry.json`: five workflow modes (`mcp-chrome-devtools`, `mcp-click-up`, `mcp-obsidian`, `mcp-aside-devtools`, `mcp-notion`) and three design transports (`mcp-figma`, `mcp-refero`, `mcp-mobbin`).

- **`mcp-chrome-devtools`:** drive a real Chrome browser, through the `bdg` CLI in the terminal, through MCP for multi-tool flows or through the `chrome_devtools_live` manual in the user's own signed-in Chrome
- **`mcp-click-up`:** manage ClickUp tasks through the `cupt` CLI for daily work and the official MCP for documents, search and chat
- **`mcp-obsidian`:** manage Obsidian notes through `notesmd-cli`, the official `obsidian` CLI or an Obsidian MCP server
- **`mcp-aside-devtools`:** drive the Aside AI browser through its CLI or its MCP
- **`mcp-notion`:** work in a Notion workspace through the official Notion MCP, with direct API calls where the MCP falls short
- **`mcp-figma` _(transport)_:** read, author and export Figma designs through Figma Desktop and the `figma-ds-cli`. Reads and exports run freely, while authoring and destructive commands are gated. A read that feeds code ends at the five-pass check in `.skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md`. When the frame leaves a visual value open, or a value sits off every token and scale, that value goes to `sk-code-frontend`'s `web-visual-values.md`
- **`mcp-refero` and `mcp-mobbin` _(transports)_:** read-only search of UI references and app screens and flows

&nbsp;

#### DESIGN

**`sk-design`** - parent hub for design work over three modes

The hub carries no procedure of its own. It decides which mode owns the question in front of you and hands over:

- **`sk-design-md-generator`** behind `/design:extract`. Crawls a live URL across five viewports and writes a Style Reference `DESIGN.md` of named tokens, type scale, components and surfaces. Every value is copied from the running page and checked by script
- **`sk-design-chart`** behind `/design:chart`. Turns the comparison a reader needs into one of 29 chart forms and ships it as a standalone HTML file with no build step and no remote dependency
- **`sk-design-diagram`** behind `/design:diagram`. Self-contained HTML/SVG diagrams across 27 types with a skinnable editorial design system, plus ASCII and Markdown flowcharts and draw.io or Mermaid redraws

It pairs with `sk-code`: the hub supplies the measured reference, and `sk-code` builds and verifies against it.

&nbsp;

#### DOCUMENTATION

**`sk-doc`**

`sk-doc` is the parent hub for documentation authoring, routed via `mode-registry.json` to fifteen workflow modes across fourteen packets. It is a Markdown specialist with DQI quality scoring (Structure 40, Content 30, Style 30) plus HVR compliance checking. It scaffolds components (skills, agents, commands) and handles README templates, frontmatter validation and feature-catalog authoring.

It catches docs that read wrong once rendered. Sixteen render checks flag a joined bold label, a stray setext heading, a bare URL, an OVERVIEW that does not open with Purpose, a broken section citation or an intro that repeats the description. `package_skill.py --strict` fails a skill on any of them. A rewrite guard, `doc-rewrite-guard.py`, proves a form-only rewrite kept every claim before it is committed.

It authors manual testing playbooks through `sk-create-manual-testing-playbook`. A scenario is a single prompt when a person must judge the result. It is a `json conversation` script when the behavior spans turns, question tools, a restart or a compaction. The shared runner plays a script into five runtimes, under a macOS write sandbox, and writes a per-runtime PASS, FAIL or SKIP matrix with evidence.

It authors spec packet goals through `sk-create-goal`. That is a top-level, phase-parent or phase-child `goal.md` built from a checked template, with top-level and parent goals held to 4,000 characters.

&nbsp;

#### PROMPTING

**`sk-prompt`**

A standalone prompt-engineering skill that turns a rough ask into a structured, scored prompt. It auto-selects from 7 frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT), then refines and scores. DEPTH thinking runs across 3-10 rounds, then CLEAR scoring (Correctness, Logic, Expression, Arrangement, Reusability) checks the result against a fixed threshold.

It owns the canonical CLI prompt-quality card. Every `cli-*` executor's local card delegates to it for framework selection and the CLEAR pre-dispatch check.

&nbsp;

#### OTHER

**`cli-orca`** - Orca terminal CLI orchestrator

Drive the Orca app from a dispatch. It covers managed worktrees, paired terminals you can read back after a send, the embedded browser for pages the runtime itself hosts, automations and full ownership handoffs.

It checks the app before it touches anything. It resolves the `orca` executable and confirms the runtime answers, so a broken install stops the route instead of half-running it.

Orca work routes here, not to the mcp-tooling hub, which names `cli-orca` as the owner. The eight official Orca skills ride along as authored references. Flag detail is always read from the version-matched guide the binary itself serves.

&nbsp;

## 10. 🤖 AGENT LIBRARY

11 custom specialist agents. Defined in `.skilled/agents/` (source of truth) and mirrored for Claude Code, Codex, Cursor, Devin and Pi (`.<runtime>/agents/`). OpenCode reads `.opencode/agents/`, which links to the same `.skilled/agents/` source.

&nbsp;

#### AGENT ORCHESTRATION

**Orchestrate** - runs the show on multi-step work

Decomposes a task, delegates to specialist agents and merges their output into one answer with conflict resolution. It delegates by design: it directs and the specialists implement, though it keeps write and edit permissions. There are no runaway chains: single-hop delegation only, depth 2 max.

**Code** - ships surface-aware code and proves it works

A write-capable specialist that reads `sk-code`'s detected surface at dispatch, so the agent body stays stack-agnostic. It has seven dispatch modes: full build, surgical fix, refactor, test-add, scaffold, rename/move, dependency bump.

It earns every `DONE` through a Builder → Critic → Verifier self-check plus the Iron Law: no completion claim without fresh stack verification, and LOW confidence blocks `DONE`. It fails closed. Failures return to the orchestrator with an `escalation` classifier, with no silent retry. Only `@orchestrate` dispatches it.

**Context** - finds what you already know before searching code

Continuity-first retrieval, in order: `handover.md` → `_memory.continuity` → packet spec docs → trigger index lookup → ripgrep recipes. It returns a Context Package that combines packet continuity findings with codebase evidence. Read-only.

**Review** - guards code quality, never edits

Strictly read-only. It loads `sk-code`'s `code-review` mode (the findings-first baseline) and layers the surface standards the quality runner resolves for the reviewed files. It keeps no checklist of its own.

The safety floor holds. Security and correctness minimums are never relaxed, and a repository's rule overrides apply only outside that floor. The verdict follows severity alone: any P0, or an open P1, requests changes. Output is findings-first, and the 100-point score is advisory.

**Debug** - a fresh pair of eyes after you're stuck

Receives a structured context handoff instead of the failed conversation, so it skips inherited bias. Use it after 3+ failed tries. It follows a systematic 5-phase method, Observe → Analyze → Hypothesize → Validate → Fix, written up in `debug-delegation.md`.

**Markdown** - scoped doc authoring you can trust

The LEAF executor for the `/create:*` family plus scoped spec-doc and markdown writing. It loads `sk-doc` and the right template on every run. It refuses anything out of scope: unscoped writes and nested delegation receive a canonical REFUSE. Its output is deterministic, `STATUS=OK PATH=…`, `FAIL` or `CANCELLED`, with a DQI >=75 floor and HVR enforced.

**Prompt-Improver** - strengthens high-stakes prompts

Picks the best `sk-prompt` framework, applies DEPTH at the right energy and validates with CLEAR. It returns a structured package (`FRAMEWORK`, `CLEAR_SCORE`, `RATIONALE`, `ENHANCED_PROMPT`, `ESCALATION_NOTES`). The CLI mirror-card pipeline uses it, and so does `/prompt:improve --agent` (`/prompt-improve` on Codex, Cursor and Pi) when inline prompting is too weak.

**Design** - owns design decisions and artifacts

Decides values and behavior through the visual references in `sk-code-frontend`. It measures an existing surface into a Style Reference through `sk-design-md-generator`. It authors charts and diagrams through `sk-design-chart` and `sk-design-diagram`.

&nbsp;

#### DEEP LOOP

**AI Council** - several AI strategies, one vetted plan

Dispatches distinct reasoning lenses across cli-opencode, cli-claude-code and native for multi-round deliberation. Planning-only. See [Deep Loop](#7--deep-loop).

**Deep Research** - one research iteration at a time, state on disk

Executes a single LEAF pass. The `/deep:research` command owns the loop. See [Deep Loop](#7--deep-loop).

**Deep Review** - audits one review pass, read-only on code

Produces `file:line` findings. The `/deep:review` command owns the loop. See [Deep Loop](#7--deep-loop).

&nbsp;

## 11. 🧩 PLUGIN & EXTENSION LIBRARY

The framework extends each runtime through plugins and hooks rather than asking you to wire anything by hand.

&nbsp;

#### Goal Plugin

Gives a session a durable completion objective that survives across turns, instead of losing intent to context resets.

The packet's `goal.md` is the goal, and `/create:goal` writes it. A session binds to a spec packet, and the runtime then injects a short slice of that file: a pointer to it, the binding rule for a phased packet and the completion criteria, one per line.

OpenCode, Pi and Devin inject the slice on every turn, and Cursor injects it at session start. When a decision or criterion changes, the agent resends the slice and reminds you to set it. It keeps working while it waits.

Each runtime manages the goal its own way:

- **Claude Code and Codex** use the built-in native `/goal <condition>`. The speckit workflows hand you the parent `goal.md`'s chat slice to paste. Never route through `opencode_goal`, because that tool does not exist in those sessions
- **OpenCode:** `/goal-opencode bind <packet-path>` turns the packet goal into the session goal. `resent` clears the reminder, `packet <path>` reads a packet, and `set <condition>` still sets a plain text goal. Show, pause, clear and complete run through the `opencode_goal` tools
- **Pi, Cursor and Devin:** the shared core under `.skilled/hooks/goal/` injects the same objective slice. Pi also manages through `/goal-pi`, Cursor answers a session-free packet read, and Devin injects without a management surface. Cursor and Devin still record a turn on the bound record, so neither is read-only
- **DeepSeek Harness:** `DSH_SPEC_FOLDER` names the packet whose slice the session gets at start. An interactive session also manages the goal through `/goal-dsh` and the `dsh_goal` tool over the same shared core

The validator guards the goal. A phase parent or top-level packet goal has one limit, 4,000 characters, and fails only past it. A phase child whose goal has no binding row fails too.

Autonomous continuation is default-off and gated by caps, a cooldown and a kill-switch. See `.skilled/hooks/goal/README.md` for the model and `.skilled/hooks/goal/goal-plugin.md` for the OpenCode plugin contract.

&nbsp;

#### In-Session Handover

In-session handover ships off, and nothing about your sessions changes until you turn it on.

When it is on, a session that reaches 80% of its context window writes a handoff note, saves its spec packet if one is bound and ends. The `skilled-loop` wrapper then starts the same runtime in the same terminal, and the new session claims the note and carries on. Claude Code, Codex, Pi and OpenCode hand over on their own, while Cursor and Devin hand over only when you run `/speckit:handoff`.

To turn it on for every runtime, set the flag in `.skilled/hooks/hook-flags.env`, which git ignores, or export it from your shell profile:

```bash
echo 'SYSTEM_SESSION_RELAUNCH_ENABLED=1' >> .skilled/hooks/hook-flags.env
```

Then add this line to `~/.zshrc` or `~/.bashrc` with your checkout's absolute path and open a new terminal, so plain runtime launches start under the wrapper:

```bash
source /abs/path/to/skilled-agent-harness_spec-driven-loops/.skilled/bin/skilled-loop-shell.sh
```

Each runtime also has its own flag, `SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED`, with `<RUNTIME>` one of `CLAUDE`, `CODEX`, `PI`, `OPENCODE`, `CURSOR` or `DEVIN`. It overrides the global flag for that runtime whenever it holds a value. `1` turns it on and `0` turns it off. So `SYSTEM_SESSION_RELAUNCH_ENABLED=1` with `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` hands over everywhere except Claude Code.

`SYSTEM_SESSION_RELAUNCH_DISABLED=1` and `SYSTEM_HOOKS_DISABLED=1` beat every enable flag. While handover is off, `/speckit:handoff` refuses and the runtime's own auto-compaction handles a full context window.

The [session-relaunch README](.skilled/hooks/session-relaunch/README.md) covers the per-runtime adapters, hop history, safety limits and troubleshooting.

&nbsp;

#### Decision Capture

Saves the answers you give to the AI's questions, so the reason behind a choice is not lost when the session ends.

Each answer is queued as you give it. A full-auto `/speckit:save` writes it into the bound packet's `decision-record.md` as a short decision, with the question, the offered options and your answer kept word for word. Questions about process, such as which spec folder to use or whether to push, are left out. A repeat save changes nothing, and decisions you wrote by hand stay as they are.

Claude Code queues through a hook and Pi through an extension. OpenCode, Devin and DeepSeek Harness queue during the session. Each of those, and Codex, also read the stored conversation at save for anything the live path missed, so nothing is added twice.

A question you answered in plain chat is offered at save with evidence about the reply. It is added only after you confirm it.

In linked projects, each project keeps its answers in its own folder under `.skilled/skills/.state/decision-capture/`. Projects linked to one checkout never see each other's answers. To turn it off, set `SYSTEM_DECISION_CAPTURE_DISABLED=1`. The [hooks README](.skilled/hooks/README.md) lists the adapters.

&nbsp;

#### OpenCode Plugins

Twenty-one JavaScript plugins live in `.opencode/plugins/`, where OpenCode finds them. Each one translates OpenCode events into the same shared policy cores the other runtimes call. They load on OpenCode 2 (recommended) and OpenCode 1 (fallback) alike. When both are installed, `OPENCODE_BIN=opencode1` keeps CLI dispatches on OpenCode 1.

- **Gates:** the spec-folder gate and two completion checks that ask for evidence before a task is called done
- **Routing:** the skill advisor's prompt-time brief, and a guard that suggests Code Mode when a native MCP call should go through it
- **Quality and safety:** post-edit code checks, git commit advisories and the commit message gate, deep-loop and build-freshness guards, a Codex hook watchdog, a CLI dispatch audit, a screen for instructions hidden in fetched web pages, a dotenv guard that refuses reading or writing `.env` files, undoes a dotenv write a shell call made anyway, reports a dotenv value in its output and offers three value-free inspection tools instead, an overlay guard that refuses a write to a file an overlay owns in a vendored tree, and a guard that sends a turn ending in a typed option menu back to ask through the question tool
- **Sessions:** the goal plugin, session cleanup, the in-session handover relaunch and the history lookup offer after a compaction

Every plugin except the git message gate has an off switch, listed in the [hooks README](.skilled/hooks/README.md). `SYSTEM_HOOKS_DISABLED=1` turns them all off at once.

&nbsp;

#### Pi Extensions

`.pi/extensions/` holds Pi's discovery mirror: `*.ts` extension entries (relative symlinks into their owners' trees) plus two local extension packages.

`tsconfig.pi.json` at the repository root type-checks three of those entries, `session-relaunch.ts`, `spec-gate-classify.ts` and `spec-gate-enforce.ts`, against the local Pi type stubs in `.pi/types/`, with no emit.

##### ⭐ `pi-cache-optimizer` ("Cache Pi")

Our custom extension, vendored in `.pi/extensions/` as the live runtime source. It is a fork of the upstream jiangge/pi-cache-optimizer repository (MIT). It improves provider-side KV / prompt cache hit rates for every model Pi can reach:

- Reorders stable system-prompt content ahead of dynamic context so providers can cache the stable prefix
- Compresses Pi skill listings and strips session-overview churn
- Adds a conservative `prompt_cache_key` fallback for OpenAI-compatible providers and warns once about proxy cache-routing gaps
- Read-only footer cache stats, plus `/cache-optimizer stats` showing input cost and savings against an uncached baseline
- Stops paid retry loops by tracking tool-call batches and escalating only when a whole batch fails repeatedly

`.pi/extensions/` also holds `pi-fast-mode-w-subagent-support`, for fast mode with subagent support. Its symlinked guard bridges run the same shared cores as the OpenCode plugins, from the spec gate and session context to the advisor brief, goal, git checks and the in-session handover relaunch. Community packages load via `.pi/settings.json`: `rpiv-ask-user-question`, `rpiv-todo`, `pi-blackhole`, `pi-statusline`, `pi-web-access`, `pi-btw`, `pi-plan-build`, `pi-claude-code-ui`.

&nbsp;

#### DeepSeek Harness Bundle

DeepSeek Harness loads plugins only from the patches a run names. `.dsh/patches/guards.patch.yml` loads `.dsh/plugins/repo-guards/`. Its adapters live in the hook library beside their cores and reach the bundle through links that `/doctor:runtime-mirrors` checks.

- **Before a tool call, able to stop it:** dispatch preflight, the spec-folder gate, the MCP route guard, the overlay guard, the dotenv guard and the git message gate
- **After a tool call, as advice on its result:** post-edit quality, the git advisory, the dispatch audit log, the dotenv guard's check for a changed dotenv file or a printed value, and the injection screen on fetched pages and MCP results
- **At session start and each turn:** the session context and the bound packet goal, plus the skill advisor brief, `/goal-dsh` and six warn-only checks in an interactive session
- **Around the session:** context again after compaction, the completion-evidence nudge and live decision capture, plus an autosave at close in an interactive session

DeepSeek Harness loads the dotenv file of the folder it starts in, so the dotenv guard there also refuses a shell command that prints a loaded value, such as `printenv`. Claude Code, Devin and Cursor carry their own deny lists for dotenv files as a second layer. The [guard README](.skilled/hooks/env-secret-guard/README.md) says how far each list goes.

In fan-out lineages, the lineage patch adds a marker row that keeps the four interactive-only adapters off and every guard on. See [`.dsh/SYNC.md`](.dsh/SYNC.md).

&nbsp;

#### Shared Hook Cores

`.skilled/hooks/` carries the runtime-agnostic cores the plugin adapters call into.

The cores are `goal`, `dispatch`, `decision-capture`, `spec-gate`, `completion`, `mcp-route-guard`, `overlay-guard`, `env-secret-guard`, `permission-policy`, `post-edit-quality`, `classifier-injection-screen` and `ask-surface`. The git cores are `git`, `git-hooks-check`, `git-preflight`, `git-message-gate`, `git-live-follow`, `git-primary-reconcile`, `git-worktree-guard` and `hook-install`. The rest are `session-cleanup`, `session-lifecycle`, `session-relaunch`, `skill-advisor`, `task-dispatch`, `directive-lifecycle`, `dist-freshness` and `codex-watchdog`, plus `shared` for the helpers they all use.

The [hooks README](.skilled/hooks/README.md) holds the coverage matrix: which runtime runs each hook, and why a runtime that skips one cannot carry it. Codex runs a repository hook only after you approve that entry. Open `/hooks` after an update and approve every entry it lists as needing review. Its shell matchers name both `exec` and `Bash`, the tool's name from Codex 0.160 on.

&nbsp;

## 12. ⌨️ COMMAND LIBRARY

45 commands: 43 in six groups plus two utilities. The grouped ones are Markdown files under `.skilled/commands/`, and most hand their steps to a YAML workflow beside them. The OpenCode-only `/goal-opencode` is authored in `.opencode/commands/`.

&nbsp;

#### SPEC KIT

**`/speckit:plan --intake-only`** - intake-only mode

A mode of `/speckit:plan`, not a separate command. It sets up a new spec folder with its `spec.md` and metadata and stops there. `/speckit:plan` and `/speckit:complete` run the same intake on their own when a folder is missing or incomplete. Modes: `:auto`, `:confirm`.

**`/speckit:complete`** - build a feature end to end

The end-to-end workflow: intake/delegate → research → plan → implement → verify → save continuity. It sets up a missing or incomplete spec folder first, and goes straight on when the folder is healthy. After 3 failed implementation attempts, it surfaces diagnostics and lets the user dispatch `@debug` via the Task tool.

- Modes: `:auto` (fully autonomous), `:confirm` (pause at each step), `:autopilot` or `:unattended` (unattended autopilot)
- Modifiers: `:with-research` (runs a research pass before planning), `:with-context` (loads a context package), `:with-phases` (decomposes into phase children)

**`/speckit:plan`** - planning only

Authors `spec.md`, `plan.md` and `tasks.md` without implementing. It dispatches up to 4 parallel context agents for codebase exploration during planning. Use it when you need stakeholder review before coding. Modes: `:auto`, `:confirm`, `:autopilot`. Modifiers: `:with-context`, `:with-phases`.

**`/speckit:implement`** - execute an existing plan

Requires `plan.md` to already exist. A 9-step workflow covers task breakdown, implementation, testing and verification. Modes: `:auto`, `:confirm`, `:autopilot`.

**`/speckit:resume`** - pick up where you left off

Continues a previous session by auto-loading continuity from the spec folder. It presents a session summary and shows progress against `tasks.md`. It works after crashes, compactions or new sessions.

**Spec-first command chains**

```text
/speckit:plan --intake-only
  ├─► /speckit:plan -> /speckit:implement
  ├─► /deep:research -> /speckit:plan
  └─► /speckit:complete
       └─► reuses the shared intake contract from /speckit:plan --intake-only when folder_state still needs intake
```

`/deep:research` joins that chain only after a real `spec.md` exists.

&nbsp;

#### CONTINUITY

**`/speckit:save`**

Updates packet continuity and supporting generated context artifacts via `generate-context.js`. The AI composes structured JSON with session summary, key decisions and findings. The save writes continuity frontmatter and generated metadata in place. When the packet's `trigger_phrases` change, regenerating the trigger index is a separate step.

**`/speckit:handoff`** - hand the work to a fresh session now

Writes the handoff note and prepares the relaunch record. Under the wrapper the runtime then restarts in the same terminal and the new session claims the note. Outside the wrapper it prints the command that continues the work in a new session.

It is the only trigger on Cursor and Devin. Claude Code, Codex, Pi and OpenCode reach the same steps on their own near the context limit. It refuses while in-session handover is off, see [In-Session Handover](#in-session-handover).

**`/speckit:search`**

Two lexical lanes over spec docs and skill docs: trigger-index lookup with `--triggers`, which on a zero-hit also checks spec docs the index does not list yet, ripgrep recipes otherwise. `--paths` and `--count` pick the recipe, and `--packet <specFolder>` narrows the search roots. A phrase nobody wrote is a clean no-hit, never a nearest guess.

&nbsp;

#### CREATE

**`/create:skill`** - unified skill creation and update workflow

Creates `SKILL.md` with 8-section structure, `README.md`, references and assets directories. It registers nothing: discovery reads `graph-metadata.json`, and the advisor refresh stays with the operator. Modes: `:auto`, `:confirm`.

**`/create:skill-parent`** - parent skill with nested modes

Scaffolds a parent skill with nested mode packets: one hub identity plus a `mode-registry.json` source of truth the modes project from. It generates the routing-only `SKILL.md`, a single hub `graph-metadata.json`, N mode packets and a non-discoverable `shared/`. It is the reusable pattern behind `system-deep-loop`. Modes: `:auto`, `:confirm`.

**`/create:agent`** - new agent definitions

Scaffolds a new agent definition with proper frontmatter, behavioral rules and tool permissions. It creates the source-of-truth file in `.skilled/agents/` and the Claude Code mirror. Modes: `:auto`, `:confirm`.

**`/create:readme`** - folder READMEs

Creates a folder README, general or code-folder, using `sk-doc` quality standards. It auto-detects the folder type, loads the appropriate template and validates via DQI scoring: Structure 40, Content 30, Style 30. Modes: `:auto`, `:confirm`.

**`/create:changelog`** - formatted release notes

Auto-detects recent work from spec folder artifacts or git history. It resolves the correct component folder and calculates the next version number. Then it generates a formatted changelog file in the shape the existing entries share. Modes: `:auto`, `:confirm`.

**`/create:feature-catalog`** - feature catalog packages

Creates or updates feature catalog packages with category routing. It generates both technical reference entries and simple-terms companion entries. It validates the package structure and its root catalog document.

**`/create:manual-testing-playbook`** - manual testing scenarios

Creates or updates manual testing playbook packages. It picks each scenario's style with one rule. The scenario is either a single prompt an operator runs and judges, or a scripted conversation the shared runner plays into Claude Code, OpenCode, Codex, Pi or Devin with a shell check after every turn. `:confirm` shows each style before generation.

It generates scenario files with test steps, expected results and verification evidence fields. It validates against the established playbook format, including every conversation script.

**`/create:goal`** - spec packet goals

Authors or revises a packet's `goal.md`: top-level, phase parent, phase child, retrofit, phase-add and amend. It starts from the template for the goal's kind, checks the result and prints the chat slice to set as the session objective. Modes: `:auto`, `:confirm`.

**`/create:command`** - new slash commands

Creates or updates a slash command set: the Markdown entry point plus its `:auto` and `:confirm` workflow assets. Modes: `:auto`, `:confirm`.

**`/create:benchmark`** - benchmark packages

Authors or updates a benchmark package for a skill or mode, keyed by benchmark family. Modes: `:auto`, `:confirm`.

**`/create:diff`** - before and after document review

Builds a self-contained HTML report comparing two versions of a document, unified or side by side. Modes: `:auto`, `:confirm`.

**`/create:repo-rule`** - repository rules

Creates, revises or retires a rule under `repo-rules/` and wires it into `REPO RULES.md`. Modes: `:auto`, `:confirm`.

**`/create:with-human-voice`** - plain-language pass

Applies the Human Voice Rules to a file or passage, or scores it against them, then re-scans the result. Modes: `:auto`, `:confirm`.

&nbsp;

#### DEEP

The active autonomous loop families. See [Deep Loop](#7--deep-loop) for how they run. Use `@context` for one-shot retrieval before planning. All three accept the modes `:auto` and `:confirm`.

- **`/deep:ai-council`** - plan hard decisions with several models. Multi-seat planning for complex decisions, planning-only
- **`/deep:research`** - research until the answer holds. Iterative research until convergence, anchored to a real `spec.md`, with `new`/`resume`/`restart` lifecycle
- **`/deep:review`** - audit code until it is clean. Iterative code audit until convergence, ending in a PASS/CONDITIONAL/FAIL verdict

&nbsp;

#### DESIGN

All three accept the modes `:auto` and `:confirm`.

- **`/design:extract`** - measure a live site's design. Crawls a live URL and writes a Style Reference `DESIGN.md` of measured tokens through `sk-design-md-generator`
- **`/design:chart`** - build a chart that answers one question. Picks one of 29 chart forms for what the reader compares and writes a standalone HTML file
- **`/design:diagram`** - draw a diagram. Writes an HTML and SVG diagram in one of 27 types, an ASCII or Markdown flowchart or a redraw of a draw.io or Mermaid source

&nbsp;

#### DOCTOR

Seventeen commands check and repair the setup, one per area. Eleven of them belong to the `system-skilled-doctor` skill, which owns the commands that install Skilled in a project and keep it current there. The other six stay with the skill whose own checks they run: `/doctor:sk-code` and `/doctor:ci` with `sk-code`, `/doctor:git` with `sk-git`, `/doctor:sk-skill` with `sk-doc`, `/doctor:skill-advisor` with `system-skill-advisor` and `/doctor:deep-loop` with `system-deep-loop`.

Every target that writes asks for your yes first. When a prompt describes a problem one of them owns, the skill advisor suggests that command. `/doctor:helper` ranks them for you when you are not sure.

| Command | Targets (default first) | Reads only | Writes after your yes |
| --- | --- | --- | --- |
| `/doctor:helper` | one problem in plain words | the ranked pick | none, a writing command is printed for you to run |
| `/doctor:setup` | none | every leg | none |
| `/doctor:install` | none | the guide | none, the printed commands are for you to run |
| `/doctor:symlink` | `check`, `link`, `unlink` | `check` | `link`, `unlink` |
| `/doctor:speckit` | retrieval | the index, lookup and recipe checks | a report and state file in the packet's `scratch/` |
| `/doctor:skill-advisor` | `tune`, `rebuild`, `skill-graph-freshness`, `router-reach`, `skill-budget`, `parent-skill` | the four audits | `tune`, `rebuild` |
| `/doctor:deep-loop` | `--scope=research\|review\|council\|both\|all` | the graph and convergence read | a state file in the active spec folder's `scratch/` |
| `/doctor:runtime-mirrors` | none | the mirror check | none |
| `/doctor:sk-code` | `setup`, `quality` | `setup` | `quality` (creates the quality config once) |
| `/doctor:sk-skill` | `check`, `convert` | `check` | `convert` |
| `/doctor:ci` | `report`, `scaffold`, `toggle` | `report` | `scaffold`, `toggle` |
| `/doctor:git` | `setup`, `hooks`, `standards` | `setup` | `hooks`, `standards` |
| `/doctor:mcp` | `install`, `debug` | `debug` | `install`, and `debug --fix` repairs |
| `/doctor:update` | `check`, `align`, `apply`, `rollback`, `record-base`, `compat` | `check` (`align` writes only its own run folder) | `apply`, `rollback`, `record-base`, `compat` |
| `/doctor:overlay` | `status`, `apply`, `repin` | `status` | `apply`, `repin` |
| `/doctor:agents-md` | `check`, `embed`, `restore` | `check` | `embed`, `restore` |
| `/doctor:env` | `list`, a section or one variable | `list` and lookups | a saved preference |

**`/doctor:helper [<problem in plain words>] [--json]`** - the way in when you are unsure of the command

Ranks the doctor commands against a problem in your own words and shows at most three. Each comes with its mutation class and the route phrase it matched. A read-only pick runs in place. A command that writes is printed as one line for you to run, so it asks for its own yes under its own gate. The helper is built from `_routes.yaml` at run time, so a new doctor command appears in it with no edit to it.

**`/doctor:setup`** - read-only onboarding and health check

Runs the sk-code, sk-git, trigger index, runtime mirror and skill advisor checks, and names one repair command for each failure. It shows the last session hop from the hop history, and any handoff note nobody claimed. It counts orphaned helper processes, including a model server whose launcher died, and prints the command that lists them. It lists every other doctor command, and writes nothing.

**`/doctor:install [--root <dir>] [--runtimes <list>] [--json]`** - the ordered steps that install Skilled in your own project repo. The [install guide](INSTALL-SKILLED.md#3-link-it-into-your-project) walks through every step

It checks both builds and asks for the target repo, the runtimes, the link shape and the instruction choice in one prompt. It runs the symlink check, then prints the ordered setup commands with each command's class and one line of why. The steps are `/doctor:symlink link`, `/doctor:agents-md embed` unless the instruction files are linked, `/doctor:mcp install`, `/doctor:git setup` and `/doctor:setup`. It never runs a writing command. Every step that writes is printed for you to run.

**`/doctor:symlink [check|link|unlink] [--root <dir>] [--runtimes <list>] [--mode <shape>] [--plan-digest <digest>] [--run <dir>] [--yes] [flags]`** - the Skilled framework links in another project repo. The [install guide](INSTALL-SKILLED.md#what-gets-linked) explains the link shapes

- `check` (the default, read-only) reports one line per entry, then the repository warnings, and writes nothing
- `link` prints the plan and its digest, asks once, then links `.skilled` and the runtime folders you chose into that repo. A link is either the whole folder or a real folder holding one link per entry, so the repo keeps its own files beside them. `--mode auto` picks the shape per folder. Ignore lines go to `.git/info/exclude` by default, and the undo is the unlink command the run prints
- `unlink` shows the plan the recorded run describes, asks once, then removes what that run created

Only a broken link that points into the Skilled checkout is replaced. A real file is never overwritten. `--root <dir>` names the target repo. The checkout itself, or a folder inside it, is refused.

**`/doctor:speckit`** - spec-kit retrieval

Checks that the generated trigger index is fresh, that its lookup runs and that the ripgrep recipes return results. It names the regeneration command when the index is stale. It reports `OK`, `STALE`, `ATTENTION` or `MISSING`. Weak trigger phrases are listed as advisories and never change the status.

It also offers the citation-drift census over all docs or skill docs only, read-only and with no model call. The census summarises moved, gone and past-end citations per doc family, with each moved citation's new path.

**`/doctor:skill-advisor <target>`** - skill advisor tuning, rebuild and audits

- `tune` re-tunes the scoring lanes after a per-skill review
- `rebuild` rebuilds `skill-graph.sqlite` from the checked-in `graph-metadata.json` files through the advisor CLI, after a backup it restores when the rebuild fails
- `skill-graph-freshness`, `router-reach`, `skill-budget` and `parent-skill` are read-only audits

With no target it shows an interactive menu. Examples: `/doctor:skill-advisor rebuild --dry-run`, `/doctor:skill-advisor router-reach --hub=sk-doc`.

**`/doctor:deep-loop [--scope=research|review|council|both|all]`** - deep-loop coverage graphs and convergence, read through the loop's own scripts

For research and review scopes, it also lists the unresolved `[SOURCE: path:line]` tags per lineage.

**`/doctor:runtime-mirrors`** - checks the agent, command, prompt and hook mirrors each runtime directory derives from `.skilled`, and names the repair command for any that drift

**`/doctor:sk-code [setup|quality] [--prompt=<text>] [--dry-run]`** - the read-only sk-code setup battery, plus the `quality` target, which reports the repository quality config and creates `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` once after approval

- `setup` runs the provisioning, doctor, root-metadata, route guard, sync, drift-guard, derived-freshness, route-probe and quality checks and names the repair command for each failing leg
- `quality` shows which quality config the gate reads and checks it. It names the comment-hygiene rules it switches off and lists the checklists and override rows the gate would apply, failing on a refused section or an unknown rule id. When there is none it creates `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` once after your yes. In a repository with no `specs/` folder it suggests the spec-kit hygiene rules without writing them

**`/doctor:sk-skill [check|convert] [<name-or-path>] [--json] [--into-hub <hub>] [--dry-run]`** - how far a skill is from the Skilled format, and the conversion that closes the gap

- `check` (the default, read-only) reports rows C1 to C13 for one skill, or one row per skill root for the whole fleet, and names the repair for each finding. `--json` prints that report and nothing else. `--into-hub <hub>` reports the eleven surfaces a skill or mode still needs under that hub instead of the rows. A skill inside another repository's `.skilled/skills` is judged against that repository, and each of its rows names the repository it read rather than the checkout you ran from
- `convert` prints a plan for a plain agent skill or an older Skilled one and writes only after your yes. It backs each file it overwrites up under `.skilled/skills/.state/doctor-sk-skill/<name>/` first, and stops when the parsed router would change. `--dry-run` ends after the plan. Three follow-ups are asked as their own question: a plain skill's intent phrases, at least eight of them, a description past 130 characters, and a skill with no `allowed-tools` field, whose question offers the list the plan proposes. A hub candidate is refused with `/create:skill-parent` named

**`/doctor:ci [report|scaffold|toggle]`** - GitHub Actions workflows and their on/off switches

- `report` (the default, read-only) lists every workflow with its switch state, triggers, path filters and drift flags
- `scaffold` writes one new workflow under `.github/workflows/` from the CI surface's templates, after your yes. It refuses an existing file and a protected workflow name
- `toggle` switches one repository variable from the CI profile off (it sets the variable to `off`) or back on (it deletes the variable), after your yes. Here those are the six `SKILLED_CI*` variables. It refuses a variable that skips a status check the branch ruleset requires, so `SKILLED_CI` and `SKILLED_CI_MESSAGES` stay unset for the message-contract check, as the [workflows README](.github/workflows/README.md#onoff-switches) says. It refuses a change to the state the variable already has. It asks a second named confirmation before it switches off a protected workflow such as `gate-inputs.yml`

All three routes read the repository CI profile, `.skilled/skills/sk-code/sk-code-ci/repository/ci.json`, for the branch, the switch names, the protected workflows and the README. A profile whose `repository` field names another repository is ignored, and one left at `.sk-code/ci.json` is refused. Another repository without one gets a generic default that forces none of these.

**`/doctor:git <hooks|standards|setup>`** - your own settings for the shipped git hooks and sk-git rules, and a check of which ones are live

- `hooks` lists the optional git hook gates with their saved settings and switches one on or off
- `standards` shows which commit, PR and branch rules are enforced, and changes them in the repository's own `.sk-git/` copy of the templates
- `setup` checks eleven sk-git settings read-only and names one repair command for each failure

Each change waits for your approval, and `--dry-run` shows the plan without writing.

**`/doctor:mcp install|debug`** - MCP infrastructure repair

- `install` installs dependencies and builds Code Mode when its `dist` is missing or stale. It configures `.utcp_config.json` manuals and registers Code Mode in the seven project runtime configs, each write after its own approval
- `debug` diagnoses Code Mode with PASS/WARN/FAIL per check. It supports `--fix` for guided repair

A flag the chosen sub-action does not accept is refused before any workflow loads, with the flag it does accept.

**`/doctor:update [check|align|apply|rollback|record-base|compat]`** - update the framework from a new release

Checks what a release changes, applies it after your approval and can roll it back. `compat` moves a v3 checkout to the v4 `specs/` layout, and `--dry-run` previews the move.

**`/doctor:overlay [status|apply|repin] [--json] [--audit] [--root <dir>] [--capture|--adopt <path>|--relayout] [--upstream|--to|--rollback <value>]`** - a vendored Skilled copy's own changes. The [install guide](INSTALL-SKILLED.md#4-copy-it-into-your-project) says when a project needs them

- `status` (the default, read-only) prints one line for each destination that is not in sync, with the fix the engine names. It writes nothing. `--json` prints the engine's report and nothing else, and `--audit` adds one line per unowned vendored path that drifted from upstream at the pin
- `apply` shows the `status` report as its plan, asks once, then writes the overlays and runs the manifest's regenerate and verify steps. It writes nothing while a destination holds an edit made in the live copy or a conflict, and the run names the fix for each
- `apply --capture <path>` moves one live edit into its overlay source and asks only when that path is a live edit
- `apply --adopt <path>` brings one vendored file or folder that no overlay owns under a new manifest entry, then applies. With `"strictWrites": true` in the overlay manifest, the guard refuses a write to such a path until it is adopted
- `apply --relayout` shows the engine's `LAYOUT` lines as its plan and asks once, then moves each overlay source kept off its layout path onto it, with a backup in the overlay folder's relayout-runs folder and the manifest pointed at the new path, then applies so the destinations catch up
- `repin --upstream <dir> --to <commit>` stages the move to a newer upstream commit on a temporary copy and shows that report first. A staged report that lists a blocked overlay stops the run before the question. After your yes it backs up every path it touches before its first write
- `repin --rollback <run-id>` restores that backup after its own yes

`--root <dir>` points the command at another vendored tree. The run stages nothing and commits nothing.

**`/doctor:agents-md [check|embed|restore] [--json] [--root <dir>] [--dry-run] [--plan-digest <digest>] [--run <dir>] [--yes]`** - your root `AGENTS.md` against the shipped template

- `check` (the default, read-only) reports twelve rows: the install state, the sections lost or reordered, how current each shipped body is, every pin, the delivery budget, the shape of your own block, the content only you carry, the runtime copies, `REPO RULES.md` and the template's own purity. A row it cannot prove reads `UNKNOWN` rather than `PASS`
- `embed` composes in memory and shows every target with its diff, the new block, the byte budget and the lines it will keep. Then it prints a plan digest. It writes only when you give that digest back and backs up every path it touches first. Afterwards it proves that not one of your lines was dropped, and restores from the backup itself when one is
- `restore` restores exactly the paths one recorded run wrote, and removes the files, and the empty folders, that run created

A bare invocation runs `check`. A repository already in its target state prints `NOTHING TO DO`, and the run stages nothing and commits nothing.

**`/doctor:env [list | <section> | <VARIABLE>] [--dry-run]`** - guided environment switches

Shows each setting in `ENV-REFERENCE.md` and `.env.example`, with its default, its purpose and where it is set, by name only and never by value. It saves a preference to `hook-flags.env` or Claude Code's `.claude/settings.local.json` only after showing the exact line and getting your yes. Otherwise it prints an `export` line for your shell profile. It never asks for or saves a secret.

&nbsp;

#### UTILITY

**`/prompt:improve`**

Refines prompts and prompt packages through 7 proven frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT). It applies the DEPTH thinking methodology with CLEAR quality scoring. It can return inline improvements or route to `@prompt-improver` for higher-stakes prompt packages.

**`/goal-opencode`**

Binds the OpenCode session goal to a packet's `goal.md`, or sets a plain objective the agent keeps working toward across turns. Claude Code and Codex use their built-in `/goal` instead. See [Goal Plugin](#goal-plugin) above for the full contract.

&nbsp;

## 13. 🔌 CODE MODE MCP

Code Mode MCP gives the AI access to external tools (Figma, GitHub, Chrome DevTools, ClickUp, Webflow) through a single TypeScript execution interface.

Instead of loading large external tool definitions into context, Code Mode loads them on demand through one interface (1.6k tokens). That is a 98.7% reduction.

&nbsp;

#### Native MCP Servers

`code_mode` is the only registered MCP server: 7 tools for external tool orchestration via TypeScript execution.

The Skill Advisor is deliberately not one. It runs as a resident daemon behind `node .skilled/bin/skill-advisor.cjs` and registers nothing.

&nbsp;

#### Code Mode Tools (7)

| Tool | What it does |
| --- | --- |
| **`search_tools`** | Find relevant tools by task description |
| **`tool_info`** | Return complete tool parameters and TypeScript interface |
| **`call_tool_chain`** | Execute TypeScript code with access to all registered tools |
| **`list_tools`** | List all currently registered tool names |
| **`register_manual`** | Register a new tool provider |
| **`deregister_manual`** | Remove a tool provider |
| **`get_required_keys_for_tool`** | Check required environment variables for a tool |

&nbsp;

#### External Integrations (via `.utcp_config.json`)

14 templates are registered. Seven carry a description here. The rest back a `mcp-tooling` mode of the same name or ship without a mode packet of their own.

Code Mode reads each key under its manual's name: the manual name with every underscore doubled, an underscore, then the variable the config references. `.env.example` lists every key in that form, and `get_required_keys_for_tool` names the keys a tool expects.

All of them run as MCP over stdio.

| Manual | What it does | Key |
| --- | --- | --- |
| **`chrome_devtools_1`** | Browser automation (instance 1) | None |
| **`chrome_devtools_2`** | Browser automation (instance 2) | None |
| **`chrome_devtools_live`** | Attaches to the user's own running Chrome with `--autoConnect`, for work that needs their signed-in sessions. Opens background pages and closes only its own. Needs remote debugging switched on at `chrome://inspect/#remote-debugging` | None |
| **`clickup_official`** | Official hosted ClickUp MCP via `mcp-remote`. Used by the `mcp-click-up` skill | None. The first launch asks for one OAuth approval in the browser |
| **`figma`** | Design files, components, exports. This is the optional Code Mode MCP. The primary Figma surface is the `mcp-figma` skill via `figma-ds-cli` | `figma_FIGMA_API_KEY` |
| **`github`** | Issues, pull requests, commits | `github_GITHUB_PERSONAL_ACCESS_TOKEN` |
| **`webflow`** | Sites, CMS collections | `webflow_WEBFLOW_TOKEN` |
| **`aside`**, **`mobbin`**, **`notion`**, **`obsidian`**, **`refero`** | Each backs the `mcp-tooling` mode of the same name | |
| **`magnific`** and **`gitkraken`** | Registered with no mode packet of their own | |

&nbsp;

#### Performance

| Measure | Upfront loading | Code Mode |
| --- | --- | --- |
| **Context tokens** | Large external tool schemas loaded upfront | 1.6k on-demand |
| **Round trips** | 15+ for chained operations | 1 TypeScript chain |
| **Type safety** | None | Full TypeScript |
| **Context reduction** | | 98.7% |

To call a Code Mode tool: `call_tool_chain({ code: "return await figma.figma_get_file({fileKey: 'abc123'})" })`

For more on the `mcp-code-mode` skill and TypeScript execution patterns, see the skill at `.skilled/skills/mcp-code-mode/SKILL.md`.

&nbsp;

## 14. 🌿 GIT WORKTREE / LIVE SYNC

The repo runs a live-sync loop around the worktree-per-session model.

Every launch-wrapper session commits in its own isolated worktree and auto-publishes each commit to a shared live branch. The main checkout auto-follows that branch, so the IDE always shows the combined state of every concurrent session's committed work.

A worktree made with `.skilled/skills/sk-git/scripts/worktree-naming.sh create` is provisioned on creation. Its dependencies install and spec-kit's runtime and CLI build, so validation and the continuity writer run in it at once. `worktree-naming.sh provision` does the same for a worktree made another way.

**Switches**

The loop is **on by default** in the main checkout. SessionStart self-heals the git hook install and backgrounds the IDE follower automatically. The follower starts with Claude Code, Codex, Cursor, Devin, OpenCode, Pi and interactive DeepSeek Harness sessions.

- `SYSTEM_LIVE_SYNC_DISABLED=1` disables the whole loop
- `SPECKIT_AUTOSYNC=0` for the publish leg
- `SPECKIT_GIT_HOOKS_GUARD=off` for the guard
- `SYSTEM_LIVE_FOLLOW_DISABLED=1` for the follower
- `SYSTEM_PRIMARY_RECONCILE_DISABLED=1` for the reconcile step

See `.skilled/skills/sk-git/references/continuous-integration.md` for the full model.

&nbsp;

## 15. ⚙️ CONFIGURATION

<a id="customizing-for-your-stack"></a>

&nbsp;

### 🎯 Customizing for Your Stack: Start with `sk-code`

This repo ships as a **public template**. Of the skills it ships with, only one carries stack-specific content. Start there.

**`sk-code`** is stack-specific, the customization point. It holds surface-aware code-quality patterns. Keep the native Skilled surface, and add a surface of your own for another stack (Next.js + Tailwind + Postgres, React Native + Reanimated, Go + sqlc, etc.). It includes the findings-first `code-review` mode that reuses these surfaces as review evidence.

Every other shipped skill is codebase-agnostic:

| Skill | What it covers |
| --- | --- |
| **`sk-doc`** | Markdown quality and component creation. Works for any project |
| **`sk-git`** | Worktree, commit and PR workflow. Works for any project |
| **`sk-design`** | Parent hub for design work over three modes: design-reference extraction from a live URL into a v3 Style Reference `DESIGN.md` (`sk-design-md-generator`), standalone HTML charts across 29 forms (`sk-design-chart`) and HTML/SVG diagrams across 27 types (`sk-design-diagram`). Pairs with `sk-code` for the build. Works for any project |
| **`system-spec-kit`** | Spec folder workflow, validator and continuity. Works for any project |
| **`system-skill-advisor`** | Prompt-time skill routing over the shared skill graph. Works for any project |
| **`system-skilled-doctor`** | Doctor commands that install, link, update and check Skilled in a project, and keep a vendored copy's overlays. Works for any project |
| **`mcp-code-mode`** | Multi-tool MCP orchestration. Works for any project |
| **`system-deep-loop`** | Parent hub for the unified deep-loop skill (research, review and ai-council modes) over nested `runtime/` infrastructure. Works for any topic / target |
| **`sk-prompt`** | Prompt-engineering framework. Works for any project |
| **`cli-external-orchestration`** | Parent hub for external CLI dispatch: routes to `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi` and `cli-deepseek-harness`. Stack-independent |
| **`cli-classifier`** | Parent hub for typed-judgment transports: routes to `cli-jev` (Pi's classifier first for yes-or-no and choice questions, the `jev` CLI otherwise) for a probability, an option key, a score position or a batch of keyed answers. Stack-independent. Needs the `jev` CLI on PATH (`uv tool install jev-cli`) and a key stored with `jev auth set --provider official`, which also turns on its four measured features |
| **`mcp-tooling`** | Parent hub for eight MCP tool bridges, each described under [MCP Integration](#mcp-integration). Stack-independent |
| **`cli-orca`** | Drives the Orca app's worktrees, terminals, browser and automations from a dispatch. Works for any project that runs Orca |

&nbsp;

#### Adding Your Own Skills

The shipped set is intentionally minimal. Most teams add their own: project-specific workflows, ops runbooks, domain-specific reviewers. Drop them into `.skilled/skills/<your-skill>/` and the advisor picks them up. The shipped skills stay agnostic so upstream updates apply cleanly to your fork.

&nbsp;

#### What Adapting `sk-code` Looks Like

`sk-code` ships three surfaces. The Skilled surface holds the standards for this framework's own code, so keep it. The CI surface holds the GitHub Actions workflow standards. The Frontend surface holds stack-agnostic web frontend practice (markup, CSS, accessibility, i18n, performance and the five-pass Figma check). It also holds the visual references that decide a value: spacing, type, colour and elevation scales, the hierarchy method and visual review pass, and motion and interaction rules. Add a surface of your own when you want the hub to carry another stack.

- **Remove an unused surface** by following [Remove A Surface](.skilled/skills/sk-code/README.md#remove-a-surface) in the sk-code README
- **Add your own surface** with `/create:skill-parent update --surfaces <name>`, which scaffolds and registers it ahead of the Skilled surface
- **Keep a surface private** in a `local-<name>` skill beside the hub. The skill names `"family": "sk-code"` and declares a `surface_detection` block with `"role": "specific"` in its own `graph-metadata.json`. Git ignores `local-*` skills, so the surface stays out of the repository. Stack detection tries the hub's own specific surfaces first, then the surfaces that skills outside the hub declare, sorted by skill id, then SKILLED last as the fallback. See [Declaring an External Surface](.skilled/skills/sk-code/shared/references/stack-detection.md#declaring-an-external-surface)
- **Drop or replace a rule** with a `## Rule overrides` section in a checklist your `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` names, or switch off comment-hygiene rules with `commentHygiene.disableRules`. The quality and review modes read the same section, so a rule you drop does not come back as a review finding. A section the linter refuses stops the quality run with `CONFIG_INVALID`. See the [rule overrides contract](.skilled/skills/sk-code/shared/references/universal/rule-overrides.md)
- **Check the result** with `/doctor:sk-code setup`, which runs every check read-only and names one repair command for each failure

The [sk-code README](.skilled/skills/sk-code/README.md#4-adapting-to-your-stack) has the step-by-step guide. The other shipped skills keep working unchanged, and `sk-code`'s review mode adapts to your surfaces and your rule overrides at review time.

&nbsp;

#### What Adapting `sk-git` Looks Like

`sk-git` reads most of its settings from the repository, so you adapt it with git config and a `.sk-git/` folder rather than by editing the skill. Run every command from the repository root.

- **Commit, PR and branch rules.** Run `/doctor:git standards` to copy the shipped templates into `.sk-git/` and change a rule there. `git config skgit.contractDir <dir>` points at another folder.
- **Hook gates.** Run `/doctor:git hooks` to switch an optional pre-commit or pre-push check on or off. It saves `speckit.hooks.<key>` in local or global git config.
- **Hook trust.** The hooks are installed for the whole machine, so a clone other than the one that installed them runs their checks only after `git config --local skilled.trustRepoHooks true`.
- **Worktrees and Commit-Id.** `git config speckit.worktreeBase <dir>` moves the worktree folder. `git config --local skilled.commitId true` or `false` decides whether commits carry an id.
- **Shared files.** Each repository reads its remote branch allowlist and `hard-rules.json` from its own `.skilled/skills/sk-git/` folder. The worktree provision list comes from beside the shared helper, so it applies to every repository that shares the install.

**Verify.** Run `/doctor:git setup`, or `node .skilled/commands/doctor/scripts/git-setup-check.cjs --tool <runtime>` outside an AI runtime. It checks eleven settings without changing anything and names one repair command for each check that fails.

&nbsp;

### Core Configuration Files

| File | What it holds |
| --- | --- |
| **`AGENTS.md`** | Gate definitions, behavior rules, agent routing and capability reference. The canonical contract for all runtimes. Claude Code reads it directly, so the repository ships no CLAUDE.md file. Codex loads it as project instructions, so `.codex/` carries no copy either |
| **`opencode.json`** | Permissions, the `code_mode` MCP binding and one experimental flag. Used by OpenCode |
| **`.utcp_config.json`** | Code Mode external tool registrations. Used by the `mcp-code-mode` skill |
| **`.claude/mcp.json`** | Claude Code MCP configuration. Claude Code only |
| **Runtime folders** | `.claude/`, `.codex/`, `.opencode/`, `.cursor/`, `.pi/` and `.devin/`. Each holds a README that separates what is generated from `.skilled/` from what is authored there, and names the command that checks its mirrors: [Claude Code](.claude/README.md), [Codex](.codex/README.md), [OpenCode](.opencode/README.md), [Cursor](.cursor/README.md), [Pi](.pi/README.md), [Devin](.devin/README.md) |

&nbsp;

### Environment Settings

Every setting has a default, so you can start without setting anything. Two example files list them, and no reader loads their values. Copy a line into the place its reader looks, then uncomment it and change the value.

[`.env.example`](.env.example) lists every setting the code reads, grouped by area, with its default and what it does. [`.skilled/hooks/hook-flags.env.example`](.skilled/hooks/hook-flags.env.example) lists the switches that are also read from a file: the hook, validation and Jev switches and the hop notice.

Where you set a value depends on what reads it:

| Where | Read by | Use it for |
| --- | --- | --- |
| `export NAME=value` in `~/.zshrc` or `~/.bashrc` | Everything started from that shell | Any setting. It wins over `hook-flags.env` |
| `.skilled/hooks/hook-flags.env` | The hooks, the validators and the Jev features | The switches in `hook-flags.env.example`. [Off Switches](#off-switches) shows how to create it |
| `.claude/settings.local.json`, `env` block | Claude Code only | Settings for Claude Code sessions only |
| `.env` | Code Mode only | The provider keys in section 1 of `.env.example` |

Git ignores all four, so your values stay on your machine. `/doctor:env list` shows every setting and where it is set, by name only. `/doctor:env <NAME>` shows one setting, then saves a new value to `hook-flags.env` or `.claude/settings.local.json` after showing you the exact line. It can also print the `export` line for your profile. It never asks for a key.

&nbsp;

### Off Switches

The AI hooks, the validators, the git hooks and the CI workflows all have off switches. A switch set in the environment always works, inline as `SYSTEM_HOOKS_DISABLED=1 <command>` or exported from your shell profile. The hook switches, the two validation switches and the Jev feature switches also read `.skilled/hooks/hook-flags.env`, a personal file git ignores. A value set in the environment still wins over the file, even `0`.

```bash
cp .skilled/hooks/hook-flags.env.example .skilled/hooks/hook-flags.env
# then uncomment the switches you want on
```

- **AI hooks.** `SYSTEM_HOOKS_DISABLED=1` turns off every hook at once except the git message gate. Each hook also has its own switch, listed in the [hooks README](.skilled/hooks/README.md). The session-relaunch hooks are the one exception to on-by-default: they stay off until you turn them on globally or per runtime, see [In-Session Handover](#in-session-handover)
- **Validation.** `SPECKIT_SKIP_VALIDATION=1` switches spec folder validation off and `SKDOC_SKIP_VALIDATION=1` switches off the sk-doc validators. A skipped run says so and exits 0, so it is no evidence that a document is valid. CI sets neither
- **CI workflows.** These switches are repository variables, not environment variables, so set them under Settings, Secrets and variables, Actions, Variables. Every workflow except `dependabot-auto-merge.yml` reads the master switch `SKILLED_CI` and one group variable (`SKILLED_CI_FRESHNESS`, `SKILLED_CI_TESTS`, `SKILLED_CI_REVIEW`, `SKILLED_CI_REPORTS` or `SKILLED_CI_MESSAGES`). Only `off`, in any letter case, skips a job. An unset variable runs it. An empty value, `0`, `false`, `no` or a typo runs it too. Leave `SKILLED_CI` and `SKILLED_CI_MESSAGES` unset while the ruleset requires the message-contract check. A switched-off job reports success, so a required check that is switched off stops blocking a merge. `/doctor:ci report` shows each state. The [workflows README](.github/workflows/README.md#onoff-switches) maps each variable to its workflows
- **Git hooks, one command.** Each blocking gate names its bypass in its message, such as `SPECKIT_SKIP_COMMENT_HYGIENE=1 git commit ...`. These bypasses are read from the environment only
- **Git hooks, permanently.** `/doctor:git hooks` lists the optional gates and switches one off in git config as `speckit.hooks.<key>`. `SYSTEM_GIT_COMMIT_HOOKS_DISABLED=1` turns off every pre-commit gate at once
- **Commit, PR and branch rules.** These have no bypass. `/doctor:git standards` changes a rule in the repository's own `.sk-git/` copy of the templates, and every gate follows the change
- **The full list.** [`.env.example`](.env.example) lists every switch with its default, and [Environment Settings](#environment-settings) says where to set each one. Only Code Mode reads a `.env` file, so a switch written there counts only where your shell or runtime exports it

To stop using the git hooks, remove them and switch off the session check that would install them again:

```bash
bash .skilled/scripts/install-git-hooks.sh --uninstall
echo 'SYSTEM_GIT_HOOKS_CHECK_DISABLED=1' >> .skilled/hooks/hook-flags.env
```

&nbsp;

### Retrieval and Continuity Configuration

Nothing to configure. The trigger index is a committed file regenerated by `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`. The ripgrep recipes read the working tree, and the continuity writer updates the packet in place. There is no database, no daemon and no embedding provider on this path. The skill advisor keeps its own model-server settings.

&nbsp;

### MCP Config Shape

```json
{
  "mcp": {
    "code_mode": {
      "type": "local"
    }
  }
}
```

&nbsp;

## 16. ❓ FAQ

**Q: Must all 14 skills be installed to use the framework?**

No. Skills are loaded on demand by Gate 2, so you only need the ones relevant to your work. The two core documentation skills, `system-spec-kit` and `sk-doc`, cover most documentation workflows. The MCP and cross-AI CLI skills require additional local tooling or API keys depending on the surface.

&nbsp;

**Q: What happens if I skip the spec folder?**

Gate 3 blocks file modifications until a spec folder answer is provided. You can skip it with option D, but skipped sessions are undocumented and will not be recoverable through `/speckit:resume` or `/speckit:search`. For a trivial fix of a few characters in one file, Gate 3 does not trigger.

&nbsp;

**Q: How does retrieval know what is relevant to my current task?**

Packet continuity and supporting generated context artifacts use structured frontmatter and anchored markdown. That lets the trigger index generator classify and index them reliably.

For recovery, start with `/speckit:resume` and the packet-local continuity ladder: `handover.md` -> `_memory.continuity` -> canonical spec docs. After that, the trigger index lookup matches your prompt against author-declared trigger phrases, and the ripgrep recipes in `retrieval-conventions.md` cover free text. Both lanes are lexical, so a phrase no author declared and no document contains is a clean no-hit.

&nbsp;

**Q: What happens when a session runs out of context?**

By default the runtime's own auto-compaction takes over, as it always did. In-session handover, which ships off, can hand the work to a fresh session instead, see [In-Session Handover](#in-session-handover).

&nbsp;

**Q: Can I use this framework without the continuity features?**

Yes. The Spec Kit documentation workflow (Gate 3, spec folders, templates) works whether or not you ever run `/speckit:save`. You lose cross-session recovery, but structured documentation, agent routing and skill loading all still work.

&nbsp;

**Q: How can I add a new skill to the framework?**

Use `/create:skill` to scaffold the skill structure. The command creates the `SKILL.md`, references and assets directories following the `sk-doc` template. Discovery reads its `SKILL.md` frontmatter and `graph-metadata.json`, so no registration step follows. Adding a row to `.skilled/skills/README.txt` keeps the catalog complete for human readers.

&nbsp;

**Q: What does "local-first" mean for continuity?**

Everything is a file in your own repository. Continuity lives in the spec folder, and the trigger index is a committed JSON file. Retrieval is ripgrep over the working tree. No session data, code or context leaves the machine.

&nbsp;

**Q: How can I contribute a new agent definition?**

Define the agent in `.skilled/agents/` (the source of truth), then mirror the adapter into `.claude/agents/`. Use `/create:agent` to scaffold the file from the agent template.

&nbsp;

**Q: How many MCP tools are there and where are they defined?**

The `code_mode` server registers seven tools, listed under [Code Mode MCP](#13--code-mode-mcp). External providers are declared as templates in `.utcp_config.json` at the repo root, which currently holds 14 entries.

&nbsp;

**Q: What is the feature catalog?**

The canonical feature inventory for the `system-spec-kit` engine, at `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md`. It groups the shipped surface by capability area and maps each section to a directory under `feature-catalog/`.

&nbsp;

## 17. 📚 RELATED DOCUMENTS

**Internal documentation**

- **[→ AGENTS.md](AGENTS.md)** - agent routing, gate definitions, behavior rules
- **[→ Install Guide](INSTALL-SKILLED.md)** - install a Skilled checkout, then bring it into your own project by linking it or by copying it in with overlays
- **[→ Spec Kit README](.skilled/skills/system-spec-kit/README.md)** - spec folder workflow, Level contract template set, validation rules
- **[→ Spec-Kit Engine README](.skilled/skills/system-spec-kit/runtime/README.md)** - validation, generated metadata and runtime hook adapters
- **[→ Session Relaunch README](.skilled/hooks/session-relaunch/README.md)** - in-session handover, off by default: the handoff note, the `skilled-loop` wrapper and the shell shim
- **[→ Hooks README](.skilled/hooks/README.md)** - every runtime hook and plugin, which runtimes run each one and its off switch
- **[→ Git Hooks README](.skilled/scripts/git-hooks/README.md)** - each git hook gate, what it blocks and how to bypass it
- **[→ sk-code README](.skilled/skills/sk-code/README.md)** - the code skill and the step-by-step guide to adapting it to your stack
- **[→ Repo Scripts Runbook](.skilled/scripts/README.md)** - dry-run orphan sweeper for stale MCP helpers and temp-path strays, session cleanup and LaunchAgent template guidance
- **[→ Skill Advisor README](.skilled/skills/system-skill-advisor/README.md)** - daemon-backed CLI front door, nine advisor/skill-graph commands and routing docs
- **[→ system-skilled-doctor README](.skilled/skills/system-skilled-doctor/README.md)** - the eleven doctor commands that install Skilled in a project, plus the overlay reference for a vendored copy
- **[→ Architecture](.skilled/skills/system-spec-kit/ARCHITECTURE.md)** - API boundary contract
- **[→ sk-doc Skill](.skilled/skills/sk-doc/SKILL.md)** - documentation standards, DQI scoring
- **[→ Skills Index](.skilled/skills/README.txt)** - skills library and invocation patterns
- **[→ Feature Catalog](.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md)** - current technical reference
- **[→ Manual Testing Playbook](.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md)** - operator validation scenarios, including runtime lifecycle checks
- **[→ Release Notes](.skilled/changelog/skilled/)** - every Skilled release, one entry per version
- **[→ Spec Kit Changelog](.skilled/skills/system-spec-kit/changelog/)** - the version history of the system-spec-kit skill
- **[→ Daemon CLI Reference](.skilled/skills/system-spec-kit/references/cli/daemon-cli-reference.md)** - the advisor's daemon-backed CLI front door, its warm-only policy and its exit codes

# Skilled - Spec-Driven Agent Loops

> Spec-driven agent loops with structured documentation, packet-local memory and multi-model orchestration.

[![GitHub Stars](https://img.shields.io/github/stars/MichelKerkmeester/skilled-agent-harness_spec-driven-loops?style=for-the-badge&logo=github&color=fce566&labelColor=222222)](https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops/stargazers)
[![License](https://img.shields.io/github/license/MichelKerkmeester/skilled-agent-harness_spec-driven-loops?style=for-the-badge&color=7bd88f&labelColor=222222)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/MichelKerkmeester/skilled-agent-harness_spec-driven-loops?style=for-the-badge&color=5ad4e6&labelColor=222222)](https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops/releases)

> Like it? Please don't buy me unwanted coffee: https://buymeacoffee.com/michelkerkmeester

&nbsp;

## 1. SUMMARY
An assistant framework that gives your AI coding agent a memory, a paper trail and a team of specialists.

All of it lives inside your own repository, as files you can read and diff.

Built for Claude Code, Codex, Opencode, Pi Agent, Devin, Cursor and Hermes CLI

**What's inside**

- 📋 **Spec Kit Framework** - structured plans, task tracking, validation gates and handover docs
- 🧠 **Spec Memory & Search** - session context saved into each spec folder and recovered through instant keyword search, surviving resets and compactions
- 🎯 **Skill Advisor Daemon** - dynamic prompt-time skill suggestions using 5-lane fusion and a live skill graph
- 🔄 **Autonomous Deep Loops** - research, review and improvement loops that run unattended and stop only when their own evidence says done
- 🤖 **12 Specialized Agents** - focused roles for implementation, review, research, docs, git and more
- 🧰 **13 On-Demand Skills** - deep capabilities for code, design, docs and multi-CLI dispatch

**Why it earns a place**

- **Continuity that survives context resets:** decisions, architecture and history persist across sessions, crashes and compactions
- **Verification, not vibes:** nothing counts as "done" without fresh evidence, and code-review findings are re-challenged before they stick
- **Works the same in OpenCode and Claude Code**, with cross-CLI dispatch to five more model providers on top

&nbsp;

## 2. 🎁 WHAT YOU GET

### 📋 Spec Kit: a written record of every change

Every file change gets a spec folder that records what changed, why and how. Like a lab notebook for software.

- Documentation depth scales with the task, from a small fix to a phased architecture change
- Mandatory gates run before file changes and after execution, so "done" needs fresh evidence, not the agent's say-so
- Reviews rank findings P0/P1/P2 and re-challenge critical findings before they stick, and an open blocker forces another pass
- Every packet is plain markdown in your repo, so the history is yours to read, diff and keep

### 🧠 Spec Memory & Search: memory that survives resets

Your architecture, decisions and session history are written into the spec folder they belong to, then found again through instant keyword search.

- `/speckit:resume` reads the packet's own continuity files and picks up where the last session stopped
- A committed trigger index plus ripgrep recipes find prior work fast, with no database and no daemon on this path
- A phrase nobody wrote is a clean no-hit, never a nearest guess

### 🔄 Deep Loop: loops that finish the job

Research, review and improvement loops run unattended and stop only when their own evidence says done.

- Progress lives on disk, so a loop survives crashes, new sessions and long runs
- One shared runtime under every loop, so you learn the workflow once
- Run fully hands-off or pause at each step, your choice

### 🎯 Skill Advisor: the right skill at the right time

Type a prompt and the matching expertise loads before any tool runs. No memorizing skill names.

- A resident daemon scores your prompt across five signal lanes and renders a one-line brief
- A live skill graph tracks what each skill depends on, enhances and conflicts with
- Daemon down? A local scorer answers instead and marks itself stale rather than pretending to be live

### 🤖 Agent Library: many models, one conductor

Twelve specialized agents own focused roles, and supported runtimes can dispatch five more AI CLIs as sub-tools.

- A review can fan out across several models at once, with the safest verdict winning
- The conducting AI stays in charge. Each dispatched CLI handles the part it is best at and returns
- Every skill refuses to call itself, so delegation never loops

### 🧩 Plugin & Extension Library: a goal that survives resets and context that stays lean

The framework extends each runtime through plugins, hooks and extensions rather than asking you to wire anything by hand.

- **Goal Plugin:** binds a session to a spec packet's `goal.md` and injects the durable slice - the directive plus its completion criteria - on every turn (at session start on Cursor), so intent survives context resets instead of fading with the window
- **`pi-cache-optimizer` ("Cache Pi"):** our custom Pi extension package that keeps Pi-side context costs down across dispatches, alongside `pi-fast-mode-w-subagent-support` for fast mode with subagent support
- **Plus the rest of the extension surface:** spec-gate enforcement, skill-advisor prompt briefs, post-edit quality checks, session lifecycle and cleanup, MCP route guards and git preflight advisories - thin runtime adapters over shared policy cores in `.skilled/hooks/`

Behind them: 13 on-demand skills, 32 command entry points and the Code Mode MCP single-tool interface, each detailed in its own section below.

---

## 3. 🗺️ OVERVIEW

Three building blocks carry the whole system:

1. **Structured documentation** (Spec Kit)

   Every file change gets a spec folder recording what changed, why and how. Like a lab notebook for software.

2. **Spec memory and search**

   Session context written into the spec folder it belongs to, then found again through a committed trigger index and ripgrep recipes over the same files.

3. **Coordinated agents and skills**

   12 specialized agents routed by a gate system that loads the right skills at the right time.

From request to documented result:

```
                         YOUR REQUEST
                              │
                              ▼
         ┌──────────────────────────────────────────┐
         │       GATE SYSTEM (5 mandatory gates)    │
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
         └──────────────────────┬───────────────────┘
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
         ┌───────────────┐          ┌──────────────────┐
         │ AGENT NETWORK │          │  SKILLS LIBRARY  │
         │ 12 specialized│          │ 13 domain skills │
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
         │  specs/###-feature/ - scratch/           │
         │  4 levels - template set - 38 rules      │
         │  trigger index │ ripgrep retrieval       │
         └──────────────────────────────────────────┘
```

---

## 4. 🚀 QUICK START

### Installation

**Prerequisites**

- Node.js 20.11+ (22.12+ for the spec-kit runtime CLI)
- `npm`, `git` and a POSIX shell
- No global TypeScript needed. The launcher binaries vendor their own dependencies on first run

```bash
# 1. Clone the repository
git clone https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops.git
cd skilled-agent-harness_spec-driven-loops

# 2. Install root dependencies (file watcher + shared HTTP utilities)
npm install

# 3. Build the advisor runtime and check its CLI front door
# The CLI spawns the resident daemon on demand. Code Mode boots from its launcher when a runtime needs it.
npm --prefix .skilled/skills/system-skill-advisor/runtime install
npm --prefix .skilled/skills/system-skill-advisor/runtime run build
node .skilled/bin/skill-advisor.cjs list-tools --format json
```

### Verify Installation

```bash
# Confirm the active runtime's MCP config references the Code Mode launcher
grep -l mcp-code-mode-launcher opencode.json .claude/mcp.json .cursor/mcp.json .pi/mcp.json 2>/dev/null

# Confirm the advisor CLI enumerates all nine commands
node .skilled/bin/skill-advisor.cjs list-tools --format json
```

### First Use

Open OpenCode in your project directory. The framework is active. Try:

```
/speckit:complete Build a user authentication system
```

That one command does five things:

- Creates a spec folder
- Runs research
- Builds a plan
- Begins implementation
- Writes the session context into the packet as it goes

Come back tomorrow and `/speckit:resume` reads it back.

### Adapting to Your Stack

This repo ships as a public template.

- Only `sk-code` carries stack-specific patterns (frontend framework, animation library, CMS, backend language). Start there when forking
- The other shipped skills (`system-spec-kit`, `sk-doc`, `sk-git`, `system-deep-loop`, `cli-external-orchestration`, `mcp-tooling`) are codebase-agnostic out of the box
- Most teams add their own skills on top. Drop them into `.skilled/skills/<your-skill>/` and the advisor picks them up automatically

See the [customization guide](#customizing-for-your-stack) for the full map and step-by-step adaptation guide.

---

## 5. 📋 SPEC KIT

The Spec Kit enforces structured spec folders for every file-modifying conversation.

Gate 3 requires a spec folder answer before any file modification begins. Only a trivial fix of a few characters in one file is exempt.

#### Documentation Levels

Documentation depth scales with task complexity.

- **Level 1** - under 100 LOC. `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`. For small features, bug fixes and single-file changes
- **Level 2** - 100 to 499 LOC. Level 1 plus `acceptance-criteria.md` (scaffolded, required for closure). For features needing QA verification and multi-file changes
- **Level 3** - 500+ LOC. Level 2 file set plus architecture sections, with `decision-record.md` as an add-on. For architecture changes and complex refactors
- **Level 3+** - complexity score 80+. Level 3 file set plus governance sections inside `spec.md`. For high-complexity work needing review tracking and workstream coordination

The LOC ranges are guidance, not hard rules. Risk, complexity and the number of affected files can push a task to a higher level. When in doubt, choose the higher level.

**What each level must contain**

- `spec.md`, `plan.md` and `tasks.md` are hard requirements at initial scaffolding across every level
- `implementation-summary.md` is required after implementation completes, not at folder creation
- `acceptance-criteria.md` is scaffolded at Level 2 and above, and its satisfaction gates packet closure
- Every other add-on is lazy at every level: present when requested, skipped otherwise
- The machine contract is the `levels` section of `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json`. The `documents` section beside it is a descriptive index

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
├── resource-map.md              # Path ledger of resources the packet touched (lazy add-on, any level)
├── graph-metadata.json          # Packet-level graph metadata (auto-refreshed on save)
└── scratch/                     # Temporary workspace files
```

`resource-map.md` is a lazy add-on at any level.

- Render it by hand with the inline gate renderer when a packet wants a lean, central listing of the files, scripts and external resources it interacts with
- Command: `bash .skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh --level <N> --out-dir <packet> .skilled/skills/system-spec-kit/templates/addons/resource-map.md.tmpl`
- Deep-research and deep-review loops write a different file of the same name: an evidence ledger extracted from their deltas into the loop's own `research/` or `review/` artifact directory, never into the packet root

&nbsp;
#### Available Templates

Eighteen templates ship under `.skilled/skills/system-spec-kit/templates/`. Which ones a packet gets depends on how each document is triggered, not on its level alone.

##### Core

**`spec.md`**
- What the feature is and why it exists. 
- Required at every level.

**`plan.md`**
- How the work gets done: approach, phases and verification.
- Required at every level.

**`tasks.md`**
- The step-by-step breakdown with P0/P1/P2 priorities.
- Required at every level.

**`implementation-summary.md`**
- What shipped and how it was verified.
- Required after implementation completes, not at folder creation.

**`acceptance-criteria.md`**
- The closure gate: every row Met, Unmet, Waived or Superseded before the packet may close.
- Lives in `addons/`, scaffolded at Level 2 and above.

##### Lazy Add-ons

Render with `--with-lazy-addons` or `--with-goal` on `create.sh`, or with the inline gate renderer on an existing packet. All live in `addons/`.

**`before-after.md`**
- Record of what changed, why it changed and the resulting effect.
- For migrations, rewrites and tuning work where the delta is the story.

**`decision-record.md`**
- Architecture decision records: choices, alternatives, consequences and implementation notes.
- Required backing for any `Waived` or `Superseded` acceptance-criteria row.

**`goal.md`**
- The durable directive the packet executes against plus the criteria that decide when it is done.
- Rendered by `--with-goal`.

**`resource-map.md`**
- Lean catalog of every file path the packet analyzed, created, updated or removed, grouped by category.
- Rendered by hand through the inline gate renderer.

**`roadmap.md`**
- Forward plan for near-term, next-step and later work.
- For features that ship in stages.

**`timeline.md`**
- Chronological record of events, outcomes and milestones.
- For long-running or incident-driven work.

##### Command & Agent Owned

Written by a command or agent, not by scaffold flags. All live in `addons/`.

**`handover.md`**
- Session handover preserving context so the next session picks up cleanly.
- Written by the memory-save flow (`/speckit:save`).

**`debug-delegation.md`**
- The escalation record `@debug` writes when a stuck issue goes to a specialized debugging agent after 3+ failed attempts.

**`research.md`**
- The technical investigation a `/deep:research` loop produces: analysis, architecture patterns and implementation guidance.

##### Packet Types

A different packet shape, not a level. All live in `packet-types/`.

**`phase-parent.spec.md`**
- Spec for a phase parent that decomposes one feature into child phase packets.
- A `phase` packet needs only `spec.md`.

**`research.spec.md`**
- Spec for a research packet, which also requires `research/research.md`.

**`review.spec.md`**
- Spec for a review packet, which also requires `review/review-report.md`.

**`review-report.md`**
- The verdict, active finding counts and audited scope a review packet must produce.

&nbsp;
#### Task Priority System

Checklist items in `tasks.md` carry a priority so reviewers know what blocks shipping and what can wait.

- **P0** - Hard blocker. Cannot ship without this. Cannot defer
- **P1** - Required. Must complete or receive explicit user approval to defer
- **P2** - Optional. Can defer without approval, except under `--strict`, where an incomplete P2 blocks

How the gates read those priorities:

- `check-completion.sh` reads the verification section of `tasks.md` and requires every item to carry a P0, P1 or P2 tag. A Level 1 packet without that section exits the check unenforced
- `acceptance-criteria.md` is the closure gate and does not use priorities. Each row is `Met`, `Unmet`, `Waived` or `Superseded`, and a `Waived` or `Superseded` row must cite an ADR in `decision-record.md`
- `validate.sh` enforces `AC_CLOSURE`, failing on an unmet criterion. `AC_COVERAGE` advises on criteria carrying `file:line` citations

&nbsp;
#### Phase Decomposition

Phase decomposition splits large features into a parent spec folder (overall specification) and child folders (one per phase).

```text
specs/022-big-feature/             # Parent spec folder
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

- `create.sh --phase` creates a parent with its first child in one step
- `validate.sh --recursive` validates the parent and all children together

&nbsp;
#### Scripts and Validation

`validate.sh` runs 38 rules against a spec folder and reports what passes and what needs fixing. Rules check required files, template compliance, placeholder detection, anchor markers and cross-reference consistency.

**Spec management scripts** in `.skilled/skills/system-spec-kit/runtime/cli/spec/`:

- **`create.sh`** - create spec folders with level-appropriate templates. Use `--phase` for parent + child
- **`validate.sh`** - run 38 validation rules. Use `--recursive` for phase folders
- **`upgrade-level.sh`** - upgrade a spec folder to a higher level by injecting new sections
- **`recommend-level.sh`** - analyze scope and risk to recommend the right documentation level
- **`calculate-completeness.sh`** - calculate spec folder completeness as a percentage
- **`check-completion.sh`** - verify all completion criteria are met
- **`check-placeholders.sh`** - find remaining `[PLACEHOLDER]` values after level upgrade

**`validate.sh` exit codes**

- **Exit 0** - All rules pass. Ready to proceed
- **Exit 1** - User error (bad flags or invalid input)
- **Exit 2** - Validation error. Must fix before claiming completion
- **Exit 3** - System error (file I/O failure, missing manifest or other environment problem)

**Useful flags and behaviors**

- `--verbose` shows details behind each rule
- `--recursive` validates a parent and all child phase folders
- Strict validation of a Level 3 packet runs in ~108 ms via a single-orchestrator design
- The default scaffold path skips post-create validation. Set `SPECKIT_POST_VALIDATE=1` to enable it for strict CI workflows
- Path traversal inputs (e.g. `--path "../etc/passwd"`) are rejected before any filesystem write
- Parallel `/speckit:save` calls for the same packet are serialized by an advisory lock on `description.json` and `graph-metadata.json`

**Continuity scripts** in `.skilled/skills/system-spec-kit/runtime/cli/continuity/`:

- **`generate-context.ts`** - primary workflow for updating packet continuity and supporting generated context artifacts
- **`backfill-frontmatter.ts`** - add missing frontmatter to existing generated context artifacts and indexed spec docs
- **`validate-memory-quality.ts`** - run quality checks on continuity content before it is written

**Runtime testing**

- The package includes a dedicated `stress-test/` suite under `.skilled/skills/system-spec-kit/runtime/stress-test/` for load, contention and capacity checks
- It runs separately from standard test runs via its own `vitest.stress.config.ts`
- TypeScript sources compile to `.skilled/skills/system-spec-kit/runtime/cli/dist/`. The runtime entry point for continuity saves is `.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js`

&nbsp;
#### Gate System

5 mandatory gates run before any file change. Three further gates run after execution: final-state verification, completion verification and the memory save rule.

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
  │  Only if file modification detected           │
  │  A) Existing  B) New  C) Related  D) Skip   │
  └──────────────────┬──────────────────────────┘
                     │
                     ▼
  ┌─────────────────────────────────────────────┐
  │  Gate 4: Workflow Tiebreakers (REQUIRED)     │
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

- `generate-context.js` updates canonical packet continuity and may emit supporting generated context artifacts inside the spec folder
- Canonical continuity lives in the spec packet itself
- `/speckit:resume` is the recovery surface
- Rebuild order: `handover.md` -> `_memory.continuity` -> canonical spec docs

**How search works**

- Gate 1 matches a prompt against author-declared trigger phrases through the committed trigger index at `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`
- Free-text retrieval uses the ripgrep recipes in [retrieval-conventions.md](.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md)
- Both lanes read committed files, so neither needs a running daemon
- Retrieval is lexical only: semantic paraphrase, vector and BM25 fusion, decay, access tracking and session dedup are unsupported. A miss is a clean no-hit rather than a degraded guess

**The moving parts**

- `/speckit:save` refreshes packet metadata on every invocation through the continuity writer `node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js`
- Recovery is the continuity ladder that `/speckit:resume` owns, not a session lookup. Copilot and Claude share the same compact-cache provenance path
- `/speckit:search` runs the two lexical lanes
- `/doctor speckit-retrieval` checks that the index and the recipes are still healthy
- Embeddings live with the shared model server for the skill advisor, reachable through `/doctor embeddings`

---

## 6. 🔄 DEEP LOOP

The Deep Loop system runs autonomous, iterative agent workflows.

- Each loop dispatches a fresh-context worker against externalized state
- It keeps going until a convergence check, not the agent's own claim, decides a stop is safe
- Four loop families (research, review, AI council and improvement) live as nested mode packets inside one parent skill, `system-deep-loop`
- All run on one shared runtime, `runtime/`, so they share a state format, a stop contract and a coverage model
- The improvement family carries two co-equal lanes (agent improvement and model benchmark), giving five `/deep:*` loop commands in total

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
                  legal_stop_evaluated ─► SYNTHESIZE + write-back
```

&nbsp;
#### Convergence and Stopping

A loop decides for itself when the work is finished, instead of trusting an agent that says so.

- **Evidence, not vibes:** after each pass the runtime reduces the new state, scores how much fresh signal the pass added, and checks coverage against the loop's own model
- **A stop must be earned:** the loop ends only when the convergence score clears its threshold and every quality gate passes. An open blocker, an active P0 in a review or an uncovered dimension in research, forces another pass
- **Or run to depth on purpose:** set `--stop-policy max-iterations` to keep going for a fixed budget when you want breadth over an early stop
- **Then synthesize:** once a stop is legal the loop writes its report and saves continuity, so the run leaves a durable artifact instead of a chat transcript

&nbsp;
#### Deep Loop Runtime (the shared foundation)

One engine under every loop, so they all work the same way and you learn the workflow once.

- **Consistent across loops:** research, review, council and improvement all dispatch, track and stop the same way
- **Pause and resume anytime:** progress is saved outside the chat, so a loop survives crashes, new sessions and long runs
- **Trustworthy stops:** a loop ends only when the work has converged and passed its quality checks, never because an agent says it is done
- **Hands-off or step-by-step:** run fully autonomous with `:auto` or pause at each step with `:confirm`, and start fresh, resume or restart at will
- **Bounded autonomy:** cross-AI fan-out lineages can run with elevated CLI permissions in their own sandboxed workdir. A stall watchdog, a per-lineage cost cap and a lag-ceiling guard bound and observe those subprocesses so autonomy stays supervised, not unattended
- **Self-contained and MCP-free:** the runtime declares its own dependency manifest and resolves `zod`, `better-sqlite3` and the `tsx` loader from its own `node_modules`, with no reach-ins into a sibling skill. It carries executor config, atomic state, scoring, fallback routing and the coverage / council graph scripts

&nbsp;
#### State, the Ledger and the Append Gateway

Every loop keeps its progress in files, not in the chat, and those files are the single source of truth. A typed, append-only event ledger records each iteration, and the `deep-*-state.jsonl` you read is a projection the runtime rebuilds from that ledger.

- **One way in:** a leaf records its iteration through the append gateway, which authorizes the write, fences it behind the ledger, returns a receipt, then refreshes the state projection. Nothing writes the state file directly, so the log never drifts from the ledger
- **Durable or refused, never half-written:** the gateway either commits the record and hands back a receipt, or refuses it and names the failed check so the leaf halts. There is no partial append and no silent fallback to a direct write
- **Replayable:** convergence scores and verdicts recompute from the stored events, so a run can be audited, resumed or rebuilt after a crash from the ledger alone
- **Deltas feed the reducer:** each iteration also writes a structured delta file that the reducer folds into the registry, dashboard and strategy. The reducer owns those derived artifacts. The gateway owns the state log

&nbsp;
#### Cross-AI Fan-Out

A loop can spread its iterations across several AI models at once, then merge what they find. Bind executors on the command and each one becomes its own lineage.

- **Many models, one loop:** run the same review or research across native agents and CLI bridges (Codex, Claude Code, OpenCode, Cursor, Devin, Pi, Hermes) in parallel, each lineage on its own state, with a pool that caps how many run at once
- **Strongest-restriction merge:** for a review, any lineage that reports an active P0 pulls the merged verdict to FAIL, so the safest reading wins rather than the average one
- **Supervised, not unattended:** a stall watchdog aborts a lineage that stops emitting progress, a per-lineage cost cap bounds spend, and a dead or rate-limited lineage is tolerated without failing the whole run
- **One adapter:** every executor kind dispatches through the same shared runner, selected per lineage, so adding a model is a config choice rather than new plumbing

&nbsp;
#### Deep Research

Investigates a question for you, one focused pass at a time, until the answers hold up. `/deep:research` runs `@deep-research`.

- **Knows when it's done:** stops once findings stabilize, not after a fixed number of tries
- **Won't quit early:** keeps going until the question is covered from enough angles and sources
- **Remembers dead ends:** ruled-out directions are saved, so you never re-investigate them
- **Builds a written answer:** results land in a growing `research/research.md` you can read as it works

&nbsp;
#### Deep Review

Audits your code in passes and never edits it. `/deep:review` runs `@deep-review`.

- **Fix what matters first:** every issue is ranked P0/P1/P2 across correctness, security, traceability and maintainability
- **Fewer false alarms:** each critical finding is re-challenged before it sticks
- **Won't sign off on hidden problems:** an open P0 forces another pass, and the audit must clear its quality checks before it can stop
- **Clear verdict:** a `review-report.md` that ends in PASS, CONDITIONAL or FAIL

&nbsp;
#### Context Retrieval

Maps the existing codebase before you plan, so you extend what's already there instead of rewriting it. Use `@context` for one-shot lookup and continuity recovery. Use `/deep:research` or `/deep:review` when iterative work needs a bounded context snapshot.

- **Reuse first:** context packages and snapshots point to existing `file:symbol` anchors to extend, compose or wrap
- **Right-sized:** quick retrieval stays in `@context`. Iterative investigation and audit stay in the research/review loops
- **Pointers, not dumps:** it ships verified references instead of pasted source, so planning context stays sharp rather than bloated
- **Planning-ready:** `/speckit:plan` can consume context packages plus research/review outputs when you are ready to implement

&nbsp;
#### Multi AI Council

Brings several AI viewpoints together to plan hard decisions. `@ai-council` runs the seats, and `/deep:ai-council` handles multi-topic sessions.

- **More than one opinion:** different AI seats reason from different angles, then critique each other
- **A plan you can trust:** the seats converge on a recommendation with the evidence behind it
- **Safe to run:** planning only, so it never touches your implementation files
- **Saved for later:** the plan and its reasoning persist as `ai-council/**` files in the packet

&nbsp;
#### Agent Improvement & Benchmarking

Two co-equal lanes in the `system-deep-loop` improvement mode. Lane A reviews and upgrades any of your agents: `/deep:agent-improvement` runs `@deep-improvement`. Lane B benchmarks a model or prompt framework: `/deep:model-benchmark`.

- **Objective scoring:** rates an agent across five dimensions with fixed, repeatable checks, not another AI's opinion
- **Sees the whole footprint:** finds every place the agent lives (definition, mirrors, commands, workflows, skills) before changing anything
- **Never breaks the original:** changes go to a sandbox copy and are promoted only after they pass scoring, benchmarks and your approval, with rollback if they don't
- **Knows when to stop:** ends once the scores stop improving
- **Benchmarks too (Lane B):** models and prompt frameworks against fixtures with pattern or 5-dimension scoring, deterministic or graded

For details, see the [Deep Loop Runtime README](.skilled/skills/system-deep-loop/runtime/README.md), or the [system-deep-loop README](.skilled/skills/system-deep-loop/README.md), which documents each mode.

---

## 7. 🎯 SKILL ADVISOR

The Skill Advisor matches what you type to the right skill before any tool runs.

**The shape of it**

- A resident daemon behind one CLI front door: `node .skilled/bin/skill-advisor.cjs`
- The CLI speaks the advisor's own newline-delimited protocol over a unix socket
- Nine commands: eight public (four `advisor_*` for routing, freshness, rebuild and validation, plus four `skill_graph_*` for scan, query, status and graph validation), plus the trusted-caller-only `skill_graph_propagate_enhances`
- No MCP registration, in `opencode.json` or any other runtime config
- Daemon unreachable → the CLI answers from the Python scorer at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` and marks the response degraded, so the prompt-time brief reports `Advisor: stale` rather than claiming live

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
      5.   │  RENDER              │  Either a one-line hook brief
           │                      │  or a JSON recommendation list
           └──────────┬───────────┘
                      ▼
                RESULT:
           advisor_recommend -> list of skill recommendations
           hook adapter -> "Advisor: live, use ..."
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
├── config/     route exclusions and lane configuration
├── database/   SQLite skill graph and doctor-update state
├── handlers/   the nine command handlers (8 public + 1 trusted-only)
├── lib/        scorer, normalizer, freshness, cache
├── schemas/    JSON + Zod schemas
├── tests/      test suite
└── tools/      command registration
```

**The nine commands**

- **`advisor_recommend`** - recommends skills for a prompt with lane breakdown, lifecycle redirects and a freshness trust signal. Returns the workspace root and the effective thresholds it used
- **`advisor_rebuild`** - rebuilds the advisor skill graph when `advisor_status` reports stale, absent or unavailable state. `force:true` rebuilds even when live
- **`advisor_status`** - reports freshness, generation, trust state, lane weights, skill count, last scan time and background daemon status
- **`advisor_validate`** - runs measurement slices: corpus accuracy, holdout, parity, safety, latency. Surfaces the workspace root, effective thresholds, threshold semantics (aggregate vs runtime) and prompt-safe outcome counts (accepted / corrected / ignored)
- **`skill_graph_scan`** - indexes skill metadata into the advisor-owned skill graph surface
- **`skill_graph_query`** - queries skill graph relationships such as dependencies, families, hubs, conflicts and subgraphs
- **`skill_graph_status`** - reports graph counts, families, categories, staleness, validation and database status
- **`skill_graph_validate`** - validates schema drift, broken edges, reciprocal symmetry and dependency-cycle issues

&nbsp;
#### How Runtimes Talk To It

- **Claude Code**: calls prompt-time hook adapters under `.skilled/skills/system-spec-kit/runtime/hooks/`
- **OpenCode**: uses `.skilled/plugins/system-skill-advisor.js`, which spawns `.skilled/bin/skill-advisor.cjs` and renders the returned brief through the shared renderer
- **Disable everywhere**: set `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1` (or `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED=1` for the OpenCode plugin alone). The legacy `SPECKIT_`-prefixed names still work
- **Threshold contract at the prompt**: confidence ≥ 0.8 and uncertainty ≤ 0.35 by default
- **CLI front door**: the same nine commands over the warm daemon for hooks, cron and shell diagnostics. Mutation commands (`advisor_rebuild`, `skill_graph_scan`, apply-mode `skill_graph_propagate_enhances`) are gated behind `--trusted` or `SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1`
- **Launcher resilience**: an owner lease, a reconnecting session proxy and dead-socket respawn under a bootstrap lock. A hung daemon is reaped and replaced instead of stranding the session or spawning a second writer

&nbsp;
#### Validation and Testing

- `node .skilled/bin/skill-advisor.cjs advisor_validate --json '{"confirmHeavyRun":true}' --format json` returns measured corpus / holdout / parity / safety / latency slices plus prompt-safe outcome totals
- Python compatibility test suite: checked-in dataset and pass/fail totals reported by `skill_advisor_regression.py`
- Native package: 121 advisor test files, 872 tests
- Manual testing playbook: 47 scenario files spanning the native command surface, runtime hooks, the OpenCode plugin, compatibility controls, auto-indexing, lifecycle routing, scorer fusion and operator-state edge cases
- Hook diagnostics write to bounded JSONL sinks under the temp metrics root, and the validator reads those sinks back across processes

&nbsp;
#### Affordance Evidence

Callers can pass structured tool and resource hints as affordance evidence: `skillId`, `name`, `triggers[]`, `category`, `dependsOn[]`, `enhances[]`, `siblings[]`, `prerequisiteFor[]`, `conflictsWith[]`.

What happens to that input:

- A normalizer strips URLs, emails, token-shaped fragments, control characters and instruction-shaped strings before the scorer sees anything
- Free-form `description` text is ignored on purpose
- Sanitized triggers feed the derived-hints lane at reduced weight
- Normalized relations become temporary edges in the causal-graph lane, reusing the standard relation multipliers (`depends_on`, `enhances`, `siblings`, `prerequisite_for`, `conflicts_with`)
- No new scoring lane, no new entity kind, no raw matched phrases in payloads. Evidence labels stay as stable `affordance:<skillId>:<index>` identifiers

For details, see the [Skill Advisor README](.skilled/skills/system-skill-advisor/README.md).

---

## 8. 🧰 SKILL LIBRARY

13 advisor skill identities in `.skilled/skills/`, loaded on demand when Gate 2 matches a task (confidence >= 0.8 means the skill must be loaded).

&nbsp;
#### SYSTEM

**`system-spec-kit`**

- Mandatory orchestrator for all file modifications - activates automatically for any code file change
- Creates numbered spec folders with manifest templates rendered through Level contracts across 4 levels (1-3+)
- Owns the packet continuity writer, the generated trigger index and the ripgrep retrieval recipes
- Manages the manifest template source, 38 validation rules, the spec-kit script suite and the feature-catalog / testing-playbook documentation surfaces

&nbsp;

**`system-skill-advisor`**

- Gate 2 skill-routing subsystem at `.skilled/skills/system-skill-advisor/`
- Owns prompt-time skill routing, the `skill_graph_*` commands, freshness and lifecycle checks, plus the shared embeddings stack
- Front door: `node .skilled/bin/skill-advisor.cjs` over the resident daemon's socket protocol. No MCP registration, no client namespace

&nbsp;
#### CODE WORKFLOW

**`sk-code`** - write code that fits the stack you're in

- Loads surface-aware patterns, checklists and verification recipes per surface, and detects the active stack from paths and library markers
- Unsupported stacks (Go, React/Next.js, generic Node.js, React Native, Swift) trigger a quick disambiguation question
- Three ready surfaces: WEBFLOW (Webflow and vanilla HTML/CSS/JS animation, CDN deploy, Lighthouse/TBT/INP targets), OPENCODE (`.skilled/` system code across JS/TS/Python/Shell/JSON, MCP servers, agents, commands, skills) and OBSIDIAN (Obsidian plugin development, vault tooling and Desktop API integration)
- Verifies before it claims done: three mandatory phases run implementation, then testing and debugging, then verification
- Reviews before you ship (`code-review` mode): a stack-agnostic findings-first review baseline that reuses the surface evidence above. The security, correctness, SOLID and threat-model checklists always run first and their minimums are never relaxed, and findings come ranked P0/P1/P2

&nbsp;

**`sk-git`** - one clean path from change to PR

- Orchestrates three sub-skills so branches and commits stay tidy
- **`git-worktree`:** isolated workspaces, branch creation, parallel development
- **`git-commit`:** conventional-commit format, staged-change analysis, scope detection
- **`git-finish`:** PR creation via `gh pr create`, branch cleanup, integration

&nbsp;
#### DEEP LOOP

Two skills power the autonomous loops described in [Deep Loop](#6-deep-loop):

- **`runtime/`** - the shared MCP-free execution engine every active loop runs on
- **`system-deep-loop`** - the parent skill routing to active nested modes (`deep-research`, `deep-review`, `ai-council`, `deep-improvement`)

Use `@context` separately for one-shot retrieval. This parent-nested-skill pattern is the reusable standard behind `/create:sk-skill-parent`.

&nbsp;
#### CROSS-AI CLI

Run **cross-CLI agent teams from supported runtimes**. OpenCode and Claude Code are the primary runtimes. Codex, Cursor, Devin, Pi and Hermes join through their own CLI bridges.

Claude Code, OpenCode or a raw shell can dispatch supported AI CLIs as specialist sub-tools, each one a one-shot non-interactive call that streams structured output back to the caller. The conducting AI stays in charge. The dispatched CLI handles the part it's best at and returns.

> **Self-invocation guard:** every skill refuses to call itself. A Claude Code session never dispatches `cli-claude-code`, an OpenCode session never dispatches `cli-opencode`, etc. Cross-AI delegation only, no cycles.

**`cli-external-orchestration`** - parent hub for external CLI dispatch

One advisor identity routing through `mode-registry.json` to seven modes.

&nbsp;

**`cli-opencode`** - OpenCode CLI orchestrator

- Reach for it when the dispatched task needs **the project's full plugin / skill / MCP runtime**: a one-shot `opencode run` boots every plugin in `opencode.json`, every skill under `.opencode/skills/` and every MCP server
- Handles **parallel detached sessions** (`--share --port N` for ablation suites, worker farms) and **cross-repo dispatch** (`--dir <path>`)
- Default model `opencode-go/deepseek-v4-pro` at high reasoning
- Providers span `opencode-go` (default gateway: DeepSeek + open models), `deepseek` (direct API), `minimax-coding-plan` / `minimax` (MiniMax-M3), `xiaomi` (MiMo-V2.5-Pro), `kimi-for-coding` (Kimi k2.7 Code), `zai-coding-plan` (GLM-5.2) and `openai` (`gpt-5.5` family). See the skill's provider pre-flight for the live list

&nbsp;

**`cli-claude-code`** - Claude Code CLI orchestrator

- Reach for it for **extended thinking (chain-of-thought), surgical diff-based edits and JSON-schema-validated structured output**
- Ships 9 built-in agents and session continuity
- Three models: `claude-opus-4-6` (deep reasoning), `claude-sonnet-4-6` (default, balanced), `claude-haiku-4-5` (fast/cheap)

&nbsp;

**`cli-codex`** - OpenAI Codex CLI orchestrator

- Reach for it for **OpenAI-backed coding, repo analysis, PR review, web research and cross-model second opinions**, dispatched through `codex exec` (`gpt-5.5` family)
- Availability-gated and fails closed: every routing surface checks `command -v codex` before advertising or dispatching, and refuses the route when the binary is absent
- Execution runs through the audited deep-loop runtime, and project hooks + agents mirror the Claude bridge under `.codex/`

&nbsp;

**`cli-cursor`** - Cursor CLI orchestrator

- Reach for it for **Composer-model dispatch** (Cursor's own native model), a **read-only `--mode plan`/`--mode ask`** pass, or a second-AI opinion, dispatched through `cursor-agent -p`
- Models: `auto` router default, `composer-2.5`/`composer-2.5-fast`, plus 150+ hosted-frontier ids
- Availability-gated and fails closed: checks `command -v cursor-agent` plus an explicit auth-state probe (`cursor-agent about`), since `-p` exits `0` even on an auth failure
- Uniquely among the seven, its `.cursor/` config (hooks, MCP, rules) is **shared with the Cursor editor**, not tool-private: a dispatched CLI session inherits the operator's editor-level config

&nbsp;

**`cli-devin`** - Devin CLI orchestrator

- Reach for it for **Cognition-backed multi-model coding, subagent delegation, cloud handoff and cross-model validation**, dispatched through `devin -p`
- Model selection spans Opus, Sonnet, GPT, SWE, Gemini and more via Cognition's adaptive router
- Availability-gated and fails closed: checks `command -v devin` before advertising or dispatching, and refuses the route when the binary is absent

&nbsp;

**`cli-pi`** - Pi CLI orchestrator

- Reach for it for **guarded headless coding, read-only tool-constrained reviews, JSON event output, RPC integration, and Pi-native resource and community-package workflows**, dispatched through `pi --print` / `pi --mode rpc` (Pi CLI 0.82.1 per the pinned contract)
- Availability-gated and fails closed: checks `command -v pi` before advertising or dispatching, and refuses the route when the binary is absent
- Failure exit codes are unreliable, so inspect output rather than relying on exit status

&nbsp;

**`cli-hermes`** - Hermes Agent CLI orchestrator

- Reach for it for **quiet oneshot headless dispatch, cross-AI validation and LLM Gateway model routing**, dispatched through `hermes chat -Q --oneshot` (Nous Research's Python agent CLI)
- Closed seven-id roster through the operator's `llmgateway` provider: `deepseek-v4.1-flash`, `glm-5.3-flash`, `gpt-5.6-luna`, `gpt-5.6-sol`, `minimax-m3`, `mimo-v2.5-pro` and `qwen3.8-max`, each probed live
- Availability-gated and fails closed: checks `command -v hermes` and reads `hermes config get providers.llmgateway.base_url` for a configured provider before dispatching, and refuses the route when either fails
- `hermes status` is NOT a usable probe: it reads the built-in catalog only, so it reports no provider on a correctly configured machine
- Hermes has no agent flag, so each shared agent is mirrored as the preloadable skill `agent-<name>` and bound by an environment variable
- Its repo surface is `.hermes/`: generated markdown-only skill copies rather than symlinks (because Hermes scans a linked directory in full and quarantines it), plus generated prompt templates and one `repo-guards` plugin

&nbsp;
#### MCP INTEGRATION

**`mcp-code-mode`**

- **Reach 200+ external tools without bloating context.** One TypeScript interface fronts every external MCP tool (Figma, GitHub, Chrome DevTools, ClickUp, Webflow)
- **98.7% less context overhead:** tool schemas load on demand at first use, zero upfront cost, type-safe with autocomplete

&nbsp;

**`mcp-tooling`** - parent hub for MCP tool bridges

One advisor identity routing to ten modes through `mode-registry.json`: six workflow modes (`mcp-chrome-devtools`, `mcp-click-up`, `mcp-obsidian`, `mcp-aside-devtools`, `mcp-notion`, `mcp-orca-cli`) and four design transports (`mcp-figma`, `mcp-refero`, `mcp-mobbin`, `mcp-magicpath`).

- **`mcp-chrome-devtools`: drive a real browser from the assistant.** Chrome DevTools with smart 2-mode routing: CLI mode (`bdg`) runs in the terminal, supports Unix pipes and composes in CI/CD, with MCP mode as the fallback for multi-tool flows
- **`mcp-click-up`: manage ClickUp tasks from the assistant.** Routes between `cupt` CLI (daily task ops) and the official ClickUp MCP (documents, goals, bulk ops, webhooks) with operation-based routing. Agent-safe by design: per-list status resolution, dry-run before batch completion, `--json` output, empty-queue handling. Embedded install via `mcp-servers/` directory. 96-feature catalog + 37-scenario playbook included
- **`mcp-obsidian`: manage Obsidian notes from the assistant.** Dual CLI + MCP mode using `notesmd-cli` for headless vault operations, the official `obsidian` CLI for app-backed control, and cyanheads `obsidian-mcp-server` through the Local REST API
- **`mcp-figma` _(transport)_: drive Figma Desktop from the terminal.** Reads, authors, modifies and exports designs, tokens and components through the silships `figma-ds-cli`, with an optional Figma MCP via Code Mode for pulling design context. CLI-primary and gated: a local daemon brokers every command, read-only inspection and exports are free, authoring or destructive verbs are gated. Needs Figma Desktop open and uses no API key. Never decides design taste on its own: pairs with `sk-design-md-generator` for the measured design reference

&nbsp;
#### DESIGN

**`sk-design`** - parent hub for design work over four modes

- The hub carries no procedure of its own. It decides which mode owns the question in front of you and hands over
- **`sk-design-fundamentals`**, the default and the only mode without a command. Designs, builds and reviews any laid-out surface from fixed value scales: spacing, type, colour, contrast and hierarchy. Covers screen UI, slide decks, printed pages and document layouts, and adds interaction guidelines, motion principles and a WCAG review pass where the surface is a screen
- **`sk-design-md-generator`** behind `/design:extract`. Crawls a live URL across five viewports and emits a v3 Style Reference `DESIGN.md`: named tokens, Type Scale, Components, Surfaces, Elevation, Agent Prompt Guide, Quick Start CSS/Tailwind, with every value copied verbatim from the running page and script-validated against `tokens.json`. Carries a condensed general design-knowledge layer (Brand-vs-Product register, anti-slop principles, cognitive and numeric design laws, token vocabulary) so it reads design intent, not only CSS. Its style corpus and SQLite/FTS5 style database resolve self-relatively under `styles/`
- **`sk-design-chart`** behind `/design:chart`. Turns the comparison a reader needs into one of 29 catalog forms and ships it as a standalone HTML file, no build step and no remote dependency. A corpus checker holds the visual contract across 42 named check families, three of them browser-backed. Ships pre-1.0 and its number says so
- **`sk-design-diagram`** behind `/design:diagram`. Self-contained HTML/SVG diagrams across 27 types with a skinnable editorial design system, plus ASCII and Markdown flowcharts and draw.io or Mermaid redraws
- **Measured ground truth, not invented direction:** the hub captures what a site ships. It never authors a new visual direction from a brief
- **Pairs with `sk-code`:** the hub supplies the measured reference, `sk-code` builds and verifies against it

&nbsp;
#### DOCUMENTATION

**`sk-doc`**

- **Parent hub for documentation authoring, routed via `mode-registry.json` to fourteen workflow modes across thirteen packets.** Markdown specialist with DQI quality scoring (Structure 40%, Content 35%, Style 25%) plus HVR compliance checking
- **Scaffolds components** (skills, agents, commands) and handles README templates, frontmatter validation and feature-catalog authoring

&nbsp;
#### PROMPTING

**`sk-prompt`**

- **Standalone prompt-engineering skill.** Turns a rough ask into a structured, scored prompt
- **Auto-selects from 7 frameworks** (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT), then refines and scores: DEPTH thinking across 3-10 rounds, then CLEAR scoring (Correctness, Logic, Expression, Arrangement, Reusability) against a fixed threshold
- **Owns the canonical CLI prompt-quality card** that every `cli-*` executor's local card delegates to for framework selection and the CLEAR pre-dispatch check

&nbsp;
#### COMMUNICATION

**`sk-communication`**

- **CLI output in plain English.** Projects terse CLI and agent output into careful prose across six runtimes while leaving the canonical byte stream unchanged
- **Fails safe:** every unsafe or failed path returns the exact original output

&nbsp;
#### OTHER

**`sk-vision`**

- **Local vision for text-only models.** OCR, inspect, detect and pixel analysis on screenshots through a private Moondream runtime
- **No keys, no cloud, no per-image cost:** OpenCode leaves the tools unregistered by default, Pi registers them hidden, Devin gets evidence through a prompt-time hook and Cursor runs the CLI

---

## 9. 🤖 AGENT LIBRARY

12 custom specialist agents. Defined in `.skilled/agents/` (source of truth) and mirrored for Claude Code (`.claude/agents/`). OpenCode reads `.opencode/agents/`, which links to the same `.skilled/agents/` source.

&nbsp;
#### AGENT ORCHESTRATION

**Orchestrate** - runs the show on multi-step work

- Decomposes a task, delegates to specialist agents and merges their output into one answer with conflict resolution
- Read-only by design: it directs, the specialists implement
- No runaway chains: single-hop delegation only, depth 2 max

&nbsp;

**Code** - ships surface-aware code and proves it works

- Write-capable specialist that reads `sk-code`'s detected surface at dispatch, so the agent body stays stack-agnostic
- Seven dispatch modes: full build, surgical fix, refactor, test-add, scaffold, rename/move, dependency bump
- Earns every `DONE`: a Builder → Critic → Verifier self-check plus the Iron Law (no completion claim without fresh stack verification, LOW confidence blocks `DONE`)
- Fails closed: failures return to the orchestrator with an `escalation` classifier, no silent retry. Dispatched only by `@orchestrate`

&nbsp;

**Context** - finds what you already know before searching code

- Continuity-first retrieval in order: `handover.md` → `_memory.continuity` → packet spec docs → trigger index lookup → ripgrep recipes
- Returns a Context Package that combines packet continuity findings with codebase evidence. Read-only

&nbsp;

**Review** - guards code quality, never edits

- Strict read-only, loading `sk-code`'s `code-review` mode (the findings-first baseline) and layering its router-selected surface standards
- Safety floor holds: security and correctness minimums are never relaxed. Output is findings-first severity with quality scoring

&nbsp;

**Debug** - a fresh pair of eyes after you're stuck

- Receives a structured context handoff instead of the failed conversation, so it skips inherited bias. Use after 3+ failed tries
- Systematic 5-phase method: Observe → Analyze → Hypothesize → Validate → Fix, written up in `debug-delegation.md`

&nbsp;

**Markdown** - scoped doc authoring you can trust

- LEAF executor for the `/create:*` family plus scoped spec-doc and markdown writing, loading `sk-doc` and the right template on every run
- Refuses anything out of scope: unscoped writes and nested delegation receive a canonical REFUSE
- Deterministic output: `STATUS=OK PATH=…`, `FAIL` or `CANCELLED`, with a DQI >=75 floor and HVR enforced

&nbsp;

**Prompt-Improver** - strengthens high-stakes prompts

- Picks the best `sk-prompt` framework, applies DEPTH at the right energy and validates with CLEAR
- Returns a structured package (`FRAMEWORK`, `CLEAR_SCORE`, `RATIONALE`, `ENHANCED_PROMPT`, `ESCALATION_NOTES`). Used by the CLI mirror-card pipeline and `/prompt-improve` agent mode when inline prompting is too weak

&nbsp;

**Design** - owns design decisions and artifacts across four modes

- Decides values and behavior through `sk-design-fundamentals`
- Measures an existing surface into a Style Reference through `sk-design-md-generator`
- Authors charts and diagrams through `sk-design-chart` and `sk-design-diagram`

&nbsp;
#### DEEP LOOP

**AI Council** - several AI strategies, one vetted plan

- Dispatches distinct reasoning lenses across cli-opencode, cli-claude-code and native for multi-round deliberation. Planning-only. See [Deep Loop](#6-deep-loop)

&nbsp;

**Deep Research** - one research iteration at a time, state on disk

- Executes a single LEAF pass. The `/deep:research` command owns the loop. See [Deep Loop](#6-deep-loop)

&nbsp;

**Deep Review** - audits one review pass, read-only on code

- Produces `file:line` findings. The `/deep:review` command owns the loop. See [Deep Loop](#6-deep-loop)

&nbsp;

**Deep Improvement** - proposes one agent improvement, safely

- Writes a single candidate to packet-local runtime and never scores or promotes it. The `/deep:agent-improvement` command handles that. See [Deep Loop](#6-deep-loop)

---

## 10. 🧩 PLUGIN & EXTENSION LIBRARY

The framework extends each runtime through plugins and hooks rather than asking you to wire anything by hand.

&nbsp;
#### Goal Plugin

Gives a session a durable completion objective that survives across turns, instead of losing intent to context resets.

The packet's `goal.md` is the goal. A session binds to a spec packet, and the runtime injects that file's durable slice (frontmatter stripped, completion criteria as their own `criteria:` list, one per line) on every turn where that runtime injects at all: OpenCode, Pi and Devin inject per turn, Cursor injects at session start. The agent resends the slice in chat whenever a decision or criterion changes, reminding you to set it, and never stops working while it waits.

- **Claude Code and Codex:** use the built-in native `/goal <condition>`. The speckit workflows hand you the stripped slice of the parent `goal.md` to paste. Do not route through `opencode_goal` (that tool does not exist in those sessions)
- **OpenCode:** `/goal-opencode bind <packet-path>` makes the packet goal the session goal. `resent` clears the reminder, `packet <path>` reads a packet, and `set <condition>` still sets a plain text goal. Show, pause, clear and complete run through the `opencode_goal` tools
- **Pi, Cursor, Devin, Hermes:** the shared core under `.skilled/hooks/goal/` injects the same slice. Pi also manages through `/goal-pi`, Cursor answers a session-free packet read, Devin injects without a management surface, and Hermes binds the packet named by `HERMES_SPEC_FOLDER` under its session id through the repo plugin. Cursor and Devin still record a turn on the bound record, so neither is read-only
- **Guarded by the validator:** a phase parent or top-level packet goal warns past 3,000 characters and fails past 4,000, and a binding row naming a child goal that does not exist fails
- **Autonomous continuation is default-off** and gated (caps, cooldown, kill-switch). See `.skilled/hooks/goal/README.md` for the model and `.skilled/hooks/goal/goal-plugin.md` for the OpenCode plugin contract

&nbsp;
#### OpenCode Plugins

JavaScript entrypoints under `.skilled/plugins/`, discovered by a flat glob over `.opencode/plugins/`. Each is a thin transport adapter that translates OpenCode events into the shared policy cores owned by the skills.

- **Gate enforcement:** `system-spec-gate.js`, `system-completion-sentinel.js`, `system-speckit-completion.js`
- **Advisor and routing:** `system-skill-advisor.js`, `prompt-advisor` equivalents for the prompt-time brief, `mcp-route-guard.js` (advises when a native MCP call should use Code Mode)
- **Quality and guards:** `sk-code-post-edit-quality.js`, `sk-git-preflight-advisory.js`, `system-deep-loop-guard.js`, `system-dist-freshness-guard.js`, `codex-hooks-watchdog.js`, `cli-dispatch-audit.js`
- **Lifecycle and surfaces:** `opencode-goal.js`, `session-cleanup.js`, `sk-vision.js`, `sk-communication-projection.js`
- Every plugin honors a per-concern kill-switch via `hook-flags.cjs` plus the master `SYSTEM_HOOKS_DISABLED`, and none of them writes to stdout or stderr

&nbsp;
#### Pi Extensions

`.pi/extensions/` holds Pi's discovery mirror: `*.ts` extension entries (relative symlinks into their owners' trees) plus two local extension packages.

##### ⭐ `pi-cache-optimizer` ("Cache Pi")

Our custom extension, vendored in `.pi/extensions/` as the live runtime source. A fork of the upstream `jiangge/pi-cache-optimizer` (MIT), it improves provider-side KV / prompt cache hit rates for every model Pi can reach.

- Reorders stable system-prompt content ahead of dynamic context so providers can cache the stable prefix
- Compresses Pi skill listings and strips session-overview churn
- Adds a conservative `prompt_cache_key` fallback for OpenAI-compatible providers and warns once about proxy cache-routing gaps
- Read-only footer cache stats, plus `/cache-optimizer stats` showing input cost and savings against an uncached baseline
- Stops paid retry loops by tracking tool-call batches and escalating only when a whole batch fails repeatedly

Other entries in `.pi/extensions/`:

- **`pi-fast-mode-w-subagent-support`** - fast mode with subagent support
- **Symlinked guard bridges:** `spec-gate-classify.ts` / `spec-gate-enforce.ts`, `session-start-context.ts` / `session-stop-context.ts` / `session-compact-context.ts`, `prompt-advisor.ts`, `mcp-route-guard.ts`, `post-edit-quality.ts`, `dispatch-preflight-lint.ts` / `dispatch-audit.ts`, `goal-context.ts`, `sk-vision.ts`, `task-dispatch-guard.ts`, `completion-evidence.ts`, `git-preflight-advisory.ts`, `session-start-advisories.ts`
- **Community packages** via `.pi/settings.json`: `rpiv-ask-user-question`, `rpiv-todo`, `pi-blackhole`, `pi-statusline`, `pi-web-access`, `pi-btw`, `pi-plan-build`

&nbsp;
#### Shared Hook Cores

`.skilled/hooks/` carries the runtime-agnostic cores the plugin adapters call into.

- `goal`, `dispatch`, `spec-gate`, `completion`, `mcp-route-guard`, `permission-policy`, `post-edit-quality`
- `git`, `git-hooks-check`, `git-preflight`, `git-primary-reconcile`, `git-worktree-guard`, `hook-install`
- `session-cleanup`, `session-lifecycle`, `sk-vision`, `skill-advisor`, `task-dispatch`, `directive-lifecycle`, `dist-freshness`, `codex-watchdog`

---

## 11. ⌨️ COMMAND LIBRARY

32 command entry points across 7 command groups plus 3 root utilities. Each command is a Markdown entry point under `.skilled/commands/**/*.md` backed by a behavioral execution spec. Command families keep their workflow routing (YAML execution specs) separate from their Markdown presentation contracts, so the rendered dashboards stay stable while the underlying workflow evolves.

&nbsp;
#### SPEC KIT

**`/speckit:plan --intake-only`** - intake-only mode

- A mode of `/speckit:plan`, not a separate command
- Standalone intake workflow that publishes `spec.md`, `description.json` and `graph-metadata.json`
- Used directly for new packet setup and paired with `/speckit:plan` or `/speckit:complete` when `folder_state` is `no-spec`, `partial-folder`, `repair-mode` or `placeholder-upgrade`
- Modes: `:auto`, `:confirm`

&nbsp;

**`/speckit:complete`** - build a feature end to end

- End-to-end workflow: intake/delegate → research → plan → implement → verify → save continuity
- Smart-detects missing or unhealthy packet state and reuses the shared intake contract from `/speckit:plan --intake-only`. Healthy folders continue without extra setup prompts
- Modes: `:auto` (fully autonomous), `:confirm` (pause at each step), `:with-research` (adds deep research)
- After 3 failed implementation attempts, surface diagnostics and let the user dispatch `@debug` via the Task tool

&nbsp;

**`/speckit:plan`** - planning only

- Authors `spec.md`, `plan.md` and `tasks.md` without implementing
- Reuses the shared intake contract from `/speckit:plan --intake-only` when the packet is `no-spec`, `partial-folder`, `repair-mode` or `placeholder-upgrade`
- Dispatches up to 4 parallel context agents for codebase exploration during planning
- Use when you need stakeholder review before coding. Modes: `:auto`, `:confirm`

&nbsp;

**`/speckit:implement`** - execute an existing plan

- Requires `plan.md` to already exist
- 9-step workflow covering task breakdown, implementation, testing and verification
- Modes: `:auto`, `:confirm`

&nbsp;

**`/speckit:resume`** - pick up where you left off

- Continues a previous session by auto-loading continuity from the spec folder
- Presents session summary, shows progress against `tasks.md`
- Works after crashes, compactions or new sessions

&nbsp;

**Spec-first command chains**

```text
/speckit:plan --intake-only
  ├─► /speckit:plan -> /speckit:implement
  ├─► /deep:research -> /speckit:plan
  └─► /speckit:complete
       └─► reuses the shared intake contract from /speckit:plan --intake-only when folder_state still needs intake
```

`/deep:research` only enters that chain after a real `spec.md` exists. It follows `spec-check-protocol.md` for advisory-lock handling, `folder_state` classification and bounded generated-fence sync.

&nbsp;
#### CONTINUITY

**`/speckit:save`**

- Updates packet continuity and supporting generated context artifacts via `generate-context.js`
- AI composes structured JSON with session summary, key decisions and findings
- Writes continuity frontmatter and generated metadata in place. There is no separate index to refresh afterwards

&nbsp;

**`/speckit:search`**

- Two lexical lanes over spec docs and skill docs: trigger-index lookup with `--triggers`, ripgrep recipes otherwise
- `--paths` and `--count` pick the recipe. `--packet <specFolder>` narrows the search roots
- A phrase nobody wrote is a clean no-hit, never a nearest guess

&nbsp;
#### CREATE

**`/create:sk-skill`** - unified skill creation and update workflow

- Creates `SKILL.md` with 8-section structure, `README.md`, references and assets directories
- Registers in the skill catalog. Modes: `:auto`, `:confirm`

&nbsp;

**`/create:sk-skill-parent`** - parent skill with nested modes

- Scaffolds a parent skill with nested mode packets: one hub identity plus a `mode-registry.json` source of truth the modes project from
- Generates the routing-only `SKILL.md`, single hub `graph-metadata.json`, N mode packets and a non-discoverable `shared/`
- The reusable pattern behind `system-deep-loop`. Modes: `:auto`, `:confirm`

&nbsp;

**`/create:agent`** - new agent definitions

- Scaffolds a new agent definition with proper frontmatter, behavioral rules and tool permissions
- Creates the source-of-truth file in `.skilled/agents/` and the Claude Code mirror
- Modes: `:auto`, `:confirm`

&nbsp;

**`/create:readme`** - README and install guides

- Unified README and install guide creation using `sk-doc` quality standards
- Auto-detects folder type, loads the appropriate template, validates via DQI scoring
- Structure 40%, Content 35%, Style 25%. Modes: `:auto`, `:confirm`

&nbsp;

**`/create:changelog`** - formatted release notes

- Auto-detects recent work from spec folder artifacts or git history
- Resolves the correct component folder, calculates the next version number
- Generates a formatted changelog file matching 370+ existing entries. Modes: `:auto`, `:confirm`

&nbsp;

**`/create:feature-catalog`** - feature catalog packages

- Creates or updates feature catalog packages with category routing
- Generates both technical reference entries and simple-terms companion entries
- Validates against the 290-entry catalog structure across 22 categories

&nbsp;

**`/create:testing-playbook`** - manual testing scenarios

- Creates or updates manual testing playbook packages
- Generates scenario files with test steps, expected results and verification evidence fields
- Validates against the established playbook format

&nbsp;
#### DEEP

The active autonomous loop families (the improvement family carries two lanes). See [Deep Loop](#6-deep-loop) for how they run. Use `@context` for one-shot retrieval before planning.

&nbsp;

**`/deep:ai-council`** - plan hard decisions with several models

- Multi-seat planning for complex decisions, planning-only. Modes: `:auto`, `:confirm`

&nbsp;

**`/deep:research`** - research until the answer holds

- Iterative research until convergence, anchored to a real `spec.md`, with `new`/`resume`/`restart` lifecycle. Modes: `:auto`, `:confirm`

&nbsp;

**`/deep:review`** - audit code until it is clean

- Iterative code audit until convergence, ending in a PASS/CONDITIONAL/FAIL verdict. Modes: `:auto`, `:confirm`

&nbsp;

**`/deep:agent-improvement`** - improve your own agents

- Evaluates and improves any agent, with guarded promotion and rollback. Modes: `:auto`, `:confirm`

&nbsp;

**`/deep:model-benchmark`** - benchmark models and frameworks

- Benchmarks a model or prompt framework against fixtures. Modes: `:auto`, `:confirm`

&nbsp;
#### DOCTOR

Three commands cover every spec-kit diagnostic surface. Run `/doctor` with no target to see the interactive menu. Upgrade users see "Update everything to match latest release" as option 1.

&nbsp;

**`/doctor <target>` (router)**

- Single entry point for 9 subsystems: `memory` (checks the trigger index, its lookup and the ripgrep recipes), `embeddings`, `deep-loop`, `skill-advisor`, `skill-budget`, `skill-graph-freshness`, `parent-skill`, `runtime-mirrors`, `fable-mode`
- Argv-positional dispatch via `.skilled/commands/doctor/_routes.yaml` manifest (canonical per-target metadata: setup vars, allowed flags, mutation class, MCP tools, advisor trigger phrases)
- Each target loads its own self-contained YAML workflow under `assets/doctor_<target>.yaml`
- Interactive menu when no target supplied. Tier 2 per-target prompt when a required flag is missing
- Examples: `/doctor speckit-retrieval --dry-run`, `/doctor embeddings`, `/doctor fable-mode --dir <deep-loop-artifact-dir>` (read-only behavioral-metrics diagnostic)
- `--target=<name>` is preserved as a compatibility alias for flag-only invocation

&nbsp;

**`/doctor:mcp install|debug`** - MCP infrastructure repair

- `install`. Fresh install or reinstall of the native MCP server and the Skill Advisor daemon from their install guides. Handles old-conflicting-with-new (clean reinstall with venv/node_modules removal)
- `debug`. Diagnoses the Skill Advisor and Code Mode with PASS/WARN/FAIL per check. Supports `--fix` for guided repair

&nbsp;

**`/doctor:update`** - multi-subsystem orchestrator

- Dependency-safe rebuild across trigger index → skill-graph → advisor → deep-loop
- One lock (`system-skill-advisor/runtime/database/.doctor-update.flock`), one pre-mutation snapshot set, one dependency DAG, one rollback policy, one state log (`.doctor-update.last-run.json`)
- Tier-aware mid-run prompts: SHORT steps auto-acknowledge. The LONG-POLE trigger-index regeneration gets an explicit ETA prompt (Q-LONG, 1-5 min)
- Additional gates: Q-PROBE (active MCP clients warning, NOT suppressed by `--force`), Q-LEGACY (per-file cleanup with `--cleanup-legacy`), Q-FAIL (step-failure recovery)
- Use after upgrading spec-kit, after large packet moves or when multiple subsystem doctors would otherwise need to run by hand. Pass `--migrate` to handle packet schema migration. Wall-clock 8-25 min

The 13 underlying YAML workflows in `.skilled/commands/doctor/assets/` are self-sufficient. Each declares its own `role/purpose/action/operating_mode/invariants/upstream_assets/user_inputs/field_handling` block plus phased execution. The `route-validate.{sh,py}` CI script enforces internal consistency on the route manifest.

&nbsp;
#### UTILITY

**Agent Router**

- Routes requests to supported external AI systems such as Claude Code
- The receiving AI operates under its own system prompt - full identity adoption
- Use for cross-AI delegation where the target AI needs to behave as itself

&nbsp;

**`/prompt:improve`**

- Refines prompts and prompt packages through 7 proven frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT)
- Applies DEPTH thinking methodology with CLEAR quality scoring
- Can return inline improvements or route to `@prompt-improver` for higher-stakes prompt packages

&nbsp;

**`/goal`**

- Sets a session completion condition the agent keeps working toward across turns
- See [Goal Plugin](#goal-plugin) above for the full contract

---

## 12. 🔌 CODE MODE MCP

Code Mode MCP gives the AI access to external tools (Figma, GitHub, Chrome DevTools, ClickUp, Webflow) through a single TypeScript execution interface.

Instead of loading large external tool definitions into context, Code Mode loads them on demand through one interface (1.6k tokens) - a 98.7% reduction.

&nbsp;
#### Native MCP Servers

`code_mode` is the only registered MCP server: 7 tools for external tool orchestration via TypeScript execution.

The Skill Advisor is deliberately not one. It runs as a resident daemon behind `node .skilled/bin/skill-advisor.cjs` and registers nothing.

&nbsp;
#### Code Mode Tools (7)

- **`search_tools`** - find relevant tools by task description
- **`tool_info`** - return complete tool parameters and TypeScript interface
- **`call_tool_chain`** - execute TypeScript code with access to all registered tools
- **`list_tools`** - list all currently registered tool names
- **`register_manual`** - register a new tool provider
- **`deregister_manual`** - remove a tool provider
- **`get_required_keys_for_tool`** - check required environment variables for a tool

&nbsp;
#### External Integrations (via `.utcp_config.json`)

14 templates are registered. Six carry a description here. The rest back a `mcp-tooling` mode of the same name or ship without a mode packet of their own.

- **`chrome_devtools_1`** (MCP/stdio) - browser automation (instance 1). No env var needed
- **`chrome_devtools_2`** (MCP/stdio) - browser automation (instance 2). No env var needed
- **`clickup_official`** (MCP/stdio) - official ClickUp MCP (`@clickup/mcp-server`). Requires `CLICKUP_API_KEY` + `CLICKUP_TEAM_ID`. Used by `mcp-click-up` skill
- **`figma`** (MCP/stdio) - design files, components, exports. Requires `FIGMA_API_KEY`. This is the optional Code Mode MCP. The primary Figma surface is the `mcp-figma` skill via `figma-ds-cli`
- **`github`** (MCP/stdio) - issues, pull requests, commits. Requires `GITHUB_PERSONAL_ACCESS_TOKEN`
- **`webflow`** (MCP/remote) - sites, CMS collections. Requires Webflow auth
- **`aside`**, **`mobbin`**, **`notion`**, **`obsidian`**, **`refero`** (MCP/stdio) - each backs the `mcp-tooling` mode of the same name
- **`magicpath`** (CLI) - backs the `mcp-magicpath` mode
- **`magnific`** and **`gitkraken`** (MCP/stdio) - registered with no mode packet of their own

&nbsp;
#### Performance

- **Context tokens:** large external tool schemas loaded upfront → 1.6k on-demand
- **Round trips:** 15+ for chained operations → 1 TypeScript chain
- **Type safety:** none → full TypeScript
- **Context reduction:** 98.7%

To call a Code Mode tool: `call_tool_chain({ code: "return await figma.figma_get_file({fileKey: 'abc123'})" })`

For more on the `mcp-code-mode` skill and TypeScript execution patterns, see the skill at `.skilled/skills/mcp-code-mode/SKILL.md`.

---

## 13. 🌿 GIT WORKTREE / LIVE SYNC

The repo runs a live-sync loop around the worktree-per-session model.

- Every launch-wrapper session commits in its own isolated worktree and auto-publishes each commit to a shared live branch
- The main checkout auto-follows that branch, so the IDE always shows the combined state of every concurrent session's committed work

**Switches**

- The loop is **on by default** in the main checkout. SessionStart self-heals the git hook install and backgrounds the IDE follower automatically
- `SYSTEM_LIVE_SYNC_DISABLED=1` disables the whole loop
- `SPECKIT_AUTOSYNC=0` for one publish, `SPECKIT_GIT_HOOKS_GUARD=off` for the guard, `SYSTEM_LIVE_FOLLOW_DISABLED=1` for the follower
- See `sk-git/references/continuous-integration.md` for the full model

---

## 14. ⚙️ CONFIGURATION

<a id="customizing-for-your-stack"></a>
### 🎯 Customizing for Your Stack: Start with `sk-code`

This repo ships as a **public template**. Of the skills it ships with, only one carries stack-specific content. Start there.

&nbsp;

**`sk-code`** - 🎨 stack-specific, the customization point

- Surface-aware code-quality patterns
- Replace the shipped Webflow + OpenCode + Obsidian surfaces with your own (Next.js + Tailwind + Postgres, React Native + Reanimated, Go + sqlc, etc.)
- Motion.dev is an animation overlay inside the Webflow surface, not a surface of its own
- Includes the findings-first `code-review` mode that reuses these surfaces as review evidence

&nbsp;

**`sk-doc`** - ✅ codebase-agnostic

- Markdown quality + component creation. Works for any project

&nbsp;

**`sk-git`** - ✅ codebase-agnostic

- Worktree + commit + PR workflow. Works for any project

&nbsp;

**`sk-design`** - ✅ codebase-agnostic

- Parent hub for design work over four modes: values and review (`sk-design-fundamentals`), design-reference extraction from a live URL into a v3 Style Reference `DESIGN.md` (`sk-design-md-generator`), standalone HTML charts across 29 forms (`sk-design-chart`), and HTML/SVG diagrams across 27 types (`sk-design-diagram`)
- Pairs with `sk-code` for the build. Works for any project

&nbsp;

**`system-spec-kit`** - ✅ codebase-agnostic

- Spec folder workflow + validator + continuity. Works for any project

&nbsp;

**`system-skill-advisor`** - ✅ codebase-agnostic

- Prompt-time skill routing over the shared skill graph. Works for any project

&nbsp;

**`mcp-code-mode`** - ✅ codebase-agnostic

- Multi-tool MCP orchestration. Works for any project

&nbsp;

**`system-deep-loop`** - ✅ codebase-agnostic

- Parent hub for the unified deep-loop skill (research, review, ai-council and improvement modes, including agent improvement and model benchmarking) over nested `runtime/` infrastructure. Works for any topic / target

&nbsp;

**`sk-prompt`** - ✅ codebase-agnostic

- Prompt-engineering framework. Works for any project

&nbsp;

**`sk-vision`** - ✅ codebase-agnostic

- Local OCR and image inspection through a private Moondream runtime. Works for any project

&nbsp;

**`sk-communication`** - ✅ codebase-agnostic

- Plain-English projection of CLI output across six runtimes. Works for any project

&nbsp;

**`cli-external-orchestration`** - ✅ codebase-agnostic

- Parent hub for external CLI dispatch: routes to `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`, and `cli-hermes`. Stack-independent

&nbsp;

**`mcp-tooling`** - ✅ codebase-agnostic

- Parent hub for MCP tool bridges, ten modes: `mcp-chrome-devtools` (browser tooling), `mcp-click-up` (ClickUp task management via cupt CLI + official MCP, requires `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID`), `mcp-obsidian` (Obsidian notes via notesmd-cli, the official obsidian CLI, and cyanheads obsidian-mcp-server), `mcp-aside-devtools`, `mcp-notion` and `mcp-orca-cli`, plus the design transports `mcp-figma` (Figma Desktop via the silships `figma-ds-cli`, requires Figma Desktop open), `mcp-refero`, `mcp-mobbin` and `mcp-magicpath`. Stack-independent

&nbsp;
#### Adding Your Own Skills

- The shipped set is intentionally minimal. Most teams add their own (project-specific workflows, ops runbooks, domain-specific reviewers)
- Drop them into `.skilled/skills/<your-skill>/` and the advisor picks them up
- The shipped skills stay agnostic so upstream updates apply cleanly to your fork

&nbsp;
#### What Adapting `sk-code` Looks Like

1. Replace the surface packets (`sk-code-webflow/`, `sk-code-opencode/`, `sk-code-obsidian/`) with packets for your stack. Each one owns its own `references/` and `assets/`
2. Register your packets in `mode-registry.json` and `hub-router.json`, and update the mode table in `SKILL.md` §1
3. Update `shared/references/stack-detection.md` to match your stack's marker files and CWD signals
4. Update the `RESOURCE_MAP` in `ROUTER.md` §11 so each intent key points at your renamed packet resources
5. Bump the `sk-code` version and ship a changelog. Use `sk-code-opencode/assets/checklists/skill-authoring.md` as your guide

The other shipped skills keep working unchanged: `sk-doc` still validates your markdown, `sk-git` still manages your branches, `system-spec-kit` still specs your work. `sk-code`'s `code-review` mode auto-adapts to your customized surfaces at review time.

&nbsp;
### Core Configuration Files

- **`AGENTS.md`** - gate definitions, behavior rules, agent routing and capability reference. The canonical contract for all runtimes
- **`CLAUDE.md`** - symlink to `AGENTS.md`, so Claude Code reads the same contract
- **`opencode.json`** - MCP server bindings, model configuration and launcher notes. Used by OpenCode platform
- **`.utcp_config.json`** - Code Mode external tool registrations. Used by `mcp-code-mode` skill
- **`.claude/mcp.json`** - Claude Code MCP configuration. Claude Code only

&nbsp;
### Retrieval and Continuity Configuration

Nothing to configure.

- The trigger index is a committed file regenerated by `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`
- The ripgrep recipes read the working tree
- The continuity writer updates the packet in place
- No database, no daemon, no embedding provider on this path
- The skill advisor keeps its own model-server settings

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

---

## 15. ❓ FAQ

&nbsp;

**Q: Do I need all 13 skills installed to use the framework?**

No. Skills are loaded on demand by Gate 2, so you only need the ones relevant to your work.

- The two core documentation skills, `system-spec-kit` and `sk-doc`, cover most documentation workflows
- The MCP and cross-AI CLI skills require additional local tooling or API keys depending on the surface

&nbsp;

**Q: What happens if I do not use a spec folder?**

Gate 3 blocks file modifications until a spec folder answer is provided.

- You can skip it with option D, but skipped sessions are undocumented and will not be recoverable through `/speckit:resume` or `/speckit:search`
- For a trivial fix of a few characters in one file, Gate 3 does not trigger

&nbsp;

**Q: How does retrieval know what is relevant to my current task?**

- Packet continuity and supporting generated context artifacts use structured frontmatter and anchored markdown, so the trigger index generator can classify and index them reliably
- For recovery, start with `/speckit:resume` and the packet-local continuity ladder: `handover.md` -> `_memory.continuity` -> canonical spec docs
- After that, the trigger index lookup matches your prompt against author-declared trigger phrases, and the ripgrep recipes in `retrieval-conventions.md` cover free text
- Both lanes are lexical, so a phrase no author declared and no document contains is a clean no-hit

&nbsp;

**Q: Can I use this framework without the continuity features?**

Yes.

- The Spec Kit documentation workflow (Gate 3, spec folders, templates) works whether or not you ever run `/speckit:save`
- You lose cross-session recovery, but structured documentation, agent routing and skill loading all still work

&nbsp;

**Q: How do I add a new skill to the framework?**

- Use `/create:sk-skill` to scaffold the skill structure. The command creates the `SKILL.md`, references and assets directories following the `sk-doc` template
- Discovery reads its `SKILL.md` frontmatter and `graph-metadata.json`, so no registration step follows
- Adding a row to `.skilled/skills/README.txt` keeps the catalog complete for human readers

&nbsp;

**Q: What does "local-first" mean for continuity?**

Everything is a file in your own repository.

- Continuity lives in the spec folder
- The trigger index is a committed JSON file
- Retrieval is ripgrep over the working tree
- No session data, code or context leaves the machine

&nbsp;

**Q: How do I contribute a new agent definition?**

- Define the agent in `.skilled/agents/` (the source of truth), then mirror the adapter into `.claude/agents/`
- Use `/create:agent` to scaffold the file from the agent template

&nbsp;

**Q: How many MCP tools are there and where are they defined?**

- The `code_mode` server registers seven tools, listed under [Code Mode MCP](#12-code-mode-mcp)
- External providers are declared as templates in `.utcp_config.json` at the repo root, which currently holds 14 entries

&nbsp;

**Q: What is the feature catalog?**

- The canonical feature inventory for the `system-spec-kit` engine at `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md`
- It groups the shipped surface by capability area and maps each section to a directory under `feature-catalog/`

---

## 16. 📚 RELATED DOCUMENTS

**Internal documentation**

- **[→ AGENTS.md](AGENTS.md)** - agent routing, gate definitions, behavior rules
- **[→ Spec Kit README](.skilled/skills/system-spec-kit/README.md)** - spec folder workflow, Level contract template set, validation rules
- **[→ Spec-Kit Engine README](.skilled/skills/system-spec-kit/runtime/README.md)** - validation, generated metadata and runtime hook adapters
- **[→ Repo Scripts Runbook](.skilled/scripts/README.md)** - dry-run orphan MCP sweeper, Claude cleanup, and LaunchAgent template guidance
- **[→ Skill Advisor README](.skilled/skills/system-skill-advisor/README.md)** - daemon-backed CLI front door, nine advisor/skill-graph commands and routing docs
- **[→ Architecture](.skilled/skills/system-spec-kit/ARCHITECTURE.md)** - API boundary contract
- **[→ sk-doc Skill](.skilled/skills/sk-doc/SKILL.md)** - documentation standards, DQI scoring
- **[→ Skills Index](.skilled/skills/README.txt)** - skills library and invocation patterns
- **[→ Feature Catalog](.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md)** - current technical reference
- **[→ Manual Testing Playbook](.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md)** - operator validation scenarios, including runtime lifecycle checks
- **[→ Latest System Spec-Kit Release Notes](.skilled/skills/system-spec-kit/changelog/v3.9.0.0.md)** - most recent shipped release notes
- **[→ Daemon CLI Reference](.skilled/skills/system-spec-kit/references/cli/daemon-cli-reference.md)** - full-parity CLI front doors over the warm daemons

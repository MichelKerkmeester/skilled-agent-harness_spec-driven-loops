# Skilled - Spec-Driven Agent Loops
# w/ Custom Skill & Continuity Framework

| Core layer　　　　　　　　　　 | What it adds                                                            |
| --------------------------------| -------------------------------------------------------------------------|
| 📋 **Spec Kit Framework**　　　| Structured plans, task tracking, validation gates, and handover docs    |
| 🧠 **Packet Continuity**　　　| Continuity that survives sessions, written into the spec packet and recovered through the continuity ladder |
| ⚛️ **Lexical Retrieval + Skill Graph** | Trigger-index and ripgrep retrieval over spec docs, plus graph-aware skill routing |
| 🤖 **12 Specialized Agents**　 | Focused roles for implementation, review, research, docs, git, and more |
| 🎯 **20 On-Demand Skills**　　 | Skill Advisor routing for the right workflow at the right time          |

**Reasons to try it**

[![GitHub Stars](https://img.shields.io/github/stars/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration?style=for-the-badge&logo=github&color=fce566&labelColor=222222)](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration/stargazers)
[![License](https://img.shields.io/github/license/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration?style=for-the-badge&color=7bd88f&labelColor=222222)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration?style=for-the-badge&color=5ad4e6&labelColor=222222)](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration/releases)

- **Continuity that survives context resets:** decisions, architecture and history persist across sessions, crashes and compactions
- **Verification, not vibes:** nothing counts as "done" without fresh evidence, and code-review findings get re-challenged before they stick
- **Works the same in OpenCode and Claude Code**, with cross-CLI dispatch to five more model providers on top

> Don't buy me unwanted coffee: https://buymeacoffee.com/michelkerkmeester

---

## 1. OVERVIEW

### What This Framework Does

AI coding assistants have amnesia. Every session starts from zero. You explain your architecture Monday. By Wednesday, it is gone. Decisions, trade-offs, the carefully reasoned choices behind them, all lost the moment the conversation window closes. This framework fixes that.

The framework adds three layers on top of the base platform:

1. **Structured documentation** (Spec Kit) - every file change gets a spec folder recording what changed, why and how. Like a lab notebook for software.
2. **Packet continuity** (files) - session context written into the spec folder it belongs to, then found again through a committed trigger index and ripgrep recipes over the same files.
3. **Coordinated agents and skills** - 12 specialized agents routed by a gate system that loads the right skills at the right time.

### How It All Connects

```
                         YOUR REQUEST
                              │
                              ▼
         ┌──────────────────────────────────────────┐
         │       GATE SYSTEM (3 mandatory gates)    │
         │                                          │
         │  Gate 1: Context     Gate 2: Skills      │
         │  Surface relevant    Auto-load the right │
         │  prior context       domain expertise    │
         │                                          │
         │  Gate 3: Spec Folder (HARD BLOCK)        │
         │  Every file change needs documentation    │
         └──────────────────────┬───────────────────┘
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
         ┌───────────────┐          ┌──────────────────┐
         │ AGENT NETWORK │          │  SKILLS LIBRARY  │
         │ 12 specialized│          │ 20 domain skills │
         │ agents with   │◄────────►│ auto-loaded by   │
         │ routing logic │          │ task keywords    │
         └───────┬───────┘          └────────┬─────────┘
                 │                           │
                 ▼                           ▼
         ┌──────────────────────────────────────────┐
         │          NATIVE MCP TOPOLOGY             │
         │  2 native servers - each one a separate  │
         │  process and MCP boundary                │
         │                                          │
         │  system_skill_advisor     skill routing      │
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

## 2. QUICK START

### Installation

**Prerequisites:** Node.js 18+ with `npm`, `git` and a POSIX shell. The launcher binaries vendor their own dependencies on first run, so you do not need TypeScript or `tsc` installed globally.

```bash
# 1. Clone the repository
git clone https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration.git
cd opencode--spec-kit-skilled-agent-orchestration

# 2. Install root dependencies (file watcher + shared HTTP utilities)
npm install

# 3. Boot the native MCP servers via their committed launchers
# Each launcher is a self-contained .cjs that vendors its own deps on first run.
node .opencode/bin/system-skill-advisor-launcher.cjs --help
```

### Set Up Embeddings

Retrieval is lexical and needs no embedder. The one surviving embedding stack belongs to the skill advisor, which manages its own model server. Check it with `/doctor embeddings`.

### Verify Installation

```bash
# Confirm the launcher binary responds
node .opencode/bin/system-skill-advisor-launcher.cjs --help

# Confirm the active runtime's MCP config references the launchers
  opencode.json .claude/mcp.json .vscode/mcp.json 2>/dev/null
```

### First Use

Open OpenCode in your project directory. The framework is active. Try:

```
/speckit:complete Build a user authentication system
```

This creates a spec folder, runs research, builds a plan and begins implementation, and writes the session context into the packet as it goes. When you come back tomorrow, `/speckit:resume` reads it back.

### Adapting to Your Stack

This repo ships as a public template. Of the shipped skills, `sk-code` carries the stack-specific patterns (frontend framework, animation library, CMS, backend language). Start there when forking. The other shipped skills (`system-spec-kit`, `sk-doc`, `sk-git`, `system-deep-loop`, `cli-external-orchestration`, `mcp-tooling`) are codebase-agnostic out of the box and work for any project without modification. Most teams will also add their own skills on top. Drop them into `.opencode/skills/<your-skill>/` and they'll be picked up automatically.

See [§4 Customizing for Your Stack](#customizing-for-your-stack) for the full customization map and step-by-step adaptation guide.

---

## 3. FEATURES

### 📋 Spec Kit Framework

The Spec Kit enforces structured spec folders for every file-modifying conversation. Gate 3 requires a spec folder answer before any file modification begins (only typo/whitespace fixes under 5 characters are exempt).

#### Documentation Levels

Documentation depth scales with task complexity.

| Level  | LOC Guidance   | Required Files                                                          | When to Use                                                              |
| ------ | -------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **1**  | < 100          | spec.md, plan.md, tasks.md, implementation-summary.md                   | Small features, bug fixes, single-file changes                           |
| **2**  | 100 - 499      | Level 1 + acceptance-criteria.md (checklist.md optional)                | Features needing QA verification, multi-file changes                     |
| **3**  | 500+           | Level 2 + decision-record.md                                            | Architecture changes, complex refactors                                  |
| **3+** | Complexity 80+ | Level 3 + approval workflow, compliance checkpoints, stakeholder matrix | High-complexity work needing review tracking and workstream coordination |

The LOC ranges are guidance, not hard rules. Risk, complexity and the number of affected files can push a task to a higher level. When in doubt, choose the higher level.

**Implementation-summary.md** is required at all levels but created **after** implementation completes, not at spec folder creation time.

&nbsp;
#### Spec Folder Structure

```text
specs/<###-feature-name>/
├── description.json             # Spec identity and continuity metadata
├── spec.md                      # What the feature is and why it exists
├── plan.md                      # How to implement it
├── tasks.md                     # Step-by-step task breakdown
├── acceptance-criteria.md       # Criteria that gate packet closure (Level 2+)
├── checklist.md                 # QA validation gates (Level 2+)
├── decision-record.md           # Architecture decisions (Level 3+)
├── implementation-summary.md    # Post-implementation summary (all levels)
├── resource-map.md              # Optional path ledger of resources the packet touched
├── graph-metadata.json          # Packet-level graph metadata (auto-refreshed on save)
└── scratch/                     # Temporary workspace files
```

`resource-map.md` is optional at any level. Render it from `.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl` when a packet wants a lean, central listing of the files, scripts and external resources it interacts with. Deep-research and deep-review loops emit it automatically next to `review-report.md`.

&nbsp;
#### Checklist Priority System

Checklists use a priority system so reviewers know what blocks shipping and what can wait:

- **P0** - Hard blocker. Cannot ship without this. Cannot defer.
- **P1** - Required. Must complete or get explicit user approval to defer.
- **P2** - Optional. Nice to have. Can defer without approval.

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

Use `create.sh --phase` to create a parent with its first child in one step. Run `validate.sh --recursive` to validate the parent and all children together.

&nbsp;
#### Validation

The `validate.sh` script runs 38 rules against a spec folder and reports what passes and what needs fixing. Rules check for required files, template compliance, placeholder detection, anchor markers and cross-reference consistency.

- **Exit 0** - All rules pass. Ready to proceed.
- **Exit 1** - User error (bad flags or invalid input).
- **Exit 2** - Validation error. Must fix before claiming completion.
- **Exit 3** - System error (file I/O failure, missing manifest or other environment problem).

Run with `--verbose` to see details behind each rule or `--recursive` to validate a parent and all child phase folders. Strict validation of a Level 3 packet runs in ~108 ms via a single-orchestrator design. The default scaffold path skips post-create validation. Set `SPECKIT_POST_VALIDATE=1` to enable it for strict CI workflows. Path traversal inputs (e.g. `--path "../etc/passwd"`) are rejected before any filesystem write. Parallel `/memory:save` calls for the same packet are serialized by an advisory lock on `description.json` and `graph-metadata.json`.

&nbsp;
#### Scripts and Validation

**Spec Management Scripts** (in `.opencode/skills/system-spec-kit/scripts/spec/`):

- **`create.sh`** - Create spec folders with level-appropriate templates. Use `--phase` for parent + child
- **`validate.sh`** - Run 38 validation rules. Use `--recursive` for phase folders
- **`upgrade-level.sh`** - Upgrade a spec folder to a higher level by injecting new sections
- **`recommend-level.sh`** - Analyze scope and risk to recommend the right documentation level
- **`calculate-completeness.sh`** - Calculate spec folder completeness as a percentage
- **`check-completion.sh`** - Verify all completion criteria are met
- **`check-placeholders.sh`** - Find remaining `[PLACEHOLDER]` values after level upgrade

**Continuity Scripts** (in `.opencode/skills/system-spec-kit/scripts/memory/`):

- **`generate-context.ts`** - Primary workflow for updating packet continuity and supporting generated context artifacts
- **`backfill-frontmatter.ts`** - Add missing frontmatter to existing generated context artifacts and indexed spec docs
- **`rank-memories.ts`** - Rank continuity records for retrieval ordering
- **`validate-memory-quality.ts`** - Run quality checks on continuity content before it is written

TypeScript sources compile to `.opencode/skills/system-spec-kit/scripts/dist/`. The runtime entry point for continuity saves is `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js`.

&nbsp;
#### Gate System

3 mandatory gates run before any file change. Every request passes through the same sequence.

```
  User message arrives
         │
         ▼
  ┌─────────────────────────────────────────────┐
  │  Gate 1: Understanding (SOFT BLOCK)         │
  │  trigger index lookup surfaces context      │
  │  Classify intent: Research / Implementation │
  │  confidence >= 0.70, uncertainty <= 0.35     │
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
  │  A) Existing  B) New  C) Update             │
  │  D) Extend phased packet  E) Skip           │
  └──────────────────┬──────────────────────────┘
                     │
                     ▼
              EXECUTION
                     │
                     ▼
  ┌─────────────────────────────────────────────┐
  │  Post-Rules                                 │
  │  Continuity Save ─ generate-context.js only │
  │  Completion ─ verify checklist.md items     │
  └─────────────────────────────────────────────┘
```

**Analysis Lenses** - applied silently on every request:
- **CLARITY** - Is this the simplest solution? Are abstractions earned?
- **SYSTEMS** - What does this touch? What are the side effects?
- **BIAS** - Is the user solving a symptom? Is the framing correct?
- **SUSTAINABILITY** - Will future developers understand this?
- **VALUE** - Does this change behavior or just refactor?
- **SCOPE** - Does solution complexity match problem size?

For the full spec folder workflow, Level contract template architecture, gate definitions and anti-pattern detection rules, see the [→ Spec Kit README](.opencode/skills/system-spec-kit/README.md) and [→ AGENTS.md](AGENTS.md).

---

### 🧠 Continuity and Retrieval

Continuity and retrieval are packet-local and file-based. `generate-context.js` updates canonical packet continuity and may emit supporting generated context artifacts inside the spec folder. Canonical continuity lives in the spec packet itself: use `/speckit:resume` as the recovery surface, then rebuild context in this order: `handover.md` -> `_memory.continuity` -> canonical spec docs. Gate 1 matches a prompt against author-declared trigger phrases through the committed trigger index at `.opencode/skills/system-spec-kit/data/trigger-index.json`, and free-text retrieval uses the ripgrep recipes in [retrieval-conventions.md](.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md). Both read committed files, so neither needs a running daemon. Retrieval is lexical only. Semantic paraphrase, vector and BM25 fusion, decay, access tracking and session dedup are unsupported, and a miss is a clean no-hit rather than a degraded guess.

`/memory:save` refreshes packet metadata on every invocation through the continuity writer `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js`. Recovery is the continuity ladder that `/speckit:resume` owns, not a session lookup. Copilot and Claude share the same compact-cache provenance path.

What the retired continuity server used to do is now split three ways. `/memory:search` runs the two lexical lanes. `/speckit:resume` walks the continuity ladder. `/doctor memory` checks that the index and the recipes are still healthy. Embeddings left with the shared model server for the skill advisor, reachable through `/doctor embeddings`.

---

### 🎯 Skill Advisor

The Skill Advisor matches what you type to the right skill before any tool runs. It is now a standalone MCP server named `system_skill_advisor`, packaged under `.opencode/skills/system-skill-advisor/mcp-server/`. The server registers nine tools: eight on the public surface (four `advisor_*` tools for routing, freshness, rebuild and validation, plus four `skill_graph_*` tools for scan, query, status and graph validation), plus one internal propagation tool. A small Python compatibility shim still works as a fallback when the native path is unavailable.

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
           shim fallback -> legacy JSON
```

&nbsp;
#### Native Package Layout

```text
.opencode/skills/system-skill-advisor/mcp-server/
├── bench/      benchmarks
├── compat/     stable compatibility entry for runtimes
├── handlers/   the nine MCP tool handlers (8 public + 1 internal)
├── lib/        scorer, normalizer, freshness, cache
├── schemas/    JSON + Zod schemas
├── tests/      test suite
└── tools/      tool registration
```

| Tool                   | What it does                                                                                                                                                                                                                               |
| ------------------------| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `advisor_recommend`    | Recommends skills for a prompt with lane breakdown, lifecycle redirects and a freshness trust signal. Returns the workspace root and the effective thresholds it used.                                                                     |
| `advisor_rebuild`      | Rebuilds the advisor skill graph when `advisor_status` reports stale, absent or unavailable state. `force:true` rebuilds even when live.                                                                                                   |
| `advisor_status`       | Reports freshness, generation, trust state, lane weights, skill count, last scan time and background daemon status.                                                                                                                        |
| `advisor_validate`     | Runs measurement slices: corpus accuracy, holdout, parity, safety, latency. Surfaces the workspace root, effective thresholds, threshold semantics (aggregate vs runtime) and prompt-safe outcome counts (accepted / corrected / ignored). |
| `skill_graph_scan`     | Indexes skill metadata into the advisor-owned skill graph surface.                                                                                                                                                                         |
| `skill_graph_query`    | Queries skill graph relationships such as dependencies, families, hubs, conflicts and subgraphs.                                                                                                                                           |
| `skill_graph_status`   | Reports graph counts, families, categories, staleness, validation and database status.                                                                                                                                                     |
| `skill_graph_validate` | Validates schema drift, broken edges, reciprocal symmetry and dependency-cycle issues.                                                                                                                                                     |

&nbsp;
#### How Runtimes Talk To It

- **Claude Code**: calls prompt-time hook adapters under `.opencode/skills/system-spec-kit/mcp-server/hooks/`.
- **OpenCode**: uses `.opencode/plugins/system-skill-advisor.js` with `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/system-skill-advisor-bridge.mjs`, which imports the stable compat entry under `.opencode/skills/system-skill-advisor/mcp-server/compat/index.ts`.
- **Disable everywhere**: set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` to turn off all prompt-time advisor surfaces.
- **Threshold contract at the prompt**: confidence ≥ 0.8 and uncertainty ≤ 0.35 by default.
- **CLI front door**: `skill-advisor.cjs` exposes the same 9 tools over the warm daemon for hooks, cron and shell diagnostics; mutation commands (`advisor_rebuild`, `skill_graph_scan`) are gated behind `--trusted`.
- **Launcher resilience**: the advisor launcher carries an owner lease and a reconnecting session proxy, and acts on dead-socket respawn decisions under a bootstrap lock — a hung daemon is reaped and replaced instead of stranding the session or spawning a second writer.

&nbsp;
#### Validation and Testing

- `advisor_validate({"skillSlug":null})` returns measured corpus / holdout / parity / safety / latency slices plus prompt-safe outcome totals.
- Python compatibility regression harness: checked-in dataset and pass/fail totals are reported by `skill_advisor_regression.py`.
- Native package: 23 advisor test files, 167 tests.
- Manual testing playbook: 42 scenario files spanning native MCP tools, runtime hooks, the OpenCode plugin, compatibility controls, auto-indexing, lifecycle routing, scorer fusion and operator-state edge cases.
- Hook diagnostics write to bounded JSONL sinks under the temp metrics root. The validator reads those sinks back across processes.

&nbsp;
#### Affordance Evidence

Callers can pass structured tool and resource hints, `skillId`, `name`, `triggers[]`, `category`, `dependsOn[]`, `enhances[]`, `siblings[]`, `prerequisiteFor[]`, `conflictsWith[]`, as affordance evidence. A normalizer strips URLs, emails, token-shaped fragments, control characters and instruction-shaped strings before the scorer sees anything. Free-form `description` text is ignored on purpose. Sanitized triggers feed the existing derived-hints lane at reduced weight. Normalized relations become temporary edges in the existing causal-graph lane reusing the standard relation multipliers (`depends_on`, `enhances`, `siblings`, `prerequisite_for`, `conflicts_with`). No new scoring lane, no new entity kind, no raw matched phrases in recommendation payloads, evidence labels stay as stable `affordance:<skillId>:<index>` identifiers.

For details, see the [Skill Advisor README](.opencode/skills/system-skill-advisor/README.md).

---

### 🔄 Deep Loop

The Deep Loop system runs autonomous, iterative agent workflows. Each loop dispatches a fresh-context worker against externalized state, then keeps going until a convergence check, not the agent's own claim, decides a stop is safe. Four loop families (research, review, AI council, and improvement) live as nested mode packets inside one parent skill, `system-deep-loop`, and all run on one shared runtime, `runtime/`, so they share a state format, a stop contract and a coverage model. The improvement family alone carries three co-equal lanes (agent improvement, model benchmark, skill benchmark), giving six `/deep:*` loop commands in total.

#### How It Works

```
  /deep:<mode>  ─►  INIT / RESUME / RESTART
                              │  anchor to a real spec.md, load JSONL state + lineage
                              ▼
        ┌───────────────────────────────────────────┐
        │  DISPATCH ITERATION (fresh context)       │ ◄────────┐
        │  one pass, one agent, no carry-over       │          │
        └────────────────────┬──────────────────────┘          │
                             ▼                                 │
        ┌───────────────────────────────────────────┐          │  next
        │  WRITE STATE  deep-*-state.jsonl          │          │  iteration
        │  deltas/ + logs/ (atomic append)          │          │
        └────────────────────┬──────────────────────┘          │
                             ▼                                 │
        ┌───────────────────────────────────────────┐          │
        │  REDUCE + SCORE                           │          │
        │  parse terminal events, Bayesian score,   │          │
        │  coverage-graph convergence guards        │          │
        └────────────────────┬──────────────────────┘          │
                             ▼                                 │
                  CONVERGED  +  quality gates pass? ───  no  ──┘
                             │ yes
                             ▼
                  legal_stop_evaluated ─► SYNTHESIZE + write-back
```

&nbsp;
#### Convergence and stopping

A loop decides for itself when the work is actually finished, instead of trusting an agent that says so.
- **Evidence, not vibes:** after each pass the runtime reduces the new state, scores how much fresh signal the pass added, and checks coverage against the loop's own model
- **A stop must be earned:** the loop ends only when the convergence score clears its threshold and every quality gate passes. An open blocker, an active P0 in a review or an uncovered dimension in research, forces another pass
- **Or run to depth on purpose:** set `--stop-policy max-iterations` to keep going for a fixed budget when you want breadth over an early stop
- **Then synthesize:** once a stop is legal the loop writes its report and saves continuity, so the run leaves a durable artifact instead of a chat transcript

&nbsp;
#### Deep Loop Runtime (the shared foundation)

One engine under every loop, so they all work the same way and you learn the workflow once.
- **Consistent across loops:** research, review, council and improvement all dispatch, track and stop the same way
- **Pause and resume anytime:** progress is saved outside the chat, so a loop survives crashes, new sessions and long runs
- **Trustworthy stops:** a loop ends only when the work has actually converged and passed its quality checks, never because an agent says it is done
- **Hands-off or step-by-step:** run fully autonomous with `:auto` or pause at each step with `:confirm`, and start fresh, resume or restart at will
- **Bounded autonomy:** cross-AI fan-out lineages can run with elevated CLI permissions in their own sandboxed workdir; a stall watchdog, a per-lineage cost cap and a lag-ceiling guard bound and observe those subprocesses so autonomy stays supervised, not unattended
- **Self-contained and MCP-free:** the runtime declares its own dependency manifest and resolves `zod`, `better-sqlite3` and the `tsx` loader from its own `node_modules`, with no reach-ins into a sibling skill. It carries executor config, atomic state, scoring, fallback routing and the coverage / council graph scripts

&nbsp;
#### State, the ledger and the append gateway

Every loop keeps its progress in files, not in the chat, and those files are the single source of truth. A typed, append-only event ledger records each iteration, and the `deep-*-state.jsonl` you read is a projection the runtime rebuilds from that ledger.
- **One way in:** a leaf records its iteration through the append gateway, which authorizes the write, fences it behind the ledger, returns a receipt, then refreshes the state projection. Nothing writes the state file directly, so the log never drifts from the ledger
- **Durable or refused, never half-written:** the gateway either commits the record and hands back a receipt, or refuses it and names the failed check so the leaf halts. There is no partial append and no silent fallback to a direct write
- **Replayable:** convergence scores and verdicts recompute from the stored events, so a run can be audited, resumed or rebuilt after a crash from the ledger alone
- **Deltas feed the reducer:** each iteration also writes a structured delta file that the reducer folds into the registry, dashboard and strategy. The reducer owns those derived artifacts; the gateway owns the state log

&nbsp;
#### Cross-AI fan-out

A loop can spread its iterations across several AI models at once, then merge what they find. Bind executors on the command and each one becomes its own lineage.
- **Many models, one loop:** run the same review or research across native agents and CLI bridges (Codex, Claude Code, OpenCode, Cursor, Devin, Pi) in parallel, each lineage on its own state, with a pool that caps how many run at once
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
- **Fewer false alarms:** each critical finding gets re-challenged before it sticks
- **Won't sign off on hidden problems:** an open P0 forces another pass, and the audit must clear its quality checks before it can stop
- **Clear verdict:** a `review-report.md` that ends in PASS, CONDITIONAL or FAIL

&nbsp;
#### Context Retrieval

Maps the existing codebase before you plan, so you extend what's already there instead of rewriting it. Use `@context` for one-shot lookup and continuity recovery. Use `/deep:research` or `/deep:review` when iterative work needs a bounded context snapshot.
- **Reuse first:** context packages and snapshots point to existing `file:symbol` anchors to extend, compose or wrap
- **Right-sized:** quick retrieval stays in `@context`; iterative investigation and audit stay in the research/review loops
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

Three co-equal lanes in the `system-deep-loop` improvement mode. Lane A reviews and upgrades any of your agents: `/deep:agent-improvement` runs `@deep-improvement`. Lane B benchmarks a model or prompt framework: `/deep:model-benchmark`. Lane C diagnoses a skill's real-world routing, discovery, efficiency and usefulness: `/deep:skill-benchmark`.
- **Objective scoring:** rates an agent across five dimensions with fixed, repeatable checks, not another AI's opinion
- **Sees the whole footprint:** finds every place the agent lives (definition, mirrors, commands, workflows, skills) before changing anything
- **Never breaks the original:** changes go to a sandbox copy and only get promoted after they pass scoring, benchmarks and your approval, with rollback if they don't
- **Knows when to stop:** ends once the scores stop improving
- **Benchmarks too (Lanes B/C):** models and prompt frameworks against fixtures with pattern or 5-dimension scoring (deterministic or graded), and skills against real routing and discovery behavior

For details, see the [Deep Loop Runtime README](.opencode/skills/system-deep-loop/runtime/README.md), or the [system-deep-loop README](.opencode/skills/system-deep-loop/README.md), which documents each mode.

---

### 🎯 Skills Library

12 advisor skill identities in `.opencode/skills/`, loaded on demand when Gate 2 matches a task (confidence >= 0.8 means the skill must be loaded).

#### SYSTEM

**system-spec-kit**
- Mandatory orchestrator for all file modifications - activates automatically for any code file change
- Creates numbered spec folders with manifest templates rendered through Level contracts across 4 levels (1-3+)
- Owns the packet continuity writer, the generated trigger index and the ripgrep retrieval recipes
- Manages the manifest template source, 38 validation rules, the spec-kit script suite and the feature-catalog / testing-playbook documentation surfaces

- Owns AST indexing, SQLite graph storage, readiness contracts and `detect_changes` impact checks

**system-skill-advisor**
- Gate 2 skill-routing subsystem at `.opencode/skills/system-skill-advisor/`
- Owns prompt-time skill routing, the `skill_graph_*` tools, freshness and lifecycle checks, plus the shared embedding model server
- Current MCP server name: `system_skill_advisor`. Client namespace: `mcp__system_skill_advisor__*`

&nbsp;
#### CODE WORKFLOW

**sk-code**
- **Write code that fits the stack you're in.** Loads surface-aware patterns, checklists and verification recipes per surface, and detects the active stack from paths and library markers. Unsupported stacks (Go, React/Next.js, generic Node.js, React Native, Swift) trigger a quick disambiguation question
- **Two ready surfaces:** WEBFLOW (Webflow and vanilla HTML/CSS/JS animation, CDN deploy, Lighthouse/TBT/INP targets) and OPENCODE (`.opencode/` system code across JS/TS/Python/Shell/JSON, MCP servers, agents, commands, skills)
- **Verifies before it claims done:** three mandatory phases run implementation, then testing and debugging, then verification
- **Reviews before you ship (`code-review` mode).** A stack-agnostic findings-first review baseline that reuses the surface evidence above; the security, correctness, SOLID and threat-model checklists always run first and their minimums are never relaxed, and findings come ranked P0/P1/P2

**sk-git**
- **One clean path from change to PR.** Orchestrates three sub-skills so branches and commits stay tidy
- **git-worktree:** isolated workspaces, branch creation, parallel development
- **git-commit:** conventional-commit format, staged-change analysis, scope detection
- **git-finish:** PR creation via `gh pr create`, branch cleanup, integration

&nbsp;
#### DEEP LOOP

Two skills power the autonomous loops described in [Deep Loop](#deep-loop) above: **`runtime/`**, the shared MCP-free execution engine every active loop runs on, and **`system-deep-loop`**, the parent skill routing to active nested modes (`deep-research`, `deep-review`, `ai-council`, `deep-improvement`). Use `@context` separately for one-shot retrieval. This parent-nested-skill pattern is the reusable standard behind `/create:sk-skill-parent`.

&nbsp;
#### CROSS-AI CLI

These skills let you run **cross-CLI agent teams from supported runtimes**. Claude Code, OpenCode, or a raw shell can dispatch supported AI CLIs as specialist sub-tools, each one a one-shot non-interactive call that streams structured output back to the caller. The conducting AI stays in charge. The dispatched CLI handles the part it's best at and returns.

> **Self-invocation guard:** every skill refuses to call itself. A Claude Code session never dispatches `cli-claude-code`, an OpenCode session never dispatches `cli-opencode`, etc. Cross-AI delegation only, no cycles.

**cli-external-orchestration**
- **Parent hub for external CLI dispatch.** One advisor identity routing to [`cli-opencode`](.opencode/skills/cli-external-orchestration/cli-opencode/README.md) (OpenCode runtime dispatch), [`cli-claude-code`](.opencode/skills/cli-external-orchestration/cli-claude-code/README.md) (Claude Code CLI), [`cli-codex`](.opencode/skills/cli-external-orchestration/cli-codex/README.md) (OpenAI Codex CLI, availability-gated), [`cli-cursor`](.opencode/skills/cli-external-orchestration/cli-cursor/README.md) (Cursor CLI, availability-gated), [`cli-devin`](.opencode/skills/cli-external-orchestration/cli-devin/README.md) (Devin CLI, availability-gated), and [`cli-pi`](.opencode/skills/cli-external-orchestration/cli-pi/README.md) (Pi CLI, availability-gated) through `mode-registry.json`
- **`cli-opencode`** — OpenCode CLI orchestrator. Use it when the dispatched task needs **the project's full plugin / skill / MCP runtime**, a one-shot `opencode run` boots every plugin in `opencode.json`, every skill under `.opencode/skills/` and every MCP server. Also handles **parallel detached sessions** (`--share --port N` for ablation suites, worker farms) and **cross-repo dispatch** (`--dir <path>`). Default model: `opencode-go/deepseek-v4-pro` at high reasoning. Configured providers span `opencode-go` (default gateway: DeepSeek + open models), `deepseek` (direct API), `minimax-coding-plan` / `minimax` (MiniMax-M3), `xiaomi` (MiMo-V2.5-Pro), `kimi-for-coding` (Kimi k2.7 Code), `zai-coding-plan` (GLM-5.2) and `openai` (`gpt-5.5` family) — see the skill's provider pre-flight for the live list
- **`cli-claude-code`** — Claude Code CLI orchestrator. Use it for **extended thinking (chain-of-thought), surgical diff-based edits and JSON-schema-validated structured output**. Ships with 9 built-in agents and session continuity. Three models: `claude-opus-4-6` (deep reasoning), `claude-sonnet-4-6` (default, balanced), `claude-haiku-4-5` (fast/cheap)
- **`cli-codex`** — OpenAI Codex CLI orchestrator. Use it for **OpenAI-backed coding, repo analysis, PR review, web research and cross-model second opinions**, dispatched through `codex exec` (Codex CLI 0.144.1, `gpt-5.5` family). **Availability-gated / fails closed:** every routing surface checks `command -v codex` before advertising or dispatching, and refuses the route when the binary is absent — an unavailable Codex is never offered as usable. Execution runs through the audited deep-loop runtime, and project hooks + agents mirror the Claude bridge under `.codex/`
- **`cli-cursor`** — Cursor CLI orchestrator. Use it for **Composer-model dispatch** (Cursor's own native model), a **read-only `--mode plan`/`--mode ask`** pass, or a second-AI opinion, dispatched through `cursor-agent -p` (models: `auto` router default, `composer-2.5`/`composer-2.5-fast`, plus 150+ hosted-frontier ids). **Availability-gated / fails closed:** checks `command -v cursor-agent` plus an explicit auth-state probe (`cursor-agent about`), since `-p` exits `0` even on an auth failure. Uniquely among the six, its `.cursor/` config (hooks, MCP, rules) is **shared with the Cursor editor**, not tool-private — a dispatched CLI session inherits the operator's editor-level config
- **`cli-devin`** — Devin CLI orchestrator. Use it for **Cognition-backed multi-model coding, subagent delegation, cloud handoff and cross-model validation**, dispatched through `devin -p` with model selection spanning Opus, Sonnet, GPT, SWE, Gemini and more via Cognition's adaptive router. **Availability-gated / fails closed:** checks `command -v devin` before advertising or dispatching, and refuses the route when the binary is absent
- **`cli-pi`** — Pi CLI orchestrator. Use it for **guarded headless coding, read-only tool-constrained reviews, JSON event output, RPC integration, and Pi-native resource and community-package workflows**, dispatched through `pi --print` / `pi --mode rpc` (Pi CLI 0.82.1 per the pinned contract). **Availability-gated / fails closed:** checks `command -v pi` before advertising or dispatching, and refuses the route when the binary is absent; failure exit codes are unreliable, so inspect output rather than relying on exit status

&nbsp;
#### MCP INTEGRATION

**mcp-code-mode**
- **Reach 200+ external tools without bloating context.** One TypeScript interface fronts every external MCP tool (Figma, GitHub, Chrome DevTools, ClickUp, Webflow)
- **98.7% less context overhead:** tool schemas load on demand at first use, zero upfront cost, type-safe with autocomplete

**mcp-tooling**
- **Parent hub for MCP tool bridges.** One advisor identity routing to `mcp-chrome-devtools` (browser debugging), `mcp-click-up` (ClickUp tasks), and `mcp-figma` (Figma Desktop transport) through `mode-registry.json`
- **`mcp-chrome-devtools` — drive a real browser from the assistant.** Chrome DevTools with smart 2-mode routing: CLI mode (`bdg`) runs in the terminal, supports Unix pipes and composes in CI/CD, with MCP mode as the fallback for multi-tool flows
- **`mcp-click-up` — manage ClickUp tasks from the assistant.** Routes between `cupt` CLI (daily task ops) and the official ClickUp MCP (documents, goals, bulk ops, webhooks) with operation-based routing. Agent-safe by design: per-list status resolution, dry-run before batch completion, `--json` output, empty-queue handling. Embedded install via `mcp-servers/` directory. 96-feature catalog + 76-scenario playbook included
- **`mcp-obsidian` — manage Obsidian notes from the assistant.** Dual CLI + MCP mode using `notesmd-cli` for headless vault operations, the official `obsidian` CLI for app-backed control, and cyanheads `obsidian-mcp-server` through the Local REST API
- **`mcp-figma` _(transport)_ — drive Figma Desktop from the terminal.** Reads, authors, modifies, and exports designs, tokens, and components through the silships `figma-ds-cli`, with an optional Figma MCP via Code Mode for pulling design context. CLI-primary and gated: a local daemon brokers every command, read-only inspection and exports are free, authoring or destructive verbs are gated. Needs Figma Desktop open and uses no API key. Never decides design taste on its own — pairs with `sk-design-md-generator` for the measured design reference

&nbsp;
#### OTHER

**sk-design-md-generator**
- **Standalone design-reference extraction skill.** Crawls a live URL across five viewports and emits a v3 Style Reference `DESIGN.md` — named tokens, Type Scale, Components, Surfaces, Elevation, Agent Prompt Guide, Quick Start CSS/Tailwind — with every value copied verbatim from the running page and script-validated against `tokens.json`. Carries a condensed general design-knowledge layer (Brand-vs-Product register, anti-slop principles, cognitive and numeric design laws, token vocabulary) so it reads design intent, not only CSS
- **Measured ground truth, not invented direction:** captures what a site actually ships; it never authors a new visual direction from a brief. Its style corpus and SQLite/FTS5 style database resolve self-relatively under `styles/`
- **Pairs with `sk-code`:** the skill supplies the measured reference, sk-code builds and verifies against it

**sk-doc**
- **Parent hub for documentation authoring, routed via `mode-registry.json` to ten workflow packets.** Markdown specialist with DQI quality scoring (Structure 40%, Content 35%, Style 25%) plus HVR compliance checking
- **Scaffolds components** (skills, agents, commands) and handles README templates, frontmatter validation, feature-catalog authoring and install guides

**sk-prompt**
- **Standalone prompt-engineering skill.** Turns a rough ask into a structured, scored prompt
- **Auto-selects from 7 frameworks** (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT), then refines and scores: DEPTH thinking across 3-10 rounds, then CLEAR scoring (Correctness, Logic, Expression, Arrangement, Reusability) against a fixed threshold
- **Owns the canonical CLI prompt-quality card** that every `cli-*` executor's local card delegates to for framework selection and the CLEAR pre-dispatch check

---

### 🤖 Agent Network

12 custom specialist agents. Defined in `.opencode/agents/` (source of truth) and mirrored for Claude Code (`.claude/agents/`). OpenCode uses the canonical `.opencode/agents/` definitions directly.

#### AGENT ORCHESTRATION

**Orchestrate**
- **Runs the show on multi-step work.** Decomposes a task, delegates to specialist agents and merges their output into one answer with conflict resolution
- **Read-only by design:** it directs, the specialists implement
- **No runaway chains:** single-hop delegation only, depth 2 max

**Code**
- **Ships surface-aware code and proves it works.** Write-capable specialist that reads `sk-code`'s detected surface at dispatch, so the agent body stays stack-agnostic
- **Seven dispatch modes:** full build, surgical fix, refactor, test-add, scaffold, rename/move, dependency bump
- **Earns every `DONE`:** a Builder → Critic → Verifier self-check plus the Iron Law (no completion claim without fresh stack verification, LOW confidence blocks `DONE`)
- **Fails closed:** failures return to the orchestrator with an `escalation` classifier, no silent retry. Dispatched only by `@orchestrate`

**Context**
- **Finds what you already know before searching code.** Continuity-first retrieval in order: `handover.md` → `_memory.continuity` → packet spec docs → trigger index lookup → ripgrep recipes
- **Returns a Context Package** that combines packet continuity findings with codebase evidence. Read-only

**Review**
- **Guards code quality, never edits.** Strict read-only, loading `sk-code`'s `code-review` mode (the findings-first baseline) and layering its router-selected surface standards
- **Safety floor holds:** security and correctness minimums are never relaxed. Output is findings-first severity with quality scoring

**Debug**
- **A fresh pair of eyes after you're stuck.** Receives a structured context handoff instead of the failed conversation, so it skips inherited bias. Use after 3+ failed tries
- **Systematic 5-phase method:** Observe → Analyze → Hypothesize → Validate → Fix, written up in `debug-delegation.md`

**Markdown**
- **Scoped doc authoring you can trust.** LEAF executor for the `/create:*` family plus scoped spec-doc and markdown writing, loading `sk-doc` and the right template on every run
- **Refuses anything out of scope:** unscoped writes and nested delegation get a canonical REFUSE
- **Deterministic output:** `STATUS=OK PATH=…`, `FAIL` or `CANCELLED`, with a DQI >=75 floor and HVR enforced

**Prompt-Improver**
- **Strengthens high-stakes prompts.** Picks the best `sk-prompt` framework, applies DEPTH at the right energy and validates with CLEAR
- **Returns a structured package** (`FRAMEWORK`, `CLEAR_SCORE`, `RATIONALE`, `ENHANCED_PROMPT`, `ESCALATION_NOTES`). Used by the CLI mirror-card pipeline and `/prompt-improve` agent mode when inline prompting is too weak

&nbsp;
#### DEEP LOOP

**AI Council**
- **Several AI strategies, one vetted plan.** Dispatches distinct reasoning lenses across cli-opencode, cli-claude-code and native for multi-round deliberation. Planning-only. See [Deep Loop](#deep-loop)

**Deep Research**
- **One research iteration at a time, state on disk.** Executes a single LEAF pass; the `/deep:research` command owns the loop. See [Deep Loop](#deep-loop)

**Deep Review**
- **Audits one review pass, read-only on code.** Produces `file:line` findings; the `/deep:review` command owns the loop. See [Deep Loop](#deep-loop)

**Context Retrieval**
- **Maps one slice of the codebase, read-only.** `@context` owns direct lookup and continuity recovery; research/review loops add bounded context snapshots when iteration is needed. See [Deep Loop](#deep-loop)

**Deep Improvement**
- **Proposes one agent improvement, safely.** Writes a single candidate to packet-local runtime; never scores or promotes it. The `/deep:agent-improvement` command handles that. See [Deep Loop](#deep-loop)

---

### ⌨️ Commands

32 command entry points across 8 command groups plus 3 root utilities. Each command is a Markdown entry point under `.opencode/commands/**/*.md` backed by a behavioral execution spec; command families keep their workflow routing (YAML execution specs) separate from their Markdown presentation contracts, so the rendered dashboards stay stable while the underlying workflow evolves.

&nbsp;
#### SPEC KIT

**Plan (intake-only mode)**
- A mode of `/speckit:plan` (`--intake-only`), not a separate command. Standalone intake workflow that publishes `spec.md`, `description.json` and `graph-metadata.json`
- Used directly for new packet setup and paired with `/speckit:plan` or `/speckit:complete` when `folder_state` is `no-spec`, `partial-folder`, `repair-mode` or `placeholder-upgrade`
- Modes: `:auto`, `:confirm`

**Complete**
- End-to-end workflow: intake/delegate → research → plan → implement → verify → save continuity
- Smart-detects missing or unhealthy packet state and reuses the shared intake contract from `/speckit:plan --intake-only`. Healthy folders continue without extra setup prompts
- Modes: `:auto` (fully autonomous), `:confirm` (pause at each step), `:with-research` (adds deep research)
- After 3 failed implementation attempts, surface diagnostics and let the user dispatch `@debug` via the Task tool

**Plan**
- Planning-only workflow that authors `spec.md`, `plan.md` and `tasks.md` without implementing
- Reuses the shared intake contract from `/speckit:plan --intake-only` when the packet is `no-spec`, `partial-folder`, `repair-mode` or `placeholder-upgrade`
- Dispatches up to 4 parallel context agents for codebase exploration during planning
- Use when you need stakeholder review before coding. Modes: `:auto`, `:confirm`

**Implement**
- Executes an existing plan - requires plan.md to already exist
- 9-step workflow covering task breakdown, implementation, testing and verification
- Modes: `:auto`, `:confirm`

**Resume**
- Continues a previous session by auto-loading continuity from the spec folder
- Presents session summary, shows progress against tasks.md
- Works after crashes, compactions or new sessions

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

**Save**
- Updates packet continuity and supporting generated context artifacts via `generate-context.js`
- AI composes structured JSON with session summary, key decisions and findings
- Writes continuity frontmatter and generated metadata in place. There is no separate index to refresh afterwards

**Search**
- Two lexical lanes over spec docs and skill docs: trigger-index lookup with `--triggers`, ripgrep recipes otherwise
- `--paths` and `--count` pick the recipe; `--packet <specFolder>` narrows the search roots
- A phrase nobody wrote is a clean no-hit, never a nearest guess

&nbsp;
#### CREATE

**Skill**
- Unified skill creation and update workflow
- Creates SKILL.md with 8-section structure, README.md, references and assets directories
- Registers in skill catalog. Modes: `:auto`, `:confirm`

**Parent Skill**
- Scaffolds a parent skill with nested mode packets — one hub identity plus a `mode-registry.json` source of truth the modes project from
- Generates the routing-only `SKILL.md`, single hub `graph-metadata.json`, N mode packets and a non-discoverable `shared/`
- The reusable pattern behind `system-deep-loop`. Modes: `:auto`, `:confirm`

**Agent**
- Scaffolds a new agent definition with proper frontmatter, behavioral rules and tool permissions
- Creates source-of-truth file in `.opencode/agents/` and the Claude Code mirror
- Modes: `:auto`, `:confirm`

**Readme**
- Unified README and install guide creation using sk-doc quality standards
- Auto-detects folder type, loads appropriate template, validates via DQI scoring
- Structure 40%, Content 35%, Style 25%. Modes: `:auto`, `:confirm`

**Changelog**
- Auto-detects recent work from spec folder artifacts or git history
- Resolves correct component folder, calculates next version number
- Generates formatted changelog file matching 370+ existing entries. Modes: `:auto`, `:confirm`

**Feature Catalog**
- Creates or updates feature catalog packages with category routing
- Generates both technical reference entries and simple-terms companion entries
- Validates against the 290-entry catalog structure across 22 categories

**Testing Playbook**
- Creates or updates manual testing playbook packages
- Generates scenario files with test steps, expected results and verification evidence fields
- Validates against established playbook format

The package also ships a dedicated [stress-test/](.opencode/skills/system-spec-kit/mcp-server/stress-test/) suite for load, contention and capacity checks. It sits outside the default test run and uses its own `vitest.stress.config.ts` at the [mcp-server/](.opencode/skills/system-spec-kit/mcp-server/) package root, so an operator runs it on purpose rather than on every commit.

&nbsp;
#### DEEP

The active autonomous loop families (the improvement family carries three lanes). See the [Deep Loop](#deep-loop) section for how they run. Use `@context` for one-shot retrieval before planning.

**AI Council** (`/deep:ai-council`)
- Multi-seat planning for complex decisions, planning-only. See [Deep Loop](#deep-loop). Modes: `:auto`, `:confirm`

**Deep Research** (`/deep:research`)
- Iterative research until convergence, anchored to a real `spec.md`, with `new`/`resume`/`restart` lifecycle. See [Deep Loop](#deep-loop). Modes: `:auto`, `:confirm`

**Deep Review** (`/deep:review`)
- Iterative code audit until convergence, ending in a PASS/CONDITIONAL/FAIL verdict. See [Deep Loop](#deep-loop). Modes: `:auto`, `:confirm`

**Agent Improvement** (`/deep:agent-improvement`)
- Evaluates and improves any agent, with guarded promotion and rollback. See [Deep Loop](#deep-loop). Modes: `:auto`, `:confirm`

**Model Benchmark** (`/deep:model-benchmark`)
- Benchmarks a model or prompt framework against fixtures. See [Deep Loop](#deep-loop). Modes: `:auto`, `:confirm`

**Skill Benchmark** (`/deep:skill-benchmark`)
- Diagnoses a skill's real-world routing, discovery and usefulness. See [Deep Loop](#deep-loop). Modes: `:auto`, `:confirm`

&nbsp;
#### DOCTOR

Three commands cover every spec-kit diagnostic surface. Run `/doctor` with no target to see the interactive menu. Upgrade users see "Update everything to match latest release" as option 1.

**`/doctor <target>` (router)**
- Single entry point for 10 subsystems: `memory` (checks the trigger index, its lookup and the ripgrep recipes), `zvec`, `embeddings`, `deep-loop`, `skill-advisor`, `skill-budget`, `skill-graph-freshness`, `parent-skill`, `runtime-mirrors`, `fable-mode`
- Argv-positional dispatch via `.opencode/commands/doctor/_routes.yaml` manifest (canonical per-target metadata: setup vars, allowed flags, mutation class, MCP tools, advisor trigger phrases)
- Each target loads its own self-contained YAML workflow under `assets/doctor_<target>.yaml`
- Interactive menu when no target supplied. Tier 2 per-target prompt when a required flag is missing
- Examples: `/doctor memory --dry-run`, `/doctor embeddings`, `/doctor fable-mode --dir <deep-loop-artifact-dir>` (read-only behavioral-metrics diagnostic)
- `--target=<name>` is preserved as a compatibility alias for flag-only invocation

**`/doctor:mcp install|debug`**
- MCP infrastructure repair (replaces the standalone `/doctor:mcp_install` and `/doctor:mcp_debug` from v3.4.0.0)
- `install`. Fresh install or reinstall of the native MCP servers from their install guides. Handles old-conflicting-with-new (clean reinstall with venv/node_modules removal)
- `debug`. Diagnoses the native MCP servers (System Skill Advisor, Code Mode) with PASS/WARN/FAIL per check. Supports `--fix` for guided repair

**`/doctor:update`**
- Multi-subsystem orchestrator: dependency-safe rebuild across trigger index → skill-graph → advisor → deep-loop
- One lock (`mcp-server/database/.doctor-update.flock`), one pre-mutation snapshot set, one dependency DAG, one rollback policy, one state log (`.doctor-update.last-run.json`)
- Tier-aware mid-run prompts: SHORT steps auto-acknowledge. The LONG-POLE trigger-index regeneration gets an explicit ETA prompt (Q-LONG, 1-5 min)
- Additional gates: Q-PROBE (active MCP clients warning, NOT suppressed by `--force`), Q-LEGACY (per-file cleanup with `--cleanup-legacy`), Q-FAIL (step-failure recovery)
- Use after upgrading spec-kit, after large packet moves or when multiple subsystem doctors would otherwise need to run by hand. Pass `--migrate` to handle schema migration (e.g. v3.3.0.0 → v3.4.1.0). Wall-clock 8-25 min

The 12 underlying YAML workflows in `.opencode/commands/doctor/assets/` are self-sufficient. Each declares its own `role/purpose/action/operating_mode/invariants/upstream_assets/user_inputs/field_handling` block plus phased execution. The `route-validate.{sh,py}` CI script enforces internal consistency on the route manifest.

&nbsp;
#### UTILITY

**Agent Router**
- Routes requests to supported external AI systems such as Claude Code
- The receiving AI operates under its own system prompt - full identity adoption
- Use for cross-AI delegation where the target AI needs to behave as itself

**Prompt**
- Refines prompts and prompt packages through `/prompt-improve` using 7 proven frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT)
- Applies DEPTH thinking methodology with CLEAR quality scoring
- Can return inline improvements or route to `@prompt-improver` for higher-stakes prompt packages

**Goal**
- Sets a session completion condition the agent keeps working toward across turns. See the [Goal Plugin](#goal-plugin) section above for the full contract.

---

### 🎯 Goal Plugin

Gives a session a durable completion objective that survives across turns, instead of losing intent to context resets.
- **Claude Code:** use the built-in native `/goal <condition>` — do not route through `opencode_goal` (that tool does not exist in Claude Code sessions)
- **OpenCode:** `/goal:goal-opencode <condition>` sets a session completion condition the agent keeps working toward across turns; show / pause / clear / complete via the `opencode_goal` tools
- **Backed by the `opencode-goal` OpenCode plugin:** per-session goal state (atomic, fail-closed) plus active-goal injection into each turn; usage is accounted over the session lifecycle
- **Autonomous continuation is default-off** and gated (caps, cooldown, kill-switch). See `.opencode/hooks/goal/goal-plugin.md` for the plugin contract (OpenCode only)

---

### 🔌 Code Mode MCP

Code Mode MCP gives the AI access to external tools (Figma, GitHub, Chrome DevTools, ClickUp, Webflow) through a single TypeScript execution interface. Instead of loading large external tool definitions into context, Code Mode loads them on demand through one interface (1.6k tokens) - a 98.7% reduction.

#### Native MCP Servers

Canonical native server set:

| Server                 | Tools | Purpose                                                                |
| ---------------------- | ----- | ---------------------------------------------------------------------- |
| `system_skill_advisor`     | 9     | Gate 2 advisor routing plus skill-graph scan/query/status/validation   |
| `code_mode`            | 7     | External tool orchestration via TypeScript execution                   |
| `sequential_thinking`  | 1     | Structured multi-step reasoning for complex problems                   |
| **Total**              | **17** |                                                                        |

&nbsp;
#### Code Mode Tools (7)

- **`search_tools`** - Discover relevant tools by task description
- **`tool_info`** - Get complete tool parameters and TypeScript interface
- **`call_tool_chain`** - Execute TypeScript code with access to all registered tools
- **`list_tools`** - List all currently registered tool names
- **`register_manual`** - Register a new tool provider
- **`deregister_manual`** - Remove a tool provider
- **`get_required_keys_for_tool`** - Check required environment variables for a tool

&nbsp;
#### External Integrations (via `.utcp_config.json`)

- **`chrome_devtools_1`** (MCP/stdio) - Browser automation (instance 1). No env var needed.
- **`chrome_devtools_2`** (MCP/stdio) - Browser automation (instance 2). No env var needed.
- **`clickup`** (MCP/stdio) - ClickUp community server (`@taazkareem/clickup-mcp-server`). Requires `CLICKUP_API_KEY`.
- **`clickup_official`** (MCP/stdio) - Official ClickUp MCP (`@clickup/mcp-server`). Requires `CLICKUP_API_KEY` + `CLICKUP_TEAM_ID`. Used by `mcp-click-up` skill.
- **`figma`** (MCP/stdio) - Design files, components, exports. Requires `FIGMA_API_KEY`. This is the optional Code Mode MCP. The primary Figma surface is the `mcp-figma` skill via `figma-ds-cli`.
- **`github`** (MCP/stdio) - Issues, pull requests, commits. Requires `GITHUB_PERSONAL_ACCESS_TOKEN`.
- **`webflow`** (MCP/remote) - Sites, CMS collections. Requires Webflow auth.

&nbsp;
#### Performance

| Metric            | Without Code Mode                          | With Code Mode       |
| ----------------- | ------------------------------------------ | -------------------- |
| Context tokens    | Large external tool schemas loaded upfront | 1.6k (on-demand)     |
| Round trips       | 15+ for chained operations                 | 1 (TypeScript chain) |
| Type safety       | None                                       | Full TypeScript      |
| Context reduction | -                                          | 98.7%                |

To call a Code Mode tool: `call_tool_chain({ code: "const result = await figma.figma_get_file({fileKey: 'abc123'}); return result;" })`

For more on the `mcp-code-mode` skill and TypeScript execution patterns, see the skill at `.opencode/skills/mcp-code-mode/SKILL.md`.

&nbsp;
#### Git Worktree / Continuous Integration

The repo runs a live-sync loop around the worktree-per-session model. Every launch-wrapper session commits in its own isolated worktree and then auto-publishes each commit to a shared live branch. The main checkout auto-follows that branch, so the IDE always shows the combined state of every concurrent session's committed work.

The loop is **on by default** in the main checkout. SessionStart self-heals the git hook install and backgrounds the IDE follower automatically. Disable the whole loop with `SYSTEM_LIVE_SYNC_DISABLED=1`. Finer switches stay available: `SPECKIT_AUTOSYNC=0` for one publish, `SPECKIT_GIT_HOOKS_GUARD=off` for the guard, and `SYSTEM_LIVE_FOLLOW_DISABLED=1` for the follower. See `sk-git/references/continuous-integration.md` for the full model.

---

## 4. CONFIGURATION

<a id="customizing-for-your-stack"></a>
### 🎯 Customizing for Your Stack: Start with `sk-code`

This repo ships as a **public template**. Of the skills it ships with, only one carries stack-specific content, start there:

| Skill / Surface                                     | Out-of-the-box                             | Notes                                                                                                                                                                                                    |
| --------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`sk-code`**                                       | 🎨 Stack-specific (the customization point) | Surface-aware code-quality patterns. Replace the shipped Webflow + OpenCode + Motion.dev surfaces with your own (e.g., Next.js + Tailwind + Postgres or React Native + Reanimated or Go + sqlc, etc.). Includes the findings-first `code-review` mode that reuses these surfaces as review evidence.   |
| `sk-doc`                                            | ✅ Codebase-agnostic                        | Markdown quality + component creation. Works for any project.                                                                                                                                            |
| `sk-git`                                            | ✅ Codebase-agnostic                        | Worktree + commit + PR workflow. Works for any project.                                                                                                                                                  |
| `sk-design-md-generator`                  | ✅ Codebase-agnostic                        | Standalone design-reference extraction: crawls a live URL and emits a v3 Style Reference `DESIGN.md` (named tokens, type scale, components, Quick Start CSS/Tailwind), every value measured and validated against `tokens.json`. Pairs with `sk-code` for the build. Works for any project. |
| `system-spec-kit`                                   | ✅ Codebase-agnostic                        | Spec folder workflow + validator + continuity. Works for any project.                                                                                                                                        |
| `mcp-code-mode`                                     | ✅ Codebase-agnostic                        | Multi-tool MCP orchestration. Works for any project.                                                                                                                                                     |
| `system-deep-loop` | ✅ Codebase-agnostic                        | Parent hub for the unified deep-loop skill (research, review, ai-council and improvement modes, including agent improvement and model/skill benchmarking) over nested `runtime/` infrastructure. Work for any topic / target.     |
| `sk-prompt`                                         | ✅ Codebase-agnostic                        | Prompt-engineering framework. Works for any project.                                                                                                                                                     |
| `cli-external-orchestration` | ✅ Codebase-agnostic                        | Parent hub for external CLI dispatch: routes to `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, and `cli-pi`. Stack-independent.                                                                                                                                                           |
| `mcp-tooling`                                       | ✅ Codebase-agnostic                        | Parent hub for MCP tool bridges: `mcp-chrome-devtools` (browser tooling), `mcp-click-up` (ClickUp task management via cupt CLI + official MCP, requires `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID`), `mcp-obsidian` (Obsidian notes via notesmd-cli, the official obsidian CLI, and cyanheads obsidian-mcp-server), and `mcp-figma` (Figma Desktop transport via the silships `figma-ds-cli`, requires Figma Desktop open). Stack-independent.   |

**Adding your own skills:** the shipped set is intentionally minimal, most teams will add their own skills (project-specific workflows, ops runbooks, domain-specific reviewers, etc.). That's expected and supported. Just drop them into `.opencode/skills/<your-skill>/` and they'll be picked up by the advisor. The shipped skills above are kept agnostic so upstream updates apply cleanly to your fork.

**What "adapting `sk-code`" looks like**:
- Replace `references/webflow/`, `references/opencode/`, `references/motion_dev/` with your stack's references (e.g., `references/nextjs/`, `references/postgres/`).
- Replace `assets/webflow/`, `assets/opencode/`, `assets/motion_dev/` with your stack's assets (checklists, recipes, snippets).
- Update `SKILL.md` §2 Smart Routing, `STACK_FOLDERS` dict + the bash detection block, to match your stack's marker files and CWD signals.
- Update the `RESOURCE_MAP` intent → file paths to point at your renamed references/assets.
- Bump `sk-code` version + ship a changelog. Use the `assets/opencode/checklists/skill-authoring.md` checklist as your guide.

The other shipped skills will continue working unchanged: `sk-doc` will still validate your markdown, `sk-git` will still manage your branches, `system-spec-kit` will still spec your work. `sk-code`'s `code-review` mode auto-adapts to your customized surfaces at review time.

&nbsp;
### Core Configuration Files

- **`CLAUDE.md`** - Gate definitions, behavior rules, coding anti-patterns. Used by Claude Code (primary runtime).
- **`AGENTS.md`** - Agent routing, capability reference, gate documentation. Used by all runtimes.
- **`opencode.json`** - MCP server bindings, model configuration and launcher notes. Used by OpenCode platform.
- **`.utcp_config.json`** - Code Mode external tool registrations. Used by `mcp-code-mode` skill.
- **`.claude/mcp.json`** - Claude Code MCP configuration. Claude Code only.
- **`.vscode/mcp.json`** - VS Code / Copilot MCP configuration wrapper.

&nbsp;
### Retrieval And Continuity Configuration

Nothing to configure. The trigger index is a committed file regenerated by `node .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs`, the ripgrep recipes read the working tree, and the continuity writer updates the packet in place. There is no database, no daemon and no embedding provider on this path. The skill advisor keeps its own model-server settings.

&nbsp;
### MCP Config Shape

```json
{
  "mcp": {
    "system_skill_advisor": {
      "type": "local"
    },
    "code_mode": {
      "type": "local"
    },
    "sequential_thinking": {
      "type": "local"
    }
  }
}
```

---

## 5. FAQ

**Q: Do I need all 13 skills installed to use the framework?**

A: No. Skills are loaded on demand by Gate 2. You only need the ones relevant to your work. The two core documentation skills - `system-spec-kit` and `sk-doc` - cover most documentation workflows. The MCP and cross-AI CLI skills require additional local tooling or API keys depending on the surface.
&nbsp;
**Q: Is this only for OpenCode or does it work with other runtimes?**

A: It works with OpenCode and Claude Code. OpenCode uses plugin surfaces; Claude Code uses hook adapters.
&nbsp;
**Q: What happens if I do not use a spec folder?**

A: Gate 3 blocks file modifications until a spec folder answer is provided. You can skip it with option D, but skipped sessions are undocumented and will not be recoverable through `/speckit:resume` or `/memory:search`. For trivial changes under 5 characters in a single file, Gate 3 does not trigger.
&nbsp;
**Q: How does retrieval know what is relevant to my current task?**

A: Packet continuity and any supporting generated context artifacts use structured frontmatter and anchored markdown so the trigger index generator can classify and index them reliably. For recovery, start with `/speckit:resume` and the packet-local continuity ladder `handover.md` -> `_memory.continuity` -> canonical spec docs. After that, the trigger index lookup matches your prompt against author-declared trigger phrases and the ripgrep recipes in `retrieval-conventions.md` cover free text. Both lanes are lexical, so a phrase no author declared and no document contains is a clean no-hit.
&nbsp;
**Q: Can I use this framework without the continuity features?**

A: Yes. The Spec Kit documentation workflow (Gate 3, spec folders, templates) works whether or not you ever run `/memory:save`. You lose cross-session recovery, but structured documentation, agent routing and skill loading all still work.
&nbsp;
**Q: How do I add a new skill to the framework?**

A: Use `/create:sk-skill` to scaffold the skill structure. The command creates the `SKILL.md`, references and assets directories following the `sk-doc` template. Then register the skill in `.opencode/skills/README.txt`.
&nbsp;
**Q: What does "local-first" mean for continuity?**

A: Everything is a file in your own repository. Continuity lives in the spec folder, the trigger index is a committed JSON file and retrieval is ripgrep over the working tree. No session data, code or context leaves the machine.
&nbsp;
**Q: How do I contribute a new agent definition?**

A: Define the agent in `.opencode/agents/` (the source of truth), then mirror the adapter into `.claude/agents/`. Use `/create:agent` to scaffold the file from the agent template.
&nbsp;
**Q: How many MCP tools are there and where are they defined?**

&nbsp;

**Q: What is the feature catalog?**

---

## 6. RELATED DOCUMENTS

**Internal Documentation:**

- **[→ AGENTS.md](AGENTS.md)** - Agent routing, gate definitions, behavior rules
- **[→ Spec Kit README](.opencode/skills/system-spec-kit/README.md)** - Spec folder workflow, Level contract template set, validation rules
- **[→ Spec-Kit Engine README](.opencode/skills/system-spec-kit/mcp-server/README.md)** - Validation, generated metadata and runtime hook adapters
- **[→ Repo Scripts Runbook](.opencode/scripts/README.md)** - Dry-run orphan MCP sweeper, Claude cleanup, and LaunchAgent template guidance
- **[→ Skill Advisor README](.opencode/skills/system-skill-advisor/README.md)** - Standalone `system_skill_advisor` server, nine advisor/skill-graph tools and routing docs
- **[→ Architecture](.opencode/skills/system-spec-kit/ARCHITECTURE.md)** - API boundary contract
- **[→ sk-doc Skill](.opencode/skills/sk-doc/SKILL.md)** - Documentation standards, DQI scoring
- **[→ Skills Index](.opencode/skills/README.txt)** - Skills library and invocation patterns
- **[→ Feature Catalog](.opencode/skills/system-spec-kit/feature-catalog/feature-catalog.md)** - Current technical reference
- **[→ Manual Testing Playbook](.opencode/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md)** - Operator validation scenarios, including runtime lifecycle checks
- **[→ Latest System Spec-Kit Release Notes](.opencode/skills/system-spec-kit/changelog/v3.6.0.0.md)** - Most recent shipped release notes
- **[→ Daemon CLI Reference](.opencode/skills/system-spec-kit/references/cli/daemon-cli-reference.md)** - Full-parity CLI front doors over the warm daemons

**External Resources:**

- **[→ OpenCode](https://github.com/sst/opencode)** - The underlying AI coding platform
- **[→ Voyage AI](https://www.voyageai.com/)** - Cloud embedding provider (opt-in)
- **[→ HuggingFace](https://huggingface.co/)** - Free local embedding alternative


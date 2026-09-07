---
title: "Spec Kit Commands"
description: "Slash commands for the spec folder development lifecycle: planning, implementation, deep-research, resumption, continuity save and retrieval."
trigger_phrases:
  - "spec kit command"
  - "spec kit plan"
  - "spec kit implement"
  - "deep research"
  - "spec kit handover"
  - "spec kit resume"
  - "deep review"
  - "spec kit phase"
  - "spec kit complete"
  - "memory save"
  - "memory search"
  - "continuity writer command"
  - "trigger index lookup command"
---

# Spec Kit Commands

> Slash commands for the spec folder development lifecycle from planning through completion, plus packet continuity write and retrieval.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. COMMANDS](#2--commands)
- [3. STRUCTURE](#3--structure)
- [4. WORKFLOW PROGRESSION](#4--workflow-progression)
- [5. EXECUTION MODES](#5--execution-modes)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. TOOL COVERAGE MATRIX](#7--tool-coverage-matrix)
- [8. FAQ](#8--faq)
- [9. TROUBLESHOOTING](#9--troubleshooting)
- [10. RELATED DOCUMENTS](#10--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `speckit` command group manages the full development lifecycle around spec folders. Commands cover planning, implementation, deep-research, resumption, end-to-end workflows, continuity writing, and lexical retrieval over spec docs and skill docs.

Most commands load a YAML workflow from `assets/` and execute it step by step, supporting `:auto` and `:confirm` execution modes. `save` and `search` are the exception: each is a direct-dispatch router with no mode suffix — `save` routes straight to the continuity writer, `search` routes straight to the trigger-index lookup or a ripgrep recipe.

Retrieval runs on two local mechanisms and no background service:

- **The generated trigger index**, read by `node .opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "<prompt>"`. It matches a prompt against author-declared `trigger_phrases`.
- **The ripgrep recipes** in `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md`, which find a phrase anywhere in the corpus with no index at all.

Both are lexical. A phrase that is not written in the corpus is not found, and `search` says so rather than returning a nearest guess. Section 7 lists what that costs.

Writing goes through one script: `node .opencode/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js`. It keeps atomic same-directory update and lock semantics, needs no daemon, and has no indexing handoff after it. Ripgrep cannot write, so no retrieval recipe substitutes for it.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:commands -->
## 2. COMMANDS

| Command | Invocation | Steps | Description |
|---------|------------|-------|-------------|
| **plan** | `/speckit:plan <description> [:auto\|:confirm] [:with-phases]` | 7 | Create spec folder and plan without implementation. `:with-phases` adds phase decomposition pre-workflow |
| **implement** | `/speckit:implement <spec-folder> [:auto\|:confirm]` | 9 | Execute pre-planned work (requires existing plan.md) |
| **deep-research** | `/deep:research <topic> [:auto\|:confirm\|:review\|:review:auto\|:review:confirm]` | iterative | Autonomous deep research loop with convergence detection |
| **deep-review** | `/deep:review <target> [:auto\|:confirm]` | iterative | Autonomous code review loop with severity-weighted findings |
| **resume** | `/speckit:resume [spec-folder] [:auto\|:confirm]` | varies | Resume or recover work on an existing spec folder |
| **plan --intake-only** | `/speckit:plan --intake-only [description] [:auto\|:confirm]` | intake-only | Standalone intake that publishes `spec.md`, `description.json`, and `graph-metadata.json` |
| **complete** | `/speckit:complete <description> [:auto\|:confirm] [:with-research] [:with-phases]` | 14+ | Full end-to-end workflow combining all phases. `:with-phases` adds phase decomposition pre-workflow |
| **search** | `/speckit:search <query> [--packet <specFolder>] [--triggers] [--paths] [--count]` | direct-dispatch | Lexical retrieval: trigger-index lookup and the ripgrep recipes over spec docs and skill docs |
| **save** | `/speckit:save <spec-folder>` | direct-dispatch | Write session context into the packet's continuity surfaces |

### Search Lanes

The two lanes answer different questions. Prompt-to-declared-phrase matching is a keyed lookup over an author-controlled field; grepping prose is a scan. Using the scan for trigger matching loses precision, and using the index for free text loses everything the author never declared.

| Lane | Flag | Mechanism |
|------|------|-----------|
| Trigger index | `--triggers` | `lookup-trigger-index.mjs` over the generated index |
| Free-text evidence | default | Structured JSONL recipe, `retrieval-conventions.md` Section 2.1 |
| Which files mention it | `--paths` | Path-only recipe, Section 2.2 |
| How many times | `--count` | Count recipe, Section 2.3 |

Scope by positional path, not by pattern: `--packet specs/<track>/<NNN-name>` replaces the search roots with that packet.

### Command Dependencies

| Command | Requires |
|---------|----------|
| `plan` | Nothing (creates new spec folder) |
| `implement` | Existing `plan.md` in spec folder |
| `deep-research` | Nothing (iterative research with convergence detection) |
| `deep-review` | Target files or spec folder to review |
| `resume` | Existing spec folder with saved state or recoverable session context |
| `complete` | Nothing (runs full lifecycle) |
| `search` | Nothing (read-only lexical retrieval) |
| `save` | Nothing (creates or refreshes packet continuity surfaces) |

<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```text
speckit/
├── README.txt        # This file, 8-command index and workflow guide
├── complete.md       # /speckit:complete - Full end-to-end workflow
├── implement.md      # /speckit:implement - Execute planned work
├── plan.md           # /speckit:plan - Planning only (+ `--intake-only` standalone intake)
├── resume.md         # /speckit:resume - Resume existing work
├── save.md           # /speckit:save - Continuity writer front door
├── search.md         # /speckit:search - Trigger-index lookup + ripgrep recipes
└── assets/           # YAML workflow definitions, plus save/search presentation contracts
    ├── speckit-complete-auto.yaml
    ├── speckit-complete-confirm.yaml
    ├── speckit-implement-auto.yaml
    ├── speckit-implement-confirm.yaml
    ├── speckit-plan-auto.yaml
    ├── speckit-plan-confirm.yaml
    ├── speckit-resume-auto.yaml
    ├── speckit-resume-confirm.yaml
    ├── save-presentation.txt
    └── search-presentation.txt

deep/                 # Deep workflows (research, review, AI council)
├── research.md               # /deep:research - Autonomous deep research loop
├── review.md                 # /deep:review - Autonomous code review loop
├── ai-council.md             # /deep:ai-council - Multi-topic deep AI council
└── assets/
    ├── deep-research-auto.yaml
    ├── deep-research-confirm.yaml
    ├── deep-review-auto.yaml
    ├── deep-review-confirm.yaml
    └── deep-ai-council-auto.yaml

> Note: `/doctor skill-advisor` previously lived under `speckit/`; it is now organized under `.opencode/commands/doctor/` alongside `mcp_install` and `mcp_debug` since it tunes runtime configuration rather than driving the spec workflow.
```

`save` and `search` keep the direct-dispatch asset-naming convention they carried before joining this folder: `save-presentation.txt` and `search-presentation.txt` drop the family prefix because the bare command name already reads unambiguously, unlike `plan`, `implement`, `complete` and `resume`, which need the `speckit-` prefix to stay distinctive.

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:workflow-progression -->
## 4. WORKFLOW PROGRESSION

The typical development lifecycle follows this progression:

```text
/deep:research (optional)
    |
    v
/speckit:plan (create spec folder + plan.md)
    |
    v
phase (optional: decompose into phase children)
    |
    v
/speckit:implement (execute plan.md tasks)
    |
    v
/speckit:save (preserve continuity before ending a session)
    |
    v
/speckit:resume (continue in a new or interrupted session)
    |
    v
/speckit:search (find prior decisions or context by hand)
```

The `complete` command combines research, plan, and implement into a single invocation. `save` and `search` sit alongside the lifecycle rather than inside it — either can run at any point.

### Agent Delegation

| Command | Delegates To |
|---------|-------------|
| plan | Main agent owns planning and may reuse the shared intake contract (`../../skills/system-spec-kit/references/workflows/intake-contract.md`); /deep:research optional |
| implement | @general (code changes), distributed governance for packet docs |
| deep-research | /deep:research (iterative investigation) |
| deep-review | /deep:review (iterative code audit) |
| resume | Loads memory context, continues from last state |
| phase | Main agent creates packet folders, @general runs scripts as needed |
| complete | /deep:research and @general as needed, with the shared intake contract (`../../skills/system-spec-kit/references/workflows/intake-contract.md`) when packet state requires repair |
| save | No delegation — routes directly to `generate-context.js` |
| search | No delegation — routes directly to the trigger-index lookup or a ripgrep recipe |

<!-- /ANCHOR:workflow-progression -->

---

<!-- ANCHOR:execution-modes -->
## 5. EXECUTION MODES

| Mode | Suffix | Behavior |
|------|--------|----------|
| **Auto** | `:auto` | Execute all steps without approval prompts |
| **Confirm** | `:confirm` | Pause at each step and wait for user approval |

The `complete` command supports two additional flags:

| Flag | Effect |
|------|--------|
| `:with-research` | Add research phase before planning |

Each mode-pair command maps to a YAML workflow file in `assets/`:
- Auto: `speckit_<command>_auto.yaml`
- Confirm: `speckit_<command>_confirm.yaml`

`save` and `search` carry no `:auto`/`:confirm` suffix. Each is a single-pass direct-dispatch router with its own presentation contract (`save-presentation.txt`, `search-presentation.txt`) and no owned workflow YAML.

<!-- /ANCHOR:execution-modes -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

```bash
# Plan a new feature (creates spec folder + plan.md)
/speckit:plan "Add rate limiting to API" :auto

# Implement from an existing plan
/speckit:implement specs/012-rate-limiting :confirm

# Deep research a topic before planning
/deep:research "OAuth 2.0 token refresh patterns" :auto

# Decompose a complex feature into phases
/speckit:plan:auto "Build hybrid RAG search system" :with-phases --phases 3

# Save continuity before ending a long session
/speckit:save specs/012-rate-limiting

# Find a phrase anywhere in spec docs and skill docs
/speckit:search "how does the auth system work"

# Scope the search to one packet
/speckit:search "auth flow" --packet specs/012-rate-limiting

# Match a prompt against author-declared trigger phrases
/speckit:search "resume work session context" --triggers

# Resume work in a new or interrupted session
/speckit:resume specs/012-rate-limiting :auto

# Full end-to-end with research
/speckit:complete "Add WebSocket support" :auto :with-research

# Check that the trigger index and the retrieval conventions are healthy
/doctor speckit-retrieval

# Optimize skill advisor scoring (now under /doctor:* group, not speckit)
/doctor skill-advisor :auto
```

Both retrieval mechanisms behind `search` are runnable by hand, which is the point — you can check exactly what the command saw:

```bash
# The trigger-index lane
node .opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs \
  --json -- "resume work session context"

# The free-text lane, path-only recipe, scoped to one packet
rg --no-config --fixed-strings --ignore-case \
  --files-with-matches --max-count 1 \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -- 'trigger index generator' specs/012-rate-limiting

# Regenerate the trigger index after editing a document's trigger_phrases
node .opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs
```

Copy the recipe flags literally. `--no-config` stops `RIPGREP_CONFIG_PATH` from injecting arguments you never wrote, the two exclusion globs keep archived packets and vendored trees out of the result set, and `--` makes a phrase beginning with a hyphen a pattern rather than a parse error.

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:tool-coverage -->
## 7. TOOL COVERAGE MATRIX

The retired continuity server exposed 41 tools across seven layers. They are replaced by two local mechanisms and one writer, and several capabilities are not replaced at all. This table maps capability to owner, because an honest map is shorter than the inventory it replaces.

| Capability | Owner now | Command |
|------------|-----------|---------|
| Prompt-to-declared-phrase matching | Generated trigger index, read by `lookup-trigger-index.mjs` | `/speckit:search --triggers` |
| Free-text search over spec docs and skill docs | Ripgrep recipes, `retrieval-conventions.md` Section 2 | `/speckit:search` |
| Path-only and count retrieval | Ripgrep recipes, Sections 2.2 and 2.3 | `/speckit:search --paths`, `--count` |
| Context and anchor evidence | Ripgrep recipe, Section 2.4, plus the caller-side ranking tuple in Section 5 | `/speckit:search` |
| Resume and context assembly | The continuity ladder: `handover.md`, then `_memory.continuity`, then packet-first spec docs and bounded anchors. No session inference | `/speckit:resume` |
| Continuity frontmatter writing | `generate-context.js`, keeping atomic same-directory update and lock semantics | `/speckit:save` |
| Index maintenance | `generate-trigger-index.mjs` | (script) |
| Index and convention health | Trigger-index and retrieval-convention diagnostics | `/doctor speckit-retrieval` |
| Embedder and model-server status | The skill advisor, which owns the shared model server | `/doctor embeddings` |

### Declared Losses

These had no replacement, and no recipe approximates one. `search` reports them as unsupported rather than degrading into a guess.

| Capability | Boundary |
|------------|----------|
| Semantic paraphrase, vector and BM25 fusion, decay, access tracking, session dedup | Deliberate lexical-only loss. A phrase that is not written in the corpus is not found, and a miss is a clean no-hit |
| Causal graph traversal, lineage and drift analysis | Grep cannot traverse or statefully update graph edges. Explicit Markdown cross-links and a packet's `decision-record.md` are what remain |
| Epistemic baselines and learning history | Removed with the database. A packet's `tasks.md` and `implementation-summary.md` are the record |
| Channel ablations and eval dashboards | Removed with the database. There are no stored eval snapshots and no channels to ablate |
| Resource maps as a dynamic graph | A static generated path catalog, not a graph |

### Coverage by Command

| Command | Mechanisms | Writes |
|---------|-------------|--------|
| `/speckit:search` | Trigger index + 4 ripgrep recipes | none (read-only) |
| `/speckit:save` | `generate-context.js` | continuity frontmatter, `description.json`, `graph-metadata.json` |
| `/speckit:resume` | continuity ladder + scoped ripgrep recipe | none |
| `/doctor speckit-retrieval` | index probe + recipe probe | packet-scratch report only |

> **Note:** Every mechanism above is a local script or a `rg` invocation the operator can run by hand. Nothing in this command group depends on a background service, so a stopped daemon is not a degraded session.

<!-- /ANCHOR:tool-coverage -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: What is the difference between `/speckit:plan` and `/speckit:complete`?**

`/speckit:plan` creates the spec folder and plan.md, then stops. It does not implement anything. `/speckit:complete` runs the full lifecycle: optional research, planning, and implementation in a single command. Use `plan` when you want to review and adjust the plan before committing to implementation. Use `complete` when you want to run the whole workflow without interruption.

**Q: When should I dispatch `@debug` instead of just fixing the issue directly?**

Dispatch `@debug` via the Task tool after 3 or more failed fix attempts on the same task. The specialist brings a fresh context and a 5-phase methodology, which helps avoid compounding the current session's assumptions when the root cause is still unclear.

**Q: Can I resume a spec folder that was never explicitly saved?**

Yes. `/speckit:resume` loads the best available continuation context for the spec folder even if you never wrote a handover entry. The canonical recovery ladder is `handover.md` -> `_memory.continuity` -> canonical spec docs. If one rung is missing, resume continues with the next packet-local source. If no saved state exists anywhere in that ladder, the command prompts you to start fresh with `/speckit:plan`. Running `/speckit:save` before ending a session still improves the first recovery pass, but it is not required.

**Q: How does `:with-phases` relate to the parent spec folder?**

The `:with-phases` flag on `/speckit:plan` or `/speckit:complete` creates a parent spec folder and one or more child phase folders under it (e.g., `specs/015-feature/001-phase/`, `specs/015-feature/002-phase/`). Each phase is a self-contained spec folder with its own spec.md, plan.md and tasks.md. The parent folder holds the top-level spec.md and coordinates the phases. Use `:with-phases` for work that is too large for a single spec folder or that has clearly sequential milestones.

**Q: What is the difference between `/speckit:search` and `/speckit:resume`?**

`/speckit:search` finds text: it matches a prompt against declared trigger phrases, or runs one ripgrep recipe over spec docs and skill docs. `/speckit:resume` handles session continuation and interrupted-session recovery: it walks the continuity ladder — `handover.md`, then `_memory.continuity`, then canonical spec docs — and falls back to a packet-scoped ripgrep recipe only for a gap the packet named and did not answer. Use `search` for lookup and `resume` when you need to continue prior work.

**Q: Why did `/speckit:search` return nothing for a query I know is covered?**

Retrieval is lexical. It matches the text you typed, not the meaning. Rephrase using the wording that actually appears in the documents, or widen the search roots.

**Q: How do I refresh retrieval after editing a document?**

For the free-text lane, you do not: `rg` reads the files directly, so an edit is visible immediately. For the trigger lane, rerun `node .opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` after changing a document's `trigger_phrases`.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:troubleshooting -->
## 9. TROUBLESHOOTING

| Problem | Cause | Fix |
|---------|-------|-----|
| Implement fails: "no plan.md" | Spec folder missing plan.md | Run `/speckit:plan` first |
| Resume finds no context | No saved continuity for spec folder | Start fresh with `/speckit:plan` |
| Debug routing unclear | No clear failing task or repeated failure pattern | Dispatch `@debug` via Task tool once failure_count >= 3 and provide specific error context |
| YAML workflow not found | Missing asset file | Verify `assets/` contains matching YAML for your mode |
| Continuity save adds little context | No significant work in session | Use `/speckit:save` after meaningful progress or rely on `/speckit:resume` ladder |
| Phase creates wrong structure | Incorrect --phases or --phase-names | Verify parent spec folder exists, re-run with correct arguments |
| Complete takes too long | Full lifecycle runs all phases | Use specific commands (plan, implement) for faster execution |
| "No match" from search | The phrase is not written in the searched roots | Rephrase with wording that appears in the documents, or widen the roots. Exit `1` means the command worked and found nothing |
| Search reports an error with stderr | Ripgrep exited `2` or higher: a search root that does not exist, or a malformed pattern | Read the stderr. Exit `1` and exit `2` both produce empty stdout, so the exit status is the only discriminator |
| Trigger lookup fails with an error | The generated index is missing or unreadable | Run `/doctor speckit-retrieval`, then regenerate with `generate-trigger-index.mjs` |
| A new document never matches a trigger prompt | Its `trigger_phrases` are absent, generic, or the index predates the edit | Add distinctive phrases per `retrieval-conventions.md` Section 8, then regenerate the index |
| A recipe returns an unexpected output shape | Two output-mode flags were combined; the last one wins silently | Use exactly one output mode per invocation |

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:related-documents -->
## 10. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [Parent: OpenCode Commands](../README.txt) | Overview of all command groups |
| [system-spec-kit SKILL.md](../../skills/system-spec-kit/SKILL.md) | Spec folder workflow, documentation levels, packet continuity |
| [AGENTS.md](../../../AGENTS.md) | Gate system, agent routing, spec folder requirements |
| [Ripgrep Retrieval Conventions](../../skills/system-spec-kit/references/retrieval/retrieval-conventions.md) | The recipes, scoping rules, exit-status mapping and ranking tuple behind `search` |
| [Trigger index lookup](../../skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs) | The keyed Gate 1 lane over the generated index |
| [Trigger index generator](../../skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs) | Regenerates the index from document frontmatter |
| [Continuity writer](../../skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js) | The named packet-local writer `save` invokes |

<!-- /ANCHOR:related-documents -->

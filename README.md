# Skilled - Agent Orchestration with Spec Kit and Local Memory

[![GitHub Stars](https://img.shields.io/github/stars/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration?style=for-the-badge&logo=github&color=fce566&labelColor=222222)](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration/stargazers)
[![License](https://img.shields.io/github/license/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration?style=for-the-badge&color=7bd88f&labelColor=222222)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration?style=for-the-badge&color=5ad4e6&labelColor=222222)](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration/releases)

Skilled is a public AI-assistant framework for running software work with durable context, explicit documentation, verified tool routing and multi-runtime agent surfaces. It layers a Spec Kit workflow, local-first memory, structural code intelligence, skills, commands and agents on top of OpenCode, with mirrors for Claude Code and Codex CLI.

> Don't buy me unwanted coffee: https://buymeacoffee.com/michelkerkmeester

---

## Contents

- [What This Repo Provides](#what-this-repo-provides)
- [Quick Start](#quick-start)
- [Runtime Architecture](#runtime-architecture)
- [Current Surface Counts](#current-surface-counts)
- [Spec Kit Workflow](#spec-kit-workflow)
- [Memory System](#memory-system)
- [Code Graph](#code-graph)
- [Skills, Commands and Agents](#skills-commands-and-agents)
- [Configuration](#configuration)
- [Where To Look Next](#where-to-look-next)
- [FAQ](#faq)

---

## What This Repo Provides

| Layer | Current role |
|---|---|
| **Spec Kit workflow** | Requires a scoped spec folder for file-modifying work, keeps `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` and optional QA docs coherent. |
| **Spec Kit Memory** | Local-first memory and continuity system with 37 MCP tools, hybrid retrieval, checkpointing, causal analysis, eval/reporting, async ingest and task learning records. |
| **Code Graph** | Standalone structural index for symbols, imports, calls, blast radius and diff impact checks. |
| **Skill Advisor** | Gate 2 routing that recommends the right skill from the checked-in skill library. |
| **Skills, commands and agents** | 21 checked-in skills, 28 command entry points and 12 source-of-truth OpenCode agents, with Claude and Codex mirrors. |
| **Code Mode** | TypeScript bridge for external MCP integrations without loading every external schema into prompt context up front. |

The framework is intentionally workflow-heavy. It is built for sessions where an assistant must recover context, choose the right operating mode, change files only inside scope and verify before claiming completion.

---

## Quick Start

### Prerequisites

- Node.js 18+
- `npm`
- `git`
- POSIX shell
- Optional local embeddings through Ollama with `nomic-embed-text:v1.5`

### Install

```bash
git clone https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration.git
cd opencode--spec-kit-skilled-agent-orchestration
npm install
```

The checked-in MCP launchers self-vendor their runtime dependencies on first use. You do not need a global TypeScript compiler to start the committed launchers.

### Optional Local Embeddings

```bash
ollama pull nomic-embed-text:v1.5
```

If no cloud key is configured, the memory system prefers local embeddings. The provider cascade is local-first, with Ollama first, HuggingFace Local as fallback and OpenAI or Voyage only when explicitly configured.

### Verify The Native Runtime Surface

```bash
node .opencode/bin/mk-spec-memory-launcher.cjs --help
node .opencode/bin/mk-skill-advisor-launcher.cjs --help
node .opencode/bin/mk-code-index-launcher.cjs --help
```

Open the repo in OpenCode and use the command surfaces under `.opencode/commands/`. For a full implementation flow, start with `/speckit:complete`. For planning only, use `/speckit:plan`. For recovering prior work, use `/speckit:resume`.

---

## Runtime Architecture

### Native MCP Servers

`opencode.json` registers five native MCP servers:

| Server | Tools | Purpose |
|---|---:|---|
| `sequential_thinking` | 1 | Structured multi-step reasoning helper. |
| `mk-spec-memory` | 37 | Spec Kit Memory, session recovery, memory search, save, lifecycle, eval, embedder, checkpoint and task-learning tools. |
| `mk_skill_advisor` | 9 | Advisor routing plus skill-graph scan, query, status, validation and trusted propagation. |
| `mk_code_index` | 8 | Structural code graph scan, query, context, status, verify, recovery and diff impact detection. |
| `code_mode` | 7 | TypeScript interface for external MCP tool providers in `.utcp_config.json`. |

The native registered tool schema total is 62 when Code Mode and Sequential Thinking are counted with the three Spec Kit daemons.

### Daemon-Backed CLI Front Doors

Three daemon systems also expose additive CLI front doors over the same warm daemons:

| CLI | MCP daemon | Tool count | Use it for |
|---|---|---:|---|
| `.opencode/bin/spec-memory.cjs` | `mk-spec-memory` | 37 | Transport-down recovery, hooks, cron, CI and shell diagnostics for memory tools. |
| `.opencode/bin/code-index.cjs` | `mk_code_index` | 8 | Code-graph status and maintenance access when MCP transport is unavailable. |
| `.opencode/bin/skill-advisor.cjs` | `mk_skill_advisor` | 9 | Advisor fallback, skill graph diagnostics and trusted maintenance commands. |

These CLIs are not replacement servers. MCP remains the primary in-session transport. The CLIs are second IPC clients to the same daemons. Prompt-time fallback should use warm-only probing, and exit `75` means retryable daemon or IPC unavailability.

Per-command help and aliases, the shared exit-code taxonomy (`0`/`1`/`64`/`69`/`75`), the `list-tools --compact` / `--names-only` discovery modes, generated `bash`/`zsh` completion and an offline smoke check (`.opencode/bin/cli-offline-smoke.cjs`) are documented in `.opencode/skills/system-spec-kit/references/cli/daemon_cli_reference.md`.

### External Tool Bridge

Code Mode reads `.utcp_config.json`. The current registered external providers are two isolated Chrome DevTools instances, official ClickUp MCP, Figma and GitHub. Code Mode loads tool schemas on demand through TypeScript execution instead of injecting every external tool schema into every prompt.

---

## Current Surface Counts

| Surface | Count | Source of truth |
|---|---:|---|
| Skills | 21 | `.opencode/skills/*/SKILL.md` |
| OpenCode agents | 12 | `.opencode/agents/*.md` |
| Claude agent mirrors | 12 | `.claude/agents/*.md` |
| Codex agent mirrors | 12 | `.codex/agents/*.toml` |
| Commands | 28 | `.opencode/commands/**/*.md` |
| Native MCP servers | 5 | `opencode.json` |
| Daemon-backed CLI front doors | 3 | `.opencode/bin/spec-memory.cjs`, `.opencode/bin/code-index.cjs`, `.opencode/bin/skill-advisor.cjs` |

The checked-in `.opencode/skills/README.md`, `.opencode/agents/`, `.opencode/commands/` and `AGENTS.md` are the best entry points when you need the live roster rather than a summary.

---

## Spec Kit Workflow

Spec Kit is the documentation and continuity contract for AI-assisted changes.

Every file-modifying task is expected to have a spec folder. The default packet shape is:

```text
.opencode/specs/<track>/<packet>/
├── spec.md
├── plan.md
├── tasks.md
├── implementation-summary.md
├── description.json
└── graph-metadata.json
```

Larger work adds `checklist.md`, `decision-record.md`, `handover.md`, `resource-map.md`, research outputs or phase children. Phase parents stay lean with `spec.md`, `description.json` and `graph-metadata.json`; child phases hold the working docs.

The operating gates are:

1. **Context surfacing** through Spec Kit Memory.
2. **Skill routing** through the Skill Advisor.
3. **Spec folder selection** before edits.
4. **Verification** before any completion claim.

Strict validation lives at `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`. Run it against the relevant spec folder before claiming a task is complete.

---

## Memory System

Spec Kit Memory is local-first and currently uses schema v37. The schema line includes v34 trigger embeddings, v35 `source_kind` provenance, v36 idempotency receipts and near-duplicate hints, and v37 tombstone-ready partitions.

### Retrieval

The memory search stack combines vector retrieval, FTS5, BM25, causal graph signals, degree signals, session attention, state filtering, response profiles and provenance traces. It is designed for spec docs, decisions, handovers and continuity. For arbitrary code structure, use Code Graph first.

Key retrieval and continuity features include:

- `memory_context` for intent-aware context retrieval.
- `memory_search` for targeted semantic search.
- `memory_match_triggers` for fast trigger and cognitive surfacing.
- `session_bootstrap`, `session_resume` and `session_health` for session recovery.
- Packet-local recovery through `handover.md`, `_memory.continuity` and canonical spec docs.
- Retrieval observability through trace envelopes, source metadata and confidence signals.

### Default-Off And Shadow-First Hardening

The current hardening work deliberately ships conservative by default:

| Capability | Flag or control | Default behavior |
|---|---|---|
| Semantic trigger matcher | `SPECKIT_SEMANTIC_TRIGGERS`, `SPECKIT_SEMANTIC_TRIGGERS_MODE` | Off. Shadow mode records diagnostics without changing lexical results. Union mode is explicit opt-in. |
| Session-trace causal inference | `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE` | Off. No derived causal edges unless enabled. |
| Feedback retention reducers | `SPECKIT_FEEDBACK_RETENTION_LEARNING`, `SPECKIT_FEEDBACK_RETENTION_MODE` | Off or shadow. Active mutation requires the master flag plus gated evidence. |
| Soft-delete tombstones | `SPECKIT_SOFT_DELETE_TOMBSTONES` | Off. Hard-delete behavior remains default until explicitly enabled. |
| Memory idempotency receipts | `SPECKIT_MEMORY_IDEMPOTENCY` | Off. Schema support exists, but writes behave as before until enabled. |
| Authored continuity snapshot | `SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT` | Off. Transcript-derived continuity remains the fallback. |
| Completion freshness | `SPECKIT_COMPLETION_FRESHNESS`, `SPECKIT_COMPLETION_FRESHNESS_ENFORCE` | Off. Can warn first, then enforce when explicitly promoted. |

The full flag table is in `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`.

### Storage And Providers

Memory data is stored in SQLite under the Spec Kit Memory skill tree unless overridden. Vector shards and index tables are separate files. Cloud providers are opt-in through `OPENAI_API_KEY` or `VOYAGE_API_KEY`; without those, the system stays local where possible.

---

## Code Graph

`mk_code_index` owns structural code intelligence. Use it for callers, callees, imports, file outlines, reverse dependencies, blast radius and diff impact checks.

Important behavior:

- `code_graph_query` answers structural questions.
- `code_graph_context` returns compact neighborhoods, outlines or impact context.
- `detect_changes` maps unified diffs to affected symbols and refuses stale graphs.
- `code_graph_status` reports freshness, readiness, trust state and graph quality.
- `code_graph_scan`, `code_graph_verify` and `code_graph_apply` are maintenance surfaces.

End-user scans exclude `.opencode/skills`, `.opencode/agents`, `.opencode/commands`, active spec docs and `.opencode/plugins` by default so project-code answers stay focused. Maintainers can opt those areas in with the documented `SPECKIT_CODE_GRAPH_INDEX_*` flags or per-call scan arguments.

---

## Skills, Commands And Agents

### Skills

The checked-in skills live under `.opencode/skills/` and are loaded on demand. Families are:

- `system-*`: Spec Kit, Code Graph and Skill Advisor foundations.
- `sk-*`: code, review, docs, git and prompt workflows.
- `deep-*`: context, research, review, AI council and improvement loops plus shared runtime.
- `cli-*`: cross-AI CLI dispatch for Codex, Claude Code and OpenCode.
- `mcp-*`: Code Mode, Chrome DevTools and ClickUp integrations.

Use `.opencode/skills/README.md` as the skill index. Use `SKILL.md` inside a skill folder for runtime instructions.

### Commands

Commands are Markdown entry points under `.opencode/commands/`. Current groups include:

- `/speckit:*` for plan, implement, complete and resume workflows.
- `/memory:*` for save, search, manage and learn workflows.
- `/deep:*` for autonomous context, research, review, council, improvement and benchmark loops.
- `/create:*` for skills, agents, changelogs, READMEs, feature catalogs and testing playbooks.
- `/doctor*` for diagnostics, MCP install/debug and dependency-aware updates.
- Root utilities such as `/prompt` and the external agent router.

### Agents

`.opencode/agents/` is the OpenCode source of truth. The repo also ships `.claude/agents/` Markdown mirrors and `.codex/agents/` TOML mirrors for runtime-specific execution.

The current roster covers orchestration, code, context, review, debug, markdown, prompt improvement, AI council, deep context, deep research, deep review and deep improvement.

---

## Configuration

| File | Purpose |
|---|---|
| `AGENTS.md` | Universal assistant rules, gates, skill routing, MCP routing and verification discipline. |
| `opencode.json` | OpenCode permissions and native MCP registrations. |
| `.utcp_config.json` | Code Mode external MCP provider registrations. |
| `.claude/mcp.json` | Claude Code MCP configuration. |
| `.codex/config.toml` | Codex CLI MCP and profile configuration. |
| `.vscode/mcp.json` | VS Code and Copilot MCP wrapper configuration. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Complete Spec Kit Memory and daemon CLI environment reference. |

Most users customize `sk-code` first. It owns stack-specific coding standards and verification recipes. The Spec Kit, memory, doc, git, review, deep-loop and CLI skills are designed to stay codebase-agnostic.

---

## Where To Look Next

| Need | Start here |
|---|---|
| Framework rules and gates | `AGENTS.md` |
| Skills catalog | `.opencode/skills/README.md` |
| Spec Kit workflow | `.opencode/skills/system-spec-kit/SKILL.md` and `.opencode/skills/system-spec-kit/README.md` |
| Memory runtime and tools | `.opencode/skills/system-spec-kit/mcp_server/README.md` |
| Memory flags | `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` |
| Code Graph | `.opencode/skills/system-code-graph/SKILL.md` |
| Skill Advisor | `.opencode/skills/system-skill-advisor/README.md` |
| Commands | `.opencode/commands/` |
| Agents | `.opencode/agents/`, `.claude/agents/`, `.codex/agents/` |
| Latest checked-in changelog | `.opencode/skills/system-spec-kit/changelog/` |

---

## FAQ

**Is this only for OpenCode?**

No. OpenCode is the primary runtime surface, but the repo also ships Claude Code and Codex agent mirrors, MCP configs and hook-compatible recovery paths.

**Do I need every MCP server?**

The framework expects the five native MCP registrations for the full experience. The three daemon-backed CLIs provide additive fallback for Spec Kit Memory, Code Graph and Skill Advisor when a warm daemon exists but the runtime MCP transport is missing or unavailable.

**Can I use the Spec Kit workflow without memory?**

Yes. Spec folders, templates and validation are file-based. Memory adds retrieval, continuity and lifecycle automation, but the documentation workflow remains useful without cloud services or external databases.

**Where do I add project-specific coding rules?**

Start with `.opencode/skills/sk-code/`. Replace or extend its surface references, assets and detection rules for your stack.

**Where is the license?**

See `LICENSE`.

---

*Documentation version: 5.0 | Last updated: 2026-06-10 | Framework: 12 OpenCode agents, 21 checked-in `.opencode` skills, 28 commands, 5 native MCP servers, 3 daemon-backed CLI front doors.*

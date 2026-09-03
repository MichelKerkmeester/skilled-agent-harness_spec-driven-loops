---
title: "Memory Commands"
description: "Slash commands for packet continuity: lexical retrieval over spec docs and skill docs, and the continuity writer. (/memory:manage and /memory:learn are retiring — the database they administered is being removed.)"
trigger_phrases:
  - "memory command"
  - "memory save"
  - "memory search"
  - "continuity writer command"
  - "trigger index lookup command"
---

# Memory Commands

> Slash commands for preserving and retrieving packet continuity across sessions.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. COMMANDS](#2--commands)
- [3. STRUCTURE](#3--structure)
- [4. USAGE EXAMPLES](#4--usage-examples)
- [5. MANAGE SUBCOMMANDS](#5--manage-subcommands)
- [6. TOOL COVERAGE MATRIX](#6--tool-coverage-matrix)
- [7. FAQ](#7--faq)
- [8. TROUBLESHOOTING](#8--troubleshooting)
- [9. RELATED DOCUMENTS](#9--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `memory` command group covers packet continuity: writing session context into a packet's own documents, and finding text in spec docs and skill docs. Session recovery lives under `/speckit:resume`.

Two commands are live. `/memory:save` is the writer front door and `/memory:search` is the retrieval front door. `/memory:manage` and `/memory:learn` are retiring: the indexed-continuity database they administered is being decommissioned, and phase 003 of the memory decommission deletes them.

Retrieval runs on two local mechanisms and no background service:

- **The generated trigger index**, read by `node .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs --json -- "<prompt>"`. It matches a prompt against author-declared `trigger_phrases`.
- **The ripgrep recipes** in `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md`, which find a phrase anywhere in the corpus with no index at all.

Both are lexical. A phrase that is not written in the corpus is not found, and the commands say so rather than returning a nearest guess. Section 6 lists what that costs.

Writing goes through one script: `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js`. It keeps atomic same-directory update and lock semantics, needs no daemon, and has no indexing handoff after it. Ripgrep cannot write, so no retrieval recipe substitutes for it.

### Canonical Section Order

All memory commands keep routing prose above presentation appendices: purpose or assets first, then router/workflow contract, hard rules, presentation boundary, and related commands.

Visible dashboards, prompts, examples, and errors live in each command's presentation asset so routers stay thin.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:commands -->
## 2. COMMANDS

| Command | Invocation | Description |
|---------|------------|-------------|
| **search** | `/memory:search <query> [--packet <specFolder>] [--triggers] [--paths] [--count]` | Lexical retrieval: trigger-index lookup and the ripgrep recipes over spec docs and skill docs |
| **save** | `/memory:save <spec-folder>` | Write session context into the packet's continuity surfaces |
| **manage** | `/memory:manage` | RETIRING — the indexed-continuity database is being decommissioned; no active routes |
| **learn** | `/memory:learn` | DEPRECATED — the constitutional-memory layer was retired; no active routes |

### Search Lanes

The two lanes answer different questions. Prompt-to-declared-phrase matching is a keyed lookup over an author-controlled field; grepping prose is a scan. Using the scan for trigger matching loses precision, and using the index for free text loses everything the author never declared.

| Lane | Flag | Mechanism |
|------|------|-----------|
| Trigger index | `--triggers` | `lookup-trigger-index.mjs` over the generated index |
| Free-text evidence | default | Structured JSONL recipe, `retrieval-conventions.md` Section 2.1 |
| Which files mention it | `--paths` | Path-only recipe, Section 2.2 |
| How many times | `--count` | Count recipe, Section 2.3 |

Scope by positional path, not by pattern: `--packet specs/<track>/<NNN-name>` replaces the search roots with that packet.

### Retiring Subcommands

`/memory:manage` no longer accepts subcommands. Its stats, scan, cleanup, retention, learned-trigger, ledger, tier, trigger, validation, delete, health, checkpoint and ingest routes all operated on the database being removed. See Section 5 for where each one went.

`/memory:learn` is deprecated. The constitutional-memory layer it managed — an always-surface, search-boosted rule tier — was retired and removed from the code, and the former rule files were deleted from the repository. Use `/memory:save` to preserve scoped context instead.

<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```text
memory/
├── README.txt      # This file, command index and capability map
├── search.md       # /memory:search - Trigger-index lookup + ripgrep recipes
├── save.md         # /memory:save - Continuity writer front door
├── manage.md       # /memory:manage - RETIRING (database being decommissioned)
└── learn.md        # /memory:learn - DEPRECATED (constitutional-memory layer retired)
```

The `assets/` folder contains the presentation contracts for memory commands. Workflows are defined inline within each command file until a separate workflow asset is introduced.

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:usage-examples -->
## 4. USAGE EXAMPLES

```bash
# Save context to a spec folder
/memory:save specs/007-feature-name

# Find a phrase anywhere in spec docs and skill docs
/memory:search "how does the auth system work"

# Scope the search to one packet
/memory:search "auth flow" --packet specs/007-feature-name

# List which files mention a phrase, without the matching lines
/memory:search "trigger index generator" --paths

# Count matches per file
/memory:search "retrieval conventions" --count

# Match a prompt against author-declared trigger phrases
/memory:search "resume work session context" --triggers

# Recover from a crashed or interrupted session
/speckit:resume

# Auto-recovery mode
/speckit:resume :auto

# Check that the trigger index and the retrieval conventions are healthy
/doctor memory
```

Both retrieval mechanisms are runnable by hand, which is the point — you can check exactly what the command saw:

```bash
# The trigger-index lane
node .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs \
  --json -- "resume work session context"

# The free-text lane, path-only recipe, scoped to one packet
rg --no-config --fixed-strings --ignore-case \
  --files-with-matches --max-count 1 \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -- 'trigger index generator' specs/007-feature-name

# Regenerate the trigger index after editing a document's trigger_phrases
node .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs
```

Copy the recipe flags literally. `--no-config` stops `RIPGREP_CONFIG_PATH` from injecting arguments you never wrote, the two exclusion globs keep archived packets and vendored trees out of the result set, and `--` makes a phrase beginning with a hyphen a pattern rather than a parse error.

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:manage-subcommands -->
## 5. MANAGE SUBCOMMANDS

`/memory:manage` is retiring and accepts no subcommands. Each former route is listed here with its successor so an operator who remembers the old surface lands somewhere real.

| Former subcommand | Where the work lives now |
|------------|-----------|
| `stats`, `health`, `validate` | `/doctor memory` — diagnoses the trigger index and the retrieval conventions: index present, lookup runs, recipes resolve |
| `scan [--force]` | `node .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs` — regenerates the index from document frontmatter in one local pass. This is the trigger-index maintenance path |
| `cleanup`, `retention-sweep`, `bulk-delete`, `delete` | Nothing. There are no stored records to age out or delete; packet documents are the record and are managed as files |
| `learned-expire`, `learned-clear` | Nothing. Learned triggers were a database tier. `trigger_phrases` is an author-controlled frontmatter field, edited in the document |
| `tier`, `triggers` | Edit the document's `trigger_phrases` frontmatter, then rerun the generator |
| `checkpoint create/list/restore/delete` | Git. The packet documents are versioned files |
| `ingest start/status/cancel` | Nothing. There is no ingestion step; the generator reads frontmatter directly |
| `ledger-sweep` | Nothing. The feedback and audit ledgers lived in the same database |

<!-- /ANCHOR:manage-subcommands -->

---

<!-- ANCHOR:tool-coverage -->
## 6. TOOL COVERAGE MATRIX

The retired continuity server exposed 41 tools across seven layers. They are replaced by two local mechanisms and one writer, and several capabilities are not replaced at all. This table maps capability to owner, because an honest map is shorter than the inventory it replaces.

| Capability | Owner now | Command |
|------------|-----------|---------|
| Prompt-to-declared-phrase matching | Generated trigger index, read by `lookup-trigger-index.mjs` | `/memory:search --triggers` |
| Free-text search over spec docs and skill docs | Ripgrep recipes, `retrieval-conventions.md` Section 2 | `/memory:search` |
| Path-only and count retrieval | Ripgrep recipes, Sections 2.2 and 2.3 | `/memory:search --paths`, `--count` |
| Context and anchor evidence | Ripgrep recipe, Section 2.4, plus the caller-side ranking tuple in Section 5 | `/memory:search` |
| Resume and context assembly | The continuity ladder: `handover.md`, then `_memory.continuity`, then packet-first spec docs and bounded anchors. No session inference | `/speckit:resume` |
| Continuity frontmatter writing | `generate-context.js`, keeping atomic same-directory update and lock semantics | `/memory:save` |
| Index maintenance | `generate-trigger-index.mjs` | (script) |
| Index and convention health | Trigger-index and retrieval-convention diagnostics | `/doctor memory` |
| Embedder and model-server status | The skill advisor, which owns the shared model server | `/doctor embeddings` |

### Declared Losses

These had no replacement, and no recipe approximates one. The commands report them as unsupported rather than degrading into a guess.

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
| `/memory:search` | Trigger index + 4 ripgrep recipes | none (read-only) |
| `/memory:save` | `generate-context.js` | continuity frontmatter, `description.json`, `graph-metadata.json` |
| `/memory:manage` (retiring) | none | none |
| `/memory:learn` (deprecated) | none | none |
| `/speckit:resume` | continuity ladder + scoped ripgrep recipe | none |
| `/doctor memory` | index probe + recipe probe | packet-scratch report only |

> **Note:** Every mechanism above is a local script or a `rg` invocation the operator can run by hand. Nothing in this command group depends on a background service, so a stopped daemon is not a degraded session.

<!-- /ANCHOR:tool-coverage -->

---

<!-- ANCHOR:faq -->
## 7. FAQ

**Q: What is the difference between `/memory:search` and `/speckit:resume`?**

`/memory:search` finds text: it matches a prompt against declared trigger phrases, or runs one ripgrep recipe over spec docs and skill docs. `/speckit:resume` handles session continuation and interrupted-session recovery: it walks the continuity ladder — `handover.md`, then `_memory.continuity`, then canonical spec docs — and falls back to a packet-scoped ripgrep recipe only for a gap the packet named and did not answer. Use `search` for lookup and `resume` when you need to continue prior work.

**Q: Why did `/memory:search` return nothing for a query I know is covered?**

Retrieval is lexical. It matches the text you typed, not the meaning. The retired backend could match a paraphrase; this one cannot, and it reports a miss as a miss rather than returning something adjacent. Rephrase using the wording that actually appears in the documents, or widen the search roots.

**Q: Can I still use `/memory:manage` or `/memory:learn`?**

No. `/memory:manage` administered the indexed-continuity database, which is being decommissioned; Section 5 maps each former subcommand to its successor. `/memory:learn` managed the constitutional-memory rule tier, which was retired and removed from the code. Use `/memory:save` to preserve context and `/memory:search` to find it.

**Q: How do I refresh retrieval after editing a document?**

For the free-text lane, you do not: `rg` reads the files directly, so an edit is visible immediately. For the trigger lane, rerun `node .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs` after changing a document's `trigger_phrases`.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:troubleshooting -->
## 8. TROUBLESHOOTING

| Problem | Cause | Fix |
|---------|-------|-----|
| "No match" from search | The phrase is not written in the searched roots | Rephrase with wording that appears in the documents, or widen the roots. Exit `1` means the command worked and found nothing |
| Search reports an error with stderr | Ripgrep exited `2` or higher: a search root that does not exist, or a malformed pattern | Read the stderr. Exit `1` and exit `2` both produce empty stdout, so the exit status is the only discriminator |
| Trigger lookup fails with an error | The generated index is missing or unreadable | Run `/doctor memory`, then regenerate with `generate-trigger-index.mjs` |
| A new document never matches a trigger prompt | Its `trigger_phrases` are absent, generic, or the index predates the edit | Add distinctive phrases per `retrieval-conventions.md` Section 8, then regenerate the index |
| Results look filtered in a way you did not ask for | A recipe was run without `--no-config`, or with the globs reordered | Copy the recipe literally: positive glob first, exclusions last, `--no-config` always |
| A recipe returns an unexpected output shape | Two output-mode flags were combined; the last one wins silently | Use exactly one output mode per invocation |
| Save fails | Spec folder path invalid or missing | Verify the path exists under `specs/` |
| Resume finds no session | No saved context from a prior session | Use `/speckit:plan` to start fresh, or `/memory:search` with a manual query |

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [Parent: OpenCode Commands](../README.txt) | Overview of all command groups |
| [system-spec-kit SKILL.md](../../skills/system-spec-kit/SKILL.md) | Spec folder workflow and validation entry point |
| [Ripgrep Retrieval Conventions](../../skills/system-spec-kit/references/retrieval/retrieval-conventions.md) | The recipes, scoping rules, exit-status mapping and ranking tuple |
| [Trigger index lookup](../../skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs) | The keyed Gate 1 lane over the generated index |
| [Trigger index generator](../../skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs) | Regenerates the index from document frontmatter |
| [Continuity writer](../../skills/system-spec-kit/scripts/dist/memory/generate-context.js) | The named packet-local writer for continuity frontmatter |

<!-- /ANCHOR:related-documents -->

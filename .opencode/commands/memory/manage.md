---
description: "RETIRING — the indexed-continuity database is being decommissioned; this command no longer administers it."
argument-hint: "(retiring — no active routes)"
allowed-tools: Read, Glob
---

# /memory:manage — RETIRING

> **RETIRING.** This command administered the indexed-continuity database: stats, index scans,
> cleanup, retention sweeps, learned triggers, ledger sweeps, tier and trigger edits, validation,
> deletes, health, checkpoints and ingest. **That database is being decommissioned.** Every route
> above operated on a store that is going away, so none of them is offered any more. Phase 003 of
> the memory decommission deletes the server and this command with it.

The file is retained only because command routing may still reference it. Do not restore database
administration behavior from it.

---

## 1. WHAT CHANGED

Retrieval and continuity no longer run through a database, so there is no lifecycle left to manage.

| Retired here | Where the work lives now |
|---|---|
| `stats`, `health`, `validate` | `/doctor memory` — diagnoses the generated trigger index and the ripgrep conventions: index present, lookup runs, recipes resolve. |
| `scan` (index refresh) | `node .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs` — regenerates the trigger index from document frontmatter in one local pass. This is the trigger-index maintenance path. |
| `cleanup`, `retention-sweep`, `bulk-delete`, `delete` | Nothing. There are no stored records to age out or delete. Packet documents are the record, and they are managed as files. |
| `learned-expire`, `learned-clear` | Nothing. Learned triggers were a database tier. `trigger_phrases` is now an author-controlled frontmatter field, edited in the document. |
| `tier`, `triggers` | Edit the document's `trigger_phrases` frontmatter directly, then rerun the generator above. |
| `checkpoint create/restore/list/delete` | Git. The packet documents are versioned files. |
| `ingest start/status/cancel` | Nothing. There is no corpus ingestion step; the generator reads frontmatter directly. |
| `ledger-sweep` | Nothing. The feedback and audit ledgers lived in the same database. |

---

## 2. WHAT TO USE INSTEAD

| Need | Command |
|---|---|
| Find a phrase in spec docs or skill docs | `/memory:search` |
| Match a prompt against author-declared trigger phrases | `/memory:search --triggers` |
| Write session context into a packet's continuity surfaces | `/memory:save` |
| Recover a session and get one next step | `/speckit:resume` |
| Check that the trigger index and retrieval conventions are healthy | `/doctor memory` |
| Regenerate the trigger index | `node .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs` |

---

## 3. CAPABILITY LOSS

Some of what the database offered has no replacement, and saying so is the point of this notice.

Semantic paraphrase, vector and BM25 fusion, decay, access tracking, session dedup and causal
traversal are **unsupported**. Retrieval is lexical: a phrase that is not written in the corpus is
not found, and the honest answer is a clean no-hit rather than a nearest guess. Lineage questions
are answered by a packet's `decision-record.md` and its explicit Markdown cross-links, not by a
graph the tooling can traverse.

---

## 4. STATUS

```text
STATUS=OK ACTION=retiring
```

This command performs no database access, holds no mutating tool grants, and writes nothing.
It is deleted in phase 003 of the memory decommission.

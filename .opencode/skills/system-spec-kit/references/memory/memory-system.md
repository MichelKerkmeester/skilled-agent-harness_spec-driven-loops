---
title: Retrieval and Continuity Reference
description: How spec-folder retrieval and continuity work after the memory MCP surface was retired: the trigger index, the ripgrep lane, the continuity ladder, and what is gone for good
trigger_phrases:
  - "retrieval and continuity reference"
  - "trigger index behavior"
  - "importance tier behavior"
  - "declared capability loss"
  - "indexable content sources"
importance_tier: normal
contextType: general
version: 3.6.0.55
---

# Retrieval and Continuity Reference

How a spec folder is found and how a session is resumed, after the memory MCP surface was retired. Retrieval is lexical and file-based; continuity is written by one script into the packet's own documents.

---

## 1. OVERVIEW

Two mechanisms, and they answer different questions. A keyed lookup matches a prompt against phrases an author declared. A scan finds text anywhere in the corpus. Neither infers meaning, and neither runs a service.

### Architecture

| Component | Location | Purpose |
|-----------|----------|---------|
| Trigger index | `data/trigger-index.json` | Committed index over author-declared `trigger_phrases`; the Gate 1 lookup surface |
| Index generator | `scripts/retrieval/generate-trigger-index.mjs` | Rebuilds the index from spec-doc and skill-doc frontmatter |
| Index lookup | `scripts/retrieval/lookup-trigger-index.mjs` | Resolves a prompt from a cold Node process; exit `0` hit, `1` miss, `2` broken |
| Free-text lane | `rg`, per `../retrieval/retrieval-conventions.md` | Finds a phrase anywhere, with no index at all |
| Continuity writer | `scripts/dist/memory/generate-context.js` | The only writer of `_memory.continuity`; source at `scripts/memory/generate-context.ts` |

There is no server, no database and no daemon in that table. That is the point: a fresh clone answers Gate 1 before anything is built, and a flapping background process cannot degrade a session.

### Core Support

- **Declared-phrase lookup** — matches what authors wrote in `trigger_phrases`, nothing more
- **Free-text scan** — literal, case-folded matching over Markdown, scoped by path
- **Importance tiers** — an authored frontmatter field, still written and still read by humans
- **Continuity ladder** — `handover.md`, then `_memory.continuity`, then packet-first spec docs

### Indexable Content Sources

The index reads frontmatter from two active source families, plus a retired-compatibility row that survives only in historical packets:

| Source | Location Pattern | Field read | Default Tier |
|--------|-----------------|------------|--------------|
| **Spec Documents** | `specs/**/*.md` and `<active-spec-folder>/**/*.md` | `trigger_phrases`, `title`, `description` | `normal` |
| **Skill Documents** | `.opencode/skills/**/*.md` | `trigger_phrases`, `title`, `description` | `normal` |
| **Retired Compatibility Artifacts** | Older `specs/*/memory/*.{md,txt}` files already present in historical packets | Varies | `normal` |

**Content Source Behavior:**

- **Spec Documents** — the canonical packet continuity source. Recovery reads `handover.md`, then `_memory.continuity`, then the rest of the packet docs before widening into a scan.
- **Skill Documents** — routing and reference vocabulary, indexed the same way.
- **Retired Compatibility Artifacts** — older session notes may still exist in historical packets. Save workflows stopped producing them, and they are not an active surface.

---

## 2. IMPORTANCE TIERS

Six-tier system, authored in frontmatter:

| Tier | Purpose |
|------|---------|
| **Critical** | High-importance context |
| **Important** | Significant decisions and context |
| **Normal** | Standard session context |
| **Temporary** | Short-term notes |
| **Archived** | Archived context, kept for the record |
| **Deprecated** | Outdated, kept for history |

The tier is a human signal about a document's weight. It is not a search boost: nothing multiplies a score by tier any more, because nothing scores. Authors should keep setting it honestly, and readers should treat it as the author's claim about importance rather than a ranking input.

---

## 3. RETRIEVAL SURFACES

### Gate 1 trigger lookup

```bash
node .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs \
  --json -- "<prompt>"
```

The result carries matched paths, the phrases that matched, and a match class. Branch on all three exit statuses: `0` is a hit, `1` is a clean miss, and `2` is a bad invocation or an unreadable index. Reading stdout alone cannot tell `1` from `2`, because both are empty.

### Free-text scan

The literal recipes live in [`../retrieval/retrieval-conventions.md`](../retrieval/retrieval-conventions.md) §2. Copy the flags rather than paraphrasing them: `--no-config` blocks argument injection through `RIPGREP_CONFIG_PATH`, the two exclusion globs keep archived and vendored trees out, and `--` keeps a hyphen-leading phrase a pattern instead of a parse error.

One output mode per invocation. Combining `--json` with `--count` or `--files-with-matches` is not rejected; the last flag wins silently, and a JSONL parser handed count output sees an empty result rather than an error.

### Scoping

Narrow by positional path, never by pattern. `specs/<track>` is a track, `specs/<track>/<NNN-name>` is a packet, and one more segment is a phase child. The trailing positional argument is the whole scoping mechanism.

---

## 4. RANKING

Ripgrep supplies matches, paths and lines. It never ranks relevance, and no wrapper may imply that it does. Ordering is the caller's job, applied after parsing, using the stable tuple in `../retrieval/retrieval-conventions.md` §5: evidence field, then normalized match class, then relative path and line number.

The tuple is deterministic by construction, so two runs over an unchanged corpus produce the same ordering. It is a sort, not a relevance model.

---

## 5. ANCHOR-BASED RETRIEVAL (TOKEN-EFFICIENT)

Anchors let a caller read one section instead of a whole document, which is where most of the token saving lives.

**When to use anchors:**
- You need specific sections (summary, decisions), not full content
- The packet docs are large
- You are loading context for a specific purpose, such as resuming work or reviewing decisions

**Common anchor patterns:**

| Anchor ID | Content | Use Case |
|-----------|---------|----------|
| `summary` | High-level overview | Quick context refresh |
| `decisions` | Key decisions made | Understanding rationale |
| `metadata` | File metadata, dates, status | Filtering and sorting |
| `state` | Project state snapshot | Resume work |
| `context` | Project context | Understand scope |
| `artifacts` | Modified/created files | Track changes |
| `blockers` | Current blockers | Identify issues |
| `next-steps` | Planned actions | Continue work |

**Finding anchors:**

```bash
# Which anchors does this packet declare?
rg --no-config -o -- '<!-- ANCHOR:[a-zA-Z0-9-]+ -->' specs/<track>/<NNN-name>

# Read one anchor block with bounded context
rg --no-config --json --fixed-strings --ignore-case -C 2 \
  --glob '*.md' -- '<!-- ANCHOR:summary -->' specs/<track>/<NNN-name>
```

The grammar is an exact pair: an opening `<!-- ANCHOR:id -->` and a closing `<!-- /ANCHOR:id -->` with the same `id`, addressed by one-based line numbers. Ordinary section IDs are lower-kebab; typed IDs may carry a type prefix such as `DECISION-pipeline-003`. Report an unmatched or orphan marker as a diagnostic rather than dropping it silently.

**Token savings:**
- Full document: ~2000 tokens
- One anchor block: ~150 tokens
- Two anchor blocks: ~300 tokens

---

## 6. CONTINUITY

### Read path

`/speckit:resume` owns the ladder and walks it in order:

1. `handover.md` at the resolved folder root
2. `_memory.continuity` frontmatter inside `implementation-summary.md`
3. Canonical spec docs: `implementation-summary.md`, `tasks.md`, `plan.md`, `spec.md`
4. The bounded context recipe, when the packet docs do not answer the question

There is no session inference at any step. Each rung is a file read, and a missing rung falls through to the next.

### Write path

`/memory:save` composes structured JSON and hands it to the writer:

```bash
node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js \
  /tmp/save-context-data-<session-id>.json \
  specs/<track>/<NNN-name>
```

The writer routes content into the right canonical doc and refreshes `description.json` and `graph-metadata.json`. It keeps atomic same-directory update and lock semantics, so a partial write cannot leave a half-updated continuity block. It is the only writer of `_memory.continuity`, and there is no indexing hand-off after it returns.

An explicit spec-folder target on the command line is authoritative and wins over any `specFolder` inside the payload. Full save mechanics live in [`save-workflow.md`](./save-workflow.md).

---

## 7. REGENERATING THE INDEX

```bash
node .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs
```

Run it when a document's `trigger_phrases` changed. The artifact is committed, so regeneration belongs in the same commit as the frontmatter edit that motivated it; a stale index is the single most common cause of a lookup that "should" have matched.

What belongs in `trigger_phrases` decides what the index can ever find: distinctive domain terms, exact decisions, API and symbol names, failure symptoms, packet-specific multi-word concepts. Generic workflow words such as `session`, `context`, `update` or `document` cost precision on every query that touches them. The full include-and-warn list is in `../retrieval/retrieval-conventions.md` §8.

---

## 8. CONSTITUTIONAL RULES (RETIRED)

The constitutional rule layer is retired. The searchable tier, the auto-surfacing injection, the
indexer scan, and the rule folder itself were all removed. The steering those rules carried now
lives inline in the root instruction docs, and the advisor renders the hygiene, governor and proof
directives directly.

Nothing writes, reads or reviews a rule file any more. Treat any older reference to a rule path as
historical record.

---

---

## 9. DECLARED CAPABILITY LOSS

The retired surface carried stateful behavior that a committed index and a read-only scan cannot provide. Each row is a loss, not a migration. None of them has a replacement, and no wrapper may paper over one by guessing.

| Capability | Status |
|------------|--------|
| Semantic paraphrase matching | Gone. A phrase no author declared and no document contains cannot be found |
| Vector and BM25 fusion | Gone. Matching is literal and case-folded |
| Decay scoring and the retrievability model | Gone. Nothing ages, promotes or demotes a document |
| Access tracking | Gone. Nothing records that a document was read |
| Session deduplication | Gone. Nothing fingerprints a session or suppresses a repeat |
| Causal graph and drift analysis | Gone. Explicit Markdown links and typed evidence are the only traversal left |
| Checkpoints and restore | Gone. Git and the packet documents are the recovery path |

The required behavior on a no-hit is to say so. A caller that degrades to an approximate answer, or that reports a broken invocation as an empty result, is wrong in a way this document cannot catch.

---

## 10. VERIFICATION

```bash
# The index exists and resolves a known phrase
node .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs \
  --json -- "spec folder"; echo "exit=$?"

# The free-text lane agrees the content is where you think it is
rg --no-config --fixed-strings --ignore-case --files-with-matches --max-count 1 \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -- 'spec folder' specs .opencode

# A packet still validates after a continuity save
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/<track>/<NNN-name> --strict
```

---

## 11. RELATED RESOURCES

### Reference Files
- [retrieval-conventions.md](../retrieval/retrieval-conventions.md) - The recipes, exit-status mapping and ranking contract
- [save-workflow.md](./save-workflow.md) - Continuity save workflow
- [embedder-pluggability.md](./embedder-pluggability.md) - Provider cascade and retry policy for the shared embedding stack
- [troubleshooting.md](../debugging/troubleshooting.md) - Common issues and solutions
- [environment-variables.md](../config/environment-variables.md) - Configuration options

### Scripts
- `scripts/retrieval/generate-trigger-index.mjs` - Builds the trigger index
- `scripts/retrieval/lookup-trigger-index.mjs` - Reads the trigger index
- `scripts/dist/memory/generate-context.js` - Continuity writer (compiled from `scripts/memory/generate-context.ts`)

### Related Skills
- `system-spec-kit` - Parent skill orchestrating spec folder workflow

---

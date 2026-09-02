---
title: "Feature Specification: Phase 1: trigger-index-replacement"
description: "Build the generated trigger index and ripgrep retrieval conventions, proven at parity against the current LIKE-based trigger lane, before any part of the memory subsystem is removed."
trigger_phrases:
  - "trigger index"
  - "trigger index generator"
  - "grep-first retrieval"
  - "memory_match_triggers replacement"
  - "ripgrep conventions"
  - "retrieval parity harness"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 1: trigger-index-replacement

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Gate 1 of `AGENTS.md` calls `memory_match_triggers` on every user message. That tool resolves to a
`LOWER(m.trigger_phrases) LIKE ?` query inside the MCP server. Before the server can be deleted, an
equivalent mechanism must exist and be proven to return at least what the current lane returns.

**Key Decisions**: Generated JSON index over `trigger_phrases` frontmatter, committed to the repo rather than gitignored; ripgrep as the free-text retrieval path with no index at all.

**Critical Dependencies**: None. This phase is self-contained and adds only new files.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-09-02 |
| **Branch** | `claude/speckit-memory-db-review-3gheky` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-memory-consumer-rewire |
| **Handoff Criteria** | Generated index reaches two-way candidate-set parity with `exactTriggerSearch` over the frozen prompt set. The generator is also idempotent |
| **Research** | `../005-ripgrep-retrieval-research/research/lineages/luna-max/research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the memory db decommission specification.

**Scope Boundary**: Build the replacement only. This phase adds files and changes no existing
behavior: no consumer is repointed, nothing is deleted, and the MCP server keeps running. That
isolation is deliberate — it is what makes the parity comparison meaningful, because both
mechanisms are live at the same time and can be run against the same inputs.

**Dependencies**:
- None upstream. `trigger_phrases` frontmatter already exists across 11,902 active spec docs.

**Deliverables**:
- `generate-trigger-index.mjs` — the generator
- `trigger-index.json` — the committed index artifact
- `retrieval-conventions.md` — the ripgrep retrieval contract that replaces free-text search
- A parity harness plus its recorded baseline output

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`AGENTS.md` Gate 1 mandates `memory_match_triggers(prompt)` on every user message, and that tool is
served by the MCP subsystem this packet removes. The lane behind it is not semantic: it is a
substring match at `mcp-server/lib/search/hybrid-search.ts:806-817`. Removing the server without a
replacement would leave the framework's most frequently exercised gate with no mechanism.

### Purpose

A generated trigger index and a documented ripgrep contract that together carry everything the
substring lane carried, verified by direct comparison before anything is removed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A generator that walks `specs/**/*.md` and `.opencode/skills/**/*.md`, extracts `trigger_phrases`
  frontmatter, and emits a single JSON index mapping phrase to document paths.
- The committed index artifact itself.
- A written retrieval convention for free-text search: which ripgrep invocations replace
  `memory_search` and `memory_context`, and how results are scoped by track and packet.
- A frozen corpus manifest that pins the included paths, the exclusions, the corpus content hash, the
  parser version, the index schema version and the prompt-set hash, so every later claim names the
  snapshot it was measured against.
- A three-arm parity harness that runs a frozen prompt set against the live `exactTriggerSearch`
  lane, the new index and the documented ripgrep recipes. It reports differences in both
  directions.
- A diagnostic stream that reports every skipped or warned document by path and line rather than
  dropping it.

### Out of Scope

- Repointing `AGENTS.md` Gate 1 or any consumer — that is phase 002, and doing it here would remove
  the live comparison this phase depends on.
- Deleting any part of the MCP server — phase 003.
- Changing spec-doc content or frontmatter shape — phase 004.
- Reproducing semantic search. The measured evidence in the parent spec is that the vector and graph
  lanes did not contribute positively, so no embedding path is rebuilt.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs` | Create | Frontmatter walker and index emitter |
| `.opencode/skills/system-spec-kit/data/trigger-index.json` | Create | Committed index artifact |
| `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Create | Ripgrep retrieval contract |
| `.opencode/skills/system-spec-kit/scripts/retrieval/parity-check.mjs` | Create | Parity harness against the live lane |
| `.opencode/skills/system-spec-kit/scripts/retrieval/fixtures/prompt-set.json` | Create | Frozen prompt set for parity |

### Index Artifact Design

The artifact is one versioned deterministic object unless the measured size forces sharding. Phrase
keys, raw variants, tokens, paths and trigram postings are all sorted. No generation timestamp is
written, because a timestamp defeats the byte-identical rerun in REQ-002.

```json
{
  "schemaVersion": 1,
  "normalization": {
    "case": "lower",
    "separators": "non-ascii-alnum-to-space",
    "minQueryTokenLength": 3,
    "maxQueryTokens": 8,
    "stopWords": [],
    "stemming": "none"
  },
  "phrases": {
    "normalized phrase": {
      "raw": ["Original Phrase"],
      "tokens": ["normalized", "phrase"],
      "paths": ["specs/example/doc.md"]
    }
  },
  "tokenTrigrams": {
    "phr": ["normalized phrase"]
  }
}
```

Raw values exist for diagnostics, normalized values for matching, tokens for overlap scoring and
trigram postings for the partial-substring behavior the current SQL lane admits through `%token%`.
Version 1 removes no stop words and applies no stemming, because the baseline lane does neither and
either one would change the relation the parity harness is testing.

### Capability Boundary

This phase delivers a read-only lookup path. It does not replace the stateful capabilities the
retired surface also carried. No downstream reader should treat it as though it did.

| Capability | Replacement or honest boundary | Owner |
|------------|--------------------------------|-------|
| Trigger and keyword retrieval | Generated trigger index plus the explicit ripgrep recipes. Lexical parity is a P0 gate | This phase and 004 |
| Resume and context assembly | `handover.md`, then `_memory.continuity`, then packet-first spec docs and bounded anchors | 002 |
| Continuity frontmatter writing | A named packet-local writer keeping atomic same-directory update and lock semantics. Ripgrep cannot write | 002 |
| Causal graph and drift analysis | Explicit Markdown links or typed evidence, otherwise a declared unsupported capability | 002 and 003 handoff |
| Resource maps | A static generated path catalog, which is not a dynamic graph | Packet tooling |
| Semantic paraphrase, vector and BM25 fusion, decay, access tracking, session dedup | Deliberate lexical-only loss with explicit unsupported behavior | Parent packet, 002 and 003 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | For every lexical prompt in the frozen set, the index and the live `exactTriggerSearch` lane return the same candidate set in **both** directions: zero unexplained `legacyOnly` results and zero unexplained `indexOnly` results. Parity is measured over the first eight eligible query tokens, the three-character minimum token length, the partial `%token%` substring candidates the SQL lane deliberately admits, the active/archive, expiry and spec-folder scope filters, the lane's score classes (complete normalized phrase, phrase containment, token overlap) and its tie behavior |
| REQ-002 | The generator is idempotent: a second consecutive run leaves the artifact byte-identical, with the same SHA-256 |
| REQ-003 | The index artifact is committed to the repository, not gitignored, so a fresh clone needs no build step to satisfy Gate 1 |
| REQ-004 | Generation completes without a daemon, a database, an embedding provider, or network access |
| REQ-008 | A frozen corpus manifest pins the included relative paths, the exclusions, the corpus content hash, the parser version, the index schema version and the prompt-set hash. Every parity, diagnostic or latency claim names the manifest it ran against |
| REQ-009 | Lexical parity gates stay separate from semantic boundary probes. Paraphrase rows carried by `trigger-goldens.json` are labelled `semantic-trigger-shadow` and are reported as boundary evidence, never as lexical pass criteria |
| REQ-010 | Every skipped or warned document emits a diagnostic row with `path`, a one-based `line`, a `category` and a `reason`, plus the raw key when printing it is safe. The categories separate missing frontmatter, malformed or unclosed frontmatter, non-YAML frontmatter, wrong trigger-list type, non-string member, valid empty list, duplicate phrase and oversized phrase |
| REQ-011 | Publication is fail-closed and atomic. The generator writes a same-directory temporary file, validates it, then renames. A run that meets any non-ignored malformed document leaves the last known-good committed index untouched rather than publishing a partial one |
| REQ-012 | Fresh-process single-prompt lookup holds p95 **and** max under 200ms across at least 30 runs, each started in a new Node process, with p50, p99, corpus bytes, index bytes, runtime and platform recorded alongside. Sharpens the single cold measurement REQ-007 asked for |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `retrieval-conventions.md` gives a concrete ripgrep invocation for each retrieval shape currently served by `memory_search`, `memory_context` and `memory_quick_search` |
| REQ-006 | The generator reports, rather than silently skips, any document whose `trigger_phrases` block is malformed. REQ-010 owns the row shape that report takes |
| REQ-007 | Index lookup for a single prompt completes in under 200ms from a cold Node start. REQ-012 turns this into a measured distribution rather than one run |
| REQ-013 | `retrieval-conventions.md` states that ripgrep is an evidence producer and never the relevance ranker. It also gives the caller-side rank tuple the wrapper applies |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Parity harness reports zero unexplained differences in both directions across the frozen prompt set, with no scope, archive or expiry leakage. The recorded output is committed as the baseline
- **SC-002**: `node generate-trigger-index.mjs && git diff --exit-code` returns clean on a second run. Both runs hash identically
- **SC-003**: The full Gate 1 path runs with the MCP server stopped
- **SC-004**: Fresh-process lookup latency is recorded over at least 30 runs. Both p95 and max land under 200ms against the named manifest
- **SC-005**: Each documented ripgrep recipe is executed once, its exit status is read. The 0/1/2+ mapping is recorded
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Index artifact size: 97,529 phrases and ~4.1 MB of phrase text before paths and JSON structure | Med — a multi-megabyte committed file adds diff noise on every doc change | Measure the real emitted size first; if it exceeds a set budget, shard per track or store phrase-to-path pairs in a compact line-oriented format that greps well |
| Risk | Malformed or absent `trigger_phrases` in some docs | Med — silent gaps in Gate 1 coverage | REQ-006 makes the generator report them; the count goes in the baseline |
| Risk | Parity harness needs the live daemon, which is documented as flapping | High — cannot measure parity if the comparison target will not start | Capture the live lane's output once into a fixture while the daemon is up, keep its availability and corpus metadata with it, then compare against the fixture thereafter. An unavailable live arm is a blocked measurement, never a green parity result |
| Dependency | `trigger_phrases` frontmatter convention | Blocks the whole approach if inconsistent | Phase 004 standardizes it; this phase consumes what exists and records the gaps |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Single-prompt index lookup under 200ms from cold Node start
- **NFR-P02**: Full index generation over the current corpus under 60s

### Security
- **NFR-S01**: The generator reads only repository files and makes no network calls

### Reliability
- **NFR-R01**: Generation is deterministic — identical inputs produce byte-identical output

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a document with no `trigger_phrases` key is skipped and counted, not an error
- Valid empty list: `trigger_phrases: []` is a legal document, not a malformed one. The two cases carry different diagnostic categories
- Alias spelling: a document using `triggerPhrases` is read and reported as an alias rather than silently normalized away
- Generic phrase: a trigger drawn from the editor's `session` or `context` fallbacks is warned on, because a generic term pollutes a precision corpus
- Maximum length: a phrase longer than the emitter's cap is truncated and reported, never dropped silently

### Error Scenarios
- Malformed YAML frontmatter: the document is reported by path and one-based line. Generation of the published artifact fails closed per REQ-011
- Duplicate phrases across documents: all owning paths are retained. The index is many-to-many
- Non-string member in the trigger list: reported by category, never coerced
- Excluded trees: a hit under `z_archive/` or `node_modules/` is a leak and fails the run, since both are excluded by glob
- Ripgrep absent or misconfigured: exit 2 or higher is an execution error, distinct from exit 1, which means no match
- Query beginning with `-`: passed after the `--` separator so it is never read as a flag
- CRLF, invalid UTF-8 and CJK input: parsed without crashing. Any normalization limit is reported rather than assumed

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 5 created, LOC: ~400, Systems: 1 |
| Risk | 4/25 | Auth: N, API: N, Breaking: N — additive only |
| Research | 6/20 | Index shape and size budget need measurement |
| Multi-Agent | 2/15 | Workstreams: 1 |
| Coordination | 4/15 | Dependencies: downstream phases consume this |
| **Total** | **24/100** | **Level 3** (inherited from parent packet) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Committed index is too large to be comfortable in diffs | M | H | Measure, then shard or compact |
| R-002 | Live daemon unavailable when parity must be captured | H | M | Snapshot the live lane into a fixture early |
| R-003 | Frontmatter inconsistency hides Gate 1 coverage gaps | M | M | Generator reports; baseline records the count |

---

## 11. USER STORIES

### US-001: Gate 1 without a daemon (Priority: P0)

**As a** framework operator, **I want** Gate 1 trigger matching to work from a committed file, **so that** a fresh clone or a session with no background service still surfaces relevant context.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Free-text retrieval I can reproduce by hand (Priority: P1)

**As a** framework operator, **I want** the retrieval contract written as concrete ripgrep invocations, **so that** I can run the same search the agent runs and see the same results.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Should the index be one file or sharded per track? The size measurement in R-001 decides it, and the answer changes the generator's output contract.
- Does the parity set need prompts drawn from real session history, or is a hand-authored set defensible? Real prompts are stronger evidence but are not currently retained anywhere outside the DB being removed.
- Should Unicode handling stay exactly compatible with the current ASCII-only normalization or take an explicitly versioned extension? Compatibility keeps parity testable. An extension changes the relation the harness measures.
- Which machine, runtime and sample count make the REQ-012 gate reproducible? The 30-run protocol is a proposed shape, not yet a measurement.
<!-- /ANCHOR:questions -->

---

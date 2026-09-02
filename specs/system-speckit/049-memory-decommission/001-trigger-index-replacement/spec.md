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
| **Handoff Criteria** | Generated index returns a superset of `exactTriggerSearch` results on a frozen prompt set; generator is idempotent |
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
- A parity harness that runs a frozen prompt set against both the live `exactTriggerSearch` lane and
  the new index, and reports set differences.

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
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | For every prompt in the frozen set, the index returns a superset of the document paths returned by the live `exactTriggerSearch` lane |
| REQ-002 | The generator is idempotent: a second consecutive run leaves the artifact byte-identical |
| REQ-003 | The index artifact is committed to the repository, not gitignored, so a fresh clone needs no build step to satisfy Gate 1 |
| REQ-004 | Generation completes without a daemon, a database, an embedding provider, or network access |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `retrieval-conventions.md` gives a concrete ripgrep invocation for each retrieval shape currently served by `memory_search`, `memory_context` and `memory_quick_search` |
| REQ-006 | The generator reports, rather than silently skips, any document whose `trigger_phrases` block is malformed |
| REQ-007 | Index lookup for a single prompt completes in under 200ms from a cold Node start |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Parity harness reports zero missing paths across the frozen prompt set, with the recorded output committed as the baseline
- **SC-002**: `node generate-trigger-index.mjs && git diff --exit-code` returns clean on a second run
- **SC-003**: The full Gate 1 path runs with the MCP server stopped
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Index artifact size: 97,529 phrases and ~4.1 MB of phrase text before paths and JSON structure | Med — a multi-megabyte committed file adds diff noise on every doc change | Measure the real emitted size first; if it exceeds a set budget, shard per track or store phrase-to-path pairs in a compact line-oriented format that greps well |
| Risk | Malformed or absent `trigger_phrases` in some docs | Med — silent gaps in Gate 1 coverage | REQ-006 makes the generator report them; the count goes in the baseline |
| Risk | Parity harness needs the live daemon, which is documented as flapping | High — cannot measure parity if the comparison target will not start | Capture the live lane's output once into a fixture while the daemon is up, and compare against the fixture thereafter |
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
- Maximum length: a phrase longer than the emitter's cap is truncated and reported, never dropped silently

### Error Scenarios
- Malformed YAML frontmatter: the document is reported by path and generation continues
- Duplicate phrases across documents: all owning paths are retained; the index is many-to-many

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
<!-- /ANCHOR:questions -->

---

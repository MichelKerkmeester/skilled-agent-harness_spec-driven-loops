---
title: "Implementation Plan: Phase 1: trigger-index-replacement"
description: "Build a frontmatter-derived trigger index, a ripgrep retrieval contract, and a parity harness that proves the pair covers the live substring lane before anything is removed."
trigger_phrases:
  - "trigger index plan"
  - "retrieval replacement plan"
  - "parity harness"
  - "generate-trigger-index"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: trigger-index-replacement

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (`.mjs`), no TypeScript build step |
| **Framework** | None — plain Node, standard library only |
| **Storage** | A committed JSON file. No database, no daemon, no embedding provider |
| **Testing** | Vitest, matching the existing `scripts/tests/*.vitest.ts` suite, plus a parity harness against the live lane |

### Overview

Walk every markdown file under `specs/` and `.opencode/skills/`, parse the `trigger_phrases`
frontmatter block, and emit one many-to-many phrase-to-paths index. Gate 1 then resolves against
that file instead of an MCP call. Free-text retrieval moves to documented ripgrep invocations with
no index at all, because a recursive grep over the full 38M-word corpus already returns in 0.5s.

The phase adds files and changes nothing. That is what makes the parity check meaningful: the old
lane and the new index are both live, so they can be run against the same prompts and diffed.

The index shape, the ripgrep recipes, the ranking contract and the parity arms below come from
`../005-ripgrep-retrieval-research/research/lineages/luna-max/research.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Parity harness reports zero unexplained rows in both directions, output committed as baseline
- [x] Second generator run leaves the artifact byte-identical, with a matching hash. Measured over three consecutive runs, across the index, the manifest and the variants file
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Generate-and-commit. A pure function from repository files to one artifact, run by hand or by a
hook, with the output tracked in git. This is the deliberate inverse of the subsystem being
removed, whose `.sqlite` was gitignored and therefore absent from every fresh clone.

### Key Components

- **`generate-trigger-index.mjs`**: walks the corpus, parses frontmatter, emits the artifact. Pure,
  deterministic, no network, no daemon. Writes a same-directory temporary file, validates it, then
  renames, so a failed run never replaces the last known-good index. Four libraries under `lib/`
  carry the pieces: `normalize.mjs` (case folding, separators, token rules, phrase scoring),
  `frontmatter.mjs` (the strict read-only reader and its diagnostic categories), `corpus.mjs` (walk,
  exclusions, manifest hashing) and `artifact.mjs` (stable stringify, atomic publish).
- **`trigger-index.json`**: the committed artifact. Many-to-many: one phrase maps to every path
  declaring it. Object keys and every array are sorted. No generation timestamp is emitted, so
  two runs over one manifest are byte-identical and hash the same.
- **`lookup-trigger-index.mjs`**: the read path, a library plus a CLI. It loads the committed index
  once, re-derives per-phrase tokens from the key, and answers exact, containment, overlap and
  partial-token queries. Gate 1 and the parity index arm both call it, so there is one matcher
  rather than two that can drift.
- **`measure-cold-lookup.mjs`**: the REQ-012 harness. Spawns one fresh Node process per run, reports
  warm-ups separately from measured runs, and computes nearest-rank percentiles with no
  interpolation. Its output is `fixtures/latency-report.json`.
- **`fixtures/corpus-manifest.json`**: the frozen manifest REQ-008 asks for. Roots, exclusions,
  included paths, corpus hash and its stated recipe, parser version, index schema version, prompt-set
  hash, plus the `skippedPaths` and `ignoredPaths` lists. Its hash is the identity every parity,
  diagnostic and latency claim names.
- **`fixtures/generation-diagnostics.json`**: the full REQ-010 stream. Every row carries `path`, a
  one-based `line`, a `category` and a `reason`, with per-category counts and the ignored-path
  bookkeeping alongside.
- **`fixtures/phrase-variants.json`**: the raw phrase spellings, keyed by normalized phrase. They
  left the index under schema 2 and live here for diagnostics.
- **`retrieval-conventions.md`**: the ripgrep contract replacing `memory_search`,
  `memory_context`, and `memory_quick_search`.
- **`parity-check.mjs`**: runs a frozen prompt set against three arms and reports differences in
  both directions. Planned, with `lib/legacy-lane.mjs` and `lib/rg-lane.mjs` behind it.

### Index Shape

Schema 2, per `spec.md` §3 Index Artifact Design. A versioned object carrying `schemaVersion`, the
`manifestHash` it was generated against, a `normalization` block (lower case, non-ASCII-alnum
separators, three-character minimum token, eight-token cap, 120-character phrase cap, empty
stop-word list, stemming `none`), a sorted `paths` table, and a `phrases` map whose every value is
an array of integer ids into that table.

Phrase keys answer exact and containment matches. Tokens are re-derived from the key at lookup, so
overlap scoring needs no stored token arrays. Partial `%token%` candidates come from an `includes()`
scan over the sorted keys, which measured 1.4 ms for one token and 12.3 ms at the eight-token cap
over 35,481 keys, replacing the trigram posting block schema 1 carried. Raw spellings moved to
`fixtures/phrase-variants.json`. No stop-word removal and no stemming, because the baseline does
neither and either one would change the relation the harness measures.

Measured: 3,814,726 bytes over 35,481 phrases, 13,597 paths and 45,578 declarations, against
37,017,883 bytes for schema 1. ADR-003 records why the fix was the encoding and not sharding.

### Parity Arms

| Arm | Input | Compared on |
|-----|-------|-------------|
| Legacy | The live `exactTriggerSearch` lane, otherwise a baseline captured while the daemon is reachable | Candidate paths, eligibility, score class, order |
| Index | The generated JSON, loaded once, with the documented normalization, postings and filters | The same tuple, plus index and schema hash and diagnostics |
| `rg` | An explicit command recipe, its parsed JSONL, path or count output plus the caller-side ranker | Field, path, line, match class, deterministic order |

`parity-check.mjs` reports `legacyOnly` and `indexOnly` separately. Missing results alone are not the
gate.

### Ripgrep Recipes

Structured, line-addressable evidence:

```text
rg --no-config --json --fixed-strings --ignore-case \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -- 'phrase' specs .opencode
```

Quick path lookup:

```text
rg --no-config --fixed-strings --ignore-case \
  --files-with-matches --max-count 1 \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -- 'phrase' specs .opencode
```

Counts use a separate `--count` recipe. `--json` cannot be combined with `--files-with-matches`,
`--count` or `--count-matches`, so each output mode is its own recipe and the wrapper parses one
shape at a time. Context and anchor lookups reuse the structured recipe with a bounded context
option and label the result as anchor or body evidence. `--no-config` is mandatory, because
`RIPGREP_CONFIG_PATH` can otherwise inject arguments and `.gitignore`, `.ignore` and `.rgignore`
already filter silently. `-w` is not a substitute for the SQL `%token%` behavior, since word
boundaries are narrower.

Exit status maps to three outcomes. The wrapper must branch on all three: `0` is a match, `1` is
no match, `2` or higher is an execution or configuration error.

### Ranking Contract

Ripgrep supplies matches, paths and lines. It never ranks relevance. No plan text should imply
it does. The wrapper applies a stable caller-side tuple:

1. Evidence field: `trigger_phrases`, then title or description, then anchor marker, then body line.
2. Normalized match class: exact phrase, then phrase containment, then token coverage.
3. Relative path, then one-based line.

Each result carries its document type and packet path.

### Data Flow

```
specs/**/*.md ─┐
               ├─► generate-trigger-index.mjs ─► trigger-index.json ─► Gate 1 lookup
.opencode/skills/**/*.md ─┘

prompt ─► ripgrep over specs/ (scoped by track/packet) ─► candidate docs ─► read
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. `research_intent` is `refactor`, this phase creates only new files, and no finding
from a deep-review verdict is in play. No existing surface changes behavior in this phase — that is
phase 002's scope, and its plan carries this addendum instead.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp-server/lib/search/hybrid-search.ts` | Owns the live `exactTriggerSearch` substring lane | not a consumer — read as the parity comparison target only | `rg -n 'exactTriggerSearch' .opencode/skills/system-spec-kit/mcp-server/lib` |
| `AGENTS.md` Gate 1 | Declares `memory_match_triggers` as the gate action | unchanged in this phase | phase 002 owns the swap |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Normalization, query tokens, phrase scoring, frontmatter parsing (well-formed, malformed, absent, valid empty list, alias spelling, generic phrase, duplicate phrases, oversized phrase) | Vitest |
| Integration | Full generation over the frozen manifest, determinism across consecutive runs, byte and hash equality, atomic publication with no partial replacement, lookup over the published artifact | Vitest + `git diff --exit-code` + `shasum` |
| Parity | Frozen prompt set across all three arms. Both `legacyOnly` and `indexOnly` must be empty of unexplained rows, with no scope, archive or expiry leakage | `parity-check.mjs` |
| Boundary | Semantic paraphrase rows reported separately from the lexical gate, as evidence rather than as a pass criterion | `parity-check.mjs` boundary report |
| Latency | At least 30 fresh Node processes, one prompt each, reporting p50, p95, p99 and max against the 200ms gate | timed harness run |
| Manual | Gate 1 lookup with the MCP server stopped | session run |

Coverage floor per `AGENTS.md` §3: happy path plus one edge case per public surface. The edge cases
that earn a test here are the ones the generator will actually meet in this corpus — malformed
frontmatter and duplicate phrases across documents — not a test per branch.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `trigger_phrases` frontmatter across the corpus | Internal | Green — present in 11,902 active spec docs | Approach fails; would need phase 004 to run first |
| Live `system-spec-memory` daemon, for one parity snapshot | Internal | Yellow — documented as flapping; timed out during this planning session | Capture the snapshot opportunistically; fall back to a hand-verified fixture and say so |
| Node >= 20.11 | External | Green — already required by `@spec-kit/scripts` | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Parity gaps that cannot be closed, or an artifact size that makes the repository unpleasant to work in.
- **Procedure**: `git revert` the phase commit. This phase adds only new files and repoints nothing, so reverting restores the prior state exactly and the MCP server is untouched throughout.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (fixtures + prompt set) ──┐
                                ├──► Core (generator + artifact) ──► Verify (parity + determinism)
Config (size budget decision) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 3-5 hours |
| Verification | Med | 2-3 hours |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Parity snapshot of the live lane captured before the daemon is touched
- [ ] Artifact size measured and recorded against the budget
- [ ] No existing file modified in this phase's diff

### Rollback Procedure
1. `git revert` the phase commit
2. Confirm `trigger-index.json` and the `scripts/retrieval/` tree are gone
3. Confirm Gate 1 still resolves through `memory_match_triggers` (unchanged throughout this phase)
4. No stakeholder notification needed — nothing user-facing changed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — the artifact is derived and regenerable from the corpus at any time
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Setup     │────►│    Core     │────►│   Verify    │
│  fixtures   │     │  generator  │     │   parity    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │ conventions│
                    │  doc (par) │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Prompt set fixture | None | `fixtures/prompt-set.json` | Parity harness |
| Corpus manifest | None | `fixtures/corpus-manifest.json` | Generator, parity harness, latency runs |
| Live-lane snapshot | Prompt set, corpus manifest | `fixtures/live-lane-baseline.json` | Parity harness |
| Generator | Size budget decision | `trigger-index.json` | Parity harness, phase 002 |
| Conventions doc | None | `retrieval-conventions.md` | Phase 002 |
| Parity harness | Generator, snapshot | Parity report | Phase handoff |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Live-lane snapshot** - 1 hour - CRITICAL (the daemon may stop being available; capture first)
2. **Generator + artifact** - 3-5 hours - CRITICAL
3. **Parity verification** - 2 hours - CRITICAL

**Total Critical Path**: 6-8 hours

**Parallel Opportunities**:
- `retrieval-conventions.md` can be written alongside the generator; it depends on neither
- Unit tests for frontmatter parsing can be written before the corpus walk exists
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | Live-lane output for the frozen prompt set is committed as a fixture | Setup |
| M2 | Index generated | `trigger-index.json` exists, within size budget, byte-stable across two runs | Core |
| M3 | Parity proven | Zero missing paths across the prompt set; Gate 1 resolves with the daemon stopped | Verify |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Commit the index artifact rather than gitignore it

**Status**: Proposed

**Context**: The subsystem being removed kept its `.sqlite` gitignored, so a fresh clone had no index and Gate 1 depended on a rebuild plus a running daemon. That is one of the failure modes this packet is removing.

**Decision**: Track `trigger-index.json` in git.

**Consequences**:
- A fresh clone satisfies Gate 1 with no build step and no service.
- The artifact appears in diffs whenever spec docs change; at ~4.1 MB of phrase text this is real noise, mitigated by the size budget in R-001 and, if needed, per-track sharding.

**Alternatives Rejected**:
- Generate on demand at session start: reintroduces a build step on the hot path and a staleness question, which is most of what made the daemon unpleasant.
- No index, pure ripgrep for Gate 1 too: loses precision on trigger matching, since prompt-to-declared-phrase matching is not the same query as grepping prose.

### ADR-002: Do not rebuild a semantic lane

**Status**: Proposed

**Context**: The removed stack carried vector, graph, BM25 and FTS5 channels plus a fusion layer.

**Decision**: Replace only the substring lane and free-text search. No embeddings.

**Consequences**:
- Drops ~198 MB of dependencies, the embedder cascade, and the provider configuration.
- If a future retrieval need genuinely requires semantics, it is a new packet with its own evidence, not a restoration of this one.

**Alternatives Rejected**:
- Keep a minimal FTS5 index: reintroduces a build artifact and a staleness problem for a channel the ablation measured at exactly 0.0000 delta.

### ADR-003: Compact encoding instead of sharding

**Status**: Accepted

**Context**: Schema 1 stored, for every phrase, a `raw` array, a `tokens` array and a `paths` array of full relative path strings, plus a `tokenTrigrams` posting block. Over the real corpus it emitted 37,017,883 bytes, of which the trigram block alone was 21.9 MB, and cold lookup measured p95 237 ms and max 239 ms against a 200 ms budget. R-001 had pre-authorized sharding as the mitigation.

**Decision**: Keep one file and change the encoding. Schema 2 adds a sorted `paths` table and stores integer ids in each phrase posting, re-derives tokens from the phrase key at lookup, moves raw variants to `fixtures/phrase-variants.json`, and drops the trigram block in favor of an `includes()` scan over the sorted phrase keys.

**Consequences**:
- 37,017,883 bytes to 3,814,726 bytes over the same corpus, with the two-space pretty-print and the `stableStringify` round-trip validation both retained.
- Cold lookup moved from p95 237 ms to p95 83.7 ms, inside budget with room.
- The partial-token scan costs 1.4 ms for one token and 12.3 ms at the eight-token cap over 35,481 keys, which is the whole price of removing 21.9 MB of postings.
- Diagnostics that want the original spelling read a second file. That is a real cost, paid only on the diagnostic path and never on the Gate 1 read path.
- Equivalence is proven, not asserted: a schema 1 index rebuilt from schema 2 plus the variants file returned identical lookups over 120 prompt and scope pairs.

**Alternatives Rejected**:
- Shard per track: multiplies files without fixing the encoding, so the same bytes land in more diffs and every reader gains a shard-selection step.
- Drop pretty-printing to save bytes: saves far less than the encoding change and makes the artifact unreadable in exactly the diffs R-001 was worried about.

### ADR-004: Strict read-only frontmatter reader instead of reusing the migration parser

**Status**: Accepted

**Context**: `scripts/lib/frontmatter-migration.ts` already parses frontmatter in this repository, so reuse was the first thing checked. Two problems: it is TypeScript reachable only through a build step, which contradicts the no-build-step constraint this phase is built on, and it collapses every failure shape into a single `undefined`, which cannot satisfy REQ-010's requirement that each skipped document report a distinct category.

**Decision**: Write a read-only reader in `lib/frontmatter.mjs` that returns a typed diagnostic per failure mode, and relax three of the migration tool's guards.

**Consequences**:
- The block length cap, the two-space indent floor and the blanket heading rejection were dropped, because run against the real corpus they misclassified 75 valid documents as malformed.
- Dropping them is safe here and would not be safe there: the migration tool rewrites files, so a wrong parse corrupts a document, while this reader only reads and a wrong parse costs one index entry.
- Two parsers now exist over one file format. They are kept honest by the diagnostic counts, which state exactly what the reader accepted: ok 13,505, missing-frontmatter 14,955, duplicate-phrase 92, valid-empty-list 2, non-yaml-frontmatter 1, across 28,555 documents.

**Alternatives Rejected**:
- Reuse the migration parser as-is: 75 valid documents lost, and no way to report why any of them were skipped.
- Add a build step so the TypeScript parser is importable: reintroduces the build-before-Gate-1 dependency that is one of the failure modes this packet exists to remove.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->

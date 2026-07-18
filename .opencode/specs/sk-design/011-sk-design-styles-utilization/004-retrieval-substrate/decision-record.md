---
title: "Decision Record: styles-library retrieval substrate"
description: "Architecture decisions for the Phase A retrieval engine over the sk-design styles library: committed checked manifest, deterministic-eligibility authority, disposable FTS accelerator, generation-guarded hydration, and the CORPUS_USE_PROOF v1 gate. Proposed; scaffold not yet built."
trigger_phrases:
  - "retrieval substrate decisions"
  - "corpus use proof adr"
  - "eligibility authority adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/004-retrieval-substrate"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the retrieval-substrate ADR set"
    next_safe_action: "Promote ADR-001..005 to Accepted after the build validates"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-retrieval-substrate-011-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: styles-library retrieval substrate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- STATUS: Planned — scaffold; implementation not started. All ADRs are Proposed. -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Committed Checked Manifest as the Only Retrieval Artifact

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-18 |
| **Deciders** | sk-design maintainer |

---

<!-- ANCHOR:adr-001-context -->
### Context

Retrieval over the 1,290-bundle corpus needs a stable, joinable, reviewable index. Ad-hoc grep over 20.38 MB of `DESIGN.md` re-scans every query (~33 ms) and cannot join, a hand-maintained index drifts (`styles/README.md` stayed at 50 while the corpus grew to 1,290), and loading full documents costs ~85 MB of context with high copy exposure.

### Constraints

- The corpus mutated repeatedly during research (974 → 1,290 bundles); identity must be a hash, not a directory count.
- The artifact must be byte-stable and diff-reviewable in git.
- Rebuild must stay sub-second so no watcher/daemon is needed.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: generate one committed retrieval manifest, `styles/_retrieval-manifest.json`, as the single canonical retrieval artifact; everything else (FTS, future vectors) stays disposable.

**How it works**: the manifest carries a header (`schemaVersion`, `generationHash`, `crawlManifestHash`, `recordCount`, sorted `styles[]`) and per-style key facts (colors, fonts, spacing, capabilities, token axes+counts, section pointers, byte estimates, provenance, sorted artifact `{path,bytes,sha256}`, and a style `contentHash`). `build --write` publishes atomically; `build --check` regenerates in memory and byte-compares.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Committed checked manifest** | ~503 KB, ~1 ms scans, joinable, reviewable, hash-bound | Requires a generator + CI check | 9/10 |
| Hand-maintained static index | Zero tooling | Drifts badly (50 vs 1,000+) | 2/10 |
| SQLite as canonical truth | Fast joins | Duplicates artifacts, native dep, can stale | 4/10 |
| Broad grep as default | No build step | Re-scans, no joins, unstable rank | 3/10 |

**Why this one**: the compact manifest is cheap, canonical, and reviewable, and it anchors the generation hash every later stage depends on. [SOURCE: ../001-research-utilization/research/lineages/sol/research.md §4, §9, §12]
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- One reviewable source of truth; sub-second rebuild; no daemon.
- The generation hash enables strict staleness guards downstream.

**What it costs**:
- Requires a generator + CI `--check` to prevent drift . Mitigation: fixtures on every `styles/**` change.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Manifest diverges from corpus | H | Generation-hash `--check` in CI |
| Torn generation on concurrent edit | M | `corpus-changing` abort + atomic rename |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Nothing in sk-design consumes the corpus; retrieval is the blocking need for packet 011. |
| 2 | **Beyond Local Maxima?** | PASS | Grep, hand-index, and DB-as-truth were measured and rejected (research §12). |
| 3 | **Sufficient?** | PASS | A single compact manifest covers canonical retrieval; accelerators stay optional. |
| 4 | **Fits Goal?** | PASS | Foundation phase on the critical path; every later phase depends on it. |
| 5 | **Open Horizons?** | PASS | Generation hash leaves room for disposable FTS and a future semantic trial. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `styles/_engine/manifest.mjs` (NEW): schema, refresh, hashing.
- `styles/_engine/style-library.mjs` (NEW): `build --write`/`--check`.
- `styles/_retrieval-manifest.json` (NEW): the committed artifact.

**How to roll back**: delete `styles/_retrieval-manifest.json` and `styles/_engine/manifest.mjs`; the corpus is untouched and no mode consumes the manifest until `../005-md-generator-schema-contract/`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Deterministic Eligibility Decides; Scores Only Explain Ordering

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-18 |
| **Deciders** | sk-design maintainer |

### Context

Retrieval must honor required-facet composition and exclusions (negation), and must never let a lexical score smuggle an ineligible or rights-unknown style into results. The research holdout showed deterministic ranking at macro P@5 0.60 / pooled R@5 0.75 versus generic BM25 at 0.33 / 0.42, while BM25 still helped discriminate positive terms within an eligible set.

### Decision

**We chose**: apply deterministic eligibility (required-facet filters, exclusion filters, provenance/rights gates) FIRST to decide membership; lexical scores only order the already-eligible set. **Anti-slop authority rule**: deterministic eligibility decides; scores only explain ordering; one coherent anchor by default; never average token values.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Eligibility-first, scores explain order** | Honors negation/composition, deterministic, auditable | Two-stage logic | 9/10 |
| BM25-only authority | Simple single ranker | Rewards negation wrongly, misses required-facet composition | 3/10 |
| Semantic-only authority | Recall potential | No same-generation measured lift; weakens determinism | 2/10 |

**Why this one**: determinism is required for composition and negation; lexical value is additive within the eligible set. [SOURCE: research.md §4, §8, §10, §11]

### Consequences

**What improves**: composition/negation correctness; auditable membership; slop resistance.
**What it costs**: facet vocabulary must be maintained . Mitigation: seed from research §5, extend deliberately.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Score treated as gate | H | Ordering invariant test (T010) |
| Averaged token values | M | Never-average rule + proof gate (ADR-005) |

### Implementation

**What changes**: `styles/_engine/eligibility.mjs` (NEW), `styles/_engine/rank-fts.mjs` (NEW).
**How to roll back**: N/A — this is the core authority rule; removing it defeats the substrate.

---

## ADR-003: Disposable Same-Generation FTS5/BM25 Accelerator

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-18 |
| **Deciders** | sk-design maintainer |

### Context

Lexical ranking adds value for discriminating positive terms, but a committed lexical index would duplicate artifacts and risk staleness. The research measured the FTS5 prototype at ~29.1 MB / ~179.7 ms build with ~0.054-0.203 ms queries — cheap enough to rebuild on demand.

### Decision

**We chose**: build a disposable SQLite FTS5/BM25 projection from the current generation on demand and throw it away; it accelerates ordering within the eligible set only, never authoritative, never committed.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Disposable same-generation FTS** | Fast, no drift, no commit | Rebuild per session | 8/10 |
| Committed FTS index | No rebuild | Duplicates artifacts, stales, native dep in git | 3/10 |
| No lexical ranking at all | Simplest | Loses positive-term discrimination | 5/10 |

**Why this one**: sub-second rebuild makes a disposable accelerator strictly safer than a committed one. [SOURCE: research.md §4, §9, §10, §11 rank 2]

### Consequences

**What improves**: no drift, no committed native artifact, fast repeated queries.
**What it costs**: per-session rebuild cost . Mitigation: sub-second; enable only when repeated-query load justifies (Phase B question).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| FTS treated as authoritative | H | Eligibility-first (ADR-002); disposable, uncommitted |
| Stale projection served | M | Generation-bound build + fallback (ADR-004) |

### Implementation

**What changes**: `styles/_engine/rank-fts.mjs` (NEW).
**How to roll back**: disable the FTS path; deterministic filters + source scan still serve results.

---

## ADR-004: Generation-Guarded Hydration with Bounded Source-Scan Fallback

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-18 |
| **Deciders** | sk-design maintainer |

### Context

Hydration loads the chosen style's artifacts/slices. If it served an old-generation artifact, stale values could leak into output. Separately, when the lexical projection is missing/stale, retrieval must still function.

### Decision

**We chose**: hydration requires the card's generation hash, re-hashes selected artifacts, applies mode includes + byte caps, and refuses a mismatch with `generation-mismatch`; when the lexical projection is missing/stale, retrieval degrades to deterministic filters + a bounded `DESIGN.md` source scan returning `degraded:true`.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Generation-guarded + source-scan fallback** | Safe against stale values, resilient | Two hydration paths | 9/10 |
| Trust card without re-hash | Simpler | Stale-value leakage | 2/10 |
| Hard-fail on missing FTS | Simple | Brittle; blocks retrieval unnecessarily | 3/10 |

**Why this one**: refusing mismatches prevents stale leakage; the bounded scan keeps retrieval alive without the accelerator. [SOURCE: research.md §4, §5, §9]

### Consequences

**What improves**: no stale-generation leakage; resilient retrieval.
**What it costs**: extra re-hash cost on hydrate . Mitigation: bounded to selected artifacts.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Source scan unbounded | M | Byte/record caps on the fallback |
| Silent degraded serving | M | `degraded:true` surfaced to caller |

### Implementation

**What changes**: `styles/_engine/hydrate.mjs` (NEW), `styles/_engine/rank-fts.mjs` (NEW).
**How to roll back**: N/A — the guard is a safety invariant.

---

## ADR-005: CORPUS_USE_PROOF v1 as a Blocking Ready-Gate

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-18 |
| **Deciders** | sk-design maintainer |

### Context

Corpus material can silently distort output: an anchor chosen only because it ranked first, averaged token values, or reuse of source-specific assets under unknown rights. The research defines `CORPUS_USE_PROOF v1` as a blocking evidence card whenever corpus material influences a design decision.

### Decision

**We chose**: require a valid `CORPUS_USE_PROOF v1` card before any corpus-influenced ready claim. **Anti-slop / authority rule** (restated in spec §2/§4): deterministic eligibility decides; scores only explain ordering; one coherent anchor by default; never average token values. The card asserts authority, selection rationale, coherent fingerprint, transformation delta, provenance/anti-copy, and application proof.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **CORPUS_USE_PROOF v1 blocking gate** | Blocks slop, averaging, and rights leakage | Requires a proof card per corpus-influenced claim | 9/10 |
| Advisory-only proof | Lower friction | Un-provenanced output can ship | 3/10 |
| No gate | Fast | Averaging + copy-exposure risk | 1/10 |

**Why this one**: a blocking gate is the only reliable defense against averaged, un-provenanced, or rights-unknown corpus output. [SOURCE: research.md §7, §8, §14]

### Consequences

**What improves**: no un-provenanced/averaged corpus-influenced claim ships; auditable decisions.
**What it costs**: per-claim proof overhead . Mitigation: one coherent anchor by default keeps the proof compact.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Proof card faked/empty | H | Schema validator + fixtures (T021/T027) |
| Gate bypassed | H | Ready claim blocked without valid card (T022) |

### Implementation

**What changes**: `styles/_engine/corpus-use-proof.mjs` (NEW).
**How to roll back**: N/A — removing the gate reintroduces slop risk.

---

<!--
Level 3 Decision Record — Planned scaffold.
Five ADRs, all Proposed until the engine is built and validated.
-->
</content>

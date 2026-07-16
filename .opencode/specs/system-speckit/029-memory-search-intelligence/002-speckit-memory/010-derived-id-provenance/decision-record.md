---
title: "Decision Record: Content-Addressed derived_id for Derived Causal Artifacts (C4-B)"
description: "Decision record for C4-B: scope/gate discipline, the canonical-field recipe (anchor-inclusive triple + source + rule_version + kind-tag), the legacy rule_version sentinel, the SQLite-compatible TEXT identity plus partial UNIQUE index choice and the reuse-the-shipped-content-id-module-not-a-third-hash decision."
trigger_phrases:
  - "C4-B decision record"
  - "derived_id recipe decision"
  - "partial unique not autoincrement"
  - "reuse content-id module"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/010-derived-id-provenance"
    last_updated_at: "2026-07-04T17:51:03.790Z"
    last_updated_by: "codex"
    recent_action: "Accepted the derived-id recipe and recorded the delivered v40 schema shape"
    next_safe_action: "Keep the benchmark-only insert-cost candidate pending until measured"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-c4b-replan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Canonical field order is kind, source_id, target_id, relation, source_anchor, target_anchor, source, rule_version."
      - "Legacy backfill rule_version sentinel is legacy-pre-derived-id."
      - "SQLite delivery uses an additive TEXT column plus partial UNIQUE index rather than rewriting causal_edges to add a text primary-key alias."
---
# Decision Record: Content-Addressed derived_id for Derived Causal Artifacts (C4-B)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: C4-B is an additive, schema-gated derived-identity add (not a flip, not a rewrite)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Claude (planning author), per 028 research |

---

<!-- ANCHOR:adr-001-context -->
### Context

The 200-iteration 028 campaign places C4-B in **Wave-2 (schema-migration / SCHEMA_VERSION bump / gated)** and flags it the only genuinely net-new content-addressed id in the Memory set (`01-go-candidates.md:44`, roadmap §027-REVISIT edit #1). The derived causal layer currently identifies edges by a sequential autoincrement. There is no content-addressed identity for crash-replay or rule-version provenance.

### Constraints

- The add must be clean-additive: restore preserves id, use a content-addressed `TEXT` identity, NOT `AUTOINCREMENT` (`04-sibling-and-cross-cutting.md:24`). The delivered SQLite shape is an additive column plus partial `UNIQUE` index, avoiding a table rewrite for a new text primary-key alias.
- It must NOT pull in sibling Wave-2 work (bi-temporal C3-B, currentness C3-A/C3-C), those have their own store reconciliation.
- No measured benefit number exists, ship for correctness only (roadmap §6).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: implement C4-B as an additive `derived_id TEXT` column on `causal_edges` for derived rows, with a partial `UNIQUE` index, landed through one additive migration with a single `SCHEMA_VERSION` bump, independent of the other Wave-2 schema candidates.

**How it works**: the column + unique index are added additively, existing derived rows are backfilled from their stored canonical fields and the manual-edge path is untouched. C4-B does not unify validity windows or change currentness semantics.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Additive derived_id column + partial UNIQUE index on causal_edges** | Clean-additive, reversible, no manual-path impact | Needs an anchor-safe backfill + SCHEMA_VERSION bump | 10/10 |
| Bundle C4-B with the bi-temporal C3-B cluster in one migration | One migration pass for the whole cluster | Couples an unscoped, unverified additivity claim (C3-B) to a confirmed-clean add, larger wedge blast | 4/10 |
| Separate derived_artifacts table | Clean separation | New table + dual-write + reader fork, over-engineered for "causal edges first" | 3/10 |

**Why this one**: the additive column is the confirmed clean-additive shape. Coupling it to C3-B re-pays risk the research explicitly says to keep independent.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Derived causal edges gain crash-replay-stable, rule-version-aware identity.
- 027's partial provenance coverage (receipts flag-OFF + CRUD-only, none in the causal path) is EXTENDED, not superseded.

**What it costs**:
- A schema migration + SCHEMA_VERSION bump. Mitigation: additive-only, anchor-safe backfill, real-DB-copy migration test.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Migration wedges the shared upgrade transaction | H | Additive column/index + anchor-safe dedup pre-pass |
| Scope creep into manual edges / other derived stores | M | Derived rows only, "causal edges first" |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | No content-addressed derived identity exists, crash-replay/provenance gap is real |
| 2 | **Beyond Local Maxima?** | PASS | Kept independent from the riskier C3-B cluster |
| 3 | **Sufficient?** | PASS | Additive column covers the derived causal layer scope |
| 4 | **Fits Goal?** | PASS | Derived-identity provenance, not a retrieval rewrite |
| 5 | **Open Horizons?** | PASS | Other derived stores can adopt the same helper later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: additive `derived_id TEXT` column + partial `UNIQUE` index + migration + SCHEMA_VERSION bump on `causal_edges`, and the derived-edge write path persists it.

**How to roll back**: forward-only drop of the column + unique index. Manual-edge behavior is byte-identical, so no curated-path reversal is needed.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: derived_id = sha256(anchor-inclusive canonical-triple + source + rule_version + kind-tag)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Claude (planning author), Codex (implementation) |

---

<!-- ANCHOR:adr-002-context -->
### Context

The single most-cited C4-B caveat is that the `derived_id` input **MUST include anchors** or the legacy anchor-inclusive `UNIQUE(source_id,target_id,relation,source_anchor,target_anchor)` (`vector-index-schema.ts:1121`) rejects the backfill (`01-go-candidates.md:44`, `04-sibling-and-cross-cutting.md:24`, roadmap §027-REVISIT edit #4b). The research also calls for refining the canonical-field order + kind-tag per the aionforge identifier recipe.

### Constraints

- The input must include `source_anchor` and `target_anchor` (normalized the same way the legacy UNIQUE COALESCEs them to `''`).
- The hash must be computed via the shipped `hashCanonicalJson` (ADR-005), with a deterministic, documented field order.
- The id must be reproducible across processes (crash-replay).
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: `derived_id = hashCanonicalJson({ kind, source_id, target_id, relation, source_anchor, target_anchor, source, rule_version })` with a fixed key order and a derived-artifact `kind` tag, anchors normalized to `''` when absent.

**How it works**: the canonical triple is `(source_id, target_id, relation)` plus the two anchors (matching the legacy UNIQUE columns), the `source` and `rule_version` add the aionforge "episode + rule version" dimensions and the `kind` tag namespaces the derived-artifact class. `source` is explicit `derivedSource` when supplied, otherwise non-manual `extraction_method`, otherwise `created_by`.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Anchor-inclusive canonical input + kind-tag** | Backfill-safe against legacy UNIQUE, rule-version-aware | Requires a fixed field order decision | 10/10 |
| Triple-only (no anchors) | Smaller input | REFUTED, backfill rejects against the anchor-inclusive UNIQUE (the headline caveat) | 1/10 |
| Triple + anchors, no rule_version | Simpler | Loses rule-version provenance (the aionforge recipe's point) | 4/10 |

**Why this one**: anchor-inclusion is mandatory, `rule_version` is the provenance value and the kind-tag prevents cross-class collisions.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The backfill cannot collide against the legacy UNIQUE.
- A rule-version change is visible to identity.

**What it costs**:
- A fixed, documented canonical-field order must be chosen and frozen. Mitigation: record it here once confirmed, assert cross-process stability in tests.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Non-deterministic field order | H | Freeze the key order, `hashCanonicalJson` normalizer fixes serialization |
| Ambiguous `source` definition | M | Resolve the open question before backfill |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Anchor-inclusion is the mandatory backfill-safety condition |
| 2 | **Beyond Local Maxima?** | PASS | Triple-only was refuted, this is the corrected recipe |
| 3 | **Sufficient?** | PASS | Triple + anchors + source + rule_version + kind covers identity + provenance |
| 4 | **Fits Goal?** | PASS | Content-addressed, crash-replay-stable identity |
| 5 | **Open Horizons?** | PASS | The kind-tag lets other derived classes reuse the recipe |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**: a derived-artifact id helper in `lib/content-id.ts` composing the anchor-inclusive input + kind-tag.

**How to roll back**: remove the helper, with the write-path revert it has no callers.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Default a sentinel rule_version for pre-C4-B derived rows during backfill

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Claude (planning author), Codex (implementation) |

---

<!-- ANCHOR:adr-003-context -->
### Context

Existing derived rows predate `rule_version`, so the backfill must still produce a deterministic `derived_id` for them. Without a defined sentinel, legacy rows either fail the backfill or get a non-reproducible id.

### Constraints

- The sentinel must be stable and explicit (so a re-run reproduces the same legacy ids).
- It must not collide with a real `rule_version` value used by the live derivation rules.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: `legacy-pre-derived-id` as the fixed sentinel `rule_version` for pre-C4-B derived rows, recorded in the migration and reused on any backfill re-run.

**How it works**: the backfill computes `derived_id` for legacy rows using the sentinel. New derived writes use the live rule's actual version, so legacy and new artifacts of the same triple are distinct exactly when their rule versions differ.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fixed legacy sentinel** | Deterministic, re-runnable, explicit | Must pick a non-colliding value | 9/10 |
| Skip backfilling legacy rows | No sentinel needed | Legacy derived rows have no content-addressed id (incomplete) | 3/10 |
| Infer rule_version from row content | "Accurate" | No reliable source, non-deterministic, over-engineered | 2/10 |

**Why this one**: a fixed sentinel is the only deterministic, re-runnable option for rows that genuinely predate the field.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Every derived row, including legacy, gets a deterministic `derived_id`.

**What it costs**:
- A reserved sentinel value. Mitigation: document it, ensure live rules never emit it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Sentinel collides with a real rule_version | M | Choose a clearly reserved value, assert in a test |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Legacy rows need a deterministic id input |
| 2 | **Beyond Local Maxima?** | PASS | Inference was rejected as non-deterministic |
| 3 | **Sufficient?** | PASS | Covers all pre-C4-B derived rows |
| 4 | **Fits Goal?** | PASS | Deterministic backfill |
| 5 | **Open Horizons?** | PASS | New rules carry real versions going forward |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**: the backfill uses the sentinel `rule_version` for legacy derived rows.

**How to roll back**: the sentinel only affects the additive `derived_id`, dropping the column removes it.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: derived_id is an additive TEXT identity with partial UNIQUE index, NOT AUTOINCREMENT

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Claude (planning author), per 028 research |

---

<!-- ANCHOR:adr-004-context -->
### Context

The research specifies a content-addressed `TEXT` identity, NOT `AUTOINCREMENT`, and confirms the change is clean-additive with restore preserving the id (`01-go-candidates.md:44`, `04-sibling-and-cross-cutting.md:24`). SQLite cannot add a new primary-key rowid alias to an existing table with `ALTER TABLE`, so the implementation keeps the existing `id` primary key and adds a `derived_id TEXT` column plus a partial `UNIQUE` index for derived rows.

### Constraints

- Content-addressed identity must be the durable key (crash-replay/restore reproduces it), so identity cannot be a monotonic counter.
- The existing sequential `causal_edges.id` and the manual-edge path must keep working.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: `derived_id TEXT` plus a partial `UNIQUE` index as the content-addressed identity for derived rows. The existing autoincrement `id` and anchor-inclusive UNIQUE remain for all rows.

**How it works**: a restored or replayed derived edge re-derives the same `derived_id` and maps to the same logical artifact, while SQLite keeps the pre-existing sequential row id for storage compatibility.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **TEXT column + partial UNIQUE index** | Content-addressed identity survives restore, additive on SQLite | Wider key than an int | 10/10 |
| TEXT primary-key rowid alias rewrite | Single primary logical key | Requires a table rewrite, unnecessary for this additive packet | 5/10 |
| AUTOINCREMENT integer id | Compact | REFUTED, a counter cannot be content-addressed, restore gets a new id | 1/10 |
| Composite PK on the canonical columns | No extra column | Does not give a single content-addressed handle, collides with the existing UNIQUE | 3/10 |

**Why this one**: the research names the exact shape, and only a content-derived key survives crash-replay/restore.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Identity is durable across replay/restore.

**What it costs**:
- A `TEXT` key column. Mitigation: indexed UNIQUE, only on derived rows.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Confusing two identity columns | M | Document that `derived_id` is the derived-row key, `id` stays for manual edges |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Content-addressing requires a content-derived key |
| 2 | **Beyond Local Maxima?** | PASS | AUTOINCREMENT explicitly refuted by the research |
| 3 | **Sufficient?** | PASS | A single UNIQUE text key gives the handle |
| 4 | **Fits Goal?** | PASS | Durable derived identity |
| 5 | **Open Horizons?** | PASS | Reusable shape for other derived stores |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**: `derived_id TEXT` column + partial `UNIQUE` index in the schema.

**How to roll back**: drop the column + index (forward-only).
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Reuse the shipped two-primitive content-id module, do NOT author a third hash

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Claude (planning author), per 028 research |

---

<!-- ANCHOR:adr-005-context -->
### Context

The roadmap's original `memory-index.ts:281` sha256 citation was a **mis-citation** (`:281` is `createScanKey`, a scan-options hash). The real, shipped bases are the two `lib/content-id.ts` primitives, `hashContentBody` (content-body) and `hashCanonicalJson` (canonical-field), landed in 030 commit `18c8582e33` (roadmap §027-REVISIT edit #1, `lib/content-id.ts:14,19`). The synthesis stresses: centralize the formula, parameterize the identity, do NOT fork a third hash (`01-go-candidates.md:64`).

### Constraints

- C4-B's `derived_id` is the only genuinely net-new content-addressed id, the hash itself is not net-new.
- No new sha256 primitive may be introduced.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: compute `derived_id` via the shipped `hashCanonicalJson` from `lib/content-id.ts`, adding only a thin compose-the-input helper (the C4-B identity recipe), not a new hash.

**How it works**: the helper assembles the anchor-inclusive canonical input (ADR-002) and delegates the actual digest to `hashCanonicalJson`, keeping a single hash formula across the module.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reuse `hashCanonicalJson`** | One formula, no drift, matches the shipped module | Must thread a normalizer for the canonical input | 10/10 |
| New C4-B-specific sha256 | Self-contained | REFUTED, forks the formula the module exists to centralize | 1/10 |
| Reuse `hashContentBody` (body hash) | Already exists | Wrong primitive, body hash, not canonical-field identity | 2/10 |

**Why this one**: the canonical-field primitive is exactly the C4-B shape, a third hash is the anti-pattern the module was built to prevent.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- One centralized hash formula, no divergence risk.

**What it costs**:
- The helper must supply the canonical normalizer. Mitigation: small, tested helper.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Normalizer drift vs other callers | L | The helper owns only the C4-B input, `hashCanonicalJson` stays generic |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | C4-B needs a canonical-field hash, the module already provides it |
| 2 | **Beyond Local Maxima?** | PASS | A new hash was refuted as formula-forking |
| 3 | **Sufficient?** | PASS | `hashCanonicalJson` + a compose helper is the full need |
| 4 | **Fits Goal?** | PASS | Centralized formula, parameterized identity |
| 5 | **Open Horizons?** | PASS | Future derived stores reuse the same primitive |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**: the derived-id helper calls `hashCanonicalJson`, no new sha256.

**How to roll back**: remove the helper, the shipped primitives are untouched.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

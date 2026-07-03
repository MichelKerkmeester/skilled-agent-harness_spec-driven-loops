---
title: "Decision Record: Phase 2: archived-tier-and-tombstone-read-exclusions"
description: "Four decisions: shared active-row predicate ownership, constitutional injection exemption, z_archive tier rewrite policy, and the retro-fix policy for substring-inflated tiers."
trigger_phrases:
  - "archived tier exclusion"
  - "tombstone read filter"
  - "deprecated rows ranking"
  - "predicate ownership decision"
  - "z_archive tier rewrite"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/002-archived-tier-and-tombstone-read-exclusions"
    last_updated_at: "2026-07-03T12:15:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored ADR-001..ADR-004 for the read-exclusion phase"
    next_safe_action: "Revisit ADR statuses at implementation start; flip Proposed to Accepted on first code commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-archived-tier-and-tombstone-read-exclusions"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 2: archived-tier-and-tombstone-read-exclusions

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: One shared active-row predicate module owns read exclusion

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester (operator), deep-dive remediation program |

---

<!-- ANCHOR:adr-001-context -->
### Context

Read exclusion is enforced per channel today and the channels disagree: the vector channel filters deprecated rows (vector-index-queries.ts:431) while FTS, BM25, graph injection (causal-boost.ts:457,687), the summary lane (stage1-candidate-gen.ts:167 is a literal no-op stub), community injection, rescue backfill (retrieval-rescue.ts:388), trigger cache, keyword fallback, and stats/health apply no tier or tombstone filter. The live result: 7,340 deprecated snapshots rank at 0.85 through lexical channels and 11,086 archived rows rank as active. We needed one owner for the exclusion contract so ten channels cannot drift apart again.

### Constraints

- The predicate must compose into raw SQL (better-sqlite3 prepared statements) AND filter already-hydrated JS rows, because channels read at different layers.
- It must be pure (no DB handle state) so DB rebind and the eval harness keep identical semantics.
- Phase 001's dup-hash collapse consumes this predicate, so the module must land before that task runs.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: A new single-owner module, `mcp_server/lib/search/active-row-predicate.ts`, exporting one SQL fragment builder and one row filter that every read channel imports.

**How it works**: The module exports `ACTIVE_ROW_SQL(alias)` returning the fragment `<alias>.deleted_at IS NULL AND lower(<alias>.importance_tier) NOT IN ('deprecated','archived')` and `isActiveRow(row, opts)` with options `{ includeArchived, lane }`. Channels embed the fragment in their queries or filter hydrated candidates through the function. `includeArchived: true` widens only the archived exclusion; the `constitutional` lane bypasses tier exclusion but never the tombstone exclusion (ADR-002).
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared predicate module (chosen)** | One owner; testable in isolation; adoptable per channel in reviewable commits | Ten call-site edits; two composition forms (SQL + JS) to keep in sync | 9/10 |
| Keep per-channel inline predicates, fix each | No new module; smallest diff per channel | Exactly the drift that produced this bug class; nothing stops an eleventh divergent copy | 3/10 |
| SQLite VIEW (`active_memory_view`) all channels query | Exclusion enforced at one schema point | Channels join FTS5/vec virtual tables and hydrate at different layers; a view cannot cover JS-side injection paths (graph, community, rescue); migration risk on a 1.3GB live DB | 5/10 |
| Partial indexes only (index active rows) | Query speed benefit | An index shapes performance, not correctness; unindexed scans still return excluded rows | 2/10 |

**Why this one**: Only a code-level shared module covers both SQL-composed channels and JS-side injection paths with one testable contract.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Deprecated/archived/tombstoned exclusion becomes identical across all ten channels; the report §1 reproduction queries stop stacking stale snapshots.
- Phase 001 dup collapse and phase 005 trigger-cache hygiene reuse the same contract instead of re-deriving it.

**What it costs**:
- Ten call sites change in one phase . Mitigation: one commit per channel, adversarial matrix per channel, baseline-before-delta gate.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| SQL fragment and JS filter drift apart | M | Shared unit-test table runs both forms over the same row fixtures |
| An undiscovered eleventh read path keeps ad-hoc filtering | M | Same-class producer inventory rg in plan FIX ADDENDUM must come back clean before completion |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Live-reproduced pollution (report §1); channel-inconsistent filters verified in code (ledger DUP MECHANISM) |
| 2 | **Beyond Local Maxima?** | PASS | View, per-channel, and index-only alternatives evaluated above |
| 3 | **Sufficient?** | PASS | One module + call-site adoption; no framework or schema redesign |
| 4 | **Fits Goal?** | PASS | Direct hit on phase success gates (deprecated/archived absent from all channels) |
| 5 | **Open Horizons?** | PASS | Later phases (001, 005, 007) import the same contract instead of forking it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- New `lib/search/active-row-predicate.ts` with unit tests.
- Ten call sites adopt it (plan.md FIX ADDENDUM table; tasks T-008..T-016).

**How to roll back**: Revert the adoption commits channel by channel, then the module commit; channels return to their prior local filters. No data changes are involved in this decision.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Constitutional rows stay separately injected, but honor tombstones

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester (operator), deep-dive remediation program |

---

<!-- ANCHOR:adr-002-context -->
### Context

Constitutional-tier rows are injected into session priming through their own lane, outside ranked retrieval. The shared predicate excludes rows by tier, so we had to decide whether constitutional rows flow through the same exclusion or keep their separate injection. The ledger also shows the risk of the separate lane: a /tmp sandbox row was auto-injected into every session priming (L5), and constitutional rows are structurally invisible to the trigger cache (agent E).

### Constraints

- Constitutional injection is a product behavior other phases depend on; silently routing it through ranked exclusion would change session priming this phase does not own.
- A tombstoned constitutional row must never keep injecting; delete must be trustworthy everywhere (REQ-002).
- Constitutional write-guard hygiene (dedup 70 to 20, /tmp guard) is phase 005 scope.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Keep constitutional rows separately injected; the predicate's `lane: 'constitutional'` option bypasses tier exclusion but always enforces `deleted_at IS NULL`.

**How it works**: Ranked channels call the predicate with the default lane, which excludes deprecated and archived tiers. The constitutional injection path calls it with `lane: 'constitutional'`, which skips the tier clause and keeps the tombstone clause. Trigger-cache visibility for constitutional rows stays as-is and is decided in phase 005.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Separate injection + tombstone-only predicate (chosen)** | Preserves priming behavior; delete still hides; one contract with an explicit lane | Constitutional pollution (L5 sandbox row) survives until phase 005 | 8/10 |
| Route constitutional through ranked exclusion | One uniform path | Changes session priming semantics owned elsewhere; constitutional rows would compete with ranked results | 3/10 |
| Exempt constitutional from the predicate entirely | Zero change to the lane | A tombstoned constitutional row would keep injecting forever; contradicts REQ-002 | 2/10 |

**Why this one**: It fixes the delete-trust hole without re-deciding priming behavior that phase 005 owns.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Deleting a constitutional row actually removes it from session priming.
- The predicate module documents the only sanctioned exemption, so audits have one place to look.

**What it costs**:
- The known constitutional duplication and sandbox-row pollution persist this phase . Mitigation: explicitly scoped to phase 005 with a pointer in spec.md Out of Scope.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Callers pass the constitutional lane to ranked reads | M | Lane parameter validated; unit test asserts ranked channels never pass it |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Predicate design forces an explicit answer for the constitutional lane |
| 2 | **Beyond Local Maxima?** | PASS | Uniform-exclusion and full-exemption alternatives weighed |
| 3 | **Sufficient?** | PASS | One lane option, no new subsystem |
| 4 | **Fits Goal?** | PASS | Keeps REQ-002 (delete hides everywhere) intact |
| 5 | **Open Horizons?** | PASS | Phase 005 can tighten constitutional hygiene without reworking the predicate |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `active-row-predicate.ts` lane option plus validation.
- Constitutional injection call site passes `lane: 'constitutional'`.

**How to roll back**: Remove the lane argument from the injection call site; constitutional reads revert to their current unfiltered behavior.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: z_archive migration rewrites tiers to archived with a full audit trail

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester (operator), deep-dive remediation program |

---

<!-- ANCHOR:adr-003-context -->
### Context

11,086 rows (33% of the corpus) point into z_archive folders yet rank as active, including 272 critical and 4,278 important rows; `is_archived=0` on every row in the DB and `includeArchived` is hardcoded false, so both halves of archive filtering are broken (ledger L5). Once the archived tier exists (REQ-004), the corpus needs a one-shot migration or the tier stays empty and the predicate excludes nothing.

### Constraints

- 272 rows claim critical tier inside an archive; most are substring-inflated (report P2: explains 948 critical incl. 272 in z_archive) but a genuine critical row must be recoverable.
- The migration mutates a 1.3GB production DB; it must be batched, resumable, and reversible (NFR-P02, NFR-R01).
- The legacy `is_archived` column already exists and other code may read it.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: A one-shot versioned migration that sets `importance_tier='archived'` and `is_archived=1` for every row whose stored path resolves under a z_archive directory, writing (memory_id, prior_tier, new_tier, reason, migration_version) to `memory_tier_migration_audit` before each rewrite.

**How it works**: The migration lives in the vector-index-schema.ts registry (same versioned pattern as the v28 retire migration), runs in batches of at most 1,000 rows per transaction, and demotes critical/important tiers along with the rest because archived placement wins over claimed tier. Prior tiers stay recoverable from the audit table, and a rollback script replays them by migration version. The tier is authoritative; `is_archived` is kept in sync as a legacy mirror and its removal is deferred to phase 013 closeout.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Tier rewrite + audit trail (chosen)** | Predicate works immediately; reversible; one authoritative field | Rewrites 11,086 rows; audit table adds a small storage cost | 9/10 |
| Set only `is_archived=1`, keep tiers | No tier data loss | Two authoritative fields forever; every predicate needs both clauses; critical/important archive rows keep their ranking boosts | 4/10 |
| Path-based exclusion at query time (LIKE z_archive) | No migration | Per-query path matching in ten channels; breaks when files move; repeats the ad-hoc-filter mistake ADR-001 removes | 2/10 |
| Delete z_archive rows outright | Corpus shrinks | Destroys recall over archives (includeArchived use case); irreversible | 1/10 |

**Why this one**: A single authoritative tier plus a replayable audit trail gives correctness now and reversibility later.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- A third of the corpus stops competing with active memories (SC-001, SC-003); archive recall stays available through `includeArchived: true`.
- Tier distributions become honest inputs for ranking phases 006/007.

**What it costs**:
- Genuine critical annotations inside z_archive lose their tier by default . Mitigation: audit trail preserves prior tiers; a sample of the 272 critical rows is reviewed before enforce (spec.md R-002).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Path predicate misses non-standard archive locations | M | Confirm the z_archive path pattern against live SQL during T-018 before running the rewrite |
| Migration interrupted mid-run | L | Versioned + batched; audit rows written before mutation make the run resumable and reversible |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 33% of corpus ranked active from archives, measured live (L5) |
| 2 | **Beyond Local Maxima?** | PASS | Flag-only, path-based, and delete alternatives weighed |
| 3 | **Sufficient?** | PASS | One migration + audit table; no new subsystem |
| 4 | **Fits Goal?** | PASS | Directly satisfies REQ-005 and SC-003 |
| 5 | **Open Horizons?** | PASS | Audit trail supports later tier corrections; is_archived removal deferred, not blocked |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- New migration version in `lib/search/vector-index-schema.ts` plus the `memory_tier_migration_audit` table.
- Rollback script replaying prior_tier by migration version.

**How to roll back**: Run the audit-restore script for this migration version: it rewrites `importance_tier` (and `is_archived`) back from the audit rows, then re-run the T-006 baseline SQL probes to confirm restored counts.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Substring-inflated tiers are retro-fixed from frontmatter, parser fix first

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester (operator), deep-dive remediation program |

---

<!-- ANCHOR:adr-004-context -->
### Context

memory-parser.ts:892 sets a row's tier when `[CRITICAL]` or `[IMPORTANT]` appears as a bare substring anywhere in the body, so docs quoting log formats get critical tier, no decay, and a 2x boost. This explains the 948-row critical audit population, including 272 rows inside z_archive (report P2 highlights, ledger Agent H P2). Fixing the parser stops new inflation but leaves 948 already-mislabeled rows ranked wrong.

### Constraints

- Some of the 948 rows may genuinely be critical via frontmatter; the retro-fix must not flatten those.
- The 272 z_archive overlap rows are already rewritten to archived by ADR-003, so ordering matters.
- Rows whose source file no longer exists cannot be re-parsed from disk; their handling must be explicit.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Land the parser fix first (tier from frontmatter only), then run a one-shot retro-fix migration that recomputes tier from stored frontmatter for the substring-inflated population, demoting to the frontmatter tier or the default tier when frontmatter declares none, with every change audited.

**How it works**: T-020 restricts tier assignment to explicit frontmatter (`importance_tier:` or a frontmatter-level marker). The migration then selects rows whose current critical/important tier has no frontmatter support, rewrites them to their frontmatter tier (default 'normal' when absent), and logs prior/new tiers to `memory_tier_migration_audit`. It runs AFTER the ADR-003 migration so the 272 archived rows are already settled; rows with unreadable source files are recomputed from the indexed frontmatter snapshot in the DB, not from disk.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Parser fix + frontmatter-recompute migration (chosen)** | Stops new inflation AND heals existing rows; auditable; deterministic rule | Requires a careful population query; rows with genuinely intended body markers lose the boost unless frontmatter confirms | 9/10 |
| Parser fix only, leave existing rows | Smallest change | 948 rows keep no-decay 2x boosts indefinitely; tier data stays dishonest for ranking phases | 3/10 |
| Blanket demote all 948 to normal | Simple query | Flattens genuinely critical rows; ignores frontmatter evidence that exists | 4/10 |
| Full corpus re-parse from disk | Most accurate | 37% of rows cite dead file paths (report §1); a disk re-parse cannot cover them and belongs to phase 001/003 repair scope | 3/10 |

**Why this one**: Frontmatter is the only tier source we are keeping, so recomputing from it is the same rule applied retroactively.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Critical tier population becomes explainable by frontmatter alone (SC-003); no-decay and 2x boost privileges return to genuinely marked rows.
- Ranking phases 006/007 inherit honest tier inputs.

**What it costs**:
- Any author who relied on body markers to set tier loses that behavior . Mitigation: the parser change is documented in the tool docs task (CHK-141) and frontmatter remains the supported path.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Population query over- or under-selects inflated rows | M | T-003 confirms the 948-row audit query BEFORE the fix; migration dry-run reports counts before enforce |
| Ordering mistake runs retro-fix before z_archive rewrite | L | Task dependency T-020 deps: [T-018]; migration versions ordered in the registry |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 948 inflated critical rows measured (🟢 data); mechanism verified at memory-parser.ts:892 |
| 2 | **Beyond Local Maxima?** | PASS | Fix-only, blanket-demote, and full re-parse alternatives weighed |
| 3 | **Sufficient?** | PASS | One parser change + one audited migration |
| 4 | **Fits Goal?** | PASS | Satisfies REQ-008/REQ-009 and SC-003 |
| 5 | **Open Horizons?** | PASS | Same audit table and rule serve any future tier corrections |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `lib/parsing/memory-parser.ts:892` tier assignment restricted to frontmatter.
- Retro-fix migration + audit rows in `lib/search/vector-index-schema.ts`, ordered after the ADR-003 migration.

**How to roll back**: Revert the parser commit; run the audit-restore script for the retro-fix migration version to replay prior tiers.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

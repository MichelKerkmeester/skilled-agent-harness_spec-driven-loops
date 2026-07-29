---
title: "Decision Record: Derived Schema Authority"
description: "ADR-001 names the canonical graph-metadata.json derived schema (Python-compiler shape as core, TS lifecycle fields folded in additively). ADR-002 classifies fields as machine-derivable vs authored-preserved and decides syncDerivedMetadata/backfillDerivedV2's fate. Status: Accepted after re-verifying the 11-root/zero-caller claims against source."
trigger_phrases:
  - "decision"
  - "record"
  - "derived"
  - "schema"
  - "authority"
  - "decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/001-derived-authority-decision"
    last_updated_at: "2026-07-29T10:44:35Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-derived-authority-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Operator sign-off on ADR-001/ADR-002 before phase 003 begins build"
    answered_questions:
      - "Live on-disk derived shape confirmed uniform Python-compiler vocabulary across all 11 schema_version-2 roots"
      - "syncDerivedMetadata and backfillDerivedV2 confirmed to have zero production callers (test-only)"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: Derived Schema Authority

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Canonical `derived` Schema Authority

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-29 |
| **Deciders** | claude-code — accepted autonomously under the 030 implementation goal after re-verifying every load-bearing claim against source |

---

<!-- ANCHOR:adr-001-context -->
### Context

`graph-metadata.json`'s `derived` block is defined two incompatible ways at once. The TS Zod schema (`schemas/skill-derived-v2.ts:42-55`) declares `trigger_phrases`, `keywords`, `provenance_fingerprint`, `generated_at`, `source_docs`, `key_files`, `demotion`, `trust_lane`, `sanitizer_version`, `lifecycle_status`, `redirect_from`, `redirect_to`. The Python compiler's validator (`scripts/skill_graph_compiler.py`, `validate_derived_metadata()` ~lines 300-325) requires `trigger_phrases`, `key_topics`, `key_files`, `entities`, `source_docs` (non-empty arrays), `causal_summary` (non-empty string), and `created_at`/`last_updated_at` (ISO timestamps). Direct inspection of `sk-git/graph-metadata.json` (one of the 11 live `schema_version: 2` roots) confirms the on-disk reality matches the Python shape exactly — `causal_summary`, `created_at`, `entities`, `intent_signals`, `key_files`, `key_topics`, `last_updated_at`, `source_docs`, `trigger_phrases` — and none of the seven TS-only fields are present. `lib/scorer/projection.ts:658-685`, the production filesystem read path that feeds `advisor_recommend` scoring, reads `derived.key_topics`, `derived.entities`, `derived.key_files`, `derived.source_docs` for `derivedKeywords` — the Python vocabulary — and never reads `derived.keywords`. `lib/derived/sync.ts`'s `syncDerivedMetadata` is the only writer of the TS shape; a repo-wide grep found its only callers are `tests/lifecycle-derived-metadata.vitest.ts` and `stress-test/skill-advisor/auto-indexing-derived-sync-stress.vitest.ts` — zero production call sites.

### Constraints

- Must not require migrating any of the 11 live `graph-metadata.json` files as a precondition of this decision landing (data migration, if any, is phase 003's concern)
- Must not break `lib/scorer/projection.ts`'s current production read path the day this decision is accepted
- Must preserve a path for `lifecycle_status`/`redirect_from`/`redirect_to` to become live-usable later — these are the design basis for a future skill-deprecation/redirect workflow and represent real prior investment
- `causal_summary` is authored prose (per this phase's brief) — any canonical shape must keep a field for it, not attempt to derive it mechanically
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: adopt the Python-compiler shape (`trigger_phrases`, `key_topics`, `entities`, `key_files`, `source_docs`, `causal_summary`, `created_at`, `last_updated_at`) as the canonical authored/derived core, and fold the seven TS-only fields (`provenance_fingerprint`, `demotion`, `trust_lane`, `sanitizer_version`, `lifecycle_status`, `redirect_from`, `redirect_to`) into the same object as additive, optional, defaulted fields rather than replacing or dropping either side.

**How it works**: `skill_graph_compiler.py`'s `validate_derived_metadata()` is promoted to the single source-of-truth field definition, since it is already what gates all 11 live roots. The TS Zod `SkillDerivedV2Schema` is regenerated/hand-aligned to match it in phase 003: it gains `key_topics`, `entities`, `causal_summary`, `created_at`, `last_updated_at`, and `keywords` is retired in favor of `key_topics`+`entities` — the vocabulary the scorer already reads. The seven TS-only fields keep their existing names, types, and defaults, unchanged.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Merged: Python core + TS fields additive (chosen)** | Zero data migration; CI-adjacent validator stays authoritative; lifecycle capability preserved for future adoption; single source-of-truth definition | Still requires picking one definition language as generator-of-truth (resolved: Python validator; TS schema regenerated from it) | 8/10 |
| Python shape wholesale, drop TS-only fields | Zero migration, matches the validator exactly | Strands `lifecycle_status`/`redirect_from`/`redirect_to`/`demotion`/`trust_lane` with no field to house them if adopted later; discards real prior design investment | 6/10 |
| TS shape wholesale — migrate all 11 roots, rewrite the Python validator, rewire the scorer's read path | Single, more complete, type-checked schema | Highest blast radius: forces a simultaneous change to live data + the only real CI gate + the production scorer; `causal_summary` has no field at all and would need adding back anyway | 5/10 |

**Why Chosen**: The merged option loses nothing currently on disk and nothing already designed in the TS layer, at the lowest blast radius. Migrating 11 live roots and rewriting the fleet's only CI-adjacent validator purely to unify a schema definition (the wholesale-TS option) is not justified when the TS-only fields can be added additively instead.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- One schema definition functions as source of truth once phase 003 aligns the TS Zod schema to it
- Phase 003's regenerator and freshness gate get an unambiguous target instead of two conflicting ones
- Phase 009's CI wiring validates against one shape, closing the "green root / downstream-failure seam" the 029 research names for `skill_graph_compiler.py`

**What it costs**:
- `schemas/skill-derived-v2.ts` needs a follow-up edit in phase 003 to add `key_topics`/`entities`/`causal_summary`/`created_at`/`last_updated_at` and retire `keywords`. Mitigation: explicitly scoped to phase 003, not this phase.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A production consumer of the TS-only fields exists that this phase's grep missed | M | Operator review is the explicit gate in Open Questions before sign-off; if found, this ADR is revised before phase 003 starts |
| `skill_graph_compiler.py`'s validator has its own undiscovered gaps (029 research O4: not wired into CI today) | M | Out of scope here — phase 009 wires it into CI; this ADR only names it as schema source-of-truth, not as already CI-enforced |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Three phases (003/007/009) are blocked without this decision (`spec.md` §6) |
| 2 | **Beyond Local Maxima?** | PASS | Three options scored, not just the first one considered |
| 3 | **Sufficient?** | PASS | Additive folding is the smallest change that loses nothing on either side |
| 4 | **Fits Goal?** | PASS | Directly unblocks 003/007/009 per the 029 research's proposed follow-up sequence |
| 5 | **Open Horizons?** | PASS | The additive design leaves room for `lifecycle_status`/`redirect_from`/`redirect_to` to become live-used later without a second schema-authority fight |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes** (future, phase 003):
- `schemas/skill-derived-v2.ts` gains `key_topics`/`entities`/`causal_summary`/`created_at`/`last_updated_at`; `keywords` is deprecated/removed
- `lib/derived/sync.ts`'s `syncDerivedMetadata` is retargeted to emit the merged shape and gains a production call site (currently zero, per ADR-002)

**How to roll back**: This phase's own rollback is documentary only (see `plan.md` §7) — no schema, code, or data is touched here. Phase 003's rollback, once that phase exists, would revert the schema file and regenerator to their pre-003 state; specifying that further is out of scope for this decision.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Field Disposition (Derivable vs Authored-Preserved) and `syncDerivedMetadata`/`backfillDerivedV2` Fate

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-29 |
| **Deciders** | claude-code — accepted autonomously under the 030 implementation goal after re-verifying every load-bearing claim against source |

---

<!-- ANCHOR:adr-002-context -->
### Context

Once ADR-001 names the canonical shape, a future regenerator (phase 003) needs to know, per field, whether it is safe to recompute on every run or whether it must be read-and-preserved because a human (or a lifecycle action) authored it. Getting this wrong either silently destroys an authored decision — e.g. un-deprecating a skill by overwriting `lifecycle_status` on a routine regenerator pass — or leaves machine-derivable data stale forever, which is the exact "hand-enriched after scaffold and drifts forever" gap the 029 research names for the `derived` block (research theme #1, glm-high finding).

### Constraints

- `causal_summary` is prose per this phase's brief — must be authored-preserved, not mechanically derived
- Any field a regenerator computes must reuse `lib/derived/extract.ts`'s existing extraction logic, not a second, newly-invented extraction algorithm
- `syncDerivedMetadata`'s existing atomic-write and idempotent-diff design (`lib/derived/sync.ts:57-146` — atomic tmp-then-rename write, `stableDerivedJson` comparison that ignores `generated_at` so no-op reruns are byte-stable) is worth preserving as behavior, independent of which fields it ultimately emits
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: classify `trigger_phrases`, `key_topics`/`entities`, `key_files`, `source_docs`, and `provenance_fingerprint` as machine-derivable (regenerator-owned, safe to recompute every run); classify `causal_summary`, `created_at`, `lifecycle_status`, `redirect_from`, and `redirect_to` as authored-preserved (must survive a regenerator rerun untouched unless an explicit override is passed — exactly how `syncDerivedMetadata`'s current `lifecycleStatus`/`redirectFrom`/`redirectTo` options already behave); classify `last_updated_at`/`generated_at`, `demotion`, `trust_lane`, and `sanitizer_version` as regenerator-owned bookkeeping, bumped by whichever process writes the block. We chose to repurpose `syncDerivedMetadata` as the future regenerator's entry point once retargeted to the ADR-001 merged shape, rather than deleting it or writing a new one from scratch, and to repurpose `backfillDerivedV2` (`lib/lifecycle/schema-migration.ts`) as the schema-version-2 migration helper for any remaining `schema_version: 1` roots.

**How it works**: A future regenerator calls the existing `extractDerivedMetadata` for the derivable fields, reads the existing `derived` block first for the authored-preserved fields (overwriting only when an explicit override is passed, mirroring today's `SyncDerivedOptions`), and writes the merged shape atomically via the already-implemented `writeJsonAtomic`.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Preserve `syncDerivedMetadata`'s existing derivable/authored split, retarget to ADR-001 shape (chosen)** | Reuses proven atomic-write + idempotent-diff code; minimal new design surface | Needs the ADR-001 field renames applied before it is correct for phase 003 | 8/10 |
| Delete `syncDerivedMetadata`; write a new regenerator from scratch in phase 003 | Clean slate | Discards a working atomic-write + idempotent-diff implementation that already solves the exact "don't silently overwrite on a no-op run" hazard the research flags as missing | 4/10 |
| Treat every field as machine-derivable (recompute `causal_summary` from source too) | Simplest mental model | `causal_summary` is prose per the phase brief — not mechanically extractable without a real fabrication risk; explicitly rejected | 2/10 |

**Why Chosen**: Reusing already-audited code (atomic writes, `fsync`, idempotent no-op comparisons) that only needs a field-shape retarget is lower-risk than a rewrite. The third option is foreclosed by this phase's own brief: `causal_summary` stays authored.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Phase 003 can build the regenerator as a retarget-and-extend of existing code rather than new code, lowering that phase's risk
- Authored decisions (`lifecycle_status`, `redirect_from`/`redirect_to`, `causal_summary`) are protected from accidental overwrite by construction, not by caller discipline alone

**What it costs**:
- `lib/derived/extract.ts`'s current extraction output needs to be checked in phase 003 for whether it already computes `key_topics`/`entities`-shaped values or only `keywords`-shaped ones — this phase names the target schema but does not audit `extract.ts`'s internals field-by-field. Mitigation: named explicitly as a phase-003 Setup task.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| `extract.ts`'s current extraction shape doesn't cleanly map to `key_topics`/`entities` without further work | M | Flagged as a phase-003 Setup task, not assumed already solved here |
| An authored `lifecycle_status`/`redirect_from`/`redirect_to` value is silently lost if a future caller forgets to pass override options | M | Recommend phase 003 makes read-and-preserve the *default* behavior (read the existing `derived` block first) rather than requiring every caller to remember to pass overrides |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without this, phase 003 would face an ambiguous derivable-vs-authored question mid-build |
| 2 | **Beyond Local Maxima?** | PASS | Three options scored, not just "treat everything as machine-derivable" |
| 3 | **Sufficient?** | PASS | Reuses existing code rather than proposing a new abstraction |
| 4 | **Fits Goal?** | PASS | Directly informs phase 003's regenerator design |
| 5 | **Open Horizons?** | PASS | Read-and-preserve-by-default protects future `lifecycle_status`/`redirect_*` adoption from accidental data loss |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes** (future, phase 003):
- `lib/derived/extract.ts`'s extraction output shape audited and aligned to `key_topics`/`entities`
- `lib/derived/sync.ts`'s `syncDerivedMetadata` retargeted to read-and-preserve authored fields by default and emit the ADR-001 merged shape
- A production call site added for `syncDerivedMetadata` (currently zero)

**How to roll back**: Same as ADR-001 — this phase's rollback is documentary only; no code or data changes here to revert.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!--
Level 2 Decision Record. Two ADRs cover the full decision this phase owns:
which schema is canonical, and how its fields are disposed. Both are
Status: Accepted — accepted autonomously under the 030 implementation goal
after the load-bearing claims were re-verified against the current tree.
-->

---

<!-- ANCHOR:verification -->
## Verification (re-confirmed against the current tree, 2026-07-29)

Every load-bearing claim was re-run against source this session, not carried over from the 029 research summary:

| Claim | Method | Result |
|-------|--------|--------|
| On-disk `derived` is uniformly the Python shape | `grep '"schema_version": 2'` across root graph-metadata; `grep` for the seven TS-only fields | 11 roots, **0** carry `lifecycle_status`/`redirect_from`/`provenance_fingerprint`/`trust_lane`/`sanitizer_version`/`demotion` |
| `syncDerivedMetadata`/`backfillDerivedV2` have zero production invocations | `rg` for call sites, excluding the definition | Only `tests/`/`stress-test/` callers; the one non-test reference in `lib/derived/extract.ts:219` is a **comment**, not an invocation |
| The scorer reads the Python vocabulary, not `derived.keywords` | `rg 'derived\.(key_topics\|entities\|key_files\|source_docs\|keywords)'` in `lib/scorer/projection.ts` | Reads `key_topics`/`entities`/`key_files`/`source_docs` (lines 217-220, 665-668); never `derived.keywords` |
| The TS schema is imported by live modules | `rg 'skill-derived-v2\|SkillDerivedV2'` excluding tests | `handlers/skill-graph/validate.ts`, `lib/derived/sync.ts`, `lib/derived/sanitizer.ts`, `lib/lifecycle/schema-migration.ts` |

The additive-merge recommendation stands unchanged: it loses nothing on disk and nothing already designed in the TS layer, at zero migration cost. The real schema/code change (aligning the TS Zod schema, retargeting the writer, migrating roots) is phase 003's guarded, reversible work.
<!-- /ANCHOR:verification -->

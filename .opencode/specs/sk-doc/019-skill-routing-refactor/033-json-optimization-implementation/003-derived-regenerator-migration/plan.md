---
title: "Implementation Plan: Derived Regenerator + Fleet Migration + Freshness Gate"
description: "Architecture and phased approach for a skill-root derived regenerator, an 11-root fleet migration to the canonical derived shape, and a new CI freshness gate — including a mandatory rollback plan for the high-blast fleet write."
trigger_phrases:
  - "derived regenerator migration plan"
  - "skill root freshness gate plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/003-derived-regenerator-migration"
    last_updated_at: "2026-07-29T09:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "Depends on phase 001 (canonical derived-schema decision) and phase 002 (schema implementation)"
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation-003-derived-regenerator-migration-20260729"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Derived Regenerator + Fleet Migration + Freshness Gate

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Build a skill-root analog to the spec-folder `backfill-graph-metadata` regenerator: a script that derives `key_files`/`source_docs`/`entities`/`trigger_phrases`/`key_topics` from each skill's corpus while preserving authored `causal_summary` and the TS-side `lifecycle_status`/`redirect_from`/`redirect_to` capabilities, per the phase-001 canonical-schema decision. Migrate all 11 existing skill roots to that shape in one reviewed, atomic pass, then add a derived-freshness CI gate so this surface can never drift silently again — closing the gap the 029 research packet ranked as the highest-leverage, 3/3-agreed finding.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Bar |
|------|-----|
| Validator | `skill_graph_compiler.py`'s `validate_derived_metadata` reports 0 errors on all 11 roots post-migration |
| Idempotency | A second regenerator run against the migrated fleet produces 0 additional writes |
| Preservation | `causal_summary` and any pre-existing `lifecycle_status`/`redirect_from`/`redirect_to` are byte-identical before/after |
| CI wiring | `routing-registry-drift.yml` invokes the new gate; a deliberately staled fixture fails it locally with a nonzero exit |
| Rollback rehearsed | `git checkout --` revert demonstrated on at least one fixture root before the fleet-wide write |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Two new scripts under `sk-doc/create-skill/scripts/`, matching the existing gate scripts' `.cjs` style in that directory:

| Component | Role |
|-----------|------|
| `regenerate-skill-derived.cjs` | Per-root regenerator. For a given skill directory: reads SKILL.md, README.md, and the root's own declared `source_docs`; extracts `trigger_phrases`/`key_topics`/`key_files`/`source_docs` (extending the existing TS extractor's headings/keywords/source-doc logic in `lib/derived/extract.ts:24-30`, which today stops at `triggerPhrases`/`keywords`/`sourceDocs`/`keyFiles` and has no `key_topics`/`entities` output); derives typed `entities` (`name`/`kind`/`path`/`source`, `kind` ∈ `ALLOWED_ENTITY_KINDS`) with on-disk path existence checks matching `skill_graph_compiler.py:371-394`; merges the result additively into the existing `graph-metadata.json.derived` — preserving `causal_summary` untouched and passing through `lifecycle_status`/`redirect_from`/`redirect_to` unchanged when present, instead of `sync.ts:131-135`'s full-object replace; writes atomically via tmp-file + rename (mirroring `sync.ts:57-69`'s `writeJsonAtomic`), skipping the write when content is unchanged (diff excludes only the timestamp field, mirroring `sync.ts`'s `stableDerivedJson`). Supports `--dry-run` (default) and `--write`, plus `--root <dir>` for a single skill or `--all` for the fleet. |
| `ci-skill-derived-freshness.cjs` | Fleet-wide freshness gate, structurally mirroring `ci-leaf-manifest-freshness.cjs`: walks every skill root with a `derived` block, regenerates each in-memory via the regenerator's pure extraction function (no writes), byte-diffs against the committed `graph-metadata.json`, and fails (nonzero exit) on any drift. Same exit-code convention: `0` fresh, `1` stale, `2` gate could not run. |

CI wiring point: `routing-registry-drift.yml:111-112` already invokes `ci-skill-root-metadata.cjs` and `ci-leaf-manifest-freshness.cjs` in sequence; the new gate is added as a third call in the same step. The workflow's `paths:` trigger list already includes `.opencode/skills/*/graph-metadata.json` (line ~28), so no trigger-path change is needed.

Post-migration reindex: the live advisor projection reads `graph-metadata.json.derived` directly on a filesystem fallback (`projection.ts:658-685`) or from a SQLite cache kept fresh by the daemon watcher (`lib/daemon/watcher.ts`) and the `rebuild-from-source.ts` freshness path. A fleet-wide write must be followed by either a live daemon picking up the 11 file-change events, or an explicit `memory_index_scan`/rebuild-from-source pass if the daemon is cold — this is a documented step in the migration runbook, not new code.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Consume phase 001's canonical `derived` schema/producer decision and phase 002's schema implementation as the input contract. Inventory the 11 existing roots' current `derived` blocks (all confirmed Python-shaped and `schema_version: 2` today via a live scan of `.opencode/skills/*/graph-metadata.json`). Snapshot originals for rollback and confirm `skill_graph_compiler.py`'s `validate_derived_metadata` as the acceptance oracle.

### Phase 2: Implementation

Build `regenerate-skill-derived.cjs` with corpus-based extraction of `key_files`/`source_docs`/`entities`/`trigger_phrases`/`key_topics`, typed-entity derivation, and additive preservation of `causal_summary`/lifecycle/redirect fields. Dry-run across all 11 roots and review diffs. Run `--write` to migrate the fleet in one reviewed pass. Build `ci-skill-derived-freshness.cjs` and wire it into `routing-registry-drift.yml`.

### Phase 3: Verification

Run `skill_graph_compiler.py` validation across all 11 migrated roots (0 errors). Re-run the regenerator a second time to confirm idempotency (0 additional writes). Run the new CI gate locally against a deliberately staled fixture (nonzero exit) and the clean fleet (0 exit). Execute the post-migration daemon/SQLite reindex and confirm the advisor projection reflects the migrated roots. Rehearse and record the rollback path.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Unit-level extraction tests against small SKILL.md/README fixtures (trigger-phrase/key-topic/key-file derivation matches expected sets). A preservation test: a fixture root with authored `causal_summary` and `lifecycle_status: "deprecated"`/`redirect_to` set round-trips through the regenerator byte-identical on those fields. An idempotency test: two consecutive `--write` runs against the same fixture produce identical output on the second pass. A CI-gate negative test: a deliberately hand-staled `graph-metadata.json.derived` fixture fails `ci-skill-derived-freshness.cjs` with a nonzero exit; a fresh fixture passes with 0. The full-fleet run of `skill_graph_compiler.py`'s `validate_derived_metadata` across all 11 real roots is the integration acceptance test — 0 errors is the bar. No broader regression suite applies beyond this: the change is scoped to JSON content plus one new CI step, not runtime code paths outside the advisor's `derived`-reading surface.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 001 (canonical `derived` schema/producer decision) and phase 002 (schema implementation) of this program — both must land before this phase's regenerator output shape is finalized. `skill_graph_compiler.py`'s `validate_derived_metadata` as the validation oracle. `routing-registry-drift.yml` as the CI wiring target. The system-skill-advisor daemon watcher (`lib/daemon/watcher.ts`) and freshness rebuild path (`lib/freshness/rebuild-from-source.ts`) for post-migration reindex.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All 11 target `graph-metadata.json` files are git-tracked. Before the fleet-wide `--write` pass, the working tree is confirmed clean on those 11 paths (an explicit pre-migration checkpoint), and a `git checkout -- <path>` revert is rehearsed on one fixture root to confirm the restore path works before touching the rest. Because the regenerator writes atomically per root (tmp-file + rename) and validates each root against `skill_graph_compiler.py` before committing its write, a mid-run failure never leaves a partially-written file — already-written roots stay valid, unwritten roots stay untouched, and the run can resume from wherever it stopped.

If a live routing regression appears after migration, the recovery path is: `git checkout --` the affected `graph-metadata.json` files back to their pre-migration state, then re-run the daemon reindex / `rebuild-from-source` pass so the SQLite advisor projection reflects the reverted content (a stale in-memory or on-disk SQLite cache is the failure mode this step guards against). The new CI gate script and its one workflow-step addition are independent of the data migration and revert as a single-file change if needed, without touching any `graph-metadata.json`.
<!-- /ANCHOR:rollback -->

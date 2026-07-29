---
title: "Feature Specification: Derived Regenerator + Fleet Migration + Freshness Gate"
description: "Build a skill-root analog to the spec-folder backfill-graph-metadata regenerator: derive key_files/source_docs/entities/trigger_phrases/key_topics from each skill's corpus while preserving authored causal_summary and the TS lifecycle/redirect capabilities per the phase-001 canonical-schema decision; migrate all 11 existing skill roots to that shape; add a derived-freshness CI gate."
trigger_phrases:
  - "derived regenerator migration"
  - "skill root derived freshness gate"
  - "graph-metadata derived fleet migration"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/003-derived-regenerator-migration"
    last_updated_at: "2026-07-29T09:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "Depends on phase 001 (canonical derived-schema/producer decision) and phase 002 (schema implementation) landing first"
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "030-json-optimization-implementation-003-derived-regenerator-migration-20260729"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether provenance_fingerprint/demotion/trust_lane (the TS anti-stuffing fields) are part of the canonical merge is owned by 001/002 — if yes, this regenerator's --write pass extends to backfill them; if no, it leaves them absent."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Derived Regenerator + Fleet Migration + Freshness Gate

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-29 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/030-json-optimization-implementation` |
| **Parent Spec** | ../spec.md |
| **Depends On** | Phase 001 (canonical `derived` schema/producer decision), Phase 002 (schema implementation) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`graph-metadata.json.derived` is the highest-leverage gap the 029 research packet found (3/3 lineage agreement, `research/research.md` §3 O1): the block has **two incompatible writers**. The Python compiler's validator (`skill_graph_compiler.py:311-320`) requires `trigger_phrases`/`key_topics`/`key_files`/`entities`/`source_docs` (all non-empty arrays) plus a non-empty `causal_summary` string, and the live scorer reads exactly that vocabulary — `derivedKeywords` is built from `key_topics`+`entities`+`key_files`+`source_docs` (`system-skill-advisor/mcp-server/lib/scorer/projection.ts:662-667`). The TypeScript sync writer (`system-skill-advisor/mcp-server/lib/derived/sync.ts:106-135`) instead builds a `SkillDerivedV2` object with `keywords`, `provenance_fingerprint`, `demotion`, `trust_lane`, `sanitizer_version`, `lifecycle_status`, `redirect_from`/`redirect_to` (`schemas/skill-derived-v2.ts:42-55`) and **replaces the whole `derived` object** (`sync.ts:131-135`, `derived: finalDerived` — not a merge). If `syncDerivedMetadata` is ever invoked against one of the 11 live roots (its own purpose: setting `lifecycle_status` or a `redirect_to` on deprecation), it silently drops `key_topics`/`entities`/`key_files`/`source_docs`/`causal_summary`, which fails the Python validator and collapses that skill's routing signal in the live advisor.

Confirmed by direct inspection: all 11 current roots already carry a hand-authored, Python-shaped `derived` block (verified via a live scan of every `graph-metadata.json` under `.opencode/skills/`), but nothing regenerates those fields from the corpus — they were one-time authored and will drift as SKILL.md/README content changes. The scaffold itself compounds this: `init_skill.py` emits an **incomplete** `derived` block (`trigger_phrases`, `key_topics`, `source_docs`, `created_at`, `last_updated_at` only — `init_skill.py:287-293,540-557`), omitting `key_files`/`entities`/`causal_summary`, so every new root fails `validate_derived_metadata` until someone hand-fills the rest. There is no skill-root analog to the spec-folder `backfill-graph-metadata.ts` regenerator, and no freshness gate — unlike `leaf-manifest.json`, which already has one (`ci-leaf-manifest-freshness.cjs`) wired into `routing-registry-drift.yml:111-112`.

This phase builds that regenerator, uses it to migrate the fleet to one canonical shape, and closes the freshness gap — the prerequisite the 029 synthesis named before any other Tier-1 follow-up (§6: "O1 is the prerequisite").
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope — a new regenerator script under `sk-doc/create-skill/scripts/` that derives `key_files`/`source_docs`/`entities`/`trigger_phrases`/`key_topics` from each skill's corpus (SKILL.md, README.md, and its own declared `source_docs`); preservation of authored `causal_summary` and any existing TS-side `lifecycle_status`/`redirect_from`/`redirect_to` via additive merge (never a full-object replace); a fleet migration pass over all 11 existing skill roots (`cli-external-orchestration`, `mcp-code-mode`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`, `sk-git`, `sk-prompt`, `system-deep-loop`, `system-skill-advisor`, `system-spec-kit`) to the canonical shape resolved by phases 001/002; a new `ci-skill-derived-freshness.cjs` gate mirroring the existing `ci-leaf-manifest-freshness.cjs` regenerate-and-byte-diff pattern, wired into `routing-registry-drift.yml`; and a documented daemon/SQLite reindex step for after a fleet-wide write, since the live advisor projection reads `graph-metadata.json.derived` directly (`projection.ts:658-685`) and the daemon watcher (`system-skill-advisor/mcp-server/lib/daemon/watcher.ts`) or a manual `memory_index_scan`/rebuild-from-source pass (`lib/freshness/rebuild-from-source.ts`) must pick the migration up.

Out of scope — deciding the canonical schema/producer authority itself (phase 001's decision, this phase only consumes its resolved shape as an input contract); the schema definition changes to `skill-derived-v2.ts`/`skill_graph_compiler.py` needed to encode that decision (phase 002); closing the scaffold `--fix` journey (O2, a later phase); Gate-2 golden-prompt CI (O3, a later phase); wiring the compiler/routing-accuracy validation into CI (O4 — already scaffolded as sibling phase `006-ci-compiler-accuracy-gates`); intent-signal quality fixes (O6); `command-metadata.json` ingestion (O7).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Regenerator derives `key_files`/`source_docs`/`entities`/`trigger_phrases`/`key_topics` from each skill's corpus | A dry-run pass over all 11 roots produces a reviewable diff for every root; no root is skipped |
| REQ-002 | Authored `causal_summary` is preserved verbatim, never auto-generated or overwritten | `causal_summary` is byte-identical before/after regeneration on all 11 roots |
| REQ-003 | TS lifecycle/redirect fields are preserved when present | A fixture root with `lifecycle_status: "deprecated"` and a `redirect_to` set round-trips through the regenerator unchanged (additive merge, not full-object replace, unlike `sync.ts:131-135`) |
| REQ-004 | `entities` are typed objects matching the Python validator's contract | Every derived entity has `name`/`kind`/`path`/`source`, `kind` is one of `ALLOWED_ENTITY_KINDS = {skill, agent, script, config, reference}` (`skill_graph_compiler.py:45`), and its `path` resolves to a real on-disk file (`skill_graph_compiler.py:392-394`) |
| REQ-005 | All 11 existing roots migrate to the canonical shape in one reviewed, idempotent pass | Running the regenerator a second time against the migrated fleet produces zero additional writes (unchanged-content roots are skipped, only the timestamp field is excluded from the diff — mirroring `sync.ts`'s `stableDerivedJson`) |
| REQ-006 | A derived-freshness CI gate blocks silent drift | `ci-skill-derived-freshness.cjs` regenerates each root's `derived` block in-memory and byte-diffs it against the committed file; wired into `routing-registry-drift.yml` alongside the existing `ci-skill-root-metadata.cjs`/`ci-leaf-manifest-freshness.cjs` calls (`routing-registry-drift.yml:111-112`); a deliberately staled fixture fails the gate locally with a nonzero exit |
| REQ-007 | Migration is safely reversible | A pre-migration snapshot of all 11 `graph-metadata.json` files exists (git-tracked baseline), and a `git checkout --` revert is rehearsed on at least one fixture root before the fleet write |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

All 11 skill roots pass `skill_graph_compiler.py`'s `validate_derived_metadata` with zero errors after migration; the regenerator is idempotent (a second run against the migrated fleet writes nothing); `causal_summary` and any pre-existing `lifecycle_status`/`redirect_from`/`redirect_to` are preserved byte-for-byte; the new CI gate is wired into `routing-registry-drift.yml` and demonstrably catches drift (staled fixture fails, clean fleet passes); the post-migration daemon/SQLite reindex is executed and the live advisor projection reflects the migrated roots; the rollback path is rehearsed and documented before the fleet-wide write.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | HIGH BLAST: fleet-wide write to 11 live `graph-metadata.json` roots the running skill-advisor reads for real-time routing | Dry-run diff reviewed per root before any write; atomic tmp-file+rename per root (mirroring `sync.ts:57-69`'s `writeJsonAtomic`); validate-before-commit per root so a mid-run failure never leaves a partially-written file |
| Risk | `entities` schema mismatch — the Python validator requires structured `{name, kind, path, source}` objects (`skill_graph_compiler.py:371-394`), not the flat strings the existing TS extractor produces (`lib/derived/extract.ts:24-30` has no `entities`/`key_topics` output at all) | Regenerator emits typed entity objects with `kind` restricted to `ALLOWED_ENTITY_KINDS`; validated via `skill_graph_compiler.py` before any write is committed |
| Risk | Stale SQLite advisor projection after the fleet write, if the daemon watcher isn't running or was already warm with a cached projection | Explicit post-migration `memory_index_scan` / daemon watcher confirmation step; documented daemon-restart fallback via `lib/freshness/rebuild-from-source.ts` |
| Risk | Regenerated `trigger_phrases`/`key_topics` could be less generous than the existing hand-authored set and narrow routing coverage | Additive merge with existing authored entries rather than wholesale replacement; every removal is flagged in the dry-run diff for human review before `--write` |
| Dependency | Phase 001's canonical `derived` schema/producer decision | This phase implements against 001's resolved shape as an input contract; it does not make the schema-authority call itself |
| Dependency | Phase 002's schema implementation | The regenerator's output shape must match what 002 lands in `skill-derived-v2.ts`/`skill_graph_compiler.py` |
| Dependency | `skill_graph_compiler.py`'s `validate_derived_metadata` as the acceptance oracle | Used unmodified as the pass/fail gate for every migrated root |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether `provenance_fingerprint`/`demotion`/`trust_lane`/`sanitizer_version` (the TS anti-stuffing fields from `schemas/skill-derived-v2.ts:42-55`) are part of the canonical merge is owned by phases 001/002. If yes, this regenerator's `--write` pass extends to backfill them from `applyAntiStuffing`; if no, it leaves them absent and this phase's scope stays to the five corpus-derived fields plus `causal_summary`/lifecycle/redirect preservation.
- Exact ordering/dedup rules for merging newly-derived `trigger_phrases`/`key_topics` against existing hand-authored entries (append-only vs. re-derive-and-diff) is a design decision for plan.md, not yet fixed at spec time.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Program predecessors**: Phase 001 (canonical schema decision), Phase 002 (schema implementation), under `../`
- **Research source**: `../../029-skill-json-optimization-research/research/research.md` §3 O1
- **Contract under study**: `.opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **QA**: See `checklist.md`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `002-baseline-capture` |
| **Successor** | `004-scaffold-journey` |

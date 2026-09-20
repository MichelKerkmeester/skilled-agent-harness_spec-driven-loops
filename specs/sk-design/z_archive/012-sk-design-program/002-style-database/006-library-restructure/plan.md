---
title: "Implementation Plan: sk-design styles library restructure + kebab rename"
description: "Level 2 plan for the styles library restructure: a shallow ownership tree, a single lib/paths.mjs seam, three green mixed states G1 to G3, a two-checkpoint kebab rename and manifest consolidation, and a one-commit rollback boundary."
trigger_phrases:
  - "styles library restructure plan"
  - "g1 g2 g3 migration lib paths.mjs plan"
  - "checkpoint a checkpoint b manifest v2 projector plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/006-library-restructure"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Authored Level 2 plan for the styles library restructure"
    next_safe_action: "Gate on 001-foundation, then migrate via G1 G2 G3 states"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_engine/style-library.mjs"
      - ".opencode/skills/sk-design/styles/_db/indexer.mjs"
      - ".opencode/specs/sk-design/012-sk-design-program/002-style-database/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-restructure-plan-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: sk-design styles library restructure + kebab rename

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (Node ESM `.mjs`) styles backend + one TypeScript generator gate |
| **Framework** | `node:test` (no npm script); two aggregators + ~89 `test()` sites |
| **Storage** | Committed corpus (1,290 bundles + two manifests); mutable SQLite publication state (git-ignored, absent on disk) |
| **Testing** | `_engine/__tests__/index.mjs` (6 files), `_db/__tests__/index.mjs` (10 files), four mode-corpus suites, generator typecheck + corpus-baseline test |

### Overview

Move the flat, underscore-prefixed styles root into a shallow ownership tree where each direct child owns one lifecycle: `library/` (committed data + manifests), `lib/` (importable source: `lib/engine/`, `lib/database/`), `scripts/` (the extractor), `database/` (git-ignored mutable state), `tests/`, and `docs/`. Add exactly one new module, `lib/paths.mjs`, as the path seam; add no compatibility aliases. The migration is correct iff both styles test aggregators stay green through three mixed states and the manifests are byte-identical at Checkpoint A. No database is generated during the move.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Predecessor `001-foundation` (Phase 0) has shipped; its measurement plane exists.
- The G0 baseline is green and captured: both aggregators, the four mode suites, generator typecheck, and the targeted corpus-baseline test.
- The manifest reports 1,290 unique safe slugs and every bundle is a six-file tracked unit.
- The resolved layout conflict (RESTRUCTURE governs) is recorded in `spec.md`.

### Definition of Done

- All 17 modules import 1:1 from new paths; `lib/paths.mjs` is the only new source module; no compat aliases.
- Both aggregators are green at G1, G2, and G3; manifests are byte-identical at Checkpoint A.
- `database/*` is git-ignored except `README.md`, proven by `git check-ignore`; no database was created.
- Only enumerated migration paths are staged; `validate.sh --strict` on this packet = 0 errors.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Shallow ownership tree with a single path seam, migrated through green mixed states. Each direct child of `styles/` expresses one lifecycle; no `backend/`, `runtime/`, `src/`, or package wrapper is introduced because it would add depth without adding an owner [SOURCE: 007-gap-remediation-research/001-restructure/research/lineages/sol-high-fast/research.md §5].

### Target Tree

```text
.opencode/skills/sk-design/styles/
|-- README.md
|-- library/            committed data
|   |-- bundles/<1,290 slugs>/
|   `-- manifests/{crawl-manifest.json, retrieval-manifest.json}
|-- lib/                importable source (+ the one new seam)
|   |-- paths.mjs
|   |-- engine/         9 modules (was _engine/)
|   `-- database/       8 core DB source modules (was _db/ core)
|-- scripts/            extract-refero.mjs (was _harness/)
|-- database/           git-ignored mutable SQLite/generations/pointers/locks (+ README.md)
|-- tests/              engine/ + database/ (+ test-owned oracle material)
`-- docs/
```

### Content Ownership (the split the restructure enforces)

- **`library/` (committed data):** the 1,290 six-file bundles and the consolidated manifests. Authoritative corpus content.
- **`lib/` (source):** the 17 preserved modules split into `lib/engine/` and `lib/database/`, plus the new `lib/paths.mjs`. The resolved decision places DB *source* — including the freshly-built generation-manifest, stage-telemetry, and oracle modules — under `lib/database/`.
- **`database/` (mutable, ignored):** rebuildable SQLite publication state; never committed except `README.md`; never generated during migration.
- **`scripts/`, `tests/`, `docs/`:** the standalone extractor, all test-owned code/fixtures, and operational docs.

### Data Flow

`lib/paths.mjs` exports independent defaults for styles-root, bundle-root, crawl-manifest, retrieval-manifest, and database-root. Callers accept those paths instead of deriving both manifests from a corpus parent. At Checkpoint B, the harness owns `manifest.json` v2; a single shared deterministic projector joins manifest entries to per-style artifacts by stable ID and produces retrieval rows for BOTH the flat engine and the DB indexer; `retrieval-manifest.json` survives only as a migration bridge and is then removed [SOURCE: 007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/research.md §7].

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Entry Gate

- [ ] Predecessor `001-foundation` shipped; G0 baseline green and captured (both aggregators, four mode suites, generator typecheck + corpus-baseline test); manifest reports 1,290 unique safe six-file bundles.

### Phase 1: Setup (G0 → G1)

- [ ] Capture the green G0 baseline and the manifest/hash/count snapshots so post-move deltas are attributable.
- [ ] Add `lib/paths.mjs` with the five independent defaults still pointing at the old locations; refactor production paths to accept independent bundle/manifest/database inputs. **[MIXED A: old locations, decoupled path API]** — aggregators stay green.

### Phase 2: Implementation (G2 → G3, two checkpoints)

- [ ] **G2 (Checkpoint A relocation):** move all 17 modules + tests + oracle + harness + docs into `lib/`, `tests/`, `scripts/`, `docs/` file-by-file (never `_db` wholesale); update bidirectional imports, the four mode consumers/tests, and the generator. **[MIXED B: new code tree, old bundles/manifests]** — aggregators + generator gate green.
- [ ] **G3 (bundle move + flip):** run the closed-set preflight and one manifest-derived `spawnSync` `git mv` for the 1,290 bundles; rename both manifests; flip centralized defaults and extractor outputs; add the `database/*` ignore rule (except `README.md`). Apply the five kebab renames + reference closure at byte parity (Checkpoint A complete).
- [ ] **Checkpoint B (consolidation):** introduce `manifest.json` v2 + the shared projector behind existing engine/DB surfaces, prove retrieval/DB parity, then remove `retrieval-manifest.json`. The DB generation manifest stays distinct.

### Phase 3: Verification

- [ ] Both aggregators green at G1/G2/G3; byte-parity of manifests at Checkpoint A; all 17 modules import 1:1 from new paths; no compat aliases.
- [ ] `git check-ignore` proves `database/*` ignored except `README.md`; no database created during migration.
- [ ] `git status` clean of stray moves; only enumerated migration paths staged; `validate.sh --strict` = 0 errors. On any gate failure, repair forward from the preceding green mixed state.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Aggregator | Engine + DB module behavior at G1/G2/G3 | `node _engine/__tests__/index.mjs` + `node _db/__tests__/index.mjs` (relocated after G2) |
| Consumer | Four mode-corpus suites resolve the moved engine facade | `node --test design-*/corpus/__tests__/*.test.mjs` |
| Generator gate | Positional path derivation intact | `npm run typecheck` + targeted `corpus-baseline-v3.test.ts` |
| Parity | Byte-identical manifests + equivalent query/hydration/DB-status at Checkpoint A | recorded baseline transcripts + diff |
| Ignore probe | Mutable `database/` containment | `git check-ignore -v` on real publication filenames |
| Projector parity | Retrieval/DB records equal across 1,290 entries (Checkpoint B) | fail-closed normalizer + shared projector fixtures |

The two aggregators plus byte-parity are the executable contract; `git`/listing evidence is corroborating.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Predecessor `001-foundation` (Phase 0) | Internal | Planned | Hard blocker — the measurement plane and baseline do not exist |
| Coupled sibling `006-persistent-db-activation` | Internal | Planned | Coupled but scope-separate; this packet generates no database |
| Node `node:test` ladder on the worktree | Internal | Green | The rollback target and correctness gate; capture green first |
| Two backing 007 research lineages (restructure + naming) | Internal | Green | The authoring base; the layout conflict is already resolved |
| `git mv` atomicity for the 1,290-bundle move | External | Known-partial | Not transactional; failure stops for scoped inspection, never blind rerun |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
001-foundation ──> Entry Gate ──> G0 baseline
   G0 ──> G1 (paths.mjs, old defaults)
       ──> G2 (move 17 modules/tests/oracle/harness/docs, cut over consumers)
       ──> G3 (move bundles, flip defaults, ignore policy) = Checkpoint A
           ──> Checkpoint B (manifest v2 + projector, remove retrieval bridge)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Entry Gate | `001-foundation` | G0, G1 |
| G1 | Green G0 baseline | G2 |
| G2 | G1 path seam | G3 |
| G3 (Checkpoint A) | G2 moved source + green consumers | Checkpoint B |
| Checkpoint B | G3 renames at byte parity | `006-persistent-db-activation` handoff |

- G1 **gates** G2: no module is moved until the path seam is proven green.
- G2 is a single cohesive group: all 17 modules move together with their imports; a mixed old/new import path is never gated.
- G3 is the atomic bundle-move + flip; Checkpoint B follows only after Checkpoint A parity holds.

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATE

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| G0 baseline + G1 path seam | Medium | Deferred — depends on `001-foundation` completion date |
| G2 module/consumer relocation | High | Deferred — 17 modules + four mode consumers + generator, one cohesive group |
| G3 bundle move + flip (Checkpoint A) | Medium | Deferred — one preflighted `spawnSync` move + reference closure |
| Checkpoint B consolidation | High | Deferred — v2 schema, projector, parity/stale/rollback gates |
| **Total** | | **Not estimated — planning packet, Status: PLANNED** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: an aggregator goes red, manifests are not byte-identical at Checkpoint A, an old-source import path resolves, a mutable file is not ignored, or the generator gate regresses.
- **Procedure**: before commit, repair forward from the preceding green mixed state (G1/G2/G3). The rollback boundary is one migration commit; after commit, `git revert <migration-commit>` and rerun the old-path baseline.
- **Blast radius**: Low-to-medium and reversible. The change is file moves + import edits with no schema-semantics change; the default `legacy` read path and flat authoritative bundles are unchanged.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] G0 baseline transcripts, manifest hashes, and 1,290-slug counts captured before any move.
- [ ] Each mixed state (G1/G2/G3) verified green before advancing.
- [ ] `database/*` ignore rule verified with `git check-ignore` before any persistent status probe.

### Rollback Procedure

1. **Before commit**: repair the failed group forward from the last green mixed state; never rerun a failed `git mv` blindly.
2. **Bundle move failure**: inspect `git status --short` scoped to the styles root; restore only manifest-enumerated source/destination pairs with operator confirmation.
3. **After commit**: `git revert <migration-commit>`; rerun the old-path baseline to confirm restoration.
4. **Never**: hard reset, clean, stash, broad restore, or mutable-state fallback.

### Data Reversal

- **Has data migrations?** No — no database is generated during migration; committed bundles/manifests move by `git mv` and revert cleanly with the migration commit.
- **Reversal procedure**: `git revert` the single migration commit; mutable `database/` state (if ever built later) is rebuildable and never part of this packet.

<!-- /ANCHOR:enhanced-rollback -->

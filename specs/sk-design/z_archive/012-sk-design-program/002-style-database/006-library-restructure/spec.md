---
title: "Feature Specification: sk-design styles library restructure + kebab rename"
description: "Restructure the sk-design styles library into a shallow ownership tree and apply the kebab rename map, migrating through three green mixed states, preserving all 17 modules 1:1 with only lib/paths.mjs added, and generating no database during the move."
trigger_phrases:
  - "styles library restructure kebab rename"
  - "sk-design styles shallow ownership tree lib paths.mjs"
  - "g1 g2 g3 green mixed states manifest v2 projector"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/006-library-restructure"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "implementer"
    recent_action: "Restructure complete: G1-G3 + fixed 2 md-generator consumers."
    next_safe_action: "Checkpoint B (manifest v2) deferred; not needed for Packet A."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_engine/style-library.mjs"
      - ".opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs"
      - ".opencode/specs/sk-design/012-sk-design-program/002-style-database/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-restructure-plan-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-design styles library restructure + kebab rename

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Track:** sk-design
- **Packet:** 015-styles-database-evolution / 005-library-restructure
- **Parent:** 015-styles-database-evolution
- **Parent Spec:** `../spec.md`
- **Predecessor:** 004-growth
- **Successor:** 006-persistent-db-activation
- **Level:** 2
- **Status:** COMPLETE (restructure G1-G3; Checkpoint B deferred)
- **Created:** 2026-07-21
- **Source research:** `sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/00{1,2}`

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `.opencode/skills/sk-design/styles/` root mixes three unrelated lifecycles under one flat, underscore-prefixed layout: 1,290 committed style bundles (7,740 files across six-file units), importable engine and database source, extraction tooling, two committed manifests, and documentation — a confirmed 7,800 tracked files with 60 non-bundle backend files. The underscore-prefixed directories (`_db/`, `_engine/`, `_harness/`) and the two authored JSON files (`_manifest.json`, `_retrieval-manifest.json`) also violate the repository kebab-case naming canon and match none of its exemptions. This is an ownership and naming problem, not a retrieval-algorithm problem [SOURCE: 007-gap-remediation-research/001-restructure/research/lineages/sol-high-fast/research.md §1]. Two backing research lineages independently disagree on where the database *source* should live (`lib/database/` vs a flat `database/`), which must be reconciled before any move [SOURCE: 007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/research.md §1].

### Purpose

Refactor the styles library into a shallow ownership tree where each direct child expresses exactly one lifecycle, and apply the kebab rename map, without changing retrieval behavior, schemas, or the default read path. Preserve all 17 production modules one-for-one and add only `lib/paths.mjs` as a decoupled path seam. Migrate through three green mixed states so every failure has a preceding runnable reference state — never a flag-day. Keep mutable SQLite publication state git-ignored under `database/`, and generate no database during the migration.

### Decision (FROZEN)

This is Packet B — the styles library restructure covering gaps 001 (restructure) and 002 (naming/manifests) from the 007 gap-remediation research. It is a mechanical move + rename refactor: NO new architecture and NO database generation are created during the migration. It is **coupled with** the sibling `006-persistent-db-activation` (the DB build) but is its own packet, sequenced after predecessor `001-foundation`.

- **Resolved layout conflict (recorded):** where the restructure research (`lib/database/` for DB source, git-ignored `database/` for mutable state) and the naming research (a flat `database/` for DB source) disagree, the **RESTRUCTURE layout governs** — `lib/database/` = source, `database/` = git-ignored mutable state. The naming map's `_db → database` folds in as the *mutable-dir* home. Because Phase-0 (`001-foundation`) already built into the old `_db/`, the rename relocates the freshly-built generation-manifest, stage-telemetry, and oracle modules into `lib/database/`.
- **The two-checkpoint discipline is preserved:** Checkpoint A = renames + reference updates at byte parity; Checkpoint B = a versioned `manifest.json` v2 schema plus a shared deterministic projector, after which `retrieval-manifest.json` is removed. The DB generation manifest stays DISTINCT from the corpus manifests.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Defining the target shallow ownership tree (`library/`, `lib/`, `scripts/`, `database/`, `tests/`, `docs/`) and the single new module `lib/paths.mjs`.
- Documenting the three green mixed states (G1 → G2 → G3) with the styles test ladder green at each state.
- Documenting the kebab rename map at byte parity (Checkpoint A) and the manifest v2 + shared projector consolidation (Checkpoint B).
- Establishing the hard invariants: preserve 17 modules 1:1, no compat aliases, never move `_db` wholesale, no DB generation during migration, and `database/` git-ignored except its `README.md`.

### Out of Scope

- Checkpoint B (versioned `manifest.json` v2 + shared projector, then drop `retrieval-manifest.json`) — deferred as a follow-on; not a prerequisite for Packet A.
- The persistent DB build/activation — owned by the coupled sibling `006-persistent-db-activation`.
- Phase-0 foundation work (manifest/telemetry/oracle/fixtures) — owned by predecessor `001-foundation`.
- Any retrieval-algorithm, schema-semantics, or default-mode change (`legacy` stays default; flat bundle files stay authoritative).

### Files to Change

**None in this packet** — the restructure is planning-only; the only files created are this packet's own five spec-folder documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`).

**Future surfaces (reference only, not modified in this packet):**

| File / Path | Change Type | Description |
|-------------|-------------|-------------|
| `.opencode/skills/sk-design/styles/_engine/` (9 modules) | Reference only (not modified) | Moves to `lib/engine/` in the implementation; filenames/exports preserved |
| `.opencode/skills/sk-design/styles/_db/` (8 core modules) | Reference only (not modified) | DB source moves to `lib/database/`; never moved wholesale |
| `.opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs` | Reference only (not modified) | Single env-flag adapter (`persistent-adapter.mjs:104`); imports move in Checkpoint A |
| `.opencode/skills/sk-design/styles/_harness/extract-refero.mjs` | Reference only (not modified) | Moves to `scripts/extract-refero.mjs` |
| `.opencode/skills/sk-design/styles/_manifest.json` | Reference only (not modified) | Renames to `manifest.json`; corpus authority (read by `_db/indexer.mjs:649`) |
| `.opencode/skills/sk-design/styles/_retrieval-manifest.json` | Reference only (not modified) | Renames to `retrieval-manifest.json` in A; removed at the end of Checkpoint B |
| `design-{foundations,interface,motion,audit}/corpus/*.mjs` | Reference only (not modified) | Four mode consumers of the engine facade; imports cut over in G2 |
| `design-md-generator/backend/scripts/study-prepare.ts` | Reference only (not modified) | Generator hard gate; positional path derivation updated in G2 |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve modules 1:1; single new module | All 17 production modules (9 `_engine/` + 8 `_db/` core) import 1:1 from their new paths with filenames and exports unchanged; the only added source module is `lib/paths.mjs`; zero compatibility filesystem aliases exist |
| REQ-002 | Three green mixed states | The migration proceeds G1 (path seam, old defaults) → G2 (17 modules + tests + oracle into `lib/`, old bundles/manifests) → G3 (bundles moved + defaults flipped + full ladder); both styles test aggregators are green at each state, never a flag-day |
| REQ-003 | Never move `_db` wholesale; no DB generation | The database source moves file-by-file into `lib/database/`; `_db` is never moved as a directory (ignored mutable files could travel); no database is built, published, or generated during the migration |
| REQ-004 | Mutable state git-ignored | `database/` holds only mutable, git-ignored SQLite/generation/pointer/lock state; the ignore rule excludes everything under `database/` except a committed `database/README.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Checkpoint A kebab rename at byte parity | The five renames apply atomically with their reference closure — `_db → database` (mutable dir) with DB source → `lib/database/`, `_engine → lib/engine/`, `_harness → scripts/`, `_manifest.json → manifest.json`, `_retrieval-manifest.json → retrieval-manifest.json` — with byte-identical manifests and observable runtime parity; fixture-local manifest names are unchanged (they exercise explicit overrides) |
| REQ-006 | Checkpoint B manifest v2 + shared projector | A versioned `manifest.json` v2 (`{schemaVersion:2, kind:"style-corpus", entries:[…]}`) plus one shared deterministic projector derives retrieval records for BOTH the flat engine and the DB indexer; `retrieval-manifest.json` is removed only after every reader uses the projector; the DB generation manifest stays a distinct publication pointer |
| REQ-007 | Coupling and sequence discipline | The restructure is sequenced after predecessor `001-foundation` and stays scope-separate from the coupled sibling `006-persistent-db-activation`; the resolved layout conflict (RESTRUCTURE governs) is recorded and not re-litigated during the move |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both styles test aggregators (`_engine/__tests__/index.mjs` and `_db/__tests__/index.mjs`, relocated to `tests/engine/` and `tests/database/` after G2) are green at G1, G2, and G3 (REQ-002).
- **SC-002**: All 17 production modules resolve and import 1:1 from their new paths; a search for any old-source import path returns zero mutable matches (REQ-001).
- **SC-003**: The five renames land as one reference-closed change with byte-identical old/new manifests and equivalent query/hydration/DB-status output at Checkpoint A (REQ-005).
- **SC-004**: No compatibility filesystem alias exists anywhere; the only new source module is `lib/paths.mjs` (REQ-001).
- **SC-005**: `git check-ignore` confirms real publication filenames under `database/` are ignored while `database/README.md` is not; no database is created during the migration (REQ-003, REQ-004).
- **SC-006**: `git status` is clean of stray moves (only enumerated migration paths staged), and `validate.sh --strict` on this packet returns 0 errors (REQ-007).

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Partial bundle relocation during the 1,290-unit move | High | Exact six-file, tracked-set, empty-destination, collision, and argv-headroom preflight; stop on first mismatch and inspect scoped status [SOURCE: 007-gap-remediation-research/001-restructure/research/lineages/sol-high-fast/research.md §14] |
| Risk | `_db` moved wholesale carries ignored mutable SQLite into source | High | Move DB source file-by-file into `lib/database/`; never `git mv` the `_db` directory as a unit |
| Risk | Engine/database import cycle breaks mid-move | Med | Move all 17 modules as one G2 group and update bidirectional imports before the gate |
| Risk | Generator (`study-prepare.ts`) regresses on positional paths | Med | Typecheck + targeted corpus-baseline test at the baseline and mixed-state gates before G3 |
| Risk | Mutable SQLite accidentally committed | Med | Ignore all of `database/*` except `README.md`; probe real publication names with `git check-ignore` |
| Risk | `retrieval-manifest.json` bridge removed before all readers cut over | Med | Remove it only at the end of Checkpoint B after projector parity, stale-cache, and clean-rebuild gates pass |
| Dependency | `001-foundation` (Phase 0) measurement plane shipped | High | Restructure is sequenced after Phase 0; do not begin the move until it ships. Sorted-order predecessor is `004-growth`; the real dependency is `001-foundation`. |
| Dependency | Coupled sibling `006-persistent-db-activation` | Med | Coupled but scope-separate; no DB generation happens in this packet |
| Dependency | Node `node:test` ladder green on the worktree | Low | Two aggregators (~89 `test()` sites); capture the green baseline before any edit |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability

- The executable contract is the two styles test aggregators plus byte-parity of the manifests at Checkpoint A. No move, rename, or parity claim is made without those checks green. Each green mixed state (G1, G2, G3) is a runnable reference point, so any failed group is repaired forward from the preceding green state rather than blindly rerun.

### Security

- Comment hygiene [HARD BLOCK]: no spec/packet/phase/REQ ids in any moved module, manifest, test, or script comment — the migration edits paths and imports, not annotations.
- The mutable `database/` tree must be git-ignored except `README.md`; a v2 manifest parser must treat parse/read failure as fatal and never collapse to an empty manifest (which would erase acquisition state) [SOURCE: 007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/research.md §13].

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **G-state ordering** — G1 proves path decoupling without any rename; G2 proves moved source/consumers against the still-stable old corpus; G3 moves bundles and flips defaults. Beginning G2 before the full baseline is green is disallowed.
- **Fixture manifest names** — fixture-local `_manifest.json` / `_retrieval-manifest.json` names stay unchanged; they exercise explicit path overrides, not production defaults [SOURCE: 007-gap-remediation-research/001-restructure/research/lineages/sol-high-fast/research.md §7].
- **Bundle move safety** — the manifest-derived move validates exactly 1,290 unique safe slugs, each a six-file tracked unit, into an empty destination via one shell-free `spawnSync` call; `git mv` is not transactional, so a failure stops for scoped inspection.
- **Manifest v2 lifecycle** — `captured` requires a non-null slug and `capturedAt`; slug changes require atomic directory rename or explicit orphan rejection; ID (not slug) is the primary join key [SOURCE: 007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/research.md §8].
- **Rollback boundary** — the rollback boundary is one migration commit; before commit, repair forward from the preceding green mixed state; after commit, `git revert` the migration commit — never hard reset, clean, stash, or broad restore.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| **Scope** | 12/25 | A whole-tree move + rename touching 17 modules, two aggregators, four mode consumers, the generator, and 1,290 bundles — broad surface, no new architecture |
| **Risk** | 10/25 | Zero LOC in these docs (planning-only); build-time risk is medium — import integrity, git-mv atomicity, and mutable-state containment must hold |
| **Research** | 3/20 | Grounded in the two 007 lineages (5/5 forced iterations each); the layout conflict is resolved, implementation-cleanliness confirmations remain |
| **Total** | **25/70** | **Level 2** — mechanical refactor with a wide blast radius but bounded, reversible steps |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None architecturally — the two 007 lineages answered all charter questions and the layout conflict is resolved in favor of the RESTRUCTURE layout. The remaining items are implementation-time confirmations at the G0 baseline: the scoped migration surfaces are clean or explicitly separated from unrelated work; the baseline commands pass before path refactoring; no untracked passenger exists inside any of the 1,290 bundle roots at move time; active-versus-historical stale-path matches are classified correctly; and the final Git rename review recognizes the intended moves. A contradiction at any of these halts the migration for diagnosis rather than a silent workaround.

<!-- /ANCHOR:questions -->

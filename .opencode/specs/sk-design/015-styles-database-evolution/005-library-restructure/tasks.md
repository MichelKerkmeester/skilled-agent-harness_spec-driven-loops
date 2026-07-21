---
title: "Tasks: sk-design styles library restructure + kebab rename"
description: "Level 2 task breakdown for the styles library restructure: baseline and path seam, module and bundle relocation across G1 to G3 plus the Checkpoint A rename, and verification. Restructure shipped; Checkpoint B (manifest v2 + projector) deferred."
trigger_phrases:
  - "styles library restructure tasks"
  - "g1 g2 g3 module bundle relocation tasks"
  - "checkpoint a checkpoint b manifest projector tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/005-library-restructure"
    last_updated_at: "2026-07-21T13:56:19Z"
    last_updated_by: "implementer"
    recent_action: "Restructure complete: G1-G3 + fixed 2 md-generator consumers."
    next_safe_action: "Checkpoint B (manifest v2) deferred; not needed for Packet A."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/lib/paths.mjs"
      - ".opencode/skills/sk-design/styles/lib/engine/style-library.mjs"
      - ".opencode/specs/sk-design/015-styles-database-evolution/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-restructure-impl-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: sk-design styles library restructure + kebab rename

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable |
| `[B]` | Blocked/deferred |

**Task Format**: `T### Description`. The executable contract is the two styles test aggregators green plus byte-parity of the manifests at Checkpoint A. Comment hygiene: no spec/packet/phase/REQ ids in moved modules, manifests, tests, or scripts.
<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirmed the predecessor entry gate (`001-foundation` shipped, reconciled to built) and captured the green G0 baseline. [TESTED: `node --test` styles aggregators = 89/89 pre-move; `001-foundation` 69/69]
- [x] T002 Added `lib/paths.mjs` (STYLES_ROOT, BUNDLE_ROOT, crawl/retrieval manifest paths + filenames, DATABASE_ROOT) at old locations; sourced engine + indexer defaults from it — MIXED A, aggregators green. [SOURCE: commit `02481e1ec3`] [TESTED: aggregators 89/89]
<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### G2 relocation (MIXED B)

- [x] T003 Moved the 17 production modules via `git mv` — `_engine/` (9) → `lib/engine/`, `_db/` core (8) → `lib/database/`; filenames + exports preserved; `_db` never moved wholesale. [SOURCE: commit `b8732ba436`] [TESTED: engine 20/20 + database 69/69]
- [x] T004 [P] Moved tests, oracle, harness, docs — `_engine/__tests__`→`tests/engine/`, `_db/__tests__`→`tests/database/`, oracle→`tests/oracle/`, `_harness/extract-refero.mjs`→`scripts/`, module READMEs + playbook→`docs/`/`lib`/`scripts`. [SOURCE: 57 git-mv renames in `b8732ba436`]
- [x] T005 [P] Updated bidirectional imports, the four mode-corpus consumers/tests, and the md-generator generator (`study-prepare.ts` + `corpus-baseline-v3.test.ts`) — MIXED B green vs old bundles/manifests. [SOURCE: commits `b8732ba436`, `3cd7d67fb8`] [TESTED: 4 mode suites 22/25/21/23]

### G3 bundle move + Checkpoint A

- [x] T006 `git mv` of the 1,290 bundles → `library/bundles/`, crawl manifest co-located → `library/bundles/crawl-manifest.json`, retrieval manifest → `library/manifests/retrieval-manifest.json`; flipped centralized defaults + kebab names; added the `database/*` ignore except `README.md`; decoupled the default retrieval load. [SOURCE: commit `cee62570e4`] [TESTED: byte-parity MATCH both manifests; `runQuery` default → 5 cards]

### Checkpoint B consolidation

- [B] T007 DEFERRED — `manifest.json` v2 + shared projector, then remove `retrieval-manifest.json`. Deferred with reason: a schema-evolution enhancement, deferrable per the completion criteria, and not a prerequisite for Packet A (the DB indexer reads `crawl-manifest.json` directly). [SOURCE: 006-persistent-db-activation built + parity-proven without it]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Both aggregators green at G1/G2/G3, byte-parity of the manifests at Checkpoint A, all 17 modules importing 1:1 from new paths, zero compat aliases. [TESTED: 89/89 at each mixed state; byte-parity `sha256` MATCH]
- [x] T009 `git check-ignore` ignores `database/*` except `README.md`, `git status` clean of stray moves, `validate.sh --strict` on this packet = 0 errors. [TESTED: `git check-ignore` on `*.sqlite` ignored; validate.sh --strict → Errors:0]
<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Predecessor `001-foundation` entry gate confirmed before T002
- [x] All 17 modules relocated 1:1 with only `lib/paths.mjs` added, no compat aliases (T003-T005)
- [x] Checkpoint A renames at byte parity; `database/*` git-ignored except `README.md` (T006)
- [B] Checkpoint B DEFERRED with reason recorded (T007) — manifest v2 + projector; not needed for Packet A
- [x] T008/T009 verification pass with clean scope and `validate.sh --strict` = 0 errors
<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Restructure research**: `../../012-style-database-and-interface-commands/007-gap-remediation-research/001-restructure/research/lineages/sol-high-fast/research.md`
- **Naming/manifest research**: `../../012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/research.md`
- **Predecessor**: `../001-foundation/` · **Successor / coupled**: `../006-persistent-db-activation/`
<!-- /ANCHOR:cross-refs -->

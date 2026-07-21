---
title: "Tasks: sk-design styles library restructure + kebab rename"
description: "Level 2 task breakdown (T001-T009) for the styles library restructure: baseline and path seam, module and bundle relocation across G1 to G3 plus the two-checkpoint rename and manifest consolidation, and verification, all PLANNED."
trigger_phrases:
  - "styles library restructure tasks"
  - "g1 g2 g3 module bundle relocation tasks"
  - "checkpoint a checkpoint b manifest projector tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/005-library-restructure"
    last_updated_at: "2026-07-21T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 2 tasks for the styles library restructure"
    next_safe_action: "Execute T001 setup after 001-foundation ships"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_engine/style-library.mjs"
      - ".opencode/skills/sk-design/styles/_harness/extract-refero.mjs"
      - ".opencode/specs/sk-design/015-styles-database-evolution/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-restructure-plan-session"
      parent_session_id: null
    completion_pct: 0
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
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description [REQ: REQ-NNN | STATUS: PLANNED]` — no file-path segment; this is a planning packet with no code files to reference yet. The executable contract is the two styles test aggregators green plus byte-parity of the manifests at Checkpoint A. Comment hygiene: no spec/packet/phase/REQ ids in moved modules, manifests, tests, or scripts.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the predecessor entry gate: `001-foundation` shipped, and capture the green G0 baseline (both aggregators, four mode suites, generator typecheck + corpus-baseline test) with manifest hashes and the 1,290-slug count [REQ: REQ-002 | STATUS: PLANNED]
- [ ] T002 Add `lib/paths.mjs` exporting the five independent defaults (styles-root, bundle-root, crawl-manifest, retrieval-manifest, database-root) still pointing at old locations; refactor production paths to accept independent inputs — reach MIXED A with aggregators green [REQ: REQ-001 | STATUS: PLANNED]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### G2 relocation (MIXED B)

- [ ] T003 Move all 17 production modules file-by-file — `_engine/` (9) → `lib/engine/`, `_db/` core (8) → `lib/database/` — never moving `_db` wholesale; preserve filenames and exports [REQ: REQ-001/REQ-003 | STATUS: PLANNED]
- [ ] T004 [P] Move tests, oracle, harness, and docs — `_engine/__tests__` → `tests/engine/`, `_db/__tests__` → `tests/database/`, oracle → `tests/`, `_harness/extract-refero.mjs` → `scripts/`, docs → `docs/`; relocate the freshly-built generation-manifest/telemetry/oracle modules into `lib/database/` per the resolved layout [REQ: REQ-001/REQ-007 | STATUS: PLANNED]
- [ ] T005 [P] Update bidirectional relative imports, the four mode-corpus consumers/tests, and the generator (`study-prepare.ts`) positional paths; prove MIXED B against the still-old bundles/manifests [REQ: REQ-001 | STATUS: PLANNED]

### G3 bundle move + Checkpoint A

- [ ] T006 Run the closed-set preflight (1,290 unique safe six-file tracked bundles, empty destination, collision + argv headroom) and one manifest-derived `spawnSync` `git mv`; rename both manifests; flip centralized defaults and extractor outputs; add the `database/*` ignore rule except `README.md` — the five kebab renames land at byte parity [REQ: REQ-004/REQ-005 | STATUS: PLANNED]

### Checkpoint B consolidation

- [ ] T007 [B] Introduce `manifest.json` v2 (`{schemaVersion:2, kind:"style-corpus", entries:[…]}`) + the shared deterministic projector behind existing engine/DB surfaces; prove retrieval/DB parity across 1,290 entries; then remove `retrieval-manifest.json`, keeping the DB generation manifest distinct [REQ: REQ-006 | STATUS: PLANNED]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Confirm both aggregators green at G1/G2/G3, byte-parity of the manifests at Checkpoint A, all 17 modules importing 1:1 from new paths, and zero compat aliases [REQ: REQ-001/REQ-002/REQ-005 | STATUS: PLANNED]
- [ ] T009 Prove `git check-ignore` ignores `database/*` except `README.md` with no database created, `git status` clean of stray moves (only enumerated paths staged), then `validate.sh --strict` on this packet = 0 errors [REQ: REQ-003/REQ-004/REQ-007 | STATUS: PLANNED]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Predecessor `001-foundation` entry gate confirmed before T002 begins
- [ ] All 17 modules relocated 1:1 with only `lib/paths.mjs` added and no compat aliases (T003-T005)
- [ ] Checkpoint A renames land at byte parity; `database/*` git-ignored except `README.md` (T006)
- [ ] Checkpoint B either completed (v2 + projector, bridge removed) or explicitly deferred with reason recorded (T007)
- [ ] T008/T009 verification pass with clean scope and `validate.sh --strict` = 0 errors
- [ ] checklist.md fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Restructure research**: `../../012-style-database-and-interface-commands/007-gap-remediation-research/001-restructure/research/lineages/sol-high-fast/research.md` (§5 target tree, §9 dependency order, §10 move plan, §11 verification/rollback)
- **Naming/manifest research**: `../../012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/research.md` (§4 rename map, §8 v2 schema, §11 two-checkpoint migration)
- **Predecessor**: `../001-foundation/` (Phase 0 measurement plane) · **Successor / coupled**: `../006-persistent-db-activation/`

<!-- /ANCHOR:cross-refs -->

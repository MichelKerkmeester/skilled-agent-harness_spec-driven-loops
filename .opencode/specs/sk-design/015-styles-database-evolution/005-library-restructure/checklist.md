---
title: "Verification Checklist: sk-design styles library restructure + kebab rename"
description: "Level 2 verification checklist (CHK-001-016) for the styles library restructure: preserve 17 modules 1:1, only lib/paths.mjs added, three green mixed states, Checkpoint A byte parity, database/ git-ignored, and Checkpoint B manifest consolidation."
trigger_phrases:
  - "styles library restructure checklist"
  - "g1 g2 g3 byte parity verification checklist"
  - "database git-ignored manifest v2 projector checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/005-library-restructure"
    last_updated_at: "2026-07-21T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 2 checklist for the styles library restructure"
    next_safe_action: "Mark items with evidence during the G1 G2 G3 migration"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_engine/style-library.mjs"
      - ".opencode/skills/sk-design/styles/_db/indexer.mjs"
      - ".opencode/specs/sk-design/015-styles-database-evolution/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-restructure-plan-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: sk-design styles library restructure + kebab rename

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

Verify each item against real files + real command output. Mark `[x]` only with cited evidence (`[SOURCE: file]`, `[TESTED: ...]`). The two styles test aggregators and the manifest byte-parity are authoritative; `git`/listing evidence is corroborating.

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Predecessor `001-foundation` (Phase 0) shipped, and the green G0 baseline is captured before any move
  - **Verify by**: `001-foundation` implementation-summary shows Status Complete; baseline transcripts + manifest hashes + 1,290-slug count stored [TESTED: G0 baseline]
- [ ] CHK-002 [P0] Metadata (`description.json`, `graph-metadata.json`) and `validate.sh --strict` deferred to the parent/orchestrator session
  - **Verify by**: parent session confirms metadata regeneration and validation after this packet is authored

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] All 17 production modules (9 engine + 8 DB core) import 1:1 from new paths with filenames and exports unchanged
  - **Verify by**: aggregators resolve every module; a search for old-source import paths returns zero mutable matches [TESTED: engine + DB aggregators]
- [ ] CHK-004 [P0] `lib/paths.mjs` is the only new source module; no compatibility filesystem aliases exist anywhere
  - **Verify by**: `git diff --stat` shows exactly one added source module; alias scan of `styles/` is empty [SOURCE: styles tree]
- [ ] CHK-005 [P1] Comment hygiene holds: no spec/packet/phase/REQ ids in any moved module, manifest, test, or script comment
  - **Verify by**: token scan of moved files for artifact ids is empty

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-006 [P0] Both styles aggregators (`_engine/__tests__/index.mjs`, `_db/__tests__/index.mjs`, relocated to `tests/` after G2) are green at G1, G2, and G3
  - **Verify by**: three green runs, one per mixed state [TESTED: aggregators at G1/G2/G3]
- [ ] CHK-007 [P0] Manifests are byte-identical old-vs-new at Checkpoint A, with equivalent query/hydration/DB-status output
  - **Verify by**: manifest byte diff is empty; recorded output transcripts match [TESTED: Checkpoint A parity]
- [ ] CHK-008 [P1] The generator gate (`study-prepare.ts` typecheck + targeted corpus-baseline test) passes at the baseline and mixed-state gates
  - **Verify by**: `npm run typecheck` + `corpus-baseline-v3.test.ts` green before G3 [TESTED: generator gate]
- [ ] CHK-009 [P1] Checkpoint B projector parity holds across all 1,290 entries before `retrieval-manifest.json` is removed
  - **Verify by**: shared projector fixtures prove retrieval/DB record parity; bridge removed only after parity/stale/clean-rebuild gates [TESTED: projector parity]

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-010 [P0] `_db` is never moved wholesale; DB source moves file-by-file into `lib/database/`, leaving no ignored mutable file to travel
  - **Verify by**: move list enumerates DB modules individually; no `git mv` of the `_db` directory [SOURCE: move plan]
- [ ] CHK-011 [P0] No database is built, published, or generated at any point during the migration
  - **Verify by**: only persistent `status` probes run; no SQLite artifact appears on disk [TESTED: no-generation check]
- [ ] CHK-012 [P2] Fix-completeness inventory N/A for these docs — this packet ships no code changes (0 LOC, planning-only)
  - **Verify by**: implementation-summary confirms nothing runtime shipped in this packet

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-013 [P0] `database/*` is git-ignored except a committed `database/README.md`
  - **Verify by**: `git check-ignore -v` ignores real publication filenames; `git check-ignore -q database/README.md` returns non-ignored [TESTED: ignore probe]
- [ ] CHK-014 [P1] A v2 manifest parse/read failure is fatal and never collapses to an empty manifest that would erase acquisition state
  - **Verify by**: Checkpoint B fail-closed normalizer rejects corruption; poisoned-payload test passes

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-015 [P0] Docs authored at Level 2 (spec/plan/tasks/checklist/implementation-summary) matching the parent packet's template conventions
  - **Verify by**: `SPECKIT_LEVEL: 2` + matching `SPECKIT_TEMPLATE_SOURCE` markers present in all 5 files [SOURCE: five packet docs]
- [ ] CHK-016 [P1] The resolved layout decision (RESTRUCTURE governs; `lib/database/` = source, `database/` = mutable) is recorded and cross-referenced across spec/plan/implementation-summary
  - **Verify by**: the FROZEN decision in spec.md §2 matches plan.md architecture and the implementation-summary decisions table

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-017 [P0] Scope lock respected — only the 5 spec-folder docs in `005-library-restructure` are written; no parent/sibling/runtime files touched
  - **Verify by**: `git diff` scoped to this packet shows only spec/plan/tasks/checklist/implementation-summary [SOURCE: scope-diff]
- [ ] CHK-018 [P1] At implementation time, only enumerated migration paths are staged; renames are reviewed with `--find-renames`, never broad staging
  - **Verify by**: `git diff --cached --find-renames` recognizes the intended moves; no unrelated work staged

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 0/10 |
| P1 Items | 7 | 0/7 |
| P2 Items | 1 | 0/1 |

**Verification Date**: N/A — planning packet, not yet built
**Verified By**: N/A — deferred to the parent/build session

<!-- /ANCHOR:summary -->

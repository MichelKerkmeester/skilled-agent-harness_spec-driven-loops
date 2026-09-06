---
title: "Implementation Summary: Phase 6 orphaned-types-and-dead-modules"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/021-decommission-debt-and-cli-nesting/006-orphaned-types-and-dead-modules"
    last_updated_at: "2026-09-05T09:30:00Z"
    last_updated_by: "claude"
    recent_action: "Deleted 6 orphans, fixed 2 tests and 1 catch, deduped ROOTS"
    next_safe_action: "Run repair-derived.cjs --apply then revalidate --strict"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/types.ts"
      - ".opencode/skills/system-spec-kit/runtime/lib/description/README.md"
      - ".opencode/skills/system-spec-kit/runtime/tests/resource-map-extractor.vitest.ts"
      - ".opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs"
    session_dedup:
      fingerprint: "sha256:a5e8c5e921cb0a50e54844b9acb3bd0c0bc8834c11cc1c775d227e5dbeb161e3"
      session_id: "2026-09-05-054-006-orphaned-types-and-dead-modules"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-orphaned-types-and-dead-modules |
| **Status** | Complete |
| **Completed** | 2026-09-05 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every one of the six named dead-code items closed: seven orphaned type exports and two orphaned runtime modules deleted with grep proof, two never-run test files either fixed-and-wired-in or deleted as stale, one silent catch now logs, and one script's duplicated root list is deduplicated with its printed counts matching a manual count. Two of the "orphan" decisions turned out more nuanced than the spec's own problem statement assumed once the actual test files were read line by line, and both nuances changed what got deleted.

### Orphaned Types and Dead Modules

- **`shared/types.ts` / `shared/index.ts`** — deleted `IVectorStore`, `SearchOptions`, `SearchResult`, `StoreStats`, `Database`, `DatabaseExtended`, `PreparedStatement` (the two "DATABASE INTERFACE TYPES" and "VECTOR STORE TYPES" sections in full) and their `shared/index.ts` re-export lines. Renumbered the file's own section-comment sequence (1, 2, 3, ...) since deleting two whole sections left a gap; this also incidentally fixed a pre-existing duplicate "3." section number that predates this phase.
- **`runtime/lib/cognitive/rollout-policy.ts`** — deleted the module, its 100%-dedicated test (`tests/rollout-policy.vitest.ts`), its README, and the now-empty `cognitive/` folder. A prior author's `MODULE-MAP.md` entry rationalized keeping it as "the shared rollout-bucket implementation for a future percentage-gated flag" — a speculative future-use reason, not a cited current consumer, so it did not survive this phase's re-review. Updated `MODULE-MAP.md`, `lib/README.md` and `ENV-REFERENCE.md` (removed the `SPECKIT_ROLLOUT_PERCENT` row and its "Read by this package" mention; decremented the doc's own "Total unique variables documented" count 146 → 145). **Finding, not fixed:** `shared/algorithms/adaptive-fusion.ts` independently reads the same `SPECKIT_ROLLOUT_PERCENT` env var through its own private, duplicate `isFeatureEnabled()` — a separate, out-of-scope module this phase does not touch, so the env var itself is not fully dead, only this one reader of it.
- **`runtime/lib/description/repair.ts`** — deleted the module and its 100%-dedicated test (`repair.vitest.ts`, all 6 tests). Reading `repair-specimens.vitest.ts` and `description-merge.vitest.ts` in full (not just the spec's problem-statement summary) showed each file mixes `mergePreserveRepair`-specific tests with tests of unrelated, very much live production code (`lib/search/folder-discovery.ts`'s own inline repair path, which already calls `mergeDescription` directly and was never routed through the wrapper). Removed only the genuinely-dedicated slice: one test + import from `repair-specimens.vitest.ts` (8 → 7 tests kept) and one whole describe block + import from `description-merge.vitest.ts` (10 → 5 tests kept), leaving the folder-discovery.ts coverage untouched. Updated `MODULE-MAP.md`, `lib/description/README.md`, `tests/description/README.md` (code-file count 3 → 2) and `tests/description/fixtures/README.md`.
- **`scripts/lib/completion-state.test.mjs`** — moved to `scripts/tests/completion-state.vitest.ts` first (correct directory + extension), then run standalone per the plan's own risk mitigation: 10 of 27 assertions failed against the current `completion-state.cjs`/`check-completion.sh` contract. Two independent, unrelated drifts had accumulated while the file sat outside every include glob: `inferLevel`/`detectFilesPresent` now key Level 2 off `acceptanceCriteria.md`, not a `checklist` property that no longer exists on the returned shape, and `check-completion.sh` now requires an anchored Verification Protocol checklist section the fixture's plain `# Checklist` text never had (confirmed by running the real script against the fixture's exact content: `{"error": "verification section not found", ...}`). Fixing both would mean reverse-engineering `check-completion.sh`'s checklist grammar for a file this phase does not otherwise touch — deleted instead, per the phase's own explicit "or delete it if its assertions are stale/superseded" provision. `completion-state.cjs` now has zero test coverage; adding new coverage is out of this phase's scope.
- **`runtime/scripts/tests/resource-map-extractor.vitest.ts`** — moved to `runtime/tests/resource-map-extractor.vitest.ts` (the destination the phase's own scope names) and its one relative `require()` path updated. Run standalone: 3/3 failed on real-repo-path existence facts baked into the fixture data (`.opencode/commands/speckit/deep-review.md` etc. no longer exist after an unrelated commands restructuring). Fixed by recomputing the "Missing on disk" counts against the actual current tree and swapping one stale example path for a live one. Mid-fix, a concurrent, unrelated agent session actively renamed/removed `.opencode/commands/memory/` while this session was running, breaking the first replacement path (`.opencode/commands/memory/save.md`) within minutes of it being chosen; re-picked a more stable top-level path (`.opencode/commands/agent-router.md`) and re-verified. Deleted the now-empty `runtime/scripts/tests/` folder and its README; updated the parent `runtime/scripts/README.md`.
- **`alignment-validator.ts:582-585`** — the empty `catch (error: unknown) { if (error instanceof Error) { /* comment */ } }` now logs `console.log('   Warning: Could not read alternative spec folders (${error.message}) - continuing without suggestions')`. No control-flow change: same fall-through to the existing hard-block/threshold checks below.
- **`check-markdown-links.cjs`** — `ROOTS` deduplicated from 7 entries (two directories listed twice) to 5 (one each). Printed counts dropped from `7897 files, 13484 links checked` to `7837 files, 13467 links checked`, with the identical 8-entry `broken` list before and after (confirmed by diffing the full broken-link output, not just the summary line). Wall-clock time roughly halved (4.4s → 2.3s), matching the phase's own NFR-P01 expectation. **Finding, not fixed:** an independent, pre-existing bug in `walk()` — `e.isFile()` returns `false` for a `Dirent` representing a symlink, so any markdown file that is itself a symlink (66 repo-wide, including all of `.claude/commands/**`, which are symlinks into `.opencode/commands/**`) is silently never scanned for broken links. This is unrelated to and unaffected by the `ROOTS` duplication and outside this phase's explicit "only the ROOTS duplication is in scope" restriction for this file; the one-line fix is widening the check to `(e.isFile() || e.isSymbolicLink())`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `shared/types.ts` | Modify | Delete 7 orphaned interfaces; renumber section comments |
| `shared/index.ts` | Modify | Remove the matching re-export lines |
| `runtime/lib/cognitive/rollout-policy.ts` | Delete | No production caller |
| `runtime/lib/cognitive/README.md` | Delete | Documented only the deleted module |
| `runtime/lib/description/repair.ts` | Delete | No production caller |
| `runtime/tests/rollout-policy.vitest.ts` | Delete | 100%-dedicated to the deleted module |
| `runtime/tests/description/repair.vitest.ts` | Delete | 100%-dedicated to the deleted module |
| `runtime/tests/description/repair-specimens.vitest.ts` | Modify | Removed 1 dedicated test + import; kept 7 real-production-path tests |
| `runtime/tests/description/description-merge.vitest.ts` | Modify | Removed 1 describe block (5 tests) + import; kept 5 `mergeDescription` tests |
| `runtime/lib/MODULE-MAP.md` | Modify | Removed `cognitive/` section and its Foundation-Modules list entry; updated `description/` section |
| `runtime/lib/README.md` | Modify | Removed `cognitive/` from the Support row and directory tree |
| `runtime/lib/description/README.md` | Modify | Removed `repair.ts` from architecture, tree, key files, entrypoints, validation text |
| `runtime/ENV-REFERENCE.md` | Modify | Removed the `SPECKIT_ROLLOUT_PERCENT` row and mention; decremented documented-variable count |
| `runtime/tests/description/README.md` | Modify | Code-file count 3 → 2; removed `repair.vitest.ts` row |
| `runtime/tests/description/fixtures/README.md` | Modify | Reworded `mergePreserveRepair`-specific claims to the real (folder-discovery.ts) consumer; corrected test count |
| `scripts/lib/completion-state.test.mjs` | Delete | Stale assertions against the current `completion-state.cjs`/`check-completion.sh` contract |
| `runtime/scripts/tests/resource-map-extractor.vitest.ts` | Delete (moved) | Wrong directory for every include glob |
| `runtime/tests/resource-map-extractor.vitest.ts` | Add | Moved-and-fixed destination; now runs and passes under a real include glob |
| `runtime/scripts/tests/README.md` | Delete | Described only the now-moved file |
| `runtime/scripts/README.md` | Modify | Removed the `tests/` directory-tree row and its `RELATED` link |
| `scripts/spec-folder/alignment-validator.ts` | Modify | Empty catch now logs the caught error |
| `scripts/check-markdown-links.cjs` | Modify | `ROOTS` deduplicated |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Grep-prove-then-delete, repeated per item, exactly as `plan.md` specified — but each of the two orphaned-test items required reading the full file (not just the spec's summary) before deciding delete-vs-fix-vs-partial-fix, and two items (`repair.ts`'s test consumers, `rollout-policy.ts`'s env var) surfaced a real consumer or reader that the spec's problem statement had not accounted for, changing the scope of the edit from "delete the whole file" to "delete the dedicated slice, keep the rest."

Order: baseline typecheck + `check-markdown-links.cjs` + grep proofs (T001-T003) → the six deletions/fixes (T004-T010), each verified standalone before moving to the next → full re-verification (T011-T013) → dist rebuilds → phase-doc closeout.

`runtime`'s `dist/` needed a `npm run clean && npm run build` (not a plain `npm run build`) because `tsc --build`'s incremental cache never removes compiled output for a *deleted* source file — `--force` and `--clean` do not touch it either, only a full `dist/` wipe does. `shared` and `scripts` did not need this since their touched files were modified, not deleted, and TypeScript's incremental build correctly recompiles a modified file's output in place.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delete `rollout-policy.ts` rather than keep it for "a future percentage-gated flag" | The existing `MODULE-MAP.md` reason was speculative future-proofing, not a cited current or planned consumer; zero production callers confirmed by `rg`; trivially recoverable from git history if a real consumer appears |
| Delete `repair.ts` but keep 7/8 and 5/10 tests in its two shared test files | Only one test in `repair-specimens.vitest.ts` and one whole describe block in `description-merge.vitest.ts` were genuinely dedicated to `mergePreserveRepair`; the rest test the real, live `folder-discovery.ts` repair path via the same fixtures — deleting those files whole would have destroyed real production-code coverage |
| Delete `completion-state.test.mjs` rather than repair it | Its assertions are stale against two independent, real contract changes in `completion-state.cjs`/`check-completion.sh` (confirmed by running the real script against the fixture content); fixing it correctly would mean reverse-engineering `check-completion.sh`'s current checklist grammar, disproportionate to a "wire in or delete" task |
| Fix `resource-map-extractor.vitest.ts`'s stale example paths rather than delete it | The extractor logic itself was never wrong — only the fixture's illustrative file paths had drifted with an unrelated commands-tree restructuring; recomputing counts against the live tree kept full test coverage |
| Leave `shared/algorithms/adaptive-fusion.ts`'s duplicate `SPECKIT_ROLLOUT_PERCENT` reader untouched | Not one of the six named items; a fresh dead-code sweep is explicitly out of scope for this phase |
| Leave `check-markdown-links.cjs`'s symlink-skipping `e.isFile()` bug untouched | The phase's own Out of Scope line restricts this file to "only the ROOTS duplication"; fixing the symlink bug would newly scan 66 previously-unscanned files and carries its own review-worthy risk of surfacing new broken links |
| Renumber `shared/types.ts`'s section comments after deleting two whole sections | Leaving a `1, 3, 3, 4, ...` gap directly caused by this deletion would be more confusing than the mechanical renumber, and is a direct consequence of the edit rather than unrelated cleanup |

Matrix: 6 named items (7 types + 2 modules + 2 tests + 1 catch + 1 script) × outcome (delete / delete-partial / log-added / dedupe) — one row per item above.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit --composite false -p tsconfig.json` (shared) | Exit 0, before and after |
| `tsc --noEmit --composite false -p tsconfig.json` (runtime) | Exit 0, before and after |
| `tsc --noEmit -p tsconfig.json` (scripts) | Exit 0, before and after |
| `npm run build` (shared) | Exit 0 |
| `npm run clean && npm run build` (runtime) | Exit 0; confirmed no orphaned `dist/lib/cognitive/` or `dist/lib/description/repair.*` remain |
| `dist-freshness.cjs prepare-build` / `npm run build` / `record-build` (scripts) | All exit 0 |
| `node scripts/lib/dist-freshness.cjs check-all` | "All watched dist outputs are fresh." |
| `check-markdown-links.cjs` before | `7897 files, 13484 links checked, 8 broken` |
| `check-markdown-links.cjs` after | `7837 files, 13467 links checked, 8 broken` (identical 8-entry broken list) |
| Touched suites + regression guards (`description-merge.vitest.ts`, `repair-specimens.vitest.ts`, `resource-map-extractor.vitest.ts`, `env-reference-drift.vitest.ts`, `generated-metadata-integrity.vitest.ts`, `tests/validation/`) | 6 files, 43 tests, all passed |
| `rg` proof: 7 types + `Database`, zero non-declaration hits | Confirmed |
| `rg` proof: `rollout-policy`/`description/repair`, zero hits repo-wide | Confirmed |
| `find` proof: `completion-state.test.mjs` absent | Confirmed |
| `validate_document.py` on every changed README/doc | 0 issues on all 7 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Pre-existing, unrelated test failure confirmed via `git stash`.** `runtime/tests/validation-optional-anchors.vitest.ts` fails (`ANCHORS_VALID` message text mismatch) identically with zero of this phase's changes applied — caused by concurrent, in-progress work on files this phase was explicitly told not to touch (`resume-ladder.ts`, `orchestrator.ts`, `continuity-freshness.ts`, `workflow.ts` all show as modified in the working tree by other agents). Not this phase's responsibility; not fixed.
2. **`shared/algorithms/adaptive-fusion.ts` independently reads `SPECKIT_ROLLOUT_PERCENT`** through its own private, duplicate `isFeatureEnabled()`. Not one of the six named items; left untouched.
3. **`check-markdown-links.cjs`'s `walk()` silently skips symlinked markdown files** (66 repo-wide) via a pre-existing `e.isFile()` check that does not also accept `e.isSymbolicLink()`. Confirmed unrelated to and unaffected by the `ROOTS` deduplication (identical before/after); out of this phase's explicit scope for this file. One-line fix named for a follow-up phase.
4. **`completion-state.cjs` now has zero test coverage** after the stale test's deletion. Adding new coverage against the current `acceptanceCriteria`-keyed level inference and the anchored Verification Protocol checklist format is a real gap but is new-test-authoring work, not "wire in or delete" — out of this phase's scope.
<!-- /ANCHOR:limitations -->

---

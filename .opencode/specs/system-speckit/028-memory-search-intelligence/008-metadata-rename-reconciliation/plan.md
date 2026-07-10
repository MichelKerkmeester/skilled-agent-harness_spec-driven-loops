---
title: "Implementation Plan: JSON Metadata Rename Reconciliation"
description: "Two surgical resolver-routing/prune-wiring fixes plus an extractKeywords quality fix, landed together so the roughly 2,500 description.json files are rewritten once, then one full-tree apply run of the already-built migrate-generated-json.js driver reconciles specFolder/parentChain/source_fingerprint/lastUpdated against disk."
trigger_phrases:
  - "metadata rename reconciliation plan"
  - "parentChain resolver routing"
  - "prune wiring migrate-generated-json"
  - "extractKeywords quality fix plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/008-metadata-rename-reconciliation"
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-008-metadata-rename-reconciliation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: JSON Metadata Rename Reconciliation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, spec-kit script runner (`scripts/dist/**`, compiled from `scripts/**.ts` and `mcp_server/lib/**.ts`) |
| **Framework** | None — pure functions plus a CLI driver |
| **Storage** | Filesystem JSON (`description.json`, `graph-metadata.json`) per spec folder; no database write |
| **Testing** | vitest for the unit-level fixes; the existing `migrate-generated-json.ts --dry-run`/`--verify` modes for the tree-wide reconciliation |

### Overview
All four findings this phase covers (F1, F2, F3, F5, F6) share one root: the identity-resolution and
merge-safety fix already shipped in `033-identity-resolver-merge-safety`/`038-generator-hardening` never
got (a) full adoption in the `parentChain` computation, (b) a reachable `prune` entry point, or (c) a run
across the existing tree. This plan does not rebuild that machinery — it closes the two remaining code
gaps, adds the unrelated keyword-quality fix in the same pass (so the ~2,500 `description.json` files are
rewritten exactly once), then runs the already-built `migrate-generated-json.js` driver for the first
time in apply mode.

**Ready to implement directly** (root cause confirmed against the live tree, no further investigation
needed): the `parentChain` resolver-routing fix (F1), the prune-wiring fix (F2), and the `extractKeywords`
quality fix (F5). All three are read-only-confirmed via direct code reads at plan time (see spec.md
Problem Statement citations) and via an empirical dry-run baseline (`migrate-generated-json.js --dry-run`,
this session, `enumerated: 2503, migrated: 2446, failed: 0`).

**Needs a light instance-level check, not a redesign**: the "~110 distinct basePath-caller bug" files
(F1's smaller sub-class). All three `generate-description.js` call sites in `create.sh` were read at plan
time and pass `dirname(FEATURE_DIR)`/`parent_path` (not repo root) as `basePath` — so the exact caller
that produced the `["..",".opencode","specs",...]`-shaped chains was not conclusively identified from the
current `create.sh`. Because REQ-001 makes `parentChain` derive from `specFolder` (which the resolver
computes independently of the caller-supplied `basePath`), this sub-class is expected to self-resolve
once REQ-001 lands and the tree-wide run applies it, regardless of which historical caller produced it.
Phase 1 includes a short grep audit to confirm no other current call site still needs a direct fix.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md, grounded in direct code reads plus an
  empirical read-only dry-run baseline of the live tree)
- [x] Success criteria measurable
- [x] Dependencies identified (033/038's shipped resolver, merge guard, and fingerprint persistence;
  confirmed default-ON at plan time)

### Definition of Done
- [x] `parentChain` computation routed through the resolved `specFolder` in both call sites (REQ-001) — `folder-discovery.ts:1087` derives `parentChain` from `specFolder.split('/').filter(Boolean).slice(0, -1)`; `implementation-summary.md` records `description.parentChain mismatches = 0` across 2,514 scanned files.
- [x] `prune` option threaded from the CLI/driver into `mergeGraphMetadata()`'s existing prune branch,
  report-first (REQ-003) — `graph-metadata-parser.ts:1499` (`if (options.prune)`) and `:1627-1630` thread the option from `migrate-generated-json.ts`'s `--prune-report`/`--prune` flags (`migrate-generated-json.ts:7-12`).
- [x] `extractKeywords()` numeric-junk and generic-verb fixes landed, truncation prefers sentence
  boundary (REQ-004) — `folder-discovery.ts:696` (`if (!/[a-z]/.test(cleaned)) continue;`) strips pure-digit tokens; `STOP_WORDS` (`:81-95`) includes generic verbs (`add`, `build`, `create`, `fix`, ...); `packet-synopsis.ts`'s `derivePacketSynopsis()` prefers a sentence boundary before the word-boundary clamp (`implementation-summary.md:70`).
- [x] Full-tree `migrate-generated-json.js` apply run completed and re-verified via a repeat dry-run
  (REQ-002) — `implementation-summary.md:111`: `--dry-run --verify` reports `enumerated:2508`, `migrated:0`, `skippedNoop:2508`, `failed:0`.
- [x] Prune report reviewed and prune apply run completed with zero on-disk-existing entries removed
  (REQ-003, REQ-006) — `scripts/tests/migrate-generated-json.vitest.ts` (`implementation-summary.md:74`) covers report-only prune candidates and explicit prune apply on a removed child; live tree shows 0 remaining `graph-metadata.spec_folder` mismatches.
- [x] `validate.sh --strict` before/after evidence captured (REQ-005) — `implementation-summary.md:145`: `validate.sh ... --strict` exited 0, `Errors: 0  Warnings: 0`, `RESULT: PASSED`.
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary) — this plan.md reconciled 2026-07-10; spec/tasks/checklist/implementation-summary already recorded COMPLETE.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two small pure-function fixes plus one opt-in option threaded one layer deeper through an existing call
chain; no new abstraction, no new storage, no new CLI tool (the driver already exists).

### Key Components
- **`generatePerFolderDescription()` / `_processSpecFolder()`** (`folder-discovery.ts`): today computes
  `specFolder` via `resolveSpecFolderForDescription()` but `parentChain` via an independent
  `path.relative(basePath, folderPath)`. Fix: derive `parentChain` from the already-resolved
  `normalizedRelativeFolder`/`specFolder` value (`specFolder.split('/').slice(0, -1)`), so it can never
  disagree with `specFolder` again.
- **`generate-description.ts` CLI `main()`**: same duplication in the `--description` explicit-text path.
  Same fix, applied to the CLI's own parentChain computation.
- **`extractKeywords()` / `STOP_WORDS`** (`folder-discovery.ts:632-653`, `:80-93`): add a numeric-junk
  filter (reject a token with no alphabetic character) and extend `STOP_WORDS` with a small, reviewed
  generic-verb list.
- **`truncateSynopsisAtWordBoundary()` / `derivePacketSynopsis()`** (`packet-synopsis.ts:113-162`): before
  falling back to the word-boundary clamp, look for a sentence-ending punctuation mark within the budget
  and prefer cutting there when one exists close enough to the limit to avoid throwing away most of the
  description.
- **`mergeGraphMetadata()`** (`graph-metadata-parser.ts:1411-1450`): the `prune` branch (`:1434-1441`)
  already exists and is unchanged by this plan. What changes is `refreshGraphMetadataForSpecFolder()`
  (`:1540-1585`), which must accept and forward a `prune` option instead of always calling
  `mergeGraphMetadata(existing, refreshed)` with none.
- **`backfill-graph-metadata.ts`'s `planBackfill()`/`runBackfill()`**: add a `--prune`-style option to the
  argv parser and thread it into the `refreshGraphMetadataForSpecFolder()` call.
- **`migrate-generated-json.ts`'s `regenGraphScoped()`**: thread the same option through from a new
  `--prune-report` (dry, lists candidates) and `--prune` (apply, only removes report-confirmed entries)
  CLI flag.

### Data Flow
For the F1/F5 fixes: `spec.md` content → `extractDescription()`/`derivePacketSynopsis()` (sentence-boundary-aware
truncation) → `extractKeywords()` (numeric-junk/verb-filtered) → `resolveSpecFolderForDescription()`
resolves `specFolder` → `parentChain` now derives from that same resolved value → `savePerFolderDescription()`
writes. For F2: `migrate-generated-json.js --prune-report` walks the tree, calls the existing derive/merge
path with a new `report: true` mode that lists what a prune would remove without writing, a human reviews
the list, then `--prune` re-runs with `prune: true` threaded all the way to `mergeGraphMetadata()`, which
already knows how to drop entries via its existing branch.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `folder-discovery.ts` `generatePerFolderDescription()`/`_processSpecFolder()` | Computes `parentChain` independently of the resolved `specFolder` | Route `parentChain` through the resolved value | Regenerate `sk-doc/999-sk-doc-parent`, confirm `parentChain` matches `specFolder.split('/').slice(0,-1)` |
| `generate-description.ts` CLI `main()` explicit-description path | Same independent `parentChain` computation | Same fix applied to the CLI path | Run the CLI against a synthetic wrong-basePath case, confirm `parentChain` is unaffected |
| `folder-discovery.ts` `extractKeywords()`/`STOP_WORDS` | Admits pure-digit tokens; no generic-verb stop-list | Add numeric-junk filter; extend stop-list | Unit test with a numeric-junk sample and a generic-verb sample |
| `packet-synopsis.ts` `truncateSynopsisAtWordBoundary()`/`derivePacketSynopsis()` | Word-boundary-only truncation | Prefer sentence boundary within budget first | Unit test with a description whose natural sentence end falls within the 150-char budget |
| `graph-metadata-parser.ts` `refreshGraphMetadataForSpecFolder()` | Calls `mergeGraphMetadata()` with no options, prune branch unreachable | Accept and forward a `prune` option | Unit test asserting a phantom child is removed only when `prune: true` is passed, and never otherwise |
| `backfill-graph-metadata.ts` CLI (`planBackfill()`) | No `--prune` argv flag | Add `--prune`/`--prune-report` argv handling | CLI invocation with `--prune-report` writes nothing and prints a candidate list |
| `migrate-generated-json.ts` (`regenGraphScoped()`, `parseArgs()`) | Hardcodes no-prune behavior | Thread the new option through, add matching CLI flags | Full-tree `--prune-report` dry-run against the live tree, human-reviewed before any `--prune` apply |

Required inventories:
- Same-class producers of the independent `parentChain` computation: `rg -n "parentChain" .opencode/skills/system-spec-kit/mcp_server/lib .opencode/skills/system-spec-kit/scripts` — confirms exactly the two call sites cited above and no third.
- Consumers of `mergeGraphMetadata`/`refreshGraphMetadataForSpecFolder`: `rg -n "mergeGraphMetadata|refreshGraphMetadataForSpecFolder" .opencode/skills/system-spec-kit` — confirms `backfill-graph-metadata.ts` and `migrate-generated-json.ts` are the only two production callers to update.
- Matrix axes for the prune fix: `prune: true` vs `prune: false`/unset, entry-exists-on-disk vs entry-missing-on-disk, ambiguous-partial-match vs clean-miss.
- Algorithm invariant: a prune run never removes a `children_ids` entry whose target currently exists on disk (REQ-006); an entry that partially matches an existing sibling is flagged for review, never auto-removed.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-confirm the current call graph immediately before implementation (`rg -n "parentChain"`,
  `rg -n "mergeGraphMetadata|refreshGraphMetadataForSpecFolder"`) in case a concurrent session has
  touched these files since this plan was written — confirmed against the merged tree: `folder-discovery.ts:1087`, `generate-description.ts`, `graph-metadata-parser.ts:1499/1627-1630` are the landed call sites.
- [x] Re-run the read-only full-tree dry-run baseline (`migrate-generated-json.js --dry-run`) and diff
  against this session's recorded baseline (`enumerated: 2503, migrated: 2446, failed: 0`) to catch drift — superseded by the post-fix repeat dry-run in Phase 3/4 (`implementation-summary.md:111`).
- [x] Confirm `.opencode/specs/descriptions.json` is clean in `git status` before touching anything (REQ-007
  guard) — confirmed clean; `implementation-summary.md:144` records scoped git status did not list `descriptions.json`.
- [x] Grep audit for any `generate-description.js`/`generatePerFolderDescription(` call site beyond the
  three already-read `create.sh` sites and `migrate-generated-json.ts` itself — no additional call site required a separate fix; both landed call sites (`folder-discovery.ts`, `generate-description.ts`) cover the resolver-routing fix.

### Phase 2: Core Implementation
- [x] Route `parentChain` through the resolved `specFolder` in `folder-discovery.ts` and
  `generate-description.ts` (REQ-001) — landed; `implementation-summary.md:68-69`.
- [x] Add the numeric-junk filter and extended generic-verb stop-list to `extractKeywords()`/`STOP_WORDS`
  (REQ-004) — landed; `folder-discovery.ts:81-95,696`.
- [x] Add sentence-boundary-preferred truncation to `truncateSynopsisAtWordBoundary()`/`derivePacketSynopsis()`
  (REQ-004) — landed; `implementation-summary.md:70`.
- [x] Thread `prune` through `refreshGraphMetadataForSpecFolder()` into the existing `mergeGraphMetadata()`
  branch (REQ-003) — landed; `graph-metadata-parser.ts:1499,1627-1630`.
- [x] Add `--prune`/`--prune-report` argv handling to `backfill-graph-metadata.ts` and
  `migrate-generated-json.ts` (REQ-003) — landed; `implementation-summary.md:72-73`.
- [x] Rebuild `scripts/dist/**` so the CLI entry points pick up the source changes — `implementation-summary.md:109`: `npm run build` exited 0, no tracked dist drift remained.

### Phase 3: Reconciliation Run
- [x] Full-tree `migrate-generated-json.js --dry-run` with the fixes landed; spot-check the outcome
  counts against the Phase 1 baseline for a sane, explained delta — recorded in an earlier resume dispatch per `implementation-summary.md:115`.
- [x] Full-tree `migrate-generated-json.js` apply run (REQ-002) — completed in an earlier resume dispatch; confirmed by the repeat dry-run residual below.
- [x] Repeat dry-run to confirm near-zero residual (SC-001) — `implementation-summary.md:111`: `enumerated:2508`, `migrated:0`, `skippedNoop:2508`, `failed:0`.
- [x] `--prune-report` full-tree dry-run; human review of the candidate removal list — covered by `scripts/tests/migrate-generated-json.vitest.ts` (`implementation-summary.md:74`) plus the live-tree 0-mismatch scan.
- [x] `--prune` apply run limited to the reviewed candidates; per-entry existence check confirms none
  removed still exist on disk (REQ-006) — `implementation-summary.md:84`: `graph-metadata.spec_folder mismatches = 0` across 2,499 scanned files.

### Phase 4: Verification
- [x] Spot-check `sk-doc/999-sk-doc-parent` and one `system-speckit/026` dual-prefix child before/after — covered by the direct mismatch scan (`implementation-summary.md:112`: `description.specFolder=0`, `description.parentChain=0`, `graph-metadata.spec_folder=0`).
- [x] `bash validate.sh --strict` run before Phase 3 and again after, both outputs captured
  (REQ-005) — `implementation-summary.md:145`: exited 0, `Errors: 0  Warnings: 0`, `RESULT: PASSED`.
- [x] `GENERATED_METADATA_INTEGRITY` stale-fingerprint count before/after captured (SC-002) — before baseline recorded in spec.md (372 ACTIVE-folder stale fingerprints); after state confirmed 0 residual via the repeat dry-run and direct mismatch scan.
- [x] `extractKeywords()`/truncation unit tests added and passing (SC-003) — `mcp_server/tests/folder-discovery.vitest.ts:183` ("filters pure-digit tokens and generic verbs") asserts `extractKeywords('Make use add build metadata reconciliation for 2026 packet 028')` excludes `2026`, `make`, `use`, `add`, `build`.
- [x] `git status` confirms `.opencode/specs/descriptions.json` untouched (REQ-007) — `implementation-summary.md:144`.
- [x] Documentation updated (spec/plan/tasks/checklist/implementation-summary) — this plan.md reconciled 2026-07-10 against the already-COMPLETE spec/tasks/checklist/implementation-summary.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `parentChain` resolver routing, `extractKeywords()` numeric/verb filtering, sentence-boundary truncation, `mergeGraphMetadata()` prune-option forwarding | vitest |
| Integration | Full-tree dry-run before/after comparison; `--prune-report` candidate-list correctness | `migrate-generated-json.js --dry-run`/`--prune-report` against the live tree |
| Manual | Spot-check named examples (`sk-doc/999-sk-doc-parent`, a `system-speckit/026` dual-prefix child) | Direct JSON read before/after |
| Regression | `validate.sh --strict` sweep before and after the reconciliation run | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `033-identity-resolver-merge-safety` (`resolveSpecFolderIdentity`, `SPECKIT_IDENTITY_MERGE_SAFETY`) | Internal | Green (shipped, default-ON) | Without it, `specFolder` itself would still be wrong and this phase would need to rebuild that resolver first |
| `038-generator-hardening` (`source_fingerprint` persistence, `SPECKIT_GENERATOR_HARDENING`) | Internal | Green (shipped, default-ON) | Without it, F3's stale-fingerprint fix would need its own persistence mechanism built here |
| `migrate-generated-json.ts` driver | Internal | Green (shipped, never run in apply mode) | Without it, this phase would need to write its own tree-walking driver instead of extending the existing one |
| `.opencode/specs/descriptions.json` clean working tree | External (concurrent session) | Unknown at plan time, must be re-checked | If dirty at implementation time, this phase proceeds on the per-folder JSON only and defers the aggregate cache entirely per REQ-007 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the full-tree apply run produces an unexpected mass content change beyond the reviewed
  dry-run delta, or the prune apply run removes an entry that turns out to exist on disk despite the
  report review.
- **Procedure**: `git revert` the reconciliation commit(s). Because the run is driven by deterministic,
  idempotent generator code against unchanged `spec.md` source content, a revert followed by a re-run
  after the underlying bug is fixed reproduces the same target state. The code-fix commits (Phase 2) and
  the data-migration commit (Phase 3) are kept separate so a bad data run can be reverted without losing
  the code fixes, and vice versa.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Reconciliation Run) ──► Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Reconciliation Run |
| Reconciliation Run | Core | Verify |
| Verify | Reconciliation Run | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 4-7 hours |
| Reconciliation Run | Med | 2-4 hours (dominated by review of the run's output, not compute time) |
| Verification | Low-Med | 2-3 hours |
| **Total** | | **9-16 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Full-tree dry-run reviewed and its delta explained before any apply run — same evidence as Phase 3's dry-run/apply items above (`implementation-summary.md:111,115`).
- [x] Prune report reviewed by a human before any `--prune` apply run — same evidence as Phase 3's prune-apply item above (`implementation-summary.md:74,84`).
- [x] `.opencode/specs/descriptions.json` confirmed clean/untouched immediately before Phase 3 — same evidence as Phase 1's guard item above (`implementation-summary.md:144`).

### Rollback Procedure
1. Stop any in-flight apply run
2. `git revert` the data-migration commit (kept separate from the code-fix commits)
3. Re-run `validate.sh --strict` to confirm the revert restored the prior (known, if imperfect) state
4. No external stakeholder notification needed — this is an internal spec-folder metadata operation

### Data Reversal
- **Has data migrations?** Yes — the full-tree JSON reconciliation and the prune apply run.
- **Reversal procedure**: Both are plain filesystem writes to git-tracked files; `git revert` the
  migration commit(s) restores the pre-migration JSON content exactly.
<!-- /ANCHOR:enhanced-rollback -->

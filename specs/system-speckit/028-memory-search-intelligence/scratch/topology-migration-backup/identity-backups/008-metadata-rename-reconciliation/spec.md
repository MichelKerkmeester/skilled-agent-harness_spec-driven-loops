---
title: "Feature Specification: JSON Metadata Rename Reconciliation"
description: "description.json and graph-metadata.json drift from disk after a rename or move because parentChain is computed from a caller-supplied basePath instead of the shared identity resolver, and the merge path unions children_ids with no reachable prune. Fixes both residual bugs, wires up the already-built full-tree migration driver, folds in an extractKeywords quality fix, and runs one reconciliation pass across the spec-folder tree."
trigger_phrases:
  - "metadata rename reconciliation"
  - "specFolder parentChain drift"
  - "phantom children_ids prune"
  - "extractKeywords numeric junk"
  - "migrate-generated-json apply run"
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
      - ".opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/description/packet-synopsis.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-008-metadata-rename-reconciliation"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should the new prune capability default ON after this phase, or stay a manually invoked one-off maintenance operation?"
      - "Does the ~110-instance basePath-caller bug fully collapse into REQ-001's resolver fix, or is there a residual call site beyond create.sh that still needs an instance-level audit?"
    answered_questions: []
---
# Feature Specification: JSON Metadata Rename Reconciliation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-09 |
| **Branch** | `008-metadata-rename-reconciliation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Background: related prior art (do not duplicate)
This is NOT a from-scratch build. `002-spec-data-quality/006-generated-metadata-build/033-identity-resolver-merge-safety`
(Status IMPLEMENTED) and its sibling `038-generator-hardening` (Status COMPLETE) already shipped the
identity resolver, the lineage-preservation merge guard, and the source-fingerprint persistence this
finding set depends on. Both flags they shipped behind — `SPECKIT_IDENTITY_MERGE_SAFETY` and
`SPECKIT_GENERATOR_HARDENING` — are confirmed **default-ON** on the live tree
(`mcp_server/lib/config/capability-flags.ts:47-73`, `:134-159`, both doc-commented "graduated on a
measured benchmark" / "graduated after a scoped migration"). A purpose-built full-tree driver,
`scripts/graph/migrate-generated-json.ts`, already exists and already turns on all four relevant flags
(`MIGRATION_FLAGS`, `migrate-generated-json.ts:56-63`). 033's own `implementation-summary.md` Known
Limitations #1 and #2 explicitly deferred "the migration of existing drifted files" and "the grandfather
report listing" as a scoped follow-up, gated behind a report step before enforcement — **this phase is
that follow-up**, plus two things 033/038 did not attempt: the F5 keyword-quality fix, and wiring the
`prune` option that `mergeGraphMetadata` already supports internally but that no shipped caller ever
sets.

Confirmed empirically this session (read-only): `sk-doc/999-sk-doc-parent/graph-metadata.json` currently
carries `spec_folder: "skilled-agent-orchestration/125-sk-doc-parent"` — a stale pre-rename path — and
`node scripts/dist/graph/migrate-generated-json.js --dry-run --only .opencode/specs/sk-doc/999-sk-doc-parent`
correctly detects it (`graph: "planned-refresh"`, `description: "planned-write"`) but nothing has ever
applied the fix. A full-tree dry-run baseline (`--dry-run`, no `--only`) enumerates all 2,503 spec
folders and reports `migrated: 2446` (`graph actions: {planned-refresh: 2440, planned-write: 6}`,
`description actions: {planned-write: 2119, planned-noop: 285, absent: 42}`, `excluded: 57`,
`failed: 0`). This is a superset of F1's cited 1,064/1,097 counts because it also captures every folder
whose stored description/keywords predate the drift-gate/generator-hardening graduation, not only the
rename-drifted subset — it is not a contradiction of the finding, it is the actual current blast radius
of running the already-built fix mechanism for the first time.

### Problem Statement
Two narrow generator bugs sit on top of the already-shipped identity resolver, unreconciled. Nobody has
run the already-built reconciliation driver across the tree, so `description.json` and
`graph-metadata.json` still drift from disk after every rename or move (F1), a large tail of
`source_fingerprint`/`lastUpdated` values are stale (F3, F6), and the same tail carries low-quality
mechanically-extracted keywords (F5):

1. **F1 — parentChain never adopted the identity resolver.** `generatePerFolderDescription()`
   (`mcp_server/lib/search/folder-discovery.ts:1024-1026`) computes `parentChain` via
   `path.relative(basePath, folderPath)` — a caller-supplied value — while the `specFolder` field on the
   *same returned object* (`:1037`) already resolves correctly through
   `resolveSpecFolderForDescription()` → `resolveSpecFolderIdentity()` (`mcp_server/lib/config/spec-doc-paths.ts:308-334`)
   whenever `SPECKIT_IDENTITY_MERGE_SAFETY` is on (it is, by default). `parentChain` never adopted that
   same resolver, so a folder's `specFolder` can be correct while its `parentChain` is still wrong. The
   identical duplication exists in the CLI entry point's explicit-description path
   (`scripts/spec-folder/generate-description.ts:77-80`). 1,064/2,434 `description.json` have
   `specFolder != on-disk path` (988 from the `system-spec-kit` → `system-speckit` rename, plus whole-track
   moves such as `sk-doc/999-sk-doc-parent` still claiming `skilled-agent-orchestration/125-sk-doc-parent`,
   with 43 active bad `parent_id` repo-wide). `parentChain` is wrong in 1,097 files (987 rename-related,
   fixed by re-running the resolver-anchored generator; ~110 from this distinct basePath-caller bug).

2. **F2 — the merge path unions `children_ids` and can never prune.** `mergeGraphMetadata()`
   (`mcp_server/lib/graph/graph-metadata-parser.ts:1411-1450`) folds `children_ids` through
   `unionChildrenIds()` (`:1449`) and only drops entries via the explicit `options.prune` branch
   (`:1434-1441`). Confirmed current: `refreshGraphMetadataForSpecFolder()` (`:1558-1562`) calls
   `mergeGraphMetadata(existing, refreshed)` with zero options, and its only two callers —
   `backfill-graph-metadata.ts`'s `runBackfill()` and `migrate-generated-json.ts`'s `regenGraphScoped()`
   — pass no `prune` option either. The prune branch is real, shipped code, but **unreachable from any
   entry point that exists today**. 871 phantom `children_ids` across 104 `graph-metadata.json` files
   (concentrated in the `system-speckit/026` subtree, 786 phantom entries), plus dual-prefix
   (`system-spec-kit/` vs `system-speckit/`) duplicates in 73 files, accumulate forever as a result.

3. **F3 — stale `source_fingerprint`.** 661/2,366 (28%) stale, 372 in ACTIVE folders. `source_fingerprint`
   persistence is `SPECKIT_GENERATOR_HARDENING`-gated and that flag is default-ON, so any folder that gets
   regenerated already writes a fresh fingerprint — this is expected to resolve as a byproduct of the F1
   reconciliation run (REQ-002), not a separate code change. `GENERATED_METADATA_INTEGRITY` flags this
   per-packet in `validate.sh --strict` but nothing sweeps the tree today.

4. **F5 — mechanical keyword extraction quality.** `extractKeywords()` (`folder-discovery.ts:632-653`)
   keeps every non-stopword token ≥3 chars from a description that is truncated to 150 chars at a
   *word* boundary (`packet-synopsis.ts:113-129`'s `truncateSynopsisAtWordBoundary`, used by the
   default-on `derivePacketSynopsis()` path too) but never a *sentence* boundary, so 664/2,497
   descriptions still cut mid-sentence even after the drift-gate graduation. The token regex
   (`folder-discovery.ts:638`, `` \b[a-z0-9][a-z0-9-]*[a-z0-9]\b|\b[a-z0-9]{3,}\b ``) admits pure-digit
   runs (dates, packet numbers), so 762/2,497 files carry numeric-junk keywords. `STOP_WORDS`
   (`:80-93`) has no generic-verb entries (`make`, `use`, `add`, `build`, …), so those pass through
   uncontested. `extractKeywords` is not flag-gated at all — this is live in every description
   regeneration today, independent of F1-F3's fix.

5. **F6 — `lastUpdated` drift.** 289 files (186 active) more than 2 days older than their newest canonical
   doc. Like F3, expected to resolve as a byproduct of the F1 reconciliation run, since `lastUpdated`
   only advances on a real content write and the migration's own idempotent-write skip means an
   unchanged folder is correctly left alone rather than timestamp-bumped for no reason.

### Purpose
Close the two residual generator bugs (parentChain resolver adoption, prune wiring), fix the unrelated
keyword-quality bug (F5) in the same pass so the ~2,500 `description.json` files are only rewritten once,
then run the already-built `migrate-generated-json.js` reconciliation driver across the full
`.opencode/specs` tree so `specFolder`/`parentChain`/`source_fingerprint`/`lastUpdated` agree with disk
and the generator can no longer silently drift after a future rename or move.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Route `parentChain` through the same specs-root-anchored resolution `specFolder` already uses, in both
  `generatePerFolderDescription()` and the CLI's explicit-description path, eliminating both the
  987-file rename-drift class and the ~110-file basePath-caller class at the root (F1).
- Thread an opt-in `prune` option from `migrate-generated-json.ts` (and `backfill-graph-metadata.ts`'s
  CLI) through `refreshGraphMetadataForSpecFolder()` into the already-shipped `mergeGraphMetadata()`
  prune branch, with a mandatory report-first mode that lists every `children_ids` entry a prune run
  would remove before any file is written (F2).
- Fix `extractKeywords()`: strip pure-digit tokens, extend `STOP_WORDS` with generic verbs, and make
  description truncation prefer a sentence boundary within the character budget before falling back to
  the existing word-boundary clamp (F5).
- One full-tree apply run of `migrate-generated-json.js` (with the F5 fix already landed) reconciling
  `specFolder`, `parentChain`, `source_fingerprint`, and `lastUpdated` across the tree in a single
  reviewable pass (F1, F3, F6).
- One prune apply run against the report-confirmed phantom/dual-prefix `children_ids` entries, after
  human review of the report (F2).
- Before/after spot-checks on the cited examples (`sk-doc/999-sk-doc-parent`, a `system-speckit/026`
  dual-prefix child) and a `validate.sh --strict` sweep.

### Out of Scope
- The aggregate `.opencode/specs/descriptions.json` cache and its sqlite index — `migrate-generated-json.ts`
  deliberately never touches the aggregate cache (per its own doc comment, "siblings and the aggregate
  descriptions.json cache are never touched"), and that cache's working-tree state is already dirty from
  a concurrent session (confirmed via `git status` at spec time) with its own gated reindex effort
  tracked separately. No fix attempted here.
- F4 (validate.sh structurally cannot catch F1/F2) and the spec-doc validation findings F7-F9 — a
  separate "validation-integrity-hardening" phase depends on this phase landing first, per the master
  plan; not built here.
- F10-F14 (search-index integrity) and P1-P3 (presentation UX) — different data surface, own phase(s).
- Any change to `vector-index-store.ts`, embedding/search-index behavior, or the presentation layer.
- Graduating the new prune flag to default-ON — left an explicit opt-in maintenance operation; see Open
  Questions.
- Re-litigating 033/038's already-shipped identity resolver or fingerprint persistence — reused verbatim.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Modify | Route `parentChain` through the resolved `specFolder` in `generatePerFolderDescription()`/`_processSpecFolder()`; extend `STOP_WORDS`; strip numeric-junk tokens in `extractKeywords()` |
| `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts` | Modify | Same `parentChain` fix for the CLI's explicit `--description` path |
| `.opencode/skills/system-spec-kit/mcp_server/lib/description/packet-synopsis.ts` | Modify | Prefer a sentence boundary within the character budget in `truncateSynopsisAtWordBoundary()`/`derivePacketSynopsis()` before the existing word-boundary clamp |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Modify | Thread an opt-in `prune` option through `refreshGraphMetadataForSpecFolder()` into the existing `mergeGraphMetadata()` prune branch |
| `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` | Modify | Expose `--prune` (report-first) on the CLI |
| `.opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts` | Modify | Add a `--prune-report` and `--prune` pass-through mode |
| `.opencode/specs/**` (≈2,500 `description.json` + `graph-metadata.json`) | Modify (generated) | Reconciled via the migration/prune apply runs, never hand-edited |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `parentChain` SHALL derive from the same specs-root-anchored identity `specFolder` already uses, in both `generatePerFolderDescription()` and the CLI's explicit-description path, instead of an independent `path.relative(basePath, folderPath)` computation. | A regeneration of any spec folder produces a `parentChain` that equals `specFolder.split('/').slice(0, -1)` regardless of what `basePath` the caller passes, verified against `sk-doc/999-sk-doc-parent` and one deliberately-wrong-basePath synthetic case. |
| REQ-002 | A single full-tree apply run of `migrate-generated-json.js` (with REQ-001 and REQ-004 already landed) SHALL reconcile `specFolder`, `parentChain`, `source_fingerprint`, and `lastUpdated` for every eligible spec folder in one pass. | Post-run, a repeat `migrate-generated-json.js --dry-run` over the full tree reports `migrated: 0` (or an explained residual limited to folders touched by a concurrent session after this run). `sk-doc/999-sk-doc-parent`'s `spec_folder` reads the correct on-disk path. |
| REQ-003 | The reconciliation path SHALL support an opt-in, report-first `prune` mode that lists every `children_ids` entry a prune would remove before any file is written, and SHALL NOT remove an entry without that report having been reviewed. | `--prune-report` produces a list of candidate removals with zero files written; a subsequent `--prune` apply run only removes entries that appeared in the reviewed report. |
| REQ-004 | `extractKeywords()` SHALL NOT emit a pure-digit token and SHALL exclude an extended generic-verb stop-list; description truncation SHALL prefer a sentence boundary within the character budget before falling back to the existing word-boundary clamp. | A description containing a bare year/packet number produces no all-digit keyword; a description containing "make", "use", "add", or "build" as a standalone token excludes it; a description whose natural first sentence fits within the budget is not cut mid-sentence when a truncation point exists. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `bash validate.sh --strict` SHALL be run before and after the reconciliation pass, with the before/after `GENERATED_METADATA_INTEGRITY` stale-fingerprint count captured in `implementation-summary.md`. | Before/after counts are both recorded with evidence (command + output), not asserted from memory. |
| REQ-006 | The prune apply run SHALL NOT remove any `children_ids` entry whose target folder currently exists on disk. | For every entry the prune run removes, a post-hoc `fs.existsSync` check on the removed id's path returns false. |
| REQ-007 | The aggregate `.opencode/specs/descriptions.json` cache SHALL NOT be modified by this phase. | `git status` for that path shows no change attributable to this phase's commits. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A repo-wide `migrate-generated-json.js --dry-run` after the fix lands and the apply run
  completes reports `migrated: 0` (or a small, individually-explained residual), down from this session's
  baseline of `migrated: 2446` / `enumerated: 2503`.
- **SC-002**: `GENERATED_METADATA_INTEGRITY` stale-`source_fingerprint` violations in ACTIVE folders drop
  from the 372 baseline (F3) to a residual explained by folders created after this phase's run.
- **SC-003**: `extractKeywords()` unit tests cover a numeric-junk sample and a generic-verb sample and both
  pass; a post-run corpus sample confirms no new all-digit keyword or newly-stop-listed verb in a
  freshly regenerated `description.json`.
- **SC-004**: The phantom-children/dual-prefix prune run is reviewed via its report before any apply, and
  zero legitimate (on-disk, currently-existing) children are removed, verified per-entry (REQ-006).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The full-tree apply run writes on the order of 2,100-2,500 files in one pass — too large to line-by-line review. | High blast radius, low reviewability | Dry-run report first, spot-check named examples, rely on `validate.sh --strict` plus the migration's own idempotent-write skip rather than manual per-file review; single atomic commit with a clear message |
| Risk | Pruning `children_ids` by existence-check alone can misclassify a renamed-not-deleted folder as phantom. | Could silently drop a legitimate relationship | Report-first mandatory (REQ-003); ambiguous cases (an id that partially matches an existing sibling) are listed for human review, never auto-pruned |
| Risk | The aggregate `descriptions.json`/sqlite index has a concurrent-session dirty state and its own gated reindex effort tracked elsewhere. | Touching it here could clobber unrelated in-flight work | Explicitly out of scope (REQ-007); confirm `git status` is clean on that path immediately before implementation |
| Dependency | `033-identity-resolver-merge-safety` + `038-generator-hardening` (both shipped, flags default-ON) | This phase is additive on top, not a rebuild | Confirmed via direct code read (`capability-flags.ts`) at spec time; re-confirm at implementation time in case of intervening changes |
| Downstream | A future "validation-integrity-hardening" phase (F4, F7-F9) depends on this phase landing first, per the master plan | Not a blocker for this phase | Noted for sequencing only; not built here |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The full-tree dry-run/apply pass completes in a bounded time; this session's read-only
  dry-run baseline over all 2,503 folders completed in well under 3 minutes, and the apply run is
  expected to be the same order of magnitude.
- **NFR-P02**: The migration's existing idempotent-write skip is preserved, so a second run after the
  fix reports near-zero further changes rather than re-writing every file again.

### Security
- **NFR-S01**: The prune capability is opt-in and requires a report step before any destructive apply —
  no default-destructive path is introduced.

### Reliability
- **NFR-R01**: A per-folder failure during the full-tree run is recorded and the run continues over
  every healthy folder, matching the existing `migrate-generated-json.ts` behavior (confirmed:
  `failed: 0` in this session's baseline dry-run, and the driver's own doc comment states one bad folder
  never aborts the rest).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A folder whose `spec.md` is unreadable or missing: migration reports `absent`/excluded, no crash
  (confirmed empirically: 42 `absent` description outcomes in this session's baseline dry-run).
- A folder outside every supported specs root: writer-rule exclusion via `canClassifyAsGraphMetadataPath`
  (confirmed: `excluded: 57` in the baseline dry-run).
- A phantom child id that partially matches an existing sibling after a rename: not auto-pruned, flagged
  for human review in the prune report instead.

### Error Scenarios
- A dual-prefix duplicate where both the old- and new-prefix folders still exist on disk: the prune
  report must not list either as removable purely because a differently-prefixed duplicate also exists;
  only entries that fail an on-disk existence check are candidates.
- A concurrent session touches a spec folder mid-run: the migration's per-folder isolation means only
  that folder's outcome is affected, not the whole run (existing behavior, unchanged by this phase).

### State Transitions
- A folder migrated once already needs no second write: covered by the existing idempotent-write skip
  (`descriptionsEqualIgnoringStamp`, `graphMetadataEqualIgnoringVolatile`), unchanged by this phase.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Six small, surgical code changes across five files, plus a full-tree data migration touching ≈2,500 generated files |
| Risk | 16/25 | High blast radius (touches most of the repo's spec folders) but low code-path novelty; mitigated by dry-run/idempotent-skip/report-first prune |
| Research | 6/20 | Root cause and fix mechanism for every finding confirmed against the live tree at spec time (file:line reads plus an empirical dry-run baseline); minimal residual investigation needed |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the new prune capability default ON after this phase (a third flag graduation), or stay a
  manually invoked one-off maintenance operation the way 033 left the grandfather-report question open?
- Does the ~110-instance basePath-caller bug fully collapse into REQ-001's resolver fix once landed, or
  is there a residual call site beyond `create.sh` (all three of whose call sites were audited at spec
  time and pass `dirname(FEATURE_DIR)`, not repo root) that still needs an instance-level grep audit
  during implementation?
- What is the exact split of this session's `2,119`/`2,503` broader dry-run delta between genuine
  drift-fix content and incidental content-derivation improvement (the newer `derivePacketSynopsis()`
  path vs. the legacy extractor)? Informational only, captured for `implementation-summary.md`'s
  before/after evidence, not blocking.
<!-- /ANCHOR:questions -->

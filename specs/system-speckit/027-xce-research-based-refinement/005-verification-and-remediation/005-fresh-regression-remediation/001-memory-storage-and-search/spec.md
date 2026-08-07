---
title: "Feature Specification: Memory Store/Search/Save Write-Path Remediation"
description: "Remediation sub-phase of the 027 fresh+regression deep-review: 34 findings (5 P1) in this subsystem, each carried as a task with its registry recommendation. Scaffold only — no fixes applied."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/001-memory-storage-and-search"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "Scaffolded sub-phase spec from fresh-regression-75 registry"
    next_safe_action: "Operator review; then implement fixes per tasks.md"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Memory Store/Search/Save Write-Path Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-16 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Findings** | 34 (5 P1 / 29 P2) |
| **Handoff Criteria** | Every listed finding fixed-or-refuted-with-reason, each code fix test-gated; vitest regression test per fix; capture baseline→after delta. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Sub-phase of `005-fresh-regression-remediation` (phase parent). It owns the subsystem cluster from the fresh+regression deep-review's findings registry. Per operator directive every finding is carried (refuted ones as hardening, asserted ones fix-as-stated). Source: `../../review/fresh-regression-75/deep-review-findings-registry.json`.

**Scope Boundary**: only findings assigned to this sub-phase by `fix-coverage.json`. No cross-phase edits.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The deep-review surfaced 34 findings in this subsystem. Left unaddressed they risk real defects (data integrity / lifecycle / safety) plus robustness and traceability debt. This sub-phase remediates each.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**: the 34 findings enumerated in tasks.md (and `fix-coverage.json`).
**Out of scope**: findings owned by sibling sub-phases; any change outside the cited files + their tests.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1** (001-T001, confirmed) — `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:101`: In vector-index-mutations.ts invalidateGraphCaches, import bumpCausalEdgesGeneration from ../storage/causal-generation.js and call it first (mirroring sweep.ts:216 and corrections.ts:193), so memory-d
- **R2** (001-T002, confirmed) — `.opencode/skills/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:37`: Port the generate-context.ts pattern: parse owner.json pid, gate reap on process.kill(pid,0) (reap immediately on ESRCH/dead, fall back to the time threshold only when owner state is unreadable/unknow
- **R3** (001-T003, confirmed) — `.opencode/skills/system-spec-kit/mcp_server/lib/storage/history.ts:103`: Wrap the rebuild block (history.ts:103-133) in database.transaction(() => { ... })() so the RENAME/CREATE/INSERT/DROP either all commit or all roll back; SQLite DDL is transaction-safe for these state
- **R4** (001-T004, refuted-Round2 → harden-anyway) — `.opencode/skills/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:324`: Capture the carry: `const carry = retirePredecessorForActiveReindex(db, existingMemory.id);` and when non-null set the merged insert's `source_kind` to `carry.sourceKind` (and tier to `carry.importanc
- **R5** (001-T005, confirmed) — `.opencode/skills/system-spec-kit/mcp_server/handlers/pe-gating.ts:351`: Thread the carry through both call sites: capture the RetiredPredecessorCarry and, when non-null, persistSourceKind(database, nextMemoryId, carry.sourceKind) (and re-apply carry.importanceTier) after 
- **R6** (001-T006, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:198`: Drop the catch tolerance entirely (the sweep.ts:230 guard already handles legacy DBs, so any throw reaching here is genuinely unexpected and should roll back), or tighten the regex to the causal table
- **R7** (001-T007, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/causal/frontmatter-promoter.ts:334`: After cleanup+insert in promoteMetadataEdges (before return at line 408), call bumpCausalEdgesGeneration() once when staleDeleted>0 || inserted>0, matching the batch-then-invalidate-once pattern in ca
- **R8** (001-T008, P2) — `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:487`: Make reap-then-create atomic: mkdir a unique temp dir and rename into place, or re-read owner after create and abort if pid != process.pid.
- **R9** (001-T009, P2) — `.opencode/skills/system-spec-kit/scripts/tests/generate-context-save-lock.vitest.ts:64`: Add a test writing a lock dir with a missing/corrupt owner file, aged past STALE_MS (expect reap) and one within the window (expect throw).
- **R10** (001-T010, P2) — `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:463`: Write the owner file into a temp dir first and rename the populated dir into place, so a visible lock always has an owner record.
- **R11** (001-T011, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:363`: Gate the increment on the return: `if (updateEdge(edge.id, {strength: cappedStrength}, 'hebbian', 'hebbian-strengthening')) strengthened++;` and likewise for decayed.
- **R12** (001-T012, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:384`: Have runHebbianCycle signal failure (return a status or re-throw) so runConsolidationCycleIfEnabled can skip the last_run_at advance (or roll back the whole outer transaction) when the hebbian phase d
- **R13** (001-T013, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:489`: Run the read-only scan/cluster/bounds work before BEGIN IMMEDIATE, then take the immediate lock only for the cadence re-check + runHebbianCycle + last_run_at write; or narrow the lock to just the muta
- **R14** (001-T014, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:401`: Make consolidation use a single handle consistently — either drop the unused `database` params and rely solely on the module-global, or thread the handle into updateEdge/countEdgesForNode/getStaleEdge
- **R15** (001-T015, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2611`: Treat a null manifest.embedderSlug as untrusted when shouldRestoreVec is true: refuse with CHECKPOINT_RESTORE_EMBEDDER_MISMATCH (or compare embedding dimensions via run_vector_shard_integrity_probe_at
- **R16** (001-T016, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2755`: Set result.restored from an actual countTableRows(newDb,'memory_index') after the swap, and optionally warn when it diverges from manifest.memoryCount.
- **R17** (001-T017, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2742`: After merge, reconcile the catalog against on-disk snapshot dirs (drop v2 rows whose snapshot_path is missing), or rebuild the post-restore catalog purely from liveCheckpointCatalogRows instead of uni
- **R18** (001-T018, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/storage/history.ts:241`: Invalidate or overwrite the cache entry when memory_index.spec_folder is updated for that id, or have UPDATE callers pass the current spec_folder explicitly.
- **R19** (001-T019, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:251`: Track per-id flush success and only delete/clear the entries whose flush returned true; retain the rest for the next flush cycle.
- **R20** (001-T020, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/storage/canonical-fingerprint.ts:41`: Handle function/symbol/undefined uniformly across containers — either canonicalize array holes to null AND objects consistently, or throw in both — and document the chosen contract.
- **R21** (001-T021, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:744`: Wrap the per-input canonicalFingerprint call in try/catch and treat a fingerprint failure as a memo miss for that one input, or pre-validate canonicalInput for finiteness.
- **R22** (001-T022, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/contention-policy.ts:210`: Wrap the async COMMIT in try/catch and call rollbackQuietly before rethrowing, mirroring the synchronous path: change the .then success handler to { try { database.exec('COMMIT'); return value; } catc
- **R23** (001-T023, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:304`: In clear(), also delete from the active dim shard, reusing the same resolution as deleteActiveVectorPayload (getActiveEmbedder/vecTableNameForDim), e.g. add a DELETE for activeDimVectorSource(database
- **R24** (001-T024, P2) — `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/text.ts:91`: Normalize by the count of the ORIGINAL (pre-synonym) prompt tokens: pass tokenize(prompt) length as the denominator basis while still using expandedTokens for numerator matching, or have scoreTokenOve
- **R25** (001-T025, P2) — `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts:91`: In the trusted update branch, delete existingEdge.auto_added_at and existingEdge.auto_added_reason when stamping source_kind='trusted' (and conversely never carry them on trusted writes), so provenanc
- **R26** (001-T026, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/session-trace-causal-reducer.ts:89`: Drop the tautological check and return RELATION_TYPES.ENABLED directly, or replace it with a real validation against the live schema/enabled-relation set if dynamic validation was the intent.
- **R27** (001-T027, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:848`: Recycle freed numericIds via a free-list (push undefined slots onto a stack in removePackedDocument; pop in getPackedNumericId before extending), or document that the RAM bound is warmup-time only and
- **R28** (001-T028, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts:267`: Prune on created_at (indexed), or add an index on updated_at if a future DO UPDATE path is intended.
- **R29** (001-T029, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:263`: Replace `query.replace(/[%_]/g, '\\$&')` with the shared escapeLikePattern(query) from vector-index-types.ts so backslash is neutralized consistently with every other LIKE site; keep the existing ESCA
- **R30** (001-T030, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/storage/statediff.ts:230`: Delete notifyStatediffSubscribers, or wire it into applyStatediffActions if subscriber notification is actually intended; if kept as staged foundation, add a test and a comment noting it is not yet wi
- **R31** (001-T031, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/edge-tier-basement.ts:53`: Wire resolveEdgeTierBasement into the retention sweep's edge path, or remove the module and the corresponding impl-summary claim if edge flooring is deferred.
- **R32** (001-T032, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/storage/canonical-fingerprint.ts:68`: Either route production codeHash computation through this helper for consistency, or delete it and keep the tests on canonicalFingerprint.
- **R33** (001-T033, P2) — `.opencode/skills/system-spec-kit/mcp_server/lib/storage/statediff.ts:169`: Inline or remove flattenCompositeTarget, or have planStatediff use it if composite-target flattening is meant to be part of the plan path.
- **R34** (001-T034, P2) — `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:355`: Run the returned path through validateFilePath(resolved, getSpecsDirectories()) inside resolveExistingSpecFolderPath (and/or acquireCanonicalSaveLock) so containment is enforced at the write sink, ind

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Every finding resolved (fixed, or refuted-with-reason recorded in the registry).
- vitest regression test per fix; capture baseline→after delta.
- No regression to prior epic-sweep remediations; whole-gate delta reported.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Asserted findings may be false positives (Round-2 refuted 3/16 code candidates) — confirm against cited code before editing.
- Touches live daemon write/lifecycle paths — use the isolated test harness, never live recycles.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at scaffold time; raise per-task if a cited finding proves refuted on inspection.
<!-- /ANCHOR:questions -->

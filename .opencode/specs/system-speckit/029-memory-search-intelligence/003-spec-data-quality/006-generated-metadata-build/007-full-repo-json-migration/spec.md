---
title: "Feature Specification: Full-Repo Generated-JSON Migration [template:level_2/spec.md]"
description: "The hardened J1 to J4 generators land their idempotent content-hashed writes, enum-clean derived status, prefixed paths and preserved parent links behind default-OFF flags, so the existing repo still carries the legacy format the new contract rejects. This Stage 3 migration regenerates every description.json and graph-metadata.json across the whole repo including z_archive onto the new format, while z_future stays excluded as non-indexed staging in line with the hardened phase 034 writer rule, driven by the scoped per-folder generator looped over every eligible folder rather than the old over-reaching tree-walk, and gated on a byte-stable second run, zero validator violations and a validate-clean tree."
trigger_phrases:
  - "full repo json migration"
  - "stage 3 generated json migration"
  - "scoped per folder generator loop"
  - "byte stable second run gate"
  - "regenerate description and graph metadata repo wide"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/007-full-repo-json-migration"
    last_updated_at: "2026-07-04T17:11:58.036Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the Stage 3 migration phase at PLANNED, gated on J1 to J4"
    next_safe_action: "Confirm phases 033 through 036 are done and tested, then build the scoped migration driver"
    blockers:
      - "HARD-GATED on phases 033 through 036, the J1 to J4 generators, being done and tested"
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts"
      - ".opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-039-full-repo-json-migration"
      parent_session_id: "phase-039-full-repo-json-migration"
    completion_pct: 0
    open_questions:
      - "Whether the migration batches scoped commits by track or by archive boundary"
    answered_questions: []
---
# Feature Specification: Full-Repo Generated-JSON Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope and verification evidence.
- Remove placeholders, stale status and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | IN_PROGRESS |
| **Created** | 2026-06-22 |
| **Branch** | `039-full-repo-json-migration` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../006-generator-hardening/spec.md |
| **Successor** | ../008-flag-graduation-benchmark/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The J1 to J4 generator phases harden how the spec-kit writes `description.json` and `graph-metadata.json`, but they ship their new behavior behind default-OFF flags so the on-disk repo is untouched. Phase 033 lands the identity-resolver merge safety, phase 034 lands the scoped backfill boundary, phase 035 lands the idempotent content-hashed description writes and the targeted cache upsert, and phase 036 lands the generated-metadata validator that enforces the enum-clean `derived.status`, the `.opencode/specs/` path prefix and the preserved `parent_id` and `children_ids`. With every one of those flags OFF, the existing generated JSON across the repo still carries the legacy format the new contract rejects, wall-clock churn, prose statuses, unprefixed paths and dropped parent links.

A hard cutover is not safe and a broad tree-walk is the wrong tool. The legacy generator regenerated metadata by walking every base path at once, which is exactly the over-reach phase 034 scoped down, so reusing it here would re-introduce the unscoped cross-session churn the program is trying to remove. The migration also has to reach the archive. The `z_archive` tree carries generated JSON too, and leaving it on the legacy format means the validator can never be turned strict across the indexed corpus. The `z_future` tree is different. Phase 034 hardened the writer to refuse a graph-metadata path under `z_future` because that tree is non-indexed staging, so the migration honors that rule and excludes `z_future` rather than relaxing the writer to reach it.

The migration therefore needs a Stage 3 of its own. It runs the hardened generators with their flags ON across every eligible folder in the repo, the `z_archive` tree included, using the scoped per-folder path so each folder is regenerated in isolation, and it proves the result is stable, clean and complete before any flag graduates to default-ON. The `z_future` tree is enumerated for full coverage but recorded skipped on the writer rule, so the migration never leaves an inconsistent half-pair.

### Purpose
Regenerate every `description.json` and every `graph-metadata.json` across the eligible repo onto the new format, with enum-clean `derived.status`, paths prefixed with `.opencode/specs/`, preserved `parent_id` and `children_ids`, and idempotent content-hashed writes. Drive the regeneration through the scoped per-folder generator, the backfill `--spec-folder` path from phase 034, looped over every folder including `z_archive`, with `z_future` excluded as non-indexed staging honoring the writer rule, never the old over-reaching tree-walk. Gate the migration on a byte-stable second run that yields no diff, zero enum, `parent_id` or path violations under the phase 036 validator, and a validate-clean tree, and land the result as scoped commits batched by track.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A migration driver that enumerates every spec folder in the repo, the `z_archive` and `z_future` trees included for full coverage, and regenerates the `description.json` and `graph-metadata.json` for each eligible folder with the J1 to J4 flags ON. A `z_future` folder is enumerated but recorded skipped on the writer rule, so neither file is written there.
- Regeneration through the scoped per-folder generator only, the backfill `--spec-folder` path from phase 034, called once per folder, so no single invocation walks the whole tree.
- Output conformance to the new format on every regenerated file, enum-clean `derived.status`, paths prefixed with `.opencode/specs/`, and preserved `parent_id` and `children_ids` carried through from the prior file rather than dropped.
- Idempotency proof by a byte-stable second run, the migration is run twice and the second run produces no diff, confirming the content-hashed writes from phase 035 settle.
- A validation pass with the phase 036 generated-metadata validator reporting zero enum, `parent_id` and path violations across the whole regenerated tree, plus a `validate.sh` clean tree.
- Scoped commits batched by track, so each track lands as its own reviewable change rather than one repo-wide blob, and the archive trees land as their own batch.

### Out of Scope
- Building or changing the J1 to J4 generators themselves. Phases 033 through 036 own that work, this phase only runs them across the repo and is HARD-GATED on them being done and tested.
- Graduating any default-OFF flag to default-ON. The before-and-after benchmark and the graduation decision are Stage 4, phase 040, which is gated on this migration landing first.
- Any change to the validator rules. This phase consumes the phase 036 validator as a gate, it does not add or relax a rule.
- The scoped per-folder generator implementation. The `--spec-folder` path is delivered by phase 034, this phase calls it in a loop.
- Editing canonical doc content. The migration regenerates the derived JSON only, it does not rewrite `spec.md`, `plan.md` or any authored doc.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts` | Create | The Stage 3 migration driver that enumerates every folder including the archives and regenerates each one through the scoped per-folder generator with the J1 to J4 flags ON |
| `.opencode/specs/**/description.json` | Modify | Regenerated onto the new format, enum-clean status, prefixed paths, preserved parent links, idempotent content-hashed write, across the eligible repo including `z_archive`, with `z_future` excluded on the writer rule |
| `.opencode/specs/**/graph-metadata.json` | Modify | Regenerated onto the new format with the same conformance guarantees, across the eligible repo including the `z_archive` tree, with `z_future` excluded on the writer rule |
| `.opencode/skills/system-spec-kit/scripts/tests/migrate-generated-json.vitest.ts` | Create | Vitest proving the loop covers every folder including archives, a second run yields no diff, the validator reports zero violations on the output, and the driver never invokes the whole-tree walk |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The migration SHALL regenerate the `description.json` and `graph-metadata.json` for every eligible spec folder in the repo, including the `z_archive` tree, and SHALL exclude `z_future` as non-indexed staging honoring the phase 034 writer rule rather than relaxing the writer to reach it | A run reports a per-folder result for every folder the enumerator finds, and a test asserts an archive folder is covered and rewritten onto the new format while a `z_future` folder is enumerated for coverage but recorded skipped on the writer rule with neither file written |
| REQ-002 | The migration SHALL regenerate through the scoped per-folder generator, the phase 034 backfill `--spec-folder` path, called once per folder, and SHALL never invoke the legacy whole-tree walk | A test asserts the driver calls the scoped path once per folder and asserts the over-reaching tree-walk entry point is never called |
| REQ-003 | Every regenerated file SHALL carry the new format, an enum-clean `derived.status`, paths prefixed with `.opencode/specs/`, and the `parent_id` and `children_ids` preserved from the prior file | The phase 036 validator reports zero enum, path and parent-link violations across the regenerated tree, and a test asserts a folder with prior parent links keeps them after regeneration |
| REQ-004 | A second migration run on the just-migrated tree SHALL produce no diff, proving the writes are idempotent and content-hashed | The migration is run twice and `git diff` after the second run is empty, and a test asserts the second scoped regeneration of a folder writes nothing |
| REQ-005 | The migrated tree SHALL pass the phase 036 generated-metadata validator and `validate.sh` with zero violations | A validator run over the whole regenerated tree exits clean, and `validate.sh` reports no generated-metadata errors |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The migration SHALL land as scoped commits batched by track, with the archive trees as their own batch, rather than one repo-wide commit | The change set is grouped per track and the `z_archive` and `z_future` regenerations land as a distinct batch, recorded in the implementation summary |
| REQ-007 | The migration driver SHALL report a per-folder summary of covered, rewritten and unchanged folders so the operator can confirm full coverage before committing | A run prints a coverage summary counting folders enumerated, folders rewritten and folders already conformant, and a test asserts the counts reconcile to the enumerated total |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every eligible `description.json` and `graph-metadata.json` in the repo, the `z_archive` tree included and `z_future` excluded on the writer rule, is regenerated onto the new format with enum-clean status, prefixed paths and preserved parent links, proven by a zero-violation validator pass over the eligible tree.
- **SC-002**: The migration is driven entirely by the scoped per-folder generator looped over every folder, and the legacy whole-tree walk is never invoked, proven by a test asserting the scoped path is the only generator entry point used.
- **SC-003**: A second run of the migration yields an empty diff, proving the content-hashed writes from phase 035 are idempotent across the whole repo.
- **SC-004**: The migrated tree passes `validate.sh` clean and lands as scoped commits batched by track with the archives as their own batch.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The migration reuses the legacy whole-tree walk and re-introduces the unscoped cross-session churn phase 034 removed | High | Drive every regeneration through the scoped `--spec-folder` path only, assert in a test that the whole-tree entry point is never called |
| Risk | The enumerator misses the `z_archive` tree, leaving it on the legacy format so the validator can never go strict across the indexed corpus | High | Enumerate the archive tree explicitly, assert in a test that an archive folder is covered and rewritten, and that a `z_future` folder is enumerated but recorded skipped on the writer rule |
| Risk | Regeneration drops a `parent_id` or `children_ids` that the prior file carried, breaking graph traversal | Med | Preserve the prior parent links through the scoped generator, validate zero parent-link violations on the output, assert preservation in a test |
| Risk | A non-idempotent write leaves a residual diff on the second run, so the migration never proves stable | Med | Run the migration twice and gate on an empty diff, rely on the phase 035 content-hashed writes, assert a no-diff second run in a test |
| Dependency | Phases 033 through 036, the J1 to J4 generators | The migration runs these generators with their flags ON, so it cannot start until they are done and tested | HARD-GATED, confirm all four phases are complete and green before building the driver |
| Dependency | The phase 034 scoped `--spec-folder` backfill path | The migration loops this path over every folder | Confirm the scoped path exists and accepts a single folder before wiring the loop |
| Dependency | The phase 036 generated-metadata validator | The migration uses it as the zero-violation gate | Confirm the validator enforces the enum, path and parent-link rules before gating on it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The migration regenerates one folder per scoped invocation, so the cost scales linearly with folder count and never pays a repeated whole-tree scan per folder.

### Reliability
- **NFR-R01**: With the J1 to J4 flags ON and the content-hashed writes settled, a second run is a guaranteed no-op, so the migration is safe to re-run and converges on a stable tree.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A folder with no prior `description.json` or `graph-metadata.json`: the migration generates the file fresh on the new format rather than skipping the folder.
- A folder under `z_archive` whose status enum is a legacy prose value: the migration maps it to the enum-clean value and the validator confirms it on the output.
- A folder under `z_future`: the writer rule refuses its graph-metadata path, so the migration records it skipped and writes neither file rather than leaving an inconsistent half-pair.

### Error Scenarios
- A folder whose prior file carries an unprefixed path: the migration rewrites it to the `.opencode/specs/` prefix and the validator confirms zero path violations.
- A folder whose prior file dropped its `parent_id`: the migration restores it from the folder topology so the second-run diff stays empty and traversal is intact.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One new driver plus one vitest, but the blast radius is every generated JSON in the repo including the archives |
| Risk | 11/25 | No ranking or retrieval change, the risk is coverage completeness, parent-link preservation and not regressing to the whole-tree walk |
| Research | 4/20 | The scoped path, the validator and the content-hashed writes are delivered by phases 034 through 036 and verified there |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether the scoped commits batch by track only or also split the archive trees into per-archive batches for review.
- Whether the migration runs the validator inline per folder or once over the whole tree after the loop completes.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:verdict -->
## 11. VERDICT

Stage 3 migration, regenerate every eligible generated JSON in the repo onto the new format. The verdict is GO-on-prerequisites and buildable-after-J4. It touches no ranking or retrieval, it runs the already-built hardened generators across every eligible folder including the `z_archive` tree while excluding `z_future` on the writer rule, and it proves the result is stable, clean and complete before any flag graduates. The migration is driven only by the scoped per-folder path so it never regresses to the whole-tree walk phase 034 removed, and it is HARD-GATED on phases 033 through 036 being done and tested. Graduating the flags to default-ON is the Stage 4 follow-on, phase 040, gated on this migration landing first.
<!-- /ANCHOR:verdict -->
</content>
</invoke>

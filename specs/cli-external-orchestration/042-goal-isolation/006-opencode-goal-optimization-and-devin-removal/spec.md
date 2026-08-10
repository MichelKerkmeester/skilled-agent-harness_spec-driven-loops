---
title: "Implementation Phase: OpenCode Goal Optimization and Devin Goal Remnant Removal"
description: "Replace OpenCode's reversible, length-expanding session filenames with fixed opaque keys while preserving existing goal state, then remove active goal-specific Devin references without altering unrelated Devin runtime support."
status: "complete"
trigger_phrases:
  - "opencode goal optimization"
  - "opencode goal state migration"
  - "remove devin goal remnants"
  - "fixed length goal state key"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/042-goal-isolation/006-opencode-goal-optimization-and-devin-removal"
    last_updated_at: "2026-08-10T19:20:00Z"
    last_updated_by: "codex"
    recent_action: "Phase 6 implementation, playbook alignment, and final proof completed"
    next_safe_action: "Monitor digest-keyed OpenCode goals and explicit legacy migration during normal use"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/tests/mk-goal-state.test.cjs"
      - ".opencode/plugins/tests/mk-goal-lifecycle.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-isolation-phase-6-20260810"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Historical spec evidence remains; active runtime and operator surfaces lose goal-specific Devin remnants."
      - "OpenCode native token accounting remains unchanged."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Phase: OpenCode Goal Optimization and Devin Goal Remnant Removal

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-10 |
| **Branch** | Current working branch |
| **Parent Spec** | `../spec.md` |
| **Phase** | 6 of 6 |
| **Predecessor** | `005-verification-and-validation` |
| **Successor** | None |
| **Handoff Criteria** | OpenCode state keys are opaque and fixed-length, legacy files migrate without data loss, native token accounting remains green, and active goal surfaces contain no Devin-specific remnants. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase extends the completed goal-isolation packet after the OpenCode implementation was intentionally retained as a separate native system. The focused OpenCode suite started at 119/119 passing, but its storage key was the raw session id encoded as hexadecimal. A 140-character native id expanded to a 285-character filename and failed with `ENAMETOOLONG`. The completed implementation now uses a fixed 64-character SHA-256 key, migrates valid earlier hex-keyed records lazily, and passes 125/125 focused tests.

**Scope Boundary**: optimize the native OpenCode goal store and remove active Devin goal-version remnants. The runtime-neutral Pi/Cursor core, prompt content, verifier policy, continuation policy, native token-accounting algorithm, and unrelated Devin runtime infrastructure are unchanged.

**Deliverables**:
- Fixed-length opaque OpenCode state and archive keys.
- Automatic, compare-safe migration from existing hex-keyed state files.
- Regression tests for path length, privacy, migration, archive behavior, and session isolation.
- Removal of active goal-specific Devin references and stale mirror exceptions.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`mk-goal.js` derives a state filename by hex-encoding the full OpenCode session id. The encoding exposes the original id, doubles its length, and can exceed the filesystem component limit. Existing state files also have no migration path to an opaque naming scheme.

The repository no longer ships a Devin goal adapter, but current goal docs and two runtime-mirror comments still name the removed variant. Those references keep a retired goal implementation visible in active operational surfaces even though unrelated Devin hooks remain supported.

### Purpose

Make OpenCode goal persistence bounded and private without losing active or archived goals, and make the active goal system describe only the runtimes it currently implements.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Hash normalized OpenCode session ids with SHA-256 for fixed 64-character keys.
- Detect and migrate existing hex-keyed active and archived goal files on first access.
- Preserve mode `0600`, directory mode `0700`, atomic writes, session-id validation, and cache invalidation.
- Keep native OpenCode usage extraction and per-message token de-duplication unchanged.
- Remove Devin-specific goal rows, prose, prompts, and stale mirror examples from active code and operator docs.
- Update packet 042's current phase map, completion state, and handover after verification.

### Out of Scope

- Removing `.devin/`, `cli-devin`, Devin hook adapters, or generic Devin documentation; those are unrelated runtime capabilities.
- Deleting or rewriting historical specs and benchmark evidence; they remain audit records of prior behavior.
- Merging OpenCode into the runtime-neutral Pi/Cursor core.
- Changing the goal prompt, verifier heuristics, autonomy, budgets, or token-accounting semantics.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/mk-goal.js` | Modify | Add SHA-256 state keys and safe legacy-file migration. |
| `.opencode/plugins/tests/mk-goal-state.test.cjs` | Modify | Cover opaque paths, long ids, active-state migration, and isolation. |
| `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs` | Modify | Cover archived legacy-state migration and lifecycle compatibility. |
| `.opencode/skills/system-spec-kit/scripts/runtime-mirrors/{command-scope,sync-runtime-mirrors}.cjs` | Modify | Remove retired Devin goal exceptions from active comments. |
| Active goal architecture, constitutional, feature-catalog, and manual-playbook docs | Modify | Remove Devin-specific goal rows and support prompts. |
| `specs/cli-external-orchestration/042-goal-isolation/**` | Modify/Create | Track Phase 6 and reconcile final packet state. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | OpenCode session state uses a fixed opaque key. | `sessionKeyForSession()` returns exactly 64 lowercase hexadecimal characters and the filename contains no raw or reversibly encoded session id. |
| REQ-002 | Long native session ids remain persistable. | The pre-change 140-character negative control changes from `ENAMETOOLONG` to a successful set/read cycle. |
| REQ-003 | Existing active goal state survives the key change. | A valid legacy hex-keyed file migrates atomically to the digest path, preserves the goal, and removes only the successfully migrated source. |
| REQ-004 | Migration cannot overwrite or misbind state. | An occupied digest target wins without source deletion; an embedded session mismatch still returns `INVALID_GOAL_STATE`. |
| REQ-005 | Existing OpenCode behavior stays green. | The full focused `mk-goal` suite passes with native token-accounting tests unchanged. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Archived goals remain discoverable across the key change. | Legacy archived files migrate or remain readable without duplicating history records. |
| REQ-007 | Active goal surfaces contain no retired Devin goal implementation references. | A scoped repository scan returns zero matches outside historical specs and unrelated Devin runtime material. |
| REQ-008 | Unrelated Devin runtime support is preserved. | `.devin/hooks.v1.json` and non-goal Devin hook/skill paths remain byte-unchanged in the Phase 6 diff. |
| REQ-009 | Packet truth and verification evidence agree. | Phase 6, its predecessor link, parent phase map, checklist, summaries, and handover report the same final state. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A 140-character session id writes to a 69-character `<digest>.json` filename and reads back the same goal.
- **SC-002**: Different session ids produce different digest paths and cannot read or mutate each other's records.
- **SC-003**: Active and archived legacy hex files migrate without overwrite, duplicate history, or data loss.
- **SC-004**: The focused OpenCode suite remains at or above its 119-test baseline with zero failures.
- **SC-005**: Active source and operator-doc scans find no Devin goal-version remnant while unrelated Devin runtime surfaces remain present.
- **SC-006**: Phase 6 strict validation and packet 042 recursive strict validation exit 0 from the final state.

### Acceptance Scenarios

1. **Given** a 140-character session id, **when** a goal is set and shown, **then** persistence succeeds at a fixed digest filename.
2. **Given** a valid legacy hex-keyed active file, **when** the same session reads it, **then** the digest file replaces it and the goal content is preserved.
3. **Given** both legacy and digest files for one session, **when** the session reads state, **then** the digest target remains authoritative and the legacy file is not silently deleted.
4. **Given** active goal docs and mirror code, **when** the Devin-goal residue scan runs, **then** no current implementation, registration, command, or support claim remains.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Migration races with a same-session mutation | A stale source could overwrite newer digest state. | Serialize migration through the existing per-session queue and never replace an occupied target. |
| Risk | Filename change breaks archive lookup | `history` could hide old entries. | Cover legacy archive discovery and migration with lifecycle tests. |
| Risk | Token accounting changes accidentally | Budgets could undercount or double-count. | Do not modify usage extraction or ledger logic; rerun all native usage tests. |
| Risk | Devin cleanup broadens into runtime removal | Unrelated hooks and dispatch support could break. | Restrict removal to goal-specific active matches and verify `.devin/hooks.v1.json` remains unchanged. |
| Dependency | Node `crypto` and filesystem atomic rename | Required by the plugin's existing Node runtime. | Use built-in modules already available in the current runtime. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: State-path derivation remains O(session-id length) with a fixed-size output.
- **NFR-P02**: Current digest-keyed reads add no extra filesystem call; migration work runs only when the digest target is absent.

### Security

- **NFR-S01**: Raw session ids and reversible encodings never appear in new filenames or default diagnostics.
- **NFR-S02**: Migrated files retain private persistence permissions and embedded session validation.

### Reliability

- **NFR-R01**: A failed migration preserves the source and reports a stable goal error rather than losing state.
- **NFR-R02**: The plugin remains fail-open for passive system injection and fail-closed for ambiguous state selection.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Identity Boundaries

- Empty identity still fails with `MISSING_SESSION_ID` before path resolution.
- Unicode, control-normalized, object-shaped, and very long ids produce fixed digest keys.
- Distinct normalized ids must not collide in the test matrix.

### Migration Boundaries

- Missing legacy file: normal digest lookup returns no goal.
- Malformed legacy JSON: source remains untouched and the read reports the parse failure.
- Embedded session mismatch: source remains untouched and selection fails closed.
- Occupied digest target: target remains authoritative and source remains for explicit diagnosis.
- Legacy archive plus digest archive: history returns each goal once.

### Removal Boundaries

- Goal-specific Devin prose and stale exception comments are removed.
- Historical specs, benchmark evidence, generic Devin CLI docs, and native Devin hooks remain unchanged.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | One large plugin, two focused test files, operator docs, and packet metadata. |
| Risk | 18/25 | Persistent goal state and session ownership are user-steering boundaries. |
| Research | 10/20 | The negative control and consumer inventory identify the defect and migration constraints. |
| **Total** | **45/70** | **Level 2 verification depth inside an existing Level 3 phased parent.** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No open product decision remains. The user explicitly requested OpenCode optimization and Devin goal-remnant removal; the implementation boundary above preserves unrelated runtime support and historical evidence.
<!-- /ANCHOR:questions -->

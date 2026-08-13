---
title: "Implementation Phase: OpenCode Goal Optimization and Devin Goal Remnant Removal"
description: "Replace OpenCode's reversible, length-expanding session filenames with fixed opaque keys while preserving existing goal state, then remove active goal-specific Devin references without altering unrelated Devin runtime support."
status: "in_progress"
trigger_phrases:
  - "opencode goal optimization"
  - "opencode goal state migration"
  - "remove devin goal remnants"
  - "fixed length goal state key"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/009-goal-isolation/006-opencode-goal-optimization-and-devin-removal"
    last_updated_at: "2026-08-10T21:28:22Z"
    last_updated_by: "codex"
    recent_action: "Repair verified; delivery freshness pending"
    next_safe_action: "Rerun default strict validation after authorized delivery"
    blockers:
      - "Default strict continuity freshness requires clean packet paths, but this task forbids committing the repaired diff."
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/tests/mk-goal-state.test.cjs"
      - ".opencode/plugins/tests/mk-goal-lifecycle.test.cjs"
    session_dedup:
      fingerprint: "sha256:868448629c4e159f1eff29686e5f2f1a8fa4d070b4dd5876661661880d3ed12f"
      session_id: "goal-isolation-phase-6-20260810"
      parent_session_id: null
    completion_pct: 99
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
| **Status** | In progress — repair verified; delivery freshness pending |
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

This phase extends the completed goal-isolation packet after the OpenCode implementation was intentionally retained as a separate native system. The focused OpenCode suite started at 119/119 passing, but its storage key was the raw session id encoded as hexadecimal. A 140-character native id expanded to a 285-character filename and failed with `ENAMETOOLONG`. The initial implementation moved to a fixed 64-character SHA-256 key and passed 125/125 focused tests. Post-completion review then reproduced six additional defects: archive traversal through stored identifiers, lost cross-process updates and migration deletion races, incomplete workspace identity, long-session legacy deletion failures, identity-free OpenCode legacy adoption, and leakage of the OpenCode-only command into Claude's whole-tree mirror. The repaired matrix now passes 91/91 cross-runtime tests and 128/128 OpenCode tests, with the filtered Claude mirror verified across eight trees.

**Scope Boundary**: optimize the native OpenCode goal store, harden the runtime-neutral Pi/Cursor persistence boundary, filter Claude repository command discovery, and remove active Devin goal-version remnants. Prompt content, verifier policy, continuation policy, native token-accounting algorithm, and unrelated Devin runtime infrastructure are unchanged.

**Deliverables**:
- Fixed-length opaque OpenCode state and archive keys.
- Automatic, compare-safe migration from existing hex-keyed state files.
- Regression tests for path length, privacy, migration, archive behavior, and session isolation.
- Removal of active goal-specific Devin references and stale mirror exceptions.
- Segment-safe, containment-checked archives and cross-process lifecycle serialization.
- Canonical repository-root/runtime/session scope keys and safe adoption of the previous scoped layout.
- A filtered Claude command tree that excludes OpenCode-only commands without claiming unverified product behavior.
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
- Make runtime-neutral archive targets segment-safe and enforce real-path containment under the state root.
- Serialize same-scope read-modify-write lifecycle operations and legacy singleton migration across processes.
- Hash an unambiguous canonical repository-root, runtime, and session tuple into opaque scoped filenames.
- Treat impossible long legacy OpenCode filenames as absent and require an exact embedded session identity before adoption.
- Replace Claude's whole-directory command symlink with a generated filtered per-command mirror.
- Remove Devin-specific goal rows, prose, prompts, and stale mirror examples from active code and operator docs.
- Update packet 009's current phase map, completion state, and handover after verification.

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
| `.opencode/hooks/goal/lib/goal-core.cjs` and cross-runtime tests | Modify | Add canonical scopes, containment, cross-process locks, and adversarial regressions. |
| `.opencode/skills/system-spec-kit/scripts/runtime-mirrors/{command-scope,sync-runtime-mirrors}.cjs` | Modify | Generate a filtered Claude command tree and enforce runtime-exclusive exclusions. |
| `.opencode/skills/system-spec-kit/scripts/validate-command-tree-parity.sh` and scripts README | Modify | Make strict validation use the same policy-aware filtered mirror boundary. |
| `.claude/commands/**` and `.claude/SYNC.md` | Replace/Modify | Replace the whole-tree command symlink with checked per-command links and document the true boundary. |
| Active goal architecture, constitutional, feature-catalog, and manual-playbook docs | Modify | Remove Devin-specific goal rows and support prompts. |
| `specs/hooks/009-goal-isolation/**` | Modify/Create | Track Phase 6 and reconcile final packet state. |
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
| REQ-010 | Runtime-neutral archives cannot traverse or overwrite through stored goal ids. | Hostile replace, clear, complete, and legacy migration ids remain inside validated archive namespaces; symlinked archive escapes write nothing outside state. |
| REQ-011 | Same-scope lifecycle mutations are serialized across processes. | Concurrent turn updates preserve every increment; terminal races produce one terminal archive; losing migrations cannot delete a successful target. |
| REQ-012 | Scoped identity includes canonical workspace, runtime, and session. | Nested paths resolve to one repository root; an unambiguous tuple hash produces a private 64-hex key; shared state roots keep workspaces distinct. |
| REQ-013 | OpenCode legacy compatibility fails closed at edge boundaries. | Long-id clear/deletion succeeds after canonical removal, and legacy adoption requires a present exact normalized embedded session id. |
| REQ-014 | Claude cannot discover the OpenCode-only goal command through repository mirrors. | `.claude/commands` is a checked real directory of per-command symlinks, `goal-opencode.md` is absent, and mirror validation enforces both properties. |
| REQ-015 | Claude documentation states only proven repository behavior. | Playbooks test the actual discovery tree and explicitly leave live product-native behavior unverified. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A 140-character session id writes to a 69-character `<digest>.json` filename and reads back the same goal.
- **SC-002**: Different session ids produce different digest paths and cannot read or mutate each other's records.
- **SC-003**: Active and archived legacy hex files migrate without overwrite, duplicate history, or data loss.
- **SC-004**: The focused OpenCode suite remains at or above its 119-test baseline with zero failures.
- **SC-005**: Active source and operator-doc scans find no Devin goal-version remnant while unrelated Devin runtime surfaces remain present.
- **SC-006**: Phase 6 strict validation and packet 009 recursive strict validation pass all content and mirror rules; default delivery-state runs must exit 0 after the repaired packet paths are clean.
- **SC-007**: Every post-review negative control changes from reproduced failure to a passing regression without production goal-state access.
- **SC-008**: The complete cross-runtime suite passes at 90/90 or higher and the complete OpenCode suite passes at 128/128 or higher.
- **SC-009**: Runtime mirror validation passes with Claude as a filtered eighth tree and no OpenCode goal router under `.claude/commands`.

### Acceptance Scenarios

1. **Given** a 140-character session id, **when** a goal is set and shown, **then** persistence succeeds at a fixed digest filename.
2. **Given** a valid legacy hex-keyed active file, **when** the same session reads it, **then** the digest file replaces it and the goal content is preserved.
3. **Given** both legacy and digest files for one session, **when** the session reads state, **then** the digest target remains authoritative and the legacy file is not silently deleted.
4. **Given** active goal docs and mirror code, **when** the Devin-goal residue scan runs, **then** no current implementation, registration, command, or support claim remains.
5. **Given** hostile stored ids and an archive symlink escape, **when** replace or terminal actions run, **then** no path outside the state root changes.
6. **Given** multiple processes update one goal, **when** all workers finish, **then** the final revision contains every turn and migration has one surviving target.
7. **Given** nested workspaces and a shared explicit state root, **when** scopes resolve, **then** repository identity is canonical and cross-workspace files remain distinct.
8. **Given** Claude's checked-in command tree, **when** mirror validation runs, **then** shared commands are linked and the OpenCode-only router is absent.
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
| Risk | A stale or abandoned filesystem lock blocks mutation | A valid lifecycle action could time out. | Use bounded acquisition, private hashed lock names, and conservative stale-lock recovery. |
| Risk | Previous scoped files become unreachable after composite hashing | Existing Pi/Cursor goals or history could disappear. | Adopt the old layout only in its unambiguous workspace-default root and keep legacy archives readable. |
| Risk | Claude filtering forks command content | Shared commands could drift. | Generate only per-file relative symlinks and make the mirror check reject real-file forks and whole-tree symlinks. |
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
- **NFR-S03**: Archive filenames are strict path segments and real archive roots remain contained by the real state root.

### Reliability

- **NFR-R01**: A failed migration preserves the source and reports a stable goal error rather than losing state.
- **NFR-R02**: The plugin remains fail-open for passive system injection and fail-closed for ambiguous state selection.
- **NFR-R03**: Same-scope lifecycle mutations have a cross-process serialization contract with bounded lock acquisition.
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
| Scope | 21/25 | Native plugin persistence, shared-core storage, multiprocess lifecycle behavior, generated command mirrors, operator docs, and packet metadata. |
| Risk | 20/25 | Persistent goal state, archive containment, and session ownership are user-steering boundaries. |
| Research | 13/20 | Six isolated negative controls and a producer/consumer inventory identify the defects and migration constraints. |
| **Total** | **54/70** | **Level 2 verification depth inside an existing Level 3 phased parent.** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No open product decision remains. The user explicitly requested OpenCode optimization and Devin goal-remnant removal; the implementation boundary above preserves unrelated runtime support and historical evidence.
<!-- /ANCHOR:questions -->

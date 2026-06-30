---
title: "Implementation Plan: Purge the cli-gemini executor everywhere outside specs"
description: "Plan for removing every cli-gemini executor reference from active source, tests, manifests, catalogs, playbooks, and changelogs while preserving specs and the separate Gemini runtime/model surfaces."
trigger_phrases:
  - "cli-gemini executor purge plan"
  - "gemini deprecation phase 3 plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/107-cli-gemini-deprecation/003-cli-gemini-full-purge"
    last_updated_at: "2026-06-08T18:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level 3 plan for cli-gemini executor purge"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/**"
      - ".opencode/skills/deep-improvement/**"
      - ".opencode/skills/system-spec-kit/mcp_server/matrix_runners/**"
      - ".opencode/changelog/**"
    session_dedup:
      fingerprint: "sha256:6992f1b2612bce2cf6b062525504025c8e64e2904ca249653b8eb3e59ac6e890"
      session_id: "gemini-deprecation-phase3-2026-06-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Purge cli-gemini executor refs outside specs."
      - "Swap mixed cross-CLI scenarios, delete pure-Gemini artifacts."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Purge the cli-gemini executor everywhere outside specs

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript (CJS), JSON, Markdown, Shell |
| **Framework** | OpenCode skill and command repository |
| **Storage** | No application storage changes |
| **Testing** | Targeted Vitest suites (deep-loop-runtime, matrix-adapter, remediation), direct node fixture run, `rg` exact search, JSON parse |

### Overview

Remove `cli-gemini` from every active executor surface outside `specs/**`: deep-loop-runtime source and tests, deep-improvement model-benchmark, system-spec-kit matrix tooling, the council fixture, a broad set of feature catalogs and manual testing playbooks, the constitutional dispatch file, deep-research/deep-review docs, and release-history changelogs. Delete only purely-`cli-gemini` artifacts (the matrix adapter and its test); swap mixed cross-CLI scenarios to `cli-codex`/`cli-opencode` to preserve coverage. Leave Gemini-as-runtime and Gemini-as-model surfaces intact.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear: `cli-gemini` is still wired as a first-class executor after phases 001/002.
- [x] Success criteria measurable via global `rg` exclusion and named test counts.
- [x] Dependencies identified: executor unions, matrix manifest, compiled dist, mixed cross-CLI scenarios.

### Definition of Done
- [x] `cli-gemini` removed from all active executor source and tests.
- [x] Purely-`cli-gemini` matrix adapter and test deleted (source + dist).
- [x] Mixed cross-CLI scenarios swapped, not deleted; counts preserved.
- [x] Release-history changelogs edited per operator direction.
- [x] Targeted suites GREEN; `rg "cli-gemini|cli_gemini"` excluding specs returns zero.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Cross-skill executor-surface removal with exact-token inventory, delete-vs-swap classification, type-union narrowing, manifest recount, and targeted regression verification.

### Key Components
- **deep-loop-runtime executor wiring**: `executor-config.ts` kinds/flags/Extract and Gemini sandbox code, `executor-audit.ts` map entries, `fanout-run.cjs` map entry/if-block/ternary.
- **deep-improvement model-benchmark**: `dispatch-model.cjs` `KNOWN_EXECUTORS`/case, `profile-validator.cjs`, remediation test.
- **system-spec-kit matrix tooling**: deleted `adapter-cli-gemini.ts` + test + dist, `run-matrix.ts` union/array/switch, `matrix-manifest.json` cells.
- **Mixed cross-CLI scenarios**: council fixture, CR-018 (sk-code-review), GIT-022 (sk-git) — swapped, not deleted.
- **Docs and changelogs**: feature catalogs, manual testing playbooks, template guide, constitutional file, deep-research/deep-review docs, and ~13 release-history changelogs.

### Data Flow

After the purge, no active executor dispatch, manifest, doc, playbook, or changelog advertises `cli-gemini`. The matrix is 3 executors (`cli-codex`, `cli-claude-code`, `cli-opencode`) × 13 features = 39 cells. Gemini binary references that survive are runtime or model references, not executor registrations.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep-loop-runtime/lib/deep-loop/executor-config.ts` | Executor kinds, flag map, sandbox modes | Modify | deep-loop-runtime suite 213/214. |
| `deep-loop-runtime/lib/deep-loop/executor-audit.ts` | Executor audit map | Modify (5 entries) | `executor-audit.vitest.ts`. |
| `deep-loop-runtime/scripts/fanout-run.cjs` | Fan-out executor map and sandbox ternary | Modify | `fanout-run.vitest.ts`. |
| `deep-improvement/scripts/model-benchmark/**` | Known executors, dispatch, validator | Modify | remediation suite 25/25. |
| `system-spec-kit/.../matrix_runners/adapter-cli-gemini.ts` | Gemini-only matrix adapter | Delete (+ dist) | `glob` returns no files; matrix-adapter 13/13. |
| `system-spec-kit/.../matrix_runners/run-matrix.ts` | Executor union/array/switch | Modify | matrix-adapter suite, tsc. |
| `system-spec-kit/.../matrix_runners/matrix-manifest.json` | Matrix cell manifest | Modify | `python3 -m json.tool` valid; 39 cells. |
| `scripts/tests/fixtures/multi-ai-council/council-output-full.md` + assertion | Council persistence fixture | Swap to `cli-opencode` | direct node run (vitest SIGSEGVs under Node v25). |
| `*/feature_catalog/**`, `*/manual_testing_playbook/**` | Inventory + scenarios | Modify / rename | playbook counts 18, 22 unchanged; index updated. |
| `.opencode/changelog/**` | Release history | Modify (~13 files) | global `rg` exclusion clean. |

Required inventories:
- `rg "cli-gemini|cli_gemini"` excluding `specs/**` for the global purge footprint.
- `glob .opencode/skills/system-spec-kit/mcp_server/{matrix_runners,dist/matrix_runners}/adapter-cli-gemini.*` for the deleted-adapter footprint.
- Playbook index counts before/after rename for CR-018 and GIT-022.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Inventory every `cli-gemini` executor reference outside `specs/**`.
- [x] Classify each artifact as delete (pure-Gemini) or swap (mixed cross-CLI).
- [x] Record the matrix recount target (39 cells, no F8).

### Phase 2: Core Implementation
- [x] Edit deep-loop-runtime source and tests; remove sandbox/whitelist code.
- [x] Edit deep-improvement model-benchmark dispatch, validator, and test.
- [x] Delete the matrix adapter + test + dist; edit run-matrix and manifest.
- [x] Swap the council fixture and assertion; rename CR-018 and GIT-022 handbacks.
- [x] Edit feature catalogs, playbooks, template guide, constitutional file, deep-research/deep-review docs, and release-history changelogs.

### Phase 3: Verification
- [x] Run deep-loop-runtime, matrix-adapter, and remediation suites.
- [x] Validate `matrix-manifest.json` and confirm 39 cells.
- [x] Run global `rg "cli-gemini|cli_gemini"` excluding `specs/**`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Inventory | Active `cli-gemini` executor references | `rg`, `glob` |
| Unit | deep-loop-runtime, matrix-adapter, remediation | `npx vitest run ...` |
| Fixture | Multi-AI council persistence | direct `node` run (vitest SIGSEGVs under Node v25) |
| Syntax | Matrix manifest JSON | `python3 -m json.tool` |
| Inventory close | Global purge proof | `rg "cli-gemini|cli_gemini"` excluding specs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator approval to edit changelogs | Requirement | Green | Already answered: purge everything except `specs/**`. |
| Decision to defer Gemini runtime/model | Requirement | Green | Already answered: separate decision. |
| Node v25 vitest stability for council fixture | Tooling | Yellow | vitest SIGSEGVs; logic verified via direct node run. |
| Compiled dist mirrors matrix source | Build artifact | Yellow | Delete the four compiled adapter dist files alongside source. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A targeted suite fails in a way that cannot be repaired safely in scope, or the matrix recount produces invalid JSON.
- **Procedure**: Revert this phase's edits and restore the deleted matrix adapter, test, and dist from git. Do not partially recreate `cli-gemini` executor wiring as a shim.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Inventory -> Classify delete/swap -> Source/test edits -> Manifest recount -> Docs/changelogs -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | Clarified scope | All edits |
| Classify | Inventory | Source/test edits |
| Source/test edits | Classify | Manifest recount |
| Manifest recount | Source edits | Verification |
| Docs/changelogs | Classify | Verification |
| Verification | All edits | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 30-45 minutes |
| Core Implementation | High | 3-5 hours |
| Verification | Medium | 1-1.5 hours |
| **Total** | | **4.5-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Record the inventory of `cli-gemini` executor references before edits.
- [x] Keep all edits in the working tree for diff review before any commit.
- [x] Run targeted suites and global search before claiming completion.

### Rollback Procedure
1. Restore the deleted matrix adapter, test, and dist plus all edited files from git if the purge is cancelled.
2. Re-run the global search to confirm references return only when rollback is intended.
3. Re-run the targeted suites for the restored state.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Git-level file restoration only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Scope clarification
  -> inventory and delete/swap classification
  -> executor source/test edits
  -> matrix delete + recount
  -> docs/playbooks/changelogs edits
  -> verification and closeout
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Scope clarification | Operator answers | Bound purge rules | All work |
| Inventory | Scope clarification | Reference list | Edits |
| Executor source edits | Inventory | Narrowed unions/tests | Manifest recount |
| Matrix recount | Source edits | 39-cell manifest | Verification |
| Docs/changelog edits | Inventory | Clean docs/history | Verification |
| Verification | All edits | Evidence | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Inventory `cli-gemini` executor references and classify delete/swap** - CRITICAL.
2. **Edit executor source, delete the adapter, recount the matrix** - CRITICAL.
3. **Run targeted suites and global search** - CRITICAL.

**Total Critical Path**: 3 implementation stages.

**Parallel Opportunities**:
- Docs/playbook/changelog edits are separable from source edits, but were authored in one pass for consistency.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Inventory complete | All `cli-gemini` executor refs classified delete/swap | Planning |
| M2 | Executor source clean | Source/tests/manifest free of `cli-gemini`; suites GREEN | Implementation |
| M3 | Repo clean | Global `rg` exclusion returns zero; counts preserved | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Swap-not-delete for mixed cross-CLI artifacts

**Status**: Accepted

**Context**: Some artifacts (council fixture, CR-018, GIT-022) paired `cli-gemini` with another CLI to exercise cross-CLI behavior. Deleting them would drop coverage of the surviving CLI.

**Decision**: Swap `cli-gemini` to `cli-codex`/`cli-opencode` in mixed artifacts; delete only purely-`cli-gemini` artifacts (the matrix adapter and its test).

**Consequences**:
- Cross-CLI coverage is preserved and IDs/counts stay stable.
- Purely-Gemini artifacts are removed cleanly without leaving dead foils.

**Alternatives Rejected**:
- Delete all `cli-gemini` artifacts: rejected because it loses other-CLI coverage in mixed scenarios.
- Keep `cli-gemini` as a documented-deprecated foil: rejected because the operator directed a full purge.

### ADR-002: Edit release-history changelogs

**Status**: Accepted

**Context**: Release-history changelogs named `cli-gemini` as an executor. They are normally treated as immutable history.

**Decision**: Edit the ~13 changelogs that name `cli-gemini` as an executor, because the operator explicitly directed "purge everything" with only `specs/**` exempt.

**Consequences**:
- Global search is clean; no doc or history advertises a deleted executor.
- Release history diverges slightly from the as-shipped wording, by operator direction.

**Alternatives Rejected**:
- Leave changelogs untouched: rejected by the operator's explicit purge scope.

---
title: "Spec: z_future Always Ignored In Backfill [template:level_2/spec.md]"
description: "A scoped fix to the graph-metadata backfill generator so its tree walk unconditionally skips the z_future staging area. A default run previously entered z_future, the parser threw because z_future is not a supported specs root, and the walk over-reached. The fix adds z_future to the walk exclusion set and corrects the header comment, then rebuilds the dist."
trigger_phrases:
  - "z future always ignored"
  - "backfill graph metadata exclusion"
  - "z future not a supported specs root"
  - "collectSpecFolders staging skip"
  - "backfill walk over-reach"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/005-shared-engine-and-research/032-z-future-always-ignored"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Added z_future to the walk exclusion set, rebuilt dist"
    next_safe_action: "Phase complete, add a z_future-exclusion test as follow-up"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts"
      - ".opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: z_future Always Ignored In Backfill

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-22 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The graph-metadata backfill generator refreshed `z_future/` by default. Its tree walk in `collectSpecFolders` only skipped `z_future` under the `--active-only` flag, so a default run descended into `z_future` and the parser threw `Spec folder is not under a supported specs root` at the refresh site. The same descent let the walk over-reach into a staging tree that the generator was never meant to touch. A default backfill should refresh real packet folders without crashing on a staging area.

### Purpose
Make the backfill walk unconditionally skip `z_future` so a default run no longer enters the staging area, no longer throws, and no longer over-reaches. Preserve the existing `z_archive` behavior, included by default and skippable with `--active-only`. Correct the header comment so the documented contract matches the walk.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Adding `z_future` to the `EXCLUDED_DIRS` set in the backfill generator so the walk always skips it
- Correcting the header comment to state that `z_future` is always skipped while `z_archive` stays included by default and skippable via `--active-only`
- Rebuilding the dist from the corrected source

### Out of Scope
- Any change to `z_archive` handling, which stays included by default and skippable via `--active-only`
- Any change to the graph-metadata parser or the refresh path it calls
- Adding a regression test, which is recorded as a follow-up rather than shipped in this phase

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts | Modify | Add z_future to EXCLUDED_DIRS and correct the header comment |
| .opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js | Modify | Rebuild the dist from the corrected source via tsc |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The walk unconditionally skips z_future | collectSpecFolders on the specs root returns zero z_future folders and no longer throws the not-a-supported-specs-root error |
| REQ-002 | The dist matches the corrected source | the rebuilt dist carries z_future in the exclusion set and a default dry-run exits clean |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | z_archive behavior is preserved | z_archive folders are included by default and excluded only under --active-only |
| REQ-004 | The header comment matches the walk | the comment states z_future is always skipped while z_archive is included by default and skippable via --active-only |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A default `collectSpecFolders` on the specs root returns zero `z_future` folders and raises no error, where it previously crashed
- **SC-002**: `z_archive` is included by default and excluded under `--active-only`, unchanged by this fix
- **SC-003**: A default `backfill --dry-run` exits 0 with no `z_future` or supported-specs-root mention in its output
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The exclusion set is shared by the whole walk | An over-broad exclusion could drop real folders | Only z_future is added, z_future is a staging area never meant to carry packet metadata |
| Risk | The dist can drift from the source | A stale dist would keep the crash | The dist was rebuilt via tsc and verified to carry the exclusion |
| Dependency | The graph-metadata parser refresh path | The parser throws when handed a non-specs-root folder | The fix stops the walk from reaching z_future at all, so the parser is never handed it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Skipping z_future at the directory boundary prunes a whole staging subtree from the walk, so a default backfill does less work not more
- **NFR-P02**: The exclusion is a single set membership check per directory, adding no measurable cost

### Security
- **NFR-S01**: The fix only narrows which directories the walk enters, introducing no new file access or execution surface
- **NFR-S02**: No untrusted input reaches the changed code, the exclusion set is a fixed literal

### Reliability
- **NFR-R01**: A default run no longer throws on the staging area, so the generator completes where it previously crashed
- **NFR-R02**: The exclusion is unconditional, so the safe behavior does not depend on a caller remembering the --active-only flag
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A specs root that contains z_future: the walk prunes it at the directory boundary and never enters it
- A specs root with no z_future: the exclusion is a no-op and the walk behaves as before
- A nested z_future inside a deeper tree: the directory-name check prunes it wherever it appears

### Error Scenarios
- The pre-fix crash path: handing z_future to the parser threw the not-a-supported-specs-root error, now unreachable because the walk skips z_future
- A future caller pointing the root directly at z_future: out of scope, the fix targets the default walk over a real specs root

### State Transitions
- Default run versus --active-only: z_future is skipped in both, z_archive is included in the default and skipped under --active-only
- Source versus dist: the dist is rebuilt from the corrected source so both carry the exclusion
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 3/25 | One set entry, one comment correction, one dist rebuild |
| Risk | 4/25 | Narrowing a walk over a staging area, low blast radius |
| Research | 6/20 | Root cause traced to the conditional skip, the fix verified against z_archive parity |
| **Total** | **13/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether the existing backfill test should gain a dedicated z_future-exclusion case, currently it covers z_archive inclusion only
- Whether other generators that walk the specs tree share the same default-enters-z_future shape and need the same guard
<!-- /ANCHOR:questions -->

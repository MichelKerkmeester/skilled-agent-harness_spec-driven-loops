---
title: "Feature Specification: Archive path follow-ups"
description: "Phase 15 fixed archive and restore to re-derive paths. This phase adds the validator integration and resolves remaining disagreements between tools on archive semantics."
trigger_phrases:
  - "archive path follow ups"
  - "archive re-derive recorded paths"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Archive path follow-ups

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-08 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 16 (SH-03) |
| **Predecessor** | 002-phase-scaffold-graph-metadata |
| **Successor** | 004-trigger-index-rebuild-hardening |
| **Handoff Criteria** | An archived and restored packet each passes strict validation without manual step, all tools align on archive semantics, and fixture tests cover the integration |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Research recommendations specification. Phase 15 implemented current-location semantics: `archive.sh` and `restore_spec` now re-derive a moved packet's `description.json` `specFolder`, graph metadata ids, and packet pointer by calling `repair-derived.cjs --roots <moved folder> --apply` after the move. The four repair tools now agree on current-location semantics: `repair-derived.cjs` does not freeze archives, `heal-spec-docs.cjs` skips archives to preserve text, `migrate-generated-json.ts` re-derives archived JSON, and `upgrade-legacy.mjs` repairs archives via `repairArchived`.

This phase confirms the agreement with a round-trip test and ensures comments accurately reflect the policy.

**Scope Boundary**: Validator integration and documentation verification.

**Dependencies**:
- Phase 15's re-derive implementation (already built).
- Phase 14's recommended archive policy (already decided).

**Deliverables**:
- A fixture test that archives and restores a real packet, then validates it with `validate.sh --strict`.
- Verification that each tool's code and comments align with current-location semantics.
- Documentation confirming the policy across README sections.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 15 implemented re-derivation at archive and restore time. The tools now follow current-location semantics: `repair-derived.cjs` does not freeze archives, `heal-spec-docs.cjs` skips archives to avoid rewriting text, `migrate-generated-json.ts` walks archives and re-derives JSON, and `upgrade-legacy.mjs` repairs archived packets. What remains is to confirm this agreement with a round-trip validator test and to ensure every comment accurately describes the policy.

### Purpose
Verify that archived and restored packets pass strict validation end-to-end, and confirm that all tool code and comments align with current-location semantics.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A fixture test that archives a packet, restores it, and validates it with `validate.sh --strict`.
- Verification that each tool's code and comments reflect current-location semantics.
- Documentation check: README-repair-derived.md section 6 and tool comments.

### Out of Scope
- Changing what archived documents say (only derived fields).
- The validator's rules themselves.
- Phase parents' `children_ids` pruning (changes only through reviewed prune).
- Archive re-derivation logic (Phase 15 delivered this; archive.sh already calls repair-derived.cjs).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts` | Modify | Add archive-then-validate fixture test |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Modify | Add archive documentation comment in SKIP_DIRS section |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` | Verify | FROZEN_TREES excludes archives; confirm comments |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README-repair-derived.md` | Verify | Section 6 documents archive scope (current-location semantics) |
| `.skilled/skills/system-spec-kit/runtime/cli/graph/migrate-generated-json.ts` | Verify | Code and comments confirm archive walk and re-derive |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Verify | Archive repair via repairArchived confirmed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | An archived and restored packet passes strict validation with no manual step |
| REQ-002 | Fixture test runs archive, restore, and validation in one workflow |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Each tool's code and comments align with current-location semantics |
| REQ-004 | README-repair-derived.md section 6 and upgrade-legacy.mjs comments accurately describe policy |
| REQ-005 | Suite passes with no regressions |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Fixture test archives a packet, restores it, and validates: `validate.sh --strict` exits 0.
- **SC-002**: Each of the four tools (repair-derived.cjs, heal-spec-docs.cjs, migrate-generated-json.ts, upgrade-legacy.mjs) has code and comments consistent with current-location semantics.
- **SC-003**: Suite passes with no regressions.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 15 archive implementation | Fixture test depends on working re-derive | Already delivered |
| Risk | Documentation inconsistency between tools | Tools claim different policies and confuse users | Audit all tools and align them |
| Risk | Edge case in archive policy choice | A tool later rewrites archived packets unsafely | Fixture test covers the round-trip |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Archive with re-derive adds seconds per packet, acceptable for infrequent moves.

### Reliability
- **NFR-R01**: A failed re-derive is reported and does not undo the move.
- **NFR-R02**: Second run on the same archive is a no-op (idempotent).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A packet nested inside the moved one derives its parent from its own path.
- An archived phase derives its parent differently than an archived track packet.

### Error Scenarios
- Archive.sh warns if `repair-derived.cjs` is missing and advises manual repair.
- A tool step fails: the move is complete, and repair is a separate recovery step.

### State Transitions
- A restored track packet derives no parent.
- A restored phase re-derives its parent packet.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Four tools, their comments, tests, and READMEs |
| Risk | 12/25 | Policy disagreement could mask unsafe behavior |
| Research | 0/20 | Phase 14 and 15 completed the investigation |
| **Total** | **27/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None open. Phase 14 research recommended current-location semantics and the operator approved it.

Settled during the build:

- **The round-trip case links the real skill.** `archive.sh` runs `repair-derived.cjs` and the validator from the working repository, so the case replaces the throwaway repository's copied scripts with a symlink to the real skill (`archive-track.vitest.ts:80`, closeout 3; the first-pass lines 286-288 predate the test round). The graph backfill refuses a target outside a configured specs root (`backfill-graph-metadata.ts:309-314`), and the root guard counts a root only when its workspace is anchored on a real `.opencode` directory (`graph-metadata-parser.ts:1797-1799`), so the case also creates an empty `.opencode` directory (`archive-track.vitest.ts:81`, closeout 3; the first-pass line 289 predates the test round).
- **The SKIP_DIRS policy is a comment, not a code change.** The archive rationale sits above `SKIP_DIRS` in `heal-spec-docs.cjs` (lines 54-65); the set itself is unchanged (line 66). The final review found that the comment did not state the `--folder` bypass, so the comment now says so.
- **Two files changed; four are verify-only.** The four tools' comments already matched current-location semantics when the build ran, so only the test file and the `heal-spec-docs.cjs` comment changed.
- **The test round added edge and failure cases, not scope.** Closeout 2 found four more cases in `archive-track.vitest.ts`, at lines 213, 342, 380 and 411: a packet nested in the moved one, an archived phase and its restore, and the two failure branches of `rederive_moved`. The archived and restored track packet parent cases stay untested (tasks.md CHK-022). The round-trip case now sits at lines 313-338 (closeout 3; the earlier 312-338 range began at its describe) because the shared helpers moved above it and one new case sits in the tracks block, see implementation-summary.md.

<!-- /ANCHOR:questions -->

---



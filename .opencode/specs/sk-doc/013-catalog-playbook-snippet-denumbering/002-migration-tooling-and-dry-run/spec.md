---
title: "Feature Specification: Migration Tooling & Dry-Run [133/002-migration-tooling-and-dry-run/spec]"
description: "Build a deterministic de-number + reference-rewrite migration tool with a dry-run that emits rename/reference/collision manifests and hard-aborts on collisions, plus resolve the two known slug collisions, so the bulk migration phases run safely."
trigger_phrases:
  - "snippet denumber migration script"
  - "reference rewrite tooling dry-run"
  - "collision abort manifest"
  - "133 phase 002"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/013-catalog-playbook-snippet-denumbering/002-migration-tooling-and-dry-run"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase 002 complete: tool 23/23 + dry-run + MiMo PASS"
    next_safe_action: "Create worktree, then run phase 003 (system-spec-kit)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Migration Tooling & Dry-Run

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 (de-risks 1,531-file migration) |
| **Status** | Complete |
| **Created** | 2026-06-06 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Renaming 1,531 files and rewriting ~2,275 link occurrences by hand is error-prone: a single missed `SOURCE METADATA` self-path or root-doc link silently breaks navigation, and two known slug collisions would overwrite real content if a rename ran blind. The migration needs a deterministic, dry-runnable tool that proves its edit set before touching disk.

### Purpose
Produce a deterministic de-number + reference-rewrite migration tool (per decision D1) that: walks one catalog/playbook tree at a time, computes the exact rename map, hard-aborts on any collision, rewrites every class of reference, and supports a `--dry-run` that emits reviewable manifests. Resolve the 2 known collisions so phases 003–005 run clean.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A migration tool (script) under `133-.../scratch/` with `--dry-run` (default) and `--apply` modes, scoped per tree (`--tree <path>`).
- Rename computation: `NN--cat/NNN-slug.md` → `NN--cat/slug.md`; strip leading `^[0-9]+-` from the **basename only**.
- Collision detection: hard-abort the tree if any two source files reduce to the same target, or the target already exists.
- Reference rewrite (per tree): self-path in `SOURCE METADATA`, neighbor `Related references`, root catalog/playbook links, and a supplied list of external referrers (active-skill AND `.opencode/specs/**` historical docs, per D2) — anchored on `.md`, category-dir-qualified to disambiguate recurring basenames.
- Dry-run manifests: `rename-manifest`, `reference-edit-manifest`, `collision-report` (machine-readable).
- Adversarial review of the tool (second model) against the edge-case list.
- Resolve the 2 collisions in `system-spec-kit/.../16--tooling-and-scripts/` (content inspection → merge duplicate or assign distinct slugs).

### Out of Scope
- Running the migration on real trees (phases 003–005).
- Editing sk-doc standards (phase 001).
- Touching historical spec-folder referrers (D2).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `133-.../scratch/denumber-snippets.{sh,cjs}` | Create | The deterministic migration tool |
| `133-.../scratch/dry-run/*-manifest.{json,txt}` | Create | Rename + ref-edit + collision manifests |
| `system-spec-kit/.../16--tooling-and-scripts/{219,235,243,250}-*.md` | Analyze→Resolve | The 2 collision pairs (resolution lands in 003, but slug decision made here) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename map strips only the leading numeric prefix from the basename | Unit check: `NN--cat/007-foo.md` → `NN--cat/foo.md`; category dir untouched |
| REQ-002 | Tool hard-aborts a tree on ANY collision (no overwrite) | Feeding the `16--tooling-and-scripts` tree raises a non-zero exit + collision-report before any write |
| REQ-003 | Reference rewrite covers all 4 classes, anchored on `.md` | Dry-run on a sample tree shows self-path, neighbor, root, external edits; Feature IDs (`M-219`) untouched |
| REQ-004 | `--dry-run` is the default and writes nothing to target trees | Running without `--apply` leaves `git status` of target trees clean |
| REQ-005 | The 2 known collisions have an approved resolution | Decision recorded (merge vs distinct slugs) with the new slug names |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Edge cases handled: `./`/`../` prefixes, `#anchors`, code-fence links, substring slugs | Adversarial review confirms each via a fixture |
| REQ-007 | Tool uses `git mv` (history-preserving) and never `git add -A` | Code review confirms scoped staging |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reviewed dry-run produces a complete, correct manifest for at least one real tree with zero unresolved collisions.
- **SC-002**: The collision-abort path is demonstrated on the `16--tooling-and-scripts` tree.
- **SC-003**: DeepSeek adversarial review signs off on the rewrite algorithm's edge-case coverage.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Rewrite over-matches (e.g. Feature ID `M-219`) | High — corrupts content | `.md`-anchored, category-qualified matching; fixture tests |
| Risk | Collision overwrites real file | High — data loss | Hard-abort before any write (REQ-002) |
| Risk | DeepSeek 64k context too small for whole trees | Med | Feed scoped slices + the algorithm spec, not full trees |
| Dependency | Phase 001 convention | Blocking | 001 must define the target shape first |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Idempotent — re-running `--apply` on an already-migrated tree is a no-op (no double-strip).

### Security
- **NFR-S01**: Tool writes only inside `--tree` + the supplied referrer list; never outside the repo.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Same-dir relative neighbor links use bare basenames; cross-tree links use category-qualified paths — both handled.
- A slug that is a prefix/substring of another (`foo.md` vs `foo-bar.md`) — require full-segment boundary match.

### Error Scenarios
- Target already exists (not from this run) → abort tree, report.
- A referrer file is read-only or missing → report, skip, non-zero exit.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One tool + manifests + 2 collision resolutions |
| Risk | 18/25 | Algorithm correctness gates 1,531 renames |
| Research | 6/20 | Edge-case set already enumerated |
| **Total** | **36/70** | **Level 2 (upper)** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Inherits D1 (if D1 = pure agent hand-edit, this phase collapses to "author the rename+reference checklist + resolve collisions" instead of a script).
- D4 sets the collision resolution policy this phase executes.
<!-- /ANCHOR:questions -->

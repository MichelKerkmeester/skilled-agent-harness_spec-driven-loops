---
title: "Implementation Plan: Consolidate benchmark format mechanics into a single sk-doc reference following the *_creation.md pattern [template:level_2/plan.md]"
description: "Author benchmark_creation.md and source_template.md, delete the legacy FORMAT.md + benchmarks_format.md trio and sibling symlinks, update all cross-link references."
trigger_phrases:
  - "benchmark consolidation plan"
  - "benchmark_creation.md plan"
  - "006 implementation plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality/006-benchmark-format-to-sk-doc"
    last_updated_at: "2026-05-19T12:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Consolidation complete."
    next_safe_action: "ready to commit on main"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/references/benchmark_creation.md"
      - ".opencode/skills/sk-doc/assets/benchmark/source_template.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "consolidate-006-benchmark-creation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Consolidate benchmark format mechanics into a single sk-doc reference following the *_creation.md pattern

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + Bash |
| **Framework** | N/A (documentation consolidation, no application framework) |
| **Storage** | git |
| **Testing** | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict` + `python3 .opencode/skills/sk-doc/scripts/validate_document.py` |

### Overview

Create `benchmark_creation.md` (merging FORMAT.md + benchmarks_format.md per the `*_creation.md` pattern) and `source_template.md` (fillable SOURCE.md scaffold). Delete the legacy trio and sibling FORMAT.md symlinks. Update all cross-link references across the benchmark_report_template, sibling skill READMEs, four historical spec.md files and the originating packet docs. No symlinks created. All references become explicit prose paths to the new canonical.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Operator confirmed consolidation design (no symlinks; *_creation.md pattern; source_template.md in assets/benchmark/).
- [x] Source materials read: FORMAT.md (384 LOC), benchmarks_format.md (206 LOC), three existing *_creation.md references, two shipped SOURCE.md files, hvr_rules.md.

### Definition of Done
- [x] All 7 success criteria (SC-001..SC-007) met with evidence.
- [x] `validate.sh --strict` exits 0 on this packet.
- [x] `sk-doc validate_document.py --type readme` PASS on both shipped `benchmark_report.md` files.
- [x] `rg` sweep for stale paths returns 0 matches outside this packet's own docs.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-source documentation with explicit prose path references (no symlinks).

### Key Components

- **`sk-doc/references/benchmark_creation.md`**: the canonical home; 10 sections following the `*_creation.md` pattern.
- **`sk-doc/assets/benchmark/source_template.md`**: fillable SOURCE.md scaffold, 50-60 LOC.
- **Sibling skill READMEs**: updated to reference `benchmark_creation.md` by explicit path in prose.
- **Per-stack result folders**: unchanged (unique per-stack artifacts).

### Data Flow

Author writing a new benchmark: reads `benchmark_creation.md` for workflow and standards, copies `benchmark_report_template.md` for the report scaffold, copies `source_template.md` for SOURCE.md. No symlink traversal required at any step.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Author new canonical artifacts at sk-doc
- [x] Read FORMAT.md, benchmarks_format.md and three existing *_creation.md references.
- [x] Write `.opencode/skills/sk-doc/references/benchmark_creation.md` with 10 sections following the *_creation.md pattern (overview, when-to-create, when-not-to-create, folder shape, report structure, authoring workflow, date convention, authority hierarchy, case studies + common mistakes, related resources).
- [x] Write `.opencode/skills/sk-doc/assets/benchmark/source_template.md` using the two shipped SOURCE.md files as structural models.

**Acceptance**: `test -f` checks exit 0 on both files.

### Phase 2: Delete the legacy trio and symlinks
- [x] `rm .opencode/skills/sk-doc/references/benchmarks/FORMAT.md`
- [x] `rmdir .opencode/skills/sk-doc/references/benchmarks`
- [x] `rm .opencode/skills/sk-doc/references/benchmarks_format.md`
- [x] `rm .opencode/skills/system-spec-kit/mcp_server/benchmarks/FORMAT.md`
- [x] `rm .opencode/skills/mcp-coco-index/mcp_server/benchmarks/FORMAT.md`

**Acceptance**: `test ! -e` checks exit 0 on all five paths.

### Phase 3: Update cross-link references
- [x] `sk-doc/assets/benchmark/benchmark_report_template.md`: update usage comment.
- [x] `system-spec-kit/mcp_server/benchmarks/README.md`: repoint FORMAT.md references.
- [x] `mcp-coco-index/mcp_server/benchmarks/README.md`: repoint FORMAT.md references.
- [x] 4 historical spec.md files in `016-embedder-testing-and-architecture`: update canonical-mechanics pointer.
- [x] `004-skill-local-benchmarks-format/{spec,plan,tasks,implementation-summary}.md`: append relocation historical note.

**Acceptance**: `rg` sweep for stale paths returns 0 matches outside this packet's own docs.

### Phase 4: Refresh Packet 006 spec docs
- [x] Update spec.md, plan.md, tasks.md, checklist.md and implementation-summary.md to describe the final consolidated design.

### Phase 5: Verify
- [x] SC-001..SC-007 checks (see spec.md).
- [x] `validate.sh --strict` on this packet.
- [x] `python3 .opencode/skills/sk-doc/scripts/validate_document.py --type readme` on both shipped benchmark_report.md files.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | N/A (documentation consolidation) | |
| Integration | `benchmark_report.md` ten-section validation on both shipped reports unchanged | `python3 .opencode/skills/sk-doc/scripts/validate_document.py --type readme` |
| Manual | Existence checks, deletion checks, rg stale-path sweep, validate.sh | Bash |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-doc/scripts/validate_document.py` | Internal | Green | SC-007 fallback = visual inspection + section count grep |
| `validate.sh --strict` | Internal | Green | SC-006 cannot be evidenced otherwise |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any SC fails post-consolidation.
- **Procedure**: `git revert <consolidation-commit>`. Single atomic commit covers all file creates, deletes and updates. No data migrations to reverse.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Author) --> Phase 2 (Delete) --> Phase 3 (Cross-links) --> Phase 4 (Refresh docs) --> Phase 5 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Author | None | 2, 3, 4, 5 |
| 2 Delete | 1 | 3, 4, 5 |
| 3 Cross-links | 1, 2 | 4, 5 |
| 4 Refresh docs | 3 | 5 |
| 5 Verify | 1, 2, 3, 4 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1 Author | Med | 1.5h (read sources + write 10-section reference + source_template) |
| 2 Delete | Low | 0.25h (5 bash commands) |
| 3 Cross-links | Low | 0.75h (template + 2 READMEs + 4 historical + 4 originating) |
| 4 Refresh docs | Med | 1.0h (5 spec docs rewritten) |
| 5 Verify | Low | 0.5h (SC checks + rg sweep + validate.sh) |
| **Total** | | **~4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Source materials read and understood.
- [x] No commits made during implementation (main agent commits after verification).

### Rollback Procedure
1. `git log --oneline -n 5 -- .opencode/skills/sk-doc/references/benchmark_creation.md` to identify the commit SHA.
2. `git revert <SHA>`. Single commit covers all changes atomically.
3. Re-run SC-001..SC-007 against the reverted state.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->

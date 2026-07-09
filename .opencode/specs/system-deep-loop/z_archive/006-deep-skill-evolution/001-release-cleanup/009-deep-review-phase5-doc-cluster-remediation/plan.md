---
title: "Implementation Plan: deep-review doc-cluster backlog remediation"
description: "Author 6 dedicated feature_catalog entries, update the root index, and annotate the 003-deep-review backlog with terminal states. Docs-only."
trigger_phrases:
  - "doc cluster remediation plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/001-release-cleanup/009-deep-review-phase5-doc-cluster-remediation"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "plan-authored"
    next_safe_action: "author-feature-catalog-entries"
    blockers: []
    key_files: ["plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000007012"
      session_id: "131-000-007-001-doc"
      parent_session_id: "131-000-007-001-doc"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2 | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: deep-review doc-cluster backlog remediation

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (feature_catalog docs) |
| **Framework** | sk-doc feature_catalog pattern, system-spec-kit validator |
| **Storage** | `.opencode/skills/deep-review/feature_catalog/` |
| **Testing** | Strict validator, `grep` term presence, HVR scan |

### Overview

Author 6 dedicated feature_catalog entries for the genuinely-open documentation gaps, matching the existing per-feature file pattern (OVERVIEW / CURRENT REALITY / SOURCE FILES / SOURCE METADATA). Content is sourced from the live reference docs. Update the root `feature_catalog.md` index and annotate the `003-deep-review` resource-map with terminal states for the verified-closed and won't-fix gaps.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 6 open gaps verified (no dedicated entry exists)
- [x] 4 already-closed gaps verified with citing artifact
- [x] 3 won't-fix gaps classified

### Definition of Done
- [ ] 6 entries authored + linked from index
- [ ] resource-map terminal-state annotations recorded
- [ ] Strict validate exits 0
- [ ] HVR clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### feature_catalog entry placement

| File | Group | Source content |
|------|-------|----------------|
| `01--loop-lifecycle/07-resource-map-coverage-gate.md` | loop lifecycle (synthesis output) | loop_protocol.md §synthesis section 8, state_format.md §7 |
| `01--loop-lifecycle/08-executor-selection-contract.md` | loop lifecycle (dispatch) | loop_protocol.md executor-selection lines |
| `02--state-management/06-graph-convergence-event.md` | state management (events) | state_format.md graph_convergence schema (lines 342-369) |
| `02--state-management/07-pause-sentinel.md` | state management (mechanism) | loop_protocol.md pause flow, state_format.md userPaused |
| `04--severity-system/06-convergence-signals.md` | severity system (stop signals) | convergence.md semanticNovelty + findingStability |
| `04--severity-system/07-security-sensitive-fix-overrides.md` | severity system (gate override) | convergence.md §Security-Sensitive Fix Overrides (SPEC-ONLY) |

Each new entry carries the same frontmatter (title, description) and section structure as `05-quality-gates.md`. The root index gains a summary row in the matching section and the per-category counts increment.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Verify each gap's current state (done during pre-build verification)
- [x] Author spec.md / plan.md / tasks.md / checklist.md

### Phase 2: Author entries
- [ ] 6 feature_catalog entries created from live-doc source content
- [ ] Root index updated with 6 rows + counts
- [ ] resource-map terminal-state annotations

### Phase 3: Verification
- [ ] grep each feature term resolves to a dedicated file
- [ ] HVR scan clean
- [ ] Strict validate exit 0
- [ ] implementation-summary.md filled
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Term presence | Each of 6 features has a dedicated file | `grep -rl` |
| Index consistency | Root index count matches disk file count | `find ... | wc -l` |
| HVR | All authored markdown | em-dash + semicolon + banned-word scan |
| Strict validate | Spec folder | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Live reference docs (content source) | Internal (read-only) | Green | Authoring blocked |
| `validate.sh` | Internal | Green | Phase exit blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An authored entry misstates a contract or breaks the index.
- **Procedure**: `git revert` the commit; docs-only, no runtime impact.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Author entries) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Author |
| Author | Setup | Verify |
| Verify | Author | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | done |
| Author | Med | 1-2 hours (6 entries + index) |
| Verify | Low | 20 min |
| **Total** | | **1.5-2.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All commits on `main`
- [ ] Scope-strict staging (this packet + feature_catalog + resource-map)

### Rollback Procedure
1. `git revert <commit-sha>`; docs-only.
2. Re-run strict validate.

### Data Reversal
- **Has data migrations?** No.
<!-- /ANCHOR:enhanced-rollback -->

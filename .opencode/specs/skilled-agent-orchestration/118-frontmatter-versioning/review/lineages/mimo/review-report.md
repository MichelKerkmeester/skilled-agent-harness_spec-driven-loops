# Review Report: 153-frontmatter-versioning

**Session**: fanout-mimo-1782210787185-rpc3p9
**Target**: .opencode/specs/skilled-agent-orchestration/118-frontmatter-versioning
**Generated**: 2026-06-23T18:30:00Z

---

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | CONDITIONAL |
| **Active P0** | 0 |
| **Active P1** | 3 |
| **Active P2** | 8 |
| **hasAdvisories** | true |
| **Total Iterations** | 5 |
| **Stop Reason** | maxIterationsReached (convergence math voted STOP at iter 5, blocked by active P1s) |
| **Release Readiness** | in-progress |
| **Dimension Coverage** | 4/4 (100%) |

**Scope**: Phase-parent spec with 5 child phases for retroactively versioning ~2,210 skill-doc frontmatter files with a 4-part `version: X.Y.Z.W` and enforcing the standard via validators and a CI gate.

**Summary**: The implementation is functionally complete — all 5 phases have implementation-summary.md files with verification tables showing PASS, the engine is deterministic and idempotent, and the corpus is fully versioned. The CONDITIONAL verdict is driven by documentation/traceability gaps: stale scaffolding in plan.md and tasks.md files (never updated from templates), a metadata status mismatch in graph-metadata.json, and minor cross-reference inaccuracies. No correctness or security defects were found.

---

## 2. Planning Trigger

The CONDITIONAL verdict (3 active P1 findings) routes to `/speckit:plan` for remediation. The P1 findings are all documentation/traceability gaps:

1. **F001 + F007**: plan.md and tasks.md files across all 5 phases are scaffold templates never updated. Remediation: populate them from the implementation-summary.md content, or formally adopt implementation-summary.md as the authoritative planning/task-tracking surface.
2. **F002**: graph-metadata.json `derived.status` is "planned" while the spec is complete. Remediation: re-run `generate-context.js` to refresh the metadata.

---

## 3. Active Finding Registry

### P1 — Required

| ID | Dimension | Title | File:Line | First/Last Seen | Status |
|----|-----------|-------|-----------|-----------------|--------|
| F001 | Correctness | tasks.md files are scaffold templates never updated | 001-versioning-standard/tasks.md:50 | iter 1/1 | active |
| F002 | Correctness | graph-metadata.json derived.status is 'planned' while spec is complete | graph-metadata.json:41 | iter 1/1 | active |
| F007 | Traceability | plan.md files are scaffold templates never updated | 001-versioning-standard/plan.md:44 | iter 3/3 | active |

### P2 — Suggestion (Advisories)

| ID | Dimension | Title | File:Line | First/Last Seen | Status |
|----|-----------|-------|-----------|-----------------|--------|
| F003 | Traceability | No checklist.md exists at parent or child level | spec.md:1 | iter 1/1 | active |
| F004 | Correctness | Spec states ~2500 files but actual count is 2222 | spec.md:74 | iter 1/1 | active |
| F005 | Maintainability | Build segment cap at 99 undocumented in spec | 002-derivation-engine/implementation-summary.md:113 | iter 1/1 | active |
| F006 | Security | No explicit path boundary validation on file writes | frontmatter-version.mjs:295 | iter 2/2 | active |
| F008 | Traceability | Parent spec says ~436 core docs but Phase 3 versioned 457 | spec.md:103 | iter 3/3 | active |
| F009 | Traceability | description.json description field truncated mid-sentence | description.json:4 | iter 3/3 | active |
| F010 | Maintainability | Unused variable trailing in applyVersion | frontmatter-version.mjs:292 | iter 4/4 | active |
| F011 | Maintainability | Anchor cache grows unbounded during corpus-wide run | frontmatter-version.mjs:144 | iter 4/4 | active |

---

## 4. Remediation Workstreams

### Workstream 1: Documentation Surface Alignment (F001, F007)
**Priority**: High (P1)
**Action**: Either populate plan.md and tasks.md from implementation-summary.md, or formally document that implementation-summary.md is the authoritative planning/task-tracking surface for this workflow pattern.
**Effort**: Low (mechanical copy or documentation update)

### Workstream 2: Metadata Refresh (F002, F009)
**Priority**: High (P1 for F002)
**Action**: Re-run `generate-context.js` on the spec folder to refresh graph-metadata.json derived.status and regenerate description.json with the full description.
**Effort**: Low (single script run)

### Workstream 3: Documentation Accuracy (F004, F005, F008)
**Priority**: Low (P2)
**Action**: Update spec.md file counts and core docs count to match actuals. Document the W_CAP=99 constraint in the versioning standard reference.
**Effort**: Low (text edits)

### Workstream 4: Code Quality (F006, F010, F011)
**Priority**: Low (P2)
**Action**: Add path boundary check to applyVersion, remove dead `trailing` variable, consider cache eviction for large corpus runs.
**Effort**: Low (minor code changes)

---

## 5. Spec Seed

No functional spec changes needed. The implementation correctly follows the spec's design. Minor spec accuracy updates:

- Update file count from "~2,500" to "~2,222" in spec.md:74
- Update core docs count from "~436" to "457" in spec.md:103
- Document W_CAP=99 in the versioning standard (or in spec.md)

---

## 6. Plan Seed

```yaml
remediation_plan:
  - task: "Populate plan.md and tasks.md from implementation-summary.md for all 5 phases"
    findings: [F001, F007]
    priority: P1
    effort: low
  - task: "Re-run generate-context.js to refresh graph-metadata.json and description.json"
    findings: [F002, F009]
    priority: P1
    effort: low
  - task: "Create checklist.md at parent and child level"
    findings: [F003]
    priority: P2
    effort: medium
  - task: "Update spec.md file counts to match actuals"
    findings: [F004, F008]
    priority: P2
    effort: low
  - task: "Document W_CAP=99 in versioning standard"
    findings: [F005]
    priority: P2
    effort: low
  - task: "Add path boundary check to applyVersion"
    findings: [F006]
    priority: P2
    effort: low
  - task: "Remove dead trailing variable"
    findings: [F010]
    priority: P2
    effort: low
```

---

## 7. Traceability Status

### Core Protocols (hard-gated)

| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| spec_code | partial | hard | No code implementation files in spec folder; spec-only packet. Implementation lives in sk-doc scripts. |
| checklist_evidence | fail | hard | No checklist.md exists at any level. Level 2 requires checklist.md. |

### Overlay Protocols (advisory)

| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| feature_catalog_code | N/A | advisory | Not a skill target |
| playbook_capability | N/A | advisory | Not a skill target |

**Note**: The spec_code protocol is partial because this is a spec-only packet — the actual code implementation lives in `.opencode/skills/sk-doc/scripts/`. The spec claims are verified against the implementation-summary.md files, which document the actual code behavior and verification results.

---

## 8. Deferred Items

| ID | Category | Description | Reason |
|----|----------|-------------|--------|
| F003 | traceability | No checklist.md exists | P2 advisory; requires creating checklists for 6 spec folders |
| F005 | maintainability | W_CAP=99 undocumented in spec | P2 advisory; minor documentation gap |
| F006 | security | No path boundary check | P2 advisory; low practical risk for developer tool |
| F010 | maintainability | Dead code in applyVersion | P2 advisory; cosmetic |
| F011 | maintainability | Unbounded anchor cache | P2 advisory; negligible at current scale |

---

## 9. Audit Appendix

### Iteration Summary

| Iteration | Focus | Dimensions | New Findings | Ratio | Status |
|-----------|-------|------------|--------------|-------|--------|
| 1 | Correctness | correctness | 5 (2 P1, 3 P2) | 1.0 | complete |
| 2 | Security | security | 1 (1 P2) | 0.17 | complete |
| 3 | Traceability | traceability | 3 (1 P1, 2 P2) | 0.33 | complete |
| 4 | Maintainability | maintainability | 2 (2 P2) | 0.14 | complete |
| 5 | Stabilization | all | 0 | 0.0 | complete |

### Convergence Signal Replay

| Signal | Iter 3 | Iter 4 | Iter 5 | Vote |
|--------|--------|--------|--------|------|
| Rolling Avg (last 2) | N/A | 0.235 | 0.07 | STOP |
| MAD Noise Floor | N/A | 0.14 ≤ floor | 0.0 ≤ floor | STOP |
| Dimension Coverage | 3/4 | 4/4 | 4/4 + stabilized | STOP |
| **Composite Score** | N/A | N/A | 1.00 | STOP candidate |

### Legal-Stop Gate Results (Iteration 5)

| Gate | Pass | Detail |
|------|------|--------|
| convergenceGate | YES | All convergence signals below stop thresholds |
| dimensionCoverageGate | YES | All 4 dimensions covered, stabilization pass complete |
| p0ResolutionGate | YES | No active P0 findings |
| evidenceDensityGate | YES | All findings have file:line evidence |
| hotspotSaturationGate | YES | All files reviewed at least once |
| claimAdjudicationGate | YES | All P1 findings have adjudication packets |
| fixCompletenessReplayGate | YES | Not a security-sensitive fix rerun |
| candidateCoverageGate | YES | v2 search path inactive |
| graphlessFallbackGate | YES | Graph available |

### Verdict Determination

- Active P0: 0
- Active P1: 3 → verdict = CONDITIONAL
- Active P2: 8 → hasAdvisories = true
- **Final Verdict: CONDITIONAL**

### Severity Distribution

| Severity | Active | Resolved | Total |
|----------|--------|----------|-------|
| P0 | 0 | 0 | 0 |
| P1 | 3 | 0 | 3 |
| P2 | 8 | 0 | 8 |
| **Total** | **11** | **0** | **11** |

### Files Reviewed

| Category | Count | Files |
|----------|-------|-------|
| Spec documents | 7 | spec.md (parent + 5 children) |
| Planning documents | 6 | plan.md (5 children) + graph-metadata.json |
| Task documents | 5 | tasks.md (5 children) |
| Implementation summaries | 5 | implementation-summary.md (5 children) |
| Implementation scripts | 4 | frontmatter-version.mjs, check-frontmatter-versions.sh, quick_validate.py, package_skill.py |
| Test files | 1 | test_frontmatter_version.mjs |
| Reference docs | 1 | frontmatter_versioning.md |
| Metadata | 2 | description.json, graph-metadata.json |
| **Total** | **31** | |

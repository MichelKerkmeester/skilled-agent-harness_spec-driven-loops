# Review Report: Reorg Verification — 027 XCE-Derived Spec Kit Refinement

## 1. Executive Summary

- **Verdict**: CONDITIONAL
- **Active P0**: 0 | **Active P1**: 2 | **Active P2**: 5
- **hasAdvisories**: true
- **Scope**: Phase-parent reorganization verification of `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/`. Reviewed structural integrity, security, traceability, and maintainability of the six-track reorganization that groups 30 former top-level phases under themed parent tracks.
- **Stop Reason**: Convergence — all 4 dimensions covered, rolling newFindingsRatio 0.06 < 0.08 threshold, stabilization passes 3 >= 1 required. No P0 findings.
- **Iterations**: 4 (max: 5)
- **Session**: fanout-deepseek-1781423033387-5rmxex | Lineage: new | Generation: 1
- **Lineage**: deepseek (fan-out)

## 2. Planning Trigger

The CONDITIONAL verdict is driven by 2 active P1 findings related to metadata staleness from the six-track reorganization. These do not block release but require remediation before the packet can be considered fully aligned. Route to `/speckit:plan` for metadata refresh work.

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | File:Line | First Seen | Last Seen | Status |
|----|----------|-----------|-------|-----------|------------|-----------|--------|
| F001 | P1 | correctness | graph-metadata.json `key_files` contains stale pre-reorg path | graph-metadata.json:55 | 1 | 4 | active |
| F002 | P1 | correctness | resource-map.md is stale point-in-time snapshot from before six-track reorg | resource-map.md:33 | 1 | 4 | active |
| F003 | P2 | correctness | description.json has stale `description` field from wrong phase | description.json:36 | 1 | 4 | active |
| F004 | P2 | correctness | description.json `specFolder` uses short form inconsistent with graph-metadata.json | description.json:35 | 1 | 4 | active |
| F005 | P2 | security | handover.md contains ephemeral /tmp/ path references | handover.md:42 | 2 | 4 | active |
| F006 | P2 | traceability | changelog directory uses old numbering; no per-track changelog indexes | changelog/ | 3 | 4 | active |
| F007 | P2 | maintainability | No single-lookup phase status summary for new maintainers | spec.md:122 | 4 | 4 | active |

### F001 Detail
graph-metadata.json `key_files` contains `"001-peck-teachings-adoption/spec.md"` which does not resolve from the 027 root under the six-track structure. The correct path is `001-research-and-doctrine/001-peck-teachings-adoption/spec.md`. Consumers reading key_files for path resolution would encounter a broken reference.

### F002 Detail
resource-map.md declares itself a "point-in-time snapshot (2026-06-04)" and explicitly states it "does not enumerate the later-shipped phases, now grouped under the six themed tracks (000-005)." Since `resource_map_present: true` enables the Resource Map Coverage Gate in review protocol, a stale map undermines that audit.

## 4. Remediation Workstreams

### Lane 1: Metadata Refresh (P1 — F001, F002, F003, F004)
- **F001**: Update `graph-metadata.json` key_files to use current six-track paths. Regenerate key_files from current disk state.
- **F002**: Regenerate `resource-map.md` to include the current six-track structure, or update config to set `resource_map_present: false` if the file is intentionally historical.
- **F003**: Update `description.json` description field to match 027's actual scope.
- **F004**: Standardize `specFolder` field format across description.json and graph-metadata.json.

### Lane 2: Documentation Improvements (P2 — F005, F006, F007)
- **F005**: Note in handover.md that /tmp/ paths are ephemeral (or remove them in the next handover regeneration).
- **F006**: Consider adding per-track changelog index files or symlinks for easier navigation.
- **F007**: Consider generating a "Phase Status Summary" table in spec.md or a child document listing all child phases with implementation status.

## 5. Spec Seed

- **Spec amendment**: Add explicit metadata freshness requirement to phase-parent reorganization spec: "After reorganization, regenerate graph-metadata.json key_files and description.json from current disk state."
- **Spec amendment**: Clarify resource-map.md lifecycle: "resource-map.md must be regenerated after any structural reorganization that changes phase paths."
- **Spec amendment**: Add `description.json` `specFolder` format requirement: "Must use fully-qualified path format (e.g., system-spec-kit/027-...) consistent with graph-metadata.json."

## 6. Plan Seed

| Task | Lane | Finding(s) | Files |
|------|------|-----------|-------|
| T1 | Metadata Refresh | F001 | graph-metadata.json: regenerate key_files |
| T2 | Metadata Refresh | F002 | resource-map.md: regenerate or mark inactive |
| T3 | Metadata Refresh | F003 | description.json: update description field |
| T4 | Metadata Refresh | F004 | description.json: align specFolder format |
| T5 | Docs | F005 | handover.md: add ephemeral-path note |
| T6 | Docs | F006 | changelog/: add per-track index files |
| T7 | Docs | F007 | spec.md or new doc: add phase status summary |

## 7. Traceability Status

| Protocol | Level | Status | Gate | Notes |
|----------|-------|--------|------|-------|
| `spec_code` | core | partial | hard | Phase map matches disk (6/6). 3 metadata drift issues (F001, F002, F003/F004). All normative claims verified. |
| `checklist_evidence` | core | notApplicable | hard | No checklist.md at phase-parent level. Expected per content discipline rules. |
| `feature_catalog_code` | overlay | notApplicable | advisory | No feature catalog at phase-parent level. |
| `playbook_capability` | overlay | notApplicable | advisory | No manual playbook at phase-parent level. |

## 8. Resource Map Coverage Gate

- **Touched entries**: 2 of 27 — `graph-metadata.json` (Updated), `resource-map.md` (Created). These were analyzed for staleness during the review.
- **Untouched entries (`expected-by-scope`)**: 0 — all 27 resource-map entries are Skills (16) and Specs (11) that fall outside the phase-parent structural review scope. The Skills entries are implementation targets tracked by child phases. The Spec entries are provenance records.
- **Untouched entries (`gap`)**: 0 — no resource-map entries are within the phase-parent review scope but untracked.
- **Implementation paths absent from map**: 1 — `004-shared-infrastructure/008-mcp-config-alignment-reelection-default` (exists on disk, visible in timeline.md, but absent from resource-map.md). This is expected since the resource map is a pre-reorg snapshot.

**Coverage gate verdict**: The resource map is stale (F002) and does not reflect the current six-track structure. The review scope (phase-parent structural integrity) does not require coverage of the 16 Skills entries tracked in the map (those are child-phase implementation targets). The gate is advisory: the map should be regenerated to stay consistent with `resource_map_present: true`.

## 9. Deferred Items

- F005: /tmp/ paths in handover.md — low severity, informational. Defer to next handover regeneration cycle.
- F006: Changelog directory navigation — low severity, exists as documentation task.
- F007: Phase status summary — low severity, nice-to-have documentation improvement.

## 10. Audit Appendix

### Iteration Summary

| Iteration | Focus | Status | Dimensions | Ratio | Findings |
|-----------|-------|--------|------------|-------|----------|
| 1 | D1 Correctness | complete | correctness | 0.75 | 0 P0, 2 P1, 2 P2 |
| 2 | D2 Security | complete | correctness, security | 0.06 | 0 P0, 0 P1, 1 P2 |
| 3 | D3 Traceability | complete | correctness, security, traceability | 0.06 | 0 P0, 0 P1, 1 P2 |
| 4 | D4 Maintainability | complete | all | 0.06 | 0 P0, 0 P1, 1 P2 |

### Convergence Signals

| Signal | Weight | Value | Threshold | Pass |
|--------|--------|-------|-----------|------|
| Rolling Average (last 2) | 0.30 | 0.06 | < 0.08 | YES |
| MAD Noise Floor | 0.25 | stable (0.06 ×3) | n/a | YES |
| Dimension Coverage | 0.45 | 4/4 (100%) | 100% | YES |
| Composite Stop Score | — | 1.00 | > 0.60 | YES |

### Dimension Breakdown

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1 | 2 P1 (stale key_files, stale resource-map) + 2 P2 (description.json drift) |
| D2 Security | PASS | 2 | 0 P0/P1; 1 P2 (/tmp/ paths in handover, advisory only) |
| D3 Traceability | PASS | 3 | 0 P0/P1; 1 P2 (changelog navigability) |
| D4 Maintainability | PASS | 4 | 0 P0/P1; 1 P2 (discoverability for new maintainers) |

### File Coverage Matrix

| File | D1 | D2 | D3 | D4 |
|------|:--:|:--:|:--:|:--:|
| spec.md | x | x | x | x |
| context-index.md | x | x | x | x |
| graph-metadata.json | x | x | x | x |
| description.json | x | x | x | x |
| resource-map.md | x | x | x | x |
| handover.md | x | x | x | x |
| before-vs-after.md | x | x | x | x |
| timeline.md | x | x | x | x |
| changelog/README.md | — | — | x | — |

### Replay Validation
Convergence outcome recomputed from JSONL state:
- Stored convergence signals match recomputed values
- Dimension coverage: 4/4 stored = 4/4 recomputed
- Rolling average: 0.06 stored = 0.06 recomputed
- Verdict: CONDITIONAL consistent with 2 active P1 findings
- Replay: PASS

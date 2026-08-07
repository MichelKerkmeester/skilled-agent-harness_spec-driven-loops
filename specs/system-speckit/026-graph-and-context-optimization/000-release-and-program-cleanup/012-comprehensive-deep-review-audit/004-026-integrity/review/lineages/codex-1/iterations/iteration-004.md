# Iteration 004: Maintainability

## Focus
Maintainability pass over resource-map usability and changelog convention drift.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 5
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.12

## Findings

### P2, Suggestion
- **F004**: Resource map still carries stale OK rows for renamed paths - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:44` - The resource map correctly warns that it is stale and says not to navigate from it [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:24], but its summary still says `Missing on disk: 0` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:44] and individual rows mark old paths like `000-release-cleanup/spec.md` as `OK` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:62]. The migration bridge says that old phase was renamed to `000-release-and-program-cleanup/` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/context-index.md:138]. This is advisory because the warning is explicit, but the table status values remain misleading.

- **F005**: Recent changelog entries violate the declared voice/template rules - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:44` - The changelog README says voice rules are non-negotiable: no em-dashes, no semicolons, no Oxford commas [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:44]. Recent entries contain both forbidden punctuation forms, for example `changelog-010-003-scouted-bugfix-batch-3.md` uses em-dash separators and semicolons in the main summary [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/000-release-and-program-cleanup/changelog-010-003-scouted-bugfix-batch-3.md:25], and `changelog-006-006-doctor-install-alignment.md` uses semicolon-separated clauses in multiple changed bullets [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-006-006-doctor-install-alignment.md:35] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-006-006-doctor-install-alignment.md:37].

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| feature_catalog_code | partial | advisory | `resource-map.md:24`, `resource-map.md:44`, `resource-map.md:62` | Stale catalog is caveated but status values remain misleading. |
| playbook_capability | partial | advisory | `changelog/README.md:44`, sampled changelog entries | Changelog convention is documented but not followed. |

## Assessment
- New findings ratio: 0.12
- Dimensions addressed: maintainability
- Novelty justification: Two advisory findings, no new P0/P1.

## Ruled Out
- Treating F004 as P1: the resource-map warning is explicit enough to avoid a required severity.

## Dead Ends
- Full voice sweep across every changelog was not attempted because representative examples already establish convention drift.

## Recommended Next Focus
Run one stabilization pass to verify no new P0/P1 classes remain.
Review verdict: PASS

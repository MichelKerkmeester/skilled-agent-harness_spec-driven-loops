# Iteration 003 - Traceability

## Focus

Spec/code and changelog/file traceability: rollup link integrity, resource-map path truth, and completion-claim reconciliation across sampled recent/high-activity packets.

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/002-spec-kit-internals/changelog-002-spec-kit-internals-root.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-006-operator-tooling-root.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/002-spec-kit-internals/changelog-002-004-literal-spec-folder-names.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/002-spec-kit-internals/changelog-002-005-validate-recursive-orchestrator-fix.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/002-spec-kit-internals/changelog-002-006-orchestrator-placeholder-parity.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-006-004-runtime-agnostic-session-lifecycle-scripts.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-006-005-worktree-per-session-automation.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/006-doctor-install-alignment/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/006-doctor-install-alignment/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/006-doctor-install-alignment/graph-metadata.json`

## Findings

### DR-C5-F003 - P1 - Top-level rollups contain broken child links for existing changelogs

The changelog index says per-directory rollups are the authoritative child inventory [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:45]. Two sampled top-level rollups point several child groups to non-existent sibling `changelog/` directories rather than the actual changelog files in the same folder. In `002-spec-kit-internals`, rows 004, 005, and 006 link to `./../004.../changelog/`, `./../005.../changelog/`, and `./../006.../changelog/` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/002-spec-kit-internals/changelog-002-spec-kit-internals-root.md:30]. The actual leaf changelogs exist in the same `002-spec-kit-internals` changelog folder [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/002-spec-kit-internals/changelog-002-004-literal-spec-folder-names.md:21] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/002-spec-kit-internals/changelog-002-005-validate-recursive-orchestrator-fix.md:19] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/002-spec-kit-internals/changelog-002-006-orchestrator-placeholder-parity.md:21].

The same pattern appears in `006-operator-tooling`: rows 004 and 005 link to non-existent sibling `changelog/` directories [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-006-operator-tooling-root.md:30], while the actual leaf changelogs are in the same folder [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-006-004-runtime-agnostic-session-lifecycle-scripts.md:17] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-006-005-worktree-per-session-automation.md:19].

Impact: the "authoritative child inventory" sends readers to dead paths for shipped phases. This breaks changelog traceability even though the leaf changelog artifacts exist.

Recommendation: replace the five dead directory links with the actual `changelog-*.md` files, or add proper child rollup files if these are intended to be phase-parent groups.

#### Claim Adjudication Packet

```json
{
  "findingId": "DR-C5-F003",
  "claim": "Top-level changelog rollups contain broken child links for shipped child changelog artifacts.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:45",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/002-spec-kit-internals/changelog-002-spec-kit-internals-root.md:30",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-006-operator-tooling-root.md:30",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/002-spec-kit-internals/changelog-002-004-literal-spec-folder-names.md:21",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-006-004-runtime-agnostic-session-lifecycle-scripts.md:17"
  ],
  "counterevidenceSought": "Validated target paths on disk and searched the same changelog folders for matching leaf changelog files.",
  "alternativeExplanation": "The rows may have been generated from source spec-folder locations rather than changelog artifact locations, but in the changelog tree those links are dead.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade to P2 if downstream renderers rewrite these links to live artifacts automatically."
}
```

### DR-C5-F004 - P1 - Resource map marks missing historical paths as OK

The resource map warns it is a stale pre-wave-4 catalog and says not to navigate from it [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:24], but its summary still claims `Missing on disk: 0` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:44]. Rows in the main table mark old paths such as `000-release-cleanup/spec.md`, `004-runtime-executor-hardening/spec.md`, `006-skill-advisor/spec.md`, and `007-hook-parity/spec.md` as `OK` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:62] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:66] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:75] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:77]. Direct filesystem probes showed those cited paths are absent in the current tree.

Impact: the warning reduces navigation risk, but the table-level status data is still false. Automated or skim-based audits that consume the status columns will conclude the historical paths are valid.

Recommendation: either regenerate the resource map against the current eight-track tree or change historical rows to a non-OK status with a current-home pointer from `context-index.md`.

#### Claim Adjudication Packet

```json
{
  "findingId": "DR-C5-F004",
  "claim": "The root resource map marks missing historical paths as OK and claims zero missing files.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:24",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:44",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:62",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:66",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:75",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:77"
  ],
  "counterevidenceSought": "Checked the old paths on disk; sampled rows were missing.",
  "alternativeExplanation": "The warning may intend the map to be historical only, but the status vocabulary and OK statuses still make current existence claims.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade to P2 if all consumers treat this resource map as historical prose and ignore status columns."
}
```

### DR-C5-F005 - P1 - Completion metadata remains unreconciled after shipped packets

The sampled `006-doctor-install-alignment` packet has `spec.md` status `Complete` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/006-doctor-install-alignment/spec.md:47] and an implementation summary with `Completed` date `2026-06-02` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/006-doctor-install-alignment/implementation-summary.md:44]. Its changelog states the alignment work corrected the audited misalignments and final checks passed [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-006-006-doctor-install-alignment.md:25]. The same packet's `graph-metadata.json` still reports `derived.status = "in_progress"` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/006-doctor-install-alignment/graph-metadata.json:34].

Impact: completion search and graph traversal will classify at least this shipped packet as unfinished. A quick sample scan found 17 live folders where `spec.md` says `Complete` while graph metadata is not `complete`, so this is not isolated.

Recommendation: run the metadata reconciliation/backfill for completed packets and add a completion-gate check that rejects `spec.md` Complete plus graph `in_progress` mismatches.

#### Claim Adjudication Packet

```json
{
  "findingId": "DR-C5-F005",
  "claim": "Completed packets still have graph metadata marked in_progress.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/006-doctor-install-alignment/spec.md:47",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/006-doctor-install-alignment/implementation-summary.md:44",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-006-006-doctor-install-alignment.md:25",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/006-doctor-install-alignment/graph-metadata.json:34"
  ],
  "counterevidenceSought": "Checked whether graph metadata had another completion field outside derived.status; the sampled metadata did not.",
  "alternativeExplanation": "The packet may still need validate/commit metadata despite shipped content, but spec, implementation summary, and changelog all present the work as complete.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade to P2 if graph traversal ignores derived.status for completion filtering."
}
```

## Traceability Checks

| Protocol | Status | Summary |
|----------|--------|---------|
| spec_code | partial | The review-slice spec's requested control/changelog audit was executed on sampled surfaces; defects found. |
| checklist_evidence | pass | No checklist.md exists for this Level 1 review slice, so no checked rows require evidence. |
| feature_catalog_code | partial | Changelog aggregate claims disagree with live files. |
| playbook_capability | partial | Rollup navigation links are broken for sampled shipped phases. |
| resource_map_coverage | fail | Root resource-map status columns disagree with the live tree. |

## New Information Ratio

`0.60` - three new P1 traceability defects added to the active registry.

Review verdict: CONDITIONAL

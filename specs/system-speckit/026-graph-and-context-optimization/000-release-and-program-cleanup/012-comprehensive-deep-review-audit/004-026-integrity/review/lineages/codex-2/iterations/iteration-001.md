# Iteration 001: Correctness and Program Control Reconciliation

Focus dimension: correctness.

Files reviewed:

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/context-index.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/timeline.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md`
- Sampled top rollups and recent/high-activity packet metadata under tracks `000`, `002`, `003`, `006`, and `007`.

## Findings

### F001 - P1 - Root last-active pointer is stale

Category: completion-claim-reconciliation

Finding class: stale-control-pointer

Content hash: `sha256:218735e7214f4d222761229c569ac727dc36078f244f7a5ab2b26df38ce1c3a8`

The parent spec directs readers to `graph-metadata.json` for `derived.last_active_child_id` and says it points to the most recently active track [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:139]. `context-index.md` repeats that the root pointer was reconciled to `004-code-graph` as the most recently active track [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/context-index.md:121] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/context-index.md:122]. The generated timeline ranks `006-operator-tooling`, `003-memory-and-causal-runtime`, and `000-release-and-program-cleanup` as newer than `004-code-graph` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/timeline.md:76] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/timeline.md:77] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/timeline.md:78] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/timeline.md:81], while metadata still points to `004-code-graph` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json:156].

Impact: resume and navigation flows that trust `last_active_child_id` can send operators to the wrong track after newer program work.

Concrete fix: update `graph-metadata.json` and the two explanatory docs to either point at the true latest track or explicitly redefine the pointer as something other than most-recent activity.

Claim adjudication:

```json
{
  "findingId": "F001",
  "claim": "The root last-active pointer still names 004-code-graph even though the generated timeline shows newer track activity elsewhere.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:139",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/context-index.md:121",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/context-index.md:122",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/timeline.md:76",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/timeline.md:77",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/timeline.md:78",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/timeline.md:81",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json:156"
  ],
  "counterevidenceSought": "Checked whether the docs scoped last_active_child_id to a fixed milestone rather than recency; the cited lines explicitly call it most-recent activity.",
  "alternativeExplanation": "The pointer may intentionally preserve the most recent track as of the older Wave 5 reconciliation, but that makes the current docs stale after Wave 8 and the regenerated timeline.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade to P2 if maintainers redefine last_active_child_id as a historical pointer and update user-facing docs to stop promising recency."
}
```

### F002 - P1 - Resource map reports missing old paths as OK

Category: resource-map-coverage

Finding class: stale-resource-map-status

Content hash: `sha256:f16e4f6500ba67d3ef4c0a46d4414857573622360f091eae779318471774982d`

The resource map warns that it is stale and says not to navigate from it [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:24] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:27], but its summary still reports `Missing on disk: 0` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:44]. Rows then mark pre-reorg paths as `OK`, including `000-release-cleanup/spec.md`, `002-resource-map-deep-loop-fix/spec.md`, `004-runtime-executor-hardening/spec.md`, `005-memory-indexer-invariants/spec.md`, `006-skill-advisor/spec.md`, and `007-hook-parity/spec.md` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:62] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:64] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:66] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:71] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:75] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:77]. The same file defines `OK` as existing on disk [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:49].

Impact: the stale warning helps a human, but the status table remains internally false and unsafe for any audit or tooling path that consumes the table rows.

Concrete fix: either regenerate the resource map or convert stale rows to historical/migrated entries that do not use `OK` and do not claim zero missing paths.

Claim adjudication:

```json
{
  "findingId": "F002",
  "claim": "The resource map claims zero missing paths and marks old paths OK even though those paths are pre-reorg and absent from the current tree.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:24",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:27",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:44",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:49",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:62",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:64",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:66",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:71",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:75",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:77"
  ],
  "counterevidenceSought": "Checked whether the stale warning neutralizes row semantics; the same table still defines OK as exists on disk and records Missing on disk as 0.",
  "alternativeExplanation": "The map is intentionally historical, but the row vocabulary and summary counters still present live filesystem status.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade to P2 if the map is explicitly removed from all active control and audit surfaces."
}
```

### F003 - P1 - Changelog index and linked rollups are stale

Category: changelog-accuracy

Finding class: stale-changelog-index

Content hash: `sha256:eb699bacc9b0a54e6dd47b0e246faafb80a1b1ddb26b294cae03d811bf50b65a`

The program README says the full coverage report lives under `001-changelog-backfill-and-audit/audit-report.md` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:14], but the actual changelog-backfill packet identifies itself as `002-changelog-backfill-and-audit` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/008-docs-and-catalogs-rollup/002-changelog-backfill-and-audit/spec.md:14] and its audit report exists under the `002-...` folder [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/008-docs-and-catalogs-rollup/002-changelog-backfill-and-audit/audit-report.md:13].

The same README table claims exact leaf counts for `000` and `003` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:20] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:23], but the current changelog tree contains additional leaf files in both tracks. The linked top rollups also fail the README's own promise that per-directory rollups are the authoritative child inventory [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:45]: `000` claims one child phase [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/000-release-and-program-cleanup/changelog-000-release-and-program-cleanup-root.md:21], and `003` claims nine [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/003-memory-and-causal-runtime/changelog-003-memory-and-causal-runtime-root.md:21], while their track folders contain far more current leaf and root changelog files.

Impact: the control surface that is supposed to help users navigate 026 changelog coverage now points to a missing audit path and stale rollups. This undermines the release/audit traceability goal of the target slice.

Concrete fix: fix the README audit-report path, recompute the exact per-track counts, and regenerate the top rollups so their Included Phases tables match the current flat changelog tree.

Claim adjudication:

```json
{
  "findingId": "F003",
  "claim": "The changelog README and its top rollups no longer match the current changelog tree.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:14",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/008-docs-and-catalogs-rollup/002-changelog-backfill-and-audit/spec.md:14",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/008-docs-and-catalogs-rollup/002-changelog-backfill-and-audit/audit-report.md:13",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:20",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:23",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:45",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/000-release-and-program-cleanup/changelog-000-release-and-program-cleanup-root.md:21",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/003-memory-and-causal-runtime/changelog-003-memory-and-causal-runtime-root.md:21"
  ],
  "counterevidenceSought": "Checked whether the linked path exists under 001 and sampled the actual backfill packet under 002; checked current track file counts against the README table.",
  "alternativeExplanation": "The README may have been correct before later gap backfills, but it is stale against the current tree.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade to P2 if maintainers remove the exact-count and authoritative-rollup promises and treat the README as historical only."
}
```

### F004 - P1 - `006-doctor-install-alignment` completion status disagrees across spec and metadata

Category: completion-claim-reconciliation

Finding class: status-mismatch

Content hash: `sha256:38f12f30dd78b80006e9c3ab3153bfe80fc5dd6ab01af08dd3d4f76dfb7fa0cc`

The sampled recent packet `006-operator-tooling/006-doctor-install-alignment` marks its spec status as Complete [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/006-doctor-install-alignment/spec.md:47]. Its graph metadata still reports `derived.status` as `in_progress` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/006-doctor-install-alignment/graph-metadata.json:34], even though the same metadata summary describes final verification as clean [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/006-doctor-install-alignment/graph-metadata.json:42].

Impact: memory search, graph traversal, and audit dashboards can classify a completed packet as still active, which is exactly the completion-claim drift this slice is meant to catch.

Concrete fix: reconcile `graph-metadata.json` to the spec status after verifying the completion evidence, or revise `spec.md` if the packet is not actually complete.

Claim adjudication:

```json
{
  "findingId": "F004",
  "claim": "006-doctor-install-alignment has Complete in spec.md but in_progress in graph-metadata.json.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/006-doctor-install-alignment/spec.md:47",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/006-doctor-install-alignment/graph-metadata.json:34",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/006-doctor-install-alignment/graph-metadata.json:42"
  ],
  "counterevidenceSought": "Checked adjacent metadata for signs the packet was intentionally still active; the causal summary instead describes final verification as clean.",
  "alternativeExplanation": "The graph metadata may not have been regenerated after the spec was moved to Complete.",
  "finalSeverity": "P1",
  "confidence": 0.93,
  "downgradeTrigger": "Downgrade to P2 if the graph metadata field is documented as non-authoritative and excluded from status routing."
}
```

## Traceability Checks

| Protocol | Status | Gate | Evidence |
|---|---|---|---|
| spec_code | partial | hard | Program integrity slice requires control/changelog accuracy; four concrete mismatches found. |
| checklist_evidence | partial | hard | Target packet is Level 1 and has no checklist; sampled child packet status evidence instead. |
| feature_catalog_code | partial | advisory | Resource map/changelog index catalog surfaces contain stale status/count/link claims. |
| playbook_capability | partial | advisory | No playbook capability claims found in this iteration's scope. |

## No P0 Adversarial Self-Check

No P0 findings were asserted in this iteration, so the P0 replay path is not applicable.

Review verdict: CONDITIONAL

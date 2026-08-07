# Iteration 001 - Correctness

## Focus

Correctness of root control claims, chronology pointers, and aggregate changelog counts.

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/timeline.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/**`

## Findings

### DR-C5-F001 - P1 - Root last-active child pointer is stale

The root spec says `graph-metadata.json` points to the most recently active track [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:139]. The metadata still points to `004-code-graph` with `last_active_at` `2026-05-29T18:21:38+02:00` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json:156]. The timeline now reports the most recent live folder as `000-release-and-program-cleanup/010-scouted-bugfix-train/003-scouted-bugfix-batch-3` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/timeline.md:41], and the track recency table places `006`, `003`, and `000` ahead of `004` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/timeline.md:76].

Impact: parent resume/navigation can route operators to stale 004 work instead of the current active track. This is a control-surface correctness issue, not a cosmetic timestamp drift.

Recommendation: regenerate or patch root `graph-metadata.json` so `derived.last_active_child_id` and `derived.last_active_at` agree with the current timeline, then update the parent continuity timestamp.

#### Claim Adjudication Packet

```json
{
  "findingId": "DR-C5-F001",
  "claim": "The root last-active child pointer is stale relative to the root spec claim and generated timeline.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:139",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json:156",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/timeline.md:41",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/timeline.md:76"
  ],
  "counterevidenceSought": "Checked whether timeline itself still identified 004 as the most recent track; it does not.",
  "alternativeExplanation": "The graph metadata could intentionally lag because it was not regenerated after June 3 work, but the root spec presents it as the current last-active pointer.",
  "finalSeverity": "P1",
  "confidence": 0.93,
  "downgradeTrigger": "Downgrade to P2 if parent resume logic no longer consumes derived.last_active_child_id."
}
```

### DR-C5-F002 - P1 - Program changelog index undercounts live leaf changelogs

The changelog index claims leaf counts of 128 for track 000 [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:20], 240 for track 003 [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:23], and 76 for track 004 [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:24]. A direct on-disk count of non-`root.md` changelog files in those track folders returned 129, 257, and 77 respectively.

Impact: the program-level changelog index is no longer a reliable coverage summary. This matters because the same README says every shipped phase has a packet-local changelog and each parent has a rollup [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:14].

Recommendation: regenerate the track-count table from the actual changelog folders, then rerun link validation on the rollups.

#### Claim Adjudication Packet

```json
{
  "findingId": "DR-C5-F002",
  "claim": "The program changelog index leaf counts are stale for at least tracks 000, 003, and 004.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:14",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:20",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:23",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:24"
  ],
  "counterevidenceSought": "Counted files under the live changelog track folders, excluding files ending in root.md.",
  "alternativeExplanation": "The table could be a stale snapshot from an earlier backfill run, but it is presented as the program-level index.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade to P2 if the README is explicitly marked as historical or approximate next to the counts."
}
```

## New Information Ratio

`1.00` - first pass found two new P1 control-surface correctness defects.

Review verdict: CONDITIONAL

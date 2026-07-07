# Iteration 002: Traceability - Retired Path Sweep

## Focus
Checked the packet's REQ-002/CHK-022 claim that old path fragments have zero live hits.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 2
- New findings: P0=0 P1=1 P2=0
- New findings ratio: 1.0

## Findings

### P1, Required
- **F002**: Retired `system-spec-kit/026-graph-and-context-optimization/006-skill-advisor` path prefix remains live across migrated canonical docs. The sweep captured 1,535 matching lines, including `packet_pointer` frontmatter fields, titles, validation commands, and review configs under `.opencode/specs/system-skill-advisor`. This contradicts the checklist's zero-live-hit claim. [SOURCE: `.opencode/specs/system-skill-advisor/000-migration-from-system-speckit/checklist.md:69`] [SOURCE: `.opencode/specs/system-skill-advisor/000-migration-from-system-speckit/review/lineages/gpt-1/stale-system-spec-kit-026-skill-advisor.txt:1`] [SOURCE: `.opencode/specs/system-skill-advisor/000-migration-from-system-speckit/review/lineages/gpt-1/stale-system-spec-kit-026-skill-advisor.txt:2`] [SOURCE: `.opencode/specs/system-skill-advisor/000-migration-from-system-speckit/review/lineages/gpt-1/stale-system-spec-kit-026-skill-advisor.txt:4`]

## Claim Adjudication
```json
{
  "findingId": "F002",
  "claim": "The migrated tree still contains live retired path references despite a completion claim that old path fragments have zero live hits.",
  "evidenceRefs": [
    ".opencode/specs/system-skill-advisor/000-migration-from-system-speckit/checklist.md:69",
    ".opencode/specs/system-skill-advisor/000-migration-from-system-speckit/review/lineages/gpt-1/stale-system-spec-kit-026-skill-advisor.txt:1",
    ".opencode/specs/system-skill-advisor/000-migration-from-system-speckit/review/lineages/gpt-1/stale-system-spec-kit-026-skill-advisor.txt:2",
    ".opencode/specs/system-skill-advisor/000-migration-from-system-speckit/review/lineages/gpt-1/stale-system-spec-kit-026-skill-advisor.txt:4"
  ],
  "counterevidenceSought": "Narrowed the sweep to the migrated system-skill-advisor tree and inspected canonical frontmatter hits rather than historical changelog-only references.",
  "alternativeExplanation": "Some hits are historical review artifacts, but the cited lines include canonical packet_pointer fields and root spec content, so this is not only frozen history.",
  "finalSeverity": "P1",
  "confidence": 0.94,
  "downgradeTrigger": "Downgrade if the requirement is amended to exclude canonical frontmatter and only require registry JSON cleanup.",
  "transitions": [{"iteration":2,"from":null,"to":"P1","reason":"Initial discovery"}]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | checklist.md:69; stale sweep lines 1-4 | Old path cleanup is incomplete. |

## Recommended Next Focus
Replay the validation evidence used in the checklist.
Review verdict: CONDITIONAL

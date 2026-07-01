# Iteration 25: Validation Gaps

## Focus

Map live drift to semantic validators.

## Findings

- 009/004 requires a sync script but explicitly defers formal Tier 3 semantic validation, leaving recurrence prevention incomplete. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/004-phase-doc-map-and-completion-pct-sync/spec.md:77] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/004-phase-doc-map-and-completion-pct-sync/spec.md:78]
- 009 root also says Tier 3 semantic checks are deliberately deferred even though many observed failures are validator-detectable. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/spec.md:146]

## Novelty

newInfoRatio: 0.50. Prevention remains deferred; manual cleanup alone will not hold.

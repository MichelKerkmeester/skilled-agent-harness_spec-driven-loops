# Iteration 6: Atomic Reindex And Baseline Runbook

## Focus
Angle 6. Propose the safe operational sequence after parent-hub metadata changes.

## Findings
1. SQLite projection is the authoritative normal path when readable; filesystem projection is a fallback when SQLite is absent or errors. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:705]
2. Projection appends command bridges in both SQLite and filesystem paths, so reindex correctness does not cover command bridge drift today. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:620]
3. Packet 007 baseline is pinned to corpus/holdout/ambiguity fixture hashes and captures full corpus, holdout, ambiguity, and bucket metrics. [SOURCE: file:.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/007-eval-hardening/implementation-summary.md:129]
4. Packet 008 explicitly avoided live daemon vector DB use because of native-ABI/SIGBUS fragility, which argues for one deliberate reindex/rebaseline window rather than repeated ad hoc runs. [SOURCE: file:.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:95]

## Proposal
Run metadata cleanup as one atomic evidence bundle:
1. Apply metadata-only patch.
2. Rebuild/scan skill graph and advisor projection.
3. Confirm advisor status and projection source is not degraded fallback.
4. Run parent-hub-vocab-sync hub-local plus new cross-hub collision report.
5. Run advisor validation and existing ratchet tests.
6. If metrics change intentionally, recapture baseline and commit fixture pins in the same reviewed change.

## Sources Consulted
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts`
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/007-eval-hardening/implementation-summary.md`
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md`

## Assessment
newInfoRatio: 0.49. Novelty: operational synthesis more than new code discovery. Confidence: medium-high.

## Reflection
What worked: tying metadata, DB projection, and ratchet evidence prevents stale-green validation.
What failed: relying on filesystem fallback would hide a broken SQLite projection.
Ruled out: metadata-only patch without immediate reindex/rebaseline evidence.

## Recommended Next Focus
Evaluate whether graph `conflicts_with` should be part of parent-hub disambiguation.

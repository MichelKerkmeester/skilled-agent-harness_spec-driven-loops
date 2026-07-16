# Iteration 1: Correctness

## Focus
Reviewed the freshness-gate implementation for the daemon CLI shims against the package build scripts.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 4
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: code-index and skill-advisor freshness hashes are not written by their build scripts, `.opencode/bin/code-index.cjs:60-78`, `.opencode/bin/skill-advisor.cjs:81-95`, `.opencode/skills/system-code-graph/package.json:6-8`, `.opencode/skills/system-skill-advisor/mcp_server/package.json:6-10`. The shims rely on stored source-hash files before bypassing the mtime stale check, but those package builds only run TypeScript build/copy steps and do not write the `.code-index-cli-source-hash.json` or `.skill-advisor-cli-source-hash.json` state. That leaves the content-hash gate dependent on a prior successful shim invocation instead of the build itself.

```json
{
  "findingId": "F001",
  "claim": "code-index and skill-advisor builds do not persist the source-hash metadata consumed by their freshness gates, so their content-hash gate is not fully build-initialized.",
  "evidenceRefs": [
    ".opencode/bin/code-index.cjs:60-78",
    ".opencode/bin/skill-advisor.cjs:81-95",
    ".opencode/skills/system-code-graph/package.json:6-8",
    ".opencode/skills/system-skill-advisor/mcp_server/package.json:6-10"
  ],
  "counterevidenceSought": "Checked the corresponding package build scripts and compared them with the spec-memory finalizer path that writes source hash metadata.",
  "alternativeExplanation": "The shim can write the hash opportunistically after a successful invocation, but that does not satisfy build-initialized freshness metadata for a clean build path.",
  "finalSeverity": "P1",
  "confidence": 0.84,
  "downgradeTrigger": "Downgrade if code-index and skill-advisor builds are shown to run an equivalent source-hash finalizer outside package.json or if tests prove clean build plus mtime-only touch cannot trip exit 69.",
  "transitions": [
    {
      "iteration": 1,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery"
    }
  ]
}
```

### P2, Suggestion
- None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
| --- | --- | --- | --- | --- |
| spec_code | partial | hard | `.opencode/bin/code-index.cjs:60-78` | Correctness gap against claimed all-shim content-hash hardening. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness
- Novelty justification: Found one build-path correctness gap not previously represented in state.

## Ruled Out
- P0 classification: no direct data loss or security breach was proven.

## Dead Ends
- Live smoke execution was skipped to respect the lineage-only write boundary.

## Recommended Next Focus
Review prompt-safe bridge allowlist behavior.

Review verdict: CONDITIONAL

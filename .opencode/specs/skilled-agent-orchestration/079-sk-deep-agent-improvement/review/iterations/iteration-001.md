## Dispatcher

- Run: 1
- Status: complete
- Mode: review
- Focus dimension: correctness
- Focus area: Verify implementation-summary/resource-map claims against disk state, especially runtime command mirrors and advisor rename references.
- Budget profile: verify
- Target: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement`
- Spec folder: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement`
- Review packet root: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/review`

## Files Reviewed

- `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md`
- `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md`
- `.claude/commands/improve/` directory inventory
- `.gemini/commands/improve/` directory inventory
- `.codex/commands/improve/` directory existence check
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts`

## Findings - New

### P0 Findings

- None.

### P1 Findings

1. **Resource map marks nonexistent runtime command mirrors as OK** -- `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:41` -- The resource map summarizes "Missing on disk: 0" even though it later marks `.codex/commands/improve/README.txt` as `OK` and `.codex/commands/improve/*` as `OK` while the declared `.codex/commands/improve` directory is absent on disk, and it marks Gemini YAML command assets as `OK` even though the Gemini command directory contains only `README.txt` and `improve-agent.toml`. This contradicts the implementation summary's more accurate runtime-shape notes that Gemini has no YAML assets and Codex has no commands directory. [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:41`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:63`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:108`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:109`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:115`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:87`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:88`]
   - Finding class: matrix/evidence
   - Scope proof: Direct directory reads showed `.codex/commands/improve` is absent, while `.gemini/commands/improve` contains only `README.txt` and `improve-agent.toml`; the stale claims are confined to the resource-map runtime command mirror rows cited above.
   - Affected surface hints: ["resource-map runtime mirror inventory", "release-readiness evidence", "Gemini command mirror", "Codex command mirror"]
   - Recommendation: Update the resource map to match the implementation summary and disk state: Gemini has no YAML command assets, Codex has no commands directory, and those rows should be `N/A`/absent rather than `OK`; revise the "Missing on disk" summary accordingly.
   ```json
   {
     "type": "claim-adjudication",
     "claim": "The resource map's runtime command mirror inventory incorrectly marks absent Codex command files and absent Gemini YAML assets as present/OK.",
     "evidenceRefs": [
       ".opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:41",
       ".opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:63",
       ".opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:108",
       ".opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:109",
       ".opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:115",
       ".opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:87",
       ".opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:88"
     ],
     "counterevidenceSought": "Checked the declared runtime command directories directly. `.gemini/commands/improve` exists but lists only `README.txt` and `improve-agent.toml`; `.codex/commands/improve` returned file-not-found. The implementation summary already records those shapes correctly.",
     "alternativeExplanation": "The resource map appears to be a pre-implementation inventory template where verify-if-exists rows were not reconciled after implementation; this lowers runtime risk but leaves release evidence incorrect.",
     "finalSeverity": "P1",
     "confidence": 0.91,
     "downgradeTrigger": "Downgrade to P2 if the release process treats `resource-map.md` as non-gating historical planning inventory rather than release-readiness evidence."
   }
   ```

### P2 Findings

- None.

## Traceability Checks

- `implementation-summary.md` runtime mirror statements were checked against disk for Gemini and Codex. The summary correctly says Gemini has only `improve-agent.toml` + `README.txt` and no YAML assets, and that `.codex/commands/improve/` does not exist. [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:87`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md:88`]
- `resource-map.md` runtime mirror rows were checked against disk and found inconsistent for Gemini YAML assets and Codex command files. [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:63`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:108`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:109`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md:115`]
- Advisor source references sampled in the configured scope show `deep-agent-improvement` references in `skill_advisor.py`, `skill-graph.json`, `fusion.ts`, `graph-metadata.json`, and native scorer tests, with no sampled active `sk-improve-agent` advisor reference found.

## Integration Evidence

- `.claude/commands/improve/` inventory contained `agent.md`, `assets/`, `prompt.md`, and `README.txt`; exact reference search found `deep-agent-improvement` command/asset references and no sampled `sk-improve-agent` hit.
- `.gemini/commands/improve/` inventory contained only `README.txt` and `improve-agent.toml`; exact reference search found `deep-agent-improvement` references and no sampled `sk-improve-agent` hit.
- `.codex/commands/improve/` read returned file-not-found, matching `implementation-summary.md` but contradicting `resource-map.md` rows that mark Codex command files as `OK`.
- Code graph was not used because startup context reported it stale.

## Edge Cases

- The `.claude/commands/improve` grep result resolves through the canonical command mirror surface in tool output; findings do not depend on `.claude` mirror line-number evidence.
- The resource map appears partly authored as a planning inventory before implementation. Because the review packet treats it as first-class release evidence, stale `OK` rows are classified as active correctness evidence defects.
- No P0 candidate was identified.

## Confirmed-Clean Surfaces

- `implementation-summary.md` lines 87-88 accurately reflect the Gemini and Codex command surface shapes checked on disk.
- Sampled advisor source references in `skill_advisor.py`, `skill-graph.json`, `fusion.ts`, `graph-metadata.json`, and `native-scorer.vitest.ts` consistently use `deep-agent-improvement` in the inspected matches.

## Ruled Out

- Ruled out a runtime command implementation failure for Codex commands: the absence of `.codex/commands/improve/` is documented as N/A by `implementation-summary.md`, so the active issue is stale resource-map evidence rather than a missing required Codex command implementation.
- Ruled out a Gemini command asset implementation failure: `.gemini/commands/improve/` intentionally has no YAML assets per `implementation-summary.md`; the active issue is resource-map mismatch.

## Next Focus

- dimension: security
- focus area: Check for unsafe path handling, shell command regressions, secret exposure, and broadened permissions introduced by the rename.
- reason: Correctness found one release-evidence defect; the next configured dimension is security.
- rotation status: correctness completed with active P1; rotate to security.
- blocked/productive carry-forward: Productive exact disk-vs-document comparison; carry forward direct Grep/Glob/Read evidence and avoid stale code graph.
- required evidence: Cite file:line evidence for any active security finding and name exact command/workflow/skill surfaces inspected.

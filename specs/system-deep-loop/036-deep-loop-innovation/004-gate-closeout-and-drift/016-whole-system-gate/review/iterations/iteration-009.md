# Iteration 009 — correctness

- Executor: cli-codex gpt-5.6-sol effort=high service_tier=fast sandbox=read-only
- Completed: 2026-07-30T06:41:56.295Z
- New findings: 6 (of 6 reported; prior total 26)
- Coverage: {"filesExamined":25,"keyPaths":[".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs",".opencode/skills/system-deep-loop/deep-alignment/scripts/partition-corpus.cjs",".opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs",".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs",".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs",".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-git.cjs",".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design.cjs",".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs",".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs",".opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs",".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-reducers/deep-alignment-reducer.ts",".opencode/commands/deep/assets/deep-alignment-auto.yaml"]}

## Summary
Examined scoping, all six adapters, corpus partitioning, convergence, command wiring, the JSONL reducer, and the typed deep-alignment reducer. The main risk is fail-open identity and evidence handling: corrupt corpus data can become vacuous coverage, arbitrary artifact identifiers can satisfy coverage, and adapter variants can collapse into one lane. The live-render path additionally permits an evidence-free clean result and produces artifacts the partitioner cannot identify. The alignment-specific JSONL reducer also confirms that F-003-03 extends beyond the generic reducer.

## Findings
- [P0] F-009-01 Missing or corrupt corpus becomes 100% coverage @ .opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs:107
  - evidence: readCorpusSizes() returns an empty object when the corpus file is absent or JSON parsing fails. computeArtifactCoverage() then assigns coverage 1 when discoveredArtifactCount is zero, allowing malformed or missing discovery evidence to satisfy convergence instead of producing an integrity fault. reduce-alignment-state.cjs mirrors the same fail-open corpus loading behavior.
  - recommendation: Represent unavailable or malformed corpus data as an explicit integrity failure. Permit zero-artifact coverage only when a valid, schema-checked corpus proves that the lane discovered zero artifacts.
- [P0] F-009-02 Coverage accepts checked identifiers outside the corpus @ .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:259
  - evidence: The reducer unions every non-empty artifactsChecked string, then compares only the resulting count with discoveredArtifactCount. It never verifies membership in the lane's canonical corpus identities; two arbitrary identifiers therefore satisfy a two-artifact corpus and can yield PASS with complete coverage.
  - recommendation: Intersect checked identifiers with the canonical per-lane corpus identity set, reject unknown identifiers as integrity faults, and calculate coverage from verified members only.
- [P0] F-009-03 Adapter variants collide under the same lane identity @ .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs:97
  - evidence: laneKey() concatenates authority, artifactClass, and scope but omits adapter. Configured lanes using different adapters over the same tuple—such as sk-design and sk-design-live-render—therefore share reducer state; corpus and partition maps are also keyed by this identity, so one adapter's checks can satisfy or overwrite the other's lane.
  - recommendation: Include adapter in the canonical lane identity throughout scoping, corpus generation, partitioning, convergence, and reduction. Alternatively, reject configurations containing differing adapters for one three-axis tuple.
- [P0] F-009-04 Live-render adapter passes without render evidence @ .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs:465
  - evidence: check() accepts a renderResult whose only meaningful field is dispatchedThrough equal to sk-design-mcp-open-design. Missing measurements and judgment findings produce no findings, and renderedAt is optional, so a caller-supplied dispatch string with no captured render evidence returns a clean result.
  - recommendation: Require a receipt-bound render result tied to the target and current execution, plus mandatory evidence or an explicit evidence-completeness verdict. Fail closed when timestamps, measurements, judgment output, or ownership binding are absent.
- [P1] F-009-05 Live-render artifacts have no partition identity @ .opencode/skills/system-deep-loop/deep-alignment/scripts/partition-corpus.cjs:92
  - evidence: artifactIdentity() recognizes only artifact.path and artifact.ref, while sk-design-live-render emits artifacts with target and targetType. Their identity is always null, so resolveNextSlice() always treats them as unchecked; when the corpus exceeds batchSize, it repeatedly selects the first batch and never reaches later targets.
  - recommendation: Define and share a canonical identity function covering target-based artifacts, then add progress tests with more live-render targets than one batch.
- [P1] F-009-06 Interactive scoping discards the selected adapter @ .opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs:254
  - evidence: resolveLanesFromSelections() constructs each raw lane from authority, artifactClass, and scope only, dropping selection.adapter before validation. The same live-render selection resolves to sk-design-live-render through config input but defaults to sk-design through the interactive path, making adapter variants unreachable or silently changed without a config.
  - recommendation: Preserve adapter in the interactive lane object and expose adapter selection where multiple registered variants support the same authority and artifact class.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 9,
  "dimension": "correctness",
  "summary": "Examined scoping, all six adapters, corpus partitioning, convergence, command wiring, the JSONL reducer, and the typed deep-alignment reducer. The main risk is fail-open identity and evidence handling: corrupt corpus data can become vacuous coverage, arbitrary artifact identifiers can satisfy coverage, and adapter variants can collapse into one lane. The live-render path additionally permits an evidence-free clean result and produces artifacts the partitioner cannot identify. The alignment-specific JSONL reducer also confirms that F-003-03 extends beyond the generic reducer.",
  "findings": [
    {
      "severity": "P0",
      "dimension": "correctness",
      "title": "Missing or corrupt corpus becomes 100% coverage",
      "file": ".opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs",
      "line": 107,
      "evidence": "readCorpusSizes() returns an empty object when the corpus file is absent or JSON parsing fails. computeArtifactCoverage() then assigns coverage 1 when discoveredArtifactCount is zero, allowing malformed or missing discovery evidence to satisfy convergence instead of producing an integrity fault. reduce-alignment-state.cjs mirrors the same fail-open corpus loading behavior.",
      "recommendation": "Represent unavailable or malformed corpus data as an explicit integrity failure. Permit zero-artifact coverage only when a valid, schema-checked corpus proves that the lane discovered zero artifacts."
    },
    {
      "severity": "P0",
      "dimension": "correctness",
      "title": "Coverage accepts checked identifiers outside the corpus",
      "file": ".opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs",
      "line": 259,
      "evidence": "The reducer unions every non-empty artifactsChecked string, then compares only the resulting count with discoveredArtifactCount. It never verifies membership in the lane's canonical corpus identities; two arbitrary identifiers therefore satisfy a two-artifact corpus and can yield PASS with complete coverage.",
      "recommendation": "Intersect checked identifiers with the canonical per-lane corpus identity set, reject unknown identifiers as integrity faults, and calculate coverage from verified members only."
    },
    {
      "severity": "P0",
      "dimension": "correctness",
      "title": "Adapter variants collide under the same lane identity",
      "file": ".opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs",
      "line": 97,
      "evidence": "laneKey() concatenates authority, artifactClass, and scope but omits adapter. Configured lanes using different adapters over the same tuple—such as sk-design and sk-design-live-render—therefore share reducer state; corpus and partition maps are also keyed by this identity, so one adapter's checks can satisfy or overwrite the other's lane.",
      "recommendation": "Include adapter in the canonical lane identity throughout scoping, corpus generation, partitioning, convergence, and reduction. Alternatively, reject configurations containing differing adapters for one three-axis tuple."
    },
    {
      "severity": "P0",
      "dimension": "correctness",
      "title": "Live-render adapter passes without render evidence",
      "file": ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs",
      "line": 465,
      "evidence": "check() accepts a renderResult whose only meaningful field is dispatchedThrough equal to sk-design-mcp-open-design. Missing measurements and judgment findings produce no findings, and renderedAt is optional, so a caller-supplied dispatch string with no captured render evidence returns a clean result.",
      "recommendation": "Require a receipt-bound render result tied to the target and current execution, plus mandatory evidence or an explicit evidence-completeness verdict. Fail closed when timestamps, measurements, judgment output, or ownership binding are absent."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Live-render artifacts have no partition identity",
      "file": ".opencode/skills/system-deep-loop/deep-alignment/scripts/partition-corpus.cjs",
      "line": 92,
      "evidence": "artifactIdentity() recognizes only artifact.path and artifact.ref, while sk-design-live-render emits artifacts with target and targetType. Their identity is always null, so resolveNextSlice() always treats them as unchecked; when the corpus exceeds batchSize, it repeatedly selects the first batch and never reaches later targets.",
      "recommendation": "Define and share a canonical identity function covering target-based artifacts, then add progress tests with more live-render targets than one batch."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Interactive scoping discards the selected adapter",
      "file": ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs",
      "line": 254,
      "evidence": "resolveLanesFromSelections() constructs each raw lane from authority, artifactClass, and scope only, dropping selection.adapter before validation. The same live-render selection resolves to sk-design-live-render through config input but defaults to sk-design through the interactive path, making adapter variants unreachable or silently changed without a config.",
      "recommendation": "Preserve adapter in the interactive lane object and expose adapter selection where multiple registered variants support the same authority and artifact class."
    }
  ],
  "refutations": [
    {
      "id": "F-003-03",
      "verdict": "deepened",
      "reason": "The alignment-specific reducer repeats the defect: loadDeltaPayloads() calls parseJsonl() and discards its malformed-row warnings, while only corruption warnings from the primary state log contribute to overall.integrityFault."
    }
  ],
  "coverage": {
    "filesExamined": 25,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs",
      ".opencode/skills/system-deep-loop/deep-alignment/scripts/partition-corpus.cjs",
      ".opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs",
      ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs",
      ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs",
      ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-git.cjs",
      ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design.cjs",
      ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs",
      ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-reducers/deep-alignment-reducer.ts",
      ".opencode/commands/deep/assets/deep-alignment-auto.yaml"
    ]
  }
}
```
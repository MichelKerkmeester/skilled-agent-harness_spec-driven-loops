# Iteration 001 - Correctness

Focus: catalog/code-reference claims.

## Actions

- Read the target spec and scoped catalog/playbook files.
- Compared the master feature catalog with the dedicated code-reference feature leaf.
- Cross-checked the MCP tool-count claim against the live schema registry and tests.

## Findings

### P1-001 - Catalog master still says feature annotations cover every source file while the feature leaf says coverage is partial

The master catalog says feature catalog code references "embed inline traceability comments in every source file" and that "each file declares" catalog features [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:3946]. It then says every non-test `.ts` file under `mcp_server/`, `shared/`, and `scripts/` carries a module header, while implementation files carry catalog annotations [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:3950].

The dedicated feature leaf uses a materially weaker contract: measured majority, `192` of `280`, and explicitly "partial rather than universal" [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/feature-catalog-code-references.md:26].

Impact: operators reading the master catalog get a stronger traceability guarantee than the feature-specific source is willing to make.

Fix: align the master catalog with the partial-coverage contract and refresh the measured count with a reproducible script.

Claim adjudication packet:
```json
{
  "findingId": "P1-001",
  "claim": "The master feature catalog overstates source-file annotation coverage compared with the dedicated feature leaf.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:3946",
    ".opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:3950",
    ".opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/feature-catalog-code-references.md:26"
  ],
  "counterevidenceSought": "Checked the dedicated code-reference feature, sampled source files, and annotation-name validation output.",
  "alternativeExplanation": "The root catalog may be using informal prose while the leaf carries the precise audit measurement, but release-readiness readers treat both as current catalog truth.",
  "finalSeverity": "P1",
  "confidence": 0.89,
  "downgradeTrigger": "Downgrade if a generated coverage script proves the master statement is intentionally scoped to a narrower set and the prose is updated to name that scope."
}
```

### P1-002 - The MCP tool count is split between 37 in catalog/tests and 36 in README/tests

The feature catalog says the MCP server exposes 37 tools and claims it matches the README's 37-tool API reference [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:48]. The README still says "36-tool MCP server" [SOURCE: .opencode/skills/system-spec-kit/README.md:45] and "36-tool API reference" [SOURCE: .opencode/skills/system-spec-kit/README.md:256].

The live registry lists the canonical `TOOL_DEFINITIONS` array from line 681 through line 725 [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:681] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:725], which counts to 37. Tests also disagree: context-server labels the group as 37 tools [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:162], while review-fixes still expects `TOOL_DEFINITIONS.length` to be 36 [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:117].

Impact: release validation can fail or document the wrong public API size depending on which source is trusted.

Fix: use `TOOL_DEFINITIONS.length` as the canonical count, then update the README and stale test expectation.

Claim adjudication packet:
```json
{
  "findingId": "P1-002",
  "claim": "The live tool registry and catalog say 37 tools, while README and one test still say 36.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:48",
    ".opencode/skills/system-spec-kit/README.md:45",
    ".opencode/skills/system-spec-kit/README.md:256",
    ".opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:681",
    ".opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:725",
    ".opencode/skills/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:117"
  ],
  "counterevidenceSought": "Checked schema list, README references, and tests that encode tool-count expectations.",
  "alternativeExplanation": "A tool may be deferred or internal-only, but the catalog explicitly says TOOL_DEFINITIONS.length is canonical and the listed array has 37 entries.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "Downgrade if the intended public count excludes one listed schema and all docs/tests are updated to explain the exclusion."
}
```

## Verdict

Two P1 correctness/traceability findings. No P0.

Review verdict: CONDITIONAL

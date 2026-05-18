## Dimension

validator-coverage

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:18` - severity definitions and evidence threshold.
- `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json:138` - Level 1 lazy addon docs include `handover.md`, `debug-delegation.md`, and `research/research.md`.
- `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json:364` - Level 3 repeats the same lazy addon docs.
- `.opencode/skills/system-spec-kit/scripts/utils/template-structure.js:156` - shell helper `docs` contract source only returns required core plus required addon docs.
- `.opencode/skills/system-spec-kit/scripts/rules/check-template-source.sh:35` - template-source shell rule claims to validate docs defined by the Level contract.
- `.opencode/skills/system-spec-kit/scripts/rules/check-template-source.sh:42` - template-source shell rule iterates `node template-structure.js docs "$contract_level"`.
- `.opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh:149` - template-header shell rule uses the same `docs` helper list.
- `.opencode/skills/system-spec-kit/scripts/rules/check-sections.sh:45` - section shell rule uses the same `docs` helper list.
- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:177` - MCP validator collects required, addon, lazy docs, `resource-map.md`, and `context-index.md`.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/resource-map.md:178` - resource map explicitly scopes broad validator/doc cleanup surfaces.

## Findings by Severity

### P0

None.

### P1

#### DR-004-P1-001 [P1] Shell validator rules skip manifest-declared lazy docs

- **File**: `.opencode/skills/system-spec-kit/scripts/utils/template-structure.js:156`
- **Claim**: The shell validator public surface does not cover manifest-declared lazy docs (`handover.md`, `debug-delegation.md`, `research/research.md`) even when those docs exist, creating a parity gap with the MCP validator and allowing generated command/agent/workflow-owned docs to miss template-source and structure checks.
- **Evidence**: The manifest declares lazy docs for Level 1 and Level 3 at `spec-kit-docs.json:138` and `spec-kit-docs.json:364`. The shell helper's `getContractDocs()` returns only `requiredCoreDocs` plus `requiredAddonDocs` at `template-structure.js:156`, and `check-template-source.sh`, `check-template-headers.sh`, and `check-sections.sh` all iterate that helper output (`check-template-source.sh:42`, `check-template-headers.sh:149`, `check-sections.sh:45`). By contrast, the MCP validator includes `lazyAddonDocs`, `resource-map.md`, and `context-index.md` in `collectDocuments()` at `spec-doc-structure.ts:177`.
- **Counterevidence sought**: Checked whether another shell rule validates lazy docs. `check-spec-doc-integrity.sh` scans only max-depth root markdown and performs link/metadata/handover target checks, not template-source or template-structure checks for lazy docs; the template-source rule reports success based only on the required-doc list.
- **Alternative explanation**: Lazy docs may be optional for presence, but once generated they are still manifest-defined template outputs with owners and versions. Optional presence does not justify skipping structural and source-marker validation when the file exists.
- **Final severity**: P1.
- **Confidence**: 0.88.
- **Downgrade trigger**: Downgrade only if maintainers intentionally declare lazy docs out of scope for all shell validator structure/source checks and add an equivalent MCP-only gate to the release criteria.
- **Finding class**: cross-consumer.
- **Scope proof**: The same helper list is consumed by the template-source, template-header, and section shell validators; MCP validation already uses a wider manifest-derived document set, proving this is a shell/MCP parity gap rather than a single-rule omission.
- **Affected surface hints**: shell validator strict mode, lazy command-owned docs, lazy agent-owned docs, deep-research docs, MCP/shell parity.
- **Recommendation**: Add a helper mode that returns existing checkable docs (`requiredCoreDocs + requiredAddonDocs + lazyAddonDocs + optional resource-map/context-index when present`) and use it in template-source/header/section validators, or explicitly split required-presence checks from present-file structure checks.

### P2

None.

## Traceability Checks

- **Core / spec_code**: Gap. REQ-004 and SC-005 require zero validator regressions, but current shell validation can pass template-source/header/section checks without inspecting manifest-declared lazy docs that exist.
- **Core / checklist_evidence**: Partial. No `applied/T-*.md` files were present, so this pass used the spec, tasks, manifest, validators, and resource map as the authoritative evidence set.
- **Overlay / skill_agent**: Gap. `handover.md`, `debug-delegation.md`, and `research/research.md` are owned by command/agent/workflow surfaces; shell validators skipping them leaves exactly those cross-runtime/generated surfaces under-covered.
- **Overlay / agent_cross_runtime**: Partial. MCP validation collects the lazy docs, while shell strict validation does not, creating inconsistent validator coverage by runtime path.
- **Resource Map Coverage**: Sampled. No `applied/T-*.md` target files existed to cross-check; resource-map validator surfaces were sampled and the gap is within validator/public-surface coverage.

## Verdict

CONDITIONAL. The validator-coverage dimension adds one new P1 gate issue. Prior P1s remain active, and this pass strengthens the validator/public-surface coverage concern by showing a shell/MCP document-set mismatch.

## Next Dimension

cross-runtime-mirror-consistency

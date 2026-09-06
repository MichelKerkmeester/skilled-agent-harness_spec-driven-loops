# Iteration 004: CLI Documentation And Registry Integrity

## Dispatcher
- Executor: inline detached OpenCode lineage, `cli-opencode model=llmgateway/gpt-5.6-luna`.
- Write surface: lineage directory only.
- Budget profile: scan.

## Files Reviewed
- `.opencode/skills/system-spec-kit/runtime/cli/scripts-registry.json:6-232,318-394`
- `.opencode/skills/system-spec-kit/runtime/cli/spec/README.md:15-90`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/README.md:16-99`
- `.opencode/skills/system-spec-kit/runtime/cli/continuity/README.md:52-90,197-216`
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/README.md:117-143`
- `.opencode/skills/system-spec-kit/runtime/cli/rules/README.md:16-49,131-143`
- `.opencode/skills/system-spec-kit/runtime/cli/core/README.md:56-94`
- `.opencode/skills/system-spec-kit/runtime/api/index.ts:4-8,12-18,30-44`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-embeddings-factory.cjs:13-31`

## Findings - New
### P1 Findings
1. **Registry paths are not resolved relative to the registry's own package root** -- `.opencode/skills/system-spec-kit/runtime/cli/scripts-registry.json:8-22,25-40,142-156` -- the registry stores paths prefixed with `runtime/cli/` even though the registry itself lives at `runtime/cli/`, and its generated entry/dependency paths include dist outputs that are absent in the current source-only checkout. No current code consumer was found for this registry, so this is a maintainability and evidence concern rather than a confirmed runtime failure.
- Finding class: matrix/evidence
- Scope proof: Direct registry read, filesystem existence checks on every listed script path and a repository search for registry consumers.
- Affected surface hints: ["script discovery", "registry paths", "dist availability"]
- Claim adjudication: {"type":"claim-adjudication","claim":"scripts-registry.json is an executable current catalog","evidenceRefs":["runtime/cli/scripts-registry.json:6-22","runtime/cli/scripts-registry.json:142-156"],"counterevidenceSought":"Resolved all listed paths from the registry directory and searched for runtime consumers.","alternativeExplanation":"The registry may be documentation-only or intended to resolve from the skill root, but no contract states that boundary.","finalSeverity":"P1","confidence":0.84,"downgradeTrigger":"A documented consumer contract establishes the resolution root and distinguishes source paths from build outputs."}

### P2 Findings
1. **Current subordinate READMEs retain retired `scripts/` topology** -- `.opencode/skills/system-spec-kit/runtime/cli/continuity/README.md:52-55,75-82` -- the continuity package describes dependencies as `scripts/core`, `scripts/extractors`, `scripts/loaders`, `scripts/renderers` and `scripts/lib` even though those directories are now under `runtime/cli`.
- Finding class: cross-consumer
- Scope proof: Direct reads across continuity, retrieval, rules and core READMEs found the same stale vocabulary in multiple current package documents.
- Affected surface hints: ["continuity README", "rules README", "retrieval README", "operator navigation"]

2. **Public runtime API comments retain old consumer names** -- `.opencode/skills/system-spec-kit/runtime/api/index.ts:12-18,30-44` -- comments refer to `scripts/spec-folder`, `scripts/graph` and `scripts/core` while the exported callers are in `runtime/cli`.
- Finding class: instance-only
- Scope proof: Direct read of public API comments and current `runtime/cli` package layout.
- Affected surface hints: ["public API comments", "consumer documentation"]

## Traceability Checks
| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | partial | hard | `scripts-registry.json:8-22` | Catalog and package paths need a declared resolution root. |
| checklist_evidence | partial | hard | `runtime/cli/tests/README.md:69-99` | Current commands are mostly current, but several subordinate docs retain old topology. |
| feature_catalog_code | partial | advisory | `runtime/cli/scripts-registry.json:318-394` | Registry metadata is mixed with stale path assumptions. |
| playbook_capability | partial | advisory | `runtime/cli/continuity/README.md:75-82` | Documentation dependency arrows do not match on-disk topology. |

## Integration Evidence
- `runtime/cli/tests/README.md:71-80` uses current `runtime/cli` commands and the projects config.
- `runtime/cli/spec/README.md:17-23` correctly describes the current public shell surface.

## Edge Cases
- Many `memory/` references in fixture documents are intentional packet-fixture concepts, not the renamed workspace directory. They are not admitted as findings.
- `scripts/` references to `sk-doc` and `sk-code` are external skill paths and are not this packet's retired workspace.

## Confirmed-Clean Surfaces
- The direct test harness root at `test-scripts-modules.js:20-21` resolves compiled CLI output through its current location.
- Current test README command examples use `runtime/cli` paths at lines 74-80.

## Ruled Out
- A broad repository-wide stale path defect: excluded because current external skill `scripts/` paths and fixture-local `memory/` directories are distinct concepts.

## Next Focus
- dimension: correctness
- focus area: generated outputs, dist freshness and test harness fail-closed behavior
- reason: documentation residue is established; inspect whether missing build artifacts can be silently accepted
- rotation status: new angle
- blocked/productive carry-forward: multi-file documentation comparison was productive
- required evidence: dist freshness table, shipped-path harness and source/dist alignment checks
- recovery note: none

Review verdict: CONDITIONAL

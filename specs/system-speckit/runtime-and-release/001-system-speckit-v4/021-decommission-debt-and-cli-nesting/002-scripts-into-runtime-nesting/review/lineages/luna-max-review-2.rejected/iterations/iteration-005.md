# Iteration 5: Correctness Replay of Registries and Guards

## Focus
Correctness replay of script registry paths, CI guard paths, architecture-boundary roots and current package references.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 10 direct files
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=1 P1=1 P2=0
- New findings ratio: 0.10

## Findings

### P2, Suggestion
- **F009**: `scripts-registry.json` uses current `runtime/cli` paths for entries but retains old `scripts/lib`, `scripts/spec-folder` and `templates` dependency labels. The registry loader prints these fields as package metadata, so the catalog is internally inconsistent even where executable `path` values are current. [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/scripts-registry.json:59-74,142-156,318-346] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/registry-loader.sh:143-166]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | package.json:19-25; scripts-registry.json:6-26 | Current package scripts use new paths; registry dependency metadata is stale. |
| checklist_evidence | partial | hard | implementation-summary.md:208-231 | Broad path sweep does not cover non-path registry dependency labels. |
| feature_catalog_code | partial | advisory | scripts-registry.json:59-156 | Registry entries are executable-looking but metadata is mixed. |
| playbook_capability | pass | advisory | .github/workflows/*.yml | Reviewed guard paths use current CLI locations. |

## Assessment
- New findings ratio: 0.10
- Dimensions addressed: correctness
- Novelty justification: current executable paths were rechecked and earlier P1s were refined; one non-executable registry metadata inconsistency remains.

## Ruled Out
- The root workspace, lockfile and CLI package manifest now agree on `runtime/cli` and `@spec-kit/cli`. [SOURCE: package.json:6-25] [SOURCE: package-lock.json:11-15,1792-1793,5550-5551] [SOURCE: runtime/cli/package.json:1-28]
- Both inspected CI guards point to existing current paths. [SOURCE: .github/workflows/markdown-link-integrity.yml:26-37] [SOURCE: .github/workflows/command-tree-parity.yml:19-33]

## Dead Ends
- No CI execution was performed.

## Recommended Next Focus
Security recheck of path helpers and symlink-sensitive roots, then a traceability pass over playbook evidence and generated metadata.

Review verdict: PASS

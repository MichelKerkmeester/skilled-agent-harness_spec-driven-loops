# Iteration 1: Correctness and Package Topology

## Focus
Correctness review of the nested workspace, package scripts, lockfile, test discovery and primary moved entrypoints. Current source state was read directly. No target files were modified.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 12 direct files plus the 453-entry manifest
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.40

## Findings

### P1, Required
- **F001**: The root workspace's `test:root` delegates to `npm run test --workspace=@spec-kit/cli`, but the CLI package's `test` command invokes `vitest run --config ../vitest.config.ts --root .`, while the root `vitest.config.ts` is a multi-project config rooted at the skill package and has a separate CLI project. This split means the package-local command does not use the root multi-project configuration and is not proven by the packet's root test claim to execute the same test surface. The repository has a dedicated `runtime/cli/vitest.config.ts` absent from the package scripts. [SOURCE: .opencode/skills/system-spec-kit/package.json:19-24] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/package.json:18-21] [SOURCE: .opencode/skills/system-spec-kit/vitest.config.ts:19-57] [SOURCE: .opencode/skills/system-spec-kit/runtime/vitest.config.ts:13-39]

### P2, Suggestion
- **F002**: The package boundary is now structurally coherent, but the moved package's source-facing documentation still describes the old package topology, which makes future path repairs error-prone. [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/README.md:56-98]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:42-50; package.json:6-25 | Target layout is implemented, but test command contract needs one authoritative config path. |
| checklist_evidence | partial | hard | tasks.md:111-125; implementation-summary.md:208-231 | Completion claims list broad test gates without an inline proof for the package-local config split. |
| feature_catalog_code | partial | advisory | runtime/cli/README.md:56-98 | Current entrypoints exist, while topology text is stale. |
| playbook_capability | partial | advisory | runtime/cli/package.json:18-21 | Test commands are executable-looking but their config ownership is ambiguous. |

## Assessment
- New findings ratio: 0.40
- Dimensions addressed: correctness
- Novelty justification: package and lockfile existence was confirmed in the current tree, so the earlier missing-manifest finding is not carried forward; the remaining issue is a current test-config contract mismatch.

## Ruled Out
- Missing `runtime/cli/package.json` was ruled out by direct path inspection and the current workspace manifest. [SOURCE: .opencode/skills/system-spec-kit/package.json:6-10] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/package.json:1-34]

## Dead Ends
- Repository test execution was not attempted because this detached lineage may write outside the lineage directory.

## Recommended Next Focus
Security and path-boundary review of root discovery, hook candidate resolution, fixed-depth path calculations and symlink/containment handling.

Review verdict: CONDITIONAL

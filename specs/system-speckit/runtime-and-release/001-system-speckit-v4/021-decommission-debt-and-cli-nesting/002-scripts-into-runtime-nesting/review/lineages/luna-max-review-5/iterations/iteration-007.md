# Iteration 007: External Consumers, CI And Hook Wiring

## Focus
Review workflows, plugins, hook routers, doctor routes and agent-facing consumers that invoke the moved CLI package.

## Sources Reviewed
- `.github/workflows/changed-packet-validation.yml:24-37,89-97`
- `.github/workflows/strict-pass-freshness-report.yml:32-45,53-69,87-95`
- `.github/workflows/command-tree-parity.yml:19-30`
- `.github/workflows/markdown-link-integrity.yml:26-37`
- `.opencode/commands/doctor/_routes.yaml:33-42,169-179`
- `.opencode/plugins/session-cleanup.js:29-38`
- `.opencode/plugins/system-dist-freshness-guard.js:20-28`
- `.opencode/plugins/system-speckit-completion.js:23-28`
- `.opencode/bin/skill-advisor.cjs:21-24`
- `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs:29-42`
- `.opencode/bin/worktree-session.sh:80-87`

## Findings
### P1, Correctness
- **F013**: The reviewed CI, plugin, doctor and hook consumers consistently point at `runtime/cli` or its current `dist` paths. The changed-packet workflow provisions the workspace root at `changed-packet-validation.yml:28-37`, and the weekly sweep uses the nested CLI at `strict-pass-freshness-report.yml:41-59`. No active retired-path consumer is established in these sources.

### P2, Maintainability
- **F014**: `worktree-session.sh:80-87` treats `runtime/cli/dist` and `runtime/cli/node_modules` as shared worktree paths, while current CI and package docs also describe root provisioning. This is coherent but the operational ownership is spread across shell and YAML surfaces with no single cross-reference in the packet's current summary.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | pass | hard | `changed-packet-validation.yml:28-37`; `session-cleanup.js:29-33` | External consumers use the selected target layout. |
| checklist_evidence | partial | hard | `implementation-summary.md:220-230` | Summary records these gates, but commands are not replayed here. |
| playbook_capability | pass | advisory | `doctor/_routes.yaml:33-42,169-179` | Current doctor routes resolve to current CLI paths. |

## Assessment
- New findings ratio: 0.30
- Dimensions addressed: correctness, maintainability
- Novelty justification: external consumer sweep found no stale executable path and admitted only an ownership/documentation gap.

## Ruled Out
- CI install from deleted `scripts/`: ruled out by both workflow install blocks.
- Plugin imports from old CLI location: ruled out by direct reads of all three plugin consumers.

## Recommended Next Focus
Review generated mirrors, symlink boundaries and the runtime-versus-CLI wrapper split.

Review verdict: PASS

# Iteration 2 - security: path-resolution trust boundaries

## Dispatcher

- Execution mode: AUTONOMOUS inline fan-out leaf; no nested executor was dispatched.
- Resolved route: Resolved route: mode=review target_agent=deep-review
- Target: `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting` (`spec-folder`)
- Scope: bounded content-changed set in `scratch/review-scope.txt` (partition 2 of 10, lines 43-84), with direct follow-through into the moved CLI path/security helpers.

## Focus

Security and path-resolution behavior after nesting the CLI under `runtime/cli/`, including absolute and qualified spec-folder arguments, symlink containment, write-root guards, hook executable selection, and the root calculation used by the moved configuration module.

## Files Reviewed

- `.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml`, `.opencode/commands/doctor/assets/doctor-update.yaml`, `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh`, `.opencode/commands/doctor/scripts/fable-mode-check.cjs`
- `.opencode/commands/speckit/README.txt`, `.opencode/commands/speckit/assets/speckit-complete-auto.yaml`, `.opencode/commands/speckit/assets/speckit-complete-confirm.yaml`, `.opencode/commands/speckit/assets/speckit-implement-auto.yaml`, `.opencode/commands/speckit/assets/speckit-implement-confirm.yaml`, `.opencode/commands/speckit/assets/speckit-plan-auto.yaml`, `.opencode/commands/speckit/assets/speckit-plan-confirm.yaml`, `.opencode/commands/speckit/assets/speckit-resume-auto.yaml`, `.opencode/commands/speckit/assets/speckit-resume-confirm.yaml`, `.opencode/commands/speckit/save.md`, `.opencode/commands/speckit/search.md`
- `.opencode/hooks/completion/README.md`, `.opencode/hooks/dist-freshness/README.md`, `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs`, `.opencode/install-guides/README.md`
- `.opencode/plugins/session-cleanup.js`, `.opencode/plugins/system-dist-freshness-guard.js`, `.opencode/plugins/system-speckit-completion.js`, `.opencode/plugins/tests/system-dist-freshness-guard.test.cjs`
- `.opencode/skills/cli-external-orchestration/cli-claude-code/SKILL.md`, `.opencode/skills/cli-external-orchestration/cli-claude-code/assets/prompt-templates.md`, `.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md`, `.opencode/skills/cli-external-orchestration/cli-codex/assets/prompt-templates.md`, `.opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md`, `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md`, `.opencode/skills/cli-external-orchestration/cli-devin/assets/prompt-templates.md`, `.opencode/skills/cli-external-orchestration/cli-opencode/references/permissions-matrix.md`
- `.opencode/skills/system-spec-kit/runtime/cli/core/config.ts`, `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-canonical-resolver.ts`, `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-write-guard.ts`, `.opencode/skills/system-spec-kit/runtime/cli/core/workflow-path-utils.ts`, `.opencode/skills/system-spec-kit/runtime/cli/core/save-context-path.ts`
- `.opencode/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts`, `.opencode/skills/system-spec-kit/shared/utils/path-security.ts`, `.opencode/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts`

## Security and Boundary Checks

- `validateFilePath()` rejects null bytes and explicit `..` segments before resolving, canonicalizes existing paths and their bases with `realpathSync()`, and uses `path.relative()` containment rather than a string prefix (`shared/utils/path-security.ts:18-102`).
- The canonical spec resolver preserves explicit absolute/qualified roots and constrains unqualified names to the canonical `specs/` root before checking the legacy root (`runtime/cli/core/spec-root-canonical-resolver.ts:43-72`). The write guard independently checks divergent canonical/legacy roots before packet writes (`runtime/cli/core/spec-root-write-guard.ts:14-38`).
- The context writer applies a second containment check to absolute targets before deriving a packet identity (`runtime/cli/continuity/generate-context.ts:389-419` and `359-375`), and the workflow path utility applies the same guard to captured file paths (`runtime/cli/core/workflow-path-utils.ts:32-60`). No new traversal bypass was established in this pass.
- The stop hook does not accept a production environment override for the autosave executable; its test-only override is gated on `NODE_ENV=test` or `SPECKIT_TEST=true`, and production candidates point to `runtime/cli/dist/continuity/generate-context.js` (`runtime/hooks/claude/session-stop.ts:61-89`).
- The moved config module’s package-root walk selects the nearest ancestor containing `package.json` (`runtime/cli/core/config.ts:75-91`). With `runtime/cli/package.json` absent, the walk selects `runtime/package.json`; the resulting calculated config path is `.opencode/skills/config/config.jsonc` and the calculated project root is the worktree parent, while the actual config is under `.opencode/skills/system-spec-kit/config/config.jsonc`. The loader silently returns defaults when that path is absent (`runtime/cli/core/config.ts:250-277`). This is confirmed as a consequence of the active manifest defect from iteration 1, not a separate traversal primitive.

## Findings

No new security-severity finding was admitted. The path guards and production hook candidate restrictions remain coherent on the reviewed surfaces. The unresolved workspace-manifest defect continues to block trustworthy CLI root resolution, and the stale execution-plan path remains an active traceability defect; neither was duplicated as a new finding in this pass.

## Traceability Checks

- `spec_code`: fail remains carried from the unresolved workspace manifest; a missing nested manifest changes the root selected by the config walk and therefore affects the executable’s approved-root calculations.
- `checklist_evidence`: partial; direct path guards are present, but the packet’s completion evidence does not reconcile the missing manifest and stale lockfile.
- `feature_catalog_code`: not applicable in this pass.
- `playbook_capability`: partial; production hook source selection is updated, but the separate execution handoff still names the retired memory path.

## Confirmed-Clean Surfaces

- Null-byte, explicit traversal-segment, symlink, and path-relative containment checks are present at the shared validation boundary and at the context-write sink.
- The session-stop test override cannot redirect production autosaves through an untrusted environment value.
- No new file, symlink, or hook configuration outside the approved roots was found in the partition reviewed.

## Ruled Out

- A new symlink traversal vulnerability in the moved path helpers was not supported by the source inspection; canonicalization and relative containment are both applied.
- A production environment-variable redirection of the stop-hook executable was not supported; the override is test-gated.

## Assessment

Dimensions addressed: security and correctness side effects of root resolution. No source files were modified. The active blocking state is unchanged.

## Recommended Next Focus

Traceability and packet metadata: reconcile status, level, acceptance claims, execution-plan prerequisites, and generated metadata against the actual move and the unresolved package/lockfile state.

Review verdict: FAIL

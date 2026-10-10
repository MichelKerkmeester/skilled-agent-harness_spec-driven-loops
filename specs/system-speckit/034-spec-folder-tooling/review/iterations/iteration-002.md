# Deep Review Iteration 2

## Dimension

Security. This pass reviewed trust boundaries in the healer and upgrade CLIs, leaf manifest generation, archive paths, doctor compatibility action, hooks, workflows and credential-bearing examples.

## Files Reviewed

- Healer and upgrade CLIs: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs and upgrade-legacy.mjs.
- Leaf-manifest generator and its scope tests: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs and generate-leaf-manifest-scopes.test.cjs.
- Archive implementation and symlink tests: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh and runtime/cli/tests/archive-track.vitest.ts.
- Doctor compatibility action, git-hook gate manifest and pre-commit hook.
- The four in-scope workflows: changed-packet-validation.yml, spec-kit-check.yml, strict-pass-freshness-report.yml and trigger-index-rebuild.yml.
- Credential-signature scan over all 229 files in the review scope. It returned no matches. .env.example has no non-empty assignments.

## Findings by Severity

### P0

None.

### P1

#### R2-P1-001: Default healer writes through symlinked packet documents

- File: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1415
- Claim: Default discovery accepts a spec.md entry by name, then the apply path writes with fs.writeFileSync. A repairable symlinked document can therefore redirect writes outside the packet or repository. upgrade-legacy invokes this path with --apply for selected packets.
- Evidence: [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:747], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1415], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:856]
- Counterevidence sought: Lane modes and anchor repair use atomic replacement, which does not write through a symlink. The default healer is separate and has no symlink rejection before its direct write.
- Alternative explanation: Writes require --apply and occur only when a repair changes the document.
- Final severity: P1, confidence 0.90.
- Downgrade trigger: Add real-path confinement and a test proving an external symlink target remains unchanged under --apply.
- Recommendation: Reject symlinked documents and confine canonical document paths to the selected repository root.

#### R2-P1-002: Leaf walker follows a symlinked scope root outside the skill

- File: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:97
- Claim: The walker calls readdirSync on its starting directory before checking whether that directory is a symlink. A symlinked default root or declared directory scope can enumerate external files and emit them as in-skill resource paths.
- Evidence: [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:97], [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:104], [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:124], [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:272]
- Counterevidence sought: Nested symlink entries are realpath-confined and lexical ../ scopes are rejected. The scope tests do not exercise a symlink at the walk start.
- Alternative explanation: Generation records paths rather than file contents, but consumers can resolve those paths through the same symlink.
- Final severity: P1, confidence 0.88.
- Downgrade trigger: Confine every walk start to the real skill root and test default and declared scope roots that point outside.
- Recommendation: Validate the canonical starting path before the first directory read.

#### R2-P1-003: Archive destination symlink can move packets outside specs

- File: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:276
- Claim: The source packet is canonicalized and confined, but parent/z_archive is used without resolving or checking the destination. A z_archive symlink can redirect the copy and rename outside specs, after which the source packet is removed.
- Evidence: [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:235], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:276], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:295], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:309]
- Counterevidence sought: Existing tests exclude symlinked tracks and reject restore paths outside specs. They do not validate a symlink at the archive destination.
- Alternative explanation: Standard use has a real z_archive directory inside the packet home; the risk requires an accidental or untrusted symlink.
- Final severity: P1, confidence 0.90.
- Downgrade trigger: Canonicalize and confine the archive root before copy or source removal, with a test for an outside-target z_archive link.
- Recommendation: Reject symlinked archive destinations and require their real path to remain under specs.

#### R2-P1-004: Write token is available to dependency installation scripts

- File: .github/workflows/trigger-index-rebuild.yml:34
- Claim: The workflow gives a write token to checkout and runs npm ci before the generator and push steps. With actions/checkout credential persistence enabled by default, package installation scripts can read the stored credential.
- Evidence: [SOURCE: .github/workflows/trigger-index-rebuild.yml:11], [SOURCE: .github/workflows/trigger-index-rebuild.yml:34], [SOURCE: .github/workflows/trigger-index-rebuild.yml:46]
- Counterevidence sought: The workflow has no pull_request trigger. Its lockfile-based install and integration-branch triggers reduce exposure, but do not remove the credential from install scripts.
- Alternative explanation: The token may be tightly scoped to index writes; the precise impact depends on the pinned checkout action behavior and token permissions.
- Final severity: P1, confidence 0.83.
- Downgrade trigger: Verify the pinned checkout action does not persist credentials, or remove the credential before npm lifecycle scripts and confirm the token has only non-sensitive index-write scope.
- Recommendation: Disable checkout credential persistence and provide a narrowly scoped credential only to the final commit/push step.

### P2

None.

## Traceability Checks

- Core spec-to-code and checklist-evidence checks were deferred; this iteration focused on filesystem and workflow trust boundaries.
- Skill-agent parity, cross-runtime agent parity, feature-catalog alignment and playbook execution were deferred.

## Search Coverage

Covered healer document symlink writes, leaf-manifest scope-root symlinks, archive destination symlinks, workflow credential exposure, hook trust and common credential signatures. Read-only PR workflow interpolation was reviewed and ruled out for free-form shell input. Upgrade legacy path helpers reject absolute and lexically escaping repository paths and hash symlink entries without following them. The full upgrade apply/move transaction was not exhausted and remains deferred.

## Verdict

Four P1 security findings remain. The iteration verdict is CONDITIONAL.

## Next Dimension

Traceability. Continue the deferred upgrade apply/move path boundary in a later security review if the security dimension is revisited.

Review verdict: CONDITIONAL

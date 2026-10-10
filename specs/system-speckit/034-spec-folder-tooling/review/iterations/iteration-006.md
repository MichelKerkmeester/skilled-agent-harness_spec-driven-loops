# Review Iteration 6

## Dimension

Security — broadened second pass.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs`, `upgrade-legacy.mjs`, and `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` with its scope tests.
- `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` and `.github/workflows/trigger-index-rebuild.yml`.
- Doctor update YAML, `release-update.cjs`, and compatibility integration, contract, and unit tests.
- Git pre-commit hook, `gates.tsv`, and `gate-config.sh`.
- `.github/workflows/changed-packet-validation.yml`, `spec-kit-check.yml`, and `strict-pass-freshness-report.yml`.

## Findings by Severity

### P0

None.

### P1

These four open iteration-2 findings were replayed. Each remains active; no new finding was added.

#### R2-P1-001: Default healer writes through symlinked packet documents

- Claim: The default path reads packet documents directly and applies changed text with `fs.writeFileSync`. A symlinked document can redirect the write outside its packet. `upgrade-legacy` invokes this path with `--apply`.
- Evidence: `healDoc` reads the given path without a symlink check, discovery accepts a `spec.md` entry by name, and the apply path writes directly. The upgrade caller passes `--apply`. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:698] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:736] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1415] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:857]
- Counterevidence sought: Other healer modes use atomic replacement; the default path is separate. No document-level symlink check or canonical-path confinement was found in the caller or apply path.
- Alternative explanation: The default command is dry-run unless `--apply` is supplied, and it writes only when a repair changes the document.
- Severity: P1, confidence 0.90.
- Downgrade trigger: Reject symlinked documents and prove an external symlink target remains unchanged during `--apply`.

#### R2-P1-002: Leaf walker follows a symlinked scope root outside the skill

- Claim: A declared scope that is a symlink to an external directory is followed by `statSync`; the walker then calls `readdirSync` on that root before entry-level symlink checks. External leaf paths can be emitted as in-skill resources.
- Evidence: The walk starts from the joined path, reads it, and only then checks symlink entries; scoped collection follows the directory with `statSync`. Existing tests cover lexical traversal but not a symlink at the walk root. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:97] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:104] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:120] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:124] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:272] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-scopes.test.cjs:184]
- Counterevidence sought: Absolute and parent-traversal scopes are rejected, and nested symlinks are realpath-confined. Neither check validates the starting directory itself.
- Alternative explanation: The generator records relative paths rather than file contents, although consumers can resolve those paths through the same symlink.
- Severity: P1, confidence 0.88.
- Downgrade trigger: Confine each canonical walk start to the real skill root and cover default and declared roots that point outside.

#### R2-P1-003: Archive destination symlink can move packets outside specs

- Claim: The source packet is resolved and confined under `specs`, but `parent/z_archive` is not resolved or checked before copy and source removal. A symlinked destination can redirect the copy outside `specs`.
- Evidence: Source confinement is checked, then the destination is formed and used by `mkdir`, `cp`, `mv`, and source `rm`. A separate directory walk skips symlinked archives but does not guard this direct archive path. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:235] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:276] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:277] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:295] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:309] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:329]
- Counterevidence sought: Source canonicalization and symlink skipping in archive discovery. The direct destination path has no canonical destination guard.
- Alternative explanation: Normal use has a real `z_archive` directory; the issue requires a symlinked destination and an archive operation.
- Severity: P1, confidence 0.90.
- Downgrade trigger: Resolve and confine the destination before copying or removing the source, with an outside-target symlink case.

#### R2-P1-004: Write token is available to dependency installation scripts

- Claim: The workflow grants `contents: write`, supplies checkout with a push token, and runs `npm ci` before generation and push. No credential-persistence override or credential removal precedes installation.
- Evidence: Permissions and checkout token are configured before the install step. The workflow has push and manual triggers, not a pull-request trigger. [SOURCE: .github/workflows/trigger-index-rebuild.yml:11] [SOURCE: .github/workflows/trigger-index-rebuild.yml:31] [SOURCE: .github/workflows/trigger-index-rebuild.yml:34] [SOURCE: .github/workflows/trigger-index-rebuild.yml:43] [SOURCE: .github/workflows/trigger-index-rebuild.yml:46]
- Counterevidence sought: Pinned actions, a lockfile install, and the restricted trigger set reduce dependency and trigger exposure, but leave the checkout credential available during install.
- Alternative explanation: The impact depends on credential persistence in the pinned checkout action and the effective token scope.
- Severity: P1, confidence 0.83.
- Downgrade trigger: Verify the pinned action at its exact SHA and disable persistence or defer a narrowly scoped credential until the push step.

### P2

No new P2 finding was established. A separate workflow-log boundary remains deferred below.

## Traceability Checks

Core spec-to-code and checklist-evidence checks, plus skill-agent, cross-runtime, feature-catalog, and playbook checks, were deferred because this iteration was limited to security.

## Verdict

Conditional because four active P1 findings remain confirmed. The expanded doctor, hook, and workflow pass found no additional P1 issue. A possible workflow-command log injection path is deferred pending inspection of the strict-pass-freshness report producer. No reviewed source file was modified.

## Next Dimension

Traceability remains pending for the next pass. The strict-pass-freshness report producer should also be traced before ruling out the deferred log boundary.

Review verdict: CONDITIONAL

# Spec-Root Alias Retirement Runbook

This runbook removes the repository-root `specs` compatibility alias only after the canonical `.opencode/specs` root is independently safe. It does not migrate, delete, or roll back packet data.

## Why Retirement Is Required

The tracked `specs` blob is a symbolic link whose current payload is an absolute path on one developer machine. That payload is not portable:

- A fresh clone on another machine cannot resolve the machine-specific target.
- A linked worktree can resolve outside its own checkout and read or write another workspace.
- An archive preserves the absolute payload but not the original machine layout.
- A checkout with `core.symlinks=false` can materialize the link blob as a plain file containing the target text, not as a directory alias.

A relative `specs -> .opencode/specs` link avoids the machine-specific target on symlink-capable hosts, but it still fails as a universal contract when symlinks are unavailable. Canonical behavior must therefore work with no alias present.

## Stop Conditions

Stop the retirement if any precondition lacks evidence, any mandatory matrix row fails or skips, telemetry records a legacy dependency, `specs` reappears after removal, or `.opencode/specs` changes during the retirement operation. Resolve the failing dependency before restarting the compatibility window.

## Preconditions

The release operator must attach evidence for every item below before removing the alias:

1. All preceding root-hardening phases are landed and deployed together: collision preflight, canonicalized packet data, canonical-only writers with collision guards, and canonical-first readers with read-only legacy fallback.
2. The migration inventory has no unclassified, legacy-only, dangling, misdirected, plain-file, or divergent packet state awaiting operator action. Canonical packet data and parent/child metadata are valid.
3. The writer freeze has been lifted only after the canonical writer source and compiled bundles passed. Ordinary legacy writes remain blocked.
4. The compatibility telemetry gate shows 28 consecutive clean days across every deployed environment with exactly zero legacy-fallback hits, zero legacy-write attempts, and zero duplicate conflicts. Any hit resets the window. A unit test that starts with empty in-memory counters is not production-window evidence.
5. Source, clean compiled-runtime, operating-system, and migration/rollback lanes are green. In the operating-system lane, R1, R2, and R4-R10 pass on Linux, macOS, and Windows. Only rows requiring directory-symlink capability may skip, and each skip has a published reason and count; no non-symlink row may skip.
6. The candidate checkout is clean, the canonical tree is backed up according to normal release policy, and the operator has confirmed that `specs` is the single tracked mode-`120000` entry rather than a separately tracked data tree.

Record the final preflight without changing the checkout:

```bash
test -z "$(git status --porcelain)"
git ls-files --stage -- specs
test "$(git ls-files --stage -- specs | cut -d' ' -f1)" = "120000"
```

On a symlink-capable checkout, also record `readlink specs`. An absolute result confirms the unsafe machine-specific payload. On a `core.symlinks=false` checkout, `specs` may instead be a plain file; `git rm` below safely removes either checkout realization.

Dispatch `.github/workflows/spec-root-resolution-matrix.yml` against the candidate behavior revision before changing the tracked alias. Require all three operating-system jobs to pass and retain their symlink-capability skip reasons and counts as release evidence.

## Final Retirement

Run these commands from the repository root. `git rm` removes only the tracked alias entry; it must not be replaced with a recursive filesystem deletion.

```bash
git rm -- specs

node -e "const fs=require('node:fs');try{fs.lstatSync('specs');throw new Error('specs still exists')}catch(error){if(error.code!=='ENOENT')throw error}"

test -z "$(git diff --name-only -- .opencode/specs)"
test -z "$(git diff --cached --name-only -- .opencode/specs)"
git diff --cached --name-status -- specs
```

The staged name-status output must contain only the deletion of `specs`. Do not proceed if canonical packet files are staged or modified.

Run the targeted spec-root suites with the alias absent, then repeat the filesystem assertion:

```bash
(
  cd .opencode/skills/system-spec-kit/scripts
  npm exec -- vitest run tests/spec-root-*.vitest.ts \
    --config ../mcp_server/vitest.config.ts \
    --root .
)

node -e "const fs=require('node:fs');try{fs.lstatSync('specs');throw new Error('specs was re-materialized')}catch(error){if(error.code!=='ENOENT')throw error}"
```

Commit the staged deletion as a reviewable release candidate only after the pre-retirement matrix and local no-alias checks are green:

```bash
git commit -m "chore(spec-kit): retire specs alias"
```

Push the candidate through the normal review process. The root `specs` path is a workflow trigger, so the deletion commit runs the three operating-system jobs again. Do not merge or promote the candidate unless that post-removal run is green and its skip report satisfies the same policy.

## Verify No Re-Materialization

Repeat these checks after every representative writer or release smoke test and once more after the deployed release has completed its normal save/index cycle:

```bash
node -e "const fs=require('node:fs');try{fs.lstatSync('specs');throw new Error('specs exists')}catch(error){if(error.code!=='ENOENT')throw error}"
git status --short -- specs .opencode/specs
```

Before the retirement commit, the only expected status is the staged deletion of `specs`. After the commit, both commands must report no `specs` entry and no unexpected canonical-tree mutation. Any reappearance identifies a remaining writer, installer, checkout hook, or external automation dependency; stop rollout and identify that owner rather than deleting the entry repeatedly.

## Rollback Bridge

Rollback never moves or restores packet data. Canonical `.opencode/specs` data, canonical-only writers, and collision guards remain authoritative.

If a newly discovered consumer needs a short compatibility period, a symlink-capable POSIX operator may restore only a relative convenience bridge:

```bash
test ! -e specs && test ! -L specs
ln -s .opencode/specs specs
test "$(readlink specs)" = ".opencode/specs"
git add -- specs
git commit -m "chore(spec-kit): restore temporary relative specs bridge"
```

Do not restore the old absolute link blob from history. Do not use the bridge on a host that cannot create directory symlinks, and do not treat it as recovery for `core.symlinks=false`, archives, or other non-symlink environments. Those environments must continue using `.opencode/specs` directly. The bridge is a temporary repository-metadata convenience while the dependent consumer is fixed; it is never a data rollback and never permits legacy writes.

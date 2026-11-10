# Iteration 1 - Code scope: correctness + security of the v4.0.0.11 setup battery

## Dispatcher

- Mode: review (fan-out lineage `deepseek-max`), iteration 1 of 5, stop policy `max-iterations`
- Focus: `correctness` + `security` over the five code-scope entries of `goal-file-manifest.txt`
- Charter: `review/lineages/deepseek-max/steer.md` — code first, then command surface, skill docs,
  cross-repo references, changelogs + final cross-check
- Executor: this process (iterations run inline; no nested dispatch)

## Files Reviewed

- `.skilled/commands/doctor/scripts/git-setup-check.cjs` — full read (1102 lines); exercised
  read-only against this repository: `node .skilled/commands/doctor/scripts/git-setup-check.cjs
  --repo . --tool pi` → `STATUS=OK checks=11`, exit 0
- `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` — harness + test inventory read;
  executed `node --test` → 44/44 pass, exit 0
- `.github/workflows/gate-inputs.yml` — full read (57 lines)
- `.github/scripts/check-gate-inputs.sh` — full read (502 lines); executed read-only against the
  repo → `files=39 inputs_resolved=218 dynamic_inputs=9 twin_pairs=243 failures=0`, `RESULT: PASSED`,
  exit 0
- `.github/scripts/tests/check-gate-inputs.test.sh` — full read (491 lines); executed → 50/50
  fixtures pass, exit 0
- Context (not reviewed as subjects): `.skilled/skills/sk-git/scripts/worktree-naming.sh:139-183`,
  `.skilled/scripts/git-hooks/lib/commit-id-policy.sh:19-42`, `.skilled/hooks/shared/hook-flags.cjs`,
  `.skilled/scripts/git-hooks/pre-push:330` — used to verify the battery's claims about the helpers
  it reports on

## Findings

### P0 Findings

No P0 findings.

### P1 Findings

No P1 findings.

### P2 Findings

1. **Allowlist row reports PASS when the bash probe could not run** -- `.skilled/commands/doctor/scripts/git-setup-check.cjs:504-506` -- `checkAllowlist` maps a spawn failure (`result.error`) to the detail string `${branch}: not checked (cannot run bash: ...)` and then returns `pass(source, details)` at line 523. Every other un-runnable-helper path in this battery reports `UNKNOWN`: `runCommand` returns an `error` object precisely so "callers that read .error treat it as a tool the battery could not run" (lines 181-191), and `checkCommitId` answers `unknown(source, ['cannot run bash: ...'])` on `probe.error` (line 668). With bash unresolvable or un-executable, none of the three sample verdicts is evaluated, yet the row contributes PASS and the fold still reports exit 0/`STATUS=OK` (when nothing else fails) -- the opposite of the battery's stated purpose, "the one place they surface".
   Finding class: correctness / capability conformance
   Scope proof: finding is inside `.skilled/commands/doctor/scripts/git-setup-check.cjs`, a manifest entry; the cited behavior is at the cited lines of that file.
   Affected surface hints: `allowlist` row verdict and repair; battery exit-code fold (`statusOf`, lines 984-990); `/doctor:git setup` report consumers that branch on `result`.
   Case: an operator runs the battery on a host whose PATH exposes `bash` only through a relative or empty entry (so `BASH_BIN` is null), or where `bash` exists but the probe spawn fails; the three allowlist samples are never evaluated, yet `allowlist` is reported PASS and the run can still exit 0, reading as "allowlist verified".

## Traceability Checks

- `spec_code` (core): partial — the packet's `spec.md` is scaffold-level context per the charter,
  not a code contract; the code's own header contract (usage, exit codes, "nothing is written")
  was checked against behaviour and holds, except as recorded in the P2 above.
- `checklist_evidence` (core): partial — no `checklist.md` evidence rows exist for this packet;
  the release's own evidence is the fixture suites, which were run and pass (see Integration
  Evidence).
- Overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`,
  `playbook_capability`): not yet exercised this iteration; deferred to iterations 3-4 where the
  skill docs, catalog and playbooks are the review subject.

## Integration Evidence

- `.github/workflows/gate-inputs.yml:17-20` runs exactly the two commands the steer names; both
  were executed read-only and passed (44/44 node tests, 50/50 shell fixtures, live check
  `failures=0`).
- The battery's JSON report was consumed directly (`--json` contract): fields `repo`, `checks[]`
  with `id/result/source/details/repair`, and `status` are present and match the row order used by
  `/doctor:git setup` (`CHECKS`, `git-setup-check.cjs:945-957`).
- Helper-claim verification: `skilled/v4.0.0.0` is exempted by `.skilled/scripts/git-hooks/pre-push:330`
  (`skilled/v*) continue`), matching the battery's sample comment (lines 86-90); the allowlist
  file/matcher description matches `.skilled/skills/sk-git/scripts/worktree-naming.sh:142-183`;
  the kill-switch file parsing matches `.skilled/hooks/shared/hook-flags.cjs:96-131`.

## Edge Cases

- Running the node fixture suite with `TMPDIR` pointing inside a git work tree changes the
  `install` repair expectation (the fixture then resolves the outer repository as its toplevel).
  Re-ran with `TMPDIR` inside this lineage plus `GIT_CEILING_DIRECTORIES` set to the same
  directory (inside the lineage) so isolation matches the default and all 44 tests pass.
- The live repo's allowlist file carries no patterns; `feature/setup-check-probe: refused` is
  therefore the expected verdict, and `main: allowed` comes from the built-in exception.
- The two mirror roots (`.skilled`, `.opencode`) both exist in this checkout, so the workflow's
  hardcoded `.opencode` install paths and the adaptive hook-suite root selection were both
  observable; no divergence surfaced this iteration.

## Confirmed-Clean Surfaces

- PATH narrowing and absolute-entry-only binary resolution (`resolveBinary` lines 151-163,
  `narrowPath` lines 173-175); a planted `./git`/`./bash` cannot run.
- Repository-redirection hardening: `REPO_SELECTING_VARS` deleted and `core.fsmonitor=false` /
  `log.showSignature=false` forced through the environment (lines 131-144, 210).
- `readRepoFile` opens with `O_NONBLOCK` (+`O_NOFOLLOW` when asked), fstats the descriptor, and
  caps at 1 MiB; FIFO/device/directory are reported, not read (lines 245-275).
- The run is observation-only: the byte-level fixture snapshot test ("a run leaves the fixture
  tree, .git included, and its local config unchanged") passes, and the battery's only child
  processes are `git` read queries, `bash` helper probes and the gate-list helper.
- Gate registry env leakage is handled (`delete env.GATE_REGISTRY`, lines 407-411) and covered by
  a test.

## Ruled Out

- "The install row could run `install-git-hooks.sh` from an untrusted clone": ruled out — the
  installer is never invoked; the hook links are read and compared in process (comment lines
  314-321), covered by the untrusted-clone test.
- "GIT_DIR / GIT_WORK_TREE could point probes at another repository": ruled out — dropped from
  the child environment, with a dedicated test.
- "`git log` could run a repository's `gpg.program` via `log.showSignature`": ruled out —
  disabled by `SAFE_GIT_CONFIG`, with a dedicated test.
- "The check could be steered by an inherited `GATE_REGISTRY`": ruled out — removed before the
  helper runs, with a dedicated test.

## Next Focus

- Dimension: traceability + maintainability (command surface)
- Focus area: `.skilled/commands/doctor/git.md`, `assets/doctor-git-setup.yaml`,
  `assets/doctor-git-presentation.txt`, `_routes.yaml`, `scripts/README.md`; judge against the
  `sk-create-command` authoring contract (router, presentation and YAML split) and run
  `bash .skilled/commands/doctor/scripts/route-validate.sh`
- Reason: charter order (code -> command surface) and iteration 1's context: the battery's JSON
  contract and exit codes are now known, so the command's consumption of them can be checked
- Required evidence: `route-validate.sh` output; `git.md` route entries vs `_routes.yaml`; the
  YAML's parse of `git-setup-check.cjs --json`; presentation file format checks
- Rotation status: correctness/security of the code scope is covered; code returns only for
  cross-checks if the command surface cites it.

Review verdict: PASS

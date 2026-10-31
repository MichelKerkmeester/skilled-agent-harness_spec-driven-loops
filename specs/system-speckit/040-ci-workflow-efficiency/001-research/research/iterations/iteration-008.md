# Iteration 008 — Overengineering: hook/CI duplication and jobs that cannot fail

## Focus

Compare every CI check against the git hooks that already run locally, then compare workflows against each other: which checks are paid twice, which jobs are structurally incapable of failing, and which jobs run far more than their names promise. Target files read in full: `.github/workflows/advisory-checks.yml` and `.github/workflows/strict-pass-freshness-report.yml`, plus the hook tree and the per-workflow trigger/step map for all 34 YAML files.

## Actions Taken

1. Enumerated the hook tree (`.skilled/hooks/*`, 33 entries), the git hook folder (`.skilled/hooks/git/`), the flag surface `.skilled/hooks/hook-flags.env.example` and the shared post-edit dispatch table `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs`.
2. Read both target workflows in full and extracted every `continue-on-error`, every job-level `if:`, and the trigger block for all 34 workflows.
3. Mapped the `run:` and `- name:` lines of every workflow to find repeated toolchain provisioning and overlapping test trees.
4. Checked for a pre-push hook with `rg -n pre-push .skilled/hooks/README.md` (no match) and read the standalone `.skilled/hooks/git/pre-commit` in full.

Read-only throughout: no workflow, script, hook or code file was modified.

## Findings

### F1 [P1] `advisory-checks.yml` suppresses its own signal twice, and one of its three checks races the workflow that repairs it

1. Triggers with no path filter at all: push to `main` and `skilled/**`, every pull request, plus dispatch [SOURCE: .github/workflows/advisory-checks.yml:2-6] (confirmed).
2. All three steps carry `continue-on-error: true` [SOURCE: .github/workflows/advisory-checks.yml:27], [SOURCE: .github/workflows/advisory-checks.yml:41], [SOURCE: .github/workflows/advisory-checks.yml:55], and each command is *also* written to exit zero: `node "$RUNNER" || true` [SOURCE: .github/workflows/advisory-checks.yml:38], `node "$VALIDATOR" || echo ...` [SOURCE: .github/workflows/advisory-checks.yml:52], `node "$GENERATOR" --check || echo ...` [SOURCE: .github/workflows/advisory-checks.yml:66] (confirmed).
3. Self-defeating detail: the header instructs the reader to read the step output rather than the run status [SOURCE: .github/workflows/advisory-checks.yml:15], but the `||` fallbacks already force every step to success, so the step status is green too. The only surviving signal is free text in the log, and nothing parses it (confirmed for the code shape; the claim that no step can ever be red follows directly from `||` plus `continue-on-error`).
4. Trigger collision: step three verifies the committed trigger index on push to `main` [SOURCE: .github/workflows/advisory-checks.yml:66], while `trigger-index-rebuild.yml` fires on the same push [SOURCE: .github/workflows/trigger-index-rebuild.yml:7] and regenerates, verifies and commits that exact file [SOURCE: .github/workflows/trigger-index-rebuild.yml:72]. Trigger overlap confirmed; the conclusion that the freshness check can only report drift the sibling workflow is about to repair is inferred, because the two runs are not ordered against each other.
5. Cost: three whole-repository passes (`run-node-tests.mjs`, the doc-model validator, the index generator walk) per pull request and per push to the integration branches, for a run that is green by construction (confirmed triggers; runner-minute cost is the class measured in earlier iterations, not re-measured here).

### F2 [P1] Two of the three review-time CI checks are the commit gate re-run, with no path filter

1. Commit-time comment hygiene: the checker is resolved at [SOURCE: .skilled/hooks/git/pre-commit:32] and run over the staged blobs at [SOURCE: .skilled/hooks/git/pre-commit:60] (confirmed). The primary installed hook `.skilled/scripts/git-hooks/pre-commit` is documented as carrying its own inline comment-hygiene gate rather than calling this folder's script [SOURCE: .skilled/hooks/README.md:242] (documented).
2. Commit-time agent mirror sync: `check-agent-mirror-sync.cjs` runs over staged agent files [SOURCE: .skilled/hooks/git/pre-commit:85-113] (confirmed).
3. CI re-runs the same two checkers: [SOURCE: .github/workflows/comment-hygiene.yml:15], [SOURCE: .github/workflows/agent-mirror-sync.yml:26] (confirmed).
4. The duplication is not accidental; the workflows README states it: the review-time workflows exist while the pre-commit hook runs the same checkers on every commit [SOURCE: .github/workflows/README.md:71] (documented).
5. Neither workflow is path-filtered: `comment-hygiene.yml` is a bare pull_request trigger [SOURCE: .github/workflows/comment-hygiene.yml:3] (confirmed). The backstop is justified for forks and `--no-verify` commits, but it pays a checkout plus Node setup on every PR even when no commented file changed (inferred from the unfiltered trigger).
6. `agent-mirror-sync.yml` additionally builds the shared package that its checker loads [SOURCE: .github/workflows/agent-mirror-sync.yml:20-21], work the commit-time path does not need (line confirmed; the necessity of the build in CI is inferred from the step name).

### F3 [P1] `dispatch-enforcement-guard.yml` pays for the entire hooks vitest tree, not the dispatch suites

1. It installs the hooks workspace [SOURCE: .github/workflows/dispatch-enforcement-guard.yml:60-61] and then runs `vitest run --config .skilled/hooks/vitest.config.ts` with no project, path or test-name filter [SOURCE: .github/workflows/dispatch-enforcement-guard.yml:66-67] (confirmed from the command line itself).
2. Its two named dispatch steps are separate, narrow `node --test` invocations [SOURCE: .github/workflows/dispatch-enforcement-guard.yml:22-29], [SOURCE: .github/workflows/dispatch-enforcement-guard.yml:41-42], so the vitest step is additional scope rather than the dispatch coverage.
3. Sibling workflows already own the hook test trees: `gate-inputs.yml` runs the `*.test.sh` hook suites [SOURCE: .github/workflows/gate-inputs.yml:41-42], and `hooks-node-tests.yml` runs the `node:test` suites and the installer test [SOURCE: .github/workflows/hooks-node-tests.yml:75-76], [SOURCE: .github/workflows/hooks-node-tests.yml:95-96] (confirmed).
4. Which suites the unfiltered vitest run actually includes is inferred from the missing filter; the confirming check is the `include` globs in `.skilled/hooks/vitest.config.ts`, which this iteration did not read.

### F4 [P2] The same spec-kit install-and-build is bought seven times

1. npm ci plus `tsc --build` plus a runtime build repeats in changed-packet-validation [SOURCE: .github/workflows/changed-packet-validation.yml:30], command-tree-parity (twice, once per job) [SOURCE: .github/workflows/command-tree-parity.yml:22], [SOURCE: .github/workflows/command-tree-parity.yml:58], playbook-operator-contract [SOURCE: .github/workflows/playbook-operator-contract.yml:22], routing-registry-drift [SOURCE: .github/workflows/routing-registry-drift.yml:132], spec-kit-check [SOURCE: .github/workflows/spec-kit-check.yml:81], strict-pass-freshness-report [SOURCE: .github/workflows/strict-pass-freshness-report.yml:37], trigger-index-rebuild [SOURCE: .github/workflows/trigger-index-rebuild.yml:58] (confirmed step labels).
2. Several fire together on one change: `gate-inputs.yml` is unfiltered by design because a source-tree move is the one change a path filter would miss [SOURCE: .github/workflows/README.md:68], and the rest carry overlapping filters [SOURCE: .github/workflows/README.md:69-70] (documented).
3. Scope note: this iteration adds the count, not new timing. The per-install cost belongs to the earlier cost measurements and was not re-run.

### F5 [P2] The never-gating surface is exactly two workflows, and the weekly one stacks a second suppression layer

1. Non-gating inventory: `advisory-checks` (three continue-on-error steps, [SOURCE: .github/workflows/advisory-checks.yml:27]) and `strict-pass-freshness-report`, whose derived-repair step is also continue-on-error [SOURCE: .github/workflows/strict-pass-freshness-report.yml:164-165]. Both are documented as reporting only [SOURCE: .github/workflows/README.md:26], [SOURCE: .github/workflows/README.md:57] (documented). Every other workflow blocks.
2. `message-contract.yml` is the one deliberate cross-trigger duplicate, and it gates because local hooks can be skipped [SOURCE: .github/workflows/README.md:73] (documented).
3. Inside the weekly report, the baseline round trip (gh run list, gh run download, parse and validate) occupies [SOURCE: .github/workflows/strict-pass-freshness-report.yml:53-103] and its only consumer is a regression count printed as a warning [SOURCE: .github/workflows/strict-pass-freshness-report.yml:145-148] (confirmed shape; whether the time is well spent is a judgement, not a measurement).

### F6 [P2] Three workflows pip-install the same pinned test dependencies with no cache

1. `pytest==8.4.2` is installed at [SOURCE: .github/workflows/naming-standard-guard.yml:28], [SOURCE: .github/workflows/sk-doc-rename-harness.yml:46], [SOURCE: .github/workflows/sk-doc-script-tests.yml:37], two of them with `pyyaml==6.0.3` alongside (confirmed).
2. All three are path-filtered and run on PR plus push, so the install is paid per change of their inputs (confirmed duplication; the saving is one cache key or one shared composite action, cost inferred as small).

### F7 [P3] There is no pre-push hook to compare against (inferred)

1. `pre-push` does not appear anywhere in the hooks README (`rg -n pre-push .skilled/hooks/README.md` returned no match), and the commit-hook folder carries a single `pre-commit` [SOURCE: .skilled/hooks/git/pre-commit:1-10] (confirmed for this folder).
2. The primary installer is `.skilled/scripts/git-hooks/pre-commit` per [SOURCE: .skilled/hooks/git/install-hooks.sh:7], and this iteration did not enumerate `.skilled/scripts/git-hooks/`, so the repo-wide absence claim is inferred. Confirming check: list that directory.
3. If it holds only `pre-commit`, every push-range and whole-history check has no local counterpart, which is exactly the gap message-contract.yml fills [SOURCE: .github/workflows/README.md:73] (documented rationale).

## Questions Answered

**Which workflows or jobs are overengineered, such as duplicates of pre-commit hooks or advisory jobs that never gate?**

- Duplicates of the commit gate: `comment-hygiene.yml` and `agent-mirror-sync.yml` re-run the pre-commit checkers, which the workflows README itself states. Their value is the fork and `--no-verify` backstop, so removal is wrong and path-filtering the changed-file classes is right.
- Advisory jobs that never gate: only two workflows qualify. `advisory-checks.yml` is the one worth fixing, because it pays three whole-repo passes on every PR and push while both of its suppression layers overlap, one of its three checks duplicates the repair workflow firing on the same trigger, and it is unfiltered.
- Over-scoped jobs: `dispatch-enforcement-guard.yml` runs the whole hooks vitest tree under a dispatch-specific name, on top of two narrow dispatch suites.
- Repeated provisioning: seven workflows buy the same spec-kit install and build, three buy the same pytest install, and three share overlapping hook test trees.

## Questions Remaining

- What security and pinning hygiene gaps exist in the workflows?
- What on/off control design lets a clone or base repo disable workflows or groups without editing YAML?
- What should a /doctor:ci command do, how is it made safe, and who owns it?
- What should an sk-code-ci mode contain, and what does registering a new sk-code mode require?
- How do the ranked recommendations group into ordered implementation phases 002 and later?
- Carried forward: are spec-kit tests fixture-collision-safe under fileParallelism true, and does the spec-kit vitest config also set it (iteration 5).
- Carried forward: what are the include globs of `.skilled/hooks/vitest.config.ts`, which decides how much of F3 is real.

## Next Focus

Security and pinning hygiene across all 34 workflows: action reference forms and whether every `uses:` is SHA-pinned with a version comment, third-party action sourcing, `pull_request_target` usage, `permissions:` blocks (which jobs request more than read), secret exposure in fork-run contexts, script injection through `${{ }}` interpolation into `run:` bodies, and token scoping in the workflows that push.

## Candidate recommendations seeded this iteration (ranked later)

1. Path-filter `comment-hygiene.yml`, `agent-mirror-sync.yml` and `prompt-card-sync.yml` to the file classes their checkers read, keeping the PR backstop (saving: one job per unaffected PR; risk: low; effort: low).
2. Narrow `dispatch-enforcement-guard.yml` to the dispatch suites or drop the vitest step where gate-inputs and hooks-node-tests already cover it (saving: one provisioned hooks workspace per PR; risk: low; effort: low).
3. Drop the redundant `||` fallbacks in `advisory-checks.yml` so step status becomes a real signal, and path-filter the workflow or move it to schedule plus dispatch (saving: three whole-repo passes per PR; risk: low; effort: low).
4. Deduplicate the spec-kit install into a shared composite action or a cached archive consumed by the seven workflows (saving: large; risk: medium; effort: medium).

## SCOPE VIOLATIONS

None. No mutation outside the two allowed artifacts was attempted.

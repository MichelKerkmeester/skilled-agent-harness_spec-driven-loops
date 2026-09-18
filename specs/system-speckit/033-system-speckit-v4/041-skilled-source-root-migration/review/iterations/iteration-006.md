# Iteration 006: Continuous integration

**Executor.** gpt-5.6-luna, reasoning max, service tier fast, read-only sandbox.

## CI-001 `.skilled` package changes do not trigger `spec-kit-check`

- **Severity:** P1
- **File:** `.github/workflows/spec-kit-check.yml:7`
- **Trigger:** A push to `main` or `skilled/**`, or a PR to `main`, changes only `.skilled/package.json` or `.skilled/package-lock.json`.
- **Consequence:** The workflow is skipped, so dependency, plugin SDK or override changes are not covered by its install and test suites.
- **Evidence:** The workflow installs `.skilled` at line 72, but neither package file appears in the push paths at lines 7-24 or PR paths at lines 28-45. Both files were added in the migration range.
- **Fix:** Add both `.skilled/package.json` and `.skilled/package-lock.json` to both trigger path lists.

## CI-002 Direct release pushes bypass six CI gates

- **Severity:** P1
- **File:** `.github/workflows/markdown-link-integrity.yml:3`
- **Trigger:** A direct push to a documented `skilled/v*` release branch.
- **Consequence:** Markdown-link, repo-rules, rule-canary, frontmatter, playbook-contract and runtime-import checks do not run.
- **Evidence:** Four workflows are PR-only: `markdown-link-integrity.yml:3-5`, `repo-rules-corpus.yml:2-5`, `rule-canary-sync.yml:2-4` and `skill-doc-frontmatter.yml:2-5`. `playbook-operator-contract.yml:6-8` and `runtime-no-spec-import.yml:8-20` push only on `main`. No matching guard invocations exist in `.skilled/scripts/git-hooks`. The README says release lines are pushed directly at `README.md:45` and incorrectly claims equivalent hook coverage at line 54.
- **Fix:** Add `push` coverage for `main` and `skilled/**` to these workflows, retaining their path filters, and correct the README matrix.

## GATE-001-REFINED `.skilled` hook inputs are still ignored by the parser

- **Severity:** P1
- **File:** `.github/scripts/check-gate-inputs.sh:194`
- **Trigger:** A hook contains `CHECKER="$REPO_ROOT/.skilled/bin/missing.sh"` or a quoted `.skilled` command path.
- **Consequence:** The parser emits `note` instead of validating the path. `scan_hook` ignores notes at lines 303-311, so a missing canonical-root gate input passes.
- **Evidence:** Root matching is symmetric at line 188, but line 194 accepts only `^\.opencode/`. Literal assignment handling at line 267 and quoted command handling at line 290 are also `.opencode`-only. The migration diff changed workflow matching at lines 369 and 376, but not these hook branches.
- **Fix:** Use the shared `\.(opencode|skilled)` predicate in lines 194, 267 and 290, then add `.skilled` missing-input fixtures.

## CI-003 README names a nonexistent workflow

- **Severity:** P2
- **File:** `.github/workflows/README.md:18`
- **Trigger:** An operator follows the documented `spec-root-resolution-matrix.yml` workflow reference.
- **Consequence:** The documented resolution matrix cannot be located or run.
- **Evidence:** The file is also listed at `README.md:56`, but `.github/workflows/spec-root-resolution-matrix.yml` does not exist in the current workflow inventory. This reference was already present at the supplied base commit.
- **Fix:** Remove the stale matrix references, or restore the workflow if it is still required.

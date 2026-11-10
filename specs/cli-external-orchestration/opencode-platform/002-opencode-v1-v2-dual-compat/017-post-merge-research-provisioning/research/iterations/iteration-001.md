# Iteration 001 — A27: worktree provisioning & the dispatch adapter suite runner

## Focus

A27 worktree provisioning and the adapter suite runner: what can still fail, drift or mislead in `.skilled/skills/sk-git/scripts/worktree-naming.sh` (`provision_worktree`, `_wn_deps_satisfied`, the bun and npm choice, the build step), `worktree-provision-paths.txt`, `tests/worktree-naming.test.sh`, and the dispatch adapter suite runner documented in `specs/hooks/024-dispatch-adapter-test-repair/` and `.skilled/hooks/vitest.config.ts`. Whether every provisioned tree on main is listed, whether a lockfile change or a missing bun is handled, whether the documented runner commands match `.skilled/hooks/` docs and package scripts, and whether CI runs these suites with the owning runner.

Merge baseline verified before research: `1001ab297f` (the commit the six post-merge research worktrees branch from) **is an ancestor of main HEAD** `3a7d876779`, so everything below describes the post-merge main state.

## Actions Taken

1. Ran the owning test suite: `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` → `PASS=97 FAIL=0`, exit 0, on this post-merge tree.
2. Read `worktree-naming.sh` provisioning sections (lines 400–600) and all of `worktree-provision-paths.txt` (55 lines).
3. Inventoried main-checkout package manifests and lockfiles via `find` + `git ls-files` (read-only, run from the main checkout, never creating or removing worktrees).
4. Read `.skilled/hooks/vitest.config.ts` (47 lines), the `.skilled/hooks/README.md` validation block (lines 211–221), spec 024 (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`), and `.github/workflows/` (grep for the adapter suites, the hooks vitest config, and the sk-git script tests).
5. Re-ran the README's adapter-suite command from this worktree: `.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts` over the three adapter files → **3 files, 58 tests passed, exit 0**, pinned vitest 5.0.3 — matching spec 024 SC-001 exactly.

## Findings

Ranked; each labelled confirmed / documented / inferred.

**F1 — P1, confirmed: the provision list is missing five tracked package trees; its completeness claim silently lags the tree.**
`worktree-provision-paths.txt` lists 11 packages [SOURCE: .skilled/skills/sk-git/scripts/worktree-provision-paths.txt:16-55]. Main carries 20 manifests under `.skilled`/`.opencode`/`.pi`; five tracked ones are absent from the list:
- `.pi/extensions/pi-fast-mode-w-subagent-support` — tracked manifest + tracked `package-lock.json`; declares `test: vitest run`, `check` [SOURCE: .pi/extensions/pi-fast-mode-w-subagent-support/package.json:1]
- `.pi/extensions/pi-cache-optimizer` — tracked manifest + tracked lockfile; declares `test: node --import jiti/register --test tests/*.test.ts`, `typecheck`, `check` [SOURCE: .pi/extensions/pi-cache-optimizer/package.json:1]
- `.skilled/skills/mcp-code-mode/mcp-server` — tracked manifest; a `package-lock.json` sits beside it on main (manifest tracked confirmed; lockfile tracked-status not separately checked)
- `.skilled/skills/sk-design/sk-design-md-generator/backend` — tracked manifest + tracked lockfile
- `.skilled/skills/mcp-tooling/mcp-obsidian/mcp-servers/obsidian-mcp` — tracked manifest, no lockfile
Impact is conditional — no currently documented gate runs these trees' tests inside a fresh worktree — but the list's header promises "dependency trees a worktree needs before it can build, test, or pass its own commit gates", so the drift is between the file's own claim and the repository. Ruled out as non-findings: `.pi/npm` and `.pi/git/*` have no tracked manifest, so their absence is correct, not drift.

**F2 — P2, confirmed: nothing guards list completeness — the suite can only catch output-name gaps, never missing packages.**
The only completeness-adjacent test, `unnamed_build_outputs`, iterates the list itself and skips any listed package without a manifest [SOURCE: .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh:399,417]. It proves listed packages name their build outputs; it cannot see an unlisted package. No test enumerates tracked manifests and diffs them against the list, so F1-class drift is structurally undetectable by the suite that passes 97/0.

**F3 — P2, confirmed: lockfile drift fails loudly but is unhandled and untested.**
A package with `package-lock.json` installs via `npm ci` [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:559] and a bun package via `bun install --frozen-lockfile` [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:557]. Both are strict: any lockfile/manifest mismatch fails the install, marks the package FAILED, and returns 1 — safe (no silent second lockfile), but the only recovery is manual, and no test fixture covers a drifted lockfile (fixtures cover bun presence [SOURCE: .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh:353-365], the no-lock npm-install path, and frozen-lockfile invocation [SOURCE: .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh:330], never a mismatch).

**F4 — P3, confirmed code / inferred risk: the bun-vs-npm choice reads `bun.lock` only.**
The tool decision is `[ -f "$dir/$pkg/bun.lock" ] && [ ! -f "$dir/$pkg/package-lock.json" ]` [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:545]. A package locked with the binary `bun.lockb` format falls to the npm branch and `npm ci`/`npm install` writes a second lockfile — exactly the failure the adjacent comment says must not happen. Latent only: no `bun.lockb` exists anywhere on main today. A package holding both lockfiles (the state `.skilled` itself is in) is correctly treated as npm.

**F5 — P2, confirmed: the adapter suites and the hooks vitest tree have no CI job.**
Grepping `.github/workflows/` for `codex-shell-tool|dispatch-preflight-lint|directive-dedup|hooks/vitest.config` returns zero hits. The dispatch-enforcement-guard job runs only `dispatch-rule-checks.test.mjs` under `node --test` [SOURCE: .github/workflows/dispatch-enforcement-guard.yml:37] and `dispatch-audit.test.mjs` under vitest [SOURCE: .github/workflows/dispatch-enforcement-guard.yml:44-47]. The three suites spec 024 documents are therefore enforced only by humans following the README block [SOURCE: .skilled/hooks/README.md:220-221]; SC-001 [SOURCE: specs/hooks/024-dispatch-adapter-test-repair/spec.md:92] is a local manual check. The sk-git script tests are likewise absent from every workflow (zero grep hits) and from the local pre-push hook, which only exercises `worktree-naming.sh` as a fixture for message validation.

**F6 — P3, documented: `npx --prefix .skilled vitest` in the guard workflow is correct today but sits one root `node_modules` away from the past hazard spec 024 records.** Live probe in this worktree: `npx --prefix .skilled --offline vitest --version` → `vitest/5.0.3`, exit 0, with no root `node_modules` present. Spec 024's own summary names root-level `npx` as the hazard class it fixed [SOURCE: specs/hooks/024-dispatch-adapter-test-repair/implementation-summary.md:106]; the guard workflow still uses the `npx --prefix` form [SOURCE: .github/workflows/dispatch-enforcement-guard.yml:47], which resolves the pinned binary today but would resolve differently if a root `node_modules` with another vitest ever appeared.

**F7 — P3, confirmed: a listed path whose `package.json` disappears is skipped silently.**
`[ -f "$dir/$pkg/package.json" ] || continue` [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:541] emits no warning, and the same skip exists inside the test helper [SOURCE: .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh:404]. A rename like the 2026-09-17 `.opencode`→`.skilled` authored-tree move would silently drop provisioning for the stale path while provision still exits 0.

**Positive invariant (confirmed): the documented owning runner is healthy post-merge.** All three adapter suites pass under the hooks config (3 files / 58 tests, exit 0, vitest 5.0.3) in this worktree, matching SC-001's counts exactly, and the worktree-naming suite passes 97/0. No regression from the merge on these surfaces.

## Questions Answered

- Which provisioning and adapter-suite-runner paths can still fail, drift or mislead after the merge? — Answered: drift (F1, F2, F7), unhandled-but-loud lockfile failure (F3), latent tool-choice edge (F4), CI enforcement gap (F5), runner-invocation fragility (F6). Runner commands themselves match `.skilled/hooks/README.md` and the pinned `.skilled` vitest; a missing bun is handled (loud failure, no npm fallback).

## Questions Remaining

- Whether any repo gate actually runs the two `.pi` extension packages' test scripts (their `check` scripts exist; no consuming gate found) — determines F1's real impact.
- Whether the mcp-code-mode and sk-design-backend lockfiles are git-tracked (manifests confirmed tracked; lockfile tracked-status not separately checked).
- Whether the hooks vitest tree should join `dispatch-enforcement-guard.yml` or a new workflow (design decision, out of research scope).

## Next Focus

Single-iteration run (1 of 1, maxIterations 1). Follow-up belongs to an implementation packet: add the five missing entries to `worktree-provision-paths.txt` (or document their exclusion), add a tracked-manifest-vs-list coverage test, add a lockfile-drift fixture, decide `bun.lockb` handling, and wire the three adapter suites (plus optionally the hooks vitest tree) into a blocking CI job.

## SCOPE VIOLATIONS

None. All writes stayed inside the research packet; no worktrees were created, removed, or provisioned; no researched file was modified.

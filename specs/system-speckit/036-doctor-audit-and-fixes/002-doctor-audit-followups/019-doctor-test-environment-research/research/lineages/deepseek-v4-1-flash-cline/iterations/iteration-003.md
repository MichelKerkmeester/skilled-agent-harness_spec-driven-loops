# Iteration 003 — Cross-command reuse, exact scenario changes, ordered plan

## Focus
Answer which doctor commands gain from the shared environment, enumerate exactly which scenario files in the five doctor-commands playbooks change and which new scenarios to create, and consolidate the ordered implementation plan.

## Actions Taken
- Read the four doctor-commands READMEs and classified every one of the 34 scenario files by whether it demands a disposable copy.
- Checked where a linked worktree stores shared Git state to test whether the `/doctor:git` hooks scenarios can move to a linked worktree.
- Consolidated the fixture design from iteration 2 with the contract fixes from iteration 1 into an ordered plan.

## Findings

### 1. Reuse assessment per doctor command

| Command | Gain from the shared environment | Constraints |
|---|---|---|
| `/doctor:update` | **High — owner.** DOC-357 to DOC-361 move onto the fixture outright; the four unit statuses are the fixture's reason to exist. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md:19] | Scope every command to the fixture skill units; the `command:commands/doctor` overlay unit stays out of assertions. |
| `/doctor:speckit` | **High.** DOC-349 and DOC-350 need a fresh index, a working lookup and one restorable corpus edit; a long-lived workspace keeps the index and corpus state and removes the per-run copy. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-speckit-retrieval-healthy.md:26] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-speckit-stale-index.md:26] | Overlay the current retrieval runtime, index/data and doctor assets; DOC-350's edit must be restored with `git checkout --` before the scenario ends. |
| `/doctor:runtime-mirrors` | **Medium-high.** DOC-352 needs mirrors last generated from current sources; DOC-353 deletes one generated stub and restores it. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-runtime-mirrors-in-sync.md:26] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-runtime-mirrors-drift.md:14] | Mirror generation is the expensive setup; keep the generated set committed in the fixture. |
| `/doctor:skill-advisor` | **Medium-high.** DOC-348, DOC-362, DOC-363 and DOC-366 all need a built advisor runtime and an existing `skill-graph.sqlite`; a persistent environment pays that cost once. [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-skill-advisor-rebuild.md:24] [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-skill-advisor-tune.md:26] [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-skill-advisor-graph-freshness.md:16] [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-skill-advisor-parent-skill.md:26] | Rebuild is expensive by design; keep it as its own scenario and restore graph metadata after mutation scenarios. |
| `/doctor:env` | **Medium.** DOC-354 to DOC-356 write only small worktree-local files (`.skilled/hooks/hook-flags.env`, one fixture row in `ENV-REFERENCE.md`). [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-env-inspect.md:16] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-env-save-preference.md:16] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-env-secret-and-per-invocation.md:16] | Restore or delete the preference file after the run; the save scenario already exercises a dry-run and a real write. |
| `/doctor:mcp` | **Medium.** DOC-375 to DOC-377 mutate worktree-local configs and need the Code Mode build/server state; a persistent environment keeps the built `mcp-server` instead of rebuilding per copy. [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/doctor-commands/doctor-mcp-install.md:14] [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/doctor-commands/doctor-mcp-debug.md:14] [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/doctor-commands/doctor-mcp-debug-fix.md:14] | DOC-375 needs a missing-dependencies starting state; reset it locally (`node_modules`/build output) rather than by copying the repo. Config checksums are the restore proof. |
| `/doctor:git` | **Medium, with one exclusion.** DOC-371 to DOC-373 write `.sk-git/` files, which are worktree-local. [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-standards-copy-once.md:16] [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-standards-change-rule.md:16] [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-standards-refuse-invalid.md:16] | **DOC-370 must stay on a disposable clone.** It writes local Git config, and a linked worktree resolves `config` to the shared common dir: `git rev-parse --git-path config` in this session printed `/Users/.../Public/.git/config`, and `--git-path hooks` resolved to the user-global hooks path (`COMMAND EVIDENCE`). `git config --local` in the fixture would edit the main checkout's config and hook state. [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-hooks-switch-gate.md:16] An upgrade to `git config --worktree` would need `extensions.worktreeConfig` and a change to the installer, which is a different task. DOC-369 and DOC-374 need no copy today. [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-hooks-list.md:26] [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-target-menu.md:16] |
| `/doctor:deep-loop` | **Low.** Only DOC-368 (scope) fits a persistent environment. DOC-331 and DOC-332 explicitly require an empty or missing graph and no source iterations, and DOC-333 needs a packet whose graph rows exist and are rich enough. [SOURCE: .skilled/skills/system-deep-loop/manual-testing-playbook/doctor-commands/doctor-deep-loop-lazy-init.md:26] [SOURCE: .skilled/skills/system-deep-loop/manual-testing-playbook/doctor-commands/doctor-deep-loop-empty-no-source.md:26] [SOURCE: .skilled/skills/system-deep-loop/manual-testing-playbook/doctor-commands/doctor-deep-loop-convergence.md:45] [SOURCE: .skilled/skills/system-deep-loop/manual-testing-playbook/doctor-commands/doctor-deep-loop-scope.md:24] | Keep 331/332 on their minimal sandboxes; do not delete the shared graph to satisfy them. |

Overall: six of the seven non-updater commands gain, `/doctor:git` gains for its standards subset only, and `/doctor:deep-loop` gains for one scenario.

### 2. Exact existing files to update

One shared environment means one overlay rule: the current doctor command tree plus the runtime/assets each migrated suite exercises is overlaid and committed on the fixture branch (exactly as the updater overlay is), and updater assertions stay scoped to skill units.

**system-spec-kit playbook (12 scenarios + README):**

| File | Change |
|---|---|
| `doctor-speckit-retrieval-healthy.md` (DOC-349) | Expect fresh-index `STATUS_OK` with the phrase-quality advisories visible and zero staleness classes; remove the pollution-only pass criterion. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-speckit-retrieval-healthy.md:26] |
| `doctor-speckit-stale-index.md` (DOC-350) | Keep `STATUS_STALE` from `index_content_stale`; assert advisory isolation; point the copy step at the shared worktree. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-speckit-stale-index.md:26] |
| `doctor-runtime-mirrors-in-sync.md` (DOC-352) | Replace the disposable-copy precondition with the shared worktree. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-runtime-mirrors-in-sync.md:26] |
| `doctor-runtime-mirrors-drift.md` (DOC-353) | Same; delete and restore one generated stub in the shared worktree. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-runtime-mirrors-drift.md:14] |
| `doctor-env-inspect.md` (DOC-354) | Same. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-env-inspect.md:16] |
| `doctor-env-save-preference.md` (DOC-355) | Same; restore `.skilled/hooks/hook-flags.env` after the write. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-env-save-preference.md:16] |
| `doctor-env-secret-and-per-invocation.md` (DOC-356) | Same; remove the appended fixture row. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-env-secret-and-per-invocation.md:16] |
| `doctor-update-check.md` (DOC-357) | Run against the fixture with the four scoped units and `--offline`; assert unit rows, not global freshness. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-check.md:26] |
| `doctor-update-align.md` (DOC-358) | Point at the fixture; assert the run directory under the ignored `.skilled/release/runs/`. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-align.md:26] |
| `doctor-update-apply.md` (DOC-359) | Point at the fixture's completed alignment run; add the rollback reset step from the new DOC-380. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-apply.md:16] |
| `doctor-update-rollback.md` (DOC-360) | Point at the fixture; use DOC-380's reset recipe. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-rollback.md:26] |
| `doctor-update-record-base.md` (DOC-361) | Point at the fixture branch; keep the refusal/`--trust-release` path (offline refusal is testable) and the commit step. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-record-base.md:16] |
| `README.md` | Add the shared environment section, list DOC-380, restate the DOC-349 expectation. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md:10-23] |

DOC-351 is unchanged (no copy today). [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md:11]

**system-skill-advisor playbook (4 scenarios; no README in this folder):**

| File | Change |
|---|---|
| `doctor-skill-advisor-rebuild.md` (DOC-348) | Build the runtime in the shared worktree instead of a copy. [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-skill-advisor-rebuild.md:24] |
| `doctor-skill-advisor-tune.md` (DOC-362) | Same; keep the scoring-lane clean-tree precondition. [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-skill-advisor-tune.md:26] |
| `doctor-skill-advisor-graph-freshness.md` (DOC-363) | Same; add and remove the probe identity inside the shared worktree. [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-skill-advisor-graph-freshness.md:16] |
| `doctor-skill-advisor-parent-skill.md` (DOC-366) | Same. [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-skill-advisor-parent-skill.md:26] |

DOC-364, DOC-365 and DOC-367 need no copy today. [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-skill-advisor-router-reach.md:26] [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-skill-advisor-skill-budget.md:26] [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-skill-advisor-target-menu.md:26]

**system-deep-loop playbook (1 scenario + README):**

| File | Change |
|---|---|
| `doctor-deep-loop-scope.md` (DOC-368) | Point at the shared worktree and its research/review/council artifacts. [SOURCE: .skilled/skills/system-deep-loop/manual-testing-playbook/doctor-commands/doctor-deep-loop-scope.md:24] |
| `README.md` | Replace the blanket "run each one in a disposable copy" rule with per-scenario guidance (DOC-331/332 sandboxes vs DOC-368 shared). [SOURCE: .skilled/skills/system-deep-loop/manual-testing-playbook/doctor-commands/README.md:10] |

**sk-git playbook (3 scenarios + README):**

| File | Change |
|---|---|
| `doctor-git-standards-copy-once.md` (DOC-371) | Point `.sk-git/` writes at the shared worktree. [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-standards-copy-once.md:16] |
| `doctor-git-standards-change-rule.md` (DOC-372) | Same. [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-standards-change-rule.md:16] |
| `doctor-git-standards-refuse-invalid.md` (DOC-373) | Same. [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-standards-refuse-invalid.md:16] |
| `README.md` | State that DOC-370 keeps a disposable clone because local Git config is shared across linked worktrees, and that 369/374 run in place. [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/README.md:10] |

DOC-369 and DOC-374 are read-only and already copy-free; DOC-370 stays on a clone. [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-hooks-list.md:26] [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-target-menu.md:16]

**mcp-code-mode playbook (3 scenarios + README):**

| File | Change |
|---|---|
| `doctor-mcp-install.md` (DOC-375) | Run in the shared worktree; reset the missing-dependency state locally; keep approval-per-write. [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/doctor-commands/doctor-mcp-install.md:14] |
| `doctor-mcp-debug.md` (DOC-376) | Same; induce the invalid `.pi/mcp.json` in the shared worktree and restore it. [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/doctor-commands/doctor-mcp-debug.md:14] |
| `doctor-mcp-debug-fix.md` (DOC-377) | Same. [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/doctor-commands/doctor-mcp-debug-fix.md:14] |
| `README.md` | Scope becomes DOC-375 to DOC-379 and defines the shared-worktree rule. [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/doctor-commands/README.md:10-14] |

DOC-378 needs no copy today. [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/doctor-commands/doctor-mcp-target-menu.md:26]

Count: **23 existing scenario files + 4 READMEs = 27 files**.

### 3. New scenarios to create

1. **DOC-379 `doctor-mcp-unknown-flag.md`** (mcp-code-mode playbook). Runs `/doctor:mcp install --server` and `/doctor:mcp debug --bogus`, asserts `STATUS=FAIL ERROR="unknown_flag"` before any workflow YAML load, names the sub-action and shows that sub-action's valid flags, and re-runs the existing cross-sub-action cases (`install --fix`, `debug --runtime pi`) to prove they still render `cross_sub_action_flag_injection`. Extends the DOC-378 baseline checksum discipline. [SOURCE: .skilled/commands/doctor/assets/doctor-mcp-presentation.txt:35-45]
2. **DOC-380 `doctor-update-environment.md`** (system-spec-kit playbook). Verifies the shared environment itself: the numbered local branch and directory exist and are never pushed; the scoped offline `check` shows the four fixture statuses (`customized` sk-code-webflow, `conflict` sk-git, `removed` sk-code-obsidian under the local prerelease tag, `local` sk-code-web-dev); `record-base --dry-run` then the real record with `--trust-release` and the commit; apply a decision and run `rollback --run=<runDir>` to a clean baseline; confirm the run directory is the ignored `.skilled/release/runs/`. This is the reset contract every other migrated scenario references. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1231-1237] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2365-2439]

The next free numbers are 379 and 380. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md:19] [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/doctor-commands/README.md:12]

### 4. Ordered implementation plan

**A. Contract fixes (independent of the environment)**

1. `/doctor:speckit`: remove `corpus_pollution` from `staleness_signals` and `severity_max`, move phrase-quality reporting into a `quality_advisories` block with per-class counts and share, and keep the Phase 0 read. [SOURCE: .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:135-137] [SOURCE: .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:191-205]
2. Align the YAML status enum with the presentation (`ATTENTION` instead of `DEGRADED`) in the Phase 2/3 outputs. [SOURCE: .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:217] [SOURCE: .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:229] [SOURCE: .skilled/commands/doctor/assets/doctor-speckit-presentation.txt:70]
3. Update DOC-349 and DOC-350 and add doctor-level contract tests (fresh+non-zero→OK; stale+non-zero→STALE with advisories). Keep the generator phrase-quality tests. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:562-592]
4. `/doctor:mcp`: add the `unknown_flag` rejection to `mcp.md` step 6 and the presentation template, preserving cross-sub-action wording; add DOC-379; update the mcp README scope. [SOURCE: .skilled/commands/doctor/mcp.md:60-63] [SOURCE: .skilled/commands/doctor/assets/doctor-mcp-presentation.txt:35-45]

**B. Build the shared environment (local only, never pushed)**

5. From the main checkout: `bash .skilled/skills/sk-git/scripts/worktree-naming.sh create doctor-update-test-environment v4.0.0.0 --no-provision`; confirm the printed branch `worktrees/{NNN}-doctor-update-test-environment` and path. [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:395-421]
6. Overlay the current updater assets (`update.md`, `_routes.yaml`, `doctor-update-presentation.txt`, the five action YAMLs, `scripts/release-update.cjs`) and the current assets the other migrated suites need; `git add` and commit. [SOURCE: .skilled/commands/doctor/update.md:26-31]
7. Build the four fixtures and commit: edit `sk-code-webflow/SKILL.md` (customized), replace `sk-git` with the Barter 10 files + deterministic conflict anchor on a release-changed path (conflict), add `sk-code-web-dev/SKILL.md` (local), create local prerelease tag `v4.0.0.3-fixture` deleting `sk-code-obsidian` (removed). [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:949-963] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:519-548]
8. `record-base` dry-run, then real run with `--release=v4.0.0.0 --offline --trust-release`; commit `.skilled/release/base.json`. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2257-2308] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2310-2361]
9. Verify with a scoped offline `check` that the four fixture units classify as designed while the overlay units stay out of scope. [SOURCE: .skilled/commands/doctor/update.md:43]

**C. Playbook migration**

10. Land the 23 scenario edits and 4 README updates in the table above; add DOC-379 and DOC-380. Update DOC-349 in the same change as plan step 1-3 so the scenario never asserts removed behavior.

**D. Verification**

11. Run each migrated suite once against the environment with a dry-run first; for update, run `check` → `align` → `apply --dry-run` → `apply` → `rollback` and confirm a clean baseline after rollback. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2095-2101] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2365-2439]
12. Record PASS/FAIL/SKIP per scenario per the harness policy, and confirm no `git push` ever targets the fixture branch. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md:23]

### 5. Risks and UNKNOWNs

- **Barter overlap UNKNOWN.** The snapshot is absent; the conflict anchor must be forced deterministically as in step 7. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:670-689]
- **Shared Git state.** Any scenario that writes `git config --local` cannot use a linked worktree; DOC-370 is the known case. [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-hooks-switch-gate.md:16]
- **Overlay noise.** Every overlaid current file makes its owning unit locally changed; checks must be scoped. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:949-963]
- **Fixture tag locality.** `v4.0.0.3-fixture` is local test data; it must never be pushed or referenced by release policy. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:253-267]
- **Parallel mutation.** One environment cannot host two mutating scenarios at once; serialize scenario runs or add a documented run lock.

## Questions Answered
- q4: Which other doctor-command playbooks reuse the environment, exactly which scenario files change, and what new scenarios are added.

## Questions Remaining
None. All four questions are answered; the next phase is synthesis.

## Next Focus
Synthesis: write `research.md` with the contract decisions, fixture recipe, per-file playbook table and the ordered implementation plan.

## Sources Consulted
- The four doctor-commands READMEs and all 34 scenario files (preconditions and copy statements)
- `.skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-hooks-switch-gate.md`
- Read-only `git rev-parse` path probes for shared Git state
- Iterations 1 and 2 sources as cited there

## Assessment
The migration surface is fully enumerated from the scenario files themselves; the counts are 23 scenario files plus 4 READMEs plus 2 new scenarios. The only UNKNOWN remains the Barter file list.

## Reflection
Most scenarios never needed a full repository copy; they needed isolation for a small mutation and a prepared runtime. Separating those two needs is what makes one long-lived environment cheaper than per-run copies — and it also names the one scenario (DOC-370) where a linked worktree is the wrong isolation mechanism.

## SCOPE VIOLATIONS
None. All writes stayed inside this lineage directory; all Git commands were read-only.

# Iteration 020 — Phase plan: seven phases ordered by dependency, not by saving

## Focus

Group the ranked recommendations into implementation phases 002 and later, with scope, workflows
touched, expected saving, risk, order and dependencies; place `sk-code-ci` before `/doctor:ci`; give
the CI on/off control its own phase. Read-only: no workflow, script or code was modified.

## Actions Taken

1. Re-read iteration 019's ranked table and phase grouping, and the five re-checked headline figures
   (F19-1 to F19-7) the table rests on.
2. Enumerated the 33 workflow files against the 13-workflow downstream set, to test row 1's "12".
3. Read the doctor route manifest's header, schema and "add a new target" procedure, and
   `/doctor:setup`'s router contract, to settle the new-router-versus-target residual.
4. Re-read F17-7's forced ordering (standards packet, then `/doctor:ci`, then review wiring) and
   F17-8's two-route split, and mapped them onto the phase sequence.
5. Checked every phase for a dependency on a number a later phase changes, and every phase for a
   file a later phase rewrites.

## Findings

**F20-1 (confirmed) — ranked row 1 covers 13 downstream workflows, not 12: its own parenthetical
lists 9 `paths-ignore:` edits plus 4 `!` negations, and F19-1 enumerates the same 13 by name.**

Iteration 019's table row reads "the 12 downstream workflows (9 x `paths-ignore:`, 4 x `!` in
`paths:`)" [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:136],
and 9 + 4 = 13. The nine that can take `paths-ignore:` directly are sk-doc-script-tests,
command-tree-parity, dispatch-enforcement-guard, changed-packet-validation, gate-inputs,
message-contract, playbook-operator-contract, rule-canary-sync and advisory-checks
[SOURCE: .github/workflows/sk-doc-script-tests.yml:8] [SOURCE: .github/workflows/command-tree-parity.yml:3]
[SOURCE: .github/workflows/dispatch-enforcement-guard.yml:3] [SOURCE: .github/workflows/changed-packet-validation.yml:3]
[SOURCE: .github/workflows/gate-inputs.yml:2] [SOURCE: .github/workflows/message-contract.yml:7]
[SOURCE: .github/workflows/playbook-operator-contract.yml:2] [SOURCE: .github/workflows/rule-canary-sync.yml:2]
[SOURCE: .github/workflows/advisory-checks.yml:2]. The four that already filter by path and need a
negated entry are spec-kit-check, hooks-node-tests, opencode-plugin-tests and markdown-link-integrity
[SOURCE: .github/workflows/spec-kit-check.yml:6] [SOURCE: .github/workflows/hooks-node-tests.yml:14]
[SOURCE: .github/workflows/opencode-plugin-tests.yml:14] [SOURCE: .github/workflows/markdown-link-integrity.yml:19].
Thirteen edits, not twelve, and the 2,073 min/day is the sum over all thirteen
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:23].
The correction changes the phase's file count, not its saving; it is recorded because a phase scoped
to "12" would ship one workflow still re-running on every rebuild commit.

**F20-2 (inferred) — the on/off control and the job consolidation are coupled through the merged
job's `if:`, so the switch's grouping granularity must be decided before the merge, not after.**

A job-level switch is a bare expression added to whatever condition the job already has, never
replacing it [SOURCE: .github/workflows/trigger-index-rebuild.yml:33]. If each of the nine always-run
workflows gets its own variable and phase 006 then merges their jobs into one
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:140],
the merged job inherits a nine-term conjunction, which is both unreadable and a maintenance trap the
next workflow addition repeats. The cheap order is the reverse: decide one variable per group in
phase 005, then merge inside a group, so the merged job carries one condition. Inferred because no
switch exists yet and the merge does not either; what would falsify it is a decision to keep
per-workflow switches and abandon the nine-way merge, which would make phase 006 moot.

**F20-3 (documented) — `/doctor:ci` is a new router file with two routes, not a target bolted onto an
existing doctor command.**

The manifest names one command per line together with the router file it owns
[SOURCE: .skilled/commands/doctor/_routes.yaml:6], and a command that owns one route needs no
positional target [SOURCE: .skilled/commands/doctor/_routes.yaml:13]. A new target is a four-step
act whose step 2 is "list the target in that command's router and presentation, and add its row to
the `/doctor:setup` target list" [SOURCE: .skilled/commands/doctor/_routes.yaml:38] — the
presentation asset is per command, not per target [SOURCE: .skilled/commands/doctor/setup.md:55].
`/doctor:setup` is contractually a read-only router [SOURCE: .skilled/commands/doctor/setup.md:10],
so it cannot host the scaffold route, and the other live routers own unrelated diagnostic surfaces.
One new `ci.md` therefore owns two routes, matching F17-8's split: `report` (read-only, the default)
and `scaffold` (mutates), with the toggle half at most `add-only` because repository variables are
readable but not writable without an admin token
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-017.md:105].

**F20-4 (inferred) — the dependency order is 002 trigger surgery, 003 caching and provision dedupe,
004 `sk-code-ci`, 005 on/off control, 006 consolidation, 007 `/doctor:ci`, 008 slow tests.**

Two rules produce it. First, iteration 019's rule: a row moves earlier only if it has no dependency
on a later row's number
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:164].
Second, a new rule this iteration adds: a phase that introduces a YAML pattern the repository does
not already contain waits for the standard that governs it (004), while a phase that edits an
existing pattern does not. 002 and 003 edit existing `on:` blocks and existing job steps and carry
the two confirmed savings, so they lead. 004 is read-only, touches no workflow, and is the review
standard for 005's switch and 006's merged job, so it sits between them. 005 must precede 006
(F20-2). 006 is the only phase with an unresolved gate (F19's required-check question). 007 reads
004's templates and must follow it. 008 needs a stable baseline, which 003 and 006 change.

**F20-5 (confirmed) — 003's internal order is cache, then merge, then npm dedupe, and 006's number
shrinks by about 145 min/day once 003 lands.**

The tree cache and the hooks-into-plugin merge are not additive: the pair is about 207 min/day, with
the merge contributing 62 once the cache exists and 124 standalone
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:137]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:138]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:97].
006's 1,241-1,606 is computed against today's install and checkout costs
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:140],
so landing 003 first shrinks it by the cache's share; landing 006 first double-counts that share.
The npm dedupe (row 4) is independent of both and last inside 003 because its realistic 20-40 min/day
is smaller and its per-workflow edits overlap the same 11 files the composite touches
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:139].

**F20-6 (documented) — 002 carries two rows with no measured saving; they belong in the phase for
review economy, not for its number, and must not gate its completion.**

Row 8 (path-filter comment-hygiene, agent-mirror-sync and prompt-card-sync) measured zero runs in
the window, and row 9 (`concurrency: cancel-in-progress`) is wall-clock only and unmeasured
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:143]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:144].
Both edit `on:` blocks, so they share 002's reviewer and its verification step, which is the whole
argument for co-locating them. The phase's acceptance gate is row 1's 2,073 min/day plus the test
that asserts the four generated paths are ignored
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:52].

## The phase plan

| Phase | Name | Scope | Workflows touched | Expected saving | Risk | Effort | Depends on |
|---|---|---|---|---|---|---|---|
| 002 | Trigger surgery | Ignore the 4 generated paths on 13 downstream workflows (9 `paths-ignore:`, 4 `!`); path-filter 3 checker workflows; `cancel-in-progress` | 13 downstream + comment-hygiene, agent-mirror-sync, prompt-card-sync + PR-triggered set | 2,073 billed min/day (54% of 3,812) | Low-medium | Low | none |
| 003 | Caching and provision dedupe | Composite setup action + `actions/cache` for 14 trees and 5 builds; pinned bun setup; npm install dedupe; merge hooks into plugin after the cache | opencode-dual-version, opencode-plugin-tests, hooks-node-tests + 11 multi-install workflows | 145 + 62 + 20-40 = 227-247 min/day | Medium | Medium | none; must precede 006 |
| 004 | `sk-code-ci` standards packet | Read-only surface packet holding workflow-YAML standards + hub registration (mode entry, surfaces array, routerSignals, tieBreak, leaf-manifest, ROUTER.md) | none | 0 | Low | Medium | none; must precede 005, 006, 007 |
| 005 | CI on/off control | Job-level `vars.*` switch, `off` the only disable token, group granularity fixed here, committed example of the variable names | 32 of 33 (dependabot-auto-merge excluded) | 0 direct | Low | Medium | 002, 003, 004 |
| 006 | Job consolidation | Merge the 9 always-run workflows into one job | command-tree-parity, dispatch-enforcement-guard, changed-packet-validation, gate-inputs, message-contract, playbook-operator-contract, rule-canary-sync, advisory-checks, sk-doc-script-tests | 1,241-1,606 upper bound, ~145 lower after 003 | High | Medium | 003, 005; gated by the required-check question |
| 007 | `/doctor:ci` (+ review wiring last) | New router with `report` (read-only, default) and `scaffold` (mutates) routes; toggle is add-only; then the CI surface value in the shared contract and the review restatement | none | 0 | Medium | Medium | 004 |
| 008 | Slow tests and flakiness | Trim the 776 s CLI vitest project by at least 15 s; fix deep-loop-runtime's 13/40 failure rate | spec-kit-check, deep-loop-runtime | ~50 + ~10 min/day, 1,466 s wall | Low | Medium | 003, 006 (stable baseline) |

The three ungated phases (002, 003, 008) address about 2,360 of the measured 3,812 billed min/day,
roughly 62%. 006's upper bound is not added to that headline because it is computed against today's
install costs and would overlap 003's cache.

### 002 — Trigger surgery

**Scope.** Three edits, all inside `on:` blocks. (a) The four generated paths the rebuild stages
[SOURCE: .github/workflows/trigger-index-rebuild.yml:79] are ignored by 13 downstream workflows: nine
gain a `paths-ignore:` block, four gain negated entries inside their existing `paths:` list because
GitHub does not allow both keys on one event. (b) comment-hygiene, agent-mirror-sync and
prompt-card-sync are filtered to their checker inputs. (c) `concurrency: cancel-in-progress` is added
to the PR-triggered workflows.

**Saving.** 2,073 billed min/day, 54% of the measured total
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:5],
re-derived from the 13 per-workflow rows in iteration 019 [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:23].
(b) and (c) contribute nothing measured and are not counted.

**Risk.** Low-medium. A suppressed run leaves the check absent on that SHA. That is already the
shipped behaviour for the rebuild commit: the rebuild pushes directly with a token and 35 such
commits exist in the window
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-018.md:45],
so a ruleset that would block on an absent check is already being bypassed. Two obligations ship with
the change: amend `playbook-operator-contract`'s "deliberately NOT path-filtered" comment in the same
diff, or hand the reviewer a contradiction
[SOURCE: .github/workflows/playbook-operator-contract.yml:3]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:106];
and add the test asserting the four paths are ignored, so a future test that loads the committed
index is not silently skipped [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:52].

**Order and dependencies.** First: no dependency, the largest confirmed saving, and the smallest
blast radius (no job, check name or ruleset change).

### 003 — Caching and provision dedupe

**Scope.** A composite setup action that carries `actions/cache` for the provisioned trees and the
build outputs, inlined into the existing jobs so job names and check contexts survive; a pinned bun
setup replacing `npm install bun`; npm cache and install dedupe in the 11 multi-install workflows;
then the hooks-node-tests merge into opencode-plugin-tests.

**Workflows touched.** The three provisioning workflows (opencode-dual-version, opencode-plugin-tests,
hooks-node-tests) plus the 11 workflows that install in two or more jobs: spec-kit-check (9 installs),
routing-registry-drift (4), sk-doc-script-tests (3), deep-loop-runtime (3), sk-doc-rename-harness (3),
skill-advisor-stress (3), and two each in command-tree-parity
[SOURCE: .github/workflows/command-tree-parity.yml:29] [SOURCE: .github/workflows/command-tree-parity.yml:61],
dispatch-enforcement-guard [SOURCE: .github/workflows/dispatch-enforcement-guard.yml:52], gate-inputs,
playbook-operator-contract and skill-doc-frontmatter
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-018.md:27].

**Saving.** 145 min/day for the cache, 62 marginal for the merge (124 standalone), 20-40 for the npm
dedupe; about 227-247 in total, not 145 + 124 + 40
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:97].

**Risk.** Medium. Three inputs remain inferred: cache restore throughput, the cache budget, and the
staleness window. The mitigation is structural: hash every lockfile into the key, use no
`restore-keys`, and keep provision running on a hit as the verification walk
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:137].
The merge changes one check name, which is a ruleset edit, but the merged job always runs, so the
required-check unknown is not exercised.

**Order and dependencies.** Second. Must precede 006 because 006's number is computed against today's
install costs (F20-5). No dependency on 002.

### 004 — `sk-code-ci` standards packet

**Scope.** A read-only surface packet holding the workflow-YAML standards (SHA-pinned actions, path
parity per gate-inputs, README row, `set -euo pipefail`, timeouts, least-privilege permissions, fork
and secret safety, caching, concurrency, matrix), plus its registration: mode entry, the surface
extension's `surfaces` array, a `routerSignals` entry, a `tieBreak` slot ahead of the native surface
[SOURCE: .skilled/skills/sk-code/mode-registry.json:19], regenerated `leaf-manifest.json`, and the
`ROUTER.md` projections. A surface is forced to `backendKind: evidence-base`,
`mutatesWorkspace: false` and a read-only tool set
[SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:682], so it declares no `command`
and cannot scaffold — that belongs to 007
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-017.md:54].

**Saving.** Zero. This phase buys the review standard every later YAML edit is measured against, and
the templates 007 reads.

**Risk.** Low. Read-only, no outcome change; the registration is four edits plus generated files
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-017.md:44].
The one coupling path that can regress the three existing surfaces — the fifth surface value in the
shared contract — is deliberately excluded and deferred to 007
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-017.md:35].

**Order and dependencies.** Third. It sits after the two existing-pattern edits and before the first
phase that introduces a new pattern (F20-4), and before 007 needs its templates.

### 005 — CI on/off control

**Scope.** A job-level `vars.*` switch across the workflows that can be switched: `off` is the only
disable token so any other value, including a typo, leaves the job on; a bare expression with no
`${{ }}` wrapper; added to an existing event condition rather than replacing it; placed above
`permissions:` so the on/off state is read first. The group granularity is fixed here (F20-2). A
committed example documents the variable names, mirroring the hook-flags shape
[SOURCE: .skilled/hooks/hook-flags.env.example:55]. `vars` is the only mechanism that works, because
no context is available in `on:` filters — a variable can prevent work, never a trigger. The live
file is gitignored [SOURCE: .gitignore:355], so it is absent from a checkout and cannot be the
mechanism.

**Workflows touched.** 32 of the 33; dependabot-auto-merge gets no switch because it is
safety-relevant and one job
[SOURCE: .github/workflows/dependabot-auto-merge.yml:7] (the exclusion is documented in iteration 011's off-token findings and is not re-derived here).

**Saving.** Zero direct. It makes every group disableable for a clone or base repo without editing
YAML, which is the topic's angle 9.

**Risk.** Low. The default is everything on and a wrong value fails safe to ON. The required-check
unknown is not exercised on the default path because nothing skips; it becomes blocking only in 006,
where the merged job is the single context.

**Order and dependencies.** Fourth. After 002 and 003 so the switch sites are the final job graph,
and after 004 so the switch is reviewed against the standard. Must precede 006.

### 006 — Job consolidation

**Scope.** Merge the nine always-run workflows into one job: command-tree-parity,
dispatch-enforcement-guard, changed-packet-validation, gate-inputs, message-contract,
playbook-operator-contract, rule-canary-sync, advisory-checks and sk-doc-script-tests. These cost
1,866 billed min/day and their 13 jobs total 1,065 job-seconds and bill 25 minutes per push
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-018.md:31].

**Saving.** One checkout replaces 12, so the work is 153-465 s = 3-8 billed minutes against 25, or
17-22 minutes per push: 1,241-1,606 min/day as an upper bound
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:68].
It shrinks by about 145/day once 003 lands. The 986 min/day ceiling-rounding figure is not a separate
saving; about 7 of the 17-22 minutes is exactly that rounding
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:86].

**Risk.** High, and it is the only phase that trades something other than minutes. Nine check
contexts collapse into one, which is a ruleset edit
[SOURCE: .github/workflows/message-contract.yml:5]; the merged job's wall-clock is 8-10 minutes
serial against a 167 s worst single job today, still behind spec-kit-check's 1,178 s tail, so the
push tail does not improve; and a failing step stops the rest unless every step is guarded with
`if: always()`, which destroys the per-check signal the nine workflows exist to give.

**Order and dependencies.** Fifth. Depends on 003 (composite and cache) and 005 (one group condition
instead of nine). Gated by the still-open required-check question: whether a job skipped by `if:`
satisfies a required status check is unestablished, and with one context every skip is total.

### 007 — `/doctor:ci`, then the review wiring

**Scope.** A new `ci.md` router owning two routes (F20-3): `report` (read-only, the default — lists
workflows with on/off state, trigger, purpose and current cost), and `scaffold` (`mutates` — a new
pinned workflow with `.skilled/` and `.opencode/` path parity and a README row, from 004's
templates). The toggle half is `add-only`: it prints the variable instruction and reads the state
back, because writing repository variables needs an admin token the CLI does not have
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-017.md:105].
Registration is the documented four-step act: routes, router and presentation plus the `/doctor:setup`
target row [SOURCE: .skilled/commands/doctor/_routes.yaml:38], activation in both language lists of
`scoring-compatibility.json`, then the bridge deriver, `route-validate.sh` and `doctor-phrase-reach.cjs`.
Last within the phase, and only after the scaffolding is stable, comes the review wiring: the CI
surface value in `stack-detection.md` §2 and the review packet's restatement
[SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:37]
[SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:234]. Today a workflow-YAML diff reviews as
UNKNOWN, which is why the packet cannot be reached by diff path alone
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-017.md:24].

**Saving.** Zero.

**Risk.** Medium. The scaffold route mutates, which is why `mutating` is per route and the default
target is the read-only one
[SOURCE: .skilled/commands/doctor/_routes.yaml:29]; K1 fails a `read-only` route whose own YAML
writes [SOURCE: .skilled/commands/doctor/scripts/route-validate.sh:189]. The review wiring is the
only step that can regress detection for the three existing surfaces, so it goes last
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-017.md:93].

**Order and dependencies.** Sixth. Depends on 004's templates; the review wiring depends on the
standards having stopped moving.

### 008 — Slow tests and flakiness

**Scope.** Trim the 776 s CLI vitest project inside spec-kit-check by at least 15 s, enough to cross
the 1,200 s billing boundary; fix deep-loop-runtime's 13/40 failure rate.

**Saving.** About 50 min/day from the boundary crossing plus 776 s of wall, and about 10 min/day of
re-runs plus 690 s of wall
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:141]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:142].
The boundary figure is inferred from a single run's step timings
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:114].

**Risk.** Low.

**Order and dependencies.** Last. Both rows need a stable baseline, and 003 and 006 change the job
boundaries row 6 would be measured against.

## Ordering rules

1. A phase moves earlier only if it has no dependency on a later phase's number
   [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md:164].
2. A phase that introduces a new YAML pattern waits for the standard that governs it (004); a phase
   that edits an existing pattern does not.
3. A phase that rewrites a job waits for the phase that decides the job's switch (005 before 006).
4. No phase edits a file a later phase rewrites: 002 and 003 finalise the `on:` blocks and job
   steps, 005 finalises the switch sites, 006 merges inside them.

## Questions Answered

- How do the ranked recommendations group into ordered implementation phases 002 and later? —
  seven phases, 002 through 008, with the dependency chain in F20-4 and the per-phase scope, saving,
  risk and gate above.
- What should a /doctor:ci command do, how is it made safe, and who owns it? — residual closed:
  a new router file with two routes, `report` read-only by default and `scaffold` mutating, toggle
  `add-only` (F20-3, 007).

## Questions Remaining

- **Still blocking 006:** does a job skipped by `if:` satisfy a required status check? Unchanged.
- Carried: are spec-kit tests fixture-collision-safe under `fileParallelism: true`, and what are the
  include globs of `.skilled/hooks/vitest.config.ts`?
- Carried: which jobs duplicate pre-commit hooks?
- Carried: what is the real per-job fixed floor? Partly answered by the 50-76 s checkout table, still
  a model for the install half.
- Carried: F19-2's residual — a future test that loads the committed index would be silently skipped
  on rebuild commits; 002 ships the asserting test.

## Next Focus

Iteration 20 is the final iteration of the run. The handoff is the table above: start at 002, hold
006 behind the required-check question, and treat the cache saving's three inputs as inferred until
003 measures them.

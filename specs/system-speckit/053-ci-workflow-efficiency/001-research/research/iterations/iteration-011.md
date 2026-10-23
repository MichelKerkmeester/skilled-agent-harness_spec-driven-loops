# Iteration 011 — CI on/off control, part 2 (committed config vs env file vs dispatch inputs vs `vars.*`; the exact gate-job shape)

## Focus

Angle (9), second half. Iteration 10 settled the mechanism (job-level `if:` on `vars.*`, default-on, cannot reach `on:`) and left five things open: the naming, a master switch, the branch-protection comparison, fork/clone defaults, and drift. This iteration evaluates the three rival designs the angle names — a committed `.skilled/ci.json`, an env file of the `hook-flags.env` / `.env.example` kind, and `workflow_dispatch` inputs — against `vars.*`, then recommends one design and writes the exact gate-job shape.

Read-only: no workflow, script, config or code was modified. No scope violations occurred.

## Actions Taken

1. Located and read the existing flag machinery the angle asks to reuse: `.skilled/hooks/hook-flags.env.example` (60 lines, in full) and the committed root `.env.example` (619 lines, in full). Confirmed `.skilled/hooks/hook-flags.env` does not exist on disk.
2. Swept `.github/workflows/` for the privileged-trigger surface (`pull_request_target`) and for the manual-trigger surface (`workflow_dispatch`, then `inputs:`), to test the dispatch-inputs design and the security question.
3. Swept `.skilled/` for a committed CI config and for top-level `permissions:` coverage across the 33 workflows, to fix the gate job's least-privilege shape and to test whether a config-consumer job would be the tree's first privileged checkout.
4. Read `.github/workflows/README.md` §2 "Push versus pull-request coverage" to fix the group taxonomy the switch keys on, and grepped the README and `docs/` for any record of the required-status-check set.
5. Read `.github/workflows/gate-inputs.yml` head as the shape template for a gate job, and `.github/workflows/advisory-checks.yml` head to close the carried-forward "advisory jobs that never gate" question.
6. Attempted once more to fetch GitHub's "use conditions to control job execution" page to close iteration 10's unverified F3 (skipped-job check semantics). **HTTP 404 again** — second independent attempt, same result.

## Findings

### F1 — `workflow_dispatch` inputs cannot be the control, and the repo has never used them (confirmed + inferred)

Nine of the 33 workflows declare a manual trigger, and **none** of them declares an `inputs:` block: the closest case declares the trigger and then falls straight through to `permissions:` — [SOURCE: .github/workflows/gate-inputs.yml:6] (`workflow_dispatch:`) with [SOURCE: .github/workflows/gate-inputs.yml:8] (`permissions:`) on the very next content line. So the dispatch-input route is greenfield, not a refinement of something present.

The design is nonetheless rejected on semantics, not on absence. An `inputs` context is populated only for a manual dispatch; a run started by a push or a pull request has no inputs, so any condition of the form `inputs.ci != 'off'` evaluates TRUE on precisely the runs that cost runner minutes. A dispatch-input switch can therefore only vary *a run someone started by hand*, and cannot switch off the 28 workflows that trigger on push. **Labelled inferred** — it follows from event-scoped context availability, and this iteration did not fetch the context-availability table (see F6, which is the same fetch problem). What would confirm it: the context-availability table for `jobs.<job_id>.if`, or one dispatched-versus-pushed run of a workflow whose job reads `inputs`.

A second, independent defect: a dispatch input is per-run state, so it cannot express a *standing* preference. A clone that wants a group off has to remember to pass the input every time.

### F2 — `hook-flags.env` is explicitly out of CI's reach, and `.env.example` is a template of comments — reuse the semantics, never the files (confirmed)

This is the angle's specific question, and the repository answers it in its own words:

- [SOURCE: .skilled/hooks/hook-flags.env.example:55] — "CI never reads this file, so the repository's own checks stay on there." That is a direct statement that the hook flag file is a local-only surface, by design.
- The live file is absent from disk and gitignored ([SOURCE: .gitignore:355]), so it is not in an Actions checkout in the first place. A gate that read it would fail open on every runner — the worst failure mode for a control.
- The committed sibling `.env.example` is a *documentation template*: its rows are commented-out definitions, e.g. [SOURCE: .env.example:110] (`# SPECKIT_STOP_HOOK_ORPHAN_SWEEP=off`) and [SOURCE: .env.example:162], whose only uncommented rows are the empty secret placeholders of section 1, e.g. [SOURCE: .env.example:58]. A parser reading it would read comments and empty strings. It is the human-readable index, not a machine-read config.
- [SOURCE: .env.example:275] states the precedence rule the shape should copy: "May also be set in .skilled/hooks/hook-flags.env (a real env var wins)."

The reusable part is the contract, not the bytes, and it is stated plainly at [SOURCE: .skilled/hooks/hook-flags.env.example:5]: "Every hook is ON by default. Setting a flag to a truthy value (1 / true / yes / on, case-insensitive) disables that hook." Plus the master switch idiom at [SOURCE: .skilled/hooks/hook-flags.env.example:17] (`SYSTEM_HOOKS_DISABLED=1` disabling every concern beneath it). **`vars.*` reproduces that contract exactly on GitHub's side** — unset variable, everything on; one master variable above per-group variables — while `.env.example` cannot, because no job-level `if:` can read a file (iteration 10, F4).

One divergence from the hook model worth naming: the hook flags disable on a *truthy* value, so a typo keeps the hook ON. A `vars` switch should keep that fail-safe direction, which the `!= 'off'` comparison does (see F4).

### F3 — A committed config is the only rival design that creates attack surface, and `pull_request_target` is currently absent repo-wide (confirmed)

A grep of all 33 workflows for `pull_request_target` returns **zero** matches. The repository today has no privileged-trigger workflow at all, which is the strongest possible starting position.

Introducing `.skilled/ci.json` would spend it. A job-level `if:` cannot read a file, so the config route needs a job that checks out and parses — and to read the *base repository's* config while evaluating a pull request, the natural (and wrong) reach is `pull_request_target`, which runs with a write token and repository secrets against contributor-controlled content. The secure alternative is to read the config from the base ref explicitly on a plain `pull_request` event and never execute anything from the head, which is more machinery than a switch deserves. Note that no such config exists today either: `.skilled/` holds only `package.json`, `package-lock.json`, `specs/descriptions.json` and `specs/graph-metadata.json`, so `.skilled/ci.json` would be a new file with a new parser and a new security question.

**The `vars` design has zero exposure here** because it never needs a job, a checkout, or a privileged trigger: the expression is evaluated by the workflow engine before any runner is allocated. That is the decisive argument, and it is why the recommendation never has to answer the `pull_request_target` question at all.

### F4 — Recommended design: `vars.*` only, `off` as the sole disable token, one master switch over five group keys (recommendation, grounded on F1–F3)

Naming, following the repo's existing `SYSTEM_*_DISABLED` / `SKILLED_*` vocabulary rather than inventing a new one:

| Variable | Scope | Group contents (from the README table) |
|---|---|---|
| `SKILLED_CI` | master, every group below | — |
| `SKILLED_CI_TESTS` | path-filtered suites | the 17 suites in the "Run only when their inputs change" row |
| `SKILLED_CI_REPORTS` | non-gating reports | the weekly report and the trigger-index rebuild |
| `SKILLED_CI_REVIEW` | review-time checks | the 3 pull-request-only checks |
| `SKILLED_CI_FRESHNESS` | whole-tree guards | the guards row, `gate-inputs`, `changed-packet-validation` |
| `SKILLED_CI_MESSAGES` | message contract | `message-contract.yml` |

The group list is derived from the table at [SOURCE: .github/workflows/README.md:60], not from a new taxonomy: the guards row [SOURCE: .github/workflows/README.md:66] and the path-filtered row [SOURCE: .github/workflows/README.md:69] already name every workflow in each group. Six variables for 33 workflows, and the list changes only when a README tier changes — which is the drift check, since the README row is the thing a new workflow is already required to add.

Two rules that are part of the design, not decoration:

1. **`off` is the only disable token.** `vars.X != 'off'` runs the job for `0`, `false`, `no`, `disabled` and typos alike. That is deliberately fail-safe (a mistake leaves the gate on), and it must be documented, because someone will otherwise set `SKILLED_CI_TESTS=0`, see the suites still run, and conclude the switch is broken.
2. **`dependabot-auto-merge` gets no switch.** It is safety-relevant and one job; putting it behind a variable buys nothing and risks a silent auto-merge change.

### F5 — The exact gate-job shape (recommendation; grounded on the in-tree template)

The switch is a single line inserted between a job's `name:` and its `runs-on:`, modelled on the tree's densest gate job — [SOURCE: .github/workflows/gate-inputs.yml:12] through [SOURCE: .github/workflows/gate-inputs.yml:14], which already pairs a descriptive check name with `runs-on: ubuntu-latest`:

```yaml
jobs:
  gate-inputs:
    name: Every gate input resolves under both source roots
    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'
    runs-on: ubuntu-latest
    permissions:
      contents: read
```

Three properties that make this shape correct rather than merely plausible:

- **No `${{ }}` wrapper.** A bare job-level `if:` is already an expression, which is how the four existing conditions are written — e.g. [SOURCE: .github/workflows/trigger-index-rebuild.yml:33]. Adding braces would be a stylistic difference with no behaviour change, so match the tree.
- **AND, never replace.** Where a job already has an event condition, the switch is added to it and both are parenthesised: `if: ${{ (vars.SKILLED_CI != 'off') && (!endsWith(github.event.head_commit.message, 'Trigger-Index-Rebuild: ci')) }}`. Replacing the existing condition would silently drop the loop guard. This is the one place a scoped edit can regress behaviour, so it deserves a review rule of its own.
- **The switch sits above `permissions:` and `runs-on:`**, so a reader sees the on/off state before the least-privilege block. Note 12 of the 33 workflows have no top-level `permissions:` at all; that is a separate hygiene item (angle 8), not something this gate introduces.

A skipped job allocates no runner and the workflow's own run record still exists, so the saving is billed minutes, not run volume — iteration 10's F6 stands unchanged, and the design should not be sold on queue-time savings.

### F6 — The branch-protection comparison cannot be made from this repository, and two fetches have now failed (inferred, flagged)

Iteration 10 flagged as unverified the claim that a job skipped by `if:` reports a status a required check accepts. This iteration re-attempted the canonical page and got **HTTP 404 a second time**, so the claim remains **inferred** after two independent attempts and must not be depended on.

What this iteration *can* add is the repo-side half. Grepping `.github/workflows/README.md` and `docs/` for "required status check", "branch protection", "required check" and "status check" returns **zero** matches: the repository does not record its required-check set anywhere in-tree. So the question "would gating this job block a merge?" has no in-tree answer either — it lives only in the GitHub settings UI.

The mitigation that removes the dependency instead of resolving it: **do not gate the freshness guards or the message contract in phase 002.** Ship `SKILLED_CI_TESTS` and `SKILLED_CI_REPORTS` first. Those are the minute-heavy, least-likely-to-be-required jobs; if a skipped check does block a merge, the blast radius is a stuck PR on a suite, not a stuck PR on the tree-wide guard. Confirm the semantics on a real PR before extending the switch to the guards — and if it does block, the whole job-level approach needs rethinking, so this is the gate on the gate.

### F7 — Fork and clone defaults: default-ON is structural for clones, inferred for forks (confirmed by construction / inferred)

A clone transfers the commit graph, not repository settings, so no `vars.*` value travels with `git clone` and every job runs — default-ON with no configuration. The clone can then switch things off only after creating its own repository variables. For a pull request *from* a fork, the run executes in the base repository's context, so the base repo's variables apply and a contributor cannot disable CI from their own fork. Iteration 10 labelled the fork half inferred after a 404; nothing this iteration changes that, so it stays inferred.

The design has one asymmetry worth stating in the docs: a base repository sets variables in the GitHub UI, which means the switch state lives outside the repository and outside code review. That is the price of "no YAML edit" and it is the same price `hook-flags.env` pays locally — except that the local file is gitignored by design while a repository variable is not visible to a diff at all.

### F8 — "Advisory jobs that never gate" is now partly closed: the advisory job is deliberate and documented (confirmed)

The carried-forward question asked which jobs are overengineered, naming advisory jobs as a candidate. On evidence, at least one is not overengineering: [SOURCE: .github/workflows/advisory-checks.yml:16] states the intent — "continue-on-error keeps the job green: a red X nobody is expected to act on is how a gate becomes background noise" — and the job is declared at [SOURCE: .github/workflows/advisory-checks.yml:19]–[SOURCE: .github/workflows/advisory-checks.yml:20] with its steps carrying `continue-on-error: true`. A second instance is the baseline download at [SOURCE: .github/workflows/strict-pass-freshness-report.yml:165].

So the finding is the inverse of the hypothesis: these jobs are *documented as non-gating on purpose*, and the real question about them is not whether they should gate but whether their cost is worth the signal — which belongs to the cost angle, not the overengineering angle. That narrows the carried-forward item to the pre-commit-duplicate half, still open.

## Questions Answered

- **What on/off control design lets a clone or base repo disable workflows or groups without editing YAML?** Settled across iterations 10 and 11: job-level `if:` on `vars.*`, one master switch over five group keys named from the README tiers, `off` as the sole disable token, default-ON when unset, no gate job and no checkout. The rivals are rejected on evidence — `workflow_dispatch` inputs never apply to push-triggered runs and are unused repo-wide (F1); `hook-flags.env` is gitignored and documented as never read by CI, and `.env.example` is a comment template (F2); a committed config needs a checkout-bearing gate job and is the only design that raises a `pull_request_target` question (F3).

## Questions Remaining

- **Blocking phase 002:** does a job skipped by `if:` satisfy a required status check? Two fetch attempts, both 404 (F6). Mitigated, not resolved, by shipping only the tests and reports groups first.
- What should a `/doctor:ci` command do, how is it made safe, and who owns it? Now fully constrained: it can *read* `vars` state and report it, but writing repository variables needs an admin token the CLI does not have — so the command's toggle mode is a printed instruction plus a verification read, not a mutation.
- What should an `sk-code-ci` mode contain, and what does registering a new `sk-code` mode require? The gate shape in F5 and the `off`-token rule in F4 are its first two rules.
- How do the ranked recommendations group into ordered implementation phases 002 and later?
- Carried forward: which jobs duplicate pre-commit hooks? (the advisory half of this is now partly closed by F8)
- Carried forward: are spec-kit tests fixture-collision-safe under `fileParallelism: true`, and does `.skilled/skills/system-spec-kit/runtime/vitest.config.ts` set it?
- Carried forward: what are the include globs of `.skilled/hooks/vitest.config.ts`?

## Next Focus

Take the untouched `/doctor:ci` question (angle 10), now that the switch design fixes its boundaries: it can read `vars` state through `gh variable list` but cannot write it without an admin-scoped token, so the command's toggle surface is a verified instruction rather than a mutation. Establish what the existing `/doctor:*` commands look like, how they are registered, and where a CI doctor belongs — the doctor command family, `sk-git`, or split. Read the doctor command tree and its registration surface before writing the mode surface.

Adjacent, if the doctor surface turns out to be already mapped: the two open vitest questions are cheap reads that would close three carried-forward items at once.

## SCOPE VIOLATIONS

None.

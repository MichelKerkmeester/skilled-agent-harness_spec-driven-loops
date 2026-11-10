# Iteration 010 — CI on/off control, part 1 (`vars.*` gating, skipped-check semantics, clone/fork defaults)

## Focus

Angle (9), first half: can a clone or a base repository turn workflows — or groups of workflows — off **without editing YAML**? Three sub-questions this iteration tried to settle with evidence:

1. Does the repository already have any on/off control surface (repository variables, env-gated job conditions, committed config)?
2. What does GitHub document about the two failure modes the angle names — a job skipped by `if:` versus a workflow that never triggers, measured against required status checks?
3. Do `vars.*` values survive into a clone or a fork, and what does that mean for the default state?

Read-only: no workflow, script, action or code was modified. No scope violations occurred.

## Actions Taken

1. Read the strategy, config and prior-iteration carry-forwards to fix this iteration's angle and avoid re-treading saturated directions.
2. Swept all 33 workflows in `.github/workflows/` for the control surface: `vars.*`, job-level `if:` using `env.`, and existing job-level `if:` idioms.
3. Read `.gitignore`, `.skilled/hooks/hook-flags.env.example` and `.env.example` to test whether the existing local kill-switch pattern can be reused for CI (the angle explicitly raises this).
4. Read `.github/workflows/README.md` §2 including the "Push versus pull-request coverage" table, to find whether a group taxonomy already exists in documentation.
5. Fetched GitHub's workflow-syntax reference and grepped the retrieved text for the required-status-check behaviour of skipped workflows and skipped jobs.

## Findings

### F1 — The repository has no on/off control surface at all (confirmed)

A sweep of `.github/workflows/*.yml` for `vars.<NAME>` returns **zero** matches, and a sweep for `if:` conditions reading an environment value (`if:.*env\.`) also returns **zero** matches. Only four job-level `if:` conditions exist in the whole tree, and all four are event- or needs-driven rather than configuration-driven:

- [SOURCE: .github/workflows/dependabot-auto-merge.yml:18] — `github.event.pull_request.user.login == 'dependabot[bot]'`
- [SOURCE: .github/workflows/trigger-index-rebuild.yml:33] — `!endsWith(github.event.head_commit.message, 'Trigger-Index-Rebuild: ci')`
- [SOURCE: .github/workflows/trigger-index-rebuild.yml:186] — `needs.rebuild.outputs.committed == 'true'`
- [SOURCE: .github/workflows/skill-doc-frontmatter.yml:52] — `github.event_name == 'pull_request'`

So the on/off surface is greenfield, but the *idiom* (a job-level `if:` that evaluates an expression to a boolean) is already established in-tree at the four sites above. A configuration gate is the same shape with a different left-hand side, which is the cheapest possible insertion point: one expression per job, no new job, no checkout.

### F2 — The gate must sit at job level, never at trigger level (documented, fetched)

The decisive asymmetry, quoted from GitHub's workflow-syntax reference (page fetched this iteration, HTTP 200):

> "If a workflow is skipped due to branch filtering, path filtering, or a commit message, then checks associated with that workflow will remain in a "Pending" state. A pull request that requires those checks to be successful will be blocked from merging."

Source: <https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax> — **documented**, quoted verbatim from the fetched page text.

That sentence rules out the most obvious "no YAML edit" ideas, because none of them can reach `on:`:

- `vars` and `env` are **not** available in `on.push`/`on.pull_request` filters (no context is available there).
- A workflow can therefore never be prevented from *triggering* by a variable. It can only be prevented from *doing work*.

The corollary is the design constraint for phase 002: **every** switch must be a job-level `if:` on a condition that stays TRUE when unset. This repository already relies on named checks, and check identity is `<workflow> / <job name>`, so a gate must not sit in front of a job whose name a branch-protection rule matches *unless* a skipped job still produces a check-run — see F3, which is the one claim this iteration could not re-verify.

Repo-side corroboration that triggers, not jobs, are where the waste lives: 28 of the 33 workflows declare a `push:` trigger, e.g. [SOURCE: .github/workflows/spec-kit-check.yml:4] with path filters at [SOURCE: .github/workflows/spec-kit-check.yml:6].

### F3 — "A skipped job reports success" is the load-bearing half, and it is UNVERIFIED here (inferred, flagged)

The complement of F2 — that a job skipped by `if:` *does* produce a check-run whose conclusion is treated as success by required status checks, and therefore does not block a merge — is what makes job-level gating safe. My prior reading of GitHub's docs says this is documented, but **this iteration could not fetch the page that states it**: the "using conditions to control job execution" how-to returned HTTP 404 at the canonical URL, and the phrase "report its status" does not appear in the workflow-syntax reference I did fetch.

Labelling honestly: **inferred**, not documented-from-source-this-iteration. What would confirm it: fetching the current "Using conditions to control job execution" page, or observing one gated job on a real PR against a branch protection rule that requires it. Phase 002 must confirm this before depending on it, because the entire recommendation in F5 collapses to "blocked merges" if a skipped job leaves a check Pending exactly like a skipped workflow does.

### F4 — `hook-flags.env` cannot be the CI control, but its *shape* is the right template (confirmed)

The angle asks whether the existing flag machinery can be reused. It can be reused only as a design, not as a file:

- `.skilled/hooks/hook-flags.env` is **gitignored** — [SOURCE: .gitignore:354] (`.opencode/hooks/hook-flags.env`) and [SOURCE: .gitignore:355] (`.skilled/hooks/hook-flags.env`). A gitignored file is never present in a GitHub Actions checkout, so no CI job can read it. Using it would mean the switch silently does nothing on the runner — the worst failure mode for a control.
- The committed sibling is the example — [SOURCE: .skilled/hooks/hook-flags.env.example:1] states the rule: copy to the local name and uncomment what you want OFF. `.env.example` is the one env file the ignore rules re-include: [SOURCE: .gitignore:30] (`!.env.example`).
- The shape worth copying: **committed example, gitignored local override, everything ON by default, environment wins over file**. That is precisely the semantics a CI control needs, and `vars.*` reproduces it on GitHub's side: an unset repository variable resolves to an empty string, so a condition written as `vars.X != 'off'` evaluates TRUE and the job runs (expression semantics — **inferred** from the empty-string resolution of an undefined `vars` lookup; the default-on property is what matters and it is also the safer direction if my inference is wrong, since an error would fail the run rather than skip it silently).

A committed config file (`.skilled/ci.json`) is the other candidate the angle names, and it is strictly more expensive: a job-level `if:` cannot read a file, so it needs a preceding checkout-and-parse job plus `needs.<id>.outputs` fan-out in **every** workflow that wants a switch — 33 workflows paying a checkout-bearing gate job to save minutes elsewhere. `vars.*` needs no job, no checkout and no script.

### F5 — The group taxonomy already exists in the README, so the control should key on tiers, not on 33 workflows (confirmed)

`.github/workflows/README.md` already classifies every workflow into trigger tiers in its "Push versus pull-request coverage" table — [SOURCE: .github/workflows/README.md:60] — with the tiers being: whole-tree guards (push + PR, no path filter), release-line-only guards, path-filtered suites, review-time PR-only checks, Dependabot-only, message-contract, weekly report, and the rebuild. The same table's prose explains *why* each tier is shaped as it is.

That is five to six natural groups. A control with 33 per-workflow switches would be overengineering by the repo's own restraint standard — it would also be a maintenance surface that drifts every time a workflow is added, with no check able to catch the drift. Keying on the README tiers means the group list changes only when a tier changes, and the README row is one line.

### F6 — The gate saves runner minutes but not run rows; the only zero-run lever is GitHub's own switch (inferred)

Because `vars` cannot reach `on:` (F2), a gated-off workflow still creates a workflow-run record on every matching push — 28 workflows trigger on push — while its jobs skip and allocate no runner. Billed runner minutes drop; queued-run volume, API noise and the "13 workflows re-run after the Trigger Index Rebuild commit" burst from earlier iterations do **not**. The only lever that prevents the run from existing at all is GitHub's repository-level Actions control, or editing `on:` — and editing `on:` is exactly what this angle forbids, plus it is the one change that turns a required check Pending (F2). Phase 002 should say this plainly rather than promise trigger-level savings.

### F7 — The design addresses base repos and clones, not forks (inferred)

For a **clone**, the property is structural rather than documented: `git clone` transfers the commit graph, not repository settings or repository variables, so `vars.SKILLED_CI_*` is unset on a fresh clone and every job runs — default-ON by construction. The clone gains the ability to switch things off only by creating its own repository variables after it pushes somewhere with Actions enabled. For a **fork**, the same holds for the fork's own pushes, but a pull request *from* a fork executes in the base repository's context, so the base repo's variables apply and a contributor cannot disable CI by setting variables in their own fork. I could not fetch GitHub's variables page this iteration (canonical URL 404), so the fork-direction claim is **inferred** and flagged; the clone-direction claim is **confirmed by construction**.

Net: the control is worth building for base repos and for clones that push to their own remote. It is not a fork-control, and the README must not claim it is.

## Questions Answered

- **What on/off control design lets a clone or base repo disable workflows or groups without editing YAML?** Answered in part 1: `vars.*` repository variables read by **job-level** `if:` conditions written to stay TRUE when unset, keyed on the five-to-six trigger tiers already documented in `.github/workflows/README.md` (F1, F2, F4, F5), with three hard limits stated up front — it cannot prevent a workflow from triggering (F6), it cannot make a fork's own CI cheaper (F7), and it depends on the still-unverified skipped-job-passes-required-check behaviour (F3). The concrete variable naming, master-switch decision and the drift check for unused variable names are left to part 2, because they depend on the branch-protection comparison this iteration could only half-confirm.

## Questions Remaining

- What on/off control design lets a clone or base repo disable workflows or groups without editing YAML? *(half answered — the mechanism and limits are settled; the naming, master switch, branch-protection comparison and drift check move to part 2)*
- What should a `/doctor:ci` command do, how is it made safe, and who owns it? *(untouched; now better constrained — it can read `vars` state but cannot write repository variables without a token.)*
- What should an `sk-code-ci` mode contain, and what does registering a new `sk-code` mode require?
- How do the ranked recommendations group into ordered implementation phases 002 and later?
- **Carried forward, still open (iteration 5):** are spec-kit tests fixture-collision-safe under `fileParallelism: true`, and does `.skilled/skills/system-spec-kit/runtime/vitest.config.ts` also set it?
- **Carried forward, still open (iteration 8):** what are the include globs of `.skilled/hooks/vitest.config.ts`?
- **Carried forward, still open (iteration 5/7/9):** which jobs are overengineered — duplicates of pre-commit hooks, or advisory jobs that never gate?

## Next Focus

CI on/off control, part 2: settle the mechanism's shape and evidence.

1. **Confirm or refute F3** — fetch the current "Using conditions to control job execution" doc (or find any in-repo evidence of a gated required check). F3 is the hinge for the whole recommendation.
2. **Compare skipped-job versus never-triggered behaviour against this repo's actual check names**: enumerate the job names that branch protection would plausibly require (the `name:` of each gating workflow and its `jobs.<id>.name`), and mark which ones a gate must never precede.
3. **Fix the variable naming and master switch**: decide `vars.SKILLED_CI_<GROUP>` with `off` as the only disabling value, decide whether a master switch belongs in YAML at all or is documented as GitHub's own Actions toggle (F6 argues the latter), and define the tier→workflow mapping against the README table.
4. **Drift check design**: propose how a check (in the spirit of `.github/scripts/check-gate-inputs.sh`) verifies that every `vars.SKILLED_CI_*` used in a workflow appears in the README table and that every group in the table is referenced, so an undocumented variable cannot silently do nothing.
5. **`pull_request_target` safety note**: the angle names it, and it interacts with F7 — confirm whether any workflow in the tree uses `pull_request_target` before recommending the gate, because a gated job under that trigger has different trust and secret exposure.

Read-only rule holds: no workflow, script or code may be edited, including for the drift-check prototype.

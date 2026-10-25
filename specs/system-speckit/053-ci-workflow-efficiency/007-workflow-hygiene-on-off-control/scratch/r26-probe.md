# R26 probe

fork head: c9e72c279d851acd775781787b4de397d09f4353
off: skipped
run id: 40150455358
unset: ran
run id: 40150476111

## Setup (observed 2026-10-25)

- Probe repository: `MichelKerkmeester/ci-switch-probe-throwaway`, created private for this probe. The source repository is public and owned by the same account, and GitHub does not let an account fork its own repository, so a throwaway repository stands in for the fork.
- The probe holds one commit, `c9e72c279d`, whose tree is the `.github/` folder of source commit `03abdb20d8`. `git rev-parse HEAD:.github/workflows` printed `1af96f305a2bda0903dbfb9bf3ef5280e1850eb6` in the probe and the same value for `03abdb20d8:.github/workflows`, so the workflow files match byte for byte. The rest of the repository (a 2.25 GiB pack) was left out on purpose.
- Actions were disabled while the commit was pushed and enabled afterwards, so the push started no run.

## Variable values (gh variable list --json name,value, probe repository only)

- Before the set: `[]`
- After `gh variable set SKILLED_CI_REPORTS --body off`: `[{"name":"SKILLED_CI_REPORTS","value":"off"}]`
- Before the delete: the same list, one entry
- After `gh variable delete SKILLED_CI_REPORTS`: `[]`
- No variable was set or deleted in the source repository.

## Runs

- Off arm: run 40150455358 (`workflow_dispatch`, head `c9e72c279d`). The run conclusion is `skipped` and its only job, `strict-pass-freshness`, is `skipped` with no steps. The task text expected a run conclusion of `success`; the API reports `skipped` for a run whose every job is skipped. The job did not run, which is what the probe tests.
- Unset arm: run 40150476111, same workflow and head, variable deleted. The job `strict-pass-freshness` ran and concluded `failure`, failing at `Install spec-kit dependencies` and `Publish the report`. The failure is expected in a tree that holds only `.github/`; the job was not skipped, which is the accepted outcome.

## Limits

- The probe shows the job-level condition skipping and running. It did not exercise a repository ruleset, so the README sentence that a switched-off job counts as passing for a required check rests on GitHub's documented behaviour, not on an observation here.

## Cleanup

- Actions are disabled on the probe repository and it holds no variables.
- Deleting the repository needs the `delete_repo` scope, which the current login lacks (`gh repo delete` returned HTTP 403). The operator removes it with `gh auth refresh -h github.com -s delete_repo` and then `gh repo delete MichelKerkmeester/ci-switch-probe-throwaway --yes`.

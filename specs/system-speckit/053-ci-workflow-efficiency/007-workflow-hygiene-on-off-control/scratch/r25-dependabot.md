# Dependabot split proof

pending: the split is not on the default branch or pushed, so no run of the two-job workflow exists yet.

Observed read-only on 2026-10-25:

- Open Dependabot pull requests (`gh pr list --author 'app/dependabot' --state open`): numbers 86, 73, 72 and 69. Number 73 is an npm security-group pull request for `undici` 8.11.2 to 8.12.3, a minor bump, so the `auto-merge` job would skip it and it waits for a person; the others are grouped version updates.
- Newest run of the workflow (`gh run list --workflow dependabot-auto-merge.yml --limit 1`): database id 40126121487, event `pull_request`, branch `branches/033-probe-checkout-sparse` (not a Dependabot branch), conclusion `skipped`. It ran the old single-job shape.

The proof needs a Dependabot pull request that triggers the new shape, which happens after the split is merged and a Dependabot pull request is opened, reopened or synchronized. No pull request was created or modified by this pass.

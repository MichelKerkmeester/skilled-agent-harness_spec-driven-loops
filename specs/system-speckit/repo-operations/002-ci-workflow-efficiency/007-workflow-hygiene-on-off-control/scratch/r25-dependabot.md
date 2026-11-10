# Dependabot split proof

run id: 40200559794

Observed on 2026-10-25 with `gh pr list --author 'app/dependabot' --state open` and `gh run view`:

- Pull request 89 (`dependabot/npm_and_yarn/dot-opencode/npm_and_yarn-57add0297a`, a grouped npm update across seven directories). Its newest run is id 40200559794, event `pull_request`, created 2026-10-25T14:04:54Z. The `Read the Dependabot update metadata` job concluded `success` and `Auto-merge Dependabot security patch updates` concluded `skipped`.
- Pull request 86 (`dependabot/github_actions/github-actions-79bfb92f48`, a grouped GitHub Actions update). Run id 40148156911, created 2026-10-25T00:48:54Z, which is after the split commit `b1315701ca` (2026-10-25T00:20Z). Same two conclusions: metadata `success`, auto-merge `skipped`.
- Both runs show the two-job shape, so the split is live on the default branch. The merge job skipped because neither pull request is a security patch update, which is the intended result. The metadata job holds `contents: read` and `pull-requests: read`, and the merge job holds the write scopes (`.github/workflows/dependabot-auto-merge.yml` lines 10 to 42).

Not observed: the merge job taking its write path on a real security patch pull request. No open Dependabot pull request is an eligible patch update, and none was created or modified to force the path.

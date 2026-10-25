# Sample: job-level timings per workflow

Taken 2026-10-25 from the default branch with the `gh` CLI. One run list per workflow file (`runs/<workflow>.json`, newest 40 runs) and one job file per run (`jobs/<run-id>.json`). Every list was written before any `gh run view` call. No rate-limit pause was logged and no run failed to fetch: the quota read 4991 before the lists and 3821 after the last view.

Commands (run from the repository root):

```bash
for f in .github/workflows/*.yml; do b="$(basename "$f" .yml)"; gh run list --workflow "$(basename "$f")" --limit 40 --json databaseId,conclusion,createdAt,event,headSha > "$PHASE/scratch/r24/runs/$b.json"; done
gh run view <run-id> --json databaseId,conclusion,jobs > "$PHASE/scratch/r24/jobs/<run-id>.json"   # once per listed run, 4 in parallel
```

| workflow | runs | oldest | newest | conclusions |
|---|---|---|---|---|
| advisory-checks.yml | 40 | 2026-10-24 | 2026-10-25 | cancelled 1, success 39 |
| agent-mirror-sync.yml | 40 | 2026-09-22 | 2026-10-24 | success 40 |
| changed-packet-validation.yml | 40 | 2026-10-24 | 2026-10-25 | cancelled 1, success 39 |
| chart-corpus.yml | 40 | 2026-09-10 | 2026-10-25 | failure 1, success 39 |
| command-tree-parity.yml | 40 | 2026-10-23 | 2026-10-24 | success 40 |
| comment-hygiene.yml | 40 | 2026-10-07 | 2026-10-24 | cancelled 1, success 39 |
| deep-loop-runtime.yml | 40 | 2026-10-12 | 2026-10-24 | failure 15, success 25 |
| dependabot-auto-merge.yml | 40 | 2026-10-07 | 2026-10-24 | skipped 16, success 24 |
| diagram-corpus.yml | 40 | 2026-09-11 | 2026-10-25 | failure 12, success 28 |
| dispatch-enforcement-guard.yml | 40 | 2026-10-24 | 2026-10-25 | cancelled 1, failure 1, success 38 |
| gate-inputs.yml | 40 | 2026-10-24 | 2026-10-25 | cancelled 1, failure 3, success 36 |
| markdown-link-integrity.yml | 40 | 2026-10-22 | 2026-10-24 | success 40 |
| message-contract.yml | 40 | 2026-10-24 | 2026-10-25 | cancelled 2, success 38 |
| naming-standard-guard.yml | 40 | 2026-10-07 | 2026-10-24 | cancelled 1, success 39 |
| opencode-dual-version.yml | 40 | 2026-10-20 | 2026-10-24 | cancelled 1, success 39 |
| opencode-plugin-tests.yml | 40 | 2026-10-23 | 2026-10-24 | success 40 |
| pi-extension-tests.yml | 13 | 2026-10-20 | 2026-10-24 | success 13 |
| playbook-operator-contract.yml | 40 | 2026-10-24 | 2026-10-25 | cancelled 1, success 39 |
| prompt-card-sync.yml | 40 | 2026-10-07 | 2026-10-24 | cancelled 1, success 39 |
| repo-rules-corpus.yml | 20 | 2026-09-18 | 2026-10-24 | failure 2, success 18 |
| routing-registry-drift.yml | 40 | 2026-10-20 | 2026-10-24 | failure 3, success 37 |
| rule-canary-sync.yml | 40 | 2026-10-24 | 2026-10-25 | cancelled 1, success 39 |
| runtime-no-spec-import.yml | 40 | 2026-10-15 | 2026-10-25 | success 40 |
| sk-code-script-tests.yml | 16 | 2026-10-20 | 2026-10-24 | success 16 |
| sk-doc-rename-harness.yml | 40 | 2026-10-07 | 2026-10-24 | success 40 |
| sk-doc-script-tests.yml | 40 | 2026-10-24 | 2026-10-25 | cancelled 1, failure 1, in-progress 1, success 37 |
| sk-git-script-tests.yml | 18 | 2026-10-20 | 2026-10-24 | success 18 |
| skill-advisor-stress.yml | 40 | 2026-10-11 | 2026-10-24 | failure 9, success 31 |
| skill-doc-frontmatter.yml | 40 | 2026-10-17 | 2026-10-25 | success 40 |
| spec-kit-check.yml | 40 | 2026-10-23 | 2026-10-24 | failure 4, success 36 |
| strict-pass-freshness-report.yml | 10 | 2026-08-31 | 2026-10-24 | failure 1, success 9 |
| trigger-index-rebuild.yml | 40 | 2026-10-23 | 2026-10-25 | skipped 2, success 38 |

Totals: 32 run lists, 1157 runs, 1157 job files (one per run, none missing).

Runs with no job data (ignored by the sizing script): opencode-dual-version run 40107103375 (cancelled).

Workflows with fewer than 40 runs in the API window: pi-extension-tests (13), repo-rules-corpus (20), sk-code-script-tests (16), sk-git-script-tests (18), strict-pass-freshness-report (10). The sample is every run the API returned, so these counts are the ceiling for those jobs.

Window note: the newest 40 runs of a busy workflow reach back only to 2026-10-23 or 2026-10-24, so for several workflows part of the window predates the merged hook and plugin job, the shared setup action and the sharded spec-kit check. The sizing script matches a run's job by the job name the tree carries now, so a run from an earlier job shape does not count toward a current job. The one such mismatch is listed in the Diagnostics section of `timeouts.md`.

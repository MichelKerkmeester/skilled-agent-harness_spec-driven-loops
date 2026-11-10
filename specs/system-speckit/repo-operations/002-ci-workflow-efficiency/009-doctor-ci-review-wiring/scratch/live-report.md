# Live report (observed 2026-10-25)

Command: `node .skilled/commands/doctor/scripts/ci-report.cjs --json > scratch/live-report.json` (exit 0, read-only `gh` calls only).

workflows: 32
newest non-rebuild SHA: 4e0b8560cb51c3809ab37d2f2de757da78948e42
switch set: ['on']
variables: all six names `unset`, so every job reads `on`
errors: none
newestNonRebuildReason: `no rebuild commit above it`
last message line: Commit-Id: 0012176

The workflow count equals `ls .github/workflows/*.yml | wc -l` (32). The resolved SHA's subject is `docs(doctor): list the ci command in setup` and its last non-empty message line is not `Trigger-Index-Rebuild: ci`, read with `gh api repos/{owner}/{repo}/commits/<sha> --jq .commit.message`.

Re-run in the closure pass (2026-10-25): `ci-report.cjs --json` exited 0 with 32 workflows, switch set ['on'] and no errors. The resolved commit moved to bce45aa297aac14f6b0e92f85126c57dc53c4ba2 (reason `no rebuild commit above it`), and its last non-empty message line is `Commit-Id: 0012178`, not `Trigger-Index-Rebuild: ci`. The first run above stays as the record of the first observation.

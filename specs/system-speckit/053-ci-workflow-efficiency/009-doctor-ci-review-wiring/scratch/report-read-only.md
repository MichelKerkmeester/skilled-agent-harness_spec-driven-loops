# Read-only proof for the report (observed 2026-10-25)

Commands: `git status --porcelain -- .github .skilled` before and after `node .skilled/commands/doctor/scripts/ci-report.cjs --json --no-gh > /dev/null` (exit 0).

status-identical: yes

`diff -u status-before.txt status-after.txt` printed nothing and exited 0. Both files hold the same single line, a change to `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md` that was already in the tree and is not made by the report. `git diff --exit-code -- .github/workflows` exited 0 (`workflows-untouched`).

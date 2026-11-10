Date: 2026-10-24
Answer: operator yes.
Exception: Probe branches and test pull requests are allowed as an exception to the session rule "push only HEAD:main; no branch push".
Naming: Create each probe branch only through `bash .skilled/skills/sk-git/scripts/worktree-naming.sh create-branch probe-<name> origin/main`, giving `branches/NNN-probe-<name>`, like PR #71. Never use raw `git branch` or `git checkout -b`. Replace each task's `probe/<name>` name with the generated branch name.
Lifecycle: Push only that probe branch. Open the test PR when the task needs one, record the evidence, close the PR unmerged, delete the remote branch, and remove any local worktree used for it. Never merge a probe; main stays `HEAD:main` only.
PROBE_BRANCHES=approved

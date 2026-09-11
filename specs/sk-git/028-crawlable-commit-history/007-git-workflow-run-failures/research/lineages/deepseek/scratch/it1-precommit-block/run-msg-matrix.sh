#!/usr/bin/env bash
# R1.4 reproduction: commit-msg hook invoked directly (no prompt, no interaction).
set -u
R="/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history"
B="$R/.opencode/specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/scratch/it1-precommit-block"
export GIT_CONFIG_GLOBAL="$B/gitconfig" GIT_CONFIG_NOSYSTEM=1
cd "$B/repo" || exit 9
git reset -q
git checkout -- .

printf 'a\n' > a.txt
printf 'b\n' > b.txt
printf 'c\n' > c.txt
printf 'd\n' > d.txt
git add a.txt b.txt c.txt d.txt

printf 'docs(x): add batch of files\n' > "$B/msg-a.txt"
echo "=== case A: subject only, 4 staged paths ==="
set +e
bash .opencode/scripts/git-hooks/commit-msg "$B/msg-a.txt" 2>&1
echo "caseA_rc=$?"
echo "=== case A+bypass: SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1 ==="
SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1 bash .opencode/scripts/git-hooks/commit-msg "$B/msg-a.txt" 2>&1
echo "caseA_bypass_rc=$?"
set -e

git reset -q
printf 'docs(x): update packet\n\nRefs: specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/dispatch-prompt.md\n' > "$B/msg-b.txt"
echo "=== case B: long Refs trailer (106 chars) ==="
set +e
bash .opencode/scripts/git-hooks/commit-msg "$B/msg-b.txt" 2>&1
echo "caseB_rc=$?"
set -e

printf 'docs(x): update WU7 findings\n' > "$B/msg-c.txt"
echo "=== case C: internal process label in subject ==="
set +e
bash .opencode/scripts/git-hooks/commit-msg "$B/msg-c.txt" 2>&1
echo "caseC_rc=$?"
set -e

printf 'docs(007): fix packet docs\n' > "$B/msg-d.txt"
echo "=== case D: numeric-only scope ==="
set +e
bash .opencode/scripts/git-hooks/commit-msg "$B/msg-d.txt" 2>&1
echo "caseD_rc=$?"
set -e

#!/usr/bin/env bash
# R1.6: installer under a global core.hooksPath (throwaway, isolated config).
set -u
R="/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history"
B="$R/.opencode/specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/scratch/it1-worktree-global-hooks"
export GIT_CONFIG_GLOBAL="$B/gitconfig" GIT_CONFIG_NOSYSTEM=1
rm -rf "$B/installer-repo" "$B/global-hooks"
mkdir -p "$B/installer-repo/.opencode/scripts/git-hooks" "$B/global-hooks"
printf '#!/usr/bin/env bash\necho WORKTREE-INSTALLER-HOOK\nexit 0\n' > "$B/installer-repo/.opencode/scripts/git-hooks/pre-commit"
chmod +x "$B/installer-repo/.opencode/scripts/git-hooks/pre-commit"
cd "$B/installer-repo" || exit 9
git init -q -b main
git config --global core.hooksPath "$B/global-hooks"
echo "=== installer targets global hooksPath when set ==="
bash "$R/.opencode/scripts/install-git-hooks.sh"
echo "--- global-hooks dir ---"
ls -la "$B/global-hooks" | sed 's/^/  /'
echo "--- symlink resolves to ---"
readlink "$B/global-hooks/pre-commit"
echo "--- repo .git/hooks (should hold no pre-commit) ---"
ls -la .git/hooks | grep -c pre-commit || true

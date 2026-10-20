#!/bin/bash
W=$1 S=$2 D=$3
P=.skilled/skills/sk-git/scripts
N22=/Users/michelkerkmeester/.nvm/versions/node/v22.23.1/bin
CIPATH="$S/bun/node_modules/.bin:$N22:/usr/bin:/bin:/usr/sbin:/sbin"
rm -rf "$S/fresh"
{
echo "# Fresh-clone provisioning with only the CI toolchain on PATH"
echo "\$ git clone -q --no-hardlinks <worktree> <scratch>/fresh"
git clone -q --no-hardlinks "$W" "$S/fresh"; echo "clone exit=$?"
echo "cloned HEAD: $(git -C "$S/fresh" rev-parse HEAD); worktree HEAD: $(git -C "$W" rev-parse HEAD)"
echo "\$ cp the worktree's uncommitted worktree-naming.sh and worktree-provision-paths.txt into the clone"
cp "$W/$P/worktree-naming.sh" "$W/$P/worktree-provision-paths.txt" "$S/fresh/$P/"
for f in worktree-naming.sh worktree-provision-paths.txt; do
  echo "sha256 $f worktree=$(shasum -a 256 "$W/$P/$f" | cut -c1-16) clone=$(shasum -a 256 "$S/fresh/$P/$f" | cut -c1-16)"
done
cd "$S/fresh" || exit 1
echo "CIPATH=$CIPATH (each nested shell re-exports it, since a login profile prepends ~/.local/bin on this machine)"
echo "\$ env -i HOME=\$HOME PATH=\$CIPATH bash -c 'set -euo pipefail; export PATH=\"\$CIPATH\"; source $P/worktree-naming.sh; provision_worktree \"\$PWD\"'"
s=$(date +%s)
env -i HOME="$HOME" PATH="$CIPATH" CIPATH="$CIPATH" bash -c 'set -euo pipefail; export PATH="$CIPATH"; echo "node $(command -v node) $(node -v), npm $(npm -v), bun $(bun -v)"; source .skilled/skills/sk-git/scripts/worktree-naming.sh; provision_worktree "$PWD"' 2>&1
echo "provision exit=$? seconds=$(( $(date +%s) - s ))"
for p in .pi/extensions/pi-cache-optimizer .pi/extensions/pi-fast-mode-w-subagent-support .skilled/skills/sk-design/sk-design-md-generator/backend; do
  echo "\$ (cd $p && env -i HOME=\$HOME PATH=\$CIPATH npm test)"
  (cd "$p" && env -i HOME="$HOME" PATH="$CIPATH" CIPATH="$CIPATH" bash -c 'export PATH="$CIPATH"; npm test' > "$S/t.log" 2>&1; rc=$?; sed 's/\x1b\[[0-9;]*m//g' "$S/t.log" | grep -E "^# (pass|fail) | Tests +[0-9]|Test Files"; echo "test exit=$rc")
done
} > "$D/fresh-clone.txt" 2>&1

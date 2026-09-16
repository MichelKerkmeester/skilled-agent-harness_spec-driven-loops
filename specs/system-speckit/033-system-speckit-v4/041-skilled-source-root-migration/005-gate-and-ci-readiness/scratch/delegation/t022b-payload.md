# Edits for unit t022b

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/scripts/git-hooks/tests/autostash-orphan-guard.test.sh`

OLD:

~~~~text
# Test harness for the autostash orphan guard.
~~~~

NEW:

~~~~text
# Test harness for the autostash orphan guard, and for what the post-commit,
# post-merge and post-rewrite hooks say when a script they call is missing.
~~~~

## Edit 2

File: `.opencode/scripts/git-hooks/tests/autostash-orphan-guard.test.sh`

OLD:

~~~~text
  cp "$HOOKS_DIR/post-commit" "$T/.opencode/scripts/git-hooks/"
  chmod +x "$T/.opencode/scripts/git-hooks/post-rewrite" "$T/.opencode/scripts/git-hooks/post-commit"
~~~~

NEW:

~~~~text
  cp "$HOOKS_DIR/post-commit" "$T/.opencode/scripts/git-hooks/"
  cp "$HOOKS_DIR/post-merge" "$T/.opencode/scripts/git-hooks/"
  chmod +x "$T/.opencode/scripts/git-hooks/post-rewrite" "$T/.opencode/scripts/git-hooks/post-commit" \
           "$T/.opencode/scripts/git-hooks/post-merge"
~~~~

## Edit 3

File: `.opencode/scripts/git-hooks/tests/autostash-orphan-guard.test.sh`

OLD:

~~~~text
echo "--- autostash-orphan-guard: $pass passed, $fail failed ---"
[[ "$fail" -eq 0 ]]
~~~~

NEW:

~~~~text
# ── 3. each hook warns when the guard library is missing where the toolchain ships ──
setup_repo
mkdir -p "$T/.opencode/skills/system-spec-kit"
printf 'sentinel\n' > "$T/.opencode/skills/system-spec-kit/SKILL.md"
rm "$T/.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh"
printf 'base\n' > "$T/f.txt"; git -C "$T" add f.txt
git -C "$T" commit -qm base 2>"$T/err.txt"
chk "$(grep -c 'guard library is missing.*(post-commit)' "$T/err.txt")" "1" "post-commit warns when the guard library is missing"
git -C "$T" commit -q --amend -m amended 2>"$T/err.txt"
chk "$(grep -c 'guard library is missing.*(post-rewrite)' "$T/err.txt")" "1" "post-rewrite warns when the guard library is missing"
git -C "$T" checkout -q -b side
printf 'side\n' > "$T/s.txt"; git -C "$T" add s.txt; git -C "$T" commit -qm side 2>/dev/null
git -C "$T" checkout -q -
git -C "$T" merge -q side 2>"$T/err.txt"
chk "$(grep -c 'guard library is missing.*(post-merge)' "$T/err.txt")" "1" "post-merge warns when the guard library is missing"

# ── 4. an autosync commit warns about a missing kill switch and a missing publisher ──
setup_repo
mkdir -p "$T/.opencode/skills/system-spec-kit"
printf 'sentinel\n' > "$T/.opencode/skills/system-spec-kit/SKILL.md"
printf 'base\n' > "$T/f.txt"; git -C "$T" add -A; git -C "$T" commit -qm base 2>/dev/null
LINKED="$T-linked"; rm -rf "$LINKED"
git -C "$T" worktree add -q -b live-wip "$LINKED" 2>/dev/null
printf 'next\n' > "$LINKED/next.txt"; git -C "$LINKED" add next.txt
SPECKIT_AUTOSYNC=1 SPECKIT_LIVE_BRANCH=live git -C "$LINKED" commit -qm next 2>"$T/err.txt"
chk "$(grep -c 'hook-flags.sh is missing' "$T/err.txt")" "1" "an autosync commit warns about a missing kill switch"
chk "$(grep -c 'git-sync.sh is missing' "$T/err.txt")" "1" "an autosync commit warns about a missing publisher"
git -C "$T" worktree remove --force "$LINKED" 2>/dev/null; rm -rf "$LINKED"

# ── 5. under a linked source root the guard still anchors, and logs under .skilled ──
setup_repo
mv "$T/.opencode" "$T/.skilled"
ln -s .skilled "$T/.opencode"
printf 'base\n' > "$T/f.txt"; git -C "$T" add f.txt; git -C "$T" commit -qm base
printf 'work\n' > "$T/f.txt"
git -C "$T" stash push -qm autostash
printf 'next\n' > "$T/next.txt"; git -C "$T" add next.txt; git -C "$T" commit -qm next 2>/dev/null
rescue_sha="$(first_ref refs/autostash-rescue/)"
stash_sha="$(git -C "$T" stash list --format='%H' 2>/dev/null | head -1)"
chk "$rescue_sha" "$stash_sha" "the guard anchors a leftover autostash through a linked source root"
chk "$([[ -s "$T/.skilled/logs/autostash-orphan-alerts.log" ]] && echo yes || echo no)" "yes" "the alert log lands under .skilled/logs"

echo "--- autostash-orphan-guard: $pass passed, $fail failed ---"
[[ "$fail" -eq 0 ]]
~~~~

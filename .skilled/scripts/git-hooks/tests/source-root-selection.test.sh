#!/usr/bin/env bash
# Test harness for how the hook scripts choose the source root.
#
# WHY: the source tree sits under .skilled or .opencode, and every script that guessed
# which name was real broke a layout the guess did not cover. The scripts now share one
# selection block that picks by the spec-kit sentinel. This proves three things: every
# copy of that block is the same, no script builds a tree path by naming a root outside
# it, and the block picks the right root in each layout a checkout can hold.
#
# Exit 0 = all pass, 1 = any failure.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE="$(cd "$HERE/../../.." && pwd)"

# Scripts that carry the selection block, and every script that must not name a root to
# build a path, relative to the source root.
SELECTING="scripts/git-hooks/pre-commit scripts/git-hooks/pre-push scripts/git-hooks/prepare-commit-msg
scripts/git-hooks/post-commit scripts/git-hooks/post-merge scripts/git-hooks/post-rewrite
hooks/git/pre-commit bin/check-git-hooks.sh scripts/install-git-hooks.sh"
SCANNED="$SELECTING scripts/git-hooks/commit-msg scripts/git-hooks/lib/autostash-orphan-guard.sh
scripts/git-hooks/lib/mass-deletion-guard.sh hooks/git/install-hooks.sh"

BEGIN_MARK='# >>> source-root selection'
END_MARK='# <<< source-root selection'

pass=0; fail=0
chk() { # <actual> <expected> <name>
  if [[ "$1" == "$2" ]]; then echo "PASS: $3"; pass=$((pass + 1))
  else echo "FAIL: $3 (got '$1' want '$2')"; fail=$((fail + 1)); fi
}

block_of() { # block_of <file>: print the selection block, markers included
  awk -v b="$BEGIN_MARK" -v e="$END_MARK" 'index($0, b) == 1 { on = 1 } on { print } index($0, e) == 1 { on = 0 }' "$1"
}

T="$(mktemp -d "${TMPDIR:-/tmp}/source-root-selection-test.XXXXXX")"
trap 'rm -rf "$T"' EXIT

# ── 1. every selecting script carries the block once, and every copy is the same ──
reference=""
for rel in $SELECTING; do
  file="$SOURCE/$rel"
  chk "$(grep -c "^$BEGIN_MARK" "$file")" "1" "$rel carries the selection block once"
  if [[ -z "$reference" ]]; then
    reference="$(block_of "$file")"
    chk "$([[ -n "$reference" ]] && echo yes || echo no)" "yes" "$rel yields a non-empty reference block"
  else
    chk "$([[ "$(block_of "$file")" == "$reference" ]] && echo same || echo differs)" "same" "$rel matches the reference block"
  fi
done

# ── 2. outside the block, no script builds a tree path by naming one root ──
# A line that names both roots enumerates them rather than choosing, and is allowed.
for rel in $SCANNED; do
  file="$SOURCE/$rel"
  hits="$(awk -v b="$BEGIN_MARK" -v e="$END_MARK" '
    index($0, b) == 1 { on = 1 } index($0, e) == 1 { on = 0; next } on { next }
    /^[[:space:]]*#/ { next }
    /\$[{]?[A-Za-z_][A-Za-z0-9_]*[}]?\/\.(opencode|skilled)([\/"[:space:]]|$)/ {
      if ($0 ~ /\.opencode/ && $0 ~ /\.skilled/) next
      print FNR ": " $0
    }' "$file")"
  chk "${hits:-none}" "none" "$rel names no single root to build a path"
done

# ── 3. the block selects the right root in each layout ──
select_in() { # select_in <repo-root>: print the selected root's name and toolchain verdict
  (
    REPO_ROOT="$1"
    eval "$reference"
    if _in_toolchain_repo; then verdict=toolchain; else verdict=foreign; fi
    printf '%s %s\n' "${SOURCE_ROOT##*/}" "$verdict"
  )
}
sentinel() { mkdir -p "$1/skills/system-spec-kit"; printf 'sentinel\n' > "$1/skills/system-spec-kit/SKILL.md"; }

mkdir -p "$T/both"; sentinel "$T/both/.skilled"; sentinel "$T/both/.opencode"
chk "$(select_in "$T/both")" ".skilled toolchain" "both roots carry the sentinel: .skilled wins"

mkdir -p "$T/skilled-only"; sentinel "$T/skilled-only/.skilled"
chk "$(select_in "$T/skilled-only")" ".skilled toolchain" "only .skilled exists: .skilled"

mkdir -p "$T/legacy-only"; sentinel "$T/legacy-only/.opencode"
chk "$(select_in "$T/legacy-only")" ".opencode toolchain" "only .opencode exists: .opencode"

mkdir -p "$T/placeholder/.skilled/scripts/git-hooks"; sentinel "$T/placeholder/.opencode"
chk "$(select_in "$T/placeholder")" ".opencode toolchain" "an empty .skilled placeholder does not win"

mkdir -p "$T/per-entry/.skilled" "$T/per-entry/.opencode"; sentinel "$T/per-entry/.skilled"
ln -s ../.skilled/skills "$T/per-entry/.opencode/skills"
chk "$(select_in "$T/per-entry")" ".skilled toolchain" "a directory of per-entry links still prefers the real root"

mkdir -p "$T/foreign"
chk "$(select_in "$T/foreign")" ".opencode foreign" "a repository without the toolchain is not treated as one"
chk "$(select_in "")" ".opencode foreign" "outside any repository nothing is treated as the toolchain"

# ── 4. every global hook carries the same trust block ──
TRUSTING="pre-commit prepare-commit-msg post-commit post-merge post-rewrite pre-push"
trust_block_of() { # trust_block_of <file>: print the trust block, markers included
  awk 'index($0, "# >>> hook trust") == 1 { on = 1 } on { print } index($0, "# <<< hook trust") == 1 { on = 0 }' "$1"
}
trust_ref="$(trust_block_of "$SOURCE/scripts/git-hooks/pre-commit")"
chk "$([[ -n "$trust_ref" ]] && echo yes || echo no)" "yes" "pre-commit yields a non-empty trust block"
for name in $TRUSTING; do
  file="$SOURCE/scripts/git-hooks/$name"
  chk "$(grep -c '^# >>> hook trust' "$file")" "1" "$name carries the trust block once"
  chk "$([[ "$(trust_block_of "$file")" == "$trust_ref" ]] && echo same || echo differs)" "same" "$name matches the reference trust block"
done

# ── 5. the trust block keeps a repository's own tree only when it is trusted ──
# A probe script stands in for a hook: it lives in its own checkout ("home"), is
# reached through a symlink the way core.hooksPath reaches the real hooks, and
# prints the source root the trust block leaves.
git init -q "$T/home"
git -C "$T/home" -c user.email=t@example.com -c user.name=test commit -q --allow-empty -m init
{
  printf '%s\n' 'REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"'
  printf '%s\n' 'SOURCE_ROOT="$REPO_ROOT/.skilled"'
  printf '%s\n' "$trust_ref"
  printf '%s\n' 'printf "%s\n" "${SOURCE_ROOT##*/}"'
} > "$T/home/probe.sh"
git -C "$T/home" worktree add -q "$T/home-wt" 2>/dev/null
mkdir -p "$T/linked"; ln -s "$T/home/probe.sh" "$T/linked/probe.sh"
git init -q "$T/clone"
probe() { # probe <cwd> [env-assignment...]: print the source root the probe keeps
  local dir="$1"; shift
  ( cd "$dir" && env "$@" bash "$T/linked/probe.sh" )
}
chk "$(probe "$T/home")" ".skilled" "the hooks' own checkout is trusted"
chk "$(probe "$T/home-wt")" ".skilled" "a worktree of the hooks' checkout is trusted"
chk "$(probe "$T/clone")" ".skilled-untrusted" "another repository is not trusted"
chk "$(probe "$T/clone" GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=skilled.trustRepoHooks GIT_CONFIG_VALUE_0=true)" \
  ".skilled-untrusted" "an environment-scope opt-in does not count"
git -C "$T/clone" config skilled.trustRepoHooks true
chk "$(probe "$T/clone")" ".skilled" "a local-config opt-in is trusted"

# ── 6. a cloned repository's planted guard library never runs ──
# End to end through the real post-commit hook: the clone carries the toolchain
# sentinel and a guard library that leaves a marker file when sourced.
git init -q "$T/victim"
sentinel "$T/victim/.skilled"
mkdir -p "$T/victim/.skilled/scripts/git-hooks/lib"
printf 'autostash_orphan_guard() { : > "%s"; }\n' "$T/planted-ran" \
  > "$T/victim/.skilled/scripts/git-hooks/lib/autostash-orphan-guard.sh"
printf 'x\n' > "$T/victim/file.txt"
git -C "$T/victim" add file.txt
git -C "$T/victim" -c core.hooksPath=/dev/null -c user.email=t@example.com -c user.name=test commit -q -m seed
( cd "$T/victim" && bash "$SOURCE/scripts/git-hooks/post-commit" ) >/dev/null 2>&1
chk "$([[ -e "$T/planted-ran" ]] && echo ran || echo blocked)" "blocked" "an untrusted clone's planted guard library does not run"
git -C "$T/victim" config skilled.trustRepoHooks true
( cd "$T/victim" && bash "$SOURCE/scripts/git-hooks/post-commit" ) >/dev/null 2>&1
chk "$([[ -e "$T/planted-ran" ]] && echo ran || echo blocked)" "ran" "the same library runs once the repository opts in"

echo ""
echo "--- source-root-selection: $pass passed, $fail failed ---"
[[ "$fail" -eq 0 ]]

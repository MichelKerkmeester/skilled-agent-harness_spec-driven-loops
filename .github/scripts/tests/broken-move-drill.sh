#!/usr/bin/env bash
# Broken-move drill for the gate inputs.
#
# Clones this repository and moves the source tree the way the migration will: every
# file under .skilled/, and .opencode a tracked relative link back to it. On that
# tree the independent check must pass and each hook must stay quiet on a benign
# change. Then each gate input is deleted in turn: the check must fail naming it, and
# the hook that uses it must block or warn. Two controls keep the proof honest. The
# hooks from before the missing-script rule must pass the silent breaks without a
# word, which shows the drill can see a silent pass. And in a repository that does
# not ship the toolchain, each current hook must exit 0 and print nothing the earlier
# hook did not.
#
# Usage: bash .github/scripts/tests/broken-move-drill.sh
# Runs locally rather than in CI, because it clones the whole repository.
# Exit:  0 every expectation held, 1 one did not, 2 setup failed

set -uo pipefail

unset GIT_DIR GIT_WORK_TREE GIT_COMMON_DIR GIT_INDEX_FILE GIT_OBJECT_DIRECTORY \
      GIT_ALTERNATE_OBJECT_DIRECTORIES GIT_CONFIG GIT_CONFIG_SYSTEM \
      GIT_CONFIG_COUNT GIT_NAMESPACE GIT_CEILING_DIRECTORIES
export GIT_CONFIG_GLOBAL=/dev/null

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
SRC="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null)" || { echo "not inside a repository" >&2; exit 2; }
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
CLONE="$WORK/moved"
PRE_HOOKS="$WORK/pre-change"
PASS=0; FAIL=0

say() { echo ""; echo "== $1"; }
pass() { echo "PASS  $1"; PASS=$((PASS + 1)); }
fail() { echo "FAIL  $1"; sed 's/^/        /' "$WORK/out.log" | tail -6; FAIL=$((FAIL + 1)); }

# expect <label> <expected-rc> <actual-rc> <present|absent> <substring>
expect() {
  local found=0
  grep -qF -- "$5" "$WORK/out.log" && found=1
  if [[ "$3" != "$2" ]]; then fail "$1 (exit $3, expected $2)"
  elif [[ "$4" == "present" && "$found" -eq 0 ]]; then fail "$1 (output lacks '$5')"
  elif [[ "$4" == "absent" && "$found" -eq 1 ]]; then fail "$1 (output carries '$5')"
  else pass "$1"; fi
}

# The hooks as they were before the missing-script rule: the parent of the first
# commit that gave pre-commit its toolchain check.
FIRST_RULE="$(git -C "$SRC" log --reverse --format=%H -S _in_toolchain_repo -- .opencode/scripts/git-hooks/pre-commit | head -1)"
[[ -n "$FIRST_RULE" ]] || { echo "cannot find the commit that introduced the missing-script rule" >&2; exit 2; }
mkdir -p "$PRE_HOOKS"
for hook in pre-commit pre-push prepare-commit-msg post-commit; do
  git -C "$SRC" show "$FIRST_RULE^:.opencode/scripts/git-hooks/$hook" > "$PRE_HOOKS/$hook" || exit 2
done
git -C "$SRC" show "$FIRST_RULE^:.opencode/bin/check-git-hooks.sh" > "$PRE_HOOKS/check-git-hooks.sh" || exit 2
git -C "$SRC" show "$FIRST_RULE^:.opencode/hooks/git/pre-commit" > "$PRE_HOOKS/legacy-pre-commit" || exit 2

say "setup: clone and move the source tree"
git clone --local -q "$SRC" "$CLONE" || exit 2
git -C "$CLONE" config core.hooksPath /dev/null
git -C "$CLONE" config user.email drill@example.com
git -C "$CLONE" config user.name drill
rm -rf "$CLONE/.skilled"
mv "$CLONE/.opencode" "$CLONE/.skilled"
ln -s .skilled "$CLONE/.opencode"
git -C "$CLONE" add -A .opencode .skilled || exit 2
git -C "$CLONE" commit -qm "move the source tree under .skilled" || exit 2
echo "moved $(git -C "$CLONE" diff --name-only -M HEAD~1 HEAD | wc -l | tr -d ' ') paths"

H="$CLONE/.opencode/scripts/git-hooks"
SKIP_ALL="SPECKIT_SKIP_COMMENT_HYGIENE=1 SPECKIT_SKIP_MIRROR_PARITY=1 SPECKIT_SKIP_CARD_SYNC=1 SPECKIT_SKIP_MCP_MUTATION_CLASS=1 SPECKIT_SKIP_ROUTE_REMINT=1 SPECKIT_SKIP_SPEC_REMINT=1"
SPEC_DOC="$(git -C "$CLONE" ls-files 'specs/*/graph-metadata.json' 'specs/**/graph-metadata.json' | while IFS= read -r m; do d="$(dirname "$m")"; [[ -f "$CLONE/$d/spec.md" ]] && { echo "$d/spec.md"; break; }; done)"
[[ -n "$SPEC_DOC" ]] || { echo "no spec packet to stage" >&2; exit 2; }

run_check() { bash "$CLONE/.github/scripts/check-gate-inputs.sh" "$CLONE" >"$WORK/out.log" 2>&1; }

# stage <path>: change one tracked file and stage it, so a hook sees a trigger.
stage() { echo "drill" >> "$CLONE/$1"; git -C "$CLONE" add -- "$1"; }
unstage_all() { git -C "$CLONE" reset -q; git -C "$CLONE" checkout -q -- .; }

# run_pre_commit <hook-file> <env assignments>
run_pre_commit() { ( cd "$CLONE" && env $2 bash "$1" ) >"$WORK/out.log" 2>&1; }
# run_pre_push <hook-file> <stdin line> <env assignments>
run_pre_push() { printf '%s\n' "$2" | ( cd "$CLONE" && env $3 bash "$1" ) >"$WORK/out.log" 2>&1; }
run_prepare() { printf 'feat(drill): a message\n\nBody.\n' > "$WORK/msg.txt"; ( cd "$CLONE" && bash "$1" "$WORK/msg.txt" message ) >"$WORK/out.log" 2>&1; }
run_plain() { ( cd "$CLONE" && bash "$1" ) >"$WORK/out.log" 2>&1; }

# Two push ranges. The move itself, which a diff across sees as every .opencode file
# deleted. And an ordinary change to a skill after the move, which is the range the
# gates meet from then on, and the one where a filter naming .opencode alone sees nothing.
MOVE_SHA="$(git -C "$CLONE" rev-parse HEAD)"
PRE_MOVE_SHA="$(git -C "$CLONE" rev-parse HEAD~1)"
MOVE_LINE="refs/heads/main $MOVE_SHA refs/heads/main $PRE_MOVE_SHA"
SKILL_FILE="$(git -C "$CLONE" ls-files '.skilled/skills/*/README.md' | head -1)"
echo "drill" >> "$CLONE/$SKILL_FILE"
git -C "$CLONE" add -- "$SKILL_FILE"
git -C "$CLONE" commit -qm "change a skill after the move" || exit 2
AFTER_SHA="$(git -C "$CLONE" rev-parse HEAD)"
MAIN_LINE="refs/heads/main $AFTER_SHA refs/heads/main $MOVE_SHA"
FEATURE_LINE="refs/heads/feature-drill $AFTER_SHA refs/heads/feature-drill $MOVE_SHA"

say "section 1: moved and whole"
run_check; RC=$?
expect "the check passes on the moved tree" 0 "$RC" present "RESULT: PASSED"
stage AGENTS.md
run_pre_commit "$H/pre-commit" "SPECKIT_SKIP_MIRROR_PARITY=1 SPECKIT_SKIP_ROUTE_REMINT=1 SPECKIT_SKIP_SPEC_REMINT=1"; RC=$?
expect "pre-commit stays quiet on a benign change" 0 "$RC" absent "gate:"
unstage_all
run_pre_push "$H/pre-push" "$MOVE_LINE" "SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1"; RC=$?
expect "pre-push lets the move itself through" 0 "$RC" absent "BLOCKED"
run_prepare "$H/prepare-commit-msg"; RC=$?
expect "prepare-commit-msg stamps through the link" 0 "$RC" absent "allocator"

say "section 2: moved and broken, one gate input at a time"
# break <label> <path under the source root>... : delete, then restore after the case
break_input() { for p in "$@"; do rm -rf "$CLONE/.skilled/$p"; done; }
restore_input() { git -C "$CLONE" checkout -q -- .skilled; }

check_names() { # check_names <label> <path under the source root>
  run_check; local rc=$?
  expect "check fails on $1" 1 "$rc" present "$2"
}

break_input skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh
check_names "a missing comment checker" ".opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh resolves nowhere"
stage AGENTS.md
run_pre_commit "$H/pre-commit" "$SKIP_ALL SPECKIT_SKIP_COMMENT_HYGIENE=0"; RC=$?
expect "pre-commit blocks on a missing comment checker" 1 "$RC" present "BLOCKED [gate:comment-hygiene]"
run_plain "$CLONE/.opencode/hooks/git/pre-commit"; RC=$?
expect "the legacy helper blocks on a missing comment checker" 1 "$RC" present "comment hygiene checker is missing"
unstage_all; restore_input

break_input skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs
check_names "a missing agent mirror checker" ".opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs resolves nowhere"
stage .skilled/agents/ai-council.md
run_pre_commit "$H/pre-commit" "$SKIP_ALL"; RC=$?
expect "pre-commit blocks on a missing agent mirror checker" 1 "$RC" present "BLOCKED [gate:agent-mirror-sync]"
unstage_all; restore_input

PARITY="skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs commands/doctor/scripts/agent-roster-mirror-check.cjs commands/doctor/scripts/command-catalog-mirror-check.cjs skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs"
# shellcheck disable=SC2086
break_input $PARITY
check_names "missing mirror parity scripts" ".opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs resolves nowhere"
stage AGENTS.md
run_pre_commit "$H/pre-commit" "$SKIP_ALL SPECKIT_SKIP_MIRROR_PARITY=0"; RC=$?
expect "pre-commit blocks on missing mirror parity scripts" 1 "$RC" present "BLOCKED [gate:mirror-parity]: script is missing"
unstage_all; restore_input

break_input skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh
check_names "a missing card-sync guard" ".opencode/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh resolves nowhere"
stage .skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md
run_pre_commit "$H/pre-commit" "$SKIP_ALL SPECKIT_SKIP_CARD_SYNC=0"; RC=$?
expect "pre-commit blocks on a missing card-sync guard" 1 "$RC" present "BLOCKED [gate:prompt-card-sync]: drift guard is missing"
unstage_all; restore_input

break_input commands/doctor/scripts/check-mcp-mutation-class.sh
check_names "a missing mutation-class guard" ".opencode/commands/doctor/scripts/check-mcp-mutation-class.sh resolves nowhere"
stage .skilled/skills/mcp-code-mode/scripts/doctor.sh
run_pre_commit "$H/pre-commit" "$SKIP_ALL SPECKIT_SKIP_MCP_MUTATION_CLASS=0"; RC=$?
expect "pre-commit blocks on a missing mutation-class guard" 1 "$RC" present "BLOCKED [gate:mcp-mutation-class]: contract guard is missing"
unstage_all; restore_input

break_input skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs
check_names "a missing re-derive tool" ".opencode/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs resolves nowhere"
stage "$SPEC_DOC"
run_pre_commit "$H/pre-commit" "$SKIP_ALL SPECKIT_SKIP_SPEC_REMINT=0"; RC=$?
expect "pre-commit blocks on a missing re-derive tool" 1 "$RC" present "BLOCKED [gate:spec-remint]: re-derive tool is missing"
unstage_all; restore_input

break_input hooks/shared/hook-flags.sh
check_names "a missing kill switch" ".opencode/hooks/shared/hook-flags.sh resolves nowhere"
stage AGENTS.md
run_pre_commit "$H/pre-commit" "$SKIP_ALL"; RC=$?
expect "pre-commit warns on a missing kill switch" 0 "$RC" present "WARNING [gate:hook-flags]"
unstage_all; restore_input

break_input bin/compiled-route-guard.cjs
check_names "a missing route guard" ".opencode/bin/compiled-route-guard.cjs resolves nowhere"
run_pre_push "$H/pre-push" "$MAIN_LINE" "SPECKIT_ALLOW_MASS_DELETION=1"; RC=$?
expect "pre-push blocks on a missing route guard" 1 "$RC" present "BLOCKED [gate:compiled-routing]: route guard is missing"
restore_input

break_input scripts/git-hooks/lib/mass-deletion-guard.sh
check_names "a missing mass-deletion library" "mass-deletion-guard.sh"
run_pre_push "$H/pre-push" "$MAIN_LINE" "SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1"; RC=$?
expect "pre-push blocks on a missing mass-deletion library" 1 "$RC" present "BLOCKED [gate:mass-deletion]: guard library is missing"
restore_input

break_input skills/sk-git/scripts/worktree-naming.sh
check_names "a missing permission script" ".opencode/skills/sk-git/scripts/worktree-naming.sh resolves nowhere"
run_pre_push "$H/pre-push" "$FEATURE_LINE" "SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1 SPECKIT_ALLOW_MASS_DELETION=1"; RC=$?
expect "pre-push blocks on a missing permission script" 1 "$RC" present "BLOCKED [gate:remote-permission]: the permission script is missing"
restore_input

break_input skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs
check_names "a missing skill-root metadata checker" ".opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs resolves nowhere"
run_pre_push "$H/pre-push" "$MAIN_LINE" "SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1 SPECKIT_ALLOW_MASS_DELETION=1"; RC=$?
expect "pre-push warns on a missing skill-root metadata checker" 0 "$RC" present "WARNING [gate:skill-root-metadata]: checker is missing"
restore_input

break_input skills/sk-git/scripts/commit-id-naming.sh
check_names "a missing commit id allocator" ".opencode/skills/sk-git/scripts/commit-id-naming.sh resolves nowhere"
run_prepare "$H/prepare-commit-msg"; RC=$?
expect "prepare-commit-msg warns on a missing allocator" 0 "$RC" present "allocator is missing"
restore_input

break_input scripts/git-hooks/lib/autostash-orphan-guard.sh
check_names "a missing autostash guard library" "autostash-orphan-guard.sh"
run_plain "$H/post-commit"; RC=$?
expect "post-commit warns on a missing autostash guard library" 0 "$RC" present "WARNING [gate:autostash-guard]: guard library is missing"
restore_input

break_input scripts/git-hooks
check_names "a missing hook source directory" "FAIL gate-files"
run_plain "$CLONE/.opencode/bin/check-git-hooks.sh"; RC=$?
expect "the SessionStart check warns on a missing hook source directory" 0 "$RC" present "hook source directory is missing"
restore_input

say "section 3: controls"
# The same breaks that were silent before the rule, run through the earlier hooks.
break_input $PARITY
stage AGENTS.md
run_pre_commit "$PRE_HOOKS/pre-commit" "$SKIP_ALL SPECKIT_SKIP_MIRROR_PARITY=0"; RC=$?
expect "earlier pre-commit passes missing parity scripts in silence" 0 "$RC" absent "gate:"
unstage_all; restore_input

break_input skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh
stage .skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md
run_pre_commit "$PRE_HOOKS/pre-commit" "$SKIP_ALL SPECKIT_SKIP_CARD_SYNC=0"; RC=$?
expect "earlier pre-commit passes a missing card-sync guard in silence" 0 "$RC" absent "gate:"
unstage_all; restore_input

break_input commands/doctor/scripts/check-mcp-mutation-class.sh
stage .skilled/skills/mcp-code-mode/scripts/doctor.sh
run_pre_commit "$PRE_HOOKS/pre-commit" "$SKIP_ALL SPECKIT_SKIP_MCP_MUTATION_CLASS=0"; RC=$?
expect "earlier pre-commit passes a missing mutation-class guard in silence" 0 "$RC" absent "gate:"
unstage_all; restore_input

break_input hooks/shared/hook-flags.sh
stage AGENTS.md
run_pre_commit "$PRE_HOOKS/pre-commit" "$SKIP_ALL"; RC=$?
expect "earlier pre-commit passes a missing kill switch in silence" 0 "$RC" absent "gate:"
unstage_all; restore_input

break_input bin/compiled-route-guard.cjs
run_pre_push "$PRE_HOOKS/pre-push" "$MAIN_LINE" "SPECKIT_ALLOW_MASS_DELETION=1"; RC=$?
expect "earlier pre-push passes a missing route guard in silence" 0 "$RC" absent "gate:"
restore_input

break_input scripts/git-hooks/lib/mass-deletion-guard.sh
run_pre_push "$PRE_HOOKS/pre-push" "$MAIN_LINE" "SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1"; RC=$?
expect "earlier pre-push passes a missing mass-deletion library in silence" 0 "$RC" absent "gate:"
restore_input

break_input skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs
run_pre_push "$PRE_HOOKS/pre-push" "$MAIN_LINE" "SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1 SPECKIT_ALLOW_MASS_DELETION=1"; RC=$?
expect "earlier pre-push passes a missing skill checker in silence" 0 "$RC" absent "gate:"
restore_input

break_input skills/sk-git/scripts/commit-id-naming.sh
run_prepare "$PRE_HOOKS/prepare-commit-msg"; RC=$?
expect "earlier prepare-commit-msg passes a missing allocator in silence" 0 "$RC" absent "allocator"
restore_input

break_input scripts/git-hooks/lib/autostash-orphan-guard.sh
run_plain "$PRE_HOOKS/post-commit"; RC=$?
expect "earlier post-commit passes a missing guard library in silence" 0 "$RC" absent "gate:"
restore_input

# A repository that does not ship the toolchain: every current hook must exit 0 and
# print nothing the earlier hook did not. The earlier hooks may block there, which is
# the defect the rule removed, so only new output or a new block counts against it.
FOREIGN="$WORK/foreign"
git init -q "$FOREIGN"
git -C "$FOREIGN" config core.hooksPath /dev/null
git -C "$FOREIGN" config user.email drill@example.com
git -C "$FOREIGN" config user.name drill
echo seed > "$FOREIGN/seed.txt"; git -C "$FOREIGN" add seed.txt; git -C "$FOREIGN" commit -qm seed
FOREIGN_SHA="$(git -C "$FOREIGN" rev-parse HEAD)"

compare_foreign() { # compare_foreign <label> <current-file> <earlier-file> <mode> [stdin line]
  local label="$1" cur="$2" pre="$3" mode="$4" line="${5:-}" rc_cur rc_pre
  printf 'feat(foreign): a message\n' > "$WORK/fmsg.txt"
  local which file rc new_lines
  for which in cur pre; do
    file="$cur"; [[ "$which" == "pre" ]] && file="$pre"
    case "$mode" in
      plain) ( cd "$FOREIGN" && bash "$file" ) >"$WORK/foreign-$which.log" 2>&1 ;;
      push) printf '%s\n' "$line" | ( cd "$FOREIGN" && bash "$file" ) >"$WORK/foreign-$which.log" 2>&1 ;;
      message) ( cd "$FOREIGN" && bash "$file" "$WORK/fmsg.txt" message ) >"$WORK/foreign-$which.log" 2>&1 ;;
    esac
    rc=$?
    if [[ "$which" == "cur" ]]; then rc_cur=$rc; else rc_pre=$rc; fi
  done
  cp "$WORK/foreign-cur.log" "$WORK/out.log"
  new_lines="$(grep -vxF -f "$WORK/foreign-pre.log" "$WORK/foreign-cur.log" || true)"
  if [[ "$rc_cur" == "0" && -z "$new_lines" ]]; then
    pass "$label"
  else
    fail "$label (exit $rc_cur, earlier $rc_pre; new output: ${new_lines:0:120})"
  fi
}
compare_foreign "pre-push adds nothing for another repository" "$H/pre-push" "$PRE_HOOKS/pre-push" push "refs/heads/main $FOREIGN_SHA refs/heads/main $FOREIGN_SHA"
mkdir -p "$FOREIGN/.opencode/agents" "$FOREIGN/.opencode/skills/demo" "$FOREIGN/specs/demo/001-demo"
echo agent > "$FOREIGN/.opencode/agents/a.md"; echo skill > "$FOREIGN/.opencode/skills/demo/SKILL.md"
echo "# spec" > "$FOREIGN/specs/demo/001-demo/spec.md"; echo '{}' > "$FOREIGN/specs/demo/001-demo/graph-metadata.json"
git -C "$FOREIGN" add -A
compare_foreign "pre-commit adds nothing for another repository" "$H/pre-commit" "$PRE_HOOKS/pre-commit" plain
compare_foreign "prepare-commit-msg adds nothing for another repository" "$H/prepare-commit-msg" "$PRE_HOOKS/prepare-commit-msg" message
compare_foreign "post-commit adds nothing for another repository" "$H/post-commit" "$PRE_HOOKS/post-commit" plain
compare_foreign "the SessionStart check adds nothing for another repository" "$CLONE/.opencode/bin/check-git-hooks.sh" "$PRE_HOOKS/check-git-hooks.sh" plain
compare_foreign "the legacy helper adds nothing for another repository" "$CLONE/.opencode/hooks/git/pre-commit" "$PRE_HOOKS/legacy-pre-commit" plain

echo ""
echo "broken-move drill: $PASS passed, $FAIL failed"
if [[ "$FAIL" -eq 0 ]]; then
  echo "RESULT: PASSED"
  exit 0
fi
echo "RESULT: FAILED"
exit 1

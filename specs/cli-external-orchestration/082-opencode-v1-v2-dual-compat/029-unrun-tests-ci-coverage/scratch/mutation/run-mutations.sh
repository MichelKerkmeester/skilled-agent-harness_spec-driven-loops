#!/usr/bin/env bash
# Breaks each newly wired suite once and runs the exact command its CI job runs,
# so a nonzero exit shows the job would fail. Every mutated file is restored from
# git before the next case. Run from the worktree root on Node 22.
set -uo pipefail
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
OUT="$(dirname "${BASH_SOURCE[0]}")"
BASE=7d55952975

restore() { git checkout -- "$@"; }

# sk-doc: a failing test appended to each newly listed node test. The new runner
# must exit 1 and name both; the runner at the base commit must exit 0, because
# neither name is in its lists.
{
  echo "# sk-doc node tests, node $(node -v)"
  T=.skilled/skills/sk-doc/scripts/tests
  printf "\ntest('mutant: forced failure', () => { throw new Error('mutant'); });\n" >> "$T/test-cite-drift-scan.mjs"
  printf "\ntest('mutant: forced failure', () => { throw new Error('mutant'); });\n" >> "$T/install-guide-contract.test.cjs"
  echo '$ ONLY_TESTS="test-cite-drift-scan.mjs install-guide-contract.test.cjs" bash run-script-tests.sh   (new runner)'
  ONLY_TESTS="test-cite-drift-scan.mjs install-guide-contract.test.cjs" bash "$T/run-script-tests.sh" 2>&1 | grep -E '^(PASS|FAIL|SKIP)|failing|passed'
  echo "exit ${PIPESTATUS[0]}"
  git show "$BASE:$T/run-script-tests.sh" > "$T/run-script-tests.base.sh"
  echo '$ ONLY_TESTS="test-cite-drift-scan.mjs install-guide-contract.test.cjs" bash run-script-tests.base.sh   (runner at base)'
  ONLY_TESTS="test-cite-drift-scan.mjs install-guide-contract.test.cjs" bash "$T/run-script-tests.base.sh" 2>&1 | grep -E '^(PASS|FAIL|SKIP)|failing|passed'
  echo "exit ${PIPESTATUS[0]}"
  rm -f "$T/run-script-tests.base.sh"
  restore "$T/test-cite-drift-scan.mjs" "$T/install-guide-contract.test.cjs"
  echo '$ same two files, unmutated, new runner'
  ONLY_TESTS="test-cite-drift-scan.mjs install-guide-contract.test.cjs" bash "$T/run-script-tests.sh" 2>&1 | grep -E '^(PASS|FAIL|SKIP)|failing|passed'
  echo "exit ${PIPESTATUS[0]}"
} > "$OUT/skdoc-node-tests.txt" 2>&1

# sk-git: provisioning picks npm for a bun package. The suite the new job runs
# must fail.
{
  echo "# sk-git worktree-naming suite, node $(node -v)"
  S=.skilled/skills/sk-git/scripts/worktree-naming.sh
  sed -i.bak 's/tool=bun; deps_root=/tool=npm; deps_root=/' "$S" && rm -f "$S.bak"
  echo "mutant: $(git diff --stat -- "$S" | tail -1)"
  echo '$ bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh'
  bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh > "$OUT/.wn.log" 2>&1
  rc=$?
  grep -E '^FAIL|tests: PASS=' "$OUT/.wn.log" | tail -8
  echo "exit $rc"
  rm -f "$OUT/.wn.log"
  restore "$S"
} > "$OUT/sk-git-naming.txt" 2>&1

# .pi: a failing test appended to one test file per extension. Each leg's
# `npm test` must exit nonzero.
{
  echo "# .pi extension suites, node $(node -v)"
  C=.pi/extensions/pi-cache-optimizer/tests/cache-economics.test.ts
  F=.pi/extensions/pi-fast-mode-w-subagent-support/tests/config.test.ts
  printf "\ntest('mutant: forced failure', () => { throw new Error('mutant'); });\n" >> "$C"
  printf "\nit('mutant: forced failure', () => { throw new Error('mutant'); });\n" >> "$F"
  for ext in pi-cache-optimizer pi-fast-mode-w-subagent-support; do
    echo "\$ (cd .pi/extensions/$ext && npm test)"
    ( cd ".pi/extensions/$ext" && npm test > "$ROOT/$OUT/.pi.log" 2>&1 )
    rc=$?
    grep -E '^# (pass|fail)|Tests +[0-9]|mutant' "$OUT/.pi.log" | head -6
    echo "exit $rc"
  done
  rm -f "$OUT/.pi.log"
  restore "$C" "$F"
} > "$OUT/pi-extensions.txt" 2>&1

git status --short -- .skilled/skills/sk-doc .skilled/skills/sk-git .pi

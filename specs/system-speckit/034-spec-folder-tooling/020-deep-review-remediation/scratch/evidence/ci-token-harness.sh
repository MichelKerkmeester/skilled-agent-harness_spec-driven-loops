#!/usr/bin/env bash
# Runs the workflow's extracted install, regenerate and commit steps in the scratch copy for one scenario.
# N: committed index is current. C: the post-commit --check fails. P: origin moves after the commit, so the push is rejected and retried.
set -uo pipefail
unset GIT_CONFIG_COUNT GIT_CONFIG_KEY_0 GIT_CONFIG_VALUE_0 GIT_CONFIG_KEY_1 GIT_CONFIG_VALUE_1
SCR="$1"; SCEN="$2"; WT="$3"
H="$SCR/harness"; COPY="$SCR/copy"; ORIG="$H/origin.git"; RUN="$H/run-$SCEN"
. "$H/shas.env"
GEN=.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs
DUMMY_TOKEN="harness-dummy-token-not-a-secret"
DUMMY_B64="$(printf 'x-access-token:%s' "$DUMMY_TOKEN" | base64 | tr -d '\n')"
FILES=(.skilled/skills/system-spec-kit/runtime/data/trigger-index.json .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json)
rm -rf "$RUN"; mkdir -p "$RUN/blocks" "$RUN/hooks"
node "$SCR/extract.cjs" "$WT/.skilled/skills/system-spec-kit/node_modules/js-yaml" "$WT/.github/workflows/trigger-index-rebuild.yml" "$RUN/blocks" > "$RUN/extract.log" 2>&1 || { echo "extract failed"; exit 1; }
case "$SCEN" in
  N) BASE="$F"; MODE="" ;;
  C) BASE="$S"; MODE="checkfail" ;;
  P) BASE="$S"; MODE="race" ;;
  *) echo "bad scenario"; exit 2 ;;
esac
cd "$COPY" || exit 1
git reset -q --hard "$BASE" || { echo "reset failed"; exit 1; }
git update-ref refs/remotes/origin/main "$BASE"
git -C "$ORIG" update-ref refs/heads/main "$BASE"
git config core.hooksPath "$RUN/hooks"
git config branch.main.remote origin
git config branch.main.merge refs/heads/main
for name in pre-commit commit-msg reference-transaction pre-push; do
  printf '#!/bin/sh\nh=unset; [ -n "${GIT_CONFIG_VALUE_0-}" ] && h=set\nt=unset; [ -n "${PUSH_TOKEN-}" ] && t=set\necho "%s header=$h token=$t" >> "%s"\n' "$name" "$RUN/hook.log" > "$RUN/hooks/$name"
  chmod +x "$RUN/hooks/$name"
done
# The generator is a wrapper that records the environment of each call and can stage a race or a failed check.
# The real generator stays beside it so its relative imports still resolve.
cp "$COPY/$GEN" "$COPY/${GEN%.mjs}.real.mjs"
cat > "$COPY/$GEN" <<'JS'
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const env = process.env;
const args = process.argv.slice(2);
const here = path.dirname(fileURLToPath(import.meta.url));
if (env.GEN_LOG) {
  const token = env.PUSH_TOKEN === undefined ? 'unset' : 'set';
  const header = env.GIT_CONFIG_VALUE_0 === undefined ? 'unset' : 'set';
  fs.appendFileSync(env.GEN_LOG, `generator args=[${args.join(' ')}] PUSH_TOKEN=${token} GIT_CONFIG_VALUE_0=${header}\n`);
}
if (args.includes('--check') && env.STUB_MODE === 'race' && env.RACE_FLAG && fs.existsSync(env.RACE_FLAG)) {
  fs.rmSync(env.RACE_FLAG);
  const script = 'set -e; G="git -c core.hooksPath=/dev/null -c commit.gpgsign=false"; cd "$RACER"; $G pull -q origin main; echo race > race.txt; git add race.txt; $G -c user.name=racer -c user.email=racer@example.invalid commit -q -m "race: corpus moved"; $G push -q origin main';
  const race = spawnSync('bash', ['-c', script], { env, encoding: 'utf8' });
  fs.appendFileSync(env.GEN_LOG, `race-push exit=${race.status}\n`);
  if (race.status !== 0) process.exit(3);
}
if (args.includes('--check') && env.STUB_MODE === 'checkfail') {
  console.log('trigger index is STALE (harness stub)');
  process.exit(1);
}
const child = spawnSync(process.execPath, [path.join(here, 'generate-trigger-index.real.mjs'), ...args], { stdio: 'inherit', env });
process.exit(child.status ?? 1);
JS
rm -f "$RUN/race-flag"; [ "$MODE" = race ] && : > "$RUN/race-flag"
if [ "$SCEN" = P ]; then git clone -q "$ORIG" "$RUN/racer" || { echo "racer clone failed"; exit 1; }; fi
run_step() {
  local name="$1" file="$2" withtoken="$3" tok="" rc
  [ "$withtoken" = yes ] && tok="PUSH_TOKEN=$DUMMY_TOKEN"
  ( cd "$COPY" && env -i HOME="$HOME" PATH="$PATH" TMPDIR="${TMPDIR:-/tmp/}" LANG=C.UTF-8 CI=true GITHUB_ACTIONS=true \
      GITHUB_SERVER_URL=https://github.com GITHUB_REF_NAME=main GEN_LOG="$RUN/gen.log" STUB_MODE="$MODE" \
      RACE_FLAG="$RUN/race-flag" RACER="$RUN/racer" $tok \
      bash --noprofile --norc -eo pipefail "$file" ) > "$RUN/$name.log" 2>&1
  rc=$?
  echo "$name exit=$rc"
  return $rc
}
PASS=0; FAIL=0
check() { if [ "$1" = "0" ]; then PASS=$((PASS+1)); echo "PASS $SCEN $2"; else FAIL=$((FAIL+1)); echo "FAIL $SCEN $2 ($3)"; fi; }
rm -f "$COPY/.skilled/skills/system-spec-kit/.node-version-marker"; run_step install "$RUN/blocks/01-2.sh" no; check $? "install exits 0" "rc=$?"
check "$([ -e "$COPY/.skilled/skills/system-spec-kit/.node-version-marker" ] && echo 1 || echo 0)" "root postinstall did not run (no marker)" "marker present"
run_step regen "$RUN/blocks/02-3.sh" no; check $? "regenerate exits 0" "rc"
run_step commit "$RUN/blocks/03-4.sh" yes; COMMIT_RC=$?
case "$SCEN" in
  N) check "$COMMIT_RC" "commit step exits 0" "rc=$COMMIT_RC"
     grep -q "Trigger index is current; nothing to commit." "$RUN/commit.log"; check $? "reports nothing to commit" "no message"
     check "$([ "$(git -C "$ORIG" rev-parse main)" = "$F" ] && echo 0 || echo 1)" "origin main unchanged" "moved" ;;
  C) check $([ "$COMMIT_RC" = 1 ] && echo 0 || echo 1) "commit step exits 1 on failing check" "rc=$COMMIT_RC"
     grep -q "not pushing the rebuild" "$RUN/commit.log"; check $? "reports the failed check" "no message"
     check "$([ "$(git -C "$ORIG" rev-parse main)" = "$S" ] && echo 0 || echo 1)" "origin main unchanged" "moved" ;;
  P) check "$COMMIT_RC" "commit step exits 0 after retry" "rc=$COMMIT_RC"
     grep -q "Push rejected as non-fast-forward" "$RUN/commit.log"; check $? "first push was rejected and the retry ran" "no rejection"
     TOP="$(git -C "$ORIG" log -1 --format=%s main)"; [ "$TOP" = "chore(system-spec-kit): rebuild the trigger index" ]; check $? "origin top commit is the rebuild" "subject=$TOP"
     SECOND="$(git -C "$ORIG" log -1 --format=%s main~1)"; [ "$SECOND" = "race: corpus moved" ]; check $? "race commit sits under the rebuild" "subject=$SECOND"
     [ "$(git -C "$ORIG" rev-parse main~2)" = "$S" ]; check $? "rebuild rests on the stale base after the race commit" "parent mismatch"
     git -C "$ORIG" log -1 --format=%B main | sed -e '/^$/d' | tail -n 1 | grep -qx "Trigger-Index-Rebuild: ci"; check $? "rebuild commit keeps the loop-guard trailer as its last line" "trailer missing"
     MISS=0; for f in "${FILES[@]}"; do git -C "$ORIG" show "main:$f" | cmp -s - "$SCR/run-normal/out/$(basename "$f")" || MISS=$((MISS+1)); done
     check "$MISS" "origin's four generated files equal a normal generation" "$MISS differ"
     ;;
esac
# Token and header hygiene, for every step's output and for the repository configuration.
LEAK="$(grep -l -e "$DUMMY_TOKEN" -e "$DUMMY_B64" "$RUN"/install.log "$RUN"/regen.log "$RUN"/commit.log 2>/dev/null | wc -l | tr -d ' ')"
check "$LEAK" "token and header absent from every step log" "$LEAK logs contain it"
CFG="$(git -C "$COPY" config --local --list | grep -c -e "$DUMMY_TOKEN" -e "$DUMMY_B64")"
check "$CFG" "token and header absent from repository git config" "$CFG entries"
GENBAD="$(grep -c '^generator' "$RUN/gen.log" 2>/dev/null)"; GENTOK="$(grep '^generator' "$RUN/gen.log" 2>/dev/null | grep -E -c 'PUSH_TOKEN=set|GIT_CONFIG_VALUE_0=set')"
check "$GENTOK" "no generator call saw the token or the header (calls logged: ${GENBAD:-0})" "$GENTOK calls saw it"
HSET="$(grep -c 'header=set' "$RUN/hook.log" 2>/dev/null)"; HSET="${HSET:-0}"
check "$HSET" "no hook ran with the header during a network command" "$HSET hook lines with header"
TOKHOOK="$(grep -c 'token=set' "$RUN/hook.log" 2>/dev/null)"; TOKHOOK="${TOKHOOK:-0}"
check "$TOKHOOK" "no hook saw PUSH_TOKEN in its environment" "$TOKHOOK hook lines"
PREPUSH="$(grep -c '^pre-push' "$RUN/hook.log" 2>/dev/null)"; PREPUSH="${PREPUSH:-0}"
check "$PREPUSH" "pre-push hook never ran" "$PREPUSH runs"
if [ "$SCEN" = P ]; then
  COMMITHOOK="$(grep -c '^pre-commit header=unset token=unset' "$RUN/hook.log" 2>/dev/null)"; COMMITHOOK="${COMMITHOOK:-0}"
  [ "$COMMITHOOK" -gt 0 ]; check $? "planted pre-commit hook ran on the commit with no header and no token (control: hooks are live)" "count=$COMMITHOOK"
fi
echo "SUMMARY $SCEN pass=$PASS fail=$FAIL"

#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Source-Root Layout Rehearsal
# ───────────────────────────────────────────────────────────────
# Clones a checkout once per source-root layout and runs the checks that read the
# whole tree, which a unit fixture cannot prove:
#   today         the tree is a real .opencode/ beside the .skilled/ placeholder
#   skilled-only  the tree is a real .skilled/ and no .opencode path exists
#   whole-link    the tree is a real .skilled/ and .opencode links to it
#
# Each clone loses its .git pointer file before anything runs in it, because that
# file names the source checkout's git directory and any git command in the clone
# would act on the source checkout. Clones live in a temporary directory and are
# deleted on exit. Results print as a markdown table on stdout.
#
# Usage: bash layout-rehearsal.sh <checkout>
# Exit:  0 every expectation held, 1 an expectation failed, 2 usage error

set -uo pipefail

CHECKOUT="${1:-}"
if [[ -z "$CHECKOUT" || ! -d "$CHECKOUT/.opencode" ]]; then
  echo "usage: bash layout-rehearsal.sh <checkout holding a real .opencode tree>" >&2
  exit 2
fi
CHECKOUT="$(cd "$CHECKOUT" && pwd -P)"
COMMIT="$(git -C "$CHECKOUT" rev-parse HEAD 2>/dev/null || echo unknown)"
WORK="$(mktemp -d "${TMPDIR:-/tmp}/layout-rehearsal.XXXXXX")"
WORK="$(cd "$WORK" && pwd -P)"
trap 'rm -rf "$WORK"' EXIT

FAILURES=0
CLONE=""
# Absolute clone paths are long and differ per run, so rows name the clone as <clone>.
short() { local text="$1"; [[ -n "$CLONE" ]] && text="${text//$CLONE/<clone>}"; printf '%s' "$text"; }
row() { # row <layout> <check> <expected> <observed> <verdict>
  printf '| %s | %s | %s | %s | %s |\n' "$1" "$2" "$(short "$3")" "$(short "$4")" "$5"
  [[ "$5" == PASS || "$5" == RECORDED ]] || FAILURES=$((FAILURES + 1))
}
verdict() { [[ "$1" == "$2" ]] && echo PASS || echo FAIL; }

# Git reads the clone with no user or system configuration, so a machine-wide ignore
# rule cannot change what the checkout's own ignore file decides.
isolated_git() {
  HOME="$WORK/home" XDG_CONFIG_HOME="$WORK/home/.config" GIT_CONFIG_GLOBAL=/dev/null \
    GIT_CONFIG_NOSYSTEM=1 git "$@"
}
mkdir -p "$WORK/home"

cat > "$WORK/stub-server.js" <<'STUB'
let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buffer += chunk;
  let newline = buffer.indexOf('\n');
  while (newline !== -1) {
    const line = buffer.slice(0, newline);
    buffer = buffer.slice(newline + 1);
    newline = buffer.indexOf('\n');
    if (!line.trim()) continue;
    const message = JSON.parse(line);
    if (message.method === 'initialize') {
      const result = { protocolVersion: '2024-11-05', capabilities: {}, serverInfo: { name: 'rehearsal-stub', version: '1' } };
      process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id: message.id, result })}\n`);
    }
  }
});
process.stdin.on('end', () => process.exit(0));
STUB

cat > "$WORK/probe-registrations.cjs" <<'PROBE'
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = process.argv[2];
const tomlDirectory = ['.skilled', '.opencode']
  .map((name) => path.join(root, name, 'node_modules', 'toml'))
  .find((candidate) => fs.existsSync(candidate));
const toml = require(tomlDirectory);
const fromJson = (text) => {
  const server = JSON.parse(text).mcpServers.code_mode;
  return { command: server.command, args: server.args, env: server.env || {} };
};
const registrations = [
  ['opencode.json', (text) => {
    const server = JSON.parse(text).mcp.code_mode;
    return { command: server.command[0], args: server.command.slice(1), env: server.environment || {} };
  }],
  ['.claude/mcp.json', fromJson],
  ['.codex/config.toml', (text) => {
    const server = toml.parse(text).mcp_servers.code_mode;
    return { command: server.command, args: server.args, env: server.env || {} };
  }],
  ['.cursor/mcp.json', fromJson],
  ['.devin/mcp_config.json', fromJson],
  ['.pi/mcp.json', fromJson],
];
const request = `${JSON.stringify({
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'layout-rehearsal', version: '1' } },
})}\n`;

for (const [file, parse] of registrations) {
  const registration = parse(fs.readFileSync(path.join(root, file), 'utf8'));
  const command = registration.command === 'node' ? process.execPath : registration.command;
  const result = spawnSync(command, registration.args, {
    cwd: root,
    env: { ...process.env, ...registration.env },
    input: request,
    encoding: 'utf8',
    timeout: 30_000,
  });
  const answered = /"id":1\b/.test(result.stdout || '') && /"result"/.test(result.stdout || '');
  const missing = (result.stderr || '').match(/Cannot find module '[^']*'/);
  const detail = answered ? 'initialize answered' : (missing ? missing[0] : `exit ${result.status}`);
  process.stdout.write(`${file}\t${answered ? 'answered' : 'no-answer'}\t${detail}\n`);
}
PROBE

printf '# Layout rehearsal results\n\n'
printf 'Checkout commit: `%s`. Clones: APFS copy-on-write where available, each with its `.git` pointer removed first.\n\n' "$COMMIT"
printf '| Layout | Check | Expected | Observed | Verdict |\n|--------|-------|----------|----------|---------|\n'

TODAY_IGNORED=""
for layout in today skilled-only whole-link; do
  clone="$WORK/$layout"
  CLONE="$clone"
  if ! cp -Rc "$CHECKOUT" "$clone" 2>/dev/null; then
    rm -rf "$clone"
    cp -R "$CHECKOUT" "$clone"
  fi
  rm -f "$clone/.git"
  row "$layout" "clone has no .git pointer" "absent" "$([[ -e "$clone/.git" ]] && echo present || echo absent)" \
    "$([[ -e "$clone/.git" ]] && echo FAIL || echo PASS)"

  case "$layout" in
    today) src=".opencode" ;;
    skilled-only|whole-link)
      rm -rf "$clone/.skilled"
      mv "$clone/.opencode" "$clone/.skilled"
      src=".skilled"
      [[ "$layout" == whole-link ]] && ln -s .skilled "$clone/.opencode"
      ;;
  esac
  entries="$src"
  [[ "$layout" == whole-link ]] && entries=".opencode .skilled"

  # Ignored entries. A rule that names only one root would let the other root's
  # build output and state show up as untracked after the move.
  isolated_git -C "$clone" init -q
  isolated_git -C "$clone" ls-files -o -i --exclude-standard --directory \
    | sed -e 's#^\.opencode/#<source-root>/#' -e 's#^\.skilled/#<source-root>/#' | sort > "$WORK/ignored-$layout.txt"
  ignored="$(wc -l < "$WORK/ignored-$layout.txt" | tr -d ' ')"
  if [[ "$layout" == today ]]; then
    TODAY_IGNORED="$ignored"
    row "$layout" "ignored entries (git ls-files -o -i --directory)" "the count the other layouts must keep" "$ignored" RECORDED
  else
    changed="$(diff "$WORK/ignored-today.txt" "$WORK/ignored-$layout.txt" | grep -E '^[<>]' | tr '\n' ' ' | cut -c1-300)"
    row "$layout" "ignored entries (git ls-files -o -i --directory)" "$TODAY_IGNORED, the same entries as today" "$ignored${changed:+, differs: $changed}" \
      "$([[ "$ignored" == "$TODAY_IGNORED" && -z "$changed" ]] && echo PASS || echo FAIL)"
  fi
  rm -rf "$clone/.git"

  for entry in $entries; do
    drift="$(cd "$clone" && node "$entry/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs" 2>&1 | tail -1)"
    row "$layout" "drift checker through $entry" "[CONTRACT DRIFT] OK commands=3" "$drift" "$(verdict "$drift" '[CONTRACT DRIFT] OK commands=3')"

    printf "require('../../specs/seeded/target.cjs');\n" > "$clone/$src/bin/seeded-spec-import.cjs"
    guard_out="$(cd "$clone" && node "$entry/bin/check-no-spec-imports.cjs" 2>&1)"; guard_rc=$?
    seeded="$(printf '%s' "$guard_out" | grep -c 'seeded-spec-import.cjs')"
    row "$layout" "guard default scan through $entry beside a seeded import" "exit 1 naming the import" "exit $guard_rc, named $seeded time(s)" \
      "$([[ $guard_rc -eq 1 && $seeded -ge 1 ]] && echo PASS || echo FAIL)"
    rm -f "$clone/$src/bin/seeded-spec-import.cjs"
    clean_out="$(cd "$clone" && node "$entry/bin/check-no-spec-imports.cjs" 2>&1)"; clean_rc=$?
    row "$layout" "guard default scan through $entry, clean" "exit 0 over more than zero files" "exit $clean_rc: $clean_out" \
      "$([[ $clean_rc -eq 0 && "$clean_out" != *" 0 runtime file"* ]] && echo PASS || echo FAIL)"
  done

  expected_root="$clone"
  for entry in $entries; do
    repo_root="$(node --input-type=module -e "const m = await import('$clone/$entry/skills/system-spec-kit/shared/workspace/repo-root.mjs'); process.stdout.write(m.findRepoRoot('$clone/$entry/skills/system-spec-kit/runtime/cli'));" 2>&1)"
    row "$layout" "findRepoRoot from $entry/skills/system-spec-kit/runtime/cli" "$expected_root" "$repo_root" "$(verdict "$repo_root" "$expected_root")"
    capped_root="$(node --input-type=module -e "const m = await import('$clone/$entry/skills/system-spec-kit/shared/workspace/repo-root.mjs'); process.stdout.write(m.findRepoRoot('$clone/$entry/skills/system-spec-kit/runtime/cli', { maxDepth: 2 }));" 2>&1)"
    row "$layout" "findRepoRoot through $entry, capped at 2 levels" "$expected_root" "$capped_root" "$(verdict "$capped_root" "$expected_root")"
    identity_root="$(node --input-type=module -e "const m = await import('$clone/$entry/skills/system-spec-kit/runtime/cli/dist/utils/workspace-identity.js'); process.stdout.write(m.buildWorkspaceIdentity('$clone/$entry/skills').workspaceRoot);" 2>&1)"
    row "$layout" "workspace identity from $entry/skills (built module)" "$expected_root" "$identity_root" "$(verdict "$identity_root" "$expected_root")"
    advisor_root="$(node --input-type=module -e "const m = await import('$clone/$entry/skills/system-skill-advisor/runtime/dist/runtime/lib/utils/workspace-root.js'); process.stdout.write(m.findAdvisorWorkspaceRoot('$clone/$entry/skills/system-skill-advisor/runtime'));" 2>&1)"
    row "$layout" "advisor workspace root through $entry (built module)" "$expected_root" "$advisor_root" "$(verdict "$advisor_root" "$expected_root")"
  done

  server="$clone/$src/skills/mcp-code-mode/mcp-server"
  mkdir -p "$server/dist"
  printf '{"name":"rehearsal-stub-server","private":true,"engines":{"node":"%s"}}\n' "$(node -p 'process.versions.node.split(".")[0]')" > "$server/package.json"
  cp "$WORK/stub-server.js" "$server/dist/index.js"
  while IFS=$'\t' read -r file outcome detail; do
    [[ -n "$file" ]] || continue
    if [[ "$layout" == skilled-only ]]; then
      row "$layout" "registration $file" "recorded against the single-link shape" "$outcome: $detail" RECORDED
    else
      row "$layout" "registration $file" "answered" "$outcome: $detail" "$(verdict "$outcome" answered)"
    fi
  done < <(node "$WORK/probe-registrations.cjs" "$clone" 2>&1)

  if [[ "$layout" == skilled-only ]]; then
    row "$layout" "no .opencode path after the checks" "absent" "$([[ -e "$clone/.opencode" || -L "$clone/.opencode" ]] && echo present || echo absent)" \
      "$([[ -e "$clone/.opencode" || -L "$clone/.opencode" ]] && echo FAIL || echo PASS)"
  fi
  rm -rf "$clone"
done

printf '\nFailures: %s\n' "$FAILURES"
[[ "$FAILURES" -eq 0 ]]

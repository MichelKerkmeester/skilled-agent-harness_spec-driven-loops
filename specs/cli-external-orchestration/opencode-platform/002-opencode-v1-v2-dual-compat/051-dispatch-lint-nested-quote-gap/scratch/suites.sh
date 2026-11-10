#!/usr/bin/env bash
# Runs every suite this phase reports, from the worktree root, into scratch/suites/<label>/.
set -uo pipefail
label="${1:?label}"
root="$(git rev-parse --show-toplevel)"
out="$root/specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/051-dispatch-lint-nested-quote-gap/scratch/suites/$label"
mkdir -p "$out"
export PATH="/Users/michelkerkmeester/.nvm/versions/node/v26.8.2/bin:$HOME/.bun/bin:$PATH"
cd "$root"
hook_node=()
while IFS= read -r f; do hook_node+=("$f"); done < <(find .skilled/hooks -name '*.test.mjs' -o -name '*.test.cjs' -o -name '*.test.js' | grep -v node_modules | while read -r f; do grep -Eq "(from\s+|require\()['\"]vitest['\"]" "$f" || echo "$f"; done | sort)
perl -e 'alarm 900; exec @ARGV' node --test --test-reporter=tap "${hook_node[@]}" > "$out/hooks-node.tap" 2>&1
perl -e 'alarm 900; exec @ARGV' .skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts > "$out/hooks-vitest.txt" 2>&1
perl -e 'alarm 900; exec @ARGV' node --test --test-reporter=tap .opencode/plugins/tests/*.test.cjs > "$out/plugins.tap" 2>&1
perl -e 'alarm 600; exec @ARGV' node --test --test-reporter=tap .skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs > "$out/battery-unit.tap" 2>&1
perl -e 'alarm 600; exec @ARGV' node --test --test-reporter=tap .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs > "$out/rule-checks.tap" 2>&1
perl -e 'alarm 600; exec @ARGV' .skilled/node_modules/.bin/vitest run .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs --exclude "**/review/containment/**" > "$out/audit-vitest.txt" 2>&1
for f in hooks-node plugins battery-unit rule-checks; do grep -E '^# (tests|pass|fail) ' "$out/$f.tap" | sed "s/^/$label $f /"; done
for f in hooks-vitest audit-vitest; do grep -E '^\s+Tests ' "$out/$f.txt" | sed "s/^/$label $f /"; done

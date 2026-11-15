#!/usr/bin/env bash
# Rename gate: every suite that reads a file the rename touches. Run from the worktree root.
set -u
U=$(env | grep -o '^SKILLED_LOOP_[A-Z_]*' | sed 's/^/-u /' | tr '\n' ' ')
H=.skilled/hooks/${HOOKDIR:-session-relaunch}
r() { printf '%-22s ' "$1"; }
r relaunch; env -u AI_SESSION_CHILD $U node --test $H/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs 2>&1 | grep -E "^ℹ (pass|fail)" | tr '\n' ' '; echo
r flags; node --test .skilled/hooks/shared/hook-flags.test.cjs 2>&1 | grep -E "^ℹ (pass|fail)" | tr '\n' ' '; echo
r pi; (cd .skilled/hooks && npx vitest run --config vitest.config.ts ${HOOKDIR:-session-relaunch}/pi/ goal/pi/ 2>&1 | grep -E "Tests " ); 
r tsc; node .skilled/skills/system-spec-kit/node_modules/typescript/bin/tsc -p tsconfig.pi.json >/dev/null 2>&1; echo "exit=$?"
r goal; node --test $(find .skilled/hooks/goal -name '*.test.*' -not -path '*/node_modules/*' | grep -v '\.ts$') 2>&1 | grep -E "^ℹ (pass|fail)" | tr '\n' ' '; echo
r vibe; node --test .skilled/hooks/decision-capture/vibe/*.test.mjs .skilled/hooks/goal/vibe/*.test.mjs .skilled/hooks/session-lifecycle/vibe/*.test.mjs .vibe/plugins/repo-guards/tests/*.test.mjs 2>&1 | grep -E "^ℹ (pass|fail)" | tr '\n' ' '; echo
r doctor-orphan; node --test .skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs 2>&1 | grep -E "^ℹ (pass|fail)" | tr '\n' ' '; echo
r spec-gate-core; node --test .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs 2>&1 | grep -E "^ℹ (pass|fail)" | tr '\n' ' '; echo
r sk-doc-fm; node --test .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs 2>&1 | grep -E "^ℹ (pass|fail)" | tr '\n' ' '; echo
r writer; (cd .skilled/skills/system-spec-kit && npx vitest run runtime/cli/tests/generate-context runtime/cli/tests/save- 2>&1 | grep -E "Tests ")
r advisor-py; python3 -m pytest -q .skilled/skills/system-skill-advisor/runtime/scripts 2>&1 | tail -1
r hook-sync; node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check 2>&1 | tail -1
r mirror-sync; node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check 2>&1 | tail -1
r drift; bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh 2>&1 | tail -1
find . -maxdepth 3 -name relative-repo -type d -not -path './node_modules/*' -exec rm -rf {} + 2>/dev/null

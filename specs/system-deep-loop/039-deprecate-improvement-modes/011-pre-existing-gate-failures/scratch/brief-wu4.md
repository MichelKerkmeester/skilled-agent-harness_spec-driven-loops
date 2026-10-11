ROLE: You fix one fail-open defect in .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs. Work only in this git worktree. Do not commit.

FACT: the linter is built to fail open. main() catches runtime errors, prints "WARNING [gate:template-phrase-lint]: ... checks skipped" and returns 0. But it statically imports ./template-phrase-census.mjs, which does require('js-yaml') at module load. In a clone without node_modules, that import throws before main() runs, node exits 1, and .skilled/scripts/git-hooks/pre-commit (lines 146-158) reports "BLOCKED [gate:template-phrase-lint]: staged trigger phrases contain a template or editor fallback" on every commit, even though no phrase was judged.

TASK: load template-phrase-census.mjs lazily inside main's existing try/catch (dynamic import, so main becomes async and the entry line awaits it), so a missing dependency takes the same WARNING + exit 0 path as other runtime errors. Keep behavior identical when the dependency is present: findings still exit 1. Do not change the pre-commit hook.

TEST: add one vitest file under .skilled/skills/system-spec-kit/runtime/tests/ that proves the fix. It copies template-phrase-lint.mjs, template-phrase-census.mjs and the retrieval/lib files they import into a temp directory that has no node_modules, keeping their relative layout, runs the copied linter with node inside a temp git repo, and asserts exit 0 plus the WARNING line. Run it once against the unfixed file first and confirm it fails there.

ALLOWED WRITES: template-phrase-lint.mjs and the one new test file.

VERIFY:
1. cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/<your-new-file>   (exit 0)
2. In the worktree, stage nothing new, then: node .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs; echo "exit=$?"   (exit 0, deps present path)
3. bash .skilled/scripts/git-hooks/tests/*.sh or the repo's git-hook test runner if one exists; report what you ran and its exit.

HANDBACK: the diff summary, the test's fail-before and pass-after output lines, and each VERIFY exit code.

# Plan: Full Spec-Kit Advisor Import Decoupling

## Approach

Separate advisor ownership from spec-kit by moving source-owning surfaces into `system-skill-advisor` and leaving only process-boundary or local utility surfaces in `system-spec-kit`.

## Phases

1. Audit imports.
   - Run the required `from.*system-skill-advisor` grep.
   - Run a broader `skill_advisor` import grep to catch legacy source imports.

2. Move hooks.
   - Move Claude, Codex, and Gemini advisor prompt hook implementations into advisor.
   - Add advisor hook build coverage through advisor `tsconfig.build.json`.
   - Keep spec-kit hook paths as process stubs for runtime compatibility.

3. Move tests and stress coverage.
   - Move skill-graph handler tests and advisor rebuild tests to advisor.
   - Move hook tests to advisor.
   - Move advisor stress tests to advisor and add advisor stress config.
   - Leave spec-kit plugin gateway tests in spec-kit.

4. Remove residual imports.
   - Drop advisor schema imports from spec-kit tool schemas.
   - Delete or localize neutral utility seams.
   - Replace type-only advisor imports in remaining spec-kit tests with local structural types.

5. Verify.
   - Run exact and broad import audits.
   - Run typechecks and builds for both packages.
   - Run advisor moved tests and stress smoke.
   - Run hook smoke from advisor compiled hook.
   - Run full package suites; block commit/push if unrelated failures remain.

## Verification Matrix

| Check | Command | Result |
|-------|---------|--------|
| Exact import audit | `rg -n 'from.*system-skill-advisor' .opencode/skills/system-spec-kit/mcp_server --glob '!**/node_modules/**' --glob '!**/dist/**' --glob '!**/INSTALL_GUIDE.md'` | Pass, zero lines |
| Broad source import audit | `rg -n "from ['\\\"].*(skill_advisor\\|system-skill-advisor)..."` | Pass, only plugin gateway imports remain |
| Advisor typecheck | `npm run typecheck` in advisor MCP server | Pass |
| Spec-kit typecheck | `npm run typecheck` in spec-kit MCP server | Pass |
| Advisor build | `npm run build` in advisor MCP server | Pass |
| Spec-kit build | `npm run build` in spec-kit MCP server | Pass |
| Advisor moved unit tests | targeted `vitest run` | Pass, 39 passed / 4 skipped |
| Advisor stress smoke | `vitest run --config vitest.stress.config.ts stress_test/skill-advisor` | Pass, 57 passed |
| Spec-kit targeted tests | targeted unit and stress tests | Pass, 36+17 passed |
| Full advisor suite | `npm test` in advisor MCP server | Fail, unrelated graph-health/spec-path blockers |
| Hook smoke | advisor compiled Codex hook via `node .../hooks/codex/user-prompt-submit.js` | Pass, `Advisor: live; use sk-doc...` |

## Blockers

- `tests/legacy/advisor-graph-health.vitest.ts` fails because untracked `cli-devin` metadata references missing files.
- `tests/scorer/lane-weight-sweep.vitest.ts` fails because it looks for old `013-skill-advisor-semantic-lane/...` packet paths after the current spec reorganization.
- Existing full spec-kit suite failures remain outside this import-decoupling scope.

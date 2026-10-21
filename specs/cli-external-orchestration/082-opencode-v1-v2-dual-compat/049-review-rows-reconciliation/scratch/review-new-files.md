# Review: four hook files added after the alignment review

## Scope and Method

The four files below were added to the hook tree after the alignment review, so they carry no row in `../../039-sk-code-opencode-alignment-audit/review.md`. Each was reviewed against sk-code's SKILLED surface and its `sk-code-review` mode; severity follows `review-core.md` §2 (P0 security or data loss, P1 correctness or spec mismatch, P2 style and maintainability), and every file was compared with a sibling of the same kind for local convention.

Surfaces: all four are SKILLED. Three are JavaScript (`*.test.mjs`, `*.test.cjs`, `*.mjs`), reviewed against `javascript/style-guide.md`, `javascript/quality-standards/security-testing-and-exemptions.md`, `javascript-checklist.md` and `test-quality-checklist.md`. One is shell (`*.test.sh`), reviewed against `shell/style-guide/overview-structure-and-naming.md`, `shell/quality-standards/overview-and-priority-blockers.md` and `shell-checklist.md`.

Checks run, observed: `bash .skilled/hooks/git/install-hooks.test.sh` → PASS 4, exit 0. `node --test .skilled/hooks/post-edit-quality/codex/post-edit-quality.test.cjs` → 3 pass. `vitest run .skilled/hooks/dispatch/devin/devin-dispatch-audit.test.mjs` → 2 pass. `node --test --test-name-pattern=compact-pointer .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` → 3 pass. No finding below is a currently red check; each is a coverage, isolation or parity gap that the passing runs do not catch.

Totals: 6 findings — 0 P0, 0 P1, 6 P2.

---

## 1. `.skilled/hooks/dispatch/devin/devin-dispatch-audit.test.mjs`

**Surface**: SKILLED, JavaScript ESM under vitest. **Siblings compared**: `.skilled/hooks/dispatch/codex/codex-shell-tool.test.mjs` (same `hookEnv`/`runHook` shape) and `.skilled/hooks/post-edit-quality/codex/post-edit-quality.test.cjs` (same environment sanitising).

| id | severity | rule cited | line | finding | suggested fix |
|---|---|---|---|---|---|
| b14-new-files-001 | P2 | test-quality-checklist.md § 4. TEST INDEPENDENCE AND RELIABILITY ("Does the test rely on external state that could change between runs?") | 21 | `hookEnv()` starts from `process.env` and only deletes switch names, so the hook's own `isHookEnabled('dispatch')` (dispatch-audit-posttooluse.mjs:44) resolves `configPath()` and reads the operator's real `.skilled/hooks/hook-flags.env`; a persisted master or dispatch switch there fails the first case and turns the heredoc case into a vacuous pass, whereas the codex sibling pins `HOOK_FLAGS_CONFIG` to a missing fixture file for exactly this reason (post-edit-quality.test.cjs:80). | Set `env.HOOK_FLAGS_CONFIG = join(projectDir, 'hook-flags.env.missing')` in `runHook`, or return it from `hookEnv()`, so the persisted config can never reach the child. |
| b14-new-files-002 | P2 | test-quality-checklist.md § 4. TEST INDEPENDENCE AND RELIABILITY ("Is shared state properly isolated or reset between test functions?") | 29 | The delete list stops at `MK_DISPATCH_DISABLED`, but `hook-flags.cjs` registers `MK_CLI_DISPATCH_AUDIT_DISABLED` as the third legacy alias for the `dispatch` concern (hook-flags.cjs:64), so an operator who exported that older name silences the adapter and breaks the positive case without naming the cause. | Add `'MK_CLI_DISPATCH_AUDIT_DISABLED'` to the list, or derive the list from `LEGACY_ALIASES.dispatch` plus the master switch so a later alias cannot be missed. |

---

## 2. `.skilled/hooks/git/install-hooks.test.sh`

**Surface**: SKILLED, shell. **Siblings compared**: `.skilled/hooks/git/install-hooks.sh` and `pre-commit` in the same folder (same `# ───` header block and `set` idiom).

| id | severity | rule cited | line | finding | suggested fix |
|---|---|---|---|---|---|
| b14-new-files-003 | P2 | shell/quality-standards/overview-and-priority-blockers.md § 2. P0 - HARD BLOCKERS ("Strict Mode: Every script must enable strict mode: set -euo pipefail", `-e` "Prevents silent failures") | 11 | The harness sets `set -uo pipefail` and leaves out `-e`, so a failing `git init`, `git commit` or `git worktree add` inside `make_repo` is ignored and the run continues on a half-built fixture, reporting the case as "installer exited N" instead of naming the setup command that broke. | Keep the deliberate omission (a global `-e` would skip the remaining cases) but state it in the header WHY block, or run each `make_repo`/`expect_install` body in a `set -e` subshell and report that exit as the failure detail. |

---

## 3. `.skilled/hooks/post-edit-quality/codex/post-edit-quality.test.cjs`

**Surface**: SKILLED, CommonJS under `node --test`. **Sibling compared**: `.skilled/hooks/post-edit-quality/devin/post-edit-quality.test.cjs`, its line-for-line sibling, which pins its runtime-specific `write` tool in the header and cases; this file pins only `edit`.

| id | severity | rule cited | line | finding | suggested fix |
|---|---|---|---|---|---|
| b14-new-files-004 | P2 | test-quality-checklist.md § 2. COVERAGE QUALITY ("New public API surface introduced without any test coverage"; "Are failure modes and boundary conditions tested alongside the happy path?") | 93 | Every case sends `tool_name: 'edit'` with a `file_path` alias, so the adapter's `apply_patch` path — the Codex-specific tool in `CODEX_EDIT_TOOLS` (post-edit-quality.cjs:30), its `patchPaths` body scanner (:49-59), the fallback at :70 and the `apply_patch` matcher in `.codex/hooks.json:116` — is not exercised by any test under `.skilled/`, leaving multi-file patches and `*** Add/Update/Delete File:` / `*** Move to:` extraction unverified. | Add a case sending `{ tool_name: 'apply_patch', tool_input: { command: '*** Begin Patch\n*** Add File: src/app.js\n...' } }` and assert the warning names `src/app.js`. |
| b14-new-files-005 | P2 | test-quality-checklist.md § 2. COVERAGE QUALITY ("Changed behavior that lacks a corresponding test update or addition") | 123 | The header says the payload "may name the edited file under any of three aliases" (lines 17-18), but the only alias case exercises `filePath`, so dropping `path` from `FILE_PATH_FIELDS` (post-edit-quality.cjs:33) would leave every test green. | Add a case with `{ path: 'src/app.js' }`, or `{ file_path: 123, path: 'src/app.js' }`, so the third alias is pinned as well. |

---

## 4. `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs`

**Surface**: SKILLED, JavaScript ESM hook adapter. **Siblings compared**: `.skilled/hooks/session-relaunch/claude/context-nudge.mjs` (same module header, numbered section dividers, `done`/`emit`/`logEvent` helpers and `CONCERN = 'session-relaunch'`) and `.skilled/hooks/session-relaunch/codex/shared.mjs`.

| id | severity | rule cited | line | finding | suggested fix |
|---|---|---|---|---|---|
| b14-new-files-006 | P2 | review-core.md § 6. BASELINE CHECK FAMILIES (correctness minimums: boundary handling) | 45 | `noteSpecFolder` returns any string the note's `spec_folder` frontmatter holds, while every other reader of that field normalises it (`nudge.normalizeSpecFolder`, nudge.cjs:97-100, and `resolveHandoff`, session-relaunch.cjs:369-373), so a hand-written or stale value the CLI rejects (a trailing slash, an uppercase packet name, a bare `specs/foo`) is interpolated verbatim into the `/speckit:resume <value>` step that `seedText` builds (nudge.cjs:200-201) at line 88. | Return `nudge.normalizeSpecFolder(folder) ?? ''` (the helper is already exported) so an invalid value falls into the existing "spec_folder is empty" branch instead of producing a resume command the CLI would refuse. |

---

## Summary

| Path | Surface | Findings |
|---|---|---|
| `.skilled/hooks/dispatch/devin/devin-dispatch-audit.test.mjs` | SKILLED / JavaScript (vitest) | b14-new-files-001, b14-new-files-002 |
| `.skilled/hooks/git/install-hooks.test.sh` | SKILLED / shell | b14-new-files-003 |
| `.skilled/hooks/post-edit-quality/codex/post-edit-quality.test.cjs` | SKILLED / JavaScript (`node --test`) | b14-new-files-004, b14-new-files-005 |
| `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs` | SKILLED / JavaScript (ESM) | b14-new-files-006 |

Four of the six are test-coverage or test-isolation gaps in files that currently pass, so they cost a future regression rather than a present one. The adapter finding is a parity gap with the CLI's own validation of the same frontmatter field. No P0 or P1 finding was confirmed, and no file warranted "none".

Not checked: the behaviour of `dispatch-audit-posttooluse.mjs`, `install-hooks.sh`, `post-edit-quality.cjs` and `nudge.cjs` beyond the calls these four files make; those files carry their own review rows. Whether any operator machine actually carries a `.skilled/hooks/hook-flags.env` with a disable switch, which is why b14-new-files-001 is stated as a reliance and not a reproduction.

Review status: COMMENTED

# Phase briefs for the OpenCode v1 and v2 dual-compat build

The orchestrator wrote these briefs. Each child's spec, plan, tasks, acceptance criteria and goal are expanded from its brief here, and from `research/research.md`, which stays the evidence source. Plugin sources live in `.opencode/plugins/` (a real folder). `.skilled/plugins` is a symlink to it, so edit only `.opencode/plugins/`. The 16 plugins: the 11 mechanical ones are `classifier-injection-screen`, `cli-dispatch-audit`, `codex-hooks-watchdog`, `mcp-route-guard`, `session-cleanup`, `sk-code-post-edit-quality`, `sk-git-message-gate`, `sk-git-preflight-advisory`, `system-deep-loop-guard`, `system-dist-freshness-guard` and `system-speckit-completion`. The 5 hard ones are `system-completion-sentinel`, `system-spec-gate`, `system-skill-advisor`, `opencode-goal` and `sk-vision`. Cite research rows as `research/research.md` section N or `research/iterations/iteration-NNN.md:line`.

## Frozen decisions (bind every phase)

- D1. Every plugin default-exports one plain object `{ id, setup, server }`. v1 calls `server(input)`, v2 calls `setup(ctx)`. Never a function carrying `.id`.
- D2. `opencode.json` stays in the v1 shape: the singular `permission` map and `mcp.<name>` entries (the current `mcp.code_mode` shape, which v2 converts). Never author `permissions`, `plugins` or `disabled`.
- D3. Every v2 child dispatch uses `run --standalone`. Version comes from parsed `--version` output, never from the binary name.
- D4. Side-by-side install means two npm prefixes plus an `opencode2` launcher that sets `OPENCODE_DB`. Never run `opencode upgrade --major`. Never stop, start or restart the v2 background service.
- D5. Pinned targets: OpenCode 1.19.3 and 2.0.32. `@opencode-ai/plugin` 1.19.3 exact, zod declared, `@opencode/plugin` 2.0.32 as a type-only dev dependency.
- D6. Executors: code goes to GPT-6 Luna max fast through cli-codex. Docs, live probes and code review go to DeepSeek V4.1 Flash max through cli-devin. Each model reviews the other's output. The orchestrator runs every test and probe the codex sandbox cannot run.
- D7. All new and changed code follows the sk-code OPENCODE surface (`sk-code/sk-code-opencode`). All new and changed docs follow the matching sk-doc mode.
- D8. The public claim is scoped: "Verified against OpenCode 1.19.3 and 2.0.32 on <date>. Loads and runs on both, with a documented capability delta. Later versions are unsupported until re-verified."

## 001-unknowns-and-baseline

- Purpose: settle the open questions and record a baseline before any code changes.
- Executor: DeepSeek through cli-devin, read-only probes. Orchestrator verifies.
- Scope in: probes on both versions for `allowed-tools` and `disable-model-invocation` semantics, `-m provider/model#variant` on v1, `plugin.check` tolerance for extra default-export keys, live v2 event delivery for `session.idle` and `session.compacted`, and whether a zod JSON Schema satisfies v2 `Tool.ValueSchema`. Desk checks for the VS Code extension, LSP and `CLAUDE.md` loading. Confirm the `sk-vision` source: `.opencode/plugins/sk-vision.js` links to `.skilled/skills/sk-vision/vision-runtime/dist/plugin.js`, a build output that does not exist in a fresh worktree. Find the build command in `vision-runtime/package.json`, build it, and record whether the built bundle loads on each version. Baseline: each of the 16 plugins' load state on v1 (`opencode debug config` plus the plugin log lines) and on v2 (`/api/plugin`, raw query, retried), and the pass counts of the existing plugin and guard test suites.
- Scope out: any repo file outside this child folder.
- Outputs: `findings.md` in this child with one verdict per question (confirmed, refuted or unknown, with the command and output excerpt), and `baseline.json` with per-plugin per-version load state and suite counts.
- Acceptance: every listed question has a verdict with evidence. The baseline lists all 16 plugins on both versions. The `sk-vision` source location is named, or recorded as outside the repo. No file outside this child changed.
- Hands to 002: the baseline and any decision changes, which the orchestrator writes back into the parent spec before 002 starts.

## 002-pins-imports-dual-export

- Purpose: make the 11 mechanical plugins load on both versions with v1 behaviour unchanged.
- Executor: Luna (code), DeepSeek (review).
- Scope in: `.opencode/package.json` and `.skilled/package.json` pins per D5, and the npm install in those two folders. Replace the three `@opencode-ai/plugin/tool` imports with a local identity helper under `.opencode/plugins/lib/`. Wrap the default export of the 11 plugins that research section 3 marks mechanical as `{ id, setup, server }`, with a v2 `setup` leg built on `ctx.tool.hook`, `ctx.event.subscribe` and `ctx.session.hook("context")`. Module state created inside `setup` and reset in its Cleanup, per-session state keyed by session ID. Test-only `__test` exports move into the core modules.
- Scope out: the five hard plugins (003), guards (005).
- Files: `.opencode/plugins/*.js` for the 11 plugins, `.opencode/plugins/lib/`, `.opencode/plugins/tests/`, the two `package.json` files and their lock files.
- Acceptance: v2 `/api/plugin` shows the 11 as active. v1 plugin log lines show the 11 loaded with no `failed to load plugin`. Existing plugin tests pass at their baseline count or higher. Each ported plugin has a v2 registration test that fails on the unported export.

## 003-hard-plugins

- Purpose: port the five plugins whose v2 trigger differs in kind.
- Executor: Luna (code), DeepSeek (review).
- Scope in: `system-completion-sentinel` (cache assistant text per session from the event stream, because v2 has no message read), `system-spec-gate` (prompt and context hooks, deny through `tool.hook("execute.before")`), `system-skill-advisor` (compaction events, context hook, `ctx.tool.transform`), `opencode-goal` (rebuild the prompt queue and deadline logic on `ctx.session.prompt` with `delivery: "queue"`), `sk-vision` (own its command through `ctx.command.transform` in `.skilled/skills/sk-vision/vision-runtime/src/`, then rebuild `dist/plugin.js`). Defensive guards that return null on v2 become positive capability checks.
- Scope out: closing the server-side toast and the global command observer, which research marks irreducible. If 001 finds the `sk-vision` source outside the repo, its port is recorded as blocked, not attempted.
- Acceptance: each of the five has a v2 test asserting its registered payload shape, and each test fails on the pre-port code. All five load as active on v2 and loaded on v1. The sentinel and spec gate each have a v2 behaviour test, not only a load test.

## 004-agents-commands-config

- Purpose: one set of agents, commands and config that both versions read with the same intent.
- Executor: Luna for file moves and their consumers, DeepSeek with the markdown persona for agent body wording (sk-doc agent mode).
- Scope in: add `browser: deny` beside `chrome_devtools: deny` in agent frontmatter. Make agent bodies runtime-neutral where they name the `Task` tool, and extend the runtime table at `.skilled/agents/orchestrate.md:35`. Sync every runtime mirror. Move or rename the non-command `.md` files under `.skilled/commands` (README files under scripts folders, `deep/assets/compiled/*.md`, `deep/assets/legacy/*.md`), and update every consumer, including `compile-command-contracts.cjs`, the contract render tests and any doc that cites the old paths. Keep `opencode.json` in the v1 shape and add a check that it carries no v2-only key.
- Scope out: changing any agent's permissions or behaviour beyond the wording.
- Acceptance: `node .opencode/bin/check-agent-mirror-sync.cjs` exits 0. Neither version registers a non-command file (v1 command listing, v2 `/api/command`). The contract compiler and its tests pass from the new paths. `opencode.json` loads on v1 1.19.3 without error.

## 005-version-aware-guards

- Purpose: the dispatch guards see v2 and stop blocking correct v2 runs.
- Executor: Luna (code), DeepSeek (review).
- Scope in: widen binary admission to `opencode\d*` in the dispatch classifier (`EXECUTOR_BASENAMES` and the evidence regexes), give each rule in `cli-opencode/hard-rules.json` an `appliesTo` list, add one memoised `--version` resolver (tri-state v1, v2 or unknown, cached by realpath and mtime), evaluate only both-version rules on unknown, and give `command-flag-for-slash-prompt` a v2 route. Files: `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json`, the dispatch rule checker `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`, the classifier that holds `EXECUTOR_BASENAMES` (`.skilled/hooks/dispatch/lib/dispatch-audit.mjs`) and their tests.
- Scope out: cli-opencode's own dispatch code (006).
- Acceptance: a test shows `opencode2 run ...` classified and evaluated, and that test fails on the pre-change code. A correct v2 slash-command run is not blocked. Every existing guard test passes.

## 006-cli-opencode-dual-dispatch

- Purpose: cli-opencode and the deep-loop runtime dispatch correctly to either version.
- Executor: Luna (code), DeepSeek (review and live smoke dispatch).
- Scope in: version detection per research section 6 (binary order `$OPENCODE_BIN`, `opencode2`, `opencode`, the version regex, refuse on unparsable, cache by realpath, size and mtime). Two invocation renderings (v1 flags, v2 `#variant` model form, no `--command`, `--dir`, `--variant`, `--pure`, `--share` or `--port` on v2). `--standalone` mandatory for v2 children. A v2 branch in `fanout-run.cjs` at the sites research section 9 names. Fix the `grep -q '^1\.'` check in `cli-opencode/SKILL.md`.
- Scope out: install docs (007). Prose updates to cli-opencode docs beyond the lines that encode dispatch shape (010 owns the doc sweep).
- Acceptance: unit tests cover both renderings and the version parser, and fail on the old code. A smoke dispatch succeeds on each version. A v2 child sees `AI_SESSION_CHILD=1` in a plugin. The deep-loop runtime suites pass.

## 007-install-guidance-and-setup-helper

- Purpose: a user can reproduce side by side, v1 only or v2 only.
- Executor: Luna for `opencode-setup.sh`, DeepSeek with the markdown persona for the install reference.
- Scope in: `cli-opencode/scripts/opencode-setup.sh <both|v1|v2|check>` per the iteration-015 design, idempotent, each step printing its rollback line. A new `cli-opencode/references/install-and-versions.md` covering the three layouts, the launcher, `OPENCODE_DB`, the shared `~/.config/opencode`, the Homebrew v2-only fact, the `--major` warning and the irreducible-gaps list from research section 8.
- Scope out: changing the operator's existing installs. Proof runs use a throwaway npm prefix under this child's `scratch/`, deleted afterwards.
- Acceptance: `opencode-setup.sh both` in a throwaway prefix produces a working v1 and v2 pair (both report their version, separate databases). `check` reports correctly on the throwaway layout. The reference passes sk-doc validation.

## 008-doctor-and-ci

- Purpose: a repeatable two-version proof.
- Executor: Luna (code), DeepSeek (review).
- Scope in: a `/doctor:opencode` route in `.skilled/commands/doctor/_routes.yaml` with its route doc (sk-doc command mode), a battery `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` (v1 `debug config` plus plugin log lines, v2 `/api/plugin` and `/api/skill` with the raw query, file redirect and retry until the count is stable), and a CI workflow that installs each version in its own npm prefix and runs the battery. The workflow file stays local and unpushed.
- Acceptance: the battery passes on both pinned versions locally. It fails when one plugin is broken on purpose in a throwaway copy. The CI workflow passes `actionlint` or the repo's workflow lint, if one exists.

## 009-sk-code-opencode-alignment

- Purpose: every new and changed code file meets the sk-code OPENCODE surface.
- Executor: DeepSeek reviews findings-first against `sk-code/sk-code-opencode`, Luna fixes.
- Scope in: every code file changed in 002 to 008. Run `.skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` and the comment-hygiene check. Fix every P0 and P1 finding.
- Acceptance: the drift guards exit 0. No P0 or P1 finding stays open. All suites touched by 002 to 008 still pass.

## 010-documentation-sweep

- Purpose: every doc the build changes or needs follows its sk-doc mode.
- Executor: DeepSeek with the markdown persona, Luna reviews.
- Scope in: code-folder READMEs (`.opencode/plugins/README.md` and any changed script folder) through sk-doc readme mode. The cli-opencode `SKILL.md`, `README.md` and references through sk-doc skill mode, including the 14 `SKILL.md` line sites, `cli-reference.md`, `providers-and-models.md` and `assets/prompt-templates.md`. Manual testing playbook scenarios for cli-opencode and the plugins (the 20 playbook files research names) through the playbook mode. Feature catalog entries through the catalog mode. Changelogs through the changelog mode. A human-voice pass and a quality score on every touched doc.
- Acceptance: every touched doc passes `validate_document.py`. Every changed skill or hub passes its sk-doc package check. No doc still describes a v1-only dispatch shape as universal.

## 011-two-version-proof-and-closeout

- Purpose: prove the whole tree and close the packet.
- Executor: orchestrator.
- Scope in: rerun the full plugin, guard, cli-opencode and deep-loop suites against the 001 baseline. Run the doctor battery on both versions. Recursive strict validation. Reconcile completion state across every child and the parent. Write the scoped claim (D8) into the cli-opencode docs.
- Acceptance: every suite passes at or above its baseline count. The doctor passes on 1.19.3 and 2.0.32. Recursive strict validation prints `RESULT: PASSED`. Every child's acceptance criteria carry evidence.

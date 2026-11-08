# Iteration 002 — The advisor prompt hook across seven runtimes

## Focus

The advisor prompt hook across runtimes: one row per runtime (Claude, Codex, Cursor, Devin, OpenCode, Pi, dsh) for the registering adapter, whether it executes the single source in `.skilled/hooks/skill-advisor`, its timeout, and what it emits when the advisor is slow or fails. Verify the v4.0.0.1 (Pi brief restored), v4.0.0.2 (hook holds up in every runtime) and v4.0.2.0 (dsh gets the brief) claims against code.

## Actions Taken

1. Inventoried `.skilled/hooks/skill-advisor/` and the seven adapter surfaces (`.claude/hooks`, `.codex/hooks`, `.cursor/hooks`, `.devin/hooks`, `.opencode/plugins`, `.pi/extensions`, `.dsh/plugins`), then resolved every entry with `readlink` to separate symlinks from copies.
2. Read the maintained reference `.skilled/hooks/skill-advisor/README.md` in full and the Pi extension (`.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`), including its deadline race.
3. Read the dsh adapter in full (`.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs`), its registration (`.dsh/plugins/repo-guards/index.mjs`, `.dsh/patches/guards.patch.yml`) and its test file.
4. Traced the native dispatch chain: each shim in `.skilled/skills/system-spec-kit/runtime/hooks/<runtime>/` and the shared `runClaudeHookAdapter` in `codex/shared.ts`, then the Claude adapter's child budget in `hooks/claude/user-prompt-submit.ts`.
5. Read the four registrations (`.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`) for host timeouts.
6. Read `.opencode/plugins/system-skill-advisor.js` around its bridge timeout, env lookup and timeout result path.
7. Compared the three release notes (`.skilled/changelog/skilled/v4.0.0.1.md`, `v4.0.0.2.md`, `v4.0.2.0.md`) with what the code does.
8. Inspected the test inventory: `.skilled/hooks/vitest.config.ts` exists, plus `.skilled/skills/system-skill-advisor/runtime/tests/*.vitest.ts` and `.skilled/skills/system-skill-advisor/hooks/tests/dsh-prompt-advisor.test.mjs`. **I did not run them.** The iteration containment forbids running repo tests and builds, so the focus line that asked for a read-only test run was not executed; this is recorded below rather than silently skipped.

## Runtime matrix

| Runtime | Registering adapter | Single source? | Timeout layers | Slow / failed emission |
|---|---|---|---|---|
| **Claude** | `UserPromptSubmit` at `.claude/settings.json:125` → `.claude/hooks/user-prompt-submit.js` (symlink) → spec-kit `dist/hooks/claude/user-prompt-submit.js` | Spawns the advisor `dist/hooks/claude/user-prompt-submit.js`; no copy | host 3 s (`.claude/settings.json:132`); adapter child 2.5 s (`claude/user-prompt-submit.ts:20`); advisor budget 2.2 s (`:147-153`) | Shim returns `{}` on `TARGET_UNRESOLVED` / `CHILD_TIMEOUT` / `SPAWN_ERROR`; inside budget the handler emits `Advisor: outage (...)` plus directives |
| **Codex** | `UserPromptSubmit` at `.codex/hooks.json:43` → `.codex/hooks/user-prompt-submit.js` (symlink) → spec-kit codex shim | Spawns the **Claude** spec-kit adapter (`codex/shared.ts:98`), which spawns the same advisor module; no copy | host 3 s (`.codex/hooks.json:49`); wrapper 2.8 s (`codex/user-prompt-submit.ts:22`); inner 2.5 s; advisor 2.2 s | On wrapper timeout `runClaudeHookAdapter` returns `null` (`codex/shared.ts:110`) and no `additionalContext` is emitted at all |
| **Cursor** | `beforeSubmitPrompt` at `.cursor/hooks.json:114` → `.cursor/hooks/user-prompt-submit.js` (symlink) → codex-style shim | Same: spawns the Claude adapter, no copy | host 10 s (`.cursor/hooks.json:116`); wrapper 2.8 s (`cursor/user-prompt-submit.ts:50`); advisor 2.2 s | Same null path, but 10 s host leaves ample room |
| **Devin** | `UserPromptSubmit` at `.devin/hooks.v1.json:55` → `.devin/hooks/user-prompt-submit.js` (symlink) → devin shim | Same: spawns the Claude adapter, no copy | host 10 s (`.devin/hooks.v1.json:56`); wrapper 2.8 s (`devin/user-prompt-submit.ts:28`); advisor 2.2 s | Same null path, 10 s host |
| **Pi** | `.pi/extensions/prompt-advisor.ts` (symlink to `hooks/pi/prompt-advisor.ts`) | **In-process import** of the same advisor module (`prompt-advisor.ts:75`); no copy | race at budget (default 2.5 s) + 300 ms (`:291-309`) | Timeout renders `renderAdvisorFallbackDirective` (`:312-317`); a thrown handler sets `advisorFailed` and the turn proceeds |
| **OpenCode** | `.opencode/plugins/system-skill-advisor.js` (real file, 1,747 lines) | **Own implementation**; shells out to `.skilled/bin/skill-advisor.cjs` | `DEFAULT_BRIDGE_TIMEOUT_MS = 2500` (`:49`), env `SYSTEM_SKILL_ADVISOR_BRIDGE_TIMEOUT_MS` (`:376`, `:392`) | `finish({ brief: null, status: 'fail_open', error: 'TIMEOUT' })` (`:1285`) |
| **dsh** | `.dsh/plugins/repo-guards/adapters/prompt-advisor.mjs` (symlink to `hooks/dsh/prompt-advisor.mjs`), registered at `repo-guards/index.mjs:52`, enabled by `guards.patch.yml:6` | **In-process import** of the same Claude-shaped module (`prompt-advisor.mjs:17`); no copy | **none** — `await core.runAdvisor(...)` at `:168`, no race, no timer | `catch` logs `repo-guards prompt-advisor: …` and continues (`:181-183`) |

Reading the table: six of the seven runtimes execute one compiled advisor handler. OpenCode is the only separate implementation. The `.skilled/hooks/skill-advisor/*` tree holds **symlinks only** — Claude, Codex, Cursor, Devin, Pi, dsh and OpenCode are all links to real files elsewhere, so there is no duplicated hook body to drift.

## Findings

### f-iter002-001 — P2, drift: the maintained advisor matrix is stale in two directions, and one documented path cannot exist

The reference header still describes the maintained set as "Claude, Codex, Cursor, Devin, Pi, and the OpenCode plugin" `[SOURCE: .skilled/hooks/skill-advisor/README.md:3]`, and the §3 table `[SOURCE: .skilled/hooks/skill-advisor/README.md:51]` has no dsh row even though v4.0.2.0 added one (`[SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:52]`, "dsh sessions match Pi and OpenCode. They get the advisor brief") and the adapter is registered `[SOURCE: .dsh/plugins/repo-guards/index.mjs:52]` and enabled `[SOURCE: .dsh/patches/guards.patch.yml:6]`.

The same table gives each native runtime its own advisor target, `.../dist/hooks/codex|cursor|devin/user-prompt-submit.js` `[SOURCE: .skilled/hooks/skill-advisor/README.md:54]`–`[SOURCE: .skilled/hooks/skill-advisor/README.md:56]`. Those paths do not exist and cannot be built: the advisor package's only handler source is `hooks/claude/user-prompt-submit.ts` and its `dist/hooks/` holds only `claude/user-prompt-submit.js`. The Codex, Cursor and Devin shims in fact spawn the **Claude** spec-kit adapter `[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts:98]`, which then spawns the Claude advisor handler. The routing is sound; the documented target is not.

Introduced: v4.0.2.0 for the missing dsh row; the per-runtime target wording predates it and survived the v4.0.0.2 advisor rework.
Confidence: high (paths resolved on disk; `find .skilled -path '*/dist/hooks/*/user-prompt-submit.js'` returns only the claude advisor build).
Verify:

```
rg -n 'dsh|DeepSeek' .skilled/hooks/skill-advisor/README.md
find .skilled/skills/system-skill-advisor/runtime/dist/hooks -name user-prompt-submit.js
rg -n "runClaudeHookAdapter\('user-prompt-submit.js'" .skilled/skills/system-spec-kit/runtime/hooks/{codex,cursor,devin}/user-prompt-submit.ts
```

### f-iter002-002 — P2, drift: the documented OpenCode timeout control is never read, and the real one has a different default

Both copies of the reference state that `SPECKIT_OPENCODE_HOOK_TIMEOUT_MS` (default 3000) has "the OpenCode bridge" among its live consumers, and that on timeout the bridge "serves prompt-safe stale context with a timeout marker" `[SOURCE: .skilled/hooks/skill-advisor/README.md:123]` (same text at `[SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:123]`).

The plugin never reads that name. Its timeout comes from `SYSTEM_SKILL_ADVISOR_BRIDGE_TIMEOUT_MS` `[SOURCE: .opencode/plugins/system-skill-advisor.js:376]`, defaulted at `[SOURCE: .opencode/plugins/system-skill-advisor.js:49]` to 2,500 ms, and applied at `[SOURCE: .opencode/plugins/system-skill-advisor.js:392]`. `rg -n 'SPECKIT_OPENCODE_HOOK_TIMEOUT_MS' .opencode/plugins/system-skill-advisor.js` returns nothing. An operator who sets the documented variable changes no behavior, and the actual budget is 500 ms tighter than documented.

The stale-context claim also does not match the timeout result path: a bridge timeout resolves as `{ brief: null, status: 'fail_open', error: 'TIMEOUT' }` `[SOURCE: .opencode/plugins/system-skill-advisor.js:1285]`, not as a stale brief with a marker. This is the same class of documentation/code split that v4.0.0.2 set out to close ("A Turn Without a Suggestion Says Why", `v4.0.0.2.md:58`).

Introduced: present by v4.0.0.2, the release that reworked the OpenCode fallback; the exact rename point is not visible in the notes, so it may predate the v4 line.
Confidence: high on the name mismatch and the 2,500 ms default; medium on release attribution.
Verify:

```
rg -n 'SPECKIT_OPENCODE_HOOK_TIMEOUT_MS' .opencode/plugins/system-skill-advisor.js
rg -n 'SYSTEM_SKILL_ADVISOR_BRIDGE_TIMEOUT_MS|DEFAULT_BRIDGE_TIMEOUT_MS' .opencode/plugins/system-skill-advisor.js
```

### f-iter002-003 — P2, bug: Codex's wrapper budget plus the inner start margin exceeds the host's 3,000 ms deadline

v4.0.0.2 fixed the lost fallback by giving the advisor 2,200 ms inside a 2,500 ms shim `[SOURCE: .skilled/changelog/skilled/v4.0.0.2.md:50]`. The Codex wrapper adds a layer above that: it spawns the Claude adapter with a 2,800 ms timeout `[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts:22]` while the host kills the hook at 3,000 ms `[SOURCE: .codex/hooks.json:49]`. The inner adapter reserves 300 ms for its own startup and fallback `[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:22]`, so the worst-case chain is 2,800 + 300 = 3,100 ms — 100 ms past the host deadline. When the host wins, the turn gets no `additionalContext` at all; when the wrapper wins at 2,800 ms, `runClaudeHookAdapter` returns `null` `[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts:110]` and `emitNormalizedCodexContext(..., null)` emits nothing, so the fallback directive is lost too.

This is the identical failure mode v4.0.0.2 claimed to remove for Codex ("A slow advisor no longer empties the turn"), surviving one layer up. Cursor and Devin carry the same 2,800 ms wrapper but a 10 s host timeout, so only Codex is exposed.

Severity stays P2 rather than P1 because the inner spawn is bounded at 2,500 ms, so the race window is roughly the last 100–200 ms of startup; promote it if the measurement below lands near or above 2,800 ms.
Introduced: v4.0.0.2 (the wrapper timeout and the release promise arrived together).
Confidence: high on the arithmetic and the null path; medium on how often the race fires.
Verify:

```
rg -n '2_800|CHILD_START_MARGIN_MS|CHILD_TIMEOUT_MS' .skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts
rg -n '"timeout"' .codex/hooks.json | head
time (printf '%s' '{"prompt":"update documentation with DQI checks","cwd":"'"$PWD"'"}' | node .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/user-prompt-submit.js)
```

### f-iter002-004 — P2, bug: dsh awaits the advisor with no deadline, unlike Pi

Pi wraps the same in-process call in `Promise.race` against `advisorBudgetMs() + 300` and renders the fallback when the timer wins `[SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:291]`. The dsh adapter awaits the handler directly: `const output = await core.runAdvisor({...})` `[SOURCE: .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:168]` with no race, no timer and no budget constant. Its test file covers a throwing core `[SOURCE: .skilled/skills/system-skill-advisor/hooks/tests/dsh-prompt-advisor.test.mjs:64]` but not a hanging one.

The shared handler bounds its own CLI spawn at 2,500 ms `[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:20]`, so a reachable hang needs a stall outside that spawn (a stuck lifecycle store, a rebuilt handler with an extra await path). That narrow window is why this is P2, not P1. The divergence still matters because dsh's `agent/pre-step` is a serial waterfall: a hang there blocks the turn rather than degrading it, which is precisely the reason Pi carries the race.

Introduced: v4.0.2.0 (the dsh adapter).
Confidence: high on the missing race; medium on a reachable hang.
Verify:

```
rg -n 'Promise.race|setTimeout|deadline|budget' .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs
sed -n '285,325p' .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts
```

## Observations

- **Single source holds for six runtimes, not seven.** `.skilled/hooks/skill-advisor/*` is symlinks only, and the compiled body is one file, `.skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js`. The Codex/Cursor/Devin shims reach it through the Claude adapter `[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts:98]`; Pi and dsh import it in-process. OpenCode is the only separate implementation, at 1,747 lines plus the `.skilled/bin/skill-advisor.cjs` shell-out.
- **The advisor package's `dist/` currently holds only the claude handler.** `dist/` is gitignored `[SOURCE: .gitignore:60]`, so this is build state, not a tracked defect; a fresh checkout that builds only `system-spec-kit` gets no advisor body at all. The reference's "build both packages" instruction `[SOURCE: .skilled/hooks/skill-advisor/README.md:156]` is load-bearing, not optional.
- **Test run deliberately skipped.** `.skilled/hooks/vitest.config.ts` exists and includes `.skilled/hooks/**/*.{test,spec}.*`, but the skill-advisor suites live under `.skilled/skills/system-skill-advisor/runtime/tests/*.vitest.ts` and `.skilled/skills/system-skill-advisor/hooks/tests/dsh-prompt-advisor.test.mjs`, outside that include root. The iteration containment bans running repo tests, so I inspected the file names and case titles only. A later iteration with an explicit test allowance should run `npm --prefix .skilled/skills/system-skill-advisor/runtime test -- --reporter=default` and `node --test .skilled/skills/system-skill-advisor/hooks/tests/dsh-prompt-advisor.test.mjs`.
- **Release claim status.** v4.0.0.1's "advisor brief is back on Pi" is supported: the extension is present and imports in-process, and its timeout renders the fallback. v4.0.0.2's "holds up in every runtime" is supported for Claude, Cursor, Devin, Pi and OpenCode, and is qualified on Codex by f-iter002-003. v4.0.2.0's "dsh sessions get the advisor brief" is supported in structure (registration, guards patch, operator-only prompt extraction, leaf suppression), qualified by f-iter002-004.

## Questions Answered

- **Advisor prompt hook (v4.0.0.1, v4.0.0.2, v4.0.2.0): does every runtime adapter (.claude/hooks, .codex/hooks, .cursor/hooks, .devin/hooks, .opencode/plugins, .pi/extensions, .dsh/plugins) deliver the advisor brief from the single source in .skilled/hooks/skill-advisor, within its time limit?** Answered with qualifications. Six runtimes execute one compiled handler, and the `.skilled/hooks/skill-advisor` tree carries no copies. OpenCode is a separate implementation. Four time-limit divergences remain: Codex's 2,800 ms wrapper under a 3,000 ms host, the OpenCode plugin's undocumented 2,500 ms env name, dsh's unbounded await, and the reference's stale matrix/targets.

## Questions Remaining

- Advisor transport (v4.0.0.0, v4.0.0.16): the shared daemon's degraded path and the two-launcher race are still unexercised (carried from iteration 1).
- Which layer drops the redirect between the CLI handler and the shim's `recommend_with_native_advisor()` (carried from iteration 1).
- Hook safety (v4.0.0.8, v4.0.0.16): the three-second stdin deadline and the git-call time limit across every hook entry point.
- New: does `SYSTEM_SKILL_ADVISOR_BRIDGE_TIMEOUT_MS` behave as the *undocumented* control implies on a real OpenCode timeout — does any stale brief survive, or does the turn always lose the brief?
- New: is dsh's `message.source?.kind === 'user'` provenance shape stable in current dsh, or does the adapter silently skip prompts when the shape changes? The test fixture proves only the fixture.
- New: measure the Codex hook wall time on a cold daemon to decide whether f-iter002-003 stays P2.

## Next Focus

Session relaunch (v4.0.0.13, v4.0.0.14): the per-runtime `SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED` flags, the 80 percent trigger, and model/effort/goal carry-over against `.skilled/hooks/session-relaunch` and its adapters. If the reducer prefers the smaller open threads first, the OpenCode timeout behavior and the Codex wall-time measurement are one command each.

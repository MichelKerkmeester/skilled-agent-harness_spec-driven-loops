# Iteration 6 — Hook safety and Hermes residue

## Focus

Two release-note claims were tested against code, not against the notes:

1. v4.0.0.8 — "a hook reads until its input ends or three seconds pass".
2. v4.0.0.16 — "hook git calls have a time limit".
3. v4.0.2.0 — "No hook or check knows a `hermes` runtime anymore ... a request that names Hermes now routes nowhere."

## Actions Taken

- Enumerated the shared stdin/git helpers: `.skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts` (`HOOK_STDIN_TIMEOUT_MS = 3000`), `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs` and `.skilled/hooks/shared/hook-adapter-shared.cjs`.
- Grepped every hook entry-point root (`.skilled/hooks`, `.claude/hooks`, `.codex/hooks`, `.devin/hooks`, `.cursor/hooks`, `.opencode/plugins`, `.pi/extensions`, `.dsh/plugins`) for raw `process.stdin`, `readFileSync(0`, `fs.readFileSync(0`, `stdin.on(`, and for `execSync('git` / `spawnSync('git` / `execFileSync('git`.
- Opened each raw-stdin and raw-git hit to decide whether it bypasses a guard or implements its own.
- Grepped `-i hermes` across all runtime config roots and `.skilled/bin`, excluding `changelog/`, `node_modules/`, `*.test.*` and `fixtures/`, then opened the surviving hits to classify them.
- Cross-checked the three `ask-surface-stop.cjs` runtime variants line-by-line for the stdin read.

## Findings

### f-iter006-001 — P1 — The Claude ask-surface Stop hook blocks on stdin with no deadline, and it is registered

The guard helper exists and other adapters use it, but the Claude variant reads stdin with a bare blocking call:

`function readStdin() { try { return readFileSync(0, 'utf8'); } catch { return ''; } }`
[SOURCE: .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs:81]

That function is on the live entry path — `main()` calls `JSON.parse(readStdin())` at [SOURCE: .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs:114], invoked from the `require.main === module` block at [SOURCE: .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs:128]. It imports only `node:fs` and the core module ([SOURCE: .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs:15]) and never imports a deadline helper.

It is registered: `.claude/settings.json` names `.skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs` as a hook entry point, so this is reachable, not dead code.

A grep of all three variants shows the Claude one is the only offender — `.skilled/hooks/ask-surface-guard/codex/ask-surface-stop.cjs` and `.skilled/hooks/ask-surface-guard/devin/ask-surface-stop.cjs` contain no `readFileSync(0` match. The asynchrony that the codex/devin paths get from their host shape is not reproduced here.

Why this matters: a host that opens stdin and never closes it holds this hook until the host's own timeout fires. The failure is silent — the catch returns `''`, `JSON.parse('')` throws, the outer catch writes to stderr and sets `process.exitCode = 0`, so the turn ends normally but the guard never ran. That is a fail-open on a guard whose whole job is to stop a turn.

Introducing release: v4.0.0.8 established the three-second reader; this file was not migrated. Confidence: high on the code (read directly, line by line); medium on blast radius (I did not observe a live hang — I read the code path, not a stuck host).
Verify: `node -e "const{spawn}=require('node:child_process');const p=spawn(process.execPath,['.skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs'],{stdio:['pipe','pipe','pipe']});const t=Date.now();setTimeout(()=>{console.log('still running after',Date.now()-t,'ms');p.kill()},6000)"` — expect "still running after ~6000 ms", proving no 3 s deadline. Contrast with a shared-reader adapter, which exits at ~3000 ms.

### f-iter006-002 — P1 — The doctor's AGENTS.md manifest still ships Hermes persona text into vendored repos

v4.0.2.0 states "No hook or check knows a `hermes` runtime anymore" and "`AGENTS.md` no longer describes Hermes personas" [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:166].

The manifest the doctor uses to write and reconcile a vendored repo's `AGENTS.md` still contains Hermes text, including an agent-directory line, a documented exception, and a named environment variable:

- `ts/`, `.codex/agents/`, `.cursor/agents/`, `.pi/agents/`, `.devin/agents/` or `.hermes/agents/`, and stay with the workflow phase.`\n\n`Hermes is the exception w` [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json]
- `a dispatch binds one by preloading that skill and naming it in `HERMES_AGENT_PERSONA`. The `cli-hermes` packet owns the mechanics.` [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json]

This is not a stale comment or a retired packet doc — it is the payload source that regenerates the root instruction file in every repo the doctor installs into. So the breaking change is incomplete exactly where it propagates furthest: `.hermes/` no longer exists, but new and updated installs are still told `.hermes/agents/` may hold agents and that `HERMES_AGENT_PERSONA` binds a dispatch.

Confidence: high that the strings are present (grepped the file). Medium on the propagation claim — I did not run the doctor to observe a written `AGENTS.md`; I am judging from the manifest's role as the doctor's payload asset, which its path asserts.
Verify: `rg -n -i 'hermes' .skilled/commands/doctor/assets/agents-md-manifest.json` then, on a scratch copy, run the doctor against a throwaway repo and `rg -n -i hermes AGENTS.md` in the result.

### f-iter006-003 — P2 — The stdin deadline is not one number, so "three seconds" describes only part of the surface

`shared-stdin.ts` exports `HOOK_STDIN_TIMEOUT_MS = 3000` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts:15], which matches the release note.

But `claude/user-prompt-submit.ts` deliberately does not use it and sets `STDIN_DEADLINE_MS = 500` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:27], feeding its own timer at [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:134]. It carries a second bound the others do not — `MAX_STDIN_BYTES = 1024 * 1024` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:18] and `CHILD_TIMEOUT_MS = 2500` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:20].

This is arguably correct engineering — a prompt hook sits on the user's keystroke path and 3 s would be felt — but the release note's "three seconds" is then a claim about one helper rather than about hook stdin generally. Documentation/wording drift, not a bug: the file comments the relationship itself, so intent is legible. Low severity because no failure follows from it; it matters for verification, since a reviewer testing "the 3 s rule" against this hook would see a 500 ms exit and could read a regression where there is a design.

### f-iter006-004 — P2 — Two parallel shared-reader implementations and two parallel deadline test suites

The same helper exists twice under different names and module systems:

- `.skilled/hooks/shared/hook-adapter-shared.cjs`
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs`

and so does its regression suite:

- `.skilled/hooks/shared/hook-stdin-deadline.test.mjs`
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs`

`shared-stdin.ts` is a third implementation of the same read. So three readers and two suites for one deadline contract.

Over-engineering verdict, stated as the rule requires — what breaks if each is removed: neither copy can be deleted today. The `.cjs` one is the CommonJS entry the `.cjs` hook adapters `require`; the `.mjs` one serves the ESM adapters; a CJS file cannot be `import`ed as ESM and an ESM file cannot be `require`d synchronously on every supported Node. So the duplication is load-bearing at the module-boundary level, and collapsing it needs a build step, not a delete. The two *test* suites, by contrast, are genuinely redundant — one shared-reader contract does not need two copies of its assertions, and a fix landed in one suite silently leaves the other green.

f-iter006-001 is the direct cost of this shape: three implementations, and one caller reached for a fourth approach.

### f-iter006-005 — P2 — The Gate-1 trigger index still returns paths into the removed `cli-hermes` packet

`skilled/skills/system-spec-kit/runtime/data/trigger-index.json` still carries `specs/cli-external-orchestration/071-cli-hermes-creation/...` entries (acceptance-criteria.md, goal.md, implementation-summary.md, plan.md).

The changelog claim is "A request that names Hermes now routes nowhere" [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:162]. Retrieval, which is how a request is routed in practice, still surfaces that packet.

I am recording this as P2 and *not* as a contradiction, because the hit shape is a `files` array of document paths, not a trigger phrase pattern — indexing a still-on-disk packet's docs is defensible even after the feature is gone. What is not defensible is leaving it there while the release note says a Hermes request routes nowhere: the next reader cannot tell whether the absence of a scoped trigger was deliberate or forgotten.
Verify: `rg -n -i hermes .skilled/skills/system-spec-kit/runtime/data/trigger-index.json | head` and check whether the hits sit under a `files` key or a trigger-pattern key.

## Negative results (worth recording as much as the finds)

**v4.0.0.16's git-call time limit holds where I looked.** The single unflagged git invocation in the hook roots is in the decision-capture core, and it *does* carry a budget — `timeout: 5000` on the `execFileSync('git', [...], {...})` that resolves the repo root [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:251-256]. It also strips `GIT_DIR` / `GIT_WORK_TREE` before running, so a hostile environment cannot redirect the root resolution. No other hook root produced an `execSync('git` / `spawnSync('git` / `execFileSync('git` match. So the one raw-stdin bypass (f-iter006-001) has no raw-git counterpart.

**Most Hermes hits are correctly inert.** Excluding changelog, specs, tests and fixtures, the surviving `hermes` matches were: a Pi cache-optimizer *model-family* matcher (`isHermesLikeModel`, `'Nous / Hermes / OpenHermes'`, the 'Hermes cache' label) at [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:2140-2145]; two test fixtures whose *prompt text* happens to read "Commit orca & sync Hermes" ([SOURCE: .skilled/hooks/decision-capture/lib/capture-core.test.mjs:407]); and one diagram asset. The cache-optimizer hits are about the Nous/Hermes model family served by an API — a different namespace from the `cli-hermes` CLI being removed, and correctly out of scope of the removal. I classify these as **not** residue.

## Questions Answered

- **Hermes removal (v4.0.2.0): which hook, plugin, advisor or routing files still reference Hermes, .hermes/ or a hermes runtime flag?** — Answered. The advisor surface, `.claude`, `.codex`, `.devin`, `.cursor`, `.opencode`, `.dsh`, `.pi/extensions` hook roots and `.skilled/bin` are clean. Two real residues remain: the doctor's `agents-md-manifest.json` payload (live, propagates into vendored repos — f-iter006-002) and the trigger index's `cli-hermes-creation` file paths (f-iter006-005). The Pi cache-optimizer's Hermes hits are the model family, not the CLI — correctly retained.
- **Hook safety (v4.0.0.8, v4.0.0.16): do all hook entry points honor the three-second stdin deadline and the git-call time limit?** — Answered, no. The git-call limit holds in every hook root I searched. The stdin deadline does not: the Claude ask-surface Stop hook reads stdin blocking with no deadline and is registered in `.claude/settings.json` (f-iter006-001), and the deadline value is not uniform across adapters (f-iter006-003).

## Questions Remaining

- Advisor transport (v4.0.0.0, v4.0.0.16): degraded local scoring and the shared daemon are still unexercised — carried four iterations now, and this iteration did not touch them.
- Which layer drops the advisor redirect, CLI handler or the shim's `recommend_with_native_advisor()` — carried unchanged.
- Advisor follow-ups from generation 1: the sk-doc `sk-create-skill-parent` shared-packet entry and duplicate `package_skill.py` — never reached.
- UX and extension: never reached.
- New: where the `node:test` hook suites actually run in CI, if anywhere. f-iter006-004's redundant suites only cost something if one of them is executed; if neither runs, the cost is larger and different.
- New: does `hook-flags.env` (live) carry `SYSTEM_ASK_SURFACE_DISABLED`, or only the `.example`? A disabled ask-surface switch would make f-iter006-001 unreachable in practice — unverified either way, and it decides f-iter006-001's real severity.
- New: does the doctor actually read `agents-md-manifest.json` verbatim into `AGENTS.md`, or transform it? That is the gap between f-iter006-002's "string exists" and "vendored repos get Hermes text".

## Next Focus

Close the two loose ends this iteration opened rather than opening new ground, since f-iter006-001 and f-iter006-002 are both one check away from changing severity:

1. Resolve whether the ask-surface guard is reachable in practice: read the live `.skilled/hooks/hook-flags.env` for `SYSTEM_ASK_SURFACE_DISABLED`, then prove f-iter006-001 with the spawn-with-open-stdin command above. Reachable + hangs = P1 confirmed; disabled = downgrade.
2. Resolve f-iter006-002's propagation: read the doctor command's write path to confirm the manifest string reaches `AGENTS.md` unmodified.
3. Then, and only then, spend the remaining iterations on the two directions that have been carried and never touched: advisor transport (daemon-down + two-launcher race) and the generation-1 advisor follow-ups.

## SCOPE VIOLATIONS

None. Every read was read-only; the only writes were this narrative, the delta file, and the append gateway's own writes into the run directory.

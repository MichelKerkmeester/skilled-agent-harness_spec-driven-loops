# Seat gpt-security — iteration 1 (global #73)

- Model: `claude-opus-4-8` · Executor: claude · Angle: gpt-security
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=0

## Analysis

## Security Review — Seat `gpt-security`: Command/arg injection in 027 spawn/exec sites

**Scope traced (read-only):** every `child_process` site in 027 new code — the three CLI shims, the three daemon launchers, and the shared model-server supervision lib they pull in.

### Spawn/exec inventory and verdict per site

| Site | Call | Command source | Arg source | Shell? | Injection? |
|---|---|---|---|---|---|
| `spec-memory.cjs:119`, `code-index.cjs:118`, `skill-advisor.cjs:114` | `spawnSync(execPath, [cliDist, ...argv.slice(2)])` | `process.execPath` (node) | `cliDist` = `path.join` of constants; rest = operator's own CLI argv | no | **no** |
| `mk-code-index-launcher.cjs:875`, `mk-skill-advisor-launcher.cjs:1150`, `launchServer` | `spawn(execPath, [server])` | node | `server` = fixed `path.join(kitDir,'mcp_server','dist','index.js')` | no | **no** |
| `mk-*-launcher.cjs:808` | `run('npm', [installCommand, '--no-audit','--no-fund','--silent'])` | `'npm'` | `installCommand` ∈ {`'ci'`,`'install'`} (constant) | no | **no** |
| `mk-*-launcher.cjs:810` | `run(execPath, [localTscEntrypoint(),'-p','tsconfig.json'])` | node | constant path + literals | no | **no** |
| `*launcher.cjs:418/448/424`, `model-server-supervision.cjs:102` | `spawnSync('ps', ['-o','ppid=','-p',String(pid)])` / `['-eo','pid=,ppid=,rss=']` | `'ps'` | `String(pid)` — numeric | no | **no** |
| `model-server-supervision.cjs:830` | `spawnFn(execPath, [modelServerPath])` | node | constant `bin/hf-model-server.cjs` path | no | **no** |

### Key findings of the trace

1. **No `shell:true` anywhere** in `.opencode/bin/**` (grep confirmed empty), and **no `exec`/`execSync`/`os.system`** — every child process uses the array-argument `spawn`/`spawnSync` form, which bypasses the shell entirely. This eliminates the classic command-injection surface by construction.

2. **No attacker-controlled string is interpolated into a command or argument.** Commands are either `process.execPath`, or the literals `'npm'`/`'ps'`, or `path.join` of fixed constants. The only "variable" args are `String(pid)` (numeric), build-step literals, and the CLI pass-through.

3. **CLI shim pass-through is not node-flag injection.** `[cliDist, ...process.argv.slice(2)]` places `cliDist` as the script argument *first*; Node stops option parsing at the script path, so trailing user args land in the child script's `process.argv`, never as node options. No `--inspect`/`--experimental-*` smuggling.

4. **Defensive hardening already present:** launchers strip `^(NODE_|npm_|NPM_)` from the child env via `BLOCKED_CHILD_ENV_RE` (`mk-code-index-launcher.cjs:22`, `buildChildEnv` :749) before spawning the node child — this actively blocks `NODE_OPTIONS`/npm-config env injection into spawned children.

### Considered and rejected (would be refuted in round 2)

- **Bare `npm`/`ps` resolved via `PATH`** (no absolute path): in this trust model these are local developer tools the operator launches from their own editor/shell, with the operator's own `PATH`. There is no untrusted-input boundary feeding `PATH`, so this is standard practice, not an injection vuln. Not a finding.
- **Shims pass `env: process.env` unchanged:** that env is the operator's own; no external attacker vector. Not a finding.

There is genuinely no command or argument injection in the 027 spawn/exec surface. I will not manufacture a P2 to fill space — the angle is clean.

```json
{"seat":"gpt-security","model":"openai/gpt-5.5-fast","angle":"Command/arg injection in any spawn/exec/child_process in 027 new code (launchers, CLIs, scripts).","verdict":"PASS","summary":"All 027 spawn/spawnSync sites use array-arg form, no shell:true, no exec/execSync; commands are node/npm/ps/fixed paths with no attacker-controlled interpolation. NODE_/npm_ env stripped from children. No injection.","files_reviewed":[".opencode/bin/spec-memory.cjs",".opencode/bin/code-index.cjs",".opencode/bin/skill-advisor.cjs",".opencode/bin/mk-code-index-launcher.cjs",".opencode/bin/mk-skill-advisor-launcher.cjs",".opencode/bin/mk-spec-memory-launcher.cjs",".opencode/bin/lib/model-server-supervision.cjs"],"findings":[]}
```

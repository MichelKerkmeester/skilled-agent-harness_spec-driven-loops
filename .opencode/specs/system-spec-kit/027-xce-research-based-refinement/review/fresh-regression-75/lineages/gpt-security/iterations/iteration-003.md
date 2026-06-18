# Seat gpt-security — iteration 3 (global #75)

- Model: `claude-opus-4-8` · Executor: claude · Angle: gpt-security
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=0

## Analysis

I've traced the full permission/sandbox-default surface of the 027 dispatch/executor code. Here is my review.

## Analysis — Seat: gpt-security (permission/sandbox defaults)

**Scope traced (real behavior, not names):**

1. **Three CLI front-doors** (`.opencode/bin/{spec-memory,code-index,skill-advisor}.cjs`) — structurally identical thin shims. Each: sets the IPC socket dir to a `0o700` directory (`fs.mkdirSync(..., { mode: 0o700 })`), enforces a Darwin `sun_path` length guard, verifies dist freshness, then `spawnSync(process.execPath, [cliDist, ...process.argv.slice(2)], { stdio: 'inherit' })`. **No** `bypassPermissions`, `--dangerously-skip-permissions`, `workspace-write`, `shell: true`, or any permission flag. Argv is forwarded verbatim to a fixed Node entrypoint — no shell, no injection surface.

2. **Trusted-mutation gate** (`skill-advisor-cli.ts:342-344, 659-684`) — the actual permission boundary. Default is **untrusted** (`trustedDefault` from `envTrustedDefault()`, which is off unless an operator sets `MK_SKILL_ADVISOR_CLI_TRUSTED=1`). `assertTrustedForMutation` covers **all three** mutators: `advisor_rebuild`, `skill_graph_scan`, and `skill_graph_propagate_enhances` in apply-mode (`mode==='apply' && dryRun!==true`). The gate runs on post-schema-default args (`validated`), so it matches what the server sees. Reads pass through untrusted. This is correct fail-closed design.

3. **Codex/CLI executor recipes** (`cli-codex/**`) — every hit for `workspace-write`/`danger-full-access` is in **documentation/reference tables**, not baked into dispatch code. Documented defaults are `read-only` for review/context/research; `danger-full-access` is explicitly gated behind "**requires explicit user approval**." No executor *code* in scope auto-applies an unsafe sandbox level.

4. **Daemon launchers** (`mk-{spec-memory,code-index,skill-advisor}-launcher.cjs` + `bin/lib/*`) — daemon spawn/dispatch core. All `spawn`/`spawnSync` use **array-arg form** (no `shell: true` anywhere). Server binary resolved from fixed module-relative `kitDir`; interpreter is `process.execPath`; `nodeArgs` is bounded to a parsed-int `--max-old-space-size`. No arbitrary-binary-or-flag-from-env vector. Lease/temp/log files created `0o600`, DB and socket dirs `0o700`, lease writes use `wx` exclusive-create.

**Borderline item considered and rejected as a finding:** `envTrustedDefault()` lets an operator pre-authorize all mutations via env var. This is operator-controlled, documented, and CLAUDE.md explicitly forbids prompt-time hooks from running mutations — an intentional escalation path, not an unsafe baked-in default. Per method rule 3 (documented design choices are not bugs), not reported.

**Conclusion:** No unsafe permission/sandbox default is baked into the 027 dispatch, executor, or permissions-gate code. The surface is fail-closed throughout (untrusted-by-default gate, read-only sandbox defaults, no shell spawns, restrictive file/dir modes). My fresh angle found nothing real beyond what prior passes already hardened.

```json
{"seat":"gpt-security","model":"openai/gpt-5.5-fast","angle":"Permission/sandbox defaults: any unsafe default (bypassPermissions / --dangerously-skip-permissions / workspace-write) baked into dispatch/recipe code.","verdict":"PASS","summary":"No unsafe permission/sandbox default baked into 027 dispatch/executor code. CLI shims pass-through argv; mutation gate default-untrusted covering all 3 mutators; launchers use array-arg spawns, 0o700/0o600 perms, no shell.","files_reviewed":[".opencode/bin/spec-memory.cjs",".opencode/bin/code-index.cjs",".opencode/bin/skill-advisor.cjs",".opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts",".opencode/bin/mk-spec-memory-launcher.cjs",".opencode/bin/mk-code-index-launcher.cjs",".opencode/bin/mk-skill-advisor-launcher.cjs",".opencode/bin/lib/launcher-ipc-bridge.cjs",".opencode/bin/lib/launcher-session-proxy.cjs",".opencode/skills/cli-codex/SKILL.md"],"findings":[]}
```

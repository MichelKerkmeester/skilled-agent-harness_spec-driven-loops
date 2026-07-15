# MCP Disconnect RCA: `mk_code_index` + `mk-spec-memory`

Date: 2026-05-18
Scope: read-only RCA plus this scratch note. No source fix applied.

## 1. Confirmed Symptoms

Main-agent observed symptoms:

- Claude Code reports `mk_code_index` and `mk-spec-memory` as "Failed to reconnect" with JSON-RPC error `-32000`.
- `mk_skill_advisor` reconnects successfully.
- Launcher lease files showed live owners around 21:33-21:40 local time:
  - `mk-spec-memory`: `.opencode/skills/system-spec-kit/mcp_server/database/.mk-spec-memory-launcher.json` had `pid: 4790`, `startedAt: 2026-05-18T19:33:32.306Z`.
  - `mk-code-index`: `.opencode/.spec-kit/code-graph/database/.mk-code-index-launcher.json` had `pid: 11634`, `startedAt: 2026-05-18T19:40:53.795Z`.
  - `mk-skill-advisor`: `.opencode/skills/system-skill-advisor/mcp_server/database/.mk-skill-advisor-launcher.json` had `pid: 7711`, `startedAt: 2026-05-18T19:35:30.711Z`.

Verified locally:

- `ps`/`pgrep` are blocked in this sandbox (`operation not permitted` / `sysmond service not found`), so PID liveness could not be independently confirmed from the process table.
- All three server entrypoints pass `node --check`:
  - `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js`
  - `.opencode/skills/system-code-graph/mcp_server/dist/index.js`
  - `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/mcp_server/advisor-server.js`
- Re-running the duplicate launchers without killing anything reproduced the important divergence:
  - `mk-spec-memory-launcher.cjs` exits `1` with `Error: kill EPERM` at `leaseHeldFromFile()` line 137.
  - `mk-code-index-launcher.cjs` exits `1` with `Error: kill EPERM` at `leaseHeldFromFile()` line 171.
  - `mk-skill-advisor-launcher.cjs` exits `0` and prints `LEASE_HELD_BY:7711 startedAt=2026-05-18T19:35:30.711Z`.

Operational note: the duplicate `mk-spec-memory` probe briefly overwrote the runtime lease file via its failure path. I restored the exact prior lease JSON immediately.

## 2. Primary Hypothesis With Evidence

Primary root cause: `mk-spec-memory` and `mk-code-index` do not handle `EPERM` from `process.kill(pid, 0)` during lease probing. In this Claude/Codex sandbox, probing a live lease owner can return `EPERM`, not only success or `ESRCH`. The two failing launchers treat `EPERM` as fatal, so they exit before spawning or reconnecting an MCP child. Claude then sees no valid JSON-RPC initialize handshake and reports reconnect failure.

Evidence:

- `.opencode/bin/mk-spec-memory-launcher.cjs:132-141` only handles `ESRCH`; all other errors are thrown.
- `.opencode/bin/mk-code-index-launcher.cjs:166-175` has the same `ESRCH`-only branch.
- `.opencode/bin/mk-skill-advisor-launcher.cjs:171-180` handles both `ESRCH` and `EPERM`; `EPERM` returns `{ held: true }`.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts:226-254` also treats `EPERM` as a live held lease.
- Commit `65761c8fb3 feat(006/007): close skill-advisor zombie launcher root cause` changed only skill-advisor launcher/test files, so this EPERM behavior was not propagated to spec-memory or code-index.

The duplicate-launcher smoke is the cleanest proof:

```text
mk-spec-memory: Error: kill EPERM ... mk-spec-memory-launcher.cjs:137
mk-code-index:  Error: kill EPERM ... mk-code-index-launcher.cjs:171
mk-skill-advisor: LEASE_HELD_BY:7711 ... exit 0
```

This also explains why a launcher can look "alive" while the current Claude session is disconnected: a stdio MCP reconnect attempt cannot attach to another session's existing stdio child. The launcher must either start a valid child for this session or fail cleanly. Crashing during lease probe produces the observed JSON-RPC reconnect failure.

## 3. Secondary Hypotheses

### Recent Ollama commit / stale dist

Commit `75b4391e38 feat(016/002/006): wire OllamaAdapter into shared/embeddings factory` did change the spec-memory embedding path:

- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:19-25` imports `providers/ollama.js`.
- `.opencode/skills/system-spec-kit/shared/dist/embeddings/factory.js:12` contains the compiled Ollama import.
- `.opencode/skills/system-spec-kit/shared/dist/embeddings/factory.js:46` includes `ollama` in `SUPPORTED_PROVIDERS`.
- Import probe of spec-kit shared factory succeeded and resolved auto mode to `ollama` from `vec_metadata active_embedder_name=jina-embeddings-v3 (1024-dim)`.

That lowers suspicion for a spec-memory syntax/import crash. The commit file list did not include tracked `shared/dist` or `mcp_server/dist` artifacts, but those dist directories are not tracked by git in this checkout. Current local `shared/dist` does include the Ollama provider.

### Code-index stale copied shared dist

Code-index has a stale copied `system-spec-kit/shared` dist tree under `.opencode/skills/system-code-graph/dist/system-spec-kit/shared/embeddings/factory.js`:

- It still lists `SUPPORTED_PROVIDERS = ['openai', 'voyage', 'hf-local', 'llama-cpp', 'auto']`.
- It has no Ollama branch.
- Probe with `EMBEDDINGS_PROVIDER=ollama` throws `Invalid EMBEDDINGS_PROVIDER "ollama"`.

This is a real latent bug, but less likely to be the immediate reconnect root cause because the active `mk-code-index` entrypoint is `.opencode/skills/system-code-graph/mcp_server/dist/index.js`, which imports `../../dist/system-code-graph/mcp_server/index.js`; the active `system-code-graph` server path does not import `@spec-kit/shared/embeddings` at startup. It may still break if a future code-index path uses the stale copied spec-memory modules or inherits `EMBEDDINGS_PROVIDER=ollama`.

### Artifact freshness asymmetry

`mk-skill-advisor-launcher.cjs` has `latestSourceMtimeMs()` and verifies artifacts are newer than source before launch. `mk-spec-memory-launcher.cjs` and `mk-code-index-launcher.cjs` only check that required artifacts exist. That means stale dist can survive for the failing two launchers. This is not the smoking gun for the current `EPERM` reconnect failure, but it is a design gap worth fixing in the same launcher-hardening packet.

### Logs

I found runtime lease JSONs and Claude/Codex logs, but no local Claude log lines matching `mk-code-index`, `mk-spec-memory`, `Failed to reconnect`, `-32000`, `EBADF`, or `ECONNREFUSED`. The actionable failure evidence came from re-running the launchers and reading their stderr.

## 4. Proposed Fix

Do not change server code first. Fix launcher parity first.

1. Add `EPERM` handling to both launcher `leaseHeldFromFile()` implementations:
   - `.opencode/bin/mk-spec-memory-launcher.cjs`
   - `.opencode/bin/mk-code-index-launcher.cjs`

   Behavior should match skill-advisor:

   ```js
   if (error.code === 'EPERM') {
     return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath };
   }
   ```

2. Add regression tests beside the existing live-owner lease tests:
   - `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts`
   - `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts`

   The tests should mock or fixture the probe behavior so `process.kill(pid, 0)` throws `{ code: 'EPERM' }`, then assert exit `0` with `LEASE_HELD_BY:<pid>`.

3. Consider copying the skill-advisor freshness check shape into both launchers:
   - `latestSourceMtimeMs()`
   - artifact mtime check, not just existence

4. Rebuild code-graph dist after the launcher fix so copied/shared dist is not stale, or narrow the code-graph `tsconfig.json` include set so it does not emit unrelated `system-spec-kit`/`system-skill-advisor` dist copies.

## 5. How To Verify The Fix

Smoke commands after applying the fix:

```bash
node .opencode/bin/mk-spec-memory-launcher.cjs
node .opencode/bin/mk-code-index-launcher.cjs
node .opencode/bin/mk-skill-advisor-launcher.cjs
```

Expected duplicate-owner behavior in this sandbox:

- all three exit `0`
- all three print `LEASE_HELD_BY:<pid> startedAt=<iso-date>`
- no `kill EPERM` stack

Focused tests:

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp_server test -- tests/launcher-lease.vitest.ts
npm --prefix .opencode/skills/system-code-graph test -- mcp_server/tests/launcher-lease.vitest.ts
npm --prefix .opencode/skills/system-skill-advisor/mcp_server test -- tests/launcher-lease.vitest.ts
```

Build/freshness checks:

```bash
npm --prefix .opencode/skills/system-spec-kit run build
npm --prefix .opencode/skills/system-code-graph run build
node --check .opencode/skills/system-spec-kit/mcp_server/dist/context-server.js
node --check .opencode/skills/system-code-graph/mcp_server/dist/index.js
```

Ollama sanity probes:

```bash
node -e "import('./.opencode/skills/system-spec-kit/shared/dist/embeddings/factory.js').then(m => console.log(m.SUPPORTED_PROVIDERS, m.resolveProvider()))"
EMBEDDINGS_PROVIDER=ollama node -e "import('./.opencode/skills/system-code-graph/dist/system-spec-kit/shared/embeddings/factory.js').then(m => console.log(m.SUPPORTED_PROVIDERS, m.resolveProvider()))"
```

The second probe currently fails because code-graph's copied shared dist is stale. After a full rebuild or tsconfig cleanup, it should either support `ollama` or no longer contain/route through that stale copied tree.

## Commit Handoff

Suggested commit:

```text
fix(016/006): handle EPERM lease probes in spec-memory and code-index launchers
```

Suggested scope:

- `.opencode/bin/mk-spec-memory-launcher.cjs`
- `.opencode/bin/mk-code-index-launcher.cjs`
- `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts`
- `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts`
- optional follow-up: launcher artifact freshness parity and code-graph tsconfig/dist cleanup

Do not commit this RCA note as the fix commit unless the maintainer wants scratch evidence included.

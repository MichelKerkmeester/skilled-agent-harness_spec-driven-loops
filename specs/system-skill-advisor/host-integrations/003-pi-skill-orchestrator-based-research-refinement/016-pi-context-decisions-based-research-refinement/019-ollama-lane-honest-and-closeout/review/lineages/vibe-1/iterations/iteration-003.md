# Review Iteration 003

## Dispatcher

- Mode: review (fan-out lineage `vibe-1`)
- Session: `fanout-vibe-1-1795172940208-84a42n`, generation 1, lineageMode `new`
- Iteration: 3 of 16
- Dimension: security
- Frontier node: none bound (both seeded nodes have their correctness pass; this iteration rotates to the next uncovered dimension)
- Operator review focus: the commits `31ffd18beab`, `1ccbb3283c6`, `dc3979eb451`, `86038dfba80`, `c74042fd559`, `571575632a4`, `5c91b2f3f5d`, `0390556ee2b` and the ten `docs(specs)` commits, read at HEAD, reporting defects in shipped behavior only.
- How this iteration addressed the focus: it reviewed the trust boundaries the focus's "launcher liveness, `OLLAMA_*` passthrough, generation counter" clause introduced -- the child environment allowlist, the database-directory pin, the generation path resolver and the heartbeat watchdog -- at HEAD.

## Files Reviewed

- `.skilled/bin/system-skill-advisor-launcher.cjs:134-200` (`CHILD_ENV_ALLOWLIST`)
- `.skilled/bin/system-skill-advisor-launcher.cjs:319-352` (`createChildEnv`)
- `.skilled/bin/system-skill-advisor-launcher.cjs:396-401` (`resolvedAdvisorDbDir`)
- `.skilled/bin/system-skill-advisor-launcher.cjs:1554-1580` (`heartbeatVerdict`, startup grace)
- `.skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:40-80` (`getSkillGraphGenerationPath`, `sameDirectory`)
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1439-1490` (`refreshEmbeddingsInBackground` opt-out)
- `.skilled/skills/system-skill-advisor/runtime/lib/daemon/liveness.ts:110-140` (heartbeat writer)
- `.skilled/skills/system-skill-advisor/runtime/advisor-server.ts:385-460` (liveness monitor and startup refresh order)
- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:394-397`
- `.env.example:409`
- `.github/workflows/skill-advisor-stress.yml:46-50`
- `.skilled/bin/launcher-threshold-env.vitest.ts:18-60`
- `.skilled/bin/launcher-heartbeat-watchdog.vitest.ts:97-135,195-210`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The background-refresh disable switch fails open on any value other than `off`** -- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1445` -- the opt-out is `process.env.SYSTEM_SKILL_ADVISOR_EMBED_REFRESH?.toLowerCase() === 'off'`, so `false`, `0`, `no`, `disabled` and `off ` (with a trailing space) all leave the refresh enabled, and the launcher now forwards the variable to the shared daemon.
   Finding class: `fail_open_control`
   Scope proof: inside the declared review target (`.skilled/skills/system-skill-advisor`, `.skilled/bin/system-skill-advisor-launcher.cjs`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.env.example`).
   Affected surface hints: the daemon's Ollama call volume, the `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH` row in `ENV-REFERENCE.md:394`, the `.env.example:409` comment, the stress workflow's `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH: 'off'`.
   Case: an operator who wants the daemon to stop calling Ollama writes `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH=false` in their shell profile, following the boolean convention every other `SPECKIT_*` switch in `ENV-REFERENCE.md` uses. The launcher forwards `false` to the daemon, the exact-string check does not match `off`, and the daemon keeps refreshing vectors on every startup and watcher reindex. The documented value is `off`, so this is hardening rather than a contract break.

2. **`OLLAMA_BASE_URL` is forwarded and used without a loopback check, so the shared daemon ships the whole corpus to whatever host the first caller names** -- `.skilled/bin/system-skill-advisor-launcher.cjs:185` -- the allowlist admits `OLLAMA_BASE_URL` and `createChildEnv` forwards it unchanged, and the daemon's probe and embed both read it, so the destination of every skill description and command text is decided by whichever process started the launcher.
   Finding class: `unvalidated_destination`
   Scope proof: inside the declared review target (`.skilled/bin/system-skill-advisor-launcher.cjs`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`).
   Affected surface hints: `resolveOllamaBaseUrl`, `probeOllamaModel`, the background refresh's embed calls, the `OLLAMA_BASE_URL` row in `ENV-REFERENCE.md:395`.
   Case: a project-local `.env` or a tool wrapper exports `OLLAMA_BASE_URL=https://embeddings.example.net`. The launcher starts the shared daemon with that value, and the startup refresh sends all 58 skill descriptions and 11 command texts to that host. Decision D1 approves forwarding `OLLAMA_*`; it does not approve an unvalidated destination, and `ENV-REFERENCE.md:395` documents the default as `http://127.0.0.1:11434` without saying a remote host is accepted.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | partial | `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:394`, `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1445` | The env reference documents `off` as the only disable value and the code matches it exactly; the reference does not say whether a non-loopback `OLLAMA_BASE_URL` is supported. |
| `checklist_evidence` | notApplicable | - | The review target is a file list, not a spec folder, so there is no `checklist.md`. |

## Integration Evidence

- `.skilled/bin/system-skill-advisor-launcher.cjs:144` -- `SYSTEM_SKILL_ADVISOR_DB_DIR` is an exact allowlist key, so the parent environment can redirect the daemon's state directory; `createChildEnv` pins it only when the source environment has none (`:326-328`).
- `.skilled/bin/system-skill-advisor-launcher.cjs:185-189` -- the three new keys (`OLLAMA_BASE_URL`, `OLLAMA_REQUEST_TIMEOUT_MS`, `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH`) are exact keys, not prefix widenings.
- `.skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:55-70` -- the generation path compares the override against the workspace's default database directory with `realpathSync` and keeps the shared counter when they match.
- `.skilled/skills/system-skill-advisor/runtime/lib/daemon/liveness.ts:136` -- the heartbeat is written once at monitor start, before `advisor-server.ts:439` fires the startup refresh, so the 300 s startup grace is not consumed by a slow refresh.
- `.github/workflows/skill-advisor-stress.yml:49` -- the stress workflow sets `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH: 'off'`, which is the exact value the check accepts.

## Edge Cases

- **Ambiguity: is `OLLAMA_BASE_URL` forwarding a security defect or an approved decision?** Decision D1 in the owning packet's `goal.md` approves "`OLLAMA_*` forwarding". I recorded the unvalidated destination as P2 hardening rather than a P1, because the forwarding itself is approved and only the missing loopback check is unapproved.
- **Contradiction: the env reference documents `off` while every sibling switch accepts booleans.** `ENV-REFERENCE.md:394` says "set to `off` to disable"; the neighbouring `SPECKIT_ADVISOR_RRF_FUSION` row accepts `true`/`1`/`yes`/`on`/`enabled`. I kept the lower severity because the documented contract is unambiguous.
- **Missing dependency: the Ollama adapter is a re-export shim** (`.skilled/skills/system-skill-advisor/runtime/lib/embedders/adapters/ollama.ts:7` re-exports `@spec-kit/shared/embeddings/adapters/ollama.js`), and decision D4 freezes `system-spec-kit/shared/embeddings`, so the adapter's own URL handling is outside this review's scope and was not assessed.
- **Partial success: the generation-counter fix is sound.** The override comparison canonicalizes both sides and keeps the shared counter for the default directory; the sandbox case still writes beside the override.

## Confirmed-Clean Surfaces

- The child environment allowlist is exact-key only; no entry widens by prefix, and `MEMORY_DB_PATH` is deliberately absent so the ambient repo-wide name cannot leak (`system-skill-advisor-launcher.cjs:196-200`).
- `createChildEnv` computes `MEMORY_DB_PATH` from the dedicated `SYSTEM_SKILL_ADVISOR_MEMORY_DB_PATH` override or from `advisorDbPath()`, never from an ambient `MEMORY_DB_PATH` (`:334-341`).
- `getSkillGraphGenerationPath` anchors to `findAdvisorWorkspaceRoot(workspaceRoot)` before joining the state-relative path, so a caller passing a spec folder cannot write a stray counter into that packet (`generation.ts:55-70`).
- `sameDirectory` canonicalizes both sides with `realpathSync` and falls back to `resolve` when a path does not exist, so a symlinked override that names the default directory still keeps the shared counter (`generation.ts:72-80`).
- `heartbeatVerdict` returns `not-armed` inside the 300 s startup grace and `stale` past it, so a child that never writes a heartbeat is reaped while a slow starter is not (`system-skill-advisor-launcher.cjs:1570-1578`).
- The heartbeat writer runs once at monitor start and then on an interval (`liveness.ts:136-137`), and the monitor is created before the startup refresh is fired (`advisor-server.ts:391` versus `:439`).

## Ruled Out

- **The launcher can be made to forward an arbitrary ambient variable.** Ruled out: the filter is `CHILD_ENV_ALLOWLIST.has(key)` with exact keys only (`system-skill-advisor-launcher.cjs:320-322`).
- **The database-directory pin can be bypassed by an empty value.** Ruled out: the filter keeps only `typeof value === 'string'` entries and the pin applies whenever the filtered value is `undefined`, which an empty string is not -- an empty string is forwarded and `resolvedAdvisorDbDir` then resolves it to the process cwd, which is the documented sandbox behavior.
- **The generation counter can be redirected outside the workspace without an explicit override.** Ruled out: the anchored resolver joins the repo root with a fixed relative path (`generation.ts:70`).
- **The watchdog can kill a healthy daemon during a slow startup refresh.** Ruled out: the heartbeat is written before the refresh is fired (`liveness.ts:136`, `advisor-server.ts:391`).
- **The stress workflow can embed against a live Ollama.** Ruled out: it sets the exact `off` value the check accepts (`skill-advisor-stress.yml:49`).

## Next Focus

- Dimension: traceability
- Focus area: the ten `docs(specs)` commits `2f5fe41bb9e` to `aaaff7dd9df` and the `decision-record.md` answers they wrote, plus the feature-catalog pages the two feature commits changed
- Reason: security is covered; traceability is the next uncovered dimension and the focus's third clause is the 231 ended-session answers, which no iteration has read yet.
- Rotation status: correctness covered twice (F-1-001, F-1-004); security covered; traceability next.
- Blocked/productive carry-forward: productive -- reading the env reference against the code found both P2s; keep that order.
- Required evidence: whether each written answer matches the question it answers, whether the feature-catalog pages describe the shipped behavior, and whether the `decision-record.md` files are well-formed.
- Recovery note: not applicable.

Review verdict: CONDITIONAL

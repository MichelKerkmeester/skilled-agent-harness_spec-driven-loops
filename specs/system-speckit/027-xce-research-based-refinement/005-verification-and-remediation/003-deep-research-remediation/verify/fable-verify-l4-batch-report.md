# Batch Still-Real Verification — L4 launcher lifecycle parity (15 findings)

> **Verifier:** fresh Fable 5 pass against CURRENT code, 2026-06-12.
> **Scope:** porting spec-memory launcher lease/heartbeat/reconnect hardening to mk-code-index, plus the doc surfaces that lag the shipped hardening.
> **Context checked:** the new daemon-side single-writer DB lock (`mcp_server/lib/search/db-instance-lock.ts`, exit-86 contract) was evaluated per item; it is spec-memory-daemon-side only and does not overturn any code-index finding (the code-graph DB has no equivalent lock, so the launcher lease layer remains the only guard there). Where it changes consequence severity it is noted per item.

## Summary

**Verdict: 15/15 STILL-REAL.** No item was overtaken by today's spec-memory DB-lock or doc-reconciliation work — none of the doc surfaces cited here were among those reconciled.

| id | verdict | current evidence | fix class |
| --- | --- | --- | --- |
| tri-030 | STILL-REAL | `mk-code-index-launcher.cjs:645-650` lease = `{pid, startedAt}` only; bridge prefers `leaseResult.socketPath` only when present (`launcher-ipc-bridge.cjs:393-399`) | code-small |
| tri-032 | STILL-REAL | `mk-code-index-launcher.cjs:331-333` ttlMs=60000; `:380-384` reclaim at ttl×2; only refresh is once post-spawn `:820-829`; no `setInterval` anywhere in file | code-small |
| tri-043 | STILL-REAL | `launcher-ipc-bridge.cjs:387-399` divergent-socket guard; `mk-code-index-launcher.cjs:900-906` bridges with only `{ownerPid, startedAt}`; `leaseHeldFromFile` (`:496-521`) returns no socketPath | code-small |
| tri-045 | STILL-REAL | gate at `manual_testing_playbook.md:142,145`; check `:149-170` counts files only; broken link live at `:2172` and `:3658`; measured: 410 files, 1 missing target, 85 orphan immediate files | code-small |
| tri-082 | STILL-REAL | `002-hardening-and-tests/spec.md:65` says NO owner lease / NO session proxy; `mk-skill-advisor-launcher.cjs:74` (`.skill-advisor-owner.json`), `:468`, `:207`, `:693-705` say otherwise | doc-only |
| tri-094 | STILL-REAL | `mcp_server/README.md:269` + `ENV_REFERENCE.md:179` say fresh session reaps released daemon; `mk-spec-memory-launcher.cjs:1562-1577` adopts a live bridgeable daemon | doc-only |
| tri-096 | STILL-REAL | `launcher_lease.md:37` still "prints LEASE_HELD_BY … exits with code 0"; `mk-code-index-launcher.cjs:894-914` bridges/respawns | doc-only |
| tri-097 | STILL-REAL | `daemon_lease_contract.md:48` "prints LEASE_HELD_BY … exits with code 0"; launcher bridges via `maybeBridgeLeaseHolder` (`mk-skill-advisor-launcher.cjs:693-705`) with respawn path | doc-only |
| tri-110 | STILL-REAL | launcher marker path honors only `MEMORY_DB_PATH` (`mk-spec-memory-launcher.cjs:678-682`); daemon honors `SPEC_KIT_DB_DIR` first (`core/config.ts:67-71`), marker written beside actual DB (`vector-index-store.ts:1067`) | code-small |
| tri-148 | STILL-REAL | `mk-code-index-launcher.cjs:813-818` owner spawns child `stdio:'inherit'`, exits on child exit `:831-840`; spec-memory owner is front-proxied (`mk-spec-memory-launcher.cjs:1641-1647`) | code-careful |
| tri-149 | STILL-REAL | duplicate of tri-096 (same doc, same drift) | doc-only |
| tri-165 | STILL-REAL | duplicate of tri-096/149 (same doc, same drift) | doc-only |
| tri-167 | STILL-REAL | `.opencode/bin/README.md:25` "experimental default-off"; `ENV_REFERENCE.md:179` default `1` via committed runtime configs | doc-only |
| tri-185 | STILL-REAL | spec-memory has persistent log (`:145-194`), re-election (`:196-214`), release (`:1439-1457`); zero matches for `persistLauncherLogLine`/`SPECKIT_DAEMON_REELECTION`/`LAUNCHER_LOG` in code-index and advisor launchers | doc-only |
| tri-187 | STILL-REAL | `changelog/v1.2.0.0.md:11` "no manifest to drift"; `code-index-cli-manifest.ts:10-19` + `:23-37` define and assert the manifest; manifest predates the changelog (2026-06-09 vs 2026-06-10) | doc-only |

### Interlocks / ship-together

1. **tri-030 + tri-043 are one finding seen from two sides** (lease payload vs bridge consumer) — one fix closes both: add `socketPath` to the code-index PID lease in `writeLeaseFile()` and thread it through `leaseHeldFromFile()` and the owner-lease bridge call, mirroring `mk-skill-advisor-launcher.cjs:786-791` / `:302-310`. **tri-032 should ship in the same packet** — it touches the same lease lifecycle code (`buildOwnerLease`/`refreshOwnerLeaseFile`) and a heartbeat timer plus a socketPath field are naturally one launcher edit; landing them separately double-touches the file and the lease schema.
2. **tri-096 = tri-149 = tri-165**: identical drift in the same doc (`system-code-graph/references/runtime/launcher_lease.md`); one rewrite closes all three. **Sequencing hazard:** rewrite this doc AFTER (or with) the tri-030/032/043 code changes, otherwise the rewritten doc must document the no-socketPath / no-heartbeat limitations and immediately go stale again.
3. **tri-094 + tri-167** are both re-election doc drift in the spec-memory doc set (`mcp_server/README.md`, `ENV_REFERENCE.md`, `bin/README.md`) — one doc batch. Include the stale in-code comment at `mk-spec-memory-launcher.cjs:200-201`, which repeats the same "reaps it before respawn" wording the code no longer matches.
4. **tri-097 + tri-082** both describe the advisor lifecycle; reconcile the reference doc and the phase spec against the same current-behavior matrix in one pass.

---

## Per-item notes

### tri-030 (P1) — code-index leases carry no owner socketPath — STILL-REAL

- `writeLeaseFile()` at `.opencode/bin/mk-code-index-launcher.cjs:645-650` writes exactly `{pid, startedAt}`. `buildOwnerLease()` (`:326-336`) carries `ownerPid/ppid/executablePath/startedAtIso/lastHeartbeatIso/ttlMs/canonicalDbDir` — no `socketPath` either.
- The bridge can only prefer a stored path when present: `.opencode/bin/lib/launcher-ipc-bridge.cjs:393-399` (`const storedSocketPath = leaseResult.socketPath; … ?? getIpcSocketPath(serviceName, { dbDir })`); the in-source comment (`:387-392`) explicitly names "the other launchers whose leases never carry it."
- The test codifying this gap is still live: `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-ipc-bridge-probe.vitest.ts:355-376` — "(4) A skill-advisor / code-index style lease (no socketPath) … a missing recomputed socket still reports no-bridge-socket." Note the test comment understates current reality: the **advisor now records socketPath** (`mk-skill-advisor-launcher.cjs:786-791`), so code-index is the lone outlier.
- **Risk:** a secondary launcher/CLI under a divergent `SPECKIT_IPC_SOCKET_DIR` sees the live owner lease but probes a recomputed (wrong) socket → `no-bridge-socket` report or dead-socket respawn churn against a healthy owner.
- **Fix class:** code-small. Interlocks with tri-043 (same fix) and tri-032 (same packet recommended).

### tri-032 (P1) — code-index owner lease heartbeat is non-periodic — STILL-REAL

- `buildOwnerLease()` stamps `lastHeartbeatIso` with `ttlMs: 60000` (`mk-code-index-launcher.cjs:331-333`); `classifyOwnerLease()` returns `stale-heartbeat-reclaim` when the heartbeat is older than `ttlMs * 2` (`:380-384`).
- The ONLY refresh is the single post-spawn `refreshOwnerLeaseFile()` call at `:820-829` (re-pointing ownerPid to the child). There is no `setInterval` anywhere in the file; `rg "setInterval"` returns nothing.
- Parity contrast confirmed in both siblings: `mk-spec-memory-launcher.cjs:513-529` (`startOwnerLeaseHeartbeat`, interval = ttl/2, started at `:1323`) and `mk-skill-advisor-launcher.cjs:529-534` (started at `:661` and `:715`).
- **Risk:** ~2 minutes after spawn, every healthy long-running code-index daemon's owner lease classifies as `stale-heartbeat-reclaim`, so each later secondary start reclaims/rewrites the owner lease before re-discovering the live PID lease and bridging — lease churn, reclaim-race exposure, and the owner lease stops being usable live-owner evidence.
- **Fix class:** code-small (port `startOwnerLeaseHeartbeat`, or drop heartbeat-based staleness from code-index classification). Ship with tri-030/043.

### tri-043 (P1) — code-index secondary bridge cannot survive divergent socket envs — STILL-REAL

- Same root cause as tri-030, verified from the consumer side: `launcherMain()` bridges a live owner passing only `{ownerPid, startedAt}` (`mk-code-index-launcher.cjs:900-906`), and the PID-lease bridge path (`:910-914`) passes `isLeaseHeld()` results whose `leaseHeldFromFile()` (`:496-521`) never returns a socketPath.
- The banked premise now fully holds: spec-memory records socketPath (`mk-spec-memory-launcher.cjs:887-892` `buildLeaseObject(…, socketPath)`; threaded at `:566-577`) and skill-advisor records it (`mk-skill-advisor-launcher.cjs:786-791`; threaded at `:302-310`). Code-index is the only launcher without it.
- **Risk:** as tri-030 — false `no-bridge-socket`/flap for secondaries in divergent socket envs.
- **Fix class:** code-small — same change as tri-030; treat as one work item.

### tri-045 (P1) — playbook release-readiness check does not prove linked scenario coverage — STILL-REAL

- The gate still claims it: `manual_testing_playbook.md:142` (100% coverage "defined by the root index and backed by per-scenario files") and `:145` ("Orphan scenario count is zero (every scenario file is linked in Section 12)").
- The deterministic check (`:149-170`) remains a bare file count asserting `TOTAL_FEATURES == 410` — it proves neither root-index linkage nor link resolution.
- Measured against live files (2026-06-12): 410 immediate scenario files; the root doc carries 326 distinct relative scenario links; **1 broken link target** — `scoring-and-calibration/102-Ollama runtime-optionaldependencies.md`, referenced at `:2172` and `:3658`, does not exist on disk; **85 orphan immediate scenario files** not linked from the root doc (banked figure was 185; the orphan population shrank but the gate is still materially weaker than it claims).
- **Risk:** release-readiness can report READY while scenarios are unlinked/unresolvable — the gate's two strongest clauses are unverified.
- **Fix class:** code-small (a CI/script guard that derives rows-vs-files from one inventory and fails on missing targets or orphans, per fix_sketch), plus repairing the one broken link.

### tri-082 (P2) — advisor lifecycle spec contradicts shipped owner-lease and proxy code — STILL-REAL

- `…/010-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests/spec.md:65` still asserts: "mk-skill-advisor has NO owner-lease file … the advisor launcher EXITS on child SIGTERM (no transparent recycle) and has NO reconnecting session proxy (raw bridge); re-election is gated by `SPECKIT_DAEMON_REELECTION`".
- Current launcher: `.skill-advisor-owner.json` owner lease (`mk-skill-advisor-launcher.cjs:74`, acquired at `:468` via `checkStrictSingleWriter` `:709-715`), reconnecting session proxy (`:207`, wired as the bridge at `:699`), owner-lease heartbeat (`:529-534`, started `:661`/`:715`), and a dead-socket respawn path (`:611-669`). Additionally, `SPECKIT_DAEMON_REELECTION` does not appear in the advisor launcher at all — that clause is wrong for this daemon too.
- **Risk:** tests/drills built from this spec pin the wrong single-owner and client-survival model and will assert behaviors the launcher no longer has.
- **Fix class:** doc-only (amend the phase-context baseline paragraph; reconcile with tri-097's reference rewrite).

### tri-094 (P2) — re-election docs still describe reap/respawn instead of adoption — STILL-REAL

- `mcp_server/README.md:269`: "A fresh session that finds the released daemon under a stale lease **reaps the recorded child before respawn**" — same row even cites the adoption test (`daemon-reelection-adoption-live.vitest.ts`) while keeping the reap prose. `ENV_REFERENCE.md:179`: "a fresh session after disposal reaps the released daemon before it spawns a replacement".
- Code adopts: `mk-spec-memory-launcher.cjs:1562-1577` — a live `childPid` with a bridgeable recorded socket is adopted via bridge ("stale-reclaim adopting live daemon pid … instead of reaping", `:1573`); reap+respawn (`:1584-1604`) runs only when the daemon is dead or unbridgeable.
- The in-code design comment at `:200-201` carries the same stale reap wording — include it in the fix.
- **Risk:** operators debugging multi-session contention expect a teardown that doesn't happen; wrong mental model for warm-daemon continuity.
- **Fix class:** doc-only. Batch with tri-167.

### tri-096 (P2) — code-index launcher lease doc still describes legacy exit-on-lease — STILL-REAL

- `system-code-graph/references/runtime/launcher_lease.md:37`: "If the recorded process is alive, the new launcher prints `LEASE_HELD_BY:<pid>` to stdout and exits with code `0`." The doc nowhere mentions the owner lease (`.code-graph-owner.json`), the session-proxy bridge, deep probing, or the dead-socket respawn path (grep for bridge/proxy/respawn across the doc: no hits).
- Current behavior: secondaries bridge through the reconnecting session proxy (`mk-code-index-launcher.cjs:894-914`), with `LEASE_HELD_BY` only as the fallback diagnostic (`:536-540`, bridge-module-missing/no-socket/disabled paths).
- **Risk:** operators treat a bridged secondary as an expected lease exit and mis-diagnose proxy-path failures.
- **Fix class:** doc-only — one rewrite also closes tri-149 and tri-165. Sequence after the tri-030/032/043 code changes (see Interlocks).

### tri-097 (P2) — advisor daemon lease contract omits launcher owner-lease bridge/respawn — STILL-REAL

- `system-skill-advisor/references/runtime/daemon_lease_contract.md:48`: "the launcher prints `LEASE_HELD_BY:<ownerPid>` to stdout and exits with code 0 without opening the database." The doc describes only the package daemon lease (`lib/daemon/lease.ts`) and never mentions `.skill-advisor-owner.json`, the session-proxy bridge, the `childPid`/`socketPath` lease payload, or dead-socket respawn.
- Current behavior: `bridgeOrReportLeaseHeld` (`mk-skill-advisor-launcher.cjs:693-705`) bridges through `bridgeStdioThroughSessionProxy` (`:207`) and may respawn (`respawnAfterDeadSocket`, `:611-669`); the lease payload carries `childPid` + `socketPath` (`:782-795`).
- **Risk:** materially wrong troubleshooting guidance for contention and orphan recovery on the advisor daemon.
- **Fix class:** doc-only — rewrite around the two-lease model (launcher owner lease + package daemon lease) with rows for bridge / stale reclaim / dead-socket respawn / child reaping. Reconcile together with tri-082.

### tri-110 (P2) — launcher clean-close barrier ignores SPEC_KIT_DB_DIR marker location — STILL-REAL

- Launcher: `uncleanShutdownMarkerPath()` at `mk-spec-memory-launcher.cjs:678-682` checks `MEMORY_DB_PATH`'s dirname, else `resolvedDbDir()` — which is the fixed skill-local database dir (`:318-320`). It never consults `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR`.
- Daemon: `computeDatabasePaths()` at `core/config.ts:63-95` resolves `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR` FIRST (`:67-71`), and the marker is written beside the actual resolved DB (`vector-index-store.ts:1005`, `:1067` — `path.join(path.dirname(target_path), UNCLEAN_SHUTDOWN_MARKER)`).
- So with `SPEC_KIT_DB_DIR` set and no `MEMORY_DB_PATH`, the launcher probes the wrong directory: `cleanCloseAfterReap` (`:695-697`) and the reap logging (`:736-741`) misclassify the handoff. The code comment (`:673-677`) acknowledges only the `MEMORY_DB_PATH` mirror and frames a wrong guess as best-effort.
- **Partially mitigated in consequence, not in substance:** the new daemon-side single-writer DB lock (`lib/search/db-instance-lock.ts`; launcher `EXIT_DB_LOCK_HELD = 86` handling at `mk-spec-memory-launcher.cjs:122-124`) now refuses a second writer at DB open, so a wrong cleanClose call can no longer contribute to a dual-writer scenario — but the misclassified reap logging/cleanClose evidence the finding describes is unchanged. **Cleaner fix path now exists:** persist the actual marker path (or the lock-derived canonical DB path) in the lease, rather than re-deriving env resolution in the launcher.
- **Risk:** stale-lease reap forensics report clean/unclean incorrectly under `SPEC_KIT_DB_DIR` overrides (test/CI environments most likely); boot self-heal still covers the DB itself.
- **Fix class:** code-small.

### tri-148 (P2) — code-index owner session is not front-proxied — STILL-REAL

- `mk-code-index-launcher.cjs:813-818` spawns the child with `stdio: 'inherit'` and the launcher exits when the child exits (`:831-840`); there is no owner-side `createSessionProxy` wrapping (the proxy is used only for secondary bridges, `:166-176`).
- Spec-memory front-proxies the owner: `mk-spec-memory-launcher.cjs:1641-1647` wraps owner stdin/stdout in `createSessionProxy` after launch.
- **Risk:** an owner-session backend recycle or child death closes the owner's MCP transport outright instead of reattaching — exactly the flap class the proxy was built to absorb; only code-index secondaries are reconnect-protected.
- **Fix class:** code-careful (front-proxying the owner path changes owner transport semantics and exit behavior; needs the recycle/replay test treatment spec-memory got). The doc-only fallback (explicitly documenting that only secondaries are reconnect-protected) is acceptable interim and folds into the tri-096 rewrite.

### tri-149 (P2) — Code Graph launcher lease reference describes pre-proxy behavior — STILL-REAL

- Duplicate of tri-096: same doc (`launcher_lease.md:37` plus the `{pid, startedAt}`-only payload section at `:43-56` which omits `.code-graph-owner.json` entirely), same code contrast (`mk-code-index-launcher.cjs:891-914` owner-lease acquisition + `bridgeOrReportLeaseHeld`).
- **Fix class:** doc-only — closed by the tri-096 rewrite; do not track as separate work.

### tri-165 (P2) — Code-graph lease reference still documents legacy LEASE_HELD_BY — STILL-REAL

- Duplicate of tri-096/149; additional current evidence: the PID-lease-held path also bridges (`mk-code-index-launcher.cjs:910-914`), and `LEASE_HELD_BY` is emitted only on bridge fallback (`:536-540`).
- **Fix class:** doc-only — closed by the tri-096 rewrite; do not track as separate work.

### tri-167 (P2) — bin README says re-election default-off; ENV reference says default-on — STILL-REAL

- `.opencode/bin/README.md:25`: "an experimental default-off daemon re-election". `ENV_REFERENCE.md:179`: default `1` (set by the committed runtime configs), "Enabled by default in `.mcp.json`, `opencode.json`, and `.codex/config.toml`"; `mcp_server/README.md:269` likewise says default-on via configs.
- **Risk:** maintainers reading the launcher README misread live owner-shutdown behavior (release-for-adoption vs kill).
- **Fix class:** doc-only — state "code-default-off, runtime-config-default-on". Batch with tri-094.

### tri-185 (P2) — re-election and persistent launcher logs are not tri-daemon uniform — STILL-REAL

- Spec-memory only: persistent launcher log (`mk-spec-memory-launcher.cjs:145-194`), re-election (`:196-214`), release-for-adoption path (`:1439-1457`).
- `rg "persistLauncherLogLine|SPECKIT_DAEMON_REELECTION|LAUNCHER_LOG"` across `mk-code-index-launcher.cjs` and `mk-skill-advisor-launcher.cjs`: **zero matches.** Code-index signal handlers kill the child and exit (`mk-code-index-launcher.cjs:849-867`); the advisor child-exit handler likewise cleans up and exits (`mk-skill-advisor-launcher.cjs:1148-1165`).
- **Risk:** incident comparison across the three daemons is asymmetric — flaps on code-index/advisor leave no durable launcher log and never release for adoption, which reads as anomalous if you generalize from spec-memory.
- **Fix class:** doc-only as the minimum (an explicit tri-daemon lifecycle matrix — natural home: `.opencode/bin/README.md` or the mcp_server README hardening table); extracting shared persistent-log/re-election primitives is a separate, larger code decision and should not block the doc fix.

### tri-187 (P2) — code-index changelog still says there is no manifest to drift — STILL-REAL

- `system-code-graph/changelog/v1.2.0.0.md:11`: "all eight tools … are CLI commands with **no manifest to drift**." Current code: `mcp_server/code-index-cli-manifest.ts:10-19` defines `EXPECTED_TOOL_NAMES` and `assertCodeIndexCliManifest()` (`:23-37`) hard-fails on mismatch.
- Git history shows the manifest (added 2026-06-09, `4870a6b3f8`) **predates** the changelog (added 2026-06-10, `3b3b14fbf8`) — so this was wrong at publication, not later drift; the "add a later-hardening note" framing in the banked fix_sketch is the wrong shape. Correct the sentence itself.
- **Risk:** misleads maintainers investigating parity failures or adding a ninth tool (they'd miss the manifest assert).
- **Fix class:** doc-only.

---

## Fix-class roll-up

- **doc-only (10):** tri-082, tri-094, tri-096, tri-097, tri-149, tri-165, tri-167, tri-185, tri-187 — and effectively 7 work items after dedup (096/149/165 = one rewrite; 094+167 = one batch).
- **code-small (4):** tri-030 + tri-043 (one fix), tri-032 (same packet), tri-045, tri-110.
- **code-careful (1):** tri-148 (owner front-proxy; doc-only interim acceptable inside the tri-096 rewrite).

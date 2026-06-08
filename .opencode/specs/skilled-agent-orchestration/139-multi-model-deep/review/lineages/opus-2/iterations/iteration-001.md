# Iteration 1: Daemon re-election + reap + hook-portability (all dimensions, opus-2 lineage)

## Focus
Single-pass review (maxIterations=1) across correctness, security, traceability, and
maintainability of the recent daemon-reliability work. All 12 in-scope files read in full:

- `.opencode/bin/mk-spec-memory-launcher.cjs` (1613 lines — read fully)
- `.opencode/bin/lib/model-server-supervision.cjs`
- `.opencode/bin/lib/launcher-ipc-bridge.cjs`
- `.opencode/bin/lib/launcher-session-proxy.cjs`
- `.opencode/bin/mk-code-index-launcher.cjs`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-release-integration.vitest.ts`
- `.opencode/scripts/session-cleanup.sh`
- `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh`
- `.claude/settings.local.json`, `.codex/hooks.json`, `.devin/hooks.v1.json`

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 12 / 12
- New findings: P0=0 P1=0 P2=7
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0 (first/only pass, all findings new)

## Overall assessment

This is a carefully engineered changeset. The core single-writer invariants are well
defended:

- The owner-lease `O_EXCL` open is the spawn mutex; `acquireOwnerLeaseFile()` re-reads
  after a last-writer-wins reclaim so two launchers racing a stale lease cannot both act
  as owner (`mk-spec-memory-launcher.cjs:469-481`).
- Lease cleanup is correctly scoped to the owner: `clearLeaseFile()` unlinks only when
  `lease.pid === process.pid` (`:955`) and `clearOwnerLeaseFile()` no-ops unless this
  process recorded `ownerLeasePid` (`:529`). A *secondary* launcher's SIGTERM/exit
  therefore cannot tear down the owner's daemon lease — verified by tracing the
  bridge-and-return path in `main()`.
- The reap-before-respawn fix on the stale-reclaim branch (`main()` `:1482-1502`) reaps the
  recorded `childPid` under the owner-lease mutex and bails to a `LEASE_HELD` JSON-RPC
  error on EPERM, so a fresh session cannot spawn a second writer onto the same WAL DB.
- The re-election release path (`shutdownLauncherForSignal` `:1372-1385`) detaches the
  `exit` handler before dropping ownership so the daemon lease (its socket path) survives
  for adoption, and the reconnecting session proxy (`launcher-session-proxy.cjs`) has
  genuinely thorough reattach/replay/keepalive/backpressure handling with replayable vs
  unsafe tool partitioning.
- `session-cleanup.sh` is defensively correct: it refuses the unsafe PPID fallback,
  re-proves session ancestry immediately before each kill (`:86-101`), and the detached
  re-election daemon (reparented to init) is correctly invisible to its descendant walk.

No correctness or security defect rising to P0/P1 was substantiated by reading the code.
The findings below are all P2 (maintainability / test-weakness / cross-runtime parity /
defense-in-depth), recorded as advisories.

## Findings

### P0, Blocker
None.

### P1, Required
None.

### P2, Suggestion

- **F001**: mk-code-index has no orphan-reap guard for a SIGKILL'd owner,
  `mk-code-index-launcher.cjs:916`. The stale-reclaim branch only logs `staleReclaimed:
  true` and falls straight through to `buildIfNeeded → writeLeaseFile → launchServer`,
  with no reap of a possibly-still-live prior child. mk-spec-memory got the
  reap-before-respawn fix precisely to avoid a double writer here; mk-code-index cannot do
  the same because its lease (`writeLeaseFile()` `:645-650`) records only `{pid, startedAt}`
  and never a `childPid`. In the normal SIGTERM path the child is killed by the signal
  handler (`:851-866`), and an inherited-stdio child usually self-exits on host stdin-EOF,
  so the exposure is bounded — but a SIGKILL'd code-index launcher can leave an orphaned
  server holding `code-graph.sqlite` open while a fresh launcher respawns a second one.
  This is a defense-in-depth asymmetry vs the mk-spec-memory fix, not a confirmed live
  double-write. *Dimension: correctness.*

- **F002**: The headline guarantee — a *live* secondary keeps transport across a
  re-election reap+respawn — is not covered,
  `daemon-reelection-adoption-live.vitest.ts:210-243`. Case 1 (`:183`) proves a secondary
  survives when the daemon is merely RELEASED (it never dies, so no reconnect is
  exercised). Case 2 (`:210`) proves a FRESH session reaps the orphan and asserts a clean
  single-writer (`sqliteOpenerPids === 1`) — but there is NO live secondary present at reap
  time. The dangerous composite (secondary bridged to the daemon WHILE a fresh session
  reaps it and respawns a replacement on the same socket — the exact path the reconnecting
  session proxy exists to handle) is untested. If the respawned daemon ever fails to rebind
  the stale UDS, a bridged secondary would be stranded and no test would catch it.
  *Dimension: maintainability (test-weakness).*

- **F003**: Adoption test sets a dead env var `SPEC_KIT_DB_DIR`,
  `daemon-reelection-adoption-live.vitest.ts:138`. The launcher derives `dbDir` from
  `__dirname` (`mk-spec-memory-launcher.cjs:45,83`) and never reads `SPEC_KIT_DB_DIR`; the
  actual DB-relocation override it honors is `MEMORY_DB_PATH`
  (`uncleanShutdownMarkerPath()` `:671`). DB isolation in the test is real but comes
  entirely from the real-copy fake-root layout, not from this env line — which misleadingly
  implies env-driven isolation. *Dimension: maintainability.*

- **F004**: Cross-runtime `UserPromptSubmit` hook divergence,
  `.devin/hooks.v1.json:8` vs `.claude/settings.local.json:38`. Devin routes
  `UserPromptSubmit` to `system-skill-advisor/.../devin/user-prompt-submit.js`, while Claude
  (and Codex) route the same event to `system-spec-kit/.../user-prompt-submit.js`. Either
  Claude is missing the skill-advisor prompt hook Devin wires, or Devin is missing the
  spec-kit memory hook the others wire. The portability commit rewrote only the path
  prefix (`cd "${RT_PROJECT_DIR:-$PWD}" && node <relative>`), so this parity gap is easy to
  overlook and is worth an explicit confirm-or-fix. *Dimension: traceability
  (agent_cross_runtime overlay).*

- **F005**: `check-comment-hygiene.sh` is a Python script behind a `.sh` extension,
  `check-comment-hygiene.sh:1`. Shebang is `#!/usr/bin/env python3` and the body is pure
  Python. Invoking it the way the `.sh` name invites (`bash check-comment-hygiene.sh`)
  fails immediately; only `./…` (shebang) or `python3 …` works. The repo appears to use
  this `.sh`-on-Python convention for other hook scripts (e.g. the Claude PostToolUse hook
  runs `python3 …/claude-posttooluse.sh`), so it is a consistency/clarity wart rather than
  a break — but the extension actively misleads. *Dimension: maintainability.*

- **F006**: Owner-lease reclaim write is not fsync'd in mk-code-index,
  `mk-code-index-launcher.cjs:303-308`. `writeOwnerLeaseFile()` does tmp-write (`wx`) +
  rename with no `fsyncSync`, while its sibling `writeOwnerLeaseFileExclusive()` (`:310-324`)
  *does* fsync, and mk-spec-memory's `writeOwnerLeaseFile()` (`mk-spec-memory-launcher.cjs:359-374`)
  fsyncs with an explicit comment that an unsynced renamed lease "can resurface empty after
  power loss and break ownership detection." The reclaim path here has the same durability
  exposure its own exclusive path guards against. *Dimension: correctness/maintainability.*

- **F007** (low confidence): `settings.local.json` accumulates one-off, session-specific
  permission `allow` entries, `.claude/settings.local.json:17-28` (e.g. `mkdir -p
  /tmp/dr-009`, a full multi-line `create.sh --phase …` invocation pinned to track 130).
  If this file is git-tracked this is drift/noise that will keep growing; if it is the
  conventional gitignored local override it is harmless. Flagged for the owner to confirm
  the file's tracking status and prune. *Dimension: maintainability.*

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | shared-context.md:6-12 vs launcher `:1372-1502` | Shipped behavior matches the re-election + reap narrative; one claim ("a live secondary keeps MCP transport") is plausible but rests on an untested reconnect path (F002). |
| checklist_evidence | n/a | hard | — | No `checklist.md` in the review packet (files target, not a spec folder). Marked N/A. |
| agent_cross_runtime | partial | advisory | .devin/hooks.v1.json:8, .claude/settings.local.json:38, .codex/hooks.json:9,20 | Hook path-portability is consistent across runtimes; `UserPromptSubmit` target skill diverges (F004). |
| feature_catalog_code | not-run | advisory | — | Catalog/playbook docs out of the 12-file scope; deferred. |
| playbook_capability | not-run | advisory | — | Deferred (docs out of scope). |

## Assessment
- New findings ratio: 1.0 (single pass, all 7 findings new)
- Dimensions addressed: correctness, security, traceability, maintainability
- Novelty justification: first and only iteration; 7 distinct P2 findings across 4
  dimensions, each with concrete `file:line` evidence. No P0/P1 substantiated despite
  adversarial tracing of the single-writer, lease-scoping, reap, and reconnect paths.

## Ruled Out
- "Fresh-session reap kills the daemon out from under a live secondary": traced as a
  by-design recover-via-reconnect (session proxy reattaches to the respawned daemon on the
  stable socket). Not a defect on its own — the residual risk is purely the *test gap*
  (F002), not a code bug.
- "Secondary SIGTERM tears down the owner's daemon lease": disproved — `clearLeaseFile`
  pid-guard and `ownerLeasePid` null-guard correctly scope cleanup to the owner.
- "settings.local.json missing SPECKIT_DAEMON_REELECTION=1": not a defect — that flag lives
  in the MCP server `env` (runtime MCP config), not in the hooks/permissions file.

## Dead Ends
- Confirming whether the respawned context-server unlinks a stale UDS on EADDRINUSE would
  require reading `context-server.js` (out of the 12-file scope). Folded into F002 as the
  reason the gap matters rather than asserted as a standalone P1.

## Recommended Next Focus
Single-iteration cap reached. If extended: (1) read `context-server.js` socket-bind path to
confirm/deny the F002 stranding risk; (2) confirm the F004 hook intent against
`hook_system.md`; (3) decide whether mk-code-index warrants a `childPid`-in-lease +
reap-before-respawn parity with mk-spec-memory (F001).

Review verdict: PASS

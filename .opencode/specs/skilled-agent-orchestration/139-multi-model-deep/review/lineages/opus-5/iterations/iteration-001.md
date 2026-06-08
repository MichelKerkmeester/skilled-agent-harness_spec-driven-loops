# Iteration 1: Daemon re-election reap fix + hook portability (all dimensions)

## Focus
Single-pass, all-dimension audit (maxIterations=1) of the recent daemon-reliability work:
- Stale-lease reclaim reap fix (single-writer restoration) in `mk-spec-memory-launcher.cjs`
- Shared model-server supervision + IPC bridge + reconnecting session proxy
- `mk-code-index-launcher.cjs` parity surface
- Live durability tests for re-election (adoption + release-vs-kill)
- `session-cleanup.sh`, `check-comment-hygiene.sh`
- Cross-machine hook portability: `.claude/settings.local.json`, `.codex/hooks.json`, `.devin/hooks.v1.json`

Dimensions: correctness, security, traceability, maintainability.
Lineage: opus-5 (native model=opus). Executor: native.

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability (4/4)
- Files reviewed: 12
- New findings: P0=0 P1=0 P2=9
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00 (first pass; all findings novel)

## Findings

### P0, Blocker
- None. The reviewed change set is a **defect fix** that closes a prior double-writer
  (would-be data-corruption) risk, and it is covered by a live two-launcher durability test.

### P1, Required
- None.

### P2, Suggestion

- **F001** — PID-reuse hazard in the new stale-reclaim reap path, `.opencode/bin/mk-spec-memory-launcher.cjs:1489-1501` (with `reapLeaseChildBeforeRespawn` at `:691-727`). [correctness]
  The fresh-session branch reads `orphanChildPid` from the stale lease and calls
  `reapLeaseChildBeforeRespawn(orphanChildPid)`, which `SIGTERM`/`SIGKILL`s that pid after only a
  `processLiveness()` check. A released daemon "reparents to pid 1, bounded by its idle self-exit"
  (per the comment at `:188-195`); if it self-exits and the OS recycles its pid before the fresh
  session reclaims, the reap signals an unrelated process. The sibling dead-socket path
  (`respawnAfterDeadSocket`, `:788-817`) re-confirms `currentLease?.childPid === childPid` under the
  respawn lock before reaping; the new branch performs a single read → reap with no such
  re-confirmation. Risk is low (window is small; owner-lease O_EXCL serializes fresh launchers) and
  consistent with the documented accepted risk elsewhere, hence P2.

- **F002** — Re-election release path fire-and-forgets the model-server kill, `.opencode/bin/mk-spec-memory-launcher.cjs:1372-1385`. [correctness]
  On the release branch the owner does `reapProcessTree(releasedModelServer.pid)` (descendants only,
  per `reapProcessTreeGroups` filtering `pid !== childPid` at `model-server-supervision.cjs:340`) then
  `releasedModelServer.kill(signal)` and immediately `process.exit(0)` — no await + `SIGKILL`
  escalation like the normal shutdown path (`:1409-1417`). A model-server **root** that ignores
  `SIGTERM` leaks: the later fresh-session stale-reclaim reaps only the context-server `childPid`
  (F001), never the lease's recorded `modelServerPid`. Low severity (the model server handles
  `SIGTERM` in practice), hence P2.

- **F003** — Tracked `.claude/settings.local.json` ships experimental env + personal allowlist to all cloners, `.claude/settings.local.json:2-29`. [security / config-hygiene]
  The portability commit (3b087a4a25) correctly fixed the hardcoded `cd` path and `/opt/homebrew/bin/node`,
  but the same "this file is TRACKED, not gitignored" reasoning applies to the rest of the file: it
  still ships `env.SPECKIT_ABLATION:"true"`, `env.MAX_THINKING_TOKENS:"999999"`,
  `env.CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING:"1"`, and a `permissions.allow` list full of ephemeral
  absolute artifacts (`/tmp/dr-009`, `/tmp/docs-011`, a packet-114 absolute path, a one-off multi-arg
  `create.sh` invocation). Anyone cloning Public inherits ablation mode and a stranger's permission
  grants. Least-surprise / supply-of-defaults exposure, P2.

- **F004** — Comment-hygiene rule violation in shipped launchers, `.opencode/bin/mk-spec-memory-launcher.cjs:1025` and `.opencode/bin/mk-code-index-launcher.cjs:715`. [traceability]
  Both carry `// Compatibility symlink ... removed: 096 packet cleaned up consumers ...`. The root
  `CLAUDE.md` "Comment Hygiene [HARD] BLOCK" forbids packet numbers in code comments (keep the durable
  WHY, drop the perishable label). "096 packet" is exactly such an ephemeral packet reference. P2.

- **F005** — Hygiene-checker word-order gap lets F004 evade detection, `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:169`. [traceability / correctness-of-tooling]
  `VIOLATION_PATTERNS` uses `re.compile(r'\bpacket\s+\d+\b', re.IGNORECASE)`, which matches
  "packet 096" but NOT the "096 packet" ordering used in the launchers. Verified empirically:
  the checker exits 0 on `// foo 096 packet cleaned up consumers` and exits 1 on `// foo packet 096 ...`.
  Net: the canonical comment-hygiene enforcement does not catch the form of violation actually present
  in-tree (F004). P2.

- **F006** — Live adoption test sets a no-op DB-isolation env var, `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:138`. [traceability]
  `startSession` exports `SPEC_KIT_DB_DIR: paths.dbDir`, but a workspace grep shows `SPEC_KIT_DB_DIR`
  is consumed **only** by `.opencode/bin/worktree-session.sh:149` — never by the launcher or the
  daemon `src` (which key the DB off the copied launcher's `__dirname` and `MEMORY_DB_PATH`). The test
  is still SAFE (isolation is real, via the launcher real-copy + symlinked deps into a fake-root), but
  the env line implies an isolation mechanism that does not exist and could mislead a future maintainer
  porting the harness. P2.

- **F007** — Coverage gap for the default-on combined multi-session path, `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:182-268`. [maintainability / validation]
  The three live cases prove: (1) owner disposal RELEASES the daemon and a **pre-connected** secondary
  keeps transport (no fresh session involved); (2) a **fresh** session after disposal reaps the orphan
  (no connected secondary); (3) flag-off kills the daemon. The actual default-on production scenario —
  a fresh session reclaiming/reaping the released daemon **while a secondary is bridged to it**, proving
  the secondary's `launcher-session-proxy` reattaches to the respawn rather than erroring — is not
  directly covered. The constituent mechanisms are individually proven (reap in case 2; proxy reattach
  in the proxy unit tests), so this is a coverage/assurance gap, not a missing implementation. P2.

- **F008** — Python script with a `.sh` extension, `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:1`. [maintainability]
  The file is `#!/usr/bin/env python3` but named `*.sh`. It works when executed via its shebang or
  `python3 file.sh`, but `bash check-comment-hygiene.sh` would fail, and the extension misleads readers
  and tooling about its language. P2 naming/convention.

- **F009** — Cross-runtime hook asymmetry (low confidence), `.devin/hooks.v1.json:8` vs `.codex/hooks.json:20`. [maintainability / traceability]
  `.devin/hooks.v1.json` routes `UserPromptSubmit` to `system-skill-advisor/.../hooks/devin/user-prompt-submit.js`
  but `SessionStart` to `system-spec-kit/.../hooks/devin/session-start.js`, whereas `.codex/hooks.json`
  routes BOTH hook types to `system-spec-kit`. Likely an intentional per-runtime wiring choice
  (devin prompt-submit goes through the skill advisor), but the divergence is undocumented in the
  configs themselves. Worth a one-line confirmation. P2, low confidence (no defect proven).

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | reap fix → packet 028 (`028-live-session-reelection-validation/spec.md`); portability → packet 138 (`138-portable-cross-machine/spec.md`) | Review target code traces to documented spec packets; spec 139 itself is the review-orchestration scaffold. |
| checklist_evidence | partial | hard | `7c8b221cf3` body: "Durability suite 18/18, launcher-lease 11/11" | Test counts asserted in commit message; not independently re-run in this read-only audit. |
| skill_agent | n/a | advisory | — | No skill/agent contract under review. |
| agent_cross_runtime | partial | advisory | `.codex/hooks.json`, `.devin/hooks.v1.json`, `.claude/settings.local.json` | Hook wiring is parallel across runtimes; F009 flags one asymmetry to confirm. |
| feature_catalog_code | n/a | advisory | — | Not in this file set. |
| playbook_capability | n/a | advisory | — | Not in this file set. |

## Assessment
- New findings ratio: 1.00 (first and only pass; 9/9 findings novel).
- Dimensions addressed: correctness (F001, F002), security (F003), traceability (F004, F005, F006), maintainability (F007, F008, F009).
- Novelty justification: single all-dimension iteration; no prior lineage state in opus-5 to dedup against.
- Adversarial self-check: no P0/P1 asserted, so no claim-adjudication packets required. The two
  correctness items (F001/F002) were down-rated to P2 after confirming they mirror documented,
  accepted risk patterns and have low realistic impact; F005/F006 were empirically verified
  (checker exit codes; `SPEC_KIT_DB_DIR` grep) rather than asserted by inference.

## Ruled Out
- "Reap fix introduces a double-writer" — Ruled out. The fix adds a reap of the recorded child before
  respawn under the owner-lease O_EXCL mutex; the live test (case 2) asserts exactly one sqlite opener
  (`sqliteOpenerPids(...).length === 1`). Evidence: `mk-spec-memory-launcher.cjs:1489-1501`, test `:240-242`.
- "Reaping a live adopted daemon strands a connected secondary" — Ruled out as a defect: the session
  proxy reattaches to the respawn (`launcher-session-proxy.cjs:701-764`, `:784-807`). Remaining concern
  is coverage only (F007).
- "Hook `$PWD` fallback is an injection vector" — Ruled out. Hooks run in the user's own session with
  runtime-provided `*_PROJECT_DIR`; `:-$PWD` is a benign portability fallback.

## Dead Ends
- Re-running the durability suite — out of scope for a read-only audit; relied on commit-asserted 18/18.

## Recommended Next Focus
Single-iteration run complete (maxIterations=1). If extended: add the F007 combined-path live test
(fresh-session reclaim with a connected secondary) and close the F005 checker gap so F004 is mechanically
enforced. No blocking items.

Review verdict: PASS

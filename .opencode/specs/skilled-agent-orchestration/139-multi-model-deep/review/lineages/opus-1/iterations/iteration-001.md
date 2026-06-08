# Iteration 1: Full-spectrum review (correctness · security · traceability · maintainability)

Fan-out lineage: **opus-1** · executor: native model=opus · maxIterations=1 (single comprehensive pass over all 4 dimensions, breadth-first).

## Focus

All four review dimensions in one pass against the 12 declared files, scoped to the *recent* daemon-reliability + reap + hook-portability work:

- **Reap fix** (`7c8b221cf3`): stale-lease reclaim now reaps the released re-election daemon before respawn (`mk-spec-memory-launcher.cjs`).
- **Hook portability** (`7b082bdcf4`, `3b087a4a25`): `.claude/settings.local.json`, `.codex/hooks.json`, `.devin/hooks.v1.json` rewritten to `cd "${<RUNTIME>_PROJECT_DIR:-$PWD}"` + PATH `node`.
- Supporting supervision/bridge/proxy libs, the two durability tests, and the two session/hygiene shell scripts.

## Scorecard

- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 12 (10 read in full or near-full; `launcher-session-proxy.cjs` and `daemon-reelection-release-integration.vitest.ts` characterized via cross-reference + sibling-test header, not opened line-by-line)
- New findings: P0=0 P1=0 P2=5
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00 (first iteration; all findings new)

## Findings

### P0, Blocker

_None. The reap fix is correct, EPERM-safe, and directly proven by the adoption-live test's `lsof` single-writer assertion. No correctness failure, security vulnerability, or spec contradiction found._

### P1, Required

_None._

### P2, Suggestion

- **F001** — Sibling launcher stale-reclaim divergence is silent (parity/doc gap), `.opencode/bin/mk-code-index-launcher.cjs:916`, dimension=maintainability.
  `mk-spec-memory-launcher.cjs:1482-1502` now reaps the recorded `childPid` on the stale-reclaim branch with a detailed WHY comment. The sibling `mk-code-index-launcher.cjs:916-918` stale-reclaim branch only `log()`s and falls through to respawn. This is **correct by design** — code-index does NOT do re-election (`grep` finds no `daemonReelectionEnabled`/`detached`/`unref`/release-on-shutdown), its lease records only `{pid, startedAt}` with no `childPid` (`writeLeaseFile()` @ `mk-code-index-launcher.cjs:645-650`), and its child is spawned non-detached and mirror-exits with the launcher (`launchServer` @ :802-845, signal handler @ :850-857), so no released-daemon orphan can exist. The risk is forward-looking: a future maintainer who adds any detached/re-election behavior to code-index, or who copies the spec-memory branch, gets no in-code signal that the reap was deliberately omitted. **Suggest** a one-line comment on the code-index stale-reclaim branch stating that no reap is needed because the daemon is tethered/non-detached and the lease carries no `childPid`.

- **F002** — Test coverage gap: connected-secondary survival across a fresh-session reap+respawn is unverified, `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:210`, dimension=traceability.
  The reap fix's real-world race is: an owner disposes → daemon released → a **connected secondary keeps bridging** to it → a fresh session reclaims the stale lease, reaps that daemon, and respawns a new one on the same socket. Adoption test case 1 (:183-208) proves secondary survival across *owner disposal* (no reap). Case 2 (:210-243) proves the *reap → single writer* invariant but starts the fresh session with **no secondary present**, so the secondary's reconnect across the reap+respawn (which the reconnecting session proxy is designed to absorb) is asserted nowhere. The two halves of the production scenario are each tested but never composed. **Suggest** a case that holds a live bridged secondary through a fresh-session reap and asserts the secondary's next `statsOk()` succeeds after reconnect.

- **F003** — `.codex/hooks.json` `UserPromptSubmit` group omits `"matcher": ""` present on every other hook group, `.codex/hooks.json:15`, dimension=correctness.
  `SessionStart` (:5) and all five `.claude/settings.local.json` groups and both `.devin/hooks.v1.json` groups carry `"matcher": ""`; the Codex `UserPromptSubmit` group (:16-24) does not. Pre-existing (the portability commit `7b082bdcf4` only rewrote the `command` string, not the group shape) and within a reviewed file. Likely harmless if Codex treats an absent matcher as match-all, but it is an unexplained intra-file asymmetry. **Suggest** adding `"matcher": ""` for uniformity. *Upgrade trigger:* if Codex's hook schema requires `matcher`, this group silently never fires (skill-advisor brief absent on Codex) → P1.

- **F004** — Tracked `.claude/settings.local.json` ships machine/session-specific `permissions.allow` entries to all cloners, `.claude/settings.local.json:17`, dimension=maintainability.
  The portability commit correctly fixed the hook `command` paths, but the same TRACKED file still carries one-off personal allow entries: `Bash(mkdir -p /tmp/dr-009)`, `Bash(rm -rf /tmp/docs-011/*)`, an absolute-path `node .../114-.../seed-fixtures.cjs`, and a full one-shot `create.sh` invocation for packet 130 (:17-28). These leak internal paths/packet names and add noise for anyone cloning Public. **Suggest** pruning ephemeral allow entries from the tracked file (or moving them to an untracked `settings.local.json`-style override) — same "tracked file shouldn't carry machine-specific content" principle the portability fix established.

- **F005** — `check-comment-hygiene.sh` is a Python script with a `.sh` extension, `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:1`, dimension=maintainability.
  Shebang is `#!/usr/bin/env python3` and the body is pure Python; the `.claude` PostToolUse hook also invokes a sibling `claude-posttooluse.sh` via `python3`. Functionally fine (invoked with an explicit interpreter), but the extension misrepresents the language and defeats editor/linter detection. Pre-existing, low impact. **Suggest** renaming to `.py` (or documenting the `.sh`-means-hook convention). Lowest-priority advisory.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | `mk-spec-memory-launcher.cjs:1482-1502`; `daemon-reelection-adoption-live.vitest.ts:210-243` | Reap-fix commit claim ("reap recorded child on stale-lease reclaim; single writer") resolves to shipped code AND to a test that asserts `sqliteOpenerPids(dbDir).length === 1`. Hook-portability claims resolve to all 9 hook commands across 3 runtime files being `${<RT>_PROJECT_DIR:-$PWD}` + PATH `node`. |
| checklist_evidence | partial | hard | commit `7c8b221cf3` body ("Durability suite 18/18, launcher-lease 11/11") | Verified the named durability test exists and encodes the single-writer assertion; did NOT open packet 028 `checklist.md` (outside lineage scope / budget). Claim is corroborated but not exhaustively cross-checked. |
| feature_catalog_code | partial (advisory) | advisory | commit body references reconciled `changelog/v3.5.0.4.md`, `RELEASE_NOTES.md`, `ENV_REFERENCE.md` | Not opened this pass; advisory only for a files-type target. |
| skill_agent | N/A | advisory | — | Applies to skill targets. |
| agent_cross_runtime | N/A | advisory | — | Applies to agent targets. |
| playbook_capability | N/A | advisory | — | No playbook in scope. |

## Assessment

- New findings ratio: 1.00 (5 new P2, first and only iteration)
- Dimensions addressed: correctness (reap logic, hook command shape, codex matcher), security (lease O_EXCL mutex, EPERM bail, socket-dir ownership guards, session-scoped kill re-proves ancestry — all sound), traceability (spec→code→test for reap + hooks), maintainability (sibling-launcher divergence, tracked-file hygiene, script naming)
- Novelty justification: all five findings are first-seen; none are duplicates or refinements.

### Security notes (no findings)

Positive observations worth recording: the reap path runs under the owner-lease `O_EXCL` mutex and bails to a lease-held JSON-RPC error on EPERM rather than risking a second writer; `model-server-supervision.cjs` rejects symlinked/foreign-owned socket dirs (`assertSocketDirOwnership`) and over-long `sun_path` (`assertSunPathLimit`); `session-cleanup.sh` deliberately refuses a PPID fallback and re-proves session ancestry at kill time (`is_descendant_of_session`), preventing cross-session kills. No secrets, no injection surface, no trust-boundary regressions introduced by the reviewed changes.

## Ruled Out

- **Reap targets only `childPid`, not `modelServerPid` (potential leaked model server)**: ruled out — the re-election release path (`shutdownLauncherForSignal:1372-1377`) kills the model server and releases only the context-server, so no orphaned model server exists under a released lease; the shared model server has its own reaping via the demand listener.
- **Fresh-session reap kills the daemon a connected secondary uses (permanent transport loss)**: ruled out as P0/P1 — the secondary uses the reconnecting session proxy on the same socket path, so disruption is transient reconnect, not a permanent break (downgraded to the F002 coverage gap).
- **`cd "${CLAUDE_PROJECT_DIR:-$PWD}"` fallback resolves wrong dir**: ruled out — this is the intended best-effort fallback matching the already-working Devin form; not a regression.

## Dead Ends

- Tracing code-index's SIGKILL-orphan edge further: out of the recent-change scope (re-election is spec-memory-only) and bounded by code-index's tethered/mirror-exit design; not productive for this review.

## Recommended Next Focus

For a follow-up pass (beyond this single-iteration lineage): open packet 028 `checklist.md` to close `checklist_evidence`, and read `launcher-session-proxy.cjs` reconnect logic to either confirm or escalate F002 by tracing the secondary reconnect path explicitly.

Review verdict: PASS

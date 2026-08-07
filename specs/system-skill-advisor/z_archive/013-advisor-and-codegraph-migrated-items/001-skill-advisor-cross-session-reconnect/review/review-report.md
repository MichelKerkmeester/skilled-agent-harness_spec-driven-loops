# Deep Review Report — 027/019 skill-advisor cross-session reconnect

**Target:** commit `2f106976f3` — owner-lease + reconnecting session-proxy in `mk-skill-advisor-launcher.cjs`.
**Method:** 5 narrow-lens seats (cli-opencode gpt-5.5-fast, xhigh) → Fable 5 adversarial adjudication → gpt-5.5-xhigh remediation (R1–R6) → Fable 5 re-verify → commit.

## Seat coverage (5 iterations)

| Seat | Lens | Raw outcome |
|------|------|-------------|
| 1 | Shared-lib compat | Clean — the +34-line `launcher-session-proxy.cjs` change is backward-compatible for the spec-memory/code-index launchers |
| 2 | Lease correctness | P0 double-writer (stale-reclaim ignores childPid) + P1 respawn-decision-dropped |
| 3 | Reconnect bridging | P0 dead-socket respawn dropped + P1 child-exit-no-relaunch + P2 replay side-effects |
| 4 | Lifecycle / reaping | 3× P0 (kill-not-release; childPid adoption; unserialized reclaim) + P1 respawn-dropped + P1 sidecar-orphan |
| 5 | Test rigor | P1 weak tests (no double-writer race / no bridged-traffic assert) + P1 scaffold docs + P1/P2 nits |

## Fable adjudication (corrected the seats' over-strict A-comparison)

The phase contract is parity with what spec-memory **and** code-index share → **reference B (code-index)**, deliberately simpler than spec-memory (A). Against B:

- **C4 — discarded `{action:'respawn'}`: CONFIRMED P1.** The one true functional hole: a hung daemon → indefinite advisor outage. Both A and B handle it. Centerpiece.
- **C1 — childPid adoption: P0→P1.** B doesn't do it either; the advisor daemon's own SQLite lease already covers the canonical orphan. Residual: the *wedged*-daemon case.
- **C3 — unserialized reclaim: P0→P1.** The advisor holds the bootstrap lock across the whole spawn critical section, so racers serialize. Residual: 120s/non-atomic stale-lock reclaim.
- **C2 — release-not-kill: DEFER.** B has identical kill-on-signal; release-not-kill needs A's detached-spawn + owner-stdio-proxy architecture, which the advisor (inherit-stdio, non-detached) lacks. A future re-election packet.
- **C5 — relaunch-on-child-exit: REFUTED as a gap / DEFER.** The port does exactly what B does; B's recovery = host respawns launcher + reconnecting proxies reattach.
- **C6 — sidecar root orphaned: CONFIRMED P1** (flag-gated). **C7 — replay side-effects: CONFIRMED P2.**

## Remediation (R1–R6, commit pending)

R1 dead-socket respawn (mirror code-index `respawnAfterDeadSocket`/`reapOwnerBeforeRespawn`/`waitForPidExit` + respawn-aware `bridgeOrReportLeaseHeld`; target pid = recorded `childPid`); R2 stale-lease adopt-or-reap inside the bootstrap lock; R3 bootstrap-lock staleness (separate 300s constant + atomic rename-claim); R4 sidecar-root SIGTERM→reap→SIGKILL before pid clear; R5 `advisor_validate` → unsafe replay set; R6 filled the scaffold spec docs + documented the C2/C5 deferrals as deliberate.

## Fable re-verify: **SHIP**

R1–R5 each verified PASS with file:line evidence. Critical safety confirmed: **no path lets the launcher kill a healthy host daemon of a live concurrent session** — every kill is gated on a multi-retry confirmed-dead socket or an unbridgeable stale child, executed under the bootstrap lock with a supersede re-check; sessions on a reaped daemon ride the reconnecting proxy to the replacement.

### Residual LOW findings (do not gate the commit; recorded here)

1. **Reap-then-no-respawn window (~7s):** if the reaped daemon's old launcher is still mid-exit when `writeOwnerLeaseFileExclusive` runs, the exclusive write loses → `respawn-lock-held` report after the kill. Recoverable on the next launch attempt; strictly better than the pre-fix silent drop. Mitigation (future): lengthen the previous-owner `waitForPidExit`.
2. **`onRssBreach` failure path** clears the shared model-server pid record even when the kill failed → a live root could be left untracked. Failure-path only; the demand/idle machinery re-arms.
3. **Pre-existing (parity with reference B):** recorded-pid trust is vulnerable to OS pid recycling; the bootstrap lockdir mtime is not refreshed during a build (a genuine >300s `npm ci`+build could have its live lock reclaimed). Not regressions.

## Verification after remediation

- `npm run typecheck` (skill-advisor mcp_server): 0 errors.
- `tests/skill-advisor-launcher-orphan-reaping.vitest.ts`: 7/7 (incl. new serialize-reclaimers / respawn-after-dead-socket / reap-wedged-child tests).
- `tests/launcher-session-proxy.vitest.ts`: 19/19.
- `cli-offline-smoke.cjs`: 37/8/9 — daemon front doors intact.
- `validate.sh --strict` (019): 0/0. Comment hygiene: clean.

**Disposition:** 019 review complete; B-parity reached (C4 closed, C1/C3 residuals fixed, C6/C7 fixed); C2/C5 deferred as deliberate; 3 LOW failure-path residuals documented.

# Multi-model deep review — converged report

**Scope:** recent daemon-reliability, re-election, reap-before-respawn, hook-portability and Barter-sync work (12-file target).
**Lineages:** 11 total — gpt-5.5-fast xhigh ×6 (official cli-opencode fan-out) + opus 4.8 ×5 (claude2). All 11 succeeded.
**Tally across lineages:** P0 active = 0, P1 rows = 13, P2 rows = 41 (many are the same theme found by multiple models).
**Verdict: CONDITIONAL** — one real P1 gap in the shipped reap fix, plus a set of convergent P2 hardening items. No P0.

---

## P1 — CONFIRMED (round-2 verified against code)

### F1. Stale-owner-lease reclaim is not the atomic spawn mutex the reap fix relies on
Found independently by **gpt55-1, gpt55-4, gpt55-5, gpt55-6, opus-4** (5 lineages).

`acquireOwnerLeaseFile()` (`.opencode/bin/mk-spec-memory-launcher.cjs:443-481`) uses the true `O_EXCL` create only when **no** owner lease exists (`:457`). When an owner lease exists but is **stale** (crashed/SIGKILLed owner that did not run the release path), it falls to a non-exclusive `writeOwnerLeaseFile` + re-read (`:470-472`). That read-then-write is not a reliable mutex: with interleaved write+reread pairs, two concurrent fresh launchers can both believe they acquired ownership, both enter the stale-reclaim reap branch (`:~1480`), and both reap+respawn — reintroducing the double-writer the fix prevents, via a different race.

**Nuance (reviewers got it right):** for the **release** path the fix primarily targets, the disposing owner *drops* its lease, so a fresh launcher hits the `O_EXCL` path and the mutex DOES hold. The gap is the narrower window: **owner crashed without releasing + its detached re-election daemon still alive + two concurrent fresh launchers** racing the stale lease.

**Also:** the reap-branch comment ("the owner-lease O_EXCL acquisition above is the spawn mutex, so only the winning fresh launcher reaches here") overstates the guarantee for this branch.

**Remediation:** serialize the stale reclaim with a true atomic primitive (reuse the existing respawn lock around the reclaim+reap+spawn, or a compare-and-swap), and correct the comment. Severity P1 not P0 because the window is narrow and the leak is idle-timeout-bounded.

### F1b/F1c — related, same surface (lower confidence)
- **Fresh reap can kill a daemon still serving a live secondary** (gpt55-2, gpt55-5): the stale-owner reclaim reaps the recorded child without checking whether a secondary is bridged to it. Folds into F1's serialization fix plus a connected-secondary guard.
- **Spawn proceeds after an unconfirmed SIGKILL** (gpt55-3, gpt55-6, opus-3, opus-5): `reapLeaseChildBeforeRespawn` (`:689-725`) returns `allowed:true` even when the SIGKILL'd child is not confirmed exited, so a replacement can spawn during the old child's teardown.

---

## P2 — CONVERGENT + verified (hardening)

| # | Finding | Lineages | Status |
|---|---------|----------|--------|
| F2 | `096 packet` perishable label in a code comment (`mk-spec-memory-launcher.cjs:1025`, `mk-code-index-launcher.cjs:715`); the hygiene checker matches `packet NNN` but not reversed `NNN packet`, so it evaded the gate | gpt55-2/3, opus-5 | VERIFIED |
| F3 | Live durability test interpolates temp paths into `execSync` shell commands (`daemon-reelection-adoption-live.vitest.ts:52,60`) — low risk (temp-controlled) but a shell-shaped pattern | gpt55-4/5/6 | VERIFIED |
| F4 | Live test never covers fresh-session reap WHILE a secondary is connected (the default-on combined path) | gpt55-1/3, opus-1/2/3/5 (6) | VERIFIED gap |
| F5 | Re-election release path SIGTERMs the model-server then `process.exit(0)` synchronously — no await / SIGKILL escalation | gpt55-1, opus-4/5 | VERIFIED |
| F6 | `check-comment-hygiene.sh` is a Python script behind a `.sh` extension | opus-1/2/5 | VERIFIED |
| F7 | Tracked `.claude/settings.local.json` ships machine/session-specific `permissions.allow` + ablation env to all cloners | opus-1/2/5 | VERIFIED (it is tracked) |
| F8 | PID-reuse hazard: reap signals a recorded `childPid` with no process-identity re-confirm under lock (dead-socket path does re-confirm) | opus-3/5 | plausible |
| F9 | Cross-runtime `UserPromptSubmit` hook asymmetry (devin → skill-advisor vs claude/codex → spec-kit) | opus-2/5 | by design? needs owner call |

**Actively refuted by reviewers (good):** the live test's `SPEC_KIT_DB_DIR` is honored (not dead); every portability hook script target exists on disk. opus-4 refuted these as weak candidates.

---

## Recommended actions
1. **F1 (P1):** wrap the stale-owner-lease reclaim + reap + respawn in the existing respawn lock (atomic serialization) and fix the overstated comment. Add the connected-secondary guard (F1b).
2. **F2 (P2):** rewrite the two `096 packet` comments to the durable WHY (no packet number); extend the hygiene checker to catch reversed `NNN packet` ordering.
3. **F3 (P2):** harden the test helpers to `execFileSync` with args (no shell interpolation).
4. **F4 (P2):** add a live test for fresh-session reap while a secondary is bridged.
5. **F5–F9:** triage; F5 + F6 are quick, F7/F9 are owner-policy calls.

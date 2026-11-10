# Iteration 009 — Hooks on More Tools, the 17-Plugin Claim, and the Injection Contract

## Focus

Three unread release claims, all in the hooks-and-plugins band: (1) v4.0.0.3's live-sync hooks reaching Cursor and Devin plus the hook list's explanation where a tool cannot hook; (2) v4.0.0.13's "all 17 plugins ... sixteen through one shared adapter and sk-vision on its own" and the shared dual-compat shim; (3) whether `injection-contract.md` still describes how the adapters inject today.

## Actions Taken

1. Read the v4.0.0.3 and v4.0.0.13 release notes and located the two claims under test. [SOURCE: .skilled/changelog/skilled/v4.0.0.3.md:116] [SOURCE: .skilled/changelog/skilled/v4.0.0.13.md:3]
2. Enumerated the hooks that keep a session's copy in step with the shared live branch on each tool: Cursor sessionStart runs `git-live-follow.sh --start` [SOURCE: .cursor/hooks.json:46] and Devin's v1 hook set runs the same script [SOURCE: .devin/hooks.v1.json:43]. Both hook directories carry the adapter (`git-live-follow.sh` present in `.cursor/hooks` and `.devin/hooks`).
3. Checked the hook list's claim that a tool which cannot run a hook is told why. `.skilled/hooks/coverage-rationale.md` names the exception and the reason. [SOURCE: .skilled/hooks/coverage-rationale.md:92]
4. Counted the plugins and the shim wiring: 19 plugin modules under `.opencode/plugins`, all 19 importing `dualPlugin` from `./lib/v2-bridge.js` (checked by a per-file grep for the symbol, which printed no file lacking it). Representative wiring: [SOURCE: .opencode/plugins/ask-surface-guard.js:11] [SOURCE: .opencode/plugins/ask-surface-guard.js:118]
5. Ran the plugin suite read-only: `node --test .opencode/plugins/tests/*.test.cjs` → 572 tests, 545 pass, **27 fail**, 0 skipped.
6. Read the failing helper to find the first failed assertion rather than the cascade. [SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:182]
7. Compared the injection contract's relaunch kill-switch paragraph against the live flags file. [SOURCE: .skilled/hooks/injection-contract.md:20] [SOURCE: .skilled/hooks/hook-flags.env:54] [SOURCE: .skilled/hooks/hook-flags.env:55]

## Findings

### f-iter009-001 — P1 — bug — the OpenCode plugin suite is red at HEAD, entirely in the relaunch nudge path

- **Type:** bug (with a drift consequence for the release note's CI claim). **Release:** v4.0.0.13 introduced the dual-compat plugin set and the "OpenCode Plugin Tests" CI job; the red state is at HEAD, so the introducing release for the failure itself is later or the gate does not run.
- **Evidence:** `node --test .opencode/plugins/tests/*.test.cjs` → `ℹ tests 572 / ℹ pass 545 / ℹ fail 27 / ℹ skipped 0`, exit status non-zero. The first assertion to fail is inside the shared helper `startLoopNudge`, where `transform()` must return one nudge entry at 90% fill and returns none. [SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:182]
- **Cascade, not 27 causes:** four failures report `TypeError: Cannot read properties of undefined (reading 'match')` and two report a string argument receiving `undefined`, which is what a destructure of a failed `startLoopNudge` produces. The rest are `0 !== 1` on the same helper.
- **Why P1:** the relaunch nudge is the operator's only in-session signal that a hand-over is due, and the live flags file has the loop enabled. [SOURCE: .skilled/hooks/hook-flags.env:54] A green suite is the only thing standing between a silent nudge failure and a session that quietly auto-compacts instead of handing over.
- **Confidence:** high on the red state and the failing assertion; **not established** whether the cause is a real plugin regression or a stale compiled core resolved through the adapter root (`source-root-consumers.test.cjs` exists precisely to police that) — a discriminator is named in the next-focus note.
- **Verify:** `node --test .opencode/plugins/tests/session-relaunch.test.cjs 2>&1 | grep -E '^. (pass|fail) '` — then, to separate environment from regression, `git stash list` is irrelevant; instead run the same file at tag `22c3a9b2c7` (v4.0.0.15) and at `51f70a0317` (v4.0.2.0) and compare the fail count.

### f-iter009-002 — P2 — drift — the 17-plugin and sk-vision sentence describes a tree that no longer exists

- **Type:** drift (release note vs code). **Release:** v4.0.0.13, invalidated by the later removal of the skill.
- **Note text:** "All 17 plugins, the agents and the commands run on OpenCode 2 ... All 17 plugins run on both versions, sixteen through one shared adapter and sk-vision on its own." [SOURCE: .skilled/changelog/skilled/v4.0.0.13.md:3]
- **Tree today:** 19 plugin modules in `.opencode/plugins`; all 19 import `dualPlugin`; `git log 42b41dd286..HEAD -- .opencode/plugins` contains `f2c4ce5a91 chore(repo)!: remove the mcp-magicpath mode and the sk-vision skill`, so the named exception is gone.
- **Why it costs something:** the note is the audit trail for the shim decision. A reader today cannot use it to find the one plugin that bypasses `v2-bridge`, because there is none, and the 17-versus-19 gap invites the wrong inference that two plugins are unwired. [SOURCE: .opencode/plugins/ask-surface-guard.js:11]
- **Confidence:** high on the counts and the removal; the exact ship release of the removal is inferred from commit order, not read from a changelog line this iteration.
- **Verify:** `ls .opencode/plugins/*.js | wc -l` and `grep -l dualPlugin .opencode/plugins/*.js | wc -l` (expect 19 and 19).

### f-iter009-003 — P2 — drift — the injection contract and the live flags file disagree on the relaunch default

- **Type:** drift (doc vs config). **Release:** the relaunch default language arrived with the v4.0.0.13 relaunch loop and was refined by the v4.0.0.14 opt-in-per-runtime work.
- **Doc:** every concern except session relaunch is default-on; relaunch "ships off", and a runtime's `SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED` decides for that runtime while `SYSTEM_SESSION_RELAUNCH_ENABLED` decides otherwise. [SOURCE: .skilled/hooks/injection-contract.md:20]
- **Live file:** `SYSTEM_SESSION_RELAUNCH_ENABLED=1` with `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` and every other runtime flag commented out, i.e. empty and inheriting the master. [SOURCE: .skilled/hooks/hook-flags.env:54] [SOURCE: .skilled/hooks/hook-flags.env:55]
- **Consequence:** on a copy carrying that file, Pi, OpenCode, Codex and Hermes relaunch is on by inheritance while the reference says the feature ships off. An operator reading the contract to confirm "is this on?" gets the wrong answer.
- **Confidence:** medium. The two texts do disagree; whether `hook-flags.env` is tracked or machine-local was **not** established, so which side is authoritative is undetermined and is recorded as such.
- **Verify:** `git ls-files --error-unmatch .skilled/hooks/hook-flags.env` — a hit makes the doc wrong, a miss makes the observation a local-machine fact only.

## Questions Answered

None of the three strategy questions is fully answered. The relaunch block inside the UX question now has a concrete cause candidate (f-iter009-001), which is progress, not closure.

## Questions Remaining

- **Is the 27-failure red state a regression or a resolution failure?** The discriminator: run `session-relaunch.test.cjs` once with the plugin loading its compiled core from `.skilled/.../dist` and once with the source core. If the nudge appears only in one, the fault is the adapter-root resolution, not the nudge logic.
- **Does the "OpenCode Plugin Tests" CI job actually gate this suite?** A red suite at HEAD is only possible if the job is skipped for these paths or not required. That decides whether f-iter009-001 is a code bug or a governance bug.
- **Advisor transport (v4.0.0.0, v4.0.0.16)** — degraded local scoring and the shared daemon lease/race remain unexercised. Carried **seven** iterations. Still the largest untested claim in the run.
- **Advisor follow-ups from generation 1** — the sk-doc `sk-create-skill-parent` shared-packet entry and the duplicate `package_skill.py`. Untouched, ninth iteration; now the oldest open item after the transport question.
- **UX and extension** proper: with f-iter009-001 understood, the remaining blocks are reading the advisor brief and recovering history, neither of which this iteration reached.
- Carried: the hook git-call time limit; whether `hook-flags.sh`'s table drifts from `hook-flags.cjs`; which of the 132 non-shared adapters import the flag module; `leaf-scopes.json` optionality; the live Claude turn-end hang; the live Codex compaction.

## Next Focus

Iteration 10 is the last one, so it should convert carried claims rather than open new ones. Highest value: settle f-iter009-001's cause with the one-command discriminator above, because a red relaunch suite changes the operator story for the whole cluster; then close the generation-1 advisor follow-up (two paths, one read) so the run does not end with an untouched question from iteration 1 still untouched at iteration 10. The advisor transport question has been carried seven times and cannot be closed by reading; record it explicitly as untested so the final report does not present it as verified.

## SCOPE VIOLATIONS

None. Every mutation this iteration was a write to the two allowed artifacts plus the append gateway's own write into the run directory.

---
title: "426 -- Daemon Ownership Reelection"
description: "Manual check for the automated-test-backed, experimental daemon-ownership reelection path that is flag-gated and off by default, so the launcher only releases the daemon for reelection when an operator opts in."
---

# 426 -- Daemon Ownership Reelection

## 1. OVERVIEW

This scenario verifies the experimental daemon-ownership reelection path in the mk-spec-memory launcher. When enabled, it lets a disposing owner release the shared daemon so another live session can re-elect itself as owner instead of forcing a relaunch. The capability is flag-gated and off by default: with the flag unset the launcher keeps its current ownership behavior, which is the identity this scenario must confirm.

The check is automated-test-backed. A human runs the launcher syntax check, the reelection unit suite, and a grep that proves the flag resolver, the spawn-io selector, and the release predicate are defined and wired. Together they confirm the default-off identity holds and the release only happens when reelection is explicitly enabled.

This feature is experimental and default-off. The default-off identity is the contract under test; the enabled path is opt-in and not the baseline behavior.

## 2. SCENARIO CONTRACT

- Objective: Confirm daemon-ownership reelection is flag-gated and off by default, so the launcher keeps its current ownership behavior unless reelection is explicitly enabled.
- Real user request: `Is there a way for another live session to take over the shared daemon instead of relaunching it, and is that behavior safely off by default so nothing changes unless I turn it on?`
- Prompt: `Validate the experimental daemon-ownership reelection path and confirm it is flag-gated and default-off.`
- Expected execution process: Run the launcher syntax check, run the reelection unit tests, and grep for the flag resolver, the spawn-io selector, and the release predicate to confirm they are defined and that the default resolves to disabled.
- Expected signals: `node --check` exits cleanly for the launcher; `launcher-daemon-reelection.vitest.ts` passes including the default-off identity case and the enabled-release case; `daemonReelectionEnabled`, `shouldReleaseDaemonForReelection`, and `contextServerSpawnIo` appear at their definitions and at the call sites that resolve the flag, select spawn io, and decide whether to release.
- Desired user-visible outcome: With the flag unset, ownership behavior is unchanged; only an operator who opts in sees the daemon released for reelection.
- Pass/fail: PASS only when syntax, unit tests, and flag-gated default-off wiring all match expectations.

## 3. TEST EXECUTION

### Prompt

```text
Validate the experimental daemon-ownership reelection path and confirm it is flag-gated and default-off.
```

### Commands

1. `node --check .opencode/bin/mk-spec-memory-launcher.cjs`
2. `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/launcher-daemon-reelection.vitest.ts`
3. `rg -n "daemonReelectionEnabled|shouldReleaseDaemonForReelection|contextServerSpawnIo" .opencode/bin/mk-spec-memory-launcher.cjs`

### Expected

- Command 1 exits with no syntax errors.
- Command 2 passes the reelection suite, including the default-off identity case where the launcher does not release the daemon and the enabled-release case where it does.
- Command 3 shows `daemonReelectionEnabled`, `shouldReleaseDaemonForReelection`, and `contextServerSpawnIo` at their definitions and at the call sites that resolve the flag, select spawn io, and gate the release.

### Evidence

Shell transcript for all commands: the `node --check` exit status, the vitest pass summary for `tests/launcher-daemon-reelection.vitest.ts`, and the grep output showing the flag resolver, the spawn-io selector, the release predicate, and the call sites that wire them together.

### Pass / Fail

- **Pass**: the syntax check passes, the reelection suite passes, the flag defaults to disabled, and the release predicate only returns true when reelection is enabled with a live daemon.
- **Fail**: the syntax check fails, the default-off identity case fails, the enabled-release case fails, the flag does not default to disabled, or the release predicate releases the daemon while reelection is off.

### Failure Triage

If the syntax check fails, inspect the helper placement and the CommonJS exports first. If the default-off identity case fails, confirm `daemonReelectionEnabled` resolves to disabled when the flag is unset and that `shouldReleaseDaemonForReelection` returns false in that state. If the enabled-release case fails, confirm the predicate returns true only when reelection is enabled and a live daemon is present, and that `contextServerSpawnIo` selects the matching spawn io. If grep cannot find the helpers, confirm the definitions and the flag, spawn-io, and release call sites all exist.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/daemon-ownership-reelection.md](../../feature_catalog/14--pipeline-architecture/daemon-ownership-reelection.md)
- Spec packet: [../../../../specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/022-daemon-ownership-reelection/implementation-summary.md](../../../../specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/022-daemon-ownership-reelection/implementation-summary.md)

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 426
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/daemon-ownership-reelection.md`

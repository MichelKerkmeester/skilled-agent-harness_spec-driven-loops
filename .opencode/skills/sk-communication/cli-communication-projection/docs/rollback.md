# Rollback

## 1. OVERVIEW

Rollback is complete, deterministic and reversible. Disabling projection never
modifies the canonical transcript, events, tool inputs or tool results. The
original-only path requires neither a provider nor a network.

This guide covers the four rollback surfaces: disabling the flag,
`OriginalOnlyEmergencyMode`, uninstalling the plugin and stopping wrapper use.
Each step is per-runtime and independently reversible, so rolling back one
runtime never forces a rollback of the others.

---

## 2. DISABLE THE FLAG

Disable projection at the source. Unset `COMMUNICATION_PROJECTION_ENABLED`, or
set it to a value other than `1`, `true` or `on`. Remove the git-ignored
`enablement.local.json` from the package root.

Every activation path consults `isProjectionEnabled()` before it projects. With
a false answer, the plugin leaves the original parts untouched and the wrapper
prints the byte-exact original. The original-only behavior is deterministic for
every runtime.

---

## 3. ORIGINAL-ONLY EMERGENCY MODE

Select `OriginalOnlyEmergencyMode` from the release entry point. It sets
`projectionEnabled` to false and requires no provider and no network. Use
`planRollback` to build the ordered rollback steps:

1. Disable new projections.
2. Select the original-only path.
3. Restore the previous exact package version.
4. Verify the canonical transcript digest is unchanged.

The plan carries `mutatesCanonicalTranscript: false`. Confirm that flag before
acting on the plan. The digest is integrity metadata, not transcript content.
Do not place raw transcript bytes or credential values in rollback logs.

---

## 4. UNINSTALL THE PLUGIN

To remove the OpenCode hook, delete
`.opencode/plugins/mk-communication-projection.js` and its test file
`.opencode/plugins/tests/mk-communication-projection.test.cjs`. OpenCode then
loads no projection hook for the session. No other plugin depends on the file.

You can also keep the file in place and disable it without removing it. Set
`MK_COMMUNICATION_PROJECTION_DISABLED=1` to kill the hook class. Or leave the
projection flag off. Both options render the byte-exact original.

---

## 5. STOP THE WRAPPERS

Stop launching target runtimes through `bin/cli-output-wrapper.mjs`. Launch
Claude Code, Codex, Pi, Devin and Cursor directly. Direct launch bypasses the
wrapper and no projection runs. Remove the wrapper invocation from any shell
alias or launcher script. Keep the previous exact tarball in a local release
cache while a rolled-back runtime may be re-enabled.

---

## 6. VERIFY ROLLBACK

Confirm the original renders byte-exactly in every runtime you rolled back.
Confirm the canonical transcript digest is unchanged. Run the compatibility
doctor before re-enabling any projection route, and read the evaluation gate
again as the rollout runbook teaches.

---

## 7. RELATED RESOURCES

- [Enablement](./enablement.md)
- [Rollout runbook](./runbook.md)
- [Install and verify](./install.md)
- [Configuration](./configuration.md)

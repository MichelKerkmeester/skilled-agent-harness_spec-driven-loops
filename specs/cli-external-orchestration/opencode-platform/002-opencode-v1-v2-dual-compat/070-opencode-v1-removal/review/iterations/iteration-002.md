# Iteration 002: Security (trust seam, destructive mode, secret and guard surfaces)

## Dispatcher

- Mode: review, target agent `@deep-review`, single iteration (2 of 5).
- Run: `2026-11-20T10:07:53.884Z`, generation 3, lineage `restart`, continuedFromRun `null`.
- Review target: `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal` (spec-folder), plus the merged code/CI surfaces named in the operator focus.
- Iteration number derived from the state log (one `type:"iteration"` record) = 2; it matches the dispatched number.
- Operator focus addressed in this iteration: the security posture of the merge's own changes. The version trust seam (`trustedExecutableFor`, `OPENCODE_BIN`, probe spawn) was re-read against the merge diff; the `remove-v1` destructive mode was audited line by line after its rewrite; the CI secret surface and the doctor battery's child environment were traced. The `skilled-loop` justified-list gap (`f6aa8dc052b`) was confirmed in iteration 1 and is not re-reported.

## Files Reviewed

- .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:1-100,100-300
- .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:51-53,1091-1152
- .skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json:1-28
- .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:1-180,184-500
- .skilled/commands/doctor/scripts/opencode-version-battery.cjs:1-30,335-347,862-895,936-1010
- .github/workflows/opencode-v2-battery.yml:1-160
- .opencode/plugins/lib/v2-bridge.js:16-23,300-360,360-470,560-602
- .skilled/hooks/shared/session-readers/opencode.mjs:1-90
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1255-1280,2415-2445,2555-2600
- .opencode/plugins/system-spec-gate.js:10,64,258
- .opencode/plugins/mcp-route-guard.js:5,83
- `git diff 06d02096e90^1 06d02096e90` slices for opencode-setup.sh, opencode-version-battery.cjs

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The doctor battery starts its private OpenCode 2 server without pinning the bind address, while handing it the whole parent environment** -- .skilled/commands/doctor/scripts/opencode-version-battery.cjs:966-970 -- `readV2` spawns `bin serve --port <port>` with no host flag, and `v2ServerEnv` (:339-347) spreads `...env`, so the child inherits the caller's provider credentials. The client side then assumes loopback (`serverUrl = http://127.0.0.1:<port>`, :974) and `findFreePort` pins its own probe to `127.0.0.1` (:867), so the readiness check and the server it validates do not share a stated bind posture. The port is drawn from the ephemeral range on a first-free basis. The exposure is password-gated (the child prints one and the battery returns it only in `OPENCODE_PASSWORD`, :988), which is why this stays at P2 rather than higher.
   Finding class: latent-security / unverified-bind-default
   Scope proof: the file is inside the declared review scope, and the `serve` spawn is a context line in `git diff 06d02096e90^1 06d02096e90 -- .skilled/commands/doctor/scripts/opencode-version-battery.cjs` (the merge replaced `runDebugConfig` instead), so this is an inherited posture in a reviewed file, not a merge regression. No claim here reaches outside the battery.
   Affected surface hints: `readV2`, the `--family=v2` doctor leg, `.github/workflows/opencode-v2-battery.yml` (runs the battery on a hosted runner), and any operator running the battery from a shared network.
   Case: an operator runs `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=v2` on a laptop joined to an untrusted network. If `serve`'s default bind is not loopback, the child — holding `OPENCODE_API_KEY` and every other inherited variable — is reachable at `<host>:<port>`, gated only by a printed password, while the battery reports success.
   ```json
   {"type":"finding-adjudication","claim":"The battery's private server bind address is left to OpenCode 2's default, so the loopback posture its client and port probe assume is unverified.","evidenceRefs":[".skilled/commands/doctor/scripts/opencode-version-battery.cjs:966",".skilled/commands/doctor/scripts/opencode-version-battery.cjs:339",".skilled/commands/doctor/scripts/opencode-version-battery.cjs:867",".skilled/commands/doctor/scripts/opencode-version-battery.cjs:974",".skilled/commands/doctor/scripts/opencode-version-battery.cjs:988"],"counterevidenceSought":"Searched the file for any host pinning: only `findFreePort` (`probe.listen(0, '127.0.0.1')`, :867) and the client `serverUrl` (:974) name loopback; the spawn carries no host flag. Searched `git diff 06d02096e90^1 06d02096e90` for the spawn line: unchanged by the merge, so it is inherited rather than introduced. Checked whether the password alone bounds exposure: `waitForBanner` requires both a listening line and a password before any request, so an attacker without the password is limited to a pre-auth surface.","alternativeExplanation":"OpenCode 2's `serve` may already bind loopback by default and refuse a non-loopback bind without an explicit flag, in which case the omitted flag is redundant rather than risky. The battery cannot confirm this from the repository, and the CI runner's own network isolation would mask it there.","finalSeverity":"P2","confidence":0.45,"downgradeTrigger":"Downgrade to a note once `serve` is shown to default to loopback (or to refuse non-loopback binds without an explicit host flag). Escalate to P1 if the default binds every interface, because the child then serves the caller's credentials beyond the host boundary with only a printed password in front."}
   ```
2. **An unmapped plugin hook key is dropped with no runtime signal, so a guard plugin's block can silently become a no-op on OpenCode 2** -- .opencode/plugins/lib/v2-bridge.js:348 -- `setup` computes `skippedKeys` as every own key of the factory's hooks that is not in `MAPPED_HOOKS` (:16-23: `event`, `tool.execute.before`, `tool.execute.after`, `experimental.chat.system.transform`, `tool`, `dispose`). The list is then attached only as a non-enumerable property of the returned cleanup function (:429) — it is never thrown, logged, or asserted at registration. The merge removed the v1 `server` entry point that forwarded the whole hook object, so on the dual path this drop is new: a key outside the set resolves to registration that does not exist. The repository's hard guards currently sit inside the mapped set (.opencode/plugins/system-spec-gate.js:258 and .opencode/plugins/mcp-route-guard.js:83 both register `tool.execute.before`), so nothing is lost today.
   Finding class: silent-degradation / guard-availability
   Scope proof: the bridge and the plugins are inside the declared review scope; the claim is limited to the mapping table and the drop path, and the two guard plugins were read only to establish that their keys are mapped (no finding against them).
   Affected surface hints: `dualPlugin` `setup` and its cleanup contract, every plugin under .opencode/plugins/, the registration tests (.opencode/plugins/tests/v2-registration.test.cjs, v2-hard-plugins.test.cjs).
   Case: a future guard plugin registers `permission.ask` (or any key outside the six) to deny a dangerous action. `dualPlugin` returns successfully, the host sees a plugin that loaded, and the guard never runs; the only trace is `cleanup.skippedKeys`, which no production caller reads and the registration tests do not assert against.
   ```json
   {"type":"finding-adjudication","claim":"`dualPlugin` silently ignores hook keys outside MAPPED_HOOKS, so a guard that registers an unmapped key loads without effect and without any failing signal.","evidenceRefs":[".opencode/plugins/lib/v2-bridge.js:16",".opencode/plugins/lib/v2-bridge.js:348",".opencode/plugins/lib/v2-bridge.js:429",".opencode/plugins/system-spec-gate.js:258",".opencode/plugins/mcp-route-guard.js:83"],"counterevidenceSought":"Read the whole `setup` path for a warn/throw on `skippedKeys`: none exists — the array is frozen onto the cleanup function and nothing else consumes it. Checked whether every security-relevant key is mapped: both guard plugins use `tool.execute.before`, which is in the set, so the drop is latent rather than active. Checked whether the host could be tolerant of the same key: the six-entry set is the bridge's own translation table, so the drop is the bridge's decision, not the host's.","alternativeExplanation":"Silently ignoring a key the host cannot support may be equivalent to the host ignoring it, and warning on every unmapped key would be noise while the set is small and stable. The counter is that a hard guard degrading to a no-op is exactly the class that should fail loudly rather than fail open.","finalSeverity":"P2","confidence":0.55,"downgradeTrigger":"Downgrade to a note if the registration test family asserts each guard plugin's hook keys are all in MAPPED_HOOKS (making the drop observable in CI), or if the host itself rejects unknown keys before the bridge sees them. Escalate to P1 if a currently shipped guard plugin is found registering a key outside the set."}
   ```

## Traceability Checks

- Core `spec_code` -- status: pass. Two documented security claims were checked against the code rather than trusted: (a) `mode_remove_v1`'s header says "every refusal runs before the first write, and data files are listed, never removed" (.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:325-327). Verified: `check_v1_launcher` (:222-239) exits before `require_npm`/`mv`/`npm uninstall`; `list_data_files` (:209-221) only prints; the sole `rm` targets `$V1_LAUNCHER` (:431) and the sole `mv` targets `$BIN/opencode` ↔ `$PRESERVED_ASIDE` (:389, :385 via restore). (b) The battery's header says the private server's password "is only ever handed back to it as an environment variable, never printed or stored" (.skilled/commands/doctor/scripts/opencode-version-battery.cjs:13-16). Verified: the password is captured by `waitForBanner` (:894) and used only to build `apiEnv` (:988); no result field, log line or JSON summary carries it.
- Core `checklist_evidence` -- not re-run this iteration. Iteration 1 recorded it as pass with the AC-007/T021 evidence and the `skilled-loop` confirmation; repeating it here would restate an exhausted check, and no packet evidence was needed to reach this iteration's findings.

## Integration Evidence

- Dispatch contract: `.skilled/commands/deep/review.md` supplies this leaf's single-iteration boundary; no nested dispatch was performed and no sub-agent was invoked.
- Append gateway: `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` (`--mode review`) is the only writer of `review/deep-review-state.jsonl` for this iteration; the projection was not written directly.
- CI surface: `.github/workflows/opencode-v2-battery.yml` — `permissions: contents: read` (:70-71), every third-party action pinned by commit SHA with a version comment, all three action references resolve to `actions/*`, and no `secrets.*` expression appears anywhere in the file. The job's only credential-looking value is `OPENCODE_BIN` written to `$GITHUB_ENV` (:137), which is a path under `$RUNNER_TEMP`, not a secret. `.github/workflows/**` and `.github/actions/**` were grepped for `secrets.`/`OPENCODE_API_KEY`: three hits, all in unrelated workflows (`dependabot-auto-merge.yml`, `trigger-index-rebuild.yml`), none in the battery.
- Doctor battery leg: `.github/workflows/opencode-v2-battery.yml:139-146` runs the battery that owns finding DR2-P2-001, so the bind question travels with the workflow's own trigger paths.

## Edge Cases

- The `remove-v1` TOCTOU between `check_v1_launcher` (:222) and the final `rm -- "$V1_LAUNCHER"` (:431) is real but not a privilege boundary: it requires write access to `$HOME/.local/bin`, which is already the user's own authority, and `rm` on a swapped-in symlink removes the link rather than its target. Recorded here rather than as a finding.
- `mode_remove_v1` compares `resolved_before == "$pkg_real/"*` (:381), so an `opencode` entry resolving to the package directory itself (no trailing component) fails the prefix test and takes the preserve-and-restore path. That is the conservative branch, so the ambiguity costs an extra `mv` rather than a deletion.
- `trustedExecutables()` accepts a path-qualified `OPENCODE_BIN` without an executability check (:121-129), but `fileIdentity` returns `null` for an unreadable or nonexistent path and the identity comparison then cannot match (:139), so an unusable override falls through to `unknown` instead of widening trust.
- The version filter is currently inert by construction: `UNRESOLVED_FAMILIES` (:53) is `['unknown','unsupported']` and every shipped rule declares `appliesTo: ["v2"]` (hard-rules.json:8,15,22,29), so `appliesToAll` is true for all four rules and no rule can be skipped for any verdict. This is the same observation that bounded iteration 1's `opencode2` finding to P2 and is not re-reported as a new finding.
- Nothing in this iteration required a write outside the review packet; no scope violation occurred.

## Confirmed-Clean Surfaces

- The trust seam closes command injection: a path-qualified token is compared by file identity (canonical path, size, mtime; .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:103-118) and the probe runs the trusted path, never the command's own spelling (:132-142). A crafted capture such as `"/tmp/x;curl evil|/tmp/opencode"` cannot execute, because `executableFile` (:96-102) rejects the literal string before any spawn and `spawnSync` is called without a shell (:63-66).
- Probe timeouts are bounded on both paths: `spawnSync` with `timeout: PROBE_TIMEOUT_MS` (:64) for the synchronous resolver, `execFile` with the same timeout (:78) plus a `Promise.race` deadline for the async resolver (:145-157), and a failed or timed-out probe caches nothing (`cacheable: false`, :158).
- The hook resolver fails open (`unknown`) and the deep-loop resolver fails closed (iteration 1), and neither runs a file the dispatch command merely names.
- `remove-v1` mutations are narrowed relative to the parent: the merge replaced the multi-name `mv`/`rm`/`ln -sfn`/`chmod` loop with a single `rm --` on `$V1_LAUNCHER`, a `mv --` of `$BIN/opencode` to a hidden aside path, and `npm uninstall -g --prefix "$PREFIX" "$V1_PKG_NAME"` where both operands are quoted and the package name is a literal constant (`opencode-ai`). Quoted `--` forms and constant operands leave no globbing or option-injection surface.
- A foreign `opencode` entry is protected from npm's bin-name deletion: it is set aside before the uninstall and restored with an identity check afterwards (.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:373-404), and a collision at the aside path refuses before any write.
- The session reader opens SQLite read-only and never interpolates command text into SQL: the only statement read here is a fixed `sqlite_master` query (.skilled/hooks/shared/session-readers/opencode.mjs:68-73), the connection is `{ readOnly: true }` (:65-67), and the database path honours `XDG_DATA_HOME`/`OPENCODE_DB` with no v1 filename fallback (:43-58).
- `fanout-run.cjs` spawns without a shell (`spawn(command, cmdArgs, { cwd, env, stdio, detached })`, :2426-2433), keeps the prompt out of the recorded fingerprint behind a digest (:2577-2595), and quotes rerun commands with a strict allowlist plus `'\''` escaping (:1260-1264), so a prompt or model string cannot break out of a printed command.
- CI carries no secret into the battery job, and the job's env contains only the pinned package spec and the installed binary path.

## Ruled Out

- "A launcher name or path bypasses the dispatch guard": ruled out for rule *application*. `evaluate` applies every rule when the version is unresolved (.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1119-1123) and, when the command's binary token does not match either regex at all, `filterByVersion` stays false so the `continue` at :1124 never fires — an undetected dispatch still takes every rule. Name and path therefore cannot buy an unchecked dispatch today.
- "`OPENCODE_BIN` widens the executable trust set to an attacker-named file": ruled out — the override must exist and be readable for `fileIdentity` to match, and the probe then runs the resolved trusted path, not the value embedded in the command.
- "The `remove-v1` TOCTOU lets a link swap delete a foreign file": ruled out — `rm` on a symlink unlinks the link, and the swap requires the user's own directory write authority (see Edge Cases).
- "The doctor battery leaks the private server password into its JSON artifact": ruled out — the value lives only in `apiEnv` for in-process requests (:988) and no result field carries it.

## Next Focus

- Dimension: traceability.
- Focus area: the chain from `deep-review`/`deep-research` command contracts to the executor adapters and the workflow YAML, plus packet-to-code traceability for the v1-removal acceptance criteria under the 001/002/003 phases.
- Reason: security closed the privilege, destructive-action and secret surfaces; the overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`) are still unexecuted and the run needs at least one overlay result before STOP.
- Rotation status: correctness and security reviewed; traceability and maintainability remain.
- Blocked/productive carry-forward: reuse the productive category "read the producer and its consumer together", applied to command contract → adapter → YAML; no blocked approaches from iteration 1 apply to traceability.
- Required evidence: file:line for each contract-to-adapter hop, and a named file for each acceptance criterion claimed as met.
- Recovery note: not applicable.

Review verdict: PASS

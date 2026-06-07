# Release Notes

## v3.5.0.5 (rollup since v3.5.0.2)

This release rolls up everything landed since the `v3.5.0.2` tag: three changelog increments that, together, make the MCP daemon survive a session ending, give every skill README one voice, and close the anti-disconnection investigation. The headline is that the shared memory daemon no longer dies with whichever session happened to own it.

### Highlights

- **The shared daemon survives a session ending.** Daemon re-election is now on by default for every user, so a disposing session releases the shared mk-spec-memory daemon for another live session to adopt instead of killing it. Set `SPECKIT_DAEMON_REELECTION=0` to opt out.
- **A real test backs it.** A hermetic integration test drives the actual release-vs-kill decision and OS process semantics, proving flag-on releases the daemon and flag-off kills it, without touching the shared database or socket.
- **The launcher got durable.** Disposal flap guard, a persistent launcher log, lease-probe reap hardening, an mk-code-index reconnecting proxy, and an opt-in orphan-process sweeper all shipped.
- **One voice for every skill README.** The 22 skill READMEs were rewritten into a single narrative voice and the template now starts there.
- **The operator docs caught up.** ENV_REFERENCE, the feature catalog, the manual testing playbook, the runbooks, and the README all reflect the new behavior, and the repo-wide perishable-comment-label backlog was scrubbed from the live code.

### What's in each increment

#### v3.5.0.5, Daemon Re-election On By Default
Re-election moved from a machine-local opt-in to on-by-default across the three aligned runtime configs (`.mcp.json`, `opencode.json`, `.codex/config.toml`). The orphan-sweep LaunchAgent template the runbook referenced now exists (dry-run by default), and a dispatched cli sub-session's session-scope error is documented as an intended guard.

#### v3.5.0.4, The Deferred Lifecycle, Closed
The daemon-reliability arc. A converged investigation found the real flap was the launcher killing the daemon child on a disposing runtime. Phase 017 stopped the dominant flap, and the deferred hardening shipped: persistent log, reap hardening, code-index reconnect, orphan-sweep activation, and the re-election foundation, each flag-gated and default-safe where it changes lifecycle. Then the operator docs were aligned, the import-purity and comment-hygiene-checker follow-ups landed, and the repo-wide label backlog was scrubbed.

#### v3.5.0.3, One Voice for Every Skill README
The skill READMEs were rebuilt into one narrative voice, grounded in each skill's real files by a two-model deep-context pass, with the sk-doc template updated so new skills start in that voice.

### Honest status

Full multi-session secondary adoption of a released daemon is still under live observation rather than proven by a CI test, because a real launcher cannot be spawned in a test without touching the shared lease and database. The release-vs-kill decision is covered by the integration test, and an unadopted released daemon is bounded by the idle self-exit, so the worst case matches the prior behavior. The launcher's code default stays off, so the runtime configs are a one-character revert.

### Upgrade

Mostly no-ops by default. The re-election config change activates when a launcher starts on a fresh session, so a running daemon keeps its old behavior until then. No rebuild is required; the launchers are committed `.cjs`.

### Full details

Per-version changelogs: `v3.5.0.3.md`, `v3.5.0.4.md`, `v3.5.0.5.md` in this directory. Daemon-reliability spec packets: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/017` through `027`.

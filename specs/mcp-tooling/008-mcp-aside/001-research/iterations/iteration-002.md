# Iteration 2: Aside lifecycle, accounts, and unattended boundaries

## Focus

Clarify the operational contract around account selection, task continuation, browser-profile binding, MCP process persistence, permissions, and unattended execution. The iteration deliberately avoids opening a real browser tab or mutating a profile.

## Actions Taken

- Re-read the reducer dashboard/registry and the iteration-1 route proof before selecting a lifecycle-focused angle.
- Rechecked the installed CLI help for `aside`, `aside exec`, `aside repl`, `aside account`, and `aside mcp`, including the update flag and the absence of MCP account/session options.
- Reconciled the developer, security, tasks, privacy, and troubleshooting documentation for account/profile state, permission modes, approvals, saved credentials, MFA/CAPTCHA, and visible task continuation.
- Reused the fresh-process MCP JSON-RPC observations as lifecycle evidence: initialize, `tools/list`, a non-mutating `repl` capability probe, an unbound `listBrowserTabs()` call, and the observed idle/shutdown telemetry.
- Audited the question “is there a standalone Aside daemon/session command?” against the public CLI surface; no such documented command was found, so internal daemon behavior remains out of scope.

## Findings

1. The CLI has two distinct continuation concepts. `aside --session <id> "Continue"` and the equivalent `aside exec --session <id>` continue a browser-agent task conversation; `aside repl` is the deterministic browser-automation JavaScript entry point. The live MCP `repl` process is persistent, but its browser context is not equivalent to a general task-session selector. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local `aside --help`, `aside exec --help`, and `aside repl --help`, observed 2026-07-16] [INFERENCE: keep task continuation and REPL attachment as separate packet concepts]**

2. Account selection is exposed on the task-agent paths, not on the documented MCP launcher. The stable surface is `aside account list`, `aside account status [id]`, `aside account use <id>`, plus `--account <id>` on `aside` and `aside exec`; `aside mcp --help` exposes only help and “start the MCP server over stdio.” A UTCP manual should therefore launch the local server and rely on the user's Aside profile/session state rather than inventing `ASIDE_ACCOUNT`, bearer-token, or OAuth fields. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local `aside --help`, `aside account --help`, `aside exec --help`, `aside mcp --help`, observed 2026-07-16]**

3. The observed MCP lifecycle is process-scoped and stdio-driven: the client starts `aside mcp`, performs JSON-RPC initialization and tool discovery, then keeps the process alive for repeated `repl` calls. The server reports `tools.listChanged: true`; its observed startup telemetry included `discoveryIdleTimeoutMs: 300000` and `replIdleTimeoutMs: 1800000`, and it shuts down when the stdio stream ends. These values are useful operational telemetry, not a promised public configuration API. **[SOURCE: local MCP JSON-RPC/startup/shutdown probe, observed 2026-07-16]**

4. A fresh MCP process does not acquire a browser merely by starting. The non-mutating `listBrowserTabs()` probe failed with “This task is not bound to a browser profile. Open it in Aside browser and try again.” The packet must make browser binding a precondition, surface this failure clearly, and avoid implying that UTCP registration alone creates a usable browser session. **[SOURCE: local `tools/call(repl)` probe, observed 2026-07-16]**

5. Aside's documented security model is permission-policy based. New tasks default to Guard; Read only and Full access are explicit alternatives, and browser/network/tool rules can be allowed, asked, or denied. Full access does not make saved password values available to the agent. A packet should preserve these boundaries and should not normalize Full access as a prerequisite for every browser workflow. **[SOURCE: https://docs.aside.com/help/security] [SOURCE: https://docs.aside.com/help/tasks]**

6. Human-in-the-loop interruption is part of the normal task model. MFA, CAPTCHA, identity verification, approvals, and other visible steps can pause a task and require the user to resume it in the browser. Therefore “unattended” can describe a best-effort run only after profile, permission, and site prerequisites are satisfied; it cannot be promised as a universal property of the MCP fallback. **[SOURCE: https://docs.aside.com/help/tasks] [SOURCE: https://docs.aside.com/help/troubleshooting]**

7. The public CLI exposes no separate documented `daemon`, `status`, `stop`, or MCP-session-selection command. This does not prove that the product has no internal daemon; it establishes only that `mcp-aside-devtools` should document the externally supported stdio process lifecycle and avoid relying on private daemon internals. **[SOURCE: local `aside --help` and `aside mcp --help`, observed 2026-07-16] [INFERENCE: absence from help is a supportability boundary, not proof of nonexistence]**

8. The local install/update surface is operationally relevant: `aside --help` exposes `--update`, while the official installer supports version/base/install/bin directory environment overrides and macOS arm64/x64 artifacts. The packet should use the official installer or an already-installed CLI, report `aside --version`, and avoid silently updating a user's installation. **[SOURCE: https://releases.aside.com/install.sh] [SOURCE: local `aside --help`, observed 2026-07-16]**

## Ruled Out

- Treating `--session` as an MCP browser-target selector: it is documented on the agent-task paths; the MCP launcher has no such option. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local CLI help, observed 2026-07-16]**
- Treating a signed-in account as sufficient for unattended execution: permission gates, browser-profile binding, approvals, MFA, CAPTCHA, and visible verification remain independent prerequisites. **[SOURCE: https://docs.aside.com/help/security] [SOURCE: https://docs.aside.com/help/tasks] [SOURCE: https://docs.aside.com/help/troubleshooting]**
- Depending on undocumented daemon subcommands or private timeout flags: the public help surface does not expose them. **[SOURCE: local `aside --help` and `aside mcp --help`, observed 2026-07-16]**

## Dead Ends

- A safe browser-bound smoke test could not be performed without selecting or opening a real Aside profile; no profile or website was touched. **[SOURCE: local MCP unbound-profile error, observed 2026-07-16]**
- Public documentation explains task and permission behavior but does not publish a separate MCP session registry or daemon API. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local CLI help, observed 2026-07-16]**

## Edge Cases

- A client may keep the stdio process alive while the browser task/profile is unavailable; process persistence must not be mistaken for browser availability.
- A task can be authenticated yet paused for a human approval or site challenge.
- A future CLI release can add tools or flags; runtime `initialize`/`tools/list` discovery should remain the source of truth.
- The local timeout values observed in process telemetry may change; they should be logged diagnostically, not hard-coded as user-facing guarantees.

## Sources Consulted

- [SOURCE: https://docs.aside.com/help/developers]
- [SOURCE: https://docs.aside.com/help/security]
- [SOURCE: https://docs.aside.com/help/tasks]
- [SOURCE: https://docs.aside.com/help/privacy]
- [SOURCE: https://docs.aside.com/help/troubleshooting]
- [SOURCE: https://releases.aside.com/install.sh]
- [SOURCE: local `aside --help`, `aside exec --help`, `aside repl --help`, `aside account --help`, `aside mcp --help`, observed 2026-07-16]
- [SOURCE: local MCP JSON-RPC lifecycle and unbound-profile probes, observed 2026-07-16]

## Assessment

- New information ratio: 0.78
- Questions addressed: task-session versus REPL scope; account selection; stdio lifecycle; browser-profile binding; permission and approval gates; daemon supportability boundary; install/update considerations.
- Questions answered: account/auth is profile/task state rather than a documented MCP credential contract; a fresh MCP process is persistent but not browser-bound; unattended operation is conditional; no public daemon/session-control command is part of the supported CLI surface.
- Confidence: high for observed CLI/help and protocol behavior; high for official permission/task boundaries; medium for undocumented daemon internals and future timeout stability.

## Reflection

- What worked and why: separating task-agent continuation from REPL/MCP process state made the session model precise without inventing a hidden browser selector.
- What did not work and why: a browser-bound smoke test remained intentionally unavailable because it would require a real profile and user-facing browser state.
- What I would do differently: use a disposable, explicitly authorized public-page profile test in a later implementation/validation task, not in this research-only lineage.

## Recommended Next Focus

Iteration 3: map the verified Aside surface to `bdg`, derive the CLI-primary/Code Mode fallback packet, and draft the exact `aside` UTCP manual shape while preserving runtime discovery and capability-probe caveats.

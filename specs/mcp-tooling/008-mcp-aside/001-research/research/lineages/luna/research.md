---
title: Aside CLI and MCP developer surface — luna lineage synthesis
description: Evidence-backed research for the mcp-aside-devtools packet and aside UTCP manual.
version: 1.0.0
---

# Aside CLI and MCP developer surface

## 1. Executive Summary

Aside has a real standalone CLI. It is not merely an MCP server: the installed binary exposes high-level agent tasks (`aside`/`aside exec`), deterministic browser JavaScript (`aside repl`), account management, and a local MCP launcher (`aside mcp`). The installed version observed on 2026-07-16 was `1.26.626.1517`. **[SOURCE: [Aside developer documentation](https://docs.aside.com/help/developers); local `aside --version` and `aside --help`, observed 2026-07-16]**

The MCP surface is deliberately small. `aside mcp` starts a local stdio MCP server; a live JSON-RPC handshake reported server `aside`, protocol `2024-11-05`, and `tools.listChanged: true`. `tools/list` exposed exactly one tool, `repl`, whose required input is a `title` and JavaScript `code`. The REPL advertises a persistent sandboxed ES2023+/Playwright environment with navigation, DOM inspection, screenshots, filesystem helpers, and fetch; it does not expose verified first-class `navigate`, `dom`, `screenshot`, `console`, or `network` MCP tools. **[SOURCE: local `aside mcp --help`, MCP `initialize`, `tools/list`, and non-mutating `tools/call(repl)` probes, observed 2026-07-16]**

The recommended packet posture is therefore CLI-primary plus Code Mode fallback: use `aside`/`aside exec` for agent tasks and `aside repl` for direct deterministic browser automation; register a local `aside mcp` stdio manual for fallback composition. Treat the expected Code Mode spelling `aside.aside_repl` as a runtime-discovery result to confirm after registration, not as a hard-coded product promise. **[SOURCE: local `.opencode/skills/mcp-code-mode/SKILL.md:217-260, 289-326`; [Aside developer documentation](https://docs.aside.com/help/developers)] [INFERENCE: repository naming convention applied to the live `repl` tool]**

## 2. Research Question and Scope

This detached lineage investigated the Aside CLI command surface, MCP tools/auth/transport/install/session model, browser-automation workflows, contrast with the repository's Chrome DevTools `bdg` patterns, and the inputs needed to author `mcp-aside-devtools` and an `aside` UTCP manual.

The lineage was explicitly bounded to `.opencode/specs/mcp-tooling/008-mcp-aside/001-research/research/lineages/luna`. It did not author the skill, edit the parent spec, modify root `.utcp_config.json`, persist a graph, save memory, or stage changes. The parent phase specification identifies those as later phase work. **[SOURCE: `.opencode/specs/mcp-tooling/008-mcp-aside/001-research/spec.md`; lineage `deep-research-config.json`]**

## 3. Evidence Classes and Confidence

Three evidence classes were kept separate:

- Official Aside documentation and the official installer script: high confidence for documented user-facing behavior and stated security boundaries.
- Live local CLI/MCP observations: high confidence for installed version `1.26.626.1517`, help output, JSON-RPC protocol shape, and the current one-tool inventory; medium confidence for long-term stability because the server schema is runtime-discovered.
- Repository conventions and `bdg` references: high confidence for this workspace's UTCP/Code Mode shape and documented `bdg` patterns; they do not prove untested Aside behavior.

The central limitation is intentional: no real Aside browser profile was opened or mutated. The browser-binding failure is verified, but bound-page DOM output, screenshot bytes, and console/network listener behavior remain validation tasks. **[SOURCE: iterations `iteration-001.md`, `iteration-002.md`, `iteration-003.md`; `resource-map.md`]**

## 4. Standalone CLI Surface

The installed top-level surface is:

```text
aside [options] [prompt...]
aside [options] <command> [args...]

Options:
  --version
  --session <id>
  --account <id>
  --model <model>
  --provider <provider>
  --speed <default|fast>
  --effort <off|minimal|low|medium|high|xhigh|ultrabrowse>
  --update

Commands:
  account
  exec
  repl
  mcp
```

If no command is specified, Aside starts a browser-agent session; a URL prompt opens that page in Aside. The official developer page documents `aside "..."`, `aside --session <session-id> "Continue"`, account inspection/switching, `--account`, `aside exec`, `aside repl`, and `aside mcp`. **[SOURCE: [Aside developer documentation](https://docs.aside.com/help/developers); local `aside --help`, observed 2026-07-16]**

Subcommand roles:

| Surface | Role | Verified options/behavior |
|---|---|---|
| `aside [prompt]` | Browser-agent task | `--session`, `--account`, model/provider/speed/effort; URL prompts are supported |
| `aside exec [prompt]` | Explicit browser-agent task command | Same task/session/account/model controls |
| `aside repl [code]` | Browser automation JavaScript | Runs code against Aside Browser; `openTab(...)` is documented in examples |
| `aside account` | Local account inspection/selection | `list`, `status [id]`, `use <id>` |
| `aside mcp` | MCP server | Starts MCP over stdio; help exposes no URL, port, account, session, bearer, OAuth, or HTTP option |

`--session` belongs to the agent-task continuation path. It must not be repurposed as an MCP browser-target selector: `aside mcp --help` exposes no such option. **[SOURCE: local `aside --help`, `aside exec --help`, `aside repl --help`, `aside account --help`, `aside mcp --help`, observed 2026-07-16]**

## 5. Install, Version, and Launch Mechanics

The official developer page gives this install bootstrap:

```bash
curl -fsSL https://releases.aside.com/install.sh | bash
```

The fetched installer observed in this research supports macOS arm64 and x64, defaults to an application install under `~/.aside/cli`, and places the `aside` shim under `~/.local/bin/aside`. It accepts `ASIDE_CLI_VERSION`, `ASIDE_CLI_BASE_URL`, `ASIDE_CLI_INSTALL_DIR`, and `ASIDE_CLI_BIN_DIR` overrides. The CLI also exposes `--update`; a packet should never invoke an update implicitly. **[SOURCE: [Aside developer documentation](https://docs.aside.com/help/developers); [official install script](https://releases.aside.com/install.sh); local `aside --help`, observed 2026-07-16]**

Recommended preflight for the CLI-primary path:

```bash
command -v aside
aside --version
aside --help
```

If the binary is absent, report the official install command and let the user choose whether to install. Do not silently update or alter an existing Aside profile. **[SOURCE: local `mcp-chrome-devtools/SKILL.md` routing convention adapted to the verified Aside CLI; official installer source above]**

## 6. MCP Transport and Handshake

The documented MCP configuration is a local process launch:

```json
{
  "mcpServers": {
    "aside": {
      "command": "aside",
      "args": ["mcp"]
    }
  }
}
```

The local `aside mcp --help` output says “Start the MCP server over stdio.” A direct JSON-RPC probe returned:

```json
{
  "protocolVersion": "2024-11-05",
  "capabilities": {"tools": {"listChanged": true}},
  "serverInfo": {"name": "aside", "version": "1.26.626.1517"}
}
```

No public or live evidence supports registering Aside as a remote HTTP/SSE endpoint or adding a bearer/API-key/OAuth field. This is an evidence boundary, not a claim that internal product code could never gain another transport. **[SOURCE: [Aside developer documentation](https://docs.aside.com/help/developers); local `aside mcp --help` and MCP `initialize`, observed 2026-07-16] [INFERENCE: local stdio is the supported registration surface for this packet]**

## 7. Live MCP Tool Inventory and Schema

`tools/list` returned exactly one tool:

```text
name: repl
required input: title (string), code (string)
execution.taskSupport: forbidden
```

The tool description advertises a persistent sandboxed ES2023+ REPL, Playwright APIs, a 120-second call timeout, no default/external modules and no `import`/`require`, plus helpers including:

- `page`, `tabs`, `listBrowserTabs`, `attachBrowserTab(targetId)`, `attachActiveBrowserTab`, `getTabByTargetId`
- `openTab(url)`, `closeTab`, `snapshot(page, options?)`
- `page.screenshot(options)`, locator screenshots, `page.pdf`, `annotatedScreenshot`
- `console.log`, `display`, `fetch`, `sleep`
- `fs` from `node:fs/promises`, `pwd`, `path`, `Buffer`

A non-mutating capability probe confirmed representative values/functions (`page`, `tabs`, `fs`, `pwd`, `openTab`, `snapshot`, `screenshot`, and `fetch`). This is a single Code Mode surface, not a verified family of separate Aside MCP tools. **[SOURCE: local MCP `tools/list` and `tools/call(repl)` capability probe, observed 2026-07-16]**

## 8. Browser-Automation Capability Mapping

| Workflow | Aside CLI primary | Aside MCP fallback | Evidence and limitation |
|---|---|---|---|
| Navigate | `aside repl` with `openTab(url)`; high-level alternative `aside "Open ..."` | `repl` code with `openTab(url)` after browser binding | `openTab` is advertised and was observed as a function; bound-page navigation was not run |
| DOM inspection | `aside repl` with `snapshot(page)` and Playwright locators | Same code inside `repl` | `snapshot` is advertised/observed; actual page output is untested |
| Screenshots | `aside repl` with `page.screenshot(...)` or annotated screenshot | Same code inside `repl` | Screenshot methods are advertised; output path/bytes were not validated |
| Console capture | No dedicated verified CLI helper | Guarded Playwright `page.on('console', ...)` probe only if supported | No dedicated Aside tool; event-listener behavior is untested |
| Network capture | No dedicated verified CLI helper | Guarded `page.on('request'/'response', ...)` probe only if supported | Do not promise HAR export parity; no dedicated Aside tool was discovered |
| Session | `aside`/`aside exec --session` for task continuation; `aside repl` for automation code | Persistent stdio REPL, but no public MCP selector | Task continuation and browser-profile binding are separate concepts |

Console/network listener examples are conditional inferences from the advertised Playwright surface, not verified Aside-specific contracts. A packet must discover capabilities, bound a page, bound result sizes, and clean up listeners before presenting those paths as supported. **[SOURCE: local MCP `tools/list`, observed 2026-07-16] [INFERENCE: standard Playwright event APIs may be usable but require validation]**

## 9. Auth, Privacy, Permissions, and Unattended Use

Aside authentication is account/profile and task-policy based in the documented surface. `aside account list/status/use` and `--account` on `aside`/`aside exec` select task-agent account state. `aside mcp` has no documented account or auth option. The correct UTCP manual therefore contains no account ID, static token, or OAuth field. **[SOURCE: [Aside developer documentation](https://docs.aside.com/help/developers); local account/MCP help, observed 2026-07-16]**

The official security model distinguishes Read only, Guard (the default for new tasks), and Full access, with browser/network/tool rules that may be Allowed, Asked, or Denied. Full access does not expose saved password values to the agent. **[SOURCE: [Aside security documentation](https://docs.aside.com/help/security); [Aside task documentation](https://docs.aside.com/help/tasks)]**

MFA, CAPTCHA, identity verification, approvals, and other visible steps can pause a task and require the user to resume it. Consequently, “unattended” should mean best-effort after the user has prepared a signed-in profile and permission policy; it is not a universal guarantee of the MCP fallback. A transport-healthy but browser-unbound or approval-paused task is an expected state that the packet should report distinctly. **[SOURCE: [Aside task documentation](https://docs.aside.com/help/tasks); [Aside troubleshooting documentation](https://docs.aside.com/help/troubleshooting)]**

## 10. Session and Daemon Model

The observed model has three layers:

1. An agent task can be continued with `--session <id>` on `aside` or `aside exec`.
2. `aside repl`/the MCP `repl` tool keeps a persistent JavaScript context while its process is alive.
3. Browser operations still require an Aside browser task/profile binding.

A fresh stdio process was initialized successfully, but `listBrowserTabs()` returned: `This task is not bound to a browser profile. Open it in Aside browser and try again.` This proves that starting `aside mcp` is not sufficient to control an arbitrary browser. Observed process telemetry included `discoveryIdleTimeoutMs: 300000` and `replIdleTimeoutMs: 1800000`; log these diagnostically, not as public configuration guarantees. **[SOURCE: local MCP startup/shutdown and unbound-profile probes, observed 2026-07-16]**

The public CLI exposes no separate documented `daemon`, `status`, `stop`, or MCP session-selection command. That does not prove internal daemon absence; it means the packet should rely only on the supported stdio process lifecycle and should close the MCP process for cleanup. **[SOURCE: local `aside --help` and `aside mcp --help`, observed 2026-07-16] [INFERENCE: public-help absence is a supportability boundary]**

## 11. Recommendations for `mcp-aside-devtools`

### CLI-primary path

1. Verify `aside` and report its version.
2. Use `aside`/`aside exec` for high-level browser-agent tasks, account selection, and task continuation.
3. Use `aside repl` for deterministic navigation, snapshots/locators, screenshots, and guarded page-level probes.
4. Before automation, confirm the intended Aside profile/task and permission mode. Treat visible approvals and site challenges as resumable outcomes.
5. Keep `aside --update` and the official installer user-invoked.

### Code Mode MCP fallback

1. Register the local stdio manual shown in Section 12.
2. Use Code Mode discovery (`list_tools`/`search_tools`/`tool_info`) before calling; the live server currently has one `repl` tool.
3. Confirm the prefixed callable derived from the current manual/tool pair—expected form `aside.aside_repl`—rather than assuming it.
4. Call `repl` with a descriptive title and bounded code. Start with a non-mutating capability/profile probe.
5. Run `openTab`, `snapshot`, screenshot, or other operations only after the browser task/profile is bound.
6. If the unbound-profile error appears, report the profile prerequisite; do not misdiagnose it as missing bearer authentication.
7. Treat console/network as guarded capability probes, clean up listeners, and do not promise HAR parity.

### Handoff packet contents

The skill should include routing criteria, the preflight commands, the local UTCP object, discovery-first Code Mode instructions, a browser-binding error explanation, permission/unattended caveats, and a validation backlog for bound-page behavior. It should not claim separate Aside MCP tools or direct CDP-domain parity. **[SOURCE: `.opencode/skills/mcp-code-mode/SKILL.md`; local `mcp-chrome-devtools/SKILL.md` and references]**

## 12. Eliminated Alternatives

| Approach | Reason eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Separate `navigate`, `dom`, `screenshot`, `console`, or `network` Aside MCP tools | Live `tools/list` returned only `repl` | Local MCP `tools/list`, 2026-07-16 | 1, 3 |
| Remote HTTP/SSE MCP or static bearer/OAuth registration | Public developer surface and `aside mcp --help` document local stdio only | [Aside developer documentation](https://docs.aside.com/help/developers); local help | 1, 2, 3 |
| Treating a fresh MCP process as a browser session | `listBrowserTabs()` failed until a browser profile/task is bound | Local MCP `tools/call(repl)` error | 1, 2, 3 |
| Treating `--session` as an MCP browser selector | It is documented for agent-task continuation; MCP exposes no selector | Local `aside`/`exec`/`mcp` help | 2 |
| Treating a signed-in account as sufficient for unattended execution | Permission gates, approvals, MFA, CAPTCHA, and visible verification remain | [Aside security](https://docs.aside.com/help/security), [tasks](https://docs.aside.com/help/tasks), [troubleshooting](https://docs.aside.com/help/troubleshooting) | 1, 2 |
| Treating Aside as CDP-domain-complete replacement for bdg | One REPL tool was verified; no CDP catalog or dedicated HAR/console tools were verified | Local MCP inventory; `mcp-chrome-devtools` references | 3 |
| Hard-coding `aside.aside_repl` without discovery | It is derived from repository naming convention and needs post-registration confirmation | `.opencode/skills/mcp-code-mode/SKILL.md:217-260` | 3 |

## 13. Divergence Map

The review began with the CLI-vs-MCP question, then split into three evidence branches: live protocol/tool discovery, lifecycle/security review, and repository packet/bdg mapping. The first two branches converged on the same core model—standalone CLI plus local stdio MCP with one persistent `repl` tool—while the third branch preserved a deliberate divergence between Aside's profile/Playwright model and bdg's direct CDP/session model.

The lineage recorded `graph_convergence` events after iterations 2 and 3. The final local graph telemetry was `graphScore=0.8067`, `decision=CONTINUE`, with blockers for bound-page output and post-registration Code Mode discovery. Because `stopPolicy=max-iterations`, this telemetry did not authorize an early synthesis or block the hard-cap synthesis. **[SOURCE: `deep-research-state.jsonl`; `findings-registry.json`; `deep-research-dashboard.md`]**

## 14. Open Questions and Validation Backlog

- With an explicitly authorized disposable Aside profile, what exact DOM snapshot and screenshot result shape does bound `repl` return?
- Does the bound `page` support the expected Playwright console/request/response events, and what cleanup/result-size limits are needed?
- After adding the manual in a later phase, does Code Mode discover the callable exactly as `aside.aside_repl`?
- What is the supported user-facing procedure for binding an MCP process to an existing Aside browser task/profile?
- Are the observed idle values stable across releases, and are there supported lifecycle controls beyond closing stdio?
- Does the official installer gain non-macOS artifacts or additional transport flags in future versions?

These are explicit evidence gaps, not reasons to invent APIs in the skill packet.

## 15. Convergence Report

| Metric | Result |
|---|---|
| Iterations completed | 3 / 3 |
| Stop reason | `maxIterationsReached` (`stopPolicy=max-iterations`) |
| `newInfoRatio` trend | 0.95 → 0.78 → 0.70; mean 0.81 |
| Configured convergence threshold | 0.05; telemetry only under this run's stop policy |
| Reducer findings | 25 |
| Graph telemetry | score 0.8067; decision `CONTINUE`; two explicit blockers |
| Question status | All four charter questions have evidence in this synthesis; reducer retains four legacy-import open-question records for future validation/continuation |
| Source coverage | Official Aside docs, official installer, live CLI/MCP probes, UTCP/Code Mode conventions, and bdg references |

The loop broadened review angles instead of synthesizing when the telemetry was still informative. It reached the required hard cap, and the remaining gaps are clearly separated from verified facts. **[SOURCE: `deep-research-state.jsonl`, `findings-registry.json`, `deep-research-dashboard.md`]**

## 16. References

### Official Aside sources

- [Aside developer documentation](https://docs.aside.com/help/developers), including `#use-mcp`.
- [Aside security documentation](https://docs.aside.com/help/security).
- [Aside task documentation](https://docs.aside.com/help/tasks).
- [Aside privacy documentation](https://docs.aside.com/help/privacy).
- [Aside troubleshooting documentation](https://docs.aside.com/help/troubleshooting).
- [Official Aside installer](https://releases.aside.com/install.sh).

### Local sources

- `.opencode/specs/mcp-tooling/008-mcp-aside/001-research/context/website-link.md`
- `.opencode/skills/mcp-code-mode/SKILL.md`
- `.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md`
- `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/cdp_patterns.md`
- `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/session-management.md`
- `.utcp_config.json` (read-only; current conventions at lines 14–48)
- Lineage-local `resource-map.md`, `findings-registry.json`, `deep-research-dashboard.md`, `deep-research-state.jsonl`, and `iterations/iteration-001.md` through `iteration-003.md`.

## 17. Lineage Boundary and Handoff Status

This synthesis is complete for `fanout-luna-1784196776045-jwfb3a`. It is a research handoff, not an implementation: the root UTCP config, `mcp-aside-devtools` skill, hub registration, and any bound-browser validation remain untouched and belong to later authorized phases. All durable outputs for this detached lineage are under the requested `luna` artifact root. **[SOURCE: lineage `deep-research-config.json`; local phase `spec.md`]**

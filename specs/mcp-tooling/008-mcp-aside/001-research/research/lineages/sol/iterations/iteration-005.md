# Iteration 5: Chrome Contrast and Integration Blueprint

## Focus

Turn the verified Aside surface into a repository-specific `mcp-aside-devtools` blueprint. This pass compares routing, lifecycle, discovery, artifacts, and concurrency with the existing Chrome DevTools/Code Mode implementation without borrowing unsupported commands or tool names.

## Actions Taken

1. Re-read lineage state and verified that iteration 5 paths were unused.
2. Inspected the repository's Chrome DevTools skill, `bdg` lifecycle and artifact tests, and parallel Code Mode scenario.
3. Inspected the Code Mode naming, progressive-discovery, configuration, error-handling, and result-shape rules.
4. Inspected the live `.utcp_config.json` schema and its two isolated Chrome DevTools stdio registrations.
5. Mapped prior Aside evidence onto a CLI-primary architecture, fallback contract, UTCP registration, and phase 2/3 verification matrix.

## Findings

1. The transferable Chrome pattern is routing discipline: check the CLI first, prefer it for direct low-token work, use Code Mode MCP for tool chaining or capabilities better exposed by MCP, discover names before calls, validate outputs, and clean up sessions. [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:202] [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:270]

2. The command vocabulary is not transferable. Chrome has documented typed commands for CDP discovery, lifecycle, DOM, screenshots, console, and HAR (`bdg cdp --list`, `bdg status`, `bdg dom ...`, `bdg console --list`, `bdg network har`). Aside documents agent tasks and a Playwright-compatible JS REPL, not parallel `aside dom`, `aside console`, or `aside network` commands. [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:329] [SOURCE: https://docs.aside.com/help/developers]

3. “CLI-primary” should therefore mean two CLI lanes: outcome-oriented work uses `aside [--account <name>] [--session <id>] "<task>"`; deterministic inspection and interaction use `aside repl "<Asidewright/Playwright JavaScript>"`. `aside exec` is a model/provider execution variant, not a replacement for the deterministic REPL. [SOURCE: https://docs.aside.com/help/developers]

4. The MCP lane is a fallback and composition surface, not the only automation API. Use it when Code Mode tool chaining is required, when runtime discovery exposes a capability missing from the documented REPL, or when the caller specifically needs MCP. If MCP startup/discovery fails, fall back to REPL only when the requested capability and safety class are equivalent; never silently replace an approval-bearing or profile-sensitive operation. [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:245] [INFERENCE: integration policy from verified Aside lanes]

5. The exact UTCP registration is structurally settled and credential-free at the transport layer:

   ```json
   {
     "name": "aside",
     "call_template_type": "mcp",
     "config": {
       "mcpServers": {
         "aside": {
           "transport": "stdio",
           "command": "aside",
           "args": ["mcp"],
           "env": {}
         }
       }
     }
   }
   ```

   Append this object to `.utcp_config.json.manual_call_templates`; do not add a URL, bearer token, `npx`, or invented account argument. The existing repository schema uses the same `name`/`call_template_type`/`config.mcpServers`/stdio shape. [SOURCE: .utcp_config.json:14] [SOURCE: https://docs.aside.com/help/developers]

6. Code Mode names must be discovered after registration. Search/list the `aside` manual, inspect each candidate with `tool_info`, then call only the returned `{manual_name}.{manual_name}_{tool_name}` function inside `call_tool_chain`. Tool-list display names can use dots while callable TypeScript names use the manual prefix plus underscore form. [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:252] [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:256] [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:301]

7. The skill should keep a runtime capability registry rather than a static tool catalog. Normalize discovered tools into capability classes—session/tab, navigation, accessibility/DOM, interaction/evaluate, screenshot, download, network, console, and lifecycle—while preserving the exact returned schema. Mark console and any absent class unsupported; do not synthesize a name from Chrome or Playwright. [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:379] [SOURCE: https://docs.aside.com/help/developers] [INFERENCE: normalized discovery adapter]

8. Preflight needs independent checks and errors: platform/architecture; `command -v aside`; `aside --version` and help discovery; account list/status; selected account/profile; local daemon/browser availability; CLI smoke task or harmless REPL expression; MCP initialize; MCP tools/list; Code Mode manual discovery; output directory; and safety mode. Distinguish `CLI_MISSING`, `UNSUPPORTED_PLATFORM`, `SIGNED_OUT`, `ACCOUNT_AMBIGUOUS`, `PROFILE_MISMATCH`, `DAEMON_UNAVAILABLE`, `MCP_HANDSHAKE_FAILED`, `MCP_TOOLS_EMPTY`, `CAPABILITY_UNAVAILABLE`, `APPROVAL_REQUIRED`, `AUTH_CHALLENGE`, and `ARTIFACT_INVALID`. [SOURCE: https://releases.aside.com/install.sh] [SOURCE: https://docs.aside.com/changelog/components.md] [INFERENCE: operational error taxonomy]

9. Artifact validation should follow the Chrome playbook's evidence standard even though commands differ: confirm screenshot file existence, non-zero size, and PNG magic bytes; confirm structured network output parses and has the expected schema when a discovered method produces it; inject/retrieve a console sentinel only if console capability is discovered; record the selected account/session/profile without secrets. [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/dom_and_screenshot/screenshot_capture.md:21] [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/console_and_network/console_list.md:21] [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/console_and_network/har_export.md:21]

10. Chrome's two `--isolated=true` MCP processes explicitly support parallel sessions; the current UTCP file registers two independent manuals for that purpose. Aside publishes no isolation flag or independent-profile server contract. Register one `aside` manual and serialize mutating calls per selected profile; add multiple Aside manuals only after a live test proves distinct daemon/profile isolation and measures actual parallelism. [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:219] [SOURCE: .utcp_config.json:14] [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/mcp_parallel_instances/dual_instance_parallel.md:21]

11. The packet should have five implementation layers: router, preflight, CLI adapters, Code Mode adapter, and policy/evidence layer. The router chooses task CLI, REPL, or MCP; preflight resolves installation/account/daemon/profile; adapters own quoting, session continuation, discovery, timeouts, and structured results; policy blocks unsafe actions; evidence validates artifacts and redacts logs. [INFERENCE: synthesis of iterations 1–5]

12. Phase 2/3 acceptance must exercise both positive and negative paths: install/version/help without auto-installing; account ambiguity; new and resumed task sessions; REPL navigation/accessibility/interaction/screenshot/download/network; MCP startup and discovery; Code Mode callable-name translation; CLI→MCP and MCP→REPL fallback; daemon outage; idle keepalive; profile mismatch; approval/authentication waits; prompt injection; invalid artifact; missing console capability; and attempted concurrent mutation. [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:367] [SOURCE: https://docs.aside.com/changelog/components.md] [INFERENCE: verification matrix]

## Capability and Route Matrix

| Intent | Primary route | MCP fallback | Required proof |
|---|---|---|---|
| Outcome-oriented browse task | direct `aside` task | discovered MCP task/browser tool | structured result + session id when continued |
| Deterministic navigation/DOM/accessibility | `aside repl` | discovered navigation/snapshot/evaluate tools | URL + snapshot/selector assertion |
| Interaction/form/keyboard | `aside repl` | discovered interaction tools | postcondition assertion; approval gate when sensitive |
| Screenshot | `aside repl` | discovered screenshot tool | non-empty PNG + magic bytes |
| Download | `aside repl` | discovered download tool | controlled path + size/type validation |
| Network inspection | `aside repl` where supported | discovered network tool | parseable structured capture; redact headers/bodies |
| Console capture | none until probed | discovered console tool only | sentinel round trip; otherwise unsupported |
| Multi-tool composition | CLI result passed to caller | Code Mode `call_tool_chain` | discovered schema + structured `{success,data,errors,timestamp}` |

## Ruled Out

- Copying `bdg` command names into Aside: Aside's public surface assigns deterministic steps to REPL/MCP.
- Registering `aside mcp` as HTTP/SSE or adding transport credentials: official configuration is local stdio with device-local account state.
- Static Aside MCP tool names: no primary tool list is published and Code Mode explicitly forbids guessing.
- Two parallel Aside manuals by analogy with Chrome: Chrome has an explicit isolation flag; Aside does not.
- Silent fallback across safety boundaries: a technically equivalent browser action may have different account/profile/approval semantics.

## Dead Ends

- Repository-local Chrome docs cannot answer Aside's MCP schema, permission inheritance, or isolation contract. These remain runtime probes, not documentation gaps that can be filled by analogy.

## Edge Cases

- Ambiguous input: “inspect the page” can be an agent task, deterministic REPL, or MCP composition. Default to REPL when repeatable evidence matters; use task mode for outcome-oriented intent.
- Contradictory evidence: Chrome encourages independent parallel MCP processes, while Aside product evidence favors profile-bound serialization. Product-specific evidence wins.
- Missing dependencies: no installed Aside binary means help/schema/account/daemon probes cannot be executed in research.
- Partial success: architecture and registration shape are ready; exact tool schemas, console, permission inheritance, and concurrency remain live-gated.

## Sources Consulted

- [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/cli_bdg_lifecycle/session_start.md]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/cli_bdg_lifecycle/status_json.md]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/dom_and_screenshot/screenshot_capture.md]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/console_and_network/console_list.md]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/console_and_network/har_export.md]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/mcp_parallel_instances/dual_instance_parallel.md]
- [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md]
- [SOURCE: .opencode/skills/mcp-code-mode/references/configuration.md]
- [SOURCE: .utcp_config.json]
- [SOURCE: https://docs.aside.com/help/developers]
- [SOURCE: https://docs.aside.com/changelog/components.md]

## Assessment

- New information ratio: 0.83
- Questions addressed: Q5
- Questions answered: Q5

## Reflection

- What worked and why: repository-local source and manual-test inspection exposed the exact routing, registration, discovery, result, and evidence conventions the new packet must follow.
- What did not work and why: analogies cannot resolve unpublished Aside MCP schemas or process isolation.
- What I would do differently: phase 2 should begin with a captured `aside --help`, MCP `initialize`, and `tools/list`, then freeze those outputs as versioned fixtures before writing adapters.

## Recommended Next Focus

Synthesis — consolidate all five passes into the research report, resource map, architecture contract, UTCP registration blueprint, and live-probe checklist.

## Scope Violations

- No implementation, `.utcp_config.json`, browser, account, daemon, profile, or path outside the lineage root was modified.

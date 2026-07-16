# Resource Map — Aside Developer Surface

Generated from five research iterations for session `fanout-sol-1784196482911-9atmiq`. This map records sources used by the detached lineage; it does not assert that every linked surface is stable or publicly versioned.

## Primary Aside Documentation

| Resource | Role | Used for |
|---|---|---|
| `https://docs.aside.com/help/developers` | canonical developer page | CLI modes, account commands, session continuation, MCP command/args, REPL |
| `https://docs.aside.com/llms.txt` | documentation index | primary-page discovery |
| `https://docs.aside.com/help/security` | product security controls | filesystem/tool/browser/network Allow/Ask/Deny model |
| `https://docs.aside.com/help/password-manager` | credential controls | autofill policies, MFA/passkey/CAPTCHA/vault boundaries |
| `https://docs.aside.com/help/privacy` | product privacy settings | local history, analytics, sync controls |
| `https://docs.aside.com/help/tasks` | task behavior | task/session context |
| `https://docs.aside.com/help/automation` | routines | overlap/concurrency evidence |
| `https://docs.aside.com/help/ai` | provider behavior | model/provider boundary |
| `https://docs.aside.com/help/browser-basics` | browser behavior | tab/profile/browser context |
| `https://docs.aside.com/help/ultrabrowse` | browser capability | automation context |
| `https://docs.aside.com/changelog/components.md` | operational change log | MCP idle/daemon errors, tabs, screenshots, downloads, evaluate, profiles |
| `https://docs.aside.com/changelog/native.md` | native change log | runtime corroboration |
| `https://releases.aside.com/install.sh` | official installer | macOS architecture gate, app bundle, symlink, overrides |
| `https://aside.com/` | product site | product identity and positioning |
| `https://aside.com/policy/terms` | terms | prompt injection and sensitive-action boundary |
| `https://aside.com/policy/privacy` | privacy policy | hosted-model context, processors, retention/egress |

## Corroborating Public Sources

| Resource | Role | Caution |
|---|---|---|
| `https://youmind.com/es-ES/landing/x-viral-articles/aside-sota-browser-agent-benchmarks` | mirror of founder architecture article | use only with primary/changelog cross-checks |
| `https://github.com/at-inc/aside-benchmarks` | public benchmark repository | no MCP tools/list fixture found |

## Repository-Local Skills and References

| Resource | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md` | CLI-primary/Code Mode fallback, lifecycle, discovery, cleanup |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/cdp_patterns.md` | Chrome CDP patterns |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/session_management.md` | Chrome session lifecycle |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/troubleshooting.md` | Chrome recovery taxonomy |
| `.opencode/skills/mcp-code-mode/SKILL.md` | progressive discovery, callable naming, structured results, rules |
| `.opencode/skills/mcp-code-mode/references/configuration.md` | UTCP manual schema and stdio configuration |
| `.opencode/skills/mcp-code-mode/references/naming_convention.md` | `{manual_name}.{manual_name}_{tool_name}` contract |
| `.opencode/skills/mcp-code-mode/references/workflows.md` | error handling, chaining, and parallel patterns |
| `.utcp_config.json` | current project manual schema and Chrome isolated registrations |

## Repository-Local Manual Tests

| Resource | Evidence contract |
|---|---|
| `manual_testing_playbook/cli_bdg_lifecycle/session_start.md` | start then verify active URL/session |
| `manual_testing_playbook/cli_bdg_lifecycle/status_json.md` | parse and assert structured lifecycle state |
| `manual_testing_playbook/dom_and_screenshot/screenshot_capture.md` | validate file size and PNG magic |
| `manual_testing_playbook/console_and_network/console_list.md` | sentinel console round trip and JSON parse |
| `manual_testing_playbook/console_and_network/har_export.md` | validate HAR JSON/root fields |
| `manual_testing_playbook/mcp_parallel_instances/dual_instance_parallel.md` | prove actual isolation/parallelism against a controlled baseline |

All manual-test paths above are relative to `.opencode/skills/mcp-tooling/mcp-chrome-devtools/`.

## Lineage Artifacts

| Resource | Role |
|---|---|
| `deep-research-config.json` | frozen run configuration and executor provenance |
| `deep-research-state.jsonl` | append-only iteration and terminal state |
| `deep-research-strategy.md` | questions, negative knowledge, next focus |
| `findings-registry.json` | normalized questions, findings, exclusions, metrics |
| `deep-research-dashboard.md` | progress and convergence telemetry |
| `iterations/iteration-001.md` | CLI/install/session evidence |
| `iterations/iteration-002.md` | MCP transport/auth/daemon evidence |
| `iterations/iteration-003.md` | browser automation and capability probes |
| `iterations/iteration-004.md` | security/privacy/concurrency/unattended controls |
| `iterations/iteration-005.md` | Chrome contrast, architecture, UTCP blueprint |
| `deltas/iter-001.jsonl` … `deltas/iter-005.jsonl` | machine-readable per-iteration deltas |
| `research.md` | canonical synthesis |

## Known Coverage Gaps

- Installed `aside --version` and `aside --help` fixture.
- MCP `initialize` response and `tools/list` fixture.
- Console support through REPL or MCP.
- MCP permission inheritance and visible audit/task behavior.
- Multi-client isolation by process/account/profile/session.
- Per-call account selection for `repl` or `mcp`.

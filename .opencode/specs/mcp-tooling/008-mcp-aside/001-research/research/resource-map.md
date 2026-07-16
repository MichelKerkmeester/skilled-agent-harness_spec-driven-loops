# Resource Map — Aside Developer Surface (Fan-Out Consolidated)

> **Consolidated from the two lineage resource maps** — `lineages/sol/resource-map.md` (hand-authored, 5-iteration lineage) and `lineages/luna/resource-map.md` (auto-generated, 3-iteration live-probe lineage) — because the base-dir reducer path does not apply to the fan-out layout (per-lineage maps live under `lineages/<label>/`, not the run base dir). The `glm` lineage produced no resource map. Entries are deduplicated; lineage-specific entries are tagged.

## Primary Aside Documentation

| Resource | Role | Used for | Lineage |
|---|---|---|---|
| `https://docs.aside.com/help/developers` (incl. `#use-mcp`) | canonical developer page | CLI modes, account commands, session continuation, MCP command/args, REPL | sol, luna (glm cites) |
| `https://docs.aside.com/llms.txt` | documentation index | primary-page discovery | sol (glm cites) |
| `https://docs.aside.com/help/security` | product security controls | filesystem/tool/browser/network Allow/Ask/Deny model; Read only/Guard/Full access; password boundary | sol, luna (glm cites) |
| `https://docs.aside.com/help/password-manager` | credential controls | autofill policies, MFA/passkey/CAPTCHA/vault boundaries | sol |
| `https://docs.aside.com/help/privacy` | product privacy settings | local history, analytics, sync controls | sol, luna |
| `https://docs.aside.com/help/tasks` | task behavior | task/session context, permission modes, persistence, pause/resume | sol, luna (glm cites) |
| `https://docs.aside.com/help/automation` | routines | overlap/concurrency evidence | sol |
| `https://docs.aside.com/help/ai` | provider behavior | provider tiers, model/provider boundary, sign-out behavior | sol (glm cites) |
| `https://docs.aside.com/help/browser-basics` | browser behavior | tab/profile/browser context | sol |
| `https://docs.aside.com/help/ultrabrowse` | browser capability | automation context | sol |
| `https://docs.aside.com/help/troubleshooting` | recovery guidance | pause/resume, visible-step recovery | luna |
| `https://docs.aside.com/changelog/components.md` | operational change log | MCP idle/daemon errors, tabs, screenshots, downloads, evaluate, profiles | sol |
| `https://docs.aside.com/changelog/native.md` | native change log | runtime corroboration | sol |
| `https://releases.aside.com/install.sh` | official installer | macOS architecture gate, app bundle, `~/.local/bin/aside` shim, `ASIDE_CLI_*` overrides | sol, luna |
| `https://aside.com/` | product site | product identity and positioning | sol |
| `https://aside.com/policy/terms` | terms | prompt injection and sensitive-action boundary | sol |
| `https://aside.com/policy/privacy` | privacy policy | hosted-model context, processors, retention/egress | sol |

## Corroborating Public Sources

| Resource | Role | Caution | Lineage |
|---|---|---|---|
| `https://youmind.com/es-ES/landing/x-viral-articles/aside-sota-browser-agent-benchmarks` | mirror of founder architecture article | use only with primary/changelog cross-checks | sol |
| `https://github.com/at-inc/aside-benchmarks` | public benchmark repository | no MCP tools/list fixture found | sol |

## Live Local Probe Evidence [luna]

Captured 2026-07-16 against installed CLI `1.26.626.1517` under a lineage-local `HOME`; documented in `lineages/luna/iterations/iteration-001..003.md` (no standalone fixture files were persisted — luna's auto-generated map lists these as `MISSING` on disk).

| Evidence | Role |
|---|---|
| `aside --version`, `aside --help`, `aside {mcp,repl,exec,account} --help` | installed command-surface fixture (options, subcommands) |
| MCP JSON-RPC `initialize` | protocol `2024-11-05`, serverInfo `aside`/`1.26.626.1517`, `tools.listChanged: true` |
| MCP `tools/list` | one-tool inventory (`repl`: `title`+`code`, 120s timeout, `taskSupport: forbidden`, helper catalog) |
| MCP `tools/call(repl)` non-mutating capability probe | confirmed `page`/`tabs`/`fs`/`pwd` values and `openTab`/`snapshot`/`annotatedScreenshot`/`fetch` functions |
| MCP `tools/call(repl)` `listBrowserTabs()` unbound-profile probe | browser-binding failure mode: "This task is not bound to a browser profile." |
| `aside mcp` startup/shutdown telemetry | `discoveryIdleTimeoutMs: 300000`, `replIdleTimeoutMs: 1800000` (diagnostic, not contractual) |

## Repository-Local Skills and References

| Resource | Role | Lineage |
|---|---|---|
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md` | CLI-primary/Code Mode fallback pattern, lifecycle, discovery, cleanup | sol, luna, glm |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/cdp_patterns.md` | Chrome CDP patterns | sol, luna |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/session_management.md` | Chrome session lifecycle | sol, luna |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/troubleshooting.md` | Chrome recovery taxonomy | sol |
| `.opencode/skills/mcp-code-mode/SKILL.md` | progressive discovery, callable naming, structured results, rules | sol, luna, glm |
| `.opencode/skills/mcp-code-mode/references/configuration.md` | UTCP manual schema and stdio configuration | sol |
| `.opencode/skills/mcp-code-mode/references/naming_convention.md` | `{manual_name}.{manual_name}_{tool_name}` contract | sol |
| `.opencode/skills/mcp-code-mode/references/workflows.md` | error handling, chaining, and parallel patterns | sol |
| `.opencode/specs/mcp-tooling/008-mcp-aside/001-research/spec.md` | phase charter and scope boundary | luna |
| `.opencode/specs/mcp-tooling/008-mcp-aside/001-research/context/website-link.md` | topic source pointer | luna |

## Config

| Resource | Role | Lineage |
|---|---|---|
| `.utcp_config.json` | current project manual schema (`manual_call_templates[]`, lines 14–48), Chrome isolated registrations; read-only in research phase | sol, luna, glm |

## Repository-Local Manual Tests [sol]

Evidence-standard exemplars, relative to `.opencode/skills/mcp-tooling/mcp-chrome-devtools/`:

| Resource | Evidence contract |
|---|---|
| `manual_testing_playbook/cli_bdg_lifecycle/session_start.md` | start then verify active URL/session |
| `manual_testing_playbook/cli_bdg_lifecycle/status_json.md` | parse and assert structured lifecycle state |
| `manual_testing_playbook/dom_and_screenshot/screenshot_capture.md` | validate file size and PNG magic |
| `manual_testing_playbook/console_and_network/console_list.md` | sentinel console round trip and JSON parse |
| `manual_testing_playbook/console_and_network/har_export.md` | validate HAR JSON/root fields |
| `manual_testing_playbook/mcp_parallel_instances/dual_instance_parallel.md` | prove actual isolation/parallelism against a controlled baseline |

## Lineage Artifacts

Per-lineage run artifacts, relative to `.opencode/specs/mcp-tooling/008-mcp-aside/001-research/research/lineages/`:

| Resource | Role | Lineages present |
|---|---|---|
| `<label>/research.md` | lineage synthesis | sol, glm, luna |
| `<label>/resource-map.md` | lineage resource map | sol, luna |
| `<label>/deep-research-config.json` | frozen run configuration and executor provenance | sol, glm, luna |
| `<label>/deep-research-state.jsonl` | append-only iteration and terminal state | sol, glm, luna |
| `<label>/deep-research-strategy.md` | questions, negative knowledge, next focus | sol, glm, luna |
| `<label>/findings-registry.json` | normalized questions, findings, exclusions, metrics | sol, glm, luna |
| `<label>/deep-research-dashboard.md` | progress and convergence telemetry | sol, glm, luna |
| `<label>/iterations/iteration-*.md` | per-iteration evidence (sol 5, glm 2, luna 3) | sol, glm, luna |
| `<label>/deltas/iter-*.jsonl` | machine-readable per-iteration deltas | sol, luna |
| `<label>/prompts/iteration-*.md` | iteration prompts | sol, luna |
| `<label>/logs/fanout-lineage.out` | lineage executor log | sol, glm, luna |

Run-level: `../deep-research-findings-registry.json` (merged registry), `../fanout-attribution.md`, `../orchestration-summary.json`, `../research.md` (this run's canonical synthesis).

## Known Coverage Gaps

Updated from sol's gap list against luna's live probes; remaining gaps mirror `research.md` §17.

- ~~Installed `aside --version` / `aside --help` fixture~~ — **resolved by luna** (version `1.26.626.1517`, 2026-07-16); re-capture per installed version at authoring time.
- ~~MCP `initialize` response and `tools/list` fixture~~ — **resolved by luna** (protocol `2024-11-05`, one `repl` tool); version-pinned, rediscover after registration.
- Console support through a bound-page `repl` (Playwright `page.on('console', ...)`) — untested.
- Network capture on a bound page; no HAR-parity contract — untested.
- MCP permission-mode inheritance and visible audit/task behavior.
- Multi-client isolation by process/account/profile/session (decides the single- vs dual-manual conflict).
- Per-call account selection for `repl` or `mcp`.
- Bound-page DOM snapshot and screenshot result shapes.
- Supported procedure for binding an MCP process to an existing browser task/profile.
- `--session` state storage backend [glm].
- Stability of observed idle timeouts across releases; lifecycle controls beyond closing stdio [luna].

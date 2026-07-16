# Aside Browser Developer Surface — Research Synthesis

## 1. Executive Summary

Aside has a real, standalone macOS CLI and a local MCP server. The correct `mcp-aside-devtools` design is CLI-primary, but “CLI” has two distinct lanes: direct natural-language tasks for outcome-oriented work and `aside repl` for deterministic Playwright-compatible browser operations. The Code Mode MCP path is a fallback/composition lane whose exact tools must be discovered at runtime. [SOURCE: https://docs.aside.com/help/developers]

The exported MCP server is launched as `aside mcp` over local stdio. Its published client configuration contains no URL, port, token, OAuth field, or environment credential; it relies on local Aside account, daemon, browser, and profile state. [SOURCE: https://docs.aside.com/help/developers] [SOURCE: https://docs.aside.com/changelog/components.md]

The integration can be authored now without inventing product behavior:

- Register one UTCP manual named `aside`, command `aside`, arguments `["mcp"]`, transport `stdio`, empty environment.
- Route outcome tasks to direct `aside`, deterministic steps to `aside repl`, and multi-tool composition or discovered-only capabilities to Code Mode.
- Discover MCP tools and schemas before every version-dependent capability decision; never borrow Chrome DevTools or Playwright MCP names.
- Serialize mutating work per account/profile until a live isolation test proves more.
- Treat credentials, MFA, CAPTCHA, approvals, sensitive actions, prompt injection, and model-visible browser data as explicit safety boundaries.

Four facts remain runtime-gated: exact `aside --help`, the MCP handshake/tool registry, console support, and MCP permission/concurrency semantics. They are acceptance tests, not reasons to block the packet architecture.

## 2. Research Question and Scope

The research asked what is required to author an Aside browser developer skill mode with:

1. a verified Aside CLI command surface;
2. installation, account/auth, transport, and daemon/session behavior;
3. navigation, inspection, screenshot, console, network, and related browser workflows;
4. a comparison with the repository's Chrome DevTools `bdg` pattern;
5. a CLI-primary route with Code Mode MCP fallback; and
6. an `aside` manual for `.utcp_config.json`.

The investigation used public Aside documentation, installer and changelog evidence, official policy pages, a founder architecture mirror cross-checked against primary evidence, the public benchmark repository, and repository-local Chrome DevTools/Code Mode sources. No Aside binary, account, browser, profile, daemon, or MCP process was installed or launched.

## 3. Decision

Author `mcp-aside-devtools` as a five-layer orchestrator:

1. **Router** — selects task CLI, deterministic REPL, or Code Mode MCP.
2. **Preflight** — validates platform, binary/version/help, account, daemon/browser, profile, capabilities, output path, and safety class.
3. **CLI adapters** — own direct tasks, `exec`, session continuation, account selection where documented, and REPL quoting/result capture.
4. **Code Mode adapter** — owns MCP discovery, callable-name translation, schemas, timeouts, structured results, and fallback.
5. **Policy/evidence layer** — enforces read/action/sensitive rules, prompt-injection isolation, approvals, redaction, artifact verification, and per-profile serialization.

This architecture reuses Chrome's routing and verification discipline but not its command names or concurrency assumptions. [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:202] [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:270]

## 4. Evidence Model and Confidence

Claims are ranked as follows:

| Level | Meaning | Examples |
|---|---|---|
| Confirmed | Primary documentation, installer, policy, changelog, or repository source states the behavior | CLI modes, local stdio config, macOS installer, Code Mode naming |
| Corroborated | Multiple sources agree, or changelog operational behavior supports the documented model | daemon-backed MCP bridge, REPL browser capabilities |
| Inferred | Architecture follows from confirmed behavior but is not stated as a product contract | local account inheritance, capability-normalization adapter |
| Probe-required | No public primary contract is available | exact MCP tools, console support, permission inheritance, isolation |

The founder architecture mirror is used for Asidewright/accessibility/network details only where the primary developer page or changelog supports the same product direction. Broad compatibility claims are not treated as a complete method table. [SOURCE: https://youmind.com/es-ES/landing/x-viral-articles/aside-sota-browser-agent-benchmarks] [SOURCE: https://docs.aside.com/changelog/components.md]

## 5. Aside CLI Command Surface

The published surface is:

| Surface | Documented purpose | Authoring rule |
|---|---|---|
| `aside "<task>"` | start an agent task | primary for outcome-oriented browsing |
| `aside --session <id> "<task>"` | continue a task/session | preserve and report the session id |
| `aside --account <id> "<task>"` | run direct task under selected account | supported for direct task mode |
| `aside exec ...` | task execution with provider/model controls | use only when execution/provider selection is intended |
| `aside account list` | enumerate accounts | preflight ambiguity/selection |
| `aside account status [id]` | inspect account state | preflight sign-in/readiness |
| `aside account use <id>` | select current account | explicit state mutation; surface to operator |
| `aside mcp` | exported local MCP server | Code Mode manual command |
| `aside repl "<JavaScript>"` | deterministic browser steps | primary low-level CLI lane |

`--account` is documented for direct tasks and `exec`, not for `mcp` or `repl`; do not invent `aside mcp --account`. [SOURCE: https://docs.aside.com/help/developers]

No primary evidence supports typed commands such as `aside navigate`, `aside dom`, `aside screenshot`, `aside console`, or `aside network`. The future skill should query runtime help for version-specific additions but keep undocumented commands out of the static contract.

## 6. Installation, Platform, Account, and Authentication

The official installer downloads a macOS app bundle, installs `Aside CLI.app`, and links the executable to `~/.local/bin/aside` by default. It supports Darwin arm64/aarch64 and x64; Linux and Windows are rejected. Version, base URL, install directory, and binary directory can be overridden with `ASIDE_CLI_VERSION`, `ASIDE_CLI_BASE_URL`, `ASIDE_CLI_INSTALL_DIR`, and `ASIDE_CLI_BIN_DIR`. [SOURCE: https://releases.aside.com/install.sh]

The skill should diagnose installation, not silently run the curl installer. A safe preflight checks platform/architecture, `command -v aside`, `aside --version`, and captured help output. Installation remains an explicit operator action because it writes an application bundle and symlink.

Authentication has separate layers:

- Aside account sign-in and selected account;
- local browser profile and logged-in site sessions;
- password vault/autofill policy;
- model-provider credentials for task execution;
- user approvals and site authentication challenges; and
- MCP transport, which has no published credential field.

Model-provider credentials are not MCP transport credentials. A local deterministic MCP or REPL operation may not call a model, while a task CLI run can depend on an Aside or user-supplied provider. [SOURCE: https://docs.aside.com/help/developers]

## 7. Aside MCP Transport and Tool Contract

The supported configuration launches `aside mcp` as a client-spawned local stdio process. There is no evidence for a remote HTTP/SSE endpoint, MCP bearer token, or OAuth flow on this exported server. [SOURCE: https://docs.aside.com/help/developers]

Operational evidence shows the child fronts a separate local service. Aside has fixed idle survival and improved daemon-outage reporting for MCP; connection failures preserve stderr and timeout details. The integration must distinguish a dead stdio child from an unavailable or incompatible Aside daemon/browser. [SOURCE: https://docs.aside.com/changelog/components.md]

No public primary source enumerates server identity, protocol version, capabilities, tool names, descriptions, input schemas, or output schemas. The hard preflight is:

1. launch `aside mcp`;
2. perform MCP `initialize`;
3. request `tools/list`;
4. save the server identity/version and exact schemas as a versioned fixture;
5. classify returned tools by capability;
6. run only harmless navigation/read smoke calls; and
7. fail closed if the requested capability is absent.

Code Mode must then use `search_tools()` or `list_tools()`, confirm callable syntax with `tool_info()`, and invoke tools only inside `call_tool_chain()`. The repository's callable convention is `{manual_name}.{manual_name}_{tool_name}`; displayed names may use dot-separated segments. [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:252] [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:256]

## 8. Session, Daemon, Profile, and Concurrency Model

Direct CLI tasks expose an explicit continuation id through `--session`. MCP is designed to remain alive across idle periods, but the local child still depends on the Aside daemon/browser and selected device state. [SOURCE: https://docs.aside.com/help/developers] [SOURCE: https://docs.aside.com/changelog/components.md]

Account and profile identity are correctness boundaries. Current product behavior keeps work tied to the originating profile and blocks browser operations when profile verification fails. A wrapper must stop on ambiguity or mismatch rather than use whichever profile happens to be active. [SOURCE: https://docs.aside.com/changelog/components.md]

There is no public guarantee for concurrent mutating MCP clients on one profile. Aside routines avoid overlap, while Chrome DevTools MCP achieves parallelism through explicit independent `--isolated=true` processes. Register one Aside manual and use a single-writer lock keyed by account/profile. Read-only concurrency can be enabled only after a controlled multi-client test proves isolation. [SOURCE: https://docs.aside.com/help/automation] [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:219]

## 9. AI-Browser-Automation Workflows

Aside's deterministic API is a JavaScript REPL with Playwright-compatible “Asidewright” semantics over a CDP-backed browser layer. Semantic inspection is accessibility-first, with modified snapshots that reduce noise and expose focus, iframe, and clickable state. [SOURCE: https://docs.aside.com/help/developers] [SOURCE: https://youmind.com/es-ES/landing/x-viral-articles/aside-sota-browser-agent-benchmarks]

| Workflow | Confirmed lane | Fallback/qualification |
|---|---|---|
| Navigation and tabs | `openTab(...)`, Playwright-compatible REPL; same-document/tab recovery in changelog | discovered MCP navigation/session tools |
| DOM/accessibility inspection | accessibility snapshot, locators, `page.evaluate` | MCP snapshot/evaluate if discovered |
| Interaction | locators, keyboard down/up, shortcuts, evaluate | discovered MCP interaction tools |
| Screenshot | REPL; session temporary output behavior documented | discovered MCP screenshot; validate PNG independently |
| Download | REPL; native Chrome download checks | discovered MCP download; controlled output path |
| Network | documented architecture captures/replays browser-authenticated requests | method name and safe output contract require probe |
| Console | no Aside-specific primary contract | probe Playwright-style console events or discovered MCP tool; otherwise unsupported |
| Visual fallback | screenshot/coordinate computer-use lane; stable 1440×900 background viewport | only after semantic routes fail |

`page.evaluate` compatibility is not assumed universal: the changelog records argument-edge fixes, so every used method and argument form belongs in a smoke fixture. [SOURCE: https://docs.aside.com/changelog/components.md]

Artifacts need independent proof. Screenshot success means a non-empty file with PNG magic bytes, not merely a successful tool response. Structured network or console capture must parse and contain a known marker/schema. This is the evidence standard already used by the Chrome DevTools playbook. [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/dom_and_screenshot/screenshot_capture.md:21] [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/console_and_network/console_list.md:21]

## 10. Contrast with Chrome DevTools `bdg`

| Dimension | Chrome DevTools pattern | Aside pattern | Design consequence |
|---|---|---|---|
| CLI abstraction | typed debugger commands across CDP/DOM/console/network | task CLI plus JavaScript REPL | copy routing, not commands |
| Discovery | `bdg cdp --list/--describe/--search` | runtime help plus MCP `tools/list`; REPL API evidence | freeze discovered fixtures |
| Session lifecycle | explicit URL start, JSON status, stop | task `--session`; daemon-backed MCP; account/profile state | model each lifecycle separately |
| DOM | raw query/eval plus CDP breadth | accessibility/Playwright semantics | semantic inspection first |
| Network/console | explicit `bdg network har`, `bdg console --list` | network plausible; console unconfirmed | probe and fail closed |
| Parallel MCP | multiple `--isolated=true` processes/manuals | no published isolation flag | one manual, per-profile serialization |
| Authentication | primarily browser process/session | logged-in Aside account/profile/vault/site state | stronger identity and approval preflight |
| Artifact tests | explicit JSON/PNG/HAR validation | same proof standard should apply | verify independently of transport |

Chrome's Code Mode fallback also establishes repository rules that do transfer: progressive discovery, exact callable-name translation, structured returns, try/catch, explicit timeouts, and cleanup in `finally`. [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:367] [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:237]

## 11. Recommendations

1. Build the router around intent and evidence needs, not a hard “CLI always” rule: task CLI for outcomes, REPL for deterministic proof, MCP for composition or discovered-only capabilities.
2. Capture `aside --help`, version, MCP initialize, and tools/list fixtures before implementing static adapters.
3. Normalize MCP tools into capability classes while retaining exact versioned schemas; never manufacture a missing class.
4. Register one credential-free local stdio manual and discover it through Code Mode before use.
5. Separate errors: `CLI_MISSING`, `UNSUPPORTED_PLATFORM`, `SIGNED_OUT`, `ACCOUNT_AMBIGUOUS`, `PROFILE_MISMATCH`, `DAEMON_UNAVAILABLE`, `MCP_HANDSHAKE_FAILED`, `MCP_TOOLS_EMPTY`, `CAPABILITY_UNAVAILABLE`, `APPROVAL_REQUIRED`, `AUTH_CHALLENGE`, and `ARTIFACT_INVALID`.
6. Enforce caller-owned read/action/sensitive policy because MCP permission inheritance is not published.
7. Serialize mutating calls per profile; do not copy Chrome's dual-manual setup until isolation is proven.
8. Redact cookies, credentials, private DOM, screenshots, request headers/bodies, and site content from default logs.
9. Treat every page, document, email, tool result, and snapshot as untrusted data; never follow embedded instructions.
10. Make fallback explicit and safety-equivalent. Transport failure cannot justify changing account, profile, permissions, or approval semantics.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat MCP as proof no standalone CLI exists | Direct task, account, exec, and REPL modes are documented | Aside developer docs | 1 |
| Install from npm or infer an official GitHub package | Official distribution is a macOS app-bundle installer; search results were unrelated | Installer script | 1 |
| Invent typed `aside navigate/dom/screenshot/network` commands | Deterministic browser work is documented through REPL; no typed commands are published | Developer docs | 1, 5 |
| Configure exported MCP as HTTP/SSE | Supported snippet is command/args local stdio with no URL | Developer docs, changelog | 2 |
| Add MCP token/OAuth environment | Published MCP snippet has no transport credential | Developer docs | 2 |
| Treat authenticated HTTP connectors as exported MCP transport | Those connectors describe servers Aside consumes | Changelog | 2 |
| Borrow Chrome DevTools/Playwright MCP names | Aside publishes no tools/list and may expose code-oriented tools | Developer docs, Code Mode rules | 3, 5 |
| Expose raw CDP as the agent contract | Asidewright deliberately presents Playwright/accessibility semantics | Architecture evidence, changelog | 3 |
| Guarantee console capture from generic Playwright compatibility | No Aside-specific console contract exists | Absence in primary docs | 3 |
| Treat local stdio as trusted | It exposes logged-in browser state and powerful actions | Security docs, terms | 4 |
| Promise a purely local data path | Hosted model, sync, and analytics paths are documented | Privacy policy/docs | 4 |
| Run sensitive account actions fully unattended | MFA, CAPTCHA, vault unlock, identity checks, and approvals require humans | Password-manager docs, terms | 4 |
| Allow concurrent mutations per profile | No isolation guarantee; routines avoid overlap | Automation/changelog | 4, 5 |
| Clone Chrome's dual isolated manual layout | Chrome has `--isolated=true`; Aside has no equivalent contract | Local Chrome/UTCP sources | 5 |
| Silently fall back across safety boundaries | Equivalent browser operations can carry different profile/approval semantics | Security synthesis | 5 |

## Divergence Map

- Saturated directions: CLI existence, local stdio transport, deterministic REPL abstraction, caller-owned safety, and repository UTCP shape.
- Divergent pivots taken: none; the configured loop used five fixed thematic passes.
- Pivot failures: none.
- Audited overrides: none.
- Council artifacts: none; this detached lineage used the bound `cli-codex / gpt-5.6-sol` executor.
- Remaining frontier: installed-binary help/version fixture, live MCP initialize/tools/list, console behavior, MCP permission inheritance/audit visibility, and multi-client/profile isolation.

Breadth is complete for packet authoring; product behavior at the remaining frontier is not claimed to have converged without live evidence.

## 12. Open Questions

| Question | Why it matters | Required evidence | Blocking? |
|---|---|---|---|
| What does the installed version's `aside --help` expose? | prevents stale/undocumented flag assumptions | captured version + help fixture | blocks final command adapter |
| What are MCP server identity, protocol, tools, and schemas? | defines Code Mode callable adapter | initialize + tools/list fixture | blocks MCP invocation, not UTCP registration |
| Does console capture work through REPL or MCP? | determines debugger parity | sentinel log round trip | blocks console feature only |
| Which permission/task mode does `aside mcp` inherit, and is activity auditable? | determines enforcement and UX | controlled read/action/sensitive test | blocks unattended write actions |
| Are concurrent clients isolated by process, account, profile, or session? | determines safe parallelism | two-client read and mutation matrix | blocks parallel mutation |
| Can `repl` or `mcp` select an account without changing the global default? | determines multi-account ergonomics | runtime help and controlled account test | blocks per-call account override |

## 13. `mcp-aside-devtools` Packet Architecture

Recommended files and responsibilities:

| Surface | Responsibility |
|---|---|
| `SKILL.md` | triggers, router, loading levels, route rules, non-goals, success criteria |
| `references/cli.md` | documented commands, quoting, sessions, account selection, exit/error contract |
| `references/repl.md` | Asidewright patterns for navigation, accessibility, interaction, artifacts, redaction |
| `references/mcp.md` | initialize/tools/list, capability registry, Code Mode naming, timeouts, fallback |
| `references/security.md` | identities, permissions, approvals, prompt injection, sensitive actions, privacy |
| `references/troubleshooting.md` | error taxonomy and daemon/account/profile/MCP recovery |
| `assets/utcp_aside_manual.md` | exact manual object and validation instructions |
| `scripts/doctor.sh` | read-only platform/binary/version/account/daemon/config/discovery diagnostics |
| `manual_testing_playbook/` | positive and negative scenario contracts with concrete evidence |

Router order:

1. classify requested capability and safety class;
2. run preflight;
3. choose direct task for outcome-oriented work;
4. choose REPL for deterministic, repeatable browser evidence;
5. choose MCP when composition is required or discovery exposes a better capability;
6. fall back only to a safety-equivalent route;
7. validate postconditions/artifacts;
8. return structured result, session/profile metadata, redacted diagnostics, and explicit unknowns.

## 14. UTCP Manual Registration

Append the following object to `.utcp_config.json.manual_call_templates`:

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

This matches the repository's current `manual_call_templates[]` schema and the official Aside client snippet. [SOURCE: .utcp_config.json:14] [SOURCE: https://docs.aside.com/help/developers]

After registration:

1. validate JSON with `jq empty .utcp_config.json`;
2. confirm `command -v aside` under the Code Mode server's environment;
3. run Code Mode `search_tools({ task_description: "Aside browser automation", limit: 20 })`;
4. group/list the `aside` tools;
5. inspect every intended callable with `tool_info()`;
6. call only discovered `aside.aside_<tool>()` functions inside `call_tool_chain()`;
7. return `{ success, data, errors, timestamp }`; and
8. preserve stderr and timeout details without leaking browser data.

Do not add a second manual, environment secret, URL, account argument, or disabled flag without runtime evidence and a separate decision.

## 15. Verification and Acceptance Matrix

| Area | Scenario | Pass evidence |
|---|---|---|
| Install | supported/unsupported OS and architecture | deterministic diagnostic; no silent install |
| CLI | version/help, direct task, `exec`, accounts | captured exit codes and structured/quoted output |
| Session | new task and `--session` continuation | same session continues with expected state |
| REPL | open tab, snapshot, locator, keyboard/evaluate | asserted URL/semantic/postcondition values |
| Screenshot | REPL and discovered MCP path | file exists, size > 0, PNG magic |
| Download | controlled file download | expected path, size/type, no path escape |
| Network | capture/replay read path | parseable structure; secrets redacted |
| Console | capability probe | sentinel captured or explicit unsupported result |
| MCP | initialize/tools/list | server identity and exact schema fixture |
| Code Mode | discovery/name translation/call | callable found by search/tool_info and successful structured return |
| Fallback | CLI→MCP and MCP→REPL | equivalent result without weaker safety context |
| Lifecycle | idle MCP, child restart, daemon outage/version mismatch | separate error and successful bounded recovery |
| Identity | signed out, account ambiguous, profile mismatch | fail closed with actionable diagnostic |
| Human gate | MFA/CAPTCHA/vault/approval | paused/resumable status; no bypass |
| Security | page prompt injection | content treated as data; instruction not executed |
| Concurrency | two clients on one profile | mutation serialized unless isolated proof exists |
| Artifact failure | zero/invalid screenshot or malformed capture | `ARTIFACT_INVALID`, not success |

## 16. Risks, Trade-offs, and Implementation Boundaries

- **Schema drift:** MCP names can change. Runtime discovery and versioned fixtures cost startup work but prevent fabricated/stale calls.
- **Task opacity versus determinism:** direct tasks are concise but harder to assert; REPL is verbose but evidence-friendly. Route by outcome versus proof needs.
- **Local power:** stdio reduces remote transport exposure but still grants access to authenticated browser state.
- **Model egress:** selected prompts, tool results, snapshots, screenshots, and files may reach hosted model providers; “local-first” is not “never leaves device.” [SOURCE: https://aside.com/policy/privacy]
- **Human dependencies:** authentication and sensitive actions can pause automation. The implementation must support resumable waiting, not bypasses.
- **Platform availability:** the official installer is macOS-only. Other platforms are unsupported until Aside publishes a supported distribution.
- **Concurrency:** serialization reduces throughput but is the correct default without isolation evidence.
- **Fallback complexity:** multiple routes increase testing burden. Keep capability and policy normalization centralized.
- **Scope boundary:** this research authorizes a packet blueprint, not installation, account mutation, live browser actions, `.utcp_config.json` editing, or implementation outside the lineage.

## 17. References

Primary Aside sources:

- [SOURCE: https://docs.aside.com/help/developers]
- [SOURCE: https://docs.aside.com/llms.txt]
- [SOURCE: https://docs.aside.com/help/security]
- [SOURCE: https://docs.aside.com/help/password-manager]
- [SOURCE: https://docs.aside.com/help/privacy]
- [SOURCE: https://docs.aside.com/help/tasks]
- [SOURCE: https://docs.aside.com/help/automation]
- [SOURCE: https://docs.aside.com/help/ai]
- [SOURCE: https://docs.aside.com/help/browser-basics]
- [SOURCE: https://docs.aside.com/help/ultrabrowse]
- [SOURCE: https://docs.aside.com/changelog/components.md]
- [SOURCE: https://docs.aside.com/changelog/native.md]
- [SOURCE: https://releases.aside.com/install.sh]
- [SOURCE: https://aside.com/]
- [SOURCE: https://aside.com/policy/terms]
- [SOURCE: https://aside.com/policy/privacy]

Corroborating sources:

- [SOURCE: https://youmind.com/es-ES/landing/x-viral-articles/aside-sota-browser-agent-benchmarks]
- [SOURCE: https://github.com/at-inc/aside-benchmarks]

Repository-local contracts:

- [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/]
- [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md]
- [SOURCE: .opencode/skills/mcp-code-mode/references/configuration.md]
- [SOURCE: .opencode/skills/mcp-code-mode/references/naming_convention.md]
- [SOURCE: .opencode/skills/mcp-code-mode/references/workflows.md]
- [SOURCE: .utcp_config.json]

## Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining research questions: 0 packet-architecture questions; 6 runtime verification questions retained in Section 12
- Last three iteration summaries: run 3 browser-automation workflows (0.95); run 4 security/operations (0.96); run 5 integration blueprint (0.83)
- Convergence threshold: 0.05, recorded as telemetry only under the configured max-iterations policy
- Mean new-information ratio: 0.934
- Divergence summary: no pivots, failures, Council artifacts, or overrides; remaining frontier is live installed-product behavior
- Terminal claim: the architecture and registration decision are synthesis-ready; unsupported runtime behavior remains explicitly unclaimed

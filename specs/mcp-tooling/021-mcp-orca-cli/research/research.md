---
title: "Feature Research: Orca CLI mcp-tooling port"
description: "Evidence inventory for the official Orca CLI skill, local mcp-tooling conventions, and the bounded read-only review used to shape the implementation packet."
trigger_phrases:
  - "Orca source inventory"
  - "Orca CLI evidence"
  - "mcp-tooling nested packet research"
  - "Orca routing research"
importance_tier: "important"
contextType: "implementation"
---
# Feature Research: Orca CLI mcp-tooling port

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

## 1. RESEARCH METADATA

- **Research ID**: ORCA-CLI-PORT-001
- **Feature/Spec**: `mcp-tooling/021-mcp-orca-cli`
- **Status**: Complete for implementation integration; live mutation and compiled-serving evidence remain pending
- **Date Started**: 2026-09-19
- **Date Completed**: 2026-09-19
- **Researcher(s)**: Primary implementation agent; bounded `@deep-research` cli-pi worker
- **Reviewers**: Local source-of-truth reconciliation by the primary agent
- **Last Updated**: 2026-09-19

## 2. REQUEST SUMMARY

The requested work was to port the official `orca-cli` Agent Skill from Orca ADE into the repository's mcp-tooling hub, improve it to match the local nested-skill conventions, and connect it to both the parent router and the system skill advisor. The authorized continuation completed the CLI preflight, leaf packet, hub integration, generated metadata, routing/advisor evidence, and documentation while keeping state-changing operations and compiled activation gated.

## 3. OFFICIAL SOURCE INVENTORY

### Primary source: official repository skill

Source: <https://github.com/stablyai/orca/blob/HEAD/skills/orca-cli/SKILL.md>

The fetched source identifies the skill as `orca-cli` and describes it as a way to operate Orca-managed worktrees, folder contexts, terminals, repositories, automations, artifacts, skill sharing, worktree comments, and Orca's embedded browser through the `orca` CLI. It says to prefer the CLI over raw git worktrees, ad hoc PTYs, or Computer Use when Orca state is involved, and to reserve Computer Use for visible-window GUI control that the CLI, filesystem, or API cannot perform.

The source is a discovery stub, not a complete frozen command reference. It requires the operator to resolve one executable for the session:

1. `ORCA_CLI_COMMAND` when set.
2. `orca-dev` in a development checkout exposing `ORCA_DEV_REPO_ROOT`.
3. `orca-ide` on Linux outside an Orca-managed terminal.
4. `orca` otherwise.

It explicitly warns that the selected executable must not silently fall through to another executable when it fails. It then requires the version-matched guide before running commands:

```text
ORCA skills get orca-cli
```

The source recommends `--json`, says to use the selected executable's `--help` for uncovered flags, and gives a read-only recovery path when the runtime is not running. If `skills get` is unknown, it says to report that fact, use `--help` for read-only discovery, and not guess unsupported commands.

### Official skills and MCP documentation

Source: <https://www.onorca.dev/docs/cli/skills>

The official documentation confirms that public Orca skill packages are hybrid discovery stubs because command flags live in the binary and are version-dependent. It lists the `orca-cli` installation command:

```bash
npx skills add https://github.com/stablyai/orca --skill orca-cli --global
```

It repeats the executable-resolution and version-matched guide flow and recommends `--json` for deterministic automation. It documents related separate packages (`orchestration`, `computer-use`, `orca-linear`, emulator skills, and workspace environment support) rather than making them part of `orca-cli`.

The same page describes Orca's MCP servers as registered under the app's integrations settings, with tools exposed to compatible agent CLIs. This is documentation context, not proof that the installed `orca` executable exposes a specific MCP server or that this repository should add one.

### Official source inventory table

| Surface | Confirmed source fact | Porting implication |
|---|---|---|
| Skill identity | The package is named `orca-cli`, not `cli-orca`. | Use the leaf and mode identity `mcp-orca-cli`. |
| Installation | Public package is installed with `npx skills add ... --skill orca-cli --global`. | Document installation separately from runtime guide loading. |
| Runtime guide | `orca skills get orca-cli` resolves the version-matched guide; `--full`/`--json` are supported in the official docs context. | Do not freeze a command table from the stub alone. |
| Executable resolution | Environment override, dev binary, Linux IDE binary, then default binary. | Resolve once and fail closed on an unusable selection. |
| Domains | Worktrees, folders, terminals, repos, automations, artifacts, skill sharing, comments, embedded browser. | Define workflow ownership and mutation/browser boundaries. |
| MCP context | Official docs describe MCP registration in Orca integrations. | Verify the installed surface before choosing a CLI-plus-MCP backend value. |
| Related skills | Orchestration and computer-use are separate packages. | Keep them out of this member unless separately approved. |

## 4. LOCAL REPOSITORY EVIDENCE

The local mcp-tooling hub is populated under `.pi/skills/mcp-tooling/` and exposes one graph identity with workflow-mode selection. The local nested-packet contract at `.pi/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` requires a new mode to be carried across the registry, stage-one signals, tie-break permutation, stage-two router, graph vocabulary, human mode table, description metadata, generated leaf manifest, and command mirrors only when a command is bound.

The current hub has ten members: six workflow bridges and four read-only transports. The shared `mcp-code-mode` substrate is deliberately not a hub member. Therefore Orca is registered as a CLI-only workflow mode rather than as a `code_mode` registration variant.

The closest local workflow/safety precedent is `.pi/skills/mcp-tooling/mcp-aside-devtools/`. It uses a preflight pattern before relying on flags, separates read-only/mutating/destructive actions, verifies artifacts independently, and treats external content as untrusted. The mcp-magicpath packet is the closest precedent for a vendor CLI transport but is not sufficient to classify Orca as read-only because Orca worktrees and terminals may execute commands.

The local hub contract also has two important generated-state constraints:

- `hub-router.json`'s tie-break list must be an exact permutation of `mode-registry.json` modes.
- `leaf-manifest.json` must be regenerated through the repository command and never hand-edited.

The router has two stages. `hub-router.json` selects the workflow mode. Root `ROUTER.md` then maps a tool-intent key to a packet-qualified leaf resource. Its machine-readable resource-map keys must remain byte-synchronized with its prose signal map, and every resource path must resolve on disk.

## 5. BOUNDED CLI-PI REVIEW

A single observation-only dispatch used the resolved `@deep-research` persona inline, the read-only tool set (`read,grep,find,ls`), the provider-qualified `llmgateway/deepseek-v4.1-flash` model, `--thinking high`, `--offline`, closed stdin, and explicit prohibitions on writes, installs, validation, context saves, git commands, and sub-agent dispatch. The dispatch returned a structured review of the hub surfaces and reported no file modifications. Its process exit was not treated as the evidence; the returned text was reconciled against the local files.

The review identified the 11-surface integration checklist, the workflow/mutation risk, browser overlap, alias narrowness, stale-count risk, generated-manifest requirement, and the need to distinguish source routing from compiled-serving evidence. Those findings agree with the local source read and are used as supplemental evidence only.
## 5A. AUTHORIZED LIVE PREFLIGHT AND INTEGRATION EVIDENCE

The authorized continuation resolved `ORCA_CLI_COMMAND` as unset and selected `/usr/local/bin/orca`. `orca --version` returned `1.4.205`; `orca agent-context --json` returned schema version 1 with 234 commands; and the version-matched `orca-cli` guide plus browser, automation, and publishing references were retrieved.

The inspected command registry exposed no Orca-native MCP command. The delivered packet therefore uses `backendKind: cli-only`, registers no Code Mode manual, and keeps the official app-level MCP documentation as a separate unverified integration context. The version-matched browser guide establishes an Orca-managed browser lane, while generic CDP and generic agentic browser work remain owned by the existing sibling packets.

The leaf packet and ten-mode hub integration now pass package, parent-skill, generated-manifest, source-route, advisor, and strict-spec gates. The dated benchmark report records PASS for read-only preflight and routing boundaries, SKIP for unauthorized mutation/publishing/browser-driving lanes, and legacy/stale compiled-route status.
## 6. CONFIRMED, INFERRED, AND UNKNOWN

### Confirmed by official sources

- The skill is `orca-cli` and comes from `stablyai/orca`.
- The public package is a discovery stub that loads a version-matched guide.
- The documented installation command and guide command are available in the official docs.
- The documented executable resolution order is explicit.
- The skill's documented domains include Orca-managed worktrees, folders, terminals, repositories, automations, artifacts, comments, skill sharing, and an embedded browser.
- Related Orca skills exist separately and should not be silently folded into this port.

### Confirmed by local repository inspection

- The populated mcp-tooling hub path is `.pi/skills/mcp-tooling/`.
- The hub uses a mode registry, stage-one router, root stage-two router, one graph identity, a generated leaf manifest, a human mode table, playbooks, and benchmarks.
- The nested-packet contract requires the new member to be represented on the applicable surfaces listed above.
- The parent check and strict spec/package/route/advisor command paths exist locally.
- The existing cache-optimizer extension contains an unrelated `OpenOrca` model label, so a bare `orca` alias is a plausible false-positive capture.
- The delivered registry, router, graph, leaf manifest, playbook, and benchmark now contain the `mcp-orca-cli` member and ten-mode inventory.

### Inferred but not safe to freeze

- The exact repository effects of Orca worktree and terminal operations remain unconfirmed because no disposable mutation probe was authorized. The registry conservatively declares `mutatesWorkspace: true`.
- Official docs describe app-level MCP integrations, but the installed CLI registry exposed no native MCP command, server, transport, or callable schema for this packet.
- The registry uses `command: null` consistently for this hub's modes; the Orca entry follows that observed convention.

### Remaining unknowns after authorized preflight

| Unknown | Required observation |
|---|---|
| Exact argument and flag spellings across other Orca versions | Read the selected version's guide and help; do not infer from the discovery stub. |
| App-level MCP callable surface | Inspect an authorized Orca integration and record the actual transport/tool contract before adding any manual. |
| Live embedded-browser behavior | Use an authorized disposable Orca-managed page for a read-only capability probe; generic CDP remains out of scope. |
| Worktree/terminal execution semantics | Use a separately authorized controlled probe against a disposable target. |
| Whether commands write this repository | Observe a controlled authorized action and inspect filesystem/git state. |
| Credential requirements | Run only the documented read-only discovery flow in the authorized environment and record the exact requirement. |
| Runtime recovery behavior | Observe the documented stopped-runtime path without silently switching executables.

## 7. RECOMMENDATION

The delivered implementation follows a flat Level 3 workflow packet with an evidence-gated conservative runtime posture. Its leaf contract uses executable preflight, live guide resolution, explicit read-only/mutating/destructive separation, independent artifact verification, untrusted-content handling, and browser ownership boundaries. The member is present in both routing stages and the one hub graph identity, with narrow aliases (`orca cli`, `orca worktree`, `orca skills`) and positive/negative replay evidence.

Do not treat the integration as proof that repository mutation, authentication, publishing, browser-driving, or compiled serving is safe or available. Those remaining claims require the operator-gated observations named above.

## 8. SOURCES

| Source | Use | Credibility |
|---|---|---|
| <https://github.com/stablyai/orca/blob/HEAD/skills/orca-cli/SKILL.md> | Official skill identity, domains, executable resolution, and live-guide requirement | High |
| <https://www.onorca.dev/docs/cli/skills> | Official installation, hybrid-stub explanation, JSON guidance, related skills, and MCP context | High |
| `.pi/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` | Local nested-packet and hub-surface contract | High |
| `.pi/skills/mcp-tooling/mcp-aside-devtools/` | Local workflow preflight, safety, and untrusted-content precedent | High |
| `.pi/skills/mcp-tooling/mcp-magicpath/` | Local vendor-CLI transport and generated-manifest precedent | High |
| `.pi/skills/cli-external-orchestration/cli-pi/` | Local bounded read-only dispatch contract | High |
| `.skilled/skills/mcp-tooling/benchmark/reports/orca-integration/` | Dated preflight, routing, advisor, stale-manifest, redaction, and safety-skip evidence | High |
---
title: "Feature Specification: Port Orca CLI into mcp-tooling"
description: "Define an implementation-ready, evidence-gated workflow packet for the official Orca CLI skill without inventing version-specific commands or unsafe mutation semantics. The packet must join the mcp-tooling hub, both routing stages, and the system skill advisor while preserving existing packet boundaries."
trigger_phrases:
  - "Orca CLI integration"
  - "mcp-orca-cli"
  - "Orca workflow packet"
  - "Orca hub routing"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Port Orca CLI into mcp-tooling

<!-- SPECKIT_LEVEL: 3 -->

## EXECUTIVE SUMMARY

This packet defines the work required to port the official `orca-cli` Agent Skill from `stablyai/orca` into the `.pi/skills/mcp-tooling` hub as a new workflow member. The source is a hybrid discovery stub: it identifies when Orca owns the state, resolves the session executable, and loads a version-matched guide; it does not provide a safe basis for freezing every command flag in repository documentation.

The implementation target is a flat Level 3 packet with evidence-gated safety. Following authorized live preflight, the leaf packet and coordinated mcp-tooling hub integration were delivered. Compiled routing remains on the legacy source path because the promoted activation manifest is stale; no compiled-serving claim is made.

**Key Decisions**: Keep one flat Level 3 packet; classify the member as a workflow packet; use narrow Orca-specific aliases; route advisor discovery through the hub graph identity only; preserve unverified mutation semantics as conservative gates.

**Current implementation state**: Orca 1.4.205 was resolved at `/usr/local/bin/orca`; its local command registry contains 234 commands and no native Orca MCP command. The CLI-only `mcp-orca-cli` leaf, ten-mode hub registry/router/graph/docs, generated leaf manifest, playbook, benchmark evidence, and changelog are present. Live mutation, publishing, and browser-driving scenarios were not executed without separate authorization and disposable targets.

**Critical Dependencies**: Official Orca source and docs; `sk-doc/sk-create-skill-parent` nested-packet contract; the existing `.pi/skills/mcp-tooling` hub; the repository routing, metadata, package, and strict-spec gates.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete — specification and Orca integration delivered; compiled serving and live mutating lanes deferred |
| **Created** | 2026-09-19 |
| **Branch** | `scaffold/021-mcp-orca-cli` |
| **Packet role** | Workflow member of the existing mcp-tooling hub |
| **Runtime posture** | Evidence-gated conservative |
<!-- /ANCHOR:metadata -->

---

## 2. PROBLEM & PURPOSE

### Problem Statement

Before this integration, the repository had no Orca workflow member, while the official `orca-cli` skill describes a stateful CLI spanning worktrees, folder contexts, terminals, repositories, automations, artifacts, comments, skill sharing, and an embedded browser. Its public skill file is intentionally a discovery stub and delegates command details to the installed Orca binary, so a naïve port could publish stale flags, route unrelated `OpenOrca` prompts, or allow unverified workspace mutation.

The mcp-tooling hub has two coupled routing layers and one graph identity. A new member must be registered consistently across the mode registry, stage-one router, stage-two resource router, graph metadata, human contract, generated leaf manifest, playbooks, benchmarks, and package validation without creating a second advisor identity or widening existing browser ownership.

### Purpose

Record a reviewable implementation specification and the evidence-gated implementation of `mcp-orca-cli`, preserving known runtime limits and a clear operator handoff for remaining state-changing checks.

---

## 3. SCOPE

### In Scope

- Inventory the official `orca-cli` source, installation path, executable-resolution rules, version-matched guide flow, documented domains, and available official skill/MCP context.
- Define a new `.pi/skills/mcp-tooling/mcp-orca-cli` workflow packet using the nested-packet contract and only the leaf files justified by verified behavior.
- Specify the complete hub integration: `mode-registry.json`, `hub-router.json`, root `ROUTER.md`, hub `SKILL.md`, hub `README.md`, `description.json`, `graph-metadata.json`, and regenerated `leaf-manifest.json`.
- Specify metadata-only system-skill-advisor integration, narrow aliases, positive routing cases, and out-of-domain holdouts.
- Specify packet references, installation guidance, manual tests, changelog entries, hub playbook routing, benchmark coverage, rollback, and validation evidence.
- Record bounded read-only `cli-pi`/DeepSeek research and review as evidence, with returned findings independently checked against local files.
- Preserve the comment-hygiene rule: code comments must explain durable behavior or rationale and must not contain spec paths or ADR, REQ, CHK, or task identifiers.

### Out of Scope

- Extending the delivered CLI-only bridge into an Orca MCP manual, or inventing a server, flags, credentials, browser lane, or mutation semantics not established by the inspected runtime.
- Changes to `mcp-code-mode`, existing mcp-tooling members, advisor scoring/projection infrastructure, or unrelated Orca integrations.
- Installing or updating Orca, authenticating an account, or running mutating/destructive commands without separate operator authorization and a disposable target.
- Folding the `orchestration`, `computer-use`, `orca-linear`, or emulator skills into this member; they remain separate official skill packages unless later approved as separate work.

### Implementation Surfaces and Remaining Gates


| File or Directory | Change Type | Delivered or Remaining Work |
|---|---|---|
| `.pi/skills/mcp-tooling/mcp-orca-cli/` | Created | Delivered the workflow leaf packet, references, install guide, manual tests, and changelog. |
| `.pi/skills/mcp-tooling/mode-registry.json` | Modified | Registered the workflow mode, packet identity, conservative tool-surface policy, narrow aliases, and metadata advisor class. |
| `.pi/skills/mcp-tooling/hub-router.json` | Modified | Added stage-one signals and preserved an exact tie-break permutation. |
| `.pi/skills/mcp-tooling/ROUTER.md` | Modified | Added the matching stage-two intent and packet-qualified resource map entries. |
| `.pi/skills/mcp-tooling/SKILL.md` | Modified | Added the member and synchronized workflow/member counts. |
| `.pi/skills/mcp-tooling/README.md` | Modified | Added the member contract and boundary summary. |
| `.pi/skills/mcp-tooling/description.json` | Modified | Extended hub description vocabulary without duplicating registry-owned fields. |
| `.pi/skills/mcp-tooling/graph-metadata.json` | Modified | Added the Orca vocabulary to the single hub advisor identity. |
| `.pi/skills/mcp-tooling/leaf-manifest.json` | Regenerated | Refreshed through the canonical metadata command; it now reaches all ten modes. |
| `.pi/skills/mcp-tooling/manual-testing-playbook/` | Modified | Added positive Orca routing, ownership boundaries, mutation skips, and negative holdouts. |
| `.skilled/skills/mcp-tooling/benchmark/reports/orca-integration/` | Created | Recorded redacted preflight, source routing, advisor, stale-manifest, and safety-skip evidence. |
| `.pi/skills/mcp-tooling/changelog/` | Created | Added the hub 1.7.0.0 entry and synchronized the leaf 1.0.0.0 entry. |
| `.skilled/bin/lib/compiled-routing/activation/mcp-tooling/manifest.json` | Deferred | Compiled serving remains legacy until an authorized sync/finalize operation refreshes the stale manifest. |
| `specs/mcp-tooling/021-mcp-orca-cli/` | Existing | Retained as the implementation evidence and operator handoff packet.

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The implementation must resolve the selected Orca executable once, load `orca skills get orca-cli` before relying on command details, prefer JSON output where supported, and record unavailable or unsupported behavior as `UNKNOWN` rather than guessing. |
| REQ-002 | The new leaf must be registered as one `mcp-orca-cli` workflow member with a tool-surface policy that matches observed mutation behavior. `backendKind` and `mutatesWorkspace` must not be frozen from inference when the authorized preflight cannot observe them. |
| REQ-003 | Both hub routing stages and the single system-skill-advisor graph identity must be updated together. The registry tie-break list must remain an exact permutation of registered modes, the root router signal and resource-map key sets must remain equal, and every resource path must resolve. |
| REQ-004 | The implementation must preserve browser ownership boundaries: Orca-managed embedded-browser state belongs to Orca; existing agentic-browser and CDP members retain their current ownership. A bare `orca` alias must not be used unless replay evidence proves it cannot capture unrelated traffic. |
| REQ-005 | The implementation must pass the targeted parent-skill check, stage-one routing replay, stage-two advisor replay, package check, regenerated-manifest check, strict spec validation, and final scoped diff/comment-hygiene inspection.

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The leaf packet must include a README, SKILL contract, installation guide, changelog, references for command/safety/session boundaries, and manual tests; optional catalog, examples, scripts, and assets are added only when verified behavior justifies them. |
| REQ-007 | The hub playbook and benchmark must cover positive Orca routing, browser overlap, missing-binary recovery, unverified mutation, stale generated metadata, and out-of-domain aliases. |
| REQ-008 | The specification must preserve a clear implementation handoff: no planning step installs, authenticates, or mutates through Orca; unresolved facts name the exact observation needed to resolve them. |
| REQ-009 | All comments added to implementation code must satisfy the comment-hygiene invariant and must not embed repository packet paths or temporary tracking identifiers. |

> Acceptance criteria for this packet live in `acceptance-criteria.md`. They decide whether the planning packet may close; implementation evidence and remaining operator-gated work are recorded in `implementation-summary.md` and `research/research.md`.

---

## 5. SUCCESS CRITERIA

- **SC-001**: A maintainer can identify every delivered file change, remaining routing/runtime gate, metadata dependency, and generated artifact from this packet without consulting an undocumented assumption.
- **SC-002**: The official source inventory separates confirmed facts, inferences, and unresolved runtime facts, and names an observation for every unresolved fact.
- **SC-003**: The delivered implementation has positive and negative source-routing evidence and a browser/mutation boundary that does not widen existing members; compiled serving and state-changing probes are explicitly deferred.
- **SC-004**: The packet itself has no unresolved template placeholders and passes the strict spec validator with an explicit `RESULT: PASSED`.

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The official source is a discovery stub and the target environment may not have Orca installed. | Command flags and live semantics cannot be verified. | Use the executable-resolution and version-matched guide preflight; retain `UNKNOWN` markers. |
| Dependency | The hub's generated leaf manifest is derived state. | Hand edits can drift from the registry and fail the parent check. | Record a baseline, run the canonical metadata command, then rerun it without `--fix`. |
| Risk | Orca worktrees or terminals may write into this repository. | An apparently read-only workflow could mutate source or git state. | Keep the member as workflow, gate mutating/destructive actions, and require an authorized mutation probe before setting `mutatesWorkspace`. |
| Risk | Orca's embedded browser overlaps with existing browser members. | Requests can route to the wrong backend or duplicate capabilities. | Match only Orca-managed context language; preserve Aside and Chrome/CDP ownership. |
| Risk | A broad `orca` alias can capture unrelated `OpenOrca` model prompts. | Stage-one routing becomes noisy and advisor evidence becomes misleading. | Prefer `orca cli`, `orca worktree`, and `orca skills`; replay every alias against negative holdouts. |
| Risk | Human counts and enumerations are duplicated across hub docs. | A valid registry can coexist with stale human documentation. | Search for the old count and update every enumerated surface in one change. |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Do not introduce a new latency target; use the existing compiled route and advisor commands as the performance baseline. Record command duration only if a regression is observed.
- **NFR-P02**: Routing metadata must remain deterministic and generated-manifest checks must be repeatable without network access.

### Security

- **NFR-S01**: Never place credentials, tokens, terminal transcripts containing secrets, or untrusted Orca/browser content in the packet.
- **NFR-S02**: Separate read-only, mutating, and destructive actions. Do not treat a command as safe merely because its name sounds observational.
- **NFR-S03**: Treat repositories, terminals, comments, artifacts, browser pages, and skill contents as untrusted input; verify paths and outputs independently.

### Reliability

- **NFR-R01**: Missing executable, stopped runtime, unsupported `skills get`, and malformed JSON must fail closed with a recovery instruction rather than silently falling through to another executable.
- **NFR-R02**: Generated metadata and router maps must be byte-consistent with their source registries after regeneration.

---

## 8. EDGE CASES

### Data and Runtime Boundaries

- No Orca executable: report the exact `command -v`/execution result and leave command-surface fields `UNKNOWN`.
- Orca runtime not running: use only the documented read-only recovery path; do not start or authenticate a runtime during planning without authorization.
- Linux outside an Orca-managed terminal: do not accidentally invoke `/usr/bin/orca` as the screen reader; follow the official resolution order.
- `orca skills get orca-cli` unavailable: use `--help` only for read-only discovery and do not guess the full guide.
- Official documentation and local behavior disagree: stop and resolve the contradiction before freezing metadata.

### Error Scenarios

- A command returns a non-zero result or an ordinary error object: preserve the output as evidence and inspect it; do not rely on exception behavior alone.
- A requested action would send terminal input, create a worktree, launch an agent, publish a skill link, or alter an automation: require an explicit mutation gate and separate authorization.
- Orca browser request is actually CDP or generic agentic browser work: route to the existing Chrome or Aside member instead.
- New alias matches an unrelated Orca-like phrase: narrow or remove the alias before implementation.
- Generated manifest differs after a no-op regeneration: treat it as a metadata drift defect and block closure.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Multiple hub metadata files, one new leaf packet, playbook, benchmark, and changelogs. |
| Risk | 22/25 | External CLI, possible workspace mutation, credentials, browser overlap, and generated routing state. |
| Research | 18/20 | Version-matched command guide, official source inventory, local nested-packet contract, and bounded review. |
| Multi-Agent | 8/15 | One bounded read-only cli-pi review; implementation remains single-owner. |
| Coordination | 12/15 | Registry, two routers, graph identity, generated manifest, and documentation must move together. |
| **Total** | **80/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Version-specific Orca commands are frozen from the discovery stub. | High | High | Resolve the executable and load the live guide before documenting commands. |
| R-002 | Orca mutates the repository through worktree or terminal operations. | High | Medium | Keep workflow classification, require a controlled authorized probe, and gate mutation. |
| R-003 | Browser ownership is ambiguous. | Medium | Medium | Define Orca-managed context versus generic/CDP ownership and add overlap tests. |
| R-004 | Routing aliases capture unrelated `OpenOrca` prompts. | Medium | Medium | Use narrow multi-word aliases and negative holdouts. |
| R-005 | Generated or human hub surfaces drift. | Medium | High | Regenerate leaf metadata and replay the parent-skill, route, advisor, and diff gates. |

---

## 11. USER STORIES

### US-001: Implement from Verified Evidence (Priority: P0)

**As a** skill maintainer, **I want** an implementation-ready Orca packet specification that distinguishes observed behavior from assumptions, **so that** I can add the member without inventing flags or unsafe mutation semantics.

**Acceptance criteria:** see `acceptance-criteria.md` rows AC-001 through AC-004 and AC-006.

---

### US-002: Route Orca Requests Precisely (Priority: P1)

**As a** user of the skill advisor, **I want** Orca-specific requests to reach the Orca packet while generic browser, git, and unrelated OpenOrca requests retain their existing owners, **so that** the hub remains predictable.

**Acceptance criteria:** see `acceptance-criteria.md` rows AC-003, AC-004, and AC-005.

---

## 12. IMPLEMENTATION STATUS AND REMAINING QUESTIONS

The authorized continuation resolved the previously open environment questions as follows:

- The executable is `/usr/local/bin/orca`, version `1.4.205`; `agent-context --json` exposes 234 commands.
- The inspected command registry exposes no Orca-native MCP command. The packet therefore registers a CLI-only backend and no Code Mode manual.
- The version-matched guide exposes Orca-managed browser operations; generic CDP and generic agentic browser ownership remains with the existing packets.
- The registry uses conservative workflow classification and `mutatesWorkspace: true`; no claim is made that every operation mutates the current repository.

Remaining operator-gated questions:

- Whether a controlled disposable worktree/terminal probe changes this repository or only Orca-managed state.
- Whether credentials, publishing, or live browser/terminal mutation scenarios may be exercised.
- When the compiled-routing activation manifest may be refreshed and promoted; current status is legacy authority with `stale-manifest`.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown and Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`
- **Evidence**: See `research/research.md`
- **Closure Gate**: See `acceptance-criteria.md`

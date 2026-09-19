---
title: "Implementation Plan: Port Orca CLI into mcp-tooling"
description: "An evidence-gated implementation sequence for adding the official Orca CLI skill as a workflow member of the existing mcp-tooling hub."
trigger_phrases:
  - "implementation plan"
  - "Orca CLI technical approach"
  - "mcp-tooling hub integration"
  - "Orca routing verification"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Port Orca CLI into mcp-tooling

<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON, Markdown, shell, Node.js, and Python repository tooling |
| **Framework** | Existing `sk-doc` nested-packet and mcp-tooling hub contracts |
| **Storage** | No data migration; generated routing and graph metadata only |
| **Testing** | Parent-skill check, compiled route, system-skill-advisor replay, package check, metadata regeneration, strict spec validation, and focused manual fixtures |

### Overview

Add one workflow packet under `.pi/skills/mcp-tooling` after verifying the official Orca executable and live guide. The authorized continuation completed the evidence preflight, leaf contract, registry and both routing layers, graph identity, generated manifest, playbooks, benchmark evidence, and release entries. Live state-changing lanes and compiled activation remain separately gated.

The packet is now reconciled implementation evidence and handoff documentation. It does not claim that skipped mutation, publishing, browser-driving, or compiled-serving checks were performed.
<!-- /ANCHOR:summary -->

## 2. QUALITY GATES

### Definition of Ready

- [x] Problem, scope, non-goals, unknowns, and rollback boundaries are documented in `spec.md`.
- [x] Official source facts and local convention evidence are recorded in `research/research.md`.
- [x] The flat Level 3 shape and conservative runtime posture are recorded in `decision-record.md`.
- [x] Delivered leaf, routing, metadata, playbook, benchmark, and validation surfaces are named.

### Definition of Done for the Delivered Integration and Handoff

- [x] Live Orca preflight evidence supports every documented command and metadata value used by the delivered packet.
- [x] Leaf packet and all source hub surfaces pass the targeted parent-skill check.
- [x] Positive and negative source route/advisor replays, package validation, manifest regeneration, and strict spec validation pass.
- [x] The final Orca-owned diff contains no unrelated changes or forbidden comments; compiled activation is recorded separately as deferred because its manifest is stale.

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

Before each remaining operator-gated task, confirm the approved scope, read the target file, identify the owning router or packet contract, and name the smallest observable check. Do not begin a mutation, install, authentication step, or external CLI call without the required authorization.

### Execution Rules

| Rule | Requirement |
|---|---|
| `TASK-SEQ` | Execute evidence preflight before leaf authoring, leaf authoring before hub wiring, and hub wiring before generated metadata and final checks. |
| `TASK-SCOPE` | Touch only the target leaf, named hub surfaces, and packet evidence; do not edit existing member internals or advisor projection infrastructure. |
| `TASK-EVIDENCE` | Treat worker or CLI output as a hypothesis until its paths, output, and final state are independently checked. |

### Status Reporting Format

Report each task as `Status: <done|blocked|deferred> — Evidence: <observed command or file> — Next: <single next action>`. Distinguish confirmed facts, inferences, and user-only checks.

### Blocked Task Protocol

If Orca is missing, the guide is unsupported, a route captures a negative holdout, a generated file drifts, or a check fails, mark the task `BLOCKED`, record the exact output, stop dependent work, and return to the owning decision or repair the root cause before continuing.

## 3. ARCHITECTURE

### Pattern

Two-stage hub routing with one advisor identity and nested leaf packets:

1. `mode-registry.json` and `hub-router.json` select the workflow mode.
2. Root `ROUTER.md` resolves a packet-qualified leaf resource.
3. The hub `graph-metadata.json` supplies the metadata-only advisor identity.
4. `mcp-orca-cli` owns Orca-managed CLI state; existing browser members retain their own primitives.

### Key Components

- **Official Orca source inventory**: the public discovery stub, skills documentation, and verified live guide.
- **Workflow leaf packet**: the SKILL contract, install guide, references, manual tests, and changelog.
- **Hub registration**: mode identity, packet kind, backend/tool-surface fields, aliases, and advisor routing class.
- **Stage-one router**: Orca-specific signal classes, resources, and exact tie-break permutation.
- **Stage-two router**: matching intent key and packet-qualified resource map with equal key sets.
- **Single advisor identity**: hub graph vocabulary containing the union of Orca trigger phrases, intent signals, and domains.
- **Generated metadata gate**: regenerated leaf manifest and consistency checks.

### Data Flow

```text
Official source/docs
        │
        ▼
Executable preflight ──► verified facts / UNKNOWN markers
        │
        ▼
Leaf safety contract ──► mode registry ──► stage-one route
        │                                      │
        └──────────────► graph identity ──────┼──► stage-two resource route
                                               │
                                               ▼
                              playbook + benchmark + generated manifest
                                               │
                                               ▼
                                     validation and scoped diff
```

## 4. AFFECTED SURFACES

| Surface | Current Role | Follow-on Action | Verification |
|---------|--------------|------------------|--------------|
| `mode-registry.json` | Canonical mode identity and safety metadata | Add one workflow entry with narrow aliases and metadata advisor routing | Parent-skill check; JSON parse |
| `hub-router.json` | Stage-one mode selection | Add Orca signal classes and exact tie-break member | Parent-skill check; compiled route |
| Root `ROUTER.md` | Stage-two leaf resource selection | Add matching signal and resource-map key | Resource-map key equality and path replay |
| Hub `graph-metadata.json` | Single advisor identity | Add Orca vocabulary without a second identity | Advisor replay and graph inspection |
| `leaf-manifest.json` | Generated leaf inventory | Regenerate through the canonical command | Fix run plus no-fix run |
| Hub/leaf docs | Human and packet contracts | Add counts, boundaries, install guidance, tests, and changelogs | Package check and diff review |

Required inventories before implementation:

- Search all count-bearing hub text before changing the mode registry.
- Search all existing `orca`/`OpenOrca` vocabulary to identify false-positive aliases.
- Enumerate every `ROUTER.md` resource-map path and confirm it resolves under the hub.
- Enumerate all fields required by `parent-skills-nested-packets.md` §7 for a `metadata` advisor-routing mode.
- List the routing matrix before implementation: positive Orca CLI/worktree/skills prompts; generic browser/CDP prompts; git-only prompts; OpenOrca model prompts; missing-binary prompts; and mutation requests.

## 5. IMPLEMENTATION PHASES

### Phase 0 — Evidence and packet contract

1. Resolve `ORCA_CLI_COMMAND`, then `orca-dev`, Linux `orca-ide`, or `orca` according to the official stub; the authorized run resolved `/usr/local/bin/orca`.
2. Run the authorized read-only preflight: version, help, local schema, version-matched guide, conditional references, and runtime status; prefer JSON output.
3. Record exact observed command families, the absence of a native CLI MCP command, credentials/authorization boundaries, browser capability, and the remaining repository-mutation unknown. Keep unobserved effects `UNKNOWN`.
4. Select the leaf packet files from observed behavior and copy only durable safety conventions from existing members.

### Phase 1 — Leaf packet

1. Create `mcp-orca-cli/SKILL.md`, `README.md`, and `INSTALL-GUIDE.md`.
2. Add references for command surface, executable/session resolution, mutation boundary, browser ownership, and troubleshooting.
3. Add manual fixtures for missing binary, stopped runtime, unsupported guide, read-only actions, and explicitly gated mutating actions.
4. Add the leaf changelog and the manual playbook justified by the observed surface.
5. Run the leaf package check before hub wiring; the delivered packet passes.

### Phase 2 — Hub registration and routing

1. Add the registry entry with `workflowMode`, `packetKind`, observed `backendKind: cli-only`, conservative `toolSurface`, packet identity, lowercase unique aliases, and `advisorRouting.routingClass: "metadata"`.
2. Add stage-one signals and append the exact mode to the tie-break permutation.
3. Add one matching stage-two intent key and one packet-qualified resource-map entry; keep machine-readable and prose router surfaces synchronized.
4. Add the Orca vocabulary to the hub graph identity only; do not change global advisor scorer/projection maps.
5. Update hub member counts, README, playbook, benchmark, and changelogs.
6. Regenerate `leaf-manifest.json`; the committed artifact reaches all ten modes.

### Phase 3 — Verification and handoff

1. Run the parent-skill check against the explicit mcp-tooling hub path; it passes with zero warnings.
2. Replay positive and negative source routing plus the system advisor; current-source evidence passes and is recorded in the dated benchmark report.
3. Record generic browser/CDP, Git-only, and unrelated OpenOrca holdouts; they do not select the Orca mode.
4. Run package, metadata, strict spec, whitespace, and comment-hygiene checks; compiled-route status is recorded as legacy/stale rather than claimed as compiled serving.
5. Inspect the scoped diff and confirm no installation, authentication, mutation, or unrelated changes occurred.
6. Hand the remaining disposable-target, publishing, and compiled activation decisions to the operator.

## 6. TESTING STRATEGY

| Test Type | Scope | Tools / Observable Result |
|-----------|-------|---------------------------|
| Source preflight | Executable and live guide | Authorized `command -v`, version, help, schema, guide, references, and status; exact output or explicit UNKNOWN |
| Structural | Hub/leaf contract | `parent-skill-check.cjs` passes against the mcp-tooling hub |
| Stage one | Workflow-mode selection | Current-source router replay selects `mcp-orca-cli` for Orca prompts and defers negative holdouts; compiled front door remains legacy/stale |
| Stage two | Leaf resource selection | `ROUTER.md` resource map resolves the same Orca intent to packet-qualified references |
| Advisor | Metadata identity | `skill_advisor.py` returns mcp-tooling for explicit Orca prompts with negative boundary replays |
| Package | Leaf shape | `package_skill.py --check` exits successfully |
| Generated state | Manifest | Canonical regeneration followed by parent byte-drift and reachability checks |
| Manual safety | Mutation and browser boundaries | Playbook and benchmark record PASS for read-only checks and SKIP for unauthorized state-changing lanes |
| Spec | Packet completeness | Strict validator prints explicit `RESULT: PASSED` |

## 7. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Official Orca CLI/runtime | External | Green for authorized read-only preflight | `/usr/local/bin/orca` 1.4.205, schema, guide, references, and runtime status were observed. |
| Official Orca skill/docs repository | External | Green for source inventory | Source facts and versioned guide behavior are captured. |
| `sk-doc/sk-create-skill-parent` contract | Internal | Green | Defines required packet files and hub surfaces. |
| mcp-tooling hub metadata and router gates | Internal | Green | Parent, package, manifest, source route, advisor, and strict-spec checks pass. |
| Authorized credentials or disposable mutation targets | Operator-controlled | Yellow | Authentication, publishing, browser-driving, and repository mutation remain SKIP without authorization. |
| Compiled-routing activation | Operator-controlled runtime | Yellow | The current activation manifest is stale; no sync/finalize operation was performed. |
| DeepSeek V4.1 Flash through cli-pi | Internal/external | Green for bounded review | Review is supplemental evidence; local verification remains authoritative.

## 8. ROLLBACK PLAN

- **Trigger**: Any route capture, parent-skill failure, generated-manifest drift, unsafe mutation behavior, browser ownership collision, or unsupported command claim.
- **Procedure**: Stop Orca execution; remove the new leaf and revert the coordinated hub diff as one change; regenerate the prior manifest from the prior registry; rerun the parent-skill and route checks; preserve the evidence that caused the rollback.
- **No data reversal**: This work changes repository documentation and metadata only; the planning packet performs no external state mutation.

## 9. DEPENDENCY GRAPH

```text
Source inventory + local contract
              │
              ▼
      Leaf safety contract
              │
       ┌──────┴──────┐
       ▼             ▼
 Hub registry   Leaf docs/tests
       │             │
       ▼             ▼
 Both routing stages + graph identity
              │
              ▼
      Generated manifest + docs
              │
              ▼
       Full verification gate
```

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Source inventory | Official URLs and authorized CLI | Confirmed facts and UNKNOWN matrix | Leaf contract |
| Leaf contract | Source inventory and nested-packet rules | Packet files and safety boundary | Hub registration |
| Hub registration | Leaf identity and safety values | Registry and router updates | Manifest and route checks |
| Verification | All implementation surfaces | Evidence rows and handoff | Closure |

## 10. CRITICAL PATH

1. **Live evidence gate** — completed for read-only executable, guide, schema, browser-reference, and MCP-surface discovery; mutation and publishing probes remain operator-gated.
2. **Leaf contract and hub registration** — completed as one coordinated implementation sequence.
3. **Generated metadata and route/advisor proof** — completed against current source; compiled serving remains deferred until the activation manifest is refreshed.

**Total Critical Path**: Implementation integration complete; remaining work is operator-controlled mutation/manual safety and compiled runtime publication.

**Parallel Opportunities**:

- Source inventory and local convention review can proceed independently.
- Leaf documentation and hub prose updates can be drafted in parallel after the mode identity is fixed.
- Positive and negative routing fixtures can be prepared in parallel after aliases are selected.

## 11. MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Evidence ready | Live read-only command facts and explicit mutation/authorization matrix recorded | Complete |
| M2 | Leaf ready | Package check passes and safety boundary is documented | Complete |
| M3 | Hub ready | Parent-skill, source route, advisor, and manifest checks pass | Complete |
| M4 | Handoff ready | Playbook, benchmark, strict spec, diff, and comment checks pass; deferred gates are named | Complete with operator-gated follow-up |

## 12. DECISION RECORD POINTER

Architectural decisions and alternatives are recorded in `decision-record.md`. The current packet adopts the flat Level 3 shape and conservative evidence posture; backend and mutation values remain evidence-gated.

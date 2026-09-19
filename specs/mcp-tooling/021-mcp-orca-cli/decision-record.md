---
title: "Decision Record: Orca CLI mcp-tooling port"
description: "Architectural decisions that shape the Orca workflow packet, its evidence gates, and its hub integration."
trigger_phrases:
  - "Orca packet decision"
  - "flat Level 3 packet"
  - "evidence-gated Orca"
  - "Orca routing decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/021-mcp-orca-cli"
    last_updated_at: "2026-09-19T12:31:05Z"
    last_updated_by: "implementation-owner"
    recent_action: "Reconciled accepted decisions with delivered Orca integration"
    next_safe_action: "Obtain authorization for disposable mutation/publishing tests or compiled-route activation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-021-mcp-orca-cli"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which backend and mutation values does the authorized environment justify?"
    answered_questions:
      - "Use a flat Level 3 packet."
      - "Use an evidence-gated conservative posture."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- ANCHOR:decision-record -->
# Decision Record: Orca CLI mcp-tooling port

## ADR-001: Use a flat Level 3 planning packet

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-19 |
| **Deciders** | Operator and implementation owner |

### Context

The request spans an external CLI source, a new nested workflow packet, two hub routers, generated metadata, advisor discovery, safety boundaries, and several verification surfaces. A phase-parent tree would split decisions that need to stay aligned, while the operator explicitly selected a flat Level 3 packet.

### Constraints

- The packet must stay inside the mcp-tooling track and preserve existing member boundaries.
- The packet must be executable by a future implementation owner without relying on conversation-only facts.
- At decision time, the deliverable was the specification; implementation remained deferred until approval and authorized evidence.

### Decision

**We chose**: Keep one flat Level 3 packet at `specs/mcp-tooling/021-mcp-orca-cli`.

**How it works**: The packet keeps source evidence, the future file scope, routing surfaces, safety posture, task handoff, and acceptance rows together. It uses a deferred implementation section rather than creating child packets for work that has not been independently approved.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Flat Level 3 packet** | Keeps coupled routing and safety decisions together; matches the operator's choice | Larger document; future implementation still needs disciplined task ownership | 9/10 |
| Phase parent with Level 3 children | Separates workstreams and can isolate large implementation phases | Adds navigation and metadata coordination before the external CLI is understood | 6/10 |
| Modify the existing mcp-tooling packet | Fewer folders | Violates packet boundaries and obscures the new member's evidence | 2/10 |

**Why this one**: The work is large enough for Level 3 documentation but not yet large enough to justify a phase tree after the operator selected the flat shape.

### Consequences

**What improves**:

- All hub surfaces and safety decisions have one canonical planning location.
- The future maintainer can see which facts are confirmed and which require an authorized probe.

**What it costs**:

- The document must stay concise and keep implementation progress separate from specification closure. Mitigation: use the deferred handoff and acceptance gate explicitly.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Flat document becomes hard to scan | Medium | Keep the source, architecture, phases, verification, and decision sections structured and cross-linked. |
| Specification is mistaken for implementation completion | High | Keep specification closure distinct from delivered integration evidence and operator-gated runtime checks. |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The external CLI and hub integration have no existing packet. |
| 2 | **Beyond Local Maxima?** | PASS | The phase-parent and existing-packet alternatives were considered. |
| 3 | **Sufficient?** | PASS | One packet covers all coupled surfaces without adding children prematurely. |
| 4 | **Fits Goal?** | PASS | The packet directly prepares the requested port and defers implementation. |
| 5 | **Open Horizons?** | PASS | The structure can later hand off to implementation or be split if evidence expands the scope. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:

- Create the flat Level 3 specification packet and its evidence docs.
- At decision time, do not modify production skill or hub files until plan approval.

**How to roll back**: Remove the uncommitted specification directory if the operator rejects the packet shape; no production or external state is changed by this decision.

## ADR-002: Use an evidence-gated conservative runtime posture

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-19 |
| **Deciders** | Operator and implementation owner |

### Context

The official source is a discovery stub. It names the domains and guide-loading flow but delegates command flags and runtime behavior to the installed binary. Worktree, terminal, browser, authentication, and MCP behavior could be mutating or version-dependent.

### Decision

**We chose**: Treat the new member as a workflow packet, but keep backend, tool-surface, browser automation, credentials, and workspace mutation values evidence-gated.

**How it works**: The implementation runs the executable-resolution and version-matched guide preflight first. It records observed behavior, writes `UNKNOWN` for unavailable effects, and selects concrete registry metadata only where the authorized evidence supports it.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Evidence-gated conservative** | Avoids stale flags and unsafe assumptions; supports explicit handoff | Requires an authorized environment before implementation can close | 10/10 |
| Assume CLI-only and no workspace mutation | Fastest initial port | Could misclassify an arbitrary-command/worktree bridge and weaken safety | 3/10 |
| Freeze the broad source description as the full API | Quick documentation | Discovery stubs intentionally omit version-specific details | 4/10 |

**Why this one**: The cost of a delayed live probe is lower than the cost of publishing a stale or mutating integration as read-only.

### Consequences

**What improves**:

- The packet can progress without fabricating command syntax.
- Mutation and browser ownership remain explicit safety decisions.

**What it costs**:

- Live mutation, publishing, browser-driving, and credential behavior remain operator-gated even though the CLI-only packet and conservative metadata are now integrated. Mitigation: each remaining gate names the exact observation and authorization needed.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Environment never becomes available | High | Keep the packet valid with documented UNKNOWNs and do not claim implementation completion. |
| Read-only probe misses hidden mutation | High | Require a separately authorized controlled mutation probe before setting mutation metadata. |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The discovery stub and possible worktree/terminal mutation make evidence necessary. |
| 2 | **Beyond Local Maxima?** | PASS | Assumption-based CLI-only and broad-source approaches were rejected. |
| 3 | **Sufficient?** | PASS | The posture defines preflight, unknown handling, and a verification handoff. |
| 4 | **Fits Goal?** | PASS | It prepares the requested port without exceeding the approved planning scope. |
| 5 | **Open Horizons?** | PASS | It can incorporate a verified MCP backend or mutation result later. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:

- Add preflight, unknown, and explicit mutation-gate sections to the future leaf packet.
- Choose concrete backend/tool-surface fields only after observing the authorized runtime.

**How to roll back**: Remove any unverified command or capability claim, restore the field to `UNKNOWN`, and rerun the packet and hub checks before continuing.

## ADR-003: Use one metadata advisor identity with narrow routing aliases

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-19 |
| **Deciders** | Operator and implementation owner |

### Context

The mcp-tooling hub is one advisor identity with workflow-mode selection. The local nested-packet contract requires a `metadata` advisor-routing class to be carried across the mode registry and hub graph vocabulary, while broad aliases can capture unrelated `OpenOrca` prompts.

### Decision

**We chose**: Add Orca vocabulary to the existing hub graph identity and use narrow multi-word aliases such as `orca cli`, `orca worktree`, and `orca skills`; do not add a second nested advisor identity.

**How it works**: The implementation uses stage-one signals and stage-two intent keys with the same Orca-specific vocabulary. The graph metadata carries the union needed for advisor discovery. Positive and negative replays are recorded in the integration benchmark, while generic browser, Git, and OpenOrca holdouts remain outside the packet.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Existing hub identity + narrow aliases** | Matches hub architecture and reduces false positives | Requires coordinated vocabulary updates | 10/10 |
| New nested advisor identity | Can isolate vocabulary | Violates the hub's one-identity boundary and duplicates projection work | 2/10 |
| Bare `orca` alias | Short and discoverable | Risks unrelated OpenOrca capture | 3/10 |

**Why this one**: It follows the local hub contract and limits the routing blast radius.

### Consequences

**What improves**:

- The system advisor and hub router see the same identity.
- Negative replay can demonstrate that the new member does not steal unrelated traffic.

**What it costs**:

- Users must mention an Orca-specific multi-word phrase. Mitigation: cover the official trigger phrases in the leaf description and documentation while keeping router aliases narrow.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The hub requires one advisor identity and alias replay is a required safety gate. |
| 2 | **Beyond Local Maxima?** | PASS | Nested identity and bare alias alternatives were rejected with local evidence. |
| 3 | **Sufficient?** | PASS | The decision covers registry, routers, graph metadata, and negative holdouts. |
| 4 | **Fits Goal?** | PASS | It integrates the requested parent and system advisor without changing global scoring. |
| 5 | **Open Horizons?** | PASS | Additional official Orca skills can be separate members later. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:

- The delivered mode registry carries the metadata routing class and narrow aliases.
- The delivered graph vocabulary and benchmark contain positive and negative replay evidence.

**How to roll back**: Remove the Orca registry and graph entries, regenerate the manifest, and rerun both routing layers if any alias captures out-of-domain traffic.
## Current Implementation Addendum (2026-09-19)

Authorized live preflight and source integration supersede the planning-time implementation deferral without changing the accepted architectural decisions:

- `/usr/local/bin/orca` 1.4.205 is available; `agent-context --json` reports 234 commands, and the installed registry exposes no native Orca MCP command.
- The CLI-only `mcp-orca-cli` leaf, ten-mode mcp-tooling registry/router/graph/docs, regenerated manifest, playbook, benchmark evidence, and changelogs are delivered and pass their structural/package gates.
- Repository mutation, publishing, authentication, disposable browser/terminal driving, and compiled-route sync/finalize remain explicitly unperformed or deferred.
- The current compiled status is legacy authority with `stale-manifest`; no compiled-serving result is asserted.

<!-- /ANCHOR:decision-record -->

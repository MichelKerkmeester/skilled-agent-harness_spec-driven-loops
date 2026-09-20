---
title: "Feature Specification: Reconstruct the sk-design Open Design transport mode"
description: "Best-effort Level-2 reconstruction of the shipped design-mcp-open-design transport contract, including od CLI and MCP wiring, routing, guarded reads and writes, mandatory sk-design pairing, and multi-turn runs."
trigger_phrases:
  - "sk-design Open Design transport reconstruction"
  - "design-mcp-open-design source packet"
  - "Open Design CLI MCP transport"
  - "od daemon wiring and gated runs"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/006-design-mcp-open-design"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Read transport source and references"
    next_safe_action: "Review packet against shipped source"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-mcp-open-design/SKILL.md"
      - ".opencode/skills/sk-design/design-mcp-open-design/references/"
      - ".opencode/skills/sk-design/design-mcp-open-design/scripts/"
      - ".opencode/skills/sk-design/design-mcp-open-design/mcp-servers/"
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/specs/sk-design/006-design-mcp-open-design/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-open-design-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Reconstruct the sk-design Open Design transport mode
<!-- SPECKIT_LEVEL: 2 -->

> RECONSTRUCTION DRAFT (best-effort). This spec did not previously exist in git or memory; it is reconstructed from the intact source .opencode/skills/sk-design/design-mcp-open-design/SKILL.md and its references/, scripts/, and mcp-servers/. Verify against that source before treating any line as authoritative.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-16 |
| **Branch** | 0055-skilled-migration-000-scaffold |
| **Spec Folder** | 006-design-mcp-open-design |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shipped `design-mcp-open-design` transport mode had no packet in git or memory. Its intact source defines how an agent wires and drives the installed Open Design desktop app through the `od` CLI and stdio MCP server, while keeping design judgment in `sk-design` and gating design-affecting operations.

### Purpose
Reconstruct a Level-2 packet that makes the source-defined transport, routing, safety, multi-turn run, and handoff contracts inspectable without adding behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The mode identity from `mode-registry.json`: `packetKind: transport`, `backendKind: od-cli-transport`, metadata routing, `Read`/`Bash` allowance, forbidden `Write`/`Edit`/`Task`, and `mutatesWorkspace: false` for this repository.
- Open Design terminology, the bundled `od` CLI location, the desktop-hosted local daemon, socket discovery, ephemeral HTTP ports, and the distinction from the unrelated PATH `od` tool and `vela`.
- WIRE, READ, and RUN intent routing; baseline and conditional reference loading; the unknown-intent fallback; and the mandatory `sk-design` ground -> token-system -> critique pairing for design work.
- Native MCP dry-run wiring, this repository's Code Mode `.utcp_config.json` integration point, live tool-surface verification, and the read-only diagnostics/install script boundaries.
- Pure-transport reads, design-feeding reads, mutating and destructive operations, explicit target and rollback requirements, and the `openDesignExemption` versus `skDesignGate` purpose model.
- The multi-turn generation flow from `start_run` through discovery-form answers, build completion, `entryFile`, `previewUrl`, `get_run`, and `get_artifact`, including the artifact-file distinction.
- The guarded-proxy, freshness, inner-generator binding, CLI child pairing, transport assertion, token-laundering, register acceptance, and named-residual contracts stated by the references.
- Source and traceability evidence for the intact `SKILL.md`, references, scripts, server pointer, and mode registry.

### Out of Scope
- Choosing the visual direction, design system, tokens, components, or anti-default critique; the source assigns design judgment to `sk-design`.
- Modifying the Open Design desktop app, bundled daemon, MCP server, agent configuration, external project, run, artifact, or preview.
- Implementing a guarded proxy, proof-token validator, child result contract, or daemon-side interceptor; the references specify contracts and boundaries, not a running implementation.
- Caching or vendoring Open Design `DESIGN.md`, `tokens.css`, `components.html`, generated files, or other live content into this repository.
- Claiming live daemon, `tools/list`, generation, auth, port, or downstream runtime verification that was not performed for this reconstruction.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/specs/sk-design/006-design-mcp-open-design/spec.md | Create | Level-2 reconstruction specification for the transport mode. |
| .opencode/specs/sk-design/006-design-mcp-open-design/plan.md | Create | Source-faithful reconstruction plan and boundaries. |
| .opencode/specs/sk-design/006-design-mcp-open-design/tasks.md | Create | Packet authoring and manual verification task breakdown. |
| .opencode/specs/sk-design/006-design-mcp-open-design/checklist.md | Create | Level-2 source-fidelity and structure checklist. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve the transport boundary and mode identity. | The packet states that Open Design generates while `sk-design` decides, records `packetKind: transport` and `backendKind: od-cli-transport`, and does not assign taste behavior to the transport. |
| REQ-002 | Preserve the CLI and daemon model. | The packet records the bundled `daemon-cli.mjs` invocation, the absence of a global `od`, the desktop-hosted daemon, socket discovery, ephemeral HTTP port, and `7456` only as the standalone fallback. |
| REQ-003 | Preserve WIRE, READ, and RUN routing. | The packet records direction scoring, baseline `od_cli_reference.md`, conditional wiring/tool-surface resources, guarded resource discovery, and the explicit unknown fallback checklist. |
| REQ-004 | Preserve mandatory design pairing. | The packet states that every generation and every design-feeding read loads `sk-design` and runs ground -> token-system -> critique before shaping briefs or answers; only positively asserted pure transport is exempt. |
| REQ-005 | Preserve the Open Design surface contract. | The packet distinguishes pure inventory reads, design-feeding reads, mutating tools, destructive tools, and the requirement to verify the live `tools/list` before relying on names or mutability. |
| REQ-006 | Preserve the gated multi-turn run. | The packet states that turn 1 returns a discovery form with `awaiting_input` and zero files, that answering it fires the build, and that completion requires written files, `entryFile`, and `previewUrl`; `artifacts create` is only a file add. |
| REQ-007 | Preserve source traceability and reconstruction status. | The packet carries the reconstruction banner, cites the real source paths, stays Draft, and does not claim runtime execution or generated metadata. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Preserve wiring behavior. | The packet records `mcp install <agent> --print --json` as the required preview, the native opencode/Claude shapes at a high level, Code Mode as this repository's canonical `open_design` manual, and the daemon URL discovery order. |
| REQ-009 | Preserve guarded-proxy semantics. | The packet records canonical request normalization, `openDesignPurpose`, explicit targets, `DESIGN_PROOF_TOKEN` delegation, positive exemptions, fail-closed classification, and the agent-side daemon-bypass residual. |
| REQ-010 | Preserve freshness and inner-generator binding. | The packet records stale, future, malformed, excessive-span, replay, and payload-mismatch rejection at the appropriate boundary, plus same-token digest recomputation for subject, brief, form answers, lineage, and pinned model across both turns. |
| REQ-011 | Preserve cross-CLI evidence contracts. | The packet records structured `OPEN_DESIGN_TRANSPORT_RESULT v1` and assertion pairing, parent demand-back re-validation, REPLAY/OMIT/WEAKEN denial, text-only advisory limits, and the register acceptance gate. |
| REQ-012 | Preserve script and server-pointer boundaries. | The packet records that `_common.sh`, `doctor.sh`, and `install.sh` locate or report on local readiness, never start or wire the daemon, and that the server directory contains a pointer rather than an installable package. |
| REQ-013 | Preserve source-stated residuals and uncertainties. | The packet identifies per-machine `OD_DATA_DIR`, remote-installer contents, app-quit lifecycle, standalone headless flow, per-verb auth, live-artifact surface, and daemon-down install fallback as unresolved or inferred where the references do. |

The source classifies the registered MCP surface as eleven read-only tools (`list_projects`, `get_active_context`, `get_artifact`, `get_project`, `get_file`, `search_files`, `list_files`, `list_skills`, `list_plugins`, `list_agents`, `get_run`), five mutating tools (`create_artifact`, `write_file`, `create_project`, `start_run`, `cancel_run`), and two destructive tools (`delete_file`, `delete_project`). The two-axis guard marks a call guarded when it feeds a design decision or mutates workspace state; the five pure inventory tools are the exempt complement, subject to the positive exemption purpose.

For native wiring, the source's dry-run examples are `node "$OD_BIN" mcp install opencode --print --json` and `node "$OD_BIN" mcp install claude --print --json`. The exact launch command and environment come from `GET /api/mcp/install-info`; this repository's canonical integration is the existing Code Mode `open_design` manual rather than a redundant native opencode entry.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The packet describes `design-mcp-open-design` as a terminal transport and keeps visual judgment with `sk-design`.
- **SC-002**: The packet captures the WIRE/READ/RUN router, CLI/daemon model, Code Mode wiring boundary, live tool verification, and two-axis gate.
- **SC-003**: The packet records the confirmed multi-turn generation lifecycle and does not present turn 1 or an artifact file add as a finished rendered design.
- **SC-004**: The packet preserves deny-by-default guarded-proxy, freshness, inner-payload, and child-revalidation rules without defining a second token schema.
- **SC-005**: Every source claim can be traced to the intact skill, mode registry, references, scripts, or server pointer listed in Sources / Traceability.
- **SC-006**: The packet remains an explicit reconstruction draft and makes unverified live behavior visible rather than silently resolving it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Open Design v0.9.0+ desktop app, Node.js, and the target agent CLI. | The daemon and native wiring surface are unavailable without the stated local prerequisites. | Preserve the source prerequisite and the app-running escalation. |
| Dependency | The repository's Code Mode `open_design` manual and live daemon install information. | Native `od mcp install` is not this repository's intended integration point, and exact environment values are daemon-provided. | Record Code Mode as canonical and require dry-run inspection for native wiring. |
| Dependency | Shared `DESIGN_PROOF_TOKEN`, register, and adapter contracts cited by the references. | Their full schemas are outside this transport source set. | Cite them by reference and document only the boundary responsibilities stated here. |
| Risk | The help text undercounts the live MCP surface and tool classes can drift. | A stale name or read-only assumption could bypass a gate. | Require live `tools/list` verification and guard unknown operations. |
| Risk | Open Design writes happen in an external project while this packet is non-mutating. | A reconstruction could falsely imply repository-local mutation or runtime control. | Keep `mutatesWorkspace: false`, external-write boundaries, targets, rollback notes, and residuals explicit. |
| Risk | Generated files can be overwritten by reruns and the preview may render without meeting the design quality bar. | Treating a render or generated file as the final design would overclaim success. | Keep the generated-versus-presentational boundary and `sk-design` quality judgment separate. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime benchmark is specified for this transport packet.
- **NFR-P02**: The desktop daemon's HTTP port is ephemeral; a long-running MCP server caches its resolved URL and needs a client restart after a daemon restart.

### Security
- **NFR-S01**: Guarded operations deny by default; missing, ambiguous, stale, unmapped, or validator-error paths fail closed.
- **NFR-S02**: The remote installer is unverified and must not be piped to a shell; credentials must not be pasted into prompts.

### Reliability
- **NFR-R01**: A run left at `awaiting_input` is incomplete and produces no design; the discovery form must be answered before polling for a completed build.
- **NFR-R02**: Pure transport exemptions forbid later use of the returned artifact as design-decision input, and unknown operations remain guarded.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Unknown or tied intent: use the source fallback checklist, confirm WIRE/READ/RUN direction, confirm the app and daemon, locate the CLI, and confirm writes and target project when relevant.
- Pure inventory versus design content: `list_projects`, `list_files`, `list_skills`, `list_plugins`, and `list_agents` are pure transport; context, project, artifact, run, file, and search content are guarded when they feed design decisions.
- Missing or changed resource: resolve only markdown inside the skill root, load the baseline resource, and load direction-specific resources only when present.
- Active-project fallback: read operations may fall back to the active project, which expires after roughly five minutes of inactivity; destructive operations require an explicit project and confirmation.

### Error Scenarios
- App or socket unavailable: live tool calls fail; escalate to opening the app or use the source-stated standalone `od --no-open` option.
- Native wiring requested: preview with `--print --json`, inspect the daemon-provided command and environment, then install only after confirmation; this repository's canonical path remains Code Mode.
- Mutating or destructive request: name the target, state the effect and one-line rollback, and wait for approval; deletion also requires `confirm:true`.
- Auth error: local reads may work without cloud auth, while generation, media, research, or plugin publishing may need `vela` login or configured providers; do not paste credentials.
- Design parity read or run: resolve one matching system, read its `DESIGN.md`, `tokens.css`, and optional `components.html` live, reuse before generating, route revisions through the run conversation, and inspect the local `previewUrl`; a stalled build may be adjusted and retried at most twice before surfacing failure.
- Discovery defaults: `--skip` or a blanket recommended-default response must materialize concrete form answers when the inner-generator binding requires a digestable answer object; otherwise the guarded boundary denies the build fire.
- Text-only child result: digest matching becomes advisory and cannot be called a deterministic pass without structured result evidence.

### State Transitions
- `WIRE`: locate and verify the CLI, inspect install output, and verify the live MCP surface.
- `READ`: inventory may use `openDesignExemption`; design-bearing reads require `skDesignGate` and the `sk-design` judgment path.
- `RUN`: confirmed turn 1 -> discovery form -> confirmed form response or conversation follow-up -> build -> guarded polling and artifact fetch.
- Child handoff: structured assertion before the operation and structured result after it are reconciled by the parent; missing or mismatched evidence denies the handoff.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Transport identity, routing, wiring, tool gates, multi-turn runs, scripts, and cross-CLI contracts. |
| Risk | 15/25 | External writes, design-gate bypasses, live surface drift, and several named residuals. |
| Research | 17/20 | Reconstruction requires the full skill, nine references, three scripts, server pointer, and registry entry. |
| **Total** | **52/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- What exact `OD_DATA_DIR` does the live daemon dry-run provide on a given machine?
- What does the unshipped remote installer script do, and does the app-owned daemon always die when the desktop app quits?
- Does standalone `od --no-open` support the complete MCP and generation flow when the GUI is closed?
- Which user-invoked verbs require `OD_TOOL_TOKEN` or `vela` authentication, and what is the live `od mcp live-artifacts` surface?
- Does `od mcp install` produce the documented `7456` fallback entry when the daemon is down?
<!-- /ANCHOR:questions -->

---

## 11. SOURCES / TRACEABILITY

The following intact paths were read as reconstruction evidence. They are source references, not additional behavior:

- .opencode/skills/sk-design/mode-registry.json
- .opencode/skills/sk-design/design-mcp-open-design/SKILL.md
- .opencode/skills/sk-design/design-mcp-open-design/references/design_parity_transport.md
- .opencode/skills/sk-design/design-mcp-open-design/references/mcp_wiring.md
- .opencode/skills/sk-design/design-mcp-open-design/references/tool_surface.md
- .opencode/skills/sk-design/design-mcp-open-design/references/freshness_invalidation.md
- .opencode/skills/sk-design/design-mcp-open-design/references/guarded_proxy.md
- .opencode/skills/sk-design/design-mcp-open-design/references/cli_child_pairing.md
- .opencode/skills/sk-design/design-mcp-open-design/references/smart_router_pseudocode.md
- .opencode/skills/sk-design/design-mcp-open-design/references/inner_generator_binding.md
- .opencode/skills/sk-design/design-mcp-open-design/references/od_cli_reference.md
- .opencode/skills/sk-design/design-mcp-open-design/scripts/_common.sh
- .opencode/skills/sk-design/design-mcp-open-design/scripts/doctor.sh
- .opencode/skills/sk-design/design-mcp-open-design/scripts/install.sh
- .opencode/skills/sk-design/design-mcp-open-design/mcp-servers/open-design/README.md

The advanced references cite shared proof-token and register material. This packet preserves those references and their boundary responsibilities without reconstructing a second schema or claiming details absent from the transport source set.

---

## RELATED DOCUMENTS

- Implementation Plan: See plan.md
- Task Breakdown: See tasks.md
- Verification Checklist: See checklist.md

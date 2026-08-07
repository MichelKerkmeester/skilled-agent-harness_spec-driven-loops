---
title: "Implementation Plan: Reconstruct the sk-design Open Design transport mode"
description: "Source-first plan for documenting the shipped Open Design CLI and MCP transport without executing the external app, changing runtime sources, or inventing behavior."
trigger_phrases:
  - "Open Design transport reconstruction plan"
  - "od CLI MCP wiring plan"
  - "design-mcp-open-design workflow"
  - "guarded Open Design run plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/006-design-mcp-open-design"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Read source templates and exemplar"
    next_safe_action: "Check plan against packet scope"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Reconstruct the sk-design Open Design transport mode
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown with YAML frontmatter |
| **Framework** | System Spec Kit Level-2 manifest structure |
| **Storage** | None; this packet documents an existing transport skill |
| **Testing** | Source comparison and manual structural checks only |

### Overview
Read the intact transport source, all nine references, three scripts, server pointer, mode registry, required templates, and validated sibling packet before drafting. Record the external Open Design CLI/MCP contract, sk-design pairing, gated tool surface, and multi-turn lifecycle in the four packet files without executing the app or claiming live verification.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The source of truth is fixed to `design-mcp-open-design/SKILL.md`, its `references/`, `scripts/`, and `mcp-servers/` paths, plus the mode-registry entry.
- [x] The target packet path and four-file scope are pre-approved.
- [x] The Level-2 templates and validated Level-2 reference packet have been read.

### Definition of Done
- [ ] All four files carry the required frontmatter, continuity fields, Level-2 markers, and source-specific content.
- [ ] `spec.md` contains the exact reconstruction banner, required Spec Folder metadata row, and Sources / Traceability section.
- [ ] Every template anchor pair is balanced and the packet contains no generated metadata files.
- [ ] The packet does not claim daemon execution, live `tools/list` verification, generation, validator, generator, Node/npm, or git results.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source-faithful Level-2 reconstruction of an external CLI/MCP transport.

### Key Components
- **Mode identity**: `packetKind: transport`, `backendKind: od-cli-transport`, metadata routing, and no local workspace mutation.
- **Smart router**: score WIRE, READ, or RUN, load the baseline CLI reference, add direction-specific resources, and enforce purpose classification.
- **Daemon adapter**: invoke the bundled `daemon-cli.mjs`, resolve the desktop daemon through the Unix socket, and rediscover the ephemeral HTTP endpoint.
- **Surface gate**: distinguish pure transport from design-feeding reads and writes, requiring `openDesignExemption` or `skDesignGate` as the source states.
- **Run lifecycle**: confirm the target, start turn 1, answer the discovery form, poll the build, fetch artifacts, and inspect the local preview.
- **Evidence contracts**: preserve freshness, inner-payload, transport-result, assertion, parent demand-back, and register rules by reference.

### Data Flow
The request is classified as WIRE, READ, or RUN. The router loads `od_cli_reference.md` and any matching conditional resource. The adapter normalizes surface, operation class, purpose, target, and payload inputs. Pure inventory may pass only with the stated exemption; design-feeding reads and mutations cross the guarded boundary. A confirmed run remains incomplete until the discovery form is answered and the build produces files, an entry point, and a preview URL.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| .opencode/skills/sk-design/design-mcp-open-design/SKILL.md | Shipped transport contract | Unchanged; source of truth | Compare every packet claim with its sections and success criteria. |
| .opencode/skills/sk-design/design-mcp-open-design/references/ | Routing, wiring, surface, gate, freshness, pairing, and CLI contracts | Unchanged; cited evidence | Confirm each cited path is real and claims stay within its stated boundary. |
| .opencode/skills/sk-design/design-mcp-open-design/scripts/ | Local readiness and diagnostics helpers | Unchanged; cited evidence | Preserve report-only and no-wiring/no-daemon-start behavior. |
| .opencode/skills/sk-design/design-mcp-open-design/mcp-servers/open-design/ | Pointer to the app-shipped CLI and MCP server | Unchanged; cited evidence | Do not describe it as an npm package or vendored server. |
| .opencode/skills/sk-design/mode-registry.json | Mode discriminator and tool-surface metadata | Unchanged; identity evidence | Preserve transport, backend, allowed tools, and non-local-mutation values. |
| .opencode/specs/sk-design/006-design-mcp-open-design/ | Reconstruction packet | Create exactly four documents | Inspect frontmatter, anchors, banner, traceability, and file list manually. |

Required inventories:
- Same-class producers: not applicable; no runtime producer or policy is changed.
- Consumers of changed symbols: not applicable; no source symbol, API field, or implementation token is changed.
- Matrix axes: direction, resource level, purpose, mutation class, target binding, run turn, evidence contract, and residual state.
- Algorithm invariant: no packet statement may expand behavior beyond the intact source; unknown operations and purposes remain guarded, and turn 1 is never represented as a finished design.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read the complete `design-mcp-open-design/SKILL.md`.
- [ ] Read every reference file, script, and server pointer in the requested source scope.
- [ ] Read `mode-registry.json`, all four Level-2 templates, and the validated Level-2 exemplar.
- [ ] Record mode identity, routing, daemon model, surface classes, pairing, run lifecycle, and named residuals.

### Phase 2: Core Implementation
- [ ] Author `spec.md` with the reconstruction banner, metadata row, source-faithful contract, edge cases, and traceability.
- [ ] Author `plan.md` with source-first architecture, affected surfaces, phases, testing, dependencies, and rollback.
- [ ] Author `tasks.md` with bounded setup, authoring, and manual verification tasks.
- [ ] Author `checklist.md` with Level-2 source-fidelity, safety, structure, and file-organization checks.

### Phase 3: Verification
- [ ] Inspect all frontmatter for required keys, exactly four triggers, and the compact continuity block.
- [ ] Inspect the banner, required metadata row, markers, anchors, tables, and markdown structure.
- [ ] Confirm only the four requested files exist in the target folder and no generated metadata was created.
- [ ] Confirm no claim says the external app, daemon, live tool list, generator, validator, Node/npm, or git was run.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Source fidelity | Mode identity, router, daemon, wiring, gates, run flow, scripts, and residuals | Read and manual comparison |
| Resource traceability | All nine references, three scripts, server pointer, and registry entry cited by the packet | Read and path inspection |
| Packet structure | Frontmatter, Level-2 markers, metadata table, anchors, and markdown tables | Read, `rg`, and manual inspection |
| Safety boundary | No generated metadata, runtime mutation, source edit, or unsupported claim | File listing and manual inspection |
| Runtime behavior | Not executed by this reconstruction | None; live checks remain an external follow-up |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Intact `design-mcp-open-design/SKILL.md` | Internal source | Available | The packet cannot state the mode contract without it. |
| Nine transport references | Internal source | Available | Routing, gates, freshness, child pairing, and CLI details would be incomplete. |
| Three scripts and server README | Internal source | Available | Installation and read-only diagnostic boundaries would be incomplete. |
| `sk-design/mode-registry.json` | Internal source | Available | Packet kind, backend, tool surface, and routing identity would be ungrounded. |
| Level-2 templates and validated sibling packet | Internal format | Available | Anchor and depth conformity would be less directly calibrated. |
| Shared proof-token and register contracts named by references | Sibling source | Referenced, not redefined | Keep the packet limited to transport-side responsibilities and citations. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Source comparison finds unsupported behavior, a required structural constraint fails, or the reconstruction is rejected.
- **Procedure**: Remove only the four newly authored documents under the target packet and leave the intact skill, references, scripts, server pointer, registry, and shared files unchanged.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Source and template review ──► Contract mapping ──► Packet authoring ──► Manual structure inspection

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Source and template review | None | Contract mapping |
| Contract mapping | Source and template review | Packet authoring |
| Packet authoring | Contract mapping | Manual structure inspection |
| Manual structure inspection | Packet authoring | Any source-faithful packet-use claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Source and template review | High | One complete reading pass |
| Contract mapping | High | One bounded synthesis pass |
| Packet authoring | Medium | One four-file drafting pass |
| Manual structure inspection | Low | One read-only inspection pass |
| **Total** | | **Four bounded passes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No external app, daemon, MCP client, agent configuration, project, run, or artifact is changed by this packet.
- [ ] The target packet contains only `spec.md`, `plan.md`, `tasks.md`, and `checklist.md`.
- [ ] The reconstruction banner and source paths remain explicit.

### Rollback Procedure
1. Stop treating the packet as authoritative if comparison with the intact source finds drift.
2. Remove the four packet documents only if the reconstruction must be withdrawn.
3. Re-read the source and required templates before recreating the packet.
4. Keep `description.json` and `graph-metadata.json` absent until the orchestrator handles them.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A; this packet creates documentation only.
<!-- /ANCHOR:enhanced-rollback -->

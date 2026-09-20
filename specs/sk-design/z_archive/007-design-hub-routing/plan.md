---
title: "Implementation Plan: Reconstruct the sk-design hub routing layer"
description: "This plan turns the intact sk-design hub, mode registry, and router policy into a Level-2 reconstruction packet. The approach is source-first, documentation-only, and limited to the four requested packet documents, with no runtime routing or child-mode execution claimed."
trigger_phrases:
  - "hub routing reconstruction plan"
  - "sk-design mode registry plan"
  - "design router signal plan"
  - "single advisor identity plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/007-design-hub-routing"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Drafted hub routing reconstruction plan"
    next_safe_action: "Review plan against intact hub sources"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/specs/sk-design/007-design-hub-routing/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-hub-routing-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Reconstruct the sk-design hub routing layer
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown with YAML frontmatter and JSON source contracts |
| **Framework** | System Spec Kit Level-2 manifest structure |
| **Storage** | None; this packet documents an existing skill hub |
| **Testing** | Source comparison and manual structural inspection only |

### Overview
Read the intact hub `SKILL.md`, `mode-registry.json`, and `hub-router.json`, then express their one-identity routing model, six mode discriminators, policy, signals, vocabulary, fallback, and proof boundaries across the four packet documents. Keep the child mode logic and shared resource contents behind their source-defined paths, and do not execute the router, advisor, transport, or extraction backend.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The source of truth is fixed to the three intact sk-design hub files.
- [x] The target packet path and four-file scope are pre-approved.
- [x] The Level-2 templates and validated Level-2 reference packet have been read.

### Definition of Done
- [ ] All four files carry the required frontmatter, continuity fields, Level-2 markers, and source-specific content.
- [ ] spec.md contains the reconstruction banner, exact Spec Folder metadata row, registry table, and Sources / Traceability section.
- [ ] The packet records all six modes, hub policy, router signals, vocabulary classes, fallback, and hub boundaries without child-mode invention.
- [ ] Every template anchor is balanced and the packet contains no generated metadata files.
- [ ] The packet does not claim validator, generator, router, advisor, transport, or child-mode execution results.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source-faithful Level-2 reconstruction of a registry-driven routing hub.

### Key Components
- **Advisor identity**: the advisor routes design queries to the single public identity `sk-design`; hub membership resolves the mode.
- **Mode registry**: `mode-registry.json` is the single source of truth for `workflowMode`, `packetKind`, `backendKind`, packet paths, commands, aliases, tool surfaces, mutability, and `advisorRouting`.
- **Transform extension**: `transformVerbRouting` separates interface application framing from audit evaluation framing and carries the source-defined carve-outs.
- **Router policy**: `hub-router.json` defines default mode, ambiguity handling, tie-break order, outcomes, default resources, and the interface-plus-foundations build bundle.
- **Signals and vocabulary**: signal groups point to child packets, while vocabulary classes provide routing evidence for each mode and for hub identity.
- **Hub manager gates**: intake precedes route declaration, visible planning precedes substantial work, proof precedes ready claims, and transports remain paired with design judgment.

### Data Flow
The hub receives a design request, gathers goal, surface, inputs, constraints, and proof expectations, classifies the dominant design axis, reads the registry, and resolves one mode or an ordered bundle. Low-confidence, missing-registry, unknown-mode, or missing-packet conditions use the source fallback. The selected packet owns detailed design judgment; the hub keeps routing, proof expectations, and handoff boundaries visible.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-design/SKILL.md` | Hub behavior, manager gates, boundaries, and integration points | Unchanged; source of truth | Compare packet claims with the source sections. |
| `.opencode/skills/sk-design/mode-registry.json` | Discriminator, six mode entries, advisor projection, and transform extension | Unchanged; source of truth | Compare every registry field summarized in spec.md. |
| `.opencode/skills/sk-design/hub-router.json` | Policy, signals, vocabulary classes, resources, and build bundle | Unchanged; source of truth | Compare policy values, signal groups, and vocabulary class names and terms. |
| Child mode packets and shared resources | Routed resources and mode-owned logic | Unchanged; not redefined here | Confirm only real paths named by the hub are cited. |
| `.opencode/specs/sk-design/007-design-hub-routing/` | Reconstruction packet | Create exactly spec.md, plan.md, tasks.md, and checklist.md | Inspect file list, frontmatter, markers, anchors, and source traceability. |

Required inventories:
- Same-class producers: not applicable; this is documentation reconstruction and does not change routing producers.
- Consumers of changed symbols: not applicable; no source symbol, API field, or tool surface is changed.
- Matrix axes: advisor identity, discriminator, six modes, transform verbs, policy outcomes, signal classes, vocabulary classes, fallback, proof, and boundaries.
- Algorithm invariant: no packet statement may expand the hub beyond the three intact source files; the advisor identity remains singular and child packet logic remains external to the hub.
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read the complete `.opencode/skills/sk-design/SKILL.md`.
- [ ] Read the complete `.opencode/skills/sk-design/mode-registry.json`.
- [ ] Read the complete `.opencode/skills/sk-design/hub-router.json`.
- [ ] Read the four Level-2 manifest templates and the validated Level-2 reference packet.
- [ ] Record the source-defined child packet, shared resource, and build-bundle paths used for traceability.

### Phase 2: Core Implementation
- [ ] Author spec.md with the banner, metadata row, one-identity contract, six-mode registry, router policy, signals, vocabulary, fallback, and traceability.
- [ ] Author plan.md with source-first architecture, affected surfaces, bounded phases, testing strategy, dependencies, and rollback.
- [ ] Author tasks.md with setup, hub-contract authoring, and structural source-fidelity checks.
- [ ] Author checklist.md with Level-2 protocol, source checks, non-runtime boundaries, and summary.

### Phase 3: Verification
- [ ] Inspect all frontmatter for the required fields, exactly four trigger phrases, and the complete continuity block.
- [ ] Inspect registry and router summaries against the three intact source files.
- [ ] Confirm every required template anchor has one matching close and markdown remains well formed.
- [ ] Confirm only the four requested files exist under the target packet and generated metadata is absent.
- [ ] Confirm no claim says that a validator, generator, router, advisor, transport, or child mode was executed.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Source fidelity | Identity, discriminator, mode entries, transform routing, rules, boundaries, and success criteria | Read and manual comparison |
| Registry coverage | Six modes, commands, packet paths, packet kinds, backends, tool surfaces, aliases, and advisor routing | Read and Grep |
| Router coverage | Policy values, signal groups, resources, vocabulary classes, and UI build bundle | Read and manual comparison |
| Traceability | Shared resources, child packet paths, and build-bundle asset/reference paths cited in spec.md | Glob and manual path inspection |
| Packet structure | Frontmatter, Level-2 markers, metadata table, reconstruction banner, and balanced anchors | Read, Grep, and manual inspection |
| Runtime behavior | Not executed by this reconstruction | None; runtime checks remain downstream |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Intact `SKILL.md` | Internal source | Available | Hub manager gates and family boundaries would be incomplete. |
| Intact `mode-registry.json` | Internal source | Available | The one-identity projection, discriminator, six modes, and transform extension could not be reconstructed. |
| Intact `hub-router.json` | Internal source | Available | Policy, signals, vocabulary classes, resources, and bundle behavior would be incomplete. |
| Level-2 manifest templates | Internal format | Available | Missing markers or anchors would make the packet non-conformant. |
| Validated Level-2 reference packet | Internal example | Available | Structure and depth would be less directly calibrated. |
| Child mode and shared resource paths | Routed sibling sources | Available | The packet can cite real paths but must not claim their contents from this hub reconstruction. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A source comparison finds unsupported routing behavior, a required structural constraint fails, or the reconstruction is rejected.
- **Procedure**: Remove only the four newly authored packet files under `.opencode/specs/sk-design/007-design-hub-routing/`; leave the intact skill source, registry, router, child packets, and shared resources unchanged.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Source and template review ──► Hub contract extraction ──► Packet authoring ──► Structural and source-fidelity inspection

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Source and template review | None | Hub contract extraction |
| Hub contract extraction | Source and template review | Packet authoring |
| Packet authoring | Hub contract extraction | Structural inspection |
| Structural inspection | Packet authoring | Any later packet-use claim |
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Source and template review | Medium | One complete reading pass |
| Hub contract extraction | Medium | One registry and router comparison pass |
| Packet authoring | Medium | One four-file drafting pass |
| Structural inspection | Low | One manual marker and path inspection pass |
| **Total** | | **Four bounded passes** |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No deployment, runtime change, data migration, or skill-source edit is in scope.
- [ ] The target packet contains only the four requested documents.
- [ ] The reconstruction banner and source traceability remain explicit.
- [ ] Child mode logic and shared resource contents remain outside this packet.

### Rollback Procedure
1. Stop treating the packet as authoritative if comparison finds source drift.
2. Remove only the four packet documents if the reconstruction must be withdrawn.
3. Re-read the three intact hub sources and templates before recreating packet content.
4. Keep generated metadata absent until the orchestrator handles it after acceptance.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A; this packet creates documentation only.
<!-- /ANCHOR:enhanced-rollback -->

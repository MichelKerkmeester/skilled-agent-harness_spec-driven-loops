---
title: "Feature Specification: mcp-magnific — official Magnific MCP mode for the mcp-tooling hub"
description: "Phase parent for adding the official remote Magnific MCP as a new mcp-magnific transport mode, covering research, architecture, runtime wiring, skill authoring, catalog and playbook documentation, hub registration, and end-to-end verification."
trigger_phrases:
  - "mcp-magnific"
  - "magnific mcp"
  - "magnific creative generation"
  - "mcp-tooling magnific mode"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-magnific"
    last_updated_at: "2026-08-02T13:36:45Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffold seven-phase Magnific MCP packet"
    next_safe_action: "Execute 001-official-mcp-research"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-mcp-magnific"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "What authentication and transport contract does the official remote server expose to Code Mode?"
      - "Which Magnific actions require explicit credit-spend confirmation?"
    answered_questions:
      - "The official remote endpoint is https://mcp.magnific.com."
      - "Magnific MCP is available on paid plans; generation and transformation actions consume credits."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md
  REQUIRED content:
    - Root purpose
    - Child phase map
    - High-level outcome
-->

# Feature Specification: mcp-magnific — official Magnific MCP mode for the mcp-tooling hub

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase parent; aggregate work qualifies as Level 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-02 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `mcp-tooling` |
| **Predecessor** | `013-mcp-obsidian` |
| **Successor** | None |
| **Handoff Criteria** | All seven child phases validate; `mcp-magnific` is registered across the hub and advisor; the official remote endpoint is reachable through Code Mode; read-only and credit-consuming operations are correctly gated; strict packet and hub checks pass. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Magnific exposes an official remote MCP at `https://mcp.magnific.com`, but this framework has no Magnific mode. Agents cannot discover its generation, editing, creation-history, Spaces, LoRA, or model-selection surfaces through the `mcp-tooling` hub, and there is no local contract for authentication, credit-spend confirmation, creative-judgment ownership, or remote asset handling.

### Purpose
Add `mcp-magnific` as a nested `mcp-tooling` mode that connects Code Mode to Magnific's official remote MCP, documents its verified tool surface, routes creative judgment through `sk-design`, distinguishes free read operations from credit-consuming mutations, and verifies the integration end to end without inventing unsupported tool names or authentication details.

The official product page confirms one remote endpoint, custom-connector setup, paid-plan availability, generation and editing across image/video/audio/vector/3D, creation history, Spaces workflows, LoRAs, model selection, and credit consumption for generation or transformation. Exact schemas, authentication, remote transport behavior, and tool names remain research-gated.

> **Phase-parent note:** This `spec.md` is the only authored document at the parent level. Detailed plans, tasks, decisions, checklists, and continuity live in the child phase folders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Research and capture the official Magnific MCP transport, authentication, tool inventory, schemas, output behavior, plan gating, and credit semantics.
- Decide and scaffold the `mcp-magnific` mode shape, with `packetKind: transport` as the leading candidate and `sk-design` as the creative-judgment owner.
- Wire the official remote endpoint into Code Mode using the verified remote-MCP pattern.
- Author the nested mode package, routed references, examples, install/setup guidance, feature catalog, and manual-testing playbook.
- Register the mode in the `mcp-tooling` hub, advisor metadata, leaf manifest, compiled-routing inputs, and repository documentation.
- Verify no-cost discovery/history paths separately from credit-consuming generation or transformation paths.

### Out of Scope
- Reimplementing Magnific's API or building a proxy MCP server.
- Automating purchases, subscription changes, or credit top-ups.
- Treating the transport as the authority for visual taste or product design decisions.
- Modifying another `mcp-tooling` mode except shared hub surfaces required for registration.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/specs/mcp-tooling/014-mcp-magnific/001-official-mcp-research/research/**` | Create | 001 | Cited research and workflow-owned evidence for the official endpoint and tool contract |
| `.opencode/skills/mcp-tooling/mcp-magnific/**` | Create | 002, 004, 005 | Nested mode package, references, examples, catalog, playbook, and changelog |
| `.utcp_config.json` | Modify | 003 | Add the verified Magnific remote MCP manual, likely through the established `mcp-remote` bridge |
| `.env.example` | Modify if required | 003 | Document only verified non-secret or secret configuration inputs |
| `.opencode/skills/mcp-tooling/{mode-registry.json,hub-router.json,description.json,graph-metadata.json,SKILL.md}` | Modify | 006 | Register transport mode and advisor vocabulary |
| `.opencode/skills/mcp-tooling/shared/references/smart-routing.md` | Modify | 006 | Add Magnific intent and resolvable resource map |
| `.opencode/skills/mcp-tooling/leaf-manifest.json` | Regenerate | 006 | Add generated Magnific leaves |
| `README.md` | Modify | 006 | Add the new integration to repository documentation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-official-mcp-research/` | Verify endpoint transport, auth, tools, schemas, output handling, plan access, credit semantics, and destructive behavior from official/live evidence | Complete (2026-08-02) |
| 2 | `002-mode-architecture-and-scaffold/` | Freeze transport classification, judgment pairing, safety gates, runtime topology, and scaffold the nested package | Complete (2026-08-02) |
| 3 | `003-mcp-runtime-integration/` | Register and verify the official remote MCP in Code Mode without storing credentials in the repository | Complete (2026-08-02) — with documented operator-OAuth blocker for authenticated discovery |
| 4 | `004-skill-authoring/` | Author the executable mode contract, setup guide, references, examples, troubleshooting, and changelog | Draft |
| 5 | `005-feature-catalog-and-playbook/` | Inventory verified current capabilities and create reproducible no-cost and credit-consuming test scenarios | Draft |
| 6 | `006-hub-registration-and-advisor/` | Register the mode across hub routing, advisor metadata, leaf projection, compiled-routing inputs, and repository docs | Draft |
| 7 | `007-verification-and-closeout/` | Run recursive strict validation, hub checks, advisor recall, live remote discovery, controlled smoke tests, and metadata reconciliation | Draft |

### Phase Transition Rules

- Phase 001 gates every implementation phase; unsupported details remain `UNKNOWN` until verified.
- Each phase must pass strict validation before its successor begins.
- Phase 003 may wire only the transport contract frozen by Phase 002.
- Phase 004 may document only tools and schemas confirmed by Phase 001 or fresh runtime discovery.
- Any operation that consumes credits requires explicit operator confirmation, a stated expected output, and a spend boundary.
- Design-affecting requests load `sk-design` before this transport executes them.
- Run recursive strict validation on the parent after each child closeout.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-official-mcp-research | 002-mode-architecture-and-scaffold | Official endpoint, auth, transport, tool inventory, plan/credit rules, and output behavior are cited; unknowns are explicit | Research synthesis plus live discovery evidence where credentials permit |
| 002-mode-architecture-and-scaffold | 003-mcp-runtime-integration | Mode classification, tool permissions, judgment pairing, confirmation policy, and runtime topology are accepted; package skeleton exists | Decision record and package inventory validation |
| 003-mcp-runtime-integration | 004-skill-authoring | Code Mode can discover the remote server or a precise auth/environment blocker is recorded; no secrets are committed | JSON parse, bridge launch, and `list_tools`/equivalent evidence |
| 004-skill-authoring | 005-feature-catalog-and-playbook | Skill package validates and every routed reference resolves | Skill package validation and link check |
| 005-feature-catalog-and-playbook | 006-hub-registration-and-advisor | Catalog and playbook cover verified free/read and credit-consuming mutation classes | Catalog and scenario validators |
| 006-hub-registration-and-advisor | 007-verification-and-closeout | Registry, router, advisor, manifest, and README agree on `mcp-magnific` | Parent-skill check, route validation, advisor recall |
| 007-verification-and-closeout | Complete | All P0 gates pass; live mutation is either safely verified with consent or explicitly deferred | Recursive strict validation and recorded smoke evidence |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Does the official endpoint use OAuth through `mcp-remote`, another browser authorization flow, or a token/header contract?
- What exact callable names and schemas does the server expose, and which calls are asynchronous jobs?
- Which operations are free, which consume credits, and can the server estimate cost before execution?
- How are generated image, video, audio, vector, and 3D assets returned or referenced inside Code Mode?
- Does Magnific expose delete, overwrite, publish, share, LoRA-training, or team-workspace operations that need stronger confirmation?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Official source**: <https://www.magnific.com/mcp?from_element=landing_magnific_mcp#setup>
- **Official endpoint**: <https://mcp.magnific.com>
- **Phase children**: direct child folders matching `^[0-9]{3}-[a-z0-9-]+$`
- **Track metadata**: `../description.json` and `../graph-metadata.json`

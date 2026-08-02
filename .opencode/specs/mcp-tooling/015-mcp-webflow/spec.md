---
title: "Feature Specification: mcp-webflow - Webflow MCP 2.0 mode for mcp-tooling"
description: "Phase parent for researching, designing, integrating, documenting, registering, reviewing, and verifying a Webflow MCP 2.0 mode in the mcp-tooling hub."
trigger_phrases:
  - "mcp-webflow"
  - "webflow mcp 2.0"
  - "webflow mcp tooling"
  - "webflow mode skill"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow"
    last_updated_at: "2026-08-02T14:00:00Z"
    last_updated_by: "pi"
    recent_action: "Created the phase parent and eight child phase contracts"
    next_safe_action: "Resume 001-deep-research from a non-Pi conductor and run the mandatory dry-run"
    blockers:
      - "The current Pi session cannot self-dispatch the cli-pi research lineage"
    key_files:
      - "spec.md"
      - "001-deep-research/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should mcp-webflow be classified as a workflow or transport mode?"
      - "Which Webflow operations require explicit operator confirmation?"
    answered_questions:
      - "Packet number is 015 and Phase 1 uses two five-iteration research lineages"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  REQUIRED: root purpose, direct child map, aggregate outcome.
  Detailed plans, tasks, checklists, decisions, and implementation summaries live in children.
-->

# Feature Specification: mcp-webflow - Webflow MCP 2.0 mode for mcp-tooling

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase parent; program qualifies for Level 3 documentation |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `mcp-tooling/015-mcp-webflow` |
| **Predecessor** | `014-mcp-magnific` |
| **Successor** | None |
| **Handoff Criteria** | All eight child phases validate; the Webflow mode is registered, safely bounded, advisor-discoverable, route-tested, independently reviewed, and live-smoked without unapproved production mutation. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `mcp-tooling` hub has no mode for operating Webflow through Webflow's current MCP surface. Agents therefore lack a repository-governed contract for connecting to Webflow MCP 2.0, choosing safe read and write operations, pairing design judgment with `sk-design`, and preventing accidental publish, delete, overwrite, or production-site mutation.

### Purpose
Create a new `mcp-webflow` mode that exposes Webflow MCP 2.0 through the existing hub architecture. The packet starts with evidence-first research, freezes the mode classification and safety boundary, integrates the selected official transport, authors the skill package, registers routing and advisor metadata, and verifies the result end to end.

The parent remains a control file. Detailed execution evidence belongs to the child phase that owns it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Research Webflow MCP 2.0 from official and corroborating sources.
- Decide `packetKind`, `backendKind`, tool permissions, authentication posture, and `sk-design` pairing.
- Add the `mcp-webflow` packet and its MCP connection/configuration contract.
- Document read, draft-write, destructive, publish, and deployment operation classes.
- Add feature-catalog and manual-testing-playbook coverage.
- Register the mode across the hub router, registry, advisor metadata, compiled routing, and leaf manifest.
- Benchmark routing, run independent deep review, and close only after strict verification.

### Out of Scope
- Building a replacement Webflow MCP server unless Phase 1 proves the official surface unusable and the scope is explicitly amended.
- Performing design judgment inside the transport; `sk-design` remains the taste authority.
- Publishing, deleting, overwriting, deploying, or mutating a production Webflow site during documentation or research.
- Changing `014-mcp-magnific` or unrelated dirty-worktree content.

### Complexity Qualification

| Dimension | Score | Evidence |
|-----------|------:|----------|
| Architectural complexity | 10 | Hub routing, remote MCP, authentication, design pairing, and external mutation policy |
| File count | 10 | Expected mode package plus hub, catalog, playbook, benchmark, and config surfaces exceed 15 files |
| Program size | 10 | Expected authored and generated program content exceeds 800 lines |
| Risk | 10 | Webflow operations may alter or publish external site content |
| Extreme scale | 0 | No single dimension currently exceeds twice its threshold |
| **Total** | **40/50** | Phase threshold passes; overall documentation level is at least 3 |

### Aggregate Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/mcp-tooling/mcp-webflow/**` | Create | 003-005 | New mode package, integration docs, catalog, and playbook |
| `.utcp_config.json` and `.env.example` | Modify if required by research | 003 | Register transport and environment contract without secrets |
| `.opencode/skills/mcp-tooling/{mode-registry.json,hub-router.json,SKILL.md,description.json,graph-metadata.json,leaf-manifest.json}` | Modify/regenerate | 006 | Add the mode to hub and advisor surfaces |
| `.opencode/skills/mcp-tooling/shared/references/smart-routing.md` | Modify | 006 | Add Webflow intent routing |
| `.opencode/skills/mcp-tooling/{benchmark,manual-testing-playbook,feature-catalog}/**` | Create/modify | 005-007 | Add behavior and routing evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-deep-research/` | Two forced-depth research lineages: DeepSeek v4 Flash max thinking x5 and GPT-5.6 Luna max-fast x5; synthesize official MCP 2.0 capabilities, constraints, and recommendations | Pending |
| 2 | `002-architecture-and-safety-contract/` | Freeze mode classification, backend, permission surface, authentication, confirmation, rollback, publish, and design-pairing policy | Pending |
| 3 | `003-webflow-mcp-integration/` | Scaffold the packet and integrate the researched official Webflow MCP transport and configuration | Pending |
| 4 | `004-skill-authoring/` | Author the routing contract, README, install guide, references, examples, and changelog | Pending |
| 5 | `005-feature-catalog-and-playbook/` | Build a feature inventory and safe manual-test scenarios for all supported operation classes | Pending |
| 6 | `006-hub-registration-and-advisor/` | Register the mode across registry, router, advisor, compiled routing, manifest, and hub docs | Pending |
| 7 | `007-routing-benchmark-and-deep-review/` | Benchmark routing boundaries and run independent deep review; resolve or explicitly defer verified findings | Pending |
| 8 | `008-verification-and-closeout/` | Run recursive strict validation, hub checks, route/advisor tests, safe live smoke, and completion reconciliation | Pending |

### Phase Transition Rules
- Phase 1 must produce a cited synthesis and explicit recommendations before Phase 2 starts.
- Phase 2 freezes architecture and safety before any MCP integration or external mutation test.
- Phase 3 may use only the transport and auth pattern accepted in Phase 2.
- Phase 6 begins only after the packet-local docs, catalog, and playbook validate.
- Phase 8 cannot close with unresolved P0 findings or unapproved P1 deferrals.
- Each child validates independently; the parent validates recursively.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| 001 | 002 | Ten productive iterations and a cited synthesis covering tools, auth, limits, safety, and classification evidence | Research state, lineage artifacts, convergence report, and `research/research.md` |
| 002 | 003 | Mode kind, backend, permissions, confirmation policy, rollback, and design pairing are accepted | Child decision record and safety matrix |
| 003 | 004 | MCP connection/configuration resolves and a non-production read smoke succeeds or is honestly marked blocked | Config validation and tool discovery evidence |
| 004 | 005 | Skill docs expose clear routing, operation classes, safety gates, and setup instructions | Packet doc validation |
| 005 | 006 | Feature catalog and playbook cover the researched capability and risk surfaces | Catalog/playbook validators |
| 006 | 007 | Hub and advisor surfaces are aligned and generated assets are current | Parent-skill check, route validation, advisor recall |
| 007 | 008 | Routing benchmark passes and verified review findings are resolved or approved for deferral | Benchmark report and deep-review verdict |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Is `mcp-webflow` a `workflow` because it performs managed Webflow operations, or a `transport` because mutations land outside this repository?
- Which MCP 2.0 actions are read-only, draft-safe, destructive, publish-capable, or deployment-capable?
- Does the official surface use remote OAuth, a local server, an API token, or a client-specific connection flow?
- What non-production Webflow workspace or site can support live smoke without risking existing content?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- Child phase contracts live in `001-*` through `008-*`.
- Research source: [Webflow MCP 2.0 features](https://webflow.com/blog/mcp-2-features).
- Hub architecture references: `.opencode/skills/mcp-tooling/`.

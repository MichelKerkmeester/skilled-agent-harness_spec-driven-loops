---
title: "Implementation Plan: Magnific mode architecture and scaffold"
description: "Convert verified research into a minimal nested transport contract and scaffold the package without shared hub changes."
trigger_phrases: ["magnific architecture plan", "mcp-magnific scaffold plan", "magnific transport plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-magnific/002-mode-architecture-and-scaffold"
    last_updated_at: "2026-08-02T15:35:00Z"
    last_updated_by: "spec-author"
    recent_action: "Plan architecture and scaffold"
    next_safe_action: "Review Phase 1 research"
    blockers: ["Phase 1 contract not yet complete"]
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: {fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "014-mcp-magnific-002", parent_session_id: null}
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Magnific mode architecture and scaffold

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Stack** | OpenCode nested skill packet, JSON routing contracts |
| **Framework** | `sk-create-skill` nested-mode doctrine |
| **Storage** | Mode-local documentation and assets |
| **Testing** | Package inventory and contract review |

Use the Phase 1 synthesis to decide the packet classification and runtime boundary. Scaffold only the mode-local package and freeze the rules consumed by later phases.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 1 contract is cited and complete enough to decide
- [x] Existing transport exemplars are inventoried
- [x] Credit and creative-judgment boundaries are explicit

### Definition of Done
- [x] Architecture decision is accepted
- [x] Package skeleton follows nested-mode rules
- [x] Rollback and permission contracts are recorded
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin transport packet under one `mcp-tooling` advisor identity.

### Key Components
- **Mode contract**: Classification, permissions, aliases, and external-effect policy.
- **Runtime boundary**: Code Mode calls the official remote endpoint.
- **Judgment boundary**: `sk-design` owns taste; Magnific executes approved creative intent.

### Data Flow
User intent → hub route → judgment owner when needed → consent gate → Magnific transport → result verification.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp-tooling` doctrine | Parent contract | Read only in this phase | Pattern comparison |
| `mcp-magnific` package | New nested packet | Scaffold | Inventory check |
| Phase 2 decision record | Architecture authority | Author | Alternatives and consequences complete |
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read research and transport exemplars
- [x] Score classification alternatives

### Phase 2: Implementation
- [x] Freeze packet, backend, tools, spend gates, and pairing
- [x] Scaffold mode-local package
- [x] Remove standalone-skill metadata from nested packet

### Phase 3: Verification
- [x] Compare inventory with nested packet contract
- [x] Confirm no shared hub file changed
- [x] Validate the phase docs
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Architecture | Alternatives and constraints | Decision review |
| Structure | Nested package shape | Filesystem inventory |
| Permission | Allowed/forbidden tools | Contract comparison |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 synthesis | Internal | Red until complete | No safe architecture decision |
| `sk-create-skill` templates | Internal | Green | Package cannot be scaffolded canonically without them |
| `sk-design` boundary | Internal | Green | Creative judgment ownership must remain explicit |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research contradicts the proposed transport shape or package validation fails structurally.
- **Procedure**: Delete only the new mode skeleton, amend the decision, and leave shared hub/runtime files untouched.
<!-- /ANCHOR:rollback -->

---
title: "Implementation Plan: Author the mcp-magnific package"
description: "Build the nested transport documentation from verified schemas, with runtime discovery, credit gates, creative-judgment pairing, and output verification."
trigger_phrases: ["magnific skill plan", "mcp-magnific authoring plan", "magnific references plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-magnific/004-skill-authoring"
    last_updated_at: "2026-08-02T13:36:49Z"
    last_updated_by: "spec-author"
    recent_action: "Plan nested skill authoring"
    next_safe_action: "Read discovery fixture and author router"
    blockers: ["Phase 3 discovery evidence not yet available"]
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: {fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "014-mcp-magnific-004", parent_session_id: null}
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Author the mcp-magnific package

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Stack** | Markdown skill package, shell-free remote transport |
| **Framework** | `sk-create-skill` nested packet templates |
| **Storage** | References, examples, changelog |
| **Testing** | Package validator, link checks, router review |

Author the execution contract in `SKILL.md`, moving setup, schemas, safety details, and examples into routed resources. Preserve runtime discovery as the authority for callable names.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Discovery fixture and architecture contract available
- [ ] Package skeleton valid
- [ ] Cost/mutation classes fixed

### Definition of Done
- [ ] Package validates with no missing references
- [ ] Credit gates and `sk-design` precondition are executable
- [ ] Setup and troubleshooting are operator-usable
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin router plus on-demand references.

### Key Components
- **SKILL.md**: Activation, intent routing, ordered execution, rules, and success criteria.
- **References**: Tool discovery, cost/mutation safety, outputs, and troubleshooting.
- **Examples**: Free/read flows and consent-gated paid flows.

### Data Flow
Request → classify intent/cost → load judgment owner if needed → discover schema → confirm → call → verify result.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| New package | Nested transport | Author | Package validator |
| `sk-design` | Judgment owner | Reference, do not duplicate | Pairing contract review |
| Runtime fixture | Schema evidence | Reference as dated input | Names match captured discovery |
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read templates, fixture, and architecture decision
- [ ] Fix resource map and document inventory

### Phase 2: Implementation
- [ ] Author SKILL, README, install guide, references, examples, and changelog
- [ ] Add consent, budget, and output verification procedures

### Phase 3: Verification
- [ ] Validate package structure and links
- [ ] Replay representative routing intents
- [ ] Confirm no standalone metadata exists
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Skill package | Package validator |
| Routing | Intent/resource selection | Router replay/manual examples |
| Safety | Spend and destructive gates | Scenario review |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Runtime fixture | Internal | Red until Phase 3 | Tool docs cannot be authored safely |
| `sk-create-skill` assets | Internal | Green | Required package shape |
| Official product statements | External | Green, date-bound | High-level boundaries lose citation |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Package claims exceed discovered behavior or validation requires weakening safety gates.
- **Procedure**: Remove only unsupported resources/claims or delete the unregistered package; shared hub and runtime remain unchanged.
<!-- /ANCHOR:rollback -->

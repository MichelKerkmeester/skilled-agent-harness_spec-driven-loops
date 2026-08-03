---
title: "Implementation Plan: Register mcp-magnific in mcp-tooling"
description: "Apply one atomic shared-hub registration across registry, router, advisor metadata, leaf projection, compiled-routing inputs, and repository docs."
trigger_phrases: ["magnific hub plan", "magnific advisor plan", "register mcp-magnific plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-magnific/006-hub-registration-and-advisor"
    last_updated_at: "2026-08-02T13:36:51Z"
    last_updated_by: "spec-author"
    recent_action: "Plan shared registration"
    next_safe_action: "Inventory all current hub surfaces"
    blockers: ["Mode package and catalog must validate"]
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: {fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "014-mcp-magnific-006", parent_session_id: null}
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Register mcp-magnific in mcp-tooling

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Stack** | JSON/Markdown hub routing metadata |
| **Framework** | mcp-tooling registry/router and advisor identity |
| **Storage** | Generated leaf/compiled projections plus authored metadata |
| **Testing** | JSON parse, parent check, route validation, advisor recall |

Inventory every hub awareness surface, apply the new transport entry consistently, regenerate derived files, and verify both advisor-to-hub and hub-to-mode routing.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Mode package validates
- [ ] Current registry/router/advisor versions recorded
- [ ] Generator and compiled freshness commands confirmed

### Definition of Done
- [ ] All awareness surfaces agree
- [ ] Generated files are fresh
- [ ] Parent, route, and advisor checks pass
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single hub identity with metadata-routed transport packet.

### Key Components
- **Registry/router**: Canonical mode membership and lexical selection.
- **Advisor metadata**: Magnific vocabulary routes to the hub identity.
- **Generated projection**: Leaf and compiled route artifacts.

### Data Flow
Prompt → advisor selects mcp-tooling → hub router selects mcp-magnific → mode resources load.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Registry/router | Hub mode authority | Modify atomically | Schema and parity checks |
| Hub advisor files | Single advisor identity | Add narrow vocabulary | Advisor recall |
| Leaf/compiled outputs | Generated routing projection | Regenerate | Freshness checks |
| README | Public inventory | Update | Grep and link review |
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Snapshot all hub surfaces and versions
- [ ] Confirm exact aliases and resources

### Phase 2: Implementation
- [ ] Update registry, router, hub docs, advisor metadata, and smart routing
- [ ] Regenerate leaf and compiled projections
- [ ] Update repository README

### Phase 3: Verification
- [ ] Parse JSON and run parent/route checks
- [ ] Run advisor recall and route probes
- [ ] Diff existing modes for unintended changes
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | Hub JSON | JSON parser |
| Structure | Registry/router/package parity | Parent-skill check |
| Routing | Magnific and negative prompts | Route validator/advisor |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Validated package | Internal | Red until Phase 5 | Resources cannot resolve |
| Manifest generator | Internal | Verify before edit | Leaf projection may remain stale |
| Advisor daemon/CLI | Internal | Yellow | Recall may require later warm verification |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Existing mode routing changes, validators fail, or generated outputs cannot be made fresh.
- **Procedure**: Restore all shared hub files as one set, regenerate prior projections, and leave the unregistered mode package for diagnosis.
<!-- /ANCHOR:rollback -->

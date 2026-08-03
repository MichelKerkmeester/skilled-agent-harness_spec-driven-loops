---
title: "Implementation Plan: Magnific catalog and testing playbook"
description: "Project the verified mode surface into a current-state feature catalog and cost-aware manual-testing scenarios."
trigger_phrases: ["magnific catalog plan", "magnific playbook plan", "mcp-magnific scenarios plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-magnific/005-feature-catalog-and-playbook"
    last_updated_at: "2026-08-02T13:36:50Z"
    last_updated_by: "spec-author"
    recent_action: "Plan catalog and playbook"
    next_safe_action: "Extract verified current surface"
    blockers: ["Phase 4 package not yet complete"]
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: {fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "014-mcp-magnific-005", parent_session_id: null}
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Magnific catalog and testing playbook

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Stack** | Markdown catalog and scenario corpus |
| **Framework** | sk-doc catalog/playbook doctrines |
| **Storage** | Mode-local documentation packages |
| **Testing** | Document validators and scenario contract checks |

Extract only verified behavior from the completed mode package. Tag every feature and scenario with its cost and mutation class so a no-cost gate can run independently of paid smoke tests.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Current verified tool surface frozen
- [ ] Cost/mutation taxonomy accepted
- [ ] Catalog and playbook templates loaded

### Definition of Done
- [ ] Every card maps to source evidence
- [ ] Every scenario has stable ID, cost class, evidence, and triage
- [ ] Cross-links and validators pass
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Current-state inventory paired with executable scenario contracts.

### Key Components
- **Catalog root/cards**: Verified capabilities and source anchors.
- **Playbook root/scenarios**: Execution policy, waves, consent gates, evidence, and cleanup.

### Data Flow
Discovered tool → feature card → one or more scenarios → verification evidence → closeout phase.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Feature catalog | Current truth | Create | Catalog validators |
| Playbook | Behavior test corpus | Create | Scenario contract checker |
| Package references | Evidence source | Read only | Card/source links |
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read authoring doctrines and reference package
- [ ] Define taxonomy and stable IDs

### Phase 2: Implementation
- [ ] Author catalog root and cards
- [ ] Author playbook policy and scenarios
- [ ] Cross-link packages

### Phase 3: Verification
- [ ] Validate cards, scenarios, IDs, and links
- [ ] Confirm every paid scenario stops for consent
- [ ] Confirm no roadmap claims entered the catalog
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Document | Root docs and cards | sk-doc validators |
| Contract | Scenario required fields | Scenario checker |
| Safety | Cost and mutation labels | Matrix audit |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 4 package | Internal | Red until complete | No authoritative current surface |
| Authoring doctrines | Internal | Green | Validators may reject package shape |
| Paid account | External | Not required for authoring | Paid scenarios remain pending until Phase 7 |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A card or scenario cannot be traced to verified current behavior.
- **Procedure**: Remove the unsupported entry while preserving stable IDs for remaining entries; do not invent a replacement.
<!-- /ANCHOR:rollback -->

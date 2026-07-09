---
title: "Implementation Plan: spec and resource-map for deep-skill doc evolution"
description: "Authoring approach for the 008 planning contract: JSON schemas, resource-map.yaml, and a delta reconciliation against 000-release-cleanup that scopes the remaining per-skill documentation work."
trigger_phrases:
  - "deep-skill doc evolution plan"
  - "008 resource-map plan"
  - "deep-skill schemas plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/007-deep-stack-cross-cutting/003-doc-evolution-spec-and-resource-map"
    last_updated_at: "2026-05-25T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "authored-plan"
    next_safe_action: "author-resource-map-and-schemas"
    blockers: []
    key_files:
      - "resource-map.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000802"
      session_id: "116-008-001-plan"
      parent_session_id: "116-008-001-spec-and-resource-map"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: spec and resource-map for deep-skill doc evolution

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, JSON Schema (draft-07) |
| **Framework** | system-spec-kit spec folders; sk-doc templates |
| **Storage** | Files in the 001 child folder |
| **Testing** | `validate.sh --strict`; JSON schema parse of sample objects |

### Overview
Phase 1 produces a planning contract. The work is authoring three JSON schemas, a `resource-map.yaml` artifact inventory, and a delta reconciliation that reads live skill state plus the `000-release-cleanup` summaries. No skill files change here.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] resource-map.yaml enumerates every in-scope artifact with a delta status
- [ ] Three schemas parse and reject a malformed sample
- [ ] `validate.sh --strict` exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation pipeline contract: one upstream planning folder feeds nine downstream phases.

### Key Components
- **resource-map.yaml**: the artifact inventory and per-skill delta, read by every later phase
- **schemas/**: the emitter contracts for findings, changelog entries, and the gate report
- **reconciliation table**: maps prior 000 work to remaining 008 work

### Data Flow
001 reads live skill dirs and 000 summaries, then writes the contract. Phases 002-007 read resource-map rows and emit findings that conform to the schemas. Phase 008 emits a validation report against its schema. Phase 009 appends to the phase5 backlog.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase authors planning artifacts only and changes no producer, consumer, or policy surface. The first phase that touches shared surfaces is 002 (references restructure), which carries its own affected-surfaces inventory.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| (none) | planning artifacts only | not a consumer | n/a |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] 008 parent control files authored and metadata generated
- [x] 001 child spec authored

### Phase 2: Core Implementation
- [ ] Generate the artifact inventory with `find` across the five skills
- [ ] Author resource-map.yaml rows with template mapping and delta status
- [ ] Author the three JSON schemas
- [ ] Author the delta reconciliation against 000-release-cleanup

### Phase 3: Verification
- [ ] Parse the schemas against sample objects
- [ ] Confirm every artifact row maps to a real sk-doc template
- [ ] `validate.sh --strict` exits 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Schema parse of one valid + one invalid sample each | node + ajv or a minimal JSON parse check |
| Integration | resource-map rows reference real template paths | grep + ls cross-check |
| Manual | Spec folder validates | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc templates under `assets/skill/` | Internal | Green | Cannot map artifacts to templates |
| 000-release-cleanup summaries | Internal | Green | Delta reconciliation degrades to live-state only |
| Live skill directories | Internal | Green | Cannot compute delta status |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: resource-map.yaml or a schema is found malformed downstream
- **Procedure**: This folder is additive and untracked; correct the file in place, no revert of skill code needed
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Core (map + schemas + reconciliation) ──► Verify (validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | 002 references restructure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | done |
| Core Implementation | Med | 1-2 hours |
| Verification | Low | under 1 hour |
| **Total** | | **2-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] resource-map.yaml parses as valid YAML
- [ ] Each schema parses as valid JSON

### Rollback Procedure
1. Identify the malformed planning artifact
2. Correct it in place within the 001 folder
3. Re-run `validate.sh --strict`

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

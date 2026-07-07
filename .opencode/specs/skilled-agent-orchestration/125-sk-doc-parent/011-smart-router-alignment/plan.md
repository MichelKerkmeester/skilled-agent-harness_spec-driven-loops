---
title: "Implementation Plan: Align router-carrying SKILL.md nested smart-routers to the canonical template"
description: "Classify then align: parallel GPT-5.5-fast-high swarms draft aligned router sections per skill cluster, fresh-Sonnet verifies every output against the canonical 4-pattern template before landing."
trigger_phrases:
  - "smart router alignment plan"
  - "125 sk-doc phase 011 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/011-smart-router-alignment"
    last_updated_at: "2026-07-07T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Author phase-011 plan"
    next_safe_action: "Enumerate the ~24 candidate skills and read the canonical template"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Align router-carrying SKILL.md nested smart-routers to the canonical template

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown `SKILL.md` files across `.opencode/skills/` |
| **Framework** | Canonical smart-router contract at `.opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md` |
| **Storage** | In-place edits to each skill's `SKILL.md` |
| **Testing** | Manual diff-against-template review; parent-skill-check-style scope check for canon-hub skills |

### Overview
Classify-then-align, two-pass. Pass one enumerates every skill with router pseudocode or keyed routing and classifies it full-router (needs all 4 canonical patterns) or simple-routing (needs only the patterns that apply, or none). Pass two aligns each full-router skill's smart-router section to the template and records a one-line exemption rationale for every simple-routing skill. Concurrent-lane skills are touched under existing operator authorization, strictly at the router section.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Canonical template exists and is stable (`skill_smart_router.md`, 4 named patterns)
- [x] Prior phase (010) review work does not block this phase's start

### Definition of Done
- [ ] All ~24 candidates classified with recorded rationale
- [ ] Every full-router skill aligned or exempted with a documented reason
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Classify-then-align rubric, using the canonical template's own 4 named patterns (Runtime Discovery, Existence-Check Before Load, Extensible Routing Key, Multi-Tier Graceful Fallback) as the alignment checklist.

### Key Components
- **Audit pass**: enumerate every skill with router pseudocode or keyed routing; record full-router vs simple-routing per skill.
- **Alignment pass**: for full-router skills, rewrite the smart-router section to demonstrate the 4 patterns (or the applicable subset, with rationale).
- **Rationale pass**: for simple-routing skills, add a one-line note on why the full router does not apply.

### Data Flow
1. Grep every `SKILL.md` for router pseudocode / keyed routing markers to build the candidate list.
2. Read `skill_smart_router.md` once for the 4-pattern contract.
3. Classify each candidate; batch full-router candidates into clusters for parallel GPT-5.5-fast-high drafting.
4. Fresh Sonnet verifies each drafted alignment against the real skill's actual resources and routing keys before it lands.
5. Apply verified edits; record the classification + outcome per skill.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Enumerate the router-carrying skills (grep for router pseudocode / keyed routing across `.opencode/skills/*/SKILL.md`)
- [ ] Read the canonical template (`skill_smart_router.md`) once for the 4-pattern contract

### Phase 2: Implementation
- [ ] Classify each candidate full-router vs simple-routing with a one-line rationale
- [ ] Dispatch parallel GPT-5.5-fast-high swarms (>=5 concurrent) to draft aligned router sections per full-router skill, batched by cluster
- [ ] Fresh-Sonnet verification of every drafted alignment against the skill's real resources before landing
- [ ] Apply verified edits, scoped to the router section only

### Phase 3: Verification
- [ ] Spot-check a sample of full-router skills against all 4 patterns
- [ ] Confirm concurrent-lane skills were touched only at the router section (diff review)
- [ ] Record the final classification + outcome table
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Template conformance | Every full-router skill's aligned section | Manual diff against `skill_smart_router.md`'s 4 patterns |
| Independent verification | Every GPT-drafted alignment | Fresh Claude Sonnet agent, no prior context |
| Scope check | Concurrent-lane skill diffs | Manual review: router-section-only edits |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| GPT-5.5-fast-high executor (cli-opencode) | External | Green | Alignment drafting pauses; resume when available |
| Fresh-Sonnet verifier capacity | Internal | Green | Drafted alignments stay unverified, cannot land |
| Operator authorization for concurrent-lane skills | Internal | Green (already granted) | Those skills would be skipped, leaving router drift in place |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: an aligned router section changes routing behavior (not just documentation) for a live skill.
- **Procedure**:
  1. Revert that skill's `SKILL.md` to its prior committed version.
  2. Re-classify the skill and re-draft with an explicit constraint to preserve existing routing behavior verbatim.
  3. Re-run the fresh-Sonnet verification before landing again.
<!-- /ANCHOR:rollback -->

---
title: "Feature Specification: hub-doc-alignment-and-router"
description: "Align sk-prompt-models's SKILL.md, README, and references/models profiles to the sk-doc templates: replace the no-op router with a model-keyed smart router, scrub ephemeral spec refs from the README, and conform the 9 profiles to the reference template."
trigger_phrases:
  - "hub doc alignment"
  - "model-keyed router"
  - "readme spec-ref scrub"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "130-prompt-knowledge-layering/010-hub-doc-alignment-and-router"
    last_updated_at: "2026-06-03T08:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Router fixed, README + 9 profiles aligned"
    next_safe_action: "Validate then commit phase 010"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/SKILL.md"
      - ".opencode/skills/sk-prompt-models/README.md"
      - ".opencode/skills/sk-prompt-models/references/models/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Card destination, phasing, merge shape, JSON style locked at plan approval"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: hub-doc-alignment-and-router

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-03 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 13 |
| **Predecessor** | 009-refine-hub-cli-connections |
| **Successor** | 011-model-profiles-and-benchmark-merge |
| **Handoff Criteria** | Router aligned to skill_smart_router; README spec-ref-clean + HVR; 9 profiles conform to skill_reference_template; guard green; validate --strict exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 10 of spec 130 aligns the `sk-prompt-models` hub's doc surface to the sk-doc templates
(`skill_md_template`, `skill_smart_router`, `skill_reference_template`, `skill_readme_template`) and
removes ephemeral spec references from its README. The sk-doc templates are the decision record for
the target structure.

**Scope boundary**: the hub's SKILL.md, README.md, and `references/models/*.md` (+ `_index.md`),
plus the hub's stale entry in `skills/README.md`. No executor docs (phase 012), no benchmark/registry
changes (phase 011), no card move (phase 013).

**Deliverables**: a model-keyed smart router, a hub-identity README scrubbed of spec refs, 9 profiles
conformed to the reference template.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The hub's `SKILL.md` §2 declared "this skill has no runtime router of its own" — a no-op that
deviated from the sk-doc smart-router template. The README still described the skill as a "thin
sentinel … does not host pattern bodies" (false post-130: it owns the profiles) and carried
ephemeral spec references (`114-small-ai-model-optimization` arc, phase numbers, research-iter
links). The 9 per-model profiles opened with Title-Case `## 1. Identity` instead of the template's
`## 1. OVERVIEW` with ALL-CAPS numbered H2s.

### Purpose
Make the hub's doc surface conform to the sk-doc templates and tell the truth about what the skill
is (a per-model prompt-craft hub), with a real model-keyed router and a spec-ref-clean README.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `SKILL.md` §2: no-op router → model-keyed smart router (routing key = model id → `references/models/<id>.md`) per `skill_smart_router.md`; LOC cap relaxed to 300 to fit the inline router.
- `README.md`: hub identity, ephemeral spec refs stripped, structure + HVR aligned to `skill_readme_template`.
- `references/models/*.md` (8 profiles) + `_index.md`: add `## 1. OVERVIEW`, renumber + recase to ALL-CAPS H2s per `skill_reference_template`.
- `skills/README.md`: refresh the stale hub index entry (Sentinel/v0.3.0.0/114-007 → hub/0.7.0.0).

### Out of Scope
- Executor (`cli-*`) docs — phase 012.
- `model-profiles.json`, benchmarks, stale benchmark-id repoint — phase 011.
- Card relocation + guard rewrite — phase 013.
- Other skills' README packet refs — noted broader cleanup, not hub doc alignment.

### Files to Change
| File Path | Change Type |
|-----------|-------------|
| `sk-prompt-models/SKILL.md` | Modify (router + version + LOC cap) |
| `sk-prompt-models/README.md` | Modify (full rewrite) |
| `sk-prompt-models/references/models/*.md` + `_index.md` | Modify (structure) |
| `skills/README.md` | Modify (index entry) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
None.

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Model-keyed router | §2 has discovery + guarded load + routing-key + multi-tier fallback per the template |
| REQ-002 | README spec-ref clean | No ephemeral spec/phase/arc refs; hub identity; HVR-clean |
| REQ-003 | Profiles conform | Each of 9 has `## 1. OVERVIEW` + 7 numbered ALL-CAPS H2s; scaffold code-block headers untouched |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: SKILL.md §2 matches the smart-router pattern; SKILL.md ≤ 300 LOC.
- **SC-002**: `grep` finds no ephemeral spec refs in the hub README; 0 em-dashes/semicolons.
- **SC-003**: all 9 profiles have 7 numbered ALL-CAPS sections; no Title-Case leftovers; content preserved.
- **SC-004**: card-sync guard green; `validate.sh --recursive --strict` exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Router pushes SKILL.md over the old 200-LOC cap | Low | Relaxed cap to 300 (template requires inline router) |
| Risk | Agent recasing touches code-block scaffold headers | Med | Verified fence-aware: only numbered document H2s changed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Profile benchmark-id citations stay as-is here; repointed in phase 011.
<!-- /ANCHOR:questions -->

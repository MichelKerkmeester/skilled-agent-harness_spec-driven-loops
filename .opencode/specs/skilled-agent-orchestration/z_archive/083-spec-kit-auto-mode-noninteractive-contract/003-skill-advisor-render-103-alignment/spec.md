---
title: "Phase 103/003 — Skill Advisor Render-Layer 103-Alignment (absorbs cancelled 027/005)"
description: "Absorb the cancelled 027/005 renderer wording change into the 103 noninteractive routing contract. Strengthen render.ts output to MUST invoke FIRST only after the existing threshold gate passes, with first-action hints owned by the render layer."
trigger_phrases:
  - "103 phase 003"
  - "skill advisor render 103 alignment"
  - "render.ts MUST invoke FIRST"
  - "advisor first-action under 103 contract"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/z_archive/083-spec-kit-auto-mode-noninteractive-contract/003-skill-advisor-render-103-alignment"
    last_updated_at: "2026-05-11T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet per pt-04 audit"
    next_safe_action: "Implement render.ts wording and FIRST_ACTION_HINT map without touching scorer logic"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-11-103-003-skill-advisor-render-103-alignment-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "pt-04 user decision: cancelled 027/005 renderer wording change is absorbed into 103/003"
---
# Feature Specification: Skill Advisor Render-Layer 103 Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 103/003 absorbs the render-layer wording change formerly proposed in `../../../system-spec-kit/027-xce-research-based-refinement/005-skill-advisor-first-action-mandate/`. The pt-04 audit found that 027/005 overlaps the 103 noninteractive contract and should not create a second vocabulary for "MUST invoke FIRST" behavior. This packet moves the small renderer change under 103, where `:auto` routing language is now the single source of truth.

The implementation is intentionally render-layer only. `mcp_server/skill_advisor/lib/render.ts:124-133` already gates recommendations through `passes_threshold`. This packet preserves that gate and changes the emitted recommendation wording at `render.ts:155-157` from soft "use ${label}" to "MUST invoke ${label} FIRST — ${action_hint}" only when the threshold gate has passed.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Spec-Scaffolded |
| **Created** | 2026-05-11 |
| **Branch** | `main` |
| **Parent Packet** | `103-spec-kit-auto-mode-noninteractive-contract` |
| **Depends on** | `103/001-deep-review-three-tier-setup`; `103/002-auto-mode-contract-generalization-to-all-commands` |
| **Source** | `../../system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-04/research.md`; absorbs `../../../system-spec-kit/027-xce-research-based-refinement/005-skill-advisor-first-action-mandate/` (cancelled 2026-05-11) |
| **LOC budget** | ~80-120 production + ~50-80 tests |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The skill advisor renderer still emits soft wording around the top recommendation: `render.ts:155-157` says to use a label rather than requiring the first action. The cancelled 027/005 packet proposed a stronger XCE-style mandate, but pt-04 found that this belongs under the 103 noninteractive routing contract because 103 already owns the shared vocabulary for autonomous command routing.

The scorer should not be changed. The existing threshold gate at `render.ts:124-133` remains the authority for when a recommendation is strong enough. The render layer only changes the wording after `passes_threshold === true`, and only then may it emit "MUST invoke FIRST".

### Purpose

Align skill-advisor brief wording with 103's noninteractive routing vocabulary while keeping the scorer untouched. A passing recommendation should tell the agent exactly what to do first; a non-passing or ambiguous recommendation should keep the existing caution semantics.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Modify `mcp_server/skill_advisor/lib/render.ts`.
- Strengthen the normal passing recommendation at `render.ts:155-157` from soft `use ${label}` wording to:

```text
MUST invoke ${label} FIRST — ${action_hint}
```

- Emit the mandate only when `passes_threshold === true`.
- Preserve the threshold gate at `render.ts:124-133`.
- Add a per-skill `FIRST_ACTION_HINT` constant map covering all currently shipped skills.
- Add a safe fallback action hint for unknown future labels.
- Update render-layer tests and string fixtures that pin the old "use ${label}" wording.

### Out of Scope

- No scorer surgery.
- No files under `mcp_server/skill_advisor/lib/scorer/`.
- No threshold tuning.
- No command `:auto` contract edits.
- No changes to 027/005 except the already-existing cancellation record.
- No dynamic intent-to-action selection beyond the static render-layer hint map.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/skill_advisor/lib/render.ts` | Modify | Add `FIRST_ACTION_HINT`; strengthen passing recommendation wording |
| Existing render tests | Modify/Create | Assert mandate wording, threshold gate preservation, fallback hint, and fixture migration |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `render.ts` emits "MUST invoke ${label} FIRST — ${action_hint}" only when `passes_threshold === true`. | Passing fixture includes mandate; failing or ambiguous fixture does not include mandate wording. |
| REQ-002 | Preserve `render.ts:124-133` threshold gate semantics. | No scorer or threshold logic changes; tests still cover below-threshold and high-uncertainty cases. |
| REQ-003 | Add `FIRST_ACTION_HINT` map covering all currently shipped skills. | Map includes every currently shipped skill label used by skill advisor output; no known skill renders `undefined`. |
| REQ-004 | Add safe fallback hint. | Unknown label renders a generic first action such as "open the skill instructions first". |
| REQ-005 | Keep `lib/scorer/` untouched. | `git diff -- mcp_server/skill_advisor/lib/scorer` is empty. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Render tests migrate old "use ${label}" fixtures intentionally. | Tests assert directive shape instead of brittle old phrase. |
| REQ-007 | Longest label plus longest hint stays within the render cap. | Cap fixture proves output remains bounded by existing `capText` behavior. |
| REQ-008 | Hints match the skill's first safe action. | Manual review: system-spec-kit mentions gates/spec folder, mcp-coco-index mentions semantic search, sk-code mentions stack detection, sk-doc mentions doc templates. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `render.ts` contains `FIRST_ACTION_HINT`.
- **SC-002**: Passing threshold output contains `MUST invoke`.
- **SC-003**: Failing threshold output does not contain `MUST invoke`.
- **SC-004**: `mcp_server/skill_advisor/lib/scorer/` has no diff.
- **SC-005**: Focused render tests pass.
- **SC-006**: 103 remains the single owner of the first-action noninteractive vocabulary.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 103/001 and 103/002 | This packet assumes the noninteractive contract exists. | Keep this as child phase 003 under 103. |
| Risk | "MUST invoke FIRST" leaks into low-confidence output. | Medium | Gate strictly on `passes_threshold === true`; add failing-threshold fixture. |
| Risk | Static hint map drifts as skills are added. | Low | Safe fallback prevents undefined output; future inventory changes can add hints. |
| Risk | Tests overfit exact phrasing. | Low | Assert directive shape and gate behavior, not every punctuation detail. |
| Risk | Scope slips into scorer thresholds. | Medium | Mark `lib/scorer/` out of scope and verify no diff. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. The pt-04 audit and user direction place this renderer change under 103/003.
<!-- /ANCHOR:questions -->

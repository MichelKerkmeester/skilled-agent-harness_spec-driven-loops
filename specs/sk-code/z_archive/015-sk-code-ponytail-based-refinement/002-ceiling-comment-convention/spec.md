---
title: "Phase 2: Intentional-Simplification (ceiling:) Comment Convention"
description: "Define a neutral 'ceiling:' comment convention for deliberate shortcuts in sk-code, and let sk-code-review treat a present ceiling comment as P2-downgrade evidence against over-engineering false positives. Never the ponytail brand; never in the comment-hygiene allow-list."
trigger_phrases:
  - "phase 2 ceiling comment"
  - "intentional simplification convention"
  - "ceiling comment downgrade"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/015-sk-code-ponytail-based-refinement/002-ceiling-comment-convention"
    last_updated_at: 2026-06-13T11:40:00Z
    last_updated_by: claude-opus
    recent_action: "Phase 2 stub created from 146 research recs #4/#5"
    next_safe_action: "/speckit:plan this phase, then implement the convention + downgrade rule"
---
# Phase 2: Intentional-Simplification (ceiling:) Comment Convention

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Parent** | `142-sk-code-ponytail-based-refinement` (phase 2 of 6) |
| **Source recs** | research.md #4 (neutral ceiling convention), #5 (P2-downgrade evidence) |
| **Depends on** | Phase 1 (shares the §7 KISS area); #5 needs the #4 convention to exist first |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Deliberate simplifications (a global lock, an O(n²) scan chosen on purpose) read as ignorance, not intent — and reviewers flag them as "too simple." Ponytail marks them with a comment naming the shortcut + its ceiling + the upgrade path; the content is durable WHY (allowed by comment-hygiene), but the literal `ponytail:` brand is a perishable label. Purpose: adopt a neutral `ceiling:` convention and let the reviewer trust it to suppress over-engineering false positives — without ever excusing a real defect.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Document a neutral `ceiling:` comment convention (shortcut + known ceiling + upgrade path) in sk-code's comment-policy doc.
- A sk-code-review rule: a concrete ceiling comment is P2-downgrade/suppress evidence for "too simple / missing-feature" KISS/YAGNI findings only.

### Out of Scope
- Adding `ceiling:` to comment-hygiene `ALLOWED_PATTERNS` (DO-NOT-ADOPT — allowed patterns run before violation patterns and would create a same-line bypass).
- The literal `// ponytail:` brand prefix.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/references/universal/code_style_guide.md` | Update | Document the neutral `ceiling:` convention as durable-WHY. |
| `.opencode/skills/sk-code-review/references/code_quality_checklist.md` | Update | §7: a present ceiling comment is P2-downgrade evidence (never for security/correctness). |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Neutral convention documented | `code_style_guide.md` describes `ceiling:` content (not the brand); confirms it must NOT be added to `ALLOWED_PATTERNS`. |
| REQ-002 | Reviewer downgrade rule | sk-code-review treats a concrete ceiling comment as P2-downgrade evidence for KISS/YAGNI-only findings. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Security/correctness floor preserved | The downgrade NEVER applies to security, auth, persistence, sandboxing, public-contract, or correctness findings. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A deliberately-simple block with a `ceiling:` comment is not flagged as "too simple."
- **SC-002**: The comment-hygiene checker behavior is unchanged (no allow-list bypass introduced).

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Ceiling comments rot / become an excuse to skip fixes | Hidden debt | Reviewer verifies the stated ceiling still matches the current requirement. |
| Dependency | Phase 1 (same §7 area) + the #4 convention before #5 | Ordering | Sequence #4 then #5; land after Phase 1. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-S01**: The downgrade rule is bounded by an explicit never-suppress-security/correctness clause.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Vague ceiling comment** ("simple for now"): worse than none — the convention requires naming the ceiling AND the upgrade trigger.
- **Ceiling comment on a security shortcut**: never downgrades; the floor clause overrides.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Final prefix choice (`ceiling:` vs `intentional-limit:`) — decide during plan.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Research**: `../research/research.md` (recs #4, #5)
- **Sibling**: `../001-skreview-checklist-rows` (false-positive pairing)

<!-- /ANCHOR:related-docs -->

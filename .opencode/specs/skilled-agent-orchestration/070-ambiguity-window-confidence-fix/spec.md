---
title: "Feature Specification: Ambiguity Window Confidence Fix"
description: "Widen the skill-advisor ambiguity detector to also flag close-confidence top-2 candidates, not only close-score, so cross-domain prompts surface as ambiguous instead of overstated."
trigger_phrases:
  - "ambiguity window"
  - "ambiguous flag"
  - "confidence margin"
  - "SAD-002"
  - "scorer ambiguity"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/070-ambiguity-window-confidence-fix"
    last_updated_at: "2026-05-06T13:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Spec authored"
    next_safe_action: "Patch lib/scorer/ambiguity.ts dual-margin"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/ambiguity.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/scorer/advisor-quality-049-003.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/feature_catalog/04--scorer-fusion/03-ambiguity.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-084"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Ambiguity Window Confidence Fix

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-06 |
| **Branch** | `main` |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
SAD-002 (manual playbook) verified the ambiguity contract but exposed a calibration gap: the scorer flagged the cross-domain prompt "Review the OpenCode docs and improve the prompt package for a release note workflow" as `ambiguous: false` even though the top-2 confidences (sk-code 0.9287 vs sk-prompt 0.8888) were within 0.04 of each other. The current detector (in `lib/scorer/ambiguity.ts`) only compares `score` (gap 0.078, just over the 0.05 margin), not `confidence` (gap 0.04, well within 0.05). The feature catalog at `feature_catalog/04--scorer-fusion/03-ambiguity.md` already documents this as a "0.05 confidence window" — so docs and code disagree.

The F-012-C2-04 fix that introduced score-based ambiguity did so for ranking-alignment reasons (top-two-by-confidence may not be top-two-by-score). That reason still holds, so reverting to confidence-only would re-introduce the original mismatch.

### Purpose
Add a parallel **confidence-margin** check so a candidate is in the ambiguity cluster if EITHER the score OR the confidence is within 0.05 of the top. Score-margin keeps ranking alignment; confidence-margin catches user-visible near-ties. Update the feature catalog and the two vitest fixtures that pin the previous score-only semantics.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `lib/scorer/ambiguity.ts`: add `AMBIGUITY_CONFIDENCE_MARGIN = 0.05` and OR check in `ambiguousCluster`
- `tests/scorer/native-scorer.vitest.ts`: separate confidences in the "outside score margin" fixture so the dual-margin check still says "not ambiguous"
- `tests/scorer/advisor-quality-049-003.vitest.ts`: update the F-012-C2-04 "uses ranking score not confidence" test to reflect dual-margin, AND add a new "score outside, confidence inside → ambiguous" test for the SAD-002 case
- `feature_catalog/04--scorer-fusion/03-ambiguity.md`: clarify dual-margin semantics
- Build (`npm --prefix .opencode/skills/system-spec-kit/mcp_server run build`)
- Vitest pass on the two updated suites
- Re-run SAD-002 (advisor_recommend on the cross-domain prompt) and confirm `ambiguous: true`

### Out of Scope
- Changing AMBIGUITY_MARGIN (score margin) — stays at 0.05
- Changing fusion ranking logic — score remains the ranking surface
- Adjusting `ambiguousWith` rendering in `lib/render.ts`
- New shadow-model ambiguity behavior

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/ambiguity.ts` | Modify | Add confidence-margin OR check |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Modify | Separate confidences in outside-margin fixture |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/scorer/advisor-quality-049-003.vitest.ts` | Modify | Update F-012-C2-04 test fixtures + add SAD-002 test |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/feature_catalog/04--scorer-fusion/03-ambiguity.md` | Modify | Clarify dual-margin semantics |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Dual-margin OR check | `ambiguousCluster` returns members where score gap ≤ 0.05 OR confidence gap ≤ 0.05 |
| REQ-002 | Existing F-012-C2-04 ranking-alignment property preserved | A pair with score outside margin AND confidence outside margin is NOT ambiguous (ranking still drives ambiguity) |
| REQ-003 | SAD-002 contract met | advisor_recommend on the cross-domain prompt returns `ambiguous: true` after the fix |
| REQ-004 | All scorer vitest suites pass | `vitest run native-scorer advisor-quality-049-003` exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Feature-catalog and code agree | `04--scorer-fusion/03-ambiguity.md` describes the same dual-margin rule that ambiguity.ts implements |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `vitest run` on the two updated scorer suites exits 0.
- **SC-002**: SAD-002 re-run reports `ambiguous: true` and lists `sk-prompt` in `recommendations[0].ambiguousWith`.
- **SC-003**: SAD-001 (system-spec-kit recommendation) still PASS — single-winner case unaffected.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Hidden vitest fixtures elsewhere assume score-only ambiguity | Other suites fail | Run full vitest after focused suites pass; spot-check failures |
| Risk | Dual-margin produces over-ambiguity in production traffic | Routing degraded | Margin stays at 0.05 (same as score margin); behavior change is narrow — only catches near-tied confidence with mid-gap score |
| Dependency | npm + tsc build infrastructure | Cannot test fix | Build was current at SAD-003; if drift, rebuild |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

_(none — calibration is deliberate at 0.05 to match existing score margin)_

<!-- /ANCHOR:questions -->

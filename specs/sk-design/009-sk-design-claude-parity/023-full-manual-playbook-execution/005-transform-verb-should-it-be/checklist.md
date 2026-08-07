---
title: "Verification Checklist: Wave 005 - Transform Verb 'should it be' Framing"
description: "Verification Date: 2026-07-07 - all checklist items verified with evidence"
trigger_phrases:
  - "verification"
  - "checklist"
  - "wave 005 checklist"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/005-transform-verb-should-it-be"
    last_updated_at: "2026-07-07T17:18:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Filled in evidence for all checklist items"
    next_safe_action: "Write implementation-summary.md, run validate.sh --strict"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-005-should-it-be"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Wave 005 - Transform Verb "should it be" Framing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Read all 3 constituent scenario files (`should-it-be-audit.md`, `clarify-alias-only.md`, `foundations-excluded-aliases.md`) in full for exact prompts and Pass/Fail Criteria before running any dispatch (verified)
- [x] CHK-002 [P1] Confirmed the 5 assigned dispatch IDs (TV-002-V2, TV-002-V3, TV-002-V4, TV-003, TV-004) against the task brief, excluding TV-002-V1 which belongs to a different wave (verified)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every dispatch used the exact clean scenario prompt text for the advisor probe (no addendum) and the exact clean prompt + standard addendum for the live dispatch, no deviation from the validated recipe (verified)
- [x] CHK-011 [P1] `</dev/null` included on every `opencode run` invocation to avoid the stdin-hang failure mode; all 5 dispatches exited within timeout with `EXIT_CODE=0` (verified)
- [x] CHK-012 [P1] NO_TARGET_CLAUSE decision documented per-dispatch with reasoning (TV-003 included it for the named "this hero section" target; TV-002-V2/V3/V4 and TV-004 correctly omitted it — none name a hypothetical local UI surface) (verified)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] TV-002-V2: advisor probe run, live dispatch run, transcript saved, graded against `should-it-be-audit.md`'s PASS criterion -> **PASS** (verified)
- [x] CHK-021 [P0] TV-002-V3: advisor probe run, live dispatch run, transcript saved, graded against `should-it-be-audit.md`'s PASS criterion -> **PASS** (verified)
- [x] CHK-022 [P0] TV-002-V4: advisor probe run, live dispatch run, transcript saved, graded against `should-it-be-audit.md`'s PASS criterion -> **FAIL** (no skill routing occurred at all) (verified)
- [x] CHK-023 [P0] TV-003: advisor probe run, live dispatch run, transcript saved, graded against `clarify-alias-only.md`'s PASS criterion -> **FAIL** (resolved `foundations`, not `interface`) (verified)
- [x] CHK-024 [P0] TV-004: advisor probe run, live dispatch run, transcript saved, graded against `foundations-excluded-aliases.md`'s explicit FAIL trigger -> **FAIL** (`design-foundations` loaded, justified by typeset/colorize wording) (verified)
- [x] CHK-025 [P1] Every verdict rationale in `dispatch-log.md` quotes or closely paraphrases the specific scenario criterion line it rests on, not a generic bar, confirmed by direct re-read against the 3 scenario files (verified)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-P0-001 [P0] All 5 assigned dispatches ran, one at a time, sequentially (no parallel/backgrounded self-dispatch within this wave) (verified)
- [x] CHK-P0-002 [P0] `dispatch-log.md` contains one row per dispatch with dispatch_id, scenario_id, exact prompt, advisor top-1/confidence, resolved mode/packet/resources, verdict, and rationale (verified)
- [x] CHK-P1-003 [P1] Cross-cutting finding (advisor-probe vs. live-dispatch disagreement on TV-002-V2/V3; TV-002-V4 as the case where both agree-fail) documented in `dispatch-log.md`'s Summary section (verified)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P2] No repo files modified by any of the 5 dispatches themselves (all standalone evaluation calls per the dispatch-note addendum); TV-004's dispatch attempted an Open Design artifact read/list (read-only, target unreachable) and correctly stopped rather than fabricating guidance for an unresolved target (verified)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`implementation-summary.md` synchronized with the actual 5 dispatches run and graded (verified)
- [x] CHK-041 [P2] Known Limitations in `implementation-summary.md` honestly documents that this wave observes/grades only — it does not remediate the 3 routing gaps it found (verified)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Confirmed via directory listing that sibling wave folders (`001`-`004`, `006`-`007`) were empty before this wave started, and this wave wrote only to its own `005-transform-verb-should-it-be/` folder (verified)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 6 | 6/6 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-07-07
<!-- /ANCHOR:summary -->

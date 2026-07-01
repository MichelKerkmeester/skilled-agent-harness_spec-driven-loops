---
title: "Implementation Plan: Validate.sh Template-Scaffold Detection"
description: "Plan for adding the SCAFFOLD_NEVER_TOUCHED validate.sh rule."
trigger_phrases:
  - "validate.sh template detection plan"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/009-research-backlog-remediation/010-validate-sh-template-detection"
    last_updated_at: "2026-07-01T08:30:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan"
    next_safe_action: "Dispatch implementation to MiMo v2.5 ultraspeed via cli-opencode"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Validate.sh Template-Scaffold Detection

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Read `validate.sh`'s existing `PLACEHOLDER_FILLED` rule implementation as the structural pattern to mirror (severity table entry, check function, summary line). Add a new function that, for each required doc in a folder, checks for the title/packet_pointer/last_updated_by scaffold-signature markers and cross-checks against the folder's own claimed Status. Wire it into the same rule-execution loop and summary output as the existing rules.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- New rule doesn't change behavior of any existing rule.
- Correctly distinguishes "genuinely complete" from "scaffold signature present + Complete claimed."
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Mirror the existing rule pattern exactly** rather than inventing a new check-registration mechanism — consistency with `PLACEHOLDER_FILLED` keeps the script maintainable.
- **Narrow, signature-based detection**, not broad heuristic guessing — checks the 3 specific fields research.md identified, not a fuzzy "looks unfinished" heuristic that could false-positive on legitimately terse-but-real docs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Read the existing `PLACEHOLDER_FILLED` rule as the pattern reference.
2. Implement `SCAFFOLD_NEVER_TOUCHED` following the same structure.
3. Test against a fixture reproducing 008's pre-fix state, and against a genuinely complete folder.
4. Confirm it now passes against 008 post-child-007-fix.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

1. Fixture test: scaffold-signature + Complete claim → fails.
2. Fixture test: genuinely complete folder → passes.
3. Regression: existing validate.sh test suite (if any) still passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Sequenced after child 007 (fixes 008's actual scaffold state) so this phase's own validation run against the packet doesn't fail on already-known, already-scheduled-for-fix drift.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit touching validate.sh.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## 8. AFFECTED SURFACES (reference)

| Surface | Change |
|---------|--------|
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | New rule |
<!-- /ANCHOR:affected-surfaces -->

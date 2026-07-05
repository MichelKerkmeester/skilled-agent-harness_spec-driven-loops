---
title: "Implementation Plan: Runtime Hygiene Fixes"
description: "Plan for removing 6 comment-hygiene markers, fixing the salvage/duplicate-filename naming defect, and adding a lint rule."
trigger_phrases:
  - "runtime hygiene fixes plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/009-research-backlog-remediation/003-runtime-hygiene-fixes"
    last_updated_at: "2026-07-01T07:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan"
    next_safe_action: "Dispatch implementation to MiMo v2.5 ultraspeed via cli-opencode"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_review_auto.yaml"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Runtime Hygiene Fixes

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Three independent-but-related cleanups: (1) delete 6 confirmed `<!-- F-\d+-... -->` HTML comments from two YAML files (mechanical, low-risk); (2) zero-pad the iteration number at `fanout-salvage.cjs:112` so placeholder filenames match the canonical convention used elsewhere in the runtime (check `state_paths.iteration_pattern` or wherever the real reducer generates `iteration-NNN.md` for the exact padding width, likely 3 digits); (3) investigate whether the codex zero-finding registry is actually explained by (2), by tracing the specific reducer/registry-build code path that reads iteration files for a review lineage.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Zero marker hits repo-wide after the fix (not just the 6 originally cited — a fresh grep might surface more).
- New salvage-naming test RED before, GREEN after.
- Root cause of the codex 0-finding registry documented with evidence, not assumed.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Delete markers, keep any real rationale.** Where a marker sits next to genuinely useful prose explaining a decision, keep the prose and only strip the ephemeral ID; where the marker was the only content, just delete the line.
- **Fix the write side (salvage), not just the read side.** Zero-padding at the point of writing is more robust than trying to make every downstream consumer tolerate two naming conventions.
- **Confirm before declaring fixed.** Read the actual reducer code that produced codex's 0-finding registry rather than accepting glm's hypothesis as proven.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Remove the 6 confirmed markers; grep the whole repo for the same pattern to catch any missed instances.
2. Add the comment-hygiene lint rule; confirm it catches a reintroduced marker in a test fixture.
3. Fix `fanout-salvage.cjs:112` zero-padding.
4. Trace the actual reducer code path for codex's registry to confirm/refute the hypothesis.
5. If feasible, re-run the reducer against codex's 50 real iterations to backfill its findings; otherwise document as a follow-up.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

1. `grep -rn "F-[0-9]\+-[A-Z0-9]\+-[0-9]\+" .opencode/commands .opencode/skills` returns nothing post-fix.
2. New test: salvage placeholder for iteration 1 is written as `iteration-001.md`.
3. Full `deep-loop-runtime` Vitest suite stays green.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. Marker removal and filename-padding are pure code/doc changes with no state migration.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## 8. AFFECTED SURFACES (reference)

| Surface | Change |
|---------|--------|
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | Remove 3 markers |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Remove 3 markers |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs` | Zero-pad placeholder filenames |
| `validate.sh` or pre-commit hook | New comment-hygiene lint |
<!-- /ANCHOR:affected-surfaces -->

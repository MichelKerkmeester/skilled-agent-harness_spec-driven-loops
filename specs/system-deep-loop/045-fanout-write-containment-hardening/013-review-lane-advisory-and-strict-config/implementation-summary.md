---
title: "Implementation Summary"
description: "The empty-registry advisory reads the right field per loop type and the containment schema rejects unknown keys by name."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/045-fanout-write-containment-hardening/013-review-lane-advisory-and-strict-config"
    last_updated_at: "2026-09-14T17:44:17Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Fixed the review-lane advisory and made the containment schema strict; filled the packet docs"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-review-lane-advisory-and-strict-config"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-review-lane-advisory-and-strict-config |
| **Completed** | 2026-09-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

The empty-registry advisory no longer misfires on review lanes, and a stale config key fails loudly. In `runtime/scripts/fanout-run.cjs` a per-loop field map lets `hasLineageRegisteredFindings` read `keyFindings` for research and `openFindings` for review, and the check is exported so it can be replayed over real lineages. In `runtime/lib/deep-loop/executor-config.ts` the containment object is strict, and because the fan-out config is a union whose branch failures collapse to a bare message, the parser now reports the closest branch's issue so the offending key, such as the removed `worktrees`, appears in the thrown error. Replayed over the two retained review lineages, the check returns no warning for either.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One dispatch to DeepSeek V4.1 Flash at max through the gateway on cli-pi. Both new tests were run against the unmodified code first: the review fixture raised the warning and the schema accepted the key. The delegate flagged the union normalization as its one judgment call, needed for the key to reach the message. The orchestrator reviewed the diff and ran the whole suite before committing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Map the field per loop rather than accept either field for both | A research lane whose registry only had open findings would be a different defect |
| Name the closest union branch | Strictness that reports only Invalid input is not actionable |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Review-lane and rejected-key tests against unmodified code | FAIL as expected on both |
| Both touched test files plus typecheck | PASS, exit 0, 250 tests |
| Retained review lineages | null for both |
| Full deep-loop suite | `npm test` in the runtime: 152 files, 2619 passed, 8 skipped, exit 0, 1230 s |
| `validate.sh --strict` on this phase | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Scope of strictness.** Only the containment object is strict; other config objects keep their existing leniency.
<!-- /ANCHOR:limitations -->

---



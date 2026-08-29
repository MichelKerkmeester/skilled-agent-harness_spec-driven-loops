---
title: "Implementation Summary: One Validation Verdict, Honestly Earned"
description: "The verdict flip is reproduced and its cause identified; the four fixes are planned and none is implemented yet."
trigger_phrases:
  - "validation gate coherence status"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/040-validation-gate-coherence"
    last_updated_at: "2026-08-29T10:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Reproduced the verdict flip and identified the rule responsible"
    next_safe_action: "Capture baseline verdicts across engine selections before changing the gating"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-authoring"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Implementation Summary: One Validation Verdict, Honestly Earned

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 040-validation-gate-coherence |
| **Status** | In Progress |
| **Level** | 2 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This records a reproduced defect and the plan to fix it, so the
finding is not carried in someone's head.

The completion gate returns different answers for the same packet depending on
the caller's environment. Reproduced on a real packet in
`.opencode/skills/system-spec-kit/scripts/spec/validate.sh`: the default engine
returns `FAILED` with exit 2, and the same command with the legacy engine
selected returns `PASSED` with exit 0.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The defect surfaced during an independent audit of the validation surface and
was reproduced directly rather than accepted from the report. The responsible
rule was then isolated by comparing which findings each engine emitted for the
same folder.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Rationale |
|----------|-----------|
| Fix the verdict before anything else | Every other measurement of the gate is meaningless while the answer depends on the environment |
| Land each change separately | The blast radius is every completion claim; a single cutover would make a regression hard to attribute |
| Move the repository-wide check rather than delete it | It reports a real fault; only its placement inside a per-packet gate is wrong |
| Merge the duplicated finding rather than drop one | Both detail lists carry information; only the double count is the defect |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Verdict flip reproduced | PASS | Same packet, same flags: default engine `FAILED` exit 2, legacy engine `PASSED` exit 0 |
| Responsible rule identified | PASS | The freshness rule is gated on a feature flag in one engine and runs unconditionally under strict in the other; the flag was unset while the rule still fired |
| Baseline across engine selections | PENDING | Not yet captured |
| Any fix implemented | PENDING | None |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nothing is fixed yet.** This packet currently records a defect and a plan.
2. **The engine question is unowned.** Whether the older engine is deleted or
   kept behind an explicit flag changes what happens in a checkout with no
   build, and that decision needs someone who owns fresh-clone behaviour.
3. **The failure-rate claim is sampled, not exhaustive.** Under a third of
   packets pass strict cleanly in a sample of 137; the whole-corpus figure has
   not been measured.

<!-- /ANCHOR:limitations -->

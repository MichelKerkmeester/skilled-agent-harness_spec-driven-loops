---
title: "Research Summary: Native Bridge Paths for Cursor & Devin Models in cli pi"
description: "Outcome of the two-model forced-depth deep-research run: not-feasible-now verdict, keep cli-cursor/cli-devin shell-out; both models corroborate."
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/045-cli-pi-bridge-cursor-devin/001-research-bridge-possibilities"
    last_updated_at: "2026-08-17T11:46:00Z"
    last_updated_by: "claude"
    recent_action: "Two-model research consolidated; verdict recorded"
    next_safe_action: "Close packet; revisit only if a vendor completions surface ships"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/lineages/grok-cursor/research.md"
      - "research/lineages/glm-devin/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "research-045-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Research Summary: Native Bridge Paths for Cursor & Devin Models in cli pi

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Complete |
| **Branch** | `skilled/v4.0.0.0` |
| **Completed** | 2026-08-17 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

A consolidated two-model research synthesis answering whether `cli pi` can natively expose Cursor and Devin subscription-backed models in its `/model` picker.

### Files Changed

| File | Change |
|------|--------|
| `research/research.md` | Consolidated cross-model synthesis with the ranked verdict |
| `research/lineages/grok-cursor/research.md` | Grok-4.6-xhigh per-model synthesis (5 iterations) |
| `research/lineages/glm-devin/research.md` | GLM-5.2-High per-model synthesis (5 iterations) |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two independent forced-depth deep-research lineages ran on different executors (Grok-4.6-xhigh via cli-cursor; GLM-5.2-High via cli-devin), each completing all five iterations against the live pi/cursor/devin CLI surfaces and the vendors' Terms of Service. Both syntheses were recovered from their lineage dirs and consolidated, leading with their agreement.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Verdict: not-feasible-now.** No path is both a raw completions row in pi's picker and ToS-permitted; keep the existing `cli-cursor`/`cli-devin` executor dispatch.
- **Two-model design.** Running Grok and GLM independently provided cross-model validation; both reached the same verdict.
- **Implementation deferred.** Per the parent's phase-transition rule, no implementation phase opens unless a vendor ships a completions surface (tracked as open feature requests).

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

- Objective gate: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/cli-external-orchestration/045-cli-pi-bridge-cursor-devin --recursive --strict` → parent PASSED (0 errors).
- Iteration artifacts present: `ls research/lineages/*/iterations/` → 5 + 5 iteration files; `grep -l FANOUT_LINEAGE_COMPLETE research/lineages/*/logs/fanout-lineage.out` → both lineages emitted the completion sentinel.
- Every finding cites a live CLI surface, config path, or official ToS section.
- Cross-model agreement confirmed across all five sub-questions (see `research/research.md` §2).

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- Both lineages were marked write-containment failures by the fan-out guard after producing their syntheses (an unrelated session-side-effect interaction, tracked separately); the syntheses were recovered intact.
- Residual UNKNOWNs remain (consumer Devin `cog_` key path; Cursor's stance on CLI-spawn gateways), documented in `research.md`.

<!-- /ANCHOR:limitations -->

---
title: "Implementation Summary: cli-copilot Total Deprecation"
description: "Skeleton placeholder. Populated post-execution with diff stats, batch outcomes, advisor smoke-test output, code-graph delta, and deviations from plan."
trigger_phrases:
  - "cli-copilot deprecation summary"
  - "081 implementation summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/081-cli-copilot-deprecation-due-to-price-hike"
    last_updated_at: "2026-05-06T12:45:00.000Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Created implementation-summary.md skeleton"
    next_safe_action: "Populate after B1-B7 execution"
    blockers: []
    completion_pct: 50
---

# Implementation Summary

<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Packet** | `081-cli-copilot-deprecation-due-to-price-hike` |
| **Parent** | `skilled-agent-orchestration` |
| **Level** | 2 |
| **Started** | 2026-05-06 |
| **Completed** | TBD (post-execution) |
| **Final commit** | TBD |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

TBD post-execution. Will list:

- Skill folder deletion (`.opencode/skill/cli-copilot/`)
- Global changelog deletion (`.opencode/changelog/cli-copilot/`)
- Hook + adapter deletion (5 individual files)
- 4 copilot-specific feature catalog / playbook docs deleted
- Skill advisor scoring tables purged of cli-copilot
- 4 sibling cli-* skill bodies edited
- 4 multi-ai-council agent variants edited
- 3 spec_kit command files edited
- 7 routing docs edited
- ~20 cross-skill playbook references edited
- Matrix runner cluster trimmed
- Memory entry annotated with deprecation marker
- Re-index sweep complete

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

TBD post-execution. Will document:

- 7-batch dispatch via cli-codex (gpt-5.5 medium, fast mode)
- Up to 5 parallel agents at peak
- Batch sequencing rules (B1 → B2 → B3 → B4 → B5 → B6 → B7)
- File-locking for shared-write surfaces (B2 advisor, B5 routing docs)
- Mirror-sync constraint for B4 (multi-ai-council across 4 runtimes)
- Wall-clock timing per batch
- Deviations from plan (if any)

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

TBD post-execution. Pre-recorded decisions from spec.md §7:

- Sibling cli-* skill bodies are EDITED, not deleted.
- Memory entry `feedback_copilot_concurrency_override.md` is ANNOTATED, not deleted.
- `AGENTS_Barter.md` symlink is OUT OF SCOPE.
- Two copilot-only feature-catalog docs (target-authority-helper, copilot-compact-cache-parity) are DELETED, not edited.

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

TBD post-execution. Will cite:

- Live-config grep gate output
- `validate.sh --strict` exit code
- Skill advisor smoke test outputs (2 phrasings)
- `code_graph_scan` pre/post file count + edge count delta
- `skill_graph_scan` cli-copilot node absence confirmation
- Mirror parity diff
- Final checklist walk (22/22 P0, 7/7 P1, 1/1 P2)

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

TBD post-execution. Anticipated:

- Historical mentions in `specs/`, `z_archive/`, `memory/` (other than the annotated entry) preserved by design.
- `cli-opencode/changelog/v1.*.md` historical mentions of cli-copilot may remain (changelog is record, not config).
- Vendor packages (`node_modules/@github/copilot-sdk/`, `litellm/llms/github_copilot/`) not touched — they are third-party and unrelated.

<!-- /ANCHOR:limitations -->

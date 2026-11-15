---
title: "Decision Record: Phase 9: deep-loop-executor-kind"
description: "Why two existing executor-config test cases were edited when the cli-mistral-vibe kind landed, and why AC-012 is superseded rather than met."
trigger_phrases:
  - "deep loop executor kind decision record"
  - "ac-012 superseded rationale"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind"
    last_updated_at: "2026-11-14T22:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded why AC-012 is superseded"
    next_safe_action: "Reference when reviewing the executor-config test diff"
    blockers: []
    completion_pct: 100
---
# Decision Record: Phase 9: deep-loop-executor-kind

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Two existing test cases change with the new kind, so AC-012 is superseded

<!-- ANCHOR:adr-001-context -->
**Context.** AC-012 asked that no existing case in the three executor unit suites be edited, proven by `git diff -U0` showing no removed line. Adding `cli-mistral-vibe` removed three lines, all in `tests/unit/executor-config.vitest.ts`:

- The kind-count case asserted `toHaveLength(8)` and named eight kinds in its title. With nine kinds the old assertion is false, so it now asserts 9.
- The web-search matrix case built a model id as `` `${kind}-model` `` for every non-native kind. The Vibe kind enforces a model allowlist at parse time, so `cli-mistral-vibe-model` is rejected before the web-search policy is reached. The case now takes `VIBE_SUPPORTED_MODELS[0]` for that one kind. The expression still yields `` `${kind}-model` `` for the eight older kinds, so their coverage is unchanged.

Both edits follow from the new kind. Neither can be avoided without dropping the kind from the exhaustive list the cases iterate.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
**Decision.** Mark AC-012 `Superseded` and add AC-013. AC-013 keeps what AC-012 was protecting: zero failures, more passes than the 365 baseline, and only the two cases above edited, each forced by the new kind.

The agent made this decision under the operator's 2026-11-14 instruction that phases 004 to 012 run with no further operator decisions after planning. The operator can reverse it.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
**Alternatives declined.**

- **Leave the old cases and add new ones beside them.** The count case would fail, and the matrix case would throw on the Vibe kind. Two red cases are worse than two edited ones.
- **Exclude the Vibe kind from the matrix loop.** This would leave the web-search policy untested for the new kind.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
**Consequence.** AC-012 is superseded by AC-013. The edited lines are the kind count at `executor-config.vitest.ts:45` and the matrix model expression near line 525.
<!-- /ANCHOR:adr-001-consequences -->
<!-- /ANCHOR:adr-001 -->

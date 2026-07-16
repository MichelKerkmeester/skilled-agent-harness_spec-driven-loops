---
title: "Implementation Summary: Phase 2: cli-claude-code Frontmatter Alignment"
description: "All 6 cli-claude-code reference/asset docs now conform to the canonical contract; first net-new authoring phase of the campaign."
trigger_phrases:
  - "cli-claude-code frontmatter summary"
  - "frontmatter authoring complete"
  - "claude code doc contract evidence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/002-cli-claude-code"
    last_updated_at: "2026-06-11T12:45:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase complete: 6 docs conform and smoke passed"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/cli-claude-code/references/cli_reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-002-cli-claude-code"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-cli-claude-code |
| **Completed** | 2026-06-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

cli-claude-code's 6 reference/asset docs now carry exactly the canonical frontmatter contract, making them valid routing signal for the advisor doc harvest. Unlike the 008 pilot (pure normalization of an existing block), this was the campaign's first net-new authoring phase: every doc carried title+description only, so trigger_phrases, importance_tier, and contextType were authored fresh from each doc's actual body.

### Contract authoring

Each doc body was read first and 4-7 trigger phrases were derived from its real sections (flags, permission modes, agent catalog, orchestration patterns, prompt cards/templates). Phrases are executor-prefixed ("claude code ...") so the doc signal stays distinctive against sibling cli-* skills that share generic vocabulary like "prompt templates" and "cli reference". All 6 docs declare `contextType: implementation` (they document invocation mechanics, capabilities, delegation routing, and dispatch-prompt discipline). `cli_reference.md` moved to `important` tier as the formal flag/invocation contract for dispatching the binary; the other 5 descriptive docs stay `normal` so the per-skill doc signal stays dampened.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/cli-claude-code/references/agent_delegation.md` | Modified | Full contract block authored; tier `normal` |
| `.opencode/skills/cli-claude-code/references/claude_tools.md` | Modified | Full contract block authored; tier `normal` |
| `.opencode/skills/cli-claude-code/references/cli_reference.md` | Modified | Full contract block authored; tier `important` |
| `.opencode/skills/cli-claude-code/references/integration_patterns.md` | Modified | Full contract block authored; tier `normal` |
| `.opencode/skills/cli-claude-code/assets/prompt_quality_card.md` | Modified | Full contract block authored; tier `normal` |
| `.opencode/skills/cli-claude-code/assets/prompt_templates.md` | Modified | Full contract block authored; tier `normal` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Frontmatter-only in-place additions below each doc's existing title+description, verified by the contract checker in coverage mode and a Python local-mode advisor smoke that needs no live daemon.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Executor-prefixed trigger phrases | Sibling cli-* skills share generic doc vocabulary ("prompt templates", "cli reference"); prefixing with "claude code" keeps the harvested signal pointing at the right executor. |
| Tier `important` only for `cli_reference.md` | The plan's tier policy reserves `important` for formal dispatch-contract docs; the complete flag/model/permission-mode reference is the binary's invocation contract, while the capability, delegation, pattern, and prompt docs are descriptive. |
| `contextType: implementation` for all 6 docs | Every doc specifies how to invoke or compose dispatches (flags, tools, agents, patterns, prompts) — none are planning or research artifacts. |
| Smoke via Python local mode, not the live daemon | The live daemon adopts the doc-trigger flag only after a session cycle (packet 145 T025); the Python path reads the same files under the same flag and proves routing now. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-skill-doc-frontmatter.sh --skill cli-claude-code --coverage` | PASS — docs=6, carrying-detailed-block=6, violations=0 |
| Python local-mode smoke ("claude code permission modes", flag on) | PASS — cli-claude-code first at 0.95 with `!claude code permission modes(signal)` in the match reason |
| Diff hygiene | PASS — git diff shows only frontmatter addition hunks in the 6 files (51 insertions, 0 deletions) |
| Live daemon `matchedDocs` smoke | DEFERRED — rides packet 145 T025 (session-cycle daemon adoption) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live-daemon verification is campaign-level, not per-phase.** The running advisor daemon predates the launcher allowlist fix, so `matchedDocs` cannot be observed live until every advisor-attached session ends and a fresh session respawns it (tracked as packet 145 T025).
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
